import * as THREE from 'three';
import { Player } from './Player.js';
import { World } from './World.js';
import { UIController } from './UI.js';
import { AudioController } from './Audio.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class Game {
    constructor() {
        this.gameState = 'START';
        this.score = 0;
        this.multiplier = 1;
        this.energy = 100;
        this.highScore = localStorage.getItem('stellarFlareHighScore') || 0;
        this.currentSpeed = 0;
        this.worldSpeed = 2;

        this.keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, ' ': false };

        this.initGraphics();
        this.initComponents();
        this.initEventListeners();
        this.setupDebugGUI();

        this.animate();
    }

    initGraphics() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000005);
        this.scene.fog = new THREE.Fog(0x000005, 2000, 4000);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
        this.camera.position.set(0, 5, 15);

        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Sun and Lighting
        const ambient = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambient);

        this.sun = new THREE.DirectionalLight(0xffffff, 4);
        this.sun.position.set(100, 200, 300);
        this.sun.castShadow = true;
        this.sun.shadow.camera.left = -100; this.sun.shadow.camera.right = 100;
        this.sun.shadow.camera.top = 100; this.sun.shadow.camera.bottom = -100;
        this.sun.shadow.camera.near = 1; this.sun.shadow.camera.far = 1000;
        this.sun.shadow.mapSize.width = 2048; this.sun.shadow.mapSize.height = 2048;
        this.scene.add(this.sun);

        this.sunDirection = new THREE.Vector3().copy(this.sun.position).normalize().negate();
        this.raycaster = new THREE.Raycaster();
        
        // Post-processing
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = 0.21;
        this.bloomPass.strength = 1.2;
        this.bloomPass.radius = 0.55;
        this.composer.addPass(this.bloomPass);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    initComponents() {
        this.player = new Player(this.scene);
        this.world = new World(this.scene);
        this.ui = new UIController();
        this.audio = new AudioController();
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (e) => { 
            if (e.key in this.keys) this.keys[e.key] = true;
            if (e.key.toLowerCase() === 'p') this.togglePause();
        });
        window.addEventListener('keyup', (e) => { if (e.key in this.keys) this.keys[e.key] = false; });

        this.ui.startButton.addEventListener('click', () => this.startGame());
        this.ui.restartButton.addEventListener('click', () => this.startGame());
        this.ui.pauseButton.addEventListener('click', () => this.togglePause());
    }

    setupDebugGUI() {
        const gui = new dat.GUI();
        const bloomFolder = gui.addFolder('Bloom');
        bloomFolder.add(this.bloomPass, 'threshold', 0.0, 1.0).name('Threshold');
        bloomFolder.add(this.bloomPass, 'strength', 0.0, 3.0).name('Strength');
        bloomFolder.add(this.bloomPass, 'radius', 0.0, 1.0).name('Radius');
        const gameFolder = gui.addFolder('Game');
        gameFolder.add(this, 'worldSpeed', 0, 10).name('World Speed');
    }

    startGame() {
        this.audio.init().then(() => {
            this.reset();
        });
    }

    reset() {
        this.score = 0;
        this.multiplier = 1;
        this.energy = 100;
        this.gameState = 'PLAYING';

        this.player.reset();
        this.world.reset();
        this.ui.hideGameOver();
        this.ui.hideStartScreen();
        this.ui.showHUD();
    }

    togglePause() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            this.ui.togglePause(true);
            this.audio.toggleHum(true); // Mute hum when paused
        } else if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
            this.ui.togglePause(false);
        }
    }

    setGameOver() {
        this.gameState = 'GAME_OVER';
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('stellarFlareHighScore', this.highScore);
        }
        this.ui.showGameOver(this.score, this.highScore);
        this.audio.playGameOverSound();
        this.audio.toggleHum(true); // Mute hum
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.player.update(this.keys);
        
        const baseSpeed = this.worldSpeed + (this.score / 5000);
        const slowdownFactor = this.keys[' '] ? 0.5 : 1.0;
        this.currentSpeed = baseSpeed * slowdownFactor;
        this.world.update(this.currentSpeed, this.camera.position);

        this.checkCollisions();
        if (this.gameState !== 'PLAYING') return;

        this.updateEnergy();
        
        this.score += this.multiplier * 0.1;
        this.ui.update(this.score, this.multiplier, this.energy, this.currentSpeed);
    }

    checkCollisions() {
        // Obstacles
        for (const obstacle of this.world.obstacles) {
            if (this.player.boundingSphere.intersectsSphere(obstacle.userData.boundingSphere)) {
                this.setGameOver();
                return;
            }
        }
        // Pickups
        for (const pickup of this.world.pickups) {
            if (this.player.boundingSphere.intersectsSphere(pickup.userData.boundingSphere)) {
                this.multiplier++;
                this.audio.playPickupSound();
                this.world.respawnObject(pickup);
            }
        }
    }

    updateEnergy() {
        this.raycaster.set(this.player.mesh.position, this.sunDirection);
        const intersects = this.raycaster.intersectObjects(this.world.obstacles);
        const inShadow = intersects.length > 0;

        this.audio.toggleHum(inShadow);

        if (inShadow) {
            this.energy -= 0.25;
        } else {
            this.energy += 0.1;
        }

        if (this.keys[' '] && this.energy > 0) {
            this.energy -= 0.4;
        }

        this.energy = THREE.MathUtils.clamp(this.energy, 0, 100);
        if (this.energy <= 0) {
            this.setGameOver();
        }
    }

    render() {
        const { x, y, z } = this.player.mesh.position;
        const cameraTarget = new THREE.Vector3(x * 0.5, y * 0.5 + 5, z + 15);
        this.camera.position.lerp(cameraTarget, 0.05);
        this.camera.lookAt(this.player.mesh.position);

        this.composer.render();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.gameState === 'PLAYING') {
            this.update();
        }

        this.render();
    }
}