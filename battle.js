Window.storage = {};

function getFoeHealth() {
    return parseInt(localStorage.getItem("foe_health"), 10);
}

function toInt(num) {
    return parseInt(num, 10);
}

function getSiteLevel(website) {
    var url = "http://data.alexa.com/data?cli=10&data=snbamz&url=" + website;
    var popularity = 0;
    $.get(
        url,
        function(data) {
            if (window.DOMParser)
              {
              parser=new DOMParser();
              xmlDoc=parser.parseFromString(txt,"text/xml");
              }
            else // Internet Explorer
              {
              xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
              xmlDoc.async=false;
              xmlDoc.loadXML(txt);
              }
            popularity = xmlDoc.getElementById("POPULARITY").getAttribute("TEXT");
        }
    );
    if (toInt(popularity) === 0) {
        popularity = 1000000;
    }
    return popularity;
}

function startGame(playerWebsite) {
    localStorage.setItem('player', 'playerWebsite');
    localStorage.setItem('player_health', 100);
    localStorage.setItem('player_rank', getSiteLevel(playerWebsite));
}

function startBattle(website, callback) {
    localStorage.setItem('foe', website);
    localStorage.setItem('foe_health', 100);
    localStorage.setItem('foe_rank', getSiteLevel(website));
    localStorage.setItem('player_health', 100);
    Window.storage.callback = callback;
}

function defend(website) {
    var health_loss = 0;
    if (toInt(localStorage.getItem('foe_rank')) > toInt(localStorage.getItem('player_rank'))) {
        health_loss = 15; // FIXME - make this more proportional
    } else {
        health_loss = 45; // FIXME - make this more proportional
    }
    localStorage.setItem("player_health", localStorage.getItem("player_health") - health_loss);
    if (toInt(localStorage.getItem("player_health")) <= 0) {
        lose();
    }
}

function attack() {
    var health_loss = 0;
    if (localStorage.getItem('foe_rank') < localStorage.getItem('player_rank') ) {
        health_loss = 15; // FIXME - make this more proportional
    } else {
        health_loss = 45; // FIXME - make this more proportional
    }
    localStorage.getItem('foe_health') -= health_loss;
    if (localStorage.getItem('foe_health') <= 0) {
        win();
    }
}

function escape() {
    if (Math.random() < 0.10) {
        Window.storage.callback();
    } else {
        Window.alert("Can't escape!");
    }
}

function catchPokemon() {
    if (getFoeHealth() < 50) {
        if (Math.random() < 0.95) {
            Window.alert("You've won the battle!");
            //TODO: take the new pokemon
        }
    }
}

function lose() {}

function win() {}

