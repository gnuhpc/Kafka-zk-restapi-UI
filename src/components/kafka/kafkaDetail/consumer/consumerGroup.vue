<template>
  <section>
    <section class="paas_block">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTab">
        <el-tab-pane label="NEW" name="tab-one">
          <!--工具条-->
          <section v-show="consumerGroupVisibleNew" class="detailList">
            <el-col :span="4" :offset="20" style="padding-bottom: 6px;">
              <el-input size="mini" v-model="search1" :placeholder="$t('m.tipSearch')" prefix-icon="el-icon-search">
              </el-input>
            </el-col>
            <!--列表-->
            <section>
              <el-table v-loading="listLoadingNew" :data="consumerNew.slice((page-1)*pageSize,page*pageSize)">
                <el-table-column :label="$t('m.consumerName')" prop="groupId" show-overflow-tooltip sortable min-width="30%"></el-table-column>
                <el-table-column label="state" prop="state" min-width="10%"></el-table-column>
                <el-table-column label="coordinator" prop="coordinator.id" min-width="10%">
                </el-table-column>
                <el-table-column label="members" min-width="10%">
                  <template slot-scope="scope">
                    <div>
                      <router-link tag='a' :to="{path:'/kafka/clusterSelect/membersDetail',query:{data:scope.row.groupId}}">
                        {{scope.row.membersNum}}
                      </router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('m.partitionNum')" prop="num" min-width="15%">
                </el-table-column>
                <el-table-column :label="$t('m.operate')" min-width="15%">
                  <template slot-scope="scope">
                    <el-dropdown size="mini">
                      <el-button size="mini" type="primary">{{$t('m.moreOperations')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item type="text" @click.native="detailOpenNew(scope.row)">{{$t('m.detail')}}</el-dropdown-item>
                        <el-dropdown-item type="text" v-if="scope.row.state ==='EMPTY'" @click.native="deleteConsumerNew(scope.row)">{{$t('m.delete')}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <pagination v-if="pageshow" :total="total" :pageSize="pageSize" @pageChange="pageChange"></pagination>
              </el-row>
            </section>
          </section>
          <section v-loading="detailListLoadingNew" v-show="detailOpenVisible">
            <ConsumerDetailList :consumerDetails='consumerDetails' :query='query' :dataNew='dataNew' :dataOld='dataOld'
              :activeName='activeName' v-on:refreshDetail="detailOpenNew" @showConsumerGroup="showConsumerGroup"></ConsumerDetailList>
          </section>
        </el-tab-pane>
        <el-tab-pane label="OLD" name="tab-two">
          <!--工具条-->
          <section v-show="consumerGroupVisibleOld" class="detailList">
            <el-col :span="4" :offset="20" style="padding-bottom: 6px;">
              <el-input size="mini" :placeholder="$t('m.tipSearch')" prefix-icon="el-icon-search" v-model="search2">
              </el-input>
            </el-col>
            <!--列表-->
            <section>
              <el-table v-loading="listLoadingOld" :data="consumerOld.slice((pageOld-1)*pageSizeOld,pageOld*pageSizeOld)">
                <el-table-column :label="$t('m.consumerName')" prop="consumerName" sortable min-width="50%"></el-table-column>
                <el-table-column :label="$t('m.operate')" min-width="30%">
                  <template slot-scope="scope">
                    <el-dropdown size="mini">
                      <el-button size="mini" type="primary">{{$t('m.moreOperations')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item type="text" @click.native="detailOpenOld(scope.row)">{{$t('m.detail')}}</el-dropdown-item>
                        <el-dropdown-item type="text" @click.native="deleteConsumerOld(scope.row)">{{$t('m.delete')}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <pagination v-if="pageshow" :total="totalOld" :pageSize="pageSizeOld" @pageChange="pageChangeOld"></pagination>
              </el-row>
            </section>
          </section>
          <section v-loading="detailListLoadingOld" v-show="detailOpenVisible">
            <ConsumerDetailList :consumerDetails='consumerDetails' :query='query' :dataNew='dataNew' :dataOld='dataOld'
              :activeName='activeName' v-on:refreshDetail="detailOpenOld" @showConsumerGroup="showConsumerGroup"></ConsumerDetailList>
          </section>
        </el-tab-pane>
      </el-tabs>
    </section>
  </section>
</template>
<script>
  import "@/styles/kafka.css";
  import "@/styles/paas_style_element.css"
  import api from '@/api/topic'
  import ConsumerDetailList from '@/components/kafka/kafkaDetail/consumer/consumerDetailList'
  import pagination from "@/components/resourceApplication/page";
  export default {
    props: ['clusterSelect'],
    components: {
      ConsumerDetailList, pagination
    },
    data() {
      return {
        filters: {
          consumerName: ''
        },
        filtersOld: {
          consumerName: ''
        },
        total: 0,
        pageSize: 10,
        page: 1,
        totalOld: 0,
        pageSizeOld: 10,
        pageOld: 1,
        consumerListNew: [],
        consumerListOld: [],
        consumerDetails: [],
        listLoadingNew: false,
        listLoadingOld: false,
        detailListLoadingNew: false,
        detailListLoadingOld: false,
        pageshow: true,
        consumerGroupVisibleNew: true,
        consumerGroupVisibleOld: true,
        detailOpenVisible: false,
        query: {
          consumergroup: '',
          type: '',
          topic: ''
        },
        activeName: 'tab-one',
        dataNew: {},
        dataOld: {},
        clusterId: '',
        search1: '',
        search2: ''
      }
    },
    created() {
      this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      this.getConsumerListNew()
      this.getConsumerListOld()
    },
    computed: {
      consumerNew() {
        const search1 = this.search1;
        if (search1) {
          this.page = 1;
          return this.consumerListNew.filter(function (data1) {
            return Object.keys(data1).some(function (key) {
              return String(data1[key]).indexOf(search1) > -1
            })
          })
        }
        return this.consumerListNew;
      },
      consumerOld() {
        const search2 = this.search2;
        if (search2) {
          this.pageOld = 1;
          return this.consumerListOld.filter(function (data1) {
            return Object.keys(data1).some(function (key) {
              return String(data1[key]).indexOf(search2) > -1
            })
          })
        }
        return this.consumerListOld;
      }
    },
    watch: {
      clusterSelect(newData, oldData) {
        // if(newData!=oldData){
        this.getConsumerListNew();
        this.getConsumerListOld();
        this.page = 1;
        this.pageOld = 1;
        // } 
      },
      consumerNew(data) {
        this.total = data.length;
      },
      consumerOld(data) {
        this.totalOld = data.length;
      }
    },
    methods: {
      handleTab(tab, event) {
        this.activeName = tab.name;
        if (this.activeName == 'tab-one') {
          this.page = 1;
          this.consumerGroupVisibleNew = true;
          this.detailOpenVisible = false;
        } else {
          this.pageOld = 1;
          this.consumerGroupVisibleOld = true;
          this.detailOpenVisible = false;
        }
      },
      //分页
      pageChange(val) {
        this.page = val.page;
        this.pageSize = val.limit;
      },
      pageChangeOld(val) {
        this.pageOld = val.page;
        this.pageSizeOld = val.limit;
      },
      // resetConsumer() {
      //   this.page = 1;
      //   this.pageSize = 10;
      //   this.pageOld = 1;
      //   this.pageSizeOld = 10;
      //   this.pageshow = false;
      //   this.getConsumerListNew()
      //   this.getConsumerListOld()
      //   this.$nextTick(() => {
      //     this.pageshow = true;
      //   })
      // },
      getConsumerListNew() {
        this.listLoadingNew = true
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        //console.log(selectCluster)
        api.kafkaPackFunction("/kafka/consumergroups/meta", "get", selectCluster).then((res) => {
          this.listLoadingNew = false;
          if (res.data.reply.result.connectionRefused !== undefined) {
            this.$message.error(this.$i18n.t('m.tipConnect'))
            return;
          }
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          let groupList = res.data.reply.result.data
          groupList.forEach((item, index) => {
            item.type = "NEW"
            item.coordinatorId = item.coordinator.id
            item.membersNum = item.members.length;
            item.num = 0;
            let numArr = []
            item.members.forEach(item1 => {
              numArr.push(item1.assignment.length);
            })
            numArr.forEach(item2 => {
              item.num += item2
            })
          })
          // let consumers = groupList.filter(consumers => {
          //   if (this.filters.consumerName && consumers.groupId.indexOf(this.filters.consumerName) === -1) return false
          //   return true
          // })
          this.total = groupList.length
          this.consumerListNew = groupList
          //.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))            
        })
      },
      getConsumerListOld() {
        this.listLoadingOld = true
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction(`/kafka/consumergroups?type=OLD`, "get", selectCluster).then((res) => {
          this.listLoadingOld = false
          if (res.data.reply.result.connectionRefused !== undefined) {
            this.$message.error(this.$i18n.t('m.tipConnect'))
            return;
          }
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          let datasOld = [];
          for (let j = 0; j < res.data.reply.result.data.old.length; j++) {
            let json1 = {}
            json1.consumerName = res.data.reply.result.data.old[j]
            json1.type = 'old'
            datasOld.push(json1)
          }
          // let consumers = datasOld.filter(consumers => {
          //   if (this.filtersOld.consumerName && consumers.consumerName.indexOf(this.filtersOld.consumerName) === -1) return false
          //   return true
          // })
          this.totalOld = datasOld.length
          this.consumerListOld = datasOld
          //.filter((u, index) => index < this.pageSizeOld * this.pageOld && index >= this.pageSizeOld * (this.pageOld - 1))
        })
      },
      deleteConsumerNew: function (row) {
        let consumerName = row.groupId
        let type = row.type
        this.$confirm(this.$i18n.t('m.deleteConfirm'), this.$i18n.t('m.tip'), {
          type: 'warning'
        }).then(() => {
          this.listLoadingNew = true
          let originalUri = "/kafka/consumergroup/{consumergroup}/{type}"
          this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
          let selectCluster = this.clusterId
          api.kafkaPackFunction(`/kafka/consumergroup/${consumerName}/${type}`, "delete", originalUri, selectCluster).then((res) => {
            if (res.data.reply.result.data.developerMessage !== undefined) {
              this.$message.error(res.data.reply.result.data.developerMessage)
              return
            }
            this.listLoadingNew = false
            this.$message({
              message: this.$i18n.t('m.tipDeleteSuccess'),
              type: 'success'
            })
            this.getConsumerListNew()
          })
        })
      },
      deleteConsumerOld: function (row) {
        let consumerName = row.consumerName
        let type = row.type
        this.$confirm(this.$i18n.t('m.deleteConfirm'), this.$i18n.t('m.tip'), {
          type: 'warning'
        }).then(() => {
          this.listLoadingOld = true
          let originalUri = "/kafka/consumergroup/{consumergroup}/{type}"
          this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
          let selectCluster = this.clusterId
          api.kafkaPackFunction(`/kafka/consumergroup/${consumerName}/${type}`, "delete", originalUri, selectCluster).then((res) => {
            if (res.data.reply.result.data.developerMessage !== undefined) {
              this.$message.error(res.data.reply.result.data.developerMessage)
              return
            }
            this.listLoadingOld = false
            this.$message({
              message:this.$i18n.t('m.tipDeleteSuccess'),
              type: 'success'
            })
            this.getConsumerListOld()
          })
        })
      },
      //详情页面
      detailOpenNew(row) {
        this.consumerGroupVisibleNew = false;
        this.detailOpenVisible = true;
        this.query.consumergroup = row.groupId;
        this.query.type = row.type.toUpperCase();
        this.detailListLoadingNew = true;
        this.dataNew = row;
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction(`/kafka/consumergroups/${this.query.consumergroup}/${this.query.type}/topic`, "get", selectCluster).then(res => {
          this.detailListLoadingNew = false;
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          this.consumerDetails = res.data.reply.result.data;
        })
      },
      detailOpenOld(row) {
        this.consumerGroupVisibleOld = false;
        this.detailOpenVisible = true;
        this.query.consumergroup = row.consumerName;
        this.query.type = row.type.toUpperCase();
        this.detailListLoadingOld = true;
        this.dataOld = row;
        this.clusterId = JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
        let selectCluster = this.clusterId
        api.kafkaPackFunction(`/kafka/consumergroups/${this.query.consumergroup}/${this.query.type}/topic`, "get", selectCluster).then(res => {
          this.detailListLoadingOld = false;
          if (res.data.reply.result.data.developerMessage !== undefined) {
            this.$message.error(res.data.reply.result.data.developerMessage)
            return;
          }
          this.consumerDetails = res.data.reply.result.data;
        })
      },
      //显示主页面
      showConsumerGroup(data) {
        this.detailOpenVisible = data.detail;
        this.consumerGroupVisibleNew = data.consumerNew;
        this.consumerGroupVisibleOld = data.consumerOld;
      },
    }
  }
</script>
<style>
  .detailList {
    width: 99%;
  }

  .searchRight {
    font-size: 14px;
    margin: 10px 15px 10px 0;
    position: relative;
    left: 65%;
  }

  .searchRight .el-input {
    width: 35%;
  }

  .el-pagination {
    margin-top: 8px;
  }
</style>