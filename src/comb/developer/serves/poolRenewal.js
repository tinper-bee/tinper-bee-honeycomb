import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  listpool: '/res-pool-manager/v1/resource_pool/listpool',
  renewal: '/res-pool-manager/v1/resource_pool/renewal/${providerid}',
  checkResPoolAuth: '/res-pool-manager/v1/resource_pool/isowner/'
}
export function searchResourcePool(callback) {
    axios.get(
        serveUrl.listpool
    )
    .then(function (response) {
        if(callback) {
            callback(response);
        }
    })
    .catch(function (err) {
        console.log(err);
        Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}

export function renew(param, callback){
  let url = serveUrl.renewal.replace('${providerid}', param.providerid) + `?expiretime=${param.expiretime}`;
  axios.get(url).then(function (response) {
      if(callback) {
          callback(response);
      }
  })
  .catch(function (err) {
      console.log(err);
      Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

/**
 * 验证是否有管理员权限
 * @param id 资源池id
 */
export function checkResPoolAuth(id) {
  return axios.get(serveUrl.checkResPoolAuth + id)
}
