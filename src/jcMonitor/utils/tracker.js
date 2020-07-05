let host = 'cn-shenzhen.log.aliyuncs.com'
let project = 'jc-monitor'
let logstore = 'jc-monitor-store'
let userAgent = require('user-agent')

function getExtraData() {
    return {
        title: document.title,
        url: location.url,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name
    }

}
class Tracker {
    constructor() {
        //{project}.{endpoint}/logstores/{logstoreName}/track HTTP/1.1
        this.url = `http://${project}.${host}/logstores/${logstore}/track`
        this.xhr = new XMLHttpRequest()
    }
    send(data = {}) {
        let extraData = getExtraData();
        let log = {
            ...extraData,
            ...data
        }
        for (let key in log) {
            if (typeof log[key] == 'number') {
                log[key] = `${log[key]}`
            }
        }
        console.log('tarcklog', log)
        let body = JSON.stringify(log)
        this.xhr.open('POST', this.url, true)
        this.xhr.setRequestHeader('Content-Type', 'application/json')
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0')
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length)
        this.xhr.onload = function () {
            console.log(this.xhr.response)
        }
        this.xhr.onerror = function (error) {
            console.log(error)
        }
        this.xhr.send(body)
    }
}








export default new Tracker()