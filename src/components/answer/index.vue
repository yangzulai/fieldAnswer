<template>
    <div id="answerindex">
        <!-- <button @click="aaa">重置</button> -->
        <!-- <spinner v-if="loading"></spinner> -->
        <div class="indexcontainer">
            <div class="indexhead">
            </div>
            <div class="indexbody">
                <ul class="answernum clearfix">
                    <li v-for="(value,idx) in examList" :class="{'opened': value.opened}" :key="idx" :dataid="value.examId" @click="clickItem(idx)">{{value.examName}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import './base.css';
    import Vue from 'vue';
    import http from '../../utils/httpclient.js';
    import utils from '../../services/utils';
    import dataServ from '../../services/data.serv';
    // import spinner from '../spinner/spinner';
    export default {
        data(){
            return {
                examList:[],
                loading: false,
                currentIndex: -1
            }
        },
        components: {
            // spinner
        },
        mounted(){
            this.getList();
        },
        activated() {
            if(!this.examList || !this.examList.length) {
                this.getList();
            }
        },
        methods:{
            // aaa(){
            //     http.post('host/resetTheState',{'examId':'3'}).then((res)=>{
                    
            //     })
            // },
            getList() {
                let loading = this.$loading({
                    text: '拼命加载中...',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                http.post('host/getExamList',{}, null).then((res)=>{
                    console.log(res)
                    if(res.status==200){
                        this.examList=res.data.result.examList;
                    }else{
                        this.$message({
                            message: "请求出错",
                            type: "warning",
                            showClose: true,
                        })
                    }
                })
                .catch(err=> {
                    console.log(err.response,"err")
                    if(err.response.status == 403){
                        // this.$message({
                        //     message: "您无权操作",
                        //     type: "warning",
                        //     showClose: true,
                        // })
                        return ;
                    }
                    this.$message({
                        message: "请求出错:" + err.response.data.message,
                        type: "warning",
                        showClose: true,
                    })
                })
                .finally(() => {
                    loading.close();
                })
            },
            clickItem(idx) {
                if(idx < 0) return;
                this.currentIndex = idx;
                var value = this.examList[this.currentIndex];
                var opened = value.opened || false;
                if(opened) {
                    return this.tocount();
                }
                this.trigger();
                // this.$confirm('是否开启题目?', '提示')
                //     .then(res=> {
                //         this.trigger();
                //     })
                //     .catch(err=> {
                //         console.log("cancel")
                //     })
            },
            tocount(){
                if(this.currentIndex < 0) return;
                var value = this.examList[this.currentIndex];
                this.$set(this.examList, this.currentIndex, {
                    ...value,
                    opened: true
                })
                this.$router.push({path:'count',query:{pageNum:value.examId}});
            },
            trigger() {
                if(this.currentIndex < 0) return;
                // let loading = this.$loading({
                //     text: '开启中，请稍后...',
                //     background: 'rgba(0, 0, 0, 0.5)'
                // });
                var value = this.examList[this.currentIndex];
                this.tocount();
                // http.post('host/triggerExam',{'examId':value.examId}, null)
                //     .then((res)=>{
                //         if(res.status==200){
                //             setTimeout(() => {
                //                 this.tocount();
                //             }, 0);
                //         }else{
                //             // alert('请求出错')
                //             this.$message({
                //                 message: "请求出错",
                //                 type: "warning",
                //                 showClose: true,
                //             })
                //         }
                //     })
                //     .catch(err=> {
                //         // console.log(err.response,"err")
                //         if(err.response.status == 403){
                //             // this.$message({
                //             //     message: "您无权操作",
                //             //     type: "warning",
                //             //     showClose: true,
                //             // })
                //             return ;
                //         }
                //         this.$message({
                //             message: "请求出错:" + err.response.data.message,
                //             type: "warning",
                //             showClose: true,
                //         })
                //     })
                //     .finally(() => {
                //         loading.close();
                //     })

            }
        }
    }
</script>

<style scoped lang="less">
    #answerindex{
        height:100%;
        width:100%;
        background:url('../../assets/pcbg.png');
        background-size: cover;
        background-position:center;
        .indexcontainer{
            width:1200px;
            // height:800px;
            opacity:0.73;
            margin:0 auto;
            padding-top:24px;
            .indexhead{
                width:568px;
                height: 269px;
                margin-left:299px;
                background:url('../../assets/pc1.png')
            }
            .indexbody{
                // height:507px;
                padding-top:58px;
                padding-left:152.5px;
                .answernum li{
                    cursor: pointer;
                    width:276px;
                    height:152px;
                    float:left;
                    background:url('../../assets/pc4.png');
                    text-align:center;
                    line-height:152px;
                    font-size:30px;
                    font-family:MicrosoftYaHei-Bold;
                    font-weight:bold;
                    color:rgba(255,255,255,1);
                    margin-left:16.5px;

                    &.opened {
                        opacity: .4;
                    }
                }
            }
        }
    }
</style>