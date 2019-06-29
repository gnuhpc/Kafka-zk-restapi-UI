import api from '../../api/login'
const header={
  state:{
        menuTree:{}
    },
 actions:{
    getMineBaseApi({commit}){
        api.mineBaseMsgApi().then(response=>{
            commit('SET_TOKEN',response.menuTree.children)
        }).catch((err)=>{console.log(err)})
    }
},
 mutations:{
    SET_TOKEN:(state,menu)=>{
       state.menuTree=menu;
    },
}
}
export default header
 


