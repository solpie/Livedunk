let _require = window['require']
import cmdCall from './pipe'
let path = _require('path')
let ffmpeg = {}
ffmpeg.setBinPath = (binpath) => {
    ffmpeg.path = binpath
}
ffmpeg.getThumb = (inputPath, cachePath, sec, callback) => {
    let imgPath = path.join(cachePath, 'thumb' + sec + '.jpg')
    let params = ['-ss', sec,
        `-t`,
        `0.001`,
        `-i`,
        inputPath,
        '-f',
        `image2`,
        `-y`,
        imgPath,
    ]
    let child = cmdCall(ffmpeg.path, params)
    child.onData = () => {

    }
    child.onClose = (code) => {
        console.log('onClose', code)
        if (code == 1) {
            var fs = _require("fs");
            let prefix = "data:jpeg;base64,";
            var imageBuf = fs.readFileSync(imgPath);
            let imgBase64 = prefix + imageBuf.toString("base64")
            callback(imgBase64)
        }
    }
}

ffmpeg.rec = (rtmpUrl, cachePath, onData) => {
    console.log('rtmp', rtmpUrl, 'cachePath', cachePath)
    // rtmpUrl = '"'+rtmpUrl+'"'
    let params = ['-i',
        rtmpUrl,
        `-f`,
        `flv`,
        `-c`,
        `copy`,
        cachePath,
        `-y`,
    ]
    let c = cmdCall(ffmpeg.path, params)
    c.onData = (s) => {
        onData(s)
    }
    return c
}

ffmpeg.cut = (inputPath, seek, duration, outputPath, callback) => {
    let params = ['-ss', seek,
        `-t`, duration,
        `-i`, inputPath,
        '-c', `copy`,
        `-y`,
        outputPath,
    ]
    let c = cmdCall(ffmpeg.path, params)
    c.onClose = (code) => {
        callback(code==1)
    }
}

export default ffmpeg