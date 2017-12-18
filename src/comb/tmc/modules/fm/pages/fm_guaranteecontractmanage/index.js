import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import { Table, Button, FormControl, Icon, Select } from 'tinper-bee';
import Ajax from '../../../../utils/ajax.js';
import Refer from '../../../../containers/Refer';
import './index.less';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import PageJump from '../../../../containers/PageJump';
import DeleteModal from '../../../../containers/DeleteModal';
import Menu, { Item as MenuItem } from 'bee-menus';
import Dropdown from 'bee-dropdown';
import ContractLiancha from './ContractLiancha';
import { toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import '../../../pass/containers/formatMoney.js';
const URL= window.reqURL.fm;
const Option= Select.Option;

export default class GuaranteeContractManage extends Component {
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
			debttypeGroup: [
				'内部委贷', '发债', '信托贷款', '保函', '保理银行', '银行流贷', '标准贷款', '外汇贷款', '银团贷款', '公司债', '可交债', '可转债', '绿色债', '企业债', '私募债', '超短期融资券', '熊猫债', 'ABS', 'ABN', 'PRN', '中期票据', '绿色债券'
			],		//债务种类
			isLianchaShow: false,	//联查
		};
    };

    componentWillMount () {
		this.getGuaranteeContractManage(this.state.pageIndex, this.state.pageSize);
	};

	//请求列表
	getGuaranteeContractManage = (page, size) => {
		const _this = this;
		let {searchMap}= this.state;
		Ajax({
			url: URL + 'fm/guacontract/list',
			data: {
				page: page - 1,
				size,
				searchParams: { searchMap }
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					let pageinfo= (data && data.head) ? data.head.pageinfo || {} : {};
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: pageinfo.totalPages || 1,
						totalSize: pageinfo.totalElements || 0
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'danger'});
					_this.err();
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
				_this.err();
			}
		}) 
	};
	
	//icon按钮操作
	setIconOperation = (path, content, record) => {
		const _this = this;
		let { pageIndex, pageSize }= this.state;
		const data ={
			data:{
				head: {
					rows: [ {
						values:	record
					} ]
				}
			}
		};
        Ajax({
			url: URL + 'fm/guacontract/' + path,
			data,
			success: function(res) {
				const { message, success } = res;
				if (success) {
					toast({content: content, color: 'success'});
					_this.getGuaranteeContractManage(pageIndex, pageSize);
				} else {
					toast({content: message ? message.message : '后台报错, 请联系管理员', color: 'danger'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错, 请联系管理员', color: 'danger'});
			}
		})
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
		this.getGuaranteeContractManage(page, this.state.pageSize);
	};

    //页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getGuaranteeContractManage(1, value);
    };
    
    //根据当前状态判断图标显示情况
	detailIcon= record => {
		let vbillstatus= record.vbillstatus ? record.vbillstatus.display || record.vbillstatus.value : ''; 
		let busistatus= record.busistatus ? record.busistatus.display || record.busistatus.value : ''; 
		return [
			{content: '联查', show: true, icon: 'icon-liancha zhaiwu'},
			{content: '修改', show: vbillstatus== 0, jump: true, icon: 'icon-bianji'},
			{content: '删除', show: vbillstatus== 0, icon: 'icon-shanchu', path: 'del', msg: '删除成功'},
			{content: '提交', show: vbillstatus== 0, path: 'commit', msg: '提交成功', icon: 'icon-tijiao'},
			{content: '收回', show: vbillstatus== 3, path: 'uncommit', msg: '收回成功', icon: 'icon-shouhui'},
			{content: '变更', show: busistatus== 5, jump: true, icon: 'icon-biangeng'},
			{content: '变更记录', show: true, jump: true, icon: 'icon-biangengjilu'}
		];
	};

	//校验金额是否为正数
	regMoney = (val, property) => {
		let {searchMap}= this.state;
		let reg= /^[0-9]*\.?[0-9]*$/;
		if (val && !reg.test(val)) {
			toast({content: '金额格式错误，只能输入数字', color: 'warning'});
			return ;
		}
		searchMap[property]= val;
		this.setState({searchMap});
	};

    // 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { href: '#', title: '融资交易' }, { title: '担保合约' } ];
    
    render() {
		let { dataList, pageSize, pageIndex, maxPage, totalSize, searchMap, referCode, debttypeGroup, currentRecord, isLianchaShow } = this.state;
		const menu = (dropArr, record) => {
			let id= record.id.display || record.id.value;
			return <Menu
				onClick={items => {
					let item= dropArr[items.key];
					setTimeout(() => {
						if (item.icon=== 'icon-biangengjilu') {//变更记录
							hashHistory.push(`/fm/assure_tracelog?id=${id}&type=tracelog`);
						} else if (item.icon=== 'icon-biangeng') {//变更
							hashHistory.push(`/fm/assure_tracelog?id=${id}&type=change`);
						} else if (item.icon=== 'icon-liancha') {//联查
							this.setState({
								isLianchaShow: true,
								currentRecord: record
							});
						} else {//提交，收回
							this.setIconOperation(item.path, item.msg, record);
						}
					}, 0)
				}}
			>
				{
					dropArr.map((item, index) => {
						return <MenuItem key={index}>{item.content}</MenuItem>
					})	
				}
			</Menu>;
		};
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
				title: '合同类型', 
				key: 'contracttype', 
				dataIndex: 'contracttype', 
				width: '12%',
				render: (text, record) => {
					let type= record.contracttype.display || record.contracttype.value;
					return (
						<div>
							{type== 0 ? '担保合同' : '反担保合同'}
						</div>
					);
				} 
            },
            { 
				title: '担保合同号', 
				key: 'contractno', 
				dataIndex: 'contractno', 
				width: '15%',
				render: (text, record) => {
					return (
						<div className='table-jump'
							onClick={()=>{
								let id= record.id.display || record.id.value;
								hashHistory.push(`/fm/assure_view?id=${id}&type=new`);
							}}
						>
							{record.contractno ? record.contractno.display || record.contractno.value || '—' : '—'}
						</div>
					);
				} 
            },
            { 
				title: '担保方式', 
				key: 'guatype', 
				dataIndex: 'guatype', 
				width: '8%',
				render: (text, record) => {
					let type= record.guatype.display || record.guatype.value;
					return (
						<div>{type== 1 ? '保证' : (type== 2 ? '抵押' : (type== 3 ? '质押' : '混和'))}</div>
					);
				} 
            },
            { 
				title: '债权人类型/名称', 
				key: 'creditortype', 
				dataIndex: 'creditortype', 
				width: '15%',
				render: (text, record) => {
					let type= record.creditortype.display || record.creditortype.value;
					return (
						<div>
							<span>{type== 1 ? '金融机构' : (type== 2 ? '合作伙伴' : '内部单位')}</span>
							<br/>
							<span>{record.creditor ? record.creditor.display || record.creditor.value || '—' : '—'}</span>
						</div>
					);
				} 
            },
            { 
				title: '债务种类/总金额', 
				key: 'debttype', 
				dataIndex: 'debttype', 
				width: '15%',
				render: (text, record) => {
					let value= record.pridebtamount.display || record.pridebtamount.value;
					let scale= record.guaamount.scale || -1;
					return (
						<div>
							<span>{record.debttype ? record.debttype.display || record.debttype.value || '—' : '—'}</span>
							<br/>
							<span>{value ? Number(value).formatMoney(scale> 0 ? scale : 2, '') : '—'}</span>
						</div>
					);
				} 
            },
            { 
				title: '担保币种/总金额', 
				key: 'guacurrtypeid', 
				dataIndex: 'guacurrtypeid', 
				width: '15%',
				render: (text, record) => {
					let value= record.guaamount.display || record.guaamount.value;
					let scale= record.guaamount.scale || -1;
					return (
						<div>
							<span>{record.guacurrtypeid ? record.guacurrtypeid.display || record.guacurrtypeid.value || '—' : '—'}</span>
							<br/>
							<span>{value ? Number(value).formatMoney(scale> 0 ? scale : 2, '') : '—'}</span>
						</div>
					);
				} 
            },
			{
				title: '操作',
				key: 'operation',
				width: '15%',
				render: (text, record) => {
					let id= record.id.display || record.id.value;
					let iconArr= [];
					this.detailIcon(record).map(item => {
						if (item.show) {
							iconArr.push(item);
						}
					});
					
					let showArr= iconArr;
					let dropArr= [];
					if (iconArr.length> 4) {
						showArr= iconArr.slice(0, 3);
						dropArr= iconArr.slice(3);
					}
					return (
						<div>
							{
								showArr.map((item, index) => {
									return (
										<span
											onClick={() => {
												if (item.icon=== 'icon-bianji') {//修改
													hashHistory.push(`/fm/assure?id=${id}&type=update`);
												} else if (item.icon=== 'icon-biangeng') {//变更
													hashHistory.push(`/fm/assure_tracelog?id=${id}&type=change`);
												} else if (item.icon=== 'icon-biangengjilu') {//变更记录
													hashHistory.push(`/fm/assure_tracelog?id=${id}&type=tracelog`);
												} else if (item.icon=== 'icon-liancha zhaiwu') {//联查
													this.setState({
														isLianchaShow: true,
														currentRecord: record
													});
												} else if(item.icon!== 'icon-shanchu')  {//提交, 收回
													this.setIconOperation(item.path, item.msg, record);
												}
											}}
										>
											{
												item.icon=== 'icon-shanchu' ?
													<DeleteModal
														onConfirm= {() => {this.setIconOperation(item.path, item.msg, record);}}
													/>	
												:
													<Icon className={`iconfont icon-style ${item.icon}`} />
											}
										</span>
									)
								})
							}
							{iconArr.length> 3 &&
								<Dropdown
									trigger={['hover']}
									overlay={menu(dropArr, record)}
									animation="slide-up"
								>
									<span>
										<Icon className="iconfont icon-gengduo"/>	
									</span>		
								</Dropdown>
							}
						</div>
					);
				}
			}
		];
        
        return (
            <div className= "fm-guaranteecontractmanage bd-wraps">
                <BreadCrumbs items={this.breadcrumbItem} />
				<div className='pop-modal'>
					<ContractLiancha  
						details={currentRecord} 
						show={isLianchaShow}
						hidden={() => {this.setState({isLianchaShow: false});}}
					/>
				</div> 
				<div className="bd-header">
					<div className='credit-title'>
						<span className="bd-title-1">担保合约管理</span>
						<Button 
							className="btn-2 add-button"
							onClick={() => {
								hashHistory.push(`/fm/assure?type=new`);
							}}
						>新增</Button>
					</div>
				</div>
				<div className='zijinyun-search'>
					<Refer 
						placeholder="担保币种"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/currencyRef/'}
						refCode={'currencyRef'}
						refName={'币种'}
						value={{refpk: referCode, refname: searchMap.guacurrtypeid ? searchMap.guacurrtypeid : ''}}  
						onChange={item => {
							let isEmpty= JSON.stringify(item)=== '{}';
							searchMap.guacurrtypeid= isEmpty ? '' : item.refname;
							this.setState({searchMap, referCode: 111});
						}}
					/>
					<FormControl
						className='input-box' 
						value = {searchMap.guarantor ? searchMap.guarantor : ''}
						onChange = {e => {
							searchMap.guarantor= e.target.value;
							this.setState({ searchMap });
						}}
						placeholder = "请输入担保人" 
					/> 
					<Select
						placeholder="债务种类"
						value={searchMap.debttype_n}
						onChange= {val => {
							searchMap.debttype_n= val;
							this.setState({searchMap});
						}}
					>
						{
							debttypeGroup.map((item, key) => {
								return <Option value={key + 1}>{item}</Option>
							})
						}
					</Select>
					<FormControl 
						className='input-box w124'
						value = {searchMap.minValue ? searchMap.minValue : ''}
						placeholder = "起始担保金额" 
						onChange = {e => {this.regMoney(e.target.value, 'minValue');}}
					/><span className='money-range'>-</span><FormControl 
						className='input-box w124'
						value = {searchMap.maxValue ? searchMap.maxValue : ''}
						placeholder = "截止担保金额" 
						onChange = {e => {this.regMoney(e.target.value, 'maxValue');}}
					/>
					{/* <div className='credit-search'> */}
					<FormControl 
						value = {searchMap.contractno ? searchMap.contractno : ''}
						className="input-box"
						onChange = {(e) => {
							searchMap.contractno= e.target.value;
							this.setState({ searchMap });
						}}
						placeholder = "按照担保合约号搜索" 
					/>
						{/* <Icon className="iconfont icon-icon-sousuo"/>
					</div> */}
					<Button 
						className="search-btn"
						onClick={() => {
							if (searchMap.minValue && searchMap.maxValue && (searchMap.maxValue - searchMap.minValue< 0)) {
								toast({color: 'danger', content: '最小金额不能大于最大金额'});
								return;
							}
							this.getGuaranteeContractManage(pageIndex, pageSize);
						}}
					>
						查询
					</Button>
					<span 
						className="zijinyun-reset"
						onClick={() => {this.setState({searchMap: {}});}}
					>
						重置
					</span>
				</div>
				<Table 
					bordered 
					columns={columns} 
					data={dataList} 
					emptyText={() => (
						<div>
							<img src={nodataPic} alt="" />
						</div>
					)}
					className='bd-table double'
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
        )
    }
}