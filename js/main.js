const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

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
    lookBack() {
        this.doll.rotation.y = -3.1
    }

}

let doll = new Doll()

setTimeout(() => {
    doll.lookBack()
}, 1500);

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}