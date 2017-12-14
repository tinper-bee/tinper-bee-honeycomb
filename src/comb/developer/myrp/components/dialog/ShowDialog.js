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
import Inform from '../userInfo/index';

import {getUserInfo, updataUserInfo} from '../../../serves/alarm-center';


class ShowDialog extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {
    data: {},
    showFlagEmail: true,
    showFlagTel: false
  }

  componentDidMount() {
    getUserInfo().then((res) => {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      }
      if (data.hasOwnProperty('ProviderId')) {
        if (!data.PhoneNum) {
          data.PhoneNum = ''
        }
        if (!data.Email) {
          data.Email = ''
        }
        this.setState({
          data
        })
      }
    })
  }


  onConfirm = () => {
    let {data, showFlagEmail, showFlagTel} = this.state;
    let {close, onConfirm} = this.props;
    if (!showFlagEmail && !showFlagTel)
      return Message.create({
        content: "请至少选择一种通知方式。",
        color: 'warning',
        duration: 4.5
      });

    if (showFlagEmail) {
      if (data.Email === "") {
        return Message.create({
          content: "选中的邮箱必填",
          color: 'warning',
          duration: 4.5
        })
      } else if (!this.is_email(data.Email)) {
        return Message.create({
          content: "邮箱格式不正确",
          color: 'warning',
          duration: 4.5
        })
      }
    }

    if (showFlagTel) {
      if (data.PhoneNum === "") {
        return Message.create({
          content: "选中的电话号码必填",
          color: 'warning',
          duration: 4.5
        })
      } else if (!this.is_mobile(data.PhoneNum)) {
        return Message.create({
          content: "手机号格式不正确",
          color: 'warning',
          duration: 4.5
        })
      }
    }

    let parm = {
      ProviderId: data.ProviderId,
      Userid: data.UserId,
      Username: data.Username,
      PhoneNum: data.PhoneNum,
      Email: data.Email,
      CreateTime: data.CreateTime
    }

    close && close();

    updataUserInfo(data.Id, parm).then((res) => {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      }

      // Message.create({
      //   content: "修改个人信息成功",
      //   color: 'success',
      //   duration: 1.5
      // })
    })
    onConfirm && onConfirm(data.Id, showFlagEmail, showFlagTel);

  }

  /**
   * 输入框输入事件
   * @param state
   * @returns {function(*)}
   */
  handleInputChange = state => (e) => {
    let {data} = this.state;
    data[state] = e.target.value;
    this.setState({
      data
    })
  }

  // 验证手机号码的正确性
  is_mobile = (value) => {
    var pattern = /^1[358][0123456789]\d{8}$/;
    if (!pattern.test(value)) {
      this.setState({
        showError: 'block'
      });
      return false;

    }
    return true;
  }
  //验证电子邮箱的正确性
  is_email = (value) => {
    var pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!pattern.test(value)) {
      this.setState({
        showError: 'block'
      });
      return false;
    }
    return true;
  }

  /**
   * switch切换事件
   * @param state
   */
  handleCheck = state => checked => {
    let value = this.state[state];
    this.setState({
      [state]: !value
    })
  }

  /**
   * 移除输入框的内容
   */
  removeInfo = (state) => (e) => {
    let {data} = this.state;
    data[state] = ""
    this.setState({
      data
    })
  }


  render() {
    let {show, name, close, checked, onConfirm} = this.props;
    let {data, showFlagEmail, showFlagTel} = this.state;
    return (
      <Modal
        show={ show }
        onHide={ close } className="mrp-add">
        <Modal.Header>
          <Modal.Title>
            {
              checked ? "关闭报警" : "开启报警"
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            checked ? (
              <p>{ `是否确认关闭${name}的报警通知` }</p>
            ) : (
              <div>
                <p> 您将开启{name}的报警通知，将通知到用户{data.Username}</p>
                <Inform
                  data={ data }
                  showFlagEmail={ showFlagEmail }
                  showFlagTel={ showFlagTel }
                  onInputChange={ this.handleInputChange }
                  onSwitchCheck={ this.handleCheck }
                  removeInfo={ this.removeInfo }
                />
              </div>
            )
          }

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ close } shape="border" style={{marginRight: 50}}>取消</Button>
          {
            checked ? (
              <Button onClick={ onConfirm } colors="primary">
                关闭报警
              </Button>
            ) : (
              <Button onClick={ this.onConfirm } colors="primary">
                开启报警
              </Button>
            )
          }

        </Modal.Footer>
      </Modal>
    )
  }
}

export default ShowDialog;
