import { Message,Tooltip } from 'tinper-bee';

import ReactDOM from 'react-dom';
import PageLoading from './loading/index';

export function lintAccessListData(response, errormessage, successmessage, reFreshFlag) {
  let data = response && response.data;
  if (!errormessage) {
    errormessage = '数据操作失败'
  };
  if (!data) {
    Message.create({
      content: errormessage,
      color: 'danger',
      duration: 1
    });
    return;
  }
  if (data.success == "false") {
    Message.create({
      content: data.message,
      color: 'danger',
      duration: 1
    });
    return;
  }
  if (data.detailMsg && data.detailMsg.data) {
    if (successmessage) {
      Message.create({
        content: successmessage,
        color: 'success',
        duration: 1
      });
    }
    if (reFreshFlag) Message.create({
      content: "刷新成功",
      color: 'success',
      duration: 1
    });
    return data.detailMsg.data;
  }
}

export function lintAppListData(response, errormessage, successmessage, reFreshFlag) {
  if (!response) return;
  let data = response.data;

  //严重错误处理
  if (data && data.error_code == -2) {
    Message.create({
      content: data.error_message || errormessage,
      color: 'danger',
      duration: null
    });
    return;
  }

  //普通错误处理
  if (data && data.error_code) {
    Message.create({
      content: data.error_message || errormessage,
      color: 'danger',
      duration: 4.5
    });
    return data;
  }

  if (successmessage) {
    Message.create({
      content: successmessage,
      color: 'success',
      duration: 1.5
    });
  }

  if (reFreshFlag) Message.create({
    content: "刷新成功",
    color: 'success',
    duration: 1.5
  });

  return data;
}

export function lintData(response, errormessage, successmessage) {
  let data = response.data;
  if (!errormessage) {
    errormessage = '数据操作失败'
  };
  if (!data) {
    Message.create({
      content: errormessage,
      color: 'danger',
      duration: 1
    });
    return false;
  }
  if (data.success == "false") {
    Message.create({
      content: data.message,
      color: 'danger',
      duration: 1
    });
    return false;
  }
  if (successmessage) {
    Message.create({
      content: successmessage,
      color: 'success',
      duration: 1
    });
  }
  return true;
}

export function formateDate(time) {
  if (!time) return false;
  var date = new Date(time);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  if (date.getHours() < 10) {
    h = "0" + h;
  }
  if (date.getMinutes() < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  return (Y + M + D + h + m + s);
}

export function splitParam(param) {
  let tempString = "";
  for (var p in param) {
    tempString += "&" + p + "=" + param[p];
  }
  let paramString = tempString.substring(1);
  return paramString;
}

export function HTMLDecode(input) {
  var converter = document.createElement("DIV");
  converter.innerHTML = input;
  var output = converter.innerText;
  converter = null;
  return output;
}
/**
 * 获得cookie
 * @param name
 * @returns {null}
 */
export function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) {
    return arr[2];
  }
  return '';
}
/**
 * 获得url参数
 * @param name
 * @returns {*}
 */
export function getQueryString(name) {
  var after = window.location.hash.split("?")[1];
  if (after) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = after.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2])
    } else {
      return null;
    }
  }
}
/**
 * 获取hash路径里面的,第二个"/"后面的id
 */
export function getHostId(hashName) {
  let arr = hashName.split("/");
  if (arr && Array.isArray(arr)) {
    return arr[2];
  } else {
    return "";
  }

}


/*
 *   功能:日期减的功能
 *   参数:interval,字符串表达式，表示要添加的时间间隔.y年，q季度，mon月，w周，d天，h时，min分，s秒
 *   参数:number,数值表达式，表示要添加的时间间隔的个数,若需要时间加，传负数即可
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 */
export function dateSubtract(interval, number, date) {
  date = new Date(date);
  switch (interval) {
    case "y":
      {
        date.setFullYear(date.getFullYear() - number);
        return date;
        break;
      }
    case "q":
      {
        date.setMonth(date.getMonth() - number * 3);
        return date;
        break;
      }
    case "mon":
      {
        date.setMonth(date.getMonth() - number);
        return date;
        break;
      }
    case "w":
      {
        date.setDate(date.getDate() - number * 7);
        return date;
        break;
      }
    case "d":
      {
        date.setDate(date.getDate() - number);
        return date;
        break;
      }
    case "h":
      {
        date.setHours(date.getHours() - number);
        return date;
        break;
      }
    case "min":
      {
        date.setMinutes(date.getMinutes() - number);
        return date;
        break;
      }
    case "s":
      {
        date.setSeconds(date.getSeconds() - number);
        return date;
        break;
      }
    default:
      {
        date.setDate(date.getDate() - number);
        return date;
        break;
      }
  }
}
/**
 * 日期格式化
 * @param data  日期
 * @param fmt 格式  y年，M月，d日，h时，m分，s秒，q季度，S毫秒
 * @returns {*}
 */
export function dataPart(data, fmt) {
  data = new Date(Number(data));
  let o = {
    "M+": data.getMonth() + 1, //月份
    "d+": data.getDate(), //日
    "w+": data.getDay(), //周
    "h+": data.getHours(), //小时
    "m+": data.getMinutes(), //分
    "s+": data.getSeconds(), //秒
    "q+": Math.floor((data.getMonth() + 3) / 3), //季度
    "S": data.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 获得指定月份的天数
 * @param date
 * @returns {number}
 */
export function getCountDays(date) {
  let curDate = new Date(date);
  let curMonth = curDate.getMonth();
  curDate.setMonth(curMonth + 1);
  curDate.setDate(0);
  return curDate.getDate();
}

export function loadShow() {
  let loadDOM = ReactDOM.findDOMNode(this.refs.pageloading);
  if (loadDOM) {
    ReactDOM.render(<PageLoading show={true}></PageLoading>, loadDOM);
  }
}

export function loadHide() {
  let loadDOM = ReactDOM.findDOMNode(this.refs.pageloading);
  if (loadDOM) {
    window.setTimeout(function () {
      ReactDOM.render(<PageLoading show={false}></PageLoading>, loadDOM);
    }, 300);
  }
}


export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


const JSON_VALUE_TYPES = ['object', 'array', 'number', 'string', 'boolean', 'null'];

export function JSONFormatter(option) {
  this.options = option ? option : {};
}

JSONFormatter.prototype.htmlEncode = function (html) {
  if (html !== null) {
    return html.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  } else {
    return '';
  }
};

JSONFormatter.prototype.jsString = function (s) {
  s = JSON.stringify(s).slice(1, -1);
  return this.htmlEncode(s);
};

JSONFormatter.prototype.decorateWithSpan = function (value, className) {
  return "<span class=\"" + className + "\">" + (this.htmlEncode(value)) + "</span>";
};

JSONFormatter.prototype.valueToHTML = function (value, level) {
  var valueType;
  if (level == null) {
    level = 0;
  }
  valueType = Object.prototype.toString.call(value).match(/\s(.+)]/)[1].toLowerCase();
  if (this.options.strict && !jQuery.inArray(valueType, JSON_VALUE_TYPES)) {
    throw new Error("" + valueType + " is not a valid JSON value type");
  }
  return this["" + valueType + "ToHTML"].call(this, value, level);
};

JSONFormatter.prototype.nullToHTML = function (value) {
  return this.decorateWithSpan('null', 'null');
};

JSONFormatter.prototype.undefinedToHTML = function () {
  return this.decorateWithSpan('undefined', 'undefined');
};

JSONFormatter.prototype.numberToHTML = function (value) {
  return this.decorateWithSpan(value, 'num');
};

JSONFormatter.prototype.stringToHTML = function (value) {
  var multilineClass, newLinePattern;
  if (/^(http|https|file):\/\/[^\s]+$/i.test(value)) {
    return "<a href=\"" + (this.htmlEncode(value)) + "\"><span class=\"q\">\"</span>" + (this.jsString(value)) + "<span class=\"q\">\"</span></a>";
  } else {
    multilineClass = '';
    value = this.jsString(value);
    if (this.options.nl2br) {
      newLinePattern = /([^>\\r\\n]?)(\\r\\n|\\n\\r|\\r|\\n)/g;
      if (newLinePattern.test(value)) {
        multilineClass = ' multiline';
        value = (value + '').replace(newLinePattern, '$1' + '<br />');
      }
    }
    return "<span class=\"string" + multilineClass + "\">\"" + value + "\"</span>";
  }
};

JSONFormatter.prototype.booleanToHTML = function (value) {
  return this.decorateWithSpan(value, 'bool');
};

JSONFormatter.prototype.arrayToHTML = function (array, level) {
  var collapsible, hasContents, index, numProps, output, value, _i, _len;
  if (level == null) {
    level = 0;
  }
  hasContents = false;
  output = '';
  numProps = array.length;
  for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
    value = array[index];
    hasContents = true;
    output += '<li>' + this.valueToHTML(value, level + 1);
    if (numProps > 1) {
      output += ',';
    }
    output += '</li>';
    numProps--;
  }
  if (hasContents) {
    collapsible = level === 0 ? '' : ' collapsible';
    return "[<ul class=\"array level" + level + collapsible + "\">" + output + "</ul>]";
  } else {
    return '[ ]';
  }
};

JSONFormatter.prototype.objectToHTML = function (object, level) {
  var collapsible, hasContents, key, numProps, output, prop, value;
  if (level == null) {
    level = 0;
  }
  hasContents = false;
  output = '';
  numProps = 0;
  for (prop in object) {
    numProps++;
  }
  for (prop in object) {
    value = object[prop];
    hasContents = true;
    key = this.options.escape ? this.jsString(prop) : prop;
    output += "<li><a class=\"prop\" href=\"javascript:;\"><span class=\"q\">\"</span>" + key + "<span class=\"q\">\"</span></a>: " + (this.valueToHTML(value, level + 1));
    if (numProps > 1) {
      output += ',';
    }
    output += '</li>';
    numProps--;
  }
  if (hasContents) {
    collapsible = level === 0 ? '' : ' collapsible';
    return "{<ul class=\"obj level" + level + collapsible + "\">" + output + "</ul>}";
  } else {
    return '{ }';
  }
};

JSONFormatter.prototype.jsonToHTML = function (json) {
  return "<div class=\"jsonview\">" + (this.valueToHTML(json)) + "</div>";
};

export function getDataByAjax(url, isAsyn, successCb, errorCb) {
  var xmlreq;
  if (window.XMLHttpRequest) { //非IE
    xmlreq = new XMLHttpRequest();

  } else if (window.ActiveXObject) { //IE
    try {
      xmlreq = new ActiveXObject("Msxml2.HTTP");
    } catch (e) {
      try {
        xmlreq = new ActiveXObject("microsoft.HTTP");
      } catch (e) {
        //alert("请升级你的浏览器，以便支持ajax！");
      }
    }
  }


  xmlreq.onreadystatechange = function (data) {

    if (xmlreq.readyState == 4) {
      if (xmlreq.status == 200) {
        successCb(xmlreq.responseText);
      } else {
        errorCb();
      }
    }
  }
  try {
    xmlreq.open('GET', url, isAsyn);
    xmlreq.send(null);
  } catch (e) {
    errorCb(e);
  }

}

export function copyToClipboard(txt) {

  if (window.clipboardData) {
    window.clipboardData.clearData();
    window.clipboardData.setData("Text", txt);
    alert("<strong>复制</strong>成功！")
  } else if (navigator.userAgent.indexOf("Opera") != -1) {
    window.location = txt;
    alert("<strong>复制</strong>成功！");
  } else if (window.netscape) {
    try {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    } catch (e) {
      alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
    }
    var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    if (!clip)
      return;
    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans)
      return;
    trans.addDataFlavor('text/unicode');
    var str = new Object();
    var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    var copytext = txt;
    str.data = copytext;
    trans.setTransferData("text/unicode", str, copytext.length * 2);
    var clipid = Components.interfaces.nsIClipboard;
    if (!clip) return false;
    clip.setData(trans, null, clipid.kGlobalClipboard);
    alert("<strong>复制</strong>成功！")
  } else if (copy) {
    copy(txt);
    alert("<strong>复制</strong>成功！")
  }

}


export function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function textImage(text) {
  if (!text) return;
  let temp = text.substring(0, 2);
  let i = Math.ceil(Math.random() * 5);
  return <span className={`textimage index${i}`}>{temp}</span>
}

export function spiliCurrentTime(param) {
  let date = param ? new Date(param) : new Date();

  let weekMenu = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    0: '天',
  }
  let currentdate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: weekMenu[date.getDay()],
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  }

  return currentdate;
}

export function checkEmpty(value) {
  if (value == undefined || value === '') {
    return '暂无数据'
  }
  return value;
}


export function addByTransDate(dateParameter, num) {
  var translateDate = "",
    dateString = "",
    monthString = "",
    dayString = "";
  translateDate = dateParameter.replace("-", "/").replace("-", "/");;
  var newDate = new Date(translateDate);
  newDate = newDate.valueOf();
  newDate = newDate - num * 24 * 60 * 60 * 1000; //备注 如果是往前计算日期则为减号 否则为加号
  newDate = new Date(newDate);
  //如果月份长度少于2，则前加 0 补位
  if ((newDate.getMonth() + 1).toString().length == 1) {
    monthString = 0 + "" + (newDate.getMonth() + 1).toString();
  } else {
    monthString = (newDate.getMonth() + 1).toString();
  }
  //如果天数长度少于2，则前加 0 补位
  if (newDate.getDate().toString().length == 1) {
    dayString = 0 + "" + newDate.getDate().toString();
  } else {
    dayString = newDate.getDate().toString();
  }
  dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
  return dateString;
}

/**
 * 校验字符串为null，"null"的处理
 */
export function validataString(data) {
  if (data == "" || data == "null" || data == null) {
    return;
  } else {
    return <span>{data}</span>
  }
}

/**
 * 通过正则表达式校验字符串
 * @param  Regex reg 正则表达式
 * @param  value 需要校验的字符串
 *
 */
export function validStrByReg(reg, value) {
  let rs = false;
  try {
    if (typeof reg == 'string')
      reg = eval(reg)
  } catch (e) {

  }
  return reg.test(value);
}
/**
 * 删除用户
 * @param {*} response 
 * @param {*} errormessage 
 * @param {*} successmessage 
 * @param {*} reFreshFlag 
 */
export function DeleteUserData(response, errormessage, successmessage, reFreshFlag) {
  if (!response) return;
  let data = response.data;

  //严重错误处理
  if (data && data.error_message) {
    Message.create({ content: "删除失败 "+data.error_message || errormessage, color: 'danger', duration: null });
    return;
  }

  //普通错误处理
  if (data && data.error_code) {
    Message.create({ content: "删除失败 "+data.error_message || errormessage, color: 'danger', duration: 4.5 });
    return data;
  }

  if (data.status == "1") {
    Message.create({ content: successmessage, color: 'success', duration: 1.5 });
    return ;
  }

  if (reFreshFlag) Message.create({ content: "刷新成功", color: 'success', duration: 1.5 });

  return data;
}

