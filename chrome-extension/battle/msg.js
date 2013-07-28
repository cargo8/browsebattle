function MSG(){
    var queue = [];
    var box;
    this.create = function(_box) {
        box = _box
    }
    this.add_msg = function(str, callback, auto) {
        queue.push({str:str, callback:callback, auto:auto});
        if (queue.length == 1) {
            this.add_str(str);
            if (!auto) {
                setTimeout(function(){
                    box.text(str + "▼");
                }, 1000);
            }
        }
    }
    this.add_str = function(str) {
        box.text(str);
        var animation = "bounceInUp";
        box.addClass(animation);
        setTimeout(function(){
            box.removeClass(animation);
        }, 1000);
    }
    this.consume = function() {
        if (queue.length == 0) return;
        if (queue[0].callback) queue[0].callback();
        queue.shift();
        if (queue.length != 0) {
            console.log(queue[0].str);
            this.add_str(queue[0].str);
            if (!queue[0].auto) {
                setTimeout(function(){
                    box.text(queue[0].str + "▼");
                }, 1000);
            }
        }
    }
}
