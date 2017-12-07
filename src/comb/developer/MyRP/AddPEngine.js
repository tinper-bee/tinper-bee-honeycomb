import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import 'rc-tabs/assets/index.css';
import { Row, Button, Switch, Message, ProgressBar, Col, Tile,Label,Modal,FormGroup,FormControl,Clipboard} from 'tinper-bee';
import Tabs, {TabPane} from 'rc-tabs';
import style from './index.css';
import VerifyInput from '../components/verifyInput/index';
import {loadShow, loadHide, lintAppListData, splitParam} from '../components/util';
import {myRp_envObj,myRp_info,myRp_proLink} from 'lib/env-config';
import LinuxTab from './components/linuxTab';
import MacTab from './components/macTab';


class AddPEngine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalEngine: false,
            user_id: '',
            auth_id: '',
            messageAry: [],
            requireEngine:true,
            resourceType:this.props.location.query.type,
            panelActiveKey:"1"
        };
    }

    closeEngine = () =>{
        this.setState({
            modalEngine:false
        })
    }

    fresh = (name) =>{
        let self=this;
        let { location } = this.props;
        name=name||self.props.params.name;
        axios.get('/res-pool-manager/v1/resource_pool/generateid/'+location.query.id+'?hostname='+name)
            .then(function (res) {
                let data = lintAppListData(res);
                if (data) {
                    let authId = data.auth_id;
                    let userId = data.user_id;
                    self.setState({
                        user_id: userId,
                        auth_id: authId,
                        modalEngine: false
                    });
                    window.addPeTimer = window.setInterval(() => {
                        self.interval(authId);
                    }, 3000);
                    let param={
                        "userId":userId,
                        "authId":authId,
                        "dns":["term."+authId,"console."+authId,"agent."+authId]
                    };
                    axios.post('/res-pool-manager/v1/resource_pool/setngrokuser',param)
                        .then(function(res){
                            lintAppListData(res);
                        })
                        .catch(function (err) {
                            console.log(err);
                            return Message.create({content: '请求出错', color: 'danger', duration: null});
                        })
                }
            }).catch(function (err) {
            console.log(err);
            return Message.create({content: '请求出错', color: 'danger', duration: null});
        });
    }

    componentDidMount() {
       this.fresh();
    }

    componentWillUnmount() {
        window.clearInterval(window.addPeTimer);
    }

    reset = () => {
        this.setState({
            messageAry: [],
            modalEngine:true,
            requireFlag:true
        });
    }

    interval = (authId) =>{
        //authId = '03C1WWpXNpUZTW1k';//测试数据
        let self = this;
        axios.get('/res-pool-manager/v1/resource_message?query=AuthId:' + authId + '&sortby=Ts&order=asc')
            .then(function (res) {
                let data = lintAppListData(res);
                //let data=[{"Id":43,"userid":"158678b8-6099-427b-a3a3-f7f26e1bf7a0","authid":"UnmuIbIaTTubW9G8","hostname":"192.168.32.48","status":1,"message":"ngrok安装成功","Ts":"2017-04-06T01:19:45Z","Dr":0}];
                if (data) {
                    self.setState({
                        messageAry: data
                    });
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].status == 1) {
                            //self.clear();
                            window.clearInterval(window.addPeTimer);
                            break;
                        }
                    }
                    ReactDOM.findDOMNode(self.refs.code).scrollTop = 99999999999999;
                }

            })
            .catch(function (err) {
                console.log(err);
                return Message.create({content: '请求出错', color: 'danger', duration: null});
            })
    }

    back = () => {
        window.location.hash = '#/';
    }

    onEngineAdd = () =>{
        let name=ReactDOM.findDOMNode(this.refs.nameEngine).value;
        if(name){
            this.setState({
                requireEngine:true
            });
            this.fresh(name);
        }else{
            this.setState({
                requireEngine:false
            });
        }
    }

    buyEngine = () => {
        window.location.hash = '#/bs/';
    }

  changePanelKey =(panelActiveKey)=> {
    this.setState({
      panelActiveKey: panelActiveKey
    })
  }

    render() {
        let InstallingType1 , InstallingType2;
        let pro = myRp_proLink.env;
        let dev_sh = myRp_info.dev_sh;
        let dev_conf = myRp_info.dev_conf;
        let daemon = myRp_info.daemon;
        let docker_enable = myRp_info.docker_enable;
        let docker_reload = myRp_info.docker_reload;
        let docker_start = myRp_info.docker_start;
        let docker_service = myRp_info.docker_service;
        let docker_ssh = myRp_info.docker_ssh;
        let add_bash = myRp_info.add_bash;
        let edit_profile = myRp_info.edit_profile;
        let docker_restart = myRp_info.docker_restart;
        let all1 = myRp_info.all1;
        let all2 = myRp_info.all2;

        if(window.location.hostname==pro){
             InstallingType1 = myRp_envObj.proEnv.InstallingType1 + this.state.user_id + " " + this.state.auth_id;
             InstallingType2 = myRp_envObj.proEnv.InstallingType2 + this.state.user_id + " " + this.state.auth_id;
        }else{
             InstallingType1 = myRp_envObj.noProEnv.InstallingType1 + this.state.user_id + " " + this.state.auth_id;
             InstallingType2 = myRp_envObj.noProEnv.InstallingType1 + this.state.user_id + " " + this.state.auth_id;
        }

        return (

            <div className="add-p">
                <Modal show={ this.state.modalEngine  } keyboard={false} onHide={ this.closeEngine } backdrop={'static'}
                       className="mrp-add">
                    <div className="mrp-add" >
                        <Modal.Header >
                            <Modal.Title>添加主机</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup>
                                <Label>主机名称：</Label>
                                <FormControl ref="nameEngine"  placeholder="请输入主机名称"/>
                            </FormGroup>
                            <FormGroup className={classnames({'error':true,'hidden':this.state.requireEngine})}>
                                <Label>
                                <span className="verify-warning show-warning">
                                    <i className="uf uf-exc-t-o"/>
                                    请输入主机名称
                                </span>
                                </Label>
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={ this.closeEngine } shape="border" style={{marginRight: 50}}>取消</Button>
                            <Button onClick={ this.onEngineAdd } colors="primary">确认</Button>
                        </Modal.Footer>
                    </div>
                </Modal>
                <Row>
                    <div className="head">
                      <span className="back" onClick={this.back}>
                          <i className="cl cl-arrow-left"> </i>
                          我的资源池
                      </span>
                      <span className="head-title">
                        接入自有主机
                      </span>
                        {/* <Button shape="squared" onClick={ this.buyEngine } colors="primary">
                         购买主机
                         </Button>*/}
                    </div>
                </Row>
              <Row className="add-p-main">
                <ul>
                  <li className="title">
                    <i className="cl cl-resource"> </i>
                    安装主机监控程序
                  </li>
                  <li>
                      <Tabs
                        tabBarStyle="simple"
                        onChange={this.changePanelKey}
                        destroyInactiveTabPane
                        renderTabBar={() => <ScrollableInkTabBar />}
                        renderTabContent={() => <TabContent />}
                        >
                        <TabPane tab='For Linux' key="1">
                          <LinuxTab
                            activeKey={this.state.panelActiveKey}
                            resourceType = {this.state.resourceType}
                            dev_sh = {dev_sh}
                            dev_conf={dev_conf}
                            daemon={daemon}
                            docker_enable={docker_enable}
                            docker_reload={docker_reload}
                            docker_start={docker_start}
                            docker_service={docker_service}
                            InstallingType1={InstallingType1}
                            InstallingType2={InstallingType2}
                            all1={all1}
                            />
                        </TabPane>
                        <TabPane tab='For Mac/Windows' key="2">
                          <MacTab
                            activeKey={this.state.panelActiveKey}
                            resourceType = {this.state.resourceType}
                            InstallingType1={InstallingType1}
                            InstallingType2={InstallingType2}
                            docker_ssh={docker_ssh}
                            add_bash={add_bash}
                            edit_profile={edit_profile}
                            docker_restart={docker_restart}
                            all2={all2}
                            />
                        </TabPane>
                      </Tabs>
                    </li>

                      <li className="title">
                        <i className="cl cl-set-c-o"> </i>
                        安装状态
                      </li>
                        <li className="code-br" ref="code">
                          <p>正在等待运行安装命令 loading
                                    <span className="loading">
                                    ......
                                    </span>
                          </p>
                          {this.state.messageAry.map((item, index) => {
                            return (
                              <p className={classnames({
                                            "success": item.status == 1,
                                            'error': item.status == -1
                                        })}>{item.message}</p>
                            )
                          })}
                        </li>
                      </ul>

                    <div className="foot">
                        <Button colors="danger" onClick={this.reset}>
                            继续添加
                        </Button>
                        <Button onClick={this.back}>
                            查看资源池
                        </Button>
                    </div>
                </Row>
            </div>
        )
    }
}
export default AddPEngine;
