import { Message } from 'tinper-bee'
export function dateFormat(data, fmt) {
  var o = {
    "M+": data.getMonth() + 1,                 //月份
    "d+": data.getDate(),                    //日
    "h+": data.getHours(),                   //小时
    "m+": data.getMinutes(),                 //分
    "s+": data.getSeconds(),                 //秒
    "q+": Math.floor((data.getMonth() + 3) / 3), //季度
    "S": data.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
   * 验证实例的状态，只有运行的时候，才可以进行跳转
   */
export function veredirect(rec) {
   return function(evt) {
       if(rec.insStatus.indexOf("Running")==-1){
         evt.preventDefault();
         Message.create({
            content: '请等待应用运行后，再进行访问',
            color: 'danger',
            duration: 3
          });
       }
     
     }
}

export function parseQuery(search = '', sp = '&') {
  if (typeof search === 'object') {
    return search;
  }
  if (search[0] === '?') {
    search = search.slice(1);
  }
  let ret = {};
  search = decodeURIComponent(search);
  search.split(sp).forEach(item => {
    let pair = item.split('=');
    ret[pair[0]] = pair[1];
  })
  return ret;
}

export function randomString(len) {
  const LN = [];

  // 大写字母、小写字符和数字
  for (let i = 0; i < 26; i++) {
    LN.push(String.fromCharCode(i + 97));
    LN.push(String.fromCharCode(i + 65));
    if (i < 10) {
      LN.push(String(i));
    }
  }

  // 特殊字符
  const specialChars = '_';

  const charStr = LN.join('') + specialChars;

  const charLen = charStr.length;

  let passwd = [];
  for (let i = 0; i < len; i++) {
    let index = Math.round(Math.random() * charLen);

    passwd.push(charStr[index]);
  }

  return passwd.join('');
}

export function objPolyfill() {
  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }
}
