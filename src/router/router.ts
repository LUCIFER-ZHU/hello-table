import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入子组件
import Form from '../components/form/Form.vue'
import leaderLineList from '../components/leader-line-list/leader-line-list.vue'

// 在模块化工程中 Vue.use()
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: 'table', component: leaderLineList },
    { path: '/form/:id', name: 'form', component: Form },
  ],
})
export default router
