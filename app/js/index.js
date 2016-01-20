var util = require('util');
var gui = require('nw.gui');
var win = gui.Window.get();
var clipboard = require('../js/clipboard.js');

var clipboardHistory = [''];
setInterval(function() {
  var text = clipboard.get('text');
  if(text !== clipboardHistory[0]) {
    clipboardHistory.unshift(text)
  }
  console.log(text, clipboardHistory);
}, 2000);

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
        icon: './icon.png',
        alticon: './icon.png'
    });

    // Show window and remove tray when clicked
    tray.on('click', function() {
        win.show();
        this.remove();
        tray = null;
    });
});
