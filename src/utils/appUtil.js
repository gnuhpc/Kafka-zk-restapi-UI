/**
 * Created by rtdl-liaoyueling on 2018/11/2.
 */
import { Message } from 'element-ui'
const appUtil = {
  utcToDate(str) {
    if(str){
    var date = new Date(str)
    var Y = date.getFullYear()
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
  }else{
    return;
  }
  },
  timestampToDate(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y + '-' + M + '-' + D
  },
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  },
  getFailedTip(code, tip) {
    if (code.message == undefined) {
      Message.error(tip)
    } else {
      Message.error(code.message)
    }
  },
  farmat(num) {
    if (num === null) return;
    let m = parseInt(num).toString()
    let len = m.length
    let n = len % 3
    if (n > 0) {
      return m.slice(0, n) + ',' + m.slice(n, len).match(/\d{3}/g).join(',')
    } else {
      return m.slice(n, len).match(/\d{3}/g).join(',')
    }
  },
  timeChange(str) {
    let time = str;
    const S = parseInt((time % 60).toString());
    const M = parseInt((time / 60 % 60).toString())
    const H = parseInt((time / 60 / 60).toString())
    if(H == 0 && M == 0) time = `${S}秒`
    else if(H == 0 && M != 0) time = `${M}分${S}秒` 
    else time = `${H}时${M}分${S}秒` 
    return time
  },
  ymdToDate(str) {
    var date = new Date(str)
    var Y = date.getFullYear()
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y +  M +  D
  },
  ymdToMonth(str) {
    var date = new Date(str)
    var Y = date.getFullYear()
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    return Y +  M 
  },
  ToMonth(str) {
    var date = new Date(str)
    var Y = date.getFullYear()
    var M = date.getMonth() < 10 ? '0' + (date.getMonth()) : date.getMonth()
    return Y +  M 
  },
}
export default appUtil
