import request from './axiosUtils';

// 获取题目结果，传入题目id
function getAnswersByQuestionid(data) {
    return request({
        method: "post",
        data: data,
        url: ""
    });
}

// 回答题目，包括用户标识/题目id/答案
function answerQuestion(data) {
    data = data || {};
    data.mobile = window.userInfo.phone;
    data.name = window.userInfo.name;
    return request({
        method: "post",
        data: data,
        url: "/answer/submitAnswer"
    })
}

// 获取题目，判断是否已经回答过，/手机号，姓名
function getQuestionList() {
    var data = {
        name: window.userInfo.name,
        mobile: window.userInfo.phone
    }
    return request({
        method: "post",
        data: data,
        url: "/answer/getQuestions"
    })
}

function login(data) {
    return request({
        method: "post",
        data: data,
        url: "/login"
    })
}

// 大屏幕接口
function getQList() {
    return request({
        method: "post",
        url: "/host/getExamList",
        data: {}
    })
}

// 触发exam
function triggerExam(id) {
    return request({
        method: "post",
        url: "/host/triggerExam",
        data: {
            examId: id
        }
    })
}

function getAnswerStatus(id) {
    return request({
        method: "post",
        url: "/result/getStatus",
        data: {
            examId: id
        }
    })
}

    
export default {
    getAnswersByQuestionid,
    answerQuestion,
    getQuestionList,
    login,
    getQList,
    triggerExam,
    getAnswerStatus
}