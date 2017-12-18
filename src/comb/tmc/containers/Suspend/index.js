import React, { Component } from 'react';
import { Row, Col } from 'tinper-bee';
// import Main from './Main';
// import SideBar from './SideBar';
import './index.less';

class Suspend extends Component {
	static defaultProps = {
		title: '',
		anchor: [],
		style: {},
		container: 'body'
	};
	constructor(props) {
		super(props);
		this.state = {};
	}
	scroll = anchor => {
		document.body.scrollTop = document.body.scrollTop + document.getElementById(anchor).getBoundingClientRect().top;
	};
	render() {
		let { title, children, anchor, style } = this.props;
		return (
			<Row style={{ margin: '0' }} id="suspend">
				<Col xs={10}>{children}</Col>
				<Col xs={2} style={{ position: 'relative' }} ref="col">
					<div className="suspend" style={style} ref="suspend">
						<p>{title}</p>
						<ul className="suspend-list">
							{anchor.map((e, i) => {
								return (
									<li onClick={this.scroll.bind(this, e.anchorId)}>
										{e.name}
										<i>{e.status}</i>
									</li>
								);
							})}
						</ul>
					</div>
				</Col>
			</Row>
		);
	}
	componentDidMount() {
		let that = this;
		let scrollTop = document.getElementById('suspend').offsetTop;
		document.body.onscroll = () => {
			if (document.body.scrollTop >= scrollTop) {
				that.refs.suspend.style.position = 'fixed';
				that.refs.suspend.style.width = '16.6667%';
			} else {
				that.refs.suspend.style.position = 'absolute';
				that.refs.suspend.style.width = '100%';
			}
		};
	}
}

// Suspend.Main = Main;
// Suspend.SideBar = SideBar;
export default Suspend;
