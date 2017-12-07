import React, {Component, PropTypes} from 'react';
import {
  Row,
  Col,
  Form,
  Breadcrumb,
  FormGroup,
  Icon,
  FormControl,
  Label,
  Modal,
  Button,
  Tabs,
  TabPanel,
  Select,
  InputGroup,
  Radio,
  Table,
  Popconfirm,
  Message,
  InputNumber
} from 'tinper-bee';
import {
  Public,
  GetHost,
  GetResPool,
  GetResPoolInfo
} from 'serves/appTile';


import {
  GetConfigEnvFromCenter,
  GetConfigVersionByCode,
  GetConfigFileFromCenterByCode,
} from 'serves/confCenter';


import {
  getMesosVersion,
  createProd,
  deployApp,
  privatePublishApp
} from 'serves/CI';

import {guid, formateDate, clone, lintAppListData} from '../util';
import {onlyNumber} from '../../lib/verification'
import Slider, {Handle} from 'rc-slider';
import Tooltip from 'rc-tooltip';
import Checkbox from 'rc-checkbox'
import 'rc-slider/assets/index.css';
import VerifyInput from '../verifyInput/index';
import ErrorModal from '../ErrorModal';

import {err, warn, success} from '../message-util';

import './index.css';
import 'rc-checkbox/assets/index.css';
import 'rc-tooltip/assets/bootstrap_white.css';

const Option = Select.Option;

function renderTooltip(data) {
  if (data instanceof Array && data.length !== 0) {
    return (
      <ul>
        {
          data.map(function (item, index) {
            return (
              <li key={ index }>
                <div>{ item.Hostname }</div>
                <span style={{
                  display: 'inline-block',
                  color: '#0084ff',
                  margin: 5
                }}>cpu:</span><span>{ item.CpuLeft }</span>
                <span style={{
                  display: 'inline-block',
                  color: '#0084ff',
                  margin: 5
                }}>mem:</span><span>{ item.MemoryLeft }</span>
                <span style={{
                  display: 'inline-block',
                  color: '#0084ff',
                  margin: 5
                }}>disk:</span><span>{ item.DiskLeft }</span>
              </li>
            )
          })
        }
      </ul>
    )
  } else {
    return (
      <span>不可用</span>
    )
  }

}

let loop = function () {

};

const propTypes = {
  //传入绑定的数据
  data: PropTypes.required,
  //提交成功的处理函数
  onSubmit: PropTypes.func,
};

const defaultProps = {
  data: {},
  onSubmit: loop,
  configData: {}
};

let portObj = {
  "containerPort": 8080,
  "hostPort": 0,
  "servicePort": null,
  "protocol": "tcp",
  "access_mode": "TCP",
  "access_range": "OUTER",
};


class PublishForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app_name: '',
      domain_name: '',
      app_id: '',
      groupName: '',
      cpus: 0.1,
      mem: 256,
      disk: 1024,
      instances: 1,
      cpuLeft: 0,
      diskLeft: 0,
      memLeft: 0,
      portMappings: [{
        "containerPort": 8080,
        "hostPort": 0,
        "servicePort": null,
        "protocol": "tcp",
        "access_mode": "TCP",
        "access_range": "OUTER",
      }
      ],
      resPool: [],
      resChecked: [],
      showModal: false,
      versionList: [],
      envList: [],
      confVersion: '',
      confEnv: '1',
      useConfig: false,
      resPoolInfo: [],
      env: '1',
      fakeId: 0,
      app_type: 1,
      isPrivateRes: false,
      isK8s: false
    };
    this.file = [];
    this.publishFlag = false;

  }

  componentDidMount() {
    let self = this, resPoolInfo;

    GetResPoolInfo(function (res) {
      let data = lintAppListData(res);
      resPoolInfo = data;
      self.setState({
        resPoolInfo: data
      });

      GetResPool(function (res) {
        let data = lintAppListData(res);
        let array = [], checkedAry = [];

        for (let key in data) {
          array.push(data[key]);
          if (data[key].Isdefault === 1) {
            checkedAry.push(data[key].resourcepool_id);
            self.setResLeft(checkedAry, resPoolInfo);
          }
        }
        if (data.length === 0) {
          self.setState({
            showModal: true
          })
        } else {
          self.setState({
            resPool: array,
            resChecked: checkedAry
          })
        }
      });

    });


  }

  componentWillReceiveProps(nextProps) {
    let {data, configData, isRegistry} = nextProps;
    const self = this;
    let {portMappings, resPool, resPoolInfo} = this.state;
    portMappings[0].containerPort = data.exposePort ? data.exposePort : 8080;

    let fakeList = data.fakeAppId ? data.fakeAppId.split(',') : [];
    if (fakeList.length !== 0) {
      this.setState({
        fakeId: fakeList[0]
      })
    }

    if (data.appType === 'dubbo') {

      portMappings.push({
        "containerPort": 8080,
        "hostPort": 0,
        "servicePort": null,
        "protocol": "tcp",
        "access_mode": "HTTP",
        "access_range": "OUTER",
      });
      portMappings[0].access_mode = 'NA';
      portMappings[0].access_range = 'OUTER';
    }
    if (data.hasOwnProperty("appName")) {
      this.setState({
        app_name: data.appName,
        portMappings: portMappings
      });
      if (data.appType === 'j2ee' || data.appType === 'j2se' || data.appType === 'dubbo') {

        //获取环境列表
        GetConfigEnvFromCenter().then((res) => {
          if (res.data.error_code) {
            err(res.data.error_message)
          } else {
            this.setState({
              envList: res.data.page.result,
              confEnv: res.data.page.result[0].value,
            })
          }

        });

        this.getVersion(1, data.appCode);

      }

    }
    if (isRegistry) {
      if (configData) {
        if (configData.expose_port) {
          portMappings[0].containerPort = configData.expose_port ? configData.expose_port : 8080;
          this.setState({
            cpus: configData.cpu,
            mem: configData.memory,
            disk: configData.disk,
            portMappings: portMappings
          })
        }
      }
    } else {
      if (configData.hasOwnProperty('app_name')) {
        let port = configData.port_settings, base = configData.basic_setting;
        if (port instanceof Array && port.length !== 0) {
          portMappings[0] = {
            "containerPort": port[0].port,
            "hostPort": 0,
            "servicePort": null,
            "protocol": port[0].protocol,
            "access_mode": port[0].access_mode,
            "access_range": port[0].access_range,
          };
          if (data.appType === 'dubbo') {

            portMappings[0].access_mode = 'NA';
            portMappings[0].access_range = 'OUTER';
          }
        }
        resPool.forEach(
          (item) => {
            if (item.resourcepool_id === configData.source_pool_id && item.Host_count !== 0) {
              item.Isdefault = 1;
              this.setState({
                resChecked: [configData.source_pool_id]
              });
              this.setResLeft([configData.source_pool_id], resPoolInfo);
            }
          }
        )
        this.setState({
          resPool
        });


        if (configData.hasOwnProperty('basic_setting')) {
          this.setState({
            cpus: base.cpu,
            mem: base.memory,
            disk: base.disk,
            instances: base.instances,
          })
        }

        this.setState({
          app_name: configData.app_name,
          portMappings: portMappings
        })
      }
    }

  }

  getVersion = (env, appCode) => {

    //获取配置版本
    GetConfigVersionByCode(`?appCode=${ appCode }&envId=${env}&needDefine=false`)
      .then((res) => {
        if (res.data.error_code) {
          err(res.data.error_message);
        } else {
          let version = res.data.page.result.length !== 0 ? res.data.page.result[0].name : '';
          this.setState({
            versionList: res.data.page.result,
            confVersion: version
          });

          this.getFile(env, version);
        }

      });
  }

  /**
   * 选择配置环境
   */
  changeEnv = (value) => {
    let {data} = this.props;
    this.setState({
      confEnv: value
    });
    this.getVersion(value, data.appCode);
  }

  /**
   * 获取配置文件
   * @param env
   * @param version
   */
  getFile = (env, version) => {
    let {data} = this.props;
    if (version === '') {
      this.file = [];
    } else {
      this.file = [];
      GetConfigFileFromCenterByCode(`?appCode=${ data.appCode }&envId=${ env }&version=${ version }&pgSize=10&pgNo=1`)
        .then((res) => {
          if (res.data.error_code) {
            err(res.data.error_message)
          } else {
            let list = res.data.page.result;
            if (list instanceof Array) {
              list.forEach((item, index) => {
                this.file.push(item.key);
              })
            }
          }
        })
    }

  }

  /**
   * 渲染内存拖动条头部
   * @param props 组件内部传入props
   * @returns {XML} 组件
   */
  renderHandle = (props) => {
    const {value, ...restProps} = props;
    return (
      <Handle {...restProps}>
        { value }
      </Handle>
    );
  }

  /**
   * 下拉选中设置state
   * @param state 绑定state的名称
   * @returns {Function}
   */
  handleSelect = (state) => (value) => {
    let {data} = this.props;

    if (state === 'confVersion') {
      this.getFile(this.state.confEnv, value)
    } else if (state === 'confEnv') {
      this.getVersion(value, data.appCode);
    }
    this.setState({
      [state]: value
    });


  }

  /**
   * 捕获checkbox的改变
   * @param e
   */
  handleCheckboxChange = (e) => {
    this.setState({
      useConfig: e.target.checked
    });
    if (e.target.checked) {
      this.getFile(this.state.confEnv, this.state.confVersion);
    }
  }

  /**
   * 设置input绑定的state
   * @param state 绑定的state
   * @returns {Function}
   */
  handleInputChange = (state) => (e) => {
    let value = e.target.value;

    if (state === 'cpus') {
      let aa = value.split('.');
      if (aa[1] && aa[1].length > 2) {
        value = Number(value).toFixed(2);
      }
    }
    this.setState({
      [state]: value
    })

  }

  /**
   * 对数组state的select进行设置
   * @param state
   * @param key
   * @param index
   * @returns {Function}
   */
  handleStoreSelect = (state, key, index) => (value) => {
    let store = clone(this.state[state]);

    store[index][key] = value;
    this.controlPortSelect(store[index], index, store);
    this.setState({
      [state]: store
    })
  }

  /**
   * 添加按钮事件
   * @param state 添加到相关的state
   * @param obj 要添加的对象
   * @returns {Function}
   */
  handlePlus = (state, obj) => () => {
    let oldState = this.state[state];

    if (state === 'portMappings') {
      if (oldState.length >= 3)return;
    }
    oldState.push(obj);
    this.setState({
      [state]: oldState
    })
  }

  /**
   * 删除按钮事件
   * @param state 要删除相应state对象
   * @param index 删除对象的索引值
   * @returns {Function}
   */
  handleReduce = (state, index) => () => {
    let oldState = this.state[state];

    oldState.splice(index, 1);
    this.setState({
      [state]: oldState
    })

  }

  /**
   * 对数组state进行设置
   * @param state
   * @param key
   * @param index
   */
  storeKeyValue = (state, key, index) => (e) => {
    let store = clone(this.state[state]);

    store[index][key] = e.target.value;

    this.setState({
      [state]: store
    })

  }

  /**
   * 端口选择逻辑控制
   * @param item 当前操作的对象
   * @param index 当前操作对象的索引
   * @param array 当前操作对象所属的数组
   */
  controlPortSelect = (item, index, array) => {
    if (item.access_mode === 'HTTP') {
      array.forEach(function (item2, index2) {
        if (index2 !== index) {
          item2.access_mode = 'NA';
          item2.access_range = 'OUTER';
        }
      })
    }
    this.setState({
      portMappings: array,
    })
  }

  /**
   * 返回事件
   */
  handleBack = () => {
    this.context.router.push('/');
  }

  /**
   * 设置可用资源最大值
   */
  setResLeft = (array, info) => {
    let resArray = [], maxCpu = 0, maxMem = 0, maxDisk = 0;

    array.forEach((item) => {
      if (info.hasOwnProperty(item)) {
        resArray = resArray.concat(info[item]);
      }
    });

    if (resArray.length !== 0) {
      resArray.forEach((item) => {

        if (item.CpuLeft > maxCpu) {
          maxCpu = item.CpuLeft;
        }
        if (item.MemoryLeft > maxMem) {
          maxMem = item.MemoryLeft;
        }
        if (item.DiskLeft > maxDisk) {
          maxDisk = item.DiskLeft;
        }
        this.setState({
          cpuLeft: maxCpu,
          memLeft: maxMem,
          diskLeft: maxDisk
        });
      });
    } else {
      this.setState({
        cpuLeft: 0,
        memLeft: 0,
        diskLeft: 0
      });
    }

  }

  /**
   * 校验资源
   */
  checkRes = () => {
    let {cpus, mem, disk, instances, resPoolInfo, resChecked} = this.state;

    let resArray = [], totalCount = 0;

    resChecked.forEach((item) => {
      if (resPoolInfo.hasOwnProperty(item)) {
        resArray = resArray.concat(resPoolInfo[item]);
      }
    });

    if (resArray.length !== 0) {
      resArray.forEach((item) => {
        let count;
        count = Math.min(Math.floor(item.CpuLeft / cpus), Math.floor(item.MemoryLeft / mem), Math.floor(item.DiskLeft / disk));
        totalCount += count;
      });
    }


    if (totalCount < instances) {
      err('资源不够用啦，请再多添加一些资源吧~~');
      return true;
    }

    return false;

  }

  /**
   * 提交事件
   */
  handleSubmit = () => {
    let {onSubmit, data} = this.props;
    let portMapping = this.state.portMappings;
    let flag = false, resFlag = false;
    let portMap = {};
    let image;
    let isHaveHttp = false;
    let fakeId = 0;
    let health = {
      "path": "/",
      "protocol": "TCP",
      "portIndex": 0,
      "gracePeriodSeconds": 50,
      "intervalSeconds": 10,
      "timeoutSeconds": 10,
      "maxConsecutiveFailures": 10,
      "ignoreHttp1xx": false
    };


    portMapping.forEach((item) => {
      if (item.containerPort === "") {
        warn('请填写容器端口。');
        flag = true;
      }
      if (item.access_mode === 'HTTP') {
        isHaveHttp = true;
      }
      if (portMap.hasOwnProperty(item.containerPort)) {
        warn('请填写不同容器端口。');
        flag = true;
      } else {
        portMap[item.containerPort] = item.containerPort;
      }
      item.containerPort = Number(item.containerPort);

    });

    //判断是否有http，是的话进行健康检查的protocol赋值
    if (isHaveHttp) {
      if (this.props.data.is_root_path_access) {
        health.protocol = 'HTTP';
      }
    }


    if (this.state.mem.toString().indexOf('.') > -1) {
      return warn('内存必须是整数。');
    }
    if (this.state.disk.toString().indexOf('.') > -1) {
      return warn('磁盘必须是整数。');

    }
    if (this.state.instances.toString().indexOf('.') > -1) {
      return warn('实例数必须是整数。');
    }


    if (this.state.resChecked.length === 0) {
      return warn('请选择资源池。');
    }
    if (this.state.app_name === '') {
      return warn('请输入应用名。');
    }

    //校验资源是否够用
    if (!this.state.isPrivateRes) {
      resFlag = this.checkRes();
    }


    let host = `http://${window.location.host}/confcenter`;

    if (data.hasOwnProperty('image_name')) {
      image = data.image_name;
    } else {
      image = data.dockerImageName;
    }
//配置cmd，cmd=“”时置为null
    let cmd = null;
    if (this.props.data.cmdRun && this.props.data.cmdRun !== '') {
      cmd = this.props.data.cmdRun;
    }

    let confProperties = {};
    if (this.state.useConfig) {
      confProperties = {
        "confServerHost": host,
        "confVersion": this.state.confVersion,
        "confApp": data.appCode,
        "confEnv": this.state.confEnv,
        "confUserDefineDownloadDir": data.filePath,
        "confUserDefineConfigFile": this.file.join(',')
      };
      if (this.props.data.appType === 'j2se') {
        if(cmd){
          cmd = `/usr/local/src/confdownload/runJarAppWithConf.sh && ${cmd}`
        }else{
          cmd = `/usr/local/src/confdownload/runJarAppWithConf.sh`
        }
      }
    } else {
      confProperties = null;
    }

    let cpus = this.state.cpus;
    if (cpus < 0.01) {
      cpus = 0.01;
    } else {
      cpus = Number(Number(this.state.cpus).toFixed(2));
    }


    let formData = {
      "app_name": this.state.app_name,
      "app_id": this.props.data.appUploadId,
      "app_type": this.state.app_type,
      "app_code": this.props.data.appCode,
      "publish_type": this.state.isK8s ? 3 : this.state.isPrivateRes ? 2 : 1,
      "cpus": cpus,
      "mem": Math.ceil(this.state.mem),
      "disk": Math.ceil(this.state.disk),
      "instances": Math.ceil(this.state.instances),
      "res_pool_ids": this.state.resChecked,
      "cmd": cmd,
      "container": {
        "type": "DOCKER",
        "volumes": [],
        "docker": {
          "image": image,
          "network": "BRIDGE",
          "portMappings": portMapping,
          "privileged": true,
          "parameters": [],
          "forcePullImage": true
        }
      },

      "healthChecks": [health],
      "labels": {
        "HAPROXY_GROUP": "isv-apps-group1"
      },
      "group_name": this.state.groupName,
      "portDefinitions": [
        {
          "port": 35000,
          "protocol": "tcp",
          "labels": {}
        }
      ],
      "confProperties": confProperties,
      "fake_id": this.state.fakeId,
      "parent_id": 0,
      "is_fake": false,
    };

    //如果是dubbo类型，做一些change

    if (this.props.data.appType === 'dubbo') {
      formData.container.docker.network = 'HOST';
      formData.healthChecks[0].protocol = "TCP";
      formData.container.docker.portMappings = null;
      formData.portDefinitions = [
        {
          "port": 0,
          "protocol": "tcp",
          "name": "tomcat0",
          "labels": {}
        },
        {
          "port": 0,
          "protocol": "tcp",
          "name": "tomcat1",
          "labels": {}
        },
        {
          "port": 0,
          "protocol": "tcp",
          "name": "tomcat2",
          "labels": {}
        },
        {
          "port": 0,
          "protocol": "tcp",
          "name": "dubbo0",
          "labels": {}
        },
        {
          "port": 0,
          "protocol": "tcp",
          "name": "dubbo1",
          "labels": {}
        },
        {
          "port": 0,
          "protocol": "tcp",
          "name": "dubbo2",
          "labels": {}
        }
      ];
      if(/.jar/.test(this.props.data.uploadPath)){
        if(this.state.useConfig){
          if(cmd){
            formData.cmd = `/usr/local/src/confdownload/runJarAppWithConf.sh && ${cmd}`;
          }else{
            formData.cmd = `/usr/local/src/confdownload/runJarAppWithConf.sh`;
          }
        }else{
          formData.cmd = cmd;
        }
      }else{
        formData.cmd = `sh -c 'sed -e "s/8080/$PORT0/g" -e "s/8005/$PORT1/g" -e "s/8009/$PORT2/g" < ./conf/server.xml > ./conf/server-mesos.xml && ./bin/catalina.sh run -config ./conf/server-mesos.xml'`;
      }

    }

    let logid = guid();
    let param = `?logid=${logid}`;
    if (flag || resFlag)return;
    this.publishFlag = true;

    if(this.state.isK8s){
      if (this.state.groupName !== '') {
        this.getParentId(this.state.groupName)
          .then((data) => {
            formData.parent_id = data.parent_id;
            if (this.state.isPrivateRes) {
              privatePublishApp(formData, param).then(onSubmit(logid, this.state.app_name))
            } else {
              deployApp(formData, param).then(onSubmit(logid, this.state.app_name))
            }

          });
      } else {
        if (this.state.isPrivateRes) {
          privatePublishApp(formData, param).then(onSubmit(logid, this.state.app_name))
        } else {
          deployApp(formData, param).then(onSubmit(logid, this.state.app_name));
        }

      }
    }else{
      //先校验mesos版本，设置请求
      getMesosVersion().then((res) => {
        if (res.data.error_code) {
        } else {
          let version = res.data.version;

          if (typeof version === 'string') {

          }
          let [ver1, ver2, ver3] = version.split('.');


          if (ver1 == 1 && ver2 == 4) {
            if (ver3 > 0) {
              formData.healthChecks[0].protocol = `MESOS_${formData.healthChecks[0].protocol}`
            }
          } else if (ver1 > 1 || (ver1 == 1 && ver2 > 4)) {
            formData.healthChecks[0].protocol = `MESOS_${formData.healthChecks[0].protocol}`
          }
        }
      }).then((id) => {

        if (this.state.groupName !== '') {
          this.getParentId(this.state.groupName)
            .then((data) => {
              formData.parent_id = data.parent_id;
              if (this.state.isPrivateRes) {
                privatePublishApp(formData, param).then(onSubmit(logid, this.state.app_name))
              } else {
                deployApp(formData, param).then(onSubmit(logid, this.state.app_name))
              }

            });
        } else {
          if (this.state.isPrivateRes) {
            privatePublishApp(formData, param).then(onSubmit(logid, this.state.app_name))
          } else {
            deployApp(formData, param).then(onSubmit(logid, this.state.app_name));
          }

        }

      })
    }




  }

  /**
   * 获取parent_id
   */
  getParentId = (path) => {
    return new Promise((resolve, reject) => {
      let param = new FormData();
      param.append('path', path);
      createProd(param).then((res) => {
        let data = res.data;
        if (data.error_code) {
          reject();
          return err(`${data.error_code}:${data.error_message}`)
        }
        resolve(data);
      })
    })
  }

  /**
   * 关闭当前弹出框
   */
  handleClose = () => {
    this.setState({
      showModal: false
    });
    this.context.router.push('/');
  }

  /**
   * 确认创建资源池
   */
  handleEnsure = () => {
    this.setState({
      showModal: false
    });

  }

  /**
   * 多选框改变
   * @param id 点击check的id
   * @param type 资源池属性，1公有mesos，2私有, 3k8s
   */
  onCheckboxChange = (id, type) => (e) => {

    let { resChecked, resPool } = this.state;

    let array = resChecked;
    let isK8s = true;


    if (e.target.checked) {
      if(type === 3){
        array.forEach((item) => {
          resPool.forEach((res) => {
            if(res.resourcepool_id === item){
              if(res.type !== 3){
                isK8s = false;
              }
            }
          })
        })
        if(!isK8s){
          array = [];
        }
      }else{
        array.forEach((item) => {
          resPool.forEach((res) => {
            if(res.resourcepool_id === item){
              if(res.type !== 3){
                isK8s = false;
              }
            }
          })
        })
        if(isK8s){
          array = [];
        }
      }
      array.push(id);
      if (type === 2) {
        this.setState({
          isPrivateRes: true
        })
      }else if(type === 3) {
        this.setState({
          isK8s: true
        })
      }

    } else {

      array = array.filter((item) => {
        return item != id;
      });
      if (type === 2 && array.length === 0) {
        this.setState({
          isPrivateRes: false
        })
      }else if (type === 3 && array.length === 0){
        this.setState({
          isK8s: false
        })
      }

    }

    this.setResLeft(array, this.state.resPoolInfo);
    this.setState({
      resChecked: array
    })

  }

  /**
   * 修改fakeId
   * @param value
   */
  changeFake = (value) => {
    let {data} = this.props;
    let fakeList = data.fakeAppId ? data.fakeAppId.split(',') : [];
    this.setState({
      fakeId: fakeList[value - 1],
      app_type: value
    })
  }

  /**
   * 设置构建环境
   * @param value
   */
  changePublishEnv = (value) => {
    this.setState({
      app_type: value
    })
  }

  render() {
    const {data} = this.props;
    const self = this;
    let image;
    let fakeList = data.fakeAppId ? data.fakeAppId.split(',') : [];
    if (data.hasOwnProperty('image_name')) {
      image = data.image_name;

    } else {
      image = data.dockerImageName;
    }

    return (
      <Row className="publish">
        <Col lg={8} lgOffset={1} md={10} mdOffset={1} sm={12} smOffset={0}>
          <Form horizontal style={{marginTop: 60}}>
            <Row>
              <FormGroup>
                <Col xs={3} className="text-right">
                  <Label>应用名称</Label>
                </Col>
                <Col xs={9}>
                  <VerifyInput isRequire>
                    <FormControl
                      value={this.state.app_name}
                      onChange={this.handleInputChange('app_name')}
                    />
                  </VerifyInput>
                </Col>
              </FormGroup>
            </Row>
            <Row>

              <FormGroup>
                <Col xs={3} className="text-right">
                  <Label>所属镜像</Label>
                </Col>
                <Col xs={9}>
                  <span style={{display: "inline-block"}}>{image}</span>
                </Col>
              </FormGroup>
            </Row>
            <Row>

              <FormGroup>
                <Col xs={3} className="text-right">
                  <Label>产品（线）</Label>
                </Col>
                <Col xs={9}>
                  <FormControl
                    value={this.state.groupName}
                    onChange={this.handleInputChange('groupName')}
                  />
                  <span className="descript">多级目录划分请使用“/”，第一层目录会创建产品线，后续目录会创建产品</span>
                </Col>
              </FormGroup>
            </Row>
            {
              fakeList.length !== 0 ? (
                <Row>

                  <FormGroup>
                    <Col sm={3} xs={4} className="text-right">
                      <Label>设置构建环境</Label>
                    </Col>
                    <Col sm={9} xs={8}>
                      <div>
                        <Radio.RadioGroup
                          name="env"
                          selectedValue={this.state.app_type}
                          onChange={this.changeFake}>
                          <Radio colors="primary" value={1}>开发环境</Radio>
                          <Radio colors="primary" value={2}>测试环境</Radio>
                          <Radio colors="primary" value={3}>灰度环境</Radio>
                          <Radio colors="primary" value={4}>生产环境</Radio>
                        </Radio.RadioGroup>
                      </div>
                    </Col>
                  </FormGroup>
                </Row>
              ) : (
                <Row>

                  <FormGroup>
                    <Col sm={3} xs={4} className="text-right">
                      <Label>设置部署环境</Label>
                    </Col>
                    <Col sm={9} xs={8}>
                      <div>
                        <Radio.RadioGroup
                          name="env"
                          selectedValue={this.state.app_type}
                          onChange={this.changePublishEnv}>
                          <Radio colors="primary" value={1}>开发环境</Radio>
                          <Radio colors="primary" value={2}>测试环境</Radio>
                          <Radio colors="primary" value={3}>灰度环境</Radio>
                          <Radio colors="primary" value={4}>生产环境</Radio>
                        </Radio.RadioGroup>
                      </div>
                    </Col>
                  </FormGroup>
                </Row>
              )
            }

            <Col xsOffset={3} xs={9} className="divier"/>
            {
              data.appType === 'j2ee' || data.appType === 'j2se' || data.appType === 'dubbo' ? (
                <Row>
                  <Col xs={3} className="text-right">
                    <Label>配置文件</Label>
                  </Col>
                  <Col xs={9}>
                    <Row>
                      <Col md={12}>
                        <Checkbox
                          checked={ this.state.useConfig }
                          onChange={ this.handleCheckboxChange }
                          style={{height: 20, width: 20, marginTop: 5, verticalAlign: 'sub'}}
                        />
                        <Label style={{marginLeft: 10}}>启用配置文件</Label>
                      </Col>
                      <Col md={12}>
                        {
                          this.state.useConfig ? (
                            <Row>
                              <Col xs={6}>
                                <FormGroup>
                                  <Label>选择环境</Label>
                                  <Select
                                    value={ this.state.confEnv }
                                    size="lg"
                                    onChange={this.handleSelect('confEnv')}>
                                    {
                                      this.state.envList.map(function (item, index) {
                                        return (
                                          <Option
                                            value={ item.value }>{ item.name }</Option>
                                        )
                                      })
                                    }
                                  </Select>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup>
                                  <Label>配置版本</Label>
                                  <Select
                                    size="lg"
                                    value={ this.state.confVersion }
                                    onChange={this.handleSelect('confVersion')}>
                                    {
                                      this.state.versionList.map(function (item, index) {
                                        return (
                                          <Option
                                            value={ item.value }>{ item.value }</Option>
                                        )
                                      })
                                    }
                                  </Select>
                                </FormGroup>
                              </Col>
                            </Row>
                          ) : ""
                        }

                      </Col>
                    </Row>
                  </Col>
                  <Col xsOffset={3} xs={9} className="divier"/>
                </Row>
              ) : ""
            }

            <Row>
              <FormGroup>
                <Col xs={3} className="text-right">
                  <Label>端口设置</Label>
                </Col>
                <Col xs={9}>
                  <span className="descript">*容器端口为必须填写，一般为8080。</span>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Col xs={9} xsOffset={3} className="padding-0">
                {
                  this.state.portMappings.map(function (item, index, array) {

                    return (
                      <div key={index}>
                        <Col md={3} xs={5}>
                          <FormGroup>
                            <Label>容器端口</Label>

                            <VerifyInput isRequire>
                              <FormControl
                                style={{imeMode: 'Disabled'}}
                                onKeyDown={ onlyNumber }
                                value={item.containerPort}
                                onChange={self.storeKeyValue('portMappings', 'containerPort', index)}/>
                            </VerifyInput>

                          </FormGroup>
                        </Col>
                        <Col md={2} xs={5}>
                          <FormGroup>
                            <Label>协议</Label>
                            <Select
                              value={item.protocol}
                              onChange={self.handleStoreSelect('portMappings', 'protocol', index)}>
                              <Option value="tcp">tcp</Option>
                              <Option value="udp">udp</Option>
                            </Select>
                          </FormGroup>
                        </Col>

                        <Col md={2} xs={5}>
                          <FormGroup>
                            <Label>访问方式</Label>
                            <Select
                              defaultValue="HTTP"
                              value={ item.access_mode }
                              onChange={self.handleStoreSelect('portMappings', 'access_mode', index)}>
                              <Option value="HTTP">HTTP</Option>
                              <Option value="TCP">TCP</Option>
                              <Option value="NA">不可访问</Option>
                            </Select>
                          </FormGroup>
                        </Col>
                        <Col md={3} xs={5}>
                          <FormGroup>
                            <Label>访问范围</Label>
                            <Select
                              defaultValue="OUTER"
                              value={ item.access_range }
                              onChange={self.handleStoreSelect('portMappings', 'access_range', index)}
                              disabled={item.access_mode === 'NA'}>
                              <Option value="INNER">内部服务</Option>
                              <Option value="OUTER">外部服务</Option>
                              <Option value="ALL">全部</Option>
                            </Select>
                          </FormGroup>
                        </Col>
                        <FormGroup>
                          <span className="control-icon">
                            <Icon
                              type="uf-add-c-o"
                              className="primary-color"
                              onClick={ self.handlePlus('portMappings', clone(portObj))}
                            />
                            {
                              array.length === 1 ? "" : (
                                <Icon
                                  type="uf-reduce-c-o"
                                  className="primary-color"
                                  onClick={self.handleReduce('portMappings', index)}
                                />
                              )
                            }
                          </span>
                        </FormGroup>


                        <div className="clearfix"/>
                      </div>
                    )
                  })
                }
              </Col>
            </Row>
            <Col xsOffset={3} xs={9} className="divier"/>
            <Row>
              <FormGroup>
                <Col xs={3} className="text-right">
                  <Label>资源池选择</Label>
                </Col>
                <Col xs={9}>
                  <h4>
                    mesos资源池(mesos资源池和Kubernetes资源池不可同时选择)
                  </h4>
                  {
                    this.state.resPool.map((item, index) => {
                      if(item.type === 3)return null;
                      return (
                        <label key={ item.resourcepool_id } style={{display: 'inline-block', padding: 3}}>
                          <Checkbox
                            onChange={this.onCheckboxChange(item.resourcepool_id, item.type)}
                            style={{marginLeft: 15, marginRight: 5, marginBottom: 10}}
                            disabled={ item.Host_count === 0 }
                            checked={this.state.resChecked.indexOf(item.resourcepool_id) > -1}
                            defaultChecked={ item.Host_count !== 0 && item.Isdefault === 1 }
                          />
                          <Tooltip overlay={renderTooltip(this.state.resPoolInfo[item.resourcepool_id])}
                                   placement="bottomLeft">
                            <span className="res-name">{ item.resourcepool_name }</span>
                          </Tooltip>
                        </label>
                      )
                    })
                  }
                  <h4>
                    Kubernetes资源池
                  </h4>
                  {
                    this.state.resPool.map((item, index) => {
                      if(item.type !== 3) return null;

                      return (
                        <label key={ item.resourcepool_id } style={{display: 'inline-block', padding: 3}}>
                          <Checkbox
                            onChange={this.onCheckboxChange(item.resourcepool_id, item.type)}
                            style={{marginLeft: 15, marginRight: 5, marginBottom: 10}}
                            disabled={ item.Host_count === 0 }
                            checked={this.state.resChecked.indexOf(item.resourcepool_id) > -1}
                            defaultChecked={ item.Host_count !== 0 && item.Isdefault === 1 }
                          />
                          <Tooltip overlay={renderTooltip(this.state.resPoolInfo[item.resourcepool_id])}
                                   placement="bottomLeft">
                            <span className="res-name">{ item.resourcepool_name }</span>
                          </Tooltip>
                        </label>
                      )
                    })
                  }
                </Col>
              </FormGroup>
            </Row>
            <Col xsOffset={3} xs={9} className="divier" />
            <Row>
              <Col xs={3} className="text-right">
                <Label>基础设置</Label>
              </Col>
              <Col xs={9} className="padding-0">

                <Col sm={12}>
                  <Label>内存</Label>
                </Col>
                <Col sm={8}>
                  <div style={{marginTop: 5}}>
                    <Slider
                      style={{width: "100%"}}
                      min={0}
                      max={this.state.memLeft}
                      value={this.state.mem < this.state.memLeft ? this.state.mem : this.state.memLeft }
                      onChange={this.handleSelect('mem')}
                      handle={this.renderHandle}/>
                  </div>
                </Col>
                <Col sm={4} xs={6} style={{paddingLeft: 25}}>
                  <InputGroup>
                    <FormControl
                      style={{imeMode: 'Disabled'}}
                      onKeyDown={ onlyNumber }
                      onChange={this.handleInputChange('mem')}
                      value={ this.state.mem < this.state.memLeft || this.state.isPrivateRes ? this.state.mem : this.state.memLeft}/>
                    <InputGroup.Addon>MB</InputGroup.Addon>
                  </InputGroup>
                </Col>
                <Col sm={4} xs={6}>
                  <FormGroup>
                    <Label>CPU</Label>
                    <FormControl
                      style={{imeMode: 'Disabled'}}
                      onKeyDown={ onlyNumber }
                      onChange={this.handleInputChange('cpus')}
                      value={ this.state.cpus < this.state.cpuLeft || this.state.isPrivateRes ? this.state.cpus : this.state.cpuLeft}/>
                  </FormGroup>
                </Col>
                <Col sm={4} xs={6}>
                  <FormGroup>
                    <Label>磁盘</Label>
                    <InputGroup>
                      <FormControl
                        style={{imeMode: 'Disabled'}}
                        onKeyDown={ onlyNumber }
                        onChange={this.handleInputChange('disk')}
                        value={ this.state.disk < this.state.diskLeft || this.state.isPrivateRes ? this.state.disk : this.state.diskLeft}/>
                      <InputGroup.Addon>MB</InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col sm={4} xs={6}>
                  <FormGroup>
                    <Label>实例</Label>
                    <FormControl
                      style={{imeMode: 'Disabled'}}
                      onKeyDown={ onlyNumber }
                      onChange={this.handleInputChange('instances')}
                      value={this.state.instances}
                    />
                  </FormGroup>
                </Col>

              </Col>
            </Row>


          </Form>
          <Col xs={9} xsOffset={3}>
            <div className="btn-group">
              <Button colors='danger' shape="squared" onClick={this.handleSubmit}
                      className="publish-btn" disabled={ this.publishFlag }>部署</Button>
              <Button shape="squared" className="cancel-btn"
                      onClick={this.handleBack}>取消</Button>
            </div>
          </Col>
        </Col>

        <ErrorModal show={this.state.showModal} message={<div className="text-center">很抱歉，您没有资源池</div>}
                    buttonTitle={<a href="/fe/MyResourcePool/index.html" style={{color: '#fff'}}>创建资源池</a>}
                    onClose={ this.handleClose } onEnsure={this.handleEnsure }/>
      </Row>
    )
  }

}
PublishForm.contextTypes = {
  router: PropTypes.any
};

PublishForm.defaultProps = defaultProps;

PublishForm.propTypes = propTypes;


export default PublishForm;
