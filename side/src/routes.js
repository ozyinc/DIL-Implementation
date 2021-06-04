import VueRouter from 'vue-router';
import Vue from 'vue';
import QuestionPage from './pages/QuestionPage';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import FinalPage from './pages/FinalPage';

Vue.use(VueRouter);

const routes = [
  {
    path: '/questions',
    component: Dashboard,
    children: [
      {
        path: '/questions/:index',
        component: QuestionPage,
      },
      {
        path: '/final',
        component: FinalPage,
      },
    ],
  },
  {
    path: '/',
    component: TestPage,
  },
  {
    path: '/result',
    component: ResultPage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
