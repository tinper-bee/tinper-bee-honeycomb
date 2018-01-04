export function verify(text, type, regexp) {
  if (!text || (!type && !regexp))
    return false;
  var regExp;
  if (regexp) {
    regExp = new RegExp(regexp);
    return regExp.test(text);
  }

  switch (type) {
    case 'number':
      regExp = /^\d+$/;
      break;
    case 'string':
      regExp = /^[a-z0-9/][a-z0-9_/-]+[a-z0-9/]$/;
      break;
    case 'version':
      regExp = /^[A-Za-z0-9][A-Za-z0-9_.-]+$/;
      break;
    case 'chinese':
      regExp = /[^\u4e00-\u9fa5]/;
      break;
    case 'space':
      regExp = /\s*/g;
      break;
    default:
      regExp = /n[s| ]*r/gi;
  }


  return regExp.test(text);

}


export function onlyNumber(e) {
  let code = e.keyCode;
  if (!((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 102 || code == 39 || code == 8 || code == 46 || code == 110 || code == 190)) {
    if (typeof e != "undefined") {
      if (e.stopPropagation) e.stopPropagation(); else {
        e.cancelBubble = true;
      }
      //阻止默认浏览器动作(W3C)
      if (e && e.preventDefault) e.preventDefault();
      //IE中阻止函数器默认动作的方式
      else window.event.returnValue = false;
    }
  }
}
