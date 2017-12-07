import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
    getList: '/md-cms/api/v1/public/list',
    getDetail: '/md-cms/api/v1/public/detail',
    edit: '/md-cms/api/v1/public/edit',
    update: '/md-cms/api/v1/public/update'

};

const headers = { "Content-Type": 'application/json'};

export function getList(callback) {
    axios({
        method: 'GET',
        headers: headers,
        url: serveUrl.getList
    })
        .then(function (response) {
            if(callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            console.log(err);
            Message.create({content: '读取镜像列表失败！', color: 'danger', duration: null})
        });
}

export function getDetail(param, callback) {
    axios({
        method: 'GET',
        headers: headers,
        url: serveUrl.getDetail + param
    })
        .then(function (response) {
            if(callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            console.log(err);
            Message.create({content: '读取镜像详情失败！', color: 'danger', duration: null})
        });
}

export function getEdit(param, callback) {
    axios({
        method: 'GET',
        headers: headers,
        url: serveUrl.edit + param
    })
        .then(function (response) {
            if(callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            console.log(err);
            Message.create({content: '获取MD文档信息失败！', color: 'danger', duration: null})
        });
}

export function upDate(data, callback) {
    axios({
        method: 'POST',
        headers: headers,
        url: serveUrl.update,
        data: data
    })
        .then(function (response) {
            if(callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            console.log(err);
            Message.create({content: '更新MD文档信息失败！', color: 'danger', duration: null})
        });
}