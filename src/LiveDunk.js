const _require = window['require']
// export default (vue) => {
//     // const execSync = _require('child_process').execSync;
//     // let ret = execSync('electron ');
//     console.log('electron created', this)
// }
const path = _require('path')

// const mkdirp = require('mkdirp');
import mkdirp from "./utils/mkdirp"
import cmdCall from './utils/pipe.js'
import mkDate from './utils/mkDate'
import ffmpeg from './utils/ffmpeg'
import walkDir from './utils/walk'
// HPF.flashStreamAddress()[0].rtmp
class LiveDunk {
    data() {
        return {
            rtmpUrl: "rtmp://huputv-ws-live.arenacdn.com/prod/nzfHrQzyieNlEAko",
            recBtnText: 'Record',
            recOut: '',
            recTime: 0,
            seekTime: 0,
            lastImg: "",
            seekSection: [0, 0],
            liveThumbInvert: 2, //second
            //
            sectionStartImg: '',
            sectionEndImg: '',
            //setting
            cachePath: 'd:/projects/Livedunk/cache',
            binPath: 'd:/projects/Livedunk/bin',
            playerPath: 'd:/projects/Livedunk/bin',
            obsPlaybackPath: 'd:/projects/Livedunk/cache/playback.mov',
        }
    }
    constructor() {
        console.log('new livedunk!')
        this.isRecord = false
        this.recChild = null
        this.thumbTimer = null
        this.recTimer = null
        this.liveFlvPath = null
        this.vue = null
        this.liveCachePath = null
    }
    startRecTimer() {
        this.recTimer = setInterval(() => {
            this.vue.recTime++;
        }, 1 * 1000)
    }
    stopRecTimer() {
        if (this.recTimer)
            clearInterval(this.recTimer)
    }
    getLiveThumb() {
        let imgPath = path.join(this.thumbPath, 'last.jpg')
        let params = ['-sseof',
            '-1',
            `-t`,
            `0.001`,
            `-i`,
            this.liveFlvPath,
            '-f',
            `image2`,
            `-y`,
            imgPath,
        ]
        cmdCall(this.ffmpegPath, params).onData = () => { }

        var fs = _require("fs");
        // let imgPath = path.join(this.vue.cachePath, 'last.jpg')
        let prefix = "data:jpeg;base64,";
        var imageBuf = fs.readFileSync(imgPath);
        this.vue.lastImg = prefix + imageBuf.toString("base64")
    }

    startThumbTimer() {
        if (this.thumbTimer)
            clearInterval(this.thumbTimer)
        this.thumbTimer = setInterval(() => {
            this.getLiveThumb()
        }, this.vue.liveThumbInvert * 1000)
    }
    get thumbPath() {
        return path.join(this.liveCachePath, 'thumb')
    }
    get cutPath() {
        return path.join(this.liveCachePath, 'cut')
    }
    init(vue) {
        this.vue = vue
        this.ffmpegPath = path.join(vue.binPath, 'ffmpeg.exe')
        ffmpeg.setBinPath(this.ffmpegPath)
        vue.onRecord = () => {
            if (this.isRecord) {
                this.isRecord = false
                vue.recBtnText = 'Record'
                if (this.recChild)
                    this.recChild.kill()

                if (this.thumbTimer)
                    clearInterval(this.thumbTimer)
                this.stopRecTimer()
            } else {
                this.isRecord = true
                vue.recBtnText = 'Stop'
                let datePath = mkDate()
                this.liveCachePath = path.join(vue.cachePath, datePath)
                let liveFlvPath = path.join(this.liveCachePath, 'live.flv')

                // mkdirp cut thumb
                mkdirp(this.liveCachePath, (err) => {
                    if (!err) {
                        mkdirp(this.thumbPath)
                        mkdirp(this.cutPath)
                        ffmpeg.rec(vue.rtmpUrl, liveFlvPath, (s) => {
                            if (s.search('speed') > -1) {
                                vue.recOut = String(s)
                            }
                        })
                        this.startThumbTimer()
                        this.startRecTimer()
                    }
                });
                this.liveFlvPath = liveFlvPath
            }
        }
        vue.onCut = (time, isEnd) => {
            // if (!time) {
            //     // bin\ffmpeg.exe -sseof -20 -i live.flv -c copy -y p0.mp4
            //     time = this.vue.recTime
            // }
            let outPath;
            if (!isEnd)
                outPath = path.join(this.cutPath, 'cut' + time + '.mp4')
            else {
                let t = time
                if (!t)
                    t = this.vue.recTime
                outPath = path.join(this.cutPath, 'cut^' + t + '.mp4')
            }
            ffmpeg.cut(this.liveFlvPath, time, 20, outPath, () => {

            })
            console.log('onCut', this.vue.time)
        }
        vue.onFrame = () => {
            console.log('onFrame', this.vue.time)
            var fs = _require("fs");
            let imgPath = path.join(this.vue.cachePath, 'last.jpg')
            let prefix = "data:jpeg;base64,";
            var imageBuf = fs.readFileSync(imgPath);
            this.vue.lastImg = prefix + imageBuf.toString("base64")
            // console.log(imageBuf.toString("base64"));
        }
        vue.onSeekSection = (v) => {
            console.log(v)
            ffmpeg.getThumb(this.liveFlvPath, this.liveCachePath, v[0], (base64Img) => {
                vue.sectionStartImg = base64Img
            })
            ffmpeg.getThumb(this.liveFlvPath, this.liveCachePath, v[1], (base64Img) => {
                vue.sectionEndImg = base64Img
            })
        }

        //comp tab
        vue.onPlay = () => {

        }
        vue.onComp = () => {

        }
        vue.onRefresh = () => {
            // let cp= this.cutPath
            // cp = 'D:/projects/Livedunk/cache/2017-4-17[20-16-33]/cut'
            // walkDir(this.cutPath,(fileArr)=>{
            //     console.log('fileArr',fileArr)
            // })
        }
        // vue.tableData.push({date:'ddd',name:'222'})
    }
}

const liveDunk = new LiveDunk()
export default liveDunk