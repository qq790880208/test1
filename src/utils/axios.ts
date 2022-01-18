import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const service = axios.create({
  baseURL: 'https://datateller.cosmoplat.com',
  timeout: 60000,
});

service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  // token解析失败，跳转到登录页
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default service;
