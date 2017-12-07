import React, { Component } from 'react'
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
  Popconfirm
} from 'tinper-bee';
import { findDOMNode } from 'react-dom';
import { assignAuth, searchUsers } from '../../serves/confLimit';
import classnames from 'classnames';
import LoadingTable from '../../components/loading-table';

import './index.css';


class AuthModal extends Component {
  constructor(...args) {
    super(...args);

    this.searchColumns = [
      {
        title: '选择',
        dataIndex: 'userId',
        key: 'userid',
        render: (text, record, index) => {
          let checked = this.state.authorizedUsers.some(item => {
            return item.userId === text;
          })
          return <input
            type="checkbox"
            checked={checked}
            onChange={this.onSearchItemChange(record)}
            onClick={(e) => e.stopPropagation()}
          />
        }
      }, {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '登录账号',
        dataIndex: 'userCode',
        key: 'userCode',
      }, {
        title: '邮箱',
        dataIndex: 'userEmail',
        key: 'userEmail',
      }, {
        title: '手机号',
        dataIndex: 'userMobile',
        key: 'userMobile',
      }];
    this.state = {
      searchInfo: '',
      searchResult: [],
      role: 'user',
      authorizedUsers: [],
      searchPage: 1,
      activePage: 1,
      activeKey: '1',
      showLoading: false
    }
  }
  /**
   * 遍历数组,将要授权的人的id是否已经被授权
   */
  compareAuth = (id) => {
    let { userData } = this.props;
    let flag = true;
    if (userData && userData.length > 0) {
      for (var i = 0; i < userData.length; i++) {
        if (userData[i].userId == id) {
          flag = false;
          return flag;
        }
      }
      return flag;
    } else {
      return flag;
    }
  }

  /**
   * 添加事件
   */
  handleAdd = () => {
    let { data, onEnsure } = this.props;
    let idAry = [], nameAry = [];
    let { authorizedUsers, role } = this.state;
    if (authorizedUsers.length === 0) {
      return Message.create({
        content: '请选择用户',
        color: 'warning',
        duration: 4.5
      })
    }
    authorizedUsers.forEach((item) => {
      idAry.push(item.userId);
      nameAry.push(item.userName)
    })

    //根据，完整的邮箱或者手机号,只能获取唯一选中的用户
    let authFlag = this.compareAuth(authorizedUsers[0].userId);
    if (authFlag) {
      let param = {
        userId: idAry.join(','),
        userName: nameAry.join(','),
        providerId: data.providerId,
        daRole: role,
        resId: data.id,
        busiCode: data.busiCode,
        isGroup: "N",
        createUserId: data.userId
      };

      findDOMNode(this.refs.btn).setAttribute("disabled", "true");//按钮禁用
      //邀请用户
      assignAuth(param).then((res) => {
        findDOMNode(this.refs.btn).removeAttribute("disabled");//移除禁用
        if (!res.data.error_code) {
          Message.create({
            content: '授权成功',
            color: 'success',
            duration: 1.5
          });
          onEnsure && onEnsure();
          this.handleClose();
        } else {
          Message.create({
            content: res.data.error_message,
            color: 'danger',
            duration: null
          });
          this.handleClose();
        }
      })
    } else {
       findDOMNode(this.refs.btn).removeAttribute("disabled");//移除禁用
      return Message.create({
        content: '该用户已经被授权过,请查看',
        color: 'warning',
        duration: 4.5
      })
    }
  }

  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  /**
   * 表格checkbox点选
   * @param record
   * @returns {function(*)}
   */
  onSearchItemChange = (record) => {
    return (e) => {
      e.stopPropagation();
      let { authorizedUsers } = this.state;
      if (e.target.checked) {
        authorizedUsers.push(record);
      } else {
        authorizedUsers = authorizedUsers.filter(item => item.userId !== record.userId)
      }
      this.setState({
        authorizedUsers
      })
    }
  }


  /**
   * 搜索按钮触发
   */
  handleSearch = () => {
    let value = findDOMNode(this.refs.search).value;
    let chineseAry = value.match(/[\u4e00-\u9fa5]/g);
    let byteLen = 0;
    if (chineseAry instanceof Array) {
      byteLen = chineseAry.length * 2 + value.length - chineseAry.length;
    } else {
      byteLen = value.length;
    }

    if (byteLen < 4) {
      return this.setState({
        searchResult: [],
        searchPage: 0
      });
    }
    let param = {
      key: 'invitation',
      val: findDOMNode(this.refs.search).value,
      pageIndex: 1,
      pageSize: 5
    }

    this.setState({
      showLoading: true
    })


    searchUsers(param)
      .then(res => {
        if (res.data.error_code) {
          Message.create({
            content: res.data.error_message,
            color: 'danger',
            duration: null
          });
          this.setState({
            searchResult: [],
            searchPage: 0,
            showLoading: false
          })
        } else {
          let data = res.data.data;
          if (data && data.content instanceof Array) {
            data.content.forEach((item) => {
              item.key = item.userId;
            });
            this.setState({
              searchResult: data.content,
              searchPage: Math.ceil(data.totalElements / 10),
              showLoading: false,
              authorizedUsers: []

            })
          } else {
            this.setState({
              searchResult: [],
              searchPage: 0,
              showLoading: false,
              authorizedUsers: []
            })
          }
        }
      });
  }

  /**
   * 分页点选
   * @param eventKey
   */
  handleSelect = (eventKey) => {
    this.setState({
      activePage: eventKey
    });

    let param = {
      key: 'invitation',
      val: findDOMNode(this.refs.search).value,
      pageIndex: eventKey,
      pageSize: 5
    };
    this.setState({
      showLoading: true
    })

    searchUsers(param)
      .then(res => {
        if (res.data.error_code) {
          Message.create({
            content: res.data.error_message,
            color: 'danger',
            duration: null
          })
          this.setState({
            showLoading: false
          })
        } else {
          let data = res.data.data;
          if (data && data.content instanceof Array) {
            data.content.forEach((item) => {
              item.key = item.userId;
            });
            this.setState({
              searchResult: data.content,
              showLoading: false
            })
          } else {
            this.setState({
              searchResult: [],
              showLoading: false
            })
          }
        }

      });

  }

  /**
   * 权限选择
   * @param value
   */
  handleChange = (value) => {
    return () => {
      this.setState({
        role: value
      })
    }
  }

  /**
   * 模态框关闭事件
   */
  handleClose = () => {
    let { onClose } = this.props;
    this.setState({
      searchResult: [],
      role: 'user',
      searchPage: 1,
      authorizedUsers: [],
      activePage: 1,
      activeKey: '1'
    });
    onClose && onClose();
  }

  /**
   * 表格行点击
   * @param record
   */
  handleRowClick = (record) => {
    let { authorizedUsers } = this.state;
    let findRow = authorizedUsers.some(item => item.userId === record.userId)
    if (!findRow) {
      authorizedUsers.push(record);
    } else {
      authorizedUsers = authorizedUsers.filter(item => item.userId !== record.userId)
    }
    this.setState({
      authorizedUsers
    })
  }


  render() {

    let { show } = this.props;

    return (
      <Modal
        show={show}
        size="lg"
        className="auth-modal"
        onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title>添加新用户</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-search">
            <div className="modal-search-user">
              <InputGroup className="search" simple>
                <FormControl
                  ref="search"
                  placeholder="请输入完整的邮箱或者手机号"
                  onKeyDown={this.handleSearchKeyDown}
                />
                <InputGroup.Button>
                  <i className="cl cl-search" onClick={this.handleSearch} />
                </InputGroup.Button>
              </InputGroup>
            </div>

          </div>
          <div className="role-group">
            <Label style={{ marginRight: 15 }}>授予权限</Label>
            <div
              className={classnames("role-btn", { "active": this.state.role === 'owner' })}
              onClick={this.handleChange('owner')}>
              <span className="role-owner role-margin" />
              管理权限
            </div>
            <div
              className={classnames("role-btn", { "active": this.state.role === 'user' })}
              onClick={this.handleChange('user')}>
              <span className="role-user role-margin" />
              使用权限
            </div>


          </div>
          <div>
            <LoadingTable
              showLoading={this.state.showLoading}
              data={this.state.searchResult}
              onRowClick={this.handleRowClick}
              columns={this.searchColumns}
            />
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
                  onSelect={this.handleSelect} />
              ) : ''
            }
          </div>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            onClick={this.handleClose}
            style={{ margin: "0 20px 40px 0" }}>
            取消
          </Button>
          <Button
            ref="btn"
            onClick={this.handleAdd}
            colors="primary"
            style={{ marginBottom: "40px" }}>
            授权
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default AuthModal;
