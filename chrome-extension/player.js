function PLAYER() {
    var self = this;
    var size = 20;
    var speed = 20;
    var player_canvas;
    var player_context;
    var x = 0;
    var y = 0;
    this.redraw = function() {
        $("#player_charactor").css("top", y);
        $("#player_charactor").css("left", x);
        player_context.fillStyle = "rgba(0,0,0,0.7)";
        player_context.fillRect(0, 0, size, size);
    }
    this.create = function() {
        $("body").prepend('<canvas width= "' + size + '" height="' + size + '" id="player_charactor"></canvas>');
        player_canvas = document.getElementById('player_charactor'),
        player_context = player_canvas.getContext('2d');

        player_context.fillRect(0, 0, size, size);
    }

    this.move_up = function() {
        player_context.clearRect(0, 0, size, size);
        y -= speed;
        this.redraw();
    }

    this.move_left = function() {
        player_context.clearRect(0, 0, size, size);
        x -= speed;
        this.redraw();
    }

    this.move_right = function() {
        player_context.clearRect(0, 0, size, size);
        x += speed;
        this.redraw();
    }

    this.move_down = function() {
        player_context.clearRect(0, 0, size, size);
        y += speed;
        this.redraw();
    }

    this.fire_event = function() {

        $("#player_charactor").css("top", 0);
        $("#player_charactor").css("left", 0);
        var ev = document.createEvent("MouseEvent");
        var el = document.elementFromPoint(x,y);
        ev.initMouseEvent(
            "click",
            true /* bubble */, true /* cancelable */,
            window, null,
            x, y, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        el.dispatchEvent(ev);

        $(document.elementFromPoint(x, y)).click();
        console.log(document.elementFromPoint(x, y));
        $("#player_charactor").css("top", y);
        $("#player_charactor").css("left", x);
    }
}
