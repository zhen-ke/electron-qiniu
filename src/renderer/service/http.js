import http from "axios";

// http 配置
http.defaults.timeout = 10000;
http.defaults.baseURL = "http://rs.qbox.me/";

// http request 拦截器
http.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
