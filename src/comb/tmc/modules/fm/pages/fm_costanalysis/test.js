import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { InputGroup, FormControl, Popconfirm } from 'tinper-bee';
import moment from 'moment';
import BreadCrumbs from 'containers/BreadCrumbs';
import DatePicker from 'bee-datepicker';
import Tabs, { TabPane } from 'bee-tabs';
import PageJump from 'containers/PageJump';
import Table from 'bee-table';
import Select from 'bee-select';
import Refer from 'containers/Refer';
import Icon from 'bee-icon';
import Button from 'bee-button';
import Upload from 'bee-upload';
import Ajax from 'utils/ajax.js';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import nodataPic from '../../../../static/images/nodata.png';

import './index.less';
import {orgData, tableData} from './ajaxData.js'

const { ColumnGroup, Column } = Table;
const URL = window.reqURL.fm;
const format = 'YYYY-MM-DD';
const toDay = moment().format(format);
// 列表表头显示列信息

const CONFIG = {
	SERVICE: {
        getClass: window.reqURL.fm + 'fm/financing/classanalyze', // 交易大类(项目)
		getOrgan: window.reqURL.fm + 'fm/financing/organalyze', // 融资机构      
        getOrganChildren: window.reqURL.fm + 'fm/financing/orgdetail' // 融资机构子类
	},
	DISPALY: ['dealclass', 'projectid', 'financecorpid', 'trantypeid'],
    NOT_NUMBER: ['begindate', 'enddate']
}

const renderColSpan = (text, record, index) => {
  const obj = {
    children: text,
    props: {}
  };

  // 如果islast为false 那么没到底部 如果为true 那么到底部了
  // 那么这时候 
  //console.log(text, record, index)
  if (record.islast) {
    obj.props.colSpan = 0;
  }
  return obj;
};

const classColumns = [
	{ 
        title: '序号', 
        key: 'index', 
        dataIndex: 'index', 
        render: (text, record, index) => {
            if (!record.islast) {
                return <span>{text}</span>
            }
            return {
                children: <span>综合资金成本小计: {record.compositecosttotal} &nbsp;&nbsp;&nbsp; 加权平均融资成本: {record.compositeloancosttotal}</span>,
                props: {
                    colSpan: 16,
                },
            };  
        }, 
        width: 40
    },
	{ title: '交易大类', key: 'dealclass', dataIndex: 'dealclass', render: renderColSpan, width: 100},
	{ title: '项目', key: 'projectid', dataIndex: 'projectid', render: renderColSpan, width: 220},
	{ title: '融资机构', key: 'financecorpid', dataIndex: 'financecorpid', render: renderColSpan, width: 220},
	{ title: '交易类型', key: 'trantypeid', dataIndex: 'trantypeid', render: renderColSpan, width: 100},
	{ title: '融资金额', key: 'loanmny', dataIndex: 'loanmny', render: renderColSpan, width: 120},
	{ title: '开始日期', key: 'begindate', dataIndex: 'begindate', render: renderColSpan, width: 100},
	{ title: '结束日期', key: 'enddate', dataIndex: 'enddate', render: renderColSpan, width: 100},
	{ title: '当年资金占用期限(月)', key: 'occupymonth', dataIndex: 'occupymonth', render: renderColSpan, width: 60},
	{ title: '当年占用资金（余额）', key: 'occupymoney', dataIndex: 'occupymoney', render: renderColSpan, width: 120},
	{ title: '利息', key: 'interestmny', dataIndex: 'interestmny', render: renderColSpan, width: 120},
	{ title: '总费用', key: 'allcost', dataIndex: 'allcost', render: renderColSpan, width: 120},
	{ title: '综合资金成本', key: 'compositecost', dataIndex: 'compositecost', render: renderColSpan, width: 80},
	{ title: '当年占用资金权数', key: 'occupyweight', dataIndex: 'occupyweight', render: renderColSpan, width: 80},
	{ title: '当年资金成本权数', key: 'costweight', dataIndex: 'costweight', render: renderColSpan, width: 80},
	{ title: '加权平均融资成本', key: 'compositeloancost', dataIndex: 'compositeloancost', render: renderColSpan, width: 80},
];

const orgColumns = [
    { title: '序号', key: 'index', dataIndex: 'index', width: 10},
    { title: '融资机构', key: 'financecorpid', dataIndex: 'financecorpid', width: 200},      
    { title: '综合资金成本', key: 'compositecost', dataIndex: 'compositecost', width: 100},
    { title: '加权平均融资成本', key: 'compositeloancost', dataIndex: 'compositeloancost', width: 100},
];

const orgChildrenColumns = [
    { title: '序号', key: 'index', dataIndex: 'index', width: 40},
    { title: '融资子机构', key: 'financecorpid', dataIndex: 'financecorpid', width: 220},
    { title: '交易类型', key: 'trantypeid', dataIndex: 'trantypeid', width: 100},
    { title: '融资金额', key: 'loanmny', dataIndex: 'loanmny', width: 120},
    { title: '开始日期', key: 'begindate', dataIndex: 'begindate', width: 100},
    { title: '结束日期', key: 'enddate', dataIndex: 'enddate', width: 100},
    { title: '当年资金占用期限(月)', key: 'occupymonth', dataIndex: 'occupymonth', width: 60},
    { title: '当年占用资金（余额）', key: 'occupymoney', dataIndex: 'occupymoney', width: 120},
    { title: '利息', key: 'interestmny', dataIndex: 'interestmny', width: 120},
    { title: '总费用', key: 'allcost', dataIndex: 'allcost', width: 120},
    { title: '综合资金成本', key: 'compositecost', dataIndex: 'compositecost', width: 80},
    { title: '当年占用资金权数', key: 'occupyweight', dataIndex: 'occupyweight', width: 80},
    { title: '当年资金成本权数', key: 'costweight', dataIndex: 'costweight', width: 80},
    { title: '加权平均融资成本', key: 'compositeloancost', dataIndex: 'compositeloancost', width: 80}
]


const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (index === 4) {
    obj.props.colSpan = 0;
  }
  return obj;
};



export default class Costanalysis extends Component {
	constructor() {
		super();
		this.state = {
            tabIndex: 'classList', // 当前选中的tab标签
            tabParams: {
                'classList': {
                    url: CONFIG.SERVICE.getClass,
                    data: {
                        "page": 0,
                        "size": 10,
                        "searchParams":{
                            "searchMap":{
                                "time": "",
                                "financeorg": "",                                
                                "projectid": "",
                                "dealclass": ""
                            }
                        }
                    },
                    success: this.classCallBack
                },
                'organList': {
                    url: CONFIG.SERVICE.getOrgan,
                    data: {
                        "page": 0,
                        "size": 10,
                        "searchParams":{
                            "searchMap":{
                                "time": "",
                                "financeorg": "",
                            }
                        }
                    },
                    success: this.organCallBack
                }                
            },
            organList: [],
            classList: [],			
			
			pageIndex: 0,//当前页
			pageSize: 10,//每页显示几条
			keyWords: '',
            maxPage: 20,
            totalSize: 120,
            classSearch: {
                dealclass: '', // 交易大类
                projectid: '', // 项目名称
                financecorpid: '', // 融资机构
                date: '', // 日期                
            },
            organSearch: {                
                fininstitution: '', // 子融资机构
                date: ''  //  日期
            },
            projectid: {
                '1': '哈哈哈',
                '2': '嘿嘿嘿',
                '3': '呵呵呵'
            },
            dealclass: {
                '1': '哈哈哈',
                '2': '嘿嘿嘿',
                '3': '呵呵呵'
            }          
		};

		this.breadcrumbItem = [ 
			{ href: '#', title: '首页' }, 
			{ title: ' 融资交易' }, 
			{ title: '融资成本分析' } 
		];

        this.numberIndex = 0;
	}
	

	componentWillMount() {
        // TODO 过场动画
        // 一进来先赋值 key == organList 然后发起请求 key==organList和 key == classList 的 URL不同  他们的请求data不共用 当然返回结果也不同
		let _this = this,
            {tabParams, tabIndex} = this.state;
        let config = {...tabParams[tabIndex]}
        config.data.page = this.state.pageIndex;
        config.data.size = this.state.pageSize;        

		// Ajax({
		// 	...config
		// });
     
        this.lingshiAjax(tabIndex)      
    }

    componentDidMount(){

    }

    componentWillUpdate(){
       //this.addListenerScroll()
        //let showMoreFlagTop = document.getElementById('showMoreFlag').offsetTop;
        console.log (this.refs)
        console.log (this.refs.showMoreFlag)
    }


    lingshiAjax = (tabIndex) => {
        if(tabIndex === 'organList') {
            // 融资机构
            this.organCallBack();
        }else if(tabIndex === 'classList') {
            // 交易大类
            this.classCallBack();
        } 
    }

    organCallBack = (res) => {
        // console.log(res)
        // let {data, success} = res;        
        
        let data = this.ajaxData(this.state.pageIndex, this.state.pageSize, orgData)

        this.getDataByIndex(data, 'organList')
    }

    classCallBack = (res) => {
        console.log(res)
        // let {data, success} = res;
        // TODO 查看 data是否给对了。。
         
        let data = this.ajaxData(this.state.pageIndex, this.state.pageSize, tableData)
        this.getDataByIndex(data, 'classList')
    }

    ajaxData = (page, size, tableData) => {
        let arr = tableData.data.head.rows.slice(page * size, (page + 1) * size)
        const tableDataNew = {
            "data": {
                "head": {
                    "pageinfo": {
                        "number": 0,
                        "numberOfElements": 5,
                        "size": 5,
                        "totalElements": 182,
                        "totalPages": 37
                    },
                    "rows": []
                }
            },
            "message": null,
            "success": true
        };
        tableDataNew.data.head.rows = arr;
        return tableDataNew.data;
    }

    // 通过
	getDataByIndex = (tableData, type) => {
		var tempList = tableData.head.rows;		
		
		let dataList = tempList.map((item, index, arr) => {
			let obj = item.values,
				dist = {};
			for(let key in obj) {
				if(CONFIG.DISPALY.indexOf(key) >= 0) {
					dist[key] = obj[key].display
				}else {
					// TODO 待验证 精度 先注释。
					dist[key] = CONFIG.NOT_NUMBER.indexOf(key) >= 0 
                        ? obj[key].value 
                        : (+obj[key].value || 0)/*.toFixed(obj[key].scale)*/
				}
			}            
            dist['key'] = `key${index}`
            dist['index'] = (type == 'classList') ? this.getIndex(obj) : index
			return dist;
		})
		this.setState({
            [type] : dataList
        })
	}

    // 得到序号
    getIndex = (obj) => {       
        if(obj['islast'].value) {
            this.numberIndex = -1;
        }
        return ++this.numberIndex
    }
	
	// 每页显示多少条
	handlePageChange = (rows) => {
		
	};

	// 分页切换页面
	handlePageIndexChange = (index) => {
		
	};

	// 请求数据
	reqDataFun = (flag) => {
		
	}

    handleTabChange = (key) => {
        this.setState({
            tabIndex: key
        }, () => {
            this.lingshiAjax(key)
        })
    }

    // 子表展开函数
    onExpand = (isClosed, record) => {
        // // console.log(isClosed, record);
        // console.log('主表主键', record.id.value);
        // if (isClosed) {
        //     Ajax({
        //         url: window.reqURL.bd + 'bd/bankaccbas/subquery',
        //         data: {
        //             id: record.id.value
        //         },
        //         success: (res) => {
        //             const { data, message, success } = res;
        //             if (success) {
        //                 console.log('请求回来的子表数据', data.body.rows);
        //                 // 子表中的账户类型根据value值将display变成对应的中文
        //                 // 给子表每一行加一个索引
        //                 data.body.rows.forEach((item, index) => {
        //                     item.values.key = index + 1;
        //                     typeof item.values.accounttype.value === 'number' &&
        //                         (item.values.accounttype.display = accounttypeList[item.values.accounttype.value].key); //账户类型的display转换
        //                     item.values.balance.value = (item.values.balance.value - 0).formatMoney(); //初期余额返回的是字符串，转数字后转货币格式
        //                 });
        //                 // 定义一个二维数组，[[],[索引1的主表对应的子表信息]]
        //                 // record.key - 1 //主表的索引
        //                 bodyDataAry[record.key - 1] = data.body.rows;
        //                 this.setState(
        //                     {
        //                         body: {
        //                             ...this.state.body,
        //                             data: bodyDataAry
        //                         }
        //                     },
        //                     () => {
        //                         console.log('请求子表后的state', this.state);
        //                         console.log('子表的数据data', this.state.body.data);
        //                     }
        //                 );
        //                 this.forceUpdate();
        //             } else {
        //                 toast({ content: message.message, color: 'warning' });
        //             }
        //         },
        //         error: (res) => {
        //             toast({ content: '后台查询出错！' + res.message, color: 'danger' });
        //         }
        //     });
        // }
    };

    expandedOrgRender = (record, number) => {
        let dataChildren = tableData.data.head.rows.map((item, index) => {
            let obj = item.values,
                dist = {};
            for(let key in obj) {
                if(CONFIG.DISPALY.indexOf(key) >= 0) {
                    dist[key] = obj[key].display
                }else {
                    // TODO 待验证 精度 先注释。
                    dist[key] = CONFIG.NOT_NUMBER.indexOf(key) >= 0 
                        ? obj[key].value 
                        : (+obj[key].value || 0)/*.toFixed(obj[key].scale)*/
                }
            }            
            dist['key'] = `key${index}`
            dist['index'] = index
            return dist;
        });

        // console.log(dataChildren)
        return (
            <Table
                emptyText={() => <span>暂无记录</span>}
                columns={orgChildrenColumns}
                data={dataChildren}
                className="bd-table"
            />
        );
    };

    onScroll = (e) => {
        /* 能触发滚动的时机是：
         * 1、数据库中还有数据     hasMore开关
         * 2、不在滚动过程中       isAjax开关
         * 3、到底部 触发滚动时机  时机。。。
         */  
        console.log(e.currentTarget, e.target)
        
    }	

    handleSearchClick = (type) => {

    }	

    handleSearchReset = (type) => {

    }

	render() {
		const {
			keyWords,
			dataList,
			tabIndex,
            organList,
            classList,
            maxPage,
            totalSize,
            pageIndex,
            pageSize,
            dealclass,
            projectid
		} = this.state;	

        return (
			<div className='fm_costanalysis'>
				<BreadCrumbs items={this.breadcrumbItem} />
					
				<div ref="showMoreFlag1" className="costanalysis-header">
                    {tabIndex === 'classList' ? (
                    <div className='costanalysis-search-content'>
                        
                         <div className='costanalysis-search-item width-120'>
                            <Select
                                showSearch
                                placeholder='交易大类'
                                optionFilterProp='children'
                                onSelect={(value) => {
                                    // this.state.searchData1.loannumData1 = value;
                                    // this.setState({
                                    //     searchData1: this.state.searchData1
                                    // });
                                }}
                                value={''}
                                onSearch={(value) => {
                                    // if (value.length > 0) {
                                    //     this.resSelectDataFun({
                                    //         url: 'fm/bills/loancodelist',
                                    //         data: {
                                    //             loancode: value
                                    //         },
                                    //         selectName: 'loancodes'
                                    //     });
                                    // }
                                }}
                            >
                                {dealclass ? (
                                     Object.keys(dealclass).map((key, index) => {
                                        return <Option value={key}>{dealclass[key]}</Option>;
                                    })
                                ) : null}
                            </Select>
                        </div>
                        <div className='costanalysis-search-item width-120'>
                            <Select
                                showSearch
                                placeholder='项目名称'
                                optionFilterProp='children'
                                onSelect={(value) => {
                                    // this.state.searchData1.contractData1 = value;
                                    // this.setState({
                                    //     searchData1: this.state.searchData1
                                    // });
                                }}
                                value={''}
                                onSearch={(value) => {
                                    // if (value.length > 0) {
                                    //     this.resSelectDataFun({
                                    //         url: 'fm/bills/contractcodelist',
                                    //         data: {
                                    //             contractcode: value
                                    //         },
                                    //         selectName: 'contractcodes'
                                    //     });
                                    // }
                                }}
                            >
                                {projectid ? (
                                    Object.keys(projectid).map((key, index) => {
                                        return <Option value={key}>{projectid[key]}</Option>;
                                    })
                                ) : null}
                            </Select>
                        </div>
                        <div className='costanalysis-search-item width-120'>
                            <Refer
                                ctx={'/uitemplate_web'}
                                refModelUrl={'/bd/transtypeRef/'}
                                refCode={'transtypeRef'}
                                placeholder={'交易类型'}
                                refName={'交易类型'}
                                value={''}
                                onChange={(value) => {
                                    // let { refname, refpk, refcode } = value;
                                    // transtypeRefData1.refname = refname;
                                    // transtypeRefData1.refpk = refpk;
                                    // transtypeRefData1.refcode = refcode;
                                    // this.setState({
                                    //     searchData1: this.state.searchData1
                                    // });
                                }}
                                clientParam={{
                                    maincategory: 2 //1234对应投资品种、融资品种、费用项目、银行交易项目
                                }}
                                multiLevelMenu={[
                                    {
                                        name: [ '交易大类' ],
                                        code: [ 'refname' ]
                                    },
                                    {
                                        name: [ '交易类型' ],
                                        code: [ 'refname' ]
                                    }
                                ]}
                            />
                        </div>
                        <div className='costanalysis-search-item width-120'>
                            <DatePicker
                                format={format}
                                onSelect={(d) => {
                                    // this.state.searchData1.dateData1 = d;
                                    // this.setState({
                                    //     searchData1: this.state.searchData1
                                    // });
                                }}
                                value={''}
                                onChange={(d) => {}}
                                locale={zhCN}
                                placeholder='日期'
                            />
                        </div>                       
                        <Button
                            className='search-button costanalysis-search-item'
                            onClick={this.handleSearchClick.bind(this, 'classList')}
                        >
                            查询
                        </Button>
                        <div
                            className='costanalysis-search-item search-reset'
                            onClick={this.handleSearchReset.bind(this, 'classList')}
                        >
                            重置
                        </div>
                    </div>
                    ) : (
                        <div className='costanalysis-search-content'>
                            <div className='costanalysis-search-item width-120'>
                                <Refer
                                    ctx={'/uitemplate_web'}
                                    refModelUrl={'/bd/finbranchRef/'}
                                    refCode={'finbranchRef'}
                                    refName={'金融网点'}
                                    placeholder={'融资机构'}
                                    value={''}
                                    onChange={(value) => {
                                        // let { refname, refpk, refcode } = value;
                                        // finbranchRefData2.refname = refname;
                                        // finbranchRefData2.refpk = refpk;
                                        // finbranchRefData2.refcode = refcode;
                                        // this.state.searchData2.isSearch = false;
                                        // this.setState({
                                        //     searchData2: this.state.searchData2
                                        // });
                                    }}
                                    multiLevelMenu={[
                                        {
                                            name: [ '金融机构' ],
                                            code: [ 'refname' ]
                                        },
                                        {
                                            name: [ '金融网点' ],
                                            code: [ 'refname' ]
                                        }
                                    ]}
                                />
                            </div>
                            <div className='costanalysis-search-item width-120'>
                                <DatePicker
                                    format={format}
                                    onSelect={(d) => {
                                        
                                    }}
                                    value={''}
                                    onChange={(d) => {}}
                                    locale={zhCN}
                                    placeholder='日期'
                                />
                            </div>
                            <Button
                                className='search-button costanalysis-search-item'
                                onClick={this.handleSearchClick.bind(this, 'organList')}
                            >
                                查询
                            </Button>
                            <div
                                className='costanalysis-search-item search-reset'
                                onClick={this.handleSearchReset.bind(this, 'organList')}
                            >
                                重置
                            </div>
                        </div>
                    )}

					<Tabs defaultActiveKey='classList' onChange={this.handleTabChange}>
						<TabPane tab='按项目交易成本分析' key='classList'>
							<div className='fm-costanalysis-table project' style={{overflowY:"scroll"}}>                            
								<Table columns={classColumns} data={classList}/>
							    <div ref="showMoreFlag" className="fm-costanalysis-more">滑动加载更多。。。</div>
							</div>
						</TabPane>
						<TabPane tab='按融资机构成本分析' key='organList'>
							<div className='fm-costanalysis-table'>	
                                <Table                                   
                                    onExpand={this.onExpand}
                                    expandedRowRender={this.expandedOrgRender}
                                    columns={orgColumns}
                                    data={organList}
                                    className="bd-table"
                                    emptyText={() => (
                                        <div>
                                            <img src={nodataPic} />
                                        </div>
                                    )}/>                                
								<div>
									<PageJump
										onChangePageSize={this.handlePageChange}
										onChangePageIndex={this.handlePageIndexChange}
										pageSize={pageSize}
										activePage={pageIndex}
										maxPage={maxPage}
										totalSize={totalSize}
										pageSizeShow={true}
										pageJumpShow={true}
										maxButtons={5}
									/>
								</div>
							</div>
						</TabPane>
					</Tabs>					
				</div>
				
                <div className="fm-costanalysis-more fixed-bottom">
                    <span>编制时间：2017年10月22日</span> &nbsp;&nbsp;&nbsp;&nbsp;
                    <span>编制单位：统计一十四个字符统计</span>
                    <span className="fr">合计：<b className="costanaly-input-strong">98,000,000.000.00</b></span>
                </div>
			</div>
		);
	}
}
