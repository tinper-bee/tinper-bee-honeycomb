import {PureComponent, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Row, Col, FormControl, Label, Icon, InputGroup,Button,Message } from 'tinper-bee';

import VerifyInput from '../../../components/verifyInput/index';
import { getUserInfo,updataUserInfo} from '../../../serves/alarm-center';
import { stringToObj} from '../../util';
import './index.less';

function isEmpty(name){
  if(name === '') return '暂无数据';
  return name
}

class Inform extends PureComponent {
  static propTypes = {}
  static defaultProps = {}
  state = {
    edit: false,
    username: '未获取到用户名',
    email: '未获取到邮箱',
    phone: '未获取到电话号码',
    defaultUsername:'',
    defaultemail:'',
    defaultPhone:'',
    userId:"",
    providerId:"",
    id:"",
    createTime:"",
    buttonFlag:false,
    showError: 'none'
  }


  componentDidMount() {

      getUserInfo().then((res) => {
        let data = res.data;
        if(data.error_code){
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }
        if(data){
          this.setState({
            username:data.Username,
            phone:data.PhoneNum,
            email: data.Email,
            providerId:data.ProviderId,
            userId: data.UserId,
            id:data.Id,
            createTime:data.CreateTime,
            defaultUsername:data.Username,
            defaultemail:data.Email,
            defaultPhone:data.PhoneNum
          })
        }

     })


  }

// 验证手机号码的正确性
 is_mobile =(value) =>{
    var pattern=/^1[358][0123456789]\d{8}$/;
    if(!pattern.test(value)){
         this.setState({
                showError: 'block'
         });
        return false;

    }
    return true;
}
//验证电子邮箱的正确性
 is_email =(value) =>{
    var pattern=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if(!pattern.test(value)){
       this.setState({
                showError: 'block'
         });
        return false;
    }
    return true;
}

  /**
   * 确认事件
   * @param state
   * @returns {function(*)}
   */
  handleSubmit = () => {
      let self = this;
      let urlId=this.state.id;
      let phoneValue=ReactDom.findDOMNode(self.refs.phone).value;
      let emailValue=ReactDom.findDOMNode(self.refs.email).value;
      if (!self.is_mobile(phoneValue))return;
      if (!self.is_email(emailValue))return;
      let parm={
          ProviderId:this.state.providerId,
          Userid:this.state.userId,
          Username:this.state.username,
          PhoneNum:phoneValue,
          Email:emailValue,
          CreateTime:this.state.createTime
      }

       updataUserInfo(urlId,parm).then((res) => {
        let data = res.data;
        if(data.error_code){
          this.setState(function (state, props) {
            return {
                edit: false,
                buttonFlag:false
            }
          });
          return Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }

        if(stringToObj(data)==1){
          this.setState(function (state, props) {
            return {
                edit: false,
                buttonFlag:false,
                defaultemail:this.state.email,
                defaultPhone:this.state.phone
            }
          });
           return Message.create({
            content: "修改个人信息成功",
            color: 'success',
            duration: null
          })
        }else if(stringToObj(data)==0){
           this.setState(function (state, props) {
            return {
                edit: false,
                buttonFlag:false
            }
          });
          return Message.create({
            content: "修改个人信息失败,请重试",
            color: 'danger',
            duration: null
          })
        }


     })

  }

  componentWillReceiveProps(nextProps){
    let { username, email, phone} = nextProps;
    this.setState({
      username,
      email,
      phone
    })
  }

  /**
   * 输入框输入事件
   * @param state
   * @returns {function(*)}
   */
  handleInputChange = (state) => {
    return (e) => {
      this.setState({
        [state]: e.target.value
      })
    }
  }
  /**
   * 移除输入框的内容
   */
  removeInfo = (state) => {
    return (e) => {
      ReactDOM.findDOMNode(this.refs[state]).focus();
      this.setState({
        [state]: ""
      })
    }
  }
  /**
   * 编辑事件
   */
  handleEdit = () => {
    this.setState({
      edit: !this.state.edit,
      buttonFlag:true
    })
  }

  /**
   * 取消事件
   */
  handleEditCancle = () => {
    this.setState(function (state, props) {
      return {
          edit: false,
          username:this.state.defaultUsername,
          phone:this.state.defaultPhone,
          email:this.state.defaultemail,
          buttonFlag:false
      }
    });
  }
  render() {

    let {edit, username, email, phone} = this.state;

    return (
      <div className="inform">
        <Icon className="edit" onClick={ this.handleEdit } type="uf-pencil-s"/>
        <Row className="inform-info">
            <div className="clearfix">
              <Col md={5} sm={5} className="text-right">
                <Label>
                  用户名
                </Label>
              </Col>
              <Col md={7} sm={7} className="height-60">
                {
                  username
                }
              </Col>
            </div>
            <div className="clearfix">
              <Col md={5} sm={5} className="text-right ">
                <Label>
                  通知邮箱
                </Label>
              </Col>
              <Col md={7} sm={7}  className="height-60">
                {
                  edit ? (
                    <div>
                      <VerifyInput message="邮箱格式不正确" isRequire
                                             verify={/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/}>
                                    <InputGroup simple>
                                       <FormControl ref="email"
                                           value={ email }
                                           onChange={ this.handleInputChange('email') }
                                       />

                                        <InputGroup.Button onClick={ this.removeInfo('email')}>
                                          <Icon type="uf-close-c" />
                                        </InputGroup.Button>
                                    </InputGroup>
                      </VerifyInput>
                    </div>
                  ) : isEmpty(email)

                }
              </Col>
            </div>
            <div className="clearfix">
              <Col md={5} sm={5} className="text-right">
                <Label>
                  通知手机号
                </Label>
              </Col>
              <Col md={7} sm={7}  className="height-60">
                {
                  edit ? (
                    <div>

                      <VerifyInput message="手机号码格式不正确" isRequire verify={/^1\d{10}$/}>
                                    <InputGroup simple>
                                       <FormControl ref="phone"
                                           value={ phone }
                                           onChange={ this.handleInputChange('phone') }
                                       />

                                        <InputGroup.Button onClick={ this.removeInfo('phone')}>
                                          <Icon type="uf-close-c" />
                                        </InputGroup.Button>
                                    </InputGroup>
                      </VerifyInput>

                    </div>
                  ) : isEmpty(phone)

                }
              </Col>
            </div>

         { this.state.buttonFlag?
           ( <div className="formButtonWrap">
                <Button shape="squared" className="canclebtn" onClick={ this.handleEditCancle }>取消</Button>
                <Button shape="squared" className="okbtn"  colors="primary" onClick={ this.handleSubmit }>确认</Button>
            </div>
           ):""
         }
        </Row>
      </div>
    )
  }
}

export default Inform;
