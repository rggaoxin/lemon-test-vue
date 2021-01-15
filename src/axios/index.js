import axios from 'axios';

import router from '../router';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


// http response 拦截器
axios.interceptors.response.use(
  undefined,
  error => {
    let res = error.response;
    if (!res) {
      return Promise.reject(error)
    }
    switch (res.status) {
      case 401:
        console.log('未登录');
        router.push({'path': '/login'});
      case 403:
        console.log('您没有该操作权限');
        router.push({'name': '403'});
      case 500:
        console.log('服务器错误');
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

