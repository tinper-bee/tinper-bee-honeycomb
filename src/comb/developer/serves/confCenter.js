import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  getConfigFile: '/confcenter/api/web/config/list.do',
  getConfigFileByCode: '/confcenter/api/web/config/listbycode.do',
  getConfigVersion: '/confcenter/api/web/config/defVersionList.do',
  getConfigVersionByCode: '/confcenter/api/web/config/defVersionListByCode.do',
  getConfigEnv: '/confcenter/api/env/list.do',
  getConfigApp: '/confcenter/api/app/list.do',
  editConfigFile: '/confcenter/api/web/config/filetext',
  uploadConfigFile: '/confcenter/api/web/config/file',
  deleteConfigFile: '/confcenter/api/web/config/',
  createItem: '/confcenter/api/web/config/item',
  deleteApp: '/confcenter/api/app/',
  createApp: '/confcenter/api/app',
  publicConfig: '/confcenter/api/web/config/publicflag/',
  deleteAll: '/confcenter/api/app/cascadedelte/',
}

const headers = {"Content-Type": 'application/json'};


/**
 * 获取配置文件列表
 * @param param
 * @constructor
 */
export function GetConfigFileFromCenter(param) {
  return axios.get(serveUrl.getConfigFile + param);
}

/**
 * 获取配置文件列表
 * @param param
 * @constructor
 */
export function GetConfigFileFromCenterByCode(param) {
  return axios.get(serveUrl.getConfigFileByCode + param);
}

/**
 * 获取配置文件版本列表
 * @param param
 * @constructor
 */
export function GetConfigVersionFromCenter(param) {
  return axios.get(serveUrl.getConfigVersion + param);
}

/**
 * 使用appcode获取配置文件版本列表
 * @param param
 * @constructor
 */
export function GetConfigVersionByCode(param) {
  return axios.get(serveUrl.getConfigVersionByCode + param);
}

/**
 * 获取配置文件环境列表
 * @constructor
 */
export function GetConfigEnvFromCenter() {
  return axios.get(serveUrl.getConfigEnv);
}

/**
 * 获取app列表
 * @constructor
 */
export function GetConfigAppFromCenter() {
  return axios.get(serveUrl.getConfigApp);
}

/**
 * 搜索配置文件环境列表
 * @constructor
 */
export function SearchConfigAppFromCenter(param ) {
  return axios.get(serveUrl.getConfigApp + param);
}

/**
 * 删除配置文件
 * @param id 配置文件id
 */
export function deleteConfigFile(id) {

  return axios({
    method: 'DELETE',
    headers: headers,
    url: serveUrl.deleteConfigFile + id
  });

}


/**
 * 修改配置文件内容
 * @param data 修改后的数据
 * @param id 配置文件id
 */
export function editConfigFile(data, id) {

  return axios({
    method: 'PUT',
    headers: {"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: serveUrl.editConfigFile + '/' + id,
    data: data
  })

}

/**
 * 修改配置文件内容
 * @param data 修改后的数据
 */
export function uploadConfigFile(data) {

  return axios({
    method: 'POST',
    headers: {"Accept": "*/*","Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: serveUrl.uploadConfigFile,
    data: data
  })

}

/**
 * 创建配置文件
 * @param data 修改后的数据
 */
export function addConfigFile(data) {

  return axios({
    method: 'POST',
    headers: {"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: serveUrl.editConfigFile,
    data: data
  })

}

/**
 * 创建配置项
 * @param data 修改后的数据
 */
export function createItem(data) {

  return axios({
    method: 'POST',
    headers: {"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: serveUrl.createItem,
    data: data
  })

}

/**
 * 删除应用
 * @param id id
 */
export function deleteApp(id) {

  return axios({
    method: 'DELETE',
    headers: {"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: serveUrl.deleteApp + id
  })

}

/**
 * 创建应用
 * @param data
 */
export function createApp(data) {

  return axios({
    method: 'POST',
    headers: {"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: serveUrl.createApp,
    data: data
  })

}

/**
 * 设置为开放
 * @param param
 */
export function publicConfig(param) {
  return axios.put(`${serveUrl.publicConfig}${param}`)
}

/**
 * 删除及删除组内所有
 * @param id
 */
export function deleteAll(id) {
  return axios.delete(serveUrl.deleteAll + id)
}
