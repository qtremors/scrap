export class UIController {
    constructor() {
        this.hudEl = document.getElementById('hud');
        this.scoreEl = document.getElementById('score');
        this.multiplierEl = document.getElementById('multiplier');
        this.speedometerEl = document.getElementById('speedometer');
        this.energyBarEl = document.getElementById('energy-bar');
        this.startScreenEl = document.getElementById('start-screen');
        this.pauseScreenEl = document.getElementById('pause-screen');
        this.gameOverEl = document.getElementById('game-over');
        this.finalScoreEl = document.getElementById('final-score');
        this.highScoreEl = document.getElementById('high-score');
        this.pauseButton = document.getElementById('pause-button');

        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
    }

    update(score, multiplier, energy, speed) {
        this.scoreEl.textContent = `Score: ${Math.floor(score)}`;
        this.multiplierEl.textContent = `x${multiplier}`;
        this.speedometerEl.textContent = `SPEED: ${(speed * 20).toFixed(0)}`;
        this.energyBarEl.style.width = `${energy}%`;
    }

    showStartScreen() {
        this.startScreenEl.style.display = 'flex';
    }

    hideStartScreen() {
        this.startScreenEl.style.display = 'none';
    }

    showGameOver(score, highScore) {
        this.finalScoreEl.textContent = `Score: ${Math.floor(score)}`;
        this.highScoreEl.textContent = `High Score: ${highScore}`;
        this.gameOverEl.style.display = 'flex';
        this.hudEl.style.opacity = 0;
        this.pauseButton.style.display = 'none';
    }

    hideGameOver() {
        this.gameOverEl.style.display = 'none';
    }

    togglePause(isPaused) {
        this.pauseScreenEl.style.display = isPaused ? 'flex' : 'none';
        this.hudEl.style.opacity = isPaused ? 0.5 : 1;
        this.pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    }

    showHUD() {
        this.hudEl.style.opacity = 1;
        this.pauseButton.style.display = 'block';
        this.pauseButton.textContent = 'Pause';
    }
}
