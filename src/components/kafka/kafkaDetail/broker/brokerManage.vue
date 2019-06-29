<template>
    <section class="session1">
        <section v-show="tableShow">
            <section>
                <section class="paas_block">
            <!-- 批量起停 -->
            <el-row style="margin-bottom:10px">
                <el-col :span="4">
                    <div class="app-left paas_title">Broker管理</div>
                </el-col> 
            </el-row>
            <el-row style="margin-bottom:10px" :gutter="10">
                <el-col :span="2" >
                    <el-button @click="BatchRev"  type="primary" size="mini" plain>批量起停</el-button>
                </el-col>
                <el-col :span="2" >
                    <el-button @click="BatchForceStop"  type="primary" size="mini" plain>批量强停</el-button>
                </el-col>
                <el-col :span="2" >
                    <template>  
                        <el-button  v-if="ispolling"  type="primary" size="mini" plain>重启进行中</el-button>
                        <el-button  v-else  type="primary" size="mini" plain>轮转重启</el-button>
                    </template>
                </el-col>
                <el-col :span="2">
                        <el-button  type="primary" size="mini" plain @click="getBrokerList">刷新</el-button>
                </el-col>
                <el-col :span="3" style="width:8.5%" :offset="!flag ?5:0" :push="1">
                        <span v-show="!flag" class="fontspan">{{starttime}}s后刷新页面</span>
                </el-col>
                <el-col :span="2" :push="1" :offset="!flag?0:7">
                    <el-select v-model="time" size="mini" >
                        <el-option value="5000" label="5s"></el-option>
                        <el-option value="30000" label="30s"></el-option>
                        <el-option value="60000" label="1min"></el-option>
                        <el-option value="300000" label="5mins"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" style="margin-left:-10px" :push="1">
                    <el-button size="mini" plain @click="StartorStopList" v-model="flag" v-text="startorstop"></el-button>
                </el-col>
                <el-col :span="4" :push="1">
                        <el-input class="kafka-input" v-model="searchhost"  placeholder="请输入搜索的主机名" size="mini" prefix-icon="el-icon-search">
                        </el-input>
                </el-col>
                </el-row>
            <!--列表-->
            <el-row>
                    <el-table
                    v-loading="listLoading"
                    :data="newbrokerList.slice((page-1)*pageSize,page*pageSize)" 
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="100px"></el-table-column>
                    <el-table-column label="id" prop="id" min-width="35%" sortable></el-table-column>
                    <el-table-column label="主机名" prop="host" min-width="35%"></el-table-column>
                    <el-table-column label="端口" prop="port" min-width="35%"></el-table-column>
                    <el-table-column label="节点在zk注册时间" prop="starttime" min-width="60%"
                                     :formatter="formatToTime"></el-table-column>
                    <el-table-column label="状态" prop="status" min-width="35%" align="center">
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
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="55%" align="center">
                        <template slot-scope="scope"  >
                                <el-dropdown size="small">
                                    <el-button size="mini" type="primary" >更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-if="scope.row.status=='start'" @click.native="StartStop(scope.row.host,scope.row.status)" :disabled="scope.row.polling=='polling'?true:false">停止</el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.status=='stop'" @click.native="StartStop(scope.row.host,scope.row.status)" :disabled="scope.row.polling=='polling'?true:false">启动</el-dropdown-item>
                                        <el-dropdown-item  v-if="scope.row.status.indexOf('Exception')!=-1" @click.native="kafkaRecoverBroker(scope.row.host)">手动恢复</el-dropdown-item>
                                        <el-dropdown-item  v-if="scope.row.status!='stop'" @click.native="ForceStop(scope.row.host)">强停</el-dropdown-item>
                                        <el-dropdown-item  @click.native="dialogFormVisible=true;detail(scope.row)">查看详情</el-dropdown-item>
                                        <el-dropdown-item  @click.native="configFn(scope.row.host)">配置与修改</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            <el-dialog :visible.sync="dialogFormVisible">
                                <el-table :data="kafkadetail">
                                        <el-table-column label="securityProtocol" prop="securityprotocol" min-width="60%" >
                                                <template slot-scope="scope">
                                                        <span v-for="(value,key) in scope.row.securityprotocol">{{value}}:"{{key}}"</span> 
                                                </template>
                                         </el-table-column> 
                                        <el-table-column label="endPoints" prop="endpoints" min-width="70%" ></el-table-column> 
                                        <el-table-column label="jmxPort" prop="jmxport" min-width="35%" align="center"></el-table-column> 
                                        <el-table-column label="version" prop="version" min-width="35%" align="center"></el-table-column> 
                                        <el-table-column label="rack" prop="rack" min-width="35%" align="center"></el-table-column> 
                                </el-table>
                            </el-dialog>
                        </template>
                    </el-table-column>
                </el-table>
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
            <ConfigDetail :configData="configData" :host="configQuery.host" :Errormessage="Errormessage"
                          v-on:listenToChildEvent="showMessageFromChild"></ConfigDetail>
        </section>
    </section>
</template>
<script>
import "@/styles/paas_style_element.css"
import list from '../../../../kafkaJs/kafka/broker/list'
export default list
</script>
<style scoped>
.secondbutton{
    margin-left:0px;
}
.session1{
    min-width: 910px;
}
.loggglebiz{
    text-decoration: underline;
    cursor: pointer;
}
.loggglebiz:hover{
    color: #23527c;
    outline: 0;
}
.fontspan{
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 13px;
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
.kafka-input::-webkit-input-placeholder{
    font-size:10px;
}
</style>