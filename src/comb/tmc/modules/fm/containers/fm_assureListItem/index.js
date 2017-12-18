import './index.less';
export default function AssureListItem(props) {
	let { imgurl, titleOrg, titleGrey, linkurl } = props.assureListItemData;
	return (
		<div className="AssureListItem">
			<div className="listItem-left">
				<h4>
					<span className="listItem-left-title">{titleOrg}</span>
					{titleGrey}
				</h4>
				<p>轻松操作，一步融资</p>
				<a href={linkurl}>{props.assureListItemData.button || '点击办理'}</a>
			</div>
			<div className="listItem-right">
				<img src={imgurl} alt="" />
			</div>
		</div>
	);
}
