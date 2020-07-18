/* eslint-disable no-magic-numbers */
const alertRatio = 0.8;
const minAlert = 3600; // Enable alerts after one hour

const MODE_ENUM = {
	OTHER: -1,
	WORK: 0,
	GAME: 1,
	NONE: 2
};

let currentMode = MODE_ENUM.OTHER;
let videoOn = false;

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
			videoTime: localStorage.videoTime,
		};

		localStorage.history = JSON.stringify(history);

		localStorage.workTime=0;
		localStorage.gameTime=0;
		localStorage.otherTime=0;
		localStorage.videoTime=0;
	} else {
		localStorage.workTime = parseInt(localStorage.workTime);
		localStorage.gameTime  = parseInt(localStorage.gameTime);
		localStorage.otherTime  = parseInt(localStorage.otherTime);
		localStorage.videoTime  = parseInt(localStorage.videoTime);
	}

	localStorage.lastLaunch = Date.now();

	// Week & Month
	let weekWork = parseInt(localStorage.workTime),
		weekGame = parseInt(localStorage.gameTime),
		weekOther = parseInt(localStorage.otherTime),
		weekVideo = parseInt(localStorage.videoTime);

	let monthWork = parseInt(localStorage.workTime),
		monthGame = parseInt(localStorage.gameTime),
		monthOther = parseInt(localStorage.otherTime),
		monthVideo = parseInt(localStorage.videoTime);

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
				if(history[i].videoTime) {
					weekVideo += parseInt(history[i].videoTime);
				}

				monthWork += parseInt(history[i].workTime);
				monthGame += parseInt(history[i].gameTime);
				monthOther += parseInt(history[i].otherTime);
				if(history[i].videoTime) {
					monthVideo += parseInt(history[i].videoTime);
				}
			} else if(new Date(i).getTime() >= lastMonth.getTime()) {

				monthWork += parseInt(history[i].workTime);
				monthGame += parseInt(history[i].gameTime);
				monthOther += parseInt(history[i].otherTime);
				if(history[i].videoTime) {
					monthVideo += parseInt(history[i].videoTime);
				}
			}
		}
	}

	setInterval(function() {
		// Day
		// Increments
		if(currentMode === MODE_ENUM.GAME) {
			localStorage.gameTime = parseInt(localStorage.gameTime) + 1;
		} else if(currentMode === MODE_ENUM.WORK) {
			localStorage.workTime = parseInt(localStorage.workTime) + 1;
		} else if(currentMode === MODE_ENUM.OTHER) {
			localStorage.otherTime = parseInt(localStorage.otherTime) + 1;
		}

		if(videoOn) {
			localStorage.videoTime = parseInt(localStorage.videoTime) + 1;
		}

		// @ADD: Alerts when too much game, alert when working for more than a hour

		// Draw time
		document.querySelector('#module-pomodoro-work-time').innerText = formatTime(localStorage.workTime);
		document.querySelector('#module-pomodoro-game-time').innerText = formatTime(localStorage.gameTime);
		document.querySelector('#module-pomodoro-other-time').innerText = formatTime(localStorage.otherTime);
		document.querySelector('#module-pomodoro-videos-time').innerText = formatTime(localStorage.videoTime);

		// Draw day percentages
		const total = parseInt(localStorage.workTime) + parseInt(localStorage.gameTime) + parseInt(localStorage.otherTime);
		const otherPercent = (100 - (localStorage.workTime/total*100) - (localStorage.gameTime/total*100)).toFixed(1);
		document.querySelector('#module-pomodoro-work-day-percentage').innerText = (localStorage.workTime/total*100).toFixed(1) + '%';
		document.querySelector('#module-pomodoro-game-day-percentage').innerText = (localStorage.gameTime/total*100).toFixed(1) + '%';
		document.querySelector('#module-pomodoro-other-day-percentage').innerText = otherPercent + '%';
		document.querySelector('#module-pomodoro-videos-day-percentage').innerText = (localStorage.videoTime/total*100).toFixed(1) + '%';

		// Week & Month
		const localWeekWork = parseInt(localStorage.workTime) + weekWork,
			localWeekGame = parseInt(localStorage.gameTime) + weekGame,
			localWeekOther = parseInt(localStorage.otherTime) + weekOther,
			localWeekVideo = parseInt(localStorage.videoTime) + weekVideo;

		const localMonthWork = parseInt(localStorage.workTime) + monthWork,
			localMonthGame = parseInt(localStorage.gameTime) + monthGame,
			localMonthOther = parseInt(localStorage.otherTime) + monthOther,
			localMonthVideo = parseInt(localStorage.videoTime) + monthVideo;

		// Draw week percentages
		const weekTotal = localWeekWork + localWeekGame + localWeekOther;
		const weekOtherPercent = (100 - (localWeekWork/weekTotal*100) - (localWeekGame/weekTotal*100)).toFixed(1);
		document.querySelector('#module-pomodoro-work-week-percentage').innerText = (localWeekWork/weekTotal*100).toFixed(1) + '%';
		document.querySelector('#module-pomodoro-game-week-percentage').innerText = (localWeekGame/weekTotal*100).toFixed(1) + '%';
		document.querySelector('#module-pomodoro-other-week-percentage').innerText = weekOtherPercent + '%';
		document.querySelector('#module-pomodoro-videos-week-percentage').innerText = (localWeekVideo/weekTotal*100).toFixed(1) + '%';

		// Draw week percentages
		const monthTotal = localMonthWork + localMonthGame + localMonthOther;
		const monthOtherPercent = (100 - (localMonthWork/monthTotal*100) - (localMonthGame/monthTotal*100)).toFixed(1);
		document.querySelector('#module-pomodoro-work-month-percentage').innerText = (localMonthWork/monthTotal*100).toFixed(1) + '%';
		document.querySelector('#module-pomodoro-game-month-percentage').innerText = (localMonthGame/monthTotal*100).toFixed(1) + '%';
		document.querySelector('#module-pomodoro-other-month-percentage').innerText = monthOtherPercent + '%';
		document.querySelector('#module-pomodoro-videos-month-percentage').innerText = (localMonthVideo/monthTotal*100).toFixed(1) + '%';
	}, 1000);

	function disableTimers() {
		currentMode = MODE_ENUM.NONE;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654;';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654;';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654;';
	}

	document.querySelector('#module-pomodoro-work').addEventListener('click', function() {
		if(currentMode === MODE_ENUM.WORK) {
			disableTimers();
			return;
		}

		currentMode = MODE_ENUM.WORK;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#x25b7;';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654;';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654;';
	});

	document.querySelector('#module-pomodoro-game').addEventListener('click', function() {
		if(currentMode === MODE_ENUM.GAME) {
			disableTimers();
			return;
		}

		currentMode = MODE_ENUM.GAME;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654;';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#x25b7;';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#9654;';
	});

	document.querySelector('#module-pomodoro-other').addEventListener('click', function() {
		if(currentMode === MODE_ENUM.OTHER) {
			disableTimers();
			return;
		}

		currentMode = MODE_ENUM.OTHER;

		document.querySelector('#module-pomodoro-work').innerHTML = '&#9654;';
		document.querySelector('#module-pomodoro-game').innerHTML = '&#9654;';
		document.querySelector('#module-pomodoro-other').innerHTML = '&#x25b7;';
	});

	document.querySelector('#module-pomodoro-videos').addEventListener('click', function() {
		if(videoOn) {
			videoOn = false;
			document.querySelector('#module-pomodoro-videos').innerHTML = '&#9654;';
		} else {
			videoOn = true;
			document.querySelector('#module-pomodoro-videos').innerHTML = '&#x25b7;';
		}
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

	let historique = [];
	for(const i in data) {
		const curr = data[i];
		historique.push({
			workTime: parseInt(curr.workTime),
			gameTime: parseInt(curr.gameTime),
			otherTime: parseInt(curr.otherTime),

			date: new Date(i),
		});

		historique[historique.length - 1].total = historique[historique.length - 1].workTime + historique[historique.length - 1].gameTime + historique[historique.length - 1].otherTime;
	}
	historique = historique.sort(function(a,b) {
		if(a.date.getTime() > b.date.getTime()) {
			return 1;
		} else if(a.date.getTime() === b.date.getTime()) {
			return 0;
		}

		return -1;
	});

	function sum(historique, curr, length, field) {
		let total = 0;
		for(let i=curr - length; i<=curr; i++) {
			total += historique[i][field];
		}

		return total;
	}

	for(let i=6; i<historique.length; i++) {
		if(historique[i].date.getTime() < Date.now() - 7776000000) { continue; } // Garder les 3 derniers mois

		const total = sum(historique, i, 6, 'total');
		const workTime = sum(historique, i, 6, 'workTime');
		const gameTime = sum(historique, i, 6, 'gameTime');

		dates.push( ('0' + historique[i-6].date.getDate()).substr(-2) + '-' + historique[i].date.toLocaleDateString());

		workStats.push( Math.round(100 * workTime / total ) );
		gameStats.push( Math.round(100 * gameTime / total ) );
		otherStats.push( 100 - workStats[workStats.length - 1] - gameStats[gameStats.length - 1]);
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
						stepSize: 10
					}
				}],
				xAxes: [{
					display: false,
				}]
			},
			animation: {
				duration: 750,
			},
			legend: {
				labels: {
					fontColor: 'white',
				}
			},
			elements: {
				point: {
					radius: 0,
				}
			},
			annotation: {
				annotations: [{
					type: 'line',
					mode: 'horizontal',
					scaleID: 'y-axis-0',
					value: 20,
					borderColor: 'rgb(255, 0, 0)',
					borderWidth: 1,
					label: {
						enabled: false,
						content: 'Min.'
					}
				},{
					type: 'line',
					mode: 'horizontal',
					scaleID: 'y-axis-0',
					value: 33,
					borderColor: 'rgb(0, 255, 0)',
					borderWidth: 1,
					label: {
						enabled: false,
						content: 'Perfect.'
					}
				},{
					type: 'line',
					mode: 'horizontal',
					scaleID: 'y-axis-0',
					value: 66,
					borderColor: 'rgb(0, 0, 0)',
					borderWidth: 1,
					label: {
						enabled: false,
						content: 'Game Perfect.'
					}
				}
				]
			}
		}
	});
}