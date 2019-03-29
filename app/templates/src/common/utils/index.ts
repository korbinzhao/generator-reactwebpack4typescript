import { message } from 'antd';
import comAxios from '@ali/com-axios';
import apiMap from './api';

export default {
  getCookie: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  },
  // 接口请求方法
  axios: (params, callback, error) => {
    const {
      /**
       * api： API名称
       * data： 请求参数
       * method： 请求类型
       * path： baseURL
       * timeout： 超时时间 
       */
      api,
      data,
      method,
      path,
      timeout,
    } = params;

    const baseURL = path || '/ai'; // baseURL

    return comAxios({
      api,
      data,
      method,
      apiMap,
      baseURL,
      timeout,
    })
      .then((res) => {
        callback && callback(res);

        // 如果返回未登录，则跳转到登录页
        if (res.code === 'NOT_LOGIN') {
          message.warn(res.message || '登录超时');

          setTimeout(() => {
            const pageUrl = window.location.href;
            window.location.href = pageUrl.indexOf('test') === -1
              ? `https://account.aliyun.com/login/login.htm?oauth_callback=${escape(pageUrl)}`
              : `http://account.aliyun.test/login/login.htm?oauth_callback=${escape(pageUrl)}`;
          }, 1000);
        }

        if (res.code !== '0' && res.code !== '400') { // '0' 为成功，'400' 为正常失败提示
          try {
            const str = JSON.stringify(data);
            const pk = this.getCookie('login_aliyunid_pk');
            const url = `https://et-industry-app-studio.aliyun-inc.com${(apiMap && apiMap[api]) || api}?aliyunPK=${pk}`;

            window.tracker && window.tracker.log({
              pid: 'industrybrain', // 替换为你自己的 pid
              code: 2, // 接口监控 code 默认为 2，不可修改
              ajaxurl: url,
              params: str && str.substr(0, 2000),
              msg: res.message,
              c1: method,
              c2: res.code,
              c3: JSON.stringify(res),
            });
          } catch (e) {
            console.warn('tracker.log failed: ', e);
          }
        }

        return res;
      })
      .catch((err) => {
        console.warn(err && err.response);
        const pk = this.getCookie('login_aliyunid_pk');
        const url = `https://et-industry-app-studio.aliyun-inc.com${(apiMap && apiMap[api]) || api}?aliyunPK=${pk}`;

        try {
          const loginFailMsg = err && err.response && err.response.data;

          let errMsg = '接口请求出现异常';
          if (loginFailMsg && loginFailMsg.indexOf('NOT_LOGIN') !== -1) {
            errMsg = 'NOT_LOGIN';
          }
          const paramsStr = JSON.stringify(data);
          const responseStr = err && err.response && JSON.stringify(err.response);
          const errStr = err && JSON.stringify(err);
          const c3 = (responseStr && responseStr.substr(0, 2000)) || (errStr || errStr.substr(0, 2000));
          window.tracker && window.tracker.log({
            pid: 'industrybrain', // pid
            code: 2, // 异常事件 code 为 1 ，接口监控 code 为 2
            ajaxurl: url,
            params: paramsStr && paramsStr.substr(0, 2000),
            msg: errMsg, // 异常信息
            c1: method, // 请求方法
            c3 // 接口返回
          });
        } catch (e) {
          console.warn('tracker.log failed: ', e);
        }

        // 登录失效情况下，跳转登录页
        try {
          const loginFailMsg = err && err.response && err.response.data;

          if (loginFailMsg && loginFailMsg.indexOf('NOT_LOGIN') !== -1) {
            message.warn(loginFailMsg);
            setTimeout(() => {
              const pageUrl = window.location.href;
              window.location.href = pageUrl.indexOf('test') === -1
                ? `https://account.aliyun.com/login/login.htm?oauth_callback=${escape(pageUrl)}`
                : `http://account.aliyun.test/login/login.htm?oauth_callback=${escape(pageUrl)}`;
            }, 1000);
          }
        } catch (e) {
          console.warn('login jump failed', e);
          window.tracker && window.tracker.log({
            pid: 'industrybrain', // pid
            code: 1, // 异常事件 code 为 1 ，接口监控 code 为 2
            msg: '登录失效情况下跳转登录页处理失败',
            c1: err && err.response,
          });
        }

        typeof error === 'function' && error(err);
      });
  }
};
