const server = require('basisjs-tools-server/lib/index.js')

process.on('message', (m) => {
    console.log('basis server got message:', m);
    let [command, port] = m.split(' ');
    if (command === 'launch') {
        server.launch({
            port: port ? Number(port) : 8004
        })
    }
});
