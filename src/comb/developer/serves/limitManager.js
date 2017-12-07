import React, { Component } from 'react';
import axios from 'axios';
import { Message } from 'tinper-bee';

const { CancelToken } = axios;

const serveUrl = {
  getUser: '/portal/web/v1/userres/query',
  inviteUser: '/portal/web/v1/userres/menu/invit',
  deleteUser: '/portal/web/v1/userres/delete',
  getMenu: '/portal/web/v1/userres/listprv',
  searchUsers: '/portal/web/v1/userres/search'
}

const headers = { "Content-Type": 'application/json' };

export function GetMenuList(callback) {
  axios.get(serveUrl.getMenu)
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({ content: "请求失败", color: 'danger', duration: null });
    });
}
export function GetUser(param, callback) {
  axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.getUser,
    data: param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({ content: "请求失败", color: 'danger', duration: null });
    });
}
export function InviteUser(param, callback) {
  axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.inviteUser+`?invitation=${param.invitation}`,
    data:param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({ content: "请求失败", color: 'danger', duration: null });
    });
}
export function DelteUser(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.deleteUser + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({ content: "请求失败", color: 'danger', duration: null });
    });
}

export function searchUsers(param, cancelHandler) {
  const sendData = {
    pageIndex: param.index,
    pageSize: param.size,
    key: 'invitation', //never change in this api
    val: param.value
  }
  return axios.post(serveUrl.searchUsers, sendData, {
    cancelToken: new CancelToken(function (c) {
      cancelHandler = c;
    })
  })
    .then(res => {
      return res.data;
    })
    .then(res => {
      if (res['status'] != 1 || res['error_code']) {
        throw Error(res['error_message'] || res['message']);
      }
      return res['data'];
    })
    .catch(err => {
      // Message.create({ content: err.message || '请求发送失败', color: 'danger', duration: null });
      return {
        content: [],
        totalElement: 0,
        totalPages: 0,
        pageIndex: 0,
        pageSize: 0
      }
    })
}
