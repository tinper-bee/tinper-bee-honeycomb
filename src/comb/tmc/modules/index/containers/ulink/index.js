import React, { Component } from 'react';
import './index.less';

export default function Ulink(props) {
	let { title, listData } = props.ulinkdata;
	return (
		<div id='ulink'>
			<h3 className='title'>{title}</h3>
			<ul className='list'>
				{listData.map((item, key) => {
					return (
						<li className='listItem'>
							<a href={item.url}>{item.name}</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
