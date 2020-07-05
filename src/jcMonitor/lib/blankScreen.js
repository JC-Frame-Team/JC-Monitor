import tracker from '../utils/tracker';
import onload from '../utils/onload';

export function blankScreen() {
    let wrapperElements = ['html', 'body', '#container', '.content']
    let emptyPoints = 0 // 空白点  这个元素是不是空白点
    function getSelector(element) {
        if (element.id) {
            return '#' + element.id
        } else if (element.className) { // a  b  c  => .a.b.v
            return '.' + element.className.split(' ').filter((item) => !!item).join(".")
        } else {
            return element.nodeName.toLowerCase()
        }
    }

    function isWrapper(element) {
        let selector = getSelector(element)
        if (wrapperElements.indexOf(selector) != -1) {
            emptyPoints++
        }

    }
    onload(function(){
        for (let i = 1; i <= 9; i++) {
            // x 上面的元素
            let xelements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)
            let yelements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)

            isWrapper(xelements[0]) // 是不是有实际元素
            isWrapper(yelements[0])
        }
        if (emptyPoints > 16) // 我认为他就白屏了
        {
            // 发送数据
            let centerElements = document.elementsFromPoint(
                window.innerWidth / 2, window.innerHeight / 2
            )
            tracker.send({
                kind: 'stablity',
                type: 'blank',
                emptyPoints,
                screen: window.screen.width + "X" + window.screen.height,
                viewPoint: window.innerWidth + 'XX' + window.innerHeight,
                selector: getSelector(centerElements[0])
            })
        }
    })
}