const _require = window['require']
    // export default (vue) => {
    //     // const execSync = _require('child_process').execSync;
    //     // let ret = execSync('electron ');
    //     console.log('electron created', this)
    // }
const path = _require('path')
import cmdCall from './utils/pipe.js'
export default class LiveDunk {
    data() {
        return {
            rtmpUrl: 'rtmp://huputv-ali-live.arenacdn.com/prod/q1K3rQzyHUtMEAAO?auth_key=157a17d4194847aa1bd2856c98f401bb-1491820983-781999-',
            recBtnText: 'Record',
            //setting
            cachePath: 'D:/projects/Livedunk/cache',
            binPath: 'D:/projects/Livedunk/bin',
            value: 1
        }
    }
    constructor() {
        console.log('new livedunk!')
        this.isRecord = false
        this.recChild = null
    }
    init(vue) {
        this.ffmpegPath = path.join(vue.binPath, 'ffmpeg.exe')
        vue.onRecord = () => {
            if (this.isRecord) {
                this.isRecord = false
                vue.recBtnText = 'Record'
                if (this.recChild)
                    this.recChild.kill()
            } else {
                this.isRecord = true
                vue.recBtnText = 'Stop'
                let liveFlvPath = path.join(vue.cachePath, 'live.flv')
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
            }
        }
        vue.onCut = () => {
            console.log('onCut')
        }
        vue.onFrame = () => {
            let cmd = path.join(vue.binPath, 'ffmpeg.exe')
            console.log('onFrame', cmd)
        }
    }
}