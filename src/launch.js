var path = require('path');
var server = require('basisjs-tools-server');
var rempl = require('rempl/server');

process.on('message', (m) => {
    let [command, port] = m.split(' ');

    if (command === 'launch') {
        process.chdir(path.resolve(path.dirname(require.resolve('rempl/server')), 'client/dist'));
        server.launch({
            port: port,
            rempl: rempl,
            remplStandalone: true
        });
    }
});
