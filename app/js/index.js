// Load native UI library.
var gui = require('nw.gui');

// Get the current window
var win = gui.Window.get();

var option = {
    key: "Ctrl+Shift+V",
    active: function() {
        console.log("Global desktop keyboard shortcut: " + this.key + " active.");
    },
    failed: function(msg) {
        // :(, fail to register the |key| or couldn't parse the |key|.
        console.log(msg);
    }
};

var util = require('util');

// Create a shortcut with |option|.
var shortcut = new gui.Shortcut(option);

// Register global desktop shortcut, which can work without focus.
gui.App.registerGlobalHotKey(shortcut);

win.on('close', function() {
    // Unregister the global desktop shortcut.
    gui.App.unregisterGlobalHotKey(shortcut);
    this.close(true);
});

win.minimize();

// Get the minimize event
win.on('minimize', function() {
    // Hide window
    this.hide();

    // Show tray
    tray = new gui.Tray({
        icon: './icon.png'
    });

    // Show window and remove tray when clicked
    tray.on('click', function() {
        win.show();
        this.remove();
        tray = null;
    });
});
