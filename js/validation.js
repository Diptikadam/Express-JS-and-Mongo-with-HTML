function inputAlphabet(inputtext){
  return(inputtext.trim().match(/^[a-zA-Z]+$/));
}

function inputNumber(inputtext){
  return (inputtext.trim().match(/(6|7|8|9)\d{9}/));
}

function inputSelect(value){
  return (value != -1);
}

function inputAddress(value){
  return (value.trim().length);
}
