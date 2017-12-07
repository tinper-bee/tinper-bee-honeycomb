/**
 * Created by chief on 17/4/14.
 */

//axios 定制

import axios from 'axios';


axios.interceptors.request.use(function(config){
    //在发送请求之前做某事
    config.headers = {'X-Requested-With': 'XMLHttpRequest'};

    return config;

},function(error){
    //请求错误时做些事
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么

    if(error.response.data.status=='306'){
        window.parent.location.href = 'https://developer.yonyoucloud.com/portal/sso/login.jsp';
    }

    return Promise.reject(error);
});


export default axios;