import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {
  Row,
  Button,
  Switch,
  ProgressBar,
  Message,
  Col,
  Tile,
  Modal,
  FormGroup,
  Label,
  FormControl,
  Radio
} from 'tinper-bee';
import { getCookie, lintAppListData} from '../components/util';
import './index.css';
import VerifyInput from '../components/verifyInput/index';
import imgempty from '../assets/img/rping.png';
import DeleteConfirm from './DeleteConfirm';
import AlrmInfo from './AlrmInfo';
import DelRPConfirm from './DelRPConfirm';
import EditRP from './EditRP';
import Title from '../components/Title';
import PageLoading from '../components/loading/index';
import loadinging from '../assets/img/loading.gif';
import {addResAlarm, deleteResAlarm} from '../serves/alarm-center';
import verifyAuth from '../components/authPage/check';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      add: 'block',
      success: 'none',
      successSecond: 5,
      successName: '我的资源池',
      rp: [],
      requireFlag: true,
      id: '',
      userId:'',
      requireEngine: true,
      modalEngine: false,
      showLoading: true,
      selectedValue: '云主机资源池',
      radioType: 1,
      showAlrmModal: false,
      userInfo: "",
      loading:loadinging,
      freeRp: {
        id: '',
        name: '体验资源池',
        default: false,//是否默认
        rq: loadinging,//容器
        Host_count: 0,//主机
        color: '#33ff00',
        colorClassName: 'h',
        trial: true,//是否试用  试用true
        lastTime: ['0', '0'],//剩余小时
        dayTime: ['0', '0', '0'],//剩余天数
        cpuCount: 0,//cpu个数
        memoryUsed: '0',//内存已用
        memoryUnused: '0',//内存未用
        memoryCount: '0',//内存总量
        memoryProgress: '0',//内存使用比例
        diskUsed: '0',//磁盘已用
        diskUnused: '0',//磁盘未用，
        diskCount: '0',//磁盘总量
        diskProgress: '0',//磁盘使用比例
        choseFlagRq: true,//默认通过true来显示load图,
        monitorId: 0 //等于0，无报警，大于0，有报警

      }
    };
  }

  //添加资源池
  addRp = () =>{
    this.setState({
      showModal: true
    });
  }

  close = () => {
    this.setState({
      showModal: false,
      add: 'block',
      success: 'none',
      successSecond: 5,
      successName: '我的资源池',
      requireFlag: true
    });
  }

  handleRidioChange = (value) => {
    this.setState({selectedValue: value});
  }

  onAdd = () =>{
    const self = this;
    let type;
    let name = ReactDOM.findDOMNode(self.refs.name).value;
    if (name) {
      self.setState({
        requireFlag: true
      });
    } else {
      self.setState({
        requireFlag: false
      });
      return;
    }
    let radioState = this.state.selectedValue;
    if (radioState == "云主机资源池") {
      type = 1;
    } else if (radioState == "私有主机资源池") {
      type = 2;
    }
    let param = {
      Name: ReactDOM.findDOMNode(self.refs.name).value,
      ProviderId: getCookie('u_providerid'),
      IsFree: 0,
      Type: type
    };
    //loadShow.call(self);
    //请求保存
    axios.post('/res-pool-manager/v1/resource_pool', param)
      .then(function (res) {

        //loadHide.call(self);
        let data = lintAppListData(res, null, '创建成功');
        if (data && data.error_code) {
          return;
        } else {
          self.setState({
            successName: name,
            add: 'none',
            success: 'block'
          });
          let timer = window.setInterval(() => {
            let s = self.state.successSecond - 1;
            self.setState({
              successSecond: s
            });
            if (s == 0) {
              window.clearInterval(timer);
              self.setState({
                showModal: false,
                add: 'block',
                success: 'none',
                requireFlag: true,
                selectedValue: "云主机资源池"
              });
              self.freshData();
            }
          }, 1000);
        }

      })
      .catch(function (err) {
        //loadHide.call(self);
        return Message.create({content: '请求出错', color: 'danger', duration: null});
      });

  }

  //遍历时间对象
  interatorDate = (date) => {
    let arr = [];
    for (let i = 0; i < date.toString().length; i++) {
      arr.push(date.toString()[i]);
    }
    return arr;
  }

  //权限管理
  power = () => {
    //alert('power');
  }

  //设置默认资源池
  defaultSet = (id) => {
    let self = this;
    //loadShow.call(self);
    axios.get('/res-pool-manager/v1/resource_pool/changestatusall/' + id)
      .then(function (res) {
        //loadHide.call(self);
        lintAppListData(res, null, '设置成功');
        self.freshData();
      }).catch(function (err) {
        //loadHide.call(self);
        console.log(err);
        return Message.create({content: '请求出错', color: 'danger', duration: null});
      })
  }

  //关闭报警通知
  alarmDelete = (resourceId, monitorId, isRpName) => {
    let self = this;
    if (monitorId > 0) {
      deleteResAlarm(resourceId).then((res) => {
        let data = res.data;
        if (data.error_code) {
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }
        if (data) {

          if (isRpName.indexOf("freeRp") != -1) {
            let newObj = self.state.freeRp;
            newObj.monitorId = 0;
            self.setState({
              freeRp: newObj
            });
          } else {
            let newArr = self.state.rp;
            for (var i = 0; i < newArr.length; i++) {
              if (resourceId == newArr[i].id) {
                newArr[i].monitorId = 0;
                self.setState({
                  rp: newArr
                });
              }
            }
          }
          return Message.create({
            content: "关闭报警成功。",
            color: 'success',
            duration: 1.5
          })

        }

      }).catch(function (err) {
        //loadHide.call(self);
        console.log(err);
        return Message.create({content: '请求出错', color: 'danger', duration: null});
      })
    }
  }

  //开启报警通知
  alarmSet = (userId, emailFlag, phoneFlag, resourceId, resourceName, monitorId, isRpName) =>{
    let self = this;
    let param = {
      ResourcePoolId: resourceId,
      ResourcePoolName: resourceName,
      Phone: phoneFlag,
      Email: emailFlag,
      Contacts: userId + "",
      Interval: 300,
      AlarmInterval: 1800,
      Type: 1
    }

    self.postResoueAlrm(param, isRpName);
  }


  postResoueAlrm = (param, isRpName) => {
    let self = this;
    addResAlarm(param).then((res) => {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.message,
          color: 'danger',
          duration: null
        })
      }
      if (data) {
        if (isRpName.indexOf("freeRp") != -1) {
          let newObj = self.state.freeRp;
          newObj.monitorId = 4;
          self.setState({
            freeRp: newObj
          });
        } else {
          let newArr = self.state.rp;
          for (var i = 0; i < newArr.length; i++) {
            if (param.ResourcePoolId == newArr[i].id) {
              newArr[i].monitorId = 4;
              self.setState({
                rp: newArr
              });
            }
          }
        }
        Message.create({
          content: "开启报警成功。",
          color: 'success',
          duration: 1.5
        })


      }
    }).catch(function (err) {
      //loadHide.call(self);
      console.log(err);
      return Message.create({content: '请求出错', color: 'danger', duration: null});
    })

  }

  //主机管理
  host = (name, id, isFree, type) => () => {
      this.context.router.push(`/me/${name}?id=${id}&isFree=${isFree}&type=${type}`);
  }

  host1= (name, resId, userId, isFree, type) => () => {
    this.context.router.push(`/me/${name}?id=${resId}&user_id=${userId}&isFree=${isFree}&type=${type}`);

  }

  /**
   * 格式化秒的方法
   * parm:秒数
   */
  dateFormat = (date) =>{
    let dayTime, dateTime;
    let obj = {};
    let dateHour = Math.floor(date / 3600);
    if (dateHour < 1) {
      obj.dateTime = '01'
    }
    ;
    if (1 <= dateHour && dateHour < 10) {
      obj.dateTime = '0' + dateHour
    }
    ;
    if (10 <= dateHour && dateHour <= 24) {
      obj.dateTime = dateHour;
    }
    if (dateHour > 24) {
      //获取天数
      dayTime = parseInt(dateHour / 24, 10);
      //获取小时数
      dateTime = parseInt(dateHour % 24, 10);
      obj.dateTime = dateTime <= 9 ? "0" + dateTime : dateTime;
      obj.dayTime = dayTime <= 9 ? "0" + dayTime : dayTime;
    }
    return obj;
  }


  freshData = () =>{
    const self = this;
    this.setState({
      successSecond: 5
    });

    axios.get('/res-pool-manager/v1/resource_pool/monitor').then(function (res) {
      let resps = lintAppListData(res);

      /*resps={
       "1": {
       "Host_count": 1,
       "Container_count": 11,
       "total_cpu": 4,
       "left_cpu": 2.75,
       "total_memory": 14863,
       "left_memory": 10745,
       "total_storage": 95540,
       "left_storage": 86324,
       "resourcepool_id": 2,
       "resourcepool_name": "体验名称2",
       "resourcepool_createtime": "2017-04-12T04:40:31Z",
       "time_left": 60497,
       "Isdefault": 1,
       "Isfree": 1
       },
       "2": {
       "Host_count": 0,
       "Container_count": 11,
       "total_cpu": 4,
       "left_cpu": 2.75,
       "total_memory": 14863,
       "left_memory": 10745,
       "total_storage": 95540,
       "left_storage": 86324,
       "resourcepool_id": 2,
       "resourcepool_name": "无主机2",
       "resourcepool_createtime": "2017-04-12T04:40:31Z",
       "time_left": 60497,
       "Isdefault": 1,
       "Isfree": 0
       },
       "3": {
       "Host_count": 1,
       "Container_count": 11,
       "total_cpu": 4,
       "left_cpu": 2.75,
       "total_memory": 14863,
       "left_memory": 10745,
       "total_storage": 95540,
       "left_storage": 86324,
       "resourcepool_id": 3,
       "resourcepool_name": "哈哈哈",
       "resourcepool_createtime": "2017-04-12T04:40:31Z",
       "time_left": 60497,
       "Isdefault": 1,
       "Isfree": 0
       }
       };*/

      if (resps) {
        let ary = [];
        for (let attr in resps) {
          let res = resps[attr];
          let userId = res.UserId;
          let trial = !!res.Isfree;
          let dayTime, timeHour;
          let lastTime = self.dateFormat(res.time_left);
          let memoryUnused = (Number(res.left_memory) / 1024).toFixed(2);
          let memoryCount = (Number(res.total_memory) / 1024).toFixed(2);
          let memoryUsed = (memoryCount - memoryUnused).toFixed(2);
          let diskCount = (Number(res.total_storage) / 1024).toFixed(2);
          let diskUnused = (Number(res.left_storage) / 1024).toFixed(2);
          let diskUsed = (diskCount - diskUnused).toFixed(2);
          let type = res.type;
          let monitorId = res.monitor_id;
          if (lastTime.dayTime) {
            dayTime = self.interatorDate(lastTime.dayTime);
          }
          if (lastTime.dateTime) {
            timeHour = self.interatorDate(lastTime.dateTime);
          }
          let obj = {
            id: attr,
            userId:userId,
            name: res.resourcepool_name,
            default: Number(res.Isdefault) === 1,//是否默认
            Host_count: res.Host_count,//主机
            rq: loadinging,//容器
            color: trial ? '#33ff00' : '#0099ff',
            colorClassName: trial ? 'h' : 'd',
            trial: trial,//是否试用  试用true
            lastTime: timeHour,//剩余时间
            dayTime: dayTime,//剩余天数
            choseFlagRq: true,//默认通过true来显示load图
            cpuCount: res.left_cpu,//cpu个数
            memoryUsed: memoryUsed + 'G',//内存已用
            memoryUnused: memoryUnused + 'G',//内存未用
            memoryCount: memoryCount + 'G',//内存总量
            memoryProgress: (memoryUsed / memoryCount * 100).toFixed(2),//内存使用比例
            diskUsed: diskUsed + 'G',//磁盘已用
            diskUnused: diskUnused + 'G',//磁盘未用，
            diskCount: diskCount + 'G',//磁盘总量
            diskProgress: (diskUsed / diskCount * 100).toFixed(2),//磁盘使用比例
            type: type, //当前资源池属于什么类型
            monitorId: monitorId  //等于0，无报警，大于0，有报警
          };
          if (trial) {
            self.setState({
              freeRp: obj
            });
            self.getRqCount(attr, "true");
          } else {
            ary.push(obj);
            //调用单独的接口，获取每个资源池的的容器个数
            self.getRqCount(attr);
          }

        }
              //if (ary && ary.length) {
        self.setState({
          rp: ary
        });

        //}
      }
      self.setState({
        showLoading: false
      });
    }).catch(function (err) {
      //loadHide.call(self);
      console.log(err);
      self.setState({
        showLoading: false
      });
      return Message.create({content: '请求出错', color: 'danger', duration: null});
    });
  }


  //获取每个资源池的容器个数
  getRqCount = (id, trial) => {
    const self = this;
    //loadShow.call(self);

    axios.get('/res-pool-manager/v1/resource_pool/containerscount/' + id).then(function (res) {
      let resps = lintAppListData(res);
      let rqConunt = resps;//获取容器个数
      let _ary = self.state.rp;
      if (trial == "true") {
        let newObj = self.state.freeRp;
        newObj.rq = rqConunt;
        newObj.choseFlagRq = false;
        self.setState({
          freeRp: newObj
        });
      } else {
        for (var i = 0; i < _ary.length; i++) {
          if (id == _ary[i].id) {
            _ary[i].rq = rqConunt;
            _ary[i].choseFlagRq = false;
          }
        }
        self.setState({
          rp: _ary
        });
      }


    }).catch(function (err) {
      //loadHide.call(self);
      console.log(err);
      self.setState({
        showLoading: false
      });
      return Message.create({content: '请求出错', color: 'danger', duration: null});
    });

  }

  componentDidMount() {
    this.freshData();
  }

  //添加主机
  addService = (id, type, userId) =>{
    return () => {
      this.setState({
        modalEngine: true,
        id: id,
        radioType: type,
        userId:userId,
      })
    };
  }

  createPool = () => {//跳转到申请资源池
    window.parent.location.hash = '#/ifr/%252Ffe%252FcreatePool%252Findex.html';
  }

  closeEngine = () =>{
    this.setState({
      modalEngine: false
    })
  }

  onEngineAdd = (e) => {
    let name = ReactDOM.findDOMNode(this.refs.nameEngine).value;
    let type = this.state.radioType;
    let id = this.state.id;
    let userId = this.state.userId;

    if (name) {
      this.setState({
        requireEngine: true
      });
    } else {
      this.setState({
        requireEngine: false
      });
      return;
    }
    this.context.router.push(`/ape/${name}?id=${id}&type=${type}&userid=${userId}`);
  }

  deleteRP = (id) => {
    let self = this;
    let {rp, freeRp} = this.state;
    var otherId = "", isDefaultFlag = false, isDeleteable = true;
    rp.forEach(function (item, index, ary) {

      if (item.id === id) {
        if (item.Host_count > 0) {
          isDeleteable = false;
          return;
        }
        if (item.default) {
          isDefaultFlag = true;
          if (index !== 0) {
            otherId = ary[index - 1].id;
          } else {
            if (ary.length !== 1) {
              otherId = ary[ary.length - 1].id;
            } else {
              otherId = freeRp.id;
            }
          }
        }
      }
    });
    if (!isDeleteable) {
      return Message.create({content: '请先删除资源池内主机。', color: 'warning', duration: 4.5});
    }

    axios.delete('/res-pool-manager/v1/resource_pool/' + id)
      .then(function (res) {
        lintAppListData(res, null, '删除成功');
        self.freshData();
        if (isDefaultFlag) {
          self.defaultSet(otherId);
        }
      })
      .catch(function (err) {
        console.log(err);
        return Message.create({content: '请求出错', color: 'danger', duration: null});
      })
  }

  closeAlarmModal = () => {
    this.setState({
      showAlrmModal: false
    });
  }

  /**
   * 管理权限
   * @param rec
   */
  managerAuth = (rec) => {
    return (e) => {

      e.stopPropagation();
      verifyAuth('resource_pool', rec, () => {
        this.context.router.push(`/auth/${rec.name}?id=${rec.id}&userId=${rec.UserId || ""}&providerId=${getCookie("u_providerid")}&backUrl=md-service&busiCode=resource_pool`);
      })
    }
  }

  render() {
    let self = this;

    return (
      <Row className="mrp"><span ref="pageloading"> </span>

        <Title name="我的资源池" showBack={false}>
          <Button style={{float: 'right', marginRight: 40, marginTop: 6}} shape="squared"
                  onClick={this.addRp} colors="primary">
            添加资源池
          </Button>
        </Title>

        <div className="content clearfix">

          <Row>

            <Col md={6} xs={12} sm={6}>
              <div className="rp-card margin-bottom-change">
                <Tile>

                  <div className="diamond diamond1">
                    试用
                  </div>
                  <ul>
                    <li className="top clearfix">
                                                    <span className="title text-truncate">
                                                        {this.state.freeRp.name}
                                                    </span>
                      <span className="power">
                                                        <div className="time">
                                                          剩余时间
                                                          {this.state.freeRp.dayTime ? (this.state.freeRp.dayTime[0] ?
                                                            <span>{this.state.freeRp.dayTime[0]}</span> :
                                                            <span className='spanDay'>天</span>) : ""}
                                                          {this.state.freeRp.dayTime ? (this.state.freeRp.dayTime[1] ?
                                                            <span>{this.state.freeRp.dayTime[1]}</span> :
                                                            <span className='spanDay'>天</span>) : ""}
                                                          {this.state.freeRp.dayTime ? (this.state.freeRp.dayTime[2] ?
                                                            <span>{this.state.freeRp.dayTime[2]}</span> : "") : ""}
                                                          {this.state.freeRp.dayTime ? (this.state.freeRp.dayTime[100] ? "" :
                                                            <span className='spanDay'>天</span>) : ""}
                                                          {this.state.freeRp.lastTime[0] ?
                                                            <span>{this.state.freeRp.lastTime[0]}</span> : "小时"}
                                                          {this.state.freeRp.lastTime[1] ?
                                                            <span>{this.state.freeRp.lastTime[1]}</span> : "小时"}
                                                          小时
                                                        </div>
                                                     </span>
                      <span className={classnames({'switch': true, 'no-allowed': !this.state.freeRp.id})}>
                                                        <DeleteConfirm
                                                          disabled={!this.state.freeRp.id}
                                                          fresh={this.freshData}
                                                          checked={this.state.freeRp.default}
                                                          onConfirmDelete={() => {
                                                            self.defaultSet(this.state.freeRp.id)
                                                          }}
                                                          />
                                                    </span>
                      <span className="default">
                                                         默认
                                                    </span>
                    </li>
                    <li className={classnames({
                      'middle': true,
                      'clearfix': true,
                      'hidden': !this.state.freeRp.id
                    })}>
                      <Row>
                        <Col md={4} xs={4} sm={4} className="padding-horizontal-0">
                          <div className="left">
                            <span>容器</span>
                            {this.state.freeRp.choseFlagRq == true ? (
                              <span> <img src={this.state.loading}/></span>) : (
                              <span className="rqColor"> {this.state.freeRp.rq}</span>)}
                          </div>
                        </Col>
                        <Col md={4} xs={4} sm={4}>
                          <div className="left">
                            <span>主机</span>
                            <span className="hostColor">{this.state.freeRp.Host_count}</span>
                          </div>
                        </Col>
                        <Col md={4} xs={4} sm={4}>
                          <div className=" border-right-0 left">
                            <span className="cpu">CPU
                                <a className="cpu-info">余量</a>
                            </span>
                            <span className="cpuColor">{parseFloat(this.state.freeRp.cpuCount).toFixed(2)}</span>
                          </div>
                        </Col>

                      </Row>
                    </li>
                    <li className={classnames({'process': true, 'hidden': !this.state.freeRp.id})}>

                      <Row>
                        <Col md={12} xs={12} sm={12} className="padding-horizontal-0">
                          <div className="proDiv free clearfix">
                            <div className="process-top clearfix margin-vertical-10">
                              <Col md={3} xs={12} sm={5} className="padding-horizontal-0">
                                                                <span className="process-title memory">
                                                                    内存使用情况
                                                                          </span>
                              </Col>
                              <Col md={3} xs={12} sm={5} smOffset={2} mdOffset={6}
                                   className="padding-horizontal-0  margin-top-5-self">
                                                                <span>
                                                                    {this.state.freeRp.memoryUsed}&nbsp;
                                                                  /&nbsp;{this.state.freeRp.memoryCount}
                                                                </span>
                              </Col>

                            </div>
                            <div className="clearfix">
                              <Col md={12} xs={12} sm={12} className="padding-horizontal-0 ">
                                <ProgressBar now={this.state.freeRp.memoryProgress}
                                             colors={this.state.freeRp.colorClassName}/>
                              </Col>
                            </div>

                            <div className="footer clearfix margin-vertical-10">
                              <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                <span>
                                                                    <i className="square"
                                                                       style={{'backgroundColor': this.state.freeRp.color}}>
                                                                    </i>
                                                                    已使用({this.state.freeRp.memoryUsed})
                                                                           </span>
                              </Col>

                              <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                <span>
                                                                    <i className="square"> </i>
                                                                    未使用({this.state.freeRp.memoryUnused})
                                                                          </span>
                              </Col>

                            </div>

                          </div>
                        </Col>
                        <Col md={12} xs={12} sm={12} className="padding-horizontal-0">
                          <div className="proDiv free">
                            <div className="process-top clearfix margin-vertical-10">
                              <Col md={3} xs={12} sm={5} className="padding-horizontal-0">
                                                                <span className="process-title disk">
                                                                    磁盘使用情况
                                                                   </span>
                              </Col>

                              <Col md={3} xs={12} sm={5} smOffset={2} mdOffset={6}
                                   className="padding-horizontal-0  margin-top-5-self">
                                                                <span>
                                                                    {this.state.freeRp.diskUsed}&nbsp;
                                                                  /&nbsp;{this.state.freeRp.diskCount}
                                                                </span>
                              </Col>
                            </div>

                            <div className="clearfix">
                              <Col md={12} xs={12} sm={12} className="padding-horizontal-0 ">
                                <ProgressBar now={this.state.freeRp.diskProgress}
                                             colors={this.state.freeRp.colorClassName}/>
                              </Col>
                            </div>
                            <div className="footer clearfix margin-vertical-10">
                              <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                <span>
                                                                    <i className="square"
                                                                       style={{'backgroundColor': this.state.freeRp.color}}>
                                                                    </i>
                                                                    已使用({this.state.freeRp.diskUsed})
                                                                      </span>
                              </Col>
                              <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                <span>
                                                                    <i className="square"> </i>
                                                                    未使用({this.state.freeRp.diskUnused})
                                                                      </span>
                              </Col>
                            </div>
                          </div>
                        </Col>
                      </Row>


                    </li>
                    <li className={classnames({
                      'no-host': true,
                      'hidden': this.state.freeRp.id
                    })}>
                      <p>
                        您没有体验资源池，如果需要请添加
                      </p>

                      <p><Button onClick={this.createPool}>申请体验资源池</Button></p>
                    </li>
                    <li className="foot">
                      <a shape="border" className="u-button cursor-default">
                                                <span className="switch">
                                                    <AlrmInfo
                                                      fresh={this.freshData}
                                                      checked={this.state.freeRp.monitorId == 0 ? false : true}
                                                      alrmId={this.state.freeRp.monitorId == 0 ? true : false}
                                                      resouceName={this.state.freeRp.name}
                                                      userInfo={this.state.userInfo}
                                                      closeAramInfo={() => {
                                                        self.alarmDelete(this.state.freeRp.id, this.state.freeRp.monitorId, "freeRp")
                                                      }}
                                                      onConfirmDelete={(userId, emailFlag, phoneFlag) => {
                                                        self.alarmSet(userId, emailFlag, phoneFlag, this.state.freeRp.id, this.state.freeRp.name, this.state.freeRp.monitorId, "freeRp")
                                                      }}
                                                      />
                                                </span>
                        <span className="default">
                                                    开启报警
                                                    </span>
                      </a>

                      <Button shape="border" disabled
                              onClick={this.host(this.state.freeRp.name, this.state.freeRp.id, 1,1)}>
                        <i className="cl cl-cloudmachine-o"/>
                        主机管理
                      </Button>

                      <Button shape="border" disabled>
                        <i className="cl cl-addmachine-o"/>
                        添加主机
                      </Button>
                    </li>
                  </ul>

                </Tile>
              </div>
            </Col>
            {
              this.state.rp.map((item, index) => {
                return (
                  <Col md={6} xs={12} sm={6}>
                    <div className="rp-card margin-bottom-change">
                      <Tile>
                                                <span className="handle">
                                                  <i className="cl cl-permission" title="权限管理"
                                                     onClick={this.managerAuth(item)}/>
                                                    <EditRP rpId={item.id} isFree={0} isdefault={item.default ? 1 : 0}
                                                            rpName={item.name} fresh={this.freshData}/>
                                                    <DelRPConfirm onConfirmDelete={() => {
                                                      this.deleteRP(item.id)
                                                    }}/>
                                                </span>
                        <div
                          className={classnames({"diamond":true,"diamond2": true, 'hidden': item.type!==2})}>
                          私有
                        </div>
                        <ul>
                          <li className="top clearfix">
                                                        <span className="title text-truncate">
                                                            {item.name}
                                                        </span>
                            <span className="power">
                                                            <div className={classnames({
                                                              'powerM': true,
                                                              'hidden': item.trial
                                                            })}
                                                                 onClick={this.power}>
                                                              <i className="cl cl-shield-o"> </i>
                                                              <span>权限管理</span>
                                                            </div>
                                                        </span>
                            <span className="switch">
                                                            <DeleteConfirm
                                                              fresh={this.freshData}
                                                              checked={item.default}
                                                              onConfirmDelete={() => {
                                                              self.defaultSet(item.id)
                                                              }}
                                                              />
                              {/*<Switch checked={item.default}  onChangeHandler/>*/}
                                                        </span>
                            <span className="default">
                                                            默认
                                                                 </span>
                          </li>
                          <li className={classnames({
                            'middle': true,
                            'clearfix': true,
                            'hidden': item.Host_count <= 0
                          })}>
                            <Row>
                              <Col md={4} xs={4} sm={4} className="padding-horizontal-0">
                                <div className="left">
                                  <span>容器</span>
                                  {item.choseFlagRq == true ? (
                                    <span> <img src={this.state.loading}/></span>) : (
                                    <span className="rqColor"> {item.rq}</span>)}

                                </div>
                              </Col>
                              <Col md={4} xs={4} sm={4}>
                                <div className="left">
                                  <span>主机</span>
                                  <span className="hostColor">{item.Host_count}</span>
                                </div>
                              </Col>
                              <Col md={4} xs={4} sm={4}>
                                <div className="left border-right-0">
                                  <span className="cpu">CPU
                                      <a className="cpu-info">余量</a>
                                  </span>
                                  <span className="cpuColor">{parseFloat(item.cpuCount).toFixed(2)}</span>
                                </div>
                              </Col>

                            </Row>

                          </li>
                          <li className={classnames({
                            'process': true,
                            'hidden': item.Host_count <= 0
                          })}>
                            <Row>
                              <Col md={12} xs={12} sm={12} className="padding-horizontal-0">
                                <div className="proDiv free clearfix">
                                  <div className="process-top  margin-vertical-10 clearfix">
                                    <Col md={3} xs={12} sm={5} className="padding-horizontal-0">
                                                                            <span className="process-title ">
                                                                                内存使用情况
                                                                                  </span>
                                    </Col>
                                    <Col md={3} xs={12} sm={5} smOffset={2} mdOffset={6}
                                         className="padding-horizontal-0  margin-top-5-self">
                                                                            <span>
                                                                                {item.memoryUsed}&nbsp;
                                                                              /&nbsp;{item.memoryCount}
                                                                            </span>
                                    </Col>

                                  </div>
                                  <div className="clearfix">
                                    <Col md={12} xs={12} sm={12} className="padding-horizontal-0 ">
                                      <ProgressBar now={item.memoryProgress} colors={item.colorClassName}/>
                                    </Col>
                                  </div>

                                  <div className="footer clearfix margin-vertical-10">
                                    <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                            <span>
                                                                                <i className="square use-square"> </i>
                                                                                已使用({item.memoryUsed})
                                                                                   </span>
                                    </Col>

                                    <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                            <span>
                                                                                <i className="square no-square"> </i>
                                                                                未使用({item.memoryUnused})
                                                                                    </span>
                                    </Col>

                                  </div>

                                </div>
                              </Col>
                              <Col md={12} xs={12} sm={12} className="padding-horizontal-0">
                                <div className="proDiv disk">
                                  <div className="process-top clearfix margin-vertical-10">
                                    <Col md={3} xs={12} sm={5} className="padding-horizontal-0">
                                                                            <span className="process-title disk">
                                                                                磁盘使用情况
                                                                                  </span>
                                    </Col>

                                    <Col md={3} xs={12} sm={5} smOffset={2} mdOffset={6}
                                         className="padding-horizontal-0  margin-top-5-self">
                                                                            <span>
                                                                                {item.diskUsed}/{item.diskCount}
                                                                            </span>
                                    </Col>
                                  </div>

                                  <div className="clearfix">
                                    <Col md={12} xs={12} sm={12} className="padding-horizontal-0 ">
                                      <ProgressBar now={item.diskProgress}
                                                   colors={item.colorClassName}/>
                                    </Col>
                                  </div>
                                  <div className="footer clearfix margin-vertical-10">
                                    <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                            <span>
                                                                                <i className="square use-disk-square"> </i>
                                                                                已使用({item.diskUsed})
                                                                                    </span>
                                    </Col>
                                    <Col md={5} xs={12} sm={12} className="padding-horizontal-0">
                                                                            <span>
                                                                                <i className="square no-disk"> </i>
                                                                                未使用({item.diskUnused})
                                                                                     </span>
                                    </Col>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                          </li>
                          <li className={classnames({
                            'no-host': true,
                            'hidden': item.Host_count > 0
                          })}>
                            <p>
                              您还没有主机接入，请立即添加
                            </p>

                            <p><Button onClick={this.addService(item.id, item.type, item.userId)}>添加主机</Button>
                            </p>
                          </li>
                          <li className="foot">
                            <a shape="border" className="u-button cursor-default">
                                                            <span className="switch">
                                                                <AlrmInfo
                                                                  fresh={this.freshData}
                                                                  checked={item.monitorId == 0 ? false : true}
                                                                  alrm={item.monitorId == 0 ? false : true}
                                                                  resouceName={item.name}
                                                                  userInfo={this.state.userInfo}
                                                                  closeAramInfo={() => {
                                                                    self.alarmDelete(item.id, item.monitorId, "rp")
                                                                  }}
                                                                  onConfirmDelete={(userId, emailFlag, phoneFlag) => {
                                                                    self.alarmSet(userId, emailFlag, phoneFlag, item.id, item.name, item.monitorId, "rp")
                                                                  }}
                                                                  />
                                                            </span>
                              <span className="default">
                                                                开启报警
                                                                </span>
                            </a>
                            <Button shape="border"
                                    onClick={this.host1(item.name, item.id, item.userId, 0,item.type)}>
                              <i className="cl cl-cloudmachine-o"> </i>
                              主机管理
                            </Button>

                            <Button shape="border" disabled={item.trial}
                                    onClick={this.addService(item.id, item.type, item.userId)}>
                              <i className="cl cl-addmachine-o"> </i>
                              添加主机
                            </Button>
                          </li>
                        </ul>
                      </Tile>
                    </div>
                  </Col>
                )
              })
            }
            <Col md={6} xs={12} sm={6}>
              <div md={6} className="rp-card margin-bottom-change" onClick={this.addRp}>
                <Tile>
                  <div className="add-rp">
                    <i className="cl cl-add-dashed"/>
                    <span>添加资源池</span>
                  </div>
                </Tile>
              </div>
            </Col>
          </Row>
        </div>
        <Modal show={this.state.showModal} keyboard={false} onHide={this.close} backdrop={'static'}
               className="mrp-add">
          <div className="mrp-add" style={{'display': this.state.add}}>
            <Modal.Header >
              <Modal.Title>添加资源池</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <VerifyInput message="请输入资源池名称" verify={/[\w\W]/} isModal isRequire>
                <FormGroup>
                  <Label>资源池名称：</Label>
                  <FormControl ref="name" placeholder="请输入资源池名称"/>
                </FormGroup>
              </VerifyInput>

              <Radio.RadioGroup
                name="resource"
                selectedValue={this.state.selectedValue}
                onChange={this.handleRidioChange}
                >
                <Radio value="云主机资源池">云主机资源池</Radio>

                <Radio value="私有主机资源池">私有主机资源池</Radio>

              </Radio.RadioGroup>

              <FormGroup className={classnames({'error': true, 'hidden': this.state.requireFlag})}>
                <Label>
                                    <span className="verify-warning show-warning">
                                        <i className="uf uf-exc-t-o"/>
                                        请输入资源池名称
                                </span>
                </Label>
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={this.close} shape="border" style={{marginRight: 50}}>取消</Button>
              <Button onClick={this.onAdd} colors="primary">确认</Button>
            </Modal.Footer>
          </div>
          <div className="mrp-success" style={{'display': this.state.success}}>
            <img src={imgempty} height="120px" width="120px"/>

            <p><span className="tip">资源池创建成功，正在配置中，请您稍等...</span></p>

            <p><span className="into">
                            <span className="second">{this.state.successSecond}</span>秒后刷新
                            </span></p>
          </div>
        </Modal>
        <Modal show={this.state.modalEngine} keyboard={false} onHide={this.closeEngine} backdrop={'static'}
               className="mrp-add">
          <div className="mrp-add">
            <Modal.Header >
              <Modal.Title>添加主机</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Label>主机名称：</Label>
                <FormControl ref="nameEngine" placeholder="请输入主机名称"/>
              </FormGroup>
              <FormGroup className={classnames({'error': true, 'hidden': this.state.requireEngine})}>
                <Label>
                                    <span className="verify-warning show-warning">
                                        <i className="uf uf-exc-t-o"/>
                                        请输入主机名称
                                </span>
                </Label>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeEngine} shape="border" style={{marginRight: 50}}>取消</Button>
              <Button onClick={this.onEngineAdd} colors="primary">确认</Button>
            </Modal.Footer>
          </div>
        </Modal>
        <PageLoading show={this.state.showLoading}/>
      </Row>
    )
  }
}


MainPage.contextTypes = {
  router: PropTypes.object
}

export default MainPage;
