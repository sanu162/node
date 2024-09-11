const cluster = require('cluster')
const os = require("os")

const cpus = 1; //os.cpus().length;

if (cluster.isMaster) {    
    for (let i=0; i<cpus; i++){
        cluster.fork()
    }
    
    // cluster.on('exit', (Worker) => {
    //     cluster.fork()
    // })
} else {    
    const server = require('./server')
    
    Promise.all([
        server.init(),
    ])
    .then(server.start())
}