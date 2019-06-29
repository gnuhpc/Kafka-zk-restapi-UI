<template>
    <section>
        <section class="selectTool">
            <el-row class="seleteTitle">
                <el-form :inline="true" class="formFirst">
                    <el-col :span="12">
                        <el-form-item label="Partition">
                            <el-select v-model="messageDetail.partition" size="mini" @change="currentPartition">
                                <el-option v-for="item in optionPartition" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Limit">
                            <el-input v-model="messageDetail.limit" size="mini" @change="handleSelect3">
                            </el-input>
                        </el-form-item>
                        <template v-if="showDate">
                            <el-form-item label="From offset">
                                <el-input v-model="messageDetail.fromOffset" size="mini" @change="handleSelect5">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-col>
                </el-form>
                <el-form :inline="true" class="formSecond">
                    <el-col :span="12">
                        <el-form-item label="Key">
                            <el-select v-model="key" size="mini" @change="handleSelect1">
                                <el-option v-for="item in optionKey" :key="item.label" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Value">
                            <el-select v-model="value" size="mini" @change="handleSelect2">
                                <el-option v-for="item in optionValue" :key="item.label" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本">
                            <el-select v-model="version" size="mini" @change="versionSelect(version)">
                                <el-option v-for="item in versionList" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div class="pull-right">
                            <el-button class="margin-left0" type="primary" size="mini" plain @click="refreshData">
                                刷新
                            </el-button>
                            <!-- <el-button class="margin-left0" type="primary" size="mini" plain @click="goBack">
                                返回
                            </el-button> -->
                        </div>
                    </el-col>
                </el-form>
            </el-row>
            <el-row class="selectTerm">
                <el-col :span="10" class="sliderOffset">
                    <div>
                        <div @click="showData()" style="margin-bottom:3px;color:#198def;text-decoration: underline;">{{showDate|showDate}}</div>
                        <template v-if="showDate">
                            <span class="start">{{messageDetail.startOffset}}</span><span class="end">{{messageDetail.endOffset}}</span>
                            <el-slider v-model="messageDetail.offset" :min="messageDetail.startOffset" :max="messageDetail.endOffset"
                                @change="sliderChange"></el-slider>
                        </template>
                        <template v-else="!showDate">
                            <el-date-picker v-model="timestemp" type="datetime" size="mini" placeholder="请选择时间" @change="getDateData"></el-date-picker>
                        </template>
                    </div>
                </el-col>
                <el-col :span="12" :offset="2" class="avroMs">
                    <el-form :inline="true">
                        <span @click="show = !show" v-if="this.value=='KafkaAvroDeserializer'||this.value=='AvroDeserializer'"><i
                                class="el-icon-caret-bottom"></i></span>
                        <el-form-item label="avroschema" v-if="this.value=='KafkaAvroDeserializer'||this.value=='AvroDeserializer'"
                            v-show="show">
                            <!-- <el-input v-model="AvroDeserializer" type="textarea" size="mini" @change="handleSelect4">
                            </el-input> -->
                            <textarea name="" id="" cols="55" rows="6" v-model="AvroDeserializer" @change="handleSelect4"></textarea>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </section>
        <section class="keyTab">
            <el-tabs v-model="activeTab" type="card" @tab-click="handleTab">
                <el-tab-pane label="KEY-VALUE" name="first-ta">
                    <el-row>
                        <ul class="messageList" v-loading="listLoading">
                            <li v-html="htmlstr" class="titleNotice"></li>
                            <li v-for="(item,index) in list" :key="index">
                                <div style="font-size:12px;">
                                    <i class="el-icon-arrow-right" style="font-size:14px;"></i>
                                    <strong style="font-size:14px;">KEY:</strong>{{item.key}}</div>
                                <div style="word-break: break-all; font-size:12px;">
                                    <i class="el-icon-arrow-right" style="font-size:14px;"></i>
                                    <strong style="font-size:14px;">VALUE:</strong>{{item.value}}</div>
                                <div>
                                    <span><strong>OFFSET: </strong>{{item.offset}}</span>
                                    <span><strong>PARTITION: </strong>{{item.partition}}</span>
                                    <span><strong>TIMESTAMP: </strong>{{item.timestamp}}</span>
                                </div>
                            </li>
                        </ul>
                    </el-row>
                    <el-row>
                        <el-col :span="24" style="text-align: right;">
                            <pagination :total='total' @pageChange="handleChange"></pagination>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="TABLE" name="second-ta">
                    <el-row>
                        <el-table :data="data_list" highlight-current-row v-loading="tableLoading">
                            <template v-for="(val,key) in header">
                                <el-table-column :label="val" show-overflow-tooltip min-width="140px">
                                    <template slot-scope="scope">
                                        <span>{{data_list[scope.$index][val]}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </el-row>
                    <el-row>
                        <pagination :total='totalTable' :pageSize='pageSizeTable' @pageChange="handleChangeTable"></pagination>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </section>
    </section>
</template>
<script>
    import Vue from 'vue'
    import api from '@/api/topic'
    import "@/styles/paas_style_element.css"
    import pagination from "@/components/resourceApplication/page";
    import appUtil from "@/utils/appUtil"
    Vue.filter('showDate', function (val) {
        if (val) {
            return "Browse with timestamp";
        } else {
            return "Browse with offset";
        }
    })
    export default {
        components: { pagination },
        props: ['detailData'],
        data() {
            return {
                messageDetail: {
                    fromOffset:'',
                    offset: 0,
                    startOffset: 0,
                    endOffset: 1,
                    partition: 0,
                    limit: 200,
                    topic: '',
                },
                AvroDeserializer: '',
                listLoading: false,
                messageDetailList: [],
                list: [],
                key: 'StringDeserializer',
                optionKey: [
                    { value: 'StringDeserializer', label: 'String' },
                    { value: 'ByteArrayDeserializer', label: 'ByteArray' },
                    { value: 'ByteBufferDeserializer', label: 'ByteBuffer' },
                    { value: 'BytesDeserializer', label: 'Bytes' },
                    { value: 'DoubleDeserializer', label: 'Double' },
                    { value: 'FloatDeserializer', label: 'Float' },
                    { value: 'IntegerDeserializer', label: 'Integer' },
                    { value: 'LongDeserializer', label: 'Long' },
                    { value: 'ShortDeserializer', label: 'Short' },
                    { value: 'AvroDeserializer', label: 'Avro' },
                    { value: 'KafkaAvroDeserializer', label: 'KafkaAvro' }
                ],
                value: 'StringDeserializer',
                optionValue: [
                    { value: 'StringDeserializer', label: 'String' },
                    { value: 'ByteArrayDeserializer', label: 'ByteArray' },
                    { value: 'ByteBufferDeserializer', label: 'ByteBuffer' },
                    { value: 'BytesDeserializer', label: 'Bytes' },
                    { value: 'DoubleDeserializer', label: 'Double' },
                    { value: 'FloatDeserializer', label: 'Float' },
                    { value: 'IntegerDeserializer', label: 'Integer' },
                    { value: 'LongDeserializer', label: 'Long' },
                    { value: 'ShortDeserializer', label: 'Short' },
                    { value: 'AvroDeserializer', label: 'Avro' },
                    { value: 'KafkaAvroDeserializer', label: 'KafkaAvro' }
                ],
                version: '',
                versionList: [],
                optionPartition: [],
                total: 0,
                pageSize: 5,
                page: 1,
                htmlstr: '',
                clusterId: '',
                show: true,
                activeTab: "first-ta",
                flag: false,
                totalTable: 0,
                pageSizeTable: 10,
                pageTable: 1,
                header: [],//表头数据
                data_list: [],//内容数据
                tableList: [],
                tableLoading: false,
                showDate: true,
                timestemp: "",
            }
        },
        watch: {
            detailData(newData, oldData) {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                let subject = newData.topicName + "-value";
                let browse = '';
                this.versionList = [];
                this.version='';
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}/versions`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        this.versionList = res.data.reply.result.data;
                        this.versionList = this.versionList.sort(function (a, b) {
                            return a - b;
                        })
                        this.version=this.versionList[this.versionList.length-1]
                    } else {
                        this.versionList = [];
                    }
                });
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        if (res.data.reply.result.data.hasOwnProperty("schema")) {
                            this.value = "KafkaAvroDeserializer";
                            this.AvroDeserializer = res.data.reply.result.data.schema;
                            let dataObj = JSON.parse(res.data.reply.result.data.schema);
                            let headerList = []
                            dataObj.fields.forEach((item) => {
                                headerList.push("value." + item.name)
                            })
                            let headerBoth = ["partition", "offset", "timestamp", "key"];
                            this.header = headerBoth.concat(headerList)
                        }
                    } else {
                        this.value = "StringDeserializer";
                        this.AvroDeserializer = "";
                        this.header = ["partition", "offset", "timestamp", "key", "value"];
                    }
                }).then(() => {
                    this.messageDetailList = [];
                    this.total = 0;
                    let optitionList = [];
                    newData.topicPartitionInfos.forEach(item => {
                        optitionList.push(item.topicPartitionInfo.partition);
                    })
                    this.optionPartition = optitionList;
                    this.messageDetail.topic = newData.topicName
                    this.messageDetail.partition = newData.topicPartitionInfos[0].topicPartitionInfo.partition;
                    this.messageDetail.offset = newData.topicPartitionInfos[0].startOffset;
                    this.messageDetail.fromOffset = newData.topicPartitionInfos[0].startOffset.toString();
                    this.messageDetail.startOffset = newData.topicPartitionInfos[0].startOffset;
                    this.messageDetail.endOffset = newData.topicPartitionInfos[0].endOffset;
                    let uri = "";
                    if (this.value == "KafkaAvroDeserializer" || this.value == "AvroDeserializer") {
                        uri = `/kafka/consumer/${this.messageDetail.topic}/${this.messageDetail.partition}/${this.messageDetail.offset}`
                            + `?maxRecords=${this.messageDetail.limit}&keyDecoder=${this.key}&valueDecoder=${this.value}&avroSchema=${this.AvroDeserializer}`
                        uri = encodeURI(uri)
                        uri = uri.replace(/:/g, '%3A')
                        uri = uri.replace(/,/g, '%2C')
                        // uri=uri.replace(/25/g, '')
                    } else {
                        uri = `/kafka/consumer/${this.messageDetail.topic}/${this.messageDetail.partition}/${this.messageDetail.offset}`
                            + `?maxRecords=${this.messageDetail.limit}&keyDecoder=${this.key}&valueDecoder=${this.value}`
                    }
                    let requestType = "get";
                    this.listLoading = true;
                    this.tableLoading = true;
                    api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
                        this.listLoading = false;
                        this.tableLoading = false;
                        if (res.data.reply.result.data.developerMessage !== undefined) {
                            this.htmlstr = res.data.reply.result.data.developerMessage;
                            this.list = [];
                            this.data_list = [];
                            return;
                        }
                        if (res.data.reply.result.status === 200) {
                            this.pageTable = 1
                            this.htmlstr = '';
                            let messageList = res.data.reply.result.data
                            messageList.forEach(item => {
                                item.timestamp = appUtil.utcToDate(item.timestamp)
                                item.partition = this.messageDetail.partition
                            })
                            this.total = messageList.length
                            this.messageDetailList = messageList
                            this.list = this.messageDetailList.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))
                            if (this.value == "KafkaAvroDeserializer" || this.value == "AvroDeserializer") {
                                this.tableList = res.data.reply.result.data
                                this.getTabList(this.tableList)
                            } else {
                                this.tableList = res.data.reply.result.data
                            }
                            this.tableList.forEach(item => {
                                item.timestamp = appUtil.utcToDate(item.timestamp)
                                item.partition = this.messageDetail.partition
                            })
                            this.totalTable = this.tableList.length
                            this.data_list = this.tableList.filter((u, index) => index < this.pageSizeTable * this.pageTable && index >= this.pageSizeTable * (this.pageTable - 1));
                        }
                    })
                })
            }
        },
        mounted() {
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'));
            var time = new Date()
            this.timestemp = appUtil.utcToDate(time);
        },
        methods: {
            utcToDate(str) {
                var date = new Date(str)
                var Y = date.getFullYear()
                var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
                var ms = date.getMilliseconds() < 10 ? '00' + date.getMilliseconds() : date.getMilliseconds() < 100 ? '0' + date.getMilliseconds() : +date.getMilliseconds()
                return Y + '-' + M + '-' + D + '%20' + h + '%3A' + m + '%3A' + s + '.' + ms
            },
            handleTab(tab, event) {
                this.activeTab = tab.name;
                this.getMessageDetail();
                this.getTableData();
            },
            handleChange(item) {
                this.page = item.page;
                this.pageSize = item.limit;
                this.list = this.messageDetailList.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))
            },
            handleChangeTable(item) {
                this.pageTable = item.page;
                this.pageSizeTable = item.limit;
                this.data_list = this.tableList.filter((u, index) => index < this.pageSizeTable * this.pageTable && index >= this.pageSizeTable * (this.pageTable - 1));
            },
            handleSelect1() {
                if (this.activeTab == "first-ta") {
                    this.getMessageDetail();
                } else {
                    this.getTableData();
                }
            },
            handleSelect2() {
                if (this.activeTab == "first-ta") {
                    this.getMessageDetail();
                } else {
                    this.getTableData();
                }
            },
            handleSelect3() {
                if (this.activeTab == "first-ta") {
                    this.getMessageDetail();
                } else {
                    this.getTableData();
                }
            },
            handleSelect4() {
                if (this.activeTab == "first-ta") {
                    this.getMessageDetail();
                } else {
                    this.getTableData();
                }
            },
            handleSelect5() {  
                this.messageDetail.offset=parseInt(this.messageDetail.fromOffset);
                this.$forceUpdate();              
                if (this.activeTab == "first-ta") {
                    this.getMessageDetail();
                } else {
                    this.getTableData();
                }
            },
            versionSelect(val) {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId
                let subject = this.detailData.topicName + "-value";
                this.version=val;
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}/versions/${this.version}`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        this.AvroDeserializer = res.data.reply.result.data.schema;
                    }
                })
            },
            sliderChange() {
                this.messageDetail.fromOffset=this.messageDetail.offset.toString()
                if (this.activeTab == "first-ta") {
                    this.getMessageDetail();
                } else {
                    this.getTableData();
                }
            },
            currentPartition() {
                this.detailData.topicPartitionInfos.forEach(item => {
                    if (item.topicPartitionInfo.partition == this.messageDetail.partition) {
                        this.messageDetail.startOffset = item.startOffset
                        this.messageDetail.endOffset = item.endOffset
                        this.messageDetail.offset = item.startOffset
                    }
                })
                this.getMessageDetail();
                this.getTableData();
            },
            getVersionList() {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                let subject = this.messageDetail.topic + "-value";
                this.versionList = []
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}/versions`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        this.versionList = res.data.reply.result.data;
                        this.versionList = this.versionList.sort(function (a, b) {
                            return a - b;
                        })
                        this.version=this.versionList[this.versionList.length-1]
                    } else {
                        this.versionList = [];
                    }
                })
            },
            getDateData() {
                this.getMessageDetail();
            },
            showData() {
                this.showDate = !this.showDate;
                this.getTableData();
                this.getMessageDetail();
            },
            getMessageDetail() {
                this.htmlstr = '';
                this.messageDetailList = [];
                this.total = 0;
                let requestType = "get";
                this.listLoading = true;
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                //let subject = this.messageDetail.topic + "-value";
                // api.kafkaPackFunction(`/schemaregistry/subjects/${subject}`, "get", selectCluster).then(res => {
                //     if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                //         if (res.data.reply.result.data.hasOwnProperty("schema")) {
                //             this.value = "KafkaAvroDeserializer";
                //             this.AvroDeserializer = res.data.reply.result.data.schema;
                //         }
                //     } else {
                //         this.value = "StringDeserializer";
                //         this.AvroDeserializer = "";
                //     }
                // }).then(()=>{

                // })
                let browse = '';
                if (this.showDate) {
                    browse = this.messageDetail.offset
                } else {
                    browse = this.utcToDate(this.timestemp);
                }
                // console.log(browse)
                let uri = '';
                if (this.value == 'AvroDeserializer' || this.value == 'KafkaAvroDeserializer') {
                    //    let AvroDeserializer = this.AvroDeserializer.replace(/\s/g, '%20');
                    //    AvroDeserializer=escape(AvroDeserializer);
                    uri = `/kafka/consumer/${this.messageDetail.topic}/${this.messageDetail.partition}/${browse}`
                        + `?maxRecords=${this.messageDetail.limit}&keyDecoder=${this.key}&valueDecoder=${this.value}&avroSchema=${this.AvroDeserializer}`
                    uri = encodeURI(uri)
                    uri = uri.replace(/:/g, '%3A')
                    uri = uri.replace(/,/g, '%2C')
                    uri = uri.replace(/25/g, '')
                } else {
                    uri = `/kafka/consumer/${this.messageDetail.topic}/${this.messageDetail.partition}/${browse}`
                        + `?maxRecords=${this.messageDetail.limit}&keyDecoder=${this.key}&valueDecoder=${this.value}`
                }
                api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
                    this.listLoading = false;
                    if (res.data.reply.result.connectionRefused == "connectionRefused") {
                        this.$message.error('微服务拒绝连接！');
                        return;
                    }
                    if (res.data.reply.result.data.developerMessage !== undefined) {
                        this.htmlstr = res.data.reply.result.data.developerMessage;
                        this.list = [];
                        return;
                    }
                    if (res.data.reply.result.status === 200) {
                        let messageList = res.data.reply.result.data
                        messageList.forEach(item => {
                            item.timestamp = appUtil.utcToDate(item.timestamp)
                            item.partition = this.messageDetail.partition
                        })
                        this.total = messageList.length
                        this.messageDetailList = messageList
                        this.list = this.messageDetailList.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))
                    }
                })
            },
            refreshData() {
                this.getMessageDetail();
                this.getTableData();
            },
            goBack: function () {
                this.$emit('showTopicManage', { topic: true, detail: false })
            },
            //table页面
            getTabList(ary) {
                for (let i = 0; i < ary.length; i++) {
                    if (ary[i].value) {
                        let obj = JSON.parse(ary[i].value)
                        let arr = []
                        for (let item in obj) {
                            ary[i]["value." + item] = obj[item]
                            arr.push(ary[i]["value." + item])
                        }
                        // delete ary[i].value
                    }
                }
                return ary;
            },
            getTableData() {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                let subject = this.messageDetail.topic + "-value";
                let browse = '';
                if (this.showDate) {
                    browse = this.messageDetail.offset
                } else {
                    browse = this.utcToDate(this.timestemp);
                }
                this.tableLoading = true;
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        if (res.data.reply.result.data.hasOwnProperty("schema")) {
                            this.value = "KafkaAvroDeserializer";
                            this.AvroDeserializer = res.data.reply.result.data.schema;
                            let dataObj = JSON.parse(res.data.reply.result.data.schema);
                            let headerList = []
                            dataObj.fields.forEach((item) => {
                                headerList.push("value." + item.name)
                            })
                            let headerBoth = ["partition", "offset", "timestamp", "key"];
                            this.header = headerBoth.concat(headerList)
                            //console.log(this.header)
                            let requestType = "get";
                            let uri = `/kafka/consumer/${this.messageDetail.topic}/${this.messageDetail.partition}/${browse}`
                                + `?maxRecords=${this.messageDetail.limit}&keyDecoder=${this.key}&valueDecoder=${this.value}&avroSchema=${this.AvroDeserializer}`
                            uri = encodeURI(uri)
                            uri = uri.replace(/:/g, '%3A')
                            uri = uri.replace(/,/g, '%2C')
                            uri = uri.replace(/25/g, '')
                            api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
                                this.tableLoading = false;
                                if (res.data.reply.result.connectionRefused == "connectionRefused") {
                                    this.$message.error('微服务拒绝连接！');
                                    return;
                                }
                                if (res.data.reply.result.data.developerMessage !== undefined) {
                                    this.data_list = [];
                                    return;
                                }
                                if (res.data.reply.result.status === 200) {
                                    this.tableList = res.data.reply.result.data
                                    this.getTabList(this.tableList)
                                    this.tableList.forEach(item => {
                                        item.timestamp = appUtil.utcToDate(item.timestamp)
                                        item.partition = this.messageDetail.partition
                                    })
                                    //console.log(this.tableList, "1")
                                    this.totalTable = this.tableList.length
                                    this.data_list = this.tableList.filter((u, index) => index < this.pageSizeTable * this.pageTable && index >= this.pageSizeTable * (this.pageTable - 1));
                                }
                            })
                        }
                    } else {
                        this.header = ["partition", "offset", "timestamp", "key", "value"];
                        // this.value = "StringDeserializer";
                        this.AvroDeserializer = "";
                        let uri = "";
                        uri = `/kafka/consumer/${this.messageDetail.topic}/${this.messageDetail.partition}/${browse}`
                            + `?maxRecords=${this.messageDetail.limit}&keyDecoder=${this.key}&valueDecoder=${this.value}`
                        let requestType = "get";
                        api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
                            this.tableLoading = false;
                            if (res.data.reply.result.connectionRefused == "connectionRefused") {
                                this.$message.error('微服务拒绝连接！');
                                return;
                            }
                            if (res.data.reply.result.data.developerMessage !== undefined) {
                                this.data_list = [];
                                return;
                            }
                            if (res.data.reply.result.status === 200) {
                                this.tableList = res.data.reply.result.data
                                this.tableList.forEach(item => {
                                    item.timestamp = appUtil.utcToDate(item.timestamp)
                                    item.partition = this.messageDetail.partition
                                })
                                //console.log(this.tableList, "2")
                                this.totalTable = this.tableList.length
                                this.data_list = this.tableList.filter((u, index) => index < this.pageSizeTable * this.pageTable && index >= this.pageSizeTable * (this.pageTable - 1));
                            }
                        })
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .selectTool {
        width: 100%;
        margin-bottom: 10px;
    }

    .selectTitle {
        height: 30px;
        margin-top: 20px;
    }

    .formFirst>>>.el-form-item__content {
        width: 80px;
    }

    .formSecond>>>.el-form-item__content {
        width: 100px;
    }

    .selectTerm {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        flex-wrap: nowrap;
        color: #666;
        margin-bottom: 15px;
    }

    .sliderOffset {
        position: relative;
        /* width: 50%; */

    }

    .avroMs {
        flex: 1;
    }

    .sliderOffset .el-slider {
        width: 100%;
    }

    .end {
        width: 100px;
        text-align: center;
        position: absolute;
        right: 1%;
    }

    .keyTab>>>.el-tabs__nav-scroll {
        height: 40px;

    }

    .messageList {
        font-size: 0.875rem;
    }

    .messageList li div:nth-child(3) {
        margin-bottom: 12px;
    }

    .messageList li {
        border-bottom: 1px solid #f3f3f3;
    }

    .messageList li .el-icon-arrow-right {
        height: 14px;
        width: 14px;
        border: 1px solid #198def;
        border-radius: 5px;
        margin: 0 auto;
        color: #198def;
    }

    .messageList li div:nth-child(1) strong,
    .messageList li div:nth-child(2) strong {
        color: #198def;
        margin: 0 14px;
    }

    .messageList li div:nth-child(3) span {
        margin-left: 32px;
    }

    .messageList li {
        margin: 12px 0;
    }

    .titleNotice {
        width: 100%;
        /* height: 20px; */
        font-size: 14px;
        color: red;
        border-bottom: 1px solid transparent;
    }
</style>