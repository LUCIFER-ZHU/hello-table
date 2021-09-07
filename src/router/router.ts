import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入子组件
import appScreenShot from '../components/app-screen-shot/app-screen-shot.vue'
import leaderLineList from '../components/leader-line-list/leader-line-list.vue'

// 在模块化工程中 Vue.use()
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: 'table', component: appScreenShot },
  ],
})
export default router
