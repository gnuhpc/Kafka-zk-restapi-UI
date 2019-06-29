<template>
  <section>
    <!--topic列表-->
    <section class="paas_blockKafka">
      <section v-show="topicListVisible">
        <!--工具条-->
        <el-row>
          <el-col :span="24">
            <span class="paas_title">Topic管理列表</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="20">
            <el-button @click="openSystemDialog" type="primary" size="mini" plain>创建Topic</el-button>
            <el-button @click="handleDelMany" type="danger" size="mini" plain>批量删除</el-button>
          </el-col>
          <el-col :span="4">
            <el-input size="mini" v-model="search" placeholder="请输入关键字搜索" prefix-icon="el-icon-search">
            </el-input>
          </el-col>
        </el-row>
        <!--列表-->
        <section class="topicTable">
          <el-row>
            <el-table :data="topics.slice((page-1)*pageSize,page*pageSize)" highlight-current-row v-loading="listLoading"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="topic" label="topic" show-overflow-tooltip sortable width="320">
              </el-table-column>
              <el-table-column prop="numPartition" label="分区数" sortable>
              </el-table-column>
              <el-table-column prop="isrRate" label="isrRate" :formatter="formatRate" sortable>
              </el-table-column>
              <el-table-column prop="replicationFactor" label="副本数" sortable>
              </el-table-column>
              <el-table-column label="操作" min-width="80">
                <template slot-scope="scope">
                  <el-dropdown size="mini">
                    <el-button size="mini" type="primary">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <!--<el-dropdown-item type="text" @click.native="systemDetail(scope.row)">项目信息</el-dropdown-item>-->
                      <el-dropdown-item type="text" @click.native="viewDetail(scope.row.topic,true)">详情</el-dropdown-item>
                      <el-dropdown-item type="text" @click.native="handleDel(scope.row)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <pagination v-if="pageshow" :total="total" :pageSize="pageSize" @pageChange="pageChange"></pagination>
          </el-row>
        </section>
      </section>
      <!--topic详情-->
      <section v-show="topicDetailVisible" class="tabBox">
        <table class="tableManage">
          <tr>
            <td style="width:12%;"><label>topic名称</label></td>
            <td style="width:20%;"><span>{{detailData.topicName}}</span></td>
            <td style="width:12%;"><label>分区数</label></td>
            <td style="width:10%;"><span>{{detailData.partitionCount}}</span></td>
            <td style="width:12%;"><label>副本数</label></td>
            <td style="width:10%;"><span>{{detailData.replicationFactor}}</span></td>
          </tr>
        </table>
        <div class="backButton">
          <el-button class="margin-left0" type="primary" size="mini" @click="goBack" plain>返回</el-button>
        </div>
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTab">
          <el-tab-pane label="分区信息" name="first-ta">
            <TopicDetail ref="topicDetail" :detailData="detailData" v-on:showTopicManage="showTopic" v-on:refreshDetail="viewDetail"></TopicDetail>
          </el-tab-pane>
          <el-tab-pane label="消费者信息" name="second-ta">
            <MessageDetail ref="messageDetail" :detailData="detailData" v-on:showTopicManage="showTopic"
              v-on:refreshDetail="viewDetail"></MessageDetail>
          </el-tab-pane>
          <el-tab-pane label="查看消息" name="third-ta">
            <ViewMessage ref="viewMessage" :detailData="detailData" v-on:showTopicManage="showTopic" v-on:refreshDetail="viewDetail"></ViewMessage>
          </el-tab-pane>
          <el-tab-pane label="配置信息" name="four-ta">
            <TopicConfig ref="topiconfig" :detailData="detailData" v-on:showTopicManage="showTopic" v-on:refreshDetail="viewDetail"></TopicConfig>
          </el-tab-pane>
          <el-tab-pane label="Schema" name="five-ta">
            <Schema ref="Schema" :detailData="detailData" v-on:showTopicManage="showTopic" v-on:refreshDetail="viewDetail"></Schema>
          </el-tab-pane>
        </el-tabs>
      </section>
      <!-- 项目详情 -->
      <el-dialog title="项目信息" :visible.sync="systemDetailVisible">
        <el-form :model="systemData" inline>
          <el-form-item label="topicName" style="width:45%;">
            <span>{{systemData.topicName}}</span>
          </el-form-item>
          <el-form-item label="projectCode" style="width:45%;">
            <span>{{systemData.projectCode}}</span>
          </el-form-item>
          <el-form-item label="createUser" style="width:45%;">
            <span>{{systemData.createUser}}</span>
          </el-form-item>
          <el-form-item label="createUserName" style="width:45%;">
            <span>{{systemData.createUserName}} </span>
          </el-form-item>
          <el-form-item label="createTime" style="width:45%;">
            <span>{{systemData.createTime}}</span>
          </el-form-item>
          <el-form-item label="clusterId" style="width:45%;">
            <span>{{systemData.clusterId}}</span>
          </el-form-item>
          <el-form-item label="clusterName" style="width:45%;">
            <span>{{systemData.clusterName}}</span>
          </el-form-item>
          <el-form-item label="系统名称" style="width:45%;">
            <span>{{systemData.resName}}</span>
          </el-form-item>
          <el-form-item label="系统英文名" style="width:45%;">
            <span>{{systemData.appenglishname}}</span>
          </el-form-item>
          <el-form-item label=" 级别" style="width:45%;">
            <span>{{systemData.devsyslevel}}</span>
          </el-form-item>
          <el-form-item label="灾备级别" style="width:45%;">
            <span>{{systemData.appsyslevel}}</span>
          </el-form-item>
          <el-form-item label="开发A岗" style="width:45%;">
            <span>{{systemData.tyydyzzr}}</span>
          </el-form-item>
          <el-form-item label="开发A岗电话" style="width:45%;">
            <span>{{systemData.tyydyzzdh}}</span>
          </el-form-item>
          <el-form-item label="运维A岗" style="width:45%;">
            <span>{{systemData.wglzrr}}</span>
          </el-form-item>
          <el-form-item label="运维A岗电话" style="width:45%;">
            <span>{{systemData.wglzrrdh}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 选择系统 -->
      <el-dialog title="选择系统" :visible.sync="systemVisible" class="systemDialog">
        <el-row :gutter="15" class="search-box demo-input-suffix">
          <el-input placeholder="请输入查询内容" select-when-unmatched="true" @keyup.enter.native="searchDialog" prefix-icon="el-icon-search"
            v-model="systemDialog.searchDialogDatas" size="small"></el-input>
        </el-row>
        <div>
          <el-table :data="systemDialog.lists" ref="systemTable" highlight-current-row border class="margin-top10"
            @current-change="handleCurrentChangeSystem">
            <el-table-column prop="resName" label="系统名称" min-width="79" show-overflow-tooltip fit="false">
            </el-table-column>
            <el-table-column prop="appenglishname" label="系统简称" min-width="79" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="appcode" label="部署编码" min-width="79" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="tyydyzzr" label="开发A岗负责人" width="117">
            </el-table-column>
            <el-table-column prop="uyydezzr" label="开发B岗负责人" width="117">
            </el-table-column>
            <el-table-column prop="wglzrr" label="运维A岗负责人" width="117">
            </el-table-column>
            <el-table-column prop="note" label="运维A岗负责人" width="117">
            </el-table-column>
            <el-table-column prop="appmpactforarea" label="系统简介" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <pagination :total="systemDialog.total" @pageChange="pageChangeSystem" v-if="systemPageShow"></pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button plain size="mini" @click="systemVisible = false;topicListVisible=true">取消</el-button>
          <el-button type="primary" plain size="mini" @click="getSystemList">确定</el-button>
        </div>
      </el-dialog>
      <!--创建Topic-->
      <section v-show="createTopicVisible" style="padding-left: 5%;padding-right: 5%;">
        <el-card class="box-card margin-top10">
          <div slot="header" class="margin-12 clearfix">
            <el-button class="margin-left0" type="success" size="mini" @click="createTopic" plain>提交数据</el-button>
            <el-button class="margin-left0 pull-right" type="primary" size="mini" @click="showPage(false,true,false,false)"
              plain>返回
            </el-button>
          </div>
          <el-collapse v-model="activeName" collapse>
            <el-collapse-item v-for="(item,index) in create.list" :key="index" :name="index">
              <el-form label-width="150px">
                <el-form-item label="名称 *:">
                  <el-input v-model="item.topicName"></el-input>
                </el-form-item>
                <el-form-item label="分配方式:">
                  <el-radio-group v-model="item.type">
                    <el-radio label="type1">副本数</el-radio>
                    <el-radio label="type2">副本分配策略</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="item.type=='type1'" label="分区数 *:">
                  <el-input v-model="item.partition_name"></el-input>
                </el-form-item>
                <el-form-item v-if="item.type=='type1'" label="副本数 *:">
                  <el-input v-model="item.replicas_name"></el-input>
                </el-form-item>
                <el-form-item v-if="item.type=='type2'" label="副本分配策略 *:">
                  <el-input v-model="item.replicas_allocation"></el-input>
                </el-form-item>
                <el-form-item label="其他参数:">
                  <el-collapse>
                    <el-collapse-item>
                      <div class="createConfig">
                        <el-table :data="item.configData">
                          <el-table-column label="参数名称" prop="name" align="right">
                          </el-table-column>
                          <el-table-column label="值" align="right">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.defaults" v-if="scope.row.type !== 'select'">
                              </el-input>
                              <el-select v-model="scope.row.defaults" v-if="scope.row.type == 'select'">
                                <el-option :label="value+''" :value="key" v-for="(value,key) of scope.row.value" :key="key"></el-option>
                                </el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column label="描述" align="right">
                            <template slot-scope="scope">
                              <span @click="scope.row.show = !scope.row.show"><i class="el-icon-caret-bottom"></i></span>
                              <p v-show="scope.row.show">{{scope.row.desc}}</p>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-form-item>
                <el-form-item>
                  <el-button class="addButton" @click="addCreatePartition(item)" type="primary" size="small">+</el-button>
                  <el-button class="deleteButton" @click="deleteCreatePartition(item,index)" type="primary" size="small">-</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </section>
    </section>
  </section>
</template>
<script>
  import http from '@/utils/http'
  import api from '@/api/topic'
  import "@/styles/kafka.css";
  import "@/styles/paas_style_element.css"
  import TopicDetail from '@/components/kafka/kafkaDetail/topic/topicDetail'
  import MessageDetail from '@/components/kafka/kafkaDetail/topic/messageDetail'
  import ViewMessage from '@/components/kafka/kafkaDetail/topic/viewMessageNew'
  import TopicConfig from '@/components/kafka/kafkaDetail/topic/topicConfig'
  import Schema from '@/components/kafka/kafkaDetail/topic/Schema'
  import pagination from "@/components/resourceApplication/page";
  import { getAppSystem } from "@/api/resourceApplication";
  import appUtil from "@/utils/appUtil"
  export default {
    props: ['clusterSelect'],
    components: {
      TopicDetail,
      MessageDetail,
      ViewMessage,
      TopicConfig,
      Schema,
      pagination
    },
    data() {
      return {
        createUser: '',
        clusterId: '',
        projectCode: '',
        activeTab: 'first-ta',
        pageshow: true,
        search: '',
        filters: [],
        filtersList: [],
        configs: {
          addDialogVisible: false,
          updateDialogVisible: false,
          addConfigs: [{ key: '', value: '' }],
          topic: '',
          key: '',
          value: ''
        },
        total: 0,
        pageSize: 10,
        page: 1,
        listLoading: false,
        replicas: '',
        sels: [], // 列表选中列
        topicListVisible: true,
        topicDetailVisible: false, // 详情页面显示
        createTopicVisible: false, // 创建Topic
        systemDetailVisible: false,//系统信息页面
        systemData: {
          id: "",//项目信息
          topicName: "",
          projectCode: "",
          createUser: "",
          createTime: null,
          clusterId: "",
          clusterName: "",
          createUserName: "",
          resName: "",
          appenglishname: "",
          devsyslevel: "",
          appsyslevel: null,
          tyydyzzr: "",
          tyydyzzdh: "",
          wglzrr: "",
          wglzrrdh: ""
        },
        detailData: { topicPartitionInfos: [] },
        editFormRules: {
          name: [
            { required: true, message: '请输入topic', trigger: 'blur' }]
        },
        activeName: 0,
        create: {
          list: [{
            topicName: '',
            type: 'type1',
            partition_name: null,
            replicas_name: 3,
            replicas_allocation: '',
            typeShow: true,
            createUser: '',
            clusterId: '',
            projectCode: '',
            configData: [{
              'name': 'unclean.leader.election.enable',
              'value': [true, false],
              'defaults': 'false',
              'init': 'false',
              'requires': true,
              'type': 'select',
              'show': false,
              'desc': 'Indicates whether to enable replicas not in the ISR set to be elected as leader as a last resort,even though doing so may result in data loss.'
            }, {
              'name': 'cleanup.policy',
              'value': ['compact', 'delete'],
              'defaults': 'delete',
              'init': 'delete',
              'requires': false,
              'type': 'select',
              'show': false,
              'desc': 'A string that is either "delete" or "compact". This string designates the retention policy to use on old log segments. The default policy ("delete") will discard old segments when their retention time or size limit has been reached. The "compact" setting will enable log compaction on the topic.'
            }, {
              'name': 'compression.type',
              'value': ['uncompressed', 'snappy', 'lz4', 'gzip', 'producer'],
              'defaults': 'producer',
              'init': 'producer',
              'requires': false,
              'type': 'select',
              'show': false,
              'desc': "Specify the final compression type for a given topic. This configuration accepts the standard compression codecs ('gzip', 'snappy', lz4). It additionally accepts 'uncompressed' which is equivalent to no compression; and 'producer' which means retain the original compression codec set by the producer."
            }, {
              'name': 'delete.retention.ms',
              'value': '86400000',
              'defaults': '86400000',
              'init': '86400000',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': 'The amount of time to retain delete tombstone markers for log compactedtopics. This setting also gives a bound on the time in which a consumer must complete a read if they begin from offset 0 to ensure that they get a valid snapshot of the final stage (otherwise delete tombstones may be collected before they complete their scan).'
            }, {
              'name': 'file.delete.delay.ms',
              'value': '60000',
              'defaults': '60000',
              'init': '60000',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': 'The time to wait before deleting a file from the filesystem'
            }, {
              'name': 'flush.messages',
              'value': '9223372036854775807',
              'defaults': '9223372036854775807',
              'init': '9223372036854775807',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This setting allows specifying an interval at which we will force an fsync of data written to the log. For example if this was set to 1 we would fsync after every message; if it were 5 we would fsync after every five messages. In general we recommend you not set this and use replication for durability and allow the operating system's background flush capabilities as it is more efficient. This setting can be overridden on a per-topic basis (see the per-topic configuration section)."
            }, {
              'name': 'flush.ms',
              'value': '9223372036854775807',
              'defaults': '9223372036854775807',
              'init': '9223372036854775807',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This setting allows specifying a time interval at which we will force an fsync of data written to the log. For example if this was set to 1000 we would fsync after 1000 ms had passed. In general we recommend you not set this and use replication for durability and allow the operating system's background flush capabilities as it is more efficient."
            }, {
              'name': 'index.interval.bytes',
              'value': 4096,
              'defaults': 4096,
              'init': 4096,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This setting controls how frequently Kafka adds an index entry to it's offset index. The default setting ensures that we index a message roughly every 4096 bytes. More indexing allows reads to jump closer to the exact position in the log but makes the index larger. You probably don't need to change this."
            }, {
              'name': 'leader.replication.throttled.replicas',
              'value': '',
              'defaults': '',
              'init': '',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "A list of replicas for which log replication should be throttled on the leader side. The list should describe a set of replicas in the form [PartitionId]:[BrokerId],[PartitionId]:[BrokerId]:... or alternatively the wildcard '*' can be used to throttle all replicas for this topic."
            }, {
              'name': 'follower.replication.throttled.replicas',
              'value': '',
              'defaults': '',
              'init': '',
              'requires': false,
              'type': 'input',
              'desc': "A list of replicas for which log replication should be throttled on the follower side. The list should describe a set of replicas in the form [PartitionId]:[BrokerId],[PartitionId]:[BrokerId]:... or alternatively the wildcard '*' can be used to throttle all replicas for this topic."
            }, {
              'name': 'max.message.bytes',
              'value': 1048576,
              'defaults': 1048576,
              'init': 1048576,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "The largest record batch size allowed by Kafka. If this is increased and there are consumers older than 0.10.2, the consumers' fetch size must also be increased so that the they can fetch record batches this large.In the latest message format version, records are always grouped into batches for efficiency. In previous message format versions, uncompressed records are not grouped into batches and this limit only applies to a single record in that case."
            }, {
              'name': 'message.timestamp.difference.max.ms',
              'value': '9223372036854775807',
              'defaults': '9223372036854775807',
              'init': '9223372036854775807',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "The maximum difference allowed between the timestamp when a broker receives a message and the timestamp specified in the message. If message.timestamp.type=CreateTime, a message will be rejected if the difference in timestamp exceeds this threshold. This configuration is ignored if message.timestamp.type=LogAppendTime."
            }, {
              'name': 'message.format.version',
              'value': '',
              'defaults': '1.1-IV0',
              'init': '1.1-IV0',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "Specify the message format version the broker will use to append messages to the logs. The value should be a valid ApiVersion. Some examples are: 0.8.2, 0.9.0.0, 0.10.0, check ApiVersion for more details. By setting a particular message format version, the user is certifying that all the existing messages on disk are smaller or equal than the specified version. Setting this value incorrectly will cause consumers with older versions to break as they will receive messages with a format that they don't understand"
            },
            {
              'name': 'message.timestamp.type',
              'value': ['CreateTime', 'LogAppendTime'],
              'defaults': 'CreateTime',
              'init': 'CreateTime',
              'requires': false,
              'type': 'select',
              'show': false,
              'desc': "Define whether the timestamp in the message is message create time or log append time. The value should be either `CreateTime` or `LogAppendTime`"
            }, {
              'name': 'min.cleanable.dirty.ratio',
              'value': 0.5,
              'defaults': 0.5,
              'init': 0.5,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This configuration controls how frequently the log compactor will attempt to clean the log (assuming log compaction is enabled). By default we will avoid cleaning a log where more than 50% of the log has been compacted. This ratio bounds the maximum space wasted in the log by duplicates (at 50% at most 50% of the log could be duplicates). A higher ratio will mean fewer, more efficient cleanings but will mean more wasted space in the log."
            }, {
              'name': 'min.compaction.lag.ms',
              'value': 0,
              'defaults': 0,
              'init': 0,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "The minimum time a message will remain uncompacted in the log. Only applicable for logs that are being compacted."
            }, {
              'name': 'min.insync.replicas',
              'value': 1,
              'defaults': 1,
              'init': 1,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "When a producer sets acks to 'all' (or '-1'), this configuration specifies the minimum number of replicas that must acknowledge a write for the write to be considered successful. If this minimum cannot be met, then the producer will raise an exception (either NotEnoughReplicas or NotEnoughReplicasAfterAppend).When used together, min.insync.replicas and acks allow you to enforce greater durability guarantees. A typical scenario would be to create a topic with a replication factor of 3, set min.insync.replicas to 2, and produce with acks of 'all'. This will ensure that the producer raises an exception if a majority of replicas do not receive a write."
            }, {
              'name': 'preallocate',
              'value': [true, false],
              'defaults': 'false',
              'init': 'false',
              'requires': false,
              'type': 'select',
              'show': false,
              'desc': "True if we should preallocate the file on disk when creating a new log segment."
            }, {
              'name': 'retention.bytes',
              'value': -1,
              'defaults': -1,
              'init': -1,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This configuration controls the maximum size a partition (which consists of log segments) can grow to before we will discard old log segments to free up space if we are using the 'delete' retention policy. By default there is no size limit only a time limit. Since this limit is enforced at the partition level, multiply it by the number of partitions to compute the topic retention in bytes."
            }, {
              'name': 'retention.ms',
              'value': '604800000',
              'defaults': '604800000',
              'init': '604800000',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This configuration controls the maximum time we will retain a log before we will discard old log segments to free up space if we are using the 'delete' retention policy. This represents an SLA on how soon consumers must read their data."
            }, {
              'name': 'segment.bytes',
              'value': 1073741824,
              'defaults': 1073741824,
              'init': 1073741824,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This configuration controls the segment file size for the log. Retention and cleaning is always done a file at a time so a larger segment size means fewer files but less granular control over retention."
            }, {
              'name': 'segment.index.bytes',
              'value': 10485760,
              'defaults': 10485760,
              'init': 10485760,
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This configuration controls the size of the index that maps offsets to file positions. We preallocate this index file and shrink it only after log rolls. You generally should not need to change this setting."
            }, {
              'name': 'segment.jitter.ms',
              'value': '0',
              'defaults': '0',
              'init': '0',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "The maximum random jitter subtracted from the scheduled segment roll time to avoid thundering herds of segment rolling."
            }, {
              'name': 'segment.ms',
              'value': '604800000',
              'defaults': '604800000',
              'init': '604800000',
              'requires': false,
              'type': 'input',
              'show': false,
              'desc': "This configuration controls the period of time after which Kafka will force the log to roll even if the segment file isn't full to ensure that retention can delete or compact old data."
            }]
          }]
        },
        multipleSelection: [],
        consumerList: [],
        curTopic: "",
        systemVisible: false,
        systemPageShow: true,
        systemDialog: {
          total: 0,
          pageSize: 5,
          page: 1,
          lists: [],
          multipleSelection: [],
          searchDialogDatas: '',
        },
      }
    },
    filters: {
      toString: function (value) {
        return String.valueOf(value)
      }
    },
    computed: {
      //全文搜索
      topics() {
        const search = this.search;
        if (search) {
          this.page = 1;
          return this.filters.filter(function (data1) {
            return Object.keys(data1).some(function (key) {
              return String(data1[key]).indexOf(search) > -1
            })
          })
        }
        return this.filters;
      }
    },
    watch: {
      clusterSelect(newData) {
        this.getTopics();
        this.page = 1;
      },
      topics(data) {
        this.total = data.length;
      }
    },
    created() {
      this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      if (process.env.KAFKA_TYPE !== "paas") {
        return
      }
      var that = this
      $.ajax({
        type: "get",
        url: "/kafkaRes/paas-kafka/rbac/checkOauth.json",
        async: false,
        success: function (res) {
          that.createUser = res.reply.userInfo.CMBCOANAME
        }
      });
      //console.log(that.createUser)
    },
    mounted() {
      this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      let selectCluster = this.clusterId
      //console.log(this.clusterId,"topic")
      this.getTopics();
      api.kafkaPackFunction(`/kafka/brokers`, "get", selectCluster).then((res) => {
        this.create.list[0].partition_name = res.data.reply.result.data.length;
      })
    },
    methods: {
      handleTab(tab, event) {
        this.activeTab = tab.name;
      },
      // 百分数转换
      formatRate: function (row, column) {
        let temp = row.isrRate * 100
        return temp + '%'
      },
      handleCollapseChange(val) {
        this.activeName = val;
      },
      //分页
      pageChange(val) {
        this.page = val.page;
        this.pageSize = val.limit;

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // resetTopics() {
      //   this.page = 1;
      //   this.pageSize = 10;
      //   this.pageshow = false;
      //   this.getTopics()
      //   this.$nextTick(() => {
      //     this.pageshow = true;
      //   })
      // },
      // 获取topic
      goBack: function () {
        this.topicListVisible = true;
        this.topicDetailVisible = false;
      },
      getTopics() {
        this.listLoading = true
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction("/kafka/topicsbrief", "get", selectCluster).then((res) => {
          this.listLoading = false;
          let search = this.search;
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error("返回数据超时，请刷新重试！")
            return;
          }
          let mockTopics = res.data.reply.result.data
          this.filters = mockTopics;
          this.total = this.filters.length
        })
      },
      //批量删除
      handleDelMany() {
        this.$confirm('确认删除该topic吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let url = "/kafka/topics?";
          let requestType = "delete"
          let str = "";
          let delTopicList = []
          this.multipleSelection.forEach((item, index) => {
            str += `topicList=${item.topic}&`;
            let prop = {};
            prop.clusterId = sessionStorage.getItem('kafkaclusterSelect');
            prop.topicName = item.topic
            delTopicList.push(prop)
          })
          str = str.slice(0, str.length - 1)
          let uri = url + str;
          let originalUri = "/kafka/topics"
          this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
          let selectCluster = this.clusterId
          api.kafkaPackFunctionOri(uri, requestType, originalUri, selectCluster).then((res) => {
            this.listLoading = false
            if (res.data.reply.result.data.developerMessage == undefined) {
              let params = {};
              params.data = delTopicList
              if (process.env.KAFKA_TYPE === "paas") {
                api.deleteTopicByClusterIdAndNames(params).then(res => {
                  if (res.data.reply.returnCode.type == "E") {
                    this.$message.error("删除失败")
                  }
                })
              }
              this.$message.success("删除成功");
              this.getTopics()
            } else {
              this.$message.error("删除失败");
            }
          })
        })
      },
      // 删除
      handleDel: function (row) {
        this.$confirm('确认删除该topic吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let prop = {};
          let delTopicList = [];
          prop.clusterId = sessionStorage.getItem('kafkaclusterSelect');
          prop.topicName = row.topic
          delTopicList.push(prop)
          let url = "/kafka/topics";
          let deleteUrl = row.topic.toString();
          let uri = url + "?topicList=" + deleteUrl
          let requestType = "delete"
          let originalUri = "/kafka/topics"
          this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'));
          let selectCluster = this.clusterId
          api.kafkaPackFunctionOri(uri, requestType, originalUri, selectCluster).then((res) => {
            this.listLoading = false;
            if (res.data.reply.result.data.developerMessage == undefined) {
              let params = {};
              params.data = delTopicList
              if (process.env.KAFKA_TYPE === "paas") {
                api.deleteTopicByClusterIdAndNames(params).then(res => {
                  if (res.data.reply.returnCode.type == "E") {
                    this.$message.error("删除失败")
                  }
                })
              }
              this.$message.success("删除成功");
              this.getTopics()
            } else {
              this.$message.error("删除失败");
            }
          })
        })
      },
      // 显示详情
      viewDetail: function (topic, data) {
        this.topicListVisible = false
        this.topicDetailVisible = true
        this.showPage(false, false, false, true)
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction(`/kafka/topics/${topic}`, "get", selectCluster).then(res => {
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return
          }
          this.detailData = res.data.reply.result.data;
          //console.log(this.detailData)
        })
      },
      // 显示主页面
      showTopic: function (data) {
        this.topicListVisible = data.topic
        this.topicDetailVisible = data.detail
      },
      showPage: function (data1, data2, data3, data4) {
        this.systemVisible = data1
        this.topicListVisible = data2
        this.createTopicVisible = data3
        this.topicDetailVisible = data4
      },
      // 创建topic
      createTopic() {
        let dataList = [];
        let dataListSave = [];
        for (let j = 0; j < this.create.list.length; j++) {
          if (this.create.list[j].topicName == '') {
            this.$message.error("Topic名称不能为空")
            return;
          }
          if (this.create.list[j].topicName.indexOf("_") !== -1 || this.create.list[j].topicName.indexOf(".") !== -1) {
            this.$message.error("Topic名称不能含有_和.")
            return;
          }
          if (this.create.list[j].type == "type1") {
            if (!(/(^[1-9]+$)/.test(this.create.list[j].partition_name))) {
              this.$message.error("分区数必须为正整数")
              return;
            }
            if (!(/(^[1-9]+$)/.test(this.create.list[j].replicas_name))) {
              this.$message.error("副本数必须为正整数")
              return;
            }
            if (Number(this.create.list[j].partition_name) < Number(this.create.list[j].replicas_name)) {
              this.$message.error("副本数必须小于分区数")
              return;
            }
          } else {
            if (this.create.list[j].replicas_allocation == '' || this.create.list[j].replicas_allocation == ' ') {
              this.$message.error("副本分配策略不能为空")
              return;
            }
          }
          let datas = {}
          let datasSave = {}
          datas.name = this.create.list[j].topicName;
          datasSave.topicName = this.create.list[j].topicName;
          this.create.list[j].projectCode = this.projectCode;
          this.create.list[j].createUser = this.createUser;
          this.create.list[j].clusterId = sessionStorage.getItem('kafkaclusterSelect');
          datasSave.projectCode = this.create.list[j].projectCode;
          datasSave.createUser = this.create.list[j].createUser;
          datasSave.clusterId = this.create.list[j].clusterId;
          let replicasAssignments = {};
          let replicasAssignmentsList = this.create.list[j].replicas_allocation.split(",");
          for (let i = 0; i < replicasAssignmentsList.length; i++) {
            replicasAssignments[i] = replicasAssignmentsList[i].split(":");
          }
          if (this.create.list[j].type === 'type1') {
            datas.partitions = this.create.list[j].partition_name
            datas.factor = this.create.list[j].replicas_name
          } else {
            datas.replicasAssignments = replicasAssignments;
          }
          let prop = {}
          let configs = this.create.list[j].configData
          for (let i = 0; i < configs.length; i++) {
            if (configs[i].defaults !== configs[i].init) {
              if (configs[i].defaults.length === 0) {
                this.$message({
                  message: configs[i].name + '不能为空',
                  type: 'error'
                })
                return
              }
              prop[configs[i].name] = configs[i].defaults;
            }
          }
          datas.prop = prop;
          dataList.push(datas);
          dataListSave.push(datasSave);
        }
        let originalUri = "/kafka/topics/create"
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        let params = {}
        params.topics = dataListSave
        if (process.env.KAFKA_TYPE === "paas") {
          api.saveTopics(params).then(res => {
            if (res.data.reply.returnCode.type == "E") {
              this.$message.error(res.data.reply.returnCode.message);
              return;
            }
            if (res.data.reply.returnCode.type == "S") {
              api.kafkaPackFunctionOri(`/kafka/topics/create`, "post", originalUri, selectCluster, dataList).then(res => {
                if (res.data.reply.result.connectionRefused !== undefined) {
                  this.$message.error("微服务拒绝连接");
                  return;
                }
                if (res.data.reply.result.status == 201) {
                  this.showPage(false, true, false, false)

                  this.$message.success("创建成功");
                  api.kafkaPackFunction(`/kafka/topicsbrief`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.connectionRefused !== undefined) {
                      this.$message.error("微服务拒绝连接")
                      return;
                    }
                    let mockTopics = res.data.reply.result.data
                    this.filters = mockTopics;
                    this.total = this.filters.length
                  })
                } else {
                  this.$message.error("创建失败");
                }
              })
            }
          })
        }else{
          api.kafkaPackFunctionOri(`/kafka/topics/create`, "post", originalUri, selectCluster, dataList).then(res => {
            if (res.data.reply.result.connectionRefused !== undefined) {
              this.$message.error("微服务拒绝连接");
              return;
            }
            if (res.data.reply.result.status == 201) {
              this.showPage(false, true, false, false)

              this.$message.success("创建成功");
              api.kafkaPackFunction(`/kafka/topicsbrief`, "get", selectCluster).then(res => {
                if (res.data.reply.result.connectionRefused !== undefined) {
                  this.$message.error("微服务拒绝连接")
                  return;
                }
                let mockTopics = res.data.reply.result.data
                this.filters = mockTopics;
                this.total = this.filters.length
              })
            } else {
              this.$message.error("创建失败");
            }
          })
        }
      },
      addCreatePartition(list) {
        this.create.list.push({
          topicName: '',
          type: 'type1',
          partition_name: this.create.list[0].partition_name,
          replicas_name: 3,
          replicas_allocation: '',
          typeShow: true,
          createUser: '',
          clusterId: '',
          projectCode: '',
          configData: [{
            'name': 'unclean.leader.election.enable',
            'value': [true, false],
            'defaults': 'false',
            'init': 'false',
            'requires': true,
            'type': 'select',
            'show': false,
            'desc': 'Indicates whether to enable replicas not in the ISR set to be elected as leader as a last resort,even though doing so may result in data loss.'
          }, {
            'name': 'cleanup.policy',
            'value': ['compact', 'delete'],
            'defaults': 'delete',
            'init': 'delete',
            'requires': false,
            'type': 'select',
            'show': false,
            'desc': 'A string that is either "delete" or "compact". This string designates the retention policy to use on old log segments. The default policy ("delete") will discard old segments when their retention time or size limit has been reached. The "compact" setting will enable log compaction on the topic.'
          }, {
            'name': 'compression.type',
            'value': ['uncompressed', 'snappy', 'lz4', 'gzip', 'producer'],
            'defaults': 'producer',
            'init': 'producer',
            'requires': false,
            'type': 'select',
            'show': false,
            'desc': "Specify the final compression type for a given topic. This configuration accepts the standard compression codecs ('gzip', 'snappy', lz4). It additionally accepts 'uncompressed' which is equivalent to no compression; and 'producer' which means retain the original compression codec set by the producer."
          }, {
            'name': 'delete.retention.ms',
            'value': '86400000',
            'defaults': '86400000',
            'init': '86400000',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': 'The amount of time to retain delete tombstone markers for log compactedtopics. This setting also gives a bound on the time in which a consumer must complete a read if they begin from offset 0 to ensure that they get a valid snapshot of the final stage (otherwise delete tombstones may be collected before they complete their scan).'
          }, {
            'name': 'file.delete.delay.ms',
            'value': '60000',
            'defaults': '60000',
            'init': '60000',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': 'The time to wait before deleting a file from the filesystem'
          }, {
            'name': 'flush.messages',
            'value': '9223372036854775807',
            'defaults': '9223372036854775807',
            'init': '9223372036854775807',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This setting allows specifying an interval at which we will force an fsync of data written to the log. For example if this was set to 1 we would fsync after every message; if it were 5 we would fsync after every five messages. In general we recommend you not set this and use replication for durability and allow the operating system's background flush capabilities as it is more efficient. This setting can be overridden on a per-topic basis (see the per-topic configuration section)."
          }, {
            'name': 'flush.ms',
            'value': '9223372036854775807',
            'defaults': '9223372036854775807',
            'init': '9223372036854775807',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This setting allows specifying a time interval at which we will force an fsync of data written to the log. For example if this was set to 1000 we would fsync after 1000 ms had passed. In general we recommend you not set this and use replication for durability and allow the operating system's background flush capabilities as it is more efficient."
          }, {
            'name': 'index.interval.bytes',
            'value': 4096,
            'defaults': 4096,
            'init': 4096,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This setting controls how frequently Kafka adds an index entry to it's offset index. The default setting ensures that we index a message roughly every 4096 bytes. More indexing allows reads to jump closer to the exact position in the log but makes the index larger. You probably don't need to change this."
          }, {
            'name': 'leader.replication.throttled.replicas',
            'value': '',
            'defaults': '',
            'init': '',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "A list of replicas for which log replication should be throttled on the leader side. The list should describe a set of replicas in the form [PartitionId]:[BrokerId],[PartitionId]:[BrokerId]:... or alternatively the wildcard '*' can be used to throttle all replicas for this topic."
          }, {
            'name': 'follower.replication.throttled.replicas',
            'value': '',
            'defaults': '',
            'init': '',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "A list of replicas for which log replication should be throttled on the follower side. The list should describe a set of replicas in the form [PartitionId]:[BrokerId],[PartitionId]:[BrokerId]:... or alternatively the wildcard '*' can be used to throttle all replicas for this topic."
          }, {
            'name': 'max.message.bytes',
            'value': 1048576,
            'defaults': 1048576,
            'init': 1048576,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "The largest record batch size allowed by Kafka. If this is increased and there are consumers older than 0.10.2, the consumers' fetch size must also be increased so that the they can fetch record batches this large.In the latest message format version, records are always grouped into batches for efficiency. In previous message format versions, uncompressed records are not grouped into batches and this limit only applies to a single record in that case."
          }, {
            'name': 'message.timestamp.difference.max.ms',
            'value': '9223372036854775807',
            'defaults': '9223372036854775807',
            'init': '9223372036854775807',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "The maximum difference allowed between the timestamp when a broker receives a message and the timestamp specified in the message. If message.timestamp.type=CreateTime, a message will be rejected if the difference in timestamp exceeds this threshold. This configuration is ignored if message.timestamp.type=LogAppendTime."
          }, {
            'name': 'message.format.version',
            'value': '',
            'defaults': '1.1-IV0',
            'init': '1.1-IV0',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "Specify the message format version the broker will use to append messages to the logs. The value should be a valid ApiVersion. Some examples are: 0.8.2, 0.9.0.0, 0.10.0, check ApiVersion for more details. By setting a particular message format version, the user is certifying that all the existing messages on disk are smaller or equal than the specified version. Setting this value incorrectly will cause consumers with older versions to break as they will receive messages with a format that they don't understand"
          }, {
            'name': 'message.timestamp.type',
            'value': ['CreateTime', 'LogAppendTime'],
            'defaults': 'CreateTime',
            'init': 'CreateTime',
            'requires': false,
            'type': 'select',
            'show': false,
            'desc': "Define whether the timestamp in the message is message create time or log append time. The value should be either `CreateTime` or `LogAppendTime`"
          }, {
            'name': 'min.cleanable.dirty.ratio',
            'value': 0.5,
            'defaults': 0.5,
            'init': 0.5,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This configuration controls how frequently the log compactor will attempt to clean the log (assuming log compaction is enabled). By default we will avoid cleaning a log where more than 50% of the log has been compacted. This ratio bounds the maximum space wasted in the log by duplicates (at 50% at most 50% of the log could be duplicates). A higher ratio will mean fewer, more efficient cleanings but will mean more wasted space in the log."
          }, {
            'name': 'min.compaction.lag.ms',
            'value': 0,
            'defaults': 0,
            'init': 0,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "The minimum time a message will remain uncompacted in the log. Only applicable for logs that are being compacted."
          }, {
            'name': 'min.insync.replicas',
            'value': 1,
            'defaults': 1,
            'init': 1,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "When a producer sets acks to 'all' (or '-1'), this configuration specifies the minimum number of replicas that must acknowledge a write for the write to be considered successful. If this minimum cannot be met, then the producer will raise an exception (either NotEnoughReplicas or NotEnoughReplicasAfterAppend).When used together, min.insync.replicas and acks allow you to enforce greater durability guarantees. A typical scenario would be to create a topic with a replication factor of 3, set min.insync.replicas to 2, and produce with acks of 'all'. This will ensure that the producer raises an exception if a majority of replicas do not receive a write."
          }, {
            'name': 'preallocate',
            'value': [true, false],
            'defaults': 'false',
            'init': 'false',
            'requires': false,
            'type': 'select',
            'show': false,
            'desc': "True if we should preallocate the file on disk when creating a new log segment."
          }, {
            'name': 'retention.bytes',
            'value': -1,
            'defaults': -1,
            'init': -1,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This configuration controls the maximum size a partition (which consists of log segments) can grow to before we will discard old log segments to free up space if we are using the 'delete' retention policy. By default there is no size limit only a time limit. Since this limit is enforced at the partition level, multiply it by the number of partitions to compute the topic retention in bytes."
          }, {
            'name': 'retention.ms',
            'value': '604800000',
            'defaults': '604800000',
            'init': '604800000',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This configuration controls the maximum time we will retain a log before we will discard old log segments to free up space if we are using the 'delete' retention policy. This represents an SLA on how soon consumers must read their data."
          }, {
            'name': 'segment.bytes',
            'value': 1073741824,
            'defaults': 1073741824,
            'init': 1073741824,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This configuration controls the segment file size for the log. Retention and cleaning is always done a file at a time so a larger segment size means fewer files but less granular control over retention."
          }, {
            'name': 'segment.index.bytes',
            'value': 10485760,
            'defaults': 10485760,
            'init': 10485760,
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This configuration controls the size of the index that maps offsets to file positions. We preallocate this index file and shrink it only after log rolls. You generally should not need to change this setting."
          }, {
            'name': 'segment.jitter.ms',
            'value': '0',
            'defaults': '0',
            'init': '0',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "The maximum random jitter subtracted from the scheduled segment roll time to avoid thundering herds of segment rolling."
          }, {
            'name': 'segment.ms',
            'value': '604800000',
            'defaults': '604800000',
            'init': '604800000',
            'requires': false,
            'type': 'input',
            'show': false,
            'desc': "This configuration controls the period of time after which Kafka will force the log to roll even if the segment file isn't full to ensure that retention can delete or compact old data."
          }]
        })
        this.activeName = this.create.list.length - 1;
      },
      deleteCreatePartition(item, index) {
        if (index == 0) {
          document.getElementsByClassName("deleteButton").disabled = true;
        } else {
          document.getElementsByClassName("deleteButton").disabled = false;
          this.create.list.splice(index, 1);
          this.activeName = index - 1;
        }
      },
      //项目信息
      systemDetail(row) {
        this.systemDetailVisible = true;
        this.systemData = {
          id: "",
          topicName: "",
          projectCode: "",
          createUser: "",
          createTime: null,
          clusterId: "",
          clusterName: "",
          createUserName: "",
          resName: "",
          appenglishname: "",
          devsyslevel: "",
          appsyslevel: null,
          tyydyzzr: "",
          tyydyzzdh: "",
          wglzrr: "",
          wglzrrdh: ""
        };
        let params = {};
        params.topicName = row.topic;
        params.clusterId = sessionStorage.getItem('kafkaclusterSelect')
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        if (process.env.KAFKA_TYPE === "paas") {
          api.getTopicByClusterIdAndName(params).then(res => {
            if (res.data.reply.returnCode.type == 'S') {
              if (res.data.reply.result.length == 0) {
                this.systemData = {
                  id: "",
                  topicName: row.topic,
                  projectCode: "",
                  createUser: "",
                  createTime: null,
                  clusterId: sessionStorage.getItem('kafkaclusterSelect'),
                  clusterName: "",
                  createUserName: "",
                  resName: "",
                  appenglishname: "",
                  devsyslevel: "",
                  appsyslevel: null,
                  tyydyzzr: "",
                  tyydyzzdh: "",
                  wglzrr: "",
                  wglzrrdh: ""
                }
              } else {
                this.systemData = res.data.reply.result[0];
                this.systemData.createTime = appUtil.utcToDate(this.systemData.createTime)
              }
            } else {
              this.$message.error(res.data.reply.returnCode.message);
            }
          })
        }
      },
      //选择系统
      pageChangeSystem(item) {
        this.systemDialog.page = item.page;
        this.systemDialog.pageSize = item.limit;
        if (this.systemDialog.searchDialogDatas) {
          this.getSearchDialog()
        } else {
          this.openSystemDialog();
        }
      },
      searchDialog() {
        this.systemDialog.page = 1;
        this.systemDialog.pageSize = 5;
        this.systemPageShow = false;
        this.getSearchDialog()
        this.$nextTick(() => {
          this.systemPageShow = true;
        })
      },
      getSearchDialog() {
        let datas = {}
        datas.recordsPerPage = this.systemDialog.pageSize;
        datas.pageNo = this.systemDialog.page;
        datas.search = this.systemDialog.searchDialogDatas;
        if (process.env.KAFKA_TYPE === "paas") {
          getAppSystem(datas).then((res) => {
            if (res.data.reply.returnCode.type == 'S') {
              this.systemDialog.total = res.data.reply.result.page.total;
              this.systemDialog.lists = res.data.reply.result.vCmdbBusis;
            } else {
              this.$message.error(res.data.reply.returnCode.message);
            }
          })
        }
      },
      handleCurrentChangeSystem(val) {
        this.systemDialog.multipleSelection = [val];
        //console.log(this.systemDialog.multipleSelection[0],"000")
      },
      openSystemDialog() {
        if (process.env.KAFKA_TYPE !== "paas") {
          this.getSystemList()
          return
        }
        this.showPage(true, true, false, false);
        let datas = {}
        this.systemDialog.searchDialogDatas = ''
        datas.recordsPerPage = this.systemDialog.pageSize;
        datas.pageNo = this.systemDialog.page
        datas.search = this.systemDialog.searchDialogDatas
        getAppSystem(datas).then((res) => {
          //debugger
          if (res.data.reply.returnCode.type == 'S') {
            this.systemVisible = true;
            this.systemDialog.total = res.data.reply.result.page.total;
            this.systemDialog.lists = res.data.reply.result.vCmdbBusis;
          } else {
            this.$message.error(res.data.reply.returnCode.message);
          }
        })
      },
      getSystemList() {
        if (process.env.KAFKA_TYPE === "paas" && (this.systemDialog.multipleSelection.length == 0 || this.systemDialog.multipleSelection[0] == null)) {
          this.$message.error("选择系统未成功,请重新选择")
          return
        }
        this.showPage(false, false, true, false)
        if (process.env.KAFKA_TYPE === "paas" && this.systemDialog.multipleSelection[0] !== null) {
          this.projectCode = this.systemDialog.multipleSelection[0].appcode
        }
      },
    },
  }

</script>
<style scoped>
  .topicTable {
    margin-top: 10px;
  }

  .addButton {
    position: relative;
    left: 38%;
  }

  .deleteButton {
    position: relative;
    left: 38%;
  }

  .el-input {
    display: block;
  }

  .tabBox {
    position: relative;
  }

  .backButton {
    position: absolute;
    right: 0;
    top: 44px;
    z-index: 999;
  }

  .createConfig,
  .createConfig .el-select {
    width: 100%;
  }

  .systemDialog .el-dialog {
    width: 75%;
  }

  .systemDialog .el-table {
    max-height: 312px;
    overflow: auto;
  }

  .systemDialog .el-table:before {
    height: 0px !important
  }

  .systemDialog>>>.el-table__body tr.el-table__row.current-row>td {
    background-color: #81b1e7 !important;
  }

  .search-box {
    position: absolute;
    top: 25px;
    right: 100px;
  }

  .search-box .el-input {
    width: 100% !important;
  }

  .createConfig>>>.el-table th,
  .createConfig>>>.el-table td.is-right {
    text-align: left !important;
  }

  .el-tabs>>>div.el-tabs__item.is-top {
    font-family: weiruanyahei;
    font-size: 14px;
    font-weight: bolder;
    color: #3d3d3d;
  }

  .el-tabs>>>div.el-tabs__item.is-top.is-active {
    color: #198def;
  }
</style>
