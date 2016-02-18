var config = {
	local: {
		mode: 'local',
		port: 4300
	},
	staging: {
		mode: 'staging',
		port: 3000
	},
	production: {
		mode: 'production',
		port: 5000
	}
};

logfile = './logfile.log';

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
};
