export function spa() {
    const modalStart = document.querySelector('.modal-start');
    const modalRules = document.querySelector('.modal-rules');
    const modalTopScores = document.querySelector('.modal-top-scores');

    const buttonStartGame = document.querySelector('.button-start-game');
    const buttonStartRules = document.querySelector('.modal-start-rules-button');
    const buttonStartScores = document.querySelector('.modal-start-scores-button');

    const buttonRulesBack = document.querySelector('.rules-back-button');
    const buttonScoressBack = document.querySelector('.scores-back-button');

    const links = {
        start: `<div id="start-game-div"><h1>Mario game</h1>
            <div class="rules">
                <a href="#rules" class="modal-start-rules-button" title="Game rules">rules</a>
            </div>
            <div class="top-scores">
                <a href="#topScores" class="modal-start-scores-button" title="Top game scores">top scores</a>
            </div>
            <div class="name-block">
                <input type="text" class="name" id="name" required>
                <span class="bar"></span>
                <label class="label-name" for="name">enter your name</label>
            </div>
            <div class="button-block button-start-game">
                <button class="button" id="start-new-game">start new game</button>
            </div></div>`,
        rules: `<h1>Mario game RULES</h1>
            <div class="rules-rules">
                <div class="keys">
                    <p><span>W</span>,<span>A</span>,<span>D</span></p>
                    <p>---</p>
                    <p>Go Up, left, right</p>
                </div>
                <div class="keys">
                    <p><span>Space</span></p>
                    <p>---</p>
                    <p>shoot (when have fireflower)</p>
                </div>
                <div class="keys">
                    <p><span>ESC</span></p>
                    <p>---</p>
                    <p>pause</p>
                </div>
                <div class="rules-text">
                    <p>The goal of the game is to complete as many levels as possible, earning points.</p>
                    <ul class="score-rules">
                        <li>Hit the goomba - <span>100 scores.</span></li>
                        <li>Take a fireFlower - <span>50 scores</span></li>
                        <li>go to the next level - <span>100 scores</span></li>
                    </ul>
                    <p>the game continues until the player dies.</p>
                </div>
            </div>
            <div class="button-block">
                <a href="#start" class="button rules-back-button">back</a>
            </div>`,
        topScores: `<h1>top scores</h1>
                <div class="scores">
                    <ul class="scores-list" id="scores-list">
                        <li>Angelina - <span>0</span></li>
                        <li>Angelina - <span>0</span></li>
                        <li>Angelina - <span>0</span></li>
                        <li>Angelina - <span>0</span></li>
                        <li>Angelina - <span>0</span></li>
                    </ul>
                </div>
                <div class="button button-block">
                    <a href="#start" class="button scores-back-button">back</a>
            </div>`,
    };

    window.addEventListener('load', () => {
        if (window.location.hash.slice(1)) {
            updateState();
        } else {
            window.location.hash = '#start';
        }
    });

    window.addEventListener('hashchange', updateState);

    function updateState() {
        let content = links[window.location.hash.slice(1)];
        document.title = `Mario game - ${window.location.hash.slice(1)}`
        modalStart.innerHTML = content ? content : `<h1>Page not found</h1>`;
        addEventsListeners();
    };

    function addEventsListeners() {
        const startNewGameButton = document.getElementById('start-new-game');
        startNewGameButton?.addEventListener('click', function (event) {
            document.getElementsByTagName('canvas')[0].style.display = 'block';
            const playerName = document.getElementById('name').value;
            player.name = playerName;

            document.getElementById('start-game-div').style.display = 'none';
        });

    }
};



