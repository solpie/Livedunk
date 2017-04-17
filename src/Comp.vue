<template>
    <div>
        <el-button size="small"
                   @click="onRefresh()">刷新</el-button>
        <el-table :data="tableData"
                  border
                  style="width: 100%">
            <el-table-column label="日期"
                             width="180">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="filename"
                             width="180">
                <template scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small"
                               @click="onPlay(scope.$index, scope.row)">播放</el-button>
                    <el-button size="small"
                               type="danger"
                               @click="onComp(scope.$index, scope.row)">合成</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-for="item in tableData">{{item.name}}</div>
    </div>
</template>
<script>
</script>
<script>
import liveDunk from './LiveDunk.js'
import walkDir from './utils/walk'
import Vue from 'vue'
let _require = window['require']
var fs = _require('fs');
var path = _require('path');
export default {
    data() {
        return liveDunk.data()
    },
    methods: {
        onRefresh() {
            console.log('onRefresh ')

            // let cp= liveDunk.cutPath
            let cp = 'D:\\projects\\Livedunk\\cache\\2017-4-17[20-16-33]\\cut'
            let dirList = fs.readdirSync(cp);
            dirList.forEach((item) => {
                let filename = path.join(cp, item)
                if (fs.statSync(filename).isFile()) {
                    console.log(filename, liveDunk.vue.push, liveDunk.vue.tableData.length)
                    // liveDunk.vue.tableData.push({date:'2016-',name:filename})
                    let t = liveDunk.vue.tableData
                    Vue.set(t, t.length, { date: '2016-', name: filename })
                    liveDunk.vue.$forceUpdate();
                    // Vue.set(t,0, { date: '2016-', name: filename })
                }
            });
        }
    }

}
</script>