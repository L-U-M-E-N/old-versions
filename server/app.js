/**
 * Modules
 */
require('./console')();
require('./config');

global.Modules = require('./modules');

/**
 * Load
 */
async function autoLoad(callback) {
	// Load/Reload all modules & subprocess
	log('./initialising.MODULES.ALL', 'boot');
	await Modules.loadModules();

	Modules.watch('config');
	Modules.watch('modules');

	log('./initialising.SUBPROCESS.ALL', 'boot');
	Modules.loadSubprocesses();

	callback();
}

consoleReset();

// Autoloading modules
log('./action.SYSTEM.REBOOT', 'boot');

if(debugMode) {
	log('./initialising.DEBUG.MODE', 'boot');
}

autoLoad(function() {
	log('SEEKING ADMIN ...');

	Discord.connect(() => {
		Discord.sendMessage(
			'L.U.M.E.N online - awaiting orders'
		);
		log('ADMIN FOUND');
	});
});