 import {zkHost,zkStartOrStop,readZkConfig,zkBatchRev,recoverZK} from '@/api/zookeeper'
 import zkConfigDetail from '@/components/kafka/zookeeper/zkConfigDetail'
 import pagination from "@/components/resourceApplication/page";
const zkConfig = {
    props:['clusterSelect'],
    components: {
        zkConfigDetail,
        pagination
      },
    data () {
        return {
            hosts:[],
            tableShow:true,
            listLoading:false,
            configData: [],
            host:'',
            // configQuery: {
            //     host: 9999,
            //     user: 'hadoop',
            //     remoteFileType: 'prop',
            //     timeout: 60000,
            //     remoteFile: '/app/confluent/etc/kafka/server.properties'
            //   },
            multipleSelection:[],
            time:"30000",
            timer:null,
            timer1:null,
            searchhost:'',
            page:1,
            pageSize:10,
            total:0,
            flag:true,
            startorstop:'启动',
            starttime:'',
            selectCluster:'',
            Errormessage:''

        }
    },
    created(){
         this.getList()
    },
    watch:{ 
        clusterSelect(){
          this.getList();
        }
      },
    destoryed(){
      clearInterval(this.timer)
      clearInterval(this.timer1)
      this.starttime=''
    },
    computed:{
        newhosts(){
            const searchhost=this.searchhost;
            if(searchhost){
                let a=0;
                return this.hosts.filter(item=>{
                    if(item.host.indexOf(searchhost)>-1) this.total=++a;
                    return item.host.indexOf(searchhost)>-1
                })
            }
                return this.hosts;
            }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
          },
        getList(){
            this.listLoading=true;
            this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            let params={"selectCluster": this.selectCluster}
            zkHost(params).then(res=>{
                this.listLoading=false;
                if(res.data.reply.returnCode.type==='S'){
                    if(res.data.reply.result.message){
                      this.$message.error(`${res.data.reply.result.message}`)
                    }
                    this.hosts=res.data.reply.result.zkHosts;
                    this.total=this.hosts.length;
                }else{
                    this.$message.error(`${res.data.reply.result.message}`)
                }
            })
        },
        text(){
            let time=parseInt(this.time)/1000;
              this.starttime=time;
            this.timer1= setInterval(()=>{
              this.starttime--;
              if(this.starttime===0){
              clearInterval(this.timer1);
              this.text();
              }
            },1000)
          },
        //定时刷新
        StartorStopList(){
            this.flag=!this.flag;
            if(!this.flag){
              this.startorstop='停止';
              this.timer=setInterval(this.getList,this.time); 
              this.text(); 
            }else{
              this.startorstop='启动';
              clearInterval(this.timer)
              clearInterval(this.timer1);
              this.starttime='';
            }
          },
        StartStop(host,status){
            this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            this.$confirm(`是否继续${status=="stop"?'启动':'停止'}`,{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:'warning'
                }).then(()=>{
            let params={
                data:{ host,status:status=="start"?'stop':"start"},
                selectCluster: this.selectCluster,
              }
            zkStartOrStop(params).then(res=>{
               if(res.data.reply.returnCode.type=="S"){
                    this.$message.success('起停成功');
                    this.getList()
                }else{
                    this.$message.error(`起停失败 ${res.data.reply.returnCode.message}`);
                }
            })
        }).catch(()=>{
        }) 
        },
        //手动恢复
        recoverZK(host){
            this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            this.$confirm("是否继续手动恢复",{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:'warning'
                }).then(()=>{
            let params={host,"selectCluster": this.selectCluster}
            recoverZK(params).then(res=>{
                if(res.data.reply.returnCode.type==="S"){
                    this.$message.success('手动恢复成功!');
                    this.getList()
                }
            }) 
        }).catch(()=>{
        }) 
        },
        configFn(host){
            this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            this.tableShow = false
            this.listLoading = true;
            this.host=host;
            let params={host,selectCluster: this.selectCluster}
            readZkConfig(params).then(res=>{
                if(res.data.reply.returnCode.type==="S"){
                    this.listLoading = false
                    this.configData=res.data.reply.result;
                    this.Errormessage=''
                }else{
                    this.Errormessage=res.data.reply.returnCode.message;
                }
            })

        },
        showMessageFromChild(data) {
            this.tableShow = data
        },
        //批量起停
        BatchRev(updateStatus){
            if(!this.multipleSelection[0]){
                this.$message({
                  message:'请先选择一条数据进行添加标签的操作！',
                  type:"warning"
              })
              }else{
                this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                this.$confirm("是否继续批量起停",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                    }).then(()=>{
                let arr= this.multipleSelection.map(item=>{
                    return {host:item.host,status:item.status}
                })
                let params={
                    data:{ arr },
                    selectCluster: this.selectCluster,
                    updateStatus
                }
                zkBatchRev(params).then(res=>{
                    if(res.data.reply.returnCode.type==="S"){
                    this.$message.success('批量起停成功！');
                    this.getList();
                    }else{
                        this.$message.success(`批量起停失败！${res.data.reply.returnCode.message}`);  
                    }
                })
                }).catch(()=>{
                }) 
            }
        },
        handleChange(item) {
            this.page = item.page;
            this.pageSize = item.limit;
            this.getList()
          },
    }
}
export default zkConfig
