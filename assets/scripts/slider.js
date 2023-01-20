function slide(side){
    const container = document.querySelector('.slider__content')
    const pages  = container.children
    const active  = document.querySelector('.slider__page:not(.slider__page_hidden)')
    const activeIdx = Array.prototype.indexOf.call(pages, active)
    if(side === 'left'){
        active.classList.add('slider__page_hidden')
        pages[activeIdx+1].classList.remove('slider__page_hidden')
        container.append(pages[activeIdx-1])
        return
    }
    active.classList.add('slider__page_hidden')
    pages[activeIdx-1].classList.remove('slider__page_hidden')
    container.prepend(pages[pages.length-1]) 

}



window.onload = function(){
    document.querySelectorAll('.slider__button').forEach(e=>e.addEventListener('click', ()=>slide(e.dataset.direction)))
}