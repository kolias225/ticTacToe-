const Gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const updateCell = (index, mark) => {
        if (board[index] === '') {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';

        }
    };


    return { getBoard, updateCell, reset }
})();
console.log(Gameboard.getBoard());

const Player = (name, mark) => {
    return {
        getName: () => name,
        getMark: () => mark
    };
};




const GameController = (() => {
    let player1, player2;
    let activePlayer;
    let gameOver = false;

    const switchPlayer = () => {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    };



    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const initPlayers = (name1, mark1, name2, mark2) => {
        player1 = Player(name1, mark1);
        player2 = Player(name2, mark2);
        activePlayer = player1;
        gameOver = false;
    }


    const checkWinner = () => {
        const board = Gameboard.getBoard();

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (board.every(cell => cell !== '')) {
            return 'tie';
        }
        return null;
    }



    const playRound = (index) => {
        if (gameOver) return;


        const mark = activePlayer.getMark();
        const success = Gameboard.updateCell(index,mark);
        if (!success) return;

        const result = checkWinner();
        if(result) {
            const modal = document.getElementById("result-modal");
            const resultText = document.getElementById("result-text");
            const playAgainBtn = document.getElementById("play-again-btn")
            if (result === 'tie') {
                resultText.textContent = "Tie!";
            } else {
                resultText.textContent = `${activePlayer.getName()} win!`
            }

            modal.style.display = "flex";
            gameOver = true;
            return;
        }

        switchPlayer();

    };


          const resetGame = () => {
    Gameboard.reset();
    gameOver = false;
    activePlayer = player1;
          };


    return {
        initPlayers,
        getActivePlayer: () => activePlayer,
        playRound,
        resetGame
    };


    
})(); 


//DOM

const ScreenController = (() => {
    const cells = document.querySelectorAll(".cell");

    const render = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const addListeners = () => {
        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                const index = parseInt(cell.dataset.index);
                GameController.playRound(index);
                render();
            });
        });
    };

    addListeners();
    render();

    return { render };
})();

const StartScreenController = (() => {
    const startBtn = document.getElementById("start-btn");
    const nameInput = document.getElementById("player-name");
    const markSelect = document.getElementById("player-mark");
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");

    startBtn.addEventListener("click", () => {
        const name = nameInput.value.trim() || "Player";
        const mark = markSelect.value;
        const opponentMark = mark === "X" ? "O" : "X";

        GameController.initPlayers(name, mark, "Bot", opponentMark);

        Gameboard.reset();

        startScreen.style.display = "none";
        gameScreen.style.display = "block";

        ScreenController.render();

    });

    const RestartController = (() => {
    const restartBtn = document.getElementById("play-again-btn");
    const modal = document.getElementById("result-modal");

    restartBtn.addEventListener("click", () => {
        Gameboard.reset();
        GameController.resetGame();
        ScreenController.render();
        modal.style.display = "none";
    });

    const mainMenuBtn = document.getElementById("main-menu-btn");
    mainMenuBtn.addEventListener("click", () => {
        Gameboard.reset();
        GameController.resetGame();
        ScreenController.render();

        modal.style.display = "none";

        document.getElementById("game-screen").style.display = "none";
        document.getElementById("start-screen").style.display = "flex";
    })
})();

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", () => {
    GameController.resetGame();
    ScreenController.render();
});

})();

