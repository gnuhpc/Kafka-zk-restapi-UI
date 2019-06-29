/**
 * Created by rtdl-liaoyueling on 2018/11/7.
 */
import request from '@/utils/request1'
const http = {
  /**
   * get请求
   *
   * @param url 请求地址
   * @param params 请求入参
   */
  get(url, params) {
    const config = {
      method: 'get',
      url: url
    }
    if (params !== undefined) {
      config.params = params
    }
    return request(config)
  },
  /**
   * post请求
   *
   * @param url 请求地址
   * @param params 请求入参
   */
  post(url, params) {
    const config = {
      method: 'post',
      url: url
    }
    if (params !== undefined) {
      config.data = params
    }
    return request(config)
  },
  /**
   * put请求
   *
   * @param url 请求地址
   * @param params 请求入参
   */
  put(url, params) {
    const config = {
      method: 'put',
      url: url
    }
    if (params !== undefined) {
      config.data = params
    }
    return request(config)
  },
  /**
   * delete请求
   *
   * @param url 请求地址
   * @param params 请求入参
   */
  delete(url, params) {
    const config = {
      method: 'delete',
      url: url
    }
    if (params !== undefined) {
      config.params = params
    }
    return request(config)
  }
}
export default http
