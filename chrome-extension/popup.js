$(document).ready(function(){
    chrome.storage.local.get('player', function(data) {
        if (!data.player) {
            $("#btn").text("Start Battle");
            $("#btn").click(function(){
                chrome.storage.local.set({'player': $("#url").val()}, function(data){
                    chrome.tabs.update({ active: true });
                });

            });
        } else {
            $("#url").val(data.player);
            $("#btn").text("Stop Battle");
            $("#btn").click(function(){
                chrome.storage.local.remove('player', function(data){
                    chrome.tabs.update({ active: true });
                });
            });
        }
    });

    // chrome.storage.local.set({'initurl': "hiya"}, function() {

    //         $("#btn").text(data.initurl);
    //     });
});
