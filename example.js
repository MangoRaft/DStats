var Docker = require('dockerode');
var docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

var DStats = require('./lib/dstats');

var container = docker.getContainer('0ff3a3737ba41468da5c1864d2107b0a3effbb59d8708f30fe313fd1cc1bdd3b');

var dstats = new DStats({});
dstats.on('aggregated', function(stats){
    console.log(stats)
})
container.stats({
    stream: true
}, function (error, stream) {
    if (error) {

        throw error
    }

    function onData(data) {
        try {
            var json = JSON.parse(data.toString());
        } catch (err) {
            return console.log(err);
        }

        dstats.stats(json);
    }


    stream.on('data', onData);
});
