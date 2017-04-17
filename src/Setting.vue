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
    </div>
</template>
<script>
import liveDunk from './LiveDunk.js'
export default {
    data(){
    return liveDunk.data()
  } ,
}
</script>