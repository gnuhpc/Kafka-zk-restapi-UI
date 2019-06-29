<template>
    <div class="sideLeft">
        <div class="iscollapse" @click="setcollapse">
            <div class="iconBox">
                <i class="iconfont icon-shousuo-1" v-if="isCollapse"></i>
                <i class="iconfont icon-shousuo-2" v-else></i>
            </div>
        </div>
        <div class="asideTitle">
            <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
                router unique-opened>
                <template v-for="(child1,index) in roles">
                    <el-submenu v-if="child1.children[0]" :key="index" background-color="#eee" :index="'/'+type+'/'+index">
                        <template slot="title">
                            <i :class="child1.icon"></i>
                            <span>{{child1.menuName}}</span>
                        </template>
                        <el-menu-item-group style="background-color:f8f8f8;">
                            <el-menu-item v-for="(child2,index) in child1.children" :index="'/'+type+'/'+child2.action"
                                :key="index" style="padding-left:44px;border:0;font-size:12px;height:30px;line-height:30px;">{{child2.menuName}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item v-else :key="index" :index="'/'+type+'/'+child1.action">
                        <i :class="child1.icon"></i>
                        <span slot="title">{{child1.menuName}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import '@/assets/iconfont/iconfont.css'
    import '@/assets/iconfont1/iconfont.css'
    import '@/assets/iconfont2/iconfont.css'
    import '@/assets/iconfont5/iconfont.css'
    import '@/assets/font-kafka/iconfont.css'
    import '@/assets/font6/iconfont.css'
    import '@/assets/iconfont-all/iconfont.css'
    export default {
        props: {
            url: String,
            type: String,
        },
        created() {
            var that = this
            /*$.ajax({
                type: 'get',
                url: that.url,
                async: false,
                success: function (res) {*/
            let res={
              "reply": {
                "userInfo": {
                  "ERRORMSG": "成功",
                  "SEX": "M",
                  "CMBCOANAME": "",
                  "TELEPHONENUMBER": "",
                  "STATUS": "A",
                  "MAIL": "",
                  "ERRORCODE": "",
                  "USERTYPE": "",
                  "USERSN": "",
                  "SN": "",
                  "BIRTHDAY": "",
                  "MOBILE": ""
                },
                "returnCode": {
                  "type": "S",
                  "code": "AAAAAA",
                  "domain": null
                },
                "isAuthorized": true,
                "role": [
                  "R0000000000000000001"
                ],
                "funcPerm": [
                  "kafkaBrokerStartOrStop",
                  "kafkaPack",
                  "zkHost",
                  "zkStartOrStop",
                  "zkStat",
                  "uploadFileMeta",
                  "saveTopic",
                  "saveMicroJvm",
                  "saveTopicMonitor",
                  "saveMicroService",
                  "saveMicroCategory",
                  "saveMicroTar",
                  "saveKafkaCluster",
                  "compareConfig",
                  "updateTopic",
                  "updateTopicMonitor",
                  "updateZkConfig",
                  "updateMicroService",
                  "updateMicroCategory",
                  "updateMicroTar",
                  "updateBrokerConfig",
                  "updateKafkaCluster",
                  "updateBroCluConf",
                  "deleteTopicMonitorById",
                  "deleteMicroCategoryById",
                  "deleteKafkaClusterById",
                  "upgradeBroker",
                  "kafkaBrokerForceStop",
                  "recoverConfigFile",
                  "kafkaRecoverBroker",
                  "recoverZK",
                  "saveTopics",
                  "batchSaveTopicMonitor",
                  "stopMicroServiceByIds",
                  "batchDeleteTopicMonitor",
                  "kafkaBrokerBatchRev",
                  "zkBatchRev",
                  "startMicroServiceByIds",
                  "kafkaBrokerBatchForceStop",
                  "redeployJarByIds",
                  "batchUpdateRemoteConfigInfo",
                  "restartMicroServiceByIds",
                  "detectMicroServiceAddressNew",
                  "zkEnv",
                  "updateOnlyMicroJvm",
                  "updateSendMicroJvm",
                  "lookTopicMonitor",
                  "getKeyAndValMapById",
                  "findConfigType",
                  "updateRemoteConfigInfoNew",
                  "updateAllConfigInfoByIdNew",
                  "deleteMicroServiceById",
                  "deleteMicroTarById",
                  "getMicroCategoryById",
                  "redeployJarById",
                  "getMicroJvmById",
                  "getMicroServiceDtoById",
                  "getMicroTarById",
                  "getAllConfigInfoByIdNew",
                  "getKafkaClusterById",
                  "restartMicroServiceById",
                  "getTopicSize",
                  "findByCategoryId",
                  "getMicroJvmByMicroServiceId",
                  "findBackupByMicroServiceId",
                  "findMicroOperationRecordByMicroServiceId",
                  "deleteTopicByClusterIdAndName",
                  "deleteTopicByClusterIdAndNames",
                  "getTopicByClusterIdAndName",
                  "checkOutMicroService",
                  "findTopicQuota",
                  "zkGetController",
                  "findBackupDTO",
                  "findAllMicroCategory",
                  "getAllTopic",
                  "localAndServerBrokers",
                  "findAllMicroServiceDto",
                  "findAllMicroTar",
                  "findAllKafkaCluster",
                  "kafkaReadBrokerConfig",
                  "readZkConfig",
                  "readServerConfByKey",
                  "kafkaBrokerPollingRev",
                  "brokerPollingRev",
                  "stopMicroServiceById",
                  "startMicroServiceById"
                ],
                "user": {
                  "id": "",
                  "loggedIn": true,
                  "userId": "",
                  "employeeId": "",
                  "loginName": "",
                  "password": null,
                  "userName": "",
                  "orgId": "",
                  "telephone": "",
                  "mobile": null,
                  "userAddress": null,
                  "email": "",
                  "loginTime": null,
                  "logoutTime": null,
                  "status": null,
                  "createTime": null,
                  "updateTime": null,
                  "type": null,
                  "avatar": null,
                  "orgName": null
                },
                "menuTree": [
                  {
                    "menuId": "M0000000000000000002",
                    "menuName": "Kafka PaaS",
                    "parentMenuId": "Root",
                    "action": "clusterSelect/kafkaDashboard",
                    "tab": "",
                    "sort": "1",
                    "icon": "iconfont icon-baiduKafka",
                    "perms": null,
                    "children": []
                  },
                  /*{
                    "menuId": "M0000000000000000003",
                    "menuName": "Broker管理",
                    "parentMenuId": "Root",
                    "action": "clusterSelect/brokerManage",
                    "tab": "",
                    "sort": "2",
                    "icon": "iconfont icon-jingjiyewu",
                    "perms": null,
                    "children": []
                  },*/
                  {
                    "menuId": "M0000000000000000004",
                    "menuName": "Topic管理",
                    "parentMenuId": "Root",
                    "action": "clusterSelect/topicManage",
                    "tab": "",
                    "sort": "3",
                    "icon": "iconfont icon-topic1",
                    "perms": null,
                    "children": []
                  },
                  {
                    "menuId": "M0000000000000000005",
                    "menuName": "消费组管理",
                    "parentMenuId": "Root",
                    "action": "clusterSelect/customerGroup",
                    "tab": "",
                    "sort": "4",
                    "icon": "iconfont icon-consumers",
                    "perms": null,
                    "children": []
                  },
                 /* {
                    "menuId": "M0000000000000000006",
                    "menuName": "多集群管理",
                    "parentMenuId": "Root",
                    "action": "clusterManager",
                    "tab": "",
                    "sort": "5",
                    "icon": "iconfont icon-jiqunguanli",
                    "perms": null,
                    "children": []
                  },
                  {
                    "menuId": "M0000000000000000007",
                    "menuName": "Zookeeper",
                    "parentMenuId": "Root",
                    "action": "",
                    "tab": "",
                    "sort": "6",
                    "icon": "iconfont icon-zookeeper",
                    "perms": null,
                    "children": [
                      {
                        "menuId": "M0000000000000000008",
                        "menuName": "Zookeeper总览",
                        "parentMenuId": "M0000000000000000007",
                        "action": "clusterSelect/zookeeperDashboard",
                        "tab": "",
                        "sort": "7",
                        "icon": "",
                        "perms": null,
                        "children": []
                      },
                      {
                        "menuId": "M0000000000000000009",
                        "menuName": "Zookeeper管理",
                        "parentMenuId": "M0000000000000000007",
                        "action": "clusterSelect/zkConfig",
                        "tab": "",
                        "sort": "8",
                        "icon": "",
                        "perms": null,
                        "children": []
                      }
                    ]
                  }*/
                ]
              }
            }
                    if (res.reply.isAuthorized) {
                        that.roles = res.reply.menuTree;
                        if (that.type == 'redis') {
                            sessionStorage.setItem("btnPermissionsRedis", JSON.stringify(res.reply.funcPerm)) //按钮权限
                            sessionStorage.setItem("roleRedis", JSON.stringify(res.reply.role)) //按钮权限
                        } else if (that.type == 'side') {
                            that.$store.commit('SET_TOKEN4', res.reply.isAuthorized)
                            sessionStorage.setItem("ConbtnPermissions", JSON.stringify(res.reply.funcPerm)) //按钮权限
                            that.$store.commit('SET_TOKEN3', res.reply.user);
                        }
                    } else {
                        var redirectUrl = res.reply.redirectURL;
                        var authorizeUrl = res.reply.authorizeUrl;
                        var clientCode = res.reply.clientCode;
                        var oauthUrl = authorizeUrl + "?response_type=code&client_id=" + clientCode + "&redirect_uri=" + redirectUrl;
                        window.location.href = oauthUrl;
                    }
                /*},
                error: function (error) {
                    that.$message.error(`错误码：${error.status},错误信息：${error.statusText}`)
                    switch (error.status) {
                        case 404:
                            setTimeout(() => {
                                that.$router.push({ path: `/NotFound` })
                            }, 5000);
                    }
                }
            });*/
        },
        data() {
            return {
                roles: [],
                isCollapse: false,
            }
        },
        methods: {
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
            setcollapse() {
                this.isCollapse = !this.isCollapse;
                this.$nextTick(() => {
                    if (this.isCollapse) {
                        $(".el-aside").css("width", "40px")
                    } else {
                        $(".el-aside").css("width", "180px")
                    }
                })
                this.$emit("sizeChange", this.isCollapse)
            }
        }
    }
</script>
<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 180px;
        min-height: 400px;
    }

    .leftmax .iconBox {
        box-sizing: border-box;
        width: 16px;
        height: 32px;
        position: absolute;
        right: -12px;
        top: 45vh;
        margin-top: -16px;
        z-index: 999;
        -webkit-transform: rotateZ(-180deg);
        -ms-transform: rotate(-180deg);
        transform: rotateZ(-180deg);
    }

    .leftMin .iconBox {
        box-sizing: border-box;
        width: 16px;
        height: 32px;
        position: absolute;
        right: -12px;
        top: 45vh;
        margin-top: -16px;
        z-index: 999;
        -webkit-transform: rotateZ(-180deg);
        -ms-transform: rotate(-180deg);
        transform: rotateZ(-180deg);
    }

    .iscollapse i {
        font-size: 24px;
        color: #198def;
    }

    .asideTitle {
        overflow-x: hidden;
    }

    .asideTitle i {
        margin-right: 6px;
    }

    .asideTitle .el-submenu__icon-arrow {
        top: 60%;
    }

    .el-menu--vertical .el-menu--popup-right-start,
    .el-menu--vertical .el-menu-item {
        color: #fff;
        background-color: #198def !important;
    }
</style>
