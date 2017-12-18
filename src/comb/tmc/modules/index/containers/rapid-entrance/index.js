import { Link } from 'react-router';
import './index.less';
export default function RapidEntrance(props) {
	let { title, listData } = props.entranceData;
	return (
		<div id='rapidEntrance'>
			<h3 className='title'>{title}</h3>
			<ul className='list'>
				{listData.map((item, key) => {
					// return(<li className="listItem"><span className={}></span><a href={item.url}>{item.name}</a></li>)
					return (
						<li className='listItem'>
							<Link to={item.url}>
								<svg className='icon' aria-hidden='true'>
									<use xlinkHref={`#icon-${item.icon}`} />
								</svg>
								<span>{item.name}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
