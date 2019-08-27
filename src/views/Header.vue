<template>
    <div id="topNav">
        <el-row>
            <el-col :span="8" style="padding-top: 15px;padding-left: 20px;">
                <!--<div class="headerimg">
                    <img src="../assets/headerImg/03.png" alt="">
                </div>-->
                <label style="font-size: 25px;">KAFKA</label>
            </el-col>
            <el-col :span="3" style="padding-right: 15px;padding-top: 20px;float: right;">
                <el-dropdown style="float: right;">
                    <span class="el-dropdown-link">
                        {{locale}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="changeLocale('zh')">中文</el-dropdown-item>
                        <el-dropdown-item @click.native="changeLocale('en')">English</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import '../assets/iconfont3/iconfont.css'
    import '../assets/iconfont4/iconfont.css'
    import axios from 'axios'
    import $ from 'jquery'
    export default {
        created() {

        },
        data() {
            return {
                activeName: 'main',
                menuTree: [],
                userName: '',
                route: '',
                locale:'中文'
            }
        },
        watch: {
            $route: function (newVal, oldVal) {
                if (newVal != oldVal && newVal.name == 'null') {
                    this.route = newVal.name;
                }
            }
        },
        created() {
            let url = "/paas/paas-app/rbac/checkOauth.json";
            // let url = "/ConCheck/paas-app/rbac/checkOauth.json";
            // 同步
            // this.login()
            /*axios.get(url, { header: { "Content-Type": "application/x-www-form-urencoded" }, withCredentials: true }).then((res) => {
                if (res.data.reply.isAuthorized) {
                    this.menuTree = res.data.reply.menuTree;
                    this.userName = res.data.reply.userInfo.SN;
                    sessionStorage.setItem("btnPermissions", JSON.stringify(res.data.reply.funcPerm)) //按钮权限
                    sessionStorage.setItem("userInfo", JSON.stringify(res.data.reply.userInfo)) //用户信息
                } else {
                    var redirectUrl = res.data.reply.redirectURL;
                    var authorizeUrl = res.data.reply.authorizeUrl;
                    var clientCode = res.data.reply.clientCode;
                    var oauthUrl = authorizeUrl + "?response_type=code&client_id=" + clientCode + "&redirect_uri=" + redirectUrl;
                    window.location.href = oauthUrl;
                }
            }).catch((err) => {
                $('.el-loading-mask').css({ "display": "none" })
                this.$message.error(`错误码：${err.response.status},错误信息：${err.response.data}`)
            })*/
        },
        methods: {
            // enter(){
            //     $('.logout').show(500);
            // },
            login() {
                var that = this
                $.ajax({
                    type: "get",
                    url: "/paas/paas-app/rbac/checkOauth.json",
                    header: { "Content-Type": "application/x-www-form-urencoded" },
                    xhrFields: { withCredentials: true },
                    async: false,
                    success: function (res) {
                        if (res.reply.isAuthorized) {
                            that.menuTree = res.reply.menuTree;
                            that.userName = res.reply.userInfo.SN;
                            sessionStorage.setItem("btnPermissions", JSON.stringify(res.reply.funcPerm)) //按钮权限
                            sessionStorage.setItem("userInfo", JSON.stringify(res.reply.userInfo)) //用户信息
                            sessionStorage.setItem("role", JSON.stringify(res.reply.role)) //用户Id
                        } else {
                            var redirectUrl = res.reply.redirectURL;
                            var authorizeUrl = res.reply.authorizeUrl;
                            var clientCode = res.reply.clientCode;
                            var oauthUrl = authorizeUrl + "?response_type=code&client_id=" + clientCode + "&redirect_uri=" + redirectUrl;
                            window.location.href = oauthUrl;
                        }
                    },
                });
            },
            logout() {
                let url = "/proxyRestful/proxy/rbac/oauthLogout.json";
                let url1 = "/redis_paas/redis/rbac/oauthLogout.json";
                let url2 = "/CheckContainer/container/rbac/oauthLogout.json";
                let url3 = "/paas/paas-app/rbac/oauthLogout.json";
                axios.get(url).then(res => {
                   // console.log(res);
                })
                axios.get(url1).then(res => {
                   // console.log(res);
                })
                // axios.get(url2).then(res => {
                //    // console.log(res);
                // })
                axios.get(url3).then(res => {
                    if (res.data.reply.returnCode.type === "S") {
                        console.log(`${ res.data.reply.redirectURL}`);
                        window.location.href=`${ res.data.reply.redirectURL}`
                    }
                })
                sessionStorage.clear();
            },
            changeLocale(locale){
                if(locale=='zh'){
                    this.locale="中文"
                }else{
                    this.locale="English"
                }
                this.$i18n.locale=locale
                console.info(this.$i18n.locale)
            }
        },
    }
</script>
import '@/assets/iconfont-all/iconfont.css';
<style rel="stylesheet/scss" lang="scss">
    #topNav {
        width:100%;
        background: url('../assets/headerImg/01.png') -32px no-repeat;
        background-color: #f8f8f8;
    }

    .headerimg {
        width: 30%;
        min-width: 360px;
        height: 66px;
        vertical-align: top;
        display: inline-block;
    }

    .headerimg>img {
        margin-top: 4%;
        padding-left: 20px
    }

    .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
        color: #198def !important;
        border-bottom: 0 !important;
    }

    #topNav .el-menu-item.is-active {
        color: #198def;
        background-color: #f8f8f8 !important
    }

    #topNav {
        height: 66px;
        z-index: 2000;
        width: 100%;
        top: 0;
    }

    #topNav .el-menu-demo.el-menu--horizontal.el-menu {
        padding-left: 50px;
        display: inline-block;
        width: 38%;
        font-size: 16px;
        height: 66px;
        min-width: 500px;
        background-color: #f8f8f8 !important;
    }

    #topNav .el-menu--horizontal>.el-menu-item,
    #topNav .el-menu--horizontal>.el-submenu {
        width: 20%;
    }

    img.headericon {
        width: 12px;
        height: 12px;
    }

    #topNav .el-menu--horizontal {
        border-bottom: 0;
    }

    #topNav .el-menu--horizontal>.el-menu-item {
        line-height: 62px;
        height: 100%;
    }

    #topNav .el-menu--horizontal>.el-submenu .el-submenu__title {
        height: 66px;
        line-height: 62px;
    }

    .item-bell {
        margin-right: 40px;
    }

    .header-icon.el-icon-arrow-down {
        margin-left: 4px;
    }

    a.color1 {
        text-decoration: none;
        color: white !important;
    }

    #topNav .el-menu--horizontal>.el-menu-item,
    #topNav .el-menu--horizontal>.el-menu-item.is-active {
        border: 0 !important;
        background-color: #f8f8f8
    }

    #topNav .el-menu-item:hover {
        background-color: #f8f8f8;
    }

    #topNav .el-submenu__title:hover {
        background-color: #f8f8f8;
    }

    #topNav .el-menu--horizontal .el-menu .el-menu-item.is-active,
    .el-menu--horizontal .el-menu .el-submenu.is-active>.el-submenu__title {
        color: #198def !important;
    }

    .el-menu--horizontal .el-menu .el-menu-item,
    .el-menu--horizontal .el-menu .el-submenu__title {
        background-color: #71befd !important;
        color: white !important;
    }

    .el-menu--horizontal .el-menu .el-menu-item:hover {
        background-color: #147aca !important;
    }

    #topNav>>>.el-menu--horizontal>ul.el-menu--popup {
        padding: 0px !important;
        background-color: #71befd !important;
    }

    .header-user {
        position: relative;
        height: 66px;
    }

    .header-name,
    .logout li {
        cursor: pointer;
    }

    .logout {
        display: none;
        position: absolute;
        top: 66px;
    }

    .header-user:hover .logout {
        display: block;
        transition: all 0.2s linear 0s;
        z-index: 1000;
    }

    .logout {
        display: none;
        position: absolute;
        top: 67px;
    }

    .logout ul {
        background-color: #71befd;
    }

    .logout li {
        float: none;
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        width: 50px;
        color: white;
        font-size: 14px;
        transition: border-color .3s, background-color .3s, color .3s
    }

    .logout li:hover {
        background-color: #147aca;
    }

    .userName {
        font-size: 14px;
        color: rgb(99, 99, 99);
    }

    .header-name .el-icon-arrow-down {
        color: #909399;
    }
</style>
