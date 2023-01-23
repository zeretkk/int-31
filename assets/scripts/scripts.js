import { initSlideHandler } from "./slider.js"
import { updateMetrics } from "./calculator.js"

window.onload = function(){
    const handleSlide = initSlideHandler()
    const sliderButtons = document.querySelectorAll('.slider__button')
    sliderButtons.forEach(element=>{
        element.addEventListener('click', (event)=>handleSlide(element.dataset.direction, event))
    })


    const calcBtns = document.querySelectorAll('.calculator__button')
    calcBtns.forEach(element=>{
        element.addEventListener('click', (event)=>{
            if(event.target.classList.contains('calculator__button_active')) return
            const btnType = Object.keys(event.target.dataset)[0]
            const active = document.querySelector(`.calculator__button_active[data-${btnType}]`)
            active.classList.remove('calculator__button_active')
            event.target.classList.add('calculator__button_active')
            updateMetrics(event.target.dataset)
        })
    })
    
    const calcFields = document.querySelectorAll('.calculator__field')
    calcFields.forEach(element=>{
        element.addEventListener('change', event=>{
            const data = {}
            data[event.target.name] = +event.target.value
            updateMetrics(data)
        })
    })
}
