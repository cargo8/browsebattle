function get_rank(url, cb) {
    var pipe = "http://pipes.yahoo.com/pipes/pipe.run?";
    pipe += "_id=c43fc0ed13fc8945cf438da90bff0121";
    pipe += "&site=" + encodeURIComponent(url);
    pipe += "&_render=json&callback=?";
    $.ajax(pipe,{crossDomain:true}).done(function(data){
        try {
            cb(data.value.items[0].SD.REACH.RANK);
        } catch(e) {
            cb(1000);
        }
    });
}
