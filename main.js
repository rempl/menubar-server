var menubar = require('menubar')

var mb = menubar({
    tooltip: 'just click',
    width: 200,
    height: 100
})

const exec = require('child_process').exec;
const bs = exec('./node_modules/basisjs-tools/bin/basis server --dev -p 8123');

mb
    .on('ready', function ready () {
      console.log('app is ready')
    })
    .on('close', function ready () {
        bs.exit()
    })

