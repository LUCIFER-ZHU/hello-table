<template>
  <div class="time-slider-box" ref="box">
    <div class="time-slider" ref="container">
      <ElFeformSlider
        v-model="sliderValue"
        range
        :format-tooltip="formatTooltip"
        :max="days"
        :marks="monthMarks"
        :marks2="yearMarks"
        @change="handleChange">
      </ElFeformSlider>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop, Watch } from "vue-property-decorator";
import moment from "moment";
import ElFeformSlider from './slider/src/main.vue';
@Component({
  components: {
    ElFeformSlider,
  }
})
export default class TimeSlider extends Vue {

  
  /**
   * 开始时间 结束时间
   * 
   * @type {string}
   * @memberof TimeSlider
   */  
  public startDate:any

  /**
   * 结束时间
   * 
   * @type {string}
   * @memberof TimeSlider
   */  
  public endDate:any

  /**
   * 选择的开始时间
   * 
   * @type {string}
   * @memberof TimeSlider
   */    
  public chooseStartDate:any

  /**
   * 选择的结束时间 
   * 
   * @type {string}
   * @memberof TimeSlider
   */    
  public chooseEndDate:any

  /**
   * 选择的值区间 
   * 
   * @type {string}
   * @memberof TimeSlider
   */      
  public sliderValue = [0,50]

  /**
   * 开始时间结束时间之间的总天数 
   * 
   * @type {string}
   * @memberof TimeSlider
   */    
  public days:number = 0;

  /**
   * 月标记 
   * 
   * @type {string}
   * @memberof TimeSlider
   */    
  public monthMarks:any = {};

  /**
   * 年标记 
   * 
   * @type {string}
   * @memberof TimeSlider
   */ 
  public yearMarks:any = {};

  /**
   * 宽度系数 
   * 
   * @type {string}
   * @memberof TimeSlider
   */ 
  public widtRatio:number = 2;

  /**
   * 初始宽度 
   * 
   * @type {string}
   * @memberof TimeSlider
   */ 
  public initialWidth:number = 0

  created(){
    // 后台给数据
    this.startDate='2019-08';
    this.endDate='2021-03';
    this.handleRenderData();
  }

  mounted(){
    let box:any = this.$refs.box;
    let container:any = this.$refs.container;
    //绑定事件
    if (box && container) {
      this.initialWidth = container.offsetWidth;
      container.addEventListener('mousewheel', (ev:any) => {
        const _this = this;
        let width = container.offsetWidth;
        let down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
        down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
        if (down) {
            // console.log('鼠标滚轮向下---------',width,this.initialWidth)
            if (width > this.initialWidth ) {
              container.style.width = width / _this.widtRatio + 'px'; 
            } else{
              container.style.width = _this.initialWidth + 'px';
              box.style.overflowY = 'inherit';
            }
        } else {
            // console.log('鼠标滚轮向上++++++++++')
            box.style.overflowY = 'scroll';
            container.style.width = width * _this.widtRatio + 'px';
        }
        if (ev.preventDefault) {/*FF 和 Chrome*/
            ev.preventDefault();// 阻止默认事件
        }      
      });
    }
  }

  /**
   * 处理绘制数据 
   * 
   * @type {string}
   * @memberof TimeSlider
   */   
  public handleRenderData(){
    // 计算总天数
    // console.log('diffDaysLabel',this.diffDaysLabel(this.startDate,this.endDate));
    this.days = this.diffDays(this.startDate,this.endDate)

    // 计算天文本
    const daysLabelsArr = this.diffDaysLabel(this.startDate,this.endDate);
    // 计算每年每月一号的index
    let onedaysindex:any = [];
    daysLabelsArr.map((daysLabel:any,index:number)=>{
      var start = daysLabel.length-2;
      var char= daysLabel.substr(start,2);
      if( char== '01' ){ //找以01结尾的
        onedaysindex.push(index)
      }
    })
    console.log('每年每月一号的index',onedaysindex);
    
    // 计算每年一月一号的index
    let firstdaysindex:any = [];
    daysLabelsArr.map((daysLabel:any,index:number)=>{
      var start = daysLabel.length-5;
      var char= daysLabel.substr(start,5);
      if( char== '01-01' ){ //找以01结尾的
        firstdaysindex.push(index)
      }
    })
    console.log('每年一月一号的index',firstdaysindex);
    
    // 计算月文本
    // console.log('diffMonthsLabel',this.diffMonthsLabel(this.startDate,this.endDate));
    const monthsLabelsArr = this.diffMonthsLabel(this.startDate,this.endDate)    
    // 计算月标记
    onedaysindex.map((dayindex:any,index:number)=>{
      this.monthMarks[dayindex] = monthsLabelsArr[index];
    })

    // 计算年文本
    const yearsLabelsArr = this.diffYearsLabel(this.startDate,this.endDate);
    // 计算月标记
    firstdaysindex.map((dayindex:any,index:number)=>{
      this.yearMarks[dayindex] = yearsLabelsArr[index];
    })
  }

  /**
   * 计算两个时间内的月文本 
   * 
   * @type {string}
   * @memberof TimeSlider
   */   
  public diffMonthsLabel(date1:any, date2:any) {
      const a = moment(date1).startOf('month');
      const b = moment(date2).startOf('month');
      const diff = Math.abs(b.diff(a, 'months'));
      return Array.apply([], new Array(diff + 1)).map(function(item, index) {
          return a.clone().add(index, 'months').format('MM').replace(/\b(0+)/gi,"") + '月';
      });
  };

  /**
   * 计算两个时间的月差值
   * 
   * @type {string}
   * @memberof TimeSlider
   */     
  public diffMonths(date1:any, date2:any) {
      const a = moment(date1).startOf('month');
      const b = moment(date2).startOf('month');
      return Math.abs(b.diff(a, 'months'));
  };

  /**
   * 计算两个时间内的天文本
   * 
   * @type {string}
   * @memberof TimeSlider
   */     
  public diffDaysLabel(date1:any, date2:any) {
      const a = moment(date1).startOf('day');
      const b = moment(date2).startOf('day');
      const diff = Math.abs(b.diff(a, 'days'));
      return Array.apply([], new Array(diff + 1)).map(function(item, index) {
          return a.clone().add(index, 'days').format('YYYY-MM-DD');
      });
  };

  /**
   * 计算两个时间的天差值
   * 
   * @type {string}
   * @memberof TimeSlider
   */     
  public diffDays(date1:any, date2:any) {
      const a = moment(date1).startOf('day');
      const b = moment(date2).startOf('day');
      return Math.abs(b.diff(a, 'days'));
  };

  /**
   * 计算两个时间内的年文本
   * 
   * @type {string}
   * @memberof TimeSlider
   */     
  public diffYearsLabel(date1:any, date2:any) {
      const a = moment(date1).startOf('year');
      const b = moment(date2).startOf('year');
      const diff = Math.abs(b.diff(a, 'years'));
      return Array.apply([], new Array(diff + 1)).map(function(item, index) {
          return a.clone().add(index, 'years').format('YYYY') + '年';
      });
  };

  /**
   * 格式化提示
   * 
   * @type {string}
   * @memberof TimeSlider
   */   
  public formatTooltip(val:any){
    return moment(this.startDate).add(val, 'days').format('YYYY-MM-DD');
  }

  /**
   * 滑块变化后改变数据
   * 
   * @type {string}
   * @memberof TimeSlider
   */    
  public handleChange(arr:any){
    if (arr) {
      this.chooseStartDate = moment(this.startDate).add(arr[0], 'days').format('YYYY-MM-DD');
      this.chooseEndDate = moment(this.startDate).add(arr[1], 'days').format('YYYY-MM-DD');
    }
    console.log('给后台的数据',this.chooseStartDate,this.chooseEndDate);
  }

}
</script>

<style lang="less">
@import "./time-slider.less";
</style>
