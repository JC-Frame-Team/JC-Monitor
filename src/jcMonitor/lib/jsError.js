import getLastEvent from '../utils/getLastEvent'     //获取到最后一个交互事件
import getSelect from '../utils/getSelect'     //获取到最后一个交互事件
import tracker from '../utils/tracker'     //获取到最后一个交互事件
export function injectJsError() {
    window.addEventListener('error', function (e) {
        console.log(e)
        let lastEvent = getLastEvent()
        console.log(e.target.link)
        if (e.target && (e.target.src || e.target.href)) {

            tracker.send({
                kind: 'stability', //监控指标的大类
                type: 'error', //小类型
                errorType: 'resourceError' , // 资源加载错误
                filename: e.target.src ||e.target.href,
                tagName: e.target.tagName,
                // body div#container                 input
                selector:getSelect(e.target)  //代表最后一个操作的元素
            })
        } else {
            console.log('lastEvent', lastEvent)
            // 点击哪个发生的错误呢？
            tracker.send({
                kind: 'stability', //监控指标的大类
                type: 'error', //小类型
                errorType: 'jsError',
                url: '',
                message: e.message,
                filename: e.filename,
                position: `行${e.lineno}:列${e.colno}`,
                stack: getLines(e.error.stack),
                // body div#container                 input
                selector: lastEvent ? getSelect(lastEvent.path) : '', //代表最后一个操作的元素
            })
        }

    }, true) // 你必须在捕获阶段才能抓取到 没有引入文件这样的错误
    window.addEventListener('unhandledrejection', (e) => {
        console.log(e)
        // reject 会有reason 没有的话也能捕获到错误
        let lastEvent = getLastEvent();//拿到上一个的事件对象
        let message, filename, line, column, stack = '';
        let reason = e.reason;
        if (typeof reason === 'string') {
            message = reason
        } else if (typeof reason === 'object') {
            if (reason.stack) {
                // at http://localhost:8080/:26:38↵ 
                let matchRes = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
                filename = matchRes[1]
                line = matchRes[2]
                column = matchRes[3]
            }
            message = reason.message
            stack = getLines(reason.stack)
        }

        tracker.send({
            kind: 'stability', //监控指标的大类
            type: 'error', //小类型
            errorType: 'promiseError',
            url: '',
            message,
            filename,
            position: `行${line}:列${column}`,
            stack,
            // body div#container                 input
            selector: lastEvent ? getSelect(lastEvent.path) : '', //代表最后一个操作的元素
        })



    })


    function getLines(stack) {
        // "TypeError: Cannot set property 'error' of undefined
        // at errorClick (http://localhost:8080/:21:34)
        // at HTMLInputElement.onclick (http://localhost:8080/:14:72)"
        let split = stack.split('\n')
        let res = split.slice(1).map(item =>
            item.replace(/^\s+at\s+/g, "")).join('^')
        // console.log(res)
        return res
    }


}