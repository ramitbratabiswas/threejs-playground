import * as three from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from './spline.js';

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

const hemiLight = new three.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleWindowResize, false);