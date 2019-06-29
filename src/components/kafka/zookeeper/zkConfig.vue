<template>
    <section class="session1">     
    <!--列表-->
    <section v-show="tableShow">
    <section>
        <section class="paas_block">
        <el-row style="margin-bottom:10px" >
            <el-col :span="4">
                    <div class="app-left paas_title">Zookeeper管理</div>
                </el-col>
        </el-row> 
      <el-row style="margin-bottom:10px" :gutter="10">
          <el-col :span="2">
              <el-button  type="primary" size="mini" plain @click="BatchRev('start')">批量启动</el-button>
            </el-col>
            <el-col :span="2">
              <el-button  type="primary" size="mini" plain @click="BatchRev('stop')">批量停止</el-button>
            </el-col>
          </el-col>
          <el-col :span="2">
                <el-button  type="primary" size="mini" plain @click="getList('restart')">批量重启</el-button>
          </el-col>
          <el-col :span="2">
                <el-button  type="primary" size="mini" plain @click="getList">刷新</el-button>
          </el-col>
           <el-col :span="3" style="width:8.5%"  :offset="!flag?1:0" :push="!flag?5:0">
                <span v-show="!flag" class="fontspan">{{starttime}}s后刷新页面</span>
            </el-col>
          <el-col :span="2" :offset="!flag?0:8" :push="!flag?5:0">
              <el-select v-model="time" size="mini" >
                      <el-option value="5000" label="5s"></el-option>
                      <el-option value="30000" label="30s"></el-option>
                      <el-option value="60000" label="1min"></el-option>
                      <el-option value="300000" label="5mins"></el-option>
                  </el-select>
        </el-col>
        <el-col :span="2" style="margin-left:-10px" :push="!flag?5:0">
            <el-button  size="mini" plain @click="StartorStopList" v-model="flag" v-text="startorstop"></el-button>
        </el-col>
        <el-col :span="4":push="!flag?5:0" >
          <el-input  v-model="searchhost" placeholder="请输入搜索的主机名" size="mini" prefix-icon="el-icon-search" ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
          :data="newhosts.slice((page-1)*pageSize,page*pageSize)"  v-loading="listLoading"
          @selection-change="handleSelectionChange"
          style="width: 100%;margin-top:10px;">
          <el-table-column type="selection" width="100px"></el-table-column>
          <el-table-column label="主机名" prop="host"></el-table-column>
          <el-table-column label="端口" prop="port"></el-table-column>
          <el-table-column label="状态" prop="status" >
              <template slot-scope="scope">
                    <div v-if="scope.row.status=='stop'" >
                            <span class="kafkaspan kafkastop"></span>
                            <span>停止</span>
                        </div>
                        <div  v-if="scope.row.status=='start'">
                            <span class="kafkaspan kafkastart"></span>
                            <span>启动</span> 
                        </div>
                        <div v-if="scope.row.status=='starting'" >
                            <span class="kafkaspan kafkastart"></span>
                            <span>启动中</span>
                        </div>
                        <div v-if="scope.row.status=='stoping'">
                            <span class="kafkaspan kafkastop"></span>
                            <span>停止中</span>
                        </div>
                        <div v-if="scope.row.status=='startException'">
                            <span class="kafkaspan kafkastop"></span>
                            <span>启动异常</span>
                        </div>
                        <div v-if="scope.row.status=='stopException'">
                            <span class="kafkaspan kafkastop"></span>
                            <span>停止异常</span>
                        </div> 
                        <div v-if="scope.row.status=='restartException'">
                                <span class="kafkaspan kafkastop"></span>
                                <span>重启异常</span>
                        </div> 
                        <div v-if="scope.row.status=='connectExcetion'">
                                <span class="kafkaspan kafkastop"></span>
                                <span>连接异常</span>
                        </div> 
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope" >
                  <el-dropdown size="small">
                      <el-button size="mini" type="primary">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="scope.row.status=='start'" @click.native="StartStop(scope.row.host,scope.row.status)" :disabled="scope.row.polling=='polling'?true:false">停止</el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.status=='stop'" @click.native="StartStop(scope.row.host,scope.row.status)" :disabled="scope.row.polling=='polling'?true:false">启动</el-dropdown-item>
                          <el-dropdown-item  v-if="scope.row.status.indexOf('Exception')!=-1" @click.native="recoverZK(scope.row.host)">手动恢复</el-dropdown-item>
                          <el-dropdown-item  @click.native="configFn(scope.row.host)">配置与修改</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
                </template>
          </el-table-column>
        </el-table>
      </el-col>
      </el-row>
      <el-row  v-show="tableShow" style="margin-top:'10px' ">
        <el-col :span="24">
            <pagination :total='total' :pageSize="pageSize" @pageChange="handleChange"></pagination>
       </el-col>
        </el-row>
  </section>
</section>
</section>
  <section v-loading="listLoading" :hidden="tableShow">
    <zkConfigDetail  :configData="configData" :host="host" :Errormessage="Errormessage" v-on:listenToChildEvent="showMessageFromChild"></zkConfigDetail>
  </section>
</section>
</template>
<script>
import "@/styles/paas_style_element.css"
import zkConfig from '@/kafkaJs/zookeeper/zkConfig'
export default zkConfig
</script>
<style scoped>
.session1{
  min-width: 910px;
}
.fontspan{
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 12px;
}
.kafkaspan{
    display:inline-block;
    width:5px;
    height:5px;
    border-radius: 50%;
    margin-bottom: 2px;
}
.kafkastop{
    background:#F40000;
    border-color:#F40000;
}
.kafkastart{
    background:#00CF88;
    border-color:#00CF88;
}
</style>
