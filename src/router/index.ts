import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import('../views/Home/index.vue'),
    children: []
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
