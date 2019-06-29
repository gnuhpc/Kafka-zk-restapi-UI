<template>
  <section>
    <section v-show="mainContentVisible">
      <el-row>
        <el-col :span="18" style="padding-bottom: 6px;">
          <el-button class="margin-left0" type="primary" size="mini" @click="addPartitionsVisible = true;ruleFormData.partitionsNum='';ruleFormData.replicaAssignment=''" plain>添加分区
          </el-button>
          <el-button class="margin-left0" type="primary" size="mini" @click="partitionRedistryVisible = true;" plain>分区重分布
          </el-button>
          <el-button class="margin-left0" type="primary" size="mini" @click="addReplicasVisible = true" plain>添加副本
          </el-button>
          <el-button class="margin-left0" type="primary" size="mini" @click="partitionRedistryHand" plain>手工分区重分布
          </el-button>
        </el-col>
        <el-col :span="6" style="padding-bottom: 6px;">
          <div class="pull-right">
            <el-button class="margin-left0" type="primary" size="mini" @click="refreshDetail" plain>刷新</el-button>
            <!-- <el-button class="margin-left0" type="primary" size="mini" @click="goBack" plain>返回</el-button> -->
          </div>
        </el-col>
      </el-row>
      <!--列表-->
      <el-table :data="detailData.topicPartitionInfos" style="width: 100%;">
        <el-table-column prop="topicPartitionInfo.partition" label="分区ID" min-width="8%">
        </el-table-column>
        <el-table-column prop="topicPartitionInfo.leader.host" label="leader" min-width="12%">
        </el-table-column>
        <el-table-column prop="topicPartitionInfo.replicas" label="副本分布" :formatter="formatToString" min-width="12%">
        </el-table-column>
        <el-table-column prop="topicPartitionInfo.isr" label="ISR" :formatter="formatToString2" min-width="12%">
        </el-table-column>
        <el-table-column prop="startOffset" label="开始offset" min-width="12%">
        </el-table-column>
        <el-table-column prop="endOffset" label="结束offset" min-width="12%">
        </el-table-column>
        <el-table-column prop="messageAvailable" label="可用消息数" min-width="12%">
        </el-table-column>
        <el-table-column label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-dropdown size="mini">
              <el-button size="mini" type="primary">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item type="text" @click.native="viewMessageDetail(scope.row)">消费详情</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <template>
        <div style="font-size:14px;padding:10px 0;height:16px;"><strong class="solidline"></strong> leader副本 | <strong class="dashline"></strong> follower副本 |
          <strong class="bgred"></strong> under replicated副本</div>
        <div class="pull-left broker-box" v-for="(item,index) in partitionInfos">
          <label class="broker-title" style="margin-top: 5px;font-size: 14px">broker{{item.replicas}}</label>
          <div>
            <label :class="{'broker-partition':item.leader.indexOf(item1)!==-1,'broker-partition-dashed':item.leader.indexOf(item1) ==-1,'bg-red':item.bgPartition.indexOf(item1)!==-1}"
              v-for="(item1,index1) in item.partitionId">partition{{item1}}</label>
          </div>
        </div>
      </template>
      <!-- consumer详情 -->
      <el-dialog title="consumer详情" :visible.sync="consumerDetailVisible" width="85%">
        <el-table :data="consumerDetailList" style="width: 100%;" v-loading="consumerlistLoading">
          <el-table-column prop="type" label="type" min-width="6%">
          </el-table-column>
          <el-table-column prop="groupName" label="groupName" min-width="8%">
          </el-table-column>
          <el-table-column prop="state" label="state" min-width="8%">
          </el-table-column>
          <el-table-column prop="coordinator.id" label="coordinator" min-width="8%">
          </el-table-column>
          <el-table-column prop="host" label="host" min-width="8%">
          </el-table-column>
          <el-table-column prop="consumerId" label="consumerId" show-overflow-tooltip min-width="14%">
          </el-table-column>
          <el-table-column prop="clientId" label="clientId" min-width="10%">
          </el-table-column>
          <el-table-column prop="partitionId" label="partitionId" min-width="8%">
          </el-table-column>
          <el-table-column prop="currentOffset" label="currentOffset" min-width="10%">
          </el-table-column>
          <el-table-column prop="logEndOffset" label="logEndOffset" min-width="10%">
          </el-table-column>
          <el-table-column prop="lag" label="lag" min-width="6%">
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--增加分区-->
      <el-dialog title="" :visible.sync="addPartitionsVisible" width="50%">
        <el-form label-width="150px" :model="ruleFormData" :rules="rules1" ref="ruleFormData">
          <el-form-item label="Topic名称:">
            <el-input v-model="detailData.topicName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="添加分区个数:" prop="partitionsNum">
            <el-input v-model.number="ruleFormData.partitionsNum" @change="autoAllocationChange"></el-input>
          </el-form-item>
          <el-form-item label="分配方式:">
            <el-radio-group v-model="ruleFormData.type" @change="radioSelected">
              <el-radio label="type1">单个添加</el-radio>
              <el-radio label="type2" @change="autoAllocation">自动分配</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="broker分配策略:" v-if="ruleFormData.type=='type1'">
            <div class="pull-left" v-for="(se,index) in ruleFormData.brokersSelect" :key="se">
              <el-select v-model="ruleFormData.brokersSelect[index]" collapse-tags placeholder="请选择broker" style="width: 80px;">
                <el-option v-for="item in brokers" :key="item" :value="item" :label="item"></el-option>
              </el-select>
              <span v-if="index!=ruleFormData.brokersSelect.length-1">：</span>
            </div>
            <div class="pull-left">
              <el-button class="margin-left10" type="success" size="mini" @click="addReplicaAssignment">添加</el-button>
              <el-button type="success" size="mini" @click="cleanReplicaAssignment">清空</el-button>
            </div>
          </el-form-item>
          <el-form-item label="" prop="replicaAssignment" v-if="ruleFormData.type=='type1'">
            <el-input type="textarea" v-model="ruleFormData.replicaAssignment" readonly></el-input>
          </el-form-item>
          <el-form-item label="" prop="replicaAssignment" v-if="ruleFormData.type=='type2'">
            <label class="autoTitle">"格式需满足：broker_id_for_part1_replica1:broker_id_for_part1_replica2,
              broker_id_for_part2_replica1:broker_id_for_part2_replica2,..."</label>
            <el-input type="textarea" v-model="ruleFormData.replicaAssignment" readonly></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addPartitionsVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPartitions('ruleFormData')">确 定</el-button>
        </span>
      </el-dialog>
      <!--增加副本-->
      <el-dialog title="" :visible.sync="addReplicasVisible" width="40%">
        <el-form label-width="150px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="Topic名称:">
            <el-input v-model="detailData.topicName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="新增加副本数:" prop="replicasNum">
            <el-input v-model.number="ruleForm.replicasNum"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addReplicasVisible = false">取 消</el-button>
          <el-button type="primary" @click="addReplicas('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--分区重分布-->
      <el-dialog title="" :visible.sync="partitionRedistryVisible" width="500px">
        <el-form label-width="150px">
          <el-form-item label="Topic名称:">
            <el-input v-model="detailData.topicName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="broker:">
            <el-select v-model="brokerSelect" multiple placeholder="请选择broker">
                <el-option key="all" value="all" label="all"></el-option>
              <el-option v-for="item in brokers" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="partitionRedistryVisible = false">取 消</el-button>
          <el-button type="primary" @click="partitionRedistry">确 定</el-button>
        </span>
      </el-dialog>
    </section>
    <!--分区重分布-->
    <section v-show="partitionContentVisible">
      <!--工具条-->
      <el-row style="padding-bottom: 0px;">
        <el-col :span="24">
          <el-form :inline="true">
            <el-form-item label="broker间限速:">
              <el-input size="mini" v-model="replicaAlterLogDirsThrottle" style="width: 100px;" /> MB/s
            </el-form-item>
            <el-form-item label="broker内限速:">
              <el-input size="mini" v-model="interBrokerThrottle" style="width: 100px;" /> MB/s
            </el-form-item>
            <el-form-item label="超时时间:">
              <el-input size="mini" v-model="timeoutMs" style="width: 100px;" /> s
            </el-form-item>
            <el-form-item class="pull-right">
              <el-button class="margin-left0" type="success" size="mini" @click="reassignExecute" plain>提交数据</el-button>
              <el-button class="margin-left0" type="primary" size="mini" @click="goBackDetail" plain>返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template>
        <div>
          <label>目前topic分区分布的情况:</label>
          <table id="tablePartitionsNow" class="tableBox table-border-box">
            <tr>
              <td>
                <div class="pull-left broker-box" v-for="(item,index) in partitions[0].partitions">
                  <label class="broker-title" style="margin-top: 5px;font-size: 14px">broker{{item.replicas}}</label>
                  <div>
                    <label class="broker-partition" v-for="(item1,index1) in item.partition">partition{{item1}}</label>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <label>将要重新分配的分布情况:</label>
          <table id="tablePartitionsUpdate" class="tableBox table-border-box">
            <tr>
              <td>
                <div class="pull-left broker-box" v-for="(item,index) in partitions[1].partitions">
                  <label class="broker-title" style="margin-top: 5px;font-size: 14px">
                    <input type="radio" :value="item.replicas" v-model="partitionRadio">broker{{item.replicas}}</label>
                  <div>
                    <label class="broker-partition" @click="changePartition(item.replicas,item1,index1)" v-for="(item1,index1) in item.partition">partition{{item1}}</label>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <label>重分布结果:</label>
          <el-button class="margin-left0 pull-right" type="success" size="mini" @click="reassignCheck" plain><i class="fa fa-refresh"></i>刷新
          </el-button>
          <table id="tablePartitionsResult" class="tableBox table-border">
            <tr v-for="(value,key) in exceteResultPartitions">
              <td>{{key}}</td>
              <td v-if="value==0">
                <el-button type="primary" size="mini">进行中</el-button>
              </td>
              <td v-else-if="value==1">
                <el-button type="success" size="mini">进行结束</el-button>
              </td>
              <td v-else>
                <el-button type="danger" size="mini">失败</el-button>
              </td>
            </tr>
          </table>
        </div>
      </template>
    </section>
    <!--添加副本-->
    <section v-show="addReplicasContentVisible">
      <!--工具条-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item class="pull-right">
            <el-button class="margin-left0" type="success" size="mini" @click="reassignExecute" plain>提交数据</el-button>
            <el-button class="margin-left0" type="primary" size="mini" @click="goBackDetail" plain>返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <template>
        <div>
          <label>目前topic分区分布的情况:</label>
          <table class="tableBox table-border-box">
            <tr>
              <td>
                <div class="pull-left broker-box" v-for="(item,index) in partitions[0].partitions">
                  <label class="broker-title" style="margin-top: 5px;font-size: 14px">broker{{item.replicas}}</label>
                  <div>
                    <label class="broker-partition" v-for="item1,index1 in item.partition">partition{{item1}}</label>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <label>添加副本后的分布情况:</label>
          <table class="tableBox table-border-box">
            <tr>
              <td>
                <div class="pull-left broker-box" v-for="(item,index) in partitions[1].partitions">
                  <label class="broker-title" style="margin-top: 5px;font-size: 14px">broker{{item.replicas}}</label>
                  <div>
                    <label class="broker-partition" @click="changePartition(item.replicas,item1,index1)" v-for="(item1,index1) in item.partition">partition{{item1}}</label>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <label>添加副本结果:</label>
          <el-button class="margin-left0 pull-right" type="success" size="mini" @click="reassignCheck" plain><i class="fa fa-refresh"></i>刷新
          </el-button>
          <table class="tableBox table-border">
            <tr v-for="(value,key) in exceteResultReplicas">
              <td>{{key}}</td>
              <td v-if="value==0">
                <el-button type="primary" size="mini">进行中</el-button>
              </td>
              <td v-else-if="value==1">
                <el-button type="success" size="mini">进行结束</el-button>
              </td>
              <td v-else>
                <el-button type="danger" size="mini">失败</el-button>
              </td>
            </tr>
          </table>
        </div>
      </template>
    </section>
    <!-- 手工分区重分布 -->
    <section v-show="partitionHandContentVisible">
      <!--工具条-->
      <el-row style="padding-bottom: 0px;">
        <el-col :span="24">
          <el-form :inline="true">
            <el-form-item label="broker间限速:">
              <el-input size="mini" v-model="replicaAlterLogDirsThrottle" style="width: 100px;" /> MB/s
            </el-form-item>
            <el-form-item label="broker内限速:">
              <el-input size="mini" v-model="interBrokerThrottle" style="width: 100px;" /> MB/s
            </el-form-item>
            <el-form-item label="超时时间:">
              <el-input size="mini" v-model="timeoutMs" style="width: 100px;" /> s
            </el-form-item>
            <el-form-item class="pull-right">
              <el-button class="margin-left0" type="success" size="mini" @click="reassignExecuteHand" plain>提交数据</el-button>
              <el-button class="margin-left0" type="primary" size="mini" @click="goBackDetail" plain>返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template>
        <div>
          <label>分区分布情况:</label>
          <table id="tablePartitionsNow" class="tableBox table-border-box">
            <tr>
              <td>
                <div class="pull-left borderBox" v-for="(item,index) in partitionMessageList.topicPartitionInfos" :key="index">
                  <div class="innerBox">
                    <label class="broker-title" style="display:inline-block;margin: 5px 0 5px 3px;font-size: 14px">
                      partition{{item.topicPartitionInfo.partition}}</label>
                    <div>
                      <label v-for="(item1,index1) in item.topicPartitionInfo.replicas" :key="item1.id" style="display:inline-block;margin:0 0 3px 3px;">
                        replica{{index1}}:
                        <el-input-number v-model="item1.id" controls-position="right" @change="handleChangeNumber" :min="minBroker"
                          :max="maxBroker" size="mini">
                        </el-input-number>
                        <span :class="{'color-blue':item1.id==item.topicPartitionInfo.leader.id,'color-green':item1.id!=item.topicPartitionInfo.leader.id,}"></span>
                        <el-select v-model="item1.log_dirs" placeholder="请选择目录信息" size="mini" @change="change">
                          <el-option v-for="(val1,key1) in optionDirs[item1.id]" :key="key1" :label="val1" :value="val1">
                          </el-option>
                        </el-select>
                      </label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <label>重分布结果:</label>
          <el-button class="margin-left0 pull-right" type="success" size="mini" @click="reassignCheckHand" plain><i class="fa fa-refresh"></i>刷新
          </el-button>
          <table id="tablePartitionsResult" class="tableBox table-border">
            <tr v-for="(value,key) in exceteResultPartitionsHand">
              <td>{{key}}</td>
              <td v-if="value==0">
                <el-button type="primary" size="mini">进行中</el-button>
              </td>
              <td v-else-if="value==1">
                <el-button type="success" size="mini">进行结束</el-button>
              </td>
              <td v-else>
                <el-button type="danger" size="mini">失败</el-button>
              </td>
            </tr>
          </table>
        </div>
      </template>
    </section>
  </section>
</template>
<script>
  import "@/styles/kafka.css";
  import "@/styles/paas_style_element.css"
  import api from '@/api/topic'
  export default {
    data() {
      return {
        data: [],
        mainContentVisible: true,
        addPartitionsVisible: false,
        partitionContentVisible: false,
        partitionInfos: [],
        addReplicasVisible: false,
        addReplicasContentVisible: false,
        partitionRedistryHandVisible: false,
        partitionHandContentVisible: false,
        ruleForm: {
          replicasNum: ''
        },
        rules: {
          replicasNum: [
            { required: true, message: '请输入副本数', trigger: 'blur' },
            { type: 'number', message: '副本数必须为数字', trigger: 'blur' }
          ]
        },
        ruleFormData: {
          type: 'type1',
          typeShow: true,
          partitionsNum: '',
          brokersSelect: [],
          replicaAssignment: '',
        },
        rules1: {
          partitionsNum: [
            { required: true, message: '请输入添加分区个数', trigger: 'blur' },
            { type: 'number', message: '添加分区个数必须为数字', trigger: 'blur' }
          ],
          replicaAssignment: [
            { required: true, message: '分配策略不能为空', trigger: 'blur' }
          ]
        },
        brokers: [],
        partitionRedistryVisible: false,
        brokerSelect: [],
        dataNow: [],
        partitions: [{ version: 1, partitions: [] }, { version: 1, partitions: [] }],
        partitionsHand: {},
        dataPartitions: [],
        partitionRadio: '',
        exceteResultPartitions: {},
        exceteResultReplicas: {},
        exceteResultPartitionsHand: {},
        checkParam: {},
        interBrokerThrottle: "20",
        replicaAlterLogDirsThrottle: "20",
        timeoutMs: "600",
        partitionMessageList: {},
        minBroker: 1,
        maxBroker: 3,
        optionDirs: {},
        consumerDetailList: [],//consumer详情
        consumerList: [],
        consumerlistLoading: false,
        consumerDetailVisible: false,
        clusterId: '',
        topicSize:''
      }
    },
    created() {
      this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.getBrokerList();
    },
    props: ['detailData'],
    watch: {
      detailData(curVal, oldVal) {
        let replicationFactor = curVal.replicationFactor
        this.ruleFormData.brokersSelect = []
        for (let i = 0; i < replicationFactor; i++) {
          this.ruleFormData.brokersSelect.push(this.brokers[i])
        }
        this.partitionInfos = []
        let data = curVal.topicPartitionInfos
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].topicPartitionInfo.replicas.length; j++) {
            for (let k = 0; k < this.partitionInfos.length; k++) {
              if (this.partitionInfos[k].replicas === data[i].topicPartitionInfo.replicas[j].id) {
                this.partitionInfos[k].partitionId.push(data[i].topicPartitionInfo.partition)
                if (data[i].topicPartitionInfo.leader !== null && data[i].topicPartitionInfo.replicas[j].id === data[i].topicPartitionInfo.leader.id) {
                  if (!this.partitionInfos[k].hasOwnProperty("leader")) {
                    this.partitionInfos[k].leader = []
                  }
                  this.partitionInfos[k].leader.push(data[i].topicPartitionInfo.partition)
                }
                if (this.itemCountInArray(data[i].topicPartitionInfo.isr, data[i].topicPartitionInfo.replicas[j]) == 0) {
                  if (!this.partitionInfos[k].hasOwnProperty("bgPartition")) {
                    this.partitionInfos[k].bgPartition = []
                  }
                  if (this.partitionInfos[k].replicas == data[i].topicPartitionInfo.replicas[j].id) {
                    this.partitionInfos[k].bgPartition.push(data[i].topicPartitionInfo.partition)
                  }
                }
                break
              } else {
                if (k === this.partitionInfos.length - 1) {
                  let json = {}
                  json.replicas = data[i].topicPartitionInfo.replicas[j].id
                  json.partitionId = [data[i].topicPartitionInfo.partition]
                  json.leader = []
                  json.bgPartition = []
                  if (data[i].topicPartitionInfo.leader !== null && data[i].topicPartitionInfo.replicas[j].id === data[i].topicPartitionInfo.leader.id) {
                    json.leader.push(data[i].topicPartitionInfo.partition)
                  }
                  if (this.itemCountInArray(data[i].topicPartitionInfo.isr, data[i].topicPartitionInfo.replicas[j]) == 0) {
                    json.bgPartition.push(data[i].topicPartitionInfo.partition)
                  }
                  this.partitionInfos.push(json)
                  break
                }
              }
            }
            if (this.partitionInfos.length === 0) {
              let json = {}
              json.partitionId = [data[i].topicPartitionInfo.partition]
              json.replicas = data[i].topicPartitionInfo.replicas[j].id
              json.leader = []
              json.bgPartition = []
              if (data[i].topicPartitionInfo.leader !== null && data[i].topicPartitionInfo.replicas[j].id === data[i].topicPartitionInfo.leader.id) {
                json.leader.push(data[i].topicPartitionInfo.partition)
              }
              if (this.itemCountInArray(data[i].topicPartitionInfo.isr, data[i].topicPartitionInfo.replicas[j]) == 0) {
                json.bgPartition.push(data[i].topicPartitionInfo.partition)
              }
              this.partitionInfos.push(json)
            }
          }
        }
        this.partitionInfos = this.partitionInfos.sort(function (a, b) {
          return a.replicas - b.replicas
        })
        //console.log(JSON.stringify(this.partitionInfos))
      },
      'ruleFormData.type': function (curVal, oldVal) {
        if (curVal == "type2") {
          this.ruleFormData.replicaAssignment = ""
          this.autoAllocation();
        } else {
          this.ruleFormData.replicaAssignment = ""
          this.addReplicaAssignment();
        }
      },
      brokerSelect(curVal){
        if(curVal.join("").indexOf("all")!==-1){
          this.brokerSelect=this.brokers;
        }else{
          this.brokerSelect=this.brokerSelect;
        }
      }
    },
    methods: {
      itemCountInArray(arr, item) {
        var num = 0;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == item.id) {
            num++;
          }
        }
        return num;
      },
      handleChangeNumber(val) {
        this.broker = val;
      },
      // 返回
      goBack: function () {
        this.$emit('showTopicManage', { topic: true, detail: false })
      },
      goBackDetail: function () {
        this.mainContentVisible = true
        this.partitionContentVisible = false
        this.addReplicasContentVisible = false
        this.partitionHandContentVisible = false
      },
      formatToString: function (row, column) {
        let replicasHostList = [];
        row.topicPartitionInfo.replicas.forEach((item, index) => {
          replicasHostList.push(item.host);
        })
        return replicasHostList.join(",");
      },
      formatToString2: function (row, column) {
        let isrHostList = [];
        row.topicPartitionInfo.isr.forEach((item, index) => {
          isrHostList.push(item.host);
        })
        return isrHostList.join(",");
      },
      //获取超时时间
      async getTopicSize(){
        let params={};
        params.selectClusterId=this.clusterId
        params.topicName=this.detailData.topicName;
        let partitionCount=[]
        for(let i=0;i<this.detailData.partitionCount;i++){
          partitionCount.push(i)
        };
        params.partitions=partitionCount.join(",");
        params.brokers=this.brokers.join(",")
        const res=await api.getTopicSize(params);
            this.topicSize=res.data.reply.topicSize
        let throttle=[];
        throttle.push(this.interBrokerThrottle);
        throttle.push(this.replicaAlterLogDirsThrottle);
        throttle = throttle.sort(function (a, b) {
          return a - b
        })
        let stemp=parseInt(this.topicSize/throttle[0])*2;
        this.timeoutMs=(stemp + 600).toString();
      },
      getBrokerList: function () {
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction(`/kafka/brokers`, "get", selectCluster).then((res) => {
          this.brokers = []
          res.data.reply.result.data.forEach(item => {
            this.brokers.push(item.id);
          })
          this.maxBroker = this.brokers[this.brokers.length - 1];
          this.minBroker = this.brokers[0];
        })
      },
      //添加副本
      addReplicas: function (formName) {
        //console.log(this.detailData,"detailData")
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addReplicasVisible = false;
            if (parseInt(this.ruleForm.replicasNum) + parseInt(this.detailData.replicationFactor) > parseInt(this.brokers.length)) {
              let temp = parseInt(this.brokers.length) - parseInt(this.detailData.replicationFactor);
              this.$message.error("最多只能添加" + temp + "个副本！")
              return;
            }
            let params = {}
            params.brokers = this.brokers
            params.topics = [this.detailData.topicName]
            this.exceteResultReplicas = {};
            this.exceteResultPartitions = {};
            let originalUri = "/kafka/partitions/reassign/generate"
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            let selectCluster = this.clusterId
            api.kafkaPackFunctionOri(`/kafka/partitions/reassign/generate`, "post", originalUri, selectCluster, params).then((msg) => {
              if (msg.data.reply.result.data.developerMessage !== undefined) {
                this.$message.error(msg.data.reply.result.data.developerMessage)
              } else {
                let dataNow = msg.data.reply.result.data[0]
                this.partitions = []
                this.chengePartitionData(dataNow)
                this.chengePartitionData(dataNow)
                // 副本添加后的数据
                let partitions = dataNow.partitions.sort(function (a, b) {
                  return a.partition - b.partition
                })
                let sumP = 0
                for (let i = 0; i < partitions.length; i++) {
                  sumP = sumP + partitions[i].partition
                }
                let averageP = sumP / partitions.length
                let partitionUpdate = this.partitions[1].partitions
                let replicasNum = this.ruleForm.replicasNum
                for (let g = 0; g < replicasNum; g++) {
                  for (let i = 0; i < partitions.length; i++) {
                    let partition = partitions[i].partition
                    let minReplicas = ''
                    let parLength = ''
                    let minResidue = 0
                    for (let j = 0; j < partitionUpdate.length; j++) {
                      let sum = 0
                      let partition1 = partitionUpdate[j].partition
                      for (let k = 0; k < partition1.length; k++) {
                        if (partition === partition1[k]) {
                          sum = 0
                          break
                        } else {
                          sum += partition1[k]
                          if (k === partition1.length - 1) {
                            if (parLength.length === 0) {
                              parLength = partition1.length
                              minResidue = (sum + partition) % averageP
                              minReplicas = partitionUpdate[j].replicas
                            } else {
                              let residue = (sum + partition) % averageP
                              if (partition1.length < parLength) {
                                minResidue = residue
                                parLength = partition1.length
                                minReplicas = partitionUpdate[j].replicas
                              } else if (partition1.length === parLength) {
                                if (residue < minResidue) {
                                  minResidue = residue
                                  parLength = partition1.length
                                  minReplicas = partitionUpdate[j].replicas
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    for (let j = 0; j < partitionUpdate.length; j++) {
                      if (minReplicas === partitionUpdate[j].replicas) {
                        partitionUpdate[j].partition.push(partition)
                        //debugger
                      }
                    }
                  }
                }
                this.$message.success("添加副本成功")
                this.mainContentVisible = false
                this.addReplicasContentVisible = true
              }
            })
          } else {
            return false
          }
        })
      },
      //分区重分布
      partitionRedistry: function () {
        if(process.env.KAFKA_TYPE =="paas"){
          this.getTopicSize();
        }
        let params = {}
        params.brokers = this.brokerSelect
        params.topics = [this.detailData.topicName]
        this.exceteResultReplicas = {};
        this.exceteResultPartitions = {};
        let originalUri = "/kafka/partitions/reassign/generate"
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunctionOri(`/kafka/partitions/reassign/generate`, "post", originalUri, selectCluster, params).then(msg => {
          if (msg.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(msg.data.reply.result.data.developerMessage)
          } else {
            let dataNow = msg.data.reply.result.data[0]
            let dataUpdate = msg.data.reply.result.data[1]
            this.partitions = []
            this.chengePartitionData(dataNow)
            this.chengePartitionData(dataUpdate)
            this.partitionRadio = ''
            this.partitionRadio = dataUpdate.partitions[0].replicas[0]
            this.partitionRedistryVisible = false
            this.brokerSelect = []
            this.mainContentVisible = false
            this.partitionContentVisible = true
          }
        })
      },
      changePartition: function (replicas, partition, index) {
        let data = this.partitions[1].partitions
        for (let i = 0; i < data.length; i++) {
          if (data[i].replicas === this.partitionRadio) {
            this.partitions[1].partitions[i].partition.push(partition)
          }
          if (data[i].replicas === replicas) {
            this.partitions[1].partitions[i].partition.splice(index, 1)
          }
        }
      },
      reassignExecute: function () {
        let version = this.partitions[1].version
        let partitionsList = []
        let partitions = []
        let data = this.partitions[1].partitions
        //console.log(this.partitions[1].partitions, 2222)
        //debugger
        data.forEach(item => {
          for (var i = 0; i < item.partition.length - 1; i++) {
            var cur = item.partition[i];
            for (var j = i + 1; j < item.partition.length; j++) {
              if (cur == item.partition[j]) {
                item.partition.splice(j, 1);
                j--;
              }
            }
          }
        })
        //console.log(data,"data")
        data.forEach(item1 => {
          item1.partition.forEach(item2 => {
            let json = {}
            json.topic = this.detailData.topicName
            json.partition = item2
            json.replicas = [item1.replicas]
            json.log_dirs = [item1.log_dirs]
            partitionsList.push(json)
          })
        })
        //console.log(partitionsList, 3333)
        for (let m = 0; m < partitionsList.length - 1; m++) {
          let curVal = partitionsList[m]
          for (let n = m + 1; n < partitionsList.length; n++) {
            if (curVal.partition == partitionsList[n].partition) {
              curVal.replicas.push(partitionsList[n].replicas[0])
              curVal.log_dirs.push(partitionsList[n].log_dirs[0])
              partitionsList.splice(n, 1);
              n--;
            }
          }
        }
        partitions = partitionsList;
        //console.log(partitions,44444)
        this.exceteResultReplicas = {};
        this.exceteResultPartitions = {};
        this.checkParam = { version: version, partitions: partitions }
        let url = "/kafka/partitions/reassign/execute?";
        let requestType = "put"
        let str = "";
        let originalUri = "/kafka/partitions/reassign/execute"
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        let interBrokerThrottle = (parseFloat(this.interBrokerThrottle) * 1024 * 1024).toString();
        let replicaAlterLogDirsThrottle = (parseFloat(this.replicaAlterLogDirsThrottle) * 1024 * 1024).toString();
        let timeoutMs=(parseFloat(this.timeoutMs)*1000).toString();
        str = `interBrokerThrottle=${interBrokerThrottle}&replicaAlterLogDirsThrottle=${replicaAlterLogDirsThrottle}&timeoutMs=${timeoutMs}`
        let uri = url + str;
        this.exceteResultPartitions = {}
        this.exceteResultReplicas = {}
        api.kafkaPackFunctionOri(uri, requestType, originalUri, selectCluster, this.checkParam).then(res => {
          if (res.data.reply.returnCode.type == "S") {
            if (res.data.reply.result.connectionRefused !== undefined) {
              this.$message.error('微服务拒绝连接！');
              return;
            }
            if (res.data.reply.result.data.developerMessage !== undefined) {
              this.$message.error(res.data.reply.result.data.developerMessage);
              return;
            }
            if (res.data.reply.result.status == 200) {
              this.$message.success('提交成功，在页面下方查看结果')
              this.exceteResultPartitions = res.data.reply.result.data.partitionsReassignStatus
              //this.exceteResultReplicas = res.data.reply.result.data.replicasReassignStatus
              this.exceteResultReplicas = res.data.reply.result.data.partitionsReassignStatus
            }
          } else {
            this.$message.error(res.data.reply.returnCode.message);
          }
        })
      },
      reassignCheck: function () {
        this.exceteResultReplicas = {};
        this.exceteResultPartitions = {};
        let originalUri = "/kafka/partitions/reassign/check"
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunctionOri(`/kafka/partitions/reassign/check`, "put", originalUri, selectCluster, this.checkParam).then(res => {
          if (res.data.reply.result.connectionRefused == "connectionRefused") {
            this.$message.error('微服务拒绝连接！');
            return;
          }
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          if (res.data.reply.result.status == 200) {
            this.$message.success('刷新成功，在页面下方查看结果')
            this.exceteResultPartitions = res.data.reply.result.data.partitionsReassignStatus
            //this.exceteResultReplicas = res.data.reply.result.data.replicasReassignStatus
            this.exceteResultReplicas = res.data.reply.result.data.partitionsReassignStatus
          }
        })
      },
      chengePartitionData: function (datas) {
        let partitions = []
        let data = datas.partitions
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].replicas.length; j++) {
            for (let k = 0; k < partitions.length; k++) {
              if (partitions[k].replicas === data[i].replicas[j]) {
                partitions[k].partition.push(data[i].partition)
                break
              } else {
                if (k === partitions.length - 1) {
                  let json = {}
                  json.replicas = data[i].replicas[j]
                  json.partition = [data[i].partition]
                  json.log_dirs = data[i].log_dirs[j]
                  partitions.push(json)
                  break
                }
              }
            }
            if (partitions.length === 0) {
              let json = {}
              json.replicas = data[i].replicas[j]
              json.partition = [data[i].partition]
              json.log_dirs = data[i].log_dirs[j]
              partitions.push(json)
            }
          }
        }
        let info = {}
        info.version = datas.version
        info.partitions = partitions.sort(function (a, b) {
          return a.replicas - b.replicas
        })
        this.partitions.push(info)
        //console.log(this.partitions, 11111)
      },
      cleanReplicaAssignment: function () {
        this.ruleFormData.replicaAssignment = ''
      },
      radioSelected() {
        if (this.ruleFormData.type == "type2") {
          this.ruleFormData.replicaAssignment = ""
          this.autoAllocation();
        } else {
          this.ruleFormData.replicaAssignment = ""
          this.addReplicaAssignment();
        }
      },
      //自动分配策略
      autoAllocation() {
        if (this.ruleFormData.partitionsNum.length === 0) {
          this.$message.error('请先输入添加分区个数')
          return
        }
        let startNum = this.brokers[0];
        let endNum = this.brokers[this.brokers.length - 1];
        let copy = this.detailData.replicationFactor;
        let partitionsNum = this.ruleFormData.partitionsNum;
        let list = [];
        let listIndex = 0;
        let circleStartNum = 0;
        let circleEndNum = partitionsNum / (endNum - startNum + 1);
        //console.log(circleEndNum,"circleEndNum")
        while (circleStartNum < circleEndNum) {
          for (let i = startNum; i <= endNum; i++) {
            list[listIndex] = "";
            for (let n = 0; n < copy && ((i + n) <= endNum); n++) {
              list[listIndex] = list[listIndex] + ":" + (i + n)
            }
            let aa = i + copy - 1 - endNum;
            for (let j = 0; j < aa; j++) {
              list[listIndex] = list[listIndex] + ":" + (startNum + j)
            }
            listIndex++;
            if (list.length >= partitionsNum) {
              break;
            }
          }
          circleStartNum++;
        }
        //console.log(list,"list111")
        let ary = [];
        let str = ""
        list.forEach(item => {
          str = item.slice(1, item.length);
          ary.push(str)
        })
        this.ruleFormData.replicaAssignment = ary.join(",")
      },
      autoAllocationChange() {
        this.ruleFormData.replicaAssignment = "";
        if (this.ruleFormData.type == "type2") {
          this.autoAllocation();
        } else {
          this.addReplicaAssignment();
        }
      },
      //手动分配
      addReplicaAssignment: function () {
        if (this.ruleFormData.partitionsNum.length === 0) {
          this.$message.error('请先输入添加分区个数')
          return
        }
        if (this.ruleFormData.replicaAssignment.indexOf(',') >= 0) {
          let arr = this.ruleFormData.replicaAssignment.split(',')
          if (arr.length >= this.ruleFormData.partitionsNum) {
            this.$message.error('以逗号为分割的个数应该等于添加分区个数,不能再添加了')
            return
          }
        } else {
          if (this.ruleFormData.replicaAssignment.length > 0 && this.ruleFormData.partitionsNum === 1) {
            this.$message.error('不能再添加了')
            return
          }
        }
        let str = ''
        for (let i = 0; i < this.ruleFormData.brokersSelect.length; i++) {
          for (let j = 0; j < this.ruleFormData.brokersSelect.length; j++) {
            if (i !== j && this.ruleFormData.brokersSelect[i] === this.ruleFormData.brokersSelect[j]) {
              this.$message.error('选择的brokerID不能相同！')
              return
            }
          }
          if (i === this.ruleFormData.brokersSelect.length - 1) {
            str += this.ruleFormData.brokersSelect[i]
          } else {
            str += this.ruleFormData.brokersSelect[i] + ':'
          }
        }
        if (this.ruleFormData.replicaAssignment.length === 0) {
          this.ruleFormData.replicaAssignment = str
        } else {
          this.ruleFormData.replicaAssignment = this.ruleFormData.replicaAssignment + ',' + str
        }

      },
      //添加分区
      addPartitions: function (formName) {
        if (this.ruleFormData.replicaAssignment.indexOf(',') >= 0) {
          let arr = this.ruleFormData.replicaAssignment.split(',')
          if (arr.length !== this.ruleFormData.partitionsNum) {
            this.$message.error('以逗号为分割的个数应该等于添加分区个数')
            return
          }
        } else {
          if (this.ruleFormData.replicaAssignment.length > 0 && this.ruleFormData.partitionsNum !== 1) {
            this.$message.error('以逗号为分割的个数应该等于添加分区个数')
            return
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addPartitionsVisible = false;
            let replicaAssignment = [];
            let replicaAssignmentList = this.ruleFormData.replicaAssignment.split(",");
            for (let i = 0; i < replicaAssignmentList.length; i++) {
              replicaAssignment[i] = replicaAssignmentList[i].split(":");
            }
            let para = {};
            let paraList = []
            para.numPartitionsAdded = Number(this.ruleFormData.partitionsNum);
            para.topic = this.detailData.topicName;
            para.replicaAssignment = replicaAssignment;
            paraList.push(para);
            let originalUri = "/kafka/partitions/add"
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            let selectCluster = this.clusterId
            api.kafkaPackFunctionOri(`/kafka/partitions/add`, "post", originalUri, selectCluster, paraList).then(res => {
              if (res.data.reply.result.data.developerMessage !== undefined) {
                this.$message.error(res.data.reply.result.data.developerMessage)
                return;
              }
              if(res.data.reply.result.data[this.detailData.topicName].msg!==null){
                this.$message.error(res.data.reply.result.data[this.detailData.topicName].msg);
                return;
              }
              if(res.data.reply.result.data.developerMessage == undefined&&res.data.reply.result.data[this.detailData.topicName].msg==null) {
                this.$message.success('添加分区成功');
              }
            })
          } else {
            return false
          }
        })
      },
      refreshDetail: function () {
        let topic = this.detailData.topicName
        this.$emit('refreshDetail', topic, false, true)
        this.$message.success('已刷新！')
      },
      //手工分区重分布
      change(val) {
        this.$forceUpdate()
      },
      async partitionRedistryHand() {
        this.exceteResultPartitionsHand = {};
        this.partitionRedistryHandVisible = false;
        this.mainContentVisible = false
        this.partitionHandContentVisible = true;
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        if(process.env.KAFKA_TYPE =="paas"){
          this.getTopicSize();
        }
        const res = await api.kafkaPackFunction(`/kafka/topics/${this.detailData.topicName}`, "get", selectCluster)
        if (res.data.reply.result.data.developerMessage !== undefined) {
          this.$message.error(res.data.reply.result.data.developerMessage)
        } else {
          this.partitionMessageList = res.data.reply.result.data;
          for (let i = 0; i < this.partitionMessageList.topicPartitionInfos.length; i++) {
            let replicasList = this.partitionMessageList.topicPartitionInfos[i].topicPartitionInfo.replicas;
            for (let j = 0; j < replicasList.length; j++) {
              //获取具体的目录信息
              let partition = this.partitionMessageList.topicPartitionInfos[i].topicPartitionInfo.partition
              let replicas = replicasList[j].id
              let uri1 = `/kafka/brokers/replicalogdir/${replicas}/${this.detailData.topicName}/${partition}`;
              let requestType1 = "get"
              this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
              let selectCluster1 = this.clusterId
              api.kafkaPackFunction(uri1, requestType1, selectCluster1).then(res => {
                if (res.data.reply.result.status == 200) {
                  replicasList[j].log_dirs = res.data.reply.result.data.currentReplicaLogDir;
                } else {
                  this.$message.error("获取目录路径失败")
                }
              })
            }
          }
          //console.log(this.partitionMessageList,"000000")
        }
        let url = "/kafka/brokers/logdirs?";
        let requestType = "get"
        let str = "";
        this.brokers.forEach((item, index) => {
          str += `brokerList=${item}&`
        })
        str = str.slice(0, str.length - 1)
        let uri = url + str;
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster2 = this.clusterId
        api.kafkaPackFunction(uri, requestType, selectCluster2).then(res => {
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
          } else {
            let optionDirsObj = res.data.reply.result.data;
            for (let k in optionDirsObj) {
              optionDirsObj[k].unshift("any");
            }
            this.optionDirs = optionDirsObj;
          }
        })
      },
      reassignExecuteHand() {
        let version = 1;
        let partitions = [];
        let oriData = this.partitionMessageList;
        for (let i = 0; i < oriData.topicPartitionInfos.length; i++) {
          let json = {};
          json.topic = oriData.topicName
          json.partition = oriData.topicPartitionInfos[i].topicPartitionInfo.partition
          let replicas = [];
          let log_dirs = [];
          for (let k = 0; k < oriData.topicPartitionInfos[i].topicPartitionInfo.replicas.length; k++) {
            replicas.push(oriData.topicPartitionInfos[i].topicPartitionInfo.replicas[k].id)
            let hash = {}
            for (var j in replicas) {
              if (hash[replicas[j]]) {
                this.$message.error('brokerID不能重复，请修改！');
                return;
              }
            }
            log_dirs.push(oriData.topicPartitionInfos[i].topicPartitionInfo.replicas[k].log_dirs)
          }
          json.replicas = replicas;
          json.log_dirs = log_dirs
          partitions.push(json)
        }
        this.partitionsHand = { version: version, partitions: partitions }
        //console.log(this.partitionsHand, "000000")
        this.exceteResultPartitionsHand = {};
        let url = "/kafka/partitions/reassign/execute?";
        let requestType = "put"
        let str = "";
        let interBrokerThrottle = (parseFloat(this.interBrokerThrottle) * 1024 * 1024).toString();
        let replicaAlterLogDirsThrottle = (parseFloat(this.replicaAlterLogDirsThrottle) * 1024 * 1024).toString();
        let timeoutMs=(parseFloat(this.timeoutMs)*1000).toString();
        str = `interBrokerThrottle=${interBrokerThrottle}&replicaAlterLogDirsThrottle=${replicaAlterLogDirsThrottle}&timeoutMs=${timeoutMs}`
        let uri = url + str;
        let originalUri = "/kafka/partitions/reassign/execute"
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        this.exceteResultPartitionsHand = {}
        api.kafkaPackFunctionOri(uri, requestType, originalUri, selectCluster, this.partitionsHand).then(res => {
          if (res.data.reply.result.connectionRefused == "connectionRefused") {
            this.$message.error('微服务拒绝连接！');
            return;
          }
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          if (res.data.reply.result.status == 200) {
            this.$message.success('提交成功，在页面下方查看结果')
            this.exceteResultPartitionsHand = res.data.reply.result.data.partitionsReassignStatus
          }
        })
      },
      reassignCheckHand() {
        this.exceteResultPartitionsHand = {};
        let originalUri = "/kafka/partitions/reassign/check"
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunctionOri(`/kafka/partitions/reassign/check`, "put", originalUri, selectCluster, this.partitionsHand).then(res => {
          if (res.data.reply.result.connectionRefused == "connectionRefused") {
            this.$message.error('微服务拒绝连接！');
            return;
          }
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          if (res.data.reply.result.status == 200) {
            this.$message.success('刷新成功，在页面下方查看结果')
            this.exceteResultPartitionsHand = res.data.reply.result.data.partitionsReassignStatus;
          }
        })
      },
      //分区信息里的详情
      viewMessageDetail(row) {
        this.consumerDetailVisible = true;
        let partitionId = row.topicPartitionInfo.partition
        let topic = this.detailData.topicName
        let requestType = "get"
        let uri = `/kafka/consumergroups/NEW/topic/${topic}`
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        this.consumerDetailList = [];
        this.consumerlistLoading = true;
        api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
          this.consumerlistLoading = false;
          if (res.data.reply.result.data.developerMessage == undefined) {
            if (res.data.reply.result.data.length == 0) {
              this.consumerDetailList = []
            } else {
              this.consumerList = res.data.reply.result.data
              this.consumerList.forEach(item => {
                if (item.partitionId == partitionId) {
                  this.consumerDetailList.push(item)
                }
              })
            }
          } else {
            this.$message.error(res.data.reply.result.data.developerMessage)
          }
        })
      },
    }
  }
</script>

<style scoped>
  .color-green {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #ddd;
    background: #3ecf9c;
    vertical-align: middle;
  }

  .bg-red {
    background: #F4494C;
  }

  .solidline{
    display: inline-block;
    width:12px;
    height:12px;
    background: #60adef;
    vertical-align: middle;
  }
  .dashline{
    display: inline-block;
    width:12px;
    height:12px;
    background: #3ecf9c;
    vertical-align: middle;
  }
  .bgred{
    display: inline-block;
    width:12px;
    height:12px;
    background: #F4494C;
    vertical-align: middle;
  }

  .color-blue {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #ddd;
    background: #60adef;
    vertical-align: middle;
  }

  .borderBox {
    box-sizing: border-box;
    /* width: 330px; */
    width: 32%;
    min-height: 150px;
    text-align: left;
    margin: 4px;
    box-shadow: 0px 1px 2px 1px #999;
  }

  .innerBox {
    width: 100%;
  }

  .borderBox .el-input-number {
    width: 80px;
  }

  .borderBox .el-select {
    width: 150px;
  }

  .autoTitle {
    color: firebrick;
    word-wrap: break-word;
    word-break: break-all;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }
</style>
