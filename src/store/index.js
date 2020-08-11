import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableData: [
      {
        date: '2016-05-02',
        name: '王小1',
        address: '上海市普陀区金沙江路 1518 弄',
      },
      {
        date: '2016-05-04',
        name: '王小2',
        address: '上海市普陀区金沙江路 1517 弄',
      },
      {
        date: '2016-05-01',
        name: '王小3',
        address: '上海市普陀区金沙江路 1519 弄',
      },
      {
        date: '2016-05-03',
        name: '王小4',
        address: '上海市普陀区金沙江路 1516 弄',
      },
    ],
  },
  mutations: {
    changeTableData(state, payload) {
      // console.log(state, payload)
      let id = payload.index
      let data = state.tableData[id]

      // console.log(data, payload.form)
      // 覆盖
      data.date = payload.form.date
    },
  },
  actions: {},
  modules: {},
})
