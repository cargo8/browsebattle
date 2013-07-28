function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function load_html() {
    var battle = document.createElement('div');
    battle.id = "battle";
    $("body").prepend(battle);
    var battleHTML = chrome.extension.getURL("battle/index.html");
    console.log("LOADING ... ");
    $("#battle").load(battleHTML, function(){
        $("#battle").height($(window).height());
        $("#battle").width($(window).width());
        $("#can").width(0);
        $("#enemy").attr("src", chrome.extension.getURL("battle/images/facebook.png"));
        $("#you").attr("src", chrome.extension.getURL("battle/images/github.png"));
        $("#battle").css("z-index", 9999);
        //TODO: Yunxing add the callback
        startBattle(window.location.origin, null);
    });
}

function flash(context, width, height, cb) {
    var freq = 200;
    // fill all with red
    context.fillStyle = "rgba(255,0,0,0.6)";
    context.fillRect(0, 0, width, height);
    setTimeout(function(){
        context.clearRect (0, 0, width, height);
        setTimeout(function(){
            context.fillStyle = "rgba(255,0,0,0.7)";
            context.fillRect(0, 0, width, height);
            setTimeout(function(){
                context.clearRect (0, 0, width, height);
                cb(context, width, height);
            }, freq);
        }, freq);
    }, freq);
}

function fill_one_by_one(context, width, height) {
    var len = 50;
    var num_width = Math.floor(width / len) ;
    var num_height = Math.floor(height / len) ;
    array_width = new Array();
    for (var i = 0; i < num_width + 5; i++) {
        array_width[i] = i;
    }
    array_height = new Array();
    for (var i = 0; i < num_height + 5; i++) {
        array_height[i] = i;
    }
    var i = 0;
    var j = 0;
    console.log("befroe");
    function myloop(){
        context.fillStyle = "rgba(0,0,0,1)";
        context.fillRect(array_width[i] * len, array_height[j] * len, len, len);
        j ++;
        if (j == num_height) {
            j = 0;
            i ++;
        }
        if (i == num_width) {
            load_html();
            console.log("finished");
            return;
        }
        setTimeout(function(){
            myloop();
        }, 3);
    }
    myloop();
}
function fill_color(context, width, height) {
    flash(context, width, height, fill_one_by_one);
}

function disable_scrolling() {
    $('html, body').css({
        'overflow': 'hidden',
        'height': '100%'
    });
}

function enable_scrolling() {
    $('html, body').css({
        'overflow': 'auto',
        'height': 'auto'
    });
}

$(document).ready(function() {
    chrome.storage.local.get('player', function(data) {
        if (data.player) {
            var width = window.innerWidth + 50;
            var height = window.innerHeight + 50;
            $("body").prepend('<canvas width= "' + window.innerWidth + '" height="' + window.innerHeight + '" id="can"></canvas>');
            var canvas = document.getElementById('can'),
            context = canvas.getContext('2d');
            disable_scrolling();
            fill_color(context, width, height);
        }
    });
});
