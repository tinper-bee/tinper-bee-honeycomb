import Axios from 'axios';
import { toast } from './utils';
import Loading from 'bee-loading';
import ReactDOM from 'react-dom'
export default function ajax({
	loading = true,
	mode = '',
	method = 'post',
	url = '/',
	data = {},
	params = {},
	success = function(res) {
		console.log(res);
	},
	error = function(res) {
		toast({ color: 'danger', content: res.message });
		console.error(res);
	}
}) {
	data.vs1h8do0 = window.vs1h8do0;
	let div
	if (loading) {
		div = document.createElement('div')
		document.body.appendChild(div)
		ReactDOM.render(<Loading show={true} />, div)
	}
	Axios({
		method: method,
		params: params,
		url: url,
		data: data
	})
		.then((res) => {
			div && ReactDOM.unmountComponentAtNode(div)
			if (mode === 'normal') {
				success(res);
			} else {
				if (res.data.success) {
					success(res.data);
				} else {
					throw new Error(res.data.message.message);
				}
			}
		})
		.catch((res) => {
			div && ReactDOM.unmountComponentAtNode(div)
			error(res)
		});
}
