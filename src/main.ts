import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import store from './store/index';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

window.document.documentElement.style.fontSize = "100px";

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
