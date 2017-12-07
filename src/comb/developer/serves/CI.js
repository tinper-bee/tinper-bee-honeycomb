import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';
import { getDataByAjax } from 'components/util';

const serveUrl = {
  getMesosVersion: '/app-manage/v1/framework/version',
  getQuickPublishInfo: '/app-manage/v1/app/image',
  quickPublish: '/app-manage/v1/app/update',
  getDescription: '/app-upload/web/v1/enhance/getDescription',
  getJenkins: '/middleware/web/v1/jenkins/page',
  getUploadConfig: '/app-upload/web/v1/enhance/getPreConfig',
  verifyImage: '/app-docker-registry/api/v1/private/check',
  upload: '/app-upload/web/v1/upload/appAliOssUpload',
  jumpUpload: '/app-upload/web/v1/upload/createApp',
  getUploadImgInitInfo: '/app-upload/web/v1/osscontroller/getsign?bucketname=yonyoucloud-developer-center',
  getUploadWarInitInfo: '/app-upload/web/v1/osscontroller/getsign?bucketname=yonyoucloud-developer-center-app',
  updateAppUpload: '/app-upload/web/v1/upload/updateAppUpload',
  checkAppName: '/app-upload/web/v1/upload/checkAppName?appName=',
  deploy: '/app-publish/web/v1/publish/deploy',
  privatePublish: '/app-publish/web/v1/publish/private',
  upload_console: '/app-upload/web/v1/log/tail',
  upload_log: '/app-upload/web/v1/log/getImageLog',
  getBranchList: '/app-upload/web/v1/upload/getBranchList',
  getBranchListEncryp: '/app-upload/web/v1/upload/getBranchListEncryp',
  updateGitInfo: '/app-upload/web/v1/upload/updateGitDetails',
  editQuickInfo: '/app-manage/v1/app/deployment/edit',
  createProd: '/app-manage/v1/app/group/multi',
  batchDelete: '/app-upload/web/v1/log/deleteAppUploadLogNotTop10?appUploadId=',
  getTimeLine: '/app-upload/web/v1/upload/getAppUploadDetails',
  repealAppAliOssUpload: '/app-upload/web/v1/upload/repeatAppAliOssUpload',
  updateSshGitInfo: '/app-upload/web/v1/upload/updateSshGitDetails',
  getSshBranchList: '/app-upload/web/v1/upload/getSshBranchList',
  getSshBranchListByidRsaPath: '/app-upload/web/v1/upload/getSshBranchListByidRsaPath',
  verifierWarOrJar: '/app-upload/web/v1/upload/checkAppPackage',
}

const headers = {"Content-Type": 'application/json'};

export function verifierWarOrJar(appUploadId, uploadPath) {
  return axios.get(`${serveUrl.verifierWarOrJar}?appUploadId=${appUploadId}&uploadPath=${uploadPath}`)
}

export function getJenkins() {
  return axios.get(serveUrl.getJenkins)

}

/**
 * 获取后台mesos版本
 */
export function getMesosVersion() {
  return axios.get(serveUrl.getMesosVersion)
}

/**
 * 获取描述文件
 * @param id 应用id
 * @param modules 哪个模块CONFCENTER_MODULE,UPLOAD_MODULE,PUBLISH_MODULE
 */
export function getDescription(id, modules) {
  return axios.get(`${serveUrl.getDescription}?id=${id}&modules=${modules}`)
}


/**
 * 获取一键部署的详情
 * @param image 应用的镜像名称
 */
export function getQuickPublishInfo(image) {
  return axios.get(`${serveUrl.getQuickPublishInfo}?image=${image}`)
}

/**
 * 一键部署的应用
 * @param data 数据
 */
export function quickPublish(data) {


  return axios({
    method: 'POST',
    url: serveUrl.quickPublish,
    data: data
  })
}

/**
 * 获取上传war包中的config信息
 * @param param
 * @constructor
 */
export function getUploadConfig(param) {
  return axios.get(serveUrl.getUploadConfig + param);
}

/**
 * 校验镜像名
 * @param param
 * @constructor
 */
export function verifyImage(param) {
  return axios.get(serveUrl.verifyImage + '?imageName=' + param);
}

/**
 * 创建应用
 * @param data
 * @param param
 */
export function create(data, param) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.upload + param,
    data: data
  })

}


/**
 * 跳过方式创建应用
 * @param data
 * @param param
 */
export function jumpCreate(data, param) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.jumpUpload + param,
    data: data
  })

}

/**
 * 获取上传图片信息
 * @param callback
 */
export function getUploadImgInfo(callback) {
  getDataByAjax(serveUrl.getUploadImgInitInfo, false, callback, function () {
    Message.create({content: '服务器出错', color: 'danger'});
    return false;
  })

}

/**
 * 获取上传war包信息
 * @param callback
 */
export function getUploadWarInfo(callback) {
  getDataByAjax(serveUrl.getUploadWarInitInfo, false, callback, function () {
    Message.create({content: '服务器出错', color: 'danger'});
    return false;
  })
}

/**
 * 更新版本
 * @param param
 * @param data
 * @constructor
 */
export function updateAppUpload(param, data) {
  return axios.post(serveUrl.updateAppUpload + param, data)
}

/**
 * 校验应用名称
 * @param name
 */
export function checkAppName(name) {
  return axios.get(serveUrl.checkAppName + name)
}

/**
 * 跳过部署服务
 * @param data
 * @param param
 */
export function deployApp(data, param) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.deploy + param,
    data: data
  })

}

/**
 * 私有资源池部署服务
 * @param data
 * @param param
 */
export function privatePublishApp(data, param) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.privatePublish + param,
    data: data
  })

}

/**
 * 从数据库获取日志
 * @param param
 */
export function getUploadLog(param) {
  return axios.get(`${serveUrl.upload_log}?appUploadId=${param.appUploadId}&buildVersion=${param.buildVersion}`)
}

/**
 * 从控制台获取日志
 * @param param
 */
export function getUploadConsole(param) {
  return axios.get(`${serveUrl.upload_console}?appUploadId=${param.appUploadId}&buildVersion=${param.buildVersion}`)
}

/**
 * 获取GIT分支
 * @param param
 */
export function getBranchList(param) {
  return axios.get(`${serveUrl.getBranchList}${param}`)
}

/**
 * 密文获取git分支
 * @param param
 */
export function getBranchListEncryp(param) {
  return axios.get(`${serveUrl.getBranchListEncryp}${param}`)
}

/**
 * 更新git信息
 * @param param
 */
export function updateGitInfo(param) {
  return axios.put(`${serveUrl.updateGitInfo}${param}`)
}

/**
 * 编辑一键部署信息
 * @param data
 */
export function editQuickInfo (data) {
  return axios.put(serveUrl.editQuickInfo, data);
}
/**
 * 部署前创建产品线
 * @param data
 * @returns {*}
 */
export function createProd(data) {
  return axios.post(`${serveUrl.createProd}`, data)
}

/**
 * 批量删除
 * @param id appUploadid
 */
export function batchDelete(id) {
  return axios.delete(`${serveUrl.batchDelete}${id}`)
}

/**
 * 获取事件线
 * @param param
 */
export function getTimeLine(param) {
  return axios.get(`${serveUrl.getTimeLine}${param}`)
}

/**
 * 上传进度超过两个小时重试
 * @param param
 * @constructor
 */
export function onRepealAppAliOssUpload(param) {
  return axios.post(`${serveUrl.repealAppAliOssUpload}${param}`)
}

/**
 * 获取ssh的分支列表
 * @param url
 * @param data
 */
export function getSshBranchList(url, data) {
  return axios.post(`${serveUrl.getSshBranchList}?gitUrl=${url}`,data)
}

/**
 * 根据idRsaPath获取git分支列表
 * @param id
 * @param url
 * @returns {*}
 * @constructor
 */
export function getSshBranchListByidRsaPath(id, url) {
  return axios.post(`${serveUrl.getSshBranchListByidRsaPath}?idRsaPath=${id}&gitUrl=${url}`)
}

/**
 * 更新git代码源
 * @param id
 * @param uploadId
 * @param url
 * @returns {*}
 */
export function updateSshGitInfo (id, uploadId, url) {
  return axios.post(`${serveUrl.updateSshGitInfo}?idRsaPath=${id}&appUploadId=${uploadId}&gitUrl=${url}`)
}
