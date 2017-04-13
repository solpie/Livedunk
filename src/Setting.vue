<template>
    <div>
        <el-input placeholder="缓存目录"
                  v-model="cachePath">
            <el-button slot="append">...</el-button>
        </el-input>
        <el-input placeholder="bin目录"
                  v-model="binPath" />
    </div>
</template>
<script>
import liveDunk from './LiveDunk.js'
export default {
    data: liveDunk.data,
}
</script>