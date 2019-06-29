import Vue from 'vue'
import Router from 'vue-router'
// import login from '@/components/Login.vue'
//import register from '@/components/Register.vue'
import NotFound from '@/views/NotFound.vue'
import VueCookies from 'vue-cookie'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/kafka/clusterSelect'
    },
    {
      path: '/NotFound',
      component: NotFound,
      name: 'NotFound',
      meta: {
        title: '404',
        keepAlive: false
      },
    },
    {
      path: '/login',
      component: resolve => require(['@/components/Login.vue'], resolve)
    },
    {
      path: '/kafka',
      component: resolve => require(['@/components/kafka/side.vue'], resolve), children: [
      {
        path: "clusterSelect",
        component: resolve => require(['@/components/kafka/clusterSelect.vue'], resolve),children:[
        {
          path: "/",
          component: resolve => require(['@/components/kafka/kafkaDetail/kafkaDashboard.vue'], resolve)
        },
        {
          path: "kafkaDashboard",//1.kafka项目->1.1kafka总览
          component: resolve => require(['@/components/kafka/kafkaDetail/kafkaDashboard.vue'], resolve)
        },
        {
          path: "taskCountDetail",//1.kafka项目->1.1kafka总览迁移任务详情
          component: resolve => require(['@/components/kafka/kafkaDetail/taskCountDetail.vue'], resolve)
        },
        {
          path: 'topicManage',//1.2topic管理
          component: resolve => require(['@/components/kafka/kafkaDetail/topic/topicManage.vue'], resolve)
        },
        {
          path: 'brokerManage',//1.3broker管理
          component: resolve => require(['@/components/kafka/kafkaDetail/broker/brokerManage.vue'], resolve)
        },
        {
          path: 'customerGroup',//1.4consumer管理
          component: resolve => require(['@/components/kafka/kafkaDetail/consumer/consumerGroup.vue'], resolve)
        },
        {
          path: 'membersDetail',//1.4consumer管理
          component: resolve => require(['@/components/kafka/kafkaDetail/consumer/membersDetail.vue'], resolve)
        },
        {
          path: 'zookeeperDashboard',//2.zookeeper项目->2.1zookeeper总览
          component: resolve => require(['@/components/kafka/zookeeper/zookeeperDashboard.vue'], resolve)
        },
        {
          path: 'zkConfig',//2.2zookeeper配置
          component: resolve => require(['@/components/kafka/zookeeper/zkConfig.vue'], resolve)
        },
      ]
      },
      {
        path: 'clusterManager',//多集群管理
        component: resolve => require(['@/components/kafka/cluster/cluster.vue'], resolve),
        children: [
          {
            path:'/',
            redirect: 'manage'
          },
          {
            path: 'manage',
            component: resolve => require(['@/components/kafka/cluster/clusterManage.vue'], resolve),
          },
          {
            path: 'service',
            component: resolve => require(['@/components/kafka/cluster/microService.vue'], resolve),
          },
          {
            path: 'version',
            component: resolve => require(['@/components/kafka/cluster/microVersion.vue'], resolve),
          }
        ]
      }
    ]
    },
  ]
})
// 面包屑新增
let routeList = []
router.beforeEach((to, from, next) => {
  let index = -1
  for (let i = 0; i < routeList.length; i++) {
    const element = routeList[i];
    if (element.name == to.name) {
      index = i;
      break
    }
  }
  if (index !== -1) {
    routeList.splice(index + 1, routeList.length - index - 1)
  } else {
    let title = to.meta.title
    let name = to.name
    let path = to.path
    if (name == 'ComputedProperty' || name == 'SeverIp' || name == 'DcManage' || name == 'VcManage' || name == 'ResourceApplication' || name == 'ProcessManage' || name == 'main') routeList = []
    routeList.push({name, title, path})
  }
  to.meta.routeList = routeList
  next()
})
export default router
