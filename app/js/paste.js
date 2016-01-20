var gui = window.require('nw.gui');
var child_process = window.require('child_process');
var clipboard = require('./clipboard.js');

var script = function(text) {
  return 'osascript -e \'tell application "System Events" to keystroke tab using {command down} \n delay 0.5 \n tell application "System Events" to keystroke "v" using command down\'';
}

module.exports = function(text) {
  var old = clipboard.get('text');
  clipboard.set(text, 'text');
  child_process.execSync(script(text));
  clipboard.set(old, 'text');
}
