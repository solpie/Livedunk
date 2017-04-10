<template>
  <div id="app">
    <el-tabs type="border-card">
      <el-tab-pane label="Live">
        <div>
          <el-input placeholder="Please input"
                    v-model="rtmpUrl">
            <template slot="prepend">Rtmp://</template>
          </el-input>
        </div>
        <el-button @click.native='onRecord'>{{recBtnText}}</el-button>
        <el-button @click.native='onFrame'>Last Frame</el-button>
        <el-button @click.native='onCut'>cut</el-button>
      </el-tab-pane>
      <el-tab-pane label="Setting">
        <el-input placeholder="缓存目录"
                  v-model="cachePath">
          <el-button slot="append">...</el-button>
        </el-input>
        <el-input placeholder="bin目录"
                  v-model="binPath" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LiveDunk from './electron.js'
let liveDunk;
if (window['require'])
  liveDunk = new LiveDunk()
export default {
  data: liveDunk.data,
  created() {
    liveDunk.init(this)
  }
}
</script>
<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
