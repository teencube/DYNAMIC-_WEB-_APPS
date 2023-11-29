const MAX_NUMBER  = 30
const MIN_NUMBER = - 15
const STEP_AMOUNT = 1

const number = document.querySelector('[data-key = "number"]');
const subtract = document.querySelector('[data-key = "subtract"]');
const add = document.querySelector('[data-key = "add"]');
console.log(number,subtract,add);

const subtractHandler = () =>{
const newValue = parseInt(number.value) - STEP_AMOUNT
number.value  = newValue;
}

const addHandler = () =>{
    const newValue = parseInt(number.value) + STEP_AMOUNT
    number.value = newValue;
}

if (add.disabled === true){
    subtract.disabled = false
}



if (subtract.disabled === true){
    add.disabled = false
}


subtract.addEventListener('click',subtractHandler)
add.addEventListener('click',addHandler)