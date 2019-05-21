<template>
    <div class="page-container">
        <el-card shadow="always" class="login-box">
            <p>请输入用户名密码</p>
            <el-input
                v-model="username"
                @keyup.enter.native="submit"
                clearable>
            </el-input>
            <el-input
                v-model="password"
                type="password"
                @keyup.enter.native="submit"
                clearable>
            </el-input>
            <el-button size="" type="primary" @click="submit" style="margin-top:20px">确定</el-button>
        </el-card>
    </div>
</template>

<script>
    import utils from '../../services/utils';
    import dataServ from '../../services/data.serv';
    export default {
        data() {
            return {
                username: "",
                password: ""
            }
        },
        methods: {
            submit() {
                // console.log("submit")
                // var key = utils.MD5(this.key);
                var obj = {
                    adminName: this.username,
                    password: this.password
                }
                dataServ.login(obj)
                    .then(res=> {
                        if(res.resStatus && res.resStatus.resCode == 0) {
                            this.$message({
                                message: "登录成功",
                                type: "success",
                                showClose: true
                            })
                            utils.setStorage("access_token", res.result);
                            setTimeout(() => {
                                this.$router.replace("/answer");
                            }, 500);
                        } else {
                            this.$message({
                                message: res.resStatus.resMsg,
                                type: "warning",
                                showClose: true,
                            })
                        }
                    })
                    .catch(err=> {
                        // window.hasPermission = false;
                        this.$message({
                            message: "登录失败，请检查密钥是否正确",
                            type: "warning",
                            showClose: true,
                        })
                    })
            }
        }
    }
</script>
<style scoped lang="less">
    // @import '../answer/base.css';
    
    .page-container {
        width: 100%;
        height: 100%;
        background:url('../../assets/pcbg.png');
        background-size: cover;
        background-position:center;
        position: relative;
        padding-top: 30vh;
        .el-card {
            border: none;
            background-color: rgba(255,255,255,.2);
        }
    }
    .login-box {
        text-align: left;
        margin: 0 auto;
        max-width: 450px;
        line-height: 26px;
        p {
            font-size: .15rem;
            color: #fff;
        }
    }
</style>