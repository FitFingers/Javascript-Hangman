(function() {  
// VARIABLES
const ALL_KEYS = [...document.getElementsByClassName("key")],
      STRIKES = [...document.getElementsByClassName("strike")],
      FRAMES = [...document.getElementsByClassName("hm-frame")],
      WORD = document.getElementById("word"),
      LEVELS = {0: "Easy", 1: "Medium", 2: "Hard", 3: "Very Hard"},
      LIVES = ["hm-rope", "hm-head", "hm-body", "hm-larm", "hm-rarm", "hm-lleg", "hm-rleg"],
      WORDS = {
        0: [],
        1: [],
        2: [],
        3: []
      };

let wordScale = 1,
    level = 0,
    word = "",
    strike = 0,
    score = 0,
    win = 0,
    loss = 0,
    gameOver = true,
    guessedLetters = [];



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
  resetWordWidth();
  STRIKES.map(s => initialiseLine(s));
  ALL_KEYS.map(k => k.classList.remove("fade"));
  document.getElementById("win-lose-screen").style.display = "none";
  [...WORD.children].map(L => WORD.removeChild(L));
  STRIKES.map(s => s.classList.remove("strikeout"));
  guessedLetters = [];
  strike = 0;
  score = 0;
  gameOver = false;
  word = generateWordFromObject().split("");
  word.map(L => createLetter(L));
  setWordWidth();
}

async function generateWordObject() {
  try {
    await fetch("https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun%2C%20verb%2C%20adjective%2C%20adverb&minCorpusCount=25000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=12&sortBy=count&sortOrder=asc&limit=28&api_key=08ad30bb163d00233f00804bbb10aef5770f4357d4c5f2051")
      .then((response) => response.json())
      .then((json) => sortWordObject(json));
  } catch (error) {
    alert(`Something's gone wrong: ${error}`)
  }
}

// function generateWordObject() {
//   WORDS[0] = ["COMBO", "DOGGY", "PLATES"];
// }

function sortWordObject(result) {
  result.map(R => {
    const W = R.word.toUpperCase(),
          L = R.word.length;
    L <= 5 ? WORDS[0].push(W) :
    L <= 7 ? WORDS[1].push(W) :
    L <= 9 ? WORDS[2].push(W) :
    WORDS[3].push(W);
  });
}

function generateWordFromObject() {
  const NEW_WORD = WORDS[level][Math.floor(Math.random()*WORDS[level].length)];
  if (NEW_WORD.search(/\W|_/g) >= 0) {
    removeWordFromObject(level, NEW_WORD);
    word = "";
    startGame();
  } else {
    return NEW_WORD;
  }
}

function removeWordFromObject(wordLevel, oldWord) {
  const INDEX = WORDS[wordLevel].indexOf(oldWord);
  WORDS[wordLevel] = WORDS[wordLevel].slice(0, INDEX).concat(WORDS[wordLevel].slice(INDEX+1));
  checkWordObject();
}

function checkWordObject() {
  if (WORDS[level].length <= 1) {
    generateWordObject();
  }
}

function setWordWidth() {
  const TARGET = window.innerWidth - 40,
        ACTUAL = WORD.offsetWidth;
  if (ACTUAL > TARGET) {
    WORD.style.transform = `scale(${TARGET/ACTUAL})`;
    WORD.style.margin = "20px";
  }
}

function resetWordWidth() {
  WORD.style.transform = "scale(1)";
  WORD.style.margin = "auto";
}

function randomLetter() {
  return String.fromCharCode(Math.floor(Math.random()*26 + 65));
}

function createLetter(L) {
  const NEW_LETTER = document.createElement("div"),
        LETTER_DISPLAY = document.createElement("span"),
        LETTER_VALUE = document.createTextNode(randomLetter());
  NEW_LETTER.classList.add("letter");
  LETTER_DISPLAY.classList.add("letter-display");
  NEW_LETTER.appendChild(LETTER_DISPLAY);
  LETTER_DISPLAY.appendChild(LETTER_VALUE);
  WORD.appendChild(NEW_LETTER);
}

function takeGuess() {
  if (gameOver === false) {
    const KEY = getKey(event),
          FOUND_LETTERS = word.map(L => L === KEY);

    if (!guessedLetters.includes(KEY)) {
      !FOUND_LETTERS.includes(true) ?
        failGuess() : renderCorrectLetters(KEY, FOUND_LETTERS);
    }
    blockLetter(KEY);
  }
}

function getKey(event) {
  const KEY = event.keyCode !== 32 ? event.target.id || String.fromCharCode(event.keyCode) : null;
  if (KEY.search(/[a-z]/i) >= 0) return KEY.toUpperCase();
}

function renderCorrectLetters(key, arr) {
  arr.map((L, i) => {
    if (arr[i]) {
      WORD.children[i].children[0].classList.add("found-letter");
      WORD.children[i].children[0].innerHTML = key;
      score++;
    }
  });
  checkScore();
}

function failGuess() {
  renderLine(LIVES[strike]);
  strike++;
  checkScore();
}

function initialiseLine(line) {
  const LENGTH = line.getTotalLength();
  line.style.strokeDasharray = LENGTH;
  line.style.strokeDashoffset = LENGTH;
}

function renderLine(id) {
  const LINE = document.getElementById(id),
        LENGTH = LINE.getTotalLength();
  LINE.style.transition = LINE.style.WebkitTransition = "none";
  LINE.style.strokeDasharray = `${LENGTH} ${LENGTH}`;
  LINE.style.strokeDashoffset = LENGTH;
  LINE.getBoundingClientRect();
  LINE.style.transition = LINE.style.WebkitTransition = "stroke-dashoffset 800ms ease-in-out";
  LINE.style.strokeDashoffset = 0;
}

function checkScore() {
  if (score === word.length) endGame("WIN");
  if (strike === STRIKES.length) setTimeout(() => endGame("LOSE"), 1400);
}

function blockLetter(L) {
  guessedLetters.push(L);
  document.getElementById(L).classList.add("fade");
}

function endGame(WL) {
  gameOver = true;
  WL === "WIN" ? win++ : loss++;
  document.getElementById("result-display").innerHTML = `YOU ${WL}.`;
  document.getElementById(WL).innerHTML = WL === "WIN" ? win : loss;
  document.getElementById("show-word").innerHTML = word.join("");
  document.getElementById("win-lose-screen").style.display = "grid";
  removeWordFromObject(level, word.join(""));
}

async function pageLoad() {
  await generateWordObject(sortWordObject);
  renderLevel();
  STRIKES.map(s => initialiseLine(s));
  FRAMES.map(f => {
    initialiseLine(f);
    renderLine(f.id)});
  startGame();
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
window.onload = pageLoad();



})();
