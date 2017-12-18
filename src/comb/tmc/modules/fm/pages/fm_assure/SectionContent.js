import React, { Component }  from 'react';
import { Panel } from 'tinper-bee'; 
import jump from 'jump.js';

export default class SectionContent extends Component {

	state = {
		item: this.props.item
	}

	componentDidMount() {
		this.fouse();

	}

	componentDidUpdate() {
		console.log('componentDidUpdate');
		this.fouse();
	}

	fouse() {

		this.state.item.isFouse ? jump(this.sectionEle, {
			duration: 300,
			offset: -50,
			callback: undefined
		}) : null;
	}

	componentWillReceiveProps(nextProp) {
		console.log('nextProp-===---', nextProp);
	    if(nextProp.item.isFouse) {
	      this.setState({item: nextProp.item});
	    }
	  }

    checkForm = (flag,obj) => {
        console.log(flag);
        console.log(obj);
    }

	render() {
		const { item } = this.state;

		return (
				<div className="section-container">
					<section ref={(ele) => { this.sectionEle = ele; }} >
						<Panel >
							<div className="section-title"> { item.label } </div>
							{ item.render() }
						</Panel>
					</section>
				</div>
		);
	}
}


// export default class ScrollFouseTabs extends Component {

// 	state = {
// 		items: this.props.items,
// 		title: '融资申请',
// 		arrs: this.props.items
// 	}

// 	handleTabClick = (e, index, item) => {
// 		console.log(e.target, index, item);
// 		let { arrs } = this.state;
// 		arrs.forEach(function(v, i, a) {
// 			v.isFouse = false;
// 		});
// 		let newItem = arrs[index];
// 		newItem.isFouse = true;
// 		this.setState();
// 	}

// 	checkForm() {
// 		console.log('ScrollFouseTabs => checkForm');
// 	}
// 	render() {
// 		let self = this;
// 		let { arrs } = this.state;

// 		let getSections = () => {
// 				return arrs.map((item, i) => <SectionContent  item={item} />
// 			);
// 		}

// 		let getLis = () => {

// 			return arrs.map((item, i) => { 
// 				return (
// 					<li onClick={ (e)=>{ self.handleTabClick(e, i, item); } } >
// 						<a href="javascript:;">{item.label}</a>
// 					</li>
// 				);
// 			});
// 		} 

// 		return (
// 			<div>
// 				<Affix offsetTop={0} style={{ zIndex: 8000}} >
// 					<div className="tab-header" style={{ zIndex: 8000}} >
// 						<div className="tab-header-left">{ this.state.title }</div>
// 						<div className="tab-header-mid">
// 							<ul>{ getLis() }</ul>
// 						</div>
// 					</div>
// 				</Affix>

// 				{ getSections() }
				
// 			</div>

// 		)
// 	}
// }