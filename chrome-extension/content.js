function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
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
        console.log("" + i + "," + j);
        context.fillStyle = "rgba(0,0,0,1)";
        context.fillRect(array_width[i] * len, array_height[j] * len, len, len);
        j ++;
        if (j == num_height) {
            j = 0;
            i ++;
        }
        if (i == num_width) {
//            render_page();
            console.log("finished");
            return;
        }
        setTimeout(function(){
            myloop();
        }, 10);
    }
    myloop();
}
function fill_color(context, width, height) {
    flash(context, width, height, fill_one_by_one);
}
var width = window.innerWidth + 50;
var height = window.innerHeight + 50;
$("body").prepend('<canvas width= "' + window.innerWidth + '" height="' + window.innerHeight + '" id="can"></canvas>');
var canvas = document.getElementById('can'),
context = canvas.getContext('2d');

// var img = document.createElement('img');
// img.onload = function () {
//         context.drawImage(this,0,0);
// };
// img.src = 'http://www.planet-aye.co.uk/seasonal05/snow.png';
fill_color(context, width, height);
