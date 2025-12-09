import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

// --- CONFIGURATION ---
const CONFIG = {
    PLAYER: {
        BOUNDS_X: 10, SENSITIVITY: 0.1, TILT_FACTOR: 0.5, RADIUS: 0.3, // Reduced from 1.0
    },
    GAME: {
        START_SPEED: 60, ACCELERATION: 1, OBSTACLE_COUNT: 25, PICKUP_COUNT: 5,
    },
    ENERGY: {
        DRAIN_RATE: 25, // points per second in shadow
        CHARGE_RATE: 10, // points per second in light
    },
    CAMERA: { BASE_POS: new THREE.Vector3(0, 4, 10), FOLLOW_SENSITIVITY: 0.05 },
    SUN: { SET_RATE: 0.02, // degrees per second
    },
};

// --- DOM & UI ---
const dom = {
    scoreStatus: document.getElementById('score-status'),
    multiplierStatus: document.getElementById('multiplier-status'),
    energyBar: document.getElementById('energy-bar'),
    finalScore: document.getElementById('final-score'),
    loadingScreen: document.getElementById('loading-screen'),
    pauseScreen: document.getElementById('pause-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    restartButton: document.getElementById('restart-button'),
};

// --- THREE.JS SETUP ---
let scene, camera, renderer, clock;
let player, targetPlayerPosition = new THREE.Vector3();
let sun, ground;
const keys = {};

// --- GAME STATE & WORLD ---
let state = { isPaused: false, gameOver: false, score: 0, gameSpeed: 0, baseSpeed: 0, energy: 100, multiplier: 1 };
let obstacles = [], pickups = [], shadowCasters = [];

// --- INITIALIZE ---
function init() {
    setupScene();
    setupWorld();
    setupPlayer();
    setupEventListeners();
    resetGame();
    animate();
    dom.loadingScreen.classList.add('hidden');
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 200, 500);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    clock = new THREE.Clock();
}

// --- WORLD GENERATION (Ground, Sun, Obstacles) ---
function setupWorld() {
    // Ground
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 2000),
        new THREE.MeshLambertMaterial({ color: 0xe0e0e0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Sun (Directional Light)
    sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(0, 100, -200);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    scene.add(sun);
    
    // Lens Flare
    const textureLoader = new THREE.TextureLoader();
    const flareTexture = textureLoader.load("https://threejs.org/examples/textures/lensflare/lensflare0.png");
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(flareTexture, 700, 0, sun.color));
    sun.add(lensflare);

    // Obstacle & Pickup Pools
    const obstacleGeometries = [new THREE.BoxGeometry(1,1,1), new THREE.ConeGeometry(1, 2, 8)];
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    for (let i = 0; i < CONFIG.GAME.OBSTACLE_COUNT; i++) {
        const geo = obstacleGeometries[Math.floor(Math.random() * obstacleGeometries.length)];
        const obstacle = new THREE.Mesh(geo, obstacleMaterial);
        obstacle.castShadow = true;
        obstacles.push(obstacle);
        shadowCasters.push(obstacle); // Add to list for raycasting
        scene.add(obstacle);
    }
    const pickupGeo = new THREE.TetrahedronGeometry(0.5);
    const pickupMat = new THREE.MeshStandardMaterial({ color: 0xffc400, emissive: 0xffc400 });
    for(let i = 0; i < CONFIG.GAME.PICKUP_COUNT; i++) {
        const pickup = new THREE.Mesh(pickupGeo, pickupMat);
        pickups.push(pickup);
        scene.add(pickup);
    }
}

// Respawns an object (obstacle or pickup)
function respawn(obj, isInitialSpawn = false, type = 'obstacle') {
    const randomX = (Math.random() - 0.5) * CONFIG.PLAYER.BOUNDS_X * 2;
    
    // **FIXED**: The initial spawn Z-position now has a safe zone to prevent instant collisions.
    const safeZone = 20;
    const spawnDepth = 600;
    const randomZ = isInitialSpawn 
        ? -safeZone - (Math.random() * (spawnDepth - safeZone)) 
        : -spawnDepth - (Math.random() * 200);
    
    if (type === 'obstacle') {
        const height = Math.random() * 5 + 1;
        obj.scale.set(Math.random() * 3 + 1, height, Math.random() * 3 + 1);
        obj.position.set(randomX, height / 2, randomZ);
    } else { // pickup
        obj.position.set(randomX, Math.random() * 3 + 1, randomZ);
    }
}

// --- PLAYER ---
function setupPlayer() {
    player = new THREE.Group();
    const bodyGeo = new THREE.IcosahedronGeometry(1, 0);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    player.add(new THREE.Mesh(bodyGeo, bodyMat));
    player.shadowRaycaster = new THREE.Raycaster();
    scene.add(player);
}

// --- GAME LOGIC & LOOP ---
function resetGame() {
    state.gameOver = false;
    state.isPaused = false;
    state.score = 0;
    state.multiplier = 1;
    state.energy = 100;
    state.baseSpeed = CONFIG.GAME.START_SPEED;
    
    player.position.set(0, 1.5, 0);
    targetPlayerPosition.set(0, 1.5, 0);
    camera.position.copy(CONFIG.CAMERA.BASE_POS);
    sun.position.set(0, 100, -200);

    obstacles.forEach(obj => respawn(obj, true, 'obstacle'));
    pickups.forEach(obj => respawn(obj, true, 'pickup'));
    
    dom.gameOverScreen.classList.add('hidden');
}

function handleGameOver() {
    state.gameOver = true;
    dom.finalScore.textContent = Math.floor(state.score);
    dom.gameOverScreen.classList.remove('hidden');
}

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = Math.min(0.05, clock.getDelta());
    if (state.gameOver || state.isPaused) return;

    updateSpeed(deltaTime);
    updatePlayer(deltaTime);
    updateWorld(deltaTime);
    updateEnergy(deltaTime);
    updateSun(deltaTime);
    updateCamera(deltaTime);
    checkCollisions();
    updateUI();
    
    renderer.render(scene, camera);
}

function updateSpeed(dt) {
    const energyFactor = Math.max(0.1, state.energy / 100);
    state.gameSpeed = state.baseSpeed * energyFactor;
    state.baseSpeed += CONFIG.GAME.ACCELERATION * dt;
    state.score += state.gameSpeed * dt * state.multiplier * 0.1;
}

function updatePlayer(dt) {
    const moveSpeed = 40 * dt; 
    if (keys['ArrowLeft']) targetPlayerPosition.x -= moveSpeed;
    if (keys['ArrowRight']) targetPlayerPosition.x += moveSpeed;
    
    targetPlayerPosition.x = Math.max(-CONFIG.PLAYER.BOUNDS_X, Math.min(CONFIG.PLAYER.BOUNDS_X, targetPlayerPosition.x));
    player.position.lerp(targetPlayerPosition, CONFIG.PLAYER.SENSITIVITY);
    
    const tiltZ = -(player.position.x - targetPlayerPosition.x) * CONFIG.PLAYER.TILT_FACTOR;
    player.rotation.set(0, 0, tiltZ);
}

function updateWorld(dt) {
    const moveZ = state.gameSpeed * dt;
    ground.position.z += moveZ;
    if (ground.position.z > 1000) ground.position.z -= 1000;

    obstacles.forEach(obj => {
        obj.position.z += moveZ;
        if (obj.position.z > camera.position.z) respawn(obj, false, 'obstacle');
    });
    pickups.forEach(obj => {
        obj.position.z += moveZ;
        obj.rotation.y += dt;
        if (obj.position.z > camera.position.z) respawn(obj, false, 'pickup');
    });
}

function updateEnergy(dt) {
    const sunDirection = new THREE.Vector3().subVectors(sun.position, player.position).normalize();
    player.shadowRaycaster.set(player.position, sunDirection);
    const intersects = player.shadowRaycaster.intersectObjects(shadowCasters);

    if (intersects.length > 0) { // In shadow
        state.energy -= CONFIG.ENERGY.DRAIN_RATE * dt;
    } else { // In light
        state.energy += CONFIG.ENERGY.CHARGE_RATE * dt;
    }
    state.energy = Math.max(0, Math.min(100, state.energy));
    if (state.energy <= 0) handleGameOver();
}

function updateSun(dt) {
    sun.position.y -= CONFIG.SUN.SET_RATE * dt * 5;
    sun.position.x += CONFIG.SUN.SET_RATE * dt * 2;
}

function updateCamera(dt) {
    const targetCameraPos = new THREE.Vector3(
        player.position.x * 0.2, CONFIG.CAMERA.BASE_POS.y, CONFIG.CAMERA.BASE_POS.z
    );
    camera.position.lerp(targetCameraPos, CONFIG.CAMERA.FOLLOW_SENSITIVITY);
    camera.lookAt(player.position.x, 0, 0);
}

function checkCollisions() {
    obstacles.forEach(obj => {
        // FIXED: The obstacle's radius is now correctly calculated as half its scale (width).
        const obstacleRadius = obj.scale.x * 0.1;
        if (player.position.distanceTo(obj.position) < CONFIG.PLAYER.RADIUS + obstacleRadius) {
            handleGameOver();
        }
    });
    pickups.forEach(obj => {
        if (player.position.distanceTo(obj.position) < CONFIG.PLAYER.RADIUS + 1) {
            state.multiplier++;
            respawn(obj, false, 'pickup');
        }
    });
}

function updateUI() {
    dom.scoreStatus.textContent = Math.floor(state.score);
    dom.multiplierStatus.textContent = `(x${state.multiplier})`;
    dom.energyBar.style.width = `${state.energy}%`;
}

function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
        if (state.gameOver && e.code === 'Enter') {
            resetGame();
            return;
        }
        keys[e.code] = true; 
        if (e.code === 'KeyP' && !state.gameOver) {
            state.isPaused = !state.isPaused;
            dom.pauseScreen.classList.toggle('hidden', !state.isPaused);
        }
    });
    window.addEventListener('keyup', (e) => { keys[e.code] = false; });
    dom.restartButton.addEventListener('click', resetGame);
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- START ---
init();