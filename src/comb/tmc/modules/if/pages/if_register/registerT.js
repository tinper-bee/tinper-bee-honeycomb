import React, { Component } from "react";
import './index.less';
import Formregister from '../../containers/form_register';
import Registerupload from '../../containers/registerupload';
import Modalimg from '../../containers/modalimg/index';
import Ajax from '../../../../utils/ajax';
import Upload from 'bee-upload';
//上传upload
import {
    Row,
    Col,
    Button,
    FormGroup,
    Select,
    Message
} from 'tinper-bee';
//  时间 
import Form from 'bee-form';
import FormControl from 'bee-form-control';
const FormItem = Form.FormItem;
import DatePicker from 'bee-datepicker';
import CitySelect from 'bee-city-select';
import { Link } from 'react-router';
import idPic1 from '../../../../static/images/if/bick.png';
import idPic2 from '../../../../static/images/if/pick.png';
import codeimg1 from '../../../../static/images/if/004.jpg';
import codeimg from '../../../../static/images/if/003.jpg';
import zhCN from "rc-calendar/lib/locale/zh_CN";
import enUS from "rc-calendar/lib/locale/en_US";
import moment from "moment";
const format = "YYYY-MM-DD";
const dateInputPlaceholder = "选择日期";
const flag = false;
const rootURL = window.reqURL.fm + "fm/";
export default class RegisterT extends Component {
    constructor() {
        super();
        this.state = {
            stepcurrent: 2,
            cNName: '',//企业名称 
            idNo: '',//  组织机构代码
            regId: '',//  注册登记号
            limitDate: '',//注册期限
            capReg: '',//注册资本
            trdCodename:'',
            trdCode1: '',
            trdCode: [], //行业代码 （所属行业）
            corpName: '',//法人代表姓名  （法人姓名）
            legalPhone: '',//法人联系电话
            legPerId: '',//法人证件号   
            corpIdCardLimitDate: '',//法人证件到期日
            cfoName: '',//财务主管姓名
            telephone: '',//财务主管手机号 
            account: '',//绑定银行对公账号
            depType: '',//存款人类别
            acctBank: [],//绑定卡清算行行号（绑定卡清算行）
            acctBank1: '',
            accBankname:'',
            regType: [],//注册类型
            regType1: '',
            regTypename:'',
            docuOpName: '',//制单员姓名
            docuOpMobile: '',//制单员手机号
            docuOpIdCard: '',//制单员证件号
            checkerName: '',//复核员姓名
            checkerMobile: '',//复核员手机号
            checkerIdCard: '',//复核员证件号
            medSmEntFlgname:'',
            medSmEntFlg1: '',
            medSmEntFlg: [],//企业规模
            //跳转的判断条件
            checkboxT: false,
            checkfalse: '我已阅读并同意',
            checktrue: '请您阅读并同意协议',
            picUrl: null,//图片base64
            licenseUrl: codeimg, //营业执照
            codeUrl: codeimg1,
            identity1: idPic2,//法人身份证正面
            identity2: idPic1,//法人身份证反面
            single1: idPic2,// 制单员身份证正面
            single2: idPic1,//制单员身份证反面
            reviewer1: idPic2,//复核员身份证正面
            reviewer2: idPic1,//复核员身份证反面
            applicant1: idPic2,//申请员身份证正面
            applicant2: idPic1,//申请员身份证反面
            //上传图片
            licenseUrl1: codeimg, //营业执照
            codeUrl1: codeimg1,
            identity11: idPic2,//法人身份证正面
            identity22: idPic1,//法人身份证反面
            single11: idPic2,// 制单员身份证正面
            single22: idPic1,//制单员身份证反面
            reviewer11: idPic2,//复核员身份证正面
            reviewer22: idPic1,//复核员身份证反面
            applicant11: idPic2,//申请员身份证正面
            applicant22: idPic1,//申请员身份证反面
            productCode:'',//客户编码

            //模态框
            showModal: false,
            modalDropup: true,
            showModal1:false,

            modalimg: '',
            custType: [],//客户类别
            custType1: '',
            custTypename:'',
            province: [],//省
            province1: '',
            provincename:'',
            city: [],//市
            city1: '',
            cityname:'',
            regDist: [],//区
            regDist1: '',
            regDistname:'',
            regStrentDoor: '',//街道地址
            regTePhone: '',//注册地电话号码
            data:[],//向模态框传入的数据
        }
    };
    newvalue = () => {
        return newvalues;
    }
    //注册期限
    DatePickerSelect1 = (val) => {
        console.log(val.format('YYYY-MM-DD'))
        this.setState({ limitDate: val.format('YYYY-MM-DD') })
    };
    //法人证件到期日
    DatePickerSelect2 = (val) => {
        console.log(val.format('YYYY-MM-DD'))
        this.setState({ corpIdCardLimitDate: val.format('YYYY-MM-DD') })
    };
    DatePickerChange = (val) => { }
    changecheckbox = () => {

        if (this.state.checkboxT === false) {
            this.setState({ checkboxT: true });

        } else {
            this.setState({ checkboxT: false });
        }
    };
    handleChange = (val) => {
        this.setState({ depType: val })
    };
    handleSelect = (e) => {
        if (e == '') {
            alert("请选择")
        }
    };
    createFormData = () =>{
        let formData = new FormData();
        let oFiles = [
            this.licenseUrl.files[0],
            // this.codeUrl.files[0],
            // this.single1.files[0],
            // this.single2.files[0],
            // this.identity1.files[0],
            // this.identity2.files[0],
            // this.reviewer1.files[0],
            // this.reviewer2.files[0],
            // this.applicant1.files[0],
            // this.applicant2.files[0]
        ];
        oFiles.forEach(item=>{
            // formData.append(item.name,item);
            formData.append('age','23');
        });
        console.log(formData.append)   
        console.log(this.licenseUrl.files[0]);
        console.log(oFiles)
        console.log(formData)
        return formData;
    };
    //图片base64
    uploadimg = (type) => {
        let loader;
        switch (type) {
            // licenseUrl1: codeimg, //营业s执照
            // codeUrl1: codeimg1,
            // identity11: idPic2,//法人身份证正面
            // identity22: idPic1,//法人身份证反面
            // single11: idPic2,// 制单员身份证正面
            // single22: idPic1,//制单员身份证反面
            // reviewer11: idPic2,//复核员身份证正面
            // reviewer22: idPic1,//复核员身份证反面
            // applicant11: idPic2,//申请员身份证正面
            // applicant22: idPic1,//申请员身份证反面
            case 'codeUrl':
                this.setState({ codeUrl1: this.codeUrl.files[0] })
                loader = this.codeUrl.files[0];
                break;
            case 'licenseUrl':
                console.log(this)
                console.log(this.state.licenseUrl)
                console.log(this.licenseUrl)
                console.log(this.licenseUrl.files[0])
                this.setState({ licenseUrl1: this.licenseUrl.files[0] })
                loader = this.licenseUrl.files[0];
                console.log(loader)
                break;
            case 'identity1':
                this.setState({ identity11: this.identity1.files[0] })
                loader = this.identity1.files[0];
                break;
            case 'identity2':
                this.setState({ identity22: this.identity2.files[0] })
                loader = this.identity2.files[0];
                break;
            case "single1":
                this.setState({ single11: this.single1.files[0] })
                loader = this.single1.files[0];
                break;
            case "single2":
                this.setState({ single22: this.single2.files[0] })
                loader = this.single2.files[0];
                break;
            case "reviewer1":
                this.setState({ reviewer11: this.reviewer1.files[0] })
                loader = this.reviewer1.files[0];
                break;
            case "reviewer2":
                this.setState({ reviewer22: this.reviewer2.files[0] })
                loader = this.reviewer2.files[0];
                break;
            case "applicant1":
                this.setState({ applicant11: this.applicant1.files[0] })
                loader = this.applicant1.files[0];
                break;
            case "applicant2":
                this.setState({ applicant22: this.applicant2.files[0] })
                loader = this.applicant2.files[0];
                break;
            default: break;
        }
        let reader = new FileReader();
        reader.onloadend = () => {
            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            let dataURL = reader.result;
            this.setState({
                [type]: dataURL,
            })
        }
        reader.readAsDataURL(loader); // 读出 base64
    };
    //模态框1
    close = () => {
        this.setState({ showModal: false });
    }

    open = () => {
        this.setState({
            showModal: true
        });
    }
    changeDropup = (url) => {

        this.setState({
            showModal: true,
            modalimg: url
        });
    }
    //模态框end
    //模态框
    componentDidMount(){
        this.setState({
            productCode:this.props.location.state.productCode
        })
    }
    handlechangemodaltype=()=>{
        this.setState({
            showModal1: true
        })
    }
    close1 = () => {
        this.setState({
            showModal1: false
        })
    }
    //下拉框请求
    getSelectData = (key) => {
        switch (key) {
            case 'custType':
                Ajax({
                    url: rootURL + 'queryref/querycusttype',
                    mode: 'normal',
                    success: (res) => {
                        let result = res.data.response_body.record;
                        this.setState({
                            custType: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            case 'medSmEntFlg':
                Ajax({
                    url: rootURL + 'queryref/querymedsmentflg',
                    mode: 'normal',
                    success: (res) => {
                        let result = res.data.response_body.record;
                        this.setState({
                            medSmEntFlg: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            case 'acctBank':
                Ajax({
                    url: rootURL + 'queryref/queryacctbank',
                    mode: 'normal',
                    success: (res) => {
                        console.log(res.data.response_body.record);
                        let result = res.data.response_body.record;
                        this.setState({
                            acctBank: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            case 'regType':
                Ajax({
                    url: rootURL + 'queryref/queryregtype',
                    mode: 'normal',
                    success: (res) => {
                        console.log(res.data.response_body.record)
                        let result = res.data.response_body.record;
                        this.setState({
                            regType: result,
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            case 'trdCode':
                Ajax({
                    url: rootURL + 'queryref/querytrdcode',
                    mode: 'normal',
                    success: (res) => {
                        let result = res.data.response_body.record;
                        this.setState({
                            trdCode: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            //省
            case 'province ':
                Ajax({
                    url: rootURL + 'queryref/queryregdistprovince',
                    mode: 'normal',
                    success: (res) => {
                        let result = res.data.response_body.record;
                        this.setState({
                            province: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            //市
            case 'city':
                Ajax({
                    url: rootURL + 'queryref/queryregdistcity',
                    data: { province: this.state.province1 },
                    mode: 'normal',
                    success: (res) => {
                        let result = res.data.response_body.record;
                        this.setState({
                            city: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            //  区
            case 'regDist':
                Ajax({
                    url: rootURL + 'queryref/queryregdistarea',
                    data: { province: this.state.province1, city: this.state.city1 },
                    mode: 'normal',
                    success: (res) => {
                        let result = res.data.response_body.record;
                        this.setState({
                            regDist: result
                        })
                    },
                    error: (res) => {
                        console.log(res);
                    }
                })
                break;
            default:
                break;
        }

    };
    changebox = () => {
        // this.state.checkboxT?
        // :alert('完整填写资料')
        // this.props.router.push({
        //     pathname: '/if/Registert',
        // }, )
        let refs = this.refs.boxvaluea
        //  需要的字段
        const newvalues = [
            { display: '企业名称', values: this.refs.refcNName.props.value },
            { display: '注册资本', values: this.refs.refcapReg.props.value },
            { display: '财务主管姓名', values: this.refs.refcfoName.props.value },
            { display: '财务主管手机号', values: this.refs.reftelephone.props.value },
            { display: '绑定银行对公账号', values: this.refs.refaccount.props.value },
            { display: '法定代表人证件号', values: this.refs.reflegPerId.props.value },
            { display: '法人代表姓名', values: this.refs.refcorpName.props.value },
            { display: '法人代表联系电话', values: this.refs.reflegalPhone.props.value },
            { display: '复核员身份证号码', values: this.refs.refcheckerIdCard.props.value },
            { display: '复核员手机号', values: this.refs.refcheckerMobile.props.value },
            { display: '复核员姓名', values: this.refs.refcheckerName.props.value },
            { display: '制单员手机号', values: this.refs.refdocuOpMobile.props.value },
            { display: '制单员姓名', values: this.refs.refdocuOpName.props.value },
            { display: '制单员身份证号码', values: this.refs.refdocuOpIdCard.props.value },
            { display: '街道地址', values: this.refs.refregStrentDoor.props.value },
            { display: '客户类别', values: this.refs.refcustType.props.value},
            { display: '所属行业', values: this.refs.boxvaluec.props.value },
            { display: '企业规模', values: this.refs.refmedSmEntFlg.props.value },
            { display: '注册地电话号码', values: this.refs.refregTePhone.props.value },
            { display: '组织机构代码', values: this.refs.boxvaluej.props.value },
            { display: '注册登记号', values: this.refs.refregId.props.value },
            { display: '注册期限', values: this.refs.reflimitDate.props.value },
            { display: '法人证件到期日', values: this.refs.refcorpIdCardLimitDate.props.value },
            { display: '绑定卡清算行行号', values: this.refs.refacctBank.props.value },
            { display: '行业代码', values: this.refs.reftrdCode.props.value },
            { display: '复核员证件类型对应的证件号', values: this.refs.refcheckerIdNumber.props.value },
            { display: '复核员证件类型', values: this.refs.refcheckerIdType.props.value },
            { display: '制单员证件类型对应的证件号', values: this.refs.refdocuOpIdNumber.props.value },
            { display: '制单员证件类型', values: this.refs.refdocuOpIdType.props.value },
            { display: '法人证件类型对应的证件号', values: this.refs.refcorpIdNumber.props.value },
            { display: '法人证件类型', values: this.refs.refcorpIdType.props.value },
            { display: '注册类型', values: this.refs.refregType.props.value },
            { display: '存款人类别', values: this.refs.refdepType.props.value },

        ]

        // for(let i=0;i<newvalues.length;i++){
        //     if(newvalues[i].values.length==0){
        //         alert('完整填写资料');
        //         return this.setState({checkboxT:false})
        //     }else{
        //         return this.props.router.push({
        //             pathname: '/if/Registers',
        //         })
        //     }
        // }
        this.props.router.push({
            pathname: '/if/Registerwarte',
        }, )
        //向后台第一次传输数据：
        Ajax({
            url: rootURL + 'interests/openusersubmit',
            mode: 'normal',
            data: {
                cNName: this.state.cNName,
                idNo: this.state.idNo,
                custType: this.state.custType1,
                trdCode: this.state.trdCode1,
                regId: this.state.regId,
                limitDate: this.state.limitDate,
                corpName: this.state.corpName,
                legPerId: this.state.cNName,
                corpIdCardLimitDate: this.state.corpIdCardLimitDate,
                legalPhone: this.state.legalPhone,
                cfoName: this.state.cfoName,
                telephone: this.state.telephone,
                capReg: this.state.capReg,
                medSmEntFlg: this.state.medSmEntFlg1,
                province: this.state.province1,
                city: this.state.city1,
                regDist: this.state.regDist1,
                regStrentDoor: this.state.regStrentDoor,
                acctBank: this.state.acctBank1,
                accBankname:this.state.accBankname,
                account: this.state.account,
                regType: this.state.regType1,
                docuOpName: this.state.docuOpName,
                productCode:this.state.productCode,
                docuOpMobile: this.state.docuOpMobile,
                docuOpIdCard: this.state.docuOpIdCard,
                checkerName: this.state.checkerName,
                checkerMobile: this.state.checkerMobile,
                checkerIdCard: this.state.checkerIdCard,
                dynamicCode: '123456',
                regTePhone: this.state.regTePhone,
                depType: this.state.depType,

            },
            success: (res) => {
                console.log(res);

                // if (res.data.response_head.service_resp_code == '000000') {
                //     const files = {
                //         action: 'tmc-fm-web/fm/interests/uploadfile',
                //         listType: 'picture',
                //         defaultFileList: [{
                //             uid: -1,
                //             name: this.licenseUrl.files[0].name,
                //             status: 'done',
                //             url: 'http://design.yyuap.com/images/icon1.png',
                //             thumbUrl: 'http://design.yyuap.com/images/icon1.png',
                //         }, {
                //             uid: -2,
                //             name: this.codeUrl.files[0].name,
                //             status: 'done',
                //             url: 'http://design.yyuap.com/images/icon1.png',
                //             thumbUrl: 'http://design.yyuap.com/images/icon1.png',
                //         }],
                //     }
                // }
            }
        }
        )


        // .then((res) => {
        //     console.log(res);
        //     if (res.data.response_head.service_resp_code == '000000') {
        //         // let result = newvalues.some(item => {
        //         //     if (item.values === '') {
        //         //         alert(item.display + '不能为空！');
        //         //         return true
        //         //     }
        //         // })
        //         // !result ? (this.props.router.push({
        //         //     pathname: '/if/registerwarte',
        //         // })) : null;
        //         let files = [
        //             { file1: this.state.licenseUrl1 },
        //             { file2: this.state.codeUrl1 },
        //             { file3: this.state.identity11 },
        //             { file4: this.state.identity22 },
        //             { file5: this.state.applicant11 },
        //             { file6: this.state.applicant22 },
        //             { file7: this.state.single11 },
        //             { file8: this.state.single22 },
        //             { file9: this.state.reviewer11 },
        //             { file10: this.state.reviewer22 }
        //         ];
        //         const demo4props = {
        //             action: 'tmc-fm-web/fm/interests/uploadfile',
        //             listType: 'picture',
        //             defaultFileList: [{
        //                 uid: -1,
        //                 name: this.licenseUrl.files[0].name,
        //                 status: 'done',
        //                 url: 'http://design.yyuap.com/images/icon1.png',
        //                 thumbUrl: 'http://design.yyuap.com/images/icon1.png',
        //             }, {
        //                 uid: -2,
        //                 name: this.codeUrl.files[0].name,
        //                 status: 'done',
        //                 url: 'http://design.yyuap.com/images/icon1.png',
        //                 thumbUrl: 'http://design.yyuap.com/images/icon1.png',
        //             }],
        //         };
        //     }
        // }
        // )
    };
    checkForm = (flag, obj) => {
        console.log(flag);
        console.log(obj);
    }
    render() {
        let cancel = () => {
            return (
                <Button shape="border" className="cancel">取消</Button>
            )
        }
        return (
            <div id='registert'>
                <Formregister stepcurrent={1} />
                {/* 企业基础信息 */}
                <Row className='backgroundfff'>
                    <div className='title'>
                        <span className='iconred'></span>
                        <h4>企业基础信息</h4>
                    </div>
                    <Col lg={5} className='codeimg'>
                        <Row>
                            <Col lg={6} sm={6} md={6}>
                                <Form
                                    showSubmit={false}
                                    horizontal>
                                    <div className='upload'>
                                        <input
                                            enctype='multipart/form-data'
                                            ref={input => this.licenseUrl = input}
                                            type='file'
                                            onChange={() => this.uploadimg('licenseUrl')}
                                            name='img'
                                            accept='image/*'
                                            title='点击上传图片' />
                                    </div>
                                </Form>
                            </Col>
                            <Col lg={6} sm={6} md={6}>
                                <div className='imgshow1'>
                                    <img
                                        src={this.state.licenseUrl}
                                        alt=''
                                        onClick={() => { this.changeDropup(this.state.licenseUrl); this.open(); }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* 右半部分 */}
                    <Col lg={7} sm={7} md={7}>
                        <ul className='formall'>
                            <li>
                                <div className='formlabel'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            ref='refcNName'
                                            labelMd={2}
                                            showMast={true}
                                            labelName="企业名称："
                                            isRequire={true}
                                            errorMessage="请输入企业名称"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.cNName}
                                            change={(val) => this.setState({ cNName: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入企业名称"
                                                className='large'
                                                value={this.state.cNName}
                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li className='offsetleft'>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <span className="icon">*</span>
                                            <span className='finance-modal-title fl'>企业规模：</span>
                                            <Select
                                                className='boxwidth'
                                                ref="medSmEntFlg"
                                                defaultValue="请选择企业规模"
                                                style={{ width: '63%', marginRight: 6 }}
                                                onSelect={(key,val) => {
                                                    this.setState({ medSmEntFlg1: key,
                                                        medSmEntFlgname:val.props.children
                                                     })
                                                }}
                                                onFocus={() => this.getSelectData('medSmEntFlg')}>
                                                {
                                                    this.state.medSmEntFlg.map((item, index) => (
                                                        <Option key={index} value={item.medSmEntFlg}>{item.medSmEntFlgName}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </li>
                            <li className='offsetleft offmargintop'>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <span className="icon">*</span>
                                            <span className='finance-modal-title fl'>所属行业：</span>
                                            <Select
                                                className='boxwidth'
                                                ref="trdCode"
                                                defaultValue="请选择所属行业"
                                                style={{ width: '63%', marginRight: 6 }}
                                                onSelect={(key,val) => {
                                                    this.setState({ trdCode1: key ,
                                                        trdCodename:val.props.children
                                                    })
                                                }}
                                                onFocus={() => this.getSelectData('trdCode')}>
                                                {
                                                    this.state.trdCode.map((item, index) => (
                                                        <Option key={index} value={item.trdCode}>{item.trdCodeName}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </li>
                            <li className='offsetleft offmargintop'>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <span className="icon">*</span>
                                            <span className='finance-modal-title fl '>客户类别：</span>
                                            <Select
                                                className='boxwidth'
                                                ref="custType"
                                                defaultValue="请选择客户类别"
                                                style={{ width: '63%', marginRight: 6 }}
                                                onSelect={(key,val) => {
                                                    this.setState({ custType1: key ,
                                                        custTypename:val.props.children
                                                    })
                                                }}
                                                onFocus={() => this.getSelectData('custType')}>
                                                {
                                                    this.state.custType.map((item, index) => (
                                                        <Option key={index} value={item.custType}>{item.custTypeName}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </li>
                            <li>
                                <div className='formlabel2'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="注册地电话号码："
                                            isRequire={true}
                                            errorMessage="请输入注册地电话号码"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.regTePhone}
                                            change={(val) => this.setState({ regTePhone: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入注册地电话号码"
                                                className='large'
                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li className='offsetleftcity'>
                                <Row>
                                    <Col lg={12} sm={12} md={12}>
                                        <FormGroup>
                                            <span className="icon">*</span>
                                            <span className='finance-modal-title fl'>所在地：</span>
                                            <Select
                                                ref="province "
                                                defaultValue="省"
                                                style={{ width: '17%', marginRight: 6 }}
                                                onSelect={(key,val) => {
                                                    this.setState({ province1: key,
                                                        provincename:val.props.children
                                                    }, )
                                                }}
                                                onFocus={() => this.getSelectData('province ')}>
                                                {
                                                    this.state.province.map((item, index) => (
                                                        <Option key={index} value={item.province}>{item.regDistName}</Option>
                                                    ))
                                                }
                                            </Select>
                                            <Select
                                                ref="city"
                                                defaultValue="市"
                                                style={{ width: '17%', marginRight: 6 }}
                                                onSelect={(key,val) => {
                                                    this.setState({ city1: key,
                                                        cityname:val.props.chidlren
                                                    })
                                                }}
                                                onFocus={() => {
                                                    this.getSelectData('city')
                                                }
                                                }>
                                                {
                                                    this.state.city.map((item, index) => (
                                                        <Option key={index} value={item.city}>{item.regDistName}</Option>
                                                    ))
                                                }
                                            </Select>
                                            <Select
                                                ref="regDist"
                                                defaultValue="区"
                                                style={{ width: '17%', marginRight: 6 }}
                                                onSelect={(key,val) => {
                                                    this.setState({ regDist1: key,
                                                        regDistname:val.props.children
                                                    })
                                                }}
                                                onFocus={() => this.getSelectData('regDist')}>
                                                {
                                                    this.state.regDist.map((item, index) => (
                                                        <Option key={index} value={item.area}>{item.regDistName}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </li>
                            <li>
                                <div className='formlabel3'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="街道地址："
                                            isRequire={true}
                                            errorMessage="请输入街道地址"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.regStrentDoor}
                                            change={(val) => this.setState({ regStrentDoor: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入街道地址"
                                                className='large'

                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                        </ul>



                    </Col>
                </Row>
                {/* 资质信息 */}
                <Row className='backgroundfff'>
                    <div className='title'>
                        <span className='iconred'></span>
                        <h4>资质信息</h4>
                    </div>
                    <Col lg={5} sm={5} md={5}>
                        <Row className='codeUrl'>
                            <Col lg={6} sm={6} md={6} >
                                <Form horizontal
                                    showSubmit={false} >
                                    <div className='upload1'>
                                        <input
                                            enctype='multipart/form-data'
                                            ref={input => this.codeUrl = input}
                                            type='file'
                                            onChange={() => this.uploadimg('codeUrl')}
                                            name='img'
                                            accept='image/*'
                                            title='点击上传图片' />
                                    </div>
                                </Form>
                            </Col>
                            <Col lg={6} sm={6} md={6}>
                                <div className='imgshow2'>
                                    <img
                                        src={this.state.codeUrl}
                                        alt=""
                                        onClick={() => { this.changeDropup(this.state.codeUrl); this.open(); }}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='identityall'>
                                    <div className='identity'>
                                        <img src={this.state.identity1} alt="" />
                                        <input
                                            enctype='multipart/form-data'
                                            ref={input => this.identity1 = input}
                                            type='file'
                                            onChange={() => this.uploadimg('identity1')}
                                            name='img'
                                            accept='image/*'
                                            title='点击上传图片' />
                                        <span>法人身份证正面</span>
                                    </div>

                                    <div className='identity'>
                                        <img src={this.state.identity2} alt="" />
                                        <input
                                            enctype='multipart/form-data'
                                            ref={input => this.identity2 = input}
                                            type='file'
                                            onChange={() => this.uploadimg('identity2')}
                                            name='img'
                                            accept='image/*'
                                            title='点击上传图片' />
                                        <span>法人身份证反面</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={7} sm={7} md={7}>
                        <ul className='formall qualifications'>
                            <li>
                                <div className='formlabel4'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="组织机构代码："
                                            isRequire={true}
                                            errorMessage="请输入组织机构代码"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.idNo}
                                            change={(val) => this.setState({ idNo: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入组织机构代码"
                                                className='large'

                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li>
                                <div className='formlabel5'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="注册登记号："
                                          isRequire={true}
                                            errorMessage="请输入注册登记号"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.regId}
                                            change={(val) => this.setState({ regId: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入注册登记号"
                                                className='large'

                                            /> 
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li className='formlabel6 formnav'>
                                <FormGroup>
                                    <span className="icon">*</span>
                                    <span className='finance-modal-title fl'>注册期限：</span>
                                    <DatePicker
                                        className='datepicker'
                                        format={'YYYY-MM-DD'}
                                        onSelect={this.DatePickerSelect1}
                                        onChange={this.DatePickerChange}
                                        locale={zhCN}
                                        defaultValue={this.state.value}
                                        placeholder={dateInputPlaceholder}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <div className='formlabel3'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="注册资本："
                                            isRequire={true}
                                            errorMessage="请输入注册资本"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.capReg}
                                            change={(val) => this.setState({ capReg: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入注册资本"
                                                className='large'
                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li>
                                <div className='formlabel3'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="法人姓名："
                                            isRequire={true}
                                            errorMessage="请输入法人姓名"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.corpName}
                                            change={(val) => this.setState({ corpName: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入法人姓名"
                                                className='large'

                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li>
                                <div className='formlabel4'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="法人联系电话："
                                            isRequire={true}
                                            errorMessage="请输入法人联系电话"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.legalPhone}
                                            change={(val) => this.setState({ legalPhone: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入法人联系电话"
                                                className='large'
                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li>
                                <div className='formlabel5'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="法人证件号："
                                            isRequire={true}
                                            errorMessage="请输入法人证件号"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.legPerId}
                                            change={(val) => this.setState({ legPerId: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入法人证件号"
                                                className='large'

                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li className='formlabel2 formnav1'>

                                <FormGroup>
                                    <span className="icon">*</span>
                                    <span className='finance-modal-title fl'>法人证件到期日：</span>
                                    <DatePicker
                                        className='datepicker'
                                        format={'YYYY-MM-DD'}
                                        onSelect={this.DatePickerSelect2}
                                        onChange={this.DatePickerChange}
                                        locale={zhCN}
                                        defaultValue={this.state.value}
                                        placeholder={dateInputPlaceholder}
                                    />
                                </FormGroup>

                            </li>
                            <li>
                                <div className='formlabel4'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="财务主管姓名："
                                            isRequire={true}
                                            errorMessage="请输入财务主管姓名"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.cfoName}
                                            change={(val) => this.setState({ cfoName: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入财务主管姓名"
                                                className='large'

                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                            <li>
                                <div className='formlabel2'>
                                    <Form
                                        useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                        checkFormNow={this.state.checkFormNow}>
                                        <FormItem
                                            showMast={true}
                                            labelName="财务主管手机号："
                                            isRequire={true}
                                            errorMessage="请输入财务主管手机号"
                                            className='formipt'
                                            method="blur"
                                            inline={true}
                                            value={this.state.telephone}
                                            change={(val) => this.setState({ telephone: val })}
                                        >
                                            <FormControl
                                                name="username"
                                                placeholder="请输入财务主管手机号"
                                                className='large'

                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                            </li>
                        </ul>
                    </Col>
                </Row>
                {/* 签约信息 */}
                <Row className='backgroundfff'>
                    <div className='title'>
                        <span className='iconred'></span>
                        <h4>签约信息</h4>
                    </div>
                    <Col lg={5} sm={5} md={5}>
                        <div>
                            <ul className='finance-modal'>
                                <li>
                                    <div className='formlabel2'>
                                        <Form
                                            useRow={true}
                                            showSubmit={false}
                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                            checkFormNow={this.state.checkFormNow}>
                                            <FormItem
                                                showMast={true}
                                                labelName="绑定银行对公账号："
                                                isRequire={true}
                                                errorMessage="请输入绑定银行对公账号"
                                                className='formipt'
                                                method="blur"
                                                inline={true}
                                                value={this.state.account}
                                                change={(val) => this.setState({ account: val })}
                                            >
                                                <FormControl
                                                    name="username"
                                                    placeholder="请输入绑定银行对公账号"
                                                    className='large'

                                                />
                                            </FormItem>
                                        </Form>
                                    </div>
                                </li>
                                <li>
                                    <Row className='regtype'>
                                        <FormGroup>
                                            <span className="icon">*</span>
                                            <span className='finance-modal-title fl'>注册类型：</span>
                                            <Select
                                                className='boxwidth'
                                                ref="regType"
                                                defaultValue="请选择注册类型"
                                                style={{ width: '63%', marginRight: 6 }}
                                                onSelect={(key,a) => {
                                                    this.setState({ regType1: key,
                                                       regTypename:a.props.children
                                                    })
                                                }}
                                                onFocus={() => this.getSelectData('regType')}>
                                                {
                                                    this.state.regType.map((item, index) => (
                                                        <Option key={index} value={item.regType}>{item.regTypeName}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormGroup>
                                    </Row>
                                </li>
                            </ul>

                        </div>
                    </Col>
                    <Col lg={7}>
                        <div>
                            <Form horizontal
                                showSubmit={false}>
                                <ul className='finance-modal'>
                                    <li>
                                        <Row className='doccenter'>
                                            <Col lg={9} sm={9} md={9}>
                                                <FormGroup>
                                                    <span className="icon">*</span>
                                                    <span className='finance-modal-title fl'>存款人类别：</span>
                                                    <Select
                                                        defaultValue="请选择"
                                                        style={{ width: '27%', marginRight: 6 }}
                                                        onChange={this.handleChange}>
                                                        <Option value="0">企业法人</Option>
                                                        <Option value="1">非企业法人</Option>
                                                    </Select>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </li>
                                    <li>
                                        <Row className='doccenter1'>
                                            <Col lg={7} sm={7} md={7}>
                                                <FormGroup className='modal-style2'>
                                                    <span className="icon">*</span>
                                                    <span className='finance-modal-title fl'>绑定卡清算行：</span>
                                                    <Select
                                                        className='doccenter11'
                                                        ref="acctBank"
                                                        defaultValue="请选择绑定卡清算行"
                                                        onSelect={(key, val) => {
                                                            this.setState({ acctBank1: key,
                                                            acctBankname:val.props.children })
                                                        }}
                                                        onFocus={() => this.getSelectData('acctBank')}>
                                                        {
                                                            this.state.acctBank.map((item, index) => (
                                                                <Option key={index} value={item.acctBank}>{item.remark}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </li>
                                </ul>
                            </Form></div>
                    </Col>
                </Row>
                {/* 账号信息 */}
                <div>
                    <Row className='backgroundfff'>
                        <div className='title'>
                            <span className='iconred'></span>
                            <h4>账号信息</h4>
                        </div>
                        <Col lg={12} sm={12} md={12}>
                            <Row className='entityid'>
                                <Col lg={5} sm={5} md={5}>
                                    <Row>
                                        <Col>
                                            <div className='identityall'>
                                                <div className='identity'>
                                                    <img src={this.state.single1} alt="" />
                                                    <input
                                                        enctype='multipart/form-data'
                                                        ref={input => this.single1 = input}
                                                        type='file'
                                                        onChange={() => this.uploadimg('single1')}
                                                        name='img'
                                                        accept='image/*'
                                                        title='点击上传图片' />
                                                    <span>制单员身份证正面</span>
                                                </div>

                                                <div className='identity'>
                                                    <img src={this.state.single2} alt="" />
                                                    <input
                                                        enctype='multipart/form-data'
                                                        ref={input => this.single2 = input}
                                                        type='file'
                                                        onChange={() => this.uploadimg('single2')}
                                                        name='img'
                                                        accept='image/*'
                                                        title='点击上传图片' />
                                                    <span>制单员身份证反面</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className='identityall'>
                                                <div className='identity'>
                                                    <img src={this.state.reviewer1} alt="" />
                                                    <input
                                                        enctype='multipart/form-data'
                                                        ref={input => this.reviewer1 = input}
                                                        type='file'
                                                        onChange={() => this.uploadimg('reviewer1')}
                                                        name='img'
                                                        accept='image/*'
                                                        title='点击上传图片' />
                                                    <span>复核员身份证正面</span>
                                                </div>

                                                <div className='identity'>
                                                    <img src={this.state.reviewer2} alt="" />
                                                    <input
                                                        enctype='multipart/form-data'
                                                        ref={input => this.reviewer2 = input}
                                                        type='file'
                                                        onChange={() => this.uploadimg('reviewer2')}
                                                        name='img'
                                                        accept='image/*'
                                                        title='点击上传图片' />
                                                    <span>复核员身份证反面</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className='identityall'>
                                                <div className='identity'>
                                                    <img src={this.state.applicant1} alt="" />
                                                    <input
                                                        enctype='multipart/form-data'
                                                        ref={input => this.applicant1 = input}
                                                        type='file'
                                                        onChange={() => this.uploadimg('applicant1')}
                                                        name='img'
                                                        accept='image/*'
                                                        title='点击上传图片' />
                                                    <span>申请人身份证正面</span>
                                                </div>
                                                <div className='identity'>
                                                    <img src={this.state.applicant2} alt="" />
                                                    <input
                                                        enctype='multipart/form-data'
                                                        ref={input => this.applicant2 = input}
                                                        type='file'
                                                        onChange={() => this.uploadimg('applicant2')}
                                                        name='img'
                                                        accept='image/*'
                                                        title='点击上传图片' />
                                                    <span>申请人身份证反面</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={7} sm={7} md={7}>
                                    <div>
                                        <Form horizontal
                                            showSubmit={false}>
                                            <ul className='formall formlabelbox'>

                                                <li>
                                                    <div className='formlabel5'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="制单员姓名："
                                                                isRequire={true}
                                                                errorMessage="请输入制单员姓名"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.docuOpName}
                                                                change={(val) => this.setState({ docuOpName: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入制单员姓名"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel4'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="制单员手机号："
                                                                isRequire={true}
                                                                errorMessage="请输入制单员手机号"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.docuOpMobile}
                                                                change={(val) => this.setState({ docuOpMobile: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入制单员手机号"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel5'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="制单员邮箱："
                                                                isRequire={true}
                                                                errorMessage="请输入制单员邮箱"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.docuOpName}
                                                                change={(val) => this.setState({ docuOpName: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入制单员邮箱"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel4'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="制单员证件号："
                                                                isRequire={true}
                                                                errorMessage="请输入制单员证件号"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.docuOpIdCard}
                                                                change={(val) => this.setState({ docuOpIdCard: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入制单员证件号"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel5'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="复核员姓名："
                                                                isRequire={true}
                                                                errorMessage="请输入复核员姓名"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.checkerName}
                                                                change={(val) => this.setState({ checkerName: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入复核员姓名"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel4'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="复核员手机号："
                                                                isRequire={true}
                                                                errorMessage="请输入复核员手机号"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.checkerMobile}
                                                                change={(val) => this.setState({ checkerMobile: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入复核员手机号"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel5'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="复核员邮箱："
                                                                isRequire={true}
                                                                errorMessage="请输入复核员邮箱"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.docuOpName}
                                                                change={(val) => this.setState({ docuOpName: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入复核员邮箱"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='formlabel4'>
                                                        <Form
                                                            useRow={true}
                                                            showSubmit={false}
                                                            submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
                                                            checkFormNow={this.state.checkFormNow}>
                                                            <FormItem
                                                                showMast={true}
                                                                labelName="复核员证件号："
                                                                isRequire={true}
                                                                errorMessage="请输入复核员证件号"
                                                                className='formipt'
                                                                method="blur"
                                                                inline={true}
                                                                value={this.state.checkerIdCard}
                                                                change={(val) => this.setState({ checkerIdCard: val })}
                                                            >
                                                                <FormControl
                                                                    name="username"
                                                                    placeholder="请输入复核员证件号"
                                                                    className='large'

                                                                />
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </li>
                                            </ul>
                                        </Form></div>
                                </Col>
                            </Row>
                            {/* checkbox */}
                            <Row className='checkbox'>
                                <Col>
                                    <span className='checkboxN'>
                                        <FormControl
                                            type='checkbox'
                                            className="finnance-modal-center"
                                            onChange={this.changecheckbox}
                                            checked={this.state.checkboxT}
                                        />
                                    </span>
                                    <span>
                                        {this.state.checkfalse}
                                        <a href="#">《上海银行直销银行电子账户服务协议》</a>
                                        和
                                            <a href="#">《上海银行直销银行电子账户服务协议》</a>
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='martopdown' >
                                    <Button colors="#00B39E" 
                                    /* onClick={this.changebox} */
                                    onClick={this.handlechangemodaltype}
                                    >
                                        提交申请
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </div>
                <Modalimg
                    showModal={this.state.showModal}
                    opre={this.state.operation}
                    modalData={this.state.modalData}
                    onHide={this.close}
                    onClick={this.close}
                    onRefresh={this.refresh}
                    onSubmit={this.handleSubmit}
                    licenseUrl={this.state.modalimg}
                    

                />
                <Registerupload
                    showModal={this.state.showModal1}
                    opre={this.state.operation1}
                    onClose={this.close1} 
                    onSubmit={this.handleSubmit2}
                    data={{
                        cNName:this.state.cNName,
                        idNo:this.state.idNo,
                        custType: {custType:this.state.custType1,custTypename:this.state.custTypename},
                        trdCode: {trdCode:this.state.trdCode1,trdCodename:this.state.trdCodename},
                        regId: this.state.regId,
                        limitDate: this.state.limitDate,
                        corpName: this.state.corpName,
                        legPerId: this.state.legPerId,
                        corpIdCardLimitDate: this.state.corpIdCardLimitDate,
                        legalPhone: this.state.legalPhone,
                        cfoName: this.state.cfoName,
                        telephone: this.state.telephone,
                        capReg: this.state.capReg,
                        medSmEntFlg: {medSmEntFlg:this.state.medSmEntFlg1,medSmEntFlgname:this.state.medSmEntFlgname},
                        province:{province:this.state.province1,provincename:this.state.provincename},
                        city: {city:this.state.city1,cityname:this.state.cityname},
                        regDist: {regDist:this.state.regDist1,regDistname:this.state.regDistname},
                        regStrentDoor: this.state.regStrentDoor,
                        acctBank: {accBank:this.state.acctBank1,accBankname:this.state.accBankname},
                        account: this.state.account,
                        regType: {regType:this.state.regType1,regTypename:this.state.regTypename},
                        docuOpName: this.state.docuOpName,
                        productCode:this.props.location.state.productCode,
                        docuOpMobile: this.state.docuOpMobile,
                        docuOpIdCard: this.state.docuOpIdCard,
                        checkerName: this.state.checkerName,
                        checkerMobile: this.state.checkerMobile,
                        checkerIdCard: this.state.checkerIdCard,
                        dynamicCode: '123456',
                        regTePhone: this.state.regTePhone,
                        depType: this.state.depType,
                        }} 
                        createFormData={{licenseUrl1: this.state.licenseUrl1,
                        codeUrl: this.state.codeUrl1,
                        identity: this.state.identity11,
                        identity22: this.state.identity22,
                        single1: this.state.single11,
                        single2: this.state.single22,
                        reviewer1: this.state.reviewer11,
                        reviewer2: this.state.reviewer22,
                        applicant11: this.state.applicant11,
                        applicant22: this.state.applicant22,}}
      
                />
                
            </div >
        )
    }

}