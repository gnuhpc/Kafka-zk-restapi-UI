const seqNum = {
    randonm(str) {
        var system = "G39"
        var colony = "01"
        var date = new Date()
        var Y = date.getFullYear()
        var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        var newData =Y  + M  + D + h + m + s
        var childNum = ""
        if (str == "公共平台") {
            childNum = "01"
        } else if (str == "容器") {
            childNum = "03"
        } else if (str == "DB") {
            childNum = "02"
        } else if (str == "代理") {
            childNum = "04"
        } else if (str == "redis") {
            childNum = "05"
        } else if (str == "kafka") {
            childNum = "06"
        } else {
            childNum = "01"
        }
        var pwd = ""
        var $chars = 'ABCDEFGHJKMNPQRSTWYZ23456789'
        var maxPos = $chars.length
        for (var i = 0; i < 11; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        }
        let seqnum = system + colony + newData + childNum + pwd
        return seqnum
    }
}
export default seqNum