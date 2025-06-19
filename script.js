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
        const mark = activePlayer.getMark();
        const success = Gameboard.updateCell(index,mark);
        if (!success) return;

        const result = checkWinner();
        if(result) {
            const message = document.getElementById("messege");
            const playAgainBtn = document.getElementById("play-again-btn");
            if (result === 'tie') {
                message.textContent = "Tie!";
            } else {
                message.textContent = `${activePlayer.getName()} win!`
            }

            playAgainBtn.style.display = "block";
            return;
        }


        switchPlayer();
    }

    return {
        initPlayers,
        getActivePlayer: () => activePlayer,
        playRound
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

    const RstartController = (() => {
        const restartBtn = document.getElementById("restart-btn");

        restartBtn.addEventListener("click", () => {
            Gameboard.reset();
            document.getElementById("messege").textContent = "";
            ScreenController.render()
        });
     })();

})();

