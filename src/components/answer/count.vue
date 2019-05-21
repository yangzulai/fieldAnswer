<template>
    <div id="answercount" @click="hiddenlist" v-cloak>
        <div class="countcontainer">
            <div class="startCount" @click="trigger">开启题目</div>
            <div class="timing" v-if="this.second>=10">0{{min}}:{{second}}</div>
            <div class="timing" v-if="this.second<10">0{{min}}:0{{second}}</div>
            <div class="goback" @click="goback">返回</div>
            <div class="counthead">
                {{exam}}
            </div>
            <div class="countbody clearfix">
                <div v-for="(value,idx) in result" :key="idx">
                    <div class="count_a" v-if="idx==0||idx==1">
                        <div class="personnel_list">
                            <ul class="clearfix ul_first" v-if="value.choiceId==rightKey">
                                <li class="list_first" v-for="(val,index) in value.answerBy" :key="index" v-if="index==0">
                                    <div class="headimg">
                                        {{val.name.slice(val.name.length-2,val.name.length)}}
                                    </div>
                                    <div class="displayName">
                                        {{val.displayName}}
                                    </div>
                                </li>
                                <li class="list_li" v-for="(val,index) in value.answerBy" :key="index" v-if="index!=0">
                                    <div class="list_name">{{val.name.slice(val.name.length-2,val.name.length)}}</div>
                                    {{val.name}}
                                </li>
                            </ul>
                            <ul class="clearfix" v-if="value.choiceId!=rightKey">
                                <li class="list_li" v-for="(val,index) in value.answerBy" :key="index">
                                    <div class="list_name">{{val.name.slice(val.name.length-2,val.name.length)}}</div>
                                    {{val.name}}
                                </li>
                            </ul>
                        </div>
                        <div class="option" @click="showlist" :rightKey="value.choiceId">{{value.option}}</div>
                        <div v-if="value.count<=120" class="progress fl" :style="'width:'+value.count*3+'px'"></div>
                        <div v-if="value.count>120" class="progress fl" style='width:360px'></div>
                        <span class="progressnum fl">{{value.count}}人</span>
                    </div>
                    <div class="count_c count_a" v-if="idx==2||idx==3">
                        <div class="personnel_list">
                            <ul class="clearfix ul_first" v-if="value.choiceId==rightKey">
                                <li class="list_first" v-for="(val,index) in value.answerBy" :key="index" v-if="index==0">
                                    <div class="headimg">
                                        {{val.name.slice(val.name.length-2,val.name.length)}}
                                    </div>
                                    <div class="displayName">
                                        {{val.displayName}}
                                    </div>
                                </li>
                                <li class="list_li" v-for="(val,index) in value.answerBy" :key="index" v-if="index!=0">
                                    <div class="list_name">{{val.name.slice(val.name.length-2,val.name.length)}}</div>
                                    {{val.name}}
                                </li>
                            </ul>
                            <ul class="clearfix" v-if="value.choiceId!=rightKey">
                                <li class="list_li" v-for="(val,index) in value.answerBy" :key="index">
                                    <div class="list_name">{{val.name.slice(val.name.length-2,val.name.length)}}</div>
                                    {{val.name}}
                                </li>
                            </ul>
                        </div>
                        <div class="option" @click="showlist" :rightKey="value.choiceId">{{value.option}}</div>
                        <div v-if="value.count<=120" class="progress fl" :style="'width:'+value.count*3+'px'"></div>
                        <div v-if="value.count>120" class="progress fl" style='width:360px'></div>
                        <span class="progressnum fl">{{value.count}}人</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import './base.css';
    import Vue from 'vue';
    import http from '../../utils/httpclient.js';
    import utils from '../../services/utils';
    export default {
        data() {
            return {
                topicId:'',
                exam:'',
                result:'',
                rightKey:'',
                timerCount:'',
                setTime:'',
                requestList: [],
                cancel: null,
                min:0,
                second:0,
                resultTime:{},
                countDown:'',
            }
        },
        mounted(){
            this.topicId = this.$route.query.pageNum;
            this.getCount();
            this.getEndTime();
        },
        destroyed(){
            window.clearInterval(this.countDown);
            this.clearTimer();
            if(this.setTime) {
                clearTimeout(this.setTime);
            }
            if(this.requestList.length) {
                var len = this.requestList.length;
                var request = this.requestList[len - 1];
                this.cancelPrevRequest(request.token.__ob__.dep.id);
            }
        },
        methods:{
            trigger(){
                http.post('host/triggerExam',{'examId':this.topicId}, null)
                    .then((res)=>{
                        if(res.data.resStatus.resMsg=='试卷已被触发过'){
                            this.$message({
                                message: "试卷已被触发过",
                                type: "warning",
                                showClose: true,
                            });
                        }else if(res.data.resStatus.resMsg=='成功'){
                            this.$message({
                                message: "开启成功",
                                type: "success",
                                showClose: true,
                            })
                            this.getEndTime();
                        }
                    })
                    .catch(err=> {
                        // console.log(err.response,"err")
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
            },
            dateFormat(currentTime,endTime){
                var date = new Date();  
                date.setTime(endTime);  
                var nowdate = new Date();
                nowdate.setTime(currentTime);
                var miao = Math.floor((date.getTime() - nowdate.getTime())/1000);
                if(miao > 60){
                    this.min = parseInt(miao / 60);
                    this.second = parseInt(miao % 60);
                    this.getCountDown();
                }else{
                    this.min = 0;
                    this.second = miao;
                    this.getCountDown();
                }
            },
            getEndTime(){
                http.post('result/getEndTime',{'examId':this.topicId}).then((res)=>{
                    console.log(res)
                    if(res.status==200){
                        if(res.data.result.isTrigger==1){
                            this.dateFormat(res.data.result.currentTime,res.data.result.endTime);
                            var timing = document.getElementsByClassName('timing')[0];
                            var startCount = document.getElementsByClassName('startCount')[0];
                            startCount.style.display = 'none';
                            timing.style.display = 'block';
                        }
                    }else{
                        
                    }
                }).catch(err=> {
                    // this.$message({
                    //     message: err.response.data.message,
                    //     type: "warning",
                    //     showClose: true,
                    // })
                    return ;
                })
            },
            clearTimer() {
                if(this.timerCount) {
                    window.clearInterval(this.timerCount);
                }
            },
            getCountDown(){
                this.countDown = window.setInterval(()=>{
                    if(this.second==0&&this.min == 0){
                        window.clearInterval(this.countDown);
                    }
                    if(this.second<=0){
                        if(this.min>=1){
                            this.min=this.min-1;
                            this.second = 59;
                        }else{
                            this.min = 0;
                            this.second = 0;
                        }
                    }else{
                        this.second -= 1;
                    }
                },1000)
            },
            getCount(){
                this.clearTimer();
                let loadingInstance = this.$loading({
                    text: '拼命加载中...',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                this.timerCount = window.setInterval(()=>{
                    var source = http.CancelToken.source()
                    this.requestList.push(source);
                    // console.log("push", source.token.__ob__.dep.id, )
                    var h = http.post('result/getStatus',{'examId':this.topicId}, source.token)
                        .then((res)=>{
                            if(res.status==200){
                                this.exam = res.data.result.statistics.content;
                                this.rightKey = res.data.result.correntChoiceId;
                                this.result = res.data.result.statistics.answers;
                                console.log(this.result)
                                if(res.data.result.ended){
                                    this.clearTimer();
                                }
                                // 取消请求
                                this.cancelPrevRequest(res.config.cancelToken.__ob__.dep.id);
                            }else{
                                // alert('请求出错');
                                console.log('error')
                            }
                        })
                        .catch(err=> {
                            if (http.isCancel(err)) {
                                console.log('Request canceled', err.message);
                            } else {
                                // alert('请求出错')
                            }
                        })
                        .finally(()=>{
                            if(loadingInstance) {
                                loadingInstance.close();
                                loadingInstance = null;
                            }
                        })
                }, 1000);
            },
            cancelPrevRequest(id) {
                var index = this.findIndexById(id, this.requestList);
                if(index<0) return ;
                for(var i = 0; i < index; i++ ){
                    var request = this.requestList[i];
                    request.cancel("canceled");
                }
                this.requestList.splice(0, index + 1);
            },
            findIndexById(id, array) {
                var index = -1;
                for(var i = 0; i < array.length; i++) {
                    var s = array[i];
                    if(id == s.token.__ob__.dep.id) {
                        index = i;
                        break;
                    }
                }
                return index;
            },
            showlist(e){
                var personnellist = e.target.previousSibling;
                var progress = e.target.nextSibling;
                var progressnum = progress.nextSibling.nextSibling;
                var personnel_list = document.getElementsByClassName('personnel_list');
                for(var i = 0;i<personnel_list.length;i++){
                    if(personnel_list[i]==personnellist){
                        if(personnellist.style.display=='block'){
                            personnellist.style.display='none'
                        }else{
                            personnellist.style.display='block'
                        }
                    }else{
                        personnel_list[i].style.display='none'
                    }
                }
                if(this.rightKey==e.target.getAttribute("rightKey")){
                    progress.style.background = 'linear-gradient(90deg,rgba(254,225,126,1),rgba(219,172,10,1))';
                    progress.style.boxShadow = '0px 8px 29px 0px rgba(254,225,126,0.73);';
                    progressnum.style.color = '#DFB319';
                }   
            },
            goback(){
                // this.$router.push('answer');
                this.$router.back();
            },
            hiddenlist(e){
                if(e.target.className!='option'&&e.target.tagName!='UL'&&e.target.tagName!='LI'&&e.target.className!='list_name'){
                    var personnel_list = document.getElementsByClassName('personnel_list');
                    for(var i = 0;i<personnel_list.length;i++){
                        personnel_list[i].style.display='none';
                    }
                }
            },
        },
    }
</script>

<style scoped lang="less">
    #answercount{
        height:100%;
        width:100%;
        background:url('../../assets/pcbg.png');
        background-size: cover;
        background-position:center;
        .countcontainer{
            padding-top:12px;
            width:1200px;
            // height:800px;
            opacity:0.73;
            margin:0 auto;
            position:relative;
            .startCount{
                position:absolute;
                right:11px;
                top:18px;
                width:120px;
                height:40px;
                background:rgba(255,255,255,0.2);
                border-radius:20px;
                cursor: pointer;
                display: block;
                font-size:22px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height:40px;
                color:#fff;
                text-align: center;
                &:hover{
                    background:rgba(255,255,255,0.8);
                    color:#394FF4;
                }
            }
            .timing{
                font-size:30px;
                font-family:MicrosoftYaHei-Bold;
                font-weight:bold;
                color:rgba(215,220,255,1);
                position:absolute;
                right:30px;
                top:18px;
                display: none;
            }
            .goback{
                cursor: pointer;
                position: absolute;
                left:30px;
                top:18px;
                font-size:22px;
                font-size:22px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(215,220,255,1);
                background-image: url('../../assets/pcgoback.png');
                padding-left:30px;
                background-position:-9px 0px;
                background-repeat:no-repeat;
            }
            .counthead{
                width: 1099px;
                height:291px;
                background:url('../../assets/pc3.png');
                margin-left:46px;
                padding-left:72px;
                padding-top:106px;
                padding-right:87px;
                cursor: default;
                font-size:22px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                line-height:36px;
            }
            .countbody{
                padding-top:28px;
                .count_a{
                    float:left;
                    width: 600px;
                    padding-left:53px;
                    position:relative;
                    .personnel_list{
                        width:517px;
                        height:215px;
                        background-image: url('../../assets/pcdown.png');
                        background-position:center;
                        position:absolute;
                        z-index: 99;
                        left:74px;
                        top:148px;
                        display:none;
                        ul{
                            overflow: auto;
                            margin-top:5px;
                            padding-top:19px;
                            height:206px;
                            margin-right:14px;
                            padding-left:10px;
                            .list_li{
                                margin-top:0px;
                                width: 80px;
                                height:48px;
                                float: left;
                                background:url('../../assets/pchead1.png');
                                background-repeat: no-repeat;
                                background-position:9px -6px;
                                font-size:18px;
                                font-family:PingFang-SC-Regular;
                                font-weight:bold;
                                color:rgba(255,255,255,1);
                                text-align:center;
                                line-height:30px;
                                padding-top:10px;
                                margin-left:0px;
                                text-align:center;
                                &:nth-child(n+7){
                                    margin-top:46px;
                                }
                                .list_name{
                                    margin-bottom:12px;
                                }
                            }
                        }
                        .ul_first{
                            position:relative;
                            .list_first{
                                font-size:14px;
                                color:rgba(255,255,255,1);
                                text-align: center;
                                padding-top:102px;
                                .displayName{
                                    padding:0px 3px;
                                }
                                .headimg{
                                    font-size:18px;
                                    font-family:PingFang-SC-Regular;
                                    font-weight:400;
                                    color:rgba(255,255,255,1);
                                    line-height:48px;
                                    text-align:center;
                                    width: 48px;
                                    height:48px;
                                    position:absolute;
                                    left:34px;
                                    top:34px;
                                    background:url('../../assets/pchead1.png');
                                    background-repeat: no-repeat;
                                    background-position:-6px -6px;
                                }
                                position: absolute;
                                left:35px;
                                top:20px;
                                width: 116px;
                                height:168px;
                                display: inline-block;
                                background:url('../../assets/pcfirst.png');
                                background-position:-7px -7px;
                            }
                            .list_li{
                                &:nth-child(n+6){
                                    margin-top:46px;
                                }
                                &:nth-child(2){
                                    margin-left:160px;
                                }
                                &:nth-child(6){
                                    margin-left:160px;
                                }
                            }
                        }
                        ul::-webkit-scrollbar{
                            width: 8px;
                        }
                        ul::-webkit-scrollbar-track{
                            background-color:transparent;
                            -webkit-border-radius: 4px;
                            -moz-border-radius: 4px;
                            border-radius:4px;
                        }
                        ul::-webkit-scrollbar-thumb{
                            background-color:rgba(57,79,244,1);;
                            -webkit-border-radius: 4px;
                            -moz-border-radius: 4px;
                            border-radius:4px;
                        }
                    }
                    .option{
                        cursor: pointer;
                        width:316px;
                        height:112px;
                        padding-left:52px;
                        background:url('../../assets/pc2.png');
                        font-size:22px;
                        line-height:112px;
                        font-family: MicrosoftYaHei;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                    }
                    .progress{
                        margin-left:22px;
                        width:414px;
                        height:20px;
                        background:linear-gradient(90deg,rgba(32,211,167,1),rgba(10,182,219,1));
                        box-shadow:0px 8px 29px 0px rgba(32,211,167,0.73);
                        border-radius:10px;
                    }
                    .progressnum{
                        cursor:default;
                        font-size:20px;
                        font-family:PingFang-SC-Regular;
                        font-weight:bold;
                        color:rgba(32,211,167,1);
                        line-height:20px;
                        margin-left:18px;
                    }
                }
                .count_c{
                    margin-top:109px;
                    .personnel_list{
                        left:74px;
                        top:-118px;
                    }
                }
            }
        }
    }
</style>