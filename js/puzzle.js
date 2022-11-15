const wrapper = document.querySelector(".wrapper");
const uploadBox = document.querySelector(".upload-box");
const randomBox = document.querySelector(".random-box");
const puzzleBox = document.querySelector(".puzzle-box");
const fileInput = uploadBox.querySelector("input");
const playButton = document.querySelector(".play-button");
const resetButton = document.querySelector(".reset-button");
const homeButton = document.querySelector(".home-button");
const titleAndTime = document.querySelector(".title-time");

const piecesCount = 16;

let pieces = [];
let isPlaying = false;

let time = 0;
let timeInterval;

const dragged = {
  element: null,
  index: null,
  className: null,
};

function finishGame() {
  isPlaying = false;
  clearInterval(timeInterval);
  puzzleBox.style.cursor = "auto";
  titleAndTime.innerHTML = "Finished " + getTimeFormatString();
  puzzleBox
    .querySelectorAll("li")
    .forEach((li) => li.setAttribute("draggable", "false"));
}

function checkStatus() {
  const currentList = [...puzzleBox.children];
  const unMatchedList = currentList.filter(
    (li, index) => Number(li.getAttribute("data-index")) !== index
  );
  if (unMatchedList.length === 0) {
    finishGame();
  }
}

function getTimeFormatString() {
  let min = parseInt(String(time / 60));
  let sec = time % 60;

  if (min >= 60) return "Game Over";

  return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

function getTime() {
  time++;
  titleAndTime.innerHTML = "Time " + getTimeFormatString();
}

function startClock() {
  getTime();
  timeInterval = setTimeout(startClock, 1000);
}

function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
}

const startGame = () => {
  isPlaying = true;
  startClock();
  puzzleBox.style.cursor = "pointer";
  playButton.style.display = "none";
  shuffle(pieces).forEach((piece) => puzzleBox.appendChild(piece));
};

const setPuzzleWithRandomImage = () => {
  wrapper.classList.add("active");
  playButton.style.display = "block";
  titleAndTime.innerText = "Ready?";

  Array(piecesCount)
    .fill()
    .forEach((_, index) => {
      const li = document.createElement("li");
      li.style.backgroundImage = "url('https://placeimg.com/400/400/any')";
      li.setAttribute("draggable", "true");
      li.setAttribute("data-index", index);
      li.classList.add("puzzle-piece", `list${index}`);
      pieces.push(li);
      puzzleBox.appendChild(li);
    });
};

const setPuzzleWithUploadImage = (dataUrl) => {
  wrapper.classList.add("active");
  playButton.style.display = "block";
  titleAndTime.innerText = "Ready?";

  Array(piecesCount)
    .fill()
    .forEach((_, index) => {
      const li = document.createElement("li");
      li.style.backgroundImage = "url(" + dataUrl + ")";
      li.setAttribute("draggable", "true");
      li.setAttribute("data-index", index);
      li.classList.add("puzzle-piece", `list${index}`);
      pieces.push(li);
      puzzleBox.appendChild(li);
    });
};

const resizeImage = (img, type) => {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 400, 400);

  const dataUrl = canvas.toDataURL(type);
  setPuzzleWithUploadImage(dataUrl);
};

const loadFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.onload = function (e) {
      resizeImage(img, file.type);
    };
  };

  fileReader.readAsDataURL(file);
};

const resetGame = () => {
  window.location.reload();
};

puzzleBox.addEventListener("drop", (e) => {
  if (!isPlaying) return;

  const dropped = e.target; // 드롭 요소
  if (dropped.className !== dragged.className) {
    let isLast;
    let originPlace;

    if (dragged.element.nextSibling) {
      isLast = false;
      originPlace = dragged.element.nextSibling;
    } else {
      isLast = true;
      originPlace = dragged.element.previousSibling;
    }

    // children은 객체이기 때문에 배열로 만들어 준 다음 index를 구함
    const droppedIndex = [...dropped.parentNode.children].indexOf(dropped);

    // 드래그한 조각이 뒤에 있으면 드롭한 조각 앞으로 가져다놓고
    // 드래그한 조각이 앞에 있으면 드롭한 조각 뒤로 가져다놓음
    dragged.index > droppedIndex
      ? dropped.before(dragged.element)
      : dropped.after(dragged.element);

    // 두 칸 이상 떨어진 조각들 사이에서 드래그 앤 드롭을 할 때는
    // 위 코드로만 실행하면 조각들이 한칸씩 밀림
    // 드래그한 조각과 드롭한 조각의 위치만 바꿔줘야 하므로
    // 드롭한 조각을 드래그한 조각의 원래 위치로 가져다 놓아야함
    // 드래그한 조각의 원래 위치는 드래그한 조각이 마지막 조각인지 여부에 따라 달라짐
    // 드래그한 조각이 마지막 조각이었다면 드래그한 조각의 이전 조각을 기준점으로 잡고
    // 그 기준점에 뒤에다가 드롭한 조각을 가져다 놓으면 되고
    // 드래그한 조각이 마지막 조각이 아니었다면 드래그한 조각의 다음 조각을 기준점으로 잡고
    // 그 기준점의 앞에다가 드롭한 조각을 가져다 놓으면 된다.
    isLast ? originPlace.after(dropped) : originPlace.before(dropped);
  }

  checkStatus();
});

// 드래그한 요소가 드롭 요소 위에 있을 때 드롭 요소에게 발생하는 이벤트
// dragover한 상태에서 drop하게 되면 drop 이벤트가 발생하지 않기 때문에
// preventDefault 처리함;
puzzleBox.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// 객체를 드래그 하려고 시작할 때 발생하는 이벤트
// 드래그한 요소의 정보를 저장함
puzzleBox.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;

  const obj = e.target;
  dragged.element = obj;
  dragged.className = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(obj);
});

fileInput.addEventListener("change", loadFile);
uploadBox.addEventListener("click", () => fileInput.click());
randomBox.addEventListener("click", setPuzzleWithRandomImage);

playButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
homeButton.addEventListener("click", () => {});
