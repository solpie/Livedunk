export default () => {
    let d = new Date()
    let datePath = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDay() + '[' + d.getHours() + "-" + d.getMinutes() + '-' + d.getSeconds() + ']'
    return datePath
}
