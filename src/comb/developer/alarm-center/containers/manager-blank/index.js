import {PureComponent} from 'react';
import {Row, Col, Message} from 'tinper-bee';
import classnames from 'classnames';

import {AlarmManager, AddModal, AddService, EditModal} from '../../components';
import {getResAlarm, getAppAlarm, getServiceAlarm, deleteResAlarm,
        deleteAppAlarm, deleteServiceAlarm} from '../../../serves/alarm-center';

import './index.less';

class ManagerBlank extends PureComponent {
  static propTypes = {}
  static defaultProps = {}

  state = {
    resData: [],
    appData: [],
    serviceData: [],
    activeMenu: 'res',
    showAddModal: false,
    showAddService: false,
    showEditModal: false,
    selected: {},
    showLoading: true,
  }

  componentDidMount() {
    this.getRes();
    this.getApp();
    this.getService();
  }

  /**
   * 获取开了报警的资源池
   */
  getRes = () => {
    getResAlarm()
      .then((res) => {
        let data = res.data;
        if (data.error_code) {
          this.setState({
            showLoading: false
          })
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }

        this.setState({
          resData: data,
          showLoading: false
        })
      })
  }

  /**
   * 获取开了报警的app
   */
  getApp = () => {
    getAppAlarm()
      .then((res) => {
        let data = res.data;
        if (data.error_code) {
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }

        this.setState({
          appData: data
        })
      })
  }

  /**
   * 获取开了报警的服务
   */
  getService = () => {
    getServiceAlarm()
      .then((res) => {
        let data = res.data;
        if (data.error_code) {
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }

        this.setState({
          serviceData: data
        })
      })
  }

  /**
   * 切换列表
   * @param value
   * @returns {function()}
   */
  changeList = (value) => {
    return () => {
      this.setState({
        activeMenu: value
      })
    }
  }

  /**
   * 控制模态框显示
   * @param value
   * @returns {function()}
   */
  controlModal = (value) => {
    return () => {
      //debugger;
      if (this.state.activeMenu === 'service') {
        this.setState({
          showAddService: value
        })
      }else {
        this.setState({
          showAddModal: value
        })
      }
    }
  }
  /**
   * 控制模态框显示
   * @param value
   * @returns {function()}
   */
  controlEditModal = (value) => {
    return () => {
      this.setState({
        showEditModal: value
      })
    }
  }


  handleEdit = obj => () => {
    this.setState({
      showEditModal: true,
      selected: obj
    })
  }

  handleDelete = obj => () => {
    let {activeMenu} = this.state;
    if (activeMenu === 'res') {
      deleteResAlarm(obj.ResourcePoolId)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return Message.create({
              content: data.message,
              color: 'danger',
              duration: null
            })
          }
          Message.create({
            content: '删除成功',
            color: 'success',
            duration: 1.5
          })
          this.getRes();
        })
    } else if (activeMenu === 'app'){
      deleteAppAlarm(obj.AppId)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return Message.create({
              content: data.message,
              color: 'danger',
              duration: null
            })
          }
          Message.create({
            content: '删除成功',
            color: 'success',
            duration: 1.5
          })
          this.getApp();
        })
    } else {
      deleteServiceAlarm(obj.Id)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return Message.create({
              content: data.message,
              color: 'danger',
              duration: null
            })
          }
          Message.create({
            content: '删除成功',
            color: 'success',
            duration: 1.5
          })
          this.getService();
        })
    }
  }

  render() {
    let {resData, appData, serviceData, activeMenu, showAddModal, showAddService, showEditModal, selected, showLoading} = this.state;
    let data = [], refresh;
    if (activeMenu === 'res') {
      data = resData;
      refresh = this.getRes;
    } else if (activeMenu === 'app'){
      data = appData;
      refresh = this.getApp;
    } else {
      data = serviceData;
      refresh = this.getService;
    }
    return (
      <div className="manager-blank">
        <ul className="tab-list">
          <li className={ classnames({'active': activeMenu === 'res'})} onClick={ this.changeList('res') }>资源池报警</li>
          <li className={ classnames({'active': activeMenu === 'app'})} onClick={ this.changeList('app') }>应用报警</li>
          <li className={ classnames({'active': activeMenu === 'service'})} onClick={ this.changeList('service') }>服务报警</li>
        </ul>
        <div className="blank-data">

          <AlarmManager
            data={ data }
            onEdit={ this.handleEdit }
            onDelete={ this.handleDelete }
            showLoading={ showLoading }
            activeMenu={ activeMenu }
            showModal={ this.controlModal(true) } />
        </div>

        <AddModal
          activeMenu={ activeMenu }
          show={ showAddModal }
          refresh={ refresh }
          onClose={ this.controlModal(false)}
        />
        <AddService
          activeMenu={ activeMenu }
          show={ showAddService }
          refresh={ refresh }
          onClose={ this.controlModal(false)}
        />
        <EditModal
          activeMenu={ activeMenu }
          show={ showEditModal }
          refresh={ refresh }
          data={ selected }
          onClose={ this.controlEditModal(false)}  />
      </div>
    )
  }
}

export default ManagerBlank;
