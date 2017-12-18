import React, { Component } from 'react';
import {
	Breadcrumb,
	Con,
	Row,
	Col,
	Dropdown,
	Button,
	Table,
	Icon,
	FormControl,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	InputGroup
} from 'tinper-bee';
import Demo from './index.js';

export default class BdTest extends Component {
	constructor() {
		super();
		this.state = {}
	}
	editDone = (type, index, text, record, e) => {
		this.refs.demo.editDone(type, index, text, record, e)
	}
	render() {
		const props = {
			columns: [
				{ title: '序号', dataIndex: 'index', key: 'index', width: 100 },
				{ title: '编码', dataIndex: 'code', key: 'code', width: 200 },
				{ title: '名称', dataIndex: 'name', key: 'name', width: 200 },
				{ title: '创建人', dataIndex: 'creator', key: 'creator', width: 200 },
				{
					title: '创建时间',
					dataIndex: 'createdTime',
					key: 'createdTime',
					width: 200
				},
				{
					title: '操作',
					dataIndex: 'operation',
					key: 'operation',
					width: 200,
					render: (text, record, index) => {
						return (
							<div>
								<Icon
									className="iconfont icon-bianji icon-style"
									onClick={(e) => this.editDone('edit', index, text, record, e)}
								/>						
							</div>
						);
					}
				}
			],
			breads: [ 
	        	{ href: '#', title: '首页' }, 
	        	{ title: '基本档案' },
	        	{ title: '授信类别' }
	        ],
	        title: '授信类别',
	        modalData: [
	        	{
	        		name: '编码',
	        		type: 'formControl',
	        		data: null,
	        	},
	        	{
	        		name: '名称',
	        		type: 'select',
	        		data: ['银企直联', '银企联云'],
	        	}
	        ],
	        mapDataSource: {
	        	code: 'value',
	        	name: 'value',
	        	creator: 'display',
	        	creationtime: 'value'
	        },
	        searchUrl: window.reqURL.bd + 'bd/cctype/search',
	        deleteUrl: window.reqURL.bd + 'bd/cctype/delete',
	        saveUrl: window.reqURL.bd + 'bd/cctype/save',
	        handleDel: this.editDone,
	        mapSave: {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { 
									value: '' 
								},
								code: { 
									value: '' 
								},
								name:  { 
									value: '' 
								},
								ts:  { 
									value: '' 
								}
							}
						}
					]
				}
	        }
		}	

		return (
			<div>
				<Demo ref="demo"  {...props}/>
			</div>
		)
	}	
}