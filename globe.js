import * as three from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new three.WebGLRenderer({
  antialias: true,
});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;

const camera = new three.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new three.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const loader = new three.TextureLoader();

const earthGroup = new three.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
const earth = new three.IcosahedronGeometry(0.7, 10);
const earthMat = new three.MeshStandardMaterial({
  map: loader.load("./earthmap1k.jpg")
})
const earthMesh = new three.Mesh(earth, earthMat);
earthGroup.add(earthMesh);

const wireMat = new three.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});

const wireMesh = new three.Mesh(earth, wireMat);
wireMesh.scale.setScalar(1.001);
//earthMesh.add(wireMesh);

const hemilight = new three.HemisphereLight(0xffffff, 0x444444);
scene.add(hemilight);

renderer.render(scene, camera);

function animate(t) {
  requestAnimationFrame(animate);
  earthMesh.rotation.y = t * 0.0002;
  renderer.render(scene, camera);
  controls.update();
}

animate();