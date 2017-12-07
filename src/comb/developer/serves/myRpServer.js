import axios from 'axios';
import { Message } from 'tinper-bee';

const serveUrl = {
  addResource:'/res-pool-manager/v1/resource_pool',
  monitor:'/res-pool-manager/v1/resource_pool/monitor',
  changestatusall:'/res-pool-manager/v1/resource_pool/changestatusall/',
  containerscount:'/res-pool-manager/v1/resource_pool/containerscount/',
  deleteResource:'/res-pool-manager/v1/resource_pool/',
  generateid:'/res-pool-manager/v1/resource_pool/generateid/',
  setngrokuser:'/res-pool-manager/v1/resource_pool/setngrokuser',
  resource_message:'/res-pool-manager/v1/resource_message?query=AuthId:',
  resource_edit:'/res-pool-manager/v1/resource_pool/',
  resource_select:'/res-pool-manager/v1/resource_pool/',
  containers:'/res-pool-manager/v1/resource_pool/containers/',
  resource_nodes:'/res-pool-api/v1/resource_nodes/',
  hoststatus:'/res-pool-manager/v1/resource_pool/hoststatus/'
  
}

/**
 * 添加资源池
 * @param {*} param  
 * 
 */
export function addResource(param) {
  let url2 = serveUrl.addResource;
  return axios.post(url2, param)

}

/**
 * 获取资源池数据
 */

export function monitor() {
  return axios({
    method: 'GET',
    url: serveUrl.monitor
  })

}

/**
 * 设置默认资源池
 */

export function changestatusall(param) {
  return axios({
    method: 'GET',
    url: serveUrl.changestatusall + param
  })

}

/**
 * 获取每个资源池的容器个数
 */

export function containerscount(param) {
  return axios({
    method: 'GET',
    url: serveUrl.containerscount + param
  })

}


/**
 * 删除资源池
 */

export function deleteResource(param) {
  return axios({
    method: 'DELETE',
    url: serveUrl.deleteResource + param
  })
}

/**
 * 刷新自由主机
 */
export function generateid(param) {
  let {id,hostname} = param;
  return axios({
    method: 'GET',
    url: serveUrl.generateid + param.id +`?hostname=${hostname}`
  })
}


export function setngrokuser(param) {
  let url2 = serveUrl.setngrokuser;
  return axios.post(url2, param)
}

export function resource_message(param) {
  return axios({
    method: 'GET',
    url: serveUrl.resource_message + param + '&sortby=Ts&order=asc'
  })
}

 /**
  * 编辑资源池
  */
export function resource_edit(params,id) {
  let url2 = serveUrl.resource_edit + id;
  return axios.put(url2,params);
}
 /**
  * 根据资源池ID，进行资源池的查询
  */
export function resource_select(param) {
  return axios({
    method: 'GET',
    url: serveUrl.resource_select + param
  })
}

export function containers(param) {
  return axios({
    method: 'GET',
    url: serveUrl.containers + param
  })
}


export function resource_nodes(param) {
  return axios({
    method: 'DELETE',
    url: serveUrl.resource_nodes + param
  })
}

export function hoststatus(param) {
  return axios({
    method: 'GET',
    url: serveUrl.hoststatus + param
  })
}
