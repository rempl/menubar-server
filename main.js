const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray

const fork = require('child_process').fork
const shell = require('electron').shell
const PORT = 8003

var hasTab = false
var server

function kill_server() {
    if (server) {
        server.kill()
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
                if (!server || server.killed  || !server.connected) {
                    server = fork('./launch.js');
                    server.send(`launch ${PORT}`)
                } 

                if (!hasTab) {
                    setTimeout(function() {
                        hasTab = true
                        shell.openExternal(`http://localhost:${PORT}/basisjs-tools/devtool/`);
                    }, 500)
                }
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
