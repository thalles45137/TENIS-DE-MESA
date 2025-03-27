// Configuração do Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variáveis do jogo
const paddleWidth = 10, paddleHeight = 80;
let playerY, aiY, ballX, ballY;
let ballSpeedX, ballSpeedY;
let playerScore = 0, aiScore = 0;
let gameRunning = false;
let gameInterval;
let intervalTime = 1000;  // Tempo de intervalo antes de iniciar o jogo (1 segundo)

// Função para reiniciar o jogo
function resetGame() {
    playerY = canvas.height / 2 - paddleHeight / 2 + 50; // Mesa um pouco mais para baixo
    aiY = canvas.height / 2 - paddleHeight / 2 + 50;     // Mesa um pouco mais para baixo
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
    playerScore = 0;
    aiScore = 0;
    gameRunning = false;
}

// Inicializa o jogo
function startGame() {
    resetGame();
    // Esconde o botão de iniciar
    document.getElementById("startButton").style.display = "none";

    // Começa o jogo após o intervalo
    setTimeout(() => {
        gameRunning = true;
        gameLoop();
    }, intervalTime);
}

// Reinicia a bola após um ponto
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

// Movimento da raquete do jogador
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && playerY > 0) playerY -= 20;
    if (e.key === "ArrowDown" && playerY < canvas.height - paddleHeight) playerY += 20;
});

// Atualiza a posição da IA (segue a bola)
function moveAI() {
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 10) aiY += 4;
    if (aiCenter > ballY + 10) aiY -= 4;
}

// Atualiza a posição da bola
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebater na parede superior e inferior
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

    // Colisão com a raquete do jogador
    if (ballX <= paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX *= -1;
    }

    // Colisão com a raquete da IA
    if (ballX >= canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX *= -1;
    }

    // Se a bola passar das raquetes, pontuação
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Renderiza os elementos na tela
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linha central
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);

    // Raquetes
    ctx.fillRect(5, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

    // Bola
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Pontuação
    ctx.font = "20px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 30);
    ctx.fillText(aiScore, (canvas.width / 4) * 3, 30);

    // Verifica se o jogo acabou
    if (playerScore === 11 || aiScore === 11) {
        gameRunning = false;
        cancelAnimationFrame(gameInterval);

        // Exibe o botão de "Recomeçar"
        const restartButton = document.createElement("button");
        restartButton.textContent = "Recomeçar";
        restartButton.style.marginTop = "20px";
        document.body.appendChild(restartButton);

        restartButton.addEventListener("click", () => {
            restartButton.remove();
            startGame();
        });
    }
}

// Loop do jogo
function gameLoop() {
    if (!gameRunning) return;
    moveBall();
    moveAI();
    draw();
    gameInterval = requestAnimationFrame(gameLoop);
}

// Evento de clique no botão de iniciar
document.getElementById("startButton").addEventListener("click", startGame);
