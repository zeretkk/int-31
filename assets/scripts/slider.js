
// зажатие скрола +
// универсальность+
// ретурны лишние+




window.onload = function(){
    const initSlideHandler =()=>{
        let isSliding = false
        function handle_slide(side){
            if(isSliding) return
            const container = document.querySelector('.slider__content')
            console.log()
            let current = + container.dataset.current
            const displayed = Math.floor(container.offsetWidth/(container.children[0].offsetWidth))
            isSliding = true
            switch(side){
                case 'right':
                    if(current >= container.children.length-displayed){
                        container.scrollLeft = 0
                        container.dataset.current = 0
                        break
                    }
                    container.scrollBy(container.children[0].offsetWidth+30, 0)
                    container.dataset.current = current+1
                    break
                case 'left':
                    if(current <= 0){
                        container.scrollLeft = container.scrollWidth
                        container.dataset.current = container.children.length -1
                        break
                    }
                    container.scrollBy(-container.children[0].offsetWidth-30, 0)
                    container.dataset.current = current - 1
                    break
            }
            setTimeout(()=>isSliding=false, 500)
        }
        return handle_slide
    }
    const handle_slide = initSlideHandler()

    document.querySelectorAll('.slider__button').forEach(e=>{
        e.addEventListener('click', ()=>handle_slide(e.dataset.direction))
    })
}