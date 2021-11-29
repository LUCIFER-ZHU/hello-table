import Vue from 'vue';
import App from '@/App.vue';
import store from './store';
import router from './router/router';
import { AppComponents } from '@/app-register';
Vue.use(AppComponents);
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
