var operationMap = {
    "addition": "+",
    "subtraction": "-",
    "multiplication": "×",
    "division": "÷"
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

function getRandomArrayValue(array){
    return array[getRandomInt(0, array.length - 1)];
}

function factorialize(num) {
    if (num < 0) 
          return -1;
    else if (num == 0) 
        return 1;
    else {
        var x=1; 
        var f=1;
        while (x<=num) {
            f*=x; 
            x++;
        }
        return f;
    }
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
var masteredAnswers = {};
var numberToMaster;
var possibleMastered;

function startTest(){
    $("#answer").val('');
    $("#math-test").html('');

    operation = $("#operation").val();
    var max = parseInt($("#max").val()) || 12;
    var numbers = parseInt($("#numbers").val()) || 2;
    var firstNumbers = $("#firstNumber").val();
    var masterCorrect = parseInt($("#masterCorrect").val());
    numberToMaster = masterCorrect || 2;
    var firstNumbersArray = firstNumbers ? firstNumbers.split(",").map(fN => {return parseInt(fN.trim())}) : [];
    var n = max - 1; //we don't allow the number 1 since it's too easy so there are max - 1 possible numbers. E.g. if max is 3, then the possibilities are 3 and 2 (two possibilities)
    var r = numbers; //there are this many "slots" in the equation
    // for the number of combinations (since order doesn't matter for + and * and will only ever be ordered in one way for - and /, which is the same as order not mattering)
    // where each number can be repeated, the equation is:
    // (r + n - 1)! / r!(n - 1)! --> see https://www.mathsisfun.com/combinatorics/combinations-permutations.html
    possibleMastered = factorialize(r + n - 1) / (factorialize(r) * factorialize(n - 1)); //this is how many combinations there are
    if(firstNumbersArray.length) {
        //if we are guaranteeing at least one number there are fewer combinations
        //there are this many numbers that are NOT our guaranteed numbers:
        var numbersOtherThanFirstNumbers = n - firstNumbersArray.length; 
        //the below will give us all the combinations where NONE of our guaranteed numbers are included:
        var combinationsWithNoFirstNumbers = factorialize(r + numbersOtherThanFirstNumbers - 1) / (factorialize(r) * factorialize(numbersOtherThanFirstNumbers - 1));
        //we subtract the combinations which do not include any of the guaranteed numbers (since we must guarantee one or more of the numbers is present):
        possibleMastered = possibleMastered - combinationsWithNoFirstNumbers;
     } 

    $(".test-inactive").hide();
    $(".test-active").show();

    let numArray = [];

    for (let i = 0; i < numbers; i++) {
        let randomNumber = getRandomInt(2, max);

        if(operation === "division" && i === (numbers - 1) ){
            for(let num of numArray){
                randomNumber = randomNumber * num;
            }
        } 

        if(operation === "subtraction" && i === (numbers - 1) ){
            for(let num of numArray){
                randomNumber = randomNumber + num;
            }
        } 
        
        if(i === 0 && firstNumbers) randomNumber = getRandomArrayValue(firstNumbersArray);

        numArray.unshift(randomNumber);

    }

    if(operation !== "division" && operation !== "subtraction"){
        shuffle(numArray);
    }

    let masteredAnswerKey = [...numArray].sort().join(",");

    if(masteredAnswers[masteredAnswerKey] < 1 - numberToMaster) {
        return startTest();
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

    //give 2 minutes to answer
    setTimeout(function(){
        check();
    }, 1000 * 60 * 2);
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
        var num = parseInt(val);
        numberObjects.push(num);
    });

    let masteredAnswerKey = [...numberObjects].sort().join(","); //need to clone so we don't re-sort the objects [...]
    if(!masteredAnswers[masteredAnswerKey]) masteredAnswers[masteredAnswerKey] = 0;

    var currentValue = numberObjects[0];

    numberObjects.shift();

    for(let num of numberObjects){
        switch (operation) {
            case "addition":
                currentValue = currentValue + num;
                break;
            case "subtraction":
                currentValue = currentValue - num;
                break;
            case "multiplication":
                currentValue = currentValue * num;
                break;
            case "division":
                currentValue = currentValue/num;
                break;
        }
    }

    if(answer !== currentValue) incorrect = true;

    if(!incorrect) {
        inARow += 1;
        $("#inARow").html(`You got ${inARow} in a row!`);
        $("#answer").css('background-color', 'white');
        masteredAnswers[masteredAnswerKey] -= 1;
    }
    else {
        $("#math-correct-answer").html($("#math-test").text() + " = " + currentValue);
        $("#math-correct-answer").show();
        $("#keep-trying-modal").modal();
        inARow = 0;
        $("#inARow").html('');
        $("#answer").css('background-color', '#dc3545');
        masteredAnswers[masteredAnswerKey] += numberToMaster;
    }
    var quizzed = 0;
    var mastered = 0;
    for(answer in masteredAnswers){
        quizzed += 1;
        if (masteredAnswers[answer] < 1 - numberToMaster) mastered += 1;
    }
    $("#mastered").html(`You have been asked ${quizzed} ${quizzed > 1 ? "different questions" : "question"}.<br />You have mastered ${mastered} out of ${possibleMastered} possible questions.`);

    if(mastered  === possibleMastered) {
        return $('#master-modal').modal();
    }

    if(!incorrect) {
        $('#winner-modal').modal();
        setTimeout(nextQuestion, 1000);
    }
}

$('#keep-trying-modal').on('hidden.bs.modal', function () {
        
    $("#answer").val('');
    $("#answer").blur();
    $("#answer").focus();
    $("#answer").css('background-color', 'white');
    nextQuestion();

})
