import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import QuestionView from './components/question';
import AnswerView from './components/answer/index';
import CountView from './components/answer/count';
import LoginView from "./components/login";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      redirect: '/question'
    },
    {
      path: '/question',
      name: 'question',
      meta: {
        title: "现场答题",
        keepAlive: false
      },
      component: QuestionView
    },{
      path: '/answer',
      name: 'answer',
      meta: {
        title: "答案",
        keepAlive: false,
        // keepAlive: true,
        // needPermission: true
      },
      component: AnswerView
    }, {
      path: '/count',
      name: 'count',
      meta: {
        title: "答案",
        keepAlive: false,
        // needPermission: true
      },
      component: CountView
    }, {
      path: "/login",
      name: "login",
      meta: {
        title: "登录"
      },
      component: LoginView
    }
  ]
})


router.beforeEach((to,from,next) => {
  if(to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = "答题"
  }
  // if (to.meta && to.meta.needPermission) {
  //   if (window.hasPermission) {
  //     return next()
  //   }
  //   return next('/login');
  // }
  next();
})

export default router;
