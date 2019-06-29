<template>
    <div class="breadcrumb_box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name:'main'}">iPaaS</el-breadcrumb-item>
            <el-breadcrumb-item :to="{name:type.name}" v-if="type.name !=='' ">{{type.title}}</el-breadcrumb-item>
            <!-- <el-breadcrumb-item :to="{name:type.name}" v-if="JSON.stringify(type) !== '{}'">{{type.title}}</el-breadcrumb-item> -->
            <!-- <el-breadcrumb-item :to="{name:type.name}" v-if="type !== undefined">{{type.title}}</el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="(item,index) in routeList" :key="item.index" :to="item.path">{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<style>
    .el-breadcrumb {
        width: 100%;
        margin-top: 0;
        padding-left: 20px;
        box-sizing: border-box;
        line-height: 20px;
    }

    .breadcrumb_box {
        width: 100%;
        background: #198def;
        padding: 5px 0;
    }

    .el-breadcrumb__inner a,
    .el-breadcrumb__inner.is-link {
        color: #fff !important;
        font-size: 14px;
        font-weight: 400;
    }
</style>
<script>
    export default {
        props: {
            type: Object,
        },
        data() {
            return {
                routeList: [],
            }
        },
        created() {
            this.routeList = this.$route.meta.routeList
        },
        watch: {
            $route: function (newVal, oldVal) {
                this.routeList = newVal.meta.routeList
            }
        },
    }
</script>