import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import {Table, Button, FormControl, Icon, Select } from 'tinper-bee';
import './index.less';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import PageJump from '../../../../containers/PageJump';
import DeleteModal from '../../../../containers/DeleteModal';
import Refer from '../../../../containers/Refer';
import Menu from 'bee-menus';
import Dropdown from 'bee-dropdown';
import { toast } from '../../../../utils/utils.js';
import '../../../pass/containers/formatMoney.js';
import Ajax from '../../../../utils/ajax.js';
import nodataPic from '../../../../static/images/nodata.png';
const Option= Select.Option;
const URL= window.reqURL.fm;
const MenuItem= Menu.Item;

export default class Guacontractquote extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			dataList: [],
			searchMap: {},
			referCode: '',
			currtypeidName: '',	//币种名称
		};
	}

	componentWillMount () {
		this.getGuacontractquote(this.state.pageIndex, this.state.pageSize);
	}

	//请求列表
	getGuacontractquote = (page, size) => {
		const _this = this;
		let {searchMap}= this.state;
		Ajax({
			url: URL + 'fm/guacontractquote/list',
			data: {
				page: page-1,
				size,
				searchParams: {searchMap}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalPages : 1,
						totalSize: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalElements : 0,
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
					_this.err();
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
				_this.err();
			}
		}); 
	};

	//icon按钮操作
	setIconOperation = (path, content, record) => {
		const _this = this;
		let values= {};
		if (path=== 'save') {
			values= {
				id: record.id,
				tenantid: record.tenantid,
				ts: record.ts,
				status: {value: '3'}
			};
		} else {
			values= record;
		}
		Ajax({
			url: URL + 'fm/guacontractquote/' + path,
			data: {
				data: {head: {rows: [{ values}]}}
			},
			success: function(res) {
				const { message, success } = res;
				if (success) {
					toast({content: content, color: 'success'});
					_this.getGuacontractquote(_this.state.pageIndex, _this.state.pageSize);
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		});
	};

	//error 请求接口错误时回调
	err = () => {
		this.setState({
			dataList: [],
			maxPage: 1,
			totalSize: 0,
		});
	}

	// 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getGuacontractquote(page, this.state.pageSize);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getGuacontractquote(1, value);
	};

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资交易' }, { title: '担保债务管理' } ];

	render() {
		let {dataList, pageSize, pageIndex, maxPage, totalSize, searchMap, referCode, currtypeidName} = this.state;
		const columns= [
			{ 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: '5%',
				render: (text, record, index) => {
					return (
						<div>{pageSize* (pageIndex - 1) + index + 1}</div>
					);
				} 
			},
			{ 
				title: '制单日期', 
				key: 'creationtime', 
				dataIndex: 'creationtime', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.creationtime ? record.creationtime.display || record.creationtime.value || '—' : '—'}</div>
					);
				}  
			},
			{ 
				title: '担保债务单据号', 
				key: 'vbillno', 
				dataIndex: 'vbillno', 
				width: '20%',
				render: (text, record) => {
					return (
						<div 
							className='table-jump'
							onClick={() => {
								hashHistory.push(`/fm/guacontractquoteCard?id=${record.id.display || record.id.value}&type=detail`);
							}}
						>
							{record.vbillno ? record.vbillno.display || record.vbillno.value || '—' : '—'}
						</div>
					);
				} 
			},
			{ 
				title: '担保合同', 
				key: 'guacontractid', 
				dataIndex: 'guacontractid', 
				width: '22%',
				render: (text, record) => {
					return (
						<div>{record.guacontractid ? record.guacontractid.display || record.guacontractid.value || '—' : '—'}</div>
					);
				}  
			},
			{ 
				title: '方向', 
				key: 'direction', 
				dataIndex: 'direction', 
				width: '8%',
				render: (text, record) => {
					let direction= record.direction.display || record.direction.value;
					return (
						<div>{direction== 1 ? '占用' : '担保'}</div>
					);
				}  
			},
			{ 
				title: '币种/占用担保金额', 
				key: 'quoteamount', 
				dataIndex: 'quoteamount', 
				width: '20%',
				render: (text, record) => {
					let value= record.quoteamount.display || record.quoteamount.value;
					let scale= record.quoteamount.scale || -1;
					return (
						<div>
							<span>{record.currtypeid ? record.currtypeid.display || record.currtypeid.value || '—' : '—'}</span>
							<br/>
							<span>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '—'}</span> 
						</div>
					);
				}  
			},
			{
				title: '操作',
				key: 'operation',
				width: '15%',
				render: (text, record, index) => {
					let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
					return (
						<div>
							{vbillstatus== 0 &&
								[ <span
									onClick={() => {
										hashHistory.push(`/fm/guacontractquoteCard?id=${record.id.display || record.id.value}&type=edit`);
									}}
								>
									<Icon className="icon-style iconfont icon-bianji" />
								</span>,
								<span>
									<DeleteModal
										onConfirm= {() => {this.setIconOperation('save', '删除成功', record);}}
									/>	
								</span>, 
								<span 
									onClick={() => {
										this.setIconOperation('commit', '提交成功', record);
									}}
								>
									<Icon className="icon-style iconfont icon-tijiao" />
								</span> ]
							}
							{vbillstatus== 3 && 
								<span 
									onClick={() => {
										this.setIconOperation('uncommit', '收回成功', record);
									}}
								>
									<Icon className="icon-style iconfont icon-shouhui" />	
								</span>
							}
						</div>
					);
				}
			}
		];
		
		return (
			<div className= "fm-guacontractquote bd-wraps">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div className="bd-header">
					<div className='credit-title'>
						<span className="bd-title-1">担保债务管理</span>	
						<Button 
							className="btn-2 add-button"
							onClick={() => {
								hashHistory.push(`/fm/guacontractquoteCard?type=add`);
							}}
						>新增</Button>
					</div>
				</div>
				<div className="zijinyun-search">
					<Refer 
						placeholder="币种"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/currencyRef/'}
						refCode={'currencyRef'}
						refName={'币种'}
						value={{refpk: referCode, refname: currtypeidName ? currtypeidName : ''}}     
						onChange={item => {
							searchMap.currtypeid= JSON.stringify(item)!== '{}' ? item.id : '';
							currtypeidName= JSON.stringify(item)!== '{}' ? item.refname : '';
							if (!searchMap.currtypeid) {
								delete searchMap.currtypeid;
							}
							this.setState({
								searchMap, 
								referCode: 111, 
								currtypeidName
							});
						}}
					/>
					<Select 
						placeholder='数据类型'
						value={searchMap.quoteway}
						onChange= {val => {
							searchMap.quoteway= val;
							this.setState({searchMap});
						}}
					>
						<Option value={1}>引用</Option>	
						<Option value={2}>手工</Option>
					</Select>
					<Select 
						placeholder='方向'
						value={searchMap.direction}
						onChange= {val => {
							searchMap.direction= val;
							this.setState({searchMap});
						}}
					>
						<Option value={1}>占用</Option>	
						<Option value={2}>担保</Option>
					</Select>
					
					<FormControl 
						value = {searchMap.keyWords ? searchMap.keyWords : ''}
						className="input-box"
						onChange = {e => {
							searchMap.keyWords= e.target.value;
							this.setState({searchMap});
						}}
						placeholder = "搜索担保债务单据号" 
					/>
					<Button 
						className="search-btn"
						onClick={() => {
							this.getGuacontractquote(1, pageSize);
							this.setState({pageIndex: 1});
						}}
					>查询</Button>
					<span
						className='zijinyun-reset'
						onClick= {() => {
							this.setState({
								searchMap: {},
								currtypeidName: ''
							});
						}}
					>重置</span>
				</div>
				<Table 
					bordered 
					className="bd-table double"
					emptyText={() => <div>
							<img src={nodataPic} alt="" />
						</div>
					}
					columns={columns} 
					data={dataList} 
					rowKey={record => record.id.value}
				/>
				<PageJump
					pageSize = {pageSize}
					activePage = {pageIndex}
					maxPage = {maxPage}
					totalSize = {totalSize}
					onChangePageSize = {this.onChangePageSize}
					onChangePageIndex = {this.onChangePageIndex}
				/>
			</div>
		);
	}
}
