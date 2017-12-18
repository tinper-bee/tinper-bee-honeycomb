import React, { Component } from 'react';
import { FormControl, Pagination, Select, Button } from 'tinper-bee';
import './index.less';
import { toast } from '../../utils/utils.js';

export default class PageJump extends Component {
	static defaultProps = {
		pageSize: 10,
		activePage: 1,
		pageSizeShow: true,
		pageJumpShow: true,
		maxButtons: 5,
		maxPage: 1, 
		totalSize: 0
	};

	constructor(props) {
		super(props);

		this.state = {
			page: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.maxPage!== this.props.maxPage && nextProps.totalSize>= 10) {
			setTimeout(() => {
				let pageJumpLi= document.querySelectorAll('.page-jump .pagination li');
				pageJumpLi[0].getElementsByTagName('span')[0].innerHTML=`<Icon class='iconfont icon-xiangzuo'/>`;
				pageJumpLi[pageJumpLi.length-1].getElementsByTagName('span')[0].innerHTML=`<Icon class='iconfont icon-xiangyou'/>`;
			}, 100)
		}
	}
	
	render() {
		let { pageSize, activePage, pageSizeShow, pageJumpShow, maxButtons, maxPage, totalSize}= this.props;
		let { page }= this.state;
		return <div className="page-jump bd-footer">
			<div className="pageSize" style={{display: pageSizeShow ? 'block' : 'none'}}>
				<Select
					value={pageSize}
					style={{ width: 85, marginRight: 10 }}
					onSelect={(val) => {this.props.onChangePageSize(Number(val))}}
				>
					<Option value={10}>10条/页</Option>
					<Option value={20}>20条/页</Option>
					<Option value={50}>50条/页</Option>
					<Option value={100}>100条/页</Option>
				</Select>
				共 {totalSize} 条
			</div>
			{totalSize>= 10 ?
				<div className="pagination">
					<Pagination
						prev
						next
						boundaryLinks
						items={maxPage}
						maxButtons={maxPage> 10 ? maxButtons : maxPage}
						activePage= {activePage}
						onSelect= {(val) => {this.props.onChangePageIndex(Number(val));}}
					/>
					<span className="toPage" style={{display: pageJumpShow && maxPage> 10 ? 'block' : 'none'}}>
						跳至 
						<FormControl 
							iconStyle="one" 
							className="toPage-input"
							min= {1}
							max= {maxPage}
							value= {page}
							onChange= {(e) => {
								let val= e.target.value;
								let reg= /^[1-9][0-9]*$/;
								if (!reg.test(val) && val) {
									toast({color: 'warning', content: '请输入正整数...'});
									return ;
								}
								this.setState({page: val});
							}}
							onKeyDown = {(e) => {
								if(e.keyCode=== 13) {
									this.props.onChangePageIndex(Number(page));
								}
							}}
						/> 
						页
						<Button
							className="toPage-button"
							onClick={() => {
								if (!page) {
									toast({color: 'danger', content: '请输入页数...'});
									return;
								}
								this.props.onChangePageIndex(Number(page));
							}}
						>确定</Button>
					</span>
				</div>
			: ''	
			}
		</div>;
	}
}
