var closeCallback;

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
    var normalized = health / 100 * 170;
    document.getElementById("enemy_health").style["width"] = normalized+"px";
}

function setPlayerHealth(health) {
    if (health < 0) health = 0;
    console.log("Setting player health = " + health);
    chrome.storage.local.set({'player_health': health}, null);
    var normalized = health / 100 * 170;
    document.getElementById("player_health").style["width"] = normalized+"px";
}

function toInt(num) {
    return parseInt(num, 10);
}

function startGame(playerWebsite) {
    console.log("Game started");
    chrome.storage.local.set({'player': playerWebsite}, null);
}

function startBattle(website, callback) {
    console.log("battle started");

    chrome.storage.local.get("player", function(playerWebsite) {
        get_rank(playerWebsite.player, function(rank) {
            console.log("Player rank = " + rank);
            $("#player_rank").html(rank);
            var name = playerWebsite.player;
            name = name.replace("http://", "");
            name = name.replace("https://", "");
            name = name.replace("www.", "");
            $("#player_name").html(name);
            $("#player_name2").html(name);
            $("#you").attr("src", playerWebsite.player+"/favicon.ico");
            chrome.storage.local.set({'player_rank': rank}, null);
        });
    });

    chrome.storage.local.set({'foe': website}, null);
    get_rank(website, function(rank) {
        console.log("Foe rank = " + rank);
        $("#enemy_rank").html(rank);
        $("#enemy_name").html(window.location.host);
        $("#enemy").attr("src", website+"/favicon.ico");
        chrome.storage.local.set({'foe_rank':rank}, null);
    });
    setPlayerHealth(100);
    setFoeHealth(100);
    closeCallback = callback;

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
    draw_fire_ball(475,30,80,150);
    var health_loss = 0;
    chrome.storage.local.get('foe_rank', function(data) {
        chrome.storage.local.get('player_rank', function(data2) {
            foe_rank = data.foe_rank;
            player_rank = data2.player_rank;
            health_loss = damage(player_rank, foe_rank);
            chrome.storage.local.get('player_health', function(health_data) {
               newHealth = toInt(health_data.player_health) - health_loss;
               setPlayerHealth(newHealth);
               chrome.storage.local.get('player_health', function(new_health) {
                   if (new_health.player_health <= 0) {
                        window.alert("Oh no, you lost the battle!");
                        closeCallback();
                   }
               });
            });
        });
    });
}

function attack() {
    draw_fire_ball(80,150,475,30);
    var health_loss = 0;
    chrome.storage.local.get('foe_rank', function(data) {
        chrome.storage.local.get('player_rank', function(data2) {
            foe_rank = data.foe_rank;
            player_rank = data2.player_rank;
            health_loss = damage(foe_rank, player_rank);
            chrome.storage.local.get('foe_health', function(health_data) {
               newHealth = toInt(health_data.foe_health) - health_loss;
               setFoeHealth(newHealth);
               chrome.storage.local.get('foe_health', function(new_health) {
                if (new_health.foe_health <= 0) {
                    window.alert("You won the battle!");
                    closeCallback();
               }
               });
            });
        });
    });
}

// amount of loss that @player should incur
function damage(player, foe) {
    var player_rank = toInt(player);
    var foe_rank = toInt(foe);
    var diff = player_rank - foe_rank;
    if (diff < 0) {
        // @player is much more powerful than foe
        return -2.5 / diff;
    } else {
        // @foe is more powerful than @player
        return diff / 0.25;
    }
}

function escape() {
    if (Math.random() < 0.95) {
        window.alert("You escaped safely!");
        closeCallback();
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
                closeCallback();
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
