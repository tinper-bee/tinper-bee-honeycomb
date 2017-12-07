import React, {Component} from 'react';
import {Table, Button, Icon, Popconfirm, Row, Message, InputGroup, FormControl} from 'tinper-bee';
import Title from '../Title';
import {formateDate} from '../util';
import AuthModal from '../authModal';
import ModifyModal from '../changeAuth';
import {getUsers, deleteAuth} from '../../serves/confLimit';
import {findDOMNode} from 'react-dom';
import AppBtnAuthModal from './app-btn-auth-modal';
import './index.css';

const componentName = {
  confcenter: '应用列表'
};


class AuthPage extends Component {
  constructor(...args) {
    super(...args);
    this.columns = [{
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '1%',
      render: () => {
        return <span className="default-head"/>
      }
    }, {
      title: '用户账号',
      dataIndex: 'userId',
      key: 'userId',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '授权人',
      dataIndex: 'inviterName',
      key: 'inviterName',
      render: (text) => text ? text : ""
    },{
      title: '权限',
      dataIndex: 'daRole',
      key: 'daRole',
      render: (text, record) => {
        return <span><span className={`role-${text}`}/>{ text === 'user' ? '使用权限' : '管理权限' }</span>
      }
    },
      {
        title: '邀请时间',
        dataIndex: 'ts',
        key: 'ts',
        render: (text, record, index) => {
          return formateDate(text)
        }
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: this.renderCellTwo,
      }];

    this.state = {
      userData: [],
      showAddModal: false,
      searchValue: '',
      showModifyModal: false,
      selectedId: '',
      selectedRole: '',
      AppBtnAuthModalShow: false,
      selectedData: {}
    }
  }

  componentWillMount(){
    let {location} = this.props;
    if(location.query.busiCode === 'app_manager'){
      this.columns = [...this.columns.slice(0, 5), {
        title: '详细按钮权限',
        dataIndex: 'providerId',
        key: 'providerId',
        render: (text, record) => {
          return <Button colors="primary" size="sm" onClick={ this.handleEditAppBtnLimit(record) }>查看和设置按钮权限</Button>
        }
      }, ...this.columns.slice(5)]
    }
  }

  componentDidMount() {
    this.getUser();
  }

  /**
   * 设置应用按钮具体权限
   */
  handleEditAppBtnLimit = (record) => () => {
    this.setState({
      selectedData: record,
      AppBtnAuthModalShow: true
    })
  }

  closeAppBtnLimit = () => {
    this.setState({
      AppBtnAuthModalShow: false
    })
  }

  /**
   * 获取用户列表
   */
  getUser = () => {
    let {location} = this.props;

    getUsers(`?resId=${location.query.id}&busiCode=${location.query.busiCode}`).then((res) => {

      if (res.data.flag === 'success') {

        let userData = res.data.data.resources;
        if (userData instanceof Array) {
          userData.forEach((item, index) => {
            item.key = index;
          });

          this.setState({
            userData
          });
        }
      } else {
        Message.create({
          content: res.data.message,
          color: 'danger',
          duration: null
        });
      }
    })


  }

  /**
   * 删除用户
   * @param record 删除用户的信息
   */
  handleDelete = (record) => {
    let {location} = this.props;
    return () => {
      //删除用户
      deleteAuth(`?userId=${record.userId}&resId=${location.query.id}&busiCode=${location.query.busiCode}`).then((res) => {
        if (!res.data.error_code) {
          this.getUser();
          Message.create({
            content: '删除成功',
            color: 'success',
            duration: 1.5
          });
        } else {
          Message.create({
            content: res.data.error_message,
            color: 'danger',
            duration: null
          });
        }
      });
    }

  }

  /**
   * 渲染表格操作列
   * @param text
   * @param record
   * @param index
   * @returns {*}
   */
  renderCellTwo = (text, record, index) => {
    return (
      <span>
                <i className="cl cl-shieldlock" onClick={this.showModifyModal(record)}/>
                <Popconfirm content="确认删除?" placement="bottom" onClose={this.handleDelete(record)}>
                    <Icon type="uf-del"/>
                </Popconfirm>
            </span>

    );
  }

  /**
   * 搜索按钮触发
   */
  handleSearch = () => {
    this.setState({
      searchValue: findDOMNode(this.refs.search).value
    })
  }

  /**
   * 捕获搜索回车时间
   * @param e
   */
  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }


  /**
   * 控制显示添加模态框
   * @param value
   * @returns {function()}
   */
  showAddModal = (value) => {
    return () => {
      this.setState({
        showAddModal: value
      })
    }

  }

  /**
   * 控制显示修改模态框
   * @param record
   * @returns {function()}
   */
  showModifyModal = (record) => {
    return () => {
      this.setState({
        showModifyModal: true,
        selectedId: record.id,
        selectedRole: record.daRole
      })
    }

  }

  /**
   * 隐藏模态
   */
  hideModifyModal = () => {
    this.setState({
      showModifyModal: false,
    })
  }

  render() {
    let {params, location} = this.props;
    let {userData, searchValue} = this.state;

    if (searchValue !== '') {
      let reg = new RegExp(searchValue, 'ig');
      userData = userData.filter((item) => {
        return reg.test(item.userName) || reg.test(item.userId)
      })
    }

    return (
      <Row className="auth-page">
        <Title
          name={params.id}
          backName={ componentName[location.query.busiCode] }
          path={`/fe/${location.query.backUrl}/index.html`}
          isRouter={ false }
        />
        <div className="user-auth">
          <div>
            <Button shape="squared" colors="primary" onClick={this.showAddModal(true)}>
              添加新用户
            </Button>
            <InputGroup className="user-search" simple>
              <FormControl
                ref="search"
                onKeyDown={ this.handleSearchKeyDown }
              />
              <InputGroup.Button>
                <i className="cl cl-search" onClick={ this.handleSearch }/>
              </InputGroup.Button>
            </InputGroup>
          </div>
          <Table
            bordered
            className="user-table"
            data={userData}
            columns={this.columns}
          />
        </div>
        <AuthModal
          show={ this.state.showAddModal }
          onClose={this.showAddModal(false)}
          onEnsure={ this.getUser}
          data={ location.query }
          userData={userData}
        />

        <ModifyModal
          show={ this.state.showModifyModal }
          onClose={ this.hideModifyModal }
          onEnsure={ this.getUser}
          role={ this.state.selectedRole }
          userId={ this.state.selectedId }
        />
        {
          location.query.busiCode === 'app_manager' ? (
            <AppBtnAuthModal
              show = { this.state.AppBtnAuthModalShow }
              busiCode = { location.query.busiCode }
              data = { this.state.selectedData }
              onClose={ this.closeAppBtnLimit }
              appId={ location.query.id }
            />
          ) : null
        }

      </Row>
    )
  }
}

export default AuthPage;
