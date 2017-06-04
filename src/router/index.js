import Vue from 'vue'
import Router from 'vue-router'
import Index from "@/components/index"
import Register from "@/components/register"
import Login from "@/components/login"
import reviseData from "@/components/revise-data"
import myTrends from "@/components/my-trends"
import myFirends from "@/components/my-firends"

Vue.use(Router)

export default new Router({
  mode:'history',     //必须的加上这个不然路由不起作用
  routes: [
    {
      path: "/",
      name: "Index",
      component: Index
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/revise-data",
      name: "reviseData",
      component: reviseData
    },
    {
      path: "/my-trends",
      name: "myTrends",
      component: myTrends
    },
    {
      path: "/my-firends",
      name: "myFirends",
      component: myFirends
    }
  ]
})
