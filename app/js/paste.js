var gui = window.require('nw.gui');
var child_process = window.require('child_process');
var clipboard = gui.Clipboard.get();

var script = function(text) {
  return 'osascript -e \'tell application "System Events" to keystroke tab using {command down} \n delay 1.0 \n tell application "System Events" to keystroke "'+text+'"\'';
}

module.exports = function(text) {
    return child_process.execSync(script(text));
}
