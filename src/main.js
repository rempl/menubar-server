var path = require('path');
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var MenuItem = electron.MenuItem;
var Tray = electron.Tray;
var BrowserWindow = electron.BrowserWindow;

var fork = require('child_process').fork;
var shell = require('electron').shell;
var PORT = 8177;
var port = PORT;

var platform = process.platform === 'win32' ? 'windows' : 'mac';
var iconPath = {
    active: path.resolve(__dirname, `../res/${platform}-icon.png`),
    inactive: path.resolve(__dirname, `../res/${platform}-icon-gray.png`)
};

var appIcon = null;
var hasTab = false;
var server = null;
var win = null;
var contextMenu = null;

function startServer() {
    server = fork(path.resolve(__dirname, './launch.js'));
    server.send(`launch ${port}`);

    if (appIcon) {
        appIcon.setImage(iconPath.active);
    }

    if (contextMenu) {
        contextMenu.items[0].enabled = false;
        contextMenu.items[1].enabled = true;
        contextMenu.items[2].enabled = true;
    }
}

function killServer() {
    if (server) {
        server.kill();

        if (appIcon) {
            appIcon.setImage(iconPath.inactive);
        }

        if (contextMenu) {
            contextMenu.items[0].enabled = true;
            contextMenu.items[1].enabled = false;
            contextMenu.items[2].enabled = false;
        }
    } else {
        console.log('Nothing to stop');
    }
}

function showTab() {
    setTimeout(function() {
        hasTab = true;
        shell.openExternal(`http://localhost:${port}/basisjs-tools/devtool/`);
    }, 500);
}

function sync(newPort) {
    port = newPort;
    killServer();
    startServer();
    showTab();
}

global.config = {
    port: port,
    sync: sync
};

// available on MacOS only
if (app.dock) {
    app.dock.hide();
}

app.on('ready', function() {
    win = new BrowserWindow({ show: false , width: 300, height: 80, frame: false });
    win.setPosition(1000, 25);
    win.loadURL('file://' + __dirname + '/index.html');

    appIcon = new Tray(iconPath.inactive);

    startServer();

    var startMenuItem = new MenuItem({
        label: `Start rempl`,
        enabled: false,
        click: function() {
            if (!server || server.killed || !server.connected) {
                startServer();
            }

            if (!hasTab) {
                showTab();
            }
        }
    });
    var stopMenuItem = new MenuItem({
        label: `Stop rempl`,
        enabled: true,
        click: function() {
            console.log('click stop');
            killServer();
        }
    });
    var contextMenu = Menu.buildFromTemplate([
        startMenuItem,
        stopMenuItem,
        {
            label: 'Open sandbox',
            enabled: true,
            click: function() {
                showTab();
            }
        },
        {
            label: 'Change port',
            click: function() {
                win.show();
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
