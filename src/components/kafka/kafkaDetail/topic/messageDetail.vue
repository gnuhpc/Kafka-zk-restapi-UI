<template>
    <div>
        <section v-show="viewConsumerVisible">
            <!--工具条-->
            <el-row :gutter="12" style="margin-bottom:6px;">
                <div class="pull-right">
                    <el-col :span="17">
                        <el-input size="mini" v-model="searchms" placeholder="请输入关键字搜索" prefix-icon="el-icon-search">
                            <!-- <el-button slot="append" icon="el-icon-search" v-on:click="resetGroupName" size="mini"
                                    type="primary" plain></el-button> -->
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="mini" plain @click="refreshData">刷新</el-button>
                        <!-- <el-button class="margin-left0" type="primary" size="mini" plain @click="goBack">返回</el-button> -->
                    </el-col>
                </div>
            </el-row>
            <!--列表-->
            <el-row style="width: 100%;" class="paas_contentKafka">
                <el-table :data="groupNames.slice((page-1)*pageSize,page*pageSize)" v-loading="listLoading">
                    <el-table-column prop="type" label="type" min-width="6%">
                    </el-table-column>
                    <el-table-column prop="groupName" label="groupName" show-overflow-tooltip min-width="10%">
                    </el-table-column>
                    <el-table-column prop="state" label="state" min-width="8%">
                    </el-table-column>
                    <el-table-column prop="coordinator.id" label="coordinator" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="host" label="host" show-overflow-tooltip min-width="8%">
                    </el-table-column>
                    <el-table-column prop="consumerId" label="consumerId" show-overflow-tooltip min-width="14%">
                    </el-table-column>
                    <el-table-column prop="clientId" label="clientId" show-overflow-tooltip min-width="8%">
                    </el-table-column>
                    <el-table-column prop="partitionId" label="partitionId" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="currentOffset" label="currentOffset" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="logEndOffset" label="logEndOffset" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="lag" label="lag" min-width="6%">
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <!-- <el-col :span="24" style="text-align: right;">
                    <el-pagination v-if="pageshow" layout="total,sizes,prev, pager, next" background small :total="total"
                        :page-sizes="[5, 10, 20, 50, 100]" :page-size="pageSize" :current-page="page" @current-change="handleCurrentChange"
                        @size-change="handleSizeChange">
                    </el-pagination>
                </el-col> -->
                <pagination v-if="pageshow" :total="total" :pageSize="pageSize" @pageChange="pageChange"></pagination>
            </el-row>
        </section>
    </div>
</template>
<script>
    import api from '@/api/topic'
    import "@/styles/paas_style_element.css"
    import pagination from "@/components/resourceApplication/page";
    export default {
        props: ['detailData'],
        components: {
            pagination
        },
        data() {
            return {
                viewConsumerVisible: true,
                total: 0,
                pageSize: 10,
                page: 1,
                pageshow: true,
                listLoading: false,
                searchms: '',
                groupNamesList: [],
                topic: '',
                clusterId: ''
            }
        },
        computed: {
            groupNames() {
                const search = this.searchms;
                if (search) {
                    this.page = 1;
                    return this.groupNamesList.filter(function (data1) {
                        return Object.keys(data1).some(function (key) {
                            return String(data1[key]).indexOf(search) > -1
                        })
                    })
                }
                return this.groupNamesList;
            }
        },
        watch: {
            detailData(newData) {
                this.topic = newData.topicName
                let requestType = "get"
                let uri = `/kafka/consumergroups/NEW/topic/${this.topic}`
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                this.listLoading = true;
                api.kafkaPackFunction(uri, requestType).then(res => {
                    this.listLoading = false;
                    if (res.data.reply.result.data.developerMessage == undefined) {
                        let consumerList = res.data.reply.result.data;
                        this.groupNamesList = consumerList
                        this.total = this.groupNamesList.length;
                    } else {
                        this.$message.error(res.data.reply.result.data.developerMessage)
                    }
                })
            },
            groupNames(data) {
                this.total = data.length;
            }
        },
        mounted() {
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        },
        methods: {
            // handleCurrentChange(val) {
            //     this.page = val;
            //     this.getMessageList();
            // },
            // handleSizeChange(val) {
            //     this.pageSize = val;
            //     this.getMessageList();
            // },
            pageChange(val) {
                this.page = val.page;
                this.pageSize = val.limit;
                this.groupNames();
            },
            goBack: function () {
                this.$emit('showTopicManage', { topic: true, detail: false })
            },
            getMessageList() {
                //console.log(this.topic)
                let requestType = "get"
                let uri = `/kafka/consumergroups/NEW/topic/${this.topic}`
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                this.listLoading = true;
                api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
                    this.listLoading = false;
                    if (res.data.reply.result.data.developerMessage == undefined) {
                        let consumerList = res.data.reply.result.data
                        this.groupNamesList = consumerList
                        this.total = this.groupNamesList.length;
                    } else {
                        this.$message.error(res.data.reply.result.data.developerMessage)
                    }
                })
            },
            refreshData() {
                this.getMessageList();
            },
            // resetGroupName() {
            //     this.page = 1;
            //     this.pageSize = 10;
            //     this.pageshow = false;
            //     this.getMessageList()
            //     this.$nextTick(() => {
            //         this.pageshow = true;
            //     })
            // }
        }
    }
</script>