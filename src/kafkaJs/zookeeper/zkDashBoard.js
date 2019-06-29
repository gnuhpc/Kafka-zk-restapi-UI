import * as zkApi from '@/api/zookeeper'
const zkDashBoard = {
  data () {
    return {
      total: 0,
      pageSize: 10,
      page: 1,
      data: {},
      listLoading: false,
      pageShow: true,
      detailData: {},
      listData: [],
      envData: {},
      selectCluster:''
    }
  },
  created() {
    this.getZkStat()
  },
  methods: {
    handleCurrentChange: function (val) {
      this.page = val
      this.listData = this.detailData.clients.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))
    },
    goBack: function () {
      this.pageShow = true;
      this.page=1;
    },
    getZkStat() {
      this.listLoading = true;
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      let params={"selectCluster":this.selectCluster};
      zkApi.zkStat(params).then((res) => {
        this.listLoading = false
        this.data = res.data.reply.result.data
      })
    },
    showDetailInfo: function (key) {
      this.detailData = this.data[key]
      this.total = this.data[key].clients.length
      this.listData = this.detailData.clients.filter((u, index) => index < this.pageSize * this.page && index >= this.pageSize * (this.page - 1))
      this.pageShow = false
      this.getZkEnv(key)
    },
    getZkEnv: function (key) {
      this.selectCluster=JSON.parse(sessionStorage.getItem('kafkaclusterSelect'))
      let params={"selectCluster":this.selectCluster};
      zkApi.zkEnv(params).then((res) => {
        if (res.data.developerMessage === undefined) {
          // this.envData = res.data[key].attributes
          this.envData = res.data.reply.result.data[key].attributes
        } else {
          this.$message({
            message: res.data.developerMessage,
            type: 'error'
          })
        }
      })
    }
  }
}
export default zkDashBoard
