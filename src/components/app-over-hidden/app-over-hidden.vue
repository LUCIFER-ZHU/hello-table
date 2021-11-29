<template>
    <div class="app-over-hidden">
        <div ref="app-over-hidden-content" :class="{'content':true}" v-html="content"></div>
        <div class="more" @click.prevent="slideDiv(40)" v-if="overHeight">...</div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator';

@Component({})
export default class AppOverHidden extends Vue {

    /**
     * 内容
     * 
     * @type {string}
     * @memberof AppOverHidden
     */
    @Prop() public content?: string;

    /**
     * 是否超出高度
     * 
     * @type {string}
     * @memberof AppOverHidden
     */
    public overHeight:boolean = false;

    mounted(){
        this.isOverHeight();
        this.slideDiv(40);
    }

    /**
     * 判断是否超出高度
     * 
     * @type {string}
     * @memberof AppOverHidden
     */
    public isOverHeight(){
        var dom:any=this.$refs['app-over-hidden-content'];
        console.log(889,dom.offsetHeight);
        if (dom.offsetHeight > 40) {
          this.overHeight = true;
        } else {
          this.overHeight = false;
        }
    }

    /**
     * 点击展开或收缩
     * 
     * @type {string}
     * @memberof AppOverHidden
     */
    public slideDiv(height:number){
      var dom:any=this.$refs['app-over-hidden-content'];
      if (dom) {
        let obj = dom?.style;
        if(obj.height == ""){
          obj.height = height+"px";
          obj.overflow = "hidden"; 
        }else{
          obj.height="";
          obj.overflow="";
        }
      }
    }

}
</script>
<style lang="less">
@import './app-over-hidden.less';
</style>
