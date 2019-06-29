<template>
  <section >
    <div v-show="pageShow" class="paas_block">
      <el-row>
        <el-col :span="24">
          <div v-for="(value,key) in data" class="item" :class="{'item-2':value.mode==='Leader'}">
            <div class="top">
              <div class="top-item pull-left">
                <i class="fa fa-tasks icon margin-left10 margin-top25"></i>
              </div>
              <div class="top-item pull-left">
                <p class="margin-bot-top5 margin-top25">版本：{{value.version}}</p>
                <p class="margin-bot-top5">连接数：{{value.connections}}</p>
                <p class="margin-bot-top5">节点数：{{value.nodes}}</p>
              </div>
            </div>
            <div class="bottom">
              <a class="changecolor" @click="showDetailInfo(key)">{{key}}({{value.mode}}) <i class="el-icon-arrow-right"></i></a>
            </div>
          </div> 
      </el-col>
    </el-row>
    </div>
    <section :hidden="pageShow" class="paas_block">
      <el-button class="pull-right margin-bot-top10" type="primary" size="mini" @click="goBack()" plain>返回</el-button>
      <!--基本信息-->
      <label style="margin-top: 20px;">基本信息：</label>
      <table class="tableBox table-border">
        <tr>
          <td><label>minLatency</label></td>
          <td>{{detailData.minLatency}}</td>
          <td><label>avgLatency</label></td>
          <td>{{detailData.avgLatency}}</td>
          <td><label>maxLatency</label></td>
          <td>{{detailData.maxLatency}}</td>
        </tr>
        <tr>
          <td><label>received</label></td>
          <td>{{detailData.received}}</td>
          <td><label>sent</label></td>
          <td>{{detailData.sent}}</td>
          <td><label>connections</label></td>
          <td>{{detailData.connections}}</td>
        </tr>
        <tr>
          <td><label>outstanding</label></td>
          <td>{{detailData.outstanding}}</td>
          <td><label>zxId</label></td>
          <td>{{detailData.zxId}}</td>
          <td><label>nodes</label></td>
          <td>{{detailData.nodes}}</td>
        </tr>
      </table>
      <!--列表-->
      <el-table :data="listData" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column prop="host" label="host" sortable>
        </el-table-column>
        <el-table-column prop="port" label="port" sortable>
        </el-table-column>
        <el-table-column prop="ops" label="ops" sortable>
        </el-table-column>
        <el-table-column prop="queued" label="queued" sortable>
        </el-table-column>
        <el-table-column prop="received" label="received" sortable>
        </el-table-column>
        <el-table-column prop="sent" label="sent" sortable>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
      <label style="margin-top: 20px;">环境变量：</label>
      <table class="tableBox table-border">
        <tr v-for="(value,key) in envData">
          <td ><label>{{key}}</label></td>
          <td ><label>{{value}}</label></td>
        </tr>
      </table>
    </section>
  </section>
</template>
<script>
  import "@/styles/kafka.css";
  import zkDashBoard from '@/kafkaJs/zookeeper/zkDashBoard'
  export default zkDashBoard
</script>
<style scoped>
  .item {
    border: 1px solid #409EFF;
    float: left;
    min-width: 220px;
    overflow: hidden;
    background: #409EFF;
    color: #fff;
    margin: 0px 30px 0 0;
    border-radius: 10px;
  }

  .item .top-item {
    width: 50%;
    height: 100%;
  }

  .item .icon {
    font-size: 70px;
  }
  .item .top {
    height: 115px;
  }
  .item .bottom {
    background: #fff;
    color: #409EFF;
    line-height: 30px;
    text-align: center;
  }

  .item-2 {
    background: #67C23A;
    border: 1px solid #67C23A;
  }

  .item-2 .bottom {
    color: #67C23A;
  }
</style>
