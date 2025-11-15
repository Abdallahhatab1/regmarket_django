let password_input = document.getElementById('password_input');
let rangeColor = document.getElementById('rangeColor');
let submit_button = document.getElementById('submit_button');

let point_1 = document.getElementById('point_1')
let point_2 = document.getElementById('point_2')
let point_3 = document.getElementById('point_3')
let point_4 = document.getElementById('point_4')
let point_5 = document.getElementById('point_5')

let numbers = '1234567890';
let lowerCaseletter = "abcdefghijklmnopqrstuvwxyz";
let upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let specials = "!@#$%^&*()?|/-_=+~`{}[]:;\"'<>,.";

let lowerCRange = 0; let upperCRange = 0; let thenEightLetters = 0; let hasNum = 0; hasSpec = 0;

submit_button.disabled



function strongChacker(serItem, point_num, value) {
    if(password_input.value == '') {
        point_num.style.color = 'red';
        value = 0;
    }
    for(let i = 0; i < password_input.value.length; i++) {
        if(serItem.includes(password_input.value[i]))
        {point_num.style.color = 'green'; value = 1; break;}
        else {point_num.style.color = 'red'; value = 0}
    }
    return value
}

function getStrongResualt() {
    if(password_input.value.length >= 8) {
        point_1.style.color = 'green';
        thenEightLetters = 1;
    }
    else {
        point_1.style.color = 'red';
        thenEightLetters = 0;
    }

    upperCRange = strongChacker(upperCaseLetters, point_2, upperCRange);
    lowerCRange = strongChacker(lowerCaseletter, point_3, lowerCRange);
    hasNum = strongChacker(numbers, point_4, hasNum);
    hasSpec = strongChacker(specials, point_5, hasSpec);

    if((thenEightLetters + upperCRange + lowerCRange + hasNum + hasSpec) == 5) {
        submit_button.disabled = false
    }
    else {
        submit_button.disabled = true
    }
}
