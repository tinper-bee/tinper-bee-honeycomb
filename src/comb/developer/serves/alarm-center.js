import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  isResMonitor:'/res-alarm-center/v1/service/ismonitor',
  getAlarmList: '/res-alarm-center/v1/alarm/list',
  getUserInfo:'/res-alarm-center/v1/contact/self',
  updataUserInfo:'/res-alarm-center/v1/contact',
  addResAlarm: '/res-alarm-center/v1/service/resourcepool',
  addResAlarmGroup: '/res-alarm-center/v1/service/resourcepools',
  deleteResAlarm: '/res-alarm-center/v1/service/resourcepool/',
  getResAlarmInfo: '/res-alarm-center/v1/service/resourcepool?respoolid=',
  addAppAlarm: '/res-alarm-center/v1/service/app',
  addAppAlarmGroup: '/res-alarm-center/v1/service/apps',
  addServiceAlarm:'/res-alarm-center/v1/service/api',
  getAppAlarmInfo: '/res-alarm-center/v1/service/app?appid=',
  deleteAppAlarm: '/res-alarm-center/v1/service/app/',
  getResAlarm: '/res-alarm-center/v1/service/resourcepool',
  getAppAlarm: '/res-alarm-center/v1/service/app',
  getServiceAlarm: '/res-alarm-center/v1/service/api',
  getServiceAlarmInfo: '/res-alarm-center/v1/service/api?serviceid=',
  deleteServiceAlarm: '/res-alarm-center/v1/service/api/',
  getApps: '/app-manage/v1/apps/owner',
  getUser: '/res-alarm-center/v1/contact',
  checkAuth: '/res-alarm-center/v1/service/isowner',
  getResContacts:'/res-alarm-center/v1/contact/users?ids=',
  testConn: '/res-alarm-center/v1/service/testconn'
}

const headers = {"Content-Type": 'application/json'};
/**
 * 获取是否已开启报警的信息
 */
export function isResMonitor(param1, param2){
  return axios.get(serveUrl.isResMonitor + `?resid=${param1}&type=${param2}`)
}

/**
 * 获取报警列表
 */
export function getAlarmList(param) {
  return axios.get(serveUrl.getAlarmList + param)
}

/**
 * 获取本人联系信息
 */
export function getUserInfo() {
  return axios.get(serveUrl.getUserInfo)
}
/**
 * 修改本人联系信息
 */

export function updataUserInfo(urlId,param) {
  return axios.put(`${serveUrl.updataUserInfo}/${urlId}`, param)
}

/**
 * 增加资源池报警
 * @param param formdata
 * {ResourcePoolId:1  （资源池id）
 * ResourcePoolName:体验资源池1 （资源池名称）
 * Contacts:1  （报警联系人id）Interval:60  （监控间隔秒）
 * AlarmInterval:300  （报警间隔秒）}
 */
export function addResAlarm(param) {
  return axios.post(serveUrl.addResAlarm, param)
}

/**
 * 增加资源池报警
 * @param param formdata
 * {ResourcePoolId:1  （资源池id）
 * ResourcePoolName:体验资源池1 （资源池名称）
 * Contacts:1  （报警联系人id）Interval:60  （监控间隔秒）
 * AlarmInterval:300  （报警间隔秒）}
 */
export function addResAlarmGroup(param) {
  return axios.post(serveUrl.addResAlarmGroup, param)
}

/**
 * 查询资源池报警设置
 * @param resId
 */
export function getResAlarmInfo(resId){
  return axios.get(`${serveUrl.getResAlarmInfo}${resId}`)
}

/**
 * 删除资源池报警设置
 * @param resId
 */
export function deleteResAlarm(resId){
  return axios.delete(`${serveUrl.deleteResAlarm}${resId}`)
}

/**
 * 获取资源池报警列表
 */
export function getResAlarm(){
  return axios.get(serveUrl.getResAlarm)
}

/**
 * 获取app列表
 */
export function getApps() {
  return axios.get(serveUrl.getApps)
}

/**
 * 增加应用报警
 * @param param formdata
 * {AppId:3
 * MarathonId:/isv-apps/35568e76-1ef1-4d77-b5cf-8fb66d2c8002/j30hrksi
 * AppName:应用定时轮询2Contacts:2
 * Interval:30
 * AlarmInterval:300}
 */
export function addAppAlarm(param) {
  return axios.post(serveUrl.addAppAlarm, param);
}

/**
 * 增加应用报警
 * @param param formdata
 * {AppId:3
 * MarathonId:/isv-apps/35568e76-1ef1-4d77-b5cf-8fb66d2c8002/j30hrksi
 * AppName:应用定时轮询2Contacts:2
 * Interval:30
 * AlarmInterval:300}
 */
export function addAppAlarmGroup(param) {
  return axios.post(serveUrl.addAppAlarmGroup, param);
}

/**
 * 查询应用报警设置
 * @param appId
 */
export function getAppAlarmInfo(appId){
  return axios.get(`${serveUrl.getAppAlarmInfo}${appId}`)
}

/**
 * 删除应用报警设置
 * @param appId
 */
export function deleteAppAlarm(appId){
  return axios.delete(`${serveUrl.deleteAppAlarm}${appId}`)
}

/**
 * 获取应用报警列表
 */
export function getAppAlarm(){
  return axios.get(serveUrl.getAppAlarm)
}

/**
 * 增加服务报警
 * @param param formdata
 * {AppId:3
 * MarathonId:/isv-apps/35568e76-1ef1-4d77-b5cf-8fb66d2c8002/j30hrksi
 * AppName:服务定时轮询2Contacts:2
 * Interval:30
 * AlarmInterval:300}
 */
export function addServiceAlarm(param) {
  return axios.post(serveUrl.addServiceAlarm, param);
}

/**
 * 获取服务报警列表
 */
export function getServiceAlarm(){
  return axios.get(serveUrl.getServiceAlarm)
}

/**
 * 查询应用报警设置
 * @param appId
 */
export function getServiceAlarmInfo(serviceId){
  return axios.get(`${serveUrl.getServiceAlarmInfo}${serviceId}`)
}

/**
 * 删除服务报警设置
 * @param serviceId
 */
export function deleteServiceAlarm(serviceId){
  return axios.delete(`${serveUrl.deleteServiceAlarm}${serviceId}`)
}

deleteServiceAlarm

/**
 * 获取租户下所有联系人信息
 * @param providerId
 */
export function getUser(providerId){
  return axios.get(`${serveUrl.getUser}${providerId}`)
}


/**
 * 获取资源池报警通知人
 * @param id
 */
export function getResContacts(id){
  return axios.get(`${serveUrl.getResContacts}${id}`)
}

/**
 * 校验是否有权限
 * @param param
 */
export function checkAlarmAuth(param) {
  return axios.get(`${serveUrl.checkAuth}${param}`)
}

/**
 * 测试连接
 * @param param
 */
export function testConn(param) {
  return axios.post(serveUrl.testConn, param);
}
