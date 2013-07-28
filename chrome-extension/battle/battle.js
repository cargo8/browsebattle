window.storage = {};

function getFoeHealth() {
    return parseInt(sessionStorage.getItem("foe_health"), 10);
}

function setFoeHealth(health) {
    if (health < 0) health = 0;
    console.log("Setting enemy health = " + health);
    sessionStorage.setItem("foe_health", health);
    normalized = health / 100 * 170;
    document.getElementById("enemy_health").style["width"] = normalized+"px";
}

function setPlayerHealth(health) {
    if (health < 0) health = 0;
    console.log("Setting player health = " + health);
    sessionStorage.setItem("player_health", health);
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
    sessionStorage.setItem('player', playerWebsite);
    setPlayerHealth(100);
    sessionStorage.setItem('player_rank', getSiteLevel(playerWebsite));
}

function startBattle(website, callback) {
    console.log("battle started");
    sessionStorage.setItem('foe', website);
    sessionStorage.setItem('foe_rank', getSiteLevel(website));
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
    console.log("Player: " + sessionStorage.getItem("player"));
}

function defend() {
    var health_loss = 0;
    if (toInt(sessionStorage.getItem('foe_rank')) > toInt(sessionStorage.getItem('player_rank'))) {
        health_loss = 15; // FIXME - make this more proportional
    } else {
        health_loss = 45; // FIXME - make this more proportional
    }
    newHealth = toInt(sessionStorage.getItem('player_health')) - health_loss;
    setPlayerHealth(newHealth);
    if (toInt(sessionStorage.getItem("player_health")) <= 0) {
        window.alert("Oh no, you lost the battle!");
        window.storage.callback();
    }
}

function attack() {
    var health_loss = 0;
    if (toInt(sessionStorage.getItem('foe_rank')) < toInt(sessionStorage.getItem('player_rank'))) {
        health_loss = 15; // FIXME - make this more proportional and edit the HTML to reflect changes
    } else {
        health_loss = 45; // FIXME - make this more proportional
    }
    newHealth = toInt(sessionStorage.getItem('foe_health')) - health_loss;
    setFoeHealth(newHealth);
    if (sessionStorage.getItem('foe_health') <= 0) {
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
            sessionStorage.setItem('player', sessionStorage.getItem("foe"));
            sessionStorage.setItem('player_health', 100);
            sessionStorage.setItem('player_rank', getSiteLevel(sessionStorage.getItem("foe")));
            window.storage.callback();
            return true;
        }
    }
    window.alert("It didn't work! The pokemon escaped!");
    return false;
}

function win() {
    // $("#enemy").animate(properties, duration, easing, complete, properties, options)
}
