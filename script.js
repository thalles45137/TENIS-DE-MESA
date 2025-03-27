// Configuração do Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variáveis do jogo
const paddleWidth = 10, paddleHeight = 80;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5;
let playerScore = 0, aiScore = 0;

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

// Reinicia a bola após um ponto
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
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
    ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Pontuação
    ctx.font = "20px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 30);
    ctx.fillText(aiScore, (canvas.width / 4) * 3, 30);
}


// Loop do jogo
function gameLoop(5) {
    moveBall(50);
    moveAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();
