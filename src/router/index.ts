import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
