const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray

const fork = require('child_process').fork;
const my_launch = fork('./launch.js');

const shell = require('electron').shell;

app.on('ready', function () {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
    const iconPath = path.join(__dirname, iconName)
    appIcon = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start',
            click: function () {
                console.log('click start')
                my_launch.send('launch')

                shell.openExternal('http://localhost:8004/basisjs-tools/devtool/');
            }
        },
        {
            label: 'Stop',
            click: function () {
                console.log('click stop')
                my_launch.send('stop')
            }
        },
        {
            label: 'Quit',
            click: function () {
                console.log('click quit')
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
