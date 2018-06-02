const flatten = require('flat');

const util = require('util');
const events = require('events');
const Metrics = require('statsd-metrics');

const Aggregator = require('./aggregator');

const metricsDefinition = require('./definitions');

function DStats(options) {
    events.EventEmitter.call(this);
    this.agg = new Aggregator();
    this.first = false;
    this.key = options.key;
    this.metrics = new Metrics(options)
}

// So will act like an event emitter
util.inherits(DStats, events.EventEmitter);
module.exports = DStats;

DStats.prototype.stats = function (stats) {
    var self = this;

    Object.keys(stats.blkio_stats).forEach(function (key) {
        var stat = {};
        if (!Array.isArray(stats.blkio_stats[key])) {
            return;
        }
        stats.blkio_stats[key].forEach(function (blkio_stat) {
            stat[blkio_stat.op.toLocaleLowerCase()] = blkio_stat.value;
        });
        stats.blkio_stats[key] = stat;
    });

    stats.memory_stats.percent = Number(((stats.memory_stats.usage / stats.memory_stats.limit) * 100).toFixed(2));

    if (!stats.cpu_stats.period && !stats.cpu_stats.quota) {
        stats.cpu_stats.period = stats.cpu_stats.quota = 100
    }

    stats.cpu_stats.cpu_usage.percent = Number(calculateCPUPercent(stats));
    //stats.cpu_stats.throttling_data.percent = 100-Number(calculateCPUThrottelPercent(stats));
    let flattened = flatten(stats);
    this.aggregate(flattened);
    return flattened;
};

function calculateCPUThrottelPercent(statItem) {
    var cpuDelta = statItem.cpu_stats.throttling_data.throttled_time - statItem.precpu_stats.throttling_data.throttled_time;
    var systemDelta = statItem.cpu_stats.system_cpu_usage - statItem.precpu_stats.system_cpu_usage;
    var cpuPercent = 0.0;
    if (systemDelta > 0.0 && cpuDelta > 0.0) {
        cpuPercent = (((cpuDelta / systemDelta) * statItem.cpu_stats.online_cpus * statItem.cpu_stats.period) / statItem.cpu_stats.quota) * 100;
    }
    return cpuPercent.toFixed(2);
}

function calculateCPUPercent(statItem) {
    var cpuDelta = statItem.cpu_stats.cpu_usage.total_usage - statItem.precpu_stats.cpu_usage.total_usage;
    var systemDelta = statItem.cpu_stats.system_cpu_usage - statItem.precpu_stats.system_cpu_usage;
    var cpuPercent = 0.0;
    if (systemDelta > 0.0 && cpuDelta > 0.0) {
        cpuPercent = (((cpuDelta / systemDelta) * statItem.cpu_stats.online_cpus * statItem.cpu_stats.period) / statItem.cpu_stats.quota) * 100;
    }
    cpuPercent = cpuPercent.toFixed(2)
    if (cpuPercent > 100) {
        cpuPercent = 100.00
    }
    return cpuPercent;
}

DStats.prototype.aggregate = function (stats) {
    //console.log(stats)
    var self = this;
    Object.keys(metricsDefinition).forEach(function (prop) {
        if (!isNaN(stats[prop])) {
            var val = stats[prop] || 0 * 1.0 || 0;
            if (metricsDefinition[prop].transform) {
                val = metricsDefinition[prop].transform(val);
            }
            self.agg.update(new Date().getTime(), prop, val, metricsDefinition[prop].calcDiff);
        } else {
            //console.warn('Property not defined ' + prop + ' ' + stats[prop]);
        }
    });
    if (!this.first) {
        this.first = true;
        this.getAggregatedValues();
        this.agg.reset();
    } else {
        var mGroups = this.getAggregatedValues();
        this.emit('aggregated', mGroups)
        self.agg.reset();
    }

};

DStats.prototype.getAggregatedValues = function () {
    let self = this;
    let groups = {};

    Object.keys(self.agg.metrics).forEach(function (prop) {

        let val = self.agg.get(prop);

        let def = metricsDefinition[prop];
        if (!def) {
            def = {
                agg: 'mean',
                calcDiff: false
            };
        }
        val = val[def.agg];

        if (self.key)
            self.metrics.append(self.key + '.' + prop + ':' + val + '|' + (def.calcDiff ? 'c' : 'g') + '\n')

        groups[prop] = {
            agg: def.agg,
            calcDiff: def.calcDiff,
            value: val
        }

    });
    if (self.key)
        self.metrics.flush();

    return groups;

};

DStats.prototype.stop = function () {
    this.metrics.flush()
};
