import {updateZkConfig} from '@/api/zookeeper'
import * as zkApi from '@/api/zookeeper'
const zkConfigDetail = {
  data () {
    return {
      data: [],
      // configQuery: {
      //   host: 9999,
      //   user: 'hadoop',
      //   remoteFileType: 'prop',
      //   timeout: 60000,
      //   remoteFile: '/usr/local/zookeeper-3.4.8/conf/zoo.cfg'
      // },
      addConfigData: {
        key: '',
        value: '',
        type: 'new'
      },
      queryData: [],
      warning: false,
      dialogVisible: false,
      deleteKey: [],
      AddnewArray:[],
      selectCluster:''
     
    }
  },
  props: ['configData', 'host','Errormessage'],
  watch:{
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
    configData(curVal) {
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
     
    }
  },
  methods: {
    deleteFn(index, rowData) {
      this.deleteKey.push(rowData.key)
      this.data.splice(index, 1)
    },
    addConfigFn() {
      if(!this.addConfigData.key||!this.addConfigData.value){
        this.$message.error('属性名或者属性值不能为空！');
         return;
      }
      this.AddnewArray.push(this.addConfigData)
      this.data.push(this.addConfigData)
      this.dialogVisible = false
      this.addConfigData = {
        key: '',
        value: '',
        type: 'new'
      }
    },
    submitConfigFn: function () {
      let data = []
      for (let i = 0; i < this.data.length; i++) {
        if(this.data[i].default!=this.data[i].value){
          let str = this.data[i].key + '=' + this.data[i].value
          data.push(str)
        }
      }
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
          host:this.host,
          data:data,
          deleteKey:this.deleteKey,
        }
      }
      updateZkConfig(params).then((res) => {
        if (res.data.developerMessage !== undefined) {
          this.$message.error(res.data.developerMessage)
          return
        }
        if (res.data.reply.returnCode.type==="S") {
          this.$message.success('配置文件修改成功')
          this.deleteKey = []
          this.AddnewArray=[]
        } else {
          this.$message.error('配置文件修改失败')
        }
      })
    },
    returnFn() {
      this.$emit('listenToChildEvent', true)
      this.tableShow = true
    },
  }
}
export default zkConfigDetail
