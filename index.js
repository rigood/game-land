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
