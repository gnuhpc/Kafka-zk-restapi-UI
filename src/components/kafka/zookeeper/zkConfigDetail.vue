<template>
  <section>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" size="small" @click="dialogVisible = true">添加配置项</el-button>
            <el-button type="primary" size="small"  @click="submitConfigFn()">提交数据</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
              <el-button size="small" type="primary" @click="returnFn">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    <template>
      <p style="color:red;font-size:12px;line-height:20px;margin:0;" v-show="warning">输入框不能为空</p>
      <div v-for="(item,index) in data" class="config-item">
        <span>{{item.key}}</span>
        <div>
          <el-input v-model="item.value"></el-input>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteFn(index,item)" circle plain></el-button>
        </div>
      </div>
    </template>
    <el-dialog
      title="添加副本"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <div>属性名：
          <el-input v-model="addConfigData.key"></el-input>
        </div>
        <div>属性值：
          <el-input v-model="addConfigData.value"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfigFn">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import configDetail from '@/kafkaJs/zookeeper/zkConfigDetail'
  export default configDetail
</script>
<style scoped>
  .config-item {
    width: 45%;
    float: left;
    margin-left: 4%;
    margin-bottom: 15px;
  }

  .config-item .el-input {
    display: inline-block;
    width: calc((100% - 50px));
  }
</style>
