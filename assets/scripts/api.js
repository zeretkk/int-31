document.addEventListener('DOMContentLoaded',()=>{
    const list = document.querySelector('.dishes__list')
    async function getDishes(){
        const res = await fetch('/assets/dishes.json')
        if(res.ok){
            return await res.json()
        }
        throw res.statusText
    }

    function renderDish(item){
        const rating =(num)=>{
            const rounded = Math.round(num)
            const fullStars =`
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg rating__star">
                <mask id="mask0_4_207" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="19">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_4_207)">
                    <rect x="-3" y="-3" width="26" height="26" fill="#4D4D4D"/>
                </g>
            </svg>
            `.repeat(Math.floor(num))
            const half = rounded>num
            ?`
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg rating__star">
                <mask id="mask0_4_211" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="19">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 7.24L12.81 6.62L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27L16.18 19L14.55 11.97L20 7.24ZM10 13.4V4.1L11.71 8.14L16.09 8.52L12.77 11.4L13.77 15.68L10 13.4Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_4_211)">
                    <rect x="-3" y="-3" width="26" height="26" fill="#4D4D4D"/>
                </g>
            </svg>
            `
            :''
            const emptyStars = `
                <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg rating__star">
                    <mask id="mask0_4_217" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="19">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20 7.24L12.81 6.62L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27L16.18 19L14.55 11.97L20 7.24ZM10 13.4L6.24 15.67L7.24 11.39L3.92 8.51L8.3 8.13L10 4.1L11.71 8.14L16.09 8.52L12.77 11.4L13.77 15.68L10 13.4Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask0_4_217)">
                        <rect x="-3" y="-3" width="26" height="26" fill="#4D4D4D"/>
                    </g>
                </svg>
            `.repeat(5 - rounded)
            return emptyStars + half +fullStars
            
        }
        const element = document.createElement('div')
        element.classList.add('dishes__item')
        element.setAttribute('data-dishId', item.id)
        element.innerHTML = `
            <img src="${item.img}" alt="${item.title}" class="dishes__img">
            <img src="./assets/images/share.png" alt="share" class="dishes__share-btn">
            <div class="dishes__text">
                <p class="dishes__price">${item.price}<sup>&euro;</sup></p>
                <p class="dishes__title">${item.title}</p>
                <p class="dishes__served">${item.served}</p>
                <p class="dishes__choice">${item.choice}</p>
                <div class="dishes__buttons">
                    <div class="rating">
                        <div class="rating__stars-wrapper" data-rating="${Math.round(item.rating)}">
                            ${rating(item.rating)}
                        </div>
                        <span class="rating__count">${item.ratingCount}</span>
                    </div>
                    <button class="dishes__order">ORDER</button>
                </div>
            </div>
        `
        list.append(element)

    }


    getDishes()
        .then(dishes=>{
            list.innerHTML = ''
            dishes.map((dish)=>{
                renderDish(dish)
            })
        })
    
})
