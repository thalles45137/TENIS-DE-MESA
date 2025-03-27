// Variáveis globais para a tela inicial
let isGameStarted = false;
let playerName = '';

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
let gameRunning = true;

// Criando a tela inicial
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tela inicial
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Bem-vindo ao The Paddle Wars!", canvas.width / 2 - 190, canvas.height / 2 - 60);
    ctx.font = "20px Arial";
    ctx.fillText("Digite seu nome e clique em Começar", canvas.width / 2 - 140, canvas.height / 2 - 20);

    // Adicionando o campo de texto para o nome
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Digite seu nome';
    input.style.position = 'absolute';
    input.style.left = `${canvas.width / 1 - 5}px`;
    input.style.top = `${canvas.height / 2 + 60}px`;
    input.style.fontSize = '18px';
    input.style.padding = '10px';
    input.style.textAlign = 'center';
    document.body.appendChild(input);

    // Botão de iniciar
    const startButton = document.createElement('button');
    startButton.innerText = 'Começar';
    startButton.style.position = 'absolute';
    startButton.style.left = `${canvas.width / 2 - 120}px`;
    startButton.style.top = `${canvas.height / 2 - 60}px`;
    startButton.style.fontSize = '24px';
    startButton.style.padding = '15px 30px';
    startButton.style.backgroundColor = '#4CAF50'; // Cor verde
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.cursor = 'pointer';
    startButton.style.borderRadius = '5px';
    startButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(startButton);

    // Quando o jogador clicar em "Começar"
    startButton.addEventListener('click', () => {
        playerName = input.value || 'Jogador';  // Usar nome fornecido ou "Jogador" como padrão
        input.remove();  // Remover campo de texto
        startButton.remove();  // Remover botão
        isGameStarted = true;  // Começar o jogo
        gameLoop();  // Iniciar o loop do jogo
    });
}

// Movimento da raquete do jogador
document.addEventListener("keydown", (e) => {
    if (isGameStarted) {  // Só permite o movimento após o jogo começar
        if (e.key === "ArrowUp" && playerY > 0) playerY -= 20;
        if (e.key === "ArrowDown" && playerY < canvas.height - paddleHeight) playerY += 20;
    }
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
        checkGameOver();
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        checkGameOver();
        resetBall();
    }
}

// Função para verificar se o jogo acabou
function checkGameOver() {
    if (playerScore === 11 || aiScore === 11) {
        gameRunning = false;
        setTimeout(resetGame, 3000); // Espera 3 segundos para reiniciar o jogo
    }
}

// Reinicia a bola após um ponto
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

// Reinicia o jogo após 3 segundos
function resetGame() {
    playerScore = 0;
    aiScore = 0;
    gameRunning = true; // O jogo volta a rodar
    playerY = canvas.height / 2 - paddleHeight / 2;
    aiY = canvas.height / 2 - paddleHeight / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
    gameLoop(); // Começa o loop novamente
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
    ctx.fillText(playerName + ": " + playerScore, canvas.width / 4, 30);
    ctx.fillText("IA: " + aiScore, (canvas.width / 4) * 3, 30);
}

// Loop do jogo
function gameLoop() {
    if (!isGameStarted) {
        drawStartScreen(); // Mostrar a tela inicial
        return;
    }
    if (!gameRunning) return;
    moveBall();
    moveAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo com a tela inicial
gameLoop();
