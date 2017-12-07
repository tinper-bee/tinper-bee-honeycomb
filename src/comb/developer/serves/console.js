import React, { Component } from 'react';
import axios from 'axios';
import { Message } from 'tinper-bee';
import { splitParam } from '../components/util'

const serveUrl = {
  getResStatus: '/app-manage/v1/resources',
  getNewAppInfo: '/ycm-yyy/web/v1/dataquery/query',
  getGraphInfo: '/ycm-yyy/web/v1/graphquery/query',
  getVisitInfo: '/portal/web/v1/console/isvinfo',
  getPublishList: '/app-manage/v1/apps',
}

export function getPublishList() {
  return axios.get(serveUrl.getPublishList).then(response => {
    let data = response.data;

    if (data['error_code'] !== 0) {
      return []
    }
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
  return axios.post(serveUrl.getNewAppInfo,{})
    .then(function (response) {
      return response.data;
    })
    .catch(function (err) {
      Message.create({ content: '获取应用信息失败', color: 'danger', duration: 1 })
      console.log(err.message);
      return {
        detailMsg:{
          data:{
            graph:[],
            data:[]
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
// export function getVisitInfo(callback) {
//   return axios.get(serveUrl.getVisitInfo)
//     .then(function (response) {
//       if (callback) {
//         callback(response);
//       }
//       return response.data;
//     })
//     .catch(function (err) {
//       Message.create({ content: '获取用户访问信息失败', color: 'danger', duration: 1 })
//       console.log("error");
//     });
// }

export function getAppInfo(appids, callback) {

  let s = splitParam({
    queryParams: JSON.stringify({
      index: "iuap",
      type: "nginx_notype",
      appids: appids,
      providerid: "31efbac8-d7aa-4009-a9b9-3965d92ae217",
      st: Date.now() - 24 * 60 * 60 * 1000,
      et: Date.now(),
      // types: ["operdata"]
    })
  });


  return axios.post(serveUrl.getAppInfo, s)
    .then(function (response) {
      if (callback) {
        callback(response);
      }
      return response.data;
    })
    .then(data => data['detailMsg']['data'])
    .catch(function (err) {
      Message.create({ content: '获取应用信息失败', color: 'danger', duration: 1 })
      console.log("error");
    });
}

export function getGraphInfo(appids = [], callback) {
  //   // const tgs = appids.map(id => (
  //   //   {
  //   //     "metric": [{
  //   //       "type": "count"
  //   //     }],
  //   //     // "query": `appId:${id} AND providerId:EEEeThve9BWp2aJWkxkapZ"`,
  //   //     "query": 'lId: nginx',
  //   //     "group": [{
  //   //       "field": "ts",
  //   //       "type": "date_histogram",
  //   //       "interval": "12m",
  //   //       "size": 10
  //   //     }],
  //   //     "nm": "1",
  //   //     "datatype": "es "
  //   //   }
  //   // ))
  // appids=['x6i2q434'];
  let time = Date.now();
  let pid = /u_providerid=([^;]*);/.exec(document.cookie);
  let providerId = pid ? pid[1] : '';

  let allReq = appids.map(appid => {
    let s = splitParam({
      queryParams: JSON.stringify({
        "index": "iuap",
        "type": "nginx_notype",
        "st": time - 12 * 60 * 60 * 1000,
        "et": time,
        "tgs": [{
          "metric": [{
            "type": "count"
          }],
          "query": `appId:${appid} AND providerId:${providerId}`,
          // "query": 'lId: nginx',
          "group": [{
            "field": "ts",
            "type": "date_histogram",
            "interval": "1h",
            "size": 10
          }],
          "nm": "1",
          "datatype": "es "
        }]
      })
    });

    return axios.post(serveUrl.getGraphInfo, s)
      .then(function (response) {
        if (callback) {
          callback(response);
        }
        return response.data;
      })
      .then(data => {
        let ret;
        try {
          ret = data['detailMsg']['data']['1']['detail'];
        } catch (e) {
          ret = [];
        }

        return ret;
      })
      .catch(function (err) {
        Message.create({ content: '获取应用信息失败', color: 'danger', duration: 1 })
        console.log("error");
      });
  })

  return Promise.all(allReq);
}

function sortBy(appids = [], data = []) {
  let sorted = new Array(appids.length);
  data.forEach(item => {
    let appId = item[appId];
    let index = appids.indexOf(appId);
    sorted[index] = item;
  });

  return sorted;
}
