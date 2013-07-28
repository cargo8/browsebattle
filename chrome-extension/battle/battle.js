window.storage = {};

function getFoeHealth(callback) {
    var health = 100;
    chrome.storage.local.get('foe_health', function(data) {
        health = parseInt(data.foe_health, 10);
        callback(health);
    });
}

function setFoeHealth(health) {
    if (health < 0) health = 0;
    console.log("Setting enemy health = " + health);
    chrome.storage.local.set({'foe_health': health}, null);
    normalized = health / 100 * 170;
    document.getElementById("enemy_health").style["width"] = normalized+"px";
}

function setPlayerHealth(health) {
    if (health < 0) health = 0;
    console.log("Setting player health = " + health);
    chrome.storage.local.set({'player_health': health}, null);
    normalized = health / 100 * 170;
    document.getElementById("player_health").style["width"] = normalized+"px";
}

function toInt(num) {
    return parseInt(num, 10);
}

function startGame(playerWebsite) {
    console.log("Game started");
    chrome.storage.local.set({'player': playerWebsite}, null);
    get_rank(playerWebsite, function(rank) {
        console.log("Player rank = " + rank);
        chrome.storage.local.set({'player_rank': rank}, null);
    });
}

function startBattle(website, callback) {
    console.log("battle started");
    chrome.storage.local.set({'foe': website}, null);
    get_rank(website, function(rank) {
        console.log("Foe rank = " + rank);
        chrome.storage.local.set({'foe_rank':rank}, null);
    });
    setPlayerHealth(100);
    setFoeHealth(100);
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
        catchPokemon(function(success) {
            if (success) {
                window.alert("Nice! You just caught " + window.location.origin + " !");
            } else {
                window.alert("It didn't work! The pokemon escaped!");
                defend();
            }
        });
    });

    console.log("Enemy: " + website);
    chrome.storage.local.get('player', function(data) {
        console.log("Player: " + data.player);
    });
}

function defend() {
    var health_loss = 0;
    chrome.storage.local.get('foe_rank', function(data) {
        chrome.storage.local.get('player_rank', function(data2) {
            foe_rank = data.foe_rank;
            player_rank = data2.player_rank;
            if (toInt(foe_rank) > toInt(player_rank)) {
                health_loss = 15; // FIXME - make this more proportional
            } else {
                health_loss = 45; // FIXME - make this more proportional
            }
            chrome.storage.local.get('player_health', function(health_data) {
               newHealth = toInt(health_data.player_health) - health_loss;
               setPlayerHealth(newHealth);
               if (health_data.player_health <= 0) {
                    window.alert("oh no, you lost the battle!");
                    window.storage.callback();
               }
            });
        });
    });
}

function attack() {
    var health_loss = 0;
    chrome.storage.local.get('foe_rank', function(data) {
        chrome.storage.local.get('player_rank', function(data2) {
            foe_rank = data.foe_rank;
            player_rank = data2.player_rank;
            if (toInt(foe_rank) < toInt(player_rank)) {
                health_loss = 15; // FIXME - make this more proportional and edit the HTML to reflect changes
            } else {
                health_loss = 45; // FIXME - make this more proportional
            }
            chrome.storage.local.get('foe_health', function(health_data) {
               newHealth = toInt(health_data.foe_health) - health_loss;
               setFoeHealth(newHealth);
               if (health_data.foe_health <= 0) {
                    window.alert("You won the battle!");
                    window.storage.callback();
               }
            });
        });
    });
}

function escape() {
    if (Math.random() < 0.95) {
        window.alert("You escaped safely!");
        window.storage.callback();
    } else {
        window.alert("Can't escape!");
    }
}

function catchPokemon(callback) {
    getFoeHealth(function(health) {
        if (health < 50) {
            if (Math.random() < 0.95) {
                // take the new pokemon
                console.log("pokemon was caught!");
                callback(true);
                chrome.storage.local.get('foe', function(foe) {
                    chrome.storage.local.set({'player': foe.foe}, null);
                    chrome.storage.local.set({'player_health': 100}, null);
                    get_rank(foe.foe, function(rank) {
                        chrome.storage.local.set({'player_rank': rank}, null);
                    });
                });
                window.storage.callback();
                return;
            }
        }
        console.log("pokemon got aways!");
        callback(false);
        return;
    });
}

function lose() {}

function win() {}
