const infoBox = document.querySelector(".info-box");
const exitBtn = document.querySelector(".exit");
const startBtn = document.querySelector(".start");

function init() {
  infoBox.classList.add("active");
}

exitBtn.addEventListener("click", () => (location.href = "../index.html"));
startBtn.addEventListener("click", startGame);

function startGame() {}

init();
