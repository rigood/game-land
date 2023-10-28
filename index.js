// 회전하는 메뉴판
const gameList = document.querySelector(".game-list");
const gameItems = document.querySelectorAll(".game-list li");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

const ROTATE_ANGLE = 360 / gameItems.length;
let currentAngle = 0;

leftButton.addEventListener("click", function (e) {
  currentAngle += ROTATE_ANGLE;
  gameList.style.transform = `rotateY(${currentAngle}deg)`;
});

rightButton.addEventListener("click", function (e) {
  currentAngle -= ROTATE_ANGLE;
  gameList.style.transform = `rotateY(${currentAngle}deg)`;
});

// 미완성 게임 클릭 시 준비중 문구 표시
const gameItemsLinks = document.querySelectorAll(".game-list li a");

gameItemsLinks.forEach((i) => {
  if (i.href.slice(-1) === "#") {
    i.title = "준비중입니다.";
    i.parentElement.style.cursor = "default";
    i.parentElement.addEventListener("click", () =>
      alert("게임 준비중입니다.")
    );
  }
});

// 타이틀 타이핑 효과
const titleTypingText = document.querySelector(".title-typing-text");
const titleText = "Welcome to Game Land!";

let titleCharIndex = 1;

function titleTypingEffect() {
  const currentChar = titleText.substring(0, titleCharIndex);
  titleTypingText.textContent = currentChar;
  titleTypingText.classList.add("stop-blinking");

  if (titleCharIndex < titleText.length) {
    titleCharIndex++;
    setTimeout(titleTypingEffect, 200);
  } else {
    titleTypingText.classList.remove("stop-blinking");
  }
}

titleTypingEffect();
