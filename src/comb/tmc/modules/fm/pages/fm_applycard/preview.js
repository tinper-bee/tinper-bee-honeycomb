import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import { 
	Row, 
	Col, 	
	Label,
	Radio,
	Checkbox,
	Icon,
	Button,
	Timeline,
	Step,
} from 'tinper-bee';
import Affix from 'bee-affix';
import Table from 'bee-table';
import Form from 'bee-form';
import Switch from 'bee-switch';
import Loading from "bee-loading";
import BreadCrumbs from 'containers/BreadCrumbs';
import ApproveDetail from 'containers/ApproveDetail'
import ApproveDetailButton from 'containers/ApproveDetailButton'
import {toast} from 'utils/utils';
import MsgModal from 'containers/MsgModal';
import Dropdown from 'bee-dropdown';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';

import moment from 'moment';
import axios from "axios";
import jump from 'jump.js';
import Ajax from 'utils/ajax';
import TmcUploader from 'containers/TmcUploader';
import LightTabs from './LightTabs';


import './index.less'
import 'bee-slider/build/Slider.css'
import 'bee-form/build/Form.css'

const FormItem = Form.FormItem;
// 个人项目配置
const CONFIG = {
	ANCHOR : { // 锚节点
		values: ['申请信息', '其他信息'],
		width: 98
	},
	JUMP_CONFIG : { // 滚动条滚动
		offset: 60, // 60为tab的高度
		duration: 300
	},
	OPEN_DOUBLE : false, // 是否开启数据库一个汉字等于两个字节长度
	FORMAT : 'YYYY-MM-DD',
	SERVICE : {
		del: window.reqURL.fm + 'fm/contract/delete', // 后台保存 修改接口
		find: window.reqURL.fm + 'fm/apply/findByPk', // 根据id返回 页面数据
		commit: window.reqURL.fm + 'fm/apply/commit', // 提交
		uncommit: window.reqURL.fm + 'fm/apply/uncommit', // 收回
	},
	DATE_HASH : { // 时间moment
		begindate: true,
		enddate: true
	},
	DISPLAY_MAP: {
		contstatus: ['申请待审批', '申请已审批', '合约待审批', '合约已审批', '合约在执行', '合约已结束', '申请待提交', '合约待提交'], // 合约状态
		vbillstatus: ['待提交', '审批通过', '审批中', '待审批'], // 审批状态			
		guarantee: ['保证', '信用', '保证金','抵押', '质押','混合']	
	},
	SCALE: 2,
	NO_DATA: '暂无'
}

export default class ApplyCardPreview extends Component {
	constructor(){
    	super();

    	this.state = {
    		distance: 0,            
            isClicked: false,
            formData: {
            	contractcode: {
            		value: ''
            	}, // 申请单号
            	financorg: {
            		value: CONFIG.DEFAULT_ORG
            	}, // 融资单位
            	transacttype: {}, // 交易类型
            	fininstitutionid: {}, // 金融机构
            	projectid: {}, // 项目
				fmuseway: {}, // 资金用途
				currtypeid: {
					value: ''
				}, // 币种
				applymny: {
					value: 0
				}, // 申请金额										
				guaranteetype: {
					value: '0'
				}, // 担保方式
				contstatus: {
					value: 6
				}, // 合约状态
				begindate: {
					value: ''
				}, // 起始时间
				enddate: {
					value: ''
				}, // 结束时间
				rateid: {}, // 利率
				returnmode: {}, // 还款方式
				iadate: {}, // 结息日
				bankaccbasid: {}, // 单位账户
				iscreditcc: {
					value: true
				}, // 放款占用授信
				vbillstatus: {
					value: 0
				}, // 审批状态
            },
            chooseIndex: 0,
            showModal: false,            
            loadingShow: false,
            breadcrumbItem: [ 
            	{ href: '#', title: '首页' }, 
            	{ title: '融资申请' },
            	{ title: '贷款申请' }, 
            	{ title: '贷款申请预览' } 
            ],
            tabsActiveKey: null,
            isTransacttype: false,
		    isCreditcc: false,
            otherInfo: [],
            apply_baseinfo: {},
            dataRanks: [],
            dataCredit: []
    	}

    	this.columnsRank = [
	    	{
	    	 	title: "银行类别",
	    	 	dataIndex: "type",
	    	 	key: "type",
	    	 	render: (text, record, index) => {
	    	 		return index > 0
	    	 	 			? <span>代理行</span>
	    	 	 			: <span>参与行</span>
	    	 	}  		
	    	   		 
	    	},
	    	{
	    		title: "银行组织",
	    		dataIndex: "content",
	    		key: "content"
	    	},
	    	{
	    		title: "约定比例",
	    		dataIndex: "conratio",
	    		key: "conratio"
	    	},
	    	{
	    		title: "约定贷款金额",
	    		dataIndex: "confinancmny",
	    		key: "confinancmny"	        
	    	},
	    	{
	    		title: "实际比例",
	    		dataIndex: "practiceratio",
	    		key: "practiceratio"	        
	    	},
	    	{
	    		title: "实际贷款金额",
	    		dataIndex: "practicefinancmny",
	    	  	key: "practicefinancmny"
	      	}
	    ];

	    this.columnsCredit = [
	    	{
	    		title: "授信协议",
	    		dataIndex: "bankprotocolid",
	    		key: "bankprotocolid"
	    	},
	    	{
	    		title: "授信币种",
	    		dataIndex: "cccurrtypeid",
	    		key: "cccurrtypeid",
	    	},	    	
	    	{
	    		title: "授信类别",
	    		dataIndex: "cctypeid",
	    		key: "cctypeid",
	    	},
	    	{
	    		title: "占用授信金额",
	    		dataIndex: "ccamount",
	    		key: "ccamount",
	    	}	    	
	    ];

	    this.formId = null;	    
        this.ts = '';
        this.billtype = '';
        this.tenantid = 'vs1h8do0'
	}

	componentWillMount () {
		var _this = this;
		this.formId = this.props.location.query.id || null
		this.setState({
			loadingShow: true
		},() => {
			this.getFormDataById();
		})	   
	}

	componentDidMount () {		
		this.addListenerScroll()
	}

	componentWillUnmount () {
		this.removeListenerScroll();
	}	
	
	// 滚动条主动滚动事件
	scrollEvent = () => {
		let index = this.getItemIndex();
		this.setScrollBar(index)	
	}

	// 授信和银团
    tagChange = (name, flag) => { 
    	console.log(name)
        let isNameSelected = this.state.otherInfo.indexOf(name) !== -1; // isNameSelected:true 有 false 无        
        if(flag && !isNameSelected) {    	
        	this.state.otherInfo.push(name)
        }else if(!flag && isNameSelected){ 
        	this.state.otherInfo = this.state.otherInfo.filter(item => item !== name)
        }

        let theOne = this.state.otherInfo[0] 
        if(!theOne) { // 都没有那么 没高亮  没表格
        	this.setState({
        		tabsActiveKey: null,
        		isTransacttype: false,
        		isCreditcc: false
        	})
        }else { // 高亮当前 当前表格
        	this.setState({
        		tabsActiveKey: theOne,
        		isTransacttype: this.state.otherInfo.indexOf('transacttype') === -1 ? false : true, 
        		isCreditcc: this.state.otherInfo.indexOf('iscreditcc') === -1 ? false : true
        	})
        }    
    } 

    doVbillstatus = (type) => {	
    	this.setState({
			loadingShow: true
		},() => {
			this.getStatusById(type);
		})
    }

    getStatusById = (type) => {
    	const _this = this;
    	const paramsData = {
		    "data": {
		        "apply_baseinfo": {
		            "pageinfo": null,
		            "rows": [
		                {
		                    "values": {
		                        "tenantid": {
		                            "value": this.tenantid
		                        },
		                        "id": {
		                            "value": this.formId
		                        },
		                        "ts": {
		                            "value": this.ts
		                        }
		                    }
		                }
		            ]
		        }
		    }
		}
    	const params = {
    		commit: {
    			url: CONFIG.SERVICE.commit,
    			data: paramsData
    		},
    		uncommit: {
    			url: CONFIG.SERVICE.uncommit,
    			data: paramsData
    		}
    	}

    	Ajax({
            ...params[type],
            success: function(res) {
                const { data, message, success } = res;
                if (success) {
                    toast({content: '操作成功...', color: 'success'});  
			        _this.setState({
		    			loadingShow: false
		    		},() => {
	        			_this.nextEdit(data);
		    		})          
                } else {
                    toast({content: message.message, color: 'warning'});
                    _this.setState({
						showModal: false
                    });
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            }
        });
    }

    renderVbillstatus = () => {
    	let {formData} = this.state;
    	if(formData && formData.vbillstatus) {
    		console.log(formData.vbillstatus)
    		if(formData.vbillstatus.value == 0) {
				return (<MenuItem ><Button  className="u-button-info u-button-border" onClick={this.doVbillstatus.bind(this, 'commit')}>提交</Button></MenuItem>) 
			}else if(formData.vbillstatus.value == 3) {
				return (<MenuItem ><Button  className="u-button-info u-button-border" onClick={this.doVbillstatus.bind(this, 'uncommit')}>收回</Button></MenuItem>) 
			} 
    	}
    	return;	    	
    }

    changeKey = (tabsActiveKey) => {
    	console.log(tabsActiveKey)
		this.setState({
			tabsActiveKey
		})
	}

	getFormDataById = () => {
		var _this = this;
		axios.post(CONFIG.SERVICE.find,{
			id: this.formId
		}).then(function(res) {
	    	var {data, success} = res.data;
	    	if(success) {
	    		_this.setState({
	    			loadingShow: false
	    		},() => {
        			_this.nextEdit(data);
	    		})
	    	} 
	    	
	    })
	}

	renderTemplate = (temp, tempRanks, tempCredit) => {
		// console.log(temp, tempRanks, tempCredit)
		this.setState({
			formData: temp,
			dataRanks : tempRanks,
			dataCredit: tempCredit
		},() => {
			let iscreditccFlag = !temp.iscreditcc.value, 
				transacttypeFlag = temp.transacttype.display &&  (temp.transacttype.display === '银团贷款');
			setTimeout(() => {
				this.tagChange('iscreditcc', iscreditccFlag)
				this.tagChange('transacttype', transacttypeFlag)
			}, 0)
		})
	}

	nextEdit = (data) => {	
		this.ts = data.apply_baseinfo.rows[0].values.ts && data.apply_baseinfo.rows[0].values.ts.value;
		this.billtype = data.apply_baseinfo.rows[0].values.billtype && data.apply_baseinfo.rows[0].values.billtype.value;	
		
		let temp = data.apply_baseinfo.rows[0].values;
		var tempRanks = [], tempCredit = [];
		temp.applymny.value = this.transToFiexd(temp.applymny.value, CONFIG.SCALE);		

		let temp2 = (data.apply_syndicatedinfo && data.apply_syndicatedinfo.rows) || []
		let temp3 = (data.apply_authinfobiz && data.apply_authinfobiz.rows) || []
		// console.log(temp2, temp3)
		if(temp2.length) {
			tempRanks = temp2.map((item, index) => {
				return {
					key: index,
		        	type: index > 0 ? '参与行' : '代理行',
		        	content: index > 0 ? (item.values.finanparticipate && item.values.finanparticipate.display) : (item.values.financagency && item.values.financagency.display),
		        	conratio: item.values.conratio && this.transToFiexd(item.values.conratio.value, CONFIG.SCALE),
		        	confinancmny: item.values.confinancmny && this.transToFiexd(item.values.confinancmny.value, CONFIG.SCALE),
		        	practiceratio: item.values.practiceratio && this.transToFiexd(item.values.practiceratio.value, CONFIG.SCALE),
		        	practicefinancmny: item.values.practicefinancmny && this.transToFiexd(item.values.practicefinancmny.value, CONFIG.SCALE),
				}
			})
		}

		if(temp3.length) { 
			tempCredit = temp3.map((item, index) => {
				return {
					key: index,
					bankprotocolid: item.values.bankprotocolid && item.values.bankprotocolid.display,
					cccurrtypeid: item.values.cccurrtypeid && item.values.cccurrtypeid.display,
				    cctypeid: item.values.cctypeid && item.values.cctypeid.display,
				    ccamount: item.values.ccamount && this.transToFiexd(item.values.ccamount.value, CONFIG.SCALE)
				}
			})
		}			
		
		this.renderTemplate(temp, tempRanks, tempCredit)
	}

	// 获得区域的序号
	getItemIndex = () => {
		let scrollTop = this.getScrollTop(),		
			firstTop = this.refs.anchor1.offsetTop,
			fixedTop = scrollTop  + CONFIG.JUMP_CONFIG.offset;		
		let [heightPrev, heightNext] = new Array(2).fill(0);
		const LEN = CONFIG.ANCHOR.values.length;

		for(let i = 0; i < LEN; i++) {
			heightPrev = this.refs[`anchor${(i + 1)}`].offsetTop;				
			heightNext = (i <= LEN - 2) ? this.refs[`anchor${(i + 2)}`].offsetTop : null;

			if(fixedTop <= firstTop) {
				return 0;
			}
			if(heightPrev <= fixedTop && (heightNext && heightNext > fixedTop)) {
				return i;
			}else if(!heightNext) {
				return (LEN - 1)
			}			
		}		
	}

	// 获取滚动条位置
	getScrollTop = () => {
		return document.body.scrollTop || document.documentElement.scrollTop
	}

	// 监听滚动
	addListenerScroll = () => {	
		window.addEventListener('scroll', this.scrollEventDo ,false)				
	}

	// 取消监听滚动
	removeListenerScroll = () => {
		console.log('-----取消监听-----')
		window.removeEventListener('scroll', this.scrollEventDo, false)
	}

	// 点击滚动到位置
	scrollToDis = (e) => {
		let text = e.target.innerHTML;
		this.state.isClicked = true;
		if(!text) {
			return;
		}
		let index = CONFIG.ANCHOR.values.findIndex(value => value == text)
		if(index >= 0){
			this.setScrollBar(index)
			this.scrollToAnchor(index)
		}		
	}

    // 滚动条滚到指定区域
	scrollToAnchor = (index) => {
		let ele = this.refs[`anchor${index + 1}`]
		let _this = this;
		jump(ele, {
			duration: CONFIG.JUMP_CONFIG.duration,
			offset: - CONFIG.JUMP_CONFIG.offset,
			callback: () => {
				_this.state.isClicked = false;
			}
		})
	}

	// 设置tab中tabBar位置
	setScrollBar = (index) => {
		let distance = parseInt(index * CONFIG.ANCHOR.width);
		this.setState({
			distance,
			chooseIndex: index
		})
	}

	transToFiexd = (number, n) => {
		number = number.toString()
		if(number) { // number === 0 那么false 走else语法
			number = Math.round(number * Math.pow(10, n))/ Math.pow(10, n);
			if(`${number}`.indexOf(".") == -1){
				number = number + ".";
				for (let i = 1; i <= n; i++) {
					number = number + "0";
				}
			}			
			let numberInt = `${number}`.split('.')[0];
			let re = /(-?\d+)(\d{3})/; 
			while(re.test(numberInt)){ 
				numberInt = numberInt.replace(re,"$1,$2") 
			}
			console.log(number , numberInt, `${numberInt}.${number.toString().split('.')[1]}`)
			return `${numberInt}.${number.toString().split('.')[1]}`; 			
		}else {
			return 0
		}		
	}

	doAction = (type) => {
		console.log(type)
		switch (type) {
			case 'edit' : 
				this.formId && hashHistory.push(`/fm/applycard?type=edit&id=${this.formId}`);
				break;
			case 'delete' : 
				this.formId && this.setState({showModal: true});
				break;
			case 'more' : 
				this.handleMore();
				break;
			default: 
				break;

		}
	}

	handleDelete = () => {
        const _this = this;
        Ajax({
            url: CONFIG.SERVICE.del,
            data: {
                id: _this.formId,
                billtype: _this.billtype,
                ts: _this.ts
            },
            success: function(res) {
                const { data, message, success } = res;
                if (success) {
                    toast({content: '删除成功...', color: 'success'});
                    setTimeout(() => {
						hashHistory.push('fm/apply');
					}, 0)
                } else {
                    toast({content: message.message, color: 'warning'});
                    _this.setState({
						showModal: false
                    });
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            }
        });
	}

	onSelect = (key) => {
		console.log(key)
	}

	render () {
		const columns = this.columns;
		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1
		let processInstanceId = this.props.location.query.processInstanceId 
		
		var { 
			distance, 
			dataRanks, 
			formData, 
			chooseIndex, 
			breadcrumbItem, 
			tabsActiveKey, 
			dataCredit, 
			isTransacttype, 
			isCreditcc,
		} = this.state;

		let apply_baseinfo = formData;
		console.log(formData, dataRanks , dataCredit)

		
		// console.log(dataRanks,dataCredit,apply_baseinfo)

	    const tranStyle = {
	    	transform: `translate3d(${distance}px,0,0)`,
	    	webkitTransform: `translate3d(${distance}px,0,0)`,
	    	mozTransform: `translate3d(${distance}px,0,0)`
	    }

	    const tabsOther = [
			{
				key: 'transacttype',
				isShow: isTransacttype,
				label: '银团',
				render: () => {
					return (
						<section className="ranks-head">
							<h5>
								<span className="ranks-title">银团贷款</span>								
							</h5>								
							<Table 
		                		data={dataRanks}
		                		columns={this.columnsRank}/>	
						</section>  
					)
				}
			},{
				key: 'iscreditcc',
				isShow: isCreditcc,
				label: '授信',
				render: () => {
					return (
						<section className="ranks-head">
							<h5>
								<span className="ranks-title">授信信息</span>							
							</h5>								
							<Table 
		                		data={dataCredit}
		                		columns={this.columnsCredit}/>	
						</section>  
					)
				}
			}
		];

	    const moreItems = (
            <Menu  onSelect={this.onSelect} multiple className='btn-more-dropdown'>
                <MenuItem ><ApproveDetailButton processInstanceId={processInstanceId} /></MenuItem>		
                { this.formId && <MenuItem ><TmcUploader billID = {this.formId} /></MenuItem> }	
				{ this.renderVbillstatus() }				
            </Menu>
        );

		return (
			<div>	
				<BreadCrumbs items={breadcrumbItem} />
				{ isApprove && <ApproveDetail processInstanceId={processInstanceId } /> }
				<section className="financeApp-form">
		    		<Affix>
			    		<h3 className="financeApp-title">
			    			<span className="financeApp-title-item title">贷款申请</span>
			    			<ul className="financeApp-tab cf" onClick={this.scrollToDis}>
			    				{
			    					CONFIG.ANCHOR.values.map((item, index) => {
			    						return (<li className={index == chooseIndex? 'active' : ''}>{item}</li>)
			    					})
			    				}
			    				<li className="scrollBar tabs-nav-animated" ref="navBar" style={tranStyle}></li>
			    			</ul>
			    			<div className="financeApp-title-item">	
			    				{ !isApprove && (<div>		    			
				    				<Dropdown
						                    trigger={['click']}
						                    overlay={ moreItems }
						                    overlayClassName="apply-card-drop"
						                    animation="slide-up">
					                    <Button colors="info" className="fr u-button-info u-button-border mgr20" >更多</Button>
					                </Dropdown>
				    				{apply_baseinfo.vbillstatus.value == 0 && (<span>
				    					<Button colors="info" className="fr u-button-info u-button-border" onClick={this.doAction.bind(this,'delete')}>删除</Button>
				    					<Button colors="info" className="fr" onClick={this.doAction.bind(this,'edit')}>编辑</Button>
				    					</span>
				    				)}			    			
				    			</div>)
				    			}
			    			</div>			    			
			    		</h3>
		    		</Affix>

		    		<section  className="financeApp-info" >
		    			<ul className="financeApp-info-section"  ref="anchor1">
		    				<li className="financeApp-info-title blockClass">申请信息</li>
			                <Form useRow={true} 
			                	showSubmit={false}
			                	>				                	
			                	<FormItem inline={true} labelMd={2} md={10} 
			                		labelName="申请单号："
			                		labelClassName="require">
									<span>{apply_baseinfo.contractcode.value}</span>			                        
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
			                    	labelName="交易类型："  
			                    	labelClassName="require" >			                    	
			                    	<span>{apply_baseinfo.transacttype.display}</span>
								</FormItem>			                       
			                    <FormItem inline={true} labelMd={2} md={4} 
			                    	labelName="借款单位："  
			                    	labelClassName="require" >
			                        <span>{apply_baseinfo.financorg.value}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
			                    	labelName="贷款机构："
			                    	method="blur" 
			                    	labelClassName="require" >
			                        <span>{apply_baseinfo.fininstitutionid.display}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
			                    	labelName="项  &nbsp;&nbsp; 目：">
			                       <span>{apply_baseinfo.projectid.display || CONFIG.NO_DATA}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={10} 
				                    labelName="资金用途：" >
				                    <div className="u-textarea-wrap preview">{apply_baseinfo.fmuseway.display || CONFIG.NO_DATA}</div>
			                    </FormItem>			              	
			                	<FormItem inline={true} labelMd={2} md={4} 
				                	labelName="币   种："   
				                	labelClassName="require">
			                        <span>{apply_baseinfo.currtypeid.display}</span>
			                    </FormItem>		                	
			                	<FormItem inline={true} labelMd={2} md={4} 
				                	labelName="申请金额："  
				                	labelClassName="require">
				                	<span className="input-strong">{apply_baseinfo.applymny.value}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="担保方式：" 
				                    labelClassName="require">
				                    <span>{(CONFIG.DISPLAY_MAP.guarantee[apply_baseinfo.guaranteetype.value])}</span>                        
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="合同状态：" >
				                   <span>{(CONFIG.DISPLAY_MAP.contstatus[apply_baseinfo.contstatus.value])}</span>                        
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
			                    	labelName="起始日期：" 
			                    	labelClassName="require">
			                        <span>{apply_baseinfo.begindate.value}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="结束日期："  
				                    labelClassName="require" >
			                        <span>{apply_baseinfo.enddate.value}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="利 &nbsp;&nbsp;  率：" 
				                    labelClassName="require" >
				                    <span>{apply_baseinfo.rateid.display}</span>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="还款方式："
				                    labelClassName="require">
				                    <span>{apply_baseinfo.returnmode.display}</span>
			                    </FormItem>	
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="结 息 日：" 
				                    labelClassName="require" >
				                    <span>{apply_baseinfo.iadate.display || CONFIG.NO_DATA}</span>
			                    </FormItem>	
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="借款单位账户：">
				                    <span>{apply_baseinfo.bankaccbasid.display  || CONFIG.NO_DATA}</span>
			                    </FormItem>	
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="放款占用授信：">
			                        <Switch  name="creditcc" 
				                        checked={apply_baseinfo.iscreditcc.value}
				                        className="apply-preview"
				                        disabled={true}
				                        checkedChildren={'√'} unCheckedChildren={'X'} />
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4} 
				                    labelName="审批状态：">	
				                    <span>{(CONFIG.DISPLAY_MAP.vbillstatus[apply_baseinfo.vbillstatus.value])}</span>
			                    </FormItem>			                    
			                </Form>	
		                </ul>		                
		                <ul className="financeApp-info-section"  ref="anchor2">
		                	<li className="financeApp-info-title blockClass other-info" >其他信息</li>
		                	<LightTabs activeKey={ tabsActiveKey }  tabs={tabsOther} handleTypeChange={this.changeKey}/>		                	  	
		                </ul>
		    		</section>
		    	</section>

		    	<MsgModal show={this.state.showModal}
				    title='是否删除此条申请?'
				    icon='icon-tishianniuzhuyi'
				    content='删除申请'
				    onCancel={() => {
				    	this.setState({
					    	showModal: false
					    })
				    }}
				    onConfirm={this.handleDelete} /> 
				<Loading fullScreen show={this.state.loadingShow} loadingType={'line'}/>
			</div>
			    
		);
	}
}


