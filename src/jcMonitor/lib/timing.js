import tracker from '../utils/tracker';
import onload from '../utils/onload';
import getLastEvent from '../utils/getLastEvent';
import getSelect from '../utils/getSelect';

export function timing() {
    let FMP, LCP;
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries()
        FMP = perfEntries[0]
        observer.disconnect()//不再观察了
    }).observe({ entryTypes: ['element'] }) // 观察有意义
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries()
        const lastEntry = perfEntries[perfEntries.length - 1];
        // LCP = lastEntry.renderTime || lastEntry.loadTime;
        LCP = perfEntries[perfEntries.length - 1];
        console.log('LCP:', LCP)
    }).observe({ entryTypes: ['largest-contentful-paint'] })


    // 用户的第一次交互 点击页面 
    new PerformanceObserver((entryList, observer) => {
        let firstInput = entryList.getEntries()[0]
        console.log('FID', firstInput)
        if (firstInput) {
            let lastEvent = getLastEvent()
            // 
            let inputDelay = firstInput.processingStart - firstInput.startTime
            let duration = firstInput.duration
            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experienc',
                    type: 'timing',
                    inputDelay,
                    duration,
                    startTime: firstInput.startTime,
                    selector: lastEvent ? getSelect(lastEvent.path || lastEvent.target) : ''
                });
            }
        }
        observer.disconnect()//不再观察了
    }).observe({ type: 'first-input', buffered: true })

    onload(function () {
        setTimeout(() => {
            const { fetchStart, connectStart, connectEnd, requestStart,
                responseStart, responseEnd, domLoading, domInteractive,
                domContentLoadedEventStart, domContentLoadedEventEnd,
                loadEventStart } = performance.timing
            tracker.send({
                kind: 'experienc',
                type: 'timing',
                connectTime: connectEnd - connectStart,// 链接时间
                ttfbTime: responseStart - requestStart,//首字节到达时间
                responseTime: responseEnd - responseStart, //响应时间
                parseDOMTime: loadEventStart - domLoading, //dom解析时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart,//首次可交互时间
                loadTime: loadEventStart - fetchStart //wz


            })
            // 开始发送性能指标
            let FP = performance.getEntriesByName('first-paint')[0]
            let FCP = performance.getEntriesByName('first-contentful-paint')[0]
            console.log('fp', FP)
            console.log('FCP', FCP)
            console.log('FMP', FMP)
            console.log('LCP', LCP)

            tracker.send({
                kind: 'experienc',
                type: 'paint',
                firstPaint: FP.startTime,
                firstContentfulPaint: FCP.startTime,
                firstMeaningfulPaint: FMP.startTime,
                largestContenfulPaint: LCP.startTime
            });

        }, 3000);
    })
}