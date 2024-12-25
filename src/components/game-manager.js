AFRAME.registerComponent('game-manager', {
  init() {
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.updateGame = this.updateGame.bind(this);

    this.timeLimit = 60; // 60 giây
    this.remainingTime = this.timeLimit;
    this.score = 0;
    this.timerInterval = null;

    this.el.addEventListener('start-game', this.startGame);
    this.el.addEventListener('stop-game', this.stopGame);
    this.el.addEventListener('score-up', () => {
      this.score += 1; // Tăng điểm khi có sự kiện ghi điểm
      this.updateScoreboard();
    });
  },

  startGame() {
    if (this.timerInterval) return; // Đảm bảo không chạy nhiều bộ đếm

    this.remainingTime = this.timeLimit;
    this.score = 0;
    this.clearState();
    this.updateTimer();
    this.updateScoreboard();

    this.el.emit('setGameState', { gameState: 'in-progress' });
    this.el.systems.router.changeRoute('game-field');

    // Đếm ngược
    this.timerInterval = setInterval(() => {
      this.updateGame();
    }, 1000);
  },

  stopGame() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.el.emit('setGameState', { gameState: 'not-started' });
    this.el.systems.router.changeRoute('start-screen');
  },

  gameOver() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.el.emit('setGameState', { gameState: 'not-started' });
    this.el.emit('stop-trash-spawn'); // Dừng tạo rác
    this.el.systems.router.changeRoute('game-over');
    this.el.emit('final-score', { score: this.score });
  },

  clearState() {
    this.el.emit('setScore', { score: 0 });
    this.el.emit('setLives', { lives: 10 });
  },

  updateGame() {
    // Cập nhật thời gian
    this.remainingTime -= 1;
    this.updateTimer();

    // Kiểm tra lives
    const lives = this.el.systems.state.state.lives || 0;
    if (lives < 1 || this.remainingTime <= 0) {
      this.gameOver();
    }
  },

  updateTimer() {
    const timer = document.querySelector('#timer');
    if (timer) {
      timer.setAttribute('text', `value: Time: ${this.remainingTime}`);
    }
  },

  updateScoreboard() {
    const scoreboard = document.querySelector('#scoreboard');
    if (scoreboard) {
      scoreboard.setAttribute('text', `value: Score: ${this.score}`);
    }
  },
});
