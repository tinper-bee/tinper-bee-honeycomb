import React, { Component } from 'react';
import { Row, Col } from 'tinper-bee';
import Refer from 'containers/Refer';
import './demo.less';

export default class ReferDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cctypeRef: {},
			finorgRef: {},
			currencyRef: {},
			balatypeRef: {},
			finbranchRef: {},
			finbranchRef1: {},
			finbranchRef2: {},
			finbranchRef3: {},
			partnerRef: {},
			bankaccbasRef: {},
			projectRef: {},
			projectClassRef: {},
			transtypeRef1: {},
			transtypeRef2: {},
			transtypeRef3: {},
			transtypeRef4: {},
			transtypeRef5: {},
			transtypeRef6: {},
			rateRef: {},
			repaymentmethodRef: {},
			interestDayRef: {},
			payplancode: {},
			contractcode: {},
			ccagreementRef: {},
			exrateRef: {},
			financepayRef: {}
		};
	}
	render() {
		return (
			<div id="refer-demo" className="bd-wraps" style={{ width: 'auto' }}>
				<Row style={{ margin: '0' }}>
					<h1>普通参照</h1>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/cctypeRef/'}
							refCode={'cctypeRef'}
							refName={'授信类别'}
							value={this.state.currency1}
							onChange={value => {
								this.setState({
									currency1: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/finorgRef/'}
							refCode={'finorgRef'}
							refName={'财务组织'}
							value={this.state.finorgRef}
							onChange={value => {
								this.setState({
									finorgRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/currencyRef/'}
							refCode={'currencyRef'}
							refName={'币种'}
							value={this.state.currencyRef}
							onChange={value => {
								this.setState({
									currencyRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/balatypeRef/'}
							refCode={'balatypeRef'}
							refName={'结算方式'}
							value={this.state.balatypeRef}
							onChange={value => {
								this.setState({
									balatypeRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/finbranchRef/'}
							refCode={'finbranchRef'}
							refName={'金融机构'}
							value={this.state.finbranchRef}
							onChange={value => {
								this.setState({
									finbranchRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/finbranchRef/'}
							refCode={'finbranchRef'}
							refName={'金融网点'}
							value={this.state.finbranchRef1}
							onChange={value => {
								this.setState({
									finbranchRef1: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['金融机构'],
									code: ['refname']
								},
								{
									name: ['金融网点'],
									code: ['refname']
								}
							]}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/partnerRef/'}
							refCode={'partnerRef'}
							refName={'合作伙伴'}
							value={this.state.partnerRef}
							onChange={value => {
								this.setState({
									partnerRef: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['编码', '名称'],
									code: ['refcode', 'refname']
								}
							]}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/bankaccbasRef/'}
							refCode={'bankaccbasRef'}
							refName={'银行账户'}
							value={this.state.bankaccbasRef}
							onChange={value => {
								this.setState({
									bankaccbasRef: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['子户编码', '子户名称'],
									code: ['refcode', 'refname']
								}
							]}
							clientParam={{
								opentime: '2017-11-27 18:19:41'
							}}
							referFilter={{
								accounttype: 0, //01234对应活期、定期、通知、保证金、理财
								currtypeid: 'G001ZM0000DEFAULTCURRENCT00000000001' //币种pk
								// orgid: '111' //组织pk
							}}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/projectRef/'}
							refCode={'projectRef'}
							refName={'项目'}
							value={this.state.projectRef}
							onChange={value => {
								this.setState({
									projectRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/projectClassRef/'}
							refCode={'projectClassRef'}
							refName={'项目类型'}
							value={this.state.projectClassRef}
							onChange={value => {
								this.setState({
									projectClassRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/rateRef/'}
							refCode={'rateRef'}
							refName={'利率管理'}
							value={this.state.rateRef}
							onChange={value => {
								this.setState({
									rateRef: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['名称', '利率'],
									code: ['refname', 'rate']
								}
							]}
							clientParam={{
								ratestartdate: '2017-11-25 14:42:32'
							}}
							referFilter={{
								currtypeid: 'G001ZM0000DEFAULTCURRENCT10000000012'
							}}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/repaymentmethodRef/'}
							refCode={'repaymentmethodRef'}
							refName={'还款方式'}
							value={this.state.repaymentmethodRef}
							onChange={value => {
								this.setState({
									repaymentmethodRef: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['编码', '名称'],
									code: ['refcode', 'refname']
								}
							]}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/interestDayRef/'}
							refCode={'interestDayRef'}
							refName={'结息日'}
							value={this.state.interestDayRef}
							onChange={value => {
								this.setState({
									interestDayRef: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['编码', '名称'],
									code: ['refcode', 'refname']
								}
							]}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/fm/payplanref/'}
							refCode={'payplancode'}
							refName={'放款计划'}
							value={this.state.payplancode}
							onChange={value => {
								this.setState({
									payplancode: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/fm/contractref/'}
							refCode={'contractcode'}
							refName={'合同'}
							value={this.state.contractcode}
							onChange={value => {
								this.setState({
									contractcode: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/ccagreementRef/'}
							refCode={'ccagreementRef'}
							refName={'授信协议'}
							value={this.state.ccagreementRef}
							onChange={value => {
								this.setState({
									ccagreementRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/exrateRef/'}
							refCode={'exrateRef'}
							refName={'汇率'}
							value={this.state.exrateRef}
							onChange={value => {
								this.setState({
									exrateRef: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/fm/financepayRef/'}
							refCode={'financepayRef'}
							refName={'放款编号'}
							value={this.state.financepayRef}
							onChange={value => {
								this.setState({
									financepayRef: {
										refpk: value.id,
										refname: value.loancode
									}
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['放款编号', '贷款机构', '放款金额'],
									code: ['loancode', 'financorgid_n', 'loanmny']
								}
							]}
						/>
					</Col>
				</Row>
				<Row>
					<h1>交易类型多级选择参照</h1>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易大类'}
							value={this.state.transtypeRef1}
							onChange={value => {
								this.setState({
									transtypeRef1: value
								});
							}}
							clientParam={{
								maincategory: 2 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['交易大类'],
									code: ['refname']
								}
							]}
							referFilter={{
								type: 'loan' //是贷款时加这个
							}}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易类型'}
							value={this.state.transtypeRef2}
							onChange={value => {
								this.setState({
									transtypeRef2: value
								});
							}}
							clientParam={{
								maincategory: 2 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['交易大类'],
									code: ['refname']
								},
								{
									name: ['交易类型'],
									code: ['refname']
								}
							]}
							referFilter={{
								type: 'loan' //是贷款时加这个
							}}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'事件'}
							value={this.state.transtypeRef3}
							onChange={value => {
								this.setState({
									transtypeRef3: value
								});
							}}
							clientParam={{
								maincategory: 2 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['交易大类'],
									code: ['refname']
								},
								{
									name: ['交易类型'],
									code: ['refname']
								},
								{
									name: ['事件'],
									code: ['refname']
								}
							]}
							referFilter={{
								type: 'loan' //是贷款时加这个
							}}
						/>
					</Col>
				</Row>
				<Row>
					<h1>交易类型级联参照（后一级根据前一级过滤）</h1>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易大类'}
							value={this.state.transtypeRef4}
							onChange={value => {
								this.setState({
									transtypeRef4: value
								});
							}}
							clientParam={{
								maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['交易大类'],
									code: ['refname']
								}
							]}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易类型'}
							value={this.state.transtypeRef5}
							onChange={value => {
								this.setState({
									transtypeRef5: value
								});
							}}
							clientParam={{
								parentid: this.state.transtypeRef4.refpk,
								detailcategory: '2',
								maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['交易类型'],
									code: ['refname']
								}
							]}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'事件'}
							value={this.state.transtypeRef6}
							onChange={value => {
								this.setState({
									transtypeRef6: value
								});
							}}
							clientParam={{
								parentid: this.state.transtypeRef5.refpk,
								detailcategory: '3',
								maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['事件'],
									code: ['refname']
								}
							]}
						/>
					</Col>
				</Row>
				<Row>
					<h1>金融网点级联参照（后一级根据前一级过滤）</h1>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/finbranchRef/'}
							refCode={'finbranchRef'}
							refName={'金融机构'}
							value={this.state.finbranchRef2}
							onChange={value => {
								this.setState({
									finbranchRef2: value
								});
							}}
							showLabel={true}
						/>
					</Col>
					<Col xs={3}>
						<Refer
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/finbranchRef/'}
							refCode={'finbranchRef'}
							refName={'金融网点'}
							value={this.state.finbranchRef3}
							onChange={value => {
								this.setState({
									finbranchRef3: value
								});
							}}
							showLabel={true}
							multiLevelMenu={[
								{
									name: ['金融网点'],
									code: ['refname']
								}
							]}
							clientParam={{
								parentid: this.state.finbranchRef2.refpk,
								typeCode: this.state.finbranchRef2.refcode
							}}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}
