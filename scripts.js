var savedLists = {};

$( document ).ready(function() {
    $(".test-active").hide();
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        var savedListJSON = localStorage.getItem("savedLists");
        if(savedListJSON) savedLists = JSON.parse(savedListJSON);
        for(let key in savedLists){
            $("#existing-lists").append(`<option value="${key}">${key}</option>`);
        }
    } else {
        // Sorry! No Web Storage support..
        $(".storage-available").hide();
    }
});

function saveList(){
    var wordList = $("#list").val();
    var listName = $("#list-name").val();
    if(!wordList || !listName) return;
    savedLists[listName] = wordList;
    localStorage.setItem("savedLists", JSON.stringify(savedLists));
    $("#existing-lists").append(`<option value="${listName}">${listName}</option>`);
    $("#existing-lists").val(listName);
}

function loadList(){
    var listName = $("#existing-lists").val();
    var list = savedLists[listName];
    $("#list").val(list);
}

function deleteList(){
    var listName = $("#existing-lists").val();
    if(listName){
        delete savedLists[listName];
        localStorage.setItem("savedLists", JSON.stringify(savedLists));
        $("#existing-lists").find(`option[value='${listName}']`).remove();
        $("#existing-lists").val('');
        $("#list").val('');
    }
}

var synth = window.speechSynthesis;

var voices = [];

function buildList(){
    var wordList = $("#list").val();
    if(!wordList) {
        alert("Please add some words to your list");
        return;
    }
    $(".test-inactive").hide();
    $(".test-active").show();
    $("#word-test").html("");
    var words = wordList.split("\n");
    var counter = 1;
    words.forEach(function(word){
        word = word.trim();
        var newElement = `
            <div class="form-group row" style="padding:10px;margin-vertical:auto;">
                <div class="col-sm-2 col-xs-5 p-5 text-right">
                    <label>${counter}</label>
                    <button class="btn btn-default" onClick="howSpell('${word}', this);">Speak</button>
                </div>
                <div class="col-sm-10 col-xs-7 p-5 word-question form-inline">
                    <input class="form-control" style="margin-bottom:5px;font-size:16px;" autocorrect="off" autocapitalize="none" type="search" autocomplete="off" onKeyUp="finishedAnswer(event, this);" data-word="${word}" />
                </div>
            </div>
        `;
        $("#word-test").append(newElement);
        counter +=1;
    });
}

function finishTest(){
    $(".test-inactive").show();
    $(".test-active").hide();
}

function finishedAnswer(event){
    if (event.keyCode === 13) {
        $(event.target).parent().parent().next().find('button').click();
    }
}

function check(){
    var incorrect = false;
    $(".word-question").each(function(){

        $(this).find('i').remove();
        var input = $(this).find('input');
        var val = input.val().toLowerCase();
        var parent = $(this).parent();
        var correct = input.attr('data-word').toLowerCase();
        
        if(val == correct) {
            parent.addClass('bg-success').removeClass("bg-danger");
            $(this).append(`<i class="fa fa-check-circle" style="font-size:25px;color:green;"></i>`);
        }
        else {
            incorrect = true;
            parent.addClass('bg-danger').removeClass("bg-success");
            $(this).append(`<i class="fa fa-times-circle" style="font-size:25px;color:red;"></i>`);
        }
    });
    if(!incorrect) {
        say("Yay! You got everything right!");
        $('#winner-modal').modal();
    }
    else {
        say("Good work. Keep practicing!");
        $("#keep-trying-modal").modal();
    }
}

function howSpell(text, thing){
    say("How do you spell: " + text);
    $(thing).parent().parent().find("input").focus();
}

function say(text){
    
    if (text !== '') {
        var utterThis = new SpeechSynthesisUtterance(text);
        utterThis.onend = function (event) {
            //console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }

        synth.speak(utterThis);
    }
}