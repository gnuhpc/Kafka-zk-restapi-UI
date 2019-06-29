import {getListPage, StartStop,forceStop,BatchRev,BatchForceStop,kafkaRecoverBroker,kafkaReadBrokerConfig,updateBrokerConfig,updateBroCluConf} from '../../../api/broker'
import ConfigDetail from '../../../components/kafka/kafkaDetail/broker/configDetail'
import pagination from "@/components/resourceApplication/page";
import appUtil from '../../../utils/appUtil'
const list = {
  props:['clusterSelect'],
  components: {
    ConfigDetail,
    pagination
  },
  data () {
    return {
      tableShow: true,
      brokerList: [],
      localBrokers: ['197.1.25.235', '197.1.25.237', '197.1.25.238', '197.1.25.239', '197.1.25.240', '197.1.25.241', '197.1.25.242', '197.1.25.243', '197.1.25.244'],
      getRowKeys(row) {
        return row.id
      },
      expands: [],
      multipleSelection: [],
      query: {
        page: 1
      },
      listLoading: false,
      configQuery: {
        host: 9999,
        user: 'hadoop',
        remoteFileType: 'prop',
        timeout: 60000,
        remoteFile: '/app/confluent/etc/kafka/server.properties'
      },
      configData: [],
      filters: {
        host: ''
      },
      time:"5000",
      dialogFormVisible:false,
      ispolling:'',
      timer:null,
      timer1:null,
      searchhost:'',
      total: 0,
      pageSize: 10,
      page: 1,
      flag:true,
      startorstop:'启动',
      starttime:'',
      selectCluster:'',
      route:'',
      IDs:[],
      kafkadetail:[],
      Errormessage:''
    }
  },
  created() {
    this.getBrokerList();
    this.route=this.$route.name;
    this.$emit('emitroute',this.route)
  },
  watch:{ 
    clusterSelect(){
      this.page=1;
      this.getBrokerList();
    },
  },
 destoryed(){
   clearInterval(this.timer)
   clearInterval(this.timer1)
   this.starttime=''
 },
computed:{
  newbrokerList(){
    const searchhost=this.searchhost;
    if(searchhost){
      let a=0;
      return this.brokerList.filter(item=>{
        if(item.host.indexOf(searchhost)>-1) this.total=++a;
           return item.host.indexOf(searchhost)>-1
      })
    }
      return this.brokerList;
  }
},
  methods: {
    // arrunique(arr){
    //   var hash={}
    //   arr=arr.reduce((newarr,item)=>{hash[item.id]?'':hash[item.id]=true&&newarr.push(item);
    //         return newarr;
    // },[])
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange (val) {
      this.query.page = val
      this.getBrokerList()
    },
    formatToTime(row, column) {
      return appUtil.utcToDate(row.starttime) 
    },
    // searchhostEvent(){
     
    
    // },
    getBrokerList() {
      this.listLoading = true
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      let params={selectCluster:this.selectCluster};
      getListPage(params).then((res) => {  
          this.listLoading = false
          if(res.data.reply.returnCode.type==='S'){
              if(res.data.reply.result.message){
                this.$message.error(`${res.data.reply.result.message}`)
              }
                this.brokerList= res.data.reply.result.brokerHostDtos;
                // this.newbrokerList=this.brokerList;
                this.total= this.brokerList.length;
                this.ispolling=this.brokerList.some(item=>{ return item.polling==='polling'})
          }else{
                this.$message.error(`${res.data.reply.result.message}`)
          }
      })
    },
    getDetail(id) {
      this.expands = []
      this.expands.push(id)
    },
    //修改与配置
    configFn(host) {
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.tableShow = false
      this.listLoading = true
      let params={host,selectCluster:this.selectCluster}
       this.configQuery.host = host
        kafkaReadBrokerConfig(params).then(res=>{
             this.listLoading = false
          if(res.data.reply.returnCode.type==='S'){
            this.configData = res.data.reply.result;
            this.Errormessage=''
          }else{
            this.Errormessage=res.data.reply.returnCode.message;
          } 
      })
    },
    showMessageFromChild(data) {
      this.tableShow = data
    },
    //2.broker启停
    StartStop(host,status){
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.$confirm(`是否继续${status=="stop"?"启动":"停止"}？`,{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:'warning'
        }).then(()=>{
      let params={
        data:{ host,status:status=="start"?'stop':"start"},
        selectCluster:this.selectCluster,
      }
      StartStop(params).then(res=>{
        if(res.data.reply.returnCode.type==="S"){
          this.$message.success('起停成功！');
          this.getBrokerList();
        }else{
          this.$message.error(`起停失败 ${res.data.reply.returnCode.message}`);
        }
      })
    }).catch(()=>{
    }) 
    },
    //查看详情
    detail(row){
      this.kafkadetail=[];
      this.kafkadetail.push(row); 
    },
    //触发倒计时
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
    StartorStopList(){
      this.flag=!this.flag;
      if(!this.flag){
        this.startorstop='停止';
        this.timer=setInterval(this.getBrokerList,this.time); 
        this.text(); 
      }else{
        this.startorstop='启动';
        clearInterval(this.timer)
        clearInterval(this.timer1);
        this.starttime='';
      }
    },
    //强停
    ForceStop(host){
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.$confirm("是否继续强停",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:'warning'
        }).then(()=>{
        let params={
          host,selectCluster:this.selectCluster,
        }
      forceStop(params).then(res=>{
        if(res.data.reply.returnCode.type==="S"){
          this.$message.success('强停成功！');
          this.getBrokerList();
        }
      })
    }).catch(()=>{
    }) 
    },
    // toggleSelect(rows){
    //   if(rows){
    //     rows.forEach(row=>{
    //         this.IDs.push(row.id);
    //     })
    // }else{
    //     this.IDs=[];
    // } 
    // },
    //批量起停
    BatchRev(){
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
              return {id:item.id,host:item.host,status:item.status}
          })
            let params={
              data:{ arr },
              selectCluster:this.selectCluster
            }
          BatchRev(params).then(res=>{
            if(res.data.reply.returnCode.type==="S"){
              this.$message.success('批量起停成功！');
              this.getBrokerList();
              }
          })
        }).catch(()=>{
        }) 
      }
    },
    //批量强停
    BatchForceStop(){
      if(!this.multipleSelection[0]){
        this.$message({
          message:'请先选择一条数据进行添加标签的操作！',
          type:"warning"
      })
      }else{
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.$confirm("是否继续批量强停",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:'warning'
        }).then(()=>{
      let arr= this.multipleSelection.map(item=>{
        return {id:item.id,host:item.host,status:item.status}
     })
      let params={
        data:{ arr },
        selectCluster:this.selectCluster
      }
      BatchForceStop(params).then(res=>{
        if(res.data.reply.returnCode.type==="S"){
          this.$message.success('批量强停成功!');
          this.getBrokerList();
          }
      })
    }).catch(()=>{
    }) 
  }
    },
    //手动恢复
    kafkaRecoverBroker(host){
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.$confirm("是否继续手动恢复",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:'warning'
        }).then(()=>{
      let params={host,selectCluster:this.selectCluster};
      kafkaRecoverBroker(params).then(res=>{
        if(res.data.reply.returnCode.type==="S"){
          this.$message.success('手动恢复成功!');
          this.getBrokerList();
          }
      })
    }).catch(()=>{
    }) 
    },
    handleChange(item) {
      this.page = item.page;
      this.pageSize = item.limit;
      this.getBrokerList();
    },
      
  }
}
export default list
