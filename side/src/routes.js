import QuestionPage from './pages/QuestionPage'
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
    {
      
      path:'/questions/:index',
      component: QuestionPage,
      children:[
        {
          path:'questions/0',
          component:() => import('./components/Handwriting')
        },

        {
          path:'questions/1',
          component:() => import('./components/MultipleChoice')
        }
      ]
     
    }
     // path:'/questions/:index', component: QuestionPage}
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

export default router 