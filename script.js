/*==============================
  VARIABLES
==============================*/
const board = document.getElementById('gameboard');
const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal__title');
const modalMessage = document.getElementById('modal__message');
const modalTimeSpent = document.getElementById('modal__timeSpent');
const modalTotalMoves = document.getElementById('modal__totalMoves');
const modalClose = document.getElementById('modal__close');
const highscoreList = document.getElementById('highscore');
const CARD_LIST = [
  { name: 'cat', img: 'images/cat.svg' },
  { name: 'chicken', img: 'images/chicken.svg' },
  { name: 'cow', img: 'images/cow.svg' },
  { name: 'dog', img: 'images/dog.svg' },
  { name: 'elephant', img: 'images/elephant.svg' },
  { name: 'fox', img: 'images/fox.svg' },
  { name: 'monkey', img: 'images/monkey.svg' },
  { name: 'panda', img: 'images/panda.svg' },
  { name: 'pig', img: 'images/pig.svg' },
  { name: 'sheep', img: 'images/sheep.svg' },
  { name: 'tiger', img: 'images/tiger.svg' },
  { name: 'zibra', img: 'images/zibra.svg' },
];
let cards = [];
let timer = null;
let timeSpent = 0;
let moves = 0;
let count = 0;
let score = 0;
let highscores = [];
let firstCard = '';
let secondCard = '';
let prevTarget = null;
let restartButton = document.getElementById('restart');

/*==============================
  FUNCTIONS
==============================*/
const startGame = () => {
  cards = shuffle(CARD_LIST.concat(CARD_LIST));
  board.innerHTML = '';
  moves = 0;
  score = 0;
  renderMoveCount(moves);
  renderHighScore();
  resetOpenCards();
  resetTimer();
  renderCards(cards);
}

const endGame = () => {
  // stop timer;
  clearInterval(timer);

  // add up score
  const timeBonus = (180 - timeSpent) ^ 2;
  const moveBonus = (50 - moves) ^ 2;
  const totalPoints = score + timeBonus + moveBonus;
  highscores = getHighScore();
  highscores.push(totalPoints);
  console.log(highscores);
  highscores = highscores.sort((a, b) => b - a).slice(0, 5);
  console.log(highscores);
  setHighScore(highscores);

  // create inner html for modal display
  let titleHTML = 'Well done!!';
  let messageHTML = `You've got <b>${totalPoints}</b> points!`;
  let timeSpentHTML = `
    Time Spent: <b>${Math.floor(timeSpent / 60)} min ${timeSpent % 60} sec</b>
  `;
  let totalMovesHTML = `
    Total Moves: <b>${moves}</b> times
  `;

  if (totalPoints < 0) titleHTML = 'Oops!';

  modalTitle.innerHTML = titleHTML;
  modalMessage.innerHTML = messageHTML;
  modalTimeSpent.innerHTML = timeSpentHTML;
  modalTotalMoves.innerHTML = totalMovesHTML;
  modalContainer.style.display = 'flex';
  modalClose.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    startGame();
  })
}

const getHighScore = () => {
  if (localStorage.getItem('highscore')) {
    return JSON.parse(localStorage.getItem('highscore'));
  }
  return [];
}

const setHighScore = highscore => {
  localStorage.setItem('highscore', JSON.stringify(highscore));
}

const renderHighScore = () => {
  highscoreList.innerHTML = '';
  let highscoreHTML = '';

  highscores = getHighScore();
  if (highscores.length) {
    highscores.forEach(score => {
      highscoreHTML += `
        <li>${score}</li>
      `;
    })
  } else {
    highscoreHTML = `
      <li>Not Played Yet</li>
    `;
  }

  highscoreList.innerHTML = highscoreHTML;
}

const renderCards = cards => {
  cards.forEach(card => {
    const element = document.createElement('div');
    element.classList.add('card');
    element.dataset.name = card.name;

    const front = document.createElement('div');
    front.classList.add('card__front');

    const back = document.createElement('div');
    back.classList.add('card__back');
    back.style.backgroundImage = `url(${card.img})`;

    element.addEventListener('mousedown', onCardMouseDown);
    element.addEventListener('mouseup', onCardMouseUp);
    element.addEventListener('click', onCardClick);

    board.appendChild(element);
    element.appendChild(front);
    element.appendChild(back);
  });
}

const shuffle = cards => {
  return cards.sort(() => 0.5 - Math.random());
}

const onCardClick = e => {
  const target = e.target.parentNode;

  if (count < 2 && prevTarget !== target && target.tagName !== 'SECTION') {
    count++;

    if (count === 1) {
      firstCard = target.dataset.name;
      target.classList.toggle('open');
    } else {
      secondCard = target.dataset.name;
      target.classList.toggle('open');
    }

    if (firstCard !== '' && secondCard !== '')  {
      if (firstCard === secondCard) {
        setTimeout(onCardMatch, 250);
      } else {
        onCardUnmatch();
      }

      moves++;
      renderMoveCount(moves);
    }

    prevTarget = target;
  }
}

const onCardMouseDown = e => {
  e.target.parentNode.classList.add('mousedown');
}

const onCardMouseUp = e => {
  e.target.parentNode.classList.remove('mousedown');
}

const onCardMatch = () => {
  score += 20;
  const cardsOpen = document.querySelectorAll('.open');
  cardsOpen.forEach(card => {
    card.classList.add('match');
  });
  const cardsMatched = document.querySelectorAll('.match');
  if (cardsMatched.length === cards.length) {
    endGame();
  }
  resetOpenCards();
};

const onCardUnmatch = () => {
  const cardsOpen = document.querySelectorAll('.open');
  cardsOpen.forEach(card => {
    card.classList.add('unmatch');
  });
  setTimeout(resetOpenCards, 1000);
};

const resetOpenCards = () => {
  count = 0;
  firstCard = '';
  secondCard = '';
  prevTarget = null;
  const cardsOpen = document.querySelectorAll('.open');
  cardsOpen.forEach(card => {
    card.classList.remove('open');
    if (card.classList.contains('unmatch')) {
      card.classList.remove('unmatch');
    }
  });
}

const resetTimer = () => {
  const timerElement = document.getElementById('timer');
  const startTimer = () => {
    timeSpent++;
    timerElement.textContent = `${Math.floor(timeSpent / 60)} min ${timeSpent % 60} sec`;
  }

  clearInterval(timer);
  timeSpent = 0;
  timerElement.textContent = `0 min 0 sec`;

  timer = setInterval(startTimer, 1000);
}

const renderMoveCount = count => {
  const moveCounter = document.getElementById('moveCounter');
  moveCounter.textContent = count;
}

/*==============================
  EVENT LISTENERS
==============================*/
window.onload = startGame();

restartButton.addEventListener('click', startGame);