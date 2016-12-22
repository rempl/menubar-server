const DEFAULT_PORT = 8177;

var path = require('path');
var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var MenuItem = electron.MenuItem;
var Tray = electron.Tray;
var BrowserWindow = electron.BrowserWindow;

var fork = require('child_process').fork;
var shell = require('electron').shell;
var port = DEFAULT_PORT;

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
        contextMenu.items[0].visible = false;
        contextMenu.items[1].visible = true;
        contextMenu.items[2].visible = true;
    }
}

function killServer() {
    if (server) {
        server.kill();

        if (appIcon) {
            appIcon.setImage(iconPath.inactive);
        }

        if (contextMenu) {
            contextMenu.items[0].visible = true;
            contextMenu.items[1].visible = false;
            contextMenu.items[2].visible = false;
        }
    }
}

function showTab() {
    setTimeout(function() {
        hasTab = true;
        shell.openExternal('http://localhost:' + port);
    }, 500);
}

function sync(newPort) {
    port = isNaN(newPort) ? DEFAULT_PORT : Number(newPort);
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
    win = new BrowserWindow({
        title: 'Change server port',
        show: false,
        width: 250,
        height: 100,
        closable: false,
        minimizable: false,
        resizable: false,
        fullscreenable: false
    });
    win.setPosition(900, 25);
    win.loadURL('file://' + __dirname + '/index.html');

    appIcon = new Tray(iconPath.inactive);

    startServer();

    var startMenuItem = new MenuItem({
        label: 'Start server',
        visible: false,
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
        label: 'Stop server',
        visible: true,
        click: function() {
            killServer();
        }
    });
    contextMenu = Menu.buildFromTemplate([
        startMenuItem,
        stopMenuItem,
        {
            label: 'Open sandbox',
            visible: true,
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
                killServer();
                win.setClosable(true);
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
