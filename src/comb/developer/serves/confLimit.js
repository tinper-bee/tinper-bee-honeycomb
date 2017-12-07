import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  getApp: '/confcenter/api/app/ownerlist',
  searchUsers: '/portal/web/v1/userres/search',
  getUsers: '/data-authority/web/v2/dataauth/queryUser',
  assignAuth: '/data-authority/web/v2/dataauth/assignAuth',
  deleteAuth: '/data-authority/web/v2/dataauth/deleteAuth',
  checkAuth: '/confcenter/api/app/hasowner',
  modifyAuth: '/data-authority/web/v2/dataauth/modifyAuth',
  //获取按钮权限
  getAppBtnAuth: '/data-authority/api/v2/dataauth/queryDaRes',
  getAppActions: '/app-manage/v1/apps/actions'
}

const headers = {"Content-Type": 'application/json'};

export function getAppActions() {
  return axios.get(serveUrl.getAppActions)
}

/**
 * 获取已有按钮权限
 * @param data
 */
export function getAppBtnAuth(data) {
  return axios.post(serveUrl.getAppBtnAuth, data)
}


/**
 * 获取App列表
 * @param param
 * @constructor
 */
export function getApp(param = '') {
  return axios.get(serveUrl.getApp + param);
}

/**
 * 查询是否有权限操作
 * @param param
 * @constructor
 */
export function checkAuth(param = '') {
  return axios.get(serveUrl.checkAuth + param);
}

/**
 * 查询用户
 * @param data
 * @returns {*}
 */
export function searchUsers(data) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.searchUsers,
    data: data
  });

}

/**
 * 获取用户列表
 * @param param
 * @returns {*}
 */
export function getUsers(param) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.getUsers + param
  });

}

/**
 * 分配权限
 * @param data
 * @returns {*}
 */
export function assignAuth(data) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.assignAuth,
    data: data
  });

}

/**
 * 修改权限
 * @param data
 * @returns {*}
 */
export function modifyAuth(data) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.modifyAuth,
    data: data
  });

}

/**
 * 删除权限
 * @param param
 * @returns {*}
 */
export function deleteAuth(param) {

  return axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.deleteAuth + param
  });

}


