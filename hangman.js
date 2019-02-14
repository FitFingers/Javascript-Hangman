// VARIABLES
const ALL_KEYS = [...document.getElementsByClassName("key")];
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

let level = 0;



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
  const WORD = generateNewWord().split("");
  console.log(WORD);
  WORD.map(L => createLetter(L));
}

function generateNewWord() {
  const NEW_WORD = WORDS[level][Math.floor(Math.random()*WORDS[level].length)];
  return NEW_WORD;
}

function createLetter(L) {
  const NEW_LETTER = document.createElement("span");
  const LETTER_DISPLAY = document.createElement("p");
  const LETTER_VAL = document.createTextNode(L);
  NEW_LETTER.classList.add("letter");
  LETTER_DISPLAY.classList.add("letter-display");
  LETTER_DISPLAY.appendChild(LETTER_VAL);
  NEW_LETTER.appendChild(LETTER_DISPLAY);
  console.log(NEW_LETTER);
  renderLetter(NEW_LETTER);
}

function renderLetter(L) {
  document.getElementById("word").appendChild(L);
}

function getKey(event) {
  const KEY =  event.target.id || String.fromCharCode(event.keyCode);
  return KEY;
}

function takeGuess() {
  const KEY = getKey(event);
}



// EVENT LISTENERS
[...document.getElementsByClassName("incrementer")].map(i => i.addEventListener("click", increment));

document.getElementById("start").addEventListener("click", startGame);

ALL_KEYS.map(k => {
  k.innerHTML = k.id;
  k.addEventListener("click", takeGuess);
});

window.addEventListener("keypress", takeGuess);



// PAGE LOAD
window.onload = () => {
  renderLevel();
  generateNewWord();
}
