import * as THREE from 'three';

export class Player {
    constructor(scene) {
        const playerGeo = new THREE.ConeGeometry(1, 3, 8);
        const playerMat = new THREE.MeshPhongMaterial({ 
            color: 0x00ffff, 
            emissive: 0x00ffff, 
            emissiveIntensity: 0, // Will be controlled by bloom
            shininess: 100
        });
        this.mesh = new THREE.Mesh(playerGeo, playerMat);
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.castShadow = true;
        this.mesh.name = 'player';
        scene.add(this.mesh);

        this.boundingSphere = new THREE.Sphere(this.mesh.position, 1);
        this.targetPosition = new THREE.Vector3();
        this.moveBounds = { x: 20, y: 10 };
    }

    update(keys) {
        const moveSpeed = 0.5;
        if (keys.ArrowUp) this.targetPosition.y += moveSpeed;
        if (keys.ArrowDown) this.targetPosition.y -= moveSpeed;
        if (keys.ArrowLeft) this.targetPosition.x -= moveSpeed;
        if (keys.ArrowRight) this.targetPosition.x += moveSpeed;

        this.targetPosition.x = THREE.MathUtils.clamp(this.targetPosition.x, -this.moveBounds.x, this.moveBounds.x);
        this.targetPosition.y = THREE.MathUtils.clamp(this.targetPosition.y, -this.moveBounds.y, this.moveBounds.y);

        this.mesh.position.lerp(this.targetPosition, 0.1);

        // Stable ship rotation (banking)
        let targetBank = 0;
        if (keys.ArrowLeft) targetBank = 0.25;
        if (keys.ArrowRight) targetBank = -0.25;
        this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, targetBank, 0.1);

        this.boundingSphere.center.copy(this.mesh.position);
    }

    reset() {
        this.mesh.position.set(0, 0, 0);
        this.targetPosition.set(0, 0, 0);
        this.mesh.rotation.set(Math.PI / 2, 0, 0);
    }
}