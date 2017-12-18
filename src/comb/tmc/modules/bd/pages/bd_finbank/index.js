/**
 * 金融网点档案
 */

import React, { Component } from 'react';
import {
	Con,
	Row,
	Col,
	Dropdown,
	Button,
	Table,
	Icon,
	Form,
	FormGroup,
	FormControl,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	InputNumber,
	InputGroup,
	Label
} from 'tinper-bee';
import DatePicker from 'bee-datepicker';
import Refer from '../../../../containers/Refer';
import FinBankModal from './FinBankModal';
import provincedata from './provincedata';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import './index.less';

const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
let operation = 'add';
let _phone = '';
const rootUrl = window.reqURL.bd + 'bd/finbranch/';

export default class FinBank extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: [],
			columns: [],
			count: 4,
			showModal: false,
			pageIndex: 0,
			totalPages: 1,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',
			switch: '',
			modalData: {},
			provinceName: '',
			cityName: '',
			financeQry: { id: '', refpk: '', refname: '', refcode: '' },
			keywordQry: '',
			message: ''
		};
	}
	// 表头
	columnsData = [
		{ title: '序号', key: 'index', dataIndex: 'index', width: 60 },
		{ title: '金融机构', key: 'fininstitutionname', dataIndex: 'fininstitutionname', width: 100 },
		{ title: '网点名称', key: 'name', dataIndex: 'name', width: 200 ,render:(text,record,index)=>{
			return (<Label title={text}>{text}</Label>);
		} },
		{ title: '联行行号', key: 'branchnumber', dataIndex: 'branchnumber', width: 150 },
		{ title: 'Swift代码', key: 'swiftcode', dataIndex: 'swiftcode', width: 80 },
		{ title: '省', key: 'province', dataIndex: 'province', width: 70 },
		{ title: '市', key: 'city', dataIndex: 'city', width: 70 },
		{ title: '电话', key: 'phone', dataIndex: 'phone', width: 100 },
		{ title: '地址', key: 'address', dataIndex: 'address', width: 200 ,render:(text,record,index)=>{
			return (<Label title={text}>{text}</Label>);
		}},
		{
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
			width: 60,
			render: (text, record, index) => {
				return (
					<div>
						<a onClick={(e) => this.editDone('edit', index, text, record, e)}>
							<Icon className="iconfont icon-bianji icon-style" />
						</a>
						{/* <Popconfirm content="确认删除?" onClose={this.onDelete(text, record, index)}>
							<Icon className="iconfont icon-shanchu icon-style" />
						</Popconfirm> */}
					</div>
				);
			}
		}
	];
	// 当前界面数据
	getTableData = (pageIndex, pageSize, keyWords = '') => {
		const _this = this;
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: {
				keyWords: keyWords,
				fininstitutionid: _this.state.financeQry ? _this.state.financeQry.refpk : null,
				province: _this.state.provinceName,
				city: _this.state.cityName
			}
		};
		Ajax({
			url: rootUrl + 'search',
			data: {
				page,
				size,
				searchParams
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					const head = data.head;
					const newSource = head.rows.map((item, index) => {
						const values = item.values;
						return {
							index: item.rowId,
							id: values.id.value,
							code: values.code ? values.code.value : null,
							name: values.name ? values.name.value : null,
							fininstitutionname: values.fininstitutionname ? values.fininstitutionname.value : null,
							branchnumber: values.branchnumber ? values.branchnumber.value : null,
							province: values.province ? values.province.value : null,
							city: values.city ? values.city.value : null,
							swiftcode: values.swiftcode ? values.swiftcode.value : null,
							phone: values.phone ? values.phone.value : null,
							address: values.address ? values.address.value : null,
							ts: values.ts.value
						};
					});
					const totalNums = head.pageinfo ? head.pageinfo.totalElements : 0;
					const totalPages = head.pageinfo ? head.pageinfo.totalPages : 1;
					_this.setState({
						dataSource: newSource,
						totalPages: totalPages,
						totalNums: totalNums,
						message: ''
					});
				} else {
					toast({ content: message.message, color: 'warning' });
					_this.setState({
						dataSource: [],
						totalPages: 0,
						totalNums: 0,
						message: message.message
					});
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};
	// 获取表格 表头数据
	componentWillMount() {
		var _this = this;
		_this.setState({
			columns: this.columnsData
		});
		// 获取页面表格数据
		this.refresh();
	}
	// 获取对应省份的城市
	getProvince = (name) => {
		for (var i = 0; i < provincedata.length; i++) {
			if (provincedata[i].name == name) {
				return provincedata[i];
			}
		}
	};
	// 省份Option
	provinceOption = () => {
		const provinceOp = [];
		provincedata.map((array, index) => {
			if (!array.name) {
				provinceOp.push(
					<Option key={'空值'} value={array.name}>
						{array.name}
					</Option>
				);
			} else {
				provinceOp.push(
					<Option key={array.name} value={array.name}>
						{array.name}
					</Option>
				);
			}
		});
		return provinceOp;
	};
	// 城市Option
	cityOption = (provinceName) => {
		const cityOp = [];
		if (provinceName) {
			let province = this.getProvince(provinceName);
			if (province) {
				province.city.map((array, index) => {
					cityOp.push(
						<Option key={array.name} value={array.name}>
							{array.name}
						</Option>
					);
				});
			}
		}
		return cityOp;
	};
	// 省份修改
	provinceChange = (e) => {
		console.log(this.getProvince(e).city[0].name);
		this.setState({
			provinceName: e,
			cityName: this.getProvince(e).city[0].name
		});
	};
	// 城市修改
	cityChange = (e) => {
		this.setState({
			cityName: e
		});
	};

	// 根据id删除某个条目
	deleteItem(id) {
		const _this = this;
		Ajax({
			url: rootUrl + 'delete',
			data: {
				list: [ id ]
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({ content: '删除成功...', color: 'success' });
					_this.getTableData(_this.state.pageIndex, _this.state.pageSize);
				} else {
					toast({ content: message.message, color: 'warning' });
					_this.setState({ message: message });
				}
			},
			error: function(res) {
				toast({ content: '后台报错,请联系管理员', color: 'danger' });
			}
		});
	}
	// 删除
	onDelete = (text, record, index) => {
		return () => {
			this.deleteItem(record.id);
		};
	};
	// 编辑
	editDone = (opr, index, text, record, e) => {
		operation = opr;
		console.log(opr, index, text, record, e);
		if (opr === 'edit') {
			this.setState({
				showModal: true,
				modalData: { ...record }
			});
		} else if (opr == 'more') {
			//TODO
			console.log(e + '这里有没有change');
		}
	};
	// 刷新
	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	};
	// 模态框
	open = (opr, e) => {
		operation = opr;
		this.setState({
			showModal: true,
			modalData: {}
		});
	};

	closeModel = (type) => {
		operation = type;
		this.setState({
			showModal: false
		});
	};
	// 搜索
	searchByKeywords = (pageIndex = 0, pageSize, keyWords) => {
		this.setState({
			pageIndex: 0
		});
		this.getTableData(pageIndex, pageSize, keyWords);
	};
	// 搜索
	handleSearchChange = (e) => {
		this.setState(
			{
				keyWords: e.target.value
			},
			() => {
				this.searchByKeywords(0, this.state.pageSize, this.state.keyWords);
			}
		);
	};
	// 搜索
	handleSearch = () => {
		this.searchByKeywords(0, this.state.pageSize, this.state.keyWords);
	};

	// 改变分页大小
	handleChangePageSize = (pageSize) => {
		let num = parseInt(pageSize, 10);
		this.setState(
			{
				//点击分页时，当前页都跳转到第1页
				pageIndex: 0,
				pageSize
			},
			() => {
				this.refresh();
			}
		);
	};

	//点击重置
	handleReset = () => {
		this.setState({
			keyWords: '',
			provinceName: '',
			cityName: '',
			financeQry: { id: '', refpk: '', refname: '', refcode: '' },
			keywordQry: ''
		});
	};
	// 分页点击
	handleSelect = (index) => {
		this.setState(
			{
				pageIndex: index - 1
			},
			() => {
				this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
			}
		);
	};

	handleSubmit = (newData, opre) => {
		const _this = this;
		const { id, code, name, branchnumber, province, city, swiftcode, phone, address, ts } = newData;
		if (typeof code == 'undefined' || code == '') {
			toast({ content: '请输入编码', color: 'warning' });
			return;
		}

		if (typeof name == 'undefined' || name == '') {
			toast({ content: '请输入名称', color: 'warning' });
			return;
		}

		if (opre == 'edit') {
			const data = {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { value: id },
								code: { value: code },
								name: { value: name },
								branchnumber: { value: branchnumber },
								province: { value: province },
								city: { value: city },
								swiftcode: { value: swiftcode },
								phone: { value: phone },
								address: { value: address },
								ts: { value: ts }
							}
						}
					]
				}
			};
			Ajax({
				url: rootUrl + 'save',
				data: { data },
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						_this.getTableData(_this.state.pageIndex, _this.state.pageSize);
					} else {
						toast({ content: message.message, color: 'warning' });
						_this.setState({ message: message });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
			//确认后关闭窗口
			this.setState({
				showModal: false
			});
		}
	};

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '基础档案' }, { title: '银行网点' } ];	

	render() {
		let {
			breads,
			tabs,
			dataSource,
			columns,
			totalPages,
			totalNums,
			pageSize,
			pageIndex,
			showModal,
			modalData,
			provinceName
		} = this.state;
		let provinceOp = this.provinceOption();
		let cityOp = this.cityOption(provinceName);
		//添加序号
		dataSource = dataSource.map((e, i) => {
			return {
				...e,
				index: i + 1
			};
		});
		return (
			<div className="bd-wraps">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div className="bd-header">
					{/* <span>金融机构</span> */}
					<div className="bd-title-1">银行网点</div>
				</div>
				<div className="bd-header bd-finbank advance-search">
					<span className="label-finbank">金融机构：</span>
					<div className="refer1">
						<Refer
							value={this.state.financeQry}
							refModelUrl={'/bd/finbranchRef/'}
							refCode={'finbranchRef'}
							refName={'金融机构'}
							ctx={'/uitemplate_web'}
							showLabel={false}
							//需要重算精度
							onChange={(e) => {
								console.log(e);
								this.setState({
									financeQry: {
										...e
									}
								});
							}}
						/>
					</div>
					{/* <div className="wrap2">
					</div> */}
					<span className="label-province">省份：</span>
					<Select
						showSearch
						value={this.state.provinceName}
						/* name={this.props.provinceName ? this.props.provinceName : 'province'} */
						dropdownStyle={{ zIndex: 18000 }}
						onChange={this.provinceChange.bind(this)}
						className="province-select"
					>
						{provinceOp}
					</Select>
					<span className="label-city">城市：</span>
					<Select
						showSearch
						value={this.state.cityName}
						className="city-select"
						/* style={{ width: 80}} */
						dropdownStyle={{ zIndex: 18000 }}
						onChange={this.cityChange.bind(this)}
						ref="city"
					>
						{cityOp}
					</Select>
					<FormControl
						value={this.state.keyWords}
						onChange={this.handleSearchChange}
						cityName="finbank-input"
						placeholder="请输入金融机构关键字"
						className="keyword-search"
					/>
					<Button
						colors="primary"
						className="btn-2 marginL16 btn-search"
						onClick={this.handleSearch.bind(this, 'search')}
					>
						查询
					</Button>
					<div className="btn-reset" onClick={this.handleReset}>
						重置
					</div>

					{/* <InputGroup simple className="search-box fr">
						<FormControl
							value={this.state.keyWords}
							onChange={this.handleSearchChange}
							placeholder="搜索名称"
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearch} />
						</InputGroup.Button>
					</InputGroup> */}
				</div>
				<Table
					emptyText={NoData}
					bordered
					data={dataSource}
					columns={columns}
					rowKey={'index'}
					className="bd-table"
				/>
				{Boolean(totalNums) && (
					<PageJump
						onChangePageSize={this.handleChangePageSize}
						onChangePageIndex={this.handleSelect}
						totalSize={totalNums}
						activePage={pageIndex + 1}
						maxPage={totalPages}
						pageSize={pageSize}
					/>
				)}
				{showModal && (
					<FinBankModal
						showModal={true}
						opre={operation}
						modalData={modalData}
						onClick={this.closeModel}
						onRefresh={this.refresh}
						onSubmit={this.handleSubmit}
						provinceOption={this.provinceOption}
						cityOption={this.cityOption}
						getProvince={this.getProvince}
					/>
				)}
			</div>
		);
	}
}
