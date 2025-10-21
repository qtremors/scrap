import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.pickups = [];
        this.OBSTACLE_COUNT = 50;
        this.PICKUP_COUNT = 20;
        this.farPlane = 4000;
        this.playerMoveBounds = { x: 20, y: 10 };

        this.init();
    }

    init() {
        const obstacleGeo = new THREE.IcosahedronGeometry(1, 0);
        const obstacleMat = new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true });
        for (let i = 0; i < this.OBSTACLE_COUNT; i++) {
            const obstacle = new THREE.Mesh(obstacleGeo, obstacleMat);
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            obstacle.userData.isObstacle = true;
            obstacle.userData.boundingSphere = new THREE.Sphere();
            this.obstacles.push(obstacle);
            this.scene.add(obstacle);
        }

        const pickupGeo = new THREE.TetrahedronGeometry(1, 0);
        const pickupMat = new THREE.MeshStandardMaterial({ 
            color: 0xffff00, 
            emissive: 0xffff00, 
            emissiveIntensity: 1,
            metalness: 0.5,
            roughness: 0.2
        });
        for (let i = 0; i < this.PICKUP_COUNT; i++) {
            const pickup = new THREE.Mesh(pickupGeo, pickupMat);
            pickup.userData.isObstacle = false;
            pickup.userData.boundingSphere = new THREE.Sphere();
            this.pickups.push(pickup);
            this.scene.add(pickup);
        }
    }

    update(speed, cameraPosition) {
        [...this.obstacles, ...this.pickups].forEach(obj => {
            obj.position.z += speed;
            if (obj.position.z > cameraPosition.z) {
                this.respawnObject(obj);
            }
            obj.userData.boundingSphere.center.copy(obj.position);
        });

        const time = Date.now() * 0.005;
        this.pickups.forEach(p => {
            p.rotation.x = time * 0.5;
            p.rotation.y = time;
        });
    }

    respawnObject(obj, isInitialSpawn = false) {
        const scale = obj.userData.isObstacle ? THREE.MathUtils.randFloat(1.5, 10) : 2.0;
        obj.scale.set(scale, scale, scale);

        if (obj.userData.isObstacle) {
            obj.position.x = THREE.MathUtils.randFloatSpread(this.playerMoveBounds.x * 6);
            obj.position.y = THREE.MathUtils.randFloatSpread(this.playerMoveBounds.y * 6);
        } else {
            obj.position.x = THREE.MathUtils.randFloat(-this.playerMoveBounds.x, this.playerMoveBounds.x);
            obj.position.y = THREE.MathUtils.randFloat(-this.playerMoveBounds.y, this.playerMoveBounds.y);
        }
        
        obj.position.z = isInitialSpawn ? THREE.MathUtils.randFloat(-this.farPlane, -100) : -this.farPlane;
        obj.userData.boundingSphere.center.copy(obj.position);
        obj.userData.boundingSphere.radius = obj.userData.isObstacle ? scale : 1.5;
    }

    reset() {
        this.obstacles.forEach(o => this.respawnObject(o, true));
        this.pickups.forEach(p => this.respawnObject(p, true));
    }
}