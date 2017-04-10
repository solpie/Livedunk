// var child = require('child_process');


export default (cmd, params) => {
    let _require = window['require']
        // let child = _require('child_process')
        // var spawn = child.spawn;
    let child = _require('child_process').spawn(cmd, params);
    console.log('cmd:', cmd, child)
    var stdout = '';
    var stderr = '';
    child.stdout.on('data', function(buf) {
        console.log('[STR] stdout "%s"', String(buf));
        // stdout += buf;
    });
    child.stderr.on('data', function(buf) {
        console.log('[STR] stderr "%s"', String(buf));
        stderr += buf;
    });
    child.on('close', function(code) {
        console.log('[END] code', code);
        console.log('[END] stdout "%s"', stdout);
        console.log('[END] stderr "%s"', stderr);
    });
    return child
}