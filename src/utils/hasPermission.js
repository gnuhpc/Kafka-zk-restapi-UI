/**
 * Created by rtdl-liaoyueling on 2019/2/19.
 */
export function hasPermission(values,sessionName){
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
