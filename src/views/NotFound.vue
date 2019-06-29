<template>
    <div class="bg">
        <div class="btn">
            <el-button type="primary" size="mini" plain @click="$router.go(-1)">返回上一页</el-button>
            <el-button type="primary" size="mini" @click="$router.push({path:'/main'})">回到首页</el-button>
        </div>
    </div>
</template>
<script>

</script>
<style scoped>
    .bg {
        text-align: center;
        background: url('../assets/mainImg/404_03.png') #fff no-repeat center;
    }
    .btn{
        position: absolute;
        bottom: 5vh;
        left: 42%;
    }

</style>