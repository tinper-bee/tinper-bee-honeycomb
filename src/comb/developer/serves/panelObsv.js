import axios from 'axios';
import { Message } from 'tinper-bee';

const serveUrl = {
  getAppList: '/app-manage/v1/apps/owner',
}

export function getAppList() {
  return axios.get(serveUrl.getAppList)
    .then(res => res.data)
    .then(data => {
      if (data['error_code']) {
        throw data;
      }
      return data.map(item=>{
        item.number_app_id = item.app_id;//数字形式的appId
        item.app_id = item.db_app_id;
        return item;
      });
    })
    .catch(err => {
      if (!err['err_message']) {
        err['error_message'] = err.message || '请求出错';
      }

      Message.create({
        content: err['error_message'].slice(0, 50),
        color: 'danger',
        duration: 1,
      })
    })
}