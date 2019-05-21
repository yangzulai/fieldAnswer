<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive&&isLogin" :key="$route.path" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive&&isLogin"/>
  </div>
</template>
<script>
  import clientServ from "./services/client.serv"
  export default {
    data() {
      return {
        isLogin: false,
      }
    },
    created() {
      // 和飞信环境打开
      if(/feixin|fetion/i.test(navigator.userAgent.toLowerCase())) {
        window.rcsOptimizeReady = () => {
          if(this.isLogin) return;
          clientServ.getEnterpriseContact(info => {
            let loginUserInfo = info[0];
            window.userInfo = loginUserInfo;
            this.isLogin = true
          })
        }
      } else {
        // 其他，直接登入
        this.isLogin = true;
        window.userInfo = {
          // name:"seekei",
          // phone:"19802021230"
        }
      }
    }
  }
</script>
