<template>
  <div class="screen-shot">
    <button @click="startshot">截图开始</button>
    <iframe width='600' height='300' src='./assets/test.html'></iframe>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
import html2canvas from 'html2canvas';
@Component({})
export default class appScreenShot extends Vue {

    public a:any = null;

    public startshot(){
      // this.a = new ScreenShort({
      //   enableWebRtc :false,
      //   completeCallback : this.completeCallback,
      //   closeCallback : this.closeCallback,
      //   level : 0,
      //   canvasWidth :0,
      //   canvasHeight :0
      // });  
      // console.log(this.a);
      var iframe = document.querySelector('iframe');
      let scrollY:any = iframe?.contentWindow?.pageYOffset;
      console.log(scrollY);
      
      html2canvas(document.body,{
          allowTaint:true,
          useCORS:true,
          y: window.pageYOffset,
          iframeScrollY:-scrollY,
        }).then(function(canvas) {
          document.body.appendChild(canvas);
      });
      
    }

    public completeCallback(e:any){
        console.log(e);
         console.log(this.a);
    }

    public closeCallback(){
      console.log('关闭了');
      
    }

}
</script>

<style lang="less">
@import './app-screen-shot.less';
</style>
