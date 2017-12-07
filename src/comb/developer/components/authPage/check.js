import {Message} from 'tinper-bee';
import {checkAuth} from '../../serves/confLimit';
import {checkMiddlewareAuth} from '../../serves/middleare';
import {checkImgAuth} from '../../serves/imageCata';
import { checkResPoolAuth } from '../../serves/poolRenewal';
import { checkAlarmAuth } from '../../serves/alarm-center';


/**
 * 校验是否有权限
 * @param busicode
 * @param record
 * @param callback
 */
const verifyAuth = (busicode, record, callback) => {

  switch (busicode) {
    case 'conf':
      checkAuth(`?resId=${record.id}&userId=${record.userId}`).then(cb);
      break;
    case 'redis' :
    case 'mq':
      checkMiddlewareAuth(busicode, `?resId=${record.id}&userId=${record.userId}`).then(cb);
      break;
    case 'jenkins':
      checkMiddlewareAuth(busicode, `?resId=${record.pkMiddlewareJenkins}&userId=${record.userId}`).then(cb);
      break;
    case 'zk':
      checkMiddlewareAuth(busicode, `?resId=${record.pkMiddlewareZk}&userId=${record.userId}`).then(cb);
      break;
    case 'mysql':
      checkMiddlewareAuth(busicode, `?resId=${record.pkMiddlewareMysql}&userId=${record.userId}`).then(cb);
      break;
    case 'dclb':
      checkMiddlewareAuth(busicode, `?resId=${record.pkMiddlewareNginx}&userId=${record.userId}`).then(cb);
      break;
    case 'resource_pool':
      checkResPoolAuth(record.id).then(cb);
      break;
    case 'app_docker_registry':
      checkImgAuth(record.id).then(cb);
      break;
    case 'alarm_pool':
      checkAlarmAuth(`?resid=${record.Id}&type=pool`).then(cb);
      break;
    case 'alarm_app':
      checkAlarmAuth(`?resid=${record.Id}&type=app`).then(cb);
      break;
    case 'alarm_service':
      checkAlarmAuth(`?resid=${record.Id}&type=service`).then(cb);
      break;
  }
  function cb(res) {
    if (res.data.error_code) {
      Message.create({
        content: res.data.error_message,
        color: 'danger',
        duration: null
      })
    } else {
      if (res.data.result === 'N' || res.data === false) {
        Message.create({
          content: '当前账号没有权限管理此资源的权限。',
          color: 'warning',
          duration: 4.5
        })
      } else {
        if (callback instanceof Function) {
          callback();
        }
      }
    }

  }

}

export default verifyAuth;
