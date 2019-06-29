<template>
    <div>
        <!--配置操作-->
        <section>
            <!--工具条-->
            <!-- <el-col :span="24" style="padding-bottom: 6px;">
                <div class="pull-right">
                    <el-button class="margin-left0" type="primary" size="mini" plain @click="goBack">
                        返回
                    </el-button>
                </div>
            </el-col> -->
            <!--列表-->
            <table class="tableBox tableConfig" v-loading="listLoading">
                <tr style="background:#f5f5f5;">
                    <th>key</th>
                    <th>value</th>
                    <th>操作</th>
                </tr>
                <tr v-for="(item,index) in topicConfigs" :key="index">
                    <td min-width="25%">{{item.name}}</td>
                    <td min-width="25%">{{item.value}}</td>
                    <td min-width="25%">
                        <el-dropdown size="mini">
                            <el-button size="mini" type="primary">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item type="text" @click.native="openUpdateConf(item)">修改</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </td>
                </tr>
            </table>
            <!--修改配置-->
            <el-dialog title="配置选项修改" :visible.sync="configs.updateDialogVisible">
                <el-form>
                    <el-form-item :label="configs.key">
                        <el-select v-model="configs.value" v-if="configs.key == 'compression.type'">
                            <el-option :label="value" :value="value" v-for="(value,key) of compressionType" :key="key"></el-option>
                            </el-option>
                        </el-select>
                        <el-select v-model="configs.value" v-if="configs.key == 'message.timestamp.type'">
                            <el-option :label="value" :value="value" v-for="(value,key) of messageTimestampType" :key="key"></el-option>
                            </el-option>
                        </el-select>
                        <el-select v-model="configs.value" v-if="configs.key == 'cleanup.policy'">
                            <el-option :label="value" :value="value" v-for="(value,key) of cleanupPolicy" :key="key"></el-option>
                            </el-option>
                        </el-select>
                        <el-input v-model="configs.value" v-if="configs.key !=='compression.type'&&configs.key !=='message.timestamp.type'&&configs.key !=='cleanup.policy'"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="configs.updateDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateTopicConf">确定</el-button>
                </div>
            </el-dialog>
        </section>
        </section>
    </div>
</template>
<script>
    import api from '@/api/topic'
    export default {
        props: ['detailData'],
        data() {
            return {
                topicConfigs: [],
                configs: {
                    addDialogVisible: false,
                    updateDialogVisible: false,
                    addConfigs: [{ key: '', value: '' }],
                    topic: '',
                    key: '',
                    value: ''
                },
                listLoading: false,
                compressionType: ['uncompressed', 'snappy', 'lz4', 'gzip', 'producer'],
                messageTimestampType: ['CreateTime', 'LogAppendTime'],
                cleanupPolicy: ['compact', 'delete'],
                clusterId:''
            }
        },
        created() {
            this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        },
        watch: {
            detailData(newData, oldData) {
                this.listLoading = true;
                this.configs.topic = newData.topicName;
                this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster=this.clusterId 
                api.kafkaPackFunction(`/kafka/topics/${this.configs.topic}/conf`, "get",selectCluster).then(res => {
                    this.listLoading = false;
                    if (res.data.reply.result.data.developerMessage == undefined) {
                        this.topicConfigs = res.data.reply.result.data;
                    } else {
                        this.$message.error(res.data.reply.result.data.developerMessage)
                    }
                })               
            }
        },
        methods: {
            openUpdateConf: function (item) {
                this.configs.key = item.name
                this.configs.value = item.value
                this.configs.updateDialogVisible = true
            },
            updateTopicConf: function () {
                let datas = {}
                datas.topic = this.configs.topic
                datas.key = this.configs.key
                datas.value = this.configs.value
                this.clusterId=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster=this.clusterId 
                api.kafkaPackFunction(`/kafka/topics/${this.configs.topic}/conf/${this.configs.key}=${this.configs.value}`, "put",selectCluster).then(res => {
                    this.configs.updateDialogVisible = false
                    if (res.data.reply.result.data.developerMessage !== undefined) {
                        this.$message({
                            message: res.data.reply.result.data.developerMessage,
                            type: 'error'
                        })
                    } else {
                        this.topicConfigs = res.data.reply.result.data
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                    }
                })
            },
            goBack: function () {
                this.$emit('showTopicManage', { topic: true, detail: false })
            },
        },
    }
</script>