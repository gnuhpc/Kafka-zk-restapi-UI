<template>
  <div id="app">
    <HeaderOne></HeaderOne>
    <breadcrumb :type="typeName"></breadcrumb>
    <router-view v-if="isRouterAlive" class="boxleft"></router-view>
  </div>
</template>

<script>
  import HeaderOne from './views/Header'
  import breadcrumb from "@/views/breadcrumb";

  export default {
    name: 'App',
    components: {
      HeaderOne,
      breadcrumb
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
        typeName: {
          name: '',
          title: ''
        }
      }
    },
    mounted() {
      this.$router.beforeEach((to, from, next) => {
        let type = {}
        if (to.path.includes('/redis')) {
          type.name = "redis"
          type.title = "Redis Paas"
        } else if (to.path.includes('/proxy')) {
          type.name = "pandect"
          type.title = "Proxy Paas"
        } else if (to.path.includes('/side')) {
          type.name = "side"
          type.title = "容器"
        } else if (to.path.includes('/kafka')) {
          type.name = "kafka"
          type.title = "kafka"
        } else if (to.path.includes('/batch')) {
          type.name = "batch"
          type.title = "批处理"
        } else if (to.path.includes('/middleware')) {
          type.name = "middleware"
          type.title = "中间件"
        }else {
          type.name = ""
          type.title = ""
        }
        this.typeName = type
        next()
      })
    },
    beforeDestroy() {
      this.typeName = {
        name: '',
        title: ''
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true;
        })
      }
    }
  }
</script>

<style>
  @import './styles/global.css';
  .boxleft {
    height: calc(100vh - 99px);
    overflow-y: auto;
  }
</style>