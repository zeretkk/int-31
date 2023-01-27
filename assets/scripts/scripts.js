window.onload = function(){
    const initSlideHandler =()=>{
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
                        container.dataset.current = container.children.length - displayed
                        break
                    }
                    container.scrollBy(-container.children[0].offsetWidth-container.offsetWidth/100*4, 0)
                    container.dataset.current = current - 1
                    break
            }
            lastCall = e.timeStamp
        }
    }
    const handleSlide = initSlideHandler()
    const sliderButtons = document.querySelectorAll('.slider__button')
    sliderButtons.forEach(element=>{
        element.addEventListener('click', (event)=>handleSlide(element.dataset.direction, event))
    })


    const metrics = {
        gender: 'male',
        activity: 'weak',
    }

    function calculateBmr({weight, height, age, gender}){
        return gender==='male'
        ?(88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age))
        :(447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age))
    }

    function calculateCalorie({weight, height, age, gender, activity}){
        const activities = {
            weak: 1.2,
            low: 1.375,
            medium: 1.55,
            high: 1.9,
        }
        return Math.round(calculateBmr({weight, height, age, gender}) * activities[activity])
    }

    function displayResult(ref){
        const counter = document.querySelector('.calculator__summary').children[0]
        if(!metrics.height || !metrics.weight || !metrics.age || !metrics.activity || !metrics.gender){
            counter.textContent = '0'
            return
        }
        counter.textContent = calculateCalorie(ref)
    }
    
    function updateMetrics(dataset){
        Object.assign(metrics, dataset)
        localStorage.setItem('metrics', JSON.stringify(metrics))
        displayResult(metrics)
    }
    
    function aplyMetricString(metricsString){
        const parsedMetrics = JSON.parse(metricsString)

        const calcFields = document.querySelectorAll('.calculator__input')
        calcFields.forEach(element=>{
            element.value = parsedMetrics[element.name]
        })

        const calcBtns = document.querySelectorAll('.calculator__button')
        calcBtns.forEach(element=>{
            const btnType = Object.keys(element.dataset)[0]
            if(element.dataset[btnType] === parsedMetrics[btnType]){
                element.classList.add('calculator__button_active')
                return
            }
            element.classList.remove('calculator__button_active')
        })
        
        updateMetrics(parsedMetrics)
    }
    
    function handleCalcBtn(event){
        if(event.target.classList.contains('calculator__button_active')) return
        const btnType = Object.keys(event.target.dataset)[0]
        const active = document.querySelector(`.calculator__button_active[data-${btnType}]`)
        active.classList.remove('calculator__button_active')
        event.target.classList.add('calculator__button_active')
        updateMetrics(event.target.dataset)
    }

    function handleCalcInput(event){
        const data = {}
        data[event.target.name] = +event.target.value
        updateMetrics(data)
    }

    const calcBtns = document.querySelectorAll('.calculator__button')
    calcBtns.forEach(element=>{
        element.addEventListener('click', handleCalcBtn)
    })
    
    const calcFields = document.querySelectorAll('.calculator__input')
    calcFields.forEach(element=>{
        element.addEventListener('input', handleCalcInput)
    })
    
    if(localStorage.getItem('metrics')){
        aplyMetricString(localStorage.getItem('metrics'))
    }


    const orderBtns = document.querySelectorAll('.dishes__order')
    const popup = document.querySelector('.popup')
    const form = popup.querySelector('.popup__form')
    const formCounterBtn = popup.querySelectorAll('.popup__button[data-action]')
    const counter = popup.querySelector('.popup__counter')
    const closeBtn = popup.querySelector('.popup__close')
    const body = document.querySelector('body')

    function handleOrder(){
        popup.classList.remove('popup_hidden')
        body.style.overflowY = 'hidden'
        popup.scrollTo(0, 0)
    }
    
    function handlePopupHide(){
        popup.classList.add('popup_hidden')
        body.style.overflowY = 'auto'
    }
    
    function handleFromSubmit(event){
        event.preventDefault()
        let isValid = true
        const fields = popup.querySelectorAll('.popup__input')
        fields.forEach(field=>{
            if(field.checkValidity()){
                field.classList.remove('popup__input_invalid')
                return
            }
            isValid = false
            field.classList.add('popup__input_invalid')
        })
        if(isValid){
            handlePopupHide()
            return
        }
        popup.scrollTo(0, 0)
    }

    function handleCounter(event){
        switch(event.target.dataset.action){
            case 'incr':
                counter.textContent = +counter.textContent + 1
                break
            case 'decr':
                if(+counter.textContent < 2) break
                counter.textContent = +counter.textContent - 1
                break
        }
    }

    orderBtns.forEach(element=>{
        element.addEventListener('click', handleOrder)
    })

    form.addEventListener('submit', handleFromSubmit)
    formCounterBtn.forEach(element=>{
        element.addEventListener('click', handleCounter)
    })
    closeBtn.addEventListener('click', handlePopupHide)
}
