const server = require('basisjs-tools/lib/server/index.js')

process.on('message', (m) => {
    console.log('basis server got message:', m);
    if (m === 'launch') {
        server.launch({
            port: 8004
        })
    }
});
