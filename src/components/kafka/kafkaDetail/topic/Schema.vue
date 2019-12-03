<template>
    <div class="paas_blockKafka">
        <section>
            <div class="pull-right">
                    <!-- <el-button class="margin-left0" type="primary" size="mini" plain @click="refreshData">
                            刷新
                        </el-button> -->
                <!-- <el-button class="margin-left0" type="primary" size="mini" plain @click="goBack">
                    返回
                </el-button> -->
            </div>
            <!-- <div class="cl h5"></div> -->
            <el-tabs v-model="activeTab" @tab-click="handleTab">
                <el-tab-pane label="Value" name="first-ta">
                    <el-button class="margin-left0" type="primary" size="mini" plain @click="editSchemaVisible=true;versionHistoryVisible=false;getSchemaData();">Edit
                        Schema</el-button>
                    <el-button class="margin-left0" type="primary" size="mini" plain @click="versionHistoryVisible=true;editSchemaVisible=false;getSchemaData()">Version
                        History</el-button>
                    <el-button class="margin-left0 downloadButton" type="primary" size="mini" plain @click="downloadData"><i
                            class="el-icon-download"></i>Download</el-button>
                </el-tab-pane>
                <el-tab-pane label="Key" name="second-ta">
                    <el-button class="margin-left0" type="primary" size="mini" plain @click="editSchemaVisible=true;versionHistoryVisible=false;">Edit
                        Schema</el-button>
                    <el-button class="margin-left0" type="primary" size="mini" plain @click="versionHistoryVisible=true;editSchemaVisible=false;">Version
                        History</el-button>
                    <el-button class="margin-left0 downloadButton" type="primary" size="mini" plain @click="downloadData"><i
                            class="el-icon-download"></i>Download</el-button>
                </el-tab-pane>
            </el-tabs>
        </section>
        <section v-show="editSchemaVisible">
            <el-button @click="saveSchema" class="pull-right" type="primary" size="mini" plain>{{$t('m.save')}}</el-button>
            <div class="cl h5"></div>
            <div class="json" id="json" style="width:100%;height:320px;background:#fff;overflow: scroll;margin-top:10px;">
            </div>
        </section>
        <section v-show="versionHistoryVisible">
            <el-table :data="versionDataList" v-loading="listLoading" style="width:31%;margin-top:10px;">
                <el-table-column label="version">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showSchemaMessage(scope.row)">{{scope.row.version}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title='schema' :visible='schemaMessage' width='50%' :model-append-to-body='false' @close='closeDialog'>
                <!-- <textarea name="" id="" cols="50" rows="20" v-model="schemaMessageData"></textarea> -->
                <div class="json" style="width:100%;height:320px;background:#fff;overflow: scroll;margin-top:10px;">
                </div>
            </el-dialog>
        </section>
    </div>
</template>
<script>
    import $ from 'jquery'
    import api from '@/api/topic'
    import "@/styles/paas_style_element.css"
    export default{
        components: {

        },
        data() {
            return {
                activeTab: "first-ta",
                editSchemaVisible: true,
                versionHistoryVisible: false,
                topicName: "",
                schemaData: "",
                versionList: [],
                versionDataList: [],
                listLoading: false,
                schemaMessage: false,
                schemaMessageData: "",
                url: "",
            }
        },
        props: ['detailData'],
        watch: {
            detailData(val) {
                this.editSchemaVisible=true;
                this.topicName = val.topicName;
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                let subject = this.topicName + "-value"
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        if (res.data.reply.result.data.hasOwnProperty("schema")) {
                            this.schemaData = res.data.reply.result.data.schema;
                            let schemaMessage = JSON.stringify(JSON.parse(this.schemaData), null, ' ');
                            $(".json").html('<pre>' + schemaMessage + '</pre>')
                        }
                    } else {
                        this.schemaData = ' '
                        $(".json").html(' ')
                    }
                });
            }
        },
        mounted() {
            this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'));
            this.getSchemaData();
        },
        methods: {
            handleTab(tab, event) {
                this.activeTab = tab.name;
                this.getSchemaData();
            },
            getSchemaData() {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                let subject = ""
                if (this.activeTab == "first-ta") {
                    subject = this.topicName + "-value"
                } else {
                    subject = this.topicName + "-key"
                }
                let element = document.getElementById("json");
                element.contentEditable = true;
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}/versions`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        this.versionList = res.data.reply.result.data;
                        this.versionDataList = [];
                        for (let i = 0; i < this.versionList.length; i++) {
                            let obj = {}
                            obj.version = this.versionList[i];
                            this.versionDataList.push(obj)
                        }
                    } else {
                        this.versionList = [];
                        this.versionDataList = [];
                    }
                });
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        if (res.data.reply.result.data.hasOwnProperty("schema")) {
                            this.schemaData = res.data.reply.result.data.schema;
                            let schemaMessage = JSON.stringify(JSON.parse(this.schemaData), null, ' ');
                            $(".json").html('<pre>' + schemaMessage + '</pre>')
                        }
                    } else {
                        this.schemaData = ' '
                        $(".json").html(' ')
                    }
                });

            },
            saveSchema() {
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                let requestType = "post";
                let subject = ""
                if (this.activeTab == "first-ta") {
                    subject = this.topicName + "-value"
                } else {
                    subject = this.topicName + "-key"
                }
                this.schemaData = $(".json").text();
                let schemaMessage = JSON.stringify(JSON.parse(this.schemaData), null, ' ');
                schemaMessage = schemaMessage.replace(/\s/g, '%20');
                schemaMessage = escape(schemaMessage)
                schemaMessage = schemaMessage.replace(/25/g, '')
                let uri = `/schemaregistry/subjects/${subject}/versions?schemaStr=${schemaMessage}`;
                //console.log(uri)
                api.kafkaPackFunction(uri, requestType, selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        this.$message.success(this.$i18n.t('m.tipSaveSuccess'))
                    } else {
                        this.$message.success(this.$i18n.t('m.tipSaveFailed'))
                    }
                }).then(() => {
                    api.kafkaPackFunction(`/schemaregistry/subjects/${subject}/versions`, "get", selectCluster).then(res => {
                        if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                            this.versionList = res.data.reply.result.data;
                            this.versionDataList = [];
                            for (let i = 0; i < this.versionList.length; i++) {
                                let obj = {}
                                obj.version = this.versionList[i];
                                this.versionDataList.push(obj)
                            }
                            //console.log(this.versionDataList, "this.versionDataList")
                        } else {
                            this.versionList = [];
                            this.versionDataList = [];
                        }
                    })
                })
            },
            showSchemaMessage(row) {
                this.schemaMessage = true;
                this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
                let selectCluster = this.clusterId;
                let subject = ""
                if (this.activeTab == "first-ta") {
                    subject = this.topicName + "-value"
                } else {
                    subject = this.topicName + "-key"
                }
                api.kafkaPackFunction(`/schemaregistry/subjects/${subject}/versions/${row.version}`, "get", selectCluster).then(res => {
                    if (res.data.reply.result.data.developerMessage == undefined && res.data.reply.result.status === 200) {
                        this.schemaMessageData = res.data.reply.result.data.schema;
                        let schemaMessage = JSON.stringify(JSON.parse(this.schemaMessageData), null, ' ');
                        $(".json").html('<pre>' + schemaMessage + '</pre>')
                    } else {
                        $(".json").html(' ')
                    }

                })
            },
            closeDialog() {
                this.schemaMessage = false;
            },
            refreshData(){
                if (this.activeTab == "first-ta"){
                    this.editSchemaVisible=true;
                    this.versionHistoryVisible=false;
                    this.getSchemaData();
                }else{
                    this.editSchemaVisible=false;
                    this.versionHistoryVisible=true;
                    this.getSchemaData();
                }
            },
            goBack: function () {
                this.$emit('showTopicManage', { topic: true, detail: false })
            },
            //下载
            funDownload(content, filename) {
                let eleLink = document.createElement('a');
                eleLink.download = filename;
                eleLink.style.display = 'none';
                var blob = new Blob([content]);
                eleLink.href = URL.createObjectURL(blob);
                document.body.appendChild(eleLink);
                eleLink.click();
                document.body.removeChild(eleLink);
            },
            downloadData() {
                let eleText = document.getElementsByClassName("json");
                let eleButton = document.getElementsByClassName("downloadButton");
                if ('download' in document.createElement('a')) {
                    if(this.activeTab == "first-ta"){
                        this.funDownload($(".json").text(), `${this.topicName}`+'-value.avsc');
                    }else{
                        this.funDownload($(".json").text(), `${this.topicName}`+'-key.avsc');
                    }
                } else {
                    alert(this.$i18n.t('m.tipBrowser'))
                }
            }
        }
    }
</script>
<style>
    .cl {
        clear: both;
    }

    .h5 {
        height: 1px;
    }
</style>