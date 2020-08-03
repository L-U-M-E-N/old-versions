/**
 * DEFAULT CONFIGURATION FILE
 * YOU MUST COPY AND COMPLETE IT AS config.js
 */


/**
 * Global config
 */
global.debugMode = true; // @ADD: Auto detected debug mode


/**
 * Subprocesses
 */
global.subprocessesList = {
	//"example": { init: somefunction, file: somefile, fileopt: [], options: [], onerr: function, onclose: function, onstdout: function, },
};

/**
 * Calendars
 */
global.calendar = {
	/*'example1': {
		url: 'https://mycalendar.tld/my.ics',
	},
	'example2': {
		url: 'https://mycalendar.tld/my.ics',
		start: new Date('2018-08-01'),
		end: new Date('2019-08-01'),
	},*/
};

/**
 * Database
 */
global.databaseAuth = {
	user: 'lumen',
	host: 'localhost',
	database: 'lumen',
	password: 'PASSWORDHERE',
	port: 5432,
};

/**
 * Discord
 */
global.discordAdminId = 'DISCORDADMINID';

// The token of your bot - https://discordapp.com/developers/applications/me
global.discordBotToken = 'DISCORDBOTTOKEN';

/**
 * Modules
 */
global.moduleList = [
	'Database',

	'Calendar',
	'Discord',
	'tts',
	'Websocket',
];

/**
 * Websocket server
 */
global.websocketPort = 42000;