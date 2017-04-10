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
        <el-row>
          <el-col :span="12">
            <el-button @click.native='onRecord'>{{recBtnText}}</el-button>
            <el-input placeholder="seek"
                      id='seekInput'
                      v-model='seekTime'>
              <template slot="prepend">seek time</template>
            </el-input>
            <el-button @click.native='onCut(null)'>cut</el-button>
            <el-button @click.native='onFrame()'>Frame</el-button>
            <el-button @click.native='onCut(seekTime)'>seek cut</el-button>
            
            rec time:{{recTime}}
            <img :src='lastImg' style='width:640px;'>
          </el-col>
          <el-col :span="12">
            <el-time-picker is-range
                            v-model="seekSection"
                            placeholder="选择时间范围">
            </el-time-picker>
          </el-col>
        </el-row>
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

#seekInput {
  width: 160px;
}
</style>
