/**
 * Created by rtdl-liaoyueling on 2018/11/19.
 */
import http from '../utils//http'
let restful="/paas/paas-app"
let con="/con/paas-app"

// 选择系统
export function getAppSystem(params) {
  return http.post(`${restful}/core/cmdb/appSystem.json`,params)
}

