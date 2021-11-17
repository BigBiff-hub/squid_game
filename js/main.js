const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Global Vars

const start_pos = 3
const end_pos = -start_pos

function createCube(size, positionX, rotationY = 0, color = 0xadd8e6) {
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = positionX;
    cube.rotation.y = rotationY;
    scene.add(cube);
    return cube;
}

renderer.setClearColor(0xb90ee90, 1);

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

camera.position.z = 5;
// Instantiate a loader
const loader = new THREE.GLTFLoader();

class Doll {
    constructor() {
        loader.load("../squid_model/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(.3, .3, .3);
            gltf.scene.position.set(0, -1, 0);
            this.doll = gltf.scene;
        })
    }
    lookBackward() {
        //this.doll.rotation.y = -3.1
        gsap.to(this.doll.rotation, { y: -3.1, duration: .5 })//turn backwards in 0.5 sec
    }
    lookForward() {
        // this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation, { y: 0, duration: .5 })
    }

}

let doll = new Doll()

function createCourse() {
    createCube({ w: start_pos * 2 + 0.2, h: 1.5, d: 2 }, 0, 0, 0x00008b).position.z = -1.5;
    createCube({ w: .2, h: 1.5, d: 2 }, start_pos, -.5)
    createCube({ w: .2, h: 1.5, d: 2 }, end_pos, 0.5)

}
createCourse()

class Player {
    constructor() {
        const geometry = new THREE.SphereGeometry(.1, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.z = 1
        sphere.position.x = start_pos
        scene.add(sphere)
        this.player = sphere
        this.playerInfo = {
            positionX: start_pos,
            velocity: 0
        }
    }
    run() {
        this.playerInfo.velocity = .03
    }
    stop() {
        this.playerInfo.velocity = 0
    }
    update() {
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }

}
const player = new Player()

setTimeout(() => {

    doll.lookBackward()
}, 1500);

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    player.update()
}
animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('keydown', (e) => {
    // alert(e.key)

    if (e.key == "ArrowUp") {
        player.run()
    }
})

window.addEventListener('keyup', (e) => {
    // alert(e.key)

    if (e.key == "ArrowUp") {
        player.stop()
    }
})