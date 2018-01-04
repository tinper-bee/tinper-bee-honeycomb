import axios from 'axios';
import { Message } from 'tinper-bee';

export default function ajax(method, url, callback, data, headers) {
    let configObj = {};
    if (!method || !url) {
        console.error('缺少必要参数');
        return;
    }
    configObj.url = url;
    upCaseMethod = method.toUpperCase();
    if (/GET|POST|PUT|DELETE|HEAD|PATCH/.test(upCaseMethod)) {
        configObj.method = upCaseMethod;
    } else {
        console.error('method 不正确');
        return;
    }
    if (headers instanceof Object) {
        configObj.headers = headers;
    }
    if (data && upCaseMethod === 'POST') {
        configObj.data = data;
    }

    axios(configObj)
        .then(function (response) {
            if (response.status == 200) {
                callback && callback(response);
            } else {

            }

        })
        .catch(function (err) {
            console.log(err);
            Message.create({ content: '读取版本列表失败！', color: 'danger', duration: null })
        });
}
