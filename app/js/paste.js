var gui = window.require('nw.gui');
var child_process = window.require('child_process');
var clipboard = require('./clipboard.js');

var script = 'osascript -e \'tell application "System Events" to keystroke tab using {command down} \n delay 0.5 \n tell application "System Events" to keystroke "v" using command down \n delay 0.5 \'';

module.exports = function(text) {
  if(clipboard.get('text') !== text) {
    clipboard.set(text, 'text');
  }
  child_process.execSync(script);
}
