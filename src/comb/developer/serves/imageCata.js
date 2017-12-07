import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  getOwnerImageList: '/app-docker-registry/api/v1/private/catalog',
  getTagImageList: '/app-docker-registry/api/v1/private/tags',
  getImageInfo: '/app-docker-registry/api/v1/private/detail',
  delete: '/app-docker-registry/api/v1/private/delete',
  deleteTag: '/app-docker-registry/api/v1/private/empty',
  getPublicImageList: '/app-docker-registry/api/v1/public/catalog',
  getPubImageTag: '/app-docker-registry/api/v1/public/tags',
  getPubImageInfo: '/app-docker-registry/api/v1/public/detail',
  getTag: '/app-docker-registry/api/v1/private/version',
  getInfo: '/app-docker-registry/api/v1/public/info',
  getConfig: '/app-docker-registry/api/v1/public/config',
  checkImgAuth: '/app-docker-registry/api/v1/private/owner?id=',
  deleteAppImage: '/app-docker-registry/api/v1/private/deleteAppImage',

}

const headers = {"Content-Type": 'application/json'};
export function deleteAppImage(param){
  axios.delete(serveUrl.deleteAppImage + param)
}

export function getInfo(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getInfo + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取镜像详情失败！', color: 'danger', duration: null})
    });
}
export function getConfig(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getConfig + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取镜像配置详情失败！', color: 'danger', duration: null})
    });
}

export function getTags(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getTag + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取版本列表失败！', color: 'danger', duration: null})
    });
}

export function getOwnerImage(param) {
  return axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getOwnerImageList + param
  })
}

export function getPublicImage(callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getPublicImageList
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取列表失败！', color: 'danger', duration: null})
    });
}
export function getImageTag(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getTagImageList + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取列表失败！', color: 'danger', duration: null})
    });
}

export function deleteImage(param, callback) {
  axios({
    method: 'DELETE',
    headers: headers,
    url: serveUrl.delete + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '删除失败！', color: 'danger', duration: null})
    });
}

export function deleteImageTag(param, callback) {
  axios({
    method: 'DELETE',
    headers: headers,
    url: serveUrl.deleteTag + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '删除失败！', color: 'danger', duration: null})
    });
}

export function getImageInfo(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getImageInfo + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取列表失败！', color: 'danger', duration: null})
    });
}

export function getPubImageTag(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getPubImageTag + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取列表失败！', color: 'danger', duration: null})
    });
}
export function getPubImageInfo(param, callback) {
  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.getPubImageInfo + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      Message.create({content: '读取列表失败！', color: 'danger', duration: null})
    });
}

/**
 * 校验是否有权限
 * @param param
 */
export function checkImgAuth(param) {
  return axios.get(serveUrl.checkImgAuth + param)
}
