import MultipleChoice from './components/MultipleChoice'
import QuestionPage from './pages/QuestionPage'
import VueRouter from 'vue-router'
const routes = [
    {path:'/questions', component: QuestionPage},
    {path:'/foo/:id', component:MultipleChoice, props:true}
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

export default router 