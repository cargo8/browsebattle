var closeCallback;
var gameOver = false;
var msg;
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
    if (health < 40) {
        $("#enemy_health").css("background-color", "#FF0000");
    };
}

function setPlayerHealth(health) {
    if (health < 0) health = 0;
    console.log("Setting player health = " + health);
    chrome.storage.local.set({'player_health': health}, null);
    var normalized = health / 100 * 170;
    document.getElementById("player_health").style["width"] = normalized+"px";
    if (health < 40) {
        $("#player_health").css("background-color", "#FF0000");
    }
}

function toInt(num) {
    return parseInt(num, 10);
}

function startGame(playerWebsite) {
    console.log("Game started");
    chrome.storage.local.set({'player': playerWebsite}, null);
}

function urlClean(url) {
    url = url.replace("http://", "");
    url = url.replace("https://", "");
    url = url.replace("www.", "");
    url = url.replace("/", "");
    return url;
}

function rankToLevel(rank) {
    if (rank > 100) {
        rank = 1;
    } else {
        rank = 100 - rank;
    }
    return rank;
}

function hideButtons() {
    $("#attack").hide();
    $("#run").hide();
    $("#catchPokemon").hide();
}

function showButtons() {
    $("#attack").show();
    $("#run").show();
    $("#catchPokemon").show();
}

function startBattle(website, callback) {
    msg = new MSG();
    msg.create($("#msgbox"));
    $('#msgbox').click(function(){
        msg.consume();
    });
    hideButtons();
    chrome.storage.local.get("player", function(playerWebsite) {
        get_rank(playerWebsite.player, function(rank) {
            console.log("Player rank = " + rankToLevel(rank));
            $("#player_rank").html(rankToLevel(rank));
            var name = urlClean(playerWebsite.player);
            $("#player_name").html(name);
            $("#player_name2").html(name);
            msg.add_msg("A wild " + urlClean(website) + " appears!", null, false);
            msg.add_msg("What is " + name + " going to do?", function(){
                showButtons();
            }, null, false);
            $("#you").attr("src", "http://"+name+"/favicon.ico");
            chrome.storage.local.set({'player_rank': rankToLevel(rank)}, null);
        });
    });

    chrome.storage.local.set({'foe': website}, null);
    get_rank(website, function(rank) {
        $("#enemy_rank").html(rankToLevel(rank));
        $("#enemy_name").html(window.location.host);
        var name = urlClean(website);
        $("#enemy").attr("src", "http://"+name+"/favicon.ico");
        chrome.storage.local.set({'foe_rank':rankToLevel(rank)}, null);
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
        hideButtons();
        console.log("#run.click");
        if (!escape()) {
            defend();
        }
    });

    $("#catchPokemon").click(function() {
        hideButtons();
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
    $("#enemy").addClass('bounceInUp');
    setTimeout(function(){
        $("#enemy").removeClass('bounceInUp');
    }, 1000);
    draw_fire_ball(475,30,80,150, function() {
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
                       chrome.storage.local.get("player", function(playerWebsite) {
                           var name = urlClean(playerWebsite.player);
                           msg.add_msg("What is " + name + " going to do?", function(){
                               showButtons();
                           }, null, false);
                       });
                       if (new_health.player_health <= 0) {
                            if (!gameOver) {
                                gameOver = true;
                                window.alert("Oh no, you lost the battle!");
                                closeCallback();
                            }
                       }
                   });
                });
            });
        });
    });
}

function attack() {
    msg.add_msg("", null, true);
    msg.consume();
    hideButtons();
    $("#you").addClass('bounceInUp');
    setTimeout(function(){
        $("#you").removeClass('bounceInUp');
    }, 1000);
    draw_fire_ball(80,150,475,30, function() {
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
                            if (!gameOver) {
                                gameOver = true;
                                window.alert("You won the battle!");
                                closeCallback();
                            }
                        }
                   });
                });
            });
        });
    });
}

// amount of loss that @defender should incur
function damage(defender, attacker, criticalCallback) {
    var defender_rank = toInt(defender);
    var attacker_rank = toInt(attacker);
    var diff = defender_rank - attacker_rank;
    var dmg = 20;
    if (diff === 0) {
        console.log("Same level pokemon");
        return dmg;
    } else if (diff > 0) {
        // @defender is more powerful than foe
        if (diff < 5) {
            diff *= 30;
        } else if (diff < 20) {
            diff *= 3;
        } else if (diff < 50) {
            diff *= 2;
        }
        dmg = 450/diff;
        if (Math.random() < 0.10) {
            dmg *= 1.5;
            msg.add_msg("Attack inflicted critical damage!", null, false);
            msg.consume();
        }
        if (dmg >= 100) {
            dmg = 95;
        }
        console.log(dmg);
        return dmg;
    } else {
        // @attacker is more powerful than @defender
        diff = -diff;
        if (diff < 5) {
            diff *= 70;
        } else if (diff < 15) {
            diff *= 10;
        } else if (diff < 50) {
            diff *= 3;
        }
        dmg = diff / 4;
       if (Math.random() < 0.10) {
            dmg *= 1.5;
            msg.add_msg("Attack inflicted critical damage!", null, true);
            msg.consume();
        }
        if (dmg >= 100) {
            dmg = 95;
        }
        console.log(dmg);
        return dmg;
    }
}

function escape() {
    if (Math.random() < 0.95) {
        if (!gameOver) {
            gameOver = true;
            msg.add_msg("You escaped safely!", function(){
                closeCallback();
            }, false);
            return true;
        }
    } else {
        msg.add_msg("Can't escaped!", null, false);
        return false;
    }
}

function catchPokemon(callback) {
    getFoeHealth(function(health) {
        if ((health < 30 && Math.random() < 0.95) ||
            (health < 50 && Math.random() < 0.60) ||
            (health < 75 && Math.random() < 0.35) ||
            (health < 95 && Math.random() < 0.15)) {
                // take the new pokemon
                console.log("pokemon was caught!");
                callback(true);
                chrome.storage.local.get('foe', function(foe) {
                    chrome.storage.local.set({'player': foe.foe}, null);
                    chrome.storage.local.set({'player_health': 100}, null);
                    get_rank(foe.foe, function(rank) {
                        chrome.storage.local.set({'player_rank': rankToLevel(rank)}, null);
                    });
                });
                closeCallback();
                return;
            }
        callback(false);
        return;
    });
}
