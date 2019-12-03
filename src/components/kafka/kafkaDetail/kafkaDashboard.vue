<template>
    <section>
        <div class="totalBox">
            <el-row type="flex" justify="space-around">
                <el-col :span="6">
                    <div class="box-item bg-blue bg-height white-color">
                        <h4 class="font-size-40 box-h margin-top20">{{data.brokerCount}}</h4>
                        <!-- <span class="margin-left10 font-bolder margin-top10 pull-left font-size-20">Broker</span> -->
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="box-item bg-darkYellow bg-height white-color">
                        <h4 class="font-size-40 box-h margin-top20">{{data.topicCount}}</h4>
                        <!-- <span class="margin-left10 font-bolder margin-top10 pull-left font-size-20">Topics</span> -->
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="box-item bg-green bg-height white-color">
                        <h4 class="font-size-40 box-h margin-top20">{{data.consumerCount}}</h4>
                        <!-- <span class="margin-left10 font-bolder margin-top10 pull-left font-size-20">Consumer</span> -->
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 10px" type="flex" justify="space-around">
                <el-col :span="6">
                    <div class="box-item bg-orange bg-height white-color">
                        <h4 class="font-size-40 box-h margin-top20">{{reversedStatus}}</h4>
                        <!-- <span class="margin-left10 font-bolder margin-top10 pull-left font-size-20">集群状态</span> -->
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="box-item bg-lightBlue bg-height white-color">
                        <h4 class="font-size-40 box-h margin-top20">{{data.controllerCount}}</h4>
                        <!-- <span class="margin-left10 font-bolder margin-top10 pull-left font-size-20">Controller</span> -->
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="box-item bg-yellow bg-height white-color" @click="goTask">
                        <h4 class="font-size-40 box-h margin-top20">{{data.taskCount}}</h4>
                        <!-- <span class="margin-left10 font-bolder margin-top10 pull-left font-size-20">迁移任务 -->
                        <!-- <el-button v-if="data.taskCount >0" class="pull-right" icon="el-icon-arrow-right" circle type="text" size="small"
                          style="margin-top: -2px;color: #fff;background: rgb(230, 145, 145)"></el-button> -->
                        <!-- </span> -->
                    </div>
                </el-col>
            </el-row>
        </div>
    </section>
</template>
<script>
    import "@/styles/kafka.css";
    import api from '@/api/topic'

    export default {
        props: ['clusterSelect'],
        data() {
            return {
                data: {
                    levelList: [],
                    brokerCount: 0,
                    topicCount: 0,
                    consumerCount: 0,
                    clusterStatus: 'ok',
                    controllerCount: 0,
                    taskCount: 0,
                    visibleDash: true,
                    taskData: [
                        {topic: 'user_events', partition: 2, replicas: [2, 1, 3]},
                        {topic: 'user_events', partition: 1, replicas: [1, 3, 2]},
                        {topic: 'user_events', partition: 0, replicas: [3, 2, 1]}],
                    clusterId: ''
                }
            }
        },
        computed: {
            reversedStatus:function(){
                if (this.clusterStatus === 'ok') {
                    return this.$i18n.t('m.statusNormal')
                } else {
                    return this.$i18n.t('m.statusException')
                }
            }
        },
        watch: {
            clusterSelect(newData) {
                this.getCount();
            }
        },
        created() {
            this.getCount();
            this.$forceUpdate()
        },
        methods: {
            getCount: function () {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                api.kafkaPackFunction(`/kafka/brokers`, "get", selectCluster).then((res) => {
                    if (res.data.reply.result.data.developerMessage !== undefined) {
                        this.$message.error(res.data.reply.result.data.developerMessage)
                        return
                    }
                    this.data.brokerCount = res.data.reply.result.data.length
                })
                api.kafkaPackFunction(`/kafka/topics`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage !== undefined) {
                        this.$message.error(res.data.reply.result.data.developerMessage)
                        return
                    }
                    this.data.topicCount = res.data.reply.result.data.length
                })
                api.kafkaPackFunction(`/kafka/consumergroups`, "get", selectCluster).then((res) => {
                    if (res.data.reply.result.data.developerMessage !== undefined) {
                        this.$message.error(res.data.reply.result.data.developerMessage)
                        return
                    }
                    this.data.consumerCount = res.data.reply.result.data.new.length + res.data.reply.result.data.old.length
                })
                api.kafkaPackFunction(`/kafka/health`, "get", selectCluster).then((res) => {
                    this.data.clusterStatus=res.data.reply.result.data.status
                })
                api.kafkaPackFunction(`/kafka/controller`, "get", selectCluster).then((res) => {
                    if (res.data.reply.result.data.id !== undefined) {
                        this.data.controllerCount = res.data.reply.result.data.id
                    }
                })
                let originalUri = "/zk/get/path"
                let str = "?path=%2Fadmin%2Freassign_partitions"
                let uri = originalUri + str
                let requestType = "get";
                api.kafkaPackFunctionOri(uri, requestType, originalUri, selectCluster).then(res => {
                    if (res.data.reply.result.developerMessage !== undefined) {
                        this.$message.error(res.data.reply.result.developerMessage)
                        return;
                    }
                    if (res.data.reply.result.connectionRefused !== undefined) {
                        this.$message.error(this.$i18n.t('m.tipConnect'))
                        return;
                    }
                    if (res.data.reply.result.data.code == 400) {
                        this.data.taskCount = 0;
                        // this.$message.error(res.data.reply.result.data.subErrorList[0].message);
                        return;
                    }
                    this.data.taskCount = res.data.reply.result.data.partitions.length
                })
            },
            goTask() {
                this.$router.push({path: '/kafka/clusterSelect/taskCountDetail'})
            }
        }
    }

</script>
<style scoped>
    .box-item {
        box-sizing: border-box;
        width: 100%;
        border-radius: 10px;
        text-align: center;
        padding: 10px 0;
    }
</style>
