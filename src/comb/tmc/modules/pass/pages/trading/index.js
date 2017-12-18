import React, { Component } from 'react';
import {Table, Button, FormControl, Icon, Modal, Select } from 'tinper-bee';
import {RangePicker} from 'bee-datepicker';
import Checkbox from 'bee-checkbox';
import './index.less';
import {Ajax, PageJump, Refer, BreadCrumbs, zhCN, URL, format} from '../../containers';
import 'bee-datepicker/build/DatePicker.css';
import { numFormat, toast } from '../../../../utils/utils.js';
const Option= Select.Option;

export default class Trading extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentStatus: '',
			searchMap: {},	//模糊查询关键字
			dataList: []
		};
	}

	componentWillMount () {
		// this.getSettlementList(this.state.pageIndex, this.state.pageSize);
	}
	
	//获取列表数据
	getSettlementList = (page, size) => {
		const _this = this;
		let {searchMap}= this.state;
		Ajax({
			url: URL + 'pass/settlement/list',
			data: {
				page: page-1,
				size,
				searchParams: {
					searchMap
				}
			},
			success: function(res) {
				// const { data, message, success } = res;
				// if (success) {
				// 	let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
				// 	_this.setState({
				// 		dataList: dataList || [],
				// 		maxPage: data ? data.head.pageinfo.totalPages : 1,
				// 		totalSize: data ? data.head.pageinfo.totalElements : 0,
				// 	});
				// } else {
				// 	toast({content: JSON.stringify(message), color: 'warning'});
				// }
			},
			error: function(error) {
				toast({content: '后台报错,请联系管理员', color: 'danger'});
			}
		}); 
	};
    
    // 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getSettlementList(page, this.state.pageSize);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getSettlementList(1, value);
	};

	//模糊查询操作
	handleSearch = val => {
		// console.log('模糊查询'+ val);
		this.getSettlementList(1, this.state.pageSize);
		this.setState({pageIndex: 1});
	}

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '结算平台' }, { title: '交易综合查询' } ];

	render() {
		let { dataList, pageSize, pageIndex, maxPage, totalSize, searchMap, currentIndex, currentRecord } = this.state;
		const columns= [
			{ 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: '5%',
				render: (text, record) => {
					return (
						<div>{record.tranevent.display || record.tranevent.value}</div>
					);
				} 
			},
			{ 
				title: '交易日期/银行流水', 
				key: 'eventno', 
				dataIndex: 'eventno', 
				width: '20%',
				render: (text, record) => {
					return (
						<div>{record.eventno.display || record.eventno.value}</div>
					);
				} 
			},
			{ 
				title: '对方账户/户名', 
				key: 'eventdate', 
				dataIndex: 'eventdate', 
				width: '20%',
				render: (text, record) => {
					return (
						<div>{record.eventdate.display || record.eventdate.value}</div>
					);
				}  
			},
			{ 
				title: '收付款/币种/金额', 
				key: 'currtypeid', 
				dataIndex: 'currtypeid', 
				width: '20%',
				render: (text, record) => {
					return (
						<div>{record.currtypeid.display || record.currtypeid.value}</div>
					);
				} 
			},
			{ 
				title: '结算方式', 
				key: 'currtypeid1', 
				dataIndex: 'currtypeid1', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.currtypeid.display || record.currtypeid.value}</div>
					);
				} 
			},
			{ 
				title: '摘要', 
				key: 'money', 
				dataIndex: 'money', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{numFormat(parseFloat(record.money.display || record.money.value || 0), '')}</div>
					);
				}  
			},
			{ 
				title: '用途', 
				key: 'balatypeid', 
				dataIndex: 'balatypeid', 
				width: '15%',
				render: (text, record) => {
					return (
						<div>{record.balatypeid.display || record.balatypeid.value}</div>
					);
				}  
			}
		];
		
		return (
			<div className= "pass-trading bd-wraps">
				<BreadCrumbs items={this.breadcrumbItem} /> 
				<div className="bd-header">
					<div className='credit-title'>
						<span className="bd-title-1">交易综合查询</span>
					</div>
                    <div className='select-box'>
						<RangePicker
							format={format}
							onSelect={() => {console.log('onselect')}}
							onChange={() => {console.log('onchange')}}
							locale={zhCN}
							placeholder={"选择年月"}
						/>
                        <Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>融资付费</Option>
                            <Option value={11}>融资还本</Option>
                            <Option value={111}>融资付息</Option>
                        </Select>
                        <Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>融资付费</Option>
                        </Select>
                        <Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>融资付费</Option>
                        </Select>
                        <Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>融资付费</Option>
                        </Select>
                        <Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>待结算</Option>
                            <Option value={11}>结算中</Option>
                            <Option value={111}>结算成功</Option>
                            <Option value={1111}>结算失败</Option>
                        </Select>
                        <Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>待结算</Option>
                            <Option value={11}>结算中</Option>
                            <Option value={111}>结算成功</Option>
                            <Option value={1111}>结算失败</Option>
                        </Select>
                        <Button 
							className="btn-2 add-button"
							onClick={() => {}}
						>查询</Button>
                        <span
							className='pass-reset'
							onClick= {() => {
								this.setState({searchMap: {}});
							}}
						>重置</span>
                    </div>
					<div className='credit-title'>
						<div className='credit-title'>
							<span className="bd-title-1">汇总维度</span>
						</div>
						<Checkbox>结算方式</Checkbox>
						<Checkbox>结算状态</Checkbox>
						<Checkbox>本方账号</Checkbox>
						<Select 
                            className= 'settlement-select'
                            value={''}
                        >
                            <Option value={1}>投资</Option>
                            <Option value={11}>融资</Option>
                        </Select>	
					</div>				
				</div>
				<Table 
					bordered 
					className="bd-table"
					emptyText={() => <span>暂无数据</span>}
					columns={columns} 
					data={dataList} 
					rowKey='id'
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
