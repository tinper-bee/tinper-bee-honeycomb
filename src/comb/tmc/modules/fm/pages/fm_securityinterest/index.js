import React, { Component } from 'react';
import { Link } from "react-router";
import {
	Breadcrumb,
	Button,
	Row,
	Col,
	Icon,
	Dropdown,
	Table,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	InputGroup,
	Message
} from 'tinper-bee';
import FormControl from 'bee-form-control';
import Refer from 'containers/Refer';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Ajax from '../../../../utils/ajax';
import NoData from '../../../../containers/NoData';
import SideslipModal from '../../containers/SideslipModal';
import DeleteModal from '../../../../containers/DeleteModal';
import "./index.less";
import "../../../../utils/utils.js";

const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
//页面名称
//必须
const name = '担保物权';

const breads = [ { href: '#', value: '首页' }, { href: '#', value: '融资交易' }, { href: '#', value: '担保物权' } ];

//担保方式
const gpTypes = [{key: 0, name: "全部"}, {key: 1, name: "抵押"}, {key: 2, name: "质押"}];
//担保物权状态
const guapropstatuses = [{key: 0, name: "全部"}, {key: 1, name: "待押物权"}, {key: 2, name: "在押物权"}];
//所属者属性
const owners = [{key: 0, name: "全部"}, {key: 1, name: "合作伙伴"}, {key: 2, name: "本单位"}, {key: 3, name: "集团内"}];	

const modalColumns = 
	[{ title: '序号', dataIndex: 'index', key: 'index', width: 100 },
	{ title: '担保日期/担保合同号', dataIndex: 'contractCode', key: 'contractCode', width: 300,
	render: (text, record, index) => {
			return <div>
						<div>{record.guastartdate}</div>
						<div>{record.contractno}</div>
					</div>
		}
	},
	{ title: '债权人', dataIndex: 'creditorpa', key: 'creditorpa', width: 300 },
	{ title: '债务人', dataIndex: 'debtorpa', key: 'debtorpa', width: 300 },
	{ title: '担保人', dataIndex: 'guarantor', key: 'guarantor', width: 300 }];

function FilterButon(param){
	return param.value == param.sel ? 
		<a className="filter-selected" onClick={param.onClick}>{param.value}</a> 
		: <a onClick={param.onClick}>{param.value}</a>;
}

//请求的url
const rootURL = window.reqURL.fm + 'fm/guaproperty/';
/**
 * 担保物权
 */
export default class SecurityInterest extends Component {

	static contextTypes = {  
        //this.context.router.push跳转必须
        router:React.PropTypes.object  
    }  

	constructor(props, context){
        super(props, context);
		this.state = {
			dataSource: [],
			pageIndex: 0,
			totalPages: 0,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',			
			message: '',
			name: "",
			code: "",
			partner: {id: ""},
			minValue: "",
			maxValue: "",
			gpType: {key: 0, name: "全部"},		//过滤面板：担保方式
			owner: {key: 0, name: "全部"},			//过滤面板：所有者属性
			guapropstatus: {key: 0, name: "全部"},	//过滤面板：担保物权状态
			showModal: false,
			showDelete: false,
			showAlert: false,
			vBillStatus: 0,
			modalTitle: "物权编号：",				//联查数据
			queryData: [],							//联查数据
			chartData: []							//联查数据
		};
	}

	componentWillMount() {
		// 获取页面表格数据
		this.query(this.state.pageIndex, this.state.pageSize);
	}

	queryByCondition = () => {
		const {name, code, partner, minValue, maxValue} = this.state;
		let keyWords = {};
		if(name != ""){
			keyWords.keyPledgename = name
		}
		if(code != ""){
			keyWords.keyPledgeno = code
		}
		if(partner.id != ""){
			keyWords.partnerid = partner.id
		}
		if(minValue != ""){
			keyWords.minValue = minValue
		}
		if(maxValue != ""){
			keyWords.maxValue = maxValue
		}
		this.query(0, this.state.pageSize, keyWords);
	}

	query = (pageIndex, pageSize, keyWords = {}) => {
		const _this = this;
		const url = rootURL + 'list';
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: keyWords
		};
		const param = {
			page,
			size,
			searchParams
		};
		this.request(url, param, (data, localParam) => {
				let newSource = [];
				const head = data.head;
				let totalNums = 0;
				let totalPages = 0;
				if (head && head.rows && head.rows.length > 0) {
					newSource = data.head.rows.map((item, index) => {
						const values = item.values;
						const gpType = values.gptype.value;
						const gpTypeName = gpType == 1 ? "抵押" : gpType == 2 ? "质押" : "";
						return {
							id: values.id.value,
							code: values.pledgeno.value,
							name: values.pledgename.value,
							gpType: gpTypeName,				
							partner: values.partnerid.display,					
							currency: values.currtypeid.display,
							curPrice: Number(values.curprice.value).formatMoney(2, ""),
							maxPledge: Number(values.maxpledge.value).formatMoney(2, ""),
							totalPledge: values.totalpledge ? values.totalpledge.value : "",
							restPledge: values.restpledge ? values.restpledge.value : "",
							pledgeRate: values.pledgerate.value ? Number(values.pledgerate.value).formatMoney(2, "") + "%" : "",
							vBillStatus: values.vbillstatus ? values.vbillstatus.value : 0,
							ts: values.ts.value,
							tenantid: values.tenantid.value
						};
					});
					const head = data.head;
					totalNums = head.pageinfo ? head.pageinfo.totalElements : 0;
					totalPages = head.pageinfo ? head.pageinfo.totalPages : 0;
				}		
				return {
					dataSource: newSource,
					totalPages: totalPages,
					totalNums: totalNums,
					showAlert: false,
					message: ''
				};
		});
	};

	handleAdd = () => {
		this.context.router.push("/fm/interestcard");
	}

	handleDelete = (record) => {
		let _this = this;
		const url = rootURL + 'save';
		const param = {
            data: {
                head: {
                    rows: [
                        {
                            values: {
                                               
                            }
                        }
                    ]
                }
            }
        };
		param.data.head.rows[0].values.status = {
			value: 3
		};
		param.data.head.rows[0].values.id = {
			value: record.id
		};
		param.data.head.rows[0].values.vbillstatus = {
			value: record.vBillStatus
		};
		param.data.head.rows[0].values.tenantid = {
			value: record.tenantid
		};
		param.data.head.rows[0].values.ts = {
			value: record.ts
		};
		this.request(url, param, (data, localParam) => {
			_this = localParam;
			_this.query(_this.state.pageIndex, _this.state.pageSize);
		}, _this);
	}

	handleQueryContract = (text, record, index) => {
		const url = window.reqURL.fm + "fm/guacontract/linkedquery";
		const gptypeEnum = record.gpType == "抵押" ? 1 : 2;
		const param = {guapropertyid: record.id, gptype: gptypeEnum};
		//柱状图
		const chartData = [{name: "当前价值", value: record.curPrice.replace(/,/g, ""), color: ['rgba(58,164,210,1)', 'rgba(58,164,210,0.9)']},
							{name: "实际可抵押价值", value: record.maxPledge.replace(/,/g, ""), color: ['rgba(93,213,197,1)', 'rgba(93,213,197,0.9)']},
							{name: "累积可抵押价值", value: record.totalPledge, color: ['rgba(237,122,117,1)', 'rgba(237,122,117,0.9)']},
							{name: "剩余价值", value: record.restPledge, color: ['rgba(255,144,81,1)', 'rgba(255,144,81,0.9)']}];
		this.request(url, param, (data, chartData) => {
			if(!data.head){
				return {
					modalTitle: "物权编号：" + record.code,
					chartData,
					showModal: true
				};
			}
			let queryData = [];
			queryData = data.head.rows.map((item, index) => {
				const values = item.values;
				return {
					index: index + 1,
					contractno: values.contractno.value,
					guastartdate: values.guastartdate.value,
					creditorpa: values.creditorpa.value,
					debtorpa: values.debtorpa.value,
					guarantor: values.guarantor.value
				};
			});
			return {
				modalTitle: "物权编号：" + record.code,
				queryData,
				chartData,
				showModal: true
			};
		}, chartData);
		//this.setState({showModal: true});
	}

	handleEdit = (text, record, index) => {
		const url = "/fm/interestcard";
		const info = {pageStatus: "edit", data: {id: record.id}};
		const path = {pathname: url, state: info};
		this.context.router.push(path);
	}

	handleReset = () => {
		this.setState({
			name: "",
			code: "",
			partner: {id: ""},
			minValue: "",
			maxValue: "",
		});
		this.query(this.state.pageIndex, this.state.pageSize);
	}
	
	handleMenuSelected = (key, record) => {
		if(key == "change"){
			const url = "/fm/interestcard";
			const info = {pageStatus: "change", data: record};
			const path = {pathname: url, state: info};
			this.context.router.push(path);
		}else if(key == "change-record"){
			const url = "/fm/interestchange";
			const info = {pageStatus: "browse", data: record};
			const path = {pathname: url, state: info};
			this.context.router.push(path);
		}else if(key == "commit" || key == "uncommit"){
			const {id, tenantid, ts, vBillStatus, code, name, gptype, partner, currency, 
					curPrice, maxPledge, pledgeRate} = record;
			let url = rootURL + key;
			const param = {
				data: {
					head: {
						rows: [
							{
								values: {
									pledgeno: {
										value: code
									},
									pledgename: {
										value: name
									},            
								}
							}
						]
					}
				}
			};
			param.data.head.rows[0].values.id = {
				value: id
			};
			param.data.head.rows[0].values.tenantid = {
				value: tenantid
			};
			param.data.head.rows[0].values.ts = {
				value: ts
			};
			param.data.head.rows[0].values.vbillstatus = {
				value: vBillStatus
			};
			this.request(url, param, (data, _this) => {
				_this.query(this.state.pageIndex, this.state.pageSize);;
			}, this);
		}
	}

	handleFilterChange = (key, item) => {
		let data = this.state;
		data[key] = item;
		this.setState(data);
		let keyWords = {}; 
		if(item.key != 0){
			keyWords[key] = item.key;
		}
		this.query(this.state.pageIndex, this.state.pageSize, keyWords);
	}

	handleQueryChange = (key, e) => {
		let data = this.state;
        data[key] = e;
		this.setState(data);
	} 

	// 分页点击
	handleSelect = (index) => {
		const curIndex = index - 1;
		this.setState({pageIndex: curIndex}, () => this.query(curIndex, this.state.pageSize));
	}

	handleChangePageSize = (pageSize) => {
		this.setState({pageSize}, () => this.query(0, this.state.pageSize));
	}

	cleanFilter = () => {
		this.setState(
			{
				gpType: {key: 0, name: "全部"},		//过滤面板：担保方式
				owner: {key: 0, name: "全部"},			//过滤面板：所有者属性
				guapropstatus: {key: 0, name: "全部"},	//过滤面板：担保物权状态
			}
		);
	}

	close = () => this.setState({showModal: false});

	cancelDelete = ()=> {
		this.setState({showDelete: false});
	}

	/**
     * @method Ajax请求
     * @param url 请求url
     * @param param 请求参数对象
     * @param successFun 请求成功时调用的函数，返回需要更新的状态，不需更新状态时不返回对象
     * @param localParam 需要传递的局部变量参数
     */
    request = (url, param, successFun, localParam = {}) => {
		const _this = this;
        Ajax({
            url: url,
			data: param,
			loading: true,
			success: function(res) {
				const { data, success, message } = res;
                if (success) {
                    const result = successFun(data, localParam);
                    if (typeof result != "undefined"){
                        _this.setState(result);
                    }                 
                } else {
                    Message.create({content: '数据请求出错！', color: 'danger'});
                }
			},
			error: function(res) {
				Message.create({content: '数据请求出错！', color: 'danger'});
			}
		});
    };

	//过滤面板
	renderFilter = () => {
		const {gpType, guapropstatus, owner} = this.state;	
		return(
			<Row className="filter-row">
				<Col md={3} xs={3} sm={3} >
					<div><span className="filter-title">担保方式：</span>
						{gpTypes.map((item) => {
							return <FilterButon value={item.name} sel={gpType.name} onClick={(e) => this.handleFilterChange("gpType", item)}/> 
						})}
					</div>
				</Col>
				<Col md={4}  xs={4} sm={4}>
					<div><span className="filter-title">担保物权状态：</span>
						{guapropstatuses.map((item) => {
							return <FilterButon value={item.name} sel={guapropstatus.name} onClick={(e) => this.handleFilterChange("guapropstatus", item)}/> 
						})}
					</div>
				</Col>
				<Col md={4}  xs={4} sm={4}>
					<span className="filter-title">所属者属性：</span>
					{owners.map((item) => {
						return <FilterButon value={item.name} sel={owner.name} onClick={(e) => this.handleFilterChange("owner", item)}/> 
					})}
				</Col>
				<Col md={1}  xs={1} sm={1}>
					<a onClick={this.cleanFilter}>
						<span className="clean" >清空</span>
					</a>
				</Col>
			</Row>
		);	
	};

	//列表列定义
	columns = [
		{ title: '序号', dataIndex: 'index', key: 'index', width: 100 },
		{ title: '物权编号', dataIndex: 'code', key: 'code', width: 300,
		render: (text, record, index) => {
				const url = "/fm/interestcard";
				const info = {pageStatus: "browse", data: record};
				const path = {pathname: url, state: info};
				return <Link className="browse-link" to={path}>{record.code}</Link>
			}
		},
		{ title: '物权名称', dataIndex: 'name', key: 'name', width: 300 },
		{ title: '类别', dataIndex: 'gpType', key: 'gpType', width: 100 },
		{ title: '权属单位名称', dataIndex: 'partner', key: 'partner', width: 300 },
		{ title: '币种', dataIndex: 'currency', key: 'currency', width: 100 },
		{ title: '当前评估价值', dataIndex: 'curPrice', key: 'curPrice', width: 200 },
		{ title: '可质押价值', dataIndex: 'maxPledge', key: 'maxPledge', width: 300 },
		{ title: '抵押/质押率', dataIndex: 'pledgeRate', key: 'pledgeRate', width: 200 },
		{
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
			width: 300,
			render: (text, record, index) => {
				//更多按钮的下拉菜单
				let menu = (
					<Menu multiple onClick={(e) => setTimeout(this.handleMenuSelected.bind(this, e.key, record),0)}>
						{(record.vBillStatus == 0 || record.vBillStatus == 3)
						&& <MenuItem key={record.vBillStatus == 0 ? "commit" : "uncommit"}>{record.vBillStatus == 0 ? "提交" : "收回"}</MenuItem>}					
						{record.vBillStatus == 1 
						&& [<MenuItem key="change">变更</MenuItem>, 
						<MenuItem key="change-record">变更记录</MenuItem>]}
					</Menu>
				);
				return (
					<div>
						<Icon
							data-tooltip="联查"
							className="iconfont icon-liancha icon-style"
							style={{marginRight: 12}}
							onClick={() => this.handleQueryContract(text, record, index)}
						/>
						{record.vBillStatus == 0  
						&&	
						[<Icon
							className="iconfont icon-bianji icon-style"
							style={{marginRight: 12}}
							onClick={() => this.handleEdit(text, record, index)} 
						/>,
						<DeleteModal 
							placement={'left'} 
							onConfirm={() => this.handleDelete(record)} 
						/>,
						<Dropdown trigger={[ 'hover' ]} overlay={menu} animation="slide-up">
							<Icon style={{marginLeft: 12}} className="iconfont icon-gengduo icon-style" />
						</Dropdown>]}
						{record.vBillStatus == 3  
						&&	
						<Icon
							className="iconfont icon-shouhui icon-style"
							style={{marginRight: 12}}
							onClick={() => this.handleMenuSelected("uncommit", record, index)} 
						/>}				
					</div>
				);
			}
		}
	];

	render() {
		let { tabs, dataSource, totalPages, totalNums, pageSize, showModal} = this.state;
		//添加序号
		dataSource = dataSource.map((e, i) => {
			const rowId = e.index;
			return {
				...e,
				key: i,
				index: i + 1
			};
		});
		//用于判断面包屑结束
		const last = breads.length - 1;
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					{breads.map((item, i) => {
						return i == last ? (
							<Breadcrumb.Item active>{item.value}</Breadcrumb.Item>
						) : (
							<Breadcrumb.Item href={item.href}>{item.value}</Breadcrumb.Item>
						);
					})}
				</Breadcrumb>
				<div className="filter-panel" >
					{this.renderFilter()}
				</div>
				<div className="query-panel" >
					<span className="reset" onClick={this.handleReset}>重置</span>
					<Button className="btn" onClick={this.queryByCondition}>查询</Button>
					<FormControl name="code" placeholder="按照物权编号搜索" value={this.state.code} onChange={(e) => this.handleQueryChange("code", e)} />
					<FormControl name="name" placeholder="质押物名称" value={this.state.name} onChange={(e) => this.handleQueryChange("name", e)} />
					<FormControl name="maxValue" placeholder="当前评估价值范围" value={this.state.maxValue} onChange={(e) => this.handleQueryChange("maxValue", e)} />
					<span className="line"> - </span>
					<FormControl name="minValue" placeholder="当前评估价值范围" value={this.state.minValue} onChange={(e) => this.handleQueryChange("minValue", e)} />  			
					<Refer
						refModelUrl="/bd/partnerRef/"
						refCode="partnerRef"
						placeholder="权属单位"
						ctx="/uitemplate_web"
						value={this.state.partner}
						onChange={(e) => this.handleQueryChange("partner", e)}
						strFieldName={ {name: '名称', code: '编码'} }
						isMultiSelectedEnabled={false}
						className="refer"
					/>					
				</div>
				<div className="no-radius-header">					
					<div className="bd-title-1">{name}</div>
					<Button colors="primary" className="btn-2" style={{marginTop: -5}} onClick={this.handleAdd}>
						新增
					</Button>
				</div>
				<Table
					emptyText={NoData}
					bordered
					data={dataSource}
					columns={this.columns}
					className="bd-table"
				/>
				{totalNums > 0 && (
					<div className="bd-footer">
						<div className="page-size">
							<Select defaultValue={'10条/页'} onChange={this.handleChangePageSize}>
								<Option value="10">10条/页</Option>
								<Option value="20">20条/页</Option>
								<Option value="50">50条/页</Option>
								<Option value="100">100条/页</Option>
							</Select>
							共{totalNums} 条
						</div>
						{this.state.totalPages > 0 && (
							<div className="pagination">
								<Pagination
									gap
									prev
									next
									boundaryLinks
									items={totalPages}
									maxButtons={5}
									activePage={this.state.pageIndex + 1}
									onSelect={this.handleSelect}
								/>
							</div>
						)}
					</div>
				)}
				{this.state.showAlert && (
					<Row>
						<Alert colors="news" className="dark" onClick={() => this.setState({ showAlert: false })}>
							<Icon className="uf uf-notification" />
							<span className="alert-text">
								<strong>错误：</strong>
								{this.state.message}
							</span>
						</Alert>
					</Row>
				)}
				<SideslipModal 
					showModal={showModal}
					title={this.state.modalTitle}
					columns={modalColumns}
					tableData={this.state.queryData}
					chartData={this.state.chartData}
					close={this.close}
				/>
			</div>
		);
	}
}
