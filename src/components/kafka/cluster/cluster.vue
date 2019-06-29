<template>
  <div class="cluster paas_block">
    <el-tabs v-model="currentCluster" type="card" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in clusterTypeData" size="mini" :label="item.name" :name="item.link"
                   :key="item.link"></el-tab-pane>
    </el-tabs>
    <!--<keep-alive>-->
      <router-view></router-view>
    <!--</keep-alive>-->
  </div>
</template>

<script>
  export default {
    name: "cluster",
    data() {
      return {
        currentCluster: 'manage',
        clusterTypeData: [
          {name: '多集群管理', link: 'manage'},
          {name: '微服务管理', link: 'service'},
          {name: '微服务版本管理', link: 'version'},
        ]
      }
    },

    methods: {
      handleTabClick(tab) {
        let url = tab.name;
        this.$router.push(url);
      }
    }
  }
</script>

<style scoped>

</style>
