<template>
  <div>
    <div class="side">
      <div :class="isCollapse?'leftMin left':'leftmax left'">
        <Side :type="type" :url="url" @sizeChange="sizeHandle"></Side>
      </div>
      <div :class="isCollapse?'rightMax right paas_content':'rightMin right paas_content'">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style scoped src="@/styles/side.css"></style>
<script>
  import '@/styles/paas_style_element.css'
  import Side from '@/views/side.vue'
  export default {
    components: {
      Side,
    },
    data() {
      return {
        type: "kafka",
        url: "/kafkaRes/paas-kafka/rbac/checkOauth.json",
        isCollapse: false,
      }
    },
    methods: {
      sizeHandle(item) {
        this.isCollapse = item;
      }
    }
  }
</script>