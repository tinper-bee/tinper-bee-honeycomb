import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  sentShotMsg: '/accesscenter/web/v1/access/sendShortMsg/',
  DeleteAccess: '/accesscenter/web/v1/access/deleteAccess/',
  AccessList: '/accesscenter/web/v1/access/queryUserAccess',
  ForbidAccess:'/accesscenter/web/v1/access/updateEnable',
  CreateAccess:'/accesscenter/web/v1/access/registAccess',
  //ValidateUser: '/accesscenter/web/v1/access/checkOpRight',
  ValidateUser: '/accesscenter/web/v1/access/checkOpPermission',
  GetIdentifyCode: '/accesscenter/web/v1/access/getValidateCode',
  getSecret: '/accesscenter/web/v1/access/getSecret/',
  getPhoneNum: '/accesscenter/web/v1/access/getMobile',
  EditAccessServe:'/accesscenter/web/v1/access/updateDesc/'
}
export function GetSecret(param,callback) {
  axios.get(serveUrl.getSecret+param.accessKey+"?messageCode="+param.messageCode)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log("error");
    });
}

export function SendShortMsg(callback) {
  axios.get(serveUrl.sentShotMsg)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log("error");
    });
}
export function getPhoneNum(callback) {
  axios.get(serveUrl.getPhoneNum)
      .then(function (response) {
        if(callback) {
          callback(response);
        }
      })
      .catch(function (err) {
        console.log("error");
      });
}
export function DeleteAccessServe(param,callback) {
  axios.delete(serveUrl.DeleteAccess+param.accessKey+'?messageCode='+param.messageCode)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      Message.create({content: '删除失败', color: 'danger',duration:1})
      console.log("error");
    });
}

export function ForbidAccessServe(param,callback) {
  axios.post(serveUrl.ForbidAccess,param)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      Message.create({content: '禁止失败', color: 'danger',duration:1})
      console.log("error");
    });
}

export function AccessListServe(callback) {
  axios.get(serveUrl.AccessList)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      Message.create({content: '列表获取失败', color: 'danger',duration:1})
    });
}

export function CreateAccessServe(param,callback) {
  axios.post(serveUrl.CreateAccess,param)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {

      //Message.create({content: '创建失败', color: 'danger',duration:1})
      console.log("error");
    });
}
export function ValidateUser(param,callback) {
  axios.post(serveUrl.ValidateUser,param)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      Message.create({content: '验证失败', color: 'danger',duration:1})
      console.log("error");
    });
}

/**
 * 添加编辑描述的接口
 */
export function EditAccessServe(param,callback) {
  axios.get(serveUrl.EditAccessServe+param.accessKey+"?description="+param.description)
    .then(function (response) {
      if(callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      Message.create({content: '修改失败', color: 'danger',duration:1})
      console.log("error");
    });
}
