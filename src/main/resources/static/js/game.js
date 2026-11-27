// Snake Game Engine with HTML5 Canvas & Spring Boot REST API integration

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const currentScoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayContent = document.getElementById('overlay-content');
    const startBtn = document.getElementById('start-btn');
    
    const scoreModal = document.getElementById('score-modal');
    const finalScoreVal = document.getElementById('final-score-val');
    const scoreForm = document.getElementById('score-form');
    const playerInitialsInput = document.getElementById('player-initials');
    const leaderboardBody = document.getElementById('leaderboard-body');

    const GRID_SIZE = 20;
    const TILE_COUNT = canvas.width / GRID_SIZE; // 20x20 grid

    // Game States: 'IDLE', 'PLAYING', 'PAUSED', 'GAMEOVER'
    let gameState = 'IDLE';

    let snake = [];
    let food = { x: 0, y: 0 };
    let dx = 1;
    let dy = 0;
    let nextDx = 1;
    let nextDy = 0;
    let score = 0;
    let highScore = 0;
    let gameInterval = null;
    let gameSpeed = 120; // ms per tick

    // Initialize leaderboard on load
    loadLeaderboard();

    // Event Listeners
    startBtn.addEventListener('click', startGame);
    scoreForm.addEventListener('submit', handleScoreSubmit);

    document.addEventListener('keydown', handleKeyPress);

    async function loadLeaderboard() {
        const scores = await fetchTopScores();
        
        if (scores.length > 0) {
            highScore = scores[0].score;
            highScoreEl.textContent = highScore;

            leaderboardBody.innerHTML = scores.map((s, index) => {
                const dateStr = new Date(s.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                });
                return `
                    <tr>
                        <td>#${index + 1}</td>
                        <td><strong>${escapeHtml(s.playerName)}</strong></td>
                        <td>${s.score}</td>
                        <td>${dateStr}</td>
                    </tr>
                `;
            }).join('');
        } else {
            leaderboardBody.innerHTML = `<tr><td colspan="4" class="no-scores">No high scores yet. Be the first!</td></tr>`;
        }
    }

    function startGame() {
        resetGame();
        gameState = 'PLAYING';
        gameOverlay.classList.add('hidden');
        scoreModal.classList.add('hidden');

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }

    function resetGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        dx = 1;
        dy = 0;
        nextDx = 1;
        nextDy = 0;
        score = 0;
        currentScoreEl.textContent = score;
        spawnFood();
    }

    function spawnFood() {
        let valid = false;
        while (!valid) {
            food = {
                x: Math.floor(Math.random() * TILE_COUNT),
                y: Math.floor(Math.random() * TILE_COUNT)
            };
            // Ensure food doesn't spawn on snake
            valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
        }
    }

    function handleKeyPress(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
            e.preventDefault(); // Prevent page scrolling
        }

        if (e.code === 'Space') {
            togglePause();
            return;
        }

        if (gameState !== 'PLAYING') return;

        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                if (dy === 0) { nextDx = 0; nextDy = -1; }
                break;
            case 'ArrowDown':
            case 'KeyS':
                if (dy === 0) { nextDx = 0; nextDy = 1; }
                break;
            case 'ArrowLeft':
            case 'KeyA':
                if (dx === 0) { nextDx = -1; nextDy = 0; }
                break;
            case 'ArrowRight':
            case 'KeyD':
                if (dx === 0) { nextDx = 1; nextDy = 0; }
                break;
        }
    }

    function togglePause() {
        if (gameState === 'PLAYING') {
            gameState = 'PAUSED';
            clearInterval(gameInterval);
            overlayContent.innerHTML = `
                <h2>GAME PAUSED</h2>
                <p>Press Space to resume.</p>
                <button id="resume-btn" class="arcade-btn">RESUME</button>
            `;
            document.getElementById('resume-btn').addEventListener('click', togglePause);
            gameOverlay.classList.remove('hidden');
        } else if (gameState === 'PAUSED') {
            gameState = 'PLAYING';
            gameOverlay.classList.add('hidden');
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    function gameLoop() {
        update();
        draw();
    }

    function update() {
        dx = nextDx;
        dy = nextDy;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Check wall collision
        if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
            gameOver();
            return;
        }

        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            currentScoreEl.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreEl.textContent = highScore;
            }
            spawnFood();

            // Slightly speed up every 50 points
            if (score % 50 === 0 && gameSpeed > 60) {
                gameSpeed -= 5;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            snake.pop();
        }
    }

    function draw() {
        // Clear canvas
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw subtle grid lines
        ctx.strokeStyle = '#0d111a';
        ctx.lineWidth = 1;
        for (let i = 0; i < TILE_COUNT; i++) {
            ctx.beginPath();
            ctx.moveTo(i * GRID_SIZE, 0);
            ctx.lineTo(i * GRID_SIZE, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * GRID_SIZE);
            ctx.lineTo(canvas.width, i * GRID_SIZE);
            ctx.stroke();
        }

        // Draw food (Glowing Apple)
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff0055';
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);

        // Draw snake
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake Head
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ff66';
                ctx.fillStyle = '#00ff66';
            } else {
                // Snake Body
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#00cc52';
                ctx.fillStyle = '#00cc52';
            }
            ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        });

        // Reset shadow
        ctx.shadowBlur = 0;
    }

    function gameOver() {
        gameState = 'GAMEOVER';
        clearInterval(gameInterval);

        // Check if score qualifies or just show score modal
        finalScoreVal.textContent = score;
        scoreModal.classList.remove('hidden');
        playerInitialsInput.value = '';
        playerInitialsInput.focus();
    }

    async function handleScoreSubmit(e) {
        e.preventDefault();
        const initials = playerInitialsInput.value.trim().toUpperCase();

        if (initials.length !== 3 || !/^[A-Z0-9]{3}$/.test(initials)) {
            alert('Please enter exactly 3 alphanumeric characters.');
            return;
        }

        const result = await submitScore(initials, score);
        if (result.success) {
            scoreModal.classList.add('hidden');
            await loadLeaderboard();

            // Show Game Over overlay
            overlayContent.innerHTML = `
                <h2>GAME OVER</h2>
                <p>Final Score: ${score}</p>
                <button id="restart-btn" class="arcade-btn">PLAY AGAIN</button>
            `;
            document.getElementById('restart-btn').addEventListener('click', startGame);
            gameOverlay.classList.remove('hidden');
        } else {
            alert('Error submitting score: ' + result.error);
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Initial draw to show clean background on canvas
    draw();
});
