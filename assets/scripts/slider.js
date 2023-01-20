function slide(side){
    const container = document.querySelector('.slider__content')
    let current = +container.dataset.current
    if(side == 'right'){
        if(current >= container.children.length - 2){
            container.scrollLeft = 0
            container.dataset.current = 0
            return
        }
        container.scrollBy(container.children[0].offsetWidth+30, 0)
        container.dataset.current = current+1
        return
    }
    if(current <= 0){
        container.scrollLeft = container.scrollWidth
        container.dataset.current = container.children.length -1
        return
    }
    container.scrollBy(-container.children[0].offsetWidth-30, 0)
    container.dataset.current = current - 1
    return

}



window.onload = function(){
    document.querySelectorAll('.slider__button').forEach(e=>e.addEventListener('click', ()=>slide(e.dataset.direction)))
}