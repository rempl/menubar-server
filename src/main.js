var path = require('path');
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;

var fork = require('child_process').fork;
var shell = require('electron').shell;
var PORT = 8003;

var appIcon;
var hasTab = false;
var server;

function killServer() {
    if (server) {
        server.kill();
    } else {
        console.log('Nothing to stop');
    }
}

// available on MacOS only
if (app.dock) {
    app.dock.hide();
}

app.on('ready', function() {
    var platform = process.platform === 'win32' ? 'windows' : 'mac';
    var iconPath = path.resolve(__dirname, `../res/${platform}-icon.png`);
    var inactiveIconPath = path.resolve(__dirname, `../res/${platform}-icon-gray.png`);
    var tooltip = {
        active: `Rempl server is runnning at localhost:${PORT}`,
        inactive: 'Rempl server is not runnning'
    };

    appIcon = new Tray(inactiveIconPath);
    appIcon.setToolTip(tooltip.inactive);

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start',
            click: function() {
                if (!server || server.killed || !server.connected) {
                    server = fork(path.resolve(__dirname, './launch.js'));
                    server.send(`launch ${PORT}`);
                    appIcon.setImage(iconPath);
                    appIcon.setToolTip(tooltip.active);
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
                console.log('click stop');
                killServer();
                appIcon.setImage(inactiveIconPath);
                appIcon.setToolTip(tooltip.inactive);
            }
        },
        {
            label: 'Quit',
            click: function() {
                console.log('click quit');
                killServer();
                app.quit();
            }
        }
    ]);

    appIcon.setContextMenu(contextMenu);
});

app.on('window-all-closed', function() {
    if (appIcon) {
        appIcon.destroy();
    }
});
