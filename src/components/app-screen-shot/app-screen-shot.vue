<template>
  <div class="screen-shot">
    <button @click="startshot">111111111111111111</button>
    <ul>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
      <li>1112dwa dwa dwa  a dwad wa  dwad wa a da d a dw a dwa  dwa </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
import ScreenShort from "ibiz-web-screen-shot";
@Component({})
export default class appScreenShot extends Vue {

    public a:any = null;

    public startshot(){
      this.a = new ScreenShort({
        enableWebRtc :false,
        completeCallback : this.completeCallback,
        closeCallback : this.closeCallback,
        level : 0,
        canvasWidth :0,
        canvasHeight :0
      });  
      console.log(this.a);
      
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
