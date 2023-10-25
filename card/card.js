// 요소 선택
const cards = document.querySelectorAll(".card");
const timerScoreContainer = document.getElementById("timer-score");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
const gameStatusText = document.getElementById("game-status");
const btnsContainer = document.getElementById("btns");
const replayBtn = document.getElementById("replay");
const homeBtn = document.getElementById("home");

// 변수 정의
const TIME_IN_SECONDS = 100;
let matchedCard = 0; // 짝이 맞은 카드 쌍의 수
let disabled = false; // 카드를 못 뒤집게 막아놓은 상태, false이면 뒤집을 수 있음
let cardOne = "";
let cardTwo = "";

function matchCards(img1, img2) {
  // 짝이 맞은 경우
  if (img1 === img2) {
    // 스코어 1 증가
    matchedCard++;
    scoreText.innerText = matchedCard;

    // 카드 클릭 이벤트 제거
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);

    // 카드 마우스 기본 커서로 변경
    cardOne.style.cursor = "default";
    cardTwo.style.cursor = "default";

    // 설정 초기화
    cardOne = cardTwo = "";
    disabled = false;

    // 다 맞춘 경우 0.3초 뒤 게임 종료
    if (matchCards === 8) {
      setTimeout(() => {
        finishGame("✨ Mission Clear ✨");
      }, 300);
    }
  } else {
    // 짝이 다른 경우

    // 0.3초 뒤 카드 흔들기
    setTimeout(() => {
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
    }, 300);

    // 1초 뒤 카드 흔들기, 뒤집기 효과 제거하고, 설정 초기화
    setTimeout(() => {
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      cardOne = cardTwo = "";
      disabled = false;
    }, 1000);
  }
}

function flipCard(e) {
  let clickedCard = e.target;

  // 첫번째로 뒤집은 카드를 또 클릭하면 return
  if (clickedCard === cardOne) return;

  // 카드를 못 뒤집게 막아놨으면 return
  if (disabled) return;

  // 카드 뒤집기
  clickedCard.classList.add("flip");

  // 첫번째 카드인 경우, 첫번째 카드로 지정하고 return
  if (!cardOne) {
    cardOne = clickedCard;
    return;
  }

  // 두번째 카드인 경우, 두번째 카드로 지정
  cardTwo = clickedCard;

  // 카드 뒤집지 못하게 설정
  disabled = true;

  // 카드 이미지를 비교하여 짝이 맞는 카드인지 확인
  let cardOneImg = cardOne.querySelector(".back-view img").src;
  let cardTwoImg = cardTwo.querySelector(".back-view img").src;
  matchCards(cardOneImg, cardTwoImg);
}

function shuffleCards() {
  // 랜덤 배열 만들기
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  // 각 카드에 랜덤 이미지 지정, 카드 클릭 이벤트 지정
  cards.forEach((card, index) => {
    let cardImg = card.querySelector(".back-view img");
    cardImg.src = `img/${arr[index]}.jpg`;
    card.addEventListener("click", flipCard);
  });
}

function finishGame(status) {
  // 메세지(미션클리어 or 타임오버) 표시
  gameStatusText.innerText = status;
  gameStatusText.style.display = "block";

  // 버튼(다시하기, 홈 화면) 표시
  btnsContainer.style.display = "flex";
  replayBtn.addEventListener("click", () => location.reload());
  homeBtn.addEventListener("click", () => {
    location.href = "/";
  });

  // 카드 뒤집지 못하게 막아두기
  cards.forEach((card) => {
    card.removeEventListener("click", flipCard);
    card.style.cursor = "default";
  });
}

function initGame() {
  // 타이머 설정
  timerText.innerText = TIME_IN_SECONDS;

  let timer = setInterval(() => {
    timerText.innerText = timerText.innerText - 1;
  }, 1000);

  // 타임오버 되면 게임을 종료하고 타임오버 메세지 표시
  setTimeout(() => {
    clearInterval(timer);
    finishGame("💥 Game Over💥");
  }, TIME_IN_SECONDS * 1000);

  // 카드 섞기
  shuffleCards();
}

initGame();
