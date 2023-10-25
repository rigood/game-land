const cards = document.querySelectorAll(".card");
const timeScore = document.getElementById("time-score");
const timeText = timeScore.querySelector("strong");
const matchedCardNum = document.getElementById("matchedCardNum");
const congratMsg = document.getElementById("congratMsg");
const buttons = document.getElementById("buttons");
const replayBtn = document.getElementById("replay");
const homeBtn = document.getElementById("home");

const timeLimit = timeText.innerText;

let matchedCard = 0;
let cardOne = "";
let cardTwo = "";
let disableDeck = false;

function setGameOver() {
  congratMsg.innerText = "💥 Game Over💥";
  cards.forEach((card) => {
    card.removeEventListener("click", flipCard);
    card.style.cursor = "default";
  });
}

function finishGame() {
  timeScore.style.display = "none";
  congratMsg.style.display = "block";
  buttons.style.display = "flex";
  replayBtn.addEventListener("click", shuffleCard);
}

function matchCards(img1, img2) {
  // ⭕⭕⭕ 동일한 카드인 경우 ⭕⭕⭕
  if (img1 === img2) {
    // 맞은 개수 1 증가시킴
    matchedCard++;

    // 카드 클릭 이벤트 제거
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);

    // 카드 마우스 기본커서로 변경
    cardOne.style.cursor = "default";
    cardTwo.style.cursor = "default";

    // 카드 초기화, 뒤집을 수 있도록 설정 초기화
    cardOne = cardTwo = "";
    disableDeck = false;

    // 0.1초 뒤 뒤집은 카드 쌍 개수 업데이트
    setTimeout(() => {
      matchedCardNum.innerText = matchedCard;
    }, 100);

    // 다 맞춘 경우 0.3초 뒤 게임 종료
    if (matchedCard === 8) {
      setTimeout(() => {
        finishGame();
      }, 300);
    }
  } else {
    // ❌❌❌ 동일한 카드가 아닌 경우 ❌❌❌

    // 0.4초 뒤 shake 효과
    setTimeout(() => {
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
    }, 400);

    // 1.2초 뒤 shake, flip 효과 제거, 카드 초기화, 뒤집을 수 있도록 설정 초기화
    setTimeout(() => {
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1200);
  }
}

function shuffleCard() {
  // 타이머 설정
  timeText.innerText = timeLimit;

  let timer = setInterval(() => {
    timeText.innerText = timeText.innerText - 1;
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
    finishGame();
    setGameOver();
  }, timeLimit * 1000);

  // 화면 초기화
  congratMsg.style.display = "none";
  timeScore.style.display = "flex";
  buttons.style.display = "none";

  // 게임 설정 초기화
  cardOne = cardTwo = "";
  disableDeck = false;
  matchedCard = 0;
  matchedCardNum.innerText = matchedCard;

  // 랜덤 배열 만들기
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  // 각 카드에 대해 뒤집기 제거, 랜덤 이미지 지정, 카드 클릭 이벤트 지정
  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `img/${arr[index]}.jpg`;
    card.addEventListener("click", flipCard);
    card.style.cursor = "pointer";
  });
}

function flipCard(e) {
  let clickedCard = e.target;

  // 동일한 카드를 또 클릭하면 return
  if (clickedCard === cardOne) return;

  // 다시 못 뒤집게 설정되어 있으면(=두번째 카드까지 뒤집었으면) return
  if (disableDeck) return;

  // 카드 뒤집기
  clickedCard.classList.add("flip");

  // 첫번째 카드로 지정하고 return
  if (!cardOne) {
    cardOne = clickedCard;
    return;
  }

  // 두번째 카드로 지정
  cardTwo = clickedCard;

  // 다시 못 뒤집게 설정함
  disableDeck = true;

  // 카드 이미지 비교를 위해 src를 변수에 저장
  let cardOneImg = cardOne.querySelector(".back-view img").src;
  let cardTwoImg = cardTwo.querySelector(".back-view img").src;

  matchCards(cardOneImg, cardTwoImg);
}

shuffleCard();
