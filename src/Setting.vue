<template>
    <div>
        <el-input placeholder="缓存目录"
                  v-model="cachePath">
            <el-button slot="append">...</el-button>
        </el-input>
        <el-input placeholder="bin目录"
                  v-model="binPath" />
        <el-input placeholder="播放器目录"
                  v-model="playerPath" />
    
        <el-input placeholder="playback.mov"
                  v-model="obsPlaybackPath">
            <template slot="prepend">playback.mov</template>
            <el-button slot="append"
                       @click='selPlayback'>...</el-button>
    
        </el-input>
    </div>
</template>
<script>
import liveDunk from './LiveDunk.js'
const _require = window['require']
const { dialog } = _require('electron').remote
const os = _require('os')
const path = _require('path')

function saveSetting() {
    let settingPath = path.join(os.homedir(), '.livedunk', '.cfg')
    console.log(settingPath)
}
function loadSetting(){
    
}


export default {
    data: liveDunk.data,
    methods: {
        selPlayback() {
            dialog.showOpenDialog({
                properties: ['openFile'], filters: [
                    { name: 'obs媒体源(*.mov)', extensions: ['avi', 'mov'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            }, (filename) => {
                console.log('filename', filename, os.tmp())
                if (filename.length)
                    this.obsPlaybackPath = filename[0]
            })
            // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
        }
    }
}
</script>