import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './routes.js';

import './style.css';

Vue.config.productionTip = false;

Vue.use(VueRouter);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
