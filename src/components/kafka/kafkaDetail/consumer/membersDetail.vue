<template>
    <section>
        <!--详情-->
        <section class="paas_block">
            <el-row>
                <el-col :span="20">
                    <span class="paas_title">{{$t('m.consumerDetailList')}}</span>
                </el-col>
                <el-col :span="4" style="padding-bottom: 6px;">
                    <div class="pull-right">
                    <el-button type="primary" size="mini" plain @click="goBack">
                        {{$t('m.back')}}
                    </el-button>
                </div>
                </el-col>
            </el-row>
            <!--列表-->
            <el-table :data="membersList" v-loading="listLoading">
                <el-table-column label="host" prop="host" show-overflow-tooltip width="129"></el-table-column>
                <el-table-column label="memberId" prop="memberId" show-overflow-tooltip></el-table-column>
                <el-table-column label="clientId" prop="clientId" show-overflow-tooltip width="149"></el-table-column>
                <el-table-column label="assignment" prop="assignment" show-overflow-tooltip :formatter="formatAssignment"></el-table-column>
            </el-table>
        </section>
    </section>
</template>
<script>
    import "@/styles/paas_style_element.css"
    import api from '@/api/topic'
    export default {
        data() {
            return {
                listLoading: false,
                membersList: [],
                clusterId: ''
            }
        },
        created() {
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
            this.getListData();
        },
        methods: {
            formatAssignment(row, column) {
                let str = '';
                row.assignment.forEach(item => {
                    str += item.topic + '-' + item.partition + ',';
                })
                str = str.slice(0, str.length - 1);
                return str;
            },
            getListData() {
                let that = this;
                let consumerGroup = that.$route.query.data;
                that.listLoading = true;
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                api.kafkaPackFunction(`/kafka/consumergroups/${consumerGroup}/meta`, "get", selectCluster).then(res => {
                    that.listLoading = false;
                    if (res.data.reply.result.data.developerMessage == undefined) {
                        that.membersList = res.data.reply.result.data.members
                    } else {
                        that.$message.error(res.data.reply.result.data.developerMessage)
                    }
                })

            },

            goBack: function () {
                this.$router.go(-1);
            },
        }
    }
</script>