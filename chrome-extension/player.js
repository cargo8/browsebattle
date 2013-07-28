function PLAYER() {
    var self = this;
    var size = 50;
    this.create = function() {
        $("body").prepend('<canvas width= "' + 50 + '" height="' + 50 + '" id="player"></canvas>');
        player_canvas = document.getElementById('player'),
        player_context = player_canvas.getContext('2d');
        player_context.fillStyle = "rgba(0,0,0,0.7)";
        player_context.fillRect(0, 0, 50, 50);
        player_context.clearRect (0, 0, 50, 50);
        $("#player").css("top", 100);
        player_context.fillStyle = "rgba(0,0,0,0.7)";
        player_context.fillRect(0, 0, 50, 50);
    }
}
