/*==============================
  VARIABLES
==============================*/
const board = document.getElementById('gameboard');
const CARD_LIST = [
  { name: 'A' },
  { name: 'B' },
  { name: 'C' },
  { name: 'D' },
  { name: 'E' },
  { name: 'F' },
  { name: 'G' },
  { name: 'H' },
  { name: 'I' },
  { name: 'J' },
  { name: 'K' },
  { name: 'L' },
];
let cards = [];
let timer = null;
let timeSpent = 0;
let moves = 0;
let count = 0;
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
  renderMoveCount(moves);
  resetOpenCards();
  resetTimer();

  cards.forEach(card => {
    // const innerHTML = `
    //   <div class="card__inner">
    //     <div class="card__back">
    //     </div>
    //     <div class="card__front">
    //       ${card.name}
    //     </div>
    //   </div>
    // `;

    const element = document.createElement('div');
    element.classList.add('card');
    element.dataset.name = card.name;
    element.textContent = card.name;
    element.addEventListener('mousedown', onCardMouseDown);
    element.addEventListener('mouseup', onCardMouseUp);
    element.addEventListener('click', onCardClick);

    board.appendChild(element);
  });
}

const shuffle = cards => {
  return cards.sort(() => 0.5 - Math.random());
}

const onCardClick = e => {
  const target = e.target;

  if (count < 2 && prevTarget !== target) {
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
        onCardMatch();
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
  e.target.classList.add('mousedown');
}

const onCardMouseUp = e => {
  e.target.classList.remove('mousedown');
}

const onCardMatch = () => {
  const cardsOpen = document.querySelectorAll('.open');
  cardsOpen.forEach(card => {
    card.classList.add('match');
  });
  resetOpenCards();
};

const onCardUnmatch = () => {
  const cardsOpen = document.querySelectorAll('.open');
  cardsOpen.forEach(card => {
    card.classList.add('unmatch');
  });
  setTimeout(resetOpenCards, 500);
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