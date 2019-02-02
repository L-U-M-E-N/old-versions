/* eslint-disable no-magic-numbers */
const alertRatio = 0.8;
const minAlert = 3600; // Enable alerts after one hour

let currentMode = -1; // -1 = Other, 0 = Work, 1 = Game,

window.addEventListener('load', function() {
	const lastDate = new Date(parseInt(localStorage.lastLaunch)).toDateString();

	if(localStorage.lastLaunch === undefined || // Never used
		(new Date()).toDateString() !== lastDate) { // Another day

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

	const lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);
	lastWeek.setHours(0, 0, 0, 0);

	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	lastMonth.setHours(0, 0, 0, 0);

	if(localStorage.history !== undefined) {
		const history = JSON.parse(localStorage.history);
		for(const i in history) {
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
		if(currentMode === 1) {
			localStorage.gameTime = parseInt(localStorage.gameTime) + 1;
		} else if(currentMode === 0) {
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
		const total = parseInt(localStorage.workTime) + parseInt(localStorage.gameTime) + parseInt(localStorage.otherTime);
		const otherPercent = 100 - Math.round(localStorage.workTime/total*100) - Math.round(localStorage.gameTime/total*100);
		document.querySelector('#module-pomodoro-work-day-percentage').innerText = Math.round(localStorage.workTime/total*100) + '%';
		document.querySelector('#module-pomodoro-game-day-percentage').innerText = Math.round(localStorage.gameTime/total*100) + '%';
		document.querySelector('#module-pomodoro-other-day-percentage').innerText = otherPercent + '%';

		// Week & Month
		const localWeekWork = parseInt(localStorage.workTime) + weekWork,
			localWeekGame = parseInt(localStorage.gameTime) + weekGame,
			localWeekOther = parseInt(localStorage.otherTime) + weekOther;

		const localMonthWork = parseInt(localStorage.workTime) + monthWork,
			localMonthGame = parseInt(localStorage.gameTime) + monthGame,
			localMonthOther = parseInt(localStorage.otherTime) + monthOther;

		// Draw week percentages
		const weekTotal = localWeekWork + localWeekGame + localWeekOther;
		const weekOtherPercent = 100 - Math.round(localWeekWork/weekTotal*100) - Math.round(localWeekGame/weekTotal*100);
		document.querySelector('#module-pomodoro-work-week-percentage').innerText = Math.round(localWeekWork/weekTotal*100) + '%';
		document.querySelector('#module-pomodoro-game-week-percentage').innerText = Math.round(localWeekGame/weekTotal*100) + '%';
		document.querySelector('#module-pomodoro-other-week-percentage').innerText = weekOtherPercent + '%';

		// Draw week percentages
		const monthTotal = localMonthWork + localMonthGame + localMonthOther;
		const monthOtherPercent = 100 - Math.round(localMonthWork/monthTotal*100) - Math.round(localMonthGame/monthTotal*100);
		document.querySelector('#module-pomodoro-work-month-percentage').innerText = Math.round(localMonthWork/monthTotal*100) + '%';
		document.querySelector('#module-pomodoro-game-month-percentage').innerText = Math.round(localMonthGame/monthTotal*100) + '%';
		document.querySelector('#module-pomodoro-other-month-percentage').innerText = monthOtherPercent + '%';
	}, 1000);

	document.querySelector('#module-pomodoro-work').addEventListener('click', function() {
		currentMode = 0;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#x25b7;';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654';
	});

	document.querySelector('#module-pomodoro-game').addEventListener('click', function() {
		currentMode = 1;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#x25b7;';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654';
	});

	document.querySelector('#module-pomodoro-other').addEventListener('click', function() {
		currentMode = -1;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#x25b7;';
	});

	createChart();
});

function formatTime(time) {
	time = parseInt(time);
	let seconds = time%60;
	let minutes = ((time-seconds)/60)%60;
	let hours = (((time-seconds)/60)-minutes)/60;

	if(seconds < 10) { seconds = '0' + seconds; }
	if(minutes < 10) { minutes = '0' + minutes; }
	if(  hours < 10) {   hours = '0' +   hours; }

	return hours + ':' + minutes + ':' + seconds;
}

function createChart() {
	const ctx = document.getElementById('pomodoro-chart').getContext('2d');

	const dates = [];
	const workStats = [];
	const gameStats = [];
	const otherStats = [];

	const data = JSON.parse(localStorage.history);
	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	lastMonth.setHours(0, 0, 0, 0);

	let prevWork = 0;
	let prevGame = 0;
	let prevTotal = 0;

	for(const i in data) {
		const currDate = new Date(i);
		if(currDate.getTime() >= Date.now()) { continue; }

		const currWork = parseInt(data[i].workTime);
		const currGame = parseInt(data[i].gameTime);
		const currOther = parseInt(data[i].otherTime);
		const currTotal = currWork + currGame + currOther;

		dates.push('');
		workStats.push(Math.round(100*(currWork + prevWork)/(currTotal + prevTotal)));
		gameStats.push(Math.round(100*(currGame + prevGame)/(currTotal + prevTotal)));
		otherStats.push(100 - workStats[workStats.length - 1] - gameStats[gameStats.length - 1]);

		prevWork = currWork;
		prevGame = currGame;
		prevTotal = currTotal;
	}

	const myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dates,
			datasets: [{
				label: 'Travail',
				fill: true,
				backgroundColor: '#2980b9',
				pointBackgroundColor: '#3498db',
				borderColor: '#3498db',
				pointHighlightStroke: '#3498db',
				borderCapStyle: 'butt',
				data: workStats,

			}, {
				label: 'Autre',
				fill: true,
				backgroundColor: '#27ae60',
				pointBackgroundColor: '#2ecc71',
				borderColor: '#2ecc71',
				pointHighlightStroke: '#2ecc71',
				borderCapStyle: 'butt',
				data: otherStats,
			}, {
				label: 'Jeux',
				fill: true,
				backgroundColor: '#c0392b',
				pointBackgroundColor: '#e74c3c',
				borderColor: '#e74c3c',
				pointHighlightStroke: '#e74c3c',
				borderCapStyle: 'butt',
				data: gameStats,
			}]
		},
		options: {
			responsive: false,
			// Can't just just `stacked: true` like the docs say
			scales: {
				yAxes: [{
					stacked: true,
					ticks: {
						min: 0,
						max: 100,
						stepSize: 100
					}
				}]
			},
			animation: {
				duration: 750,
			},
			legend: {
				labels: {
					fontColor: 'white',
				}
			}
		}
	});
}