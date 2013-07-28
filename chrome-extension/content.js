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

    // draw_fire_ball(200,0,400,400);

    $("#battle").load(battleHTML, function(){
        $("#battle").height($(window).height());
        $("#battle").width($(window).width());
        $("#can").width(0);
        // $("#enemy").attr("src", chrome.extension.getURL("battle/images/facebook.png"));
        // $("#you").attr("src", chrome.extension.getURL("battle/images/github.png"));
        //$("#battle").css("z-index", 9999);
        //TODO: Yunxing add the callback
        startBattle(window.location.origin, function(){
            enable_scrolling();
            document.getElementById("battle-sound").pause();
            $("#battle").hide();
        });
    });
}

function clear_fire_ball () {
    isFiring = false;
    clearInterval(draw_fire_ball_interval);
    setTimeout(function(){
        ctx.clearRect(0,0,W,H);
    },200);
}

//Lets create a function which will help us to create multiple particles
function create_particle(sx,sy,dx,dy)
{
    //Random position on the canvas
    this.x = sx;
    this.y = sy;

    //Lets add random velocity to each particle
    var base_speed = 5;
    var ratio = Math.abs(dx-sx) / Math.abs(dy-sy);
    this.vx = base_speed * ratio;
    this.vy = base_speed;
    if (dx < sx) { this.vx = 0 - base_speed * ratio};
    if (dy < sy) { this.vy = 0 - base_speed };

    //Random colors
    var r = Math.random()*255>>0;
    var g = Math.random()*255>>0;
    var b = Math.random()*255>>0;
    this.color = "rgba("+r+", "+g+", "+b+", 0.5)";

    //Random size
    this.radius = 20;//Math.random()*20+20;
}

//Lets animate the particle
function draw(dx,dy, callback)
{
    console.log("Drawing");
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation = "source-over";
    //Lets reduce the opacity of the BG paint to give the final touch
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, W, H);

    //Lets blend the particle with the BG
    ctx.globalCompositeOperation = "lighter";

    //Lets draw particles from the array now
    //for(var t = 0; t < particles.length; t++)
    //{
        var p = particles;
        ctx.beginPath();

        //Time for some colors
        var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.4, "white");
        gradient.addColorStop(0.4, p.color);
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0,  Math.PI*2, false);
        ctx.fill();

        if (Math.abs(p.x - dx) < 10 && Math.abs(p.y - dy) < 10) {
            ctx.fillStyle = "rgba(221, 100, 53, 1)";
            ctx.arc(p.x, p.y, p.radius * 2, 0,  Math.PI*2, false);
            ctx.fill();
            clear_fire_ball();
            callback();
        };

         //Update position
        p.x += p.vx;
        p.y += p.vy;
    //}
}

var particles;
var W=600; var H=200;
var draw_fire_ball_interval;
var isFiring = false;
// draw a fire ball from (sx,sy) to (dx,dy) in duration
function draw_fire_ball(sx,sy,dx,dy, callback) {
    if(!isFiring) {
        isFiring = true;
        console.log("Drawing A Fire Ball");
        ctx = $('#battle_canvas')[0].getContext('2d');
        particles = new create_particle(sx,sy,dx,dy);
        draw_fire_ball_interval = setInterval( function() { draw(dx,dy, callback); }, 33);
    }
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
    // player = new PLAYER();
    // player.create();
    // keydown = function(data) {
    //     var keycode = data.keyCode;
    //     if (keycode == 37 || keycode == 65) {
    //         data.preventDefault();
    //         player.move_left();
    //     }
    //     if (keycode == 38 || keycode == 87) {
    //         data.preventDefault();
    //         player.move_up();
    //     }
    //     if (keycode == 39 || keycode == 68) {
    //         data.preventDefault();
    //         player.move_right();
    //     }
    //     if (keycode == 40 || keycode == 83) {
    //         data.preventDefault();
    //         player.move_down();
    //     }
    //     if (keycode == 16)
    //         player.fire_event();
    // }
    // document.addEventListener("keydown", keydown);

    chrome.storage.local.get('player', function(data) {
        if (data.player) {
            var width = window.innerWidth + 50;
            var height = window.innerHeight + 50;
            var audio_string = '<audio id="battle-sound" src="' + chrome.extension.getURL("battle/107-battle-vs-wild-pokemon-.mp3" + '" preload="auto"></audio>');
            $("body").append(audio_string);
            document.getElementById("battle-sound").play();
            $("body").prepend('<canvas width= "' + window.innerWidth + '" height="' + window.innerHeight + '" id="can"></canvas>');
            var canvas = document.getElementById('can'),
            context = canvas.getContext('2d');
            disable_scrolling();
            fill_color(context, width, height);
        }
    });
});
