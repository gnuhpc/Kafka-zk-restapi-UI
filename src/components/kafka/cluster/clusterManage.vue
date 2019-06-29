<template>
  <div class="cluster_manage">
    <div class="cluster_manage_header">
      <el-row>
        <el-col :span="20">
          <el-button type="primary" size="mini" @click="addClusterClick">添加集群</el-button>
        </el-col>
        <el-col :span="4">
          <el-input size="mini" v-model="clusterSearchString" prefix-icon="el-icon-search" placeholder="请输入要搜索的内容" @change="searchEventChange"></el-input>
        </el-col>
      </el-row>
    </div>

    <div class="cluster_list">
      <Tables id="cluster_list"
              isPaging
              v-loading="loading"
              :total="clusterSearchString.length?clusterSearchAll.length:clustersAll.length"
              :data="clusterSearchString.length?clusterSearchData:clusterData"
              :category="clusterCategory"
              :handles="clusterHandles"
              @refresh-data="refreshData"
              @handle-click="handleClick">
      </Tables>
    </div>


    <el-dialog title="集群管理" :visible.sync="showDialog" :before-close="beforeClose" center>

      <el-form :model="clusterItem" size="mini" :rules="clusterRules" ref="clusterForm">

          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="集群名称" prop="clusterName">
              <el-input v-model="clusterItem.clusterName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="描述" prop="clusterDesc">
              <el-input v-model="clusterItem.clusterDesc"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="所在机房" prop="serverRoom">
              <el-select v-model="clusterItem.serverRoom" placeholder="请选择所在机房">
                <el-option label="马坡机房" value="马坡机房"></el-option>
                <el-option label="鹏博士机房" value="鹏博士机房"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="kafka版本" prop="kafkaVersion">
              <el-select v-model="clusterItem.kafkaVersion" placeholder="请选择所在机房">
                <el-option label="0.10.X" value="0.10.X"></el-option>
                <el-option label="1.X" value="1.X"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="kafka用户" prop="kafkaUser">
              <el-input v-model="clusterItem.kafkaUser"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="kafka地址(按格式HOST1:PORT1,HOST2:PORT2填写)" prop="brokerUrl">
              <el-input v-model="clusterItem.brokerUrl"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="kafkaJMX地址(按格式HOST1:PORT1,HOST2:PORT2填写)" prop="brokerJmxUrl">
              <el-input v-model="clusterItem.brokerJmxUrl"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="kafka配置文件地址" prop="kafkaPath">
              <el-input v-model="clusterItem.kafkaPath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="Kafka启停脚本路径" prop="kafkaStartStopScriptPath">
              <el-input v-model="clusterItem.kafkaStartStopScriptPath"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="zk版本" prop="zkVersion">
              <el-select v-model="clusterItem.zkVersion" placeholder="请选择zk版本">
                <el-option label="3.4.X" value="3.4.X"></el-option>
                <el-option label="3.5.X" value="3.5.X"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="zk地址(按格式HOST1:PORT1,HOST2:PORT2填写)" prop="zkAddress">
              <el-input v-model="clusterItem.zkAddress"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="zk启停脚本路径(例如/usr/local/zookeeper-3.4.8/bin/zkServer.sh)" prop="zkStartStopScriptPath">
              <el-input v-model="clusterItem.zkStartStopScriptPath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-right: 10px">
            <el-form-item label="zk配置文件地址" prop="zkPath">
              <el-input v-model="clusterItem.zkPath"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 10px">
            <el-form-item label="zk用户" prop="zkUser">
              <el-input v-model="clusterItem.zkUser"></el-input>
            </el-form-item>
          </el-col>

      </el-form>

      <span slot="footer">
        <el-button size="mini" @click="showDialog = false">返回</el-button>
        <el-button size="mini" type="primary" @click="clusterSubmit">提交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import Tables from '../../Common/ZCTables'
  import api from '../../../api/cluster'

  import '../../../styles/paas_style_element.css'

  export default {
    name: "clusterManage",
    components: {Tables},
    data() {
      return {
        loading:true,
        clusterSearchAll:[],
        clusterSearchData:[],
        clusterSearchString:'',


        clustersAll: [],
        clusterData: [],
        clusterCategory: [
          {prop: 'clusterName', label: '集群名称'},
          {prop: 'clusterDesc', label: '描述'},
          {prop: 'serverRoom', label: '所在机房'},
          {prop: 'kafkaVersion', label: 'kafka版本'},
          {prop: 'kafkaUser', label: 'kafka用户'},
          {prop: 'brokerUrl', label: 'Kafka地址'},
          {prop: 'brokerJmxUrl', label: 'KafkaJMX地址'},
          {prop: 'kafkaPath', label: 'kafka配置文件地址'},
          {prop: 'kafkaStartStopScriptPath', label: 'Kafka启停脚本路径'},
          {prop: 'zkVersion', label: 'zk版本'},
          {prop: 'zkAddress', label: 'zk地址'},
          {prop: 'zkStartStopScriptPath', label: 'zk启停脚本路径'},
          {prop: 'zkPath', label: 'zk配置文件地址'},
          {prop: 'zkUser', label: 'zk用户'},
        ],
        clusterHandles: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        showDialog: false,
        /*表单相关*/
        clusterItem: {},
        clusterRules: {
          clusterName: [
            {required: true, message: '集群名称不能为空', trigger: 'blur'},
          ],
          clusterDesc: [
            {required: true, message: '描述不能为空', trigger: 'blur'},
          ],
          serverRoom: [
            {required: true, message: '所在机房不能为空', trigger: 'blur'},
          ],
          kafkaVersion: [
            {required: true, message: 'kafka版本不能为空', trigger: 'blur'},
          ],
          kafkaUser: [
            {required: true, message: 'kafka用户不能为空', trigger: 'blur'},
          ],
          brokerUrl: [
            {required: true, message: 'Kafka地址不能为空', trigger: 'blur'},
          ],
          brokerJmxUrl: [
            {required: true, message: 'KafkaJMX地址不能为空', trigger: 'blur'},
          ],
          kafkaPath: [
            {required: true, message: 'kafka配置文件地址不能为空', trigger: 'blur'},
          ],
          kafkaStartStopScriptPath: [
            {required: true, message: 'Kafka启停脚本路径不能为空', trigger: 'blur'},
          ],
          zkVersion: [
            {required: true, message: 'zk版本不能为空', trigger: 'blur'},
          ],
          zkAddress: [
            {required: true, message: 'zk地址不能为空', trigger: 'blur'},
          ],
          zkStartStopScriptPath: [
            {required: true, message: 'zk启停脚本路径不能为空', trigger: 'blur'},
          ],
          zkPath: [
            {required: true, message: 'zk配置文件地址不能为空', trigger: 'blur'},
          ],
          zkUser: [
            {required: true, message: 'zk用户不能为空', trigger: 'blur'},
          ],
        }
      }
    },
    mounted() {
      this.findAllKafkaCluster()
    },
    methods: {



      findAllKafkaCluster() {
        api.findAllKafkaCluster().then(response => {
          console.log(response);
          let code = response.data.reply.returnCode, data = response.data.reply.result;

          if (code.type === 'S') {
            this.loading = false;
            this.clustersAll = data.kafkaClusterInfoList;
            this.pageNum = 1;
            this.handleClustersAll(false);
          } else {
            this.$message.error(code.message);
          }
        })
      },

      handleClustersAll(isSearch){
        let result = [];
        if (isSearch){
          this.clusterSearchData = this.clusterSearchAll.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize);
          this.clusterSearchData.forEach(item => {
            result.push([
              {name: '编辑', type: 1},
              {name: '删除', type: 2},
            ])
          });
        } else{
          this.clusterData = this.clustersAll.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize);
          this.clusterData.forEach(item => {
            result.push([
              {name: '编辑', type: 1},
              {name: '删除', type: 2},
            ])
          });
        }
        this.clusterHandles = result;

      },


      refreshData(pageNum, pageSize) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.handleClustersAll(this.clustersAll,this.clusterData);
      },

      //操作按钮点击事件
      handleClick(rowIndex, type) {

        let result = this.clusterData[rowIndex];

        if (type === 1){//编辑
          this.showDialog = true;
          this.clusterItem = Object.assign({},result);

        } else if(type === 2){//删除
          api.deleteKafkaCluster(result.id).then(response=>{
            let code = response.data.reply.returnCode, data = response.data.reply.result;

            if (code.type === 'S') {
             this.$message.success('操作成功');
             this.findAllKafkaCluster();
            } else {
              this.$message.error('操作失败');
            }
          });
        }


      },

      //搜索结果处理
      searchEventChange(value){

        this.pageNum = 1;
        let searchStr = value.toString(),result = [];

        if (!searchStr.length){
          this.handleClustersAll(false);
          this.clusterSearchAll = [];
          return;
        }

        // result.push(this.clustersAll.map((item)=>item.clusterName).indexOf(searchStr));
        // let result = this.clustersAll.filter(item=>{
        //
        //   if(item.clusterName.indexOf(searchStr) >=0){
        //     return item.clusterName.indexOf(searchStr) >=0
        //
        //   }else if(item.clusterDesc.indexOf(searchStr) >=0){
        //     return item.clusterDesc.indexOf(searchStr) >=0
        //
        //   }else if(item.serverRoom.indexOf(searchStr) >=0){
        //     return item.serverRoom.indexOf(searchStr) >=0
        //
        //   }else if(item.kafkaVersion.indexOf(searchStr) >=0){
        //     return item.kafkaVersion.indexOf(searchStr) >=0
        //
        //   }else if(item.kafkaUser.indexOf(searchStr) >=0){
        //     return item.kafkaUser.indexOf(searchStr) >=0
        //
        //   }else if(item.brokerUrl.indexOf(searchStr) >=0){
        //     return item.brokerUrl.indexOf(searchStr) >=0
        //
        //   }else if(item.brokerJmxUrl.indexOf(searchStr) >=0){
        //     return item.brokerJmxUrl.indexOf(searchStr) >=0
        //
        //   }else if(item.kafkaPath.indexOf(searchStr) >=0){
        //     return item.kafkaPath.indexOf(searchStr) >=0
        //
        //   }else if(item.kafkaStartStopScriptPath.indexOf(searchStr) >=0){
        //     return item.kafkaStartStopScriptPath.indexOf(searchStr) >=0
        //
        //   }else if(item.zkVersion.indexOf(searchStr) >=0){
        //     return item.zkVersion.indexOf(searchStr) >=0
        //
        //   }else if(item.zkAddress.indexOf(searchStr) >=0){
        //     return item.zkAddress.indexOf(searchStr) >=0
        //
        //   }else if(item.zkStartStopScriptPath.indexOf(searchStr) >=0){
        //     return item.zkStartStopScriptPath.indexOf(searchStr) >=0
        //
        //   }else if(item.zkPath.indexOf(searchStr) >=0){
        //     return item.zkPath.indexOf(searchStr) >=0
        //
        //   }else if(item.zkUser.indexOf(searchStr) >=0){
        //     return item.zkUser.indexOf(searchStr) >=0
        //   }
        // })


        // console.log(result);
        // this.clusterSearchAll = result;
        // this.handleClustersAll(true);
      },
      //增加集群按钮点击事件
      addClusterClick() {
        this.showDialog = true;
        this.clusterItem = {
          clusterName: '',
          clusterDesc: '',
          serverRoom: '',
          kafkaVersion: '',
          kafkaUser: '',
          brokerUrl: '',
          brokerJmxUrl: '',
          kafkaPath: '',
          kafkaStartStopScriptPath: '',
          zkVersion: '',
          zkAddress: '',
          zkStartStopScriptPath: '',
          zkPath: '',
          zkUser: '',
        }
      },


      /**************************集群编辑页面相关******************************/
      beforeClose(done) {
        this.$refs.clusterForm.clearValidate();
        this.$confirm('确定关闭吗?').then(_ => {
          done();
        }).catch(_ => {
        })
      },
      clusterSubmit() {
        this.$refs.clusterForm.validate((valid) => {
          if (valid) {
            if (this.clusterItem.id){
              api.updateKafkaCluster({kafkaClusterInfo:this.clusterItem}).then(response=>{
                console.log(response);
                let code = response.data.reply.returnCode, data = response.data.reply.result;
                if (code.type === 'S') {
                  this.showDialog = false;
                  this.findAllKafkaCluster();
                }else{
                  this.$message.error(code.message);
                }
              })
            } else{
              api.saveKafkaCluster({kafkaClusterInfo:this.clusterItem}).then(response=>{
                console.log(response);
                let code = response.data.reply.returnCode, data = response.data.reply.result;
                if (code.type === 'S') {
                  this.showDialog = false;
                  this.findAllKafkaCluster();
                }else{
                  this.$message.error(code.message);
                }
              })
            }

          }
        })
      },

    }
  }
</script>

<style scoped>
  .cluster_manage {
    padding: 0 10px;
  }

  .cluster_manage_header {
    margin-bottom: 10px;
  }

  .cluster_list {
    width: 100%;
    min-height: 1px;
  }
</style>
