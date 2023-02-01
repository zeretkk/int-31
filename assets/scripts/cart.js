document.addEventListener('DOMContentLoaded', ()=>{
    const body = document.querySelector('body')
    const dishesList = document.querySelector('.dishes__list')
    const popup = document.querySelector('.popup')
    const form = popup.querySelector('.popup__form')
    const formCounterBtn = popup.querySelectorAll('.popup__button[data-action]')
    const counter = popup.querySelector('.popup__number')
    const closeBtn = popup.querySelector('.popup__close')
    const fields = popup.querySelectorAll('.popup__input')

    const cartContainer = document.querySelector('.cart')
    const cartList = cartContainer.querySelector('.cart__list')
    const cartPlaceholder = cartContainer.querySelector('.cart__placeholder')
    const cartClose = cartContainer.querySelector('.cart__close')
    const cartOrderBtn = cartContainer.querySelector('.cart__order')
    const cartCleanBtn = cartContainer.querySelector('.cart__clean')

    const cartOpen = document.querySelector('.floating-btn')

    function handleOrder(){
        popup.classList.remove('popup_hidden')
        body.style = `overflow: hidden; padding-right: ${window.innerWidth - body.offsetWidth}px`
        popup.scrollTo(0, 0)
    }
    
    function handlePopupHide(){
        popup.classList.add('popup_hidden')
        body.style = 'overflow: auto;'
    }
    
    function handleFormSubmit(event){
        event.preventDefault()
        let isValid = true
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
        if(!event.target.classList.contains('dishes__order')) return
        if(cartContainer.classList.contains('cart_hidden')) handleCart()
        let cart = JSON.parse(localStorage.getItem('cart')) || []
        if(cart.some(item=>item.id === this.dataset.dishid)){
            cart = cart.map(item=>{
                if(item.id === this.dataset.dishid){
                    item.count = item.count + 1
                }
                return item
            })
            localStorage.setItem('cart', JSON.stringify(cart))
            updateCart()
            return
        }
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
                counter.textContent = +counter.textContent - 1
                break
        }
        cart = cart.reduce((arr,item)=>{
            if(item.id === event.target.parentElement.dataset.dishid){
                item.count = +counter.textContent
            }
            return item.count>=1?[...arr, item]:arr
        }, [])
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
                <div class="cart__price">${item.price * item.count}<sup>&euro;</sup></div>  
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
        const floatingCounter = cartOpen.querySelector('.floating-btn__count')
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
            floatingCounter.textContent = cart.length
            return
        }
        total.textContent = 0
        cartPlaceholder.classList.remove('cart__placeholder_hidden')
        cartList.classList.add('cart__list_empty')
        floatingCounter.textContent = 0
    }
    function cleanCart(){
        localStorage.removeItem('cart')
        updateCart()
    }

    function handleCart(){
        cartContainer.classList.toggle("cart_hidden");
        cartOpen.classList.toggle("floating-btn_hidden");
    }

    if(localStorage.getItem('cart')){
        updateCart()
    }
    
    const observer = new MutationObserver((list, observer)=>{
        list.forEach(({addedNodes})=>{
            addedNodes[0]?.addEventListener('click', addCartItem)
        })
    })
    observer.observe(dishesList, {childList:true})

    form.addEventListener('submit', handleFormSubmit)
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
})
    