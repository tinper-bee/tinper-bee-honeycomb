import axios from 'axios';
import { Message } from 'tinper-bee';

const OPT = ['start', 'suspend', 'restart', 'destroy']

const serveUrl = {
  createService: '/middleware/web/v1/{type}/apply',
  listQ: '/middleware/web/v1/{type}/page',
  renew: '/middleware/web/v1/{type}/renewal',
  udpate:'/middleware/web/v1/{type}/udpate',
  operation: '/middleware/web/v1/{type}/',
  checkstatus: '/middleware/web/v1/{type}/',
  maxInsNum: '/middleware/web/v1/mysql/maxInsNum?maxType={param}',
  addRedirectrule: '/middleware/web/v1/redirectrule/create',
  upDateRedirectrule: '/middleware/web/v1/redirectrule/udpate',
  deleteRedirectrule: '/middleware/web/v1/redirectrule/delete',
  checkAuth: '/middleware/web/v1/middlemanager/{type}/hasowner'
}

export function deleteRedire(param = '') {
  return axios({
    method: 'POST',
    url: serveUrl.deleteRedirectrule + param
  })

}

export function addRedire(data) {
  return axios({
    method: 'POST',
    url: serveUrl.addRedirectrule,
    data: data
  })

}

export function updateRedire(data) {
  return axios({
    method: 'POST',
    url: serveUrl.upDateRedirectrule,
    data: data
  })

}

export function createService(param, type) {
  //type 这里不能为空
  if (!type) {
    return;
  }

  let url = serveUrl.createService.replace('{type}', type)
  return axios.post(url, param)
    .then(function (res) {
      return res.data;
    })
    .then(function (data) {
      if (data['error_code']) {
        throw data;
      }
      return data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }

      let errMsg = '长时间未操作,登录信息已经过期, 请重新登录。';
      if (err['error_message']) {
        errMsg = `创建${type}实例失败，${err['error_message'].slice(0,50)}`;
      }else{
        errMsg = `创建${type}实例失败，请和管理员取得联系`
      }

      Message.create({ content: errMsg, color: 'danger', duration: 5 })
      console.log(err.message);
    })
}

export function listQ(param, type, extendParam = '') {
  let {
    size,
    index
  } = param;

  let url = serveUrl.listQ.replace('{type}', type) + `?pageSize=${size}&pageIndex=${index}${extendParam}`;
  return axios.get(url)
    .then(function (res) {
      return res.data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }
      Message.create({ content: `获取信息失败，${err['error_message'].slice(0, 50)}`, color: 'danger', duration: 1 })
      console.log(err.message);
      return {
        detailMsg: {
          data: {
            content: [],
            totalPages: 0,
            totalElements: 0,
          }
        }
      }
    })
    .then(function (data) {
      let ret = {
        content: [],
        totalPages: 0,
        totalElements: 0,
      }
      if (data['error_code']) {
        return ret;
      }

      try {
        ret = data['detailMsg']['data'];
      } catch (e) {
        console.log(e.message);
      }

      return ret;
    })
}

export function operation(data, type, optType) {
  let param = {
    entitys: data
  }
  let url = serveUrl.operation.replace('{type}', type) + OPT[optType];
  return axios.post(url, param)
    .then(function (res) {
      return res.data;
    })
    .then(function (data) {
      if (data['error_code']) {
        throw data
      }
      return data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }
      Message.create({ content: `操作失败，请检查网络，${err['error_message'].slice(0, 50)}`, color: 'danger', duration: 1 })
      console.log(err.message);
    })
}



export function renew(data, type) {
  if (Array.isArray(data)) {
    data = data[0];
  }
  let url = serveUrl.renew.replace('{type}', type);
  return axios.post(url, data)
    .then(function (res) {
      return res.data;
    })
    .then(function (data) {
      if (data['error_code']) {
        throw data
      }
      return data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }
      Message.create({ content: `操作失败，请检查网络，${err['error_message'].slice(0, 50)}`, color: 'danger', duration: 1 })
      console.log(err.message);
    })
}


export function udpate(data, type) {
  if (Array.isArray(data)) {
    data = data[0];
    delete data.ts;
  }
  let url = serveUrl.udpate.replace('{type}', type);
  return axios.post(url, data)
    .then(function (res) {
      return res.data;
    })
    .then(function (data) {
      if (data['error_code']) {
        throw data
      }
      return data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }
      Message.create({ content: `操作失败，请检查网络，${err['error_message'].slice(0, 50)}`, color: 'danger', duration: 1 })
      console.log(err.message);
    })
}

export function maxInsNum(param) {
  let url = serveUrl.maxInsNum.replace('{param}', param)

  return axios.post(url, {})
    .then(function (res) {
      return res.data;
    })
    .then(function (data) {
      if (data['error_code']) {
        throw data;
      }
      return data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }
      Message.create({ content: `操作失败，${err['error_message'].slice(0, 50)}`, color: 'danger', duration: 1 })
      console.log(err.message);
    })
}

export function checkstatus(data, type) {
  let param = data;
  let url = serveUrl.checkstatus.replace('{type}', type) + 'checkstatus';
  return axios.post(url, param)
    .then(function (res) {
      return res.data;
    })
    .then(function (data) {
      if (data['error_code']) {
        throw data;
      }
      return data;
    })
    .catch(function (err) {
      if (!err['error_message']) {
        err['error_message'] = err.message
      }
      Message.create({ content: `操作失败，${err['error_message'].slice(0, 50)},请稍候重试刷新`, color: 'danger', duration: 1 })
      console.log(err.message);
    })
}



/**
 * 查询是否有权限操作
 * @param busicode
 * @param param
 * @constructor
 */
export function checkMiddlewareAuth(busicode = '', param = '') {
  let checkAuth = serveUrl.checkAuth.replace('{type}', busicode);
  return axios.get(checkAuth + param);
}
