import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, Button, Table, Pagination, Message, FormGroup, FormControl, Label, Col, Row } from 'tinper-bee';
import Checkbox from 'rc-checkbox';
import VerifyInput from 'components/verifyInput/index';
import { Base64 } from 'js-base64';

import { GetConfigFile, SaveConfigFile } from 'serves/appTile';

import {lintAppListData} from 'components/util';

import 'rc-checkbox/assets/index.css';

const defaultProps = {
  isSelected: false
};

class ExtractModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confList: [],
      data: [],
      page: 0,
      activePage: 1,
      checkedAll: false,
      checkedArray: [],
      edit_version: "",
    };
    const self = this;
    this.columns = [{
      title: (<Checkbox onChange={ this.handleCheckedAll }/>),
      dataIndex: 'appId',
      key: 'appId',
      render: function (text, record, index) {
        let checked = false;
        if (self.state.checkedArray.indexOf(index) > -1) {
          checked = true;
        }
        return (<Checkbox checked={ checked } onChange={ self.handleChecked(index) }/>);
      }
    }, {
      title: '名称',
      dataIndex: 'path',
      key: 'path',
    }];
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { configId, onClose } = this.props;
    const { show } = nextProps;
    const self = this;
    if(show){
      //获取配置文件列表
      GetConfigFile(configId, function (res) {
        let data = lintAppListData(res);
        if (data instanceof Object && data.confList) {
          let fileList = data.confList;
          fileList.forEach((item, index) => {
            item.key = index;
          })

          self.setState({
            confList: fileList,
            data: data
          })
        } else {
          Message.create({content: '没有可供提取的配置文件', color: 'warning', duration: 4.5});
          setTimeout(() => {
            onClose();
          }, 1000)

        }
      })
    }

  }

  /**
   * 全选事件
   * @param e
   */
  handleCheckedAll = (e) => {
    let { confList } = this.state;
    let checkedArray = [];


    if (e.target.checked) {
      confList.forEach((item, index) => {
        checkedArray.push(index)
      })
      this.setState({
        checkedArray,
        checkedAll: true
      })
    } else {
      this.setState({
        checkedArray,
        checkedAll: false
      })
    }

  }

  /**
   * 每行的checkbox点击事件
   * @param text
   * @returns {Function}
   */
  handleChecked = (text) => {
    const self = this;
    let { checkedArray, confList } = this.state;
    return  (e) => {
      let array = checkedArray.slice(0),checkedAll = false;

      if (e.target.checked) {
        array.push(text);
        if(confList.length === array.length){
          checkedAll = true;
        }

      } else {
        array = array.filter((item) => item !== text);

      }
      self.setState({
        checkedArray: array,
        checkedAll: checkedAll
      })
    }
  }

  /**
   * 确认提取
   */
  handleSubmit = () => {
    if(this.state.edit_version === ''){
      return Message.create({
        content: '请填写版本号',
        color: 'warning',
        duration: 4.5
      })
    }
    const { onEnsure, configId, onClose } = this.props;
    let data = this.state.data,
      array = this.state.checkedArray,
      oldList = this.state.confList;
    let newList = [];
    let self = this;

    oldList.forEach((item, index) => {

      if (array.indexOf(index) > -1) {
        item.version = self.state.edit_version;
        item.content = Base64.encode(item.content);
        newList.push(item);
      }

    });


    data.confList = newList;


    //保存配置文件
    SaveConfigFile(configId, data, function (res) {
      if(res.data.error_code){
        Message.create({
          content: res.data.error_message,
          color: 'danger',
          duration: null
        });
        onClose();
      }else{

        self.setState({
          checkedArray: [],
          edit_version: ''
        });
        onEnsure && onEnsure();


      }

    });

  }

  /**
   * 输入框绑定事件
   * @param state 当前绑定的state
   * @returns {Function}
   */
  handleValueChange = (state) => {
    const self = this;

    return function (event) {

      self.setState({
        [state]: event.target.value
      })
    }
  }

  render() {
    const { show, onClose } = this.props;
    return (
      <Modal show={ show } size="lg" onHide={ onClose }>
        <Modal.Header>
          <Modal.Title>提取配置文件</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <div>
              <FormGroup>
                <Label>配置版本</Label>
                <VerifyInput isRequire>
                  <FormControl
                    placeholder="请输入数字、字母、下划线、斜线、中划线"
                    maxLength="100"
                    style={{ width: 300 }}
                    value={ this.state.edit_version }
                    onChange={ this.handleValueChange('edit_version') }
                  />
                </VerifyInput>

              </FormGroup>
            </div>
            <Table data={this.state.confList} columns={ this.columns } id="configtable"/>
            {
              this.state.page > 1 ? (
                <Pagination
                  first
                  last
                  prev
                  next
                  items={this.state.page}
                  className="pagenation"
                  maxButtons={5}
                  activePage={this.state.activePage}
                  onSelect={this.handleSelectPage}/>
              ) : ""
            }

          </div>

        </Modal.Body>

        <Modal.Footer>

          <Button onClick={ onClose } shape="squared" style={{ marginBottom: 15 }}>取消</Button>
          <Button onClick={ this.handleSubmit } colors="primary" shape="squared"
                  style={{ marginLeft: 20, marginRight: 20, marginBottom: 15  }}>提取</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

ExtractModal.defaultProps = defaultProps;

export default ExtractModal;
