import React, {Component} from 'react'
import {
  Modal,
  Button,
  Form,
  Tabs,
  TabPanel,
  Row,
  FormGroup,
  Select,
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

import AddUser from '../add-user';
import VerifyInput from '../../../components/verifyInput/index';
import {onlyNumber} from '../../../lib/verification'
import {clone} from '../../../components/util';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import TabContent from 'bee-tabs/build/TabContent';

import {GetResPool} from '../../../serves/appTile';
import {addServiceAlarm, testConn} from '../../../serves/alarm-center'
import {formateDate} from '../../../components/util';

import './index.less';

const Option = Select.Option;

let portObj = {
  "key": "key",
  "value": "value",
};

class AddService extends Component {
  constructor(...args) {
    super(...args);


    this.state = {
      authorizedUsers: [],
      serviceName:'',
      resURL:'',
      paramsmap:[{
        "key":"key",
        "value":"value"
      }],
      headersmap:[{
        "key":"key",
        "value":"value"
      }],
      resType:'GET',
      resTimeout:1000,
      resBody:'',
      activeKey: '1',
      step: 1,
      role: ['email'],
      showLoading: true,
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
   * input值改变
   * @param state
   * @returns {Function}
   */
  handleInputChange = (state) => (e) => {
    let value = e.target.value;

    if (state === 'resTimeout') {
      value = Number(value)
    }
    this.setState({
      [state]: value
    })

  }

  /**
   * 选取器选取元素
   * @param state
   * @returns {Function}
   */
  handleSelect = (state) => {
    return (value) => {

      this.setState({
        [state]: value
      });
    }

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
   * 模态框关闭事件
   */
  handleClose = () => {
    let {onClose} = this.props;
    this.setState({
      authorizedUsers: [],
      serviceName:'',
      resURL:'',
      paramsmap:[{
        "key":"key",
        "value":"value"
      }],
      headersmap:[{
        "key":"key",
        "value":"value"
      }],
      resType:'GET',
      resBody:'',
      activeKey: '1',
      step: 1,
      role: ['email'],
    });
    onClose && onClose();
  }

  /**
   * 切换上一步和下一步
   * @param step
   */
  changeStep = step => () => {
    let {serviceName, resURL} = this.state;
    if (step === 2) {
      if (serviceName === '') {
        return Message.create({
          content: '请填写监控服务名称。',
          color: 'warning',
          duration: 4.5
        })
      }
      if (resURL === '') {
        return Message.create({
          content: '请填写报警服务监控URL。',
          color: 'warning',
          duration: 4.5
        })
      }
      //if (activeMenu === 'res') {
      //  if (resSelectedList.length === 0)
      //    return Message.create({
      //      content: '请选择要添加预警的资源池。',
      //      color: 'warning',
      //      duration: 4.5
      //    })
      //} else {
      //  if (appSelectedList.length === 0)
      //    return Message.create({
      //      content: '请选择要添加预警的应用。',
      //      color: 'warning',
      //      duration: 4.5
      //    })
      //}
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
        authorizedUsers = authorizedUsers.filter(item => {
          item.Id !== record.Id
        })
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
   * 测试连接
   */
  testURL = () => {
    let {resURL,resType,resBody,paramsmap,headersmap,resTimeout} = this.state;
    let paramData, params = '', headers = '';
    paramsmap.forEach((item) => {
      if (item.key === 'key' && item.value === 'value'){

      }else{
        params = params + item.key + "=" + item.value + "&"
      }
    });
    headersmap.forEach((item) => {
      if (item.key === 'key' && item.value === 'value'){

      }else{
        headers = headers + item.key + "=" + item.value + "&"
      }
    });

    paramData = {
      RequestUrl:resURL,
      RequestType:resType,
      RequestParam:params,
      RequestHeader:headers,
      RequestBody:resBody,
      RequestTimeout:resTimeout
    }
    testConn(paramData).then((res)=> {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        });
      }
      Message.create({
        content: '连接成功',
        color: 'success',
        duration: null
      })

    })
  }


  /**
   * 添加报警
   */
  addAlarm = () => {
    let {refresh} = this.props;
    let {serviceName, resURL, resType, resBody, paramsmap, headersmap, resTimeout, authorizedUsers, role} = this.state;
    let paramData , params = '', headers = '', users = [];
    authorizedUsers.forEach((item) => {
      users.push(item.Id);
    });
    users = users.join(',');
    paramsmap.forEach((item) => {
      if (item.key === 'key' && item.value === 'value'){

      }else{
        params = params + item.key + "=" + item.value + "&"
      }
    });
    headersmap.forEach((item) => {
      if (item.key === 'key' && item.value === 'value'){

      }else{
        headers = headers + item.key + "=" + item.value + "&"
      }
    });

    paramData = {
      ServiceName:serviceName,
      RequestUrl:resURL,
      RequestType:resType,
      RequestParam:params,
      RequestHeader:headers,
      RequestBody:resBody,
      RequestTimeout:resTimeout,
      Contacts: users,
      Interval: 300,
      AlarmInterval: 1800,
      Type: 1,
      Phone: role.indexOf('mobile') > -1,
      Email: role.indexOf('email') > -1
    }
    addServiceAlarm(paramData).then((res)=> {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.message,
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

    this.handleClose();

  }

  validate =(state) =>(e)=>{
    let str = e.target.value;
    if (str.length > 20) {
    Message.create({
      content: '服务名不能超过20个字符！',
      color: 'warning',
      duration: null
    });
      this.setState({
        [state]:str.substring(0,20)
      })
    }
  }


  render() {

    let {show} = this.props;

    const self = this;

    return (
      <Modal
        show={ show }
        size="lg"
        className="alarm-add-service"
        onHide={ this.handleClose }>
        <Modal.Header>
          <Modal.Title>
            {
              `添加监控服务`
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            this.state.step === 1 ? (
              <div>
                <Form horizontal style={{marginTop: 30}}>
                  <Row>
                    <FormGroup>
                      <Col xs={2} className="text-right">
                        <Label>服务名称</Label>
                      </Col>
                      <Col xs={9}>
                        <VerifyInput isRequire>
                          <FormControl
                            value={this.state.serviceName}
                            onChange={this.handleInputChange('serviceName')}
                            onKeyUp={this.validate('serviceName')}
                            placeholder="请输入服务报警名称"
                          />
                        </VerifyInput>
                      </Col>
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup>
                      <Col xs={2} className="text-right">
                        <Label>请求URL</Label>
                      </Col>
                      <Col xs={2}>
                        <Select defaultValue="GET" size="lg"
                          dropdownStyle={{ zIndex: 3000}}
                          value={this.state.resType}
                          onChange={self.handleSelect('resType')}
                          style={{ width: 120 }}
                        >
                          <Option value="GET">GET</Option>
                          <Option value="POST">POST</Option>
                        </Select>
                      </Col>
                      <Col xs={7}>
                        <FormControl
                          placeholder="请输入请求url"
                          value={this.state.resURL}
                          onChange={this.handleInputChange('resURL')}
                        />
                      </Col>
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup>
                      <Col xs={2} className="text-right">
                        <Label>请求参数</Label>
                      </Col>
                      <Col xs={9}>
                        <Tabs
                          defaultActiveKey="1"
                          onChange={() => {}}
                          destroyInactiveTabPane
                          renderTabBar={()=><ScrollableInkTabBar />}
                          renderTabContent={()=><TabContent />}
                        >
                          <TabPanel tab='Params' key="1">
                            <div>
                              <Col md={12}>
                                {
                                  this.state.paramsmap.map(function (item, index, array) {

                                    return (
                                      <Row key={index}>
                                        <Col md={4}>
                                          <FormGroup>
                                            <Label>KEY</Label>

                                            <VerifyInput isRequire>
                                              <FormControl
                                                value={item.key}
                                                onChange={self.storeKeyValue('paramsmap', 'key', index)}/>
                                            </VerifyInput>

                                          </FormGroup>
                                        </Col>
                                        <Col md={5}>
                                          <FormGroup>
                                            <Label>VALUE</Label>
                                            <VerifyInput isRequire>
                                              <FormControl
                                                value={item.value}
                                                onChange={self.storeKeyValue('paramsmap', 'value', index)}/>
                                            </VerifyInput>
                                          </FormGroup>
                                        </Col>
                                        <FormGroup>
                                <span className="control-icon">
                                  <Icon
                                    type="uf-add-c-o"
                                    className="primary-color"
                                    onClick={ self.handlePlus('paramsmap', clone(portObj))}
                                  />
                                  {
                                    array.length === 1 ? "" : (
                                      <Icon
                                        type="uf-reduce-c-o"
                                        className="primary-color"
                                        onClick={self.handleReduce('paramsmap', index)}
                                      />
                                    )
                                  }
                                </span>
                                        </FormGroup>
                                      </Row>
                                    )
                                  })
                                }
                              </Col>
                            </div>
                          </TabPanel>
                          <TabPanel tab='Headers' key="2">
                            <div>
                              <Col md={12}>
                                {
                                  this.state.headersmap.map(function (item, index, array) {

                                    return (
                                      <Row key={index}>
                                        <Col md={4}>
                                          <FormGroup>
                                            <Label>KEY</Label>

                                            <VerifyInput isRequire>
                                              <FormControl
                                                value={item.key}
                                                onChange={self.storeKeyValue('headersmap', 'key', index)}/>
                                            </VerifyInput>

                                          </FormGroup>
                                        </Col>
                                        <Col md={5}>
                                          <FormGroup>
                                            <Label>VALUE</Label>
                                            <VerifyInput isRequire>
                                              <FormControl
                                                value={item.value}
                                                onChange={self.storeKeyValue('headersmap', 'value', index)}/>
                                            </VerifyInput>
                                          </FormGroup>
                                        </Col>
                                        <FormGroup>
                                <span className="control-icon">
                                  <Icon
                                    type="uf-add-c-o"
                                    className="primary-color"
                                    onClick={ self.handlePlus('headersmap', clone(portObj))}
                                  />
                                  {
                                    array.length === 1 ? "" : (
                                      <Icon
                                        type="uf-reduce-c-o"
                                        className="primary-color"
                                        onClick={self.handleReduce('headersmap', index)}
                                      />
                                    )
                                  }
                                </span>
                                        </FormGroup>
                                      </Row>
                                    )
                                  })
                                }
                              </Col>
                            </div>
                          </TabPanel>
                          <TabPanel tab='Body' key="3">
                            <div>
                              <textarea
                                value={this.state.resBody}
                                onChange={this.handleInputChange('resBody')}
                                rows="10"
                                style={{width: '95%',marginTop: 20, marginLeft:10}}/>
                            </div>
                          </TabPanel>
                        </Tabs>
                      </Col>
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup>
                      <Col xs={2} className="text-right">
                        <Label>超时时间(毫秒)</Label>
                      </Col>
                      <Col xs={4}>
                        <VerifyInput isRequire>
                          <FormControl
                            onKeyDown={ onlyNumber }
                            value={this.state.resTimeout}
                            onChange={this.handleInputChange('resTimeout')}
                          />
                        </VerifyInput>
                      </Col>
                    </FormGroup>
                  </Row>
                </Form>
              </div>
            ) : (
              <AddUser
                user={ this.state.authorizedUsers }
                role={ this.state.role }
                onDelete={ this.deleteSelectUser }
                onchangeType={ this.handleChangeType }
                onChiose={ this.handleChoiseUser }
              />
            )
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
              <div style={{display: 'inline-block'}}>
                <Button
                  onClick={this.changeStep(2)}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40, marginRight: 20}}>
                  下一步
                </Button>
                <Button
                  onClick={this.testURL}
                  colors="primary"
                  shape="squared"
                  style={{marginBottom: 40}}>
                  测试连接
                </Button>
              </div>
            ) : (
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
            )
          }
        </Modal.Footer>
      </Modal>
    )
  }
}

export default AddService;
