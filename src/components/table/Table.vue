<template>
  <div class="container">
    <div v-for="item in listData" :key="item">
    <div class="header">
      <span>{{item.date}}</span> <span>{{item.method}}</span>
    </div>
    <div class="footer">
      {{item.info}}
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        listData: [
          {date:'2020-8-12 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
          {date:'2020-8-14 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
          {date:'2020-8-12 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
          {date:'2020-8-03 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
          {date:'2020-8-15 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
          {date:'2020-8-14 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
          {date:'2020-8-16 14:00:50',method:'手动',info:'张三将状态规划中修改成了实现中'},
        ],
      }
    },
    methods: {
    },
  }
</script>

<style lang="less">
.container{
  .header{
    font-size: 16px;
    color:gray;
    margin-bottom: 10px;
    span:nth-child(2)
  }
  .footer{
    margin-top: 30px;
  }
}
</style>
