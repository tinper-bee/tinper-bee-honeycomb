import React, {Component} from 'react';
import {
  Modal,
  Button,
  Table,
  Message,
  FormControl,
  Label,
  Col,
  Pagination,
  InputGroup,
  Icon,
  Row,
  Popconfirm
} from 'tinper-bee';
import {findDOMNode} from 'react-dom';
import classnames from 'classnames';

import LoadingTable from '../../../components/loading-table';
import { getCookie } from '../../../components/util';
import { success, err } from '../../../components/message-util'
import {assignAuth, searchUsers} from '../../../serves/confLimit';
import { getUser } from '../../../serves/alarm-center';


import './index.less';


class AddUser extends Component {
  constructor(...args) {
    super(...args);

    this.searchColumns = [
      {
        title: '选择',
        dataIndex: 'Id',
        key: 'Id',
        render: (text, record, index) => {
          let checked = this.props.user.some(item => {
            return item.Id === text;
          })
          return <input
            type="checkbox"
            checked={checked}
            onChange={this.props.onChiose(record)} />
        }
      }, {
        title: '用户名',
        dataIndex: 'Username',
        key: 'Username',
      }, {
        title: '邮箱',
        dataIndex: 'Email',
        key: 'Email',
      }, {
        title: '手机号',
        dataIndex: 'PhoneNum',
        key: 'PhoneNum',
      }];
    this.state = {
      searchInfo: '',
      searchResult: [],
      searchPage: 1,
      activePage: 1,
      userList: [],
      searchValue: '',
      showLoading: true
    }
  }

  componentDidMount(){
    this.getProviderUsers();
  }

  getProviderUsers = (page = 1) => {
    getUser(`/page?limit=5&offset=${page}`).then((res) => {

      let data = res.data;
      if(data.error_code){
        this.setState({
          showLoading: false
        });
        return err(data.error_message);
      }
      if(!data.data) data.data = [];
      this.setState({
        userList: data.data,
        searchPage: Math.ceil(data.size/5),
        showLoading: false
      })
    })
  }

  /**
   * 回车触发搜索
   * @param e
   */
  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  /**
   * 搜索按钮触发
   */
  handleSearch = () => {
    let { searchValue } = this.state;
    this.setState({
      showLoading: true
    });
    if(searchValue === ''){
      return this.getProviderUsers();
    }

    getUser(`/${searchValue}`).then((res) => {
      let data = res.data;
      if(!data){
        return this.setState({
          userList: [],
          showLoading: false
        })
      }
      if(data && data.error_code){
        this.setState({
          showLoading: false
        })
        return err(data.error_message);
      }

      this.setState({
        userList: [data],
        showLoading: false
      })
    })

  }

  handleInputChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  /**
   * 分页点选
   * @param eventKey
   */
  handleSelect = (eventKey) => {
    this.setState({
      activePage: eventKey
    });

    this.getProviderUsers(eventKey);
  }

  clear = () => {
    this.getProviderUsers();
    this.setState({
      searchValue: ""
    })
  }

  render() {
    let { role, onchangeType, user, onDelete } = this.props;
    let { userList } = this.state;

    return (
      <div className="alarm-add-user">
        <Col md={12} className="role-group">
          <Row>
            <Col md={2}>
              <Label>通知方式</Label>
            </Col>
            <Col md={9}>
              <div
                className={classnames("role-btn", {"active": role.indexOf('email') > -1})}
                onClick={onchangeType('email')}>
                <Icon type="uf-mail-o"/>
                邮件通知
              </div>
              <div
                className={classnames("role-btn", {"active": role.indexOf('mobile') > -1})}
                onClick={onchangeType('mobile')}>
                <Icon type="uf-mobile"/>
                短信通知
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Row>
            <Col md={2}>
              <Label>通知人员</Label>
            </Col>
            <Col md={9}>
              <ul className="selected-user">
                {
                  user.map((item) => {
                    return (
                      <li key={ item.Id }>
                        { item.Username }
                        <Icon onClick={ onDelete(item.Id)} type="uf-close-c"/>
                      </li>
                    )
                  })
                }
              </ul>
            </Col>
          </Row>
        </Col>

        <Col md={12}>
          <Row>
            <Col md={2}>
              <Label>搜索人员</Label>
            </Col>
            <Col md={9}>
              <InputGroup className="alarm-add-user-search" simple>
                <FormControl
                  placeholder="请输入当前租户ID下的用户名"
                  value={ this.state.searchValue }
                  onChange={ this.handleInputChange }
                  onKeyDown={ this.handleSearchKeyDown }
                />
                <InputGroup.Button>
                  {
                    this.state.searchValue !== "" ? (
                      <Icon type="uf-close-c" className="clear" onClick={ this.clear } />
                    ) : null
                  }
                  <i className="cl cl-search" onClick={ this.handleSearch }/>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
        </Col>

        <Col md={11}>
          <LoadingTable className="alarm-add-user-table" data={userList} columns={this.searchColumns} showLoading={ this.state.showLoading} />
          {
            this.state.searchPage > 1 ? (
              <Pagination
                first
                last
                prev
                next
                items={this.state.searchPage}
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.handleSelect}/>
            ) : ''
          }
        </Col>
      </div>
    )
  }
}

export default AddUser;

