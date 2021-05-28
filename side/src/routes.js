import QuestionPage from './pages/QuestionPage'
import VueRouter from 'vue-router'
const routes = [
    {path:'/questions/:index', component: QuestionPage}
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

export default router 