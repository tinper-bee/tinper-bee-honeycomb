import React, { Component } from 'react';
import SingleList from '../../containers/SingleList';


const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
//页面名称
//必须
const name = '项目';
//列表列定义
//必须
const columns = [
	{ title: '序号', dataIndex: 'index', key: 'index', width: 200 },
	{ title: '编码', dataIndex: 'code', key: 'code', width: 300 },
	{ title: '名称', dataIndex: 'name', key: 'name', width: 300 },
	{ title: '项目类型', dataIndex: 'classifyid.refname', key: 'classifyid', width: 300 },
	{ title: '备注', dataIndex: 'remark', key: 'remark', width: 300 }
	//下拉框示例：
	//{ title: "属性", dataIndex: "attr", key: "attr", width: 300 }
];
//浮动窗口列定义
//必须
const modalColumns = [
	{ title: '编码', key: 'code', type: 'string',nullable: 'Y'},
	{ title: '名称', key: 'name', type: 'string',nullable: 'Y' },
	{
		title: '项目类型',
		key: 'classifyid',
		type: 'ref',
		nullable: 'Y',
		ref: { refModelUrl: '/bd/projectClassRef/', refCode: 'projectClassRef', refName: '项目类型' }
	},
	{ title: '备注', key: 'remark', type: 'string' }
	//下拉框示例：
	//{ title: "属性", key: "attr", type: "drop-down", items: [{value: 0, name: "银企联云"}, {value: 1, name: "银企直联"}] }
];

//静态测试数据，可以通过showMockData开关控制是否显示
let res = {
	data: {
		head: {
			rows: []
		}
	},
	message: null,
	success: true
};

const breads = [ { href: '#', value: '首页' }, { href: '#', value: '基础档案' }, { href: '#', value: '项目' } ];
//请求的url
//必须
const rootURL = window.reqURL.bd + 'bd/project/';
const url = {
	search: rootURL + 'search',
	save: rootURL + 'save',
	delete: rootURL + 'del'
};

export default class Project extends Component {
	//子组件必须实现数据加载成功时的数据解析
	handleLoading = (data) => {
		if (data) {
			const head = data.head;
			const newSource = head.rows.map((item, index) => {
				const values = item.values;
				return {
					id: values.id.value,
					code: values.code.value,
					name: values.name.value,
					classifyid: {
						refpk: values.classifyid ? values.classifyid.value : '',
						refname: values.classifyid ? values.classifyid.display : '',
						id: values.classifyid ? values.classifyid.value : ''
					},
					remark: values.description.value,
					ts: values.ts.value
				};
			});
			return newSource;
		}
		return;
	};

	//子组件必须规定请求参数格式
	getParam = (newData, type) => {
		var param;
		const { id, code, name, classifyid, remark, ts } = newData;
		if (type == 'add') {
			param = {
				head: {
					rows: [
						{
							status: 2,
							values: {
								code: { value: code },
								name: { value: name },
								classifyid: { value: classifyid.refpk, display: classifyid.refname },
								description: { value: remark }
							}
						}
					]
				}
			};
			return param;
		}
		if (type == 'edit') {
			param = {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { value: id },
								code: { value: code },
								name: { value: name },
								classifyid: { value: classifyid.refpk, display: classifyid.refname },
								description: { value: remark },
								ts: { value: ts }
							}
						}
					]
				}
			};
			return param;
		}
		if (type == 'del') {
			param = { list: [ id ] };
			return param;
		}
		return param;
	};

	render() {
		var columnMap = {};
		for (var i = 0; i < modalColumns.length; i++) {
			columnMap[modalColumns[i].key] = modalColumns[i].title;
		}
		return (
			<SingleList
				name={name} //页面名称
				breads={breads} //面包屑
				columns={columns} //单表字段定义
				modalColumns={modalColumns} //模态框字段定义
				columnMap={columnMap} //模态框字段的key与value的对应关系，只要输入modalColumns会自动生成
				url={url} //请求url
				onLoadSuccess={this.handleLoading.bind(this)} //子组件必须实现数据加载成功时的数据解析
				requestParam={this.getParam.bind(this)} //子组件必须规定请求参数格式
				res={res} //模拟数据
				showMockData={false} //是否显示模拟数据开关，静态数据测试时打开
			/>
		);
	}
}
