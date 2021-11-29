import Vue from 'vue';
import appScreenShot from './components/app-screen-shot/app-screen-shot.vue'
import leaderLineList from './components/leader-line-list/leader-line-list.vue'
import TimeSlider from './components/time-slider/time-slider.vue';

export const AppComponents = {
  install(v: any, opt: any) {
    v.component('app-screen-shot', appScreenShot);
    v.component('leader-line-list', leaderLineList);
    v.component('time-slider', TimeSlider);
  },
};
