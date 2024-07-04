import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import spline from './spline.js';

import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

const fov = 100;
const aspect = w / h;
const near = 0.1;
const far = 20;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 1);
bloomPass.threshold = 0.002;
bloomPass.strength = 4;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({
  color: 0xff0000
});
const line = new THREE.Line(geometry, material);

const tube = new THREE.TubeGeometry(spline, 250, 0.7, 20, false);
const tubeMat = new THREE.MeshBasicMaterial({
  color: 0x000000
});

const tubeMesh = new THREE.Mesh(tube, tubeMat);
scene.add(tubeMesh);
tubeMesh.receiveShadow = true;

const edges = new THREE.EdgesGeometry(tube, 0.2);
const lineMat = new THREE.LineBasicMaterial({
  color: 0x00ffff
});
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

const sphere = new THREE.SphereGeometry(0.1);
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0xff2020,
  metalness: 1,
  roughness: 0.5,
});
const sphereMesh = new THREE.Mesh(sphere, sphereMat);
scene.add(sphereMesh);
sphereMesh.castShadow = true;

const pointlight = new THREE.PointLight(0xff9999, 15, 0, 0);
scene.add(pointlight);
pointlight.castShadow = true;

const pointlight2 = new THREE.PointLight(0xffffff, 10, 0, 0);
// scene.add(pointlight2);
pointlight2.castShadow = true;

// Additional light to better illuminate the scene
const ambientLight = new THREE.AmbientLight(0xff0000); // soft white light
scene.add(ambientLight);
ambientLight.castShadow = true;

function updateCameraAndLight(t) {
  const time = t * 0.005;
  const looptime = 20 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tube.parameters.path.getPointAt(p);
  const lookAt = tube.parameters.path.getPointAt((p + 0.001) % 1);
  
  camera.position.copy(pos);
  camera.lookAt(lookAt);

  // Update point light position to match the camera position
  pointlight.position.copy(pos);
  pointlight2.position.copy(pos);

  pointlight.position.y += 1;
  pointlight.position.z -= 3;

  pointlight2.position.z += 1;

  // Update sphere position slightly ahead of the camera along the path
  const spherePos = tube.parameters.path.getPointAt((p + 0.01) % 1);
  sphereMesh.position.copy(spherePos);
  sphereMesh.position.y -= 0.6;
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCameraAndLight(t * 100);
  // renderer.render(scene, camera);
  composer.render();
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);
