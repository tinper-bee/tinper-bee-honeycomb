import { Component } from 'react'
import { Select, Message, Button, Switch } from 'tinper-bee'
import { Link, withRouter } from 'react-router'

import VerifyInput from '../components/verifyInput/index'
import Header from './component/header.component'
import ConfPanel from './component/confPanel.component'
import withStyle from './component/withStyle.hoc'
import Password from './component/password.component'
import PageLoad from './component/pageLoading.component'

import styles from './index.css'
import { PROPS, logo, serviceConf } from './const'

import { createService, maxInsNum, listQ } from '../serves/middleare'
import { randomString } from './util'

const WrappedHeader = withRouter(Header);
const STORAGE_TYPE = 'jenkins';

class CreateJenkinsPage extends Component {
  static propTypes = {};
  static defaultProps = {};
  static contextTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      srvDesc: '',
      srvConf: 0,
      autoPassword: '',
      srvPassword: '',
      srvPasswordBack: '',
      databaseName: '',
      srvDisk: '',
      insUsername: '',
      time: 0,
      clicked: false,
      autoPW: false,
      loading: true,
    };
  }

  errStatus = {
    srvPassword: false,
    srvPasswordBack: false,
    databaseName: false,
    insUsername: false,
  }

  componentDidMount() {
    Promise.all([
      maxInsNum(STORAGE_TYPE),
      listQ({ size: 0, index: 0 }, STORAGE_TYPE)
    ])
        .then(data => {
          let limit = parseInt(data[0].message);
          let has = parseInt(data[1].totalElements);
          this.setState({ loading: false });

          if (has < limit) {
            // this.setState({ forbidden: false })
          } else {
            this.props.router.replace(`/limit?limit=${limit}&type=${STORAGE_TYPE}`);
          }

        })
        .catch((error) => {
          console.log(error.message)
          console.log(error.stack)
          this.props.router.goBack();
        })
  }

  handleConfSelect = (index) => {
    return () => {
      this.setState({ srvConf: index })
    }
  }

  handleCreateSrv = (evt) => {
    evt.preventDefault();
    let auto = this.state.autoPW;
    let passport = Object.keys(this.errStatus).every(key => {
      if (auto && /srvPassword/.test(key)) {
        return true;
      }
      return this.errStatus[key];
    })
    let databaseName=this.state.databaseName;

    if (!passport||databaseName.trim()=="") {
      Message.create({
        content: '请检查您输入的信息格式是否正确，红色 * 必填',
        color: 'danger',
        duration: 3
      });
      return;
    }

    //判断点击之前的按钮状态
    let clicked = this.state.clicked;
    if (clicked) {
      Message.create({
        content: '请勿多次提交同一请求',
        color: 'danger',
        duration: 3
      });
      return;
    }

    this.setState({ clicked: true })

    let {insUsername, srvDesc, srvConf, srvVersion = '2.8.19' } = this.state;
    let serviceType = STORAGE_TYPE;
    let mem = serviceConf[serviceType][srvConf].mem;
    let cpu = serviceConf[serviceType][srvConf].cpu;
    let disk = serviceConf[serviceType][srvConf].disk;
    let param = {
      cpu,
      insPwd: this.getServicePassword(),
      [PROPS[serviceType]['insName']]: databaseName,
      insVersion: srvVersion,
      disk: disk,
      description: srvDesc,
      memory: mem,
      insUserName: insUsername
    }

    createService(param, serviceType).then((data) => {
      // 跳转
      if (data)
        this.props.router.push(`/list/${serviceType}`);
      else
        this.setState({ clicked: false })
    })
  }

  handlePassWDAlgSwitch = (flag) => {
    if (flag) {
      const pw = randomString(8);
      this.setState({
        autoPW: flag,
        autoPassword: pw,
        srvPassword: '',
        srvPasswordBack: '',
      });

      this.errStatus.srvPassword = false;
      this.errStatus.srvPasswordBack = false;
    } else {
      this.setState({
        autoPW: flag,
        autoPassword: '',
      });
    }
  }

  getServicePassword = () => {
    if (this.state.autoPW) {
      return this.state.autoPassword;
    } else {
      return this.state.srvPassword;
    }
  }
  render() {
    const serviceType = STORAGE_TYPE;
    const { style } = this.props;

    if (this.state.loading) {
      return <PageLoad show={this.state.loading} />
    } else {
      return (
          <div style={{ height: '100%' }}>
            <WrappedHeader>
              <span>创建我的Jenkins服务</span>
            </WrappedHeader>
            <form style={style.main} onSubmit={this.handleCreateSrv}>
              <div>
                <div style={style.label}>
                  <span className="markHolder">*</span>
                  服务类型
                </div >
                <div style={style.logo}>
                  <img src={logo[serviceType]} style={style.logo.image} />
                </div>
              </div>

              <div className="srv-name">
                <div style={style.label}>
                  <span className="requiredMark">*</span>
                  服务名称
                </div>
                <VerifyInput
                    verify={/^[\S\s]{0,19}$/}
                    isRequire
                    message={'输入不能超过20位字符'}
                    method={'change'}
                    feedBack={(status) => { this.errStatus.databaseName = status }}
                    >
                  <input type="text" style={style.input}
                         autoComplete="off"
                         value={this.state.databaseName}
                         onChange={(e) => { this.setState({ databaseName: e.target.value }) }}
                      />
                </VerifyInput>
              </div>

              <div className="srv-desc">
                <div style={style.label}>
                  <span className="markHolder">*</span>
                  服务描述
                </div>
                <VerifyInput
                    verify={(val)=>{return val.length <= 50}}
                    isRequire
                    message={'请输入小于50个字符的描述'}
                    method={'change'}
                    feedBack={(status) => { this.errStatus.descLen = status }}
                    >
                <textarea className="srv-desc--content"
                          value={this.state.srvDesc}
                          autoComplete="off"
                          onChange={(e) => { this.setState({ srvDesc: e.target.value }) }}
                    ></textarea>
                </VerifyInput>
              </div>
              <div className="srv-conf">
                <div style={Object.assign({}, style.label, { height: 180 })}>
                  <span className="markHolder">*</span>
                  配置选择
                </div>
                {
                  serviceConf[serviceType].map((data, index) => {
                      const { srvConf } = this.state;
                      return (
                          <ConfPanel style={{ main: { float: 'left' } }}
                                     type={data.type}
                                     disk={data.disk}
                                     cpu={data.cpuSymbol}
                                     mem={data.mem}
                                     active={srvConf === index}
                                     onClick={this.handleConfSelect(index)}
                              />
                      )

                  })
                }
              </div>
              <div style={style.dashline}> </div>
              <div className="srv-name">
                <div style={style.label}>
                  <span className="requiredMark">*</span>
                  用户名称
                </div>
                <VerifyInput
                    isRequire
                    message={'用户名不能为空!'}
                    method={'change'}
                    feedBack={(status) => { this.errStatus.insUsername = status }}
                    >
                  <input type="text" style={style.input}
                         autoComplete="off"
                         value={this.state.insUsername}
                         onChange={(e) => { this.setState({ insUsername: e.target.value }) }}
                      />
                </VerifyInput>
              </div>
              <div>
                <div className="srv-name">
                  <span className="requiredMark">*</span>
                  <span>设置密码</span>
                <span style={style.warning}>
                  <span className="cl cl-notice-p"></span>
                  &nbsp;&nbsp;此处密码不可修改，请您牢记密码
                  </span>
                </div>
                <div style={style.passwd}>
                  <Password
                      manualPass={this.state.srvPassword}
                      setManualPassword={(value) => { this.setState({ srvPassword: value }) }}
                      setManualPassValidation={(status) => { this.errStatus.srvPassword = status }}

                      manualPassBack={this.state.srvPasswordBack}
                      setManualPassBack={(value) => { this.setState({ srvPasswordBack: value }) }}
                      setManualPassBackValidation={status => this.errStatus.srvPasswordBack = status}

                      setAutoPassword={value => this.setState({ autoPassword: value })}
                      setAutoFlag={value => this.setState({ autoPW: value })}
                      autoPass={this.state.autoPassword}
                      />
                </div>
              </div>

              <div className="srv-ctr">
                <Button style={Object.assign({}, style.btn, style.btnOk)}
                        type='submit'
                    >
                  创建服务
                </Button>
                <Button style={Object.assign({}, style.btn, style.btnCancel)}
                        onClick={(e) => { this.props.router.goBack() }}
                    >
                  取消
                </Button>
              </div>
            </form>
          </div>
      )
    }
  }
}


export default withStyle(() => ({
  main: {
    padding: '50px',
    fontSize: '15px',
    color: '#4a4a4a',
    backgroundColor: 'white',
    marginBottom: '46px',
    paddingBottom: '0px',
  },
  logo: {
    height: 60,
    width: 100,
    display: 'inline-block',
    border: '1px solid #ccc',
    textAlign: 'center',
    position: 'relative',
    top: -20,

    image: {
      height: 60,
      width: 60,
    },
  },
  label: {
    width: '100px',
    float: 'left',
  },
  passwd: {
    marginLeft: 100,
  },
  input: {
    display: 'block',
    paddingLeft: '15px',
    width: '600px',
    fontSize: '15px',
    height: '35px',
    border: '1px solid #d9d9d9',
    borderRadius: '3px',
  },
  warning: {
    paddingLeft: 30,
    marginBottom: 10,
    color: '#f57323',
  },
  btn: {
    width: 130,
    height: 35,
    lineHeight: '35px',
    display: 'inline-block',
    padding: 0,
    textAlign: 'center',
    borderRadius: 0,
  },
  btnOk: {
    color: 'white',
    backgroundColor: '#dd3730',
    marginRight: 30,
    cursor: 'pointer',
  },
  btnCancel: {
    backgroundColor: '#e5e5e5',
  },
  dashline: {
    height: 1,
    border: '1px dashed #ededed',
    width: 700,
    marginBottom: 10,
  }
}))(CreateJenkinsPage)
