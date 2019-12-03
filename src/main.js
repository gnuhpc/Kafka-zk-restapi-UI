// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookies from'vue-cookie'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import store from './store'
import "@babel/polyfill"
import  VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import VueClipboard  from 'vue-clipboard2'
import VueI18n from 'vue-i18n'
Vue.use(VueClipboard)

import echarts from 'echarts'
Vue.prototype.$echarts =echarts

import TreeView from 'vue-json-tree-view'
Vue.use(TreeView)

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

import btnPermission from './utils/btnPermissions.js'
import {hasPermission} from './utils/hasPermission.js'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(VueCodemirror)
Vue.use(ElementUI,{size:'mini'})
Vue.use(VueCookies)
Vue.config.productionTip = false
axios.defaults.withCredentials=true
Vue.prototype.hasPerm=hasPermission
Vue.prototype.relationshipDatabase={
  location:`http://${window.location.host}`
}
// axios.defaults.retry=4;
// axios.defaults.retryDelay=1000;
// axios.interceptors.response.use(undefined,function axiosRetryInterceptor(err){
//   if(!config||!config.retry) return Promise.reject(err);
//   config.__retryCount=config.__retryCount||0;

// })

/* eslint-disable no-new */
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': require('./common/lang/zh'),   // 中文语言包
    'en': require('./common/lang/en')    // 英文语言包
  }
})
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
})
