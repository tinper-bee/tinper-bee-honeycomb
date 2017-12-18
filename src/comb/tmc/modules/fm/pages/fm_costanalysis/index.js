import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, InputGroup, FormControl } from 'tinper-bee';
import moment from 'moment';
import BreadCrumbs from 'containers/BreadCrumbs';
import Tabs, { TabPane } from 'bee-tabs';
import PageJump from 'containers/PageJump';
import Table from 'bee-table';
import Select from 'bee-select';
import Refer from 'containers/Refer';
import Icon from 'bee-icon';
import Button from 'bee-button';
import Upload from 'bee-upload';
import Ajax from 'utils/ajax.js';
import nodataPic from '../../../../static/images/nodata.png';
import { clearInterval } from 'timers';
import deepClone from '../../../../utils/deepClone.js';

import './index.less';
import {orgData, tableData} from './ajaxData.js'

const { ColumnGroup, Column } = Table;
const URL = window.reqURL.fm;
const format = 'YYYY-MM-DD';
const toDay = moment().format(format);
// 列表表头显示列信息

const CONFIG = {
	SERVICE: {
		getOrgan: window.reqURL.fm + 'fm/financing/organalyze',
        getClass: window.reqURL.fm + 'fm/financing/classanalyze',
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

const columnsProgram = [
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

const columnsOrg = [
    { title: '序号', key: 'index', dataIndex: 'index', width: 10},
    { title: '融资机构', key: 'financecorpid', dataIndex: 'financecorpid', width: 200},      
    { title: '综合资金成本', key: 'compositecost', dataIndex: 'compositecost', width: 100},
    { title: '加权平均融资成本', key: 'compositeloancost', dataIndex: 'compositeloancost', width: 100},
];

const columnsOrgChildren = [
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
            tabIndex: 'organList', // 当前选中的tab标签
            tabParams: {
                'organList': {
                    url: CONFIG.SERVICE.getOrgan,
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
                    success: this.organCallBack
                },
                'classList': {
                    url: CONFIG.SERVICE.getClass,
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
                    success: this.classCallBack
                }
            },
            organList: [],
            classList: [],			
			
			pageIndex: 0,//当前页
			pageSize: 10,//每页显示几条
			keyWords: '',
            maxPage: 20,
            totalSize: 120,
            showMoreText:'滑动加载更多。。。'
            
		};

		this.breadcrumbItem = [ 
			{ href: '#', title: '首页' }, 
			{ title: ' 融资交易' }, 
			{ title: '融资成本分析' } 
        ];
        
        this.isAjax = false;
        this.beforeData={};

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
         window.addEventListener('scroll', this.scrollEventDo ,false)
    }
    scrollEventDo=()=>{
        //元素距离浏览器视口顶部距离
        let showMoreFlagDis = this.refs.showMoreFlag.getBoundingClientRect().top;
        //视口高度
        let clientHeight =  document.body.clientHeight;
        if(showMoreFlagDis + 100 < clientHeight){//当滑动到文档底部
            // console.log('继续加载中。。。')
            this.setState({
                pageIndex:this.state.pageIndex+1
            })
            let flag = this.lingshiAjax('organList');
            if(!flag){
                this.removeListenerScroll();
                this.setState({
                    showMoreText:'我是有底线的！'
                })
            } 
        }
    }

    componentWillUnmount () {
		this.removeListenerScroll();
    }
    // 取消监听滚动
	removeListenerScroll = () => {
		window.removeEventListener('scroll', this.scrollEventDo, false)
	}


    lingshiAjax = (tabIndex) => {
        if(tabIndex === 'organList') {
            let flag = this.organCallBack();
            return flag;
        }else if(tabIndex === 'classList') {
            this.classCallBack();
        } 
    }

    organCallBack = (res) => {
        // console.log(res)
        // let {data, success} = res;        
        
        let data = this.ajaxData(this.state.pageIndex, this.state.pageSize, tableData);
        //合并请求回来的数据
        if(data.head.rows.length>0){
            if(this.beforeData.head){
                let dataArr = this.beforeData.head.rows.concat(data.head.rows);
                this.beforeData={
                    head:{
                        pageinfo:data.head.pageinfo,
                        rows:dataArr
                    }
                }
            }else{
                this.beforeData = data;
            }
            this.getDataByIndex(this.beforeData, 'organList')
            return true;
        }
        return false;
    }

    classCallBack = (res) => {
        console.log(res)
        // let {data, success} = res;
        // TODO 查看 data是否给对了。。
        // 
        let data = this.ajaxData(this.state.pageIndex, this.state.pageSize, orgData)   
        let flag = this.getDataByIndex(data, 'classList')
        return flag;
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
            dist['key'] = `key${this.state.pageIndex}${index}`
            dist['index'] = this.getIndex(obj)
			return dist;
        })
        this.numberIndex = 0;
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
        console.log(key)
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

    expandedRowRender = (record, index) => {
        let dataChildren = tableData.data.head.rows.map(item => {
            return item.values
        });
        return (
            <Table
                emptyText={() => <span>暂无记录</span>}
                columns={columnsOrgChildren}
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
            showMoreText
        } = this.state;	
        
        //console.log(this.state.organList)

        return (
			<div className='fm_costanalysis'>
				<BreadCrumbs items={this.breadcrumbItem} />
					
				<div  className="costanalysis-header">
					<Tabs defaultActiveKey='organList' onChange={this.handleTabChange}>
						<TabPane tab='按项目交易成本分析' key='organList'>
							<div className='fm-costanalysis-table project'>                            
								<Table columns={columnsProgram} data={organList}/>
							    <div ref="showMoreFlag" className="fm-costanalysis-more">{showMoreText}</div>
							</div>
						</TabPane>
						<TabPane tab='按融资机构成本分析' key='classList'>
							<div className='fm-costanalysis-table'>	
                                <Table                                   
                                    onExpand={this.onExpand}
                                    expandedRowRender={this.expandedOrgRender}
                                    columns={columnsOrg}
                                    data={classList}
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
