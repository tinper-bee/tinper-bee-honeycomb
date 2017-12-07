import axios from 'axios';
import { Message } from 'tinper-bee';

const OPT = ['start', 'suspend', 'restart', 'destroy']

const serveUrl = {
  getRegisterPool: '/msconsole/discovery/apps',
  getRegisterInstance: '/msconsole/discovery/instances/',
  getRegisterServerList: '/msconsole/discovery/services/',
  listDetails: '/msconsole/servicemeta/listDetails?servName=',
  searchLink: '/msconsole/discovery/services/search',
  getDetail: '/msconsole/discovery/services/detail/',
  updateConfig: '/msconsole/config/updateConfig',
  interfaceList: '/msconsole/discovery/interface/',
  serviceList: '/msconsole/discovery/services',
  getConfig: "/msconsole/config/getConfig/",
  searchList: '/msconsole/discovery/services',
  trace: '/msconsole/discovery/trace/',
  traceDetail: '/msconsole/discovery/trace/detail/',
  modifyauth: '/msconsole/web/v1/meta/modifyauth',
  selectSearch: '/portal/web/v1/manager/search',
  userDelete:'/portal/web/v1/manager/delete?id='

}


export function selectSearch(params) {
  let {
    size,
    index,
    userId,
    telOrMail
  } = params;

  let url2 = serveUrl.selectSearch + `?userId=${userId}&telOrMail=${telOrMail}&pageSize=${size}&pageIndex=${index}`;

  return axios({
    method: 'GET',
    url: url2
  })

}

/**
 * 删除用户管理界面里的接口
 * 
 */

export function userDelete(params,callback,callback2) {
  axios.get(serveUrl.userDelete +params.id)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      if(callback2){
        callback2();
      }
      Message.create({content: '删除失败', color: 'danger',duration:1})
    });
}

export function getRegisterPool() {
  return axios({
    method: 'GET',
    url: serveUrl.getRegisterPool
  })

}

export function getRegisterInstance(params) {
  let {
    name,
    providerId,
    envType
  } = params;

  return axios({
    method: 'GET',
    url: serveUrl.getRegisterInstance + name + `?providerId=${providerId}&envType=${envType}`
  })

}

export function getRegisterServerList(param) {
  return axios({
    method: 'GET',
    url: serveUrl.getRegisterServerList + param
  })

}

export function listDetails(param) {
  return axios({
    method: 'GET',
    url: serveUrl.listDetails + param
  })
}

export function searchLink(params) {
  let {
    size,
    index,
    keyName
  } = params;

  let url2 = serveUrl.searchLink + `?pageSize=${size}&pageIndex=${index}&search_keyName=${keyName}`;

  return axios({
    method: 'GET',
    url: url2
  })

}


/**
 * 获取微服务左侧接口列表
 * @param {*} param 
 */
export function interfaceList(param) {
  let { appCode, envType } = param;
  let url2 = serveUrl.interfaceList + param.appCode + `?envType=${param.envType}`;
  return axios({
    method: 'GET',
    url: url2
  })
}
/**
 * 获取中间内容区域的列表数据
 * @param {*} param 
 */
export function serviceList(param) {
  let { size, index, appCode, serverName, envType } = param;
  let url2 = serveUrl.serviceList + `?pageSize=${size}&pageIndex=${index}&search_appName=${appCode}&search_interfaceName=${serverName}&envType=${envType}`;

  return axios({
    method: 'GET',
    url: url2
  })
}

/**
 * 点击搜索按钮。如果没有选择所属分类，默认从第一个分类查询
 * @param {*} params 
 */
export function searchList(params) {
  let {
    size,
    index,
    searchValue,
    appCode,
    envType
  } = params;

  let url2 = serveUrl.searchList + `?pageSize=${size}&pageIndex=${index}&search_appName=${appCode}&search_keyName=${searchValue}&envType=${envType}`;

  return axios({
    method: 'GET',
    url: url2
  })

}

/**
 * 详情页接口数据
 * @param {*} params 
 */
export function getDetail(params) {

  let url2 = serveUrl.getDetail + params.serviceName + "/" + params.serviceId + `?envType=${params.envType}`;

  return axios({
    method: 'GET',
    url: url2
  })

}
/**
 * 获取限流的配置文件
 * @param {*} param 
 */
export function getConfig(param) {
  let { appCode, envType } = param;
  let url2 = serveUrl.getConfig + param.appCode + `?envType=${envType}`;

  return axios({
    method: 'GET',
    url: url2
  })
}

/**
 * 更新限流的配置文件
 * @param {*} param 
 * @param {*} appCode 
 * @param {*} envType 
 */
export function updateConfig(param, appCode, envType) {
  let url2 = serveUrl.updateConfig + "/" + appCode + `?envType=${envType}`;
  return axios.post(url2, param)

}


export function trace(params) {
  let {
    size,
    index,
    appCode,
    serverName,
    interface_name,
    startTime,
    endTime,
    inputStartData,
    inputEndData,
    envType
  } = params;

  let url2 = serveUrl.trace + `${appCode}/${interface_name}/${serverName}?pageSize=${size}&pageIndex=${index}&search_startDate=${startTime}` +
    `&search_endDate=${endTime}&search_startMills=${inputStartData}&search_endMills=${inputEndData}&envType=${envType}`;

  return axios({
    method: 'GET',
    url: url2
  })

}

export function traceDetail(param) {
  let { traceId } = param;
  let url2 = serveUrl.traceDetail + param.traceId;
  console.log(url2);
  return axios({
    method: 'GET',
    url: url2
  })
}

export function modifyauth(param) {
  let { metaId, resId, providerId, busiCode, userPriviledge, envType } = param;
  let url2 = serveUrl.modifyauth + `?metaId=${metaId}&resId=${resId}&providerId=${providerId}&busiCode=${busiCode}&userPriviledge=${userPriviledge}&envType=${envType}`;
  console.log(url2);
  return axios({
    method: 'GET',
    url: url2
  })
}




