let canvas = document.getElementById('game');
        let context = canvas.getContext('2d');

        let colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
        let balls = [];
        let ballRadius = 15;

        let tColor = '';
        let timerInterval;
        let secondsT = 0;

        // Проверка пересечения шаров
        function Peresek(newBall) {
            for (let ball of balls) {
                let dx = newBall.x - ball.x;
                let dy = newBall.y - ball.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < ballRadius * 2) {
                    return true; // Шары пересекаются
                }
            }
            return false;   
        }

        // Генерируем шары без пересечения
        function generate(num) {
            while (balls.length < num) {
                let color = colors[Math.floor(Math.random() * colors.length)];
                let newBall = {
                    color,
                    x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius,
                    y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius
                };
                if (!Peresek(newBall)) {
                    balls.push(newBall);
                    drawBall(newBall); // Отрисовуа каждого шарика сразу
                }
            }
        }

        // Отрисовка шара
        function drawBall(ball) {
            context.beginPath();
            context.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            context.fillStyle = ball.color;
            context.fill();
            context.closePath();
        }

        function clearCanvas() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        function resetGame() {
            balls.length = 0; 
            let difficultlvl = document.getElementById('difficult').value;

            let numBalls = 10; 
            if (difficultlvl === 'medium') numBalls = 20;
            if (difficultlvl === 'hard') numBalls = 30;

            generate(numBalls); 

            
            tColor = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById('tColor').textContent = tColor;

            clearCanvas(); 
            balls.forEach(drawBall); 

            document.getElementById('message').style.display = 'block'; 
            document.getElementById('losemsg').style.display = 'none'; 
            document.getElementById('winmsg').style.display = 'none'; 
            document.getElementById('checkmsg').style.display = 'none'; 
            document.getElementById('gametime').textContent = '0'; 
            secondsT = 0; 
            clearInterval(timerInterval); 
            startTimer(); 
        }

        
        function startTimer() {
            timerInterval = setInterval(() => {
                secondsT++;
                document.getElementById('gametime').textContent = secondsT; // Обновляем отображение времени
            }, 1000);
        }

        // Проверка условий для победы
        function checkVictory() {
            let ostballs = balls.filter(ball => ball.color === tColor);
            
            if (ostballs.length === 0) {
                clearInterval(timerInterval); 
                document.getElementById('message').style.display = 'none'; 
                document.getElementById('winmsg').style.display = 'block'; 
                document.getElementById('timeT').textContent = secondsT;
                return true; 
            } else {
                document.getElementById('checkmsg').textContent = "Условия для победы не выполнены."; 
                document.getElementById('checkmsg').style.display = 'block'; 
                return false; 
            }
        }

        // провера клика по канвасу
        canvas.addEventListener('click', (event) => {
            let rect = canvas.getBoundingClientRect();
            let mouseX = event.clientX - rect.left;
            let mouseY = event.clientY - rect.top;

            for (let i = balls.length - 1; i >= 0; i--) {
                let ball = balls[i];
                let dx = mouseX - ball.x;
                let dy = mouseY - ball.y;

                if (dx * dx + dy * dy <= ballRadius * ballRadius) {
                    if (ball.color === tColor) {
                        balls.splice(i, 1); 
                        clearCanvas(); 
                        balls.forEach(drawBall); 
                        if (check()) { 
                            return;
                        }
                    } else {
                        document.getElementById('message').style.display = 'none'; 
                        document.getElementById('losemsg').style.display = 'block'; 
                        clearInterval(timerInterval);
                        return;
                    }
                    break;
                }
            }
        });
        resetGame();

// сброс
        document.getElementById('resetbtn').addEventListener('click', resetGame);

// бинжу проверку условий на кнопку
        document.getElementById('uslbtn').addEventListener('click', checkVictory);

// смена темы
        document.getElementById('temabtn').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            document.body.classList.toggle('light-theme');
            
            let canvasBackgroundColor = document.body.classList.contains('dark-theme') ? '#232830' : '#fff';
            canvas.style.backgroundColor = canvasBackgroundColor;
        });
