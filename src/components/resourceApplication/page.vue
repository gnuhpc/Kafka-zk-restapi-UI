<template>
  <div class="pagination">
    <el-pagination
      small
      class="text-center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="pageSizes"
      :page-size="page.limit"
      layout="sizes, total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<style scoped>
.pagination{
    text-align: right;
    height: 33px;
}
.pagination .el-pagination{
    position: static;
  }

</style>


<script>
export default {
  props: {
    // 总条数
    total: {
      type: Number,
      default:0
    },
    //当前页
    currentPage: {
      type: Number,
      default:1
    },
    //每页条数
    pageSize:{
      type: Number,
      default:5
    }
  },
  data() {
    return {
      pageSizes: [5,10, 20, 50, 100],
      page: {
        page: this.currentPage,
        limit:this.pageSize
      }
    };
  },
  methods: {
    // 每页条数变更
    handleSizeChange(val) {
      this.page.limit = val;
      this.$emit("pageChange", this.page);
    }, // 当前页码变更
    handleCurrentChange(val) {
      this.page.page = val;
      this.$emit("pageChange", this.page);
    }
  }
};
</script>
