import axios from 'axios'
export function deletelist(name,namespace,url1,trooperId,clusterId,_this){
    _this.$confirm('此操作将删除该条数据，是否继续？',{
    confirmButtonText:"确定",
    cancelButtonText:"取消",
    type:'warning'
    }).then(()=>{
    let url=url1;
    let params={name,namespace,trooperId,clusterId};
    axios.post(url,params).then(res=>{
        if(res.data.reply.returnCode.type==="S"){
            _this.$message({
            type:'success',
            message:'删除成功'
        })
         _this.handleselected2();
        }else{
            _this.$message({
            type:'error',
            message:`删除失败${res.data.reply.returnCode.message}`
        })  
        }
    })
    }).catch(()=>{
                    
    }) 
}