/**
 * 授信额度监控
 * majfd
 * 版本 1.0
 */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Table, Button, FormControl, Icon, Modal, Select, InputGroup, Popconfirm, Row, Col } from 'tinper-bee';
import Loading from 'bee-loading';
import 'bee-loading-state/build/Loadingstate.css';
import { numFormat, toast } from '../../../../utils/utils.js';
import Ajax from '../../../../utils/ajax.js';
import { CheckBox, CheckBoxs } from '../../../../containers/CheckBoxs';
import PageJump from '../../../../containers/PageJump';
import CheckTable from '../../../../containers/CheckTable';
import Refer from '../../../../containers/Refer';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import NoData from '../../../../containers/NoData';
import Form from 'bee-form';

import moment from 'moment';
const rootURL = window.reqURL.fm;
const FORMAT = 'YYYY-MM-DD';
const { FormItem } = Form;
import './index.less';
import edu from '../../../../static/images/edu.png';
import { MonitorEcharts } from './MonitorEcharts';

export default class CreditMonitor extends Component {
	constructor() {
		super();
		this.state = {
			checkedList: [],
			pageIndex: 1, //当前页
			pageSize: 10, //每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentKey: 0,
			keyWords: '', //模糊查询关键字
			loadingShow: false,
			dataList: []
		};
	}

	componentWillMount() {
		this.getCreditListQuery(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	}

	getCreditListQuery(page, size, keyWords = '') {
		const _this = this;
		const searchMap = {
			params: keyWords
		};
		Ajax({
			url: rootURL + 'fm/creditmonitor/list',
			data: {
				page: page - 1,
				size,
				searchParams: {
					searchMap
				}
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map((item) => item.values);
					let pageinfo = data && data.head ? data.head.pageinfo || {} : {};
					console.log(JSON.stringify(dataList));
					_this.setState({
						dataList: dataList && JSON.stringify(dataList) !== '{}' ? dataList : [],
						currentRecord: dataList && JSON.stringify(dataList) !== '{}' ? dataList[0] : {},
						maxPage: (pageinfo && pageinfo.totalPages) || 1,
						totalSize: (pageinfo && pageinfo.totalElements) || 0,
						loadingShow: false
					});
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: (res) => {
				toast({ content: res.message, color: 'danger' });
			}
		});
	}

	valueToState(datalist) {
		let data = dataList && JSON.stringify(dataList) !== '{}' ? dataList : [];
		data.map((item) => {
			if (item.lavequota.value == '0E-8') {
				item.lavequota.value = 0.0;
			}
			if (item.beforequota.value == '0E-8') {
				item.beforequota.value = 0.0;
			}
			if (item.quota.value == '0E-8') {
				item.quota.value = 0.0;
			}
			if (item.applyquota.value == '0E-8') {
				item.applyquota.value = 0.0;
			}
			if (item.usedquota.value == '0E-8') {
				item.usedquota.value = 0.0;
			}
		});
		return data;
	}

	// 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getCreditListQuery(page, this.state.pageSize);
	};

	//页数量选择
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getCreditListQuery(1, value);
	};

	//模糊查询操作
	handleSearch = (val) => {
		// console.log('模糊查询'+ val);
		this.getCreditListQuery(1, this.state.pageSize, this.state.keyWords);
		this.setState({ pageIndex: 1 });
	};

	//路由跳转到授信协议卡片页面
	routerJump = (record, type) => {
		let id = record.id.display || record.id.value || 0;
		hashHistory.push(`/fm/creditadjustdetail?id=${id}&type=${type}`);
	};

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资交易' }, { title: '授信额度监控' } ];

	render() {
		let {
			dataList,
			pageSize,
			pageIndex,
			maxPage,
			totalSize,
			keyWords,
			currentRecord,
			loadingShow,
			moreQueryShow,
			checkedList,
			MsgModalShow,
			currentKey
		} = this.state;

		let columns = [
			{
				title: '序号',
				key: 'key',
				dataIndex: 'key',
				width: '8%',
				render: (text, record, index) => {
					return <div>{(pageIndex - 1) * pageSize + index + 1}</div>;
				}
			},
			{
				title: '协议编号',
				key: 'agreecode',
				dataIndex: 'agreecode',
				width: '22%',
				render: (text, record) => {
					return (
						// <div
						// 	onClick={() => {
						// 		this.routerJump(record, 'detail');
						// 	}}
						// >
						<div>{record.agreecode.display || record.agreecode.value}</div>
						// </div>
					);
				}
			},
			{
				title: '授信银行',
				key: 'agreebankid',
				dataIndex: 'agreebankid',
				width: '20%',
				render: (text, record) => {
					let agreebankid = record.agreebankid.display || record.agreebankid.value;
					return <div>{agreebankid}</div>;
				}
			},
			{
				title: '受信人',
				key: 'creditorgid',
				dataIndex: 'creditorgid',
				width: '20%',
				render: (text, record) => {
					let creditorgid = record.creditorgid.display || record.creditorgid.value;
					return (
						<div title={creditorgid}>
							<span>{creditorgid}</span>
						</div>
					);
				}
			},
			{
				title: '币种',
				key: 'currtypeid',
				dataIndex: 'currtypeid',
				width: '10%',
				render: (text, record) => {
					return <div>{record.currtypeid.display || record.currtypeid.value}</div>;
				}
			},
			{
				title: '可用授信',
				key: 'lavequota',
				dataIndex: 'lavequota',
				width: '20%',
				render: (text, record) => {
					let lavequota = record.lavequota.display || record.lavequota.value;
					let lavequota_t = lavequota ? numFormat(parseFloat(lavequota), '') : 0.0;
					return <span title={lavequota_t}>{lavequota_t}</span>;
				}
			}
		];
		console.log('currentRecord', currentRecord);
		// 协议状态
		let agreestatus = currentRecord.agreestatus && currentRecord.agreestatus.value;
		let agreestatus_dis =
			agreestatus == -1
				? '待提交'
				: agreestatus == 0
					? '待审批'
					: agreestatus == 2 ? '未执行' : agreestatus == 3 ? '在执行' : agreestatus == 4 ? '已结束' : '';
		// 协议类型
		let agreetype = currentRecord.agreetype && currentRecord.agreetype.value;
		let agreetype_dis =
		agreetype === 'org'
				? '企业授信'
				: agreetype === 'group'
					? '集团授信'
				: '';
		return (
			<div className="bd-wraps fm-creditmonitor">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div className="bd-header">
					<span className="bd-title-1">授信额度监控</span>
					<InputGroup simple className="search-box fr">
						<FormControl
							value={keyWords}
							onChange={(e) => {
								this.setState({
									keyWords: e.target.value
								});
							}}
							onKeyDown={(e) => {
								if (e.keyCode === 13) {
									this.handleSearch(e.target.value);
								}
							}}
							placeholder="搜索协议编号、授信银行"
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearch.bind(this, keyWords)} />
						</InputGroup.Button>
					</InputGroup>
				</div>
				<Row>
					<Col xs={8} sm={8} md={8}>
						<Table
							emptyText={NoData}
							bordered
							className="bd-table monitor-table"
							columns={columns}
							data={dataList}
							rowKey={(record) => record.id.value}
							onRowClick={(record, index, event) => {
								console.log('record', record);
								this.setState({
									currentRecord: JSON.parse(JSON.stringify(record))
								});
							}}
						/>
						<PageJump
							pageSize={pageSize}
							activePage={pageIndex}
							maxPage={maxPage}
							pageSizeShow={false}
							totalSize={totalSize}
							onChangePageSize={this.onChangePageSize}
							onChangePageIndex={this.onChangePageIndex}
						/>
					</Col>
					<Col xs={4} sm={4} md={4}>
						<div className="creditmonitor-echarts">
							<div className="echarts-header">
								<span className="echarts-header-item">{agreetype_dis}</span>
								<span className="echarts-header-item fr">协议状态：{agreestatus_dis}</span>
							</div>
							<div>
								<MonitorEcharts data={this.state.currentRecord} />
							</div>
							<div className="echarts-floor">
								<span className="echarts-header-item">
									起始日期：{currentRecord.begindate && currentRecord.begindate.value}
								</span>
								<span className="echarts-header-item fr">
									结束日期：{currentRecord.enddate && currentRecord.enddate.value}
								</span>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}
