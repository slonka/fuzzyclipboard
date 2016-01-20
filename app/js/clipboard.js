var gui = window.require('nw.gui');
var child_process = window.require('child_process');
var clipboard = gui.Clipboard.get();

module.exports = {
    get: function(type) {
        if (process.platform == 'darwin') {
            return child_process.execSync('pbpaste', {
                encoding: 'utf8'
            });
        } else {
            return clipboard.get(type);
        }
    }
}
