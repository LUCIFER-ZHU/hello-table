import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入子组件
import Form from '../components/form/Form.vue'
import Table from '../components/table/Table.vue'

// 在模块化工程中 Vue.use()
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: 'table', component: Table },
    { path: '/form/:id', name: 'form', component: Form },
  ],
})
export default router
