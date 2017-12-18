import React, { Component } from 'react';
import {Table, Icon} from 'tinper-bee';
import {Ajax, URL} from '../index';
import { toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import './index.less';

export default class ChangeRecord extends Component {
	constructor() {
		super();
		this.state = {
			dataList: [],
		};
	}

	componentWillReceiveProps (nextProps) {
		if (JSON.stringify(nextProps.details)!== '{}' && nextProps.show) {
			this.getChangeRecordList(nextProps.details);
		}
	}

	componentDidMount() {
		document.body.addEventListener('click', this.queryHidden);
	}
	
	//获取列表数据
	getChangeRecordList = details => {
		const _this = this;
		Ajax({
			url: URL + 'pass/settlement/history',
			data:{ data: { head: { rows: [ { values: details } ] } } },
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		}); 
	};

	//关闭更多查询, 变更记录
	queryHidden = e => {
		let { show, hidden }= this.props;
		if (show) {
			let target= document.getElementById('change-record');
			let btn= document.getElementById('settle-change-btn');
			let len= e.path.findIndex((item) => item=== target);
			let btnlen= e.path.findIndex((item) => item=== btn);
			if (len < 0 && btnlen < 0) {//不在变更记录按钮和弹框区域时，自动隐藏弹框
				hidden();
			}
		}
	};

	render() {
		let { dataList, isShow } = this.state;
		let { show, hidden }= this.props;
		let columns= [
			{ 
				title: '版本号', 
				key: 'version', 
				dataIndex: 'version', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.version.display || record.version.value || '—'}</div>
					);
				} 
			},
			{ 
				title: '事件/事件号', 
				key: 'srctranevent', 
				dataIndex: 'srctranevent', 
				width: '20%',
				render: (text, record) => {
					return (
						<div>
							<span>{record.srctranevent.display || record.srctranevent.value || '—'}</span>
                            <br/>
                            <span>{record.eventno.display || record.eventno.value || '—'}</span>
						</div>
					);
				}  
			},
			{ 
				title: '本方账户/户名', 
				key: 'recaccname', 
				dataIndex: 'recaccname', 
				width: '20%',
				render: (text, record) => {
					let type= record.transtype.display || record.transtype.value || 0;
					return (
						<div>
							<span>{type== 0 ? (record.recaccnum.display || record.recaccnum.value || '—') : (record.payaccnum.display || record.payaccnum.value || '—')}</span>
							<br/>
							<span>{type== 0 ? (record.recaccname.display || record.recaccname.value || '—') : (record.payaccname.display || record.payaccname.value || '—')}</span>
						</div>
					);
				}  
			},
			{ 
				title: '结算方式', 
				key: 'balatypename', 
				dataIndex: 'balatypename', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.balatypename.display || record.balatypename.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '摘要', 
				key: 'memo', 
				dataIndex: 'memo', 
				width: '20%',
				render: (text, record) => {
					return (
						<div>{record.memo.display || record.memo.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '用途', 
				key: 'nusage', 
				dataIndex: 'nusage', 
				width: '20%',
				render: (text, record) => {
					return (
						<div>{record.nusage.display || record.nusage.value || '—'}</div>
					);
				}  
			}
		];
		
		return (
			<div id='change-record' className={show ? 'show' : ''}>
				<div className='change-record-title'>
					<span>变更记录</span>
					<Icon 
						className='iconfont icon-cela'
						onClick={() => {hidden();}}
					></Icon>
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
			</div>
		);
	}
}