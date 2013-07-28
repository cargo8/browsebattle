window.storage = {};

function getFoeHealth() {
    return parseInt(localStorage.getItem("foe_health"), 10);
}

function setFoeHealth(health) {
    console.log("Setting enemy health = " + health);
    localStorage.setItem("foe_health", health);
    normalized = health / 100 * 170;
    document.getElementById("enemy_health").style["width"] = normalized+"px";
}

function setPlayerHealth(health) {
    console.log("Setting player health = " + health);
    localStorage.setItem("player_health", health);
    normalized = health / 100 * 170;
    document.getElementById("player_health").style["width"] = normalized+"px";
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
              xmlDoc=parser.parseFromString(data,"text/xml");
              }
            else // Internet Explorer
              {
              xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
              xmlDoc.async=false;
              xmlDoc.loadXML(data);
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
    localStorage.setItem('player', playerWebsite);
    setPlayerHealth(100);
    localStorage.setItem('player_rank', getSiteLevel(playerWebsite));
}

function startBattle(website, callback) {
    console.log("battle started");
    localStorage.setItem('foe', website);
    localStorage.setItem('foe_rank', getSiteLevel(website));
    setFoeHealth(100);
    setPlayerHealth(100);
    window.storage.callback = callback;

    $("#attack").click(function() {
        console.log("#attack.click");
        attack();
        window.setTimeout(defend, 1500);
    });

    $("#run").click(function() {
        console.log("#run.click");
        escape();
    });

    $("#catchPokemon").click(function() {
        console.log("#catch.click");
        if (!catchPokemon()) {
            defend();
        }
    });

    console.log("Enemy: " + website);
    console.log("Player: " + localStorage.getItem("player"));
}

function defend() {
    var health_loss = 0;
    if (toInt(localStorage.getItem('foe_rank')) > toInt(localStorage.getItem('player_rank'))) {
        health_loss = 15; // FIXME - make this more proportional
    } else {
        health_loss = 45; // FIXME - make this more proportional
    }
    newHealth = localStorage.getItem('player_health') - health_loss;
    setPlayerHealth(newHealth);
    if (toInt(localStorage.getItem("player_health")) <= 0) {
        window.alert("Oh no, you lost the battle!");
        window.storage.callback();
    }
}

function attack() {
    var health_loss = 0;
    if (localStorage.getItem('foe_rank') < localStorage.getItem('player_rank') ) {
        health_loss = 15; // FIXME - make this more proportional and edit the HTML to reflect changes
    } else {
        health_loss = 45; // FIXME - make this more proportional
    }
    newHealth = localStorage.getItem('foe_health') - health_loss;
    setFoeHealth(health_loss);
    if (localStorage.getItem('foe_health') <= 0) {
        window.alert("You won the battle!");
        window.storage.callback();
    }
}

function escape() {
    if (Math.random() < 0.95) {
        window.storage.callback();
    } else {
        window.alert("Can't escape!");
    }
}

function catchPokemon() {
    if (getFoeHealth() < 50) {
        if (Math.random() < 0.95) {
            window.alert("Nice! You just caught " + window.location.origin + " !");
            // take the new pokemon
            localStorage.setItem('player', localStorage.getItem("foe"));
            localStorage.setItem('player_health', 100);
            localStorage.setItem('player_rank', getSiteLevel(localStorage.getItem("foe")));
            window.storage.callback();
            return true;
        }
    }
    window.alert("It didn't work! The pokemon escaped!");
    return false;
}
