import axios from 'axios';
import { Message } from 'tinper-bee';

const serveUrl = {
  queryChangeList: '/devops/web/v1/queryChangeList.do',
  commitChangeBill: '/devops/web/v1/commitChangeBill.do',
  getChangeType: '/devops/web/v1/getChangeType',
  getDepts: '/devops/web/v1/getDepts',
}

export function commitChangeBill(param) {
  return axios.post(serveUrl.commitChangeBill, param)
    .then(res => {
      return res.data;
    })
    .then(res => {
      if (!res.success) {
        Message.create({ content: '接口访问出错', color: 'danger', duration: 2 })
      }
      return res;
    })
}

export function getChangeList(params = {}) {
  return axios.get(serveUrl.queryChangeList, {
    params
  })
    .then(function (res) {
      if (!res.data.success) {
        Message.create({ content: '接口访问出错', color: 'danger', duration: 2 })
      }
      let data = res.data.module;
      return data;
    })
}

export function getChangeType() {
  return axios.get(serveUrl.getChangeType)
    .then(function (res) {
      if (!res.data.success) {
        Message.create({ content: '接口访问出错', color: 'danger', duration: 2 })
      }
      let data = res.data.module;
      return data;
    })
}

export function getDepts() {
  return axios.get(serveUrl.getDepts)
    .then(function (res) {
      if (!res.data.success) {
        Message.create({ content: '接口访问出错', color: 'danger', duration: 2 })
      }
      let data = res.data.module;
      return data;
    })
}