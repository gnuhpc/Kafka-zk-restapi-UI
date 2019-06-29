/**
 * Created by rtdl-liaoyueling on 2018/12/26.
 * 在分页的按钮上此方法不起作用，请使用btnPermissions.js文件中的方法
 */
import Vue from 'vue'
const btnPermission = Vue.directive('btnPermission',{
  bind:function(el,binding){
    let values=binding.value;
    let sessionName='btnPermissions';
    if(typeof binding.value != 'string'){
      values=binding.value[0];
      sessionName=binding.value[1]
    }
    if(!Vue.prototype.$_btnPermission(values,sessionName)){
      el.parentNode.removeChild(el);
    }
  }
})
Vue.prototype.$_btnPermission = function(values,sessionName){
  let isExist=false
  let btnPermsStr=sessionStorage.getItem(sessionName);
  if(btnPermsStr == undefined || btnPermsStr == null){
    return false;
  }
  let btnPerms = JSON.parse(btnPermsStr);
  for(let i = 0;i< btnPerms.length;i++){
    if(btnPerms[i] == values){
      isExist=true;
      break;
    }
  }
  return isExist;
}
export {btnPermission}
