import React, {Component} from 'react'
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
import {findDOMNode} from 'react-dom';
import {assignAuth, searchUsers} from '../../../serves/confLimit';
import {GetResPool, GetPublishList} from '../../../serves/appTile';
import {addAppAlarm, addResAlarmGroup, getAppAlarmInfo, getResAlarmInfo } from '../../../serves/alarm-center'
import AddUser from '../add-user';

import classnames from 'classnames';

import './index.less';


class EditModal extends Component {
  constructor(...args) {
    super(...args);


    this.state = {
      searchInfo: '',
      searchResult: [],
      resSelectedList: [],
      appSelectedList: [],
      authorizedUsers: [],
      searchPage: 1,
      activePage: 1,
      activeKey: '1',
      resList: [],
      appList: [],
      step: 1,
      role: ['email']
    }
  }

  componentWillReceiveProps(nextProps) {
    let {show, activeMenu, data} = nextProps;
    if(show){
      if(activeMenu === 'res'){
        getResAlarmInfo(data.ResourcePoolId).then( (res) => {
          let data = res.data;
          if(data.error_code){
            return Message.create({
              content: data.error_message,
              color: 'danger',
              duration: null
            })
          }

          this.setState({
            resSelectedList: [data]
          })
        })
      }else{
        getResAlarmInfo(dataId)
      }
    }


  }

  /**
   * 模态框关闭事件
   */
  handleClose = () => {
    let {onClose} = this.props;
    this.setState({
      searchInfo: '',
      searchResult: [],
      authorizedUsers: [],
      searchPage: 1,
      activePage: 1,
      activeKey: '1',
      resList: [],
      appList: [],
      step: 1,
      role: ['email']
    });
    onClose && onClose();
  }

  /**
   * 表格checkbox点选
   * @param record
   * @returns {function(*)}
   */
  handleChoiseUser = (record) => {
    return (e) => {
      let {authorizedUsers} = this.state;
      if (e.target.checked) {
        authorizedUsers.push(record);
      } else {
        authorizedUsers = authorizedUsers.filter(item => {
          item.Id !== record.Id
        })
      }
      this.setState({
        authorizedUsers
      })
    }
  }

  /**
   * 修改通知方式
   */
  handleChangeType = value => () => {
    let {role} = this.state;
    let index = role.indexOf(value);
    if (index > -1) {
      role.splice(index, 1);
    } else {
      role.push(value);
    }
    if (role.length === 0) {
      role = ['email'];
      Message.create({
        content: '请至少选择一项通知方式',
        color: 'warning',
        duration: 4.5
      });
    }
    this.setState({
      role: role
    })
  }

  /**
   * 删除选中的人
   * @param id
   */
  deleteSelectUser = id => () => {
    let {authorizedUsers} = this.state;
    authorizedUsers = authorizedUsers.filter((item) => {
      return item.Id !== id;
    })
    this.setState({
      authorizedUsers
    })
  }


  /**
   * 添加报警
   */
  addAlarm = () => {
    let {activeMenu, refresh} = this.props;
    let {resSelectedList, appSelectedList, authorizedUsers} = this.state;
    let paramData = [], users = [];
    authorizedUsers.forEach((item) => {
      users.push(item.Id);
    });
    users = users.join(',');

    if (activeMenu === 'res') {
      resSelectedList.forEach((item, index) => {
        paramData.push({
          ResourcePoolId: item.id,
          ResourcePoolName: item.resourcepool_name,
          Contacts: users,
          Interval: 30,
          AlarmInterval: 300,
          Type: 1
        })
      });

      addResAlarmGroup(paramData).then((res) => {
        let data = res.data;
        if (data.error_code) {
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          });
        }
        Message.create({
          content: '开启报警成功',
          color: 'success',
          duration: null
        })

        refresh && refresh();

      })
    } else {
      appSelectedList.forEach((item, index) => {
        paramData.push({
          AppId: item.app_id,
          Marathonld: '/isv-apps/35568e76-1ef1-4d77-b5cf-8fb66d2c8002/j30hrksi',
          AppName: item.app_name,
          Contacts: users,
          Interval: 30,
          AlarmInterval: 300,
          Type: 1
        })
      });
      addAppAlarm(paramData).then((res) => {
        let data = res.data;
        if (data.error_code) {
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          });
        }
        Message.create({
          content: '开启报警成功',
          color: 'success',
          duration: null
        })

        refresh && refresh();

      })
    }

    this.handleClose();

  }


  render() {

    let {show, activeMenu} = this.props;
    let name = activeMenu === 'res' ? '资源池' : '应用';

    return (
      <Modal
        show={ show }
        size="lg"
        className="alarm-add-modal"
        onHide={ this.handleClose }>
        <Modal.Header>
          <Modal.Title>
            {
              `修改监控${name}`
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUser
            user={ this.state.authorizedUsers }
            role={ this.state.role }
            onDelete={ this.deleteSelectUser }
            onchangeType={ this.handleChangeType }
            onChiose={ this.handleChoiseUser }
          />
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            onClick={this.handleClose}
            shape="squared"
            style={{margin: "0 20px 40px 0"}}>
            取消
          </Button>

          <Button
            onClick={this.addAlarm}
            colors="primary"
            shape="squared"
            style={{marginBottom: 40}}>
            开启报警
          </Button>

        </Modal.Footer>
      </Modal>
    )
  }
}

export default EditModal;
