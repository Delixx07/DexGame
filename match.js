const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('#startButton'),
    win: document.querySelector('.win'),
    overlay: document.querySelector('.overlay')
}

const state = {
    gameStarted: false,
    totalTime: 0,
    loop: null,
    flippedCards: []
}

const shuffle = array => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [clonedArray[i], clonedArray[randomIndex]] = [clonedArray[randomIndex], clonedArray[i]];
    }
    return clonedArray;
}

const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];
    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }
    return randomPicks;
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');  
    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }
    const emojis = ['🐯', '🐶', '🐷', '🐺', '🦁', '🦊', '🐨', '🐮', '🐵', '🐼'];
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2); 
    const items = shuffle([...picks, ...picks]);
    
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    const parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));
}

const resetGame = () => {
    state.gameStarted = false;
    state.totalTime = 0;
    state.flippedCards = [];
    clearInterval(state.loop);
    selectors.timer.innerText = `Time: 0 sec`;
    selectors.start.classList.remove('disabled');
    selectors.overlay.style.display = 'flex'; 
    selectors.win.style.display = 'none'; 
    
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('flipped');
    });
    
    startGame(); 
}



const startGame = () => {
    state.gameStarted = true;
    selectors.start.style.display = 'none'; 
    selectors.overlay.style.display = 'none';

    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    }, 1000);

    generateGame();
}

const flipCard = card => {
    if (state.flippedCards.length < 2) { 
        card.classList.add('flipped');
        state.flippedCards.push(card);
    
        if (state.flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

const checkForMatch = () => {
    const [firstCard, secondCard] = state.flippedCards;
    const isMatch = firstCard.querySelector('.card-back').innerText === secondCard.querySelector('.card-back').innerText;

    if (isMatch) {
        state.flippedCards = [];
        if (!document.querySelectorAll('.card:not(.flipped)').length) {
            setTimeout(() => {
                showWinPopup(); 
                clearInterval(state.loop);
            }, 1000);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            state.flippedCards = [];
        }, 1000);
    }
}

const showWinPopup = () => {
    selectors.win.style.display = 'block'; 
    selectors.win.innerHTML = `
        <span class="win-text">
            You win!<br />
            Time: <span class="highlight">${state.totalTime}</span> seconds
        </span>
        <button id="tryAgainButton">Try Again</button>
    `;
}



const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped') && state.gameStarted) {
            flipCard(eventParent);
        } else if (eventTarget.id === 'startButton' && !eventTarget.className.includes('disabled')) {
            startGame();
        } else if (eventTarget.id === 'tryAgainButton') {
            resetGame(); 
        }
    });
}

attachEventListeners();
