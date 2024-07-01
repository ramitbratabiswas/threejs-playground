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

const box = new three.BoxGeometry(1.2, 1.2, 1.2, 5, 5, 5);
const boxMat = new three.MeshStandardMaterial({
  color: 0x0ff0f0
})
const boxMesh = new three.Mesh(box, boxMat);
scene.add(boxMesh);

const wireMat = new three.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});

const wireMesh = new three.Mesh(box, wireMat);
wireMesh.scale.setScalar(1.001);
boxMesh.add(wireMesh);

const hemilight = new three.HemisphereLight(0x202022, 0xa0afff);
scene.add(hemilight);

renderer.render(scene, camera);

function animate(t = 0) {
  requestAnimationFrame(animate);
  boxMesh.rotation.x = t*0.002;
  boxMesh.rotation.y = t*0.002;
  renderer.render(scene, camera);
  controls.update();
}

animate();