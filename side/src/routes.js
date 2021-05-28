import Component1 from './components/Component1'
import VueRouter from 'vue-router'
const routes = [
    {path:'/foo', component:Component1},
    {path:'/foo/:id', component:Component1}
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

export default router 