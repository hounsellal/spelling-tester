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
    //buildList();
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

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

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
                    <button class="btn btn-default" onClick="howSpell('${word}');">Speak</button>
                </div>
                <div class="col-sm-10 col-xs-7 p-5 word-question form-inline">
                    <input class="form-control" style="margin-bottom:5px;" autocorrect="off" autocapitalize="none" type="search" autocomplete="off" data-word="${word}" />
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

function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for(i = 0; i < voices.length ; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        
        if(voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
}

//populateVoiceList();
// if (speechSynthesis.onvoiceschanged !== undefined) {
//   speechSynthesis.onvoiceschanged = populateVoiceList;
// }

function howSpell(text){
    say("How do you spell: " + text);
}

function say(text){
    
    // if (synth.speaking) {
    //     console.error('speechSynthesis.speaking');
    //     return;
    // }
    if (text !== '') {
        var utterThis = new SpeechSynthesisUtterance(text);
        utterThis.onend = function (event) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        // var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
        // for(i = 0; i < voices.length ; i++) {
        //   if(voices[i].name === selectedOption) {
        //     utterThis.voice = voices[i];
        //     break;
        //   }
        // }
        // utterThis.pitch = 1;
        // utterThis.rate = 1;
        synth.speak(utterThis);
    }
}