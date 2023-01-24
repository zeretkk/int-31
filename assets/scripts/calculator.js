const metrics = {
    gender: 'male',
    activity: 'weak',
}
function calculateBmr({weight, height, age, gender}){
    return gender=='male'
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
    return Math.ceil(calculateBmr({weight, height, age, gender}) * activities[activity])
}
function displayResult(ref){
    if(!ref){
        const counter = document.querySelector('.calculator__summary').children[0]
        counter.innerHTML = '0'
        return
    }
    const counter = document.querySelector('.calculator__summary').children[0]
    counter.innerHTML = calculateCalorie(ref)
}

export function updateMetrics(dataset){
    Object.assign(metrics, dataset)
    if(Object.keys(metrics).length >= 5 && Object.keys(metrics).every(key=>!!metrics[key])){
        displayResult(metrics)
        return
    }
    displayResult()
}

