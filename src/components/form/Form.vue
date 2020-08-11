<template>
  <div>
    <el-form
      :model="form"
      status-icon
      ref="form"
      label-width="100px"
      class="form"
    >
      <el-form-item label="日期" prop="date">
        <el-input v-model="form.date"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="editForm(form)">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: [],
      }
    },
    created() {
      this.loadInfo()
    },
    methods: {
      loadInfo() {
        let index = this.$route.params.id
        this.form = this.$store.state.tableData[index]
      },
      editForm(form) {
        let index = this.$route.params.id
        let payload = { index, form }
        // console.log(payload)
        this.$store.commit('changeTableData', payload)

        // 跳转
        this.$router.push({ name: 'table' })
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
