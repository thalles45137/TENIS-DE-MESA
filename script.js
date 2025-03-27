<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pong</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: black;
            flex-direction: column;
        }

        canvas {
            background-color: #222;
            border: 2px solid white;
        }

        button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #444;
            color: white;
            border: none;
            border-radius: 5px;
        }

        button:hover {
            background-color: #666;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="600" height="400"></canvas>
    <button id="startButton">Iniciar Jogo</button>

    <script>
        // Configuração do Canvas
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Variáveis do jogo
        const paddleWidth = 10, paddleHeight = 80;
        let playerY = canvas.height / 2 - paddleHeight / 2 + 50; // Mesa um pouco mais para baixo
        let aiY = canvas.height / 2 - paddleHeight / 2 + 50;     // Mesa um pouco mais para baixo
        let ballX = canvas.width / 2, ballY = canvas.height / 2;
        let ballSpeedX = 5, ballSpeedY = 5;
        let playerScore = 0, aiScore = 0;
        let gameRunning = false;
        let gameInterval;

        // Movimento da raquete do jogador
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp" && playerY > 0) playerY -= 20;
            if (e.key === "ArrowDown" && playerY < canvas.height - paddleHeight) playerY += 20;
        });

        // Iniciar o jogo
        const startButton = document.getElementById("startButton");
        startButton.addEventListener("click", startGame);

        function startGame() {
            // Desativa o botão de início
            startButton.style.display = "none";

            // Reinicia o placar
            playerScore = 0;
            aiScore = 0;

            // Muda o estado do jogo
            gameRunning = true;

            // Intervalo de início antes da bola começar a se mover
            setTimeout(() => {
                gameInterval = requestAnimationFrame(gameLoop);
            }, 1000);
        }

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
    </script>
</body>
</html>
