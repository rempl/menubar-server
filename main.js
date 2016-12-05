const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray

const fork = require('child_process').fork;
const shell = require('electron').shell;

var my_launch;
var was_stopped = false

function kill_server() {
    if (my_launch) {
        my_launch.disconnect()
    } else {
        console.log('Nothing to stop')
    }
}

app.on('ready', function () {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
    const iconPath = path.join(__dirname, iconName)
    appIcon = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start',
            click: function () {
                console.log('click start')
                if (!my_launch || my_launch.killed  || !my_launch.connected) {
                    my_launch = fork('./launch.js');
                } 
    
                setTimeout(function() {
                    my_launch.send('launch')
                })

                setTimeout(function() {
                    shell.openExternal('http://localhost:8004/basisjs-tools/devtool/');
                })
            }
        },
        {
            label: 'Stop',
            click: function () {
                console.log('click stop')
                kill_server();
            }
        },
        {
            label: 'Quit',
            click: function () {
                console.log('click quit')
                kill_server();
                app.quit()
            }
        }
    ])
    appIcon.setToolTip('Electron Demo in the tray.')
    appIcon.setContextMenu(contextMenu)
})

app.on('window-all-closed', function () {
  if (appIcon) appIcon.destroy()
})
