import React, { Component } from 'react';
import { Button, Table, Input, Select, DateRender, Icon, Checkbox, Popconfirm } from 'tinper-bee';
import './index.less';

// import InputRender                    "../../src/render/InputRender.js";
// import DateRender                    "../../src/render/DateRender.js";
// import SelectRender                    "../../src/render/SelectRender.js";

export default class TableComp extends Component {
	constructor() {
		super();
		this.state = {
			tableData: []
		};
	}

	getColumns() {}

	render() {
		const { tableData } = this.props;
		return <Table className='table-detail' columns={columns} data={tableData} emptyText={() => '暂无数据'} />;
	}
}
