<template>
        <section>
           <!-- <el-form label-width="92px">
                <el-row class="clusterSelect">
                    <el-col :span="6" :offset="route?6:8" >
                        <el-form-item label="集群">
                            <el-select v-model="select" value-key="clusterName" @change="handleselected" size="mini">
                                <el-option :value="item" :key="item.clusterName" :label="item.clusterName" v-for="(item,index) of dataform">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" v-if="route">
                        <div class="kafka_title friendlink" style="pointer-events: none" @click="jump">友情链接:</div>
                    </el-col>
                </el-row>
            </el-form>-->
            <section>
                <router-view :clusterSelect='clusterSelect' @emitroute="emitroute"></router-view>
            </section>
        </section>
    </template>
<script>
    import '@/styles/paas_style_element.css'
    import { findAllKafkaCluster } from '@/api/cluster'
    import axios from 'axios'
    //import api from '@/api/topic'
    import $ from 'jquery'
    export default {
        data() {
            return {
                select: '',
                clusterSelect: '',
                clusterName: '',
                dataform: [],
                route:false,
            }
        },
        watch: {
            $route: function (newVal, oldVal) {
                if(newVal!=oldVal&&newVal.name!='brokerManage'){
                    this.route=false;
                }
            }
        },
        created() {
            var that = this
            /*$.ajax({
                type: "get",
                url: "/kafkaRes/paas-kafka/kafka/findAllKafkaCluster",
                async: false,
                success: function (res) {
                    if (res.reply.returnCode.type == "S") {
                        that.dataform = res.reply.result.kafkaClusterInfoList;
                        that.select = that.dataform[0].clusterName;
                        that.clusterSelect = that.dataform[0].id
                        sessionStorage.setItem('kafkaclusterSelect', JSON.stringify(that.clusterSelect))
                        //console.log(that.select)
                    } else {
                        that.$message.error(res.reply.returnCode.message);
                    }
                }
            });*/
        },
        methods: {
            handleselected() {
                this.clusterSelect = this.select.id;
                //console.log(this.select,"this.select");
                //console.log(this.clusterSelect,"this.clusterSelect")
                sessionStorage.setItem('kafkaclusterSelect', JSON.stringify(this.clusterSelect))
            },
            emitroute(val){
                this.route=val==='brokerManage'
            },
            jump(){
                window.open('http://loggle.biz.cmbc.cn');
            }
        }
    }
</script>
<style>
    .clusterSelect {
        width: 100%;
        height: 42px;
        background: #fff;
        padding: 6px 0;
        margin-bottom: 10px;
        border: 1px solid #e5e5e5;
    }
    .kafka_title{
        display:inline-block;
        font-size: 14px;
        font-weight: 900;
        color: #333;
        padding: 6px 20px;
        margin: 5px 0;
        position:relative
    }
    .kafka_title::after{
        width:17px;
        height:18px;
        content:'';
        display:inline-block;
        position:absolute;
        left: 95px;
        top: 6px;
        background:url(../../assets/headerImg/12.png) no-repeat;
        background-size: 100%;
        cursor: pointer;
        pointer-events:auto;
    }
    .friendlink{
        margin: 0;
        line-height: 18px;
        height: 46px;
        box-sizing: border-box;
    }
</style>
