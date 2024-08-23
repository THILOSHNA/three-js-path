import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//
// canvas
//
let canvas = document.querySelector(".webgl");

//
// variables
//
let amplitude = 10;

// Variables to track mouse position
let mouseX = 0;

//
// sizes
//
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//
//scene
//

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x95e2f5);

//
// camera
//
let fov = 45;
let aspectRatio = sizes.width / sizes.height;
let far = 10000;
let near = 0.01;
let camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

//
// renderer
//
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animationLoop);
// Sets the color of the background
renderer.setClearColor(0xfefefe);
renderer.autoClear = false;

// Sets orbit control to move the camera around
// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = false;

// Camera positioning
camera.position.set(-3, 6, 10);
// orbit.update();

scene.add(camera);

//  gird helper
const gridHelper = new THREE.GridHelper(1000, 1000);
scene.add(gridHelper);

// axes helper
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// fog //

// scene.fog = new THREE.FogExp2(0x95e2f5, 0.02);

// adding a plane //

const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000);

const planeMaterial = new THREE.MeshBasicMaterial({ color: "green" });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -0.1, 0);
plane.rotation.x = Math.PI / 2;
planeMaterial.side = THREE.DoubleSide;
scene.add(plane);

//  camera curved moment //

let num = 0.04;
let values = 0;
window.addEventListener("wheel", (event) => {
  const delta = Math.sign(event.deltaY);

  if (delta > 0) {
    values -= 0.2;
  } else {
    values += 0.2;
  }

  console.log(values);
  camera.position.x = amplitude * Math.sin((Math.PI / 2) * values * num);
  camera.position.z = values;
  camera.position.y = 6;
  camera.lookAt(
    amplitude * Math.sin((Math.PI / 2) * (values - 0.2) * num),
    6,
    camera.position.z - 0.2
  );
});

//
// ambientLight
//
var ambientLight = new THREE.AmbientLight(0x95e2f5, 9);
scene.add(ambientLight);

// cloud mesh //
const N = 50000;

// geometry and material of a "point"
var geometry = new THREE.TetrahedronGeometry(0.25),
  material = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.1,
    depthTest: false,
    depthWrite: false,
  });

// the cloud of points as instanced mesh
var cloud = new THREE.InstancedMesh(geometry, material, N);
scene.add(cloud);

// generate all points one by one
var matrix = new THREE.Matrix4();
for (var i = 0; i < N; i++) {
  // think of some random coordinates
  var x = 1 * (Math.random() + Math.random() + Math.random()),
    y = 1 * (Math.random() + Math.random() + Math.random()),
    z = 1 * (Math.random() + Math.random() + Math.random());

  var n = 1;

  // convert them into a cloud
  x += n * Math.sin(i >> 6) + n * Math.cos(i >> 10);
  y += n * Math.sin(i >> 7) + n * Math.cos(i >> 11);
  z += n * Math.cos(i >> 8) + n * Math.sin(i >> 12);

  // make the cloud spherical
  let k =
    Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) /
    (x ** 2 + y ** 2 + z ** 2) ** 0.5;
  x *= k;
  y *= k;
  z *= k;

  // we are done, save the position
  matrix.setPosition(x, y, z);
  cloud.setMatrixAt(i, matrix);

  cloud.position.x = -(amplitude * Math.sin((Math.PI / 2) * 3));
  cloud.position.z = -3 / num;
}

//  loading a 3d  model //
const loader = new GLTFLoader();
loader.load(
  "realistics_grass_10.glb",
  (gltf) => {
    let grassModel = gltf.scene;
    grassModel.scale.set(0.1, 0.1, 0.1);
    grassModel.position.x = amplitude * Math.sin((Math.PI / 2) * 1);
    grassModel.position.z = 1 / num;
    scene.add(grassModel);

    // clone model //

    let cloneModel = grassModel.clone();
    cloneModel.scale.set(0.1, 0.1, 0.1);
    cloneModel.position.x = amplitude * Math.sin((Math.PI / 2) * 3);
    cloneModel.position.z = 3 / num;
    scene.add(cloneModel);

    let cloneModel2 = grassModel.clone();
    cloneModel2.scale.set(0.1, 0.1, 0.1);
    cloneModel2.position.x = -(amplitude * Math.sin((Math.PI / 2) * 1));
    cloneModel2.position.z = -1 / num;
    scene.add(cloneModel2);
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

//
// window resize
//

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Event listener for mouse movement
document.addEventListener("mousemove", (event) => {
  // Calculate the normalized mouse position (-1 to 1)
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
});

// Update function to move the camera based on mouse position
function updateCamera() {
  camera.position.x = mouseX * 3;

  // Call update recursively
  requestAnimationFrame(updateCamera);
}

updateCamera();

//
// animation function
//
function animationLoop(t) {
  cloud.rotation.x = t / 2000;
  cloud.rotation.y = t / 3000;

  renderer.render(scene, camera);
}
