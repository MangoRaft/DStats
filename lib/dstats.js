var flatten = require('flat');
var async = require('async');
var dgram = require('dgram');
var Aggregator = require('./aggregator');

var metricsDefinition = require('./definitions');

function DStats(options) {
	this.host = options.host;
	this.port = options.port;
	this.key = options.key;
	this.socket = dgram.createSocket('udp4');
	this.agg = new Aggregator();
	this.first = false;
}

module.exports = DStats;

DStats.prototype.stats = function(stats) {
	var self = this;

	Object.keys(stats.blkio_stats).forEach(function(key) {
		var stat = {};
		stats.blkio_stats[key].forEach(function(blkio_stat) {
			stat[blkio_stat.op.toLocaleLowerCase()] = blkio_stat.value;
		});
		stats.blkio_stats[key] = stat;
	});

	stats.memory_stats.percent = Number(((stats.memory_stats.usage / stats.memory_stats.limit) * 100).toFixed(2));
	stats.cpu_stats.cpu_usage.percent = Number(calculateCPUPercent(stats));

	this.aggregate(flatten(stats));
};
function calculateCPUPercent(statItem) {
	var cpuDelta = statItem.cpu_stats.cpu_usage.total_usage - statItem.precpu_stats.cpu_usage.total_usage;
	var systemDelta = statItem.cpu_stats.system_cpu_usage - statItem.precpu_stats.system_cpu_usage;
	var cpuPercent = 0.0;
	if (systemDelta > 0.0 && cpuDelta > 0.0) {
		cpuPercent = (cpuDelta / systemDelta) * statItem.cpu_stats.cpu_usage.percpu_usage.length * 100.0;
	}
	return cpuPercent.toFixed(2);
}

DStats.prototype.aggregate = function(stats) {
	//console.log(stats)
	var self = this;
	Object.keys(metricsDefinition).forEach(function(prop) {
		if (!isNaN(stats[prop])) {
			var val = stats[prop] || 0 * 1.0 || 0;
			if (metricsDefinition[prop].transform) {
				val = metricsDefinition[prop].transform(val);
			}
			self.agg.update(new Date().getTime(), prop, val, metricsDefinition[prop].calcDiff);
		} else {
			console.warn('Property not defined ' + prop + ' ' + stats[prop]);
		}
	});
	if (!this.first) {
		this.first = true;
		this.getAggregatedValues();
		this.agg.reset();
	} else {
		var mGroups = this.getAggregatedValues();
		mGroups.forEach(function(group) {
			var buf = new Buffer(group);
			self.socket.send(buf, 0, buf.length, self.port, self.host);
		});
		self.agg.reset();
	}

};

DStats.prototype.getAggregatedValues = function() {
	var self = this;
	var groups = [];
	var group = '';

	Object.keys(self.agg.metrics).forEach(function(prop) {

		var val = self.agg.get(prop);

		var def = metricsDefinition[prop];
		if (!def) {
			def = {
				agg : 'mean',
				calcDiff : false
			};
		}
		val = val[def.agg];

		var str = self.key + '.' + prop + ':' + val + '|' + (def.calcDiff ? 'c' : 'g') + '\n';

		if (Buffer.byteLength(group + str, 'utf8') > 1000) {
			groups.push(group);
			group = '';
		}
		group += str;
	});
	groups.push(group);
	group = '';

	return groups.filter(function(str) {
		return str !== '';
	});
};