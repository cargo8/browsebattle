function MSG(){
    var queue = [];
    var box;
    this.create = function(_box) {
        box = _box
    }
    this.add_msg = function(str, callback) {
        queue.push({str:str, callback:callback});
        if (queue.length == 1) {
            this.add_str(str);
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
        }
    }
}
