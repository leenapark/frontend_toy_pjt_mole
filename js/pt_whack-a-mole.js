/**************변수 초기값 선언*************/
const $timer = document.querySelector('#timer');
const $score = document.querySelector('#score');
const $game = document.querySelector('#game');
const $start = document.querySelector('#start');
const $$cells = document.querySelectorAll('.cell');
const $hurryUp = document.querySelector('#hurryUp');
const $pause = document.querySelector("#pause");
const mp3 = document.querySelector('video');
const stop = document.querySelector('.stop');
const play = document.querySelector('.play');

let started = false;
let score = 0;
let time = 30; //8초에서 30초로 늘림 (기존 문제점)
let state = false;

const holes = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
]; //구멍 3개 추가해서 12개로 (기존 문제점)

/***********게임 실행************/
$timer.textContent = time;

// 시작 버튼을 눌렀을 때
class Timer {
    constructor(callback, delay) {
        this.callback = callback
        this.remainingTime = delay
        this.startTime
        this.timerId
    }

    pause() {
        console.log("일시정지")
        const pauseId = setInterval(tick, 1000);
        clearTimeout(this.timerId);
        clearInterval(tick);
        this.remainingTime -= new Date() - this.startTime;
    }

    start() {
        // 시작을 누르면 실행되는 코드    started라는 변수는 false로 되어있음
        if (started) 
            return; // 이미 시작했으면 무시
        started = true;
        mp3.play();
        const timerId = setInterval(() => {
            time = (time * 10 - 1) / 10; // 소수점 계산 시 문제있음 초 카운트 표현 계산식
            $timer.textContent = time;

            // 타이머가 0이 될 시 if문 실행
            if (time === 0) {
                clearInterval(timerId);
                clearInterval(tickId);
                setTimeout(() => { // 나중에 실행되는 함수
                    console.log("종료");
                    alert(`게임 오버! 점수는${score}점`);
                    // alert 확인을 누르면 reset 시킴
                    location.reload();
                }, 50); // 0.05초 후에 alert 창을 띄운다
            }
        }, 100);
        const tickId = setInterval(tick, 1000); // 1초 마다 tick을 실행함
        tick(); // 없으면 렉걸림 시작
        // 여기까지 실행됨 start 여기부터 일시정지 버튼 함수
        if (started == true) {
            console.log('시작');
            console.log("tickId");

            const pauseButton = document.getElementById("timer-pause");
            pauseButton.addEventListener('click', () => {
                console.log("false 일시정지");
                started = false;
                if (started == false) {
                    console.log("if 일시정지");
                    clearInterval(timerId);
                    clearInterval(tickId);
                    setTimeout(() => { // 나중에 실행되는 함수
                        console.log("종료");
                    }, 50);
                }
            });
        }

    }

}

// 화면: hidden 호출스택: 백그라운드 : interval(tick, 1000) 태스크큐:

const timer = new Timer(() => {
    console.log('called');
})

const startButton = document.getElementById("timer-start");
const pauseButton = document.getElementById("timer-pause");

startButton.addEventListener('click', timer.start.bind(timer));
pauseButton.addEventListener('click', timer.pause.bind(timer));

// 화면: hidden 호출스택: 백그라운드 : interval(tick, 1000) 태스크큐:
let gopherPercent = 0.2;
let bombPercent = 0.6;

function tick() {
    if (started == true) {
        holes.forEach((hole, index) => {
            if (hole) 
                return; // 무언가 일어나고 있으면 return
            const randomValue = Math.random(); // 시간 조정 하는 함수 0~1 사이 난수를 무작위로 추출
            if (randomValue < gopherPercent) {
                const $gopher = $$cells[index].querySelector('.gopher');
                holes[index] = setTimeout(
                    () => { // 1초 뒤에 사라짐
                        $gopher
                            .classList
                            .add('hidden');
                        holes[index] = 0;
                    },
                    (time) < 21
                        ? 500
                        : 1000 //삼항연산자로 일정 시간이 남으면 tick의 속도가 빨라지는 코드를 추가 (time이 21초 미만으로 떨어지면 1초에서 0.5초만에 tick 동작함)
                );
                $gopher
                    .classList
                    .remove('hidden');
            } else if (randomValue < bombPercent) {
                const $bomb = $$cells[index].querySelector('.bomb');
                holes[index] = setTimeout(
                    () => { // 1초 뒤에 사라짐
                        $bomb
                            .classList
                            .add('hidden');
                        holes[index] = 0;
                    },
                    (time) <= 21
                        ? 500
                        : 1000
                );
                $bomb
                    .classList
                    .remove('hidden');
                if (time < 21) {
                    $hurryUp.textContent = 'HURRY UP!!!!!!!!!!'
                }
            }
        });
    } else if (started == false || time == 0) {
        console.log("tick stop")
    }
}

// 점수 조정
$$cells.forEach(($cell, index) => {
    $cell
        .querySelector('.gopher')
        .addEventListener('click', (event) => { //gopher라는 클래스가 클릭되면 1점씩 추가
            if (!event.target.classList.contains('dead')) { //dead라는 클래스가 붙은 태그가 클릭되지 않았을때! 점수가 1점씩 추가!
                score += 1;
                $score.textContent = `점수 : ${score}`;
            }
            event
                .target
                .classList
                .add('dead'); //gopher 클릭하면 dead라는 클래스가 붙은 css! 아파서 우는 두더지가 튀어나오고
            event
                .target
                .classList
                .add('hidden'); //gopher는 bottom으로 200px이 내려감
            clearTimeout(holes[index]); // 기존 내려가는 타이머 제거
            setTimeout(() => {
                holes[index] = 0;
                event
                    .target
                    .classList
                    .remove('dead');
            }, 1000);
        });

    $cell
        .querySelector('.bomb')
        .addEventListener('click', (event) => {
            // 여기 if문으로 폭탄을 누르면 점수 차감되고 textCntent를 넣어 실시간으로 차감된 점수를 확인 가능
            if (!event.target.classList.contains('boom')) {
                console.log(document.classList)
                score -= 1;
                $score.textContent = `점수: ${score}`;
            }

            event
                .target
                .classList
                .add('boom');
            event
                .target
                .classList
                .add('hidden');
            clearTimeout(holes[index]); // 기존 내려가는 타이머 제거
            setTimeout(() => {
                holes[index] = 0;
                event
                    .target
                    .classList
                    .remove('boom');
            }, 1000);
        });
});

//음악 버튼 리스너로 각 버튼에 메서드를 달아줌
stop.addEventListener('click', () => {
    console.log("음악 정지");
    let stop = mp3.pause();
})

play.addEventListener('click', () => {
    console.log("음악 재생");
    let play = mp3.play();
})