import React, { Component } from 'react';
import {Table, Button, FormControl, Icon, Modal, Select, Upload } from 'tinper-bee';
import {Ajax, PageJump, Refer, MsgModal, BreadCrumbs, DeleteModal, DatePickerSelect, zhCN, URL, format, moment, nodataPic} from '../../containers';
import HistoryInput from '../../containers/HistoryInput';
import Dropdown from 'bee-dropdown';
import Menu from 'bee-menus';
import './index.less';
import { toast, dateAdd } from '../../../../utils/utils.js';
import '../../containers/formatMoney.js';
const Option= Select.Option;
const MenuItem= Menu.Item;

export default class BankReceipt extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentIndex: 0,
			currentStatus: '',
			searchMap: {
				begindate: moment(dateAdd(new Date().getTime() - 1000*3600*24, 0, '-') + ' 00:00:00'),
				enddate: moment(new Date())
			},	//模糊查询关键字
			dataList: [],
			MsgModalShow: false,
			delNum: 1,
			recaccnumList: [],
			referCode: 111,
			fileList: [],
			modalType: 1,	//1位删除2为导入
		};
	}

	componentWillMount () {
		this.getBankList(this.state.pageIndex, this.state.pageSize);
	}
	
	//获取列表数据
	getBankList = (page, size) => {
		const _this = this;
		let searchMap= JSON.parse(JSON.stringify(this.state.searchMap));
		if (searchMap.begindate) {
			searchMap.begindate= moment(searchMap.begindate).format(format) + ' 00:00:00';
		}
		if (searchMap.enddate) {
			searchMap.enddate= moment(searchMap.enddate).format(format) + ' 23:59:59';
		}
		Ajax({
			url: URL + 'pass/reconciliation/listbankrecon',
			data: {
				page: page-1,
				size,
				searchParams: {
					searchMap
				}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					let pageinfo= (data && data.head) ? data.head.pageinfo || {} : {};
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: pageinfo.totalPages || 1,
						totalSize: pageinfo.totalElements || 0,
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

	//删除
	delRow = record => {
		const _this = this;
		let {delNum}= this.state;
		Ajax({
			url: URL + 'pass/reconciliation/del',
			data: {
				id: record.id.value || record.id.display,
				bankserialnum: record.bankserialnum.display || record.bankserialnum.value,
				delNum
			},
			success: function(res) {
				if (res.success) {
					if (!res.data) {
						toast({content: '删除成功', color: 'success'});
						_this.getBankList(_this.state.pageIndex, _this.state.pageSize);
						_this.setState({
							delNum: 1,
							MsgModalShow: false
						});
					} else {
						_this.setState({
							delNum: 2,
							MsgModalShow: true
						});
					}
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
		this.getBankList(page, this.state.pageSize);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getBankList(1, value);
	};

	//上传文件前操作
	beforeUpload = (file) => {
		const isUpload= file.type=== 'application/vnd.ms-excel' || file.type=== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		if (!isUpload) {
			toast({color: 'danger', content: '只允许上传XLS或XLSX格式文件!'});
		}
		return isUpload;
	};

	//上传文件后操作
	afterUpload = info => {
		if(info.file.status === 'done') {
            if(info.file.response.success){
				let fileList= info.file.response.data && info.file.response.data.map(item => '序号' + item.rownum);
				this.setState({
					MsgModalShow: fileList.length> 0 ? true : false,
					fileList,
					modalType: 2
				});
				if (fileList.length=== 0) {
					toast({color: 'success', content: '导入成功'});
				}
				this.getBankList(this.state.pageIndex, this.state.pageSize);
            } else {
                toast({color: 'danger', content: info.file.response.message ? info.file.response.message.message : '导入失败'});
            }
        }
	};

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '结算平台' }, { title: '银行对账单' } ];

	render() {
		let { dataList, pageSize, pageIndex, maxPage, totalSize, searchMap, currentIndex, currentRecord, MsgModalShow, recaccnumShow, recaccnumList, referCode, fileList, modalType} = this.state;
		const columns= [
			{ 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: '5%',
				render: (text, record, index) => {
					return (
						<div>{(pageIndex- 1)* pageSize + index + 1}</div>
					);
				} 
			},
			{ 
				title: '银行流水号', 
				key: 'bankserialnum', 
				dataIndex: 'bankserialnum', 
				width: '13%',
				render: (text, record) => {
					return (
						<div>{record.bankserialnum.display || record.bankserialnum.value || '—'}</div>
					);
				} 
			},
			{ 
				title: '交易时间', 
				key: 'tradetime', 
				dataIndex: 'tradetime', 
				width: '8%',
				render: (text, record) => {
					return (
						<div>{record.tradetime.display || record.tradetime.value || '—'}</div>
					);
				} 
			},
			{ 
				title: '本方账号/户名', 
				key: 'accountname', 
				dataIndex: 'accountname', 
				width: '16%',
				render: (text, record) => {
					return (
						<div>
							<span>{record.accountnum.display || record.accountnum.value || '—'}</span>
							<br/>
							<span>{record.accountname.display || record.accountname.value || '—'}</span>
						</div>
					);
				}  
			},
			{ 
				title: '对方账号/户名', 
				key: 'recaccnum', 
				dataIndex: 'recaccnum', 
				width: '16%',
				render: (text, record) => {
					return (
						<div>
							<span>{record.recaccnum.display || record.recaccnum.value || '—'}</span>
							<br/>
							<span>{record.recaccname.display || record.recaccname.value || '—'}</span>
						</div>
					);
				} 
			},
			{ 
				title: '收支属性', 
				key: 'receorpay', 
				dataIndex: 'receorpay', 
				width: '8%',
				render: (text, record) => {
					let receorpay= record.receorpay.display || record.receorpay.value;
					return (
						<div>{receorpay== 0 ? '收款' : (receorpay== 1 ? '支付' : '转账')}</div>
					);
				}  
			},
			{ 
				title: '币种', 
				key: 'currtypename', 
				dataIndex: 'currtypename', 
				width: '8%',
				render: (text, record) => {
					return (
						<div>{record.currtypename.display || record.currtypename.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '金额', 
				key: 'trademny', 
				dataIndex: 'trademny', 
				width: '14%',
				render: (text, record) => {
					let trademny= record.trademny.display || record.trademny.value || 0;
					let scale= record.trademny.scale || -1;
					return (
						<div>{Number(trademny).formatMoney(scale> 0 ? scale : 2, '')}</div>
					);
				}  
			},
			{ 
				title: '来源', 
				key: 'origin', 
				dataIndex: 'origin', 
				width: '6%',
				render: (text, record) => {
					let orgin= record.origin.display || record.origin.value;
					return (
						<div>{orgin== 1 ? '导入' : '银行'}</div>
					);
				}  
			},
			{
				title: '操作',
				key: 'operation',
				width: '6%',
				render: (text, record) => {
					let origin= record.origin ? record.origin.display || record.origin.value : 0;
					return (
						<div>
							{
								origin== 1 ?
									<DeleteModal
										onConfirm= {() => {
											this.delRow(record);
											this.setState({currentRecord: record, modalType: 1});
										}}
									/>
								:	null
							}
						</div>
					);
				}
			}
		];
		
		const props = {
			action: `${URL}pass/reconciliation/upload`,
			beforeUpload: this.beforeUpload,
			showUploadList: false,
			onChange: this.afterUpload
		};
		
		return (
			<div className= "pass-settlement bd-wraps pass-bankreceipt">
				<BreadCrumbs items={this.breadcrumbItem} /> 
				<div className="bd-header">
					<div className='credit-title'>
						<span className="bd-title-1">银行对账单</span>
						<Button className="btn-2 download-btn">
							<Upload {...props}>
								<span>导入</span>
							</Upload>
						</Button>
						<a 
							href = {`${URL}pass/reconciliation/download`}
							className = "download-template zijinyun-reset"
							download
						>下载模板</a>
					</div>
				</div>
				<div className='zijinyun-search'>	
					<DatePickerSelect  
						placeholder='开始日期'
						value= {searchMap.begindate}
						onChange= {(date) => {
							searchMap.begindate= date;
							if (searchMap.enddate && (new Date(date)).getTime()> (new Date(searchMap.enddate)).getTime()) {
								delete searchMap.enddate;
							}
							this.setState({searchMap});
						}}
					/>
					<DatePickerSelect  
						placeholder='结束日期'
						value= {searchMap.enddate}
						onChange= {(date) => {
							searchMap.enddate= date;
							this.setState({searchMap});
						}}
						disabledDate={current => searchMap.begindate ? current && current.valueOf() < moment(searchMap.begindate) : null}
					/>
					<Refer 
						className='w160'
						placeholder="本方账户"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/bankaccbasRef/'}
						refCode={'bankaccbasRef'}
						refName={'银行账户'}
						multiLevelMenu={[
							{
								name: ['子户编码', '子户名称'],
								code: ['refcode', 'refname']
							}
						]}
						referFilter={{
							accounttype: 0, 
							orgid: '111' //组织pk
						}}
						value={
							searchMap.accountNum ?
							{refpk: referCode, refname: searchMap.accountNum ? searchMap.accountNum : ''}
							: {}
						}   
						onChange={item => {
							let isEmpty= JSON.stringify(item)=== '{}';
							searchMap.accountNum= isEmpty ? '' : item.refcode;
							this.setState({searchMap, referCode: 111});
						}}
					/>
					<HistoryInput
						localType='recaccNum'
						placeholder='对方账号'
						value={searchMap.recaccnum ? searchMap.recaccnum : ''}
						onChange={e => {
							searchMap.recaccnum= e.target.value;
							this.setState({searchMap});
						}}
						onSelect= {val => {
							searchMap.recaccnum= val;
							this.setState({searchMap});
						}}
					/>
					<Button 
						className="search-btn"
						onClick={() => {
							this.getBankList(1, pageSize);
							this.setState({pageIndex: 1});
						}}
					>查询</Button>
					<span
						className='zijinyun-reset'
						onClick= {() => {this.setState({searchMap: {}});}}
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
				<MsgModal 
					show={MsgModalShow}
					icon='icon-tishianniuzhuyi'
					title={modalType=== 1 ? '请注意' : `共有${fileList.length}条记录导入失败`}
					content={modalType=== 1 ? '该记录已对账，确认要删除吗?' : `其中${fileList.join('、')}导入失败`}
					isButtonShow={modalType=== 1 ? true : false}
					onCancel={() => {this.setState({MsgModalShow: false});}}
					onConfirm={() => {this.delRow(currentRecord);}}
				/>
			</div>
		);
	}
}
