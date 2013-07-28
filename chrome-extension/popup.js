$(document).ready(function(){
    chrome.storage.local.set({'initurl': "hiya"}, function() {
        chrome.storage.local.get('initurl', function(data) {
            $("#btn").text(data.initurl);
        });
    });
});
