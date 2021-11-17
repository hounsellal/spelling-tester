const urlParams = new URLSearchParams(window.location.search);
const kid = urlParams.get('kid') ? urlParams.get('kid') : "liam";

$( document ).ready(function() {

    $(".kid-image").each(function(){
        let src = $(this).attr('data-src');
        $(this).attr('src', src.replace("kid", kid));
        console.log($(this).attr('src'));
    });

    $('.kid-name').html(capitalizeFirstLetter(kid));

    $('.kid-link').each(function(){
        let link = $(this).attr('data-href') + "?kid=" + kid;
        $(this).attr('href', link);
    })

});

function toggleKid(){
    let newKid = kid === "liam" ? "london" : "liam";
    location.href = location.protocol + '//' + location.host + location.pathname + "?kid=" + newKid;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}