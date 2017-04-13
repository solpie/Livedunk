export default () => {
    let d = new Date()
    let datePath = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '[' + d.getHours() + "-" + d.getMinutes() + '-' + d.getSeconds() + ']'
    return datePath
}
