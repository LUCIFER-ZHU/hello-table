<template>
  <div class="leader-line-list" ref='lineList'>
    <div v-for="list in lists" :key="list.index" :class="{'total-container':true,'is-current':list.bmsah == backData.curnode}">
      <div class="list-header">
        <div>{{list.bmsah}}</div>
      </div>
      <div class="list-container">
        <div v-for="(item,index) in list.datas" 
          :key="index" 
          class="list-content" 
          :id="'item'+ item.lcjdbh"
          @click="handleClick">
          <div class="item-people">{{item.jdzxzxm}}</div>
          <div class="item-time">{{item.jdjrsj}}</div>
          <div class="item-content">{{item.lcjdmc}}</div>
        </div>
      </div>
    </div>
    <canvas id="lineCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
@Component({})
export default class leaderLineList extends Vue {

    /**
     * 后台数据
     *
     * @memberof leaderLineList
     */
    public backData:any = {};

    /**
     * 绘制列表数据
     *
     * @memberof leaderLineList
     */
    public lists:any = [];

    /**
     * 流程指向对应数据
     *
     * @memberof leaderLineList
     */
    public lineList:any = [];

    /**
     * 绘制定时器
     *
     * @memberof leaderLineList
     */
    public renderTimer:any = null;

    /**
     * 数据接口地址
     * 
     * @type {string}
     * @memberof leaderLineList 
     */
    @Prop({ default: ''})
    public url!: string;

    /**
     * 请求方式
     *
     * @type {string}
     * @memberof leaderLineList
     */ 
    @Prop({ default: 'get'})
    public requestMode!: 'get' | 'post' | 'delete' | 'put';

    /**
     * 请求id
     *
     * @type {string}
     * @memberof leaderLineList
     */ 
    @Prop({ default: ''})
    public id!: string;

    /**
     * created
     *
     * @memberof leaderLineList
     */
    public created(){
      const url = this.parseURL();
      this.load(url);
    }

    /**
     * 解析URL
     * 
     * @type {*}
     * @memberof AppCommonMicrocom
     */
    public parseURL() {
      let url = this.url;
      let id = encodeURIComponent(this.id);
      url = url.replace('{aj_yx_aj_id}', id);
      return url;
    }

    /**
     * 加载数据
     *
     * @memberof leaderLineList
     */
    public load(url:any){
      if(url){
        axios({method: this.requestMode, url: url, data: {}}).then((response: any) => {
            if (response && response.status == 200) {
              this.backData = response.data;
              this.lists = this.backData.nodes;
              this.lineList = this.backData.links;
            }
        }).catch((error: any)=> {
            console.log(error);
        })
      }
    }

    /**
     * mounted
     *
     * @memberof leaderLineList
     */
    public mounted(){
      // 开启定时器
      this.renderTimer = setInterval(()=>{
        this.draw();
      },1000)
      // 浏览器大小发生变化
      window.onresize=()=>{
        this.draw();
      }
    }

    /**
     * 画canvas
     *
     * @memberof leaderLineList
     */
    public draw(){
      // 设置画布大小
      let lineListContainer:any = document.querySelector(".leader-line-list");
      let canvasContainer:any = document.querySelector("#lineCanvas")
      if (lineListContainer && !!(lineListContainer.offsetWidth && lineListContainer.offsetHeight)) {
        canvasContainer.width = lineListContainer.offsetWidth;
        canvasContainer.height = lineListContainer.offsetHeight;
      }

      // 绘制2D
      let ctx:any;
      if (canvasContainer && canvasContainer.getContext){
        ctx = canvasContainer.getContext('2d');
      }

      // 在当前页开始画
      if (lineListContainer && !!(lineListContainer.offsetWidth && lineListContainer.offsetHeight)) {
        // 开始绘制
        this.lineList.forEach((listItem:any) => {
          // 获取开始和结束两个DOM元素
          let startContainer:any = document.querySelector('#item'+listItem.begin);
          let endContainer:any = document.querySelector('#item'+listItem.end);
          
          // 获取开始DOM元素 相对于视窗的位置集合
          const {top:startContainerTop, right:startContainerRight, bottom:startContainerBottom, left:startContainerLeft} = startContainer.getBoundingClientRect();
          // 获取结束DOM元素 相对于视窗的位置集合
          const {top:endContainerTop, right:endContainerRight, bottom:endContainerBottom, left:endContainerLeft} = endContainer.getBoundingClientRect();
          // 获取画布 相对于视窗的位置集合
          const {top:lineListContainerTop, right:lineListContainerRight, bottom:lineListContainerBottom, left:lineListContainerLeft} = lineListContainer.getBoundingClientRect();

          // 获取开始位置和结束位置
          let startTop = startContainerTop - lineListContainerTop,
              startRight = startContainerRight - lineListContainerLeft,
              startBottom = startContainerBottom - lineListContainerTop,
              startLeft = startContainerLeft - lineListContainerLeft;
          let endTop = endContainerTop - lineListContainerTop,
              endRight = endContainerRight - lineListContainerLeft,
              endBottom = endContainerBottom - lineListContainerTop,
              endLeft = endContainerLeft - lineListContainerLeft;        

          // 开始位置在结束位置左边
          if (startRight < endRight) {
            // 绘制斜线1
            let start1X = startRight - (startContainer.offsetWidth)/3;
            let start1Y = startBottom;
            let end1X = startRight + 20;
            let end1Y = start1Y + 20       
            this.drawLine(ctx,start1X,start1Y,end1X,end1Y);
            // 绘制直线2
            let start2X = end1X;
            let start2Y = end1Y;
            let end2X = endLeft - 20;
            let end2Y = end1Y; 
            this.drawLine(ctx,start2X,start2Y,end2X,end2Y);
            // 绘制竖直线3
            let start3X = end2X;
            let satrt3Y = end2Y;
            let end3X = end2X;
            let end3Y = endTop - 20;
            this.drawLine(ctx,start3X,satrt3Y,end3X,end3Y);
            // 绘制箭头4
            let start4X = end3X;
            let start4Y = end3Y;
            let end4X = endLeft + (startContainer.offsetWidth)/3;
            let end4Y = endTop;
            this.drawArrow(ctx,start4X,start4Y,end4X,end4Y,30,10,2,'#243091','#4ca5b3')    
          // 开始位置在结束位置右边        
          } else if (startRight > endRight) {
            // 绘制斜线1
            let start1X = startLeft + (startContainer.offsetWidth)/3;
            let start1Y = startBottom;
            let end1X = startLeft - 20;
            let end1Y = start1Y + 20;     
            this.drawLine(ctx,start1X,start1Y,end1X,end1Y);
            // 绘制直线2
            let start2X = end1X;
            let start2Y = end1Y;
            let end2X = endRight + 20;
            let end2Y = end1Y; 
            this.drawLine(ctx,start2X,start2Y,end2X,end2Y);
            // 绘制竖直线3
            let start3X = end2X;
            let satrt3Y = end2Y;
            let end3X = end2X;
            let end3Y = endTop - 20;
            this.drawLine(ctx,start3X,satrt3Y,end3X,end3Y);
            // 绘制箭头4
            let start4X = end3X;
            let start4Y = end3Y;
            let end4X = endRight - (startContainer.offsetWidth)/3;
            let end4Y = endTop;
            this.drawArrow(ctx,start4X,start4Y,end4X,end4Y,30,10,2,'#243091','#4ca5b3')       
          //开始位置与结束位置相同  
          } else if (startRight == endRight) {
            // 绘制竖直线
            let startX = startRight - (startContainer.offsetWidth)/2;
            let startY = startBottom;
            let endX = endLeft + (endContainer.offsetWidth)/2;
            let endY = endTop;
            this.drawArrow(ctx,startX,startY,endX,endY,30,10,2,'#243091','#4ca5b3')
          }
        });
      }

    }

    /**
     * 画线
     *
     * @memberof leaderLineList
     */
    public drawLine(ctx:any, startX:number, startY:number, endX:number, endY:number){
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.closePath();
      ctx.lineWidth = 2;
      ctx.strokeStyle="#243091";
      ctx.stroke();
    }

    /**
     * 画箭头
     * fromX, fromY：起点坐标
     * toX, toY：终点坐标
     * theta：三角斜边一直线夹角
     * headlen：三角斜边长度
     * width：箭头线宽度
     * color：箭尾颜色
     *
     * @memberof leaderLineList
     */
    public drawArrow(ctx:any, fromX:number, fromY:number, toX:number, toY:number, theta:number, headlen:number , width:number, color:string, color2:string) {
      var theta = theta || 30,
      headlen = headlen || 10,
      width = width || 2,
      color =  color || '#243091',
      color2 =  color2 || '#4ca5b3'
  
      // 计算各角度和对应的坐标
      var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
          angle1 = (angle + theta) * Math.PI / 180,
          angle2 = (angle - theta) * Math.PI / 180,
          topX = headlen * Math.cos(angle1),
          topY = headlen * Math.sin(angle1),
          botX = headlen * Math.cos(angle2),
          botY = headlen * Math.sin(angle2);
      ctx.save();
      ctx.beginPath();
      var arrowX = fromX - topX,
          arrowY = fromY - topY;
      // 箭头尾部
      ctx.moveTo(arrowX, arrowY);
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();      
      ctx.beginPath();
      // 箭头左侧
      arrowX = toX + topX;
      arrowY = toY + topY;
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(toX, toY);
      // 箭头右侧
      arrowX = toX + botX;
      arrowY = toY + botY;
      ctx.lineTo(arrowX, arrowY);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.fillStyle = color2;
      ctx.fill();
      ctx.restore();
  }

    /**
     * 点击列表项事件
     *
     * @memberof leaderLineList
     */
    public handleClick() {
      console.log('点击了');
      
    }

    /**
     * 生命周期
     *
     * @memberof leaderLineList
     */
    public destroyed() {
      window.onresize = null;
      clearInterval(this.renderTimer);
    }

}
</script>

<style lang="less">
@import './leader-line-list.less';
</style>
