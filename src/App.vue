<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
@Component({})
export default class App extends Vue {

	/**
     * 当前主题
     *
     * @readonly
     * @memberof App
     */
    get themeClass() {
      return '111'
    }

}
</script>