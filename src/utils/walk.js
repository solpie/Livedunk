let _require = window['require']
var fs = _require('fs');
var path = _require('path');
// export default function walk(dir, done) {
//     console.log('walk dir',dir)
//     var results = [];
//     fs.readdir(dir, function (err, list) {
//         if (err) return done(err);
//         var pending = list.length;
//         if (!pending) return done(null, results);
//         list.forEach(function (file) {
//             file = path.resolve(dir, file);
//             fs.stat(file, function (err, stat) {
//                 if (stat && stat.isDirectory()) {
//                     walk(file, function (err, res) {
//                         results = results.concat(res);
//                         if (!--pending) done(null, results);
//                     });
//                 } else {
//                     results.push(file);
//                     if (!--pending) done(null, results);
//                 }
//             });
//         });
//     });
// };
export default function walk(path){  
    var dirList = fs.readdirSync(path);

    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isFile()){
            fileList.push(path + '/' + item);
        }
    });
    // dirList.forEach(function(item){
    //     if(fs.statSync(path + '/' + item).isDirectory()){
    //         walk(path + '/' + item);
    //     }
    // });
}