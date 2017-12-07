import { IS_SUPPORT_GIT_BUILD, NOTICE } from './constant';

export function changeGitUrl(url, type) {
  let localurl = url;
  if (type === 'ssh') {
    //git@git.yonyou.com:yonyoucloud_developercenter/app_upload.git::develop
    //http://git.yonyou.com/yonyoucloud_developercenter/app_upload.git
    let noProtocolUrl = url.split('//')[1];
    let pathAry = noProtocolUrl.split('/');
    let host = pathAry.shift();
    let path = pathAry.join('/');

    localurl = `git@${host}:${path}`
  } else {
    let noProtocolUrl = url.split('@')[1];
    let pathAry = noProtocolUrl.split(':');
    let host = pathAry.shift();
    let path = pathAry.join(':');

    localurl = `http://${host}/${path}`
  }


  return localurl;
}


export function verifyIsSupportGitbuild (type) {
  return IS_SUPPORT_GIT_BUILD.indexOf(type) > -1;
}

export function getNotice (type) {
  if(NOTICE.hasOwnProperty(type)){
    return NOTICE[type];
  }
  return NOTICE['other'];
}
