<template>
    <div class="container">
        <spinner v-if="showLoading"></spinner>
        <toast ref="$toast"></toast>
        <!-- 非答题状态 -->
        <div class="home-page" v-if="!ontime"> 
            <div class="refresh-button" @click="refresh()">刷新</div>
            <div class="home-page-container">
                <div class="home-page-title2" v-if="hasFinished">答案已提交<br>请等待主持人公布答案</div>
                <div class="home-page-title" v-else>现在不是答题时间</div>
                <div class="home-page-content" :class="{'not-show':hasFinished}"> 
                    <p>请在会议现场宣布答题时</p>
                    <p>进入该页面答题</p>
               </div>
            </div>
            
        </div> 
        <!-- 答题页面 -->
        <div class="question-page" v-if="ontime">
            <div class="countdown">{{remainTime}}</div>
            <div class="question" v-if="result&&result.questions">{{result.questions[0].content}} </div>
            <div class="answer" v-if="result&&result.questions">
                <div class="option" :class="{'hasClicked':isActive === item.choiceId}" v-for="(item,index) in result.questions[0].choices" :key="index" @click="submitAnwser(item.choiceId)">{{item.option}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import dataServ from '../../services/data.serv.js'
    import utils from "../../services/utils";
    import moment from "moment";
    import spinner from '../spinner/spinner';
    import toast from "../toast";
    export default {
        data() {
            return {
                isActive:100,//选项index
                ontime: true, //是否已经开启
                hasFinished: false, //是否已经答题
                now:null,
                timer: null,
                result: {},
                showLoading: false
            }
        },
        components: {
            spinner,
            toast
        },
        computed: {
            remainTime() {
                if(!this.result.endTime) return "";
                return utils.countdown((moment(this.result.endTime)), this.now);
            },
            // overdue() {
            //     return this.now > this.result.endTime
            // }
        },
        mounted() {
            this.showLoading = true;
            this.getQuestion();
        },
        methods:{
           //获取题目
            getQuestion(){
                dataServ.getQuestionList().then(res=>{
                    if(res.resStatus.resCode == 0) {
                       //成功返回题目
                        this.ontime = true;
                        this.result = res.result;
                        // 倒计时
                        this.startCountDown();

                    }else if(res.resStatus.resCode == -1) {
                       //不在答题时间内
                    //    this.ontime = false;
                    //    this.hasFinished = false
                       this.showNotTime();
                     this.$refs.$toast.showToast("现在不是答题时间")
                    }else if(res.resStatus.resCode == -2) {
                        //答题者已答此题
                        // this.ontime = false;
                        // this.hasFinished = true;
                        this.showAnswered();
                        this.$refs.$toast.showToast("答案已提交，请等待主持人公布答案")
                    }else {
                        this.ontime = false;
                        this.$refs.$toast.showToast("获取失败，请再次刷新")
                    }
                })
                .catch(err=> {
                    // this.ontime = false;
                    this.$refs.$toast.showToast("获取失败，请再次刷新")
                })
                .finally(()=>{
                    this.showLoading = false;
                })
            },
            // 回答题目
            submitAnwser(answerId) {
                if(this.overdue) {
                    // return this.$refs.$toast.showToast("答题已结束");
                    return;
                }
                this.isActive = answerId 
                this.$confirm('确定提交答案吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass:"smallScreen"
                }).then(() => {
                    var obj = {
                        examId: this.result.examId,
                        answers: [{
                            questionId: this.result.questions[0].questionId,
                            answer: answerId
                        }],
                        answerResult : 0
                    };
                    this.showLoading = true;
                    dataServ.answerQuestion(obj)
                        .then(res=> {   
                            if(res.resStatus && res.resStatus.resCode == 0) {
                                this.$refs.$toast.showToast("提交成功")
                                this.finishCountDown();
                                // this.finishQuestion();
                                setTimeout(() => {
                                    this.showAnswered();
                                }, 500);
                            } else if(res.resStatus.resCode == -1) {
                                //不在答题时间内
                               this.$refs.$toast.showToast("不在答题时间内")
                               setTimeout(() => {
                                   this.showNotTime();
                               }, 500);
                            }else if(res.resStatus.resCode == -2) {
                                //答题者已答此题
                                this.$refs.$toast.showToast("答案已提交，请等待主持人公布答案")
                                setTimeout(() => {
                                    this.showAnswered();
                                }, 500);
                            }else {
                                this.$refs.$toast.showToast("提交失败，请重新提交")
                            }
                        })  
                        .catch(err=>{
                            this.$refs.$toast.showToast("提交失败，请重新提交")
                        })
                        .finally(()=>{
                            this.showLoading = false;
                        })
                }).catch(() => {
                    console.log("已取消")         
                });
                // var a=confirm("确定提交答案吗？")
                // if(a==true){
                     
                // }else{
                    
                // }
               
            },
            startCountDown() {
                if(!this.result.endTime) return;
                this.now = moment(this.result.currentTime)
                // this.setNow();
                console.log(this.result.currentTime, this.result.endTime, "endtime")
                if(this.now > this.result.endTime) {
                    console.log("if")
                    this.finishCountDown();
                    // this.finishQuestion();
                    this.$refs.$toast.showToast("答题已结束")
                    setTimeout(() => {
                        this.showNotTime();
                    }, 500);
                    return;
                }
                this.timer = setInterval(() => {
                    // console.log("setinterval")
                    this.setNow();
                    if(this.now > this.result.endTime) {
                        this.finishCountDown();
                        // this.finishQuestion();
                        this.$refs.$toast.showToast("答题已结束")
                        setTimeout(() => {
                            this.showNotTime();
                        }, 500);
                    }
                    thi
                    
                }, 1000)

            },
            finishCountDown() {
                if(this.timer) {
                    clearInterval(this.timer);
                }  
            },
            setNow() {
                this.now = moment(this.now).add(1,'seconds')
                
            }, 
            // 回答题目后
            // finishQuestion() {
            //     setTimeout(() => {
            //         // this.getQuestion();
            //         this.ontime = false;
            //         this.hasFinished = true;
            //     }, 1000);
            // },  
            showAnswered() {
                this.ontime = false;
                this.hasFinished = true;
            },
            showNotTime() {
                this.ontime = false;
                this.hasFinished = false;
            },
            //点击刷新按钮
            refresh(){
                this.getQuestion();

            }
        },
       
    }
</script>

<style scoped lang="less">
 html,body,div,p,span{
            margin:0;
            padding:0;
        } 
html,body{
    height: 100%;
}
.container{
    .home-page{
        position:fixed;
        top: 0;
        left: 0;
        width:100%;
        height:100%;
        background-image: url("../../assets/noQuestion.png");
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-background-size: cover;
        .refresh-button{
            position: fixed;
            top: 0.48rem;
            left: 6rem;
            width:1.08rem;
            height:0.48rem;
            background:rgba(24,38,161,1);
            border:0.03rem solid rgba(57,79,244,1);
            border-radius:0.24rem;
            font-size:0.26rem;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(146,156,235,1);
            line-height:0.48rem;
            text-align: center;
            vertical-align: middle;
        }
        .home-page-container{
            width: 100%;
             position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            bottom: 4.1%;
                .home-page-title{
                width:3.5rem;
                height:1.16rem;
                background:rgba(57,79,244,1);
                background: url("../../assets/answerBox.png") no-repeat;
                background-size:100% 100%;  
                margin: 0 auto;
                margin-bottom: 0.1rem;
                font-size:0.30rem;
                font-family:PingFang-SC-Regular;
                font-weight:bold;
                color:rgba(157,159,249,1);
                line-height:1.16rem;
                text-align: center;

            }
              .home-page-title2{
                width:4rem;
                height:2rem;
                background:rgba(57,79,244,1);
                background: url("../../assets/answerBox.png") no-repeat;
                background-size:100% 100%;  
                padding-top: 0.5rem;
                margin: 0 auto;
                margin-bottom: 0.1rem;
                font-size:0.30rem;
                font-family:PingFang-SC-Regular;
                font-weight:bold;
                color:rgba(157,159,249,1);
                // line-height:1rem;
                text-align: center;

            }
            .home-page-content{
                display: -webkit-flex; 
                display: flex;
                width:100%;
                height:4rem;
                background: url("../../assets/questionBox.png") no-repeat;
                background-size:100% 100%;  
                font-size:0.5rem;
                font-family:PingFang-SC-Regular;
                font-weight:bold;
                color:rgba(157,159,249,1);
                text-align: center;
                vertical-align: middle;
                flex-direction: column;
                justify-content:center; 
                
                &.not-show {
                    visibility: hidden;
                }
            }
        }
      
    }
    .question-page{
        position:fixed;
        top: 0;
        left: 0;
        width:100%;
        height:100%;
        background-image: url("../../assets/question-bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-background-size: cover;

        .countdown {
            position: absolute;
            top: .4rem;
            right: .3rem;
            text-align: right;
            color: #fff;
            font-size: .34rem;
        }
        .question{
                font-size:0.32rem;
                font-family:PingFang-SC-Medium;
                font-weight:bold;
                color:rgba(255,255,255,1);
                line-height:0.48rem;
                background: url("../../assets/questionBox.png") no-repeat;
                background-size:100% 100%;  
                padding: 1.26rem 0.82rem 1rem 0.63rem;
                margin-top: 1.11rem;
        }
        .answer{
            font-size:0.36rem;
            font-family:PingFang-SC-Regular;
            font-weight:bold;
            color:rgba(255,255,255,1);
            line-height:0.72rem;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap ;
            padding: 1.32rem 0 0 0.12rem;

            .option{
                 width: 2.8rem;
                 height: 1.16rem;
                 background: url("../../assets/answerBox.png") no-repeat;
                 background-size:100% 100%;  
                 padding-left: 0.35rem;
                 line-height: 1.16rem;
                 margin:0  0.5rem 0.72rem 0;
                 font-size: .32rem;
                
                 
            }
            .hasClicked{
                 width: 2.8rem;
                 height: 1.16rem;
                 background: url("../../assets/hasClickedBox.png") no-repeat;
                 background-size:100% 100%;  
                 padding-left: 0.35rem;
                 line-height: 1.16rem;
                 margin:0  0.5rem 0.72rem 0;
                 font-size: .32rem;
            }
        }
        
    }
}


</style>