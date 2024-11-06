function Saving() {}


Saving.unblockKeyboard = false;
Saving.open = false;


Saving.init = function() {
    jQuery("#open_save_button").click(function() {
        Saving.openSave();
    });
    jQuery("#open_load_button").click(function() {
        Saving.openLoad();
    });
    jQuery("#cancel_load_button").click(function() {
        Saving.close();
    });
    jQuery("#done_button").click(function() {
        Saving.close();
    });
    jQuery("#load_button").click(function() {
        Saving.load();
    });
    jQuery("#cancel_button").click(function() {
        Saving.close();
    });
    Saving.hideAll();
};


Saving.hideAll = function() {
    jQuery("#save_menu").hide();
    jQuery("#save").hide();
    jQuery("#load").hide();
};


Saving.close = function() {
    jQuery("#save_overlay").hide();
    Saving.hideAll();
    Saving.unblockKeyboard = false;
    if(game.state == game.STATES["menu"]) {
        game.STATES["menu"].startLoadGame = false;
    }
    Saving.open = false;
};


Saving.openMenu = function() {
    jQuery("#save_overlay").show();
    Saving.hideAll();
    jQuery("#save_menu").show();
    Saving.open = true;
};


Saving.openSave = function() {
    jQuery("#save_overlay").show();
    Saving.hideAll();
    jQuery("#process_desc").show();
    jQuery("#copy_desc").hide();
    jQuery("#save_text").hide().val("");
    jQuery("#save").show();
    window.setTimeout(function() {
        jQuery("#save_text").val(Saving.getSaveText()).show();
        jQuery("#process_desc").hide();
        jQuery("#copy_desc").show();
        Saving.unblockKeyboard = true;
    }, 50);
};


Saving.openLoad = function() {
    jQuery("#save_overlay").show();
    Saving.hideAll();
    jQuery("#load_text").val("");
    jQuery("#load").show();
    Saving.unblockKeyboard = true;
};


Saving.getSaveText = function() {
    var o = {
        map : map.m,
        playerInv : player.inv,
        playerStats : player.stats,
        achievements : achievements.state,
        construction : construction.builds
    };
    return JSON.stringify(o);
};


Saving.load = function() {
    var loadText = jQuery("#load_text").val();

    var loadFile;
    try {
        loadFile = JSON.parse(loadText);
    } catch(e) {
        alert("ERROR IN SAVE CODE:\n\n" + e);
        return;
    }
    if(!loadFile.hasOwnProperty("map")) {
        alert("ERROR IN SAVE CODE:\n\nNo map data found.");
        return;
    }
    if(!loadFile.hasOwnProperty("playerInv")) {
        alert("ERROR IN SAVE CODE:\n\nNo resource inventory found.");
        return;
    }
    if(!loadFile.hasOwnProperty("playerStats")) {
        alert("ERROR IN SAVE CODE:\n\nNo player stats found.");
        return;
    }
    if(!loadFile.hasOwnProperty("achievements")) {
        alert("ERROR IN SAVE CODE:\n\nNo achievements found.");
        return;
    }
    if(!loadFile.hasOwnProperty("construction")) {
        alert("ERROR IN SAVE CODE:\n\nNo construction state found.");
        return;
    }
    Saving.close();
    jQuery("#load_text").val("");
    game.STATES["ingame"].loadFile = loadFile;
    if(game.state != game.STATES["ingame"]) {
        game.setState("ingame");
    }
};