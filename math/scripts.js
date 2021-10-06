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

var operation = "";

var inARow = 0;

function startTest(){
    $("#answer").val('');
    $("#math-test").html('');

    operation = $("#operation").val();
    var digits = parseInt($("#digits").val());
    var numbers = parseInt($("#numbers").val());

    console.log(operation, digits, numbers);

    $(".test-inactive").hide();
    $(".test-active").show();

    let max = Math.pow(10, digits) - 1;

    console.log(max);
    
    for (let i = 0; i < numbers; i++) {
        let randomNumber = getRandomInt(1, max);
        var newElement = `
            <div class="number-object" data-number="${randomNumber}">
                ${randomNumber}
            </div>
        `;
        if (i === (numbers -1)){
            newElement = `<div class="operation-object">${operationMap[operation]}</div>
            ` + newElement;
        }
        $("#math-test").append(newElement);
    }

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

    console.log(answer, currentValue);

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
