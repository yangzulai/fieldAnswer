<template>
    <div class="toast-wrap" v-if="show">
        <span class="toast-msg">{{msg}}</span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: '',
            show: false,
            time: '',
        }
    },
    // props: ["toastMsg"],
    watch: {
        // toastMsg: function (value) {
        //     this.show = true;
        //     this.msg = value.text || "";
        //     this.time = value.time || 1600
        // },
        time: function (val) {
            var self = this
            if (val) {
                setTimeout (function () {
                    self.show = false
                    self.time = ''
                }, val)
            }
        }

    },
    methods:{
        showToast(options) {
            var msg = ""
            var _option = options;
            if(typeof options == "string") {
                msg = options;
                _option = {
                    message: msg
                }
            }
            this.show = true;
            this.msg = _option.message;
            this.time = _option.time || 2000;
        },
        closeToast() {
            this.show = false;
            this.time = '';
        }
    }
    
}
</script>

<style lang="less" scoped>
 .toast-wrap{
      opacity: 1;
      position: fixed;
      z-index: 9999;
      bottom: 50%;
      width: 100%;
      left: 0%;
      text-align: center;
      .toast-msg{
        background: rgba(0,0,0,0.5);
        color: #FFFFFF;
        padding: .2rem .94rem;
        border-radius: .1rem;
        font-size: .3rem;
      }
   }
   
 
</style>


