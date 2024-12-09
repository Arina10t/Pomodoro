const openSettings = document.getElementById('settings-btn');
const openInfo = document.getElementById('info-btn');
const modalSettings = document.getElementById('settings');
const modalInfo = document.getElementById('info');
const overlay = document.getElementById('overlay-modal');

const workInput = document.getElementById('work-input-value');
const shortPauseInput = document.getElementById('shortPause-input-value');
const longPauseInput = document.getElementById('longPause-input-value');
const pomNumInput = document.getElementById('pomodoroNum-input-value');

const closeBtns = document.querySelectorAll('.close-btn');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');

const workTime = document.getElementById('work-time');
const shortPause = document.getElementById('short-pause');
const longPause = document.getElementById('long-pause');

const timerTitle = document.getElementById('timer-title');
const timeValue = document.getElementById('time-value');

const startTimer = document.getElementsByClassName('start-btn')[0];
const pauseTimer = document.getElementsByClassName('pause-btn')[0];
const resetTimer = document.getElementsByClassName('reset-btn')[0];
const nextTime = document.getElementsByClassName('next-btn')[0];

const progressCircle = document.getElementsByClassName('progress-circle')[0];
const valueBar = document.getElementsByClassName('value-bar')[0];

const workState = "work";
const shortPauseState = "shortPause";
const longPauseState = "longPause";

let timerIntervalId;
let startTime;
let degree;

let isTimeGoing = false;
let isPause = false;

let numCirclesNow = 0;
// let initialState = {
// 	"work" : 25,
// 	"shortPause": 5,
// 	"longPause": 10,
// 	"numCircles": 3
// }

let timerTitles = {
	"work" : "Работа",
	"shortPause" : "Короткий перерыв",
	"longPause" : "Длительный перерыв"
}

let timerValues = {
	"work" : 25,
	"shortPause": 5,
	"longPause": 10,
	"numCircles": 4
}

let stateNow = workState;

// let timeState = timerValues[stateNow] * 60 * 1000;

let timeNow = timerValues[stateNow] * 60 * 1000;

function displayTime() {
	timerTitle.textContent = timerTitles[stateNow];
	timeNow = timerValues[stateNow] * 60 * 1000;
	// let zero = timerValues[stateNow] < 10 ? '0' : '';
	timeValue.textContent = `${timerValues[stateNow].toString().padStart(2, '0')}` + ":" + "00";
}

function stopInterval (id) {
	startTimer.style.display = 'block';
	pauseTimer.style.display = 'none';
	if (!isPause) {degree = 0;
	valueBar.style.transform = `rotate(${degree}deg)`;}
	clearInterval(id);
	startTime = "";
}

document.addEventListener("DOMContentLoaded", () => {
	displayTime();
});

//Открыть настройки
openSettings.addEventListener('click', function (e) {
	workInput.value = timerValues.work;
	shortPauseInput.value = timerValues.shortPause;
	longPauseInput.value = timerValues.longPause;
	pomNumInput.value = timerValues.numCircles;

	overlay.classList.add('active');
	modalSettings.classList.add('active');
})

//Открыть инфо
openInfo.addEventListener('click', function (e) {
	modalInfo.classList.add('active');
	overlay.classList.add('active');
})

//Кнопка "Х"
closeBtns.forEach(btn => btn.addEventListener('click', function (e) {
	modalSettings.classList.remove('active');
	modalInfo.classList.remove('active');

	overlay.classList.remove('active');
}))

//Кнопка "Сохранить"
saveSettingsBtn.addEventListener('click', function(e) {

	timerValues.work = workInput.value;
	timerValues.shortPause = shortPauseInput.value;
	timerValues.longPause = longPauseInput.value;
	timerValues.numCircles = pomNumInput.value;

	displayTime();

	modalSettings.classList.remove('active');
	overlay.classList.remove('active');

	if (timerIntervalId) {
		isPause = false;
		stopInterval(timerIntervalId);
		displayTime();
	} 
})

//Кнопка "Сбросить"
resetSettingsBtn.addEventListener('click', function(e) {
	workInput.value = timerValues.work;
	shortPauseInput.value = timerValues.shortPause;
	longPauseInput.value = timerValues.longPause;
	pomNumInput.value = timerValues.numCircles;
})

//"Работа"
workTime.addEventListener('click', function(){
	isPause = false;
	timerIntervalId && stopInterval(timerIntervalId);
	stateNow = workState;
	displayTime();
})

//"Короткий перерыв"
shortPause.addEventListener('click', function(){
	isPause = false;
	timerIntervalId && stopInterval(timerIntervalId);
	stateNow = shortPauseState;
	displayTime()
})

//"Длительный перерыв"
longPause.addEventListener('click', function(){
	isPause = false;
	timerIntervalId && stopInterval(timerIntervalId);
	stateNow = longPauseState;
	displayTime();
})

//Начать отсчет
startTimer.addEventListener('click', onClickStart)

//Поставить на паузу
pauseTimer.addEventListener('click', function(){
	isTimeGoing = false;

	startTimer.style.display = 'block';
	pauseTimer.style.display = 'none';

	isPause = true;
	stopInterval(timerIntervalId);
})

//Сбросить таймер
resetTimer.addEventListener('click', function(){
	timeValue.textContent = timerValues[stateNow];
	isPause = false;
	stopInterval(timerIntervalId);
	// isTimeGoing = false;
	displayTime();
})

//Следующий блок времени
nextTime.addEventListener('click', function() {
	setNextState();
	displayTime();
} )

function startTimerFunc(ms) {

	timerIntervalId = setInterval(function(){
		// if (!startTime){startTime = Date.now() - 1000; degree = 0;}

		if (!degree){degree = 0;}
		// let nowTime = Date.now();

		// let remainTime = ms - (nowTime - startTime);
		let remainTime = timeNow - 1000;

		if (remainTime <= 0) {
			const alarm = new Audio("./assets/sound.mp3");
			alarm.play();
			stopInterval(timerIntervalId);
			setNextState();

			displayTime();
			onClickStart();
		} else {

			let min = Math.floor( (remainTime % (1000 * 60 * 60)) / (1000 * 60));
			let sec = Math.floor( (remainTime % (1000 * 60)) / 1000 );

			if (remainTime <= (timerValues[stateNow] * 60 * 1000 / 2) && !progressCircle.classList.contains('over50'))
				progressCircle.classList.add('over50') ;
			else if (remainTime > (timerValues[stateNow] * 60 * 1000 / 2) && progressCircle.classList.contains('over50')) 
				progressCircle.classList.remove('over50') ;

			timeNow = remainTime;
			degree = 360 * (1 - remainTime/(timerValues[stateNow] * 60 * 1000));
			
			valueBar.style.transform = `rotate(${degree}deg)`;
			timeValue.textContent =`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
		}
	}, 1000)
}

function onClickStart() {
	// isTimeGoing = true;
	startTimer.style.display = 'none';
	pauseTimer.style.display = 'block';
	isPause = false;
	startTimerFunc(timeNow);
}

function setNextState () {
	if (stateNow === workState) {
		if (numCirclesNow === timerValues.numCircles ) {
			stateNow = longPauseState;
			numCirclesNow = 0;
		} else {
			numCirclesNow++;
			stateNow = shortPauseState;
		}
	} else if (stateNow === shortPauseState || stateNow === longPauseState) {
		stateNow = workState;
	}

	isPause = false;
}