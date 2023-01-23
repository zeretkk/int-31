export const initSlideHandler =()=>{
    let lastCall = 0
    return function handleSlide(side, e){
        if(lastCall > 0 && e.timeStamp - lastCall < 500) return
        const container = document.querySelector('.slider__content')
        let current = + container.dataset.current
        const displayed = Math.floor(container.offsetWidth/(container.children[0].offsetWidth))
        switch(side){
            case 'right':
                if(current >= container.children.length-displayed){
                    container.scrollLeft = 0
                    container.dataset.current = 0
                    break
                }
                container.scrollBy(container.children[0].offsetWidth+container.offsetWidth/100*4, 0)
                container.dataset.current = current+1
                break
            case 'left':
                if(current <= 0){
                    container.scrollLeft = container.scrollWidth
                    container.dataset.current = container.children.length -1
                    break
                }
                container.scrollBy(-container.children[0].offsetWidth-container.offsetWidth/100*4, 0)
                container.dataset.current = current - 1
                break
        }
        lastCall = e.timeStamp
    }
}
