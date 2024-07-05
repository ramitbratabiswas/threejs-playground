import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Setup renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Setup camera
const fov = 100;
const aspect = w / h;
const near = 0.1;
const far = 20;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// Setup scene
const scene = new THREE.Scene();

// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Create geometries and materials
let icos = new THREE.IcosahedronGeometry(0.8, 10);
const mat = new THREE.MeshStandardMaterial({
  color: 0x808080,
  metalness: 0.5,
  roughness: 0.5,
});
const box = new THREE.BoxGeometry(4, 4, 4, 5, 5, 5);
const boxMat = new THREE.MeshStandardMaterial({
  metalness: 1,
  roughness: 0.3,
  color: 0x808080,
  side: THREE.DoubleSide,
});
const boxMesh = new THREE.Mesh(box, boxMat);
scene.add(boxMesh);
boxMesh.position.set(0, 0, 0);

let mesh = new THREE.Mesh(icos, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
});
let wireMesh = new THREE.Mesh(icos, wireMat);
wireMesh.scale.setScalar(1.001);
scene.add(wireMesh);

// Add lights
const hemilight = new THREE.HemisphereLight(0x202022, 0xa0afff);
scene.add(hemilight);
hemilight.castShadow = true;

const pointlight = new THREE.PointLight(0xff0000, 1, 0, 2);
scene.add(pointlight);
pointlight.castShadow = true;
pointlight.position.set(-1.8, 1.8, -1.8);

const pointlight2 = new THREE.PointLight(0xffffff, 1, 0, 2);
scene.add(pointlight2);
pointlight2.castShadow = true;
pointlight2.position.set(1.8, 1.8, 1.8);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(6, 6, 6);
directionalLight.castShadow = true;
scene.add(directionalLight);

renderer.render(scene, camera);

function animate(t = 0) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();

// Setup dat.GUI
const gui = new dat.GUI();

const lightFolder = gui.addFolder('Lights');
const pointlightFolder = lightFolder.addFolder('Point Light 1');
pointlightFolder.addColor({ color: pointlight.color.getHex() }, 'color').onChange((val) => {
  pointlight.color.setHex(val);
});
pointlightFolder.add(pointlight, 'intensity', 0, 10);
pointlightFolder.add(pointlight.position, 'x', -10, 10);
pointlightFolder.add(pointlight.position, 'y', -10, 10);
pointlightFolder.add(pointlight.position, 'z', -10, 10);

const pointlight2Folder = lightFolder.addFolder('Point Light 2');
pointlight2Folder.addColor({ color: pointlight2.color.getHex() }, 'color').onChange((val) => {
  pointlight2.color.setHex(val);
});
pointlight2Folder.add(pointlight2, 'intensity', 0, 10);
pointlight2Folder.add(pointlight2.position, 'x', -10, 10);
pointlight2Folder.add(pointlight2.position, 'y', -10, 10);
pointlight2Folder.add(pointlight2.position, 'z', -10, 10);

const directionalLightFolder = lightFolder.addFolder('Directional Light');
directionalLightFolder.addColor({ color: directionalLight.color.getHex() }, 'color').onChange((val) => {
  directionalLight.color.setHex(val);
});
directionalLightFolder.add(directionalLight, 'intensity', 0, 10);
directionalLightFolder.add(directionalLight.position, 'x', -10, 10);
directionalLightFolder.add(directionalLight.position, 'y', -10, 10);
directionalLightFolder.add(directionalLight.position, 'z', -10, 10);

const materialFolder = gui.addFolder('Sphere Material');
materialFolder.addColor({ color: mat.color.getHex() }, 'color').onChange((val) => {
  mat.color.setHex(val);
});
materialFolder.add(mat, 'metalness', 0, 1);
materialFolder.add(mat, 'roughness', 0, 1);

let guiParams = {
  wireframe: true,
  detail: 10,
};

materialFolder.add(guiParams, 'wireframe').onChange((val) => {
  wireMesh.visible = val;
});

materialFolder.add(guiParams, 'detail', 0, 10, 1).onChange((val) => {
  scene.remove(mesh);
  scene.remove(wireMesh);
  icos = new THREE.IcosahedronGeometry(0.8, val);
  mesh = new THREE.Mesh(icos, mat);
  wireMesh = new THREE.Mesh(icos, wireMat);
  wireMesh.scale.setScalar(1.001);
  wireMesh.visible = guiParams.wireframe;
  scene.add(mesh);
  scene.add(wireMesh);
});

lightFolder.open();
materialFolder.open();
