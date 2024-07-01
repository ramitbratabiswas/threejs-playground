import * as three from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

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

const icos = new three.IcosahedronGeometry(0.8,10);
const mat = new three.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.9,
  roughness: 0.3
})
const box = new three.BoxGeometry(4, 4, 4, 5, 5, 5);
const boxMat = new three.MeshStandardMaterial({
  metalness: 0.9,
  roughness: 0.2,
  color: 0xffffff,
  side: three.DoubleSide,
})
const boxMesh = new three.Mesh(box, boxMat);
scene.add(boxMesh);
boxMesh.position.set(0, 0, 0);

const mesh = new three.Mesh(icos, mat);
scene.add(mesh);

const wireMat = new three.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
});

const wireMesh = new three.Mesh(icos, wireMat);
const wireMesh2 = new three.Mesh(box, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh);
boxMesh.add(wireMesh2);

// const hemilight = new three.HemisphereLight(0x202022, 0xa0afff);
// scene.add(hemilight);
// hemilight.castShadow = true;

// const pointlight = new three.PointLight(0xff0000, 4, 0, 2);
// scene.add(pointlight);
// pointlight.castShadow = true;
// pointlight.position.set(-1.5, -1.5, -1.5);

const pointlight2 = new three.PointLight(0xffffff, 20, 0, 2);
scene.add(pointlight2);
pointlight2.castShadow = true;
pointlight2.position.set(1.8, 1.8, 1.8);

// const directionalLight = new three.DirectionalLight(0x0000ff, 20);
// directionalLight.position.set(1, 1, 1);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

renderer.render(scene, camera);

function animate(t = 0) {
  requestAnimationFrame(animate);
  mesh.rotation.y = t*0.0004;
  renderer.render(scene, camera);
  controls.update();
}

animate();