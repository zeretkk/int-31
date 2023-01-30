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

    const body = document.querySelector('body')
    const dishes = body.querySelectorAll('.dishes__item')
    const popup = body.querySelector('.popup')
    const form = popup.querySelector('.popup__form')
    const formCounterBtn = popup.querySelectorAll('.popup__button[data-action]')
    const counter = popup.querySelector('.popup__number')
    const closeBtn = popup.querySelector('.popup__close')

    const cartContainer = body.querySelector('.cart')
    const cartList = cartContainer.querySelector('.cart__list')
    const cartPlaceholder = cartContainer.querySelector('.cart__placeholder')
    const cartClose = cartContainer.querySelector('.cart__close')
    const cartOrderBtn = cartContainer.querySelector('.cart__order')
    const cartCleanBtn = cartContainer.querySelector('.cart__clean')

    const cartOpen = body.querySelector('.floating-btn')

    function handleOrder(){
        popup.classList.remove('popup_hidden')
        body.style = `overflow: hidden; padding-right: ${window.innerWidth - body.offsetWidth}px`
        popup.scrollTo(0, 0)
    }
    
    function handlePopupHide(){
        popup.classList.add('popup_hidden')
        body.style = 'overflow: auto;'
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
    
    function addCartItem(event){
        let cart = JSON.parse(localStorage.getItem('cart')) || []
        if(!event.target.classList.contains('dishes__order') || cart.some(item=>item.id === this.dataset.dishid)) return
        const title = this.querySelector('.dishes__title').textContent
        const price = +this.querySelector('.dishes__price').textContent.slice(0, -1)
        const img = this.querySelector('.dishes__img').src
        cart = [...cart, {title, price, img, count: 1, id: this.dataset.dishid}]
        localStorage.setItem('cart', JSON.stringify(cart))
        updateCart()   
    }

    function handleCartCountUpdate(event, counter){
        let cart = JSON.parse(localStorage.getItem('cart'))
        switch(event.target.dataset.counter){
            case 'incr':
                counter.textContent = +counter.textContent + 1
                break
            case 'decr':
                if(+counter.textContent < 2){
                    cart = cart.filter(item=>item.id !== event.target.parentElement.dataset.dishid)
                    localStorage.setItem('cart', JSON.stringify(cart))
                    updateCart()
                    return
                }
                counter.textContent = +counter.textContent - 1
                break
        }
        console.log(event.target.parentElement.dataset.dishid)
        cart = cart.map(item=>{
            if(item.id === event.target.parentElement.dataset.dishid){
                item.count = +counter.textContent
            }
            return item
        })
        localStorage.setItem('cart', JSON.stringify(cart))
        updateCart()
    }

    function renderCartItem(item){
        const dish = document.createElement('div')
        dish.classList.add('cart__item')
        dish.innerHTML = `
            <div class="cart__item-wrapper">
                <div class="cart__image">
                    <img src="${item.img}" alt="${item.title}" class="cart__img">
                </div>
                <div class="cart__label">${item.title}</div>
                <div class="cart__price">${item.price} <sup>&euro;</sup></div>  
            </div>
            <div class="cart__counter" data-dishid="${item.id}">
                <button class="cart__button" data-counter="incr">+</button>
                <p class="cart__number">${item.count}</p>
                <button class="cart__button" data-counter="decr">-</button>
            </div>
            `
        const cartBtns = dish.querySelectorAll('.cart__button')
        const cartCounter = dish.querySelector('.cart__number')
        cartBtns.forEach(element=>{
            element.addEventListener('click', event=>handleCartCountUpdate(event, cartCounter))
        })
        cartList.append(dish)
    }

    function updateCart(){
        let cart = JSON.parse(localStorage.getItem('cart')) || []
        const total = cartContainer.querySelector('.cart__total-number')
        if(cart.length > 0){
            cartPlaceholder.classList.add('cart__placeholder_hidden')
            cartList.classList.remove('cart__list_empty')
            cartList.innerHTML = ''
            let sum = 0
            cart.forEach(item=>{
                sum += item.count * item.price
                renderCartItem(item)
            })
            total.textContent = sum
            return
        }
        total.textContent = 0
        cartPlaceholder.classList.remove('cart__placeholder_hidden')
        cartList.classList.add('cart__list_empty')    
    }
    function cleanCart(){
        localStorage.removeItem('cart')
        updateCart()
    }

    function handleCart(){
        if(cartContainer.classList.contains('cart_hidden')){
            cartContainer.classList.remove('cart_hidden')
            cartOpen.classList.add('floating-btn_hidden')
            return
        }
        cartContainer.classList.add('cart_hidden')
        cartOpen.classList.remove('floating-btn_hidden')
    }

    if(localStorage.getItem('cart')){
        updateCart()
    }

    dishes.forEach(element=>{
        element.addEventListener('click', addCartItem)
    })

    form.addEventListener('submit', handleFromSubmit)
    formCounterBtn.forEach(element=>{
        element.addEventListener('click', handleCounter)
    })
    closeBtn.addEventListener('click', handlePopupHide)
    cartClose.addEventListener('click', handleCart)
    cartOpen.addEventListener('click', handleCart)
    cartOrderBtn.addEventListener('click', ()=>{
        handleCart()
        handleOrder()
    })
    cartCleanBtn.addEventListener('click', cleanCart)
}
