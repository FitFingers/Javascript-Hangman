// VARIABLES
const ALL_KEYS = [...document.getElementsByClassName("key")];
const STRIKES = [...document.getElementsByClassName("strike")];
const WORD = document.getElementById("word");
const LEVELS = {0: "Easy", 1: "Medium", 2: "Hard", 3: "Very Hard"};
const WORDS = {
  0: [
    "CAT",
    "DOG",
    "DOOR",
    "BUGS",
    "BED"
  ],
  1: [
    "BOTTLE",
    "DWARF",
    "FRIENDS",
    "FRISBEE",
    "HORSES"
  ],
  2: [
    "UNIVERSITY",
    "COMPONENT",
    "CELEBRATE"
  ],
  3: [
    "SMORGASBORD",
    "DISCOMBOBULATE"
  ]
};

let level = 0,
    word = "",
    strike = 0,
    score = 0,
    win = 0,
    loss = 0;



// FUNCTIONS
function increment(e) {
  e.target.id === "increment" ? level++ : level--;
  level = (level+4) % 4;
  renderLevel();
}

function renderLevel() {
  document.getElementById("level").innerHTML = LEVELS[level];
}

function startGame() {
  document.getElementById("win-lose-screen").style.display = "none";
  word = generateNewWord().split("");
  strike = 0;
  score = 0;
  [...WORD.children].map(L => WORD.removeChild(L));
  STRIKES.map(s => s.classList.remove("strikeout"));
  word.map(L => createLetter(L));
}

function generateNewWord() {
  const NEW_WORD = WORDS[level][Math.floor(Math.random()*WORDS[level].length)];
  return NEW_WORD;
}

function createLetter(L) {
  const NEW_LETTER = document.createElement("div");
  const LETTER_DISPLAY = document.createElement("span");
  const LETTER_VAL = document.createTextNode(L);
  NEW_LETTER.classList.add("letter");
  LETTER_DISPLAY.classList.add("letter-display");
  LETTER_DISPLAY.appendChild(LETTER_VAL);
  NEW_LETTER.appendChild(LETTER_DISPLAY);
  renderLetter(NEW_LETTER);
}

function renderLetter(L) {
  WORD.appendChild(L);
}

function getKey(event) {
  const KEY =  event.target.id || String.fromCharCode(event.keyCode);
  if (KEY.search(/[a-z]/i) >= 0) { return KEY.toUpperCase() };
}

function renderCorrectLetters(arr) {
  arr.map((L, i) => {
    if (arr[i] === true) {
      WORD.children[i].children[0].classList.add("found-letter");
      score++;
    }
  });
}

function failGuess() {
  document.getElementById("hangman").children[strike].classList.add("strikeout");
  strike++;
}

function checkScore() {
  if (score === word.length) { endGame("WIN") }
  if (strike === STRIKES.length) { endGame("LOSE") }
}

function takeGuess() {
  const KEY = getKey(event);
  const FOUND_LETTERS = word.map(L => L === KEY);
  
  if (FOUND_LETTERS.indexOf(true) < 0) {
    failGuess();
    checkScore();
  } else {
    renderCorrectLetters(FOUND_LETTERS);
    checkScore();
  }
}

function endGame(WL) {
  let bg = "";
  if (WL === "WIN") { win++; bg="lightgreen" } else { loss++; bg="pink" };
  document.getElementById("win-lose-screen").style.background = bg;
  document.getElementById("result-display").innerHTML = `YOU ${WL}!`;
  document.getElementById(WL).innerHTML = WL === "WIN" ? win : loss;
  document.getElementById("win-lose-screen").style.display = "flex";
}



// EVENT LISTENERS
[...document.getElementsByClassName("incrementer")].map(i => i.addEventListener("click", increment));

[...document.getElementsByClassName("start")].map(b => b.addEventListener("click", startGame));

ALL_KEYS.map(k => {
  k.innerHTML = k.id;
  k.addEventListener("click", takeGuess);
});

window.addEventListener("keypress", takeGuess);



// PAGE LOAD
window.onload = () => {
  renderLevel();
  startGame();
}
