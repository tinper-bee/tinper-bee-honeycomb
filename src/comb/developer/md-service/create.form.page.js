import {Component} from 'react'
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
    Row,
    Col,
    FormGroup,
    Label,
    Icon,
    Navbar,
    Menu,
    Dropdown,
    Popconfirm
} from 'tinper-bee';
import {Link, withRouter} from 'react-router'
import VerifyInput from '../components/verifyInput/index'
import Header from './component/header.component'
import ConfPanel from './component/confPanel.component'
import withStyle from './component/withStyle.hoc'
import Password from './component/password.component'
import PageLoad from './component/pageLoading.component'

import styles from './index.css';
import {PROPS, logo, serviceConf} from './const'

import {createService, maxInsNum, listQ} from '../serves/middleare'
import {randomString} from './util'


const SubMenu = Menu.SubMenu;

const WrappedHeader = withRouter(Header);
const STORAGE_TYPE = 'mysql';
class CreateFormPage extends Component {
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
            time: 0,
            clicked: false,
            autoPW: false,
            loading: true,
            dropItemValue: "first",
            isEdit: false,
            editValue: ''
        };
    }

    errStatus = {
        srvPassword: false,
        srvPasswordBack: false,
        databaseName: false,
        descLen: true,
    }

    componentDidMount() {
        maxInsNum(STORAGE_TYPE)
            .then(data => {
                const limit = data.message;
                listQ({size: 0, index: 0}, STORAGE_TYPE)
                    .then(data => {
                        const has = parseInt(data.totalElements);
                        this.setState({loading: false});

                        if (has < limit) {
                            // this.setState({ forbidden: false })
                        } else {
                            this.props.router.replace(`/limit?limit=${limit}&type=${STORAGE_TYPE}`);
                        }
                    })
                    .catch((error) => {
                        this.props.router.goBack();
                    })
            })
            .catch((error) => {
                console.log(error.message)
                console.log(error.stack)
                this.props.router.goBack();
            })


    }

    /*handleClickItem(key){
     alert("Aa");
     return  (e)=>{
     this.setState({
     dropItemValue: "ww"
     })
     }
     }
     */

    /**
     * 输入框改变
     * @param e
     */
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({
            editValue: value
        });
    }

    /**
     * 输入确认
     */
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }

    /**
     * 输入框回车确认
     * @param event
     */
    handleKeydown = (event) => {

        if(event.keyCode === 13){
            this.check();
        }

    }

    /**
     * 点击编辑
     */
    handleEdit = (e) => {
        this.setState({
            isEdit: true
        })
        e.stopPropagation();
    }

    handleClickItem = () => {
        this.setState({
            dropItemValue: "ww"
        })
    }

    handleClickPopconfirm = (e) => {

    }

    render() {
        const {style} = this.props;

        const onClick = function ({key}) {
            message.info(`Click on item ${key}`);
        };
        const menu = (
            <Menu>
                <SubMenu title="sub menu" onClick={
                    this.handleClickItem }>
                    <Menu.Item>3d menu item</Menu.Item>
                    <Menu.Item>4th menu item</Menu.Item>
                </SubMenu>
                <SubMenu title="sub menu" onClick={
                    this.handleClickItem }>
                    <Menu.Item>3d menu item</Menu.Item>
                    <Menu.Item>4th menu item</Menu.Item>
                </SubMenu>
                <Menu.Item>
                    {
                        this.state.isEdit ? (
                            <div className="editable-cell-input-wrapper">
                                <FormControl
                                    value={this.state.editValue}
                                    onChange={this.handleChange}
                                    onKeyDown = {this.handleKeydown}
                                />
                                <Icon
                                    type="uf-correct"
                                    className="editable-cell-icon-check"
                                    onClick={this.check}
                                />
                            </div>
                        ) : (
                            <span onClick={ this.handleEdit }>请点击输入</span>
                        )
                    }


            </Menu.Item>
            </Menu>
        );

        if (this.state.loading) {
            return <PageLoad show={this.state.loading}/>
        } else {
            return (
                <div style={{height: '100%'}}>
                    <form style={style.main} onSubmit={this.handleCreateSrv}>
                        <div className="clearFixedr">
                            <div style={style.label}>
                                <span className="markHolder">*</span>
                                添加转发策略
                            </div >
                        </div>

                        <Row className="head">
                            <Col md={11} xs={11} sm={11} className="">
                                <Row className="head">
                                    <Col md={3} xs={3} sm={3} className="head-name">
                                        <span>策略名称</span>
                                    </Col>
                                    <Col md={3} xs={3} sm={3} className="head-url">
                                        <span>转发规则（URL）</span>
                                    </Col>
                                    <Col md={3} xs={3} sm={3} className="head-type">
                                        <span>类型</span>
                                    </Col>
                                    <Col md={3} xs={3} sm={3} className="head-level">
                                        <span>优先级</span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={1} xs={1} sm={1} className="head-url">

                            </Col>
                        </Row>

                        <Row className="head">
                            <Col md={11} xs={11} sm={11} className="">
                                <Row className="head">
                                    <Col md={3} xs={3} sm={3} className="head-name">
                                        <FormControl ref="userName"/>
                                    </Col>
                                    <Col md={3} xs={3} sm={3} className="head-url">
                                        <FormControl ref="userName"/>
                                    </Col>
                                    <Col md={3} xs={3} sm={3} className="head-type">
                                        <Dropdown overlay={menu}>
                                            <button className="ant-dropdown-link">
                                                {this.state.dropItemValue}
                                            </button>
                                        </Dropdown>
                                    </Col>
                                    <Col md={3} xs={3} sm={3} className="head-level">
                                        <FormControl ref="userName"/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={1} xs={1} sm={1} className="head-url">

                            </Col>
                        </Row>
                        <Row className="head">
                            <Col md={12} xs={12} sm={12} className="">
                                <ul>
                                    <li>
                                        <h4> * 域名规范：</h4>
                                        <p> 只能使用字母、数字、‘-’、‘.’，只支持以下两种形式的domain形式</p>
                                        <p> -标准域名：www.developertest.yonyou.com;</p>
                                        <p> -泛解析域名：*.developertest.yonyou.com，*一定在第一个字符，并且是 *. 的格式，*不能在最后。</p>
                                    </li>
                                    <li>
                                        <h4> * URL规范：</h4>
                                        <p> 长度限制为2-80个字符，只能使用字母、数字、‘-’、‘／’、‘.’、‘%’、‘?’、‘#’、‘&’这些字符；</p>
                                        <p> URL不能只为／，但必须以／开头。</p>
                                    </li>
                                    <li>
                                        <h4> * 域名与URL请至少填写一项。</h4>
                                    </li>

                                </ul>
                            </Col>

                        </Row>
                        <div className="srv-ctr">
                            <Button style={Object.assign({}, style.btn, style.btnOk)}
                                    type='submit'
                            >
                                添加
                            </Button>
                            <Button style={Object.assign({}, style.btn, style.btnCancel)}
                                    onClick={(e) => {
                                        this.props.router.goBack()
                                    }}
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
        float: 'left'
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
}))(CreateFormPage)
