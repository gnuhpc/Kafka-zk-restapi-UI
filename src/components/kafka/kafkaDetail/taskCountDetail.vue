<template>
    <section class="paas_block">
        <section>
            <el-row style="padding-bottom: 6px;">
                <el-col :span="6">
                    <span class="paas_title">{{$t('m.taskList')}}</span>
                </el-col>
                <el-col :span="18">
                    <div class="pull-right">
                        <el-button type="primary" size="mini" @click="stopTask" plain>{{$t('m.taskStop')}}</el-button>
                        <el-button class="margin-left0" type="primary" size="mini" @click="reassignCheck" plain>{{$t('m.refresh')}}
                        </el-button>
                        <el-button class="margin-left0" type="primary" size="mini" @click="goBack" plain>{{$t('m.back')}}</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-table :data="taskList" highlight-current-row v-loading="listLoading">
                    <el-table-column prop="topic" label="topic">
                    </el-table-column>
                    <el-table-column prop="partition" label="partition">
                    </el-table-column>
                    <el-table-column prop="replicas" label="replicas" :formatter="formatToString">
                    </el-table-column>
                </el-table>
            </el-row>
        </section>
    </section>
</template>
<script>
    import api from '@/api/topic'
    import "@/styles/kafka.css";
    import "@/styles/paas_style_element.css"
    import pagination from "@/components/resourceApplication/page";
    export default{
        components: {
            pagination
        },
        data() {
            return {
                taskList: [],
                listLoading: false,
                exceteResultPartitions: {},
                taskData: {},
                clusterId: ''
            }
        },
        mounted() {
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            this.getTaskData();
        },
        methods: {
            formatToString: function (row, column) {
                let replicas = [];
                row.replicas.forEach((item, index) => {
                    replicas.push(item);
                })
                return replicas.join(",")
            },
            getTaskData() {
                this.listLoading = true;
                let originalUri = "/zk/get/path"
                let str = "?path=%2Fadmin%2Freassign_partitions"
                let uri = originalUri + str
                let requestType = "get";
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                api.kafkaPackFunctionOri(uri, requestType, originalUri, selectCluster).then(res => {
                    this.listLoading = false;
                    if (res.data.reply.result.connectionRefused !== undefined) {
                        this.$message.error(this.$i18n.t('m.tipConnect'));
                        return;
                    }
                    if (res.data.reply.result.data.code == 400) {
                        this.$message.error(this.$i18n.t('m.tipTask0'));
                        return;
                    }
                    this.taskData=res.data.reply.result.data;
                    this.taskList = this.taskData.partitions;
                    this.taskList.forEach(item => {
                        item.log_dirs = []
                        item.replicas.forEach(item1 => {
                            item.log_dirs.push("any")
                        })
                    })
                })
            },
            reassignCheck: function () {
                this.getTaskData();
            },
            stopTask() {
                let originalUri = "/kafka/partitions/reassign/stop"
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                api.kafkaPackFunctionOri("/kafka/partitions/reassign/stop", "put", originalUri, selectCluster).then(res => {
                    if (res.data.reply.result.data.state == "success") {
                        this.$message.success(this.$i18n.t('m.tipTaskSuccess'))
                        this.taskList=[];
                    } else {
                        this.$message.error(this.$i18n.t('m.tipTaskFailed'))
                    }
                })
            },
            goBack() {
                this.$router.go(-1)
            }
        }
    }
</script>