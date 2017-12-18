import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Row, Col, Table, FormControl, Icon, Modal, Select, Popconfirm } from 'tinper-bee';
import Button from 'bee-button'; 
import Form from 'bee-form';
import FormGroup from 'bee-form-group';
import DatePicker from 'bee-datepicker';
import DatePickerSelect from '../../../pass/containers/DatePickerSelect';
import moment from 'moment';
import Refer from '../../../../containers/Refer';
import Ajax from '../../../../utils/ajax.js';
import './index.less';
import PageJump from '../../../../containers/PageJump';
import Aabill from '../../containers/fm_iabill';
import Trial from '../../containers/fm_trial';
import Checkbox from "bee-checkbox";
import Menu, { Item as MenuItem } from 'bee-menus';
import Dropdown from 'bee-dropdown';
import Message from 'bee-message';
import '../../../pass/containers/formatMoney.js';
import { numFormat, sum, toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';

const defaultProps = {
	prefixCls: "bee-table",
	multiSelect: {
	  type: "checkbox",
	  param: "key"
	}
};

function onVisibleChange(visible) {
	
}

const URL= window.reqURL.fm;
const format = 'YYYY-MM-DD';

const success = function () {
	Message.create({content: '计息成功', color: 'success'});
};

export default class Interest extends Component {
	constructor(props) {
        super(props);
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentIndex: 0,
			currentStatus: '',
			keyWords:'',	//模糊查询关键字
			isShow: false,
			showModal: false,
			showBillModal: false,
			showTrialModal: false,
			loadingShow: false,
			dataList: [],
			dateStart:'',
			dateEnd:'',
			checkedAll:false,
			checkedArray: [],
			checkedBool: false,
			checkedList: [],
			searchMap:{},
			loancode:'',
			loanmny:'',
			trantypeid:'',
			returnmodeid:'',
			referCode:'',
			data:{},
        };
        this.close = this.close.bind(this);
    }

    //请求列表
	getInterest = (page, size) => {
		const _this = this;
		let {searchMap}= this.state;
		let searchMaps= JSON.parse(JSON.stringify(searchMap));
		if (searchMaps.repaydate) {
			searchMaps.repaydate= moment(searchMaps.repaydate).format(format);
		}
		Ajax({
			url: URL + 'fm/interests/search',
			data: {
				page: page-1,
				size,
				searchParams: {searchMap: searchMaps}	
			},
			success: function(res) {
				//console.log(res.data,'222');
				const { data, message, success } = res;
				let pageinfo= (data && data.head) ? data.head || {} : {};
				if (success) {
					let dataList = data && data.head && data.head.rows.map(item => item.values);
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalPages : 1,
						totalSize: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalElements : 0,
						loadingShow: false
					});

				} else {
					toast({content: message.message, color: 'warning'});
					_this.setState({
						dataList: [],
						maxPage: 1,
						totalSize: 0,
						loadingShow: false
					});
				}
			},
			error: function(res) {
				console.error(res);
				if(res===null){
					return 
				}else{
					toast({content: res.message, color: 'danger'});
					_this.setState({
						dataList: [],
						maxPage: 1,
						totalSize: 0,
						loadingShow: false
					});
				}
            }
		})
    };
    

	componentWillMount () {
		this.getInterest(this.state.pageIndex, this.state.pageSize);
	}

	//金钱格式化,例如 1111111 => 1,111,111.00
	numFormat = str => {
		str+= '';
        if (str=== '0' || str=== '0.00') {
            return '0.00';
        }
		let index= str.indexOf('.');
		let arr= [];
        if (index=== -1) {
            index= str.length;
            str= str.concat('.00');
        }
        for(let i= 0; i<= index - 1; i++) {
            if ((index-i)%3=== 0 && i!== 0 && i!== index) {
                arr.push(',', str[i]);
            } else {
                arr.push(str[i]);
            }
        }
        return arr.join('').concat(str.substr(index));
    };

	// 页码选择
	onChangePageIndex = (page) => {
		this.setState({
			pageIndex: page
		});
		this.getInterest(page, this.state.pageSize);
    }

	//页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getInterest(1, value);
	};

	//模糊查询操作
	handleSearch = val => {
		this.getInterest(this.state.pageIndex, this.state.pageSize);
	}

    
    close() {
        this.setState({
            showModal: false
        });
	}

	//更多操作按钮相关跳转
	onSelect(key, index, record, e) {
		const _this = this;
		let { dataList, pageIndex, pageSize }= this.state;
		setTimeout(()=>{
			switch(e.key){
				//计息按钮
				case 'realInterest':
					return Ajax({
						url: URL + 'fm/interests/realInterest',
						data: [
							{
								"interestDate": record.currentsettledate.display ? record.currentsettledate.display : record.currentsettledate.value,
								"loadid": record.id.display ? record.id.display : record.id.value,
								"ts": record.ts.display ? record.ts.display : record.ts.value
							}
						],
						header: {"Content-Type": "application/json"},
						success: function(res) {
							const { data, message, success } = res;
								if (success) {
									toast({content: '计息成功...', color: 'success'});
									_this.getInterest(pageIndex, pageSize);
									//console.log(res, 'res');
								} else {
									toast({content: message.message, color: 'warning'});
								}
							},
						error: function(res) {
							//console.log(error, 'error');
							toast({content: res.message, color: 'danger'});
						}
					});
				//取消计息
				case 'cancelRealInterest':
					return Ajax({
						url: URL + 'fm/interests/cancelRealInterest',
						data: [
							{
								"interestDate": record.currentsettledate.value,
								"loadid": record.id.value,
								"ts": record.ts.value
							}
						],
						header: {"Content-Type": "application/json"},
						success: function(res) {
							const { data, message, success } = res;
								if (success) {
									//toast({content: '取消计息成功...', color: 'success'});
									_this.getInterest(pageIndex, pageSize);
									//console.log(res, 'res');
								} else {
									//toast({content: message.message, color: 'warning'});
								}
							},
						error: function(res) {
							//console.log(error, 'error');
							toast({content: res.message, color: 'danger'});
						}
					});
				//取消预提
				case 'cancelPreInterest':
					return Ajax({
						url: URL + 'fm/interests/cancelPreInterest',
						data: [
							{
								"end": new Date('9999-01-01'),
								"loadid": record.id.value,
								"start": new Date(),
								"ts": record.ts.value
							}
						],
						header: {"Content-Type": "application/json"},
						success: function(res) {
							const { data, message, success } = res;
								if (success) {
									toast({content: '取消预提成功...', color: 'success'});
									_this.getInterest(pageIndex, pageSize);
									//console.log(res, 'res');
								} else {
									//toast({content: message.message, color: 'warning'});
								}
							},
						error: function(error) {
							//console.log(error, 'error');
							//toast({content: res.error, color: 'danger'});
						}
					});
				default:
					return;
			}
		},0);
		
	}
	
	//全选
	onAllCheckChange = bool => {
		let { dataList, checkedList, checkedArray, checkedBool } = this.state;
		for (let key in dataList) {
			checkedArray[key] = bool;
		}
		checkedList= JSON.parse(JSON.stringify(dataList));
		if (!bool) {
			checkedList= [];
			checkedBool= false;
		}
		this.setState({
			checkedAll: bool,
			checkedArray,
			checkedList,
			checkedBool
		});
	};

	//复选框操作
	onCheckboxChange = (bool, index) => {
		let {checkedArray, checkedBool, checkedAll} = this.state;
		let length= 0;
		checkedArray[index] = bool;
		for (let item of checkedArray) {
			if (item) {
				length++;
			}
		}
		if (length=== checkedArray.length) {
			checkedAll= true;
			checkedBool= false;
		} else if (length=== 0) {
			checkedAll= false;
			checkedBool= false;
		} else {
			checkedAll= false;
			checkedBool= true;
		}
		
		this.setState({
		  checkedAll,
		  checkedArray,
		  checkedBool
		});
		this.checkedHanding(checkedArray);
	};

	//多选
	checkedHanding = (checkedArray) => {
		let {dataList}= this.state;
		let checkedList= [];
		for (let key in dataList) {
			if (checkedArray[key]) {
				checkedList.push(dataList[key]);
			}
		}
		this.setState({checkedList});
	};	

	//表头计息按钮
	interestSettlement = () => {
		let len= 0;
		let interestList= [];
		let {checkedList}= this.state;
		console.log(checkedList,'222')
		if (checkedList.length=== 0) {
			toast({color: 'warning', content: '请勾选计息选项！'});
			return;
		}
		for (let key in checkedList) {
			interestList[key]= {};
			interestList[key].values= checkedList[key];
			len++;
			console.log(len,interestList[key].values.loancode.value,'999');
			Ajax({
				url: URL + 'fm/interests/realInterest',
				data: [
					{
						"interestDate": interestList[key].values.currentsettledate.value,
						"loadid": interestList[key].values.id.value,
						"ts": interestList[key].values.ts.value
					}
				],
				header: {"Content-Type": "application/json"},
				success: function(res) {
					const { data, message, success } = res;
						if (success) {
							toast({content: '计息成功...', color: 'success'});
							_this.getInterest(pageIndex, pageSize);
							//console.log(res, 'res');
						} else {
							//toast({content: message.message, color: 'warning'});
						}
					},
				error: function(res) {
					//console.log(error, 'error');
					//toast({content: res.message, color: 'danger'});
				}
			});
		}
		
		if (len < checkedList.length) {
			toast({color: 'warning', content: '不可以计息！'});
			return;
		}
	};

	//表头取消计息操作
	cancelInterestSettlement = () => {
		let len= 0;
		let interestList= [];
		let {checkedList}= this.state;
		console.log(checkedList,'222')
		if (checkedList.length=== 0) {
			toast({color: 'warning', content: '请勾选计息选项！'});
			return;
		}
		for (let key in checkedList) {
			interestList[key]= {};
			interestList[key].values= checkedList[key];
			len++;
			console.log(len,interestList[key].values.loancode.value,'999');
			Ajax({
				url: URL + 'fm/interests/cancelRealInterest',
				data: [
					{
						"interestDate": interestList[key].values.currentsettledate.value,
						"loadid": interestList[key].values.id.value,
						"ts": interestList[key].values.ts.value
					}
				],
				header: {"Content-Type": "application/json"},
				success: function(res) {
					const { data, message, success } = res;
						if (success) {
							toast({content: '取消计息成功...', color: 'success'});
							_this.getInterest(pageIndex, pageSize);
							//console.log(res, 'res');
						} else {
							//toast({content: message.message, color: 'warning'});
						}
					},
				error: function(res) {
					//console.log(error, 'error');
					//toast({content: res.message, color: 'danger'});
				}
			});
		}
		
		if (len < checkedList.length) {
			toast({color: 'warning', content: '不可以取消计息！'});
			return;
		}
		//console.log(interestList,'456789');
		//this.setIconOperation('settle', '批量计息', interestList);
	};

	//下拉按钮
	handleChange = value => {
		console.log(`selected ${value}`);
	};

	render() {
		let self = this;
		let { 
			dataList, 
			pageSize, 
			pageIndex, 
			maxPage, 
			totalSize, 
			showModal,
			showAddModal, 
			showBillModal,
			showTrialModal, 
			keyWords, 
			currentIndex, 
			currentRecord, 
			searchMap,
			loancode, 
			loanmny, 
			trantypeid, 
			returnmodeid, 
			referCode,
			currentStatus, 
			loadingShow, 
			isShow, 
			checkedArray, 
			checkedAll, 
			dateStart, 
			dateEnd, 
			checkedBool, 
			checkedList,
			data,
		} = this.state;
		const columns= [
			{
				title: (
					<Checkbox
						className="table-checkbox"
						checked={checkedAll}
						indeterminate={!checkedAll && checkedBool}
						onChange={(bool) => {this.onAllCheckChange(bool);}}
					/>
				),
				key: "checkbox",
				dataIndex: "checkbox",
				width: "5%",
				render: (text, record, index) => {
					return (
						<Checkbox
							className="table-checkbox"
							checked={checkedArray[index]}
							onChange={(bool) => {this.onCheckboxChange(bool, index);}}
						/>
					);
				}
			},
			{ 
				title: '序号', 
				dataIndex: 'index', 
				key: 'index', 
				width: '4%', 
				render: (text, record, index) => {
					return (
						<div>{pageSize* (pageIndex - 1) + index + 1}</div>
					);
				} 
			},
            { 
				title: '放款编号', 
				dataIndex: 'loancode.value', 
				key: 'loancode', 
				width: '10%',
				render: (text, record, index) => {
					return (
						<div>{record.loancode ? ( record.loancode.display || record.loancode.value ) : '——'}</div>
					);
				} 
			},
            { 
				title: '交易类型', 
				dataIndex: 'trantypeid.value', 
				key: 'trantypeid', 
				width: '6%',
				render: (text, record, index) => {
					return (
						<div>{record.trantypeid ? ( record.trantypeid.display || record.trantypeid.value ) : '——'}</div>
					);
				} 
			},
            { 
				title: '贷款机构', 
				dataIndex: 'creditbankid.value', 
				key: 'creditbankid', 
				width: '16%',
				render: (text, record, index) => {
					return (
						<div>{record.creditbankid ? ( record.creditbankid.display || record.creditbankid.value ) : '——'}</div>
					);
				} 
			},
            { 
				title: '放款金额', 
				dataIndex: 'loanmny.value', 
				key: 'loanmny', 
				width: '8%',
				render: (text, record, index) => {
					let value= record.loanmny.display || record.loanmny.value;
					let scale= record.loanmny.scale || -1;
					return (
						<div>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '——'}</div>
					);
				}
			},
            { 
				title: <div><span>放款起始日期</span><br/><span>放款结束日期</span></div>, 
				dataIndex: 'loandate.value', 
				key: 'loandate', 
				width: '8%' ,
				render(text, record, index) {
					return (
						<div>
							<span>{ record.loandate ? ( record.loandate.display || record.loandate.value ) : '——'}</span><br/>
							<span>{ record.contenddate ? ( record.contenddate.display || record.contenddate.value ) : '——' }</span>
						</div>
					)
				}
			},
            { 
				title: '利率%', 
				dataIndex: 'rate.value', 
				key: 'rate', 
				width: '8%',
				render: (text, record, index) => {
					let value= record.rate.display || record.rate.value;
					let scale= record.rate.scale || -1;
					return (
						<div>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '——'}</div>
					);
				} 
			},
            { 
				title: '还款方式', 
				dataIndex: 'returnmodeid.value', 
				key: 'returnmodeid', 
				width: '8%',
				render: (text, record, index) => {
					return (
						<div>{record.returnmodeid ? ( record.returnmodeid.display || record.returnmodeid.value ) : '——' }</div>
					);
				} 
			},
            { 
				title: '结息日', 
				dataIndex: 'settledate.value', 
				key: 'settledate', 
				width: '8%',
				render: (text, record, index) => {
					return (
						<div>{record.settledate ? ( record.settledate.display || record.settledate.value ) : '——'}</div>
					);
				} 
			},
			{ 
				title: <div><span>当前结息日</span><br/><span>下一结息日</span></div>, 
				dataIndex: 'currentsettledate.value', 
				key: 'currentsettledate', 
				width: '6%' ,
				render(text, record, index) {
					return (
						<div>
							<span>{ record.currentsettledate ? ( record.currentsettledate.display || record.currentsettledate.value ) : '——' }</span><br/>
							<span>{ record.nextsettledate ? ( record.nextsettledate.display || record.nextsettledate.value ) : '——' }</span>
						</div>
					)
				}
			},
			// { 
			// 	title: '审批状态', 
			// 	dataIndex: 'vbillstatus.value', 
			// 	key: 'vbillstatus', 
			// 	width: '4%' ,
			// 	render(text, record, index) {
			// 		let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
			// 		let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '已审批'));
			// 		return (
			// 			<div>
			// 				<span>{ vbillName }</span>
			// 			</div>
			// 		)
			// 	}
			// },
            { 
              title: '操作', 
              dataIndex: 'operation', 
              key: 'operation', 
              width: '14%',
              render: (index, record) => {
				let menu_1 = (
					<Menu multiple onSelect={this.onSelect.bind(this, 'change', index, record)}>
						<MenuItem key="realInterest">计息</MenuItem>
						<MenuItem key="cancelRealInterest">取消计息</MenuItem>
					</Menu>
				);
				let menu_2 = (
					<Menu multiple onSelect={this.onSelect.bind(this, 'change', index, record)}>
						<MenuItem key="preInterest" ><span
								style={{ cursor: 'pointer' }}
								onClick = { () => {
									this.setState({
										currentRecord: record,
										showModal: true
									});
								} }
							>
								预提
							</span>​</MenuItem>
						<MenuItem key="cancelPreInterest">取消预提</MenuItem>
					</Menu>
				);
                return  <div style={{marginLeft:'-14px'}}>
							<span
								onClick={() => {
									this.setState({
										showBillModal: true,
										isShow: !this.state.isShow,
										currentRecord: record
										});
										console.log(currentRecord)
									}}
								style={{ marginLeft: '10px', cursor: 'pointer'}}
							>
								<Icon data-tooltip='利息清单' className="iconfont icon-liancha icon-style"/>
							</span>
							<Dropdown
								trigger={['hover']}
								overlay={menu_1}
								animation="slide-up"
								onVisibleChange={onVisibleChange}>
								<span
									style={{ marginLeft: '10px', cursor: 'pointer' }}
									onClick={() => {
										this.setState({
										currentRecord: record
										});
									}}
								>
									<Icon data-tooltip='计息/取消计息' className="iconfont icon-jixi icon-style"/>
								</span>
							</Dropdown>
							<Dropdown
								trigger={['hover']}
								overlay={menu_2}
								animation="slide-up"
								onVisibleChange={onVisibleChange}>
								<span
									style={{ marginLeft: '10px', cursor: 'pointer' }}
									onClick={() => {
										this.setState({
											currentRecord: record
											});
									}}
								>
									<Icon data-tooltip='预提/取消预提' className="iconfont icon-yuti icon-style"/>
								</span>
							</Dropdown>
							<span
								style={{ marginLeft: '10px',  cursor: 'pointer' }}
								onClick = { () => {
									this.setState({
										currentRecord: record,
										showTrialModal:true
									});
								} }
							>
								<Icon data-tooltip='试算' className="iconfont icon-liancha icon-style"/>
							</span>
                		</div>;
              }
            }, 
        ];
		//console.log(dataList,'555');

		return (
			<div className= "fm-interest">
				<div className="bd-header" style={{ marginBottom : '15px' , borderBottom : 'solid 1px #E3E7ED' }}>
					<div className='credit-title'>
						<span className='bd-title-1'>计息</span>
						<Button className='btn-2' 
							onClick={() => {
								this.interestSettlement();
							}}
							>计息</Button>
							<Button className='cancel-button' 
							onClick={() => {
								this.cancelInterestSettlement();
							}}
							>取消计息</Button>
					</div>
					{/* <div className='credit-search'>
						<FormControl 
							value = {keyWords}
							className="search-input"
							onChange = {(e) => {
								this.setState({
									keyWords: e.target.value
								});
							}}
							onKeyDown = {(e) => {
								if(e.keyCode=== 13) {
									this.handleSearch(e.target.value);
								}
							}}
							placeholder = "按放款编号搜索" 
						/>
						<Icon className="iconfont icon-icon-sousuo" onClick = {this.handleSearch.bind(this, keyWords)} />
					</div>	 */}
				</div>
				<div className='bd-header fm-select'>
					<div className='select-code' style={{display:'inline-block', marginBottom:'-8px'}}>
						<Refer 
							placeholder="放款编号"
							ctx={'/uitemplate_web'}
							refModelUrl={'/fm/financepayRef/'}
							refCode={'financepayRef'}
							refName={'放款编号'}
							value={{refpk: referCode, refname: loancode ? loancode : ''}}     
							onChange={item => {
								searchMap.loancode= item.loancode;
								//console.log(item.loancode);
								this.setState({
									searchMap, 
									referCode: 111, 
									loancode: item.loancode
								});
							}}
							multiLevelMenu={[
								{
									name: ['放款编号'],
									code: ['loancode']
								}
							]}
						/>
					</div>

					<div className='select-mny' style={{display:'inline-block', marginBottom:'-8px'}}>
						<Refer
							placeholder="放款金额"
							ctx={'/uitemplate_web'}
							refModelUrl={'/fm/financepayRef/'}
							refCode={'financepayRef'}
							refName={'放款金额'}
							value={{refpk: referCode, refname: loanmny ? loanmny : ''}}     
							onChange={item => {
								searchMap.loanmny= item.loanmny;
								console.log(item.loanmny);
								this.setState({
									searchMap, 
									referCode: 111, 
									loanmny: item.loanmny
								});
							}}
							multiLevelMenu={[
								{
									name: ['放款金额'],
									code: ['loanmny']
								}
							]}
						/>
					</div>
					{/* <Select
						showSearch
						className='select-mny'
						placeholder="放款金额"
						optionFilterProp="children"
						onChange={this.handleChange.bind(this)}
					>
						<Option value="jack">Jack</Option>
						<Option value="lucy">Lucy</Option>
						<Option value="tom">Tom</Option>
					</Select> */}
					<div className='select-type' style={{display:'inline-block', marginBottom:'-8px'}}>
						<Refer 
							placeholder="交易类型"
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易类型'}
							value={{refpk: referCode, refname: trantypeid ? trantypeid : ''}}     
							onChange={item => {
								searchMap.trantypeid= item.id;
								this.setState({
									searchMap, 
									referCode: 111, 
									trantypeid: item.refname
								});
							}}
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
						/>
					</div>

					<div className="select-date">
						{/* <Icon className='iconfont icon-rili'/> */}
						<DatePickerSelect 
							placeholder = '业务日期'
							value= {searchMap.ts}
							onChange= {(date) => {
								searchMap.ts= date;
								this.setState({searchMap});
							}}
						/>
						{/* <Icon className='iconfont icon-rili select-rili'></Icon> */}
					</div>

					<Select
						showSearch
						className='select-state'
						placeholder="还款方式"
						onChange= {val => {
							searchMap.returnmodeid= val;
							console.log(val);
							this.setState({searchMap});
						}}
					>
						{
							this.state.dataList.map((item,key)=>{
								return (
									<Option value={key}>{item.returnmodeid ? item.returnmodeid.display : item.returnmodeid.value}</Option>
								)
							})
						}
					</Select>

					<Button className="btn-select"
						onClick={() => {
							this.getInterest(1, pageSize);
							this.setState({pageIndex: 1});
						}}
					>
						查询
					</Button>

					<span className="btn-reset"
						onClick= {() => {
							this.setState({
								searchMap: {}
							});
						}}
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
					className='bd-table'
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
                <Modal
					show = { this.state.showModal }
					onHide = { this.close.bind(this) }
					style={{ width: 450, height: 300, position: "absolute", left: '50%', top: '50%', marginLeft: -225, marginTop: -150}}
					>
					<Modal.Header className="text-center">
						<Modal.Title style={{textAlign: 'left'}}>预提</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Row>
							<Col md={3} sm={3} className="text-left">
								<span style={{lineHeight: 3}}>预提开始日期:</span>
							</Col>
							<Col md={6} sm={6}>
								<DatePicker
									format={"YYYY-MM-DD"}
									onChange={(e, dateStart)=> {
										this.setState({
											dateStart:e
										})
										console.log(dateStart, 'YYYY-MM-DD');
									}}
									value={dateStart}
									placeholder = {'选择日期时间'}
								/>                    
							</Col>
						</Row> 
						<Row>
							<Col md={3} sm={3} className="text-left">
								<span style={{lineHeight: 3}}>预提结束日期:</span>
							</Col>
							<Col md={6} sm={6}>
								<DatePicker
									format={"YYYY-MM-DD"}
									onChange={(e, dateEnd)=> {
										this.setState({
											dateEnd:e
										})
										console.log(dateEnd, 'YYYY-MM-DD');
									}}
									value={dateEnd}
									placeholder = {'选择日期时间'}
								/>                    
							</Col>
						</Row>                   
					</Modal.Body>

					<Modal.Footer>
						<Button style={{marginRight: '10px'}} onClick={  () => {
							const _this = this;
							
							let { dataList, pageIndex, pageSize, currentRecord}= self.state;
							console.log(dateStart,'123456789')
							Ajax({
								url: URL + 'fm/interests/preInterest',
								data: [
									{
										"end": this.state.dateEnd.format('YYYY-MM-DD'),
										"loadid": currentRecord.id.value,
										"start": this.state.dateStart.format('YYYY-MM-DD'),
										"ts": currentRecord.ts.value
									}
								],
								header: {"Content-Type": "application/json"},
								success: function(res) {
									const { data, message, success } = res;
									console.log(res,'7890');
										if (success) {
											
											toast({content: '预提成功...', color: 'success'});
											_this.getInterest(pageIndex, pageSize);
											
											_this.close();
											console.log('7890')	
											
											
										} else {
											//toast({content: message.message, color: 'warning'});
										}
									},
								error: function(res) {
									//console.log(res, 'error');
									//toast({content:res.message, color: 'danger'});
								}
							});}
						} colors="primary">确认</Button>
						<Button onClick={ this.close.bind(this) } shape="border">关闭</Button>
					</Modal.Footer>
           		</Modal>

		    <Modal
				show = { this.state.showModal }
				onHide = { this.close.bind(this) }
				style={{ width: 450, height: 300, position: "absolute", left: '50%', top: '50%', marginLeft: -225, marginTop: -150}}
            >
                <Modal.Header className="text-center">
                    <Modal.Title style={{textAlign: 'left'}}>试算</Modal.Title>
                </Modal.Header>

                <Modal.Body>
					<Row>
						<Col md={3} sm={3} className="text-left">
							<span style={{lineHeight: 3}}>试算开始日期:</span>
						</Col>
						<Col md={6} sm={6}>
							<DatePicker
								format={"YYYY-MM-DD"}
								onChange={(e, dateStart)=> {
									this.setState({
										dateStart:e
									})
									console.log(dateStart, 'YYYY-MM-DD');
								}}
								value={dateStart}
								placeholder = {'选择日期时间'}
							/>                    
						</Col>
					</Row> 
					<Row>
						<Col md={3} sm={3} className="text-left">
							<span style={{lineHeight: 3}}>试算结束日期:</span>
						</Col>
						<Col md={6} sm={6}>
							<DatePicker
								format={"YYYY-MM-DD"}
								onChange={(e, dateEnd)=> {
									this.setState({
										dateEnd:e
									})
									console.log(dateEnd, 'YYYY-MM-DD');
								}}
								value={dateEnd}
								placeholder = {'选择日期时间'}
							/>                    
						</Col>
					</Row>                   
                </Modal.Body>

				<Modal.Footer>
					<Button style={{marginRight: '10px'}} onClick={  () => {
						const _this = this;
						
						let { dataList, pageIndex, pageSize, currentRecord}= self.state;
						console.log(dateStart,'123456789')
						Ajax({
							url: URL + 'fm/interests/tryInterest',
							data: 
								{
									"start":this.state.dateStart.format('YYYY-MM-DD'),
									"end": this.state.dateEnd.format('YYYY-MM-DD'),
									"loadid": currentRecord.id.value,
									"ts": currentRecord.ts.value
								},
							header: {"Content-Type": "application/json"},
							success: function(res) {
								const { data, message, success } = res;
								console.log(res,'试算');
									if (success) {
										
										_this.setState({
											data:res.data,
											showTrialModal:true,
										})

										_this.close();
									}
								},
						});
						;}
					} colors="primary">确认</Button>
					<Button onClick={ this.close.bind(this) } shape="border">关闭</Button>
				</Modal.Footer>
           </Modal>
		   		{
					showBillModal && 
					<Aabill 
						showModal={showBillModal} 
						overdue={true} 
						needmainTable={true}
						iabillKey={currentRecord.id.value || currentRecord.id.display}
						parenttype='3'
						upClick={() => {
							this.setState({
								showBillModal: false
							});
						}}
						style={{height:'500px'}}
					/>
				}
				{
					showTrialModal &&
					<Trial
						showModal={showTrialModal}
						upClick={() => {
							this.setState({
								showTrialModal:false,
							})
						}}
						data={data} 
					/>
				}
			</div>
		);
	}
}

Interest.defaultProps = defaultProps;