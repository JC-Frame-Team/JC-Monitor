export default function(cb){
    if(document.readyState==='complete')
    { //  文档加载完成了
        cb()
    }else{
        window.addEventListener('load',cb)
    }
}