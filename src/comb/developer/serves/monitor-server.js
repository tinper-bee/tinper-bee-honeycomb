import axios from 'axios';

const serveUrl = {
	getNodeState: "/monitorShow"
}


export function getNodeState() {
	return axios.get(serveUrl.getNodeState);
}