import React, { Component } from 'react';
import { Link } from 'react-router';
import './index.less';
import Img1 from '../../../../static/images/indexPage/img1.png';
import Img2 from '../../../../static/images/indexPage/img2.png';
import Img3 from '../../../../static/images/indexPage/img3.png';
import Img4 from '../../../../static/images/indexPage/img4.png';
import Img5 from '../../../../static/images/indexPage/img5.png';
let liRender = (itemData, index) => {
	// 包含数量
	if (itemData.num || typeof itemData.num === 'number') {
		return (
			<li key={index} className='tmc_list_li'>
				<Link to={itemData.url}>
					<span className='li_num_name'>{itemData.name}</span>
					<span className='li_num'>{itemData.num}</span>
				</Link>
			</li>
		);
		// 包含金钱
	} else if (itemData.mny || typeof itemData.num === 'number') {
		return (
			<li key={index} className='tmc_list_li'>
				<span className='li_mny_name'>{itemData.name}</span>
				<span className='li_mny'>{itemData.mny}</span>
			</li>
		);
		// 包含日期
	} else if (itemData.date) {
		return (
			<li key={index} className='tmc_list_li'>
				<span className='li_date'>{itemData.date}</span>
				<span className='li_info'>{itemData.info}</span>
			</li>
		);
	}
};
let imgs = [ Img1, Img2, Img3, Img4, Img5 ];
let imgChange = (index) => {
	if (index < 5) {
		return imgs[index];
	} else {
		return imgs[index - 5];
	}
};
export default function InfoDisplay(props) {
	let { infoData, index } = props;
	return (
		<div className='tmc_list_content'>
			<div className='tmc_list_logo'>
				<img src={imgChange(index)} alt='' />
			</div>
			<div className='tmc_list_title'>{infoData.title}</div>
			<ul className='tmc_list_ul'>
				{infoData.list.map((item, index) => {
					return liRender(item, index);
				})}
			</ul>
		</div>
	);
}
