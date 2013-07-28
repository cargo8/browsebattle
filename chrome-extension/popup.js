$(document).ready(function(){
    chrome.storage.local.get('player', function(data) {
        if (!data.player) {
            chrome.tabs.query({active:true},function(tab){
                $("#url").val(tab[0].url);
                $("#btn").text("Start Battle");
                $("#btn").click(function(){
                    startGame($("#url").val());
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
