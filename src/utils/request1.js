import axios from 'axios'
import $ from 'jquery'
import VueCookies from 'vue-cookie'
// import {Message} from 'element-ui'

const _config = require('../../config')
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 180 * 1000 // 请求超时时间
})
// request 拦截器
service.interceptors.request.use(config => {
  if (localStorage.getItem("sessionid") != null) {
    VueCookies.set("SESSION", localStorage.getItem("sessionid"))
  }
  /*VueCookies.set("SESSION","M2E2MWUzNjEtYzY1Ny00NzNhLTg3OTAtZjFmYWQ2MjE0Nzcz")*/
  // 发送请求前做一些处理
  if (process.env.NODE_ENV === 'development' && _config.dev.mock) {
    console.log(`${config.method}:${config.url},参数(config):${JSON.stringify(config)}`)
  }
  return config
}, error => {
  // 当请求异常时做一些处理
  Promise.reject(error)
})
// response 拦截器
service.interceptors.response.use(
  response => {
    // 返回响应时做一些处理
    /*if(response.data.reply.returnCode.type == "E"){
      setTimeout(() => {
        $('.el-loading-mask').css({ "display": "none" })
        }, 3000);
    }*/
    return response
  }, error => {
    // 超时时候的处理
    if (JSON.stringify(error).includes('timeout')) {
      $('.el-loading-mask').css({ "display": "none" })
    }
    // console.log(Message)
    // 当响应异常时做一些处理
    if (error.response) {
      setTimeout(() => {
      $('.el-loading-mask').css({ "display": "none" })
      }, 3000);
      switch (error.response.status) {
        case 401:
          if (VueCookies.get("SESSION")) {
            localStorage.setItem("sessionid", VueCookies.get("SESSION"))
          }
          window.location.href = error.response.data.moreInfoUrl;
        case 404:
          // setTimeout(() => {
          //   window.location.href = '/NotFound'
          // }, 5000);
      }
    }
    return Promise.reject(error)
  })
export default service
