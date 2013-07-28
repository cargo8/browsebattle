function rankToLevel(rank) {
    if (rank > 100) {
        rank = 1;
    } else {
        rank = 100 - rank;
    }
    return rank;
}

function urlClean(url) {
    url = url.replace("http://", "");
    url = url.replace("https://", "");
    url = url.replace("www.", "");
    url = url.replace("/", "");
    return url;
}

$(document).ready(function(){
    chrome.storage.local.get('player', function(data) {
        if (!data.player) {
            chrome.tabs.query({active:true},function(tab){
                $("#pic").hide();
                $("#url").val(tab[0].url);
                $("#btn").text("Start Battle");
                $("#btn").click(function(){
                    startGame($("#url").val());
                    chrome.tabs.update({ active: true });
                });
            });
        } else {
            $("#url").hide();
            var name = urlClean(data.player);
            $("#pic").attr("src", "http://"+name+"/favicon.ico");
            get_rank(data.player, function(rank){
                var level = rankToLevel(rank);
                $("#level").html("Current Level:" + level);
            });
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
