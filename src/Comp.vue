<template>
    <div>
        <el-button size="small"
                   @click="onRefresh()">刷新</el-button>
        <el-button size="small"
                   @click="onOpenDir()">打开</el-button>
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
                               @click="onPlay(scope.row.filename)">播放</el-button>
                    <el-button size="small"
                               type="danger"
                               @click="onComp(scope.$index, scope.row)">合成</el-button>
                </template>
            </el-table-column>
        </el-table>
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
let electron = _require('electron')
const dialog = electron.remote.dialog
export default {
    data() {
        return {
            tableData: []
        }
    },
    methods: {
        onRefresh() {
            let cp = liveDunk.cutPath
            console.log('onRefresh ', cp)
            // let cp = 'C:/tmp/'
            let dirList = fs.readdirSync(cp);
            dirList.forEach((item) => {
                let filename = path.join(cp, item)
                if (fs.statSync(filename).isFile()) {
                    let t = this.tableData
                    let n = path.basename(filename)
                    Vue.set(t, t.length, { date: '2016-', filename: filename, name: n })
                }
            });
        },

        onOpenDir() {
            let ret = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] })
            if (ret && ret.length) {
                let dir = ret[0]
                let dirList = fs.readdirSync(dir);
                dirList.forEach((item) => {
                    let filename = path.join(dir, item)
                    if (fs.statSync(filename).isFile()) {
                        let t = this.tableData
                        let n = path.basename(filename)
                        Vue.set(t, t.length, { date: '2016-', filename: filename, name: n })
                    }
                });
            }
        }
    }

}
</script>