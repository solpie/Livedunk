let _require = window['require']
import cmdCall from './pipe'
let path = _require('path')
let ffmpeg = {}
ffmpeg.setBinPath = (binpath) => {
    ffmpeg.path = binpath
}
ffmpeg.getThumb = (inputPath, cachePath, sec, callback) => {
    let imgPath = path.join(cachePath, 'thumb'+sec+'.jpg')
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
        console.log('onClose',code)
        if (code == 1) {
            var fs = _require("fs");
            let prefix = "data:jpeg;base64,";
            var imageBuf = fs.readFileSync(imgPath);
            let imgBase64 = prefix + imageBuf.toString("base64")
            callback(imgBase64)
        }
    }
}

export default ffmpeg