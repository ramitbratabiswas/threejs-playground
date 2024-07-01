import * as three from "three";

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

const icos = new three.IcosahedronGeometry(1.0,2);
const mat = new three.MeshStandardMaterial({
  color: 0xfcfaf5,
  flatShading: true
})

const mesh = new three.Mesh(icos, mat);
scene.add(mesh);

const hemilight = new three.HemisphereLight(0xffffff, 0x000000);
scene.add(hemilight);

renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();