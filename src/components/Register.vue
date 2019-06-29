<template>
<div v-html="content"></div>
</template>
<script>
export default{
data(){
//     return{
//         content:'<div id="login">
//     <form class="login_container" ts-type="tmpl"
//           onsubmit="$ts.submit('cmbc.main.login',{target:this})">
//         <div class="login_back">
//             <div class="login_panel">
//                 <div class="login_box">
//                     <h1>
//                         <span class="systemName"></span>
//                     </h1>
//                     <ul class="login_form">
//                         <li>
//                             <p>用户名：</p> <input type="text" id="userId" name="userId"
//                                                class="username" value="develop"/>
//                         </li>
//                         <li>
//                             <p>密码：</p>
//                         <li><input type="password" name="password" class="pass"
//                                    value="123456"></li>

//                         <li style="line-height: 60px;"><input type="submit" value="登录" class="login_sub"/></li>
//                         <li class="version"
//                             style="color: gray; font-weight: bold; line-height: 30px">${clientData.systemVersion}
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     </form>
//     <div class="main_footer" style="position: relative; top: 725px;text-align: center;">
//         <span class="system_time"></span>
//     </div>
// </div>
// <div id="frame" class="bt" style="display: none;">
//     <div id="frame_top_bar">
//         <span class="page_logo" style="color:rgb(65, 66, 68);">&nbsp;&nbsp;|&nbsp;<span class="systemName"
//                                                                                         style="color:rgb(65, 66, 68);"></span></span>
//         <ul class="top_tip">
//             <li id="user_info" style=""></li>
//             <li><a href="#" onclick="$ts.call('cmbc.main.logout')" style="color:black;"><img src="img/icon-tuichu.png">
//                 退出</a></li>
//             <li><a href="#" onclick="popAction('修改个人信息','cmbc.main.userInfoWin',{personId:userInfo.userId})"
//                    title="修改个人信息"><img src="img/icon-shezhi.png"></a>
//             </li>
//         </ul>
//     </div>
//     <div id="frame_side_container">
//         <div id="frame_side">
//             <div class="side-container">
//                 <div id="userBox">
//                 </div>
//                 <div id="sys-accordion"></div>
//             </div>
//             <div id="sideToggle">
//                 <img src="img/hideSideIcon.png"/>
//             </div>
//         </div>
//         <div id="tesla_logo_div"
//              style="display: block; height: 70px; width: 155px; border-right: 1px solid #BABABA; background: #EFF0F0; position: absolute; bottom: 20px; left: 0px;">
//             <img id="tesla_logo" src="img/tesla-logo.jpg"
//                  width="80px" height="50px"
//                  style="position: absolute; bottom: 0px; left: 30px;">
//         </div>
//     </div>
//     <div id="frame_right">
//         <div id="frame_top">
//             <div class="tabs" data-container="#frame_main">
//                 <ul>
//                 </ul>
//             </div>
//         </div>
//         <div id="frame_main"></div>
//     </div>
//     <div id="sys-footer" style="width: 100%;">
//         <div id="sysVersion"
//              style="display: inline-block; float: right; width: 100%; text-align: center;">
//         </div>

//     </div>
// </div>'
//     }
// }
}
}
</script>
