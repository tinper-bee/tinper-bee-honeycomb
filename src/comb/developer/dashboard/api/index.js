import React, { Component } from 'react';
import axios from 'axios';
import { Message } from 'tinper-bee';
import { splitParam } from '../../components/util'

const serveUrl = {
  getResStatus: '/app-manage/v1/resources',
  getNewAppInfo: '/ycm-yyy/web/v1/dataquery/query',
  getAletInfo: '/res-alarm-center/v1/alarm/latest'
}
export function getAletInfo(param = 5) {
  return axios.get(serveUrl.getAletInfo + `?limit=${param}`)
    .then(res => res.data)
    .then(res => {
      if (!res || !res.length) {
        return [];
      }

      if(res.error_code){
        Message.create({
          content: '获取失败',
          color: 'danger',
          duration: 1
        })

        return [];
      }
      return res;
    })
}
export function getResStatus(callback) {
  return axios.get(serveUrl.getResStatus)
    .then(function (response) {
      if (callback) {
        callback(response);
      }
      return response.data;
    })
    .catch(function (err) {
      Message.create({ content: '获取资源信息失败', color: 'danger', duration: 1 })
      console.log("error");
    });
}
export function getNewAppInfo() {
  return axios.post(serveUrl.getNewAppInfo, {})
    .then(function (response) {
      return response.data;
    })
    .catch(function (err) {
      Message.create({ content: '获取应用信息失败', color: 'danger', duration: 1 })
      console.log(err.message);
      return {
        detailMsg: {
          data: {
            graph: [],
            data: []
          }
        }
      }
    })
    .then(function (data) {
      let ret = {
        graph: [],
        data: []
      };
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
    .then(function ({ graph = [], data = [] }) {

      let appInfo = [];
      let graphInfo = [];
      let accountInfo = [];
      try {
        data.forEach(function (item, index) {
          let appId = item['appId'];
          accountInfo.push(item['appName']);

          appInfo.push(item['appDatas']);

          graphInfo.push(graph[index][`pv${index}`][appId]['detail'])

        });
      } catch (e) {
        // appInfo = [];
        // graphInfo = [];
        // accountInfo = [];
        // console.log(e.message);
      }

      return {
        appInfo,
        graphInfo,
        accountInfo
      };

    })
}
