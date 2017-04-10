const _require = window['require']
    // export default (vue) => {
    //     // const execSync = _require('child_process').execSync;
    //     // let ret = execSync('electron ');
    //     console.log('electron created', this)
    // }
const path = _require('path')
import cmdCall from './utils/pipe.js'
// HPF.flashStreamAddress()[0].rtmp
export default class LiveDunk {
    data() {
        return {
            rtmpUrl: 'rtmp://huputv-ws-live.arenacdn.com/prod/0tCLrQzyieNlEAvu',
            recBtnText: 'Record',
            recOut: '',
            recTime: 0,
            seekTime: 0,
            lastImg: "",
            seekSection: [0, 0],
            liveThumbInvert: 2, //second
            //setting
            cachePath: 'd:/projects/Livedunk/cache',
            binPath: 'd:/projects/Livedunk/bin',
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
        let imgPath = path.join(this.vue.cachePath, 'last.jpg')
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
        cmdCall(this.ffmpegPath, params).onData = () => {}

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
                let liveFlvPath = path.join(vue.cachePath, 'live.flv')
                this.liveFlvPath = liveFlvPath
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
                path.join(this.vue.cachePath, 'cut' + time + '.mp4'),
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
    }
}