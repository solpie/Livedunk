// var child = require('child_process');


export default (cmd, params) => {
    let _require = window['require']
        // let child = _require('child_process')
        // var spawn = child.spawn;
    let child = _require('child_process').spawn(cmd, params);
    console.log('cmd:', cmd + params.join(' '))
    var stdout = '';
    var stderr = '';
    child.stdout.on('data', (buf) => {
        let s = String(buf)
        if (child.onData)
            child.onData(s)
        else
            console.log('[STR] stdout "%s"', s);
    });
    child.stderr.on('data', function(buf) {
        let s = String(buf)
        if (child.onData)
            child.onData(s)
        else
            console.log('[STR] stderr "%s"', s);
        // stderr += buf;
    });
    child.on('close', function(code) {
        if (this.onClose)
            this.onClose(s)
        else {
            // console.log('[END] code', code);
            // console.log('[END] stdout "%s"', stdout);
            // console.log('[END] stderr "%s"', stderr);
        }
    });
    return child
}