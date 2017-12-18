import React, { Component } from 'react';
import { Breadcrumb, Panel, Button, Row, Col, ButtonGroup } from 'tinper-bee';
import './index.less';
import TransDoc from '../../containers/TransDoc/index';

export default class Transaction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: '1'
		};
	}

	//切换页签
	handelClick = (e, index) => {
		this.setState({
			tab: index
		});
	};

	render() {
		return (
			<div className="transaction-wrapper bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>交易类型</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">交易类型</div>
					<ButtonGroup className="option-tabs">
						<Button
							className={this.state.tab === '1' ? 'tabActive' : 'tab'}
							onClick={(e) => {
								this.handelClick(e, '1');
							}}
						>
							投资品种
						</Button>
						<Button
							className={this.state.tab === '2' ? 'tabActive' : 'tab'}
							onClick={(e) => {
								this.handelClick(e, '2');
							}}
						>
							融资品种
						</Button>
						<Button
							className={this.state.tab === '3' ? 'tabActive' : 'tab'}
							onClick={(e) => {
								this.handelClick(e, '3');
							}}
						>
							费用项目
						</Button>
						<Button
							className={this.state.tab === '4' ? 'tabActive' : 'tab'}
							onClick={(e) => {
								this.handelClick(e, '4');
							}}
						>
							银行交易项目
						</Button>
					</ButtonGroup>
				</div>

				<div className="bd-doc-body">
					<TransDoc key="1" docIndex="1" echo={this.state.tab === '1' ? true : false} />
					<TransDoc key="2" docIndex="2" echo={this.state.tab === '2' ? true : false} />
					<TransDoc key="3" docIndex="3" echo={this.state.tab === '3' ? true : false} />
					<TransDoc key="4" docIndex="4" echo={this.state.tab === '4' ? true : false} />
				</div>
			</div>
		);
	}
}
