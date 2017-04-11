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
// HPF.flashStreamAddress()[0].rtmp
export default class LiveDunk {
    data() {
        return {
            rtmpUrl: 'rtmp://huputv-ws-live.arenacdn.com/prod/sjiBrQzyHD7jEARA',
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
            cachePath: 'c:/projects/Livedunk/cache',
            binPath: 'c:/projects/Livedunk/bin',
            value: 1
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
        let imgPath = path.join(this.liveCachePath, 'last.jpg')
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
                        let params = ['-i',
                            vue.rtmpUrl,
                            `-f`,
                            `flv`,
                            `-c`,
                            `copy`,
                            liveFlvPath,
                            `-y`,
                        ]
                        this.recChild = cmdCall(this.ffmpegPath, params)
                        this.recChild.onData = (s) => {
                            if (s.search('speed') > -1) {
                                this.vue.recOut = String(s)

                                // this.vue.$message(String(s)).duration = 0;
                            }
                        }
                        this.startThumbTimer()
                        this.startRecTimer()
                    }
                });
                this.liveFlvPath = liveFlvPath

            }
        }
        vue.onCut = (time) => {
            if (!time) {
                // bin\ffmpeg.exe -sseof -20 -i live.flv -c copy -y p0.mp4
                time = this.vue.recTime
            }
            let params = ['-ss',
                time - 20,
                `-t`,
                `20`,
                `-i`,
                this.liveFlvPath,
                '-c',
                `copy`,
                `-y`,
                path.join(this.liveCachePath, 'cut' + time + '.mp4'),
            ]

            cmdCall(this.ffmpegPath, params)
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
        // vue.watch = {
        //     seekSection: (v) => {
        //         console.log(v)
        //     }
        // }

    }
}