import api from '../../api/table'
const table={
  state:{
        clusters:[],
    },
 actions:{
    clusters({commit}){
        return new Promise((resolve,reject)=>{
        api.mineBaseMsgApi().then(response=>{
            commit('SET_data',response.reply.clusters);
            resolve();
        }).catch((err)=>{console.log(err)})
    })
}
},
 mutations:{
    SET_data:(state,menu)=>{
       state.clusters=menu;
    },
}
}
export default table