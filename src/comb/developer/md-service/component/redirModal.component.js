// publics
import {Component, PropTypes} from 'react'
import {
  Modal,
  Button,
  Table,
  Pagination,
  Message,
  Upload,
  Select,
  Switch,
  FormControl,
  InputGroup,
  Row,
  Col,
  Icon,
  FormGroup,
  Label,
  Dropdown,
  Navbar,
  Menu,
  Popconfirm
} from 'tinper-bee';
import { findDOMNode } from 'react-dom';
// self components
import withStyle from './withStyle.hoc'
import EditableCell from './tableCell.component'

// api
import {operation, listQ, checkstatus, udpate, addRedire, updateRedire} from '../../serves/middleare'


// static
import {STATE, PROPS, MILLISECS_IN_A_DAY} from '../const'
import './redirModal.css';

const matchTypeAry = [
  "URL",
  "cookie",
  "IP"
]

const typeAry = [
  "应用",
  "负载均衡",
  "IP"
]

const typeName = {
  'dev': '开发',
  'test': '测试',
  'AB': '灰度',
  'pro': '生产'
};

const Option = Select.Option;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

class RedirModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    hideModal: PropTypes.func,
    serviceType: PropTypes.string.isRequired,
    operation: PropTypes.func,
    optType: PropTypes.string,
    payLoad: PropTypes.array,
    data: PropTypes.array
  }

  static defaultProps = {
    show: false,
    hideModal: () => {
    },
    serviceType: '',
    operation: () => {
    },
    optType: '',
    data: []
  }
  state = {
    dataSource: "",
    dropItemValue: "请选择分类",
    descLen: true,
    strategyAry: [{
      name: '',
      url: '',
      type: 0,
      serverType: '',
      priority: '',
      proxypass: '',
      ip: '',
      edit: false
    }],
    typeIsFixed: false, //type是否不可变
    type: 0, //服务类型
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    let { show, data, payLoad, isAdd, appList } = nextProps;
    if(show){

      if(!isAdd){
        let selected, name;

        if(payLoad[0].proxypassType === 1){
          selected = data.filter((item) => {
            return item.id === payLoad[0].proxypass;
          });
          name = selected[0].ruleName
        }else{
          name = payLoad[0].proxypass;

        }
        this.setState({
          strategyAry: [{
            name: payLoad[0].ruleName,
            url: payLoad[0].matchKey,
            type: payLoad[0].proxypassType,
            serverType: `${typeAry[payLoad[0].proxypassType]}：${name}`,
            priority: payLoad[0].matchOrder,
            proxypass: payLoad[0].proxypass,
            edit: false
          }],
        });

        if(data.length !== 1){
          this.setState({
            type: data[0].matchType,
            typeIsFixed: true
          })
        }else{
          this.setState({
            type: data[0].matchType,
            typeIsFixed: false
          })
        }
      }else{
        if(data.length !== 0){
          this.setState({
            type: data[0].matchType,
            typeIsFixed: true
          })
        }else{
          this.setState({
            typeIsFixed: false
          })
        }
      }
    }
  }


  /**
   * 策略change事件
   */
  handleStrategyChange = (key, index) => {
    return (e) => {
      let {strategyAry} = this.state;
      strategyAry[index][key] = e.target.value;
      this.setState({
        strategyAry
      });
    }
  }

  /**
   * 添加策略
   */
  handlePlus = () => {
    let strategy = {
      name: '',
      url: '',
      type: '',
      priority: ''
    };
    let {strategyAry} = this.state;
    strategyAry.push(strategy);
    this.setState({
      strategyAry
    });
  }

  /**
   * 删除策略
   * @param index 要删除策略的索引
   */
  handleReduce = (index) => {
    return () => {
      let {strategyAry} = this.state;
      strategyAry.splice(index, 1);
      this.setState({
        strategyAry
      });
    }
  }

  /**
   * 下拉选中
   * @param state
   * @param index
   * @returns {function(*)}
   */
  handleStoreSelect = (state, index) => {
    return (value) => {
      let {strategyAry} = this.state;
      strategyAry[index][state] = value;
      this.setState({
        strategyAry
      });
    }
  }

  /**
   * 策略类型选择
   * @param value
   */
  handleTypeSelect = (value) => {
    this.setState({
      type: value
    })
  }



  /**
   * 菜单选中
   * @param index
   */
  handleSelect = (index) => {

    return ({ item, key, selectedKeys }) => {
      let { strategyAry } = this.state;
      if(item.props.belong === 'app'){

        strategyAry[index].serverType = `应用：${item.props.children}`;
        strategyAry[index].type = 0;
        strategyAry[index].proxypass = key;
        strategyAry[index].ip = '';
      }else if (item.props.belong === 'nginx'){
        strategyAry[index].serverType = `负载均衡：${item.props.children}`;
        strategyAry[index].type = 1;
        strategyAry[index].proxypass = key;
        strategyAry[index].ip = '';
      }else{
        strategyAry[index].serverType = `IP：`;
        strategyAry[index].type = 2;
        strategyAry[index].edit = true;
        strategyAry[index].proxypass = '';
      }
      this.setState({
        strategyAry
      })
    }
  }






  ensureIp = () => {
    this.setState({
      serverType: `IP：${this.state.ip}`,
      edit: false,
      ip: ''
    })
  }

  handleInputChange = (state) => {
    return (e) => {
      this.setState({
        [state]: e.target.value
      })
    }
  }

  handleVisibleChange = (state) => {

  }



  add = () => {
    let data = [];
    let error = false;
    let { insId, hideModal, refresh } = this.props;
    let { strategyAry, type } = this.state;
    strategyAry.forEach((item) => {
      let strategyObj = {
        "matchType": Number(type),
        "matchKey": item.url,
        "proxypass": item.proxypass,
        "proxypassType": Number(item.type),
        "matchOrder": Number(item.priority),
        "nginxInstId": insId,
        "ruleName": item.name
      };
      if(type === 2 && Number(item.type) === 2){
        error = true
      };
      data.push(strategyObj);
    });
    if(error){
      return Message.create({
        content: '当策略类型为IP时，后端服务类型不能同为IP。',
        color: 'warning',
        duration: 10
      });
    }

    addRedire({ entitys: data}).then((res) => {
      if(res.data.error_code){
        Message.create({
          content: res.data.error_message,
          color: 'danger',
          duration: null
        });

      }else{
        Message.create({
          content: res.data.message,
          color: 'success'
        });
        this.setState({
          strategyAry: [{
            name: '',
            url: '',
            type: 0,
            serverType: '',
            priority: '',
            proxypass: '',
            ip: '',
            edit: false
          }],
        })
        refresh();
        this.setState({
          strategyAry: [{
            name: '',
            url: '',
            type: 0,
            serverType: '',
            priority: '',
            proxypass: '',
            ip: '',
            edit: false
          }],
        })
      }
    });

    hideModal();
  }

  /**
   * 修改确认
   */
  edit = () => {
    let {insId, hideModal, refresh, payLoad} = this.props;
    let { strategyAry } = this.state;
    let obj = {
      "id": payLoad[0].id,
      "matchType": Number(this.state.type),
      "matchKey": strategyAry[0].url,
      "proxypass": strategyAry[0].proxypass,
      "proxypassType": strategyAry[0].type,
      "matchOrder": Number(strategyAry[0].priority),
      "nginxInstId": insId,
      "ruleName": strategyAry[0].name
    }

    updateRedire(obj).then((res) => {
      if (res.data.success === 'success') {
        Message.create({
          content: res.data.message,
          color: 'success'
        });
        this.setState({
          strategyAry: [{
            name: '',
            url: '',
            type: 0,
            serverType: '',
            priority: '',
            proxypass: '',
            ip: '',
            edit: false
          }],
        })
        refresh();
      } else {
        Message.create({
          content: res.data.message,
          color: 'danger',
          duration: null
        })
      }
    });

    hideModal();
  }

  /**
   * 确认输入的ip
   * @param index
   * @returns {function()}
   */
  handleEnsureIp = (index) => {
    return () => {
      let { strategyAry } = this.state;
      let value = strategyAry[index].proxypass;
      if(!/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\:\d{2,5}/.test(value)){
        return Message.create({
          content: '请填写正确的域名及端口号',
          color: 'warning',
          duration: 10
        })
      }
      strategyAry[index].serverType = `IP：${value}`;
      strategyAry[index].edit = false;
      this.setState({
        strategyAry
      })
    }
  }

  /**
   * 渲染菜单
   * @param index
   * @returns {XML}
   */
  renderMenu = (index) => {
    let { appList } = this.props;
    return (
      <Menu
        vertical
        onSelect={this.handleSelect(index)}>
        <SubMenu key="app" title="应用"  disabled={appList.length === 0}>
          {
            appList.map((item) => {

              return <MenuItem key={item.app_id} belong="app" >
                { item.app_type ? `${item.name}-${typeName[item.app_type]}` : item.name }
              </MenuItem>
            })
          }
        </SubMenu>
        <SubMenu key="nginx" title="负载均衡" disabled={this.props.data.length === 0}>
          {
            this.props.data.map((item) => {
              return <MenuItem key={item.insId} belong="nginx">
                { item.ruleName }
              </MenuItem>
            })
          }
        </SubMenu>
        <MenuItem key="ip" belong="ip">
          <span style={{ color: '#0084ff'}}>点击输入IP地址</span>
        </MenuItem>
      </Menu>
    )
  }


  render() {

    const {show, hideModal, operation, payLoad, optType, style, isAdd} = this.props;

    return (
      <Modal style={{width: 900}}
             show={show}
             containerClassName="redir-modal"
             size="lg"
             onHide={hideModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>添加转发策略</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <form style={style.main} onSubmit={this.handleCreateSrv}>
              <Row style={style.head}>
                <Col sm={2} className="head-name">
                  <span>策略名称</span>
                </Col>
                <Col sm={2} className="head-name">
                  <span>策略类型</span>
                </Col>
                <Col sm={2} className="head-url">
                  <span>转发规则</span>
                </Col>
                <Col sm={3} className="head-type">
                  <span>后端服务类型</span>
                </Col>
                <Col sm={2} className="head-level">
                  <span>优先级</span>
                </Col>
              </Row>

              {
                this.state.strategyAry.map((item, index, array) => {
                  return (
                    <Row key={index} style={style.content}>

                      <Col sm={2} className="head-name">
                        <FormControl
                          value={item.name}
                          onChange={ this.handleStrategyChange('name', index)}
                        />
                      </Col>
                      <Col sm={2} className="head-type">
                        <Select
                          placeholder="请选择分类"
                          disabled={ this.state.typeIsFixed}
                          value={ matchTypeAry[this.state.type] }
                          dropdownStyle={{zIndex: 2000}}
                          onChange={this.handleTypeSelect}>
                          <Option value={1}>cookie</Option>
                          <Option value={2}>IP</Option>
                          <Option value={0}>URL</Option>
                        </Select>
                      </Col>
                      <Col sm={2} className="head-url">
                        <FormControl
                          value={item.url}
                          onChange={ this.handleStrategyChange('url', index)}
                        />
                      </Col>
                      <Col sm={3} className="head-type">
                        <Dropdown
                          trigger={['click']}
                          overlay={this.renderMenu(index)}
                          animation="slide-up"
                          overlayStyle={{zIndex: 2000}}
                          overlayClassName='redir-dropdown'
                          onVisibleChange={this.handleVisibleChange}
                        >
                          <FormControl
                            value={ item.serverType }
                            placeholder="请选择分类"
                          />
                        </Dropdown>
                      </Col>
                      <Col sm={2} className="head-level">
                        <FormControl
                          value={item.priority}
                          onChange={ this.handleStrategyChange('priority', index)}
                        />
                      </Col>
                      <Col sm={1}>
                        {
                          isAdd ? (
                            <span className="control">
                          {
                            index === array.length - 1 ? (
                              <Icon
                                type="uf-add-c-o"
                                style={{color: "#0084ff", fontSize: 24}}
                                onClick={ this.handlePlus}
                              />
                            ) : (
                              <Icon
                                type="uf-reduce-c-o"
                                style={{color: "#0084ff", fontSize: 24}}
                                onClick={this.handleReduce(index)}
                              />
                            )
                          }
                        </span>
                          ) : ""
                        }

                      </Col>
                      {
                        item.edit ? (
                          <Col smOffset={4} sm={8}>
                            <Col sm={3}>
                              <Label>填写IP地址</Label>
                            </Col>
                            <Col sm={6}>
                              <FormControl
                                value={item.proxypass}
                                onChange={ this.handleStrategyChange('proxypass', index)}
                              />
                            </Col>
                            <Col sm={3}>
                              <Button colors="primary" onClick={ this.handleEnsureIp(index) }>确定</Button>
                            </Col>
                          </Col>
                        ) : ""
                      }
                    </Row>
                  )
                })
              }


              <Row className="head padding-40" style={style.message}>
                <Col md={12} xs={12} sm={12} style={style.messageContent}>
                  {
                    this.state.type === 0 ? (
                      <ul>
                        <li>
                          <span>根据URL转发：</span>
                          <p className="padding-left-30"> -根据用户请求中的URL和所设置的规则URL是否匹配进行转发。</p>
                          <p className="padding-left-30"> -支持简单的正则表达式，采用LUA的正则表达式规则。</p>
                          <p className="padding-left-30"> -注意："%"用作特殊符号的转义字符，^$()%.[]*+-?等为特殊字符。</p>
                        </li>
                        <li>
                          <span> 示例1：</span>
                          <p className="padding-left-30">
                            简单匹配
                          </p>
                          <p className="padding-left-30">
                            配置示例：/confcenter
                          </p>
                          <p className="padding-left-30">
                            符合规则的请求URL示例为：/confcenter/login.jsp、/confcenter/login.js、/confcenter/index.html等。
                          </p>
                        </li>
                        <li>
                          <span> 示例2：</span>
                          <p className="padding-left-30">
                            模糊匹配
                          </p>
                          <p className="padding-left-30">
                            配置示例：(%w+)%.png
                          </p>
                          <p className="padding-left-30">
                            符合规则的请求URL示例为：/confcenter/images/login.png、/confcenter/images/index01.png。
                          </p>
                        </li>

                      </ul>
                    ) : ""
                  }
                  {
                    this.state.type === 1 ? (
                      <ul>
                        <li>
                          <span> 根据Cookie转发：</span>
                          <p className="padding-left-30">
                            -根据用户请求中的Cookie键值对和所设置的规则中的Cookie字符串是否匹配进行转发。
                          </p>
                          <p className="padding-left-30">
                            -不支持多Cookie配置。
                          </p>

                        </li>
                        <li>
                          <span>示例：</span>
                          <p className="padding-left-30">
                            配置示例：username=user1
                          </p>
                          <p className="padding-left-30">
                            符合规则的请求为：请求中Cookies中包含username且Cookie值为user1的请求可以配置转发规则。
                          </p>
                          <p className="padding-left-30">
                            说明：可以配置多条规则，并设置顺序。
                          </p>
                        </li>
                      </ul>
                    ) : ""
                  }
                  {
                    this.state.type === 2 ? (
                      <ul>
                        <li>
                          <span>根据客户端IP转发：</span>
                          <p className="padding-left-30">
                            根据用户客户端的IP地址进行转发，客户端的IP地址和配置规则中的IP一致，才转发服务。
                          </p>
                        </li>
                        <li>
                          <span> 示例：</span>
                          <p className="padding-left-30">
                            配置示例：192%.168%.32%.[%d+]
                          </p>
                          <p className="padding-left-30">
                            符合规则的请求为：来自192.168.32段的客户端访问的请求。
                          </p>
                          <p className="padding-left-30">
                            说明：可以配置多条规则，并设置顺序。
                          </p>
                        </li>

                      </ul>
                    ) : ""
                  }

                </Col>

              </Row>
              <div className="text-center marginTop-20" style={style.messagefoot}>
                <Button
                  style={Object.assign({}, style.btn, style.btnCancel)}
                  onClick={hideModal}
                >
                  取消
                </Button>
                {
                  isAdd ? (
                    <Button
                      style={Object.assign({}, style.btn, style.btnOk)}
                      colors="primary"
                      onClick={this.add}
                    >
                      添加
                    </Button>
                  ) : (
                    <Button
                      style={Object.assign({}, style.btn, style.btnOk)}
                      colors="primary"
                      onClick={this.edit}
                    >
                      修改
                    </Button>
                  )
                }

              </div>
            </form>
          </div>
        </Modal.Body>

        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    )
  }
}


export default withStyle(() => ({
  btn: {
    marginRight: 10,
    width: 100
  },
  head: {
    padding: '0 40px'
  },
  content: {
    padding: '0 40px'
  },
  message: {
    borderRadius: 3
  },
  select: {
    zIndex: 2000
  },
  ipcontent: {
    padding: '0 40px',
    marginTop: 20
  },
  messagefoot: {},
  messageContent: {
    backgroundColor: '#f8f8f8',
    padding: '20px 30px',
    border: '1px solid #ededed'
  }

}))(RedirModal)
