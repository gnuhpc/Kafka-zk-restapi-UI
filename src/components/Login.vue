<template>
<div>
<form>
用户名：<input v-model="name" placeholder="请输入用户名"></br>
密码：<input  v-model="password" placeholder="请输入密码"></br>
<button @click="login">登录</button>
</form>
<button @click="info">获取用户信息</button>
<button @click="loginout">退出登录</button>
<button @click="data1"> data</button>>

<div>
<a href="http://197.32.17.49:8080/tesla-demo-manager-web">第三方登录</a>
</div>
</div>
</template>
<script>
import axios from 'axios'
export default{
 data(){
     return {
         name:'develop',
         password:'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
        
     }
 },
  methods:{
    data1(){
        var url=`con/paas-container-app/core/test.json`;
        axios.post(url,{
         testBean: {
                    apiVersion:"12",
                    metadata: {
                        name:"liyk",
                        labels:{
                            a:1,
                            sdb:"good",
                            ping:"pong"
                        }
                        }
                }
        }).then((res)=>{
             console.log(res)
        }).then(err=>{console.log(err)})
    },
      login(){
          var url=`geteway/tesla-demo-manager-app/rbac/login.json?loginName=${this.name}&password=${this.password}`;
           axios.get(url).then((res)=>{console.log(res);
           this.$router.push('/register')
           }).catch((err)=>{console.log(err)})
       
      },
      info(){
          var url="geteway/tesla-demo-manager-app/rbac/queryUserList.json";
          axios.get(url).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)})
      },
       loginout(){
          var url="geteway/tesla-demo-manager-app/rbac/logout.json";
          axios.get(url).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)})
      }
  }
 
}
</script>