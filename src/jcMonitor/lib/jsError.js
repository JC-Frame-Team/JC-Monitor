export function injectJsError() {
    window.addEventListener('error', function (e) {
        console.log(e)
        let log = {
            kind: 'stability', //监控指标的大类
            type: 'error', //小类型
            errorType: 'jsError',
            url: '',
            message: e.message,
            filename: e.filename,
            position: `行${e.lineno}:列${e.colno}`,
            stack: getLines(e.error.stack),
            selector:  null , //代表最后一个操作的元素
        }
        console.log(log)
    })

    function getLines(stack) {
        // "TypeError: Cannot set property 'error' of undefined
        // at errorClick (http://localhost:8080/:21:34)
        // at HTMLInputElement.onclick (http://localhost:8080/:14:72)"
        let split = stack.split('\n')
        let res=split.slice(1).map(item=>
            item.replace(/^\s+at\s+/g,"")).join('^')
        // console.log(res)
        return res
    }


}