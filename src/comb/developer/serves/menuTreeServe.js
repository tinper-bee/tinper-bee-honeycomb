import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  getMenuList: '/portal/web/v1/menu/list',
  searchMenu: '/portal/web/v1/menu/query',
  getDetail:'/portal/web/v1/menu/detail',
  addMenu:'/portal/web/v1/menu/save',
  editMenu:'/portal/web/v1/menu/update',
  deleteMenu:' /portal/web/v1/menu/delete',
}

const headers = { "Content-Type": 'application/json'};

export function GetMenuList(callback) {
  axios.get(serveUrl.getMenuList)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({ content: '服务器错误，请联系管理员', color: 'danger', duration: null})
    });
}
export function AddMenu(param,callback) {
    axios({
        method: 'POST',
        headers: headers,
        url: serveUrl.addMenu,
        data: param
    })
      .then(function (response) {
        if(callback) {
          callback(response);
        }
      })
      .catch(function (err) {
        console.log(err);
          Message.create({ content: '服务器错误，请联系管理员', color: 'danger', duration: null})
      });
}


export function DeleteMenu(param,callback) {
  axios.get(serveUrl.deleteMenu + param)
      .then(function (response) {
        if(callback) {
          callback(response);
        }
      })
      .catch(function (err) {
        console.log(err);
          Message.create({ content: '服务器错误，请联系管理员', color: 'danger', duration: null})
      });
}


export function EditMenuInfo(param,callback) {
    axios({
        method: 'POST',
        headers: headers,
        url: serveUrl.editMenu,
        data: param
    })
        .then(function (response) {
            if(callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            console.log(err);
            Message.create({ content: '服务器错误，请联系管理员', color: 'danger', duration: null})
        });
}

export function SearchMenu(param,callback) {
    axios({
        method: 'POST',
        headers: headers,
        url: serveUrl.searchMenu,
        data: param
    })
        .then(function (response) {
          if(callback) {
            callback(response);
          }
        })
        .catch(function (err) {
          console.log(err);
            Message.create({ content: '服务器错误，请联系管理员', color: 'danger', duration: null})
        });
}
