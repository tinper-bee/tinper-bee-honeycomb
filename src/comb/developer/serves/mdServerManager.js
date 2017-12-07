import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';
import { splitParam, getDataByAjax } from '../components/util'

const serveUrl = {
  searchUrl: '/middleware/web/v1/middlemanager/{type}/page',
  renew: '/middleware/web/v1/middlemanager/{type}/renewal'
}

export function searchMiddlware(param, type) {
    let searchUrl = serveUrl.searchUrl.replace('{type}', type);
    return axios.get(
        searchUrl,
        {params:param}
    )
    .then(function (res) {
        return res.data;
    })
    .catch(function (err) {
        Message.create({ content: `操作失败，请检查网络，${err['error_message'].slice(0, 50)}`, color: 'danger', duration: 1 })
        console.log(err);
        //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}

export function renew(data, type) {
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
