import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  getData: '/model-create/data/struct',

}

const headers = {"Content-Type": 'application/json'};

/**
 * 获取报警列表
 * @param param 查询条件
 */
export function getTree(param = '') {
  return axios.get(`${serveUrl.getData}${param}`)
}



