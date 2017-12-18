import React, { Component } from 'react';
import Tabs, { TabPane } from 'bee-tabs';
// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
// 引入折线图。
import 'echarts/lib/chart/line';
// 引入饼状图
import 'echarts/lib/chart/pie';
// 引入散点气泡图
import 'echarts/lib/chart/scatter';
// 引入带有涟漪特效动画的散点（气泡）图
import 'echarts/lib/chart/effectScatter';
// 引入雷达图
import 'echarts/lib/chart/radar';
// 引入树图
import 'echarts/lib/chart/tree';
// 引入K线图
import 'echarts/lib/chart/candlestick';
// 引入地图
import 'echarts/lib/chart/map';
// 引入提示框组件、标题组件、工具箱组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import './index.less';
export default class Charts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey: '1',
			options: [],
			tabChange: undefined
		};
	}
	onChange = (activeKey) => {
		let { options, tabChange } = this.state;
		const _this = this;
		if (tabChange) {
			tabChange(activeKey);
			this.setState({
				activeKey
			});
		} else {
			this.setState(
				{
					activeKey
				},
				() => {
					// 基于准备好的dom，初始化echarts实例
					let myChart = echarts.init(document.getElementById(options[activeKey - 1].id));
					// 绘制图表
					myChart.setOption(options[activeKey - 1].chartsData);
				}
			);
		}
	};
	componentWillReceiveProps(nextProps) {
		let { activeKey } = this.state;
		let myChart = echarts.init(document.getElementById(nextProps.options[activeKey - 1].id));
		// 绘制图表
		myChart.setOption(nextProps.options[activeKey - 1].chartsData);
	}

	componentDidMount() {
		let { options } = this.state;
		// 基于准备好的dom，初始化echarts实例
		let myChart = echarts.init(document.getElementById(options[0].id));
		// 绘制图表
		myChart.setOption(options[0].chartsData);
	}

	componentWillMount() {
		this.setState({
			tabChange: this.props.tabChange,
			options: this.props.options
		});
	}

	render() {
		let { options } = this.state;
		return (
			<div className='tmc_charts_content'>
				<Tabs
					activeKey={this.state.activeKey}
					tabBarPosition='left'
					defaultActiveKey='1'
					onChange={this.onChange}
					style={{ height: 352 }}
				>
					{options.map((item, index) => {
						return (
							<TabPane tab={item.tab} key={index + 1}>
								<div className='tab_charts_content' id={item.id} />
							</TabPane>
						);
					})}
				</Tabs>
			</div>
		);
	}
}
