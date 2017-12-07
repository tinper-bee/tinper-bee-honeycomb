import React, {Component} from 'react'
import ReactDOM from 'react-dom';
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
import AddMoniType from '../add-monitype';
import AddUser from '../add-user';
import LoadingTable from '../../../components/loading-table';

import {GetResPool} from '../../../serves/appTile';
import {addResAlarmGroup, addAppAlarmGroup, getApps, isResMonitor} from '../../../serves/alarm-center'
import {formateDate} from '../../../components/util';

import './index.less';


class AddModal extends Component {
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
      role: ['email'],
      showLoading: true,
      monitype: ['host_state'],
      cpu: 0.8,
      mem: 0.8,
      disk: 0.8
    }
  }
//资源池列表
  resColumns = [
    {
      title: '选择',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        let checked = this.state.resSelectedList.some(item => {
          return item.id === text;
        })
        return <input
          type="checkbox"
          checked={checked}
          onChange={this.onSearchItemChange(record)} />
      }
    }, {
      title: '资源池名称',
      dataIndex: 'resourcepool_name',
      key: 'resourcepool_name',
      render: (text, record, index) => {
        return text;
      }
    }, {
      title: '是否已监控',
      dataIndex: 'ismonitor',
      key: 'ismonitor',
      render:(text)=>{
        return (text)?(
            <span> 是</span>
        ):(
            <span> 否</span>
        )
      }
    }, {
      title: '参数',
      dataIndex: 'total_cpu',
      key: 'total_cpu',

      render: (text, rec) => {
        let memory = rec.total_memory / 1024;
        let disk = rec.total_storage /1024;
        return (
          <span>{`cpu: ${rec.total_cpu}/mem: ${memory.toFixed(2)}GB/disk: ${disk.toFixed(2)}GB`}</span>
        )
      }
    }, {
      title: '主机',
      dataIndex: 'Host_count',
      key: 'Host_count',//直接返回的就是要显示的值，不需要render渲染替换
    },
    {
      title: '创建时间',
      dataIndex: 'resourcepool_createtime',
      key: 'resourcepool_createtime',
      render: (text) => {
        return formateDate(text);
      }
    }];

    //应用列表
  appColumns = [
    {
      title: '选择',
      dataIndex: 'app_id',
      key: 'app_id',
      render: (text, record, index) => {
        let checked = this.state.appSelectedList.some(item => {
          return item.app_id === text;
        })
        return <input
          type="checkbox"
          checked={checked}
          onChange={this.onSearchItemChange(record)} />
      }
    }, {
      title: '应用名称',
      dataIndex: 'app_name',
      key: 'app_name'
    },  {
      title: '是否已监控',
      dataIndex: 'ismonitor',
      key: 'ismonitor',
      render:(text)=>{
        return (text)?(
            <span> 是</span>
        ):(
            <span> 否</span>
        )
      }
    },{
      title: '所在分组',
      dataIndex: 'group',
      key: 'group'
    }];

  componentWillReceiveProps(nextProps) {
    let {show, activeMenu} = nextProps;
    let {resList, appList} = this.state;
    if (show) {
      if (activeMenu === 'res' ) {
        GetResPool((res) => {
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
          for (let key in data) {
            data[key].id = key;
            data[key].ismonitor = false;
            isResMonitor(data[key].resourcepool_id, 'pool').then((res)=>{
              data[key].ismonitor = res.data;
              resList.push(data[key]);
              this.setState({
                resList,
              })
            })
          }
          this.setState({
            resList,
            showLoading: false
          })
        })
      } else if (activeMenu === 'app') {
        getApps().then((res) => {
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
          };
          for(let key in data){
            isResMonitor(data[key].app_id, 'app').then((res)=>{
              data[key].ismonitor = res.data;
              appList.push(data[key]);
              this.setState({
                appList,
              })
            })
          }
          this.setState({
            appList,
            showLoading: false
          })
        })
      }
    }
  }

  /**
   * 回车触发搜索
   * @param e
   */
  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  };

  /**
   * 表格checkbox点选
   * @param record
   * @returns {function(*)}
   */
  onSearchItemChange = (record) => {
    return (e) => {
      let {activeMenu} = this.props;
      let {resSelectedList, appSelectedList} = this.state;

      if (activeMenu === 'res') {
        if (e.target.checked) {
          resSelectedList.push(record);
        } else {
          resSelectedList = resSelectedList.filter(item =>
            item.id !== record.id
          )
        }
        this.setState({
          resSelectedList
        })
      } else {
        if (e.target.checked) {
          appSelectedList.push(record);
        } else {
          appSelectedList = appSelectedList.filter(item =>
            item.app_id !== record.app_id
          )
        }
        this.setState({
          appSelectedList
        })
      }

    }
  }


  /**
   * 搜索按钮触发
   */
  handleSearch = () => {
    let value = findDOMNode(this.refs.search).value;
    this.setState({
      searchValue: value
    })

  }

  /**
   * 分页点选
   * @param eventKey
   */
  //handleSelect = (eventKey) => {
  //  this.setState({
  //    activePage: eventKey
  //  });
  //
  //  let param = {
  //    key: 'invitation',
  //    val: findDOMNode(this.refs.search).value,
  //    pageIndex: eventKey,
  //    pageSize: 5
  //  };
  //}


    // searchUsers(param)
    //   .then(res => {
    //     if (res.data.error_code) {
    //       Message.create({
    //         content: res.data.error_message,
    //         color: 'danger',
    //         duration: null
    //       })
    //     } else {
    //       let data = res.data.data;
    //       if (data && data.content instanceof Array) {
    //         data.content.forEach((item) => {
    //           item.key = item.userId;
    //         });
    //         this.setState({
    //           searchResult: data.content
    //         })
    //       } else {
    //         this.setState({
    //           searchResult: []
    //         })
    //       }
    //     }
    //
    //   });

  handleSelect = (state) => (value) => {

    this.setState({
      [state]: value
    });
  }
  handleInputChange = (state) => (e) => {
    let str = e.target.value;
    let num = str.replace("%","");
    num= num/100;
   // console.log(str);
    this.setState({
      [state]: num

    });
  }


  /**
   * 切换上一步和下一步
   * @param step
   */
  // changeStep = step => () => {
  //   let {activeMenu} = this.props;
  //   let {resSelectedList, appSelectedList} = this.state;
  //   if (step === 2) {
  //     if (activeMenu === 'res') {
  //       if (resSelectedList.length === 0)
  //         return Message.create({
  //           content: '请选择要添加预警的资源池。',
  //           color: 'warning',
  //           duration: 4.5
  //         })
  //     } else {
  //       if (appSelectedList.length === 0)
  //         return Message.create({
  //           content: '请选择要添加预警的应用。',
  //           color: 'warning',
  //           duration: 4.5
  //         })
  //     }
  //   }
  //   this.setState({
  //     step: step
  //   })
  // }
   changeStep = step => () => {
    let {activeMenu} = this.props;
    let {resSelectedList, appSelectedList} = this.state;
    if (step === 3 && activeMenu === 'res') {
        if (resSelectedList.length === 0)
          return Message.create({
            content: '请选择要添加预警的资源池。',
            color: 'warning',
            duration: 4.5
          })
      }
    if (step === 2 && activeMenu === 'app'){
        if (appSelectedList.length === 0)
          return Message.create({
            content: '请选择要添加预警的应用。',
            color: 'warning',
            duration: 4.5
          })
      }
    this.setState({
      step: step
    })
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
        authorizedUsers = authorizedUsers.filter(item =>
          item.Id !== record.Id
        )
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
  *选择监控类型
  */
  changeMoniType = value => () =>{
    let { monitype } = this.state;
    let index = monitype.indexOf(value);
    if (index > -1) {
      monitype.splice(index,1);//删除该位置上的值
    }else{
      monitype.push(value);
    }
    //if(monitype.length === 0){
    //  monitype = ['host_state'];
    //  Message.create({
    //    content: "请至少选择一种监控类型",
    //    color: 'warning',
    //    duration: 4.5
    //  });
    //}
    this.setState({
      monitype: monitype
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
      step: 1,
      resSelectedList: [],
      appSelectedList: [],
      resList:[],
      appList:[],
      role: ['email'],
      monitype: ['host_state'],
      cpu: 0.8,
      mem: 0.8,
      disk: 0.8
    });
    onClose && onClose();
  }
  /**
   * 添加报警
   */
  addAlarm = () => {
    let {activeMenu, refresh} = this.props;
    let {resSelectedList, appSelectedList, authorizedUsers, role, cpu, mem, disk} = this.state;
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
          Interval: 300,
          AlarmInterval: 1800,
          Type: 1,
          Phone: role.indexOf('mobile') > -1,
          Email: role.indexOf('email') > -1,
          Policies: this.state.monitype.indexOf('host_perform')> -1 ?(`{ "cpu" :${cpu},"memory" :${mem},"storage" :${disk} }`)
            :('')
        })
      });

      addResAlarmGroup(paramData)
        .then((res) => {
          console.log(res);
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
          AppId: item.app_id.toString(),
          MarathonId: item.marathon_id,
          AppName: item.app_name,
          Contacts: users,
          Interval: 300,
          AlarmInterval: 1800,
          Type: 1,
          Phone: role.indexOf('mobile') > -1,
          Email: role.indexOf('email') > -1
        })
      });

      addAppAlarmGroup(paramData).then((res) => {
        console.log(res);
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

    let {resList, searchValue, appList} = this.state;

    let list = activeMenu === 'res' ? resList : appList;
    let name = activeMenu === 'res' ? '资源池' : '应用';
    let columns = activeMenu === 'res' ? this.resColumns : this.appColumns;
    let key = activeMenu === 'res' ? 'resourcepool_name' : 'app_name';
    //过滤
    if (searchValue !== '') {
      let regExp = new RegExp(searchValue, 'ig');
      list = list.filter((item) => {
        return regExp.test(item[key])
      })
    }
    return (
      <Modal
        show={ show }
        size="lg"
        className="alarm-add-modal"
        onHide={ this.handleClose }>
        <Modal.Header>
          <Modal.Title>
            {
              `添加监控${name}`
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

           {
            this.state.step === 1 ? (
              <div>
                <div className="modal-search">
                  <div className="modal-search-user">
                    <InputGroup className="search" simple>
                      <FormControl
                        ref="search"
                        placeholder={`请输入${name}名称`}
                        onKeyDown={ this.handleSearchKeyDown }  />
                      <InputGroup.Button>
                        <i className="cl cl-search" onClick={ this.handleSearch }/>
                      </InputGroup.Button>
                    </InputGroup>
                  </div>
                </div>

                <div>
                  <LoadingTable data={list} columns={columns} showLoading={ this.state.showLoading }/>
                </div>
              </div>
            ) : ''
          }
          {
              activeMenu === 'app' && this.state.step === 2 ? (
              <AddUser
                user={ this.state.authorizedUsers }
                role={ this.state.role }
                onDelete={ this.deleteSelectUser }
                onchangeType={ this.handleChangeType }
                onChiose={ this.handleChoiseUser } />
            ) : ''
          }
           {
            activeMenu === 'res' && this.state.step === 2 ? (
              <AddMoniType
                cpu = {this.state.cpu}
                mem = {this.state.mem}
                disk = {this.state.disk}
                monitype ={this.state.monitype}
                onchangeType={this.changeMoniType}
                handleSelect={this.handleSelect}
                handleInputChange={this.handleInputChange}
                />
              ) : ''
          }
          {
             activeMenu === 'res' && this.state.step === 3 ? (
              <AddUser
                user={ this.state.authorizedUsers }
                role={ this.state.role }
                onDelete={ this.deleteSelectUser }
                onchangeType={ this.handleChangeType }
                onChiose={ this.handleChoiseUser }/>
            ) : ''
          }
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            onClick={this.handleClose}
            shape="squared"
            style={{margin: "0 20px 40px 0"}}>
            取消
          </Button>
          {
            this.state.step === 1 ? (
              <Button
                onClick={this.changeStep(2)}
                colors="primary"
                shape="squared"
                style={{marginBottom: 40}}>
                下一步
              </Button>
            ) : ''
          }
          {
            ( this.state.step === 2 && activeMenu === "app" ) ? (
              <div style={{display: 'inline-block'}}>
                <Button
                  onClick={this.changeStep(1)}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40, marginRight: 20}}>
                  上一步
                </Button>
                <Button
                  onClick={this.addAlarm}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40}}>
                  开启报警
                </Button>
              </div>
            ) : ''
          }

          {
            ( this.state.step === 3 && activeMenu === "res" ) ? (
              <div style={{display: 'inline-block'}}>
                <Button
                  onClick={this.changeStep(2)}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40, marginRight: 20}}>
                  上一步
                </Button>
                <Button
                  onClick={this.addAlarm}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40}}>
                  开启报警
                </Button>
              </div>
            ) : ''
          }
          {
            this.state.step === 2 && activeMenu === "res" ? (
              <div style={{display: 'inline-block'}}>
               <Button
                  onClick={this.changeStep(1)}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40, marginRight: 20}}>
                  上一步
                </Button>
              <Button
                onClick={this.changeStep(3)}
                colors="primary"
                shape="squared"
                style={{marginBottom: 40}}>
                下一步
              </Button>
              </div>
              ) : ''
          }
        </Modal.Footer>
      </Modal>
    )
  }
}

export default AddModal;
