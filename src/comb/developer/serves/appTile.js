import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const localUrl = {
  publishLogs: '/uploadlist/',
  versionList: '/posts/',
  configTime: '/status',
  getStatus: '/peizhitime',
  uploadProgress: '/uploadprogress'
}

const serveUrl = {
      logDetail:'/cloudtest/boot_testlog/getLogImage',
      deleteJobCase:'/cloudtest/boot_testjob/deleteJobCase/',
      downloadBefore:'/cloudtest/boot_testscript/downloadBefore',
      judgeUpdateAuth:'/cloudtest/boot_testjob/updataBefore',
      viewTestJob:'/cloudtest/boot_testjob/detail/',
      viewTestReport:'/cloudtest/boot_testreport/queryLatestTestReport/',
      viewTestLog:'/cloudtest/boot_testlog/queryLatestTestLog/',
      executeJob:'/cloudtest/boot_testjob/executeJob/',
      executeJobBefore:'/cloudtest/boot_testjob/executeJobBefore/',
      getTestJob:'/cloudtest/boot_testjob/testjob',
      saveTestJob:'/cloudtest/boot_testjob/saveTestJobCase',
      registerApp: '/cloudtest/boot_product/saveProduct2post',
      getOwnerCase:'/cloudtest/boot_testcase/testcase',
      judgeUpdateAuth:'/cloudtest/boot_testscript/updateBefore',
      getOwnerScript:'/cloudtest/boot_testscript/testscript',
      deleteTestJob:'/cloudtest/boot_testjob/deleteTestJob',
      testCase:"/cloudtest/boot_testscript/testscript",
      downloadScript:"/cloudtest/boot_testscript/download",
      addSaveScript:'/cloudtest/boot_testscript/save',
      viewScriptRow: "/cloudtest/boot_testscript/detail/",
      freeTime: "/app-manage/v1/host/free",
      getAppUploadLogByAppUploadId: "/app-upload/web/v1/log/getAppUploadLogByAppUploadId",
      deleteAppUploadLog: "/app-upload/web/v1/log/deleteAppUploadLog",
      appUploadLogList: '/app-upload/web/v1/log/appUploadLogList',
      repealAppAliOssUpload: '/app-upload/web/v1/upload/repeatAppAliOssUpload',
      runLogs: '/runtime-log/searchlog/v1/search/logs',
      getListenRange: '/app-manage/v1/app/monitor',
      autoScale: '/app-manage/v1/app/autoscale/',
      convertapp: '/app-approve/api/v1/approve/convertapp',
      containerId: '/app-manage/v1/app/task/container',
      startup: 'http://10.3.15.189:30001/startup/10.3.15.189:',
      imageInfoByName: '/app-docker-registry/api/v1/info',
      deleteUploadApp: '/app-upload/web/v1/upload/deleteAppUpload',
      canSale: '/app-approve/web/v1/approve/canSale',
      newUploadDetail: '/app-upload/web/v1/upload/getAppUploadByAppUploadId',
      newPublishDetail: '/app-manage/v1/apps/',
      uploadProgress: '/app-upload/web/v1/upload/uploadProgress',
      readFile: '/app-manage/v1/app/task/read_file',
      publishLogs: '/searchlog/v1/search/logs',
      appDelete: '/app-manage/v1/app/tasks/delete',
      appRestart: '/app-manage/v1/app/restart/',
      appDestory: '/app-manage/v1/app/destroy/',
      appScale: '/app-manage/v1/app/scale/',
      getUploadList: '/app-upload/web/v1/upload/list',
      getPublishList: '/app-manage/v1/apps',
      configTime: '/status',
      publish: '/app-publish/web/v1/publish/do',
      public_console: '/app-publish/web/v1/log/tail',
      getStatus: '/app-approve/web/v1/approve/getStatusList',
      publishDetailTask: '/app-manage/v1/app/tasks/',
      publishDetailDebug: '/app-manage/v1/app/debug/',
      errorTargerList: '/app-manage/v1/app/completed_tasks',
      perOperaList: '/app-manage/v1/app/event',
      publishDetailVerionList: '/app-manage/v1/app/versions/',
      upDatePublicTime: '/app-upload/web/v1/upload/updatePublishTime',
      upDateConfigInfo: '/app-manage/v1/apps/',
      downloadWar: '/app-upload/web/v1/upload/appDownload',
      hosts: '/app-manage/v1/hosts',
      getResPool: '/res-pool-manager/v1/resource_pool/monitor',
      getResPoolInfo: '/res-pool-manager/v1/resource_nodes/hostsmonitor',
      noticeStart: '/app-publish/web/v1/publish/callback',
      getGroupAppList: '/app-manage/v1/group/apps',
      updateGroup: '/app-manage/v1/app/group',
      getConfig: '/app-upload/web/v1/confcenter/extractConf',
      saveConfig: '/app-upload/web/v1/confcenter/callConfCenter',
      checkConfig: '/app-upload/web/v1/confcenter/checkConf',
      searchApp: '/app-manage/v1/app/name?app_names='
}

const headers = {"Content-Type": 'application/json'};
/**
 * 执行脚本前改变执行状态
 * @param param
 */
export function executeJobBefore(param, executeTime){
  return axios.post(serveUrl.executeJobBefore + param+ `?executeTime=${executeTime}`)
}
/**
 * 下载脚本模板前判断
 * @param param
 */
export function downloadBefore(){
    return axios.get(serveUrl.downloadBefore)
}
/**
 * 查看测试任务
 * @param param
 */
export function viewTestJob(param){
    return axios.get(serveUrl.viewTestJob + param)
}

/**
 * 编辑任务前查看修改权限
 * @param param
 */
export function judgeUpdateAuth(data){
    return axios.post(serveUrl.judgeUpdateAuth, data)
}
/**
 * 查看测试报告
 * @param param
 */
export function viewTestReport(param){
    return axios.get(serveUrl.viewTestReport + param)
}

/**
 * 查看测试日志
 * @param param
 */
export function viewTestLog(param){
    return axios.get(serveUrl.viewTestLog + param)
}
/**
 * 查看错误日志文件
 * @param param
 */
export function logDetail(param){
    return axios.get(serveUrl.logDetail +`?logfileId=${param}`)
}

/**
 * 获取当前租户下的测试用例列表
 * @param param
 */
export function getCaseList(param){
    return axios.get(serveUrl.getOwnerCase + param)
}

/**
 * 用例反选时删除任务与用例的关系
 * @param param
 */
export function deleteJobCase(param,data){
   // return axios.post(serveUrl.deleteJobCase + param +`?jobCaseId=${data}`)
  return axios({
    method: 'post',
    url: serveUrl.deleteJobCase + param,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: `data=${JSON.stringify(data)}`
  })
}

/**
 * 新建测试任务
 * @param param
 */
export function saveJob(param){
    return axios.post(serveUrl.saveTestJob, param)
}

/**
 * 执行测试任务
 * @param param
 */
export function executeJob(param,executeTime){
    return axios.post(serveUrl.executeJob + param+ `?executeTime=${executeTime}`)
}

/**
 * 获取当前租户下的测试任务列表
 * @param param
 */
export function getJobList(param){
    return axios.get(serveUrl.getTestJob + param  )
}



/**
 * 生成用例
 * @param param
 */
export function GenerCase(param){
    return axios.post(serveUrl.testCase + param)
}


/**
 * 删除任务
 * @param param
 */
export function deleteTestJob(data){

    return axios({
        method: 'post',
        url: serveUrl.deleteTestJob,
        headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
        data: `data= [${JSON.stringify(data)}]`
    })
   // return axios.post(serveUrl.deleteTestJob, data)
}
/**
 * 批量删除任务
 * @param param
 */
export function deleteTestJobBatch(data){

  return axios({
    method: 'post',
    url: serveUrl.deleteTestJob,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: data
  })
}

/**
 * 更新脚本前判断是否有更新权限
 * @param param
 */
export function JudgeUpdateAuth(){
    return axios.post(serverUrl.judgeUpdateAuth , param);
}


/**
 * 获得用户的脚本列表
 * @param param
 */
export function GetOwnerScript(param){
    return axios.get(serveUrl.getOwnerScript + param)
}



/**
 * 下载脚本
 * @param param
 */
export function DownloadScript(param){
  return axios.get(serveUrl.downloadScript + param);
}


/**
 * 查看脚本详细信息
 * @param param
 */
export function ViewScriptRow(param){
return axios.get(serveUrl.viewScriptRow + param);
}


/**
 * 获取带分组的app列表
 * @param param
 */
export function getGroup (param = ''){
  return axios.get(serveUrl.getGroupAppList + param)
}

/**
 * 应用部署后启动完成时的后台通知
 * @param param 参数
 * @param callback 回调函数
 * @constructor
 */
export function NoticeStart(param, callback) {
  axios.get(serveUrl.noticeStart + param).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
  });
}

export function GetFreeTime(app_id, callback) {
  axios.get(serveUrl.freeTime + `?app_id=${app_id}`).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
  });
}

export function OngetAppUploadLogByAppUploadId({appUploadId, buildVersion}, callback) {
  axios.get(serveUrl.getAppUploadLogByAppUploadId + `?appUploadId=${appUploadId}&buildVersion=${buildVersion}`).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
  });
}


export function OndeleteAppUploadLog(param, callback) {
  axios.delete(serveUrl.deleteAppUploadLog + `?appUploadId=${param.appUploadId}&buildVersion=${param.buildVersion}&allBuildVersion=${param.allBuildVersion}`).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
  });
}


/**
 * 获取版本列表
 * @param callback
 * @constructor
 */
export function GetVersionList(param, callback) {
  axios.get(serveUrl.appUploadLogList + `?appUploadId=${param}`).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
  });
}



/**
 * 获取可用资源池
 * @param callback
 * @constructor
 */
export function GetResPool(callback) {
  axios.get(serveUrl.getResPool).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

/**
 * 获取可用资源池详情
 * @param callback
 * @constructor
 */
export function GetResPoolInfo(callback) {
  axios.get(serveUrl.getResPoolInfo).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

export function GetListenRange(param, callback) {
  let getParam;
  if (param.duration) {
    getParam = "app_id=" + param.app_id + "&duration=" + param.duration;
  } else {
    getParam = "app_id=" + param.app_id;
  }
  axios.get(serveUrl.getListenRange + "?" + getParam).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}
export function OpenAutoScale(param, data, callback) {
  axios.post(serveUrl.autoScale + param, data)
      .then(function (response) {
        if (callback) {
          callback(response);
        }
      })
      .catch(function (err) {
        console.log(err);
        //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
      });
}

export function CloseAutoScale(param, callback){
  axios.delete(serveUrl.autoScale + param)
      .then(function (response){
        if (callback instanceof Function) {
          callback(response)
        }
      }).catch(function (err) {
        console.log(err);
        // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
      });
}
export function GetAutoScale(param,callback){
  axios.get(serveUrl.autoScale + param)
      .then(function(response){
      if (callback instanceof Function) {
        callback(response)
      }
    }).catch(function (err) {
      console.log(err);
      // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}


export function GetConvertapp(param, callback) {
  return axios.post(serveUrl.convertapp, param);
}




export function GetContainerId({app_id, task_id}, callback) {
  axios.get(serveUrl.containerId + '?app_id=' + app_id + "&task_id=" + task_id).then(function (response) {
    if (callback instanceof Function) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });

}

export function StartUp(port, containerId, callback) {

  let url = `http://10.3.15.189:${port}/startup/10.3.15.189:${port}:${containerId}`;

  axios({
    method: 'GET',
    headers: headers,
    url: url,
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }

    })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}


export function getImageInfoByName(param, callback) {
  axios.get(serveUrl.imageInfoByName + '?imageName=' + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

export function GetHost(callback) {
  axios.get(serveUrl.hosts).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}


export function DeleteUploadApp(param, callback) {
  axios.delete(serveUrl.deleteUploadApp + '?appUploadId=' + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

export function GetCanSale(callback) {
  axios.get(serveUrl.canSale).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

export function GetNewUploadDetail(param, callback) {
  axios.get(serveUrl.newUploadDetail + '?appUploadId=' + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  })
}

export function GetNewPublishDetail(param = '') {

  return axios.get(serveUrl.newPublishDetail + param);
}
export function GetUploadProgress(appUploadId, buildVersion) {
  return axios.get(serveUrl.uploadProgress + `?appUploadId=${appUploadId}&buildVersion=${buildVersion}`);
}

export function PublishReadFile(param, callback) {
  return axios.post(serveUrl.readFile, param);
}

export function RunLogs(param, callback) {
  axios.post(serveUrl.runLogs, param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    debugger;
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  })
}
export function AppDelete(param, callback) {
  axios.post(serveUrl.appDelete, param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  })
}

export function AppRestart(param, callback) {
  axios.post(serveUrl.appRestart + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    // Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  })
}

export function AppDestory(param, callback) {
  axios.delete(serveUrl.appDestory + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

export function AppScale({id, instances}, callback) {
  axios.put(serveUrl.appScale + id + '?instances=' + instances).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  });
}

export function GetVersions(param, callback) {
  axios.get(serveUrl.publishDetailVerionList + param).then(function (response) {
    if (callback) {
      callback(response);
    }
  })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}

export function GetVersionDetail({id, version}, callback) {
  axios.get(serveUrl.publishDetailVerionList + id + '/' + version).then(function (response) {
    if (callback) {
      callback(response);
    }
  })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}


export function GetPublishDetailDebug(param, callback) {
  axios.get(serveUrl.publishDetailDebug + param).then(function (response) {
    if (callback) {
      callback(response);
    }
  })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}

/**
 *
 * 事件见面的人员操作列表显示
 * @param param
 * @param callback
 * @constructor
 */
export function GetPerOperaList(param, callback){
  axios.get(serveUrl.perOperaList + "?offer=" + param.offer + "&offer_id=" + param.offer_id + "&page=" + param.pageIndex + "&limit=" + param.limit + "&start_time=" + param.stime).then(function (res){
    if(callback){
      callback(res);
    }
  })
  .catch(function(err){
      console.log(err);
    });
}

/**
 *
 * 事件界面的错误任务列表显示
 * @param param
 * @param callback
 * @constructor
 */
export function GetErrorTargerList(param, callback) {
  axios.get(serveUrl.errorTargerList + "?app_id=" + param.id + "&page=" + param.pageIndex + "&limit=" + param.pageSize).then(function (response) {
    if (callback) {
      callback(response);
    }
  })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}

export function GetUploadList() {

  //return axios.get(localUrl.getUploadList)
  return axios.get(serveUrl.getUploadList)

}
export function GetPublishList(param = '') {
  //return axios.get(localUrl.getPublishList)
  return axios.get(serveUrl.getPublishList + param)
}
export function GetConfigTime(callback) {
  return axios.get(serveUrl.configTime)
}

export function Public(data, param, callback) {

  axios({
    method: 'PUT',
    headers: headers,
    url: serveUrl.publish + param,
    data: JSON.stringify(data)
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}



export function GetConsole(params, callback) {
  var _timestamp;
  axios.get("/path/to/server?timestamp=" + timestamp)
    .done(function (res) {
      try {
        var data = JSON.parse(res);

        _timestamp = data.timestamp;
      } catch (e) {
      }
    })
    .always(function () {
      setTimeout(function () {
        GetConsole(_timestamp || Date.now() / 1000);
      }, 10000);
    });
}

export function GetStatus(param) {
  return axios.post(serveUrl.getStatus + `?${param}`)
}


export function GetPublishDetailTask(param) {
  return axios.get(serveUrl.publishDetailTask + param)
}






export function UpdatePublishTime(param, callback, errCallback) {
  axios.put(`${serveUrl.upDatePublicTime}${param}`)
    .then(function (res) {
      if (res.status == '200') {
        callback(res);
      } else {
        Message.create({content: '获取上传信息失败', color: 'danger'});
      }
    })
    .catch(function (err) {
      console.log(err);
      errCallback && errCallback(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    })
}


export function GetConfigInfo(param, callback) {
  axios.get(`${serveUrl.upDateConfigInfo}${param}`)
    .then(function (res) {
      if (res.status == '200') {
        callback(res);
      } else {
        Message.create({content: '获取配置信息失败', color: 'danger'});
      }
    })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    })
}

export function UpdateConfig(data, param, callback) {

  axios({
    method: 'PUT',
    headers: headers,
    url: serveUrl.upDateConfigInfo + param,
    data: JSON.stringify(data)
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}

export function DownloadWar(param, callback) {

  axios({
    method: 'GET',
    headers: headers,
    url: serveUrl.downloadWar + param
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }
    })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });

}


/**
 * 保存提取得配置文件列表
 * @param param
 * @param data
 * @param callback
 * @constructor
 */
export function SaveConfigFile(param, data, callback) {


  axios({
    method: 'POST',
    headers: headers,
    url: serveUrl.saveConfig + '?confCenterId=' + param,
    data: data
  })
    .then(function (response) {
      if (callback) {
        callback(response);
      }

    })
    .catch(function (err) {
      console.log(err);
      //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
    });
}

/**
 * 校验配置文件是否可提取
 * @param param
 * @param callback
 * @constructor
 */
export function CheckConfigIsable(param, callback) {
  axios.get(serveUrl.checkConfig + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  })
}

/**
 * 获取配置文件列表
 * @param param
 * @param callback
 * @constructor
 */
export function GetConfigFile(param, callback) {
  axios.get(serveUrl.getConfig + '?confCenterId=' + param).then(function (response) {
    if (callback) {
      callback(response)
    }
  }).catch(function (err) {
    console.log(err);
    //Message.create({ content: '服务器出错，请联系管理员。', color: 'danger', duration: null });
  })
}



/**
 * 更新group分组名称
 * @param data 格式{group_is:'', group_name:''}
 */
export function updateGroup(data) {

  return axios.put(`${serveUrl.updateGroup}`, data)
}


/**
 * 创建group分组名称
 * @param data 格式{group_is:'', group_name:''}
 */
export function createGroup(data) {

  return axios.post(`${serveUrl.updateGroup}`, data)
}

/**
 * 删除group分组
 * @param id 分组的id
 * @param force 为false时删除分组下应用
 */
export function deleteGroup(id, force = true) {

  return axios.delete(`${serveUrl.updateGroup}/${id}?force=${force}`)
}

/**
 * 按照名字搜索应用
 * @param name
 * @param envType
 */
export function searchAppByName (name,envType) {
  return axios.get(serveUrl.searchApp + name + `&envType=${envType}`)
}

/**
 * 部署应用时推送
 * @param data
 * @returns {*}
 */
export function registerApp (data) {
  return axios.post(serveUrl.registerApp, data);
}
