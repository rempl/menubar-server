var path = require('path');
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var MenuItem = electron.MenuItem;
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
    if (appIcon) {
        appIcon.setImage(iconPath.active);
    }
}

function killServer() {
    if (server) {
        server.kill();
        if (appIcon) {
            appIcon.setImage(iconPath.inactive);
        }
    } else {
        console.log('Nothing to stop');
    }
}

function showTab() {
    setTimeout(function() {
        hasTab = true;
        shell.openExternal(`http://localhost:${PORT}/basisjs-tools/devtool/`);
    }, 500);
}

// available on MacOS only
if (app.dock) {
    app.dock.hide();
}

app.on('ready', function() {
    appIcon = new Tray(iconPath.inactive);

    startServer();

    var startMenuItem = new MenuItem({
        label: `Start at ${PORT}`,
        enabled: false,
        click: function() {
            if (!server || server.killed || !server.connected) {
                startServer();
                contextMenu.items[0].enabled = false;
                contextMenu.items[1].enabled = true;
            }

            if (!hasTab) {
                showTab();
            }
        }
    });
    var stopMenuItem = new MenuItem({
        label: 'Stop',
        enabled: true,
        sublabel: `Running at ${PORT}`,
        click: function() {
            console.log('click stop');
            killServer();
            contextMenu.items[1].enabled = false;
            contextMenu.items[0].enabled = true;
        }
    });
    var contextMenu = Menu.buildFromTemplate([
        startMenuItem,
        stopMenuItem,
        {
            label: 'Open new tab',
            click: function() {
                showTab();
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
