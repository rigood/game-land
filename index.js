const gameList = document.querySelector(".game-list");
const gameItems = document.querySelectorAll(".game-list li");
const notAvailableGameLinks = document.querySelectorAll(".game-list a");

notAvailableGameLinks.forEach((i) => {
  if (i.href.slice(-1) === "#") {
    i.title = "준비중입니다.";
    i.parentElement.style.cursor = "default";
    i.parentElement.addEventListener("click", () =>
      alert("게임 준비중입니다.")
    );
  }
});

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
