function getSelect(path) {
    return path.reverse().filter(e => {
        return e !== document && e !== window
    }).map(e => {
        let seletor = ''
        if (e.id) {
            return `${e.nodeName.toLowerCase()}#${e.id}`
        } else if (e.className && typeof e.className == 'string') {
            return `${e.nodeName.toLowerCase()}.${e.className}`
        } else {
            seletor = e.nodeName.toLowerCase()
        }
        return seletor
    }).join(' ')
}
export default function (path) {
    if (Array.isArray(path)) {
        return getSelect(path)
    }
}