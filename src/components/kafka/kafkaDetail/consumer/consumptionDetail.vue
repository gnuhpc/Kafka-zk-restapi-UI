<template>
  <section>
      <section>
        <!--工具条-->
        <el-row :gutter="100">
          <el-col :span="4" style="padding-bottom: 6px;">
            <el-button type="primary" size="mini" @click="openOffsetDialog('all','')" plain>{{$t('m.resetAllOffset')}}</el-button>
          </el-col>
          <el-col :span="6" :offset="14" style="padding-bottom: 6px;">
            <div class="pull-right">
            <el-button type="primary" size="mini" @click="refreshData" plain>{{$t('m.refresh')}}</el-button>
            <el-button type="primary" size="mini" @click="goBack" plain>{{$t('m.back')}}</el-button>
          </div>
          </el-col>
        </el-row>
        <table class="tableBox table-border" v-if="activeName=='tab-one'">
            <tr>
              <td><label>{{$t('m.consumerName')}}</label></td>
              <td>{{dataNew.groupId}}</td>
            </tr>
            <tr>
              <td><label>state</label></td>
              <td>{{dataNew.state}}</td>
            </tr>
            <tr>
              <td><label>coordinator</label></td>
              <td>{{dataNew.coordinatorId}}</td>
            </tr>
          </table>
          <table class="tableBox table-border" v-else>
            <tr>
              <td><label>{{$t('m.consumerName')}}</label></td>
              <td>{{dataOld.consumerName}}</td>
            </tr>
          </table>
        <!--列表-->
        <el-table v-loading="listLoading" :data="listData">
          <el-table-column :label="$t('m.topicName')" prop="topic" min-width="8%" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('m.partitionID')" prop="partitionId" sortable min-width="8%"></el-table-column>
          <el-table-column label="host" prop="host" sortable min-width="10%" show-overflow-tooltip></el-table-column>
          <el-table-column label="consumerId" prop="consumerId" show-overflow-tooltip sortable min-width="14%"></el-table-column>
          <el-table-column label="coordinator" prop="coordinator.id" sortable min-width="12%">
          </el-table-column>
          <el-table-column label="clientId" prop="clientId" sortable min-width="9%"></el-table-column>
          <el-table-column :label="$t('m.logEndOffset')" prop="logEndOffset" min-width="10%"></el-table-column>
          <el-table-column :label="$t('m.currentOffset')" prop="currentOffset" min-width="10%"></el-table-column>
          <el-table-column :label="$t('m.delayLag')" prop="lag" min-width="8%"></el-table-column>
          <el-table-column :label="$t('m.operate')" min-width="12%">
            <template slot-scope="scope">
              <el-dropdown size="mini">
                <el-button size="mini" type="primary">{{$t('m.moreOperations')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item type="text" @click.native="openOffsetDialog('one',scope.row)">{{$t('m.resetOffset')}}</el-dropdown-item>
                  <el-dropdown-item type="text" @click.native="getLastCommitTime(scope.row)">{{$t('m.viewLastTime')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total='total' @pageChange="handleChange"></pagination>
      </section>
      <!--重置Offset-->
      <el-dialog :title="$t('m.resetOffset')" :visible.sync="dialogVisible">
        <el-form v-if="offset.type=='one'">
          <el-form-item :label="$t('m.valueType')">
            <el-radio-group v-model="offset.optionType">
              <el-radio label="type1">{{$t('m.inputOffset')}}</el-radio>
              <el-radio label="type2">{{$t('m.setOption')}}</el-radio>
              <el-radio label="type3">{{$t('m.timestamp')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="offset.optionType=='type1'" :label="'offset:offset'+$t('m.greaterOrEqual')+offset.startOffset+','+$t('m.lessOrEqual')+offset.endOffset">
            <el-input v-model="offset.offset"></el-input>
          </el-form-item>
          <el-form-item v-if="offset.optionType=='type2'" :label="$t('m.setOption')">
            <el-select v-model="offset.value" style="width: 100%;">
              <el-option key="earliest" :label="$t('m.earliest')" value="earliest"></el-option>
              <el-option key="latest" :label="$t('m.latest')" value="latest"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="offset.optionType=='type3'" :label="$t('m.setTime')">
            <el-date-picker v-model="offset.timeStamp" type="datetime" :placeholder="$t('m.tipSelectTime')" style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form v-if="offset.type=='all'">
          <el-form-item :label="$t('m.setOption')">
            <el-select v-model="offset.value" style="width: 100%;">
              <el-option key="earliest" :label="$t('m.earliest')" value="earliest"></el-option>
              <el-option key="latest" :label="$t('m.latest')" value="latest"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('m.cancel')}}</el-button>
          <el-button type="primary" @click="resetOffset">{{$t('m.confirm')}}</el-button>
        </div>
      </el-dialog>
  </section>
</template>

<script>
  import "@/styles/kafka.css"
  import "@/styles/paas_style_element.css"
  import api from '@/api/topic'
  import pagination from "@/components/resourceApplication/page";
  export default{
    components: {
      pagination
    },
    props: ['consumptionDetail', 'optionData','dataNew', 'dataOld', 'activeName'],
    data() {
      return {
        filters: {
          topic: ''
        },
        total: 0,
        pageSize: 5,
        page: 1,
        listLoading: false,
        listData: [],
        dialogVisible: false,
        offset: {
          type: 'all',
          optionType: 'type1',
          options: [{
            value: 'earliest',
            label: this.$i18n.t('m.earliest')
          }, {
            value: 'latest',
            label:this.$i18n.t('m.latest')
          }
          ],
          value: 'earliest',
          startOffset: 0,
          endOffset: 0,
          offset: '',
          timeStamp: '',
          partition: 0,
          curName: '',
          clusterId:''
        }
      }
    },
    mounted(){
      this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
    },
    watch: {
      'consumptionDetail': function (newData, oldData) {
        this.handleList()
      },
    },
    methods: {
      utcToDate(str) {
        var date = new Date(str)
        var Y = date.getFullYear()
        var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        var ms = date.getMilliseconds()<10?'00'+date.getMilliseconds():date.getMilliseconds()<100?'0'+date.getMilliseconds():date.getMilliseconds()
        return Y + '-' + M + '-' + D + '%20' + h + '%3A' + m + '%3A' + s+'.'+ms
        //2019-04-17%2012%3A16%3A17.000
      },
      goBack: function () {
        this.$emit('showDetailPage', { consumerDetail: false, consumerList: true })
        this.page=1;
      },
      handleChange(item) {
        this.page = item.page;
        this.pageSize = item.limit;
        this.handleList()
      },
      handleList: function () {
        let datas = this.consumptionDetail.filter(topics => {
          if (this.filters.topic && topics.topic.indexOf(this.filters.topic) === -1) return false
          return true
        })
        this.total = datas.length
        this.listData = datas.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))
      },
      openOffsetDialog: function (type, rowData) {
        this.offset.type = type
        this.offset.offset = ''
        this.dialogVisible = true
        this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster=this.clusterId
        if (rowData !== '') {
          this.offset.partition = rowData.partitionId
          api.kafkaPackFunction(`/kafka/topics/${this.optionData.topic}`, "get",selectCluster).then(res => {
            if (res.data.reply.result.data.developerMessage !== undefined) {
              this.$message.error(res.data.reply.result.data.developerMessage)
              return
            }
            let partitions = res.data.reply.result.data.topicPartitionInfos
            if(partitions==null){
              partitions=[];
            }
            for (let i = 0; i < partitions.length; i++) {
              if (rowData.partitionId === partitions[i].topicPartitionInfo.partition) {
                this.offset.startOffset = partitions[i].startOffset
                this.offset.endOffset = partitions[i].endOffset
              }
            }
          })
        }
      },
      resetOffset: function () {
        if (this.offset.type === 'one') {
          let datas = this.optionData
          datas.partition = this.offset.partition
          if (this.offset.optionType === 'type1') {
            datas.offset = this.offset.offset
          } else if (this.offset.optionType === 'type3') {
            datas.offset = this.utcToDate(this.offset.timeStamp)
          } else {
            datas.offset = this.offset.value
          }
          //console.log(datas.offset)
          this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
          let selectCluster=this.clusterId
          api.kafkaPackFunction(`/kafka/consumergroup/${datas.consumergroup}/${datas.type}/topic/${datas.topic}/${datas.partition}/${datas.offset}`, "put",selectCluster).then(res => {
            if(res.data.reply.result.connectionRefused!==undefined){
              this.$message.error(this.$i18n.t('m.tipConnect'))
              return;
            }
            if (res.data.reply.result.data.msg !== undefined) {
              this.$message.error(res.data.reply.result.data.msg)
              return
            }
            this.dialogVisible = false
            if (res.data.reply.result.data.state === 'success') {
              this.$emit('refreshDetail', this.optionData)
              this.$message({
                message:this.$i18n.t('m.tipResetSuccess'),
                type: 'success'
              })
            }
          })
        } else {
          for (let i = 0; i < this.consumptionDetail.length; i++) {
            let datas1 = this.optionData
            datas1.partition = this.consumptionDetail[i].partitionId
            datas1.offset = this.offset.value
            let originalUri="/kafka/consumergroup/{consumergroup}/{type}/topic/{topic}/{partition}/{offset}"
            this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            let selectCluster=this.clusterId
            if (i === (this.consumptionDetail.length - 1)) {
              api.kafkaPackFunction(`/kafka/consumergroup/${datas1.consumergroup}/${datas1.type}/topic/${datas1.topic}/${datas1.partition}/${datas1.offset}`,"put",originalUri, selectCluster).then(res => {
                this.dialogVisible = false
                if (res.data.reply.result.data.state === 'success') {
                  this.$emit('refreshDetail', this.optionData)
                  this.$message({
                    message: this.$i18n.t('m.tipResetSuccess'),
                    type: 'success'
                  })
                } else {
                  this.$message.error(this.$i18n.t('m.tipResetFailed'))
                }
              })
            } else {
              api.kafkaPackFunction(`/kafka/consumergroup/${datas1.consumergroup}/${datas1.type}/topic/${datas1.topic}/${datas1.partition}/${datas1.offset}`, "put",selectCluster).then(res => {
              })
            }
          }
        }
      },
      getLastCommitTime: function (row) {
        let _this = this
        let datas = this.optionData
        datas.consumerGroup = row.groupName
        let partitionId = row.partitionId
        this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster=this.clusterId
        //console.log(row)
        api.kafkaPackFunction(`/kafka/consumergroup/${datas.consumerGroup}/${datas.type}/topic/${datas.topic}/lastcommittime`, "get",selectCluster).then(res => {
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return
          }
          if (_this.optionData.type === 'NEW') {
            if (res.data.reply.result.data.new === undefined) {
              this.$message.error(this.$i18n.t('m.tipLastTimeNull'))
              return
            }
            if (res.data.reply.result.data.new[partitionId] !== -1) {
              this.$message.success(this.$i18n.t('m.tipLastTime') + new Date(res.data.reply.result.data.new[partitionId]).toLocaleString())
            } else {
              this.$message.error(this.$i18n.t('m.tipLastTimeNull'))
            }
          } else {
            if (res.data.reply.result.data.old === undefined) {
              this.$message.error(this.$i18n.t('m.tipLastTimeNull'))
              return
            }
            if (res.data.reply.result.data.old[partitionId] !== -1) {
              this.$message.success(this.$i18n.t('m.tipLastTime') + new Date(res.data.reply.result.data.old[partitionId]).toLocaleString())
            } else {
              this.$message.error(this.$i18n.t('m.tipLastTimeNull'))
            }
          }
        })
      },
      //刷新
      async refreshData(){
        await this.$emit('refreshDetail', this.optionData)
        this.$message.success(this.$i18n.t('m.refreshed'))
      }
    }
  }
</script>
