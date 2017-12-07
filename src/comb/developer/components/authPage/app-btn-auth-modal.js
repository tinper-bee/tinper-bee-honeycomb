import React, {Component} from 'react'
import {
  Modal,
  Button,
} from 'tinper-bee';
import {findDOMNode} from 'react-dom';
import {getAppBtnAuth, assignAuth, getAppActions, deleteAuth} from '../../serves/confLimit';
import Checkbox from 'bee-checkbox';
import {err, success} from '../../components/message-util';
import 'bee-checkbox/build/Checkbox.css';

import './index.css';


class AppBtnAuthModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      btnAry: []
    }
    this.checkedArray = [];
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.show){
      let {  data, appId } = nextProps;
      let formdata = {
        busiCode: `app_manager_btn${appId}`,
        userId: data.userId,
        providerId: data.providerId
      };


      getAppActions().then((res) => {
        let data = res.data;
        if(data.error_code){
          return err(`${data.error_code}:${data.error_message}`)
        }
        let btnAry = [];
        for(let item in data){
          btnAry.push({
            name: item,
            url: data[item],
            checked: false
          });
        }
        this.setState({
          btnAry
        });
        return btnAry;


      }).then((btnAry) => {

        getAppBtnAuth(formdata).then((res) => {
          let data = res.data;
          if(data.error_code){
            return err(`${data.error_code}:${data.error_message}`)
          }

          data.data.resources.forEach((item) => {
            btnAry.forEach((btn) => {
              if(btn.url === item.resId){
                btn.checked = true;
                this.checkedArray.push(btn.url);
              }
            })
          })

          this.setState({
            btnAry
          });
        })
      })
    }
  }

  /**
   * 选中一项
   */
  handleCheck = (index) => () => {
    let { btnAry } = this.state;

    btnAry[index].checked = !btnAry[index].checked;
      this.setState({
        btnAry
      })
  }

  handleClose = () => {
    let { onClose } = this.props;
    this.setState({
      btnAry: []
    });
    this.checkedArray = [];
    onClose && onClose();
  }

  handleAdd = () => {
    let {appId, data, onClose } = this.props;
    let { btnAry } = this.state;
    let idAry = [];
    let newChecked = [];
    let deleteArray = [];
    btnAry.forEach((item) => {
      if(item.checked){
        idAry.push(item.url);
      }
    });

    this.checkedArray.forEach((key) => {
      if(idAry.indexOf(key) <= -1){
        deleteArray.push(key)
      }
    });

    deleteArray.forEach((resId) => {
      deleteAuth(`?userId=${data.userId}&resId=${resId}&busiCode=app_manager_btn${appId}`)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            err(`${data.error_code}:${data.error_message}`)
          }
        });
    });



    let param = {
      userId: data.userId,
      userName: data.userName,
      providerId: data.providerId,
      daRole: data.daRole,
      resId: idAry.join(','),
      busiCode: `app_manager_btn${appId}`,
      isGroup: "N",
      createUserId: data.createUserId ? data.createUserId : ""
    };
    assignAuth(param).then((res) => {
      let data = res.data;
        if(data.error_code){
          return err(`${data.error_code}:${data.error_message}`)
        }
        return success('修改成功。')
    })

    this.handleClose();

  }


  render() {

    let {show} = this.props;

    return (
      <Modal
        show={show}
        size="lg"
        className="auth-modal"
        onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title>修改按钮权限</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>按钮权限</h3>
          <ul className="app-btn-auth clearfix">
            {
              this.state.btnAry.map((item, index) => {
                return (
                  <li key={index} onClick={this.handleCheck(index)}>
                    <Checkbox
                      checked={item.checked}>
                      { item.name }
                      </Checkbox>
                  </li>
                )
              })
            }
          </ul>


        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            onClick={this.handleClose}
            style={{margin: "0 20px 40px 0"}}>
            取消
          </Button>
          <Button
            ref="btn"
            onClick={this.handleAdd}
            colors="primary"
            style={{marginBottom: "40px"}}>
            确认
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default AppBtnAuthModal;
