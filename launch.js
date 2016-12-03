const server = require('basisjs-tools/lib/server/index.js')

var bs;

process.on('message', (m) => {
    console.log('basis server got message:', m);
    if (m === 'launch') {
        bs = server.launch({
            port: 8004
        })
    } else if ( m == 'stop') {
        if (bs && bs.kill) {
            bs.kill();
        }
    }
});
