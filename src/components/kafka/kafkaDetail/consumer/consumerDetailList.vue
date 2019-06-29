<template>
  <section>
    <!--详情-->
    <section v-show="detailOpenVisible">
      <el-col :span="4" :offset="20" style="padding-bottom: 6px;">
        <div class="pull-right">
          <el-button class="margin-left0" type="primary" size="mini" plain @click="goBack">
            返回
          </el-button>
        </div>
      </el-col>
      <table class="tableBox table-border" v-if="activeName=='tab-one'">
        <tr>
          <td><label>consumer名称</label></td>
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
          <td><label>consumer名称</label></td>
          <td>{{dataOld.consumerName}}</td>
        </tr>
      </table>
      <!--列表-->
      <el-table v-loading="listLoading" :data="consumerDetails">
        <el-table-column label="Topic名称" min-width="50%">
          <template slot-scope="scope">{{scope.row}}</template>
        </el-table-column>
        <el-table-column min-width="30%" label="操作">
          <template slot-scope="scope">
            <el-dropdown size="mini">
              <el-button size="mini" type="primary">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item type="text" @click.native="viewConsuptionDetail(scope.row)">查看消费详情</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!--消费者详情-->
    <section v-loading="listLoading" v-show="detailVisible">
      <ConsumptionDetail :consumptionDetail="detailData" :optionData="query" :dataNew='dataNew' :dataOld='dataOld'
        :activeName='activeName' v-on:showDetailPage="showDetailPage" @refreshDetail="refreshDetail"></ConsumptionDetail>
    </section>
  </section>
</template>

<script>
  import ConsumptionDetail from '@/components/kafka/kafkaDetail/consumer/consumptionDetail'
  import "@/styles/paas_style_element.css"
  import api from '@/api/topic'
  export default {
    components: {
      ConsumptionDetail
    },
    props: ['consumerDetails', 'query', 'dataNew', 'dataOld', 'activeName'],
    data() {
      return {
        listLoading: false,
        detailVisible: false,
        detailOpenVisible: true,
        detailData: [],
        curName: '',
        clusterId: ''
      }
    },
    mounted() {
      this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
    },
    methods: {
      viewConsuptionDetail: function (topic) {
        this.query.topic = topic
        this.detailOpenVisible = false;
        this.detailVisible = true;
        this.refreshDetail()
      },
      refreshDetail: function () {
        this.listLoading = true;
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction(`/kafka/consumergroups/${this.query.type}/topic/${this.query.topic}`, "get", selectCluster).then(res => {
          this.listLoading = false;
          if (res.data.reply.result.connectionRefused !== undefined) {
            this.$message.error("连接超时，请刷新重试")
            return;
          }
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          this.detailData = res.data.reply.result.data;
        })
      },
      showDetailPage: function (data) {
        this.detailVisible = data.consumerDetail;
        this.detailOpenVisible = data.consumerList;
      },
      goBack: function () {
        this.$emit('showConsumerGroup', { consumerNew: true, consumerOld: true, detail: false })
      },
    }
  }
</script>