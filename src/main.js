var path = require('path');
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;
var iconName = '../res/trayIcon.png';

var fork = require('child_process').fork;
var shell = require('electron').shell;
var PORT = 8003;

var appIcon;
var hasTab = false;
var server;

function killServer() {
    if (server) {
        server.kill();
    }
}

app.dock.hide();

app.on('ready', function() {
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start',
            click: function() {
                if (!server || server.killed || !server.connected) {
                    server = fork(path.resolve(__dirname, './launch.js'));
                    server.send(`launch ${PORT}`);
                }

                if (!hasTab) {
                    setTimeout(function() {
                        hasTab = true;
                        shell.openExternal(`http://localhost:${PORT}/basisjs-tools/devtool/`);
                    }, 500);
                }
            }
        },
        {
            label: 'Stop',
            click: function() {
                killServer();
            }
        },
        {
            label: 'Quit',
            click: function() {
                killServer();
                app.quit();
            }
        }
    ]);

    appIcon = new Tray(path.resolve(__dirname, iconName));
    appIcon.setToolTip('Rempl server GUI');
    appIcon.setContextMenu(contextMenu);
});

app.on('window-all-closed', function() {
    if (appIcon) {
        appIcon.destroy();
    }
});
