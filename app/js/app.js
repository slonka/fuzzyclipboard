var clipboard = require('../js/clipboard.js');
var paste = require('../js/paste.js');
var losefocus = require('../js/losefocus.js');
var gui = require('nw.gui');
var win = gui.Window.get();

var app = angular.module('app', ['angular.filter', 'focus-if']);
app.controller('CommandListController', function($scope, $interval) {
    var commandList = this;

    commandList.searchChanged = function() {
      commandList.focusIndex = 0;
    }

    commandList.clipboardHistory = [{
        text: clipboard.get('text')
    }];

    $interval(function() {
        var text = clipboard.get('text');
        if (text !== commandList.clipboardHistory[0].text) {
            commandList.clipboardHistory.unshift({
                text: text
            });
        }
        if (commandList.clipboardHistory.length > 1000) {
            commandList.clipboardHistory.pop();
        }
    }, 2000);

    commandList.paste = function(index) {
        var record = $scope.shownCommands[index];
        console.log('pasting: ', record);
        win.blur();
        win.hide();
        paste(record.text);
    };

    commandList.focusIndex = 0;
    commandList.keys = [];
    commandList.keys.push({
        code: 13,
        action: function() {
            commandList.paste(commandList.focusIndex);
        }
    });
    commandList.keys.push({
        code: 38,
        action: function() {
          if(commandList.focusIndex === 0) {
            commandList.focusIndex = $scope.shownCommands.length - 1;
          } else {
            commandList.focusIndex--;
          }
        }
    });
    commandList.keys.push({
        code: 40,
        action: function() {
          if(commandList.focusIndex === $scope.shownCommands.length - 1) {
            commandList.focusIndex = 0;
          } else {
            commandList.focusIndex++;
          }
        }
    });
    commandList.keys.push({
        code: 27,
        action: function() {
            win.minimize();
            losefocus();
        }
    });

    $scope.$on('keydown', function(msg, obj) {
        var code = obj.code;
        commandList.keys.forEach(function(o) {
            if (o.code !== code) {
                return;
            }
            o.action();
            $scope.$apply();
        });
    });
});

app.directive('keyTrap', function() {
    return function(scope, elem) {
        elem.bind('keydown', function(event) {
            scope.$broadcast('keydown', {
                code: event.keyCode
            });
        });
    };
});
