var operationMap = {
    "Addition": "+",
    "Subtraction": "-",
    "Multiplication": "×",
    "Division": "÷"
}

$( document ).ready(function() {
    $(".test-active").hide();
});

function getRandomInt(min, max) {
    //random integer between min and max both inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

var operation = "";

var inARow = 0;

function startTest(){
    $("#answer").val('');
    $("#math-test").html('');

    operation = $("#operation").val();
    var max = parseInt($("#max").val());
    var numbers = parseInt($("#numbers").val());
    var firstNumber = parseInt($("#firstNumber").val());

    $(".test-inactive").hide();
    $(".test-active").show();

    let numArray = [];

    for (let i = 0; i < numbers; i++) {
        let randomNumber = getRandomInt(2, max);

        if(operation === "Division" && i === (numbers - 1) ){
            for(let num of numArray){
                randomNumber = randomNumber * num;
            }
        } 
        
        if(i === 0 && firstNumber) randomNumber = firstNumber;
        numArray.unshift(randomNumber);
    }

    if(operation !== "Division"){
        shuffle(numArray);
    }
    
    for (let i = 0; i < numbers; i++) {
        
        var newElement = `
            <div class="number-object" data-number="${numArray[i]}">
                ${numArray[i]}
            </div>
        `;
        if (i === (numbers - 1)){
            newElement = `<div class="operation-object">${operationMap[operation]}</div>
            ` + newElement;
        }
        $("#math-test").append(newElement);
    }
    $("#answer").blur();
    $("#answer").focus();
}

function finishedAnswer(event){
    if (event.keyCode === 13) {
        $(event.target).parent().parent().next().find('button').click();
    }
}

function finishTest(){
    $(".test-inactive").show();
    $(".test-active").hide();
    inARow = 0;
    $("#inARow").html(``);
}

function finishedAnswer(event){
    if (event.keyCode === 13) {
        $(event.target).parent().parent().next().find('button').click();
    }
}

function nextQuestion(){
    $('#winner-modal').modal('hide');
    $('#keep-trying-modal').modal('hide');
    startTest();
}

function check(){
    var incorrect = false;

    var answer = Number($("#answer").val());
    
    var numberObjects = [];
    $(".number-object").each(function(){
        var val = $(this).attr('data-number');
        console.log(val);
        var num = parseInt(val);
        numberObjects.push(num);
    });

    console.log(numberObjects);

    var currentValue = numberObjects[0];
    numberObjects.shift();


    for(let num of numberObjects){
        switch (operation) {
            case "Addition":
                currentValue = currentValue + num;
                break;
            case "Subtraction":
                currentValue = currentValue - num;
                break;
            case "Multiplication":
                currentValue = currentValue * num;
                break;
            case "Division":
                currentValue = currentValue/num;
                break;
        }
    }

    if(answer !== currentValue) incorrect = true;

    if(!incorrect) {
        $('#winner-modal').modal();
        setTimeout(nextQuestion, 1500);
        inARow += 1;
        $("#inARow").html(`You got <b>${inARow}</b> in a row!`);
    }
    else {
        $("#keep-trying-modal").modal();
        inARow = 0;
    }
}
