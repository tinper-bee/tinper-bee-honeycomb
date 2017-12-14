import React,{Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Row,Button,Switch,Message,ProgressBar,Col,Tile,Select ,InputNumber} from 'tinper-bee';
import './index.css';
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import a11 from '../../assets/img/a11.png';
import a22 from '../../assets/img/a22.png';
import Slider from 'rc-slider';
import Tooltip  from 'rc-tooltip';
import UpdownSelect from './UpdownSelect';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    var odiv=document.getElementById("choseTitle");
    if(odiv){
        if (t > 0) {
            odiv.style.top=0;
        } else {
            odiv.style.top="63px";
        }
    }
}
class BuyServer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverIndex:0,
            selectIndex: 0,
            specsIndex: 0,
            timesIndex:0,
            purchasesIndex:0,
            serves: [//服务商
                {
                    imageName: a11,
                    code: 'hwy',
                    name: "阿里云服务商",
                    defaultBorder: "1px solid #cccccc",
                    updataBorder:"1px solid #008BFA"
                },
                {
                    imageName: a22,
                    code: 'aly',
                    name: "华为云服务商",
                    defaultBorder: "1px solid #cccccc",
                    updataBorder:"1px solid #008BFA"
                }
            ],
            areas: [//地区
                {
                    name: '华北1区',
                    code: 'hb1q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北2区',
                    code: 'hb2q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北3区',
                    code: 'hb3q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北1区',
                    code: 'hb1q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北2区',
                    code: 'hb2q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北3区',
                    code: 'hb3q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"

                },
                {
                    name: '华北1区',
                    code: 'hb1q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北2区',
                    code: 'hb2q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北3区',
                    code: 'hb3q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北4区',
                    code: 'hb4q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北5区',
                    code: 'hb35q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北6区',
                    code: 'hb6q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                },
                {
                    name: '华北7区',
                    code: 'hb7q',
                    isActive: false,
                    defaultBg: "#fff",
                    choseBg: "#008BFA"
                }
            ],
            specs: [//规格
                {
                    name: '紧凑型 xn4',
                    cpu: '1核',
                    memory: '1GB',
                    disk: '30GB',
                    defaultBorder: "1px solid #cccccc",
                    defaultBg: "#cccccc",
                    defaultColor: "#333",
                    updataBorder: "1px solid #008BFA",
                    updataBg: "#008BFA",
                    updataColorTitle: "#fff",
                    updataColor: "#008BFA"
                },
                {
                    name: '通用型 n1',
                    cpu: '2核',
                    memory: '3GB',
                    disk: '40GB',
                    defaultBorder: "1px solid #cccccc",
                    defaultBg: "#cccccc",
                    defaultColor: "#333",
                    updataBorder: "1px solid #008BFA",
                    updataBg: "#008BFA",
                    updataColorTitle: "#fff",
                    updataColor: "#008BFA"
                },
                {
                    name: '通用型 n2',
                    cpu: '2核',
                    memory: '4GB',
                    disk: '30GB',
                    defaultBorder: "1px solid #cccccc",
                    defaultBg: "#cccccc",
                    defaultColor: "#333",
                    updataBorder: "1px solid #008BFA",
                    updataBg: "#008BFA",
                    updataColorTitle: "#fff",
                    updataColor: "#008BFA"
                },
                {
                    name: '通用型 n4',
                    cpu: '4核',
                    memory: '8GB',
                    disk: '40GB',
                    defaultBorder: "1px solid #cccccc",
                    defaultBg: "#cccccc",
                    defaultColor: "#333",
                    updataBorder: "1px solid #008BFA",
                    updataBg: "#008BFA",
                    updataColorTitle: "#fff",
                    updataColor: "#008BFA"
                }
            ],
            mirrors: [//镜像
                {
                    name: '请选择操作系统类型',
                    code: '1',
                    option: ["option1", "option2", "option3"]
                },
                {
                    name: '请选择版本',
                    code: '2',
                    option: ["option1", "option2", "option3"]
                }
            ],
            versions: [//版本
                {
                    name: '版本1',
                    code: '1'
                },
                {
                    name: '版本2',
                    code: '2'
                },
                {
                    name: '版本3',
                    code: '3'
                },
                {
                    name: '版本4',
                    code: '4'
                }
            ],
            networks: [//网络类型
                {
                    name: '公有网络',
                    code: '1'
                },
                {
                    name: '专有网络',
                    code: '2'
                }
            ],
            times: [//使用期限
                {
                    name: '1个月',
                    code: '1',
                    defaultBg: "#fff",
                    updataBg: "#008BFA",


                },
                {
                    name: '2个月',
                    code: '2',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '3个月',
                    code: '3',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '4个月',
                    code: '4',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '5个月',
                    code: '5',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '6个月',
                    code: '6',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },

                {
                    name: '7个月',
                    code: '7',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '8个月',
                    code: '8',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '9个月',
                    code: '9',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '10个月',
                    code: '10',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '11个月',
                    code: '11',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '12个月',
                    code: '12',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '1年',
                    code: '1year',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '2年',
                    code: '2year',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '3年',
                    code: '3year',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '4年',
                    code: '4year',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                },
                {
                    name: '5年',
                    code: '5year',
                    defaultBg: "#fff",
                    updataBg: "#008BFA"
                }
            ],
            purchases: [
                {//购买量
                    name: '1台',
                    code: '1',
                    defaultColor:"#333",
                    defaultBg:"#fff",
                    updataColor:"#fff",
                    updataBg:"#008BFA"
                },
                {//购买量
                    name: '2台',
                    code: '2',
                    defaultColor:"#333",
                    defaultBg:"#fff",
                    updataColor:"#fff",
                    updataBg:"#008BFA"
                },
                {//购买量
                    name: '3台',
                    code: '3',
                    defaultColor:"#333",
                    defaultBg:"#fff",
                    updataColor:"#fff",
                    updataBg:"#008BFA"
                },
                {//购买量
                    name: '4台',
                    code: '4',
                    defaultColor:"#333",
                    defaultBg:"#fff",
                    updataColor:"#fff",
                    updataBg:"#008BFA"
                },
                {//购买量
                    name: '5台',
                    code: '5',
                    defaultColor:"#333",
                    defaultBg:"#fff",
                    updataColor:"#fff",
                    updataBg:"#008BFA"
                },
            ],

            serve: {
                name: '阿里云服务商',
                code: 'hwy'
            },
            area: {
                name: '华北1区',
                code: 'hb1q'
            },
            spec: {
                name: '紧凑型',
                cpu: '1核',
                memory: '1GB',
                disk: '30GB'
            },
            version: {
                name: '版本1',
                code: '1'
            },
            network: {
                name: '公有网络',
                code: '1'
            },
            purchase: {//购买量
                name: '1台',
                code: '1'
            },
            time: {//使用期限
                name: '1个月',
                code: '1'
            },
            price: '12,345',
            updataAreaColor: {"name": '#008BFA'}

        };
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        //请求接口，设置state
    }

    handle = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={value}
                visible={dragging}
                placement="top"
                key={index}
                >
                <Handle {...restProps} />
            </Tooltip>
        );
    }

    back() {
        window.location.hash = '#/';
    }

    clearText = (state, key) => {
        return () => {
            let data = this.state[state];
            data["name"] = "";
            switch (state) {
                case 'serve':
                    this.setState({
                        [state]: data,
                        serverIndex: -1
                    });
                    break;
                case "area":
                    this.setState({
                        [state]: data,
                        selectIndex: -1

                    });
                    break;
                case 'spec':
                    this.setState({
                        [state]: data,
                        specsIndex: -1
                    });
                    break;
                case 'time':
                    this.setState({
                        [state]: data,
                        timesIndex: -1
                    });
                    break;
                case 'purchase':
                    this.setState({
                        [state]: data,
                        purchasesIndex: -1
                    });
                    break;
                default:
                    break;
            }
        }
    }
    addText = (obj, key, obj2, obj2Index) => {
        return () => {
            let data = this.state[obj];
            data["name"] = key["name"];
            switch (obj2) {
                case 'areas':
                    this.setState({
                        [obj]: data,
                        selectIndex: obj2Index
                    })
                    break;
                case "specs":
                    this.setState({
                        [obj]: data,
                        specsIndex: obj2Index
                    })
                    break;
                case 'serves':
                    this.setState({
                        [obj]: data,
                        serverIndex: obj2Index
                    })
                    break;
                case 'times':
                    this.setState({
                        [obj]: data,
                        timesIndex: obj2Index
                    })
                    break
                case 'purchases':
                    this.setState({
                        [obj]: data,
                        purchasesIndex: obj2Index
                    })
                    break;
                default:
                    break;
            }


        }
    }

    render() {
        return (
            <Row className="buy-e">
                <div className="head">
                    <span className="back" onClick={this.back}>
                        <i className="cl cl-arrow-left"> </i>
                        我的资源池
                    </span>
                    <span className="head-title">
                        购买服务器
                    </span>
                </div>
                <div className="buy-e-t">
                    <div className="top clearfix" id="choseTitle">
                        <div className="left">
                            <span className="title">
                                已选配置
                            </span>
                            <ul className="selected clearfix">
                                <li>
                                    服务商
                                    <p>
                                        <span>{this.state.serve.name}
                                            <i className="cl cl-bigclose-o"
                                               onClick={this.clearText('serve','name')}/></span>
                                    </p>
                                </li>
                                <li>
                                    地区
                                    <p>
                                        <span>{this.state.area.name} <i className="cl cl-bigclose-o"
                                                                        onClick={this.clearText('area','name')}/></span>
                                    </p>
                                </li>
                                <li>
                                    实例规格
                                    <p>
                                        <span>{this.state.spec.name} <i className="cl cl-bigclose-o"
                                                                        onClick={this.clearText('spec','name')}/></span>
                                    </p>
                                </li>
                                <li>
                                    网络
                                    <p>
                                        <span>{this.state.network.name} <i className="cl cl-bigclose-o"
                                                                           onClick={this.clearText('network','name')}/></span>
                                    </p>
                                </li>
                                <li>
                                    购买量
                                    <p>
                                        <span>{this.state.purchase.name} <i className="cl cl-bigclose-o"
                                                                            onClick={this.clearText('purchase','name')}/></span>
                                    </p>
                                </li>
                                <li>
                                    使用期限
                                    <p>
                                        <span>{this.state.time.name} <i className="cl cl-bigclose-o"
                                                                        onClick={this.clearText('time','name')}/></span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className="right clearfix">
                            <span className="title">
                                价格
                            </span>
                            <span className="need-know">
                                <a href="">购买须知>></a>
                            </span>

                            <p>
                                <span className="unit">￥</span>
                                <span className="price">
                                    {this.state.price}
                                </span>
                            </p>

                            <p>
                                <Button>确认订单</Button>
                            </p>
                        </div>
                    </div>
                    <div className="buy-e-t-down clearfix padding-horizontal-20">
                        <div className="server-person-out border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className='left-show'>服务提供商</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <div className='server-producter right-show'>
                                        <ul className="clearfix">
                                            {
                                                this.state.serves.map((item, index)=> {
                                                    return (
                                                        this.state.serverIndex == index ? (
                                                            <li className="padding-horizontal-10"
                                                                onClick={this.addText('serve',item,'serves',index)}>
                                                                <img src={item.imageName} height="60px"
                                                                     style={{border:this.state.serves[index].updataBorder}}/>
                                                            </li>
                                                        ) :
                                                            (
                                                                <li className="padding-horizontal-10"
                                                                    onClick={this.addText('serve',item,'serves',index)}>
                                                                    <img src={item.imageName} height="60px"
                                                                         style={{border:this.state.serves[index].defaultBorder}}/>
                                                                </li>
                                                            )

                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="areas-out border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className=''>地区</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <div className=''>
                                        <ul className="clearfix">
                                            {
                                                this.state.areas.map((item, index)=> {
                                                    return (
                                                        this.state.selectIndex == index ? (
                                                            <li className="padding-horizontal-10 margin-vertical-10"
                                                                onClick={this.addText('area',item,'areas',index)}>
                                                                <Button
                                                                    style={{background:this.state.areas[index].choseBg}}>
                                                                    {item.name}
                                                                </Button>
                                                            </li>
                                                        ) :
                                                            (
                                                                <li className="padding-horizontal-10 margin-vertical-10"
                                                                    onClick={this.addText('area',item,'areas',index)}>
                                                                    <Button
                                                                        style={{background:this.state.areas[index].defaultBg}}>
                                                                        {item.name}
                                                                    </Button>
                                                                </li>
                                                            )

                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                </Col>
                            </Row>
                        </div>

                        <div className="specs-out border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className=''>实例规格</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <div className='guige'>
                                        <ul className="clearfix">
                                            {
                                                this.state.specs.map((item, index)=> {
                                                    return (

                                                        this.state.specsIndex == index ? (
                                                            <li className="padding-horizontal-10">
                                                                <div className="guigeWraper"
                                                                     style={{border:this.state.specs[index].updataBorder}}
                                                                     onClick={this.addText('spec',item,'specs',index)}>
                                                                    <div className="guige-title"
                                                                         style={{background:this.state.specs[index].updataBg,color:this.state.specs[index].updataColorTitle}}>{item.name} </div>
                                                                    <div className="guige-main">
                                                                        <Row
                                                                            className="margin-horizontal-0 padding-bottom-10">
                                                                            <Col md={4} xs={4} sm={4}
                                                                                 className="padding-horizontal-0">
                                                                                <div className="padding-vertical-10">cpu
                                                                                </div>
                                                                                <div
                                                                                    className="guige-border-right-style"
                                                                                    style={{color:this.state.specs[index].updataColor}}>{item.cpu}</div>
                                                                            </Col>
                                                                            <Col md={4} xs={4} sm={4}
                                                                                 className="padding-horizontal-0">
                                                                                <div className="padding-vertical-10">内存
                                                                                </div>
                                                                                <div
                                                                                    className="guige-border-right-style"
                                                                                    style={{color:this.state.specs[index].updataColor}}>{item.memory}</div>
                                                                            </Col>
                                                                            <Col md={4} xs={4} sm={4}
                                                                                 className="padding-horizontal-0">
                                                                                <div className="padding-vertical-10">系统盘
                                                                                </div>
                                                                                <div
                                                                                    style={{color:this.state.specs[index].updataColor}}>{item.disk}</div>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ) :
                                                            (
                                                                <li className="padding-horizontal-10">
                                                                    <div className="guigeWraper"
                                                                         style={{border:this.state.specs[index].defaultBorder}}
                                                                         onClick={this.addText('spec',item,'specs',index)}>
                                                                        <div className="guige-title"
                                                                             style={{background:this.state.specs[index].defaultBg,color:this.state.specs[index].defaultColor}}>{item.name} </div>
                                                                        <div className="guige-main">
                                                                            <Row
                                                                                className="margin-horizontal-0 padding-bottom-10">
                                                                                <Col md={4} xs={4} sm={4}
                                                                                     className="padding-horizontal-0">
                                                                                    <div
                                                                                        className="padding-vertical-10">
                                                                                        cpu
                                                                                    </div>
                                                                                    <div
                                                                                        className="guige-border-right-style"
                                                                                        style={{color:this.state.specs[index].defaultColor}}>{item.cpu}</div>
                                                                                </Col>
                                                                                <Col md={4} xs={4} sm={4}
                                                                                     className="padding-horizontal-0">
                                                                                    <div
                                                                                        className="padding-vertical-10">
                                                                                        内存
                                                                                    </div>
                                                                                    <div
                                                                                        className="guige-border-right-style"
                                                                                        style={{color:this.state.specs[index].defaultColor}}>{item.memory}</div>
                                                                                </Col>
                                                                                <Col md={4} xs={4} sm={4}
                                                                                     className="padding-horizontal-0">
                                                                                    <div
                                                                                        className="padding-vertical-10">
                                                                                        系统盘
                                                                                    </div>
                                                                                    <div
                                                                                        style={{color:this.state.specs[index].defaultColor}}>{item.disk}</div>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )


                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                </Col>
                            </Row>
                        </div>

                        <div className="mirrors-out border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className=''>镜像</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <div className='mirrors'>
                                        <ul className="clearfix">
                                            {
                                                this.state.mirrors.map((item, index)=> {
                                                    return (
                                                        <li className="padding-horizontal-10">
                                                            <div className=''>
                                                                <Select placeholder={item.name}>
                                                                    <Option
                                                                        value={item.option[0]}>{item.option[0]}</Option>
                                                                    <Option
                                                                        value={item.option[1]}>{item.option[1]}</Option>
                                                                    <Option
                                                                        value={item.option[2]}>{item.option[2]}</Option>
                                                                </Select>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                </Col>
                            </Row>
                        </div>

                        <div className="networks-out border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className=''>网络</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <Row className="margin-horizontal-0 padding-bottom-10">
                                        <Col md={2} xs={2} sm={2} className="padding-horizontal-0">
                                            <div className="padding-vertical-10">网络类型</div>
                                            <div className="margin-top-20">宽带:</div>
                                        </Col>
                                        <Col md={9} xs={9} sm={9} className="padding-horizontal-0">
                                            <div className="loadWraper pull-left">
                                                <div className="padding-vertical-10">专有网络</div>
                                                <div className="text-right clearfix margin-top-10">
                                                    <span className="pull-left width-0"> 0</span>
                                                    <span className="pull-left width-50-load"> 50</span>
                                                    <span className="pull-left width-50-load"> 100</span>
                                                    <span className="pull-left width-50-load"> 150</span>
                                                    <span className="pull-left width-last-load"> 200</span>
                                                </div>
                                                <Slider min={0} max={200} defaultValue={50} handle={this.handle}
                                                        className="reset-icon-borderRadio margin-bottom-30"/>
                                            </div>
                                            <div className="pull-left updownWraper">
                                                qdqw <UpdownSelect />
                                            </div>
                                            <div className="clearFixedr">
                                                系统会分配公网 IP (不能解绑)。若无需分配 IP 或 单独购买弹性公网 IP 访问公网，请选择带宽值 0M。
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <div className="times border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className=''>使用期限</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <div className=''>
                                        <ul className="clearfix times-show">
                                            {
                                                this.state.times.map((item, index)=> {
                                                    return (
                                                    this.state.timesIndex == index ? (
                                                        <li className="padding-horizontal-10 margin-vertical-10"  onClick={this.addText('time',item,'times',index)}>
                                                            <Button  style={{background:this.state.times[index].updataBg}}>
                                                                {item.name}
                                                            </Button>
                                                        </li>
                                                    ) :
                                                        (
                                                            <li className="padding-horizontal-10 margin-vertical-10"  onClick={this.addText('time',item,'times',index)}>
                                                                <Button  style={{background:this.state.times[index].defaultBg}}>
                                                                    {item.name}
                                                                </Button>
                                                            </li>
                                                        )
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                </Col>
                            </Row>
                        </div>

                        <div className="purchases-out border-bottom-style padding-vertical-30">
                            <Row>
                                <Col md={2} xs={2} sm={2}>
                                    <div className=''>购买量</div>
                                </Col>
                                <Col md={10} xs={10} sm={10}>
                                    <div className='purchases-show'>
                                        <ul className="clearfix">
                                            {
                                                this.state.purchases.map((item, index)=> {
                                                    return (
                                                    this.state.purchasesIndex == index ? (
                                                        <li className="padding-horizontal-10"  onClick={this.addText('purchase',item,'purchases',index)}>
                                                            <Button  style={{background:this.state.purchases[index].updataBg,color:this.state.purchases[index].updataColor}}>
                                                                {item.name}
                                                            </Button>
                                                        </li>
                                                    ) :
                                                        (
                                                            <li className="padding-horizontal-10"  onClick={this.addText('purchase',item,'purchases',index)}>
                                                                <Button  style={{background:this.state.purchases[index].defaultBg,color:this.state.purchases[index].defaultColor}}>
                                                                    {item.name}
                                                                </Button>
                                                            </li>
                                                        )
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="foot margin-vertical-50">
                    <div className="center-block foot-wrap">
                        <Button className="order-ok padding-vertical-5">确认订单</Button>
                        <Button className="order-cancel padding-vertical-5 margin-left-20">取消</Button>
                    </div>
                </div>
            </Row>
        )
    }
}
export default BuyServer;
