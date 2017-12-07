import axios from 'axios';
import { Message } from 'tinper-bee';

const serveUrl = {
  binddomain:'/edna/web/v1/domain/binddomain?appId=',
  listUserDomains:'/edna/web/v1/domain/listUserDomains?appId=',
  domain_delete:'/edna/web/v1/domain/delById?id='
  
}

/**
 * 添加域名 
 * @param {*} param  
 * 
 */
export function binddomain(param) {
  let {appId,domain} = param;
  let url2 = serveUrl.binddomain + appId + `&domain=${domain}`;
  return axios.post(url2,param)

}

/**
 * 获取domain列表
 */

export function listUserDomains(param) {
  return axios({
    method: 'GET',
    url: serveUrl.listUserDomains + param
  })

}

/**
 * 删除域名绑定
 */

export function domain_delete(param) {
  return axios({
    method: 'DELETE',
    url: serveUrl.domain_delete + param
  })
}

