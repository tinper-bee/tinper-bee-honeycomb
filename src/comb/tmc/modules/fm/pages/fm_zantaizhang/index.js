import React, { Component } from 'react';
import { Link ,hashHistory} from "react-router";
import { Modal, Row, Col, Button, FormControl, Icon, InputGroup, Select} from 'tinper-bee';
import Table from 'bee-table';
import ButtonGroup from 'bee-button-group';
import DeleteModal from '../../../../containers/DeleteModal';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import {RadioItem, TextAreaItem} from 'containers/FormItems';
import Menu, { Item as MenuItem } from 'bee-menus';
import Dropdown from 'bee-dropdown';
import PageJump from '../../../../containers/PageJump';
import { toast, formatMoney, numFormat } from '../../../../utils/utils.js';
import Ajax from '../../../../utils/ajax';
import './index.less';
import { error } from 'util';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import {RangePicker} from 'bee-datepicker';
import DatePickerSelect from '../../../pass/containers/DatePickerSelect/index.js';
import nodataPic from '../../../../static/images/nodata.png';
const URL= window.reqURL.fm;
const format = 'YYYY-MM-DD';

export default class Zantaizhang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenseData:[],//担保表格数据
            pageSize:10,//每页显示多少条记录 
            pageIndex:1,//页数
            maxPage:1,//最大页码 
            totalSize:0,//多少条记录 
            searchMap: {
            },//搜索参数 
        };
    }
    componentWillMount () {
        // 获取费用列表
        this.getExpenseList(this.state.pageIndex,this.state.pageSize);
    }
    
    //请求费用列表
    getExpenseList = (page,size,searchMap = this.state.searchMap) => {
        let _this = this;
        let searchMaps= JSON.parse(JSON.stringify(searchMap));
        if(searchMap.highMny){
            searchMaps.lowMny = 0;
        }
        if (searchMaps.startTime) {
			searchMaps.startTime = moment(searchMaps.startTime).format(format) + ' 00:00:00';
		}
		if (searchMaps.endTime) {
			searchMaps.endTime = moment(searchMaps.endTime).format(format) + ' 23:59:59';
        }
        console.log('searchMaps=======>',searchMaps);
        Ajax({
            url:URL + "fm/payment/list",
            data:{
                "page":page - 1,
                "size":size,
                "searchParams":{
                    "searchMap":searchMaps
                }        
            },
            success: function(res) {
                const { data, success } = res;
                if (success && data.head) {
                    let expenseData = data.head.rows.map(e => e.values);
                    let pageinfo = data.head.pageinfo;
                    _this.setState({
                        expenseData:expenseData,
                        maxPage:pageinfo.totalPages,
                        totalSize:pageinfo.totalElements,
                    });
                } else {
                    _this.setState({
                        expenseData:[],
                    });
                    toast({content: '暂无数据', color: 'warning'});
                }
            },
        })
    };
    // 页码选择
    onChangePageIndex = (page) => {
        console.log(page, 'page');
        this.setState({
            pageIndex: page
        });
        //请求数据
        this.getExpenseList(page, this.state.pageSize);
    };

    //页数量选择 
    onChangePageSize = (value) => {
        console.log(value, 'value');
        this.setState({
            pageIndex: 1,
            pageSize: value
        });
        // 请求数据
        this.getExpenseList(1, value);
    };
    
    // 查询日期
    paymentTime = (e) => {
        let {searchMap} = this.state;
        let startTime = e[0].format('YYYY-MM-DD') + ' 00:00:00';
        let endTime = e[1].format('YYYY-MM-DD') + ' 23:59:59';
        searchMap.startTime = startTime;
        searchMap.endTime = endTime;
        this.setState({
            searchMap
        })
		};
    // 面包屑数据
    breadcrumbItem = [ { href: '#', title: '首页' }, { title: '担保管理' }, { title: '担保台账' } ];
    render() {
        let {
            expenseData,
            pageSize,
            pageIndex,
            maxPage,
            totalSize,
            searchMap,
        } = this.state;
				//费用表格columns
        const ensureColumns = [
            { 
                title: '序号', 
                key: 'key', 
                dataIndex: 'key', 
								width: 50,
								fixed: 'left',
                render: (text, record, index) => {
                    return (
											<div className="show-title">
												<span>{pageSize * (pageIndex - 1) + index + 1 }</span>
												<div className="title-text">{record.payaccountid.display}</div>
											</div>	
                    );
                } 
            },
            { 
                title: '担保合约号', 
                key: 'payNo', 
								dataIndex: 'payNo', 
								fixed: 'left',
								width: 100,
                render: (text, record,index) => {
                    return (
                        <Link to={{ pathname: `/fm/paymentShare/${record.id.value}`, query: { type: 'browse' } }}>
                            <a style={{color:'#0073DA'}}>{record.vbillno.value}</a>
                        </Link>
                    );
                } 
						},
						{ 
								title: '担保人', 
								key: 'payNo', 
								dataIndex: 'payNo', 
								width: 80,
								render: (text, record,index) => {
										return (
												<Link to={{ pathname: `/fm/paymentShare/${record.id.value}`, query: { type: 'browse' } }}>
														<a style={{color:'#0073DA'}}>{record.vbillno.value}</a>
												</Link>
										);
								} 
						},
						{ 
								title: '债权人', 
								key: 'payNo', 
								dataIndex: 'payNo', 
								width: 80,
								render: (text, record,index) => {
										return (
												<Link to={{ pathname: `/fm/paymentShare/${record.id.value}`, query: { type: 'browse' } }}>
														<a style={{color:'#0073DA'}}>{record.vbillno.value}</a>
												</Link>
										);
								} 
						},
            { 
                title: '债务人', 
                key: 'payDate', 
                dataIndex: 'payDate', 
                width: 80,
                render: (text, record,index) => {
                    let value = record.paymentdate.value;
                    value = value.substr(0,10);
                    return (
                        <span>{value}</span>
                    );
                } 
            },
            { 
                title: '反担保人', 
                key: 'currency', 
                dataIndex: 'currency', 
								width: 80,
								sumCol:true,
                render: (text, record,index) => {
                    return (
                        <span>{record.currtypeid.display}</span>
                    );
                } 
            },
            { 
                title: '担保币种', 
                key: 'rate', 
                dataIndex: 'rate', 
                width: 80,
                render: (text, record,index) => {
                    return (
                        <span>{Number(record.exchangerate.value).formatMoney(4,'')}</span>
                    );
                } 
            },
            { 
                title: '担保金额', 
                key: 'payValue', 
                dataIndex: 'payValue', 
                width: 100,
                render: (text, record,index) => {
                    return (
                        <span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
                    );
                } 
            },
            { 
                title: '可用担保金额', 
                key: 'vbillstatus', 
                dataIndex: 'vbillstatus', 
                width: 100,
                render: (text, record,index) => {
                    let value = record.vbillstatus.value;
                    switch (value) {
                        case 1:
                        value = '审批通过';
                        break;
                        case 2:
                        value = '审批中';
                        break;
                        case 3:
                        value = '待审批';
                        break;
                        case 0:
                        value = '待提交';
                        break;
                        default:
                        break;
                    }
                    return (
                        <span>{value}</span>
                    );
                } 
            },
            { 
								title: '担保方式', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '担保起始日期', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '担保结束日期', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '交易类型', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '债务编号', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '债务起始日期', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '债务终止日期', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '债务币种', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '债务金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '占用担保金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '还本编号', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '还本日期', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '担保释放金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '担保物权变化', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '担保物权名称', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '可用金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '债务起始日期', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '占用担保金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '释放担保金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '剩余担保金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '反担保合约号', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '币种', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{ 
								title: '反担保金额', 
								key: 'payValue', 
								dataIndex: 'payValue', 
								width: 100,
								render: (text, record,index) => {
										return (
												<span>{Number(record.paymentmny.value).formatMoney(2,'')}</span>
										);
								} 
						},
						{
							title: '操作',
							dataIndex: 'operation',
							key: 'operation',
							width: 80,
							fixed: 'right',
							render: (text, record, index) => {
								//更多按钮的下拉菜单
								let menu = (
									<Menu multiple onClick={(e) => setTimeout(this.handleMenuSelected.bind(this, e.key, text, record, index),0)}>
										<MenuItem key="commit">担保债权明细</MenuItem>						
										<MenuItem key="change">担保物权明细</MenuItem>
										<MenuItem key="change-record">反担保明细</MenuItem>
									</Menu>
								);
								return (
									<div>
										<Dropdown trigger={[ 'hover' ]} overlay={menu} animation="slide-up">
											<Icon className="iconfont icon-gengduo icon-style" />
										</Dropdown>
									</div>
								);
							}
						}
        ]
        //this.props.location.query.type === 'add'
        return(
            <div className='taizhang-page bd-wraps'>
                <BreadCrumbs items={this.breadcrumbItem} />
								<div className='bd-header'>
										<h2>担保台账总览：</h2>
										<div className="search-condition">
											<Select 
												value= {searchMap.vbillstatus}
												onChange={(e) => {
														searchMap.vbillstatus = e;
														this.setState({
																searchMap  
														})
												}} 
												dropdownStyle={{ zIndex: 10000 }}
												placeholder='担保合约号'
											>
												<Option value={0}>待提交</Option>
												<Option value={1}>审批通过</Option>
												<Option value={2}>审批中</Option>
												<Option value={3}>待审批</Option>
											</Select>
											<Select 
												value= {searchMap.vbillstatus}
												onChange={(e) => {
														searchMap.vbillstatus = e;
														this.setState({
																searchMap  
														})
												}} 
												dropdownStyle={{ zIndex: 10000 }}
												placeholder='担保方式'
											>
												<Option value={0}>待提交</Option>
												<Option value={1}>审批通过</Option>
												<Option value={2}>审批中</Option>
												<Option value={3}>待审批</Option>
											</Select>
											<Select 
												value= {searchMap.vbillstatus}
												onChange={(e) => {
														searchMap.vbillstatus = e;
														this.setState({
																searchMap  
														})
												}} 
												dropdownStyle={{ zIndex: 10000 }}
												placeholder='担保金额'
											>
												<Option value={0}>待提交</Option>
												<Option value={1}>审批通过</Option>
												<Option value={2}>审批中</Option>
												<Option value={3}>待审批</Option>
											</Select>
											<DatePickerSelect
													placeholder='担保起始日期'
													value= {searchMap.startTime}
													onChange= {(date) => {
															searchMap.startTime= date;
															this.setState({searchMap});
													}}
											/>
											<DatePickerSelect
													placeholder='担保结束日期'
													value= {searchMap.endTime}
													disabledDate={(current) => searchMap.startTime? current && current.valueOf() < moment(searchMap.startTime):null}
													onChange= {(date) => {
															searchMap.endTime= date;
															this.setState({searchMap});
													}}
											/>
											<Button 
													className="search-btn"
													style={{marginLeft: 10, marginTop: -4}}
													onClick={() => {
															this.setState({pageIndex: 1});
															this.getExpenseList(this.state.pageIndex,this.state.pageSize);
													}}>查询
											</Button>
										<span
												className='zijinyun-reset'
												onClick= {() => {
														this.setState({
																searchMap: {}
														});
												}}>重置
										</span>
									</div>
                </div>
                <Table
                    className="fm-table"
                    bordered 
                    columns={ensureColumns} 
										data={expenseData} 
										scroll={{x: 3000}}
                    emptyText={() => 
                        <div>
                            <img src={nodataPic} alt="" />
                        </div>
                    }
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


