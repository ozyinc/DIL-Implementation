import MultipleChoice from './components/MultipleChoice'
import Component1 from './components/Component1'
import VueRouter from 'vue-router'
const routes = [
    {path:'/foo', component:Component1},
    {path:'/foo/:id', component:MultipleChoice, props:true}
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

export default router 