let lastEvent

['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
    document.addEventListener(eventType, (e) => {
        lastEvent = e
    }, {
        capture: true,
        passive: true //默认不阻止默认事件
    })
})
export default function getLastEvent(){
    return lastEvent
}