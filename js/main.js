const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Global Vars

const start_pos = 3
const end_pos = -start_pos
const text = document.querySelector(".text")
const TIME_LIMIT = 10
let game_stat = "loading"
let isredlight = false

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));

}
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
        gsap.to(this.doll.rotation, { y: -3.1, duration: .5 })//turn backwards in 0.38 sec
        setTimeout(() => isredlight = true, 500)
    }
    lookForward() {
        // this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation, { y: 0, duration: .5 })
        setTimeout(() => isredlight = false, 150)
    }
    async start() {
        this.lookBackward()
        await sleep(Math.random() * 1000 + 1000)
        this.lookForward()
        await sleep(Math.random() * 800 + 1000)
        this.start()

    }

}

let doll = new Doll()

async function init() {
    await sleep(500)
    text.innerText = "Game Staring in 3!"
    await sleep(500)
    text.innerText = "Game Staring in 2!"
    await sleep(500)
    text.innerText = "Game Staring in 1!"
    await sleep(500)
    text.innerText = "GO!"
    startGame()

}
function startGame() {
    game_stat = "started"
    let progressbar = createCube({ w: 5, h: .1, d: 1 }, 0)
    progressbar.position.y = 3.3
    gsap.to(progressbar.scale, { x: 0, duration: TIME_LIMIT, ease: "none" })
    doll.start()
}
init()
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
        //this.playerInfo.velocity = 0
        gsap.to(this.playerInfo, { velocity: 0, duration: .3 })
    }
    check() {
        if (this.playerInfo.velocity > 0 && !isredlight) {
            alert("you lost :(")

            if (this.playerInfo.positionX < end_pos) {
                alert("you win :)!")
            }
        }
    }


    update() {
        this.check()
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }

}

const player = new Player()

setTimeout(() => {

    doll.start()
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
    if (game_stat != "started") return
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