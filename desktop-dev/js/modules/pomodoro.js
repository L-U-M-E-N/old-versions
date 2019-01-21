let alertRatio = 0.8;
let minAlert = 3600; // Enable alerts after one hour

let currentMode = -1; // -1 = Other, 0 = Work, 1 = Game, 

window.addEventListener('load', function() {
	let lastDate = new Date(parseInt(localStorage.lastLaunch)).toDateString();

	if(localStorage.lastLaunch === undefined || // Never used
		(new Date()).toDateString() != lastDate) { // Another day

		let history = {};
		if(localStorage.history !== undefined) {
			history = JSON.parse(localStorage.history);
		}


		history[lastDate] = {
			workTime: localStorage.workTime,
			gameTime: localStorage.gameTime,
			otherTime: localStorage.otherTime,
		};

		localStorage.history = JSON.stringify(history);

		localStorage.workTime=0;
		localStorage.gameTime=0;
		localStorage.otherTime=0;
	} else {
		localStorage.workTime = parseInt(localStorage.workTime);
		localStorage.gameTime  = parseInt(localStorage.gameTime);
		localStorage.otherTime  = parseInt(localStorage.otherTime);
	}

	localStorage.lastLaunch = Date.now();

	// Week & Month
	let weekWork = parseInt(localStorage.workTime),
		weekGame = parseInt(localStorage.gameTime),
		weekOther = parseInt(localStorage.otherTime);

	let monthWork = parseInt(localStorage.workTime),
		monthGame = parseInt(localStorage.gameTime),
		monthOther = parseInt(localStorage.otherTime);

	let lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);
	lastWeek.setHours(0, 0, 0, 0);

	let lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	lastMonth.setHours(0, 0, 0, 0);

	if(localStorage.history !== undefined) {
		let history = JSON.parse(localStorage.history);
		for(let i in history) {
			if(new Date(i).getTime() >= lastWeek.getTime()) {

				weekWork += parseInt(history[i].workTime);
				weekGame += parseInt(history[i].gameTime);
				weekOther += parseInt(history[i].otherTime);

				monthWork += parseInt(history[i].workTime);
				monthGame += parseInt(history[i].gameTime);
				monthOther += parseInt(history[i].otherTime);
			} else if(new Date(i).getTime() >= lastMonth.getTime()) {

				monthWork += parseInt(history[i].workTime);
				monthGame += parseInt(history[i].gameTime);
				monthOther += parseInt(history[i].otherTime);
			}
		}
	}
	
	setInterval(function() {
		// Day
			// Increments
			if(currentMode == 1) {
				localStorage.gameTime = parseInt(localStorage.gameTime) + 1;
			} else if(currentMode == 0) {
				localStorage.workTime = parseInt(localStorage.workTime) + 1;
			} else {
				localStorage.otherTime = parseInt(localStorage.otherTime) + 1;
			}

			// @ADD: Alerts when too much game, alert when working for more than a hour

			// Draw time
			document.querySelector('#module-pomodoro-work-time').innerText = formatTime(localStorage.workTime);
			document.querySelector('#module-pomodoro-game-time').innerText = formatTime(localStorage.gameTime);
			document.querySelector('#module-pomodoro-other-time').innerText = formatTime(localStorage.otherTime);

			// Draw day percentages
			let total = parseInt(localStorage.workTime) + parseInt(localStorage.gameTime) + parseInt(localStorage.otherTime);
			document.querySelector('#module-pomodoro-work-day-percentage').innerText = Math.round(localStorage.workTime/total*100) + "%";
			document.querySelector('#module-pomodoro-game-day-percentage').innerText = Math.round(localStorage.gameTime/total*100) + "%";
			document.querySelector('#module-pomodoro-other-day-percentage').innerText = Math.round(localStorage.otherTime/total*100) + "%";

		// Week & Month
			let localWeekWork = parseInt(localStorage.workTime) + weekWork,
				localWeekGame = parseInt(localStorage.gameTime) + weekGame,
				localWeekOther = parseInt(localStorage.otherTime) + weekOther;

			let localMonthWork = parseInt(localStorage.workTime) + monthWork,
				localMonthGame = parseInt(localStorage.gameTime) + monthGame,
				localMonthOther = parseInt(localStorage.otherTime) + monthOther;

			// Draw week percentages
			let weekTotal = localWeekWork + localWeekGame + localWeekOther;
			document.querySelector('#module-pomodoro-work-week-percentage').innerText = Math.round(localWeekWork/weekTotal*100) + "%";
			document.querySelector('#module-pomodoro-game-week-percentage').innerText = Math.round(localWeekGame/weekTotal*100) + "%";
			document.querySelector('#module-pomodoro-other-week-percentage').innerText = Math.round(localWeekOther/weekTotal*100) + "%";

			// Draw week percentages
			let monthTotal = localMonthWork + localMonthGame + localMonthOther;
			document.querySelector('#module-pomodoro-work-month-percentage').innerText = Math.round(localMonthWork/monthTotal*100) + "%";
			document.querySelector('#module-pomodoro-game-month-percentage').innerText = Math.round(localMonthGame/monthTotal*100) + "%";
			document.querySelector('#module-pomodoro-other-month-percentage').innerText = Math.round(localMonthOther/monthTotal*100) + "%";
	}, 1000);

	document.querySelector('#module-pomodoro-work')
			.addEventListener('click', function() {
		currentMode = 0;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#x25b7;';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654';
	});

	document.querySelector('#module-pomodoro-game')
			.addEventListener('click', function() {
		currentMode = 1;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#x25b7;';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654';
	});

	document.querySelector('#module-pomodoro-other')
			.addEventListener('click', function() {
		currentMode = -1;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#x25b7;';
	});
});

function formatTime(time) {
	time = parseInt(time);
	let seconds = time%60;
	let minutes = ((time-seconds)/60)%60;
	let hours = (((time-seconds)/60)-minutes)/60;

	if(seconds < 10) { seconds = "0" + seconds; }
	if(minutes < 10) { minutes = "0" + minutes; }
	if(  hours < 10) {   hours = "0" +   hours; }

	return hours + ":" + minutes + ":" + seconds;
}