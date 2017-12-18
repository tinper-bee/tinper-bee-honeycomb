import React, { Component } from 'react';
import jump from 'jump.js';


const CONFIG = {
	// 锚节点
	ANCHOR : {
		values: ['申请信息', '其他信息'], // 锚节点的引导文字
		width: 98 // 锚节点tab的宽度
	},
	// 滚动条滚动设置
	JUMP_CONFIG : {
		offset: 60, // 60为悬浮高度
		duration: 300 // 滚动duration配置
	}
}

export default function renderTabBar(ChildrenComponent) {
	return class HOC extends Component {
		constructor(){
	    	super();

	    	this.state = {
	    		distance: 0, // tabBar移动距离
	    		isClicked: false, // tab锚点点击标志位
            	chooseIndex: 0, // tab锚点点击序号
	    	}
	    }

	    componentWillMount() {

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
			window.removeEventListener('scroll', this.scrollEventDo, false)
		}

		// 执行滚动事件
		scrollEventDo = () => {
			if(!this.state.isClicked) {
				this.scrollEvent()
			}		
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

	    setScrollBar = (index) => {
			let distance = parseInt(index * CONFIG.ANCHOR.width);
			this.setState({
				distance,
				chooseIndex: index
			})
		}

		render() {
			
		    const newProps = {
		    	tranStyle: {
			    	transform: `translate3d(${distance}px,0,0)`,
			    	webkitTransform: `translate3d(${distance}px,0,0)`,
			    	mozTransform: `translate3d(${distance}px,0,0)`
			    },
			    scrollToDis: this.scrollToDis,
			    anchorValues: CONFIG.ANCHOR.values
		    }

			return (
				<div>
					<ChildrenComponent {...newProps} />
				</div>				
			)
		}
	}
}

