import React, { Component } from "react";
import {
Breadcrumb,
Con,
Row,
Col,
Button,
Table,
Icon,
FormControl,
InputGroup,
Checkbox,
Modal,
ButtonGroup,
Message
} from "tinper-bee";
import Tabs, {TabPane} from 'bee-tabs';
import Alert from 'bee-alert';
import { Link } from "react-router";
import DatePicker from "bee-datepicker";
import Ajax from '../../../../utils/ajax';
import TrendChart from "../../containers/TrendChart/index.js";
import InfoModal from "../../containers/InfoModal/index.js";
import "./index.less";
import "../../../../utils/utils.js";
// 引入 ECharts 主模块
import echarts from 'echarts';
import { setTimeout } from "timers";

//产品介绍表列定义
const columns = [
    { title: "第一列", dataIndex: "first", key: "first", width: 100 ,
        render: (text, record, index) => {
            return (
                <div className="product-cell">{record.first}</div>
            );
        }
    },
    { title: "第二列", dataIndex: "second", key: "second", width: 500,
        render: (text, record, index) => {
            return (
                <div className="product-cell">{record.second}</div>
            );
        }
    },
    { title: "第三列", dataIndex: "third", key: "third", width: 100,
        render: (text, record, index) => {
            return (
                <div className="product-cell">
                    {record.third != "" && <div>{record.third}</div>}
                </div>
            );
        }
    },
    { title: "第四列", dataIndex: "fourth", key: "fourth", width: 500,
        render: (text, record, index) => {
            return (
                <div className="product-cell">{record.fourth}</div>
            );
        }
    }
  ];

//申购规则表列定义
const applyColumns = [
    { title: "申购时间", dataIndex: "applyTime", key: "applyTime", width: 300},
    { title: "开始计算收益", dataIndex: "startDate", key: "startDate", width: 300},
    { title: "收益到账", dataIndex: "arrivalDate", key: "arrivalDate", width: 300}
  ];

//赎回规则表列定义
const redeemColumns = [
    { title: "到期后", dataIndex: "expired", key: "expired", width: 300},
    { title: "本金", dataIndex: "principal", key: "principal", width: 300},
    { title: "利息", dataIndex: "interest", key: "interest", width: 300}
  ];

//投资范围内容
const investRange = "该基金投资于法律法规及监管机构允许投资的金融工具，包括现金，期限在1年以内（含1年）的银行存款 （包括活期存款、"
                    + "定期存款、通知存款、大额存单等）、债券回购、中央银行票据、同业存单；剩余期限在397天以内（含397天） 的债券、"
                    + "非金融企业债务融资工具（包括但不限于短期融资券、超短期融资金、中期票据）、资产支持证券；以及中国证监会、中国人民" 
                    + "银行认可的其他具有良好流动性的货币市场工具";
//投资策略内容
const investStrategy = "该基金将在深入研究国内外的宏观经济运行情况、政策形势、信用状态、货币政策变化趋势、市场资金 供应状况的基础上，分析" 
                        + "和判断利率走势与收益率曲线变化趋势，并综合考虑各类投资品种的流动性特征、风险特征和估值水平特征， 决定基金资产在" 
                        + "银行存款、债券等各类资产的配置比例，并适时进行动态调整。";
//基金经理内容
const managerContent = "任爽，女，中国籍，经济学硕士，8年证券从业经历，持有中国证券投资基金业从业证书， 2008年7月至今在广发基金管理有限公司" 
                        + "固定收益部兼任交易员和研究员，2012年12月12日起任广发纯债债券基金的 基金经理，2013年6月20日起任广发理财7天债券基金" 
                        + "的基金经理，2013年10月22日起任广发天天红发起式货币市场 基金的基金经理，2014年1月27日起任广发天天利货币市场基金的" 
                        + "基金经理，2014年5月30日起任广发钱袋子货币市场 基金的基金经理，2014年8月28日起任广发活期宝货币市场基金的基金经理，" 
                        + "2015年6月8日起任广发聚泰混合基金的 基金经理，2016年3月21日起任广发稳鑫保本基金的基金经理，2016年11月16日起任广发" 
                        + "鑫益混合基金和广发鑫慧混合 基金的基金经理，2016年12月2日起任广发鑫利混合基金的基金经理，2016年12月9日起任广发安盈" 
                        + "混合基金的基金经理。";
//基金产品介绍
const introduction = [{key: "投资范围", content: investRange}, {key: "投资策略", content: investStrategy}, {key: "基金经理", content: managerContent}]
//趋势图切换按钮的id
const canvasIds = [{id: "canvas1", text: "近1月"}, {id: "canvas2", text: "近3月"}, {id: "canvas3", text: "近1年"}];

const [yuan, yPerShare, y10kShare, percent] = ["元", "元/份", "元/万份", "%"];

const dataMap = {fullName: "广发钱袋子货币市场基金", shortName: "广发钱袋子货币A", 
    code: "000509（前端）", type: "货币型",
    publishDate: "2014年1月16日", esDataOrSacle: "2014年1月16日/2.064亿份", 
    assetScale: "211.67亿元", shareScale: "211.6736亿份（截止至：2017年）",
    fundManageOrg: "广发基金", custodian: "广发银行",
    fundManager: "任爽", bonus: "每份累计0.00元（0次）",
    ManageFeeRate: "0.30%（每年）", trusteeshipFeeRate: "0.05%（每年）",
    saleFeeRate: "0.22%（每年）", subscriptionFeeRate: "0.00%（前端）",
    applyFeeRate: "0.00%（前端）", redeemFeeRate: "1.00%（前端）",
    comparation: "活期存款利率（税后）", trackingMark: "该基金无跟踪标的"
};

const productData = [
{first: "基金全称", second: dataMap.fullName, third: "基金简称", fourth: dataMap.shortName},
{first: "基金代码", second: dataMap.code, third: "基金类型", fourth: dataMap.type},
{first: "发行日期", second: dataMap.publishDate, third: "成立日期/规模", fourth: dataMap.esDataOrSacle},
{first: "资产规模", second: dataMap.assetScale, third: "份额规模", fourth: dataMap.shareScale},
{first: "基金管理人", second: dataMap.fundManageOrg, third: "基金托管人", fourth: dataMap.custodian},
{first: "基金经理人", second: dataMap.fundManager, third: "成立来分红", fourth: dataMap.bonus},
{first: "管理费率", second: dataMap.ManageFeeRate, third: "托管费率", fourth: dataMap.trusteeshipFeeRate},
{first: "销售服务费率", second: dataMap.saleFeeRate, third: "最高认购费率", fourth: dataMap.subscriptionFeeRate},
{first: "最高申购费率", second: dataMap.applyFeeRate, third: "最高赎回费率", fourth: dataMap.redeemFeeRate},
{first: "业绩比较基准", second: dataMap.comparation, third: "跟踪标的", fourth: dataMap.trackingMark}
];

const applyRule = "支持7*24小时申购，首次申购当日每笔交易最低起购金额为1000元，递增金额为1元，每单买入不超过19.9万元。"
                + "T日申购，T+1日确认并开始计算收益。";

const redeemRule = "锁定周期180天 , 可根据你的资金规划，选择合适的到期安排，到期前一天15点前可随时更改，15点后将不可更改，"
                + "自动买入下一期：到期后本金及收益继续封闭180天，收益不间断。取出至原支付账户："
                + "本金及收益将于到期日的下一个交易日到账，如遇节假日顺延，节假日期间仍享受收益。";

const applyData = [
    {applyTime: "周一15点至周二15点", startDate: "周三", arrivalDate: "周四"},
    {applyTime: "周二15点至周三15点", startDate: "周四", arrivalDate: "周五"},
    {applyTime: "周三15点至周四15点", startDate: "周五", arrivalDate: "下周一"},
    {applyTime: "周四15点至周五15点", startDate: "下周一", arrivalDate: "下周二"},
    {applyTime: "周五15点至下周一15点", startDate: "下周二", arrivalDate: "下周三"}
];

const redeemData = [
    {expired: "不赎回", principal: "继续持仓分红", interest: "自动转账"},
    {expired: "赎回", principal: "返回原支付银行卡", interest: "返回原支付银行卡"}
];

const errorPrompt = "请输入正确的金额！";
const emptyPrompt = "100元起购！";
const acceptPrompt = "请先阅读服务协议！";

const rootURL = window.reqURL.fm + "fm/";

export default class Detail extends Component {

    constructor(props,context){
        super(props,context);
        this.state = {
            amount: "",                 //购买金额
            provider: "上海银行",         //产品提供机构，暂时写死
            productName: "",            //产品名称
            sevenDaysOfYield: "",       //七日年化收益率            
            perMillionIncome: "",       //每万份收益
            netWorthDate: '',           //净值日期
            isAccept: false,            //是否接受协议
            productData: productData,   //卡片产品详情
            applyData: applyData,       //产品详情表格数据
            applyRule: applyRule,       //申购规则
            redeemData: redeemData,     //赎回表格数据
            redeemRule: redeemRule,     //赎回规则
            prompt: "",                 //申购金额填写错误提示
            selCanvas: "canvas1",       //趋势图选择标识
            trendData: [],              //趋势图数据
            showModal: false,           //模态框显示标识
            type: "",                   //模态框类型
            messageTitle: "",           //模态框标题
            messageText: "",            //模态框正文
            lButtonText: "",            //模态框左边按钮文字
            rButtonText: "",            //模态框右边按钮文字
            lLink: "",                  //模态框左边按钮链接，默认为关闭模态框
            rLink: "",                  //模态框右边按钮链接，默认为关闭模态框  
            parentNodes: this.props.location.state  //上个页面带过来的点击申购那条数据的信息
        };
    }

    /**
     * @method Ajax请求
     * @param url 请求url
     * @param param 请求参数对象
     * @param successFun 请求成功时调用的函数，返回需要更新的状态，不需更新状态时不返回对象
     * @param localParam 需要传递的局部变量参数
     */
    request = (url, param, successFun, localParam) => {
		const _this = this;
        Ajax({
            url: url,
            data: param,
			success: function(res) {
				const { data, success, message } = res;
                if (success) {
                    const result = successFun(data, localParam);
                    if (typeof result != "undefined"){
                        _this.setState(result);
                    }                 
                } else {
                    Message.create({content: '数据请求出错！', color: 'danger'});
                }
			},
			error: function(res) {
				Message.create({content: '数据请求出错！', color: 'danger'});
			}
		});
    };

    /**
     * @method 查询页面，包含详情页的所有数据和近一月的历史收益率
     */
   getAllData = () => {   
        let productCode = this.state.parentNodes.detailCode;
        let param = {productCode: productCode};
        let url = rootURL + "queryinfo/queryProductInfoWithRate";
        let localParam = {productCode: productCode};
        this.request(url, param, this.dataSuccess, localParam);
    }
    /**
     * @method 查询成功时调用的函数
     * @param {*} data 返回数据
     * @param {*} localParam 局部参数对象
     * @return 需要更新的状态对象
     */
    dataSuccess(data, localParam){
        const detail = data.detail;
        const productCode = localParam.productCode;
        const trendData = data.rate.map((point) => {                       
            return [point.productDate, point.sevenDaysOfYield];
        });
        return {
            productCode: productCode,
            productName: detail.productName,
            netWorthDate: detail.netWorthDate,
            sevenDaysOfYield: detail.sevenDaysOfYield,
            perMillionIncome: detail.perMillionIncome,
            trendData: trendData
        };
    }

    /**
     * @method 处理收益率趋势图时间区间切换
     * @param 按钮的id
     */
    handleCanvasChange = (key) => { 
        const buttonId = key.target.id;
        const dayData = buttonId == "canvas2" ? 90 : (buttonId == "canvas3" ? 360 : 30);
        //这里只更新状态的值不render，请求后再render，并使用新的selCanvas
        this.state.selCanvas = buttonId;
        const url = rootURL + "queryinfo/queryproductrateinfo";
        const param = {productCode: this.state.parentNodes.detailCode, dayData: dayData};
        const localParam = {selCanvas: this.state.selCanvas};
        this.request(url, param, this.trendSuccess, localParam);
    }

    componentDidMount () {
        this.getAllData();       
    }

    /**
     * @method 处理申购请求
     */
    handleApply = ()=> {
        const { amount, isAccept, parentNodes } = this.state;
        //const {productCode, productName, custCode, eAcctNo, orgid, eAcctName} = this.props.location.state;
        if(amount == "" || parseFloat(amount) < 100){
            this.setState({prompt: emptyPrompt});
            return;
        }
        if(!isAccept){
            this.setState({prompt: acceptPrompt});
            return;
        }      
        
        const url = rootURL + "subscribe/applySubmit";
        const param = {
            amount: amount,
            productCode: parentNodes.detailCode,
            custCode: parentNodes.custcode, 
            productName: parentNodes.detailName,
            eacctname: parentNodes.eacctname,
            eacctno: parentNodes.eacctno
        };
        const localParam = {provider: this.state.provider, productCode: parentNodes.detailCode, 
                            productName: parentNodes.detailName, custCode: parentNodes.custcode,
                            eacctname: parentNodes.eacctname, eacctno: parentNodes.eacctno
                        };
        this.request(url, param, this.applySuccess, localParam);
    }

    /**
     * @method 趋势图请求成功后调用
     * @param {*} data 返回数据
     * @param {*} localParam 局部参数对象
     * @return 需要更新的状态对象
     */
    trendSuccess(data, localParam) {
        let points = new Array();
        points = data.map((item)=>{
            return [item.productDate, item.sevenDaysOfYield];
        });
        return {trendData: points, selCanvas: localParam.selCanvas};
    }

    /**
     * @method 申购请求成功时调用
     * @param {*} data 返回数据
     * @param {*} localParam 局部参数对象
     * @return 需要更新的状态对象
     */
    applySuccess(data, localParam){
        const {provider, productCode, productName, custCode} = localParam;
        const href = "/if/myasset";
        //产品和账户参数传递传递到下一页面
        const info = {productCode: productCode, productName: productName, custCode: custCode};
        const path = {pathname: href, state: info};
        const dataJson = JSON.parse(data);
        if(dataJson.status == "00"){          
            return {               
                showModal: true,
                type: "success",
                messageTitle: "申购成功！",
                messageText: "您已成功申购" + provider + "提供的“" + productName + "”",
                lButtonText: "继续申购",
                rButtonText: "查看进度",
                lLink: "/if/myasset",
                rLink: '/if/myasset'
            };
        }else if(dataJson.status == "01"){
            const diff = dataJson.diff;
            const messageText = (typeof diff == "undefined" || diff.length > 30)
                                ? <span>是否现在转入？</span> : <div>还需转入<span>{Number(diff).formatMoney()}</span>元，<div>是否现在转入？</div></div>;
            return{
                showModal: true,
                type: "careful",
                messageTitle: "您的余额不足~",
                messageText: messageText,
                lButtonText: "现在转入",
                rButtonText: "不转入",
                lLink: '/if/myasset',
                rLink: ""
            };
        }
    }

    /**
     * @method 根据输入返回不同的货币校验状态
     * @param e 输入事件
     */
    handleCoinInput = (e) => {
        const amount = e.target.value;     
        const isCoin = this.checkCoinInput(amount);
        if(isCoin == 1){
            //通过且更新数字，关闭错误提示
            this.setState({amount: amount, prompt: ""});
        }else if(isCoin == 0){
            //输入不合法，不更新数字且提示（输入了字母等符号）
            this.setState({prompt: errorPrompt});
        }else if(isCoin == 2){
            //isCoin==2时不更新数字但是关闭提示
            this.setState({prompt: ""});
        }
    }
 
    /**
     * 货币格式输入校验
     * @param input 输入字符串
     * @return
     * 0：输入不合法，不更新数字且提示（输入了字母等符号）
     * 1：通过且更新数字，关闭错误提示
     * 2：不通过，不更新数字但不提示（此情况为小数点后数据超长）
     */
    checkCoinInput = (input) => {            
        if(input == ""){
            return 1;
        }
        //输入的字符是否是数值
        if(!isNaN(input)){
            //统计小数点的个数
            let pointCount = 0;
            for(let i = 0; i < input.length; i++){
                if(input[i] == '.'){
                    pointCount++;
                }
            }
            //最多只能输入一个小数点
            if(pointCount < 1){
                return 1;
            }else if(pointCount == 1){
                const decimal = input.split(".")[1];
                if(decimal.length <= 2){
                    return 1;
                }
                return 2;
            }
        }
        return 0;
    }
    
    /**
     * @method 处理checkbox状态
     */
    handleCheckBoxChange = () => {
        this.setState((preState) => {
            return preState ? {isAccept: !preState.isAccept, prompt: ""} : {isAccept: !preState.isAccept}
        });
    }

    /**
     * @method 日期格式转换
     * @param str 输入字符串，如20171127
     * @return 以"-"连接的日期
     */
    str2DateFormat = (str) => {
        return str.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3');
    }

    /**
     * @method 当前日期加特定天数
     * @origin created by sunzeg @17/11/23
     * @param {*} startDate 开始日期
     * @param {*} day 累加的填数
     * @param {*} symbol 连接符，缺省时用年月日连接
     * @return 相加后的日期
     */
    dateAdd(startDate, day = 0, symbol) {
        startDate = +startDate + day*1000*3600*24;
        startDate = new Date(startDate);
        if(typeof symbol != "undefined"){
            return startDate.getFullYear() + symbol + (startDate.getMonth() + 1) + symbol + startDate.getDate();
        }
        return (startDate.getMonth() + 1) + "月" + startDate.getDate() + "日";
    }

    render(){
        const {provider, productName, sevenDaysOfYield, perMillionIncome, isAccept, 
                productData, applyData, applyRule, redeemRule, redeemData, amount, 
                prompt, selCanvas, trendData, showModal, type, messageTitle, messageText,
                lButtonText, rButtonText, lLink, rLink} = this.state;
        const currDate = new Date();
        const hour = currDate.getHours();
        let showDate = "";
        if(hour >= 15){
            if(currDate.getDay() > 3){
                showDate = this.dateAdd(currDate, 4);
            }else{
                showDate = this.dateAdd(currDate, 2);
            }
        }else{
            if(currDate.getDay() > 4){
                showDate = this.dateAdd(currDate, 3);
            }else{
                showDate = this.dateAdd(currDate, 1);
            }
        }

        return (
            <div className="container" id="if_detail">
            <Row>
                {/* xs	移动设备显示列数(<768px)""
                sm	小屏幕桌面设备显示列数(≥768px)
                md	中等屏幕设备显示列数(≥992px)*/}
                <Col md={12} xs={12} sm={12}>
                    <Breadcrumb>
                    <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">投资理财</Breadcrumb.Item>
                    <Breadcrumb.Item active>投资申购</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col md={12} xs={12} sm={12} >
                    <div className='product-panel'>              
                        <Row>
                            <Col md={4} xs={4} sm={4} style={{marginTop: 0}}>
                                <div className="product-tag">
                                    <div className="product-type">稳健型</div>
                                    <div className="type-name">银行理财</div>
                                </div>
                                <div className="canvas-container">
                                    <div id="canvas-btn">
                                        <ButtonGroup style={{ margin: 10 }}>
                                        {canvasIds.map((item) => {
                                            return(
                                            <Button 
                                                id={item.id} 
                                                className={selCanvas == item.id ? "canvas-btn-sel" : "canvas-btn"} 
                                                onClick={this.handleCanvasChange} 
                                                colors="primary">
                                                {item.text}
                                            </Button>);                                           
                                        })}
                                        </ButtonGroup>
                                    </div>
                                    <TrendChart 
                                        canvasId={"canvas"}
                                        height={240}
                                        data={trendData}
                                        offset={0.1}
                                        xAxisFormat={this.str2DateFormat}
                                        xName={""}
                                        yName={"        7日年化收益率(%)"}
                                    />
                                    {/* <div id="canvas" className="product-canvas"></div> */}
                                </div>                              
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                <div className="right-panel">
                                    <Row>
                                        <Col md={3} xs={3} sm={3}>                                          
                                            <div className="product-name">{productName}</div>    
                                            <div className="product-provider">{provider}提供</div> 
                                            <div>
                                                <span className="product-rate">{sevenDaysOfYield}
                                                    <span className="percent">%</span>
                                                </span>                                            
                                            </div>
                                            <div className="profit">
                                                <span>    7日年化收益</span>
                                            </div>                                 
                                        </Col>
                                        <Col md={3} xs={3} sm={3}>
                                            <div className="product-info">
                                                <div>每万份收益</div>
                                                <div className="invest-earning">{perMillionIncome}</div>
                                                <div>投资期限：无期限</div>
                                                <div>成立时间：2017-11-09</div>
                                                <div>赎回时长：72小时</div>
                                            </div>                                       
                                        </Col>
                                        <Col md={6} xs={6} sm={6}>
                                            <div className="invest-info">
                                                <div className="product-name">我要投资</div>
                                                <div className="tip-title">
                                                    现在购买预计{showDate}(首笔)收益到账
                                                </div>                                           
                                                <InputGroup>
                                                    <FormControl 
                                                        className="input-amount"
                                                        type="text"
                                                        placeholder="100元起购"
                                                        value={amount}
                                                        onChange={this.handleCoinInput}
                                                    />                                                  
                                                </InputGroup>                                           
                                                <div className="tip-title">
                                                    <Checkbox 
                                                        className="checkbox"
                                                        checked={isAccept} 
                                                        onChange={this.handleCheckBoxChange}>                                                                                                      
                                                    </Checkbox>
                                                    <span className="checkbox-text">                                                   
                                                        我已阅读<Link rel="parent" target="_blank" to="/if/agreement"><a>广发基金企业版网上交易服务协议</a></Link>
                                                    </span>
                                                </div>
                                                <Button className="input-btn" colors="warning" onClick={this.handleApply}>立即申购</Button>
                                                <div className="prompt">{prompt}</div>
                                            </div>
                                        </Col>
                                    </Row>                                                                  
                                </div>
                            </Col>
                        </Row>            
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12} xs={12} sm={12}>
                <div className="tab-panel">
                    <div className="tab-container">
                        <Tabs
                            defaultActiveKey="1"
                            tabBarStyle="upborder">
                            <TabPane tab="产品介绍" key="1">
                                <div className="table-panel">
                                    <div className="text-title">基金概况</div>
                                    <Table className="column-table" bordered data={productData} columns={columns}/>
                                    <div className="introduction-panel">
                                        {introduction.map((item) => {
                                            return (
                                                <div>
                                                    <div className="text-title">{item.key}</div>
                                                    <div className="text-content">{item.content}</div>
                                                </div>                                           
                                            );
                                        })}
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="申赎规则" key="2">
                                <div className="content-panel">
                                    <div className="content-line">
                                        <div><span className="content-title">申购：</span><p>{applyRule}</p></div>
                                    </div>
                                    <div className="content-line">
                                        <div><span className="content-title">赎回：</span><p>{redeemRule}</p></div>
                                    </div>
                                </div>
                                <div className="dynamic-table">
                                    <Table bordered data={applyData} columns={applyColumns}/>
                                </div>
                            </TabPane>
                            <TabPane className="redeem-table" tab="赎回规则" key="3">
                                <div className="dynamic-table">
                                    <Table bordered data={redeemData} columns={redeemColumns}/>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                </Col>
            </Row>
            <InfoModal 
                show={ this.state.showModal }
                type={type}
                onHide={() => this.setState({showModal: false})}
                messageTitle={messageTitle}
                messageText = {messageText}
                lButtonText={lButtonText}
                rButtonText={rButtonText}
                lLink={lLink}
                rLink={rLink}
                onClose={() => this.setState({showModal: false})}
            />
            </div>
        );
    }
}
