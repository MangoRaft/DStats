var os = require('os');
var cores = os.cpus().length;
function mbToBytes(val) {
	return val * 1014 * 1024;
}

function calculateCPUPercent(cpuDelta, systemDelta) {
	var cpuPercent = 0.0;
	if (systemDelta > 0.0 && cpuDelta > 0.0) {
		cpuPercent = (cpuDelta / systemDelta) * coreCount * 100.0;
	}
	return cpuPercent;
}

module.exports = {

	'memory_stats.usage' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.percent' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_active_anon' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_active_file' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_cache' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_inactive_anon' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_inactive_file' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_mapped_file' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_pgfault' : {
		calcDiff : true,
		agg : 'sum'
	},
	'memory_stats.stats.total_pgmajfault' : {
		calcDiff : true,
		agg : 'sum'
	},
	'memory_stats.stats.total_pgpgin' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_pgpgout' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_rss' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_rss_huge' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_swap' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_unevictable' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.total_writeback' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.unevictable' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.stats.writeback' : {
		calcDiff : false,
		agg : 'mean'
	},
	'memory_stats.failcnt' : {
		calcDiff : false,
		agg : 'mean'
	},
	/**
	 *
	 *
	 */
	'networks.eth0.rx_bytes' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.rx_packets' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.rx_errors' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.rx_dropped' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.tx_bytes' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.tx_packets' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.tx_errors' : {
		calcDiff : true,
		agg : 'sum'
	},
	'networks.eth0.tx_dropped' : {
		calcDiff : true,
		agg : 'sum'
	},
	/**
	 *
	 */
	'cpu_stats.cpu_usage.total_usage' : {
		calcDiff : true,
		agg : 'sum'
	},
	'cpu_stats.system_cpu_usage' : {
		calcDiff : true,
		agg : 'sum'
	},
	'cpu_stats.throttling_data.periods' : {
		calcDiff : true,
		agg : 'sum'
	},
	'cpu_stats.throttling_data.throttled_periods' : {
		calcDiff : true,
		agg : 'sum'
	},
	'cpu_stats.throttling_data.throttled_time' : {
		calcDiff : true,
		agg : 'sum'
	},
	'cpu_stats.cpu_usage.percent' : {
		calcDiff : false,
		agg : 'sum'
	},
	/**
	 *
	 */
	'pids_stats.current' : {
		calcDiff : false,
		agg : 'mean'
	},
	/**
	 *
	 */
	'blkio_stats.io_service_bytes_recursive.read' : {
		calcDiff : true,
		agg : 'sum'
	},
	'blkio_stats.io_service_bytes_recursive.write' : {
		calcDiff : true,
		agg : 'sum'
	},

	/**
	 'blkio_stats.io_service_bytes_recursive.sync' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_service_bytes_recursive.async' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_service_bytes_recursive.total' : {
	 calcDiff : true,
	 agg : 'sum'
	 },

	 */
	'blkio_stats.io_serviced_recursive.read' : {
		calcDiff : true,
		agg : 'sum'
	},
	'blkio_stats.io_serviced_recursive.write' : {
		calcDiff : true,
		agg : 'sum'
	},

	/**
	 'blkio_stats.io_serviced_recursive.sync' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_serviced_recursive.async' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_serviced_recursive.total' : {
	 calcDiff : true,
	 agg : 'sum'
	 },

	 */
	'blkio_stats.io_queue_recursive.read' : {
		calcDiff : true,
		agg : 'sum'
	},
	'blkio_stats.io_queue_recursive.write' : {
		calcDiff : true,
		agg : 'sum'
	},

	/**
	 'blkio_stats.io_queue_recursive.sync' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_queue_recursive.async' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_queue_recursive.total' : {
	 calcDiff : true,
	 agg : 'sum'
	 },

	 */
	'blkio_stats.io_service_time_recursive.read' : {
		calcDiff : true,
		agg : 'sum'
	},
	'blkio_stats.io_service_time_recursive.write' : {
		calcDiff : true,
		agg : 'sum'
	},

	/**
	 'blkio_stats.io_service_time_recursive.sync' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_service_time_recursive.async' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_service_time_recursive.total' : {
	 calcDiff : true,
	 agg : 'sum'
	 },

	 */
	'blkio_stats.io_wait_time_recursive.read' : {
		calcDiff : true,
		agg : 'sum'
	},
	'blkio_stats.io_wait_time_recursive.write' : {
		calcDiff : true,
		agg : 'sum'
	},

	/**
	 'blkio_stats.io_wait_time_recursive.sync' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_wait_time_recursive.async' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_wait_time_recursive.total' : {
	 calcDiff : true,
	 agg : 'sum'
	 },

	 */
	'blkio_stats.io_merged_recursive.read' : {
		calcDiff : true,
		agg : 'sum'
	},
	'blkio_stats.io_merged_recursive.write' : {
		calcDiff : true,
		agg : 'sum'
	},

	/**
	 'blkio_stats.io_merged_recursive.sync' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_merged_recursive.async' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_merged_recursive.total' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.io_time_recursive' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 'blkio_stats.sectors_recursive' : {
	 calcDiff : true,
	 agg : 'sum'
	 },
	 */

};
