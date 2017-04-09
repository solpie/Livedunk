<template>
  <div id="app">
    <div>
      <el-input placeholder="Please input"
                v-model="rtmpUrl">
        <template slot="prepend">Rtmp://</template>
      </el-input>
    </div>
  
    <el-button @click.native='onRecord'>record</el-button>
    <el-button @click.native='onFrame'>Last Frame</el-button>
    <el-button @click.native='onCut'>cut</el-button>
  </div>
</template>

<script>
import electron from './electron.js'
let electronApp;
export default {
  data() {
    return {
      rtmpUrl: '',
      value: 1
    }
  },
  created() {
    if (window['require']) {
      electronApp = electron()
      // this.methods['onRecord'] = electronApp.methods.onRecord
    }
    else {
      this.$alert('electron only!', 'Error', {
      });
    }
  },
  mounted() {
  },
  methods: {
    onRecord:function(){
        console.log('onRecord', electronApp)
    },
    onCut:function(){
      console.log("onCut",this.rtmpUrl)
    },
    onFrame:function(){
      console.log("onFrame",this.rtmpUrl)
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
