var child_process = window.require('child_process');

module.exports = function() {
  child_process.execSync('osascript -e \'tell application "System Events" to keystroke tab using {command down}\'');
}
