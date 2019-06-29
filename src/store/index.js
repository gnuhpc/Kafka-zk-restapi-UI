import Vue from 'vue'
import Vuex from 'vuex'
import header from './modules/header'
import getters from './getters'
import table from './modules/table'

Vue.use(Vuex);
 const store=new Vuex.Store({
     modules:{
         header,table
     },
     getters
 })
 export default store
