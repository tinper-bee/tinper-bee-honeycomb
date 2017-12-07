import React,{Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import {Message} from 'tinper-bee';
import { splitParam, getDataByAjax } from '../components/util'

const serveUrl = {
  historyVersionUrl: '/app-docker-registry/api/v1/rollback',
  updateVersionUrl: '/app-docker-registry/api/v1/update',
  rollbackUrl: '/app-manage/v1/app/rollback'
}

const headers = { "Content-Type": 'application/json'};

export function historyVersion(param, callback) {
    axios.get(
        serveUrl.historyVersionUrl,
        {params:param}
    )
    .then(function (response) {
        if(callback) {
            callback(response);
        }
    })
    .catch(function (err) {
        console.log(err);
        //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}

export function updateVersion(param, callback) {
    axios.get(
        serveUrl.updateVersionUrl,
        {params:param}
    )
    .then(function (response) {
        if(callback) {
            callback(response);
        }
    })
    .catch(function (err) {
        console.log(err);
        //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}

export function rellbackHandle(param, callback){
  axios.post(serveUrl.rollbackUrl, qs.stringify(param), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
  .then(function (response) {
    if(callback) {
        callback(response);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}
