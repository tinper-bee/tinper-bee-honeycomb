import React,{Component} from 'react';
import ReactDom from 'react-dom';
import {Modal,Button,Label,FormControl,FormGroup,Message,InputGroup} from 'tinper-bee';
import {ValidateUser,SendShortMsg,getPhoneNum} from '../serves/accessServe';
import {splitParam,lintData,loadShow,loadHide} from './util';
require('./common.css');
require('../pages/access/index.css');


const propTypes = {
    title: React.PropTypes.oneOfType([
        React.PropTypes.node,
        React.PropTypes.string
    ]),
    callback: React.PropTypes.oneOfType([
        React.PropTypes.node,
        React.PropTypes.func
    ])
}
const defaultProps = {
    defaultImgUrl: '/accesscenter/web/v1/access/getValidateCode'
}
class ValidateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.show,
            validateMessage: '',
            phoneNumber: '',
            phoneValidateText: '',
            validataPhoneFlag: false,
            showReverseTime: false,
            reverseTime: 60,
            ValidateUrl: this.props.defaultImgUrl + "?timestamp=1486706068846",
            defaultMessage: "点击此处获取验证码",
            defaultPhoneInfo: "验证码将发送到您预留",
            updateMessage: "重新发送验证码",
            empetyPhoneInfo: "手机号码获取失败,请刷新重试",
            choseBtnFlag:true

        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.changePhoneNum = this.changePhoneNum.bind(this);
        this.sendPhoneCode = this.sendPhoneCode.bind(this);
        this.reverseTime = this.reverseTime.bind(this);
        this.getPhoneNumber = this.getPhoneNumber.bind(this);
    }

    componentWillReceiveProps(props) {
        var self = this;
        setTimeout(()=> {

            self.setState({
                showReverseTime: false,
                showModal: self.props.show,
                validateMessage: '',
                ValidateUrl: this.props.defaultImgUrl + '?timestamp=' + (new Date()).valueOf()
            });
        })

    }

    close() {
        var self = this;
        let index = self.props.index;
        setTimeout(()=> {
            self.setState({
                showModal: false,
                showReverseTime: false,
                choseBtnFlag:true,
                defaultMessage:"点击此处获取验证码"
            });
        });
        window.clearInterval(self.reverseTimer);

    }

    //为了使每次生成图片不一致，即不让浏览器读缓存，所以需要加上时间戳
    changeUrl() {
        this.setState({ValidateUrl: this.props.defaultImgUrl + '?timestamp=' + (new Date()).valueOf()});
    }

    open() {
        this.setState({
            showModal: true
        });
    }

    onConfirm() {
        let self = this;
        const {callback,index} = self.props;
        // let param = {
        //   userPwd: ReactDom.findDOMNode(self.refs.password).value,
        //   validateCode: ReactDom.findDOMNode(self.refs.validateCode).value
        // }
        let param = {
            messageCode: ReactDom.findDOMNode(self.refs.phoneValidate).value
        }
        self.setState({
            showModal: false,
            showReverseTime: false,
            choseBtnFlag:true,
            defaultMessage:"点击此处获取验证码"
        });
        window.clearInterval(self.reverseTimer);
          if (callback) {
                         callback(param);
                      }
       /* if(param.messageCode){
            ValidateUser(splitParam(param),function(response){    
               if(response.data.error_code){
                  return Message.create({content: response.data.error_message, color: 'danger',duration:1})
               }else{
                      if (callback) {
                         callback(param);
                      }
               }
             })
          
        }else{
            return Message.create({content: '验证失败，请输入验证码', color: 'danger',duration:1})
        }*/
      
        // ValidateUser(splitParam(param),function(response){
        //       if(response.data.error_code){
        //           self.setState({validateMessage:response.data.error_message || '验证失败'});
        //       }else{
        //       }
        // })
    }

    changePhoneNum() {
        let phoneValue = ReactDom.findDOMNode(this.refs.phoneValue).value;
        if (phoneValue.length == 11) {
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phoneValue))) {
                this.setState({validataPhoneFlag: false});
                this.setState({phoneValidateText: "手机号输入不正确"})
            } else {
                this.setState({validataPhoneFlag: true});
                this.setState({phoneValidateText: ""});
                this.setState({phoneNumber: phoneValue});
            }
        } else {
            this.setState({validataPhoneFlag: false});
        }

    }
    //点击发送验证码,并获取后端数据
    sendPhoneCode() {
        // if(!this.state.validataPhoneFlag) {
        //     this.setState({phoneValidateText:"手机号输入不正确"})
        //     return;
        // }
        // let phoneNumber = this.state.phoneNumber;;
        let self = this;
        SendShortMsg(function (response) {
            if (response.data.success == "true") {
                self.setState(
                    {
                        showReverseTime: true,
                        choseBtnFlag:false,
                        reverseTime: 60,
                        defaultPhoneNumer:response.data.message,
                        defaultPhoneInfo:"验证码已发送到您预留"

                    }
                );
                self.reverseTime();
            } else {
                Message.create({content: response.data.error_message, color: 'danger', duration: 1});
            }
        })
    }

    //获取电话号码
    getPhoneNumber() {
        let self = this;
        getPhoneNum(function (response) {
            if (response.data.success == "true") {
                self.setState(
                    {
                        phoneNumber: response.data.message
                    }
                )
            } else {
                Message.create({content: response.data.error_message, color: 'danger', duration: 1});
            }
        })
    }

    reverseTime() {
        let self = this;
        self.reverseTimer = setInterval(function () {
            if (self.state.reverseTime == 0) {
                window.clearInterval(self.reverseTimer);
                delete self.reverseTimer;
                self.setState({showReverseTime: false,
                    choseBtnFlag:true,
                    defaultPhoneInfo:"验证码将发送到您预留"
                });
                return;
            }
            else {
                self.setState({reverseTime: self.state.reverseTime - 1
                })
            }
        }, 1000);
    }
    componentDidMount() {
        //请求接口，设置state
        this.getPhoneNumber();
    }
    componentWillUnmount() {
        window.clearInterval(this.reverseTimer);
        delete this.reverseTimer;
    }

    // <FormGroup>
    //   <Label>密码：</Label>
    //   <FormControl type="password" ref="password"/>
    // </FormGroup>
    // <FormGroup>
    //     <Label>手机号码：</Label>
    //     <InputGroup onChange={this.changePhoneNum} style={{marginLeft:115}}>
    //         <FormControl ref="phoneValue" onChange={this.changePhoneNum} type="text"/>
    //         <span className="phone-valitest">{this.state.phoneValidateText}</span>
    //     </InputGroup>
    // </FormGroup>
    // <FormGroup>
    //   <Label>验证码：</Label>
    //   <InputGroup onChange={this.changePhoneNum} style={{marginLeft:115}}>
    //       <FormControl ref="validateCode" className="vd"/>
    //       <img alt="验证码" src={this.state.ValidateUrl} className="vd-img" onClick={this.changeUrl} />
    //     </InputGroup>
    // </FormGroup>
    render() {
        const {title,show} = this.props;
        return (
            <span className="validate-key-modal">

              <Modal
                  show={this.state.showModal }
                  onHide={ this.close }>
                  <Modal.Header>
                      <Modal.Title>验证用户</Modal.Title>
                  </Modal.Header>

                  <Modal.Body className="validate-modal-body">
                      <FormGroup>
                          <span shape="border" ref="showError"
                                className="validate-message">{this.state.validateMessage}{this.state.showError}</span>
                      </FormGroup>


                      <FormGroup>
                          <InputGroup.Button>

                              {this.state.choseBtnFlag && (<Button   className="setBtnDefault getPhoneCode phoneBtn"  shape="squared" bordered onClick={this.sendPhoneCode}>
                                      {this.state.defaultMessage}
                                  </Button>
                              )}
                              }
                              {!this.state.choseBtnFlag && (<Button   className="updateBtnDefault getPhoneCode" disabled="true" shape="squared" bordered onClick={this.sendPhoneCode}>
                                  {this.state.updateMessage}
                                  <span shape="squared" className="padding-left-5">({this.state.reverseTime}s)</span>
                                </Button>)
                              }
                          </InputGroup.Button>

                          {this.state.phoneNumber!="" && (<p className="margin-top-50 showDesc">{this.state.defaultPhoneInfo}<span className="font-size-24 padding-horizontal-3" style={{color:"#F57323"}}>{this.state.phoneNumber}</span>的手机号上</p>)
                          }

                          {this.state.phoneNumber=="" && (<p className="margin-top-50 showDesc">{this.state.empetyPhoneInfo}</p>)
                          }

                          <div className="showDesc margin-top-50 margin-bottom-10">请输入您收到的验证码：</div>
                          <InputGroup style={{width:100,marginLeft:115}}>
                              <FormControl ref="phoneValidate" type="text" placeholder="请输入您手机收到的验证码"/>
                          </InputGroup>
                      </FormGroup>

                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close } shape="border" style={{marginRight: 40}}>取消</Button>
                      <Button onClick={ this.onConfirm } colors="primary">验证</Button>
                  </Modal.Footer>
              </Modal>
          </span>
        )
    }
}

ValidateModal.defaultProps = defaultProps;
ValidateModal.propTypes = propTypes;
export default ValidateModal;
