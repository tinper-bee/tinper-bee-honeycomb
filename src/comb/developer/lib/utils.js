/**
 * 存放业务公用方法
 */
import {
  DownloadWar,
} from 'serves/appTile';

import { err } from 'components/message-util';

export const handleDownload = name => () => {
  if(!name)return;
  if (/http[s]?:\/\//.test(name)) {
    return window.location.href = name;
  }
  DownloadWar(`?uploadPath=${escape(name)}`, (res) => {
    let data = res.data;
    if(data.error_code){
      return err(`${data.error_code}:${data.error_message}`)
    }
    var a = document.createElement('a');
    a.href = "https://" + data;
    a.download = name;
    return window.location.href = "https://" + data;
    //解决点击下载浏览器兼容问题，因为需要后台返回下载地址，所以不使用a标签
    var userAgent = navigator.userAgent.toLowerCase();

    if (/(firefox)\/([\w.]+)/.test(userAgent)) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);
      a.dispatchEvent(evt);
    } else if (/msie/.test(userAgent)) {
      document.location = "http://" + data;
    } else {

      a.click();
    }

  })
}

export const convertToFormData = (obj) => {
  let formData = new FormData();
  for (let key in obj) {
    formData.append(key, obj[key])
  }
  return formData;
}
