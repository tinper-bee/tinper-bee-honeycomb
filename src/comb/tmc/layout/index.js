import React, { Component } from 'react';
import { Link } from 'react-router';
import './index.less';

export default class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="index">
				<div className="index-header">
					<h3 className="index-title">
						<Link to="/">资金云</Link>
					</h3>
					<ul className="index-main">
						{/* 基础档案路由 */}
						<li className="index-main-li">
							<h3>基础档案</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/bd/transtype">交易类型</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/bankaccbas">银行账户管理</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/cctype">授信类别</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/balatype">结算方式</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/project">项目</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/projecttype">项目类型</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/fininstitution">金融机构</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/bankpartner">合作伙伴</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/repaymentmethod">还款方式</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/rate">利率管理</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/finbank">银行网点</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/cashflowitem">现金流量项目</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/interestday">结息日</Link>
								</li>
								<li className="index-li">
									<Link to="/bd/test">测试。。</Link>
								</li>
							</ul>
						</li>
						{/* 融资交易路由 */}
						<li className="index-main-li">
							<h3>融资交易</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/fm/repayprcpl?type=add">还本</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/repayinterest">付息</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/contract">新增合同</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/intadjustbill">利息调整</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/apply">贷款申请</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/applycard">融资申请</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/payment">费用管理</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/loantransaction">贷款交易</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/costanalysis">融资成本分析</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/creditmanage">银行授信协议</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/creditadjust">授信调整</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/creditmonitor">授信额度监控</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/taizhang">担保台账</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/securityinterest">担保物权</Link>
								</li>
								<li className="index-li">
									<Link to="/fm/guaranteecontractmanage">担保合约</Link>
								</li>							
								<li className="index-li">
									<Link to="/fm/guacontractquote">担保债务管理</Link>
								</li>	
								<li className="index-li">
									<Link to="/fm/transactions">融资交易</Link>
								</li>	
								<li className="index-li">
									<Link to="/fm/assuremanage">担保管理</Link>
								</li>								
							</ul>
						</li>
						{/* 投资理财路由 */}
						<li className="index-main-li">
							<h3>投资理财</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/if/purchase">投资申购</Link>
								</li>
								<li className="index-li">
									<Link to="/if/myasset">我的资产</Link>
								</li>
								<li className="index-li">
									<Link to="/if/offline">线下投资</Link>
								</li>
								<li className="index-li">
									<Link to="/if/register">注册</Link>
								</li>
								<li className="index-li">
									<Link to="/if/assetmodal">我的资产模态框</Link>
								</li>
								<li className="index-li">
									<Link to="/if/ledger">投资台账</Link>
								</li>
							</ul>
						</li>
						{/* 结算平台路由 */}
						<li className="index-main-li">
							<h3>结算平台</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/pass/settlement">结算服务</Link>
								</li>
								<li className="index-li">
									<Link to="/pass/bankreceipt">银行对账单</Link>
								</li>
								<li className="index-li">
									<Link to="/pass/informer">集合对账</Link>
								</li>
								{/* <li className="index-li">
									<Link to="/pass/trading">交易综合查询</Link>
								</li> */}
								<li className="index-li">
									<Link to="/pass/all">交易综合查询</Link>
								</li>
								<li className="index-li">
									<Link to="/pass/search">交易查询</Link>
								</li>
							</ul>
						</li>
						{/* 审批路由 */}
						<li className="index-main-li">
							<h3>审批</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/pbm/approveList">审批列表</Link>
								</li>
								<li className="index-li">
									<Link to="/pbm/approveDetail">审批详情</Link>
								</li>
								<li className="index-li">
									<Link to="/pbm/approveSetting">审批配置</Link>
								</li>
							</ul>
						</li>
						{/* 所有参照 */}
						<li className="index-main-li">
							<h3>参照</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/demo/referdemo">所有参照</Link>
								</li>
							</ul>
						</li>
						{/* 所有参照 */}
						<li className="index-main-li">
							<h3>上传附件</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/upload/demo">上传附件</Link>
								</li>
							</ul>
						</li>
						{/* 首页 */}
						<li className="index-main-li">
							<h3>首页</h3>
							<ul className="index-ul">
								<li className="index-li">
									<Link to="/indexpage/tmcjiesuanchuna">结算出纳</Link>
								</li>
								<li className="index-li">
									<Link to="/indexpage/tmcjiesuanzhuguan">结算主管</Link>
								</li>
								<li className="index-li">
									<Link to="/indexpage/tmcxindaiyuan">信贷员</Link>
								</li>
								<li className="index-li">
									<Link to="/indexpage/tmcxindaizhuguan">信贷主管</Link>
								</li>
								<li className="index-li">
									<Link to="/indexpage/tmczijintouziyuan">资金投资员</Link>
								</li>
								<li className="index-li">
									<Link to="/indexpage/tmczijintouzizhuguan">资金主管</Link>
								</li>
							</ul>
						</li>
					</ul>
				</div>

				<div className="index-content">{this.props.children}</div>
			</div>
		);
	}
}
