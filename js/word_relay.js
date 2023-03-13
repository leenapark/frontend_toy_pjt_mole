/*
1. 몇명이 게임을 할지 정하기
2. 첫번째 사람 제시어 입력
 - 첫번째(이전) 제시어 위한 변수
 - input 요소에 입력, 버튼 클릭
 - 새로 입력한 제시어 저장 변수
*/ 
const number = Number(prompt('몇 명이 참가하나요?'));
const $button = document.querySelector('button');
const $input = document.querySelector('input');
const $word = document.querySelector('span#word');
const $order = document.querySelector('span#order');
let word; // 제시어
let newWord; // 새로 입력한 단어

const onClickButton = () => {
  // input value를 newWord에 대입
  newWord = $input.value;  

  // 제시어가 없거나(첫번째), 제시어의 마지막 글자와 입력의 첫글자 같을경우
  if (!word || word[word.length - 1] === newWord[0]) { 
    // 입력한 단어를 제시어로 대입
    word = newWord; 
    // 제시어 화면에 출력(span#word)
    $word.textContent = word;
    // 현재 순서값 숫자로 변경
    const order = Number($order.textContent);
    if (order + 1 > number) {
      $order.textContent = 1;
    } else {
      $order.textContent = order + 1;
    }
  } else if (!newWord){
    console.log("입력 값이 없습니다.");

  } else { // 올바르지 않은가
    console.log('올바르지 않은 단어입니다!');
  }
  $input.value = '';
  $input.focus();
};

// html문서 load
window.onload = function() {
  $input.focus();
}
// 버튼 클릭했을 때 함수 호출
$button.addEventListener('click', onClickButton);
// input요소에서 엔터키 눌렀을 때
$input.addEventListener('keydown', function search(e) {
  if(e.key == 'Enter') {
    onClickButton();
  }
});