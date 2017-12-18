import React, { Component } from "react";
import {
  Breadcrumb,
  Con,
  Row,
  Col,
  Button,
  Table,
  Icon,
  Modal
} from "tinper-bee";
import Tabs, { TabPane } from "bee-tabs";
import Form from "bee-form";
import FormControl from "bee-form-control";
import Menu, {
  Item as MenuItem,
  Divider,
  SubMenu,
  MenuItemGroup
} from "bee-menus";
import Dropdown from "bee-dropdown";
import { Link } from "react-router";
import DatePicker from "bee-datepicker";
import NoData from "../../../../containers/NoData";
import echarts from "echarts";
import "../../../../utils/utils.js";
import "./index.less";

export default class SideslipModal extends Component {
  static defaultProps = {
    showModal: false,
    columns: [],
    data: []
  };

  constructor() {
    super();
    this.state = {
      showModal: false
    };
  }

  componentDidUpdate() {
    this.paint();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.showModal != this.props.showModal;
  }

  paint = () => {
	const chartData = this.props.chartData;
	if (!chartData || chartData.length == 0) {
		return;
	}
    let data = [];
	let names = [];
	let values = []
	for (let i = 0; i < chartData.length; i++) {
		let up = 'rgba(14,125,218,1)';
		let down = 'rgba(14,125,218,1)';
		if(chartData[i].color){
			const color = chartData[i].color;
			if(Object.prototype.toString.call(color) === "[object Array]"){
			up = color[0];
			down = color[1];
			}else{
				up = color;
				down = color;
			}
		}
		data.push({
			name: chartData[i].name,
			type: "bar",
			barWidth: 30,
			barGap:'120%',
			itemStyle: {
				normal: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0, color: up 
						}, {
							offset: 1, color: down 
						}],
						globalCoord: false 
					},
					barBorderRadius: 0, //圆角 60
					shadowColor: 'rgba(0, 0, 0, 0.1)',
					shadowBlur: 10,
				}
			},
			// label: {
			//     normal: {
			//         show: true,
			//         position: 'top',
			//         formatter: '{c}'
			//     }
			// },
			data: [chartData[i].value]
		});
		names.push({name: chartData[i].name, icon: 'circle'});
		values.push(chartData[i].value);
    }
	const max = Math.max.apply(null, values) * 1.1;
    var myChart = echarts.init(document.getElementById("canvas"));
    var option = {
		title: {
			text: ""
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				// 坐标轴指示器，坐标轴触发有效
				type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			data: names,
			align: "auto",
			orient: 'vertical',
			top: "77%",
			left: "3%",
			textStyle: {
				color: '#666666',
				fontSize: 13
			}
		},
		grid: {
			show: true,
			top: "3%",
			left: "0%",
			right: "0%",
			bottom: "23%",
			containLabel: true,
			borderColor: '#e1e6eb',
			borderWidth: 0.7
		},
		xAxis: [
		{
			show: false,
			type: "category",
			data: [""]
		}
		],
		yAxis: [
		{
			type: "value",
			name: "",
			axisLabel: {
				formatter: "{value}"
			},
			axisLine: {
				show: false
			},
			axisTick: {
				//坐标刻度
				show: false
			},
			axisLabel: {
				show: false,
				inside: true
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#e1e6eb',
					width: 0.7,
					type: 'solid'
				},
			},
			max: max
		}
		],
      series: data
    };
    myChart.setOption(option);
  };

	render() {
		return (
		<Modal
			id="slide-modal"
			show={this.props.showModal}
			size="lg"
			onHide={this.props.close}
			dialogClassName={
			this.props.showModal ? "slide_body slide_in" : "slide_body slide_out"
			}
			backdropStyle={{ background: "rgba(255, 255, 255, 0)" }}
		>
			<Modal.Header closeButton>
			<Modal.Title> 联查 </Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Row>
				<Col xs={3} sm={3} md={3}>
				<div className="canvas-title">{this.props.title}</div>
				<div id="canvas" className="canvas" />
				<div className="canvas-data">
				{this.props.chartData.map((item) => {
					return <div>{Number(item.value).formatMoney(2, "")}</div>
				})}	
				</div>
				</Col>
				<Col xs={9} sm={9} md={9} style={{ paddingLeft: 0 }}>
					<div className="slide-table">
						<Table
							bordered
							columns={this.props.columns}
							data={this.props.tableData}
							emptyText={NoData}
							className="bd-table"
						/>
					</div>
				</Col>
			</Row>
			</Modal.Body>
		</Modal>
		);
	}
}
