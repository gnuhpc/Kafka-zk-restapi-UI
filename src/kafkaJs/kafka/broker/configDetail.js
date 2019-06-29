import {updateBrokerConfig,updateBroCluConf} from '../../../api/broker'
const configDetail = {
  data () {
    return {
      data: [],
      configQuery: {
        host: 9999,
        user: 'hadoop',
        remoteFileType: 'prop',
        timeout: 60000,
        remoteFile: '/app/confluent/etc/kafka/server.properties'
      },
      addConfigData: {
        key: '',
        value: '',
        type: 'new'
      },
      queryData: [],
      warning: false,
      dialogVisible: false,
      deleteKey: [],
      brokerConf: ['broker.id', 'listeners', 'log.dir', 'log.dirs'],
      AddnewArray:[],
      selectCluster:'',
      Errormessagecurval:''
    }
  },
  props: ['configData', 'host','Errormessage'],
  watch: {
    Errormessage:{
      handler(curVal, oldVal) {
        this.data=[];
        this.Errormessagecurval=curVal
        if(curVal){
          this.$message.error(`${this.Errormessage}`);
          return;
        }
      },
      immediate:true
    },
    configData:{
      handler(curVal, oldVal) {
        this.data=[];
        this.configData = curVal
        if (this.configData) {
          for (let i = 0; i < this.configData.length; i++) {
            let ary = this.configData[i].split('=')
            let json = {}
            json.key = ary[0]
            json.value = ary[1]
            json.default = ary[1]
            json.type = 'old'
            this.data.push(json)
          }
        }
       },
    },
  
  },
  methods: {
    returnFn() {
      this.$emit('listenToChildEvent', true)
      this.tableShow = true
    },
    editFn(type) {
      this.configQuery.host = this.host
      let datas=this.configQuery
      let data = []
      for (let i = 0; i < this.data.length; i++) {
        let str = this.data[i].key + '=' + this.data[i].value
        if (this.data[i].value !== this.data[i].default) {
          if (type === 'cluster') {
            for (let j = 0; j < this.brokerConf.length; j++) {
              if (this.data[i].key === this.brokerConf[j]) {
                this.$message.error(this.data[i].key + '属性为broker单独配置，不能修改，会自动略过！')
                break
              } else {
                if (j === this.brokerConf.length - 1) {
                  data.push(str)
                }
              }
            }
          } else {
            data.push(str)
          }
        }
      }
      datas.configContent = data
      this.AddnewArray.forEach((item1,index1)=>{
        this.deleteKey.forEach((item2,index2)=>{
          if(item1.key===item2){
            this.deleteKey.splice(index2,1)
            this.AddnewArray.splice(index1,1)
          }
      })
    })
    this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
       let params={
        "selectCluster":this.selectCluster,
        data:{
          data:data,
          deleteKey:this.deleteKey,
        }
      }
      //修改本地配置
      if (type === 'local') {
        params.data.host=this.host,
        updateBrokerConfig(params).then((res) => {
          if (res.data.reply.returnCode.type==="S") {
            this.$message.success('配置文件修改成功')
            this.deleteKey = []
            this.AddnewArray=[]
          } else {
            this.$message.error(`配置文件修改失败 ${res.data.reply.returnCode.message}`)
          }
        })
      } else {
        //修改集群配置
          updateBroCluConf(params).then((res) => {
            // if (res.data.developerMessage !== undefined) {
            //   this.$message.error(res.data.developerMessage)
            //   return
            // }
            if (res.data.reply.returnCode.type==="S") {
              this.$message.success('配置文件修改成功');
              this.deleteKey = []
              this.AddnewArray=[]
            } else {
              this.$message.error(`配置文件修改失败 ${res.data.reply.returnCode.message}`)
            }
          })
      }
    },
    deleteFn(index, rowData) {
        this.deleteKey.push(rowData.key)
        this.$confirm("确定要删除该配置项吗",{
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:'warning'
          }).then(()=>{
            this.data.splice(index, 1);
            this.$message.success('删除成功！')
          }).catch(()=>{})   
    },
    addConfigFn() {
      if(!this.addConfigData.key||!this.addConfigData.value){
        this.$message.error('属性名或者属性值不能为空！');
         return;
      }
      this.AddnewArray.push(this.addConfigData)
      this.data.push(this.addConfigData);
      this.$message.success('添加成功！')
      this.dialogVisible = false
      this.addConfigData = {
        key: '',
        value: '',
        type: 'new'
      }
    }
  }
}
export default configDetail
