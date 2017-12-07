import axios from 'axios';

const serveUrl = {
  getContainerHost: '/res-pool-manager/v1/resource_nodes/startterminalbyhost',

}

const headers = {"Content-Type": 'application/json'};


export function getContainerHost(host, containerId) {
  return axios.get(`${serveUrl.getContainerHost}?host=${host}&container=${containerId}`)
}
