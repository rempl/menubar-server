var server = require('basisjs-tools-server/lib/index.js');

process.on('message', (m) => {
    let [command, port] = m.split(' ');

    if (command === 'launch') {
        server.launch({
            port: port ? Number(port) : 8004
        });
    }
});
