const inputslider=document.querySelector("[data-lengthSlider]");
const lengthdisplay=document.querySelector("[data-length]");
const passworddisplay=document.querySelector("[data-passwordDisplay]")
const copybtn=document.querySelector("[data-copy]")
const copymsg=document.querySelector("[data-copyMsg]")
const uppercasecheck=document.querySelector("#uppercase")
const lowercasecheck=document.querySelector("#lowercase")
const numberscheck=document.querySelector("#numbers")
const symbolcheck=document.querySelector("#symbols")
const indicator=document.querySelector(".data-indicator")
const generatebtn=document.querySelector(".generateButton")
const allcheckbox=document.querySelectorAll("input[type=checkbox]")
const symbols='@#!$%^&*()_+'
let password="";
let passwordlength=15;
let checkcount=0;
handleslider();
setIndicator("#ccc");

function handleslider(){
     inputslider.value=passwordlength;
     lengthdisplay.innerText=passwordlength;
}
function setIndicator(color){
     //color change
     indicator.style.backgroundColor=color;
     //shadow
     indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRandomInteger(min,max){
      return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
      return getRandomInteger(0,9);
}
function generateLowerCase(){
     return String.fromCharCode(getRandomInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbols(){
     return symbols.charAt(getRandomInteger(0,11));
}


function calcStrength(){
     let hasUpper=false;
     let hasLower=false;
     let hasNum=false;
     let hasSym=false;
     

     if(uppercasecheck.checked) hasUpper=true;
     if(lowercasecheck.checked) hasLower=true;
     if(numberscheck.checked)   hasNum=true;
     if(symbolcheck.checked)    hasSym=true;

     if(hasUpper && hasLower && (hasNum || hasSym) && passwordlength>=8){
          setIndicator('#0f0')
     }else if((hasNum || hasSym) && (hasUpper || hasLower) && passwordlength>=6){
          setIndicator('#ff0')
     }else{
          setIndicator('#f00')
     }
}

async function copycontent(){
     try{
          await navigator.clipboard.writeText(passworddisplay.value);
          copymsg.innerText="copied";
     }catch(e){
          copymsg.innerText="failed";
     }
     copymsg.classList.add("active");
     setTimeout( ()=>{
          copymsg.classList.remove("active");
     },2000)
}

function shufflepassword(array){
     for(let i=array.length-1;i>0;i--){
          const j=Math.floor(Math.random()* (i+1));
          const temp=array[j];
          array[j]=array[i];
          array[i]=temp;
     }
     
     let str="";
     array.forEach((el)=>str+=el);
     return str;
}

function handlecheckbox(){
     checkcount=0;
     allcheckbox.forEach( (checkbox)=>{
          if(checkbox.checked){
               checkcount++;
          }
     })
     
     //special case
     if(passwordlength<checkcount){
          passwordlength=checkcount;
          handleslider();
     }
}




allcheckbox.forEach( (checkbox)=>{
     checkbox.addEventListener("change",handlecheckbox)
})


inputslider.addEventListener("input",(e)=>{
     passwordlength=e.target.value;
     handleslider();
})
copybtn.addEventListener("click",()=>{
     if(passworddisplay.value){
          copycontent();
     }
})
generatebtn.addEventListener("click",()=>{
     if(checkcount<=0)return;

     if(passwordlength<checkcount){
          passwordlength=4;
          handleslider();
     }

     password="";
     
     let funcArr=[];
     if(uppercasecheck.checked){
          funcArr.push(generateUpperCase);
     }
     if(lowercasecheck.checked){
          funcArr.push(generateLowerCase);
     }
     if(numberscheck.checked){
          funcArr.push(generateRandomNumber);
     }
     if(symbolcheck.checked){
          funcArr.push(generateSymbols);
     }

     //compulsary addition
     
     for(let i=0;i<funcArr.length;i++){
          password+=funcArr[i]();
     }

     //remaining addition
     for(let i=0;i<passwordlength-funcArr.length;i++){
         let randIndex=getRandomInteger(0,funcArr.length);
         password+=funcArr[randIndex]();
     }
     passworddisplay.value=password;
     calcStrength();
})