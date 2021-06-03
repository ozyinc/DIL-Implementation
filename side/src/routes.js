import QuestionPage from './pages/QuestionPage'
import Dashboard from './pages/Dashboard'
import TestPage from './pages/TestPage'
import ResultPage from './pages/ResultPage'
import FinalPage from './pages/FinalPage'
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
    {
      path:'/questions', component: Dashboard,
      children:[
        {
          path:'/questions/:index', 
          component: QuestionPage
        },
        {
          path:'/final', 
          component: FinalPage
        }
      ]
    },
    {
      path:'/', 
      component: TestPage
    },
    {
      path:'/result', 
      component: ResultPage
    }
    // {
    //   path:'/questions/:index', 
    //   component: QuestionPage
    // }
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

export default router 