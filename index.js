
const posswordDisplay = document.querySelector('.Possword');
const copyIcon = document.querySelector('[data-copy-icon]');
const copyMsg = document.querySelector('.toolTip');

const posswordLength = document.querySelector('[data-lengthNumber]');
const inputSlider = document.querySelector('[data-LengthSlider]');

const upperCase = document.querySelector('#upperLetter');
const lowerCase = document.querySelector('#lowerLetter');
const numbersCheck = document.querySelector('#number');
const symbolsCheck = document.querySelector('#symbol');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const CircularIndicator = document.querySelector('.CircularIndicator');
const generateButton = document.querySelector('[data-generatePosswordButton]');

// set strength color to greyish default
strengthIndicator("#ccc")
let possLength = 10;
let possword = "";
let checkCount = 0;
const symbolString = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

handleSlider();

function handleSlider(){
    inputSlider.value = possLength;
    posswordLength.innerText = possLength;
    let min = inputSlider.min;
    let max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (possLength - min)*100/(max - min)) + "% 100%";
}



inputSlider.addEventListener('input', (eve)=>{
    possLength = eve.target.value;
    handleSlider();
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(possLength < checkCount ) {
        possLength = checkCount;
    }
    handleSlider();
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


function getRandNumber(max,min){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getNumber(){
    return getRandNumber(0,9);
}

function getUpperCase(){
    return String.fromCharCode(getRandNumber(65,90));
}

function getLowerCase(){
    return String.fromCharCode(getRandNumber(97,122));
}

function getSymbol(){
    let Randindex = Math.floor(Math.random()*(symbolString.length-1));
    return symbolString[Randindex];
}

function strengthIndicator(color){
    CircularIndicator.style.backgroundColor = color;
    CircularIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upperCase.checked) hasUpper = true;
    if(lowerCase.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if((hasUpper && hasLower && hasSymbol && hasNumber) && possLength >= 8 ){
        strengthIndicator('#0f0');
    }
    else if( (hasUpper && hasSymbol ) || (hasLower && hasNumber) && possLength >= 4){
        strengthIndicator('#ff0');
    }
    else{
        strengthIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(posswordDisplay.value);
        copyMsg.innerText = 'copied';
        copyMsg.classList.add('active');
    }
    catch(e){
        copyMsg.innerText = 'failed';
    }

    setTimeout( ()=> {
        copyMsg.classList.remove('active');
    },2000);
}

copyIcon.addEventListener('click',()=>{
    if(posswordDisplay.value){
        copyContent();
    }
});

generateButton.addEventListener('click',()=>{

    if(possLength <= 0)
        return;

    if(possLength < checkCount){
        possLength = checkCount;
        handleSlider();
    }

    let funArr = [];

    if(upperCase.checked){
        funArr.push(getUpperCase);
    }

    if(lowerCase.checked){
        funArr.push(getLowerCase);
    }

    if(numbersCheck.checked){
        funArr.push(getNumber);
    }

    if(symbolsCheck.checked){
        funArr.push(getSymbol);
    }

    possword = "";

    // Compulsory Addition
    for(let i=0; i<funArr.length;i++){
        possword += funArr[i]();
    }

    // Remaining Addition
    for(let i=0; i<possLength-funArr.length;i++){
        let randInd = getRandNumber(0,funArr.length-1);
        possword += funArr[randInd]();
    }

   
    function ShuflePossword(array){
        //Fisher Yates Method
        for(let i=array.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * i+1);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach( (el) => { str += el});
        return str;
    }

     // Shufle the possword
     possword = ShuflePossword(Array.from(possword));

     // Display Possword in UI
     posswordDisplay.value = possword;
 
     // Strength after clicking Generate possword
     calcStrength();
 
});







