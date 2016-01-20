// Load native UI library.
var gui = require('nw.gui');

// Get the current window
var win = gui.Window.get();

var option = {
  key : "Ctrl+Shift+V",
  active : function() {
    console.log("Global desktop keyboard shortcut: " + this.key + " active.");
  },
  failed : function(msg) {
    // :(, fail to register the |key| or couldn't parse the |key|.
    console.log(msg);
  }
};

var util = require('util');
console.log(util.inspect(gui));

// Create a shortcut with |option|.
var shortcut = new gui.Shortcut(option);

// Register global desktop shortcut, which can work without focus.
gui.App.registerGlobalHotKey(shortcut);

win.on('close', function () {
  // Unregister the global desktop shortcut.
  gui.App.unregisterGlobalHotKey(shortcut);
});
