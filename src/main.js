var path = require('path');
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;

var fork = require('child_process').fork;
var shell = require('electron').shell;
var PORT = 8003;

var platform = process.platform === 'win32' ? 'windows' : 'mac';
var iconPath = {
    active: path.resolve(__dirname, `../res/${platform}-icon.png`),
    inactive: path.resolve(__dirname, `../res/${platform}-icon-gray.png`)
};

var appIcon;
var hasTab = false;
var server;

function startServer() {
    server = fork(path.resolve(__dirname, './launch.js'));
    server.send(`launch ${PORT}`);
    appIcon.setImage(iconPath.active);
}

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
    appIcon = new Tray(iconPath.inactive);

    startServer();

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start',
            click: function() {
                if (!server || server.killed || !server.connected) {
                    startServer();
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
                appIcon.setImage(iconPath.inactive);
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
