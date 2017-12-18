import React, { Component } from "react";
import {
Breadcrumb,
Row,
Col,
Button,
Message
} from "tinper-bee";
import Alert from 'bee-alert';
import { Link } from "react-router";
import Ajax from '../../../../utils/ajax';
import "./index.less";
import "../../../../utils/utils.js";
import InfoModal from "../../containers/InfoModal/index.js";

const rootURL = window.reqURL.fm + "fm/";
export default class applypurchase extends Component {

    static contextTypes = {  
        //this.context.router。push跳转必须
        router:React.PropTypes.object  
    }  

    constructor(props, context){
        super(props, context);
        this.state = {
            productList: [],    //产品列表数据数组
            showModal: false,   //是否显示模态框
            messageTitle: "",   //模态框标题
            messageText: "",    //模态框正文
            lButtonText: "",    //模态框左边按钮文字
            rButtonText: "",    //模态框右边按钮文字
            lLink: ""           //模态框左边按钮链接，默认为关闭模态框
        };
        this.context.router; // it works
    }

    componentWillMount(){
        this.getAllData();
    }

    /**
     * @method 查询产品列表数据
     */
    getAllData = () => {
        const _this = this;
        Ajax({
			url: rootURL + "queryinfo/queryproductlist",
			success: function(res) {
				const { data, message, success } = res;
				if (success) {                  
					const productList = data.map((item) => {
                        const provider = item.productCode == "000509" ? "上海银行" : "";
                        return {
                                productCode: item.productCode,
                                productName: item.productName,
                                provider: provider,
                                netWorthDate: item.netWorthDate,
                                sevenDaysOfYield: item.sevenDaysOfYield,
                                perMillionIncome: item.perMillionIncome
                            }
                    });
                    _this.setState({productList: productList}); 
				} else {
					Message.create({content: '数据请求出错！', color: 'danger'});
				}
			},
			error: function(res) {
				Message.create({content: '数据请求出错！', color: 'danger'});
			}
		});

        //测试数据
        // const [provider, sevenDaysOfYield, perMillionIncome, productCode, productName, custCode, custName] = ["广发银行", 10.8, 3.9482, "0000", "广发钱袋子货币A", "szg", "孙泽光"];          
        // const productList = [
        //     {
        //         provider: provider,
        //         sevenDaysOfYield: sevenDaysOfYield,
        //         perMillionIncome: perMillionIncome,
        //         productCode: productCode,          
        //         productName: productName,
        //         custCode: custCode,
        //         custName: custName 
        //     }
        // ]; 
        // this.setState({productList: productList});
    }

    /**
     * @method 处理按钮点击事件请求，校验产品是否开户，若开户跳转详情页，否则跳转开户页
     * @param productCode 产品编码
     * @param productName 产品名称
     * @param e 点击事件
     */
    handleButtonClick = (productCode, productName, e) => {
        const _this = this;      
        let custCode = "";  
        Ajax({
            url: rootURL + "subscribe/subscribeImmediately",
            data: {
				productCode: productCode
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {                                 
                    custCode = data.custCode;
                    const eAcctNo = data.eAcctNo;
                    const orgid = data.orgid;
                    const eAcctName = data.eAcctName;
                    if(custCode == ""){
                        const href = "/if/register";
                        //产品和账户参数传递传递到下一页面
                        const info = {productCode: productCode};
                        const path = {pathname: href, state: info};                     
                        _this.setState({
                            showModal: true,
                            messageTitle: "还没账户,是否现在申请？",
                            messageText: "您所申购的是" + provider + "提供的“" + productName + "”",
                            lButtonText: "马上注册",
                            rButtonText: "不申请",
                            lLink: path,
                        });
                    }else{
                        const buttonUrl = "/if/detail";
                        //产品和账户参数传递传递到下一页面
                        const info = {productCode: productCode, productName: productName, custCode: custCode, 
                                        eAcctNo: eAcctNo, orgid: orgid, eAcctName: eAcctName};
                        const path = {pathname: buttonUrl, state: info};
                        _this.context.router.push(path);
                    }
				} else {
					Message.create({content: '数据请求出错！', color: 'danger'});
				}
			},
			error: function(res) {
                Message.create({content: '数据请求出错！', color: 'danger'});
			}
        });
        //测试数据
        // const buttonUrl = "/if/detail";
        // //产品和账户参数传递传递到下一页面
        // const info = {productCode: productCode};
        // const path = {pathname: buttonUrl, state: info};
        // _this.context.router.push(path);
    }

    /**
     * @method 渲染产品列表的立即申购按钮
     * @param {*} productCode 产品编码
     * @param {*} productName 产品名称
     */
    renderButton(productCode, productName){       
        return(
            <Button 
                className="earn-btn" 
                size="xg" 
                colors="warning"
                onClick={(e) => this.handleButtonClick(productCode, productName, e)}>
                立即申购
            </Button>
        );
    }

    /**
     * @method 渲染产品里里列表
     * @param {*} list 产品列表数据数组
     */
    renderProductList(list) {
        return list.map((product) => {
            const {productCode, productName, sevenDaysOfYield, perMillionIncome, provider} = product;
            const {messageTitle, messageText, lButtonText, rButtonText, lLink} = this.state;
            return(
                <Row>
                    <Col md={12} xs={12} sm={12} >
                        <div id="if_applyperchase_product-container" className="product-container">              
                            <Row>
                                <Col md={4} xs={4} sm={4}>
                                    <div className="top-pic">
                                        <div className="pic-title">活期理财</div>
                                        <div className="pic-subtitle">快速赎回，灵活理财</div>
                                        <div className="pic-description">
                                            <div>天天有收益，可理财可消费</div>
                                            <div>已为3000万+用户提供服务</div>
                                        </div>
                                        
                                    </div>
                                    <div className="product-tag">
                                        <div className="product-type">稳健型</div>
                                        <div className="type-name">银行理财</div>
                                    </div>
                                </Col>
                                <Col md={3} xs={3} sm={3}>
                                    <div className="rate-panel">                                  
                                        <div className="hot-name">{productName}</div>
                                        <div className="hot-rate">{sevenDaysOfYield}<span className="percent">%</span></div>
                                        <div className="hot-profit">7日年化收益</div>
                                        <div className="earn-panel">
                                            {this.renderButton(productCode, productName)}
                                        </div>                                       
                                    </div>
                                </Col>
                                <Col md={5} xs={5} sm={5}>
                                    <div className="info-panel">
                                        <Col md={6} xs={6} sm={6}>
                                            <div className="invest-info">
                                                <div className="product-provider">{provider}提供</div>
                                                <div>成立时间：2017-11-09</div>
                                                <div>赎回时长：72小时</div>
                                            </div>
                                        </Col>
                                        <Col style={{margin: 0, padding: 0}} md={6} xs={6} sm={6}>
                                            <div className="invest-info">
                                                <div>每万份收益：</div>
                                                <div className="income">{perMillionIncome}</div>
                                                <div>投资期限：无期限</div>
                                            </div>
                                        </Col>          
                                    </div>                                                
                                </Col>
                            </Row>            
                        </div>
                    </Col>
                    <InfoModal 
                        show={ this.state.showModal }
                        type={"remind"}
                        onHide={() => this.setState({showModal: false})}
                        messageTitle={messageTitle}
                        messageText = {messageText}
                        lButtonText={lButtonText}
                        rButtonText={rButtonText}
                        lLink={lLink}
                        onClose={() => this.setState({showModal: false})}
                    />   
                </Row>           
            );
        });           
    }
    
    render(){
        const {productList, custCode, custName} = this.state;
        const accountPath = "/if/myasset";
        return (
            <div id="if_applyperchase" className="container">
                 <Row>
                    {/* 面包屑 */}
                    {/* xs	移动设备显示列数(<768px)
                    sm	小屏幕桌面设备显示列数(≥768px)
                    md	中等屏幕设备显示列数(≥992px)*/}               
                    <Col md={12} xs={12} sm={12}>
                        <div class = "bread">
                            <Breadcrumb>
                            <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                            <Breadcrumb.Item href="#">投资理财</Breadcrumb.Item>
                            <Breadcrumb.Item active>投资申购</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </Col>
                </Row>            
                {/* 产品特点 */}
                <Row>                   
                    <div className="top-container">
                        <div className="top-introduction">
                            {custCode != "" 
                                && <div className="account">
                                    欢迎使用  |  <Link to={accountPath}><a>账户中心</a></Link>
                                    </div>}
                        </div>
                    </div>
                </Row>
                {/* 产品列表 */}
                {this.renderProductList(productList)}
                {/* 注册步骤 */}
                <Row>
                    <div className="step-container"></div>        
                </Row>        
                <Row>
                    <div className="contract-container">
                        <div className="contract-text">客服热线 400-088-8816（每天9:00-22:00仅收市话）</div>    
                        <div className="contract-text">Copyright©2017网银在线（北京）科技有限公司版权所有</div>   
                        <div className="contract-last">投资有风险，购买需谨慎</div>   
                    </div>        
                </Row>    
            </div>
        );
    }
}
