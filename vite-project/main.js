import * as THREE from "three";

// import testVertexShader from "./shaders/vertex.glsl";
// import testFragmentShader from "./shaders/fragment.glsl";

import { MarchingCubes } from "//unpkg.com/three@0.164.0/examples/jsm/objects/MarchingCubes.js";
import Stats from "//unpkg.com/three@0.164.0/examples/jsm/libs/stats.module";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

//
// canvas
//
let canvas = document.querySelector(".webgl");

//
// title element
//
let title = document.querySelector(".text");

//
// variables
//
let backgroundTexture;
let backgroundTexture2;
let backgroundTexture3;
let amplitude = 15;
let num = 0.05;
let values = 300;
const initialPosition = 0;
const finalPosition = -252;

// Variables to track mouse position
// let mouseX = 0;

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

// // // Add fog to the scene with linear gradient effect
// var fogColor = 0xffffff; // Change this to your desired fog color
// var fog_Near = 1;
// var fog_Far = 10;
// scene.fog = new THREE.FogExp2(fogColor, fog_Near, fog_Far);

// // Set the background color to match the fog color
// scene.background = new THREE.Color(fogColor);

//
// camera
//
let fov = 45;
let aspectRatio = sizes.width / sizes.height;
let far = 24;
let near = 0.01;
let camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
camera.position.set(0, 6, 6);
camera.lookAt(0, 0, 1);
console.log(camera.position);

//
// renderer
//
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animationLoop);
// Sets the color of the background
renderer.setClearColor(backgroundTexture);
renderer.setClearColor(backgroundTexture2);

renderer.autoClear = false;
scene.add(camera);

// gradient scene //
let loader = new THREE.TextureLoader();

backgroundTexture = loader.load("assets/orange background.jpg");
backgroundTexture2 = loader.load("assets/scene background.svg ");
backgroundTexture3 = loader.load("assets/green gradient.svg");

//
// Function to create path points and add to the scene
//
function createPath(offsetX) {
  const pathPoints = [];
  const pathSegments = 1000;
  for (
    let i = initialPosition;
    i >= finalPosition;
    i -= (initialPosition - finalPosition) / pathSegments
  ) {
    const x = amplitude * Math.sin((Math.PI / 2) * i * num) + offsetX;
    const y = 4;
    const z = i;
    pathPoints.push(x, y, z);
  }

  const pathGeometry = new THREE.BufferGeometry();
  pathGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(pathPoints, 3)
  );

  const pathMaterial = new THREE.PointsMaterial({
    color: 0x000000,
    size: 0.05,
  });

  const pathDots = new THREE.Points(pathGeometry, pathMaterial);
  scene.add(pathDots);
}

//
// Create main path and offset paths
//
createPath(0); // Main path
createPath(2); // Right path 1
createPath(4); // Right path 2
createPath(-2); // Left path 1
createPath(-4); // Left path 2

//
//for stats
//
const stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

//  camera curved moment //

window.addEventListener("wheel", (event) => {
  // event.preventDefault();

  const delta = Math.sign(event.deltaY);

  if (delta < 0) {
    // Scrolling up
    values += 0.4;
  } else {
    values -= 0.4;
  }

  // Wrap camera position if it goes beyond final position
  if (values < finalPosition) {
    values = initialPosition;
  } else if (values > initialPosition) {
    values = initialPosition;
  }
  camera.position.set(
    amplitude * Math.sin((Math.PI / 2) * values * num),
    6,
    values
  );

  camera.lookAt(
    amplitude * Math.sin((Math.PI / 2) * (values - 0.01) * num),
    6,
    values - 0.01
  );

  title.style.display = "none";

  if (camera.position.z === 0) {
    title.style.display = "flex";
    camera.position.set(0, 6, 6);
    camera.lookAt(0, 0, 1);
  }

  // if (camera.position.z < css2dObject.position.z + 15) {
  //   css2dObject.style.display = "none";
  // }

  if (camera.position.z >= -84) {
    scene.background = backgroundTexture;
    // scene.background = new THREE.Color(0xb0cbf5);
    // scene.fog = new THREE.Fog(0xb0cbf5, 0.08, 5);

    console.log("yes");
  } else if (camera.position.z >= -168) {
    scene.background = backgroundTexture2;
    // scene.background = new THREE.Color(0xff0000);
    // scene.fog = new THREE.FogExp2(fogColor, fog_Near, fog_Far);

    console.log("no");
  } else {
    scene.background = backgroundTexture3;
    // scene.background = new THREE.Color(0xff0000);
    // scene.fog = new THREE.FogExp2(fogColor, fog_Near, fog_Far);
  }
});

//
// ambientLight
//
var ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

// Parameters for different cube groups

let cubesGroup;
let groupsData = [
  {
    cubes: [
      { size: 1.5, color: "#D895DA", position: { x: -1.5, y: 2, z: 2 } },
      { size: 2, color: "#D9EDBF", position: { x: -1.5, y: 0, z: 2 } },
      { size: 1, color: "#FF8F8F", position: { x: 1.5, y: 0, z: 2 } },
    ],
    groupPosition: {
      x: -25,
      y: 7,
      z: -8,
    },
    rotationSpeeds: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    cubes: [
      { size: 1, color: "#8FD1FF", position: { x: -1.5, y: 2, z: 2 } },
      { size: 1.5, color: "#FFC48F", position: { x: -1.5, y: 0, z: 2 } },
      { size: 2, color: "#8FFF94", position: { x: 1.5, y: 0, z: 2 } },
    ],
    groupPosition: { x: 11, y: 7, z: -119 },
    rotationSpeeds: { x: 0.02, y: 0.02, z: 0.02 },
  },
  {
    cubes: [
      { size: 1.2, color: "#BF8FFD", position: { x: 1, y: 2.5, z: 1.5 } },
      { size: 1.8, color: "#FF8FCA", position: { x: -1, y: 0.5, z: 1.5 } },
      { size: 2, color: "#C8FF8F", position: { x: 1.5, y: 0, z: 1.5 } },
    ],
    groupPosition: { x: 5.4, y: 7, z: -168 },
    rotationSpeeds: { x: 0.03, y: 0.03, z: 0.03 },
  },
  {
    cubes: [
      { size: 1.4, color: "#FF8F8F", position: { x: 0, y: 2, z: -2 } },
      { size: 2, color: "#8F8FFF", position: { x: -2, y: -1, z: -2 } },
      { size: 1.6, color: "#FFBF8F", position: { x: 2, y: -1, z: -2 } },
    ],
    groupPosition: {
      x: -26,
      y: 7,
      z: -243,
    },

    rotationSpeeds: { x: 0.04, y: 0.04, z: 0.04 },
  },

  {
    cubes: [
      { size: 1.5, color: "#D895DA", position: { x: -1.5, y: 2, z: 2 } },
      { size: 2, color: "#D9EDBF", position: { x: -1.5, y: 0, z: 2 } },
      { size: 1, color: "#FF8F8F", position: { x: 1.5, y: 0, z: 2 } },
    ],
    groupPosition: {
      x: -17,
      y: 6,
      z: -204,
    },
    rotationSpeeds: { x: 0.01, y: 0.01, z: 0.01 },
  },
];

const rotatingGroups = [];
// Create groups and add to the scene
groupsData.forEach((groupData) => {
  cubesGroup = new THREE.Group();

  // Create cubes based on the data and add them to the group
  groupData.cubes.forEach((cubeData) => {
    const { size, color, position } = cubeData;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cubesGroup.add(cube); // Add cube to the group
  });

  // Set group position
  cubesGroup.position.set(
    groupData.groupPosition.x,
    groupData.groupPosition.y,
    groupData.groupPosition.z
  );

  // Add the group to the scene
  scene.add(cubesGroup);

  // Store the group and its rotation speeds
  rotatingGroups.push({
    group: cubesGroup,
    rotationSpeeds: groupData.rotationSpeeds,
  });
});

// direction light //
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(
  -10 - amplitude * Math.sin((Math.PI / 2) * 3),
  4,
  2 / num - 30
);
scene.add(light);

// const directionalLightHelper = new THREE.DirectionalLightHelper(light, 45);
// scene.add(directionalLightHelper);

//
// marching cube effect - 2
//
// Function to create a marching cube effect with given parameters
let resolution = 48;
function createMarchingCubes(resolution, color, position) {
  const effect = new MarchingCubes(
    resolution,
    new THREE.MeshPhongMaterial({
      color: color,
      specular: 0xffffff,
      shininess: 35,
    }),
    true,
    true,
    100000
  );
  effect.scale.set(3, 3, 3);
  effect.position.set(position.x, position.y, position.z);

  effect.enableUvs = false;
  effect.enableColors = false;
  effect.isolation = 100;

  return effect;
}

// Creating three marching cubes with different colors and positions
const marchingCube1 = createMarchingCubes(resolution, 0xd6589f, {
  x: -4,
  y: 7,
  z: -48,
});
const marchingCube2 = createMarchingCubes(resolution, 0x58d69f, {
  x: 2,
  y: 7,
  z: -133,
});
const marchingCube3 = createMarchingCubes(resolution, 0x589fd6, {
  x: 1,
  y: 7,
  z: -212,
});

// Adding the marching cubes to the scene
scene.add(marchingCube1);
scene.add(marchingCube2);
scene.add(marchingCube3);

// Function to update marching cubes
function updateCubes(object, time, numblobs) {
  object.reset();

  const subtract = 12;
  const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

  for (let i = 0; i < numblobs; i++) {
    const ballx =
      Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 +
      0.5;
    const bally =
      Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77;
    const ballz =
      Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

    object.addBall(ballx, bally, ballz, strength, subtract);
  }

  object.update();
}

//
// spheres -4
//
// Parameters for different sphere groups

let spheresGroup;
let spheresGroupsData = [
  {
    spheres: [
      { radius: 0.5, color: "#7AB2B2", position: { x: 0.5, y: 1, z: -2 } },
      { radius: 0.3, color: "#A87676", position: { x: 0.8, y: 0, z: -2 } },
      { radius: 0.8, color: "#8576FF", position: { x: 1, y: 0, z: -2 } },
    ],
    groupPosition: {
      x: 23,
      y: 7,
      z: -134,
    },
    rotationSpeeds: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    spheres: [
      { radius: 0.5, color: "#FF9F9F", position: { x: 0.5, y: 3, z: 1 } },
      { radius: 0.9, color: "#9FFF9F", position: { x: 0.8, y: 1, z: -1 } },
      { radius: 0.3, color: "#9F9FFF", position: { x: 1, y: -1, z: -1 } },
    ],
    groupPosition: { x: -20, y: 7, z: -97 },
    rotationSpeeds: { x: 0.02, y: 0.02, z: 0.02 },
  },
  {
    spheres: [
      { radius: 0.2, color: "#FFDF9F", position: { x: 0.8, y: 2, z: 1.5 } },
      { radius: 0.8, color: "#FF9FCF", position: { x: 0.5, y: 0.5, z: 1.5 } },
      { radius: 0.5, color: "#9FFFCF", position: { x: 1, y: 1, z: 1 } },
    ],
    groupPosition: { x: 21, y: 7, z: -220 },
    rotationSpeeds: { x: 0.03, y: 0.03, z: 0.03 },
  },
  {
    spheres: [
      { radius: 0.4, color: "#CF9FFF", position: { x: 0, y: 1, z: 2 } },
      { radius: 0.8, color: "#FF9F9F", position: { x: 0.9, y: 1, z: 0 } },
      { radius: 0.6, color: "#9FFFBF", position: { x: 0.5, y: 1, z: 0 } },
    ],
    groupPosition: {
      x: 18,
      y: 7,
      z: -69,
    },
    rotationSpeeds: { x: 0.04, y: 0.04, z: 0.04 },
  },
];

const rotatingSpheresGroups = [];

// Create groups and add to the scene
spheresGroupsData.forEach((groupData) => {
  spheresGroup = new THREE.Group();

  // Create spheres based on the data and add them to the group
  groupData.spheres.forEach((sphereData) => {
    const { radius, color, position } = sphereData;
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(position.x, position.y, position.z);
    spheresGroup.add(sphere); // Add sphere to the group
  });

  // Set group position
  spheresGroup.position.set(
    groupData.groupPosition.x,
    groupData.groupPosition.y,
    groupData.groupPosition.z
  );

  // Add the group to the scene
  scene.add(spheresGroup);

  // Store the group and its rotation speeds
  rotatingSpheresGroups.push({
    group: spheresGroup,
    rotationSpeeds: groupData.rotationSpeeds,
  });
});

//
// tubes -5
//

// Mesh parameters for tubes
const tubesData = [
  {
    radius: 0.5,
    height: 3,
    radialSegments: 16,
    heightSegments: 16,
    color: "#B0EBB4",
    position: { x: 4.5, y: 0, z: -2 },
  },
  {
    radius: 0.3,
    height: 2.5,
    radialSegments: 12,
    heightSegments: 12,
    color: "#E1AFD1",
    position: { x: 4, y: 0, z: 0 },
  },
  {
    radius: 0.7,
    height: 4,
    radialSegments: 20,
    heightSegments: 20,
    color: "#7AA2E3",
    position: { x: -4, y: 0, z: 0 },
  },
];

// Create a group to hold all tubes
const tubesGroup = new THREE.Group();

// Create tubes based on the data and add them to the group
tubesData.forEach((tubeData) => {
  const { radius, height, radialSegments, heightSegments, color, position } =
    tubeData;
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    radialSegments,
    heightSegments
  ); // Adjusted size
  const material = new THREE.MeshBasicMaterial({ color });
  const tube = new THREE.Mesh(geometry, material);
  tube.position.set(position.x, position.y, position.z);
  tubesGroup.add(tube); // Add tube to the group
});

// Position the group in the scene
tubesGroup.position.set(-5, 5, -1 / num - 60);

// Add the group to the scene
scene.add(tubesGroup);

// Create a material for the lines
var lineMaterial = new THREE.LineBasicMaterial({ color: 0x322c2b });

// Create an array to hold the positions of the lines
var positions = [
  {
    x: -7 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num + 2.2,
  },
  { x: -7 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 13 },
  { x: 7 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 26 },
  { x: 35 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 30 },
  { x: 36 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 45 },
  { x: 27 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 65 },

  { x: -6 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 73 },
  { x: -6 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 90 },
  { x: 0 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 109 },
  {
    x: 39 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 112,
  },
  {
    x: 38 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 125,
  },
  { x: 15, y: 6.6, z: -165 },

  {
    x: -7 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 155,
  },
  {
    x: -7 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 175,
  },
  { x: 8 - amplitude * Math.sin((Math.PI / 2) * 1), y: 6.6, z: -1 / num - 195 },
  {
    x: 40 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 196,
  },
  {
    x: 35 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 215,
  },
  {
    x: 17 - amplitude * Math.sin((Math.PI / 2) * 1),
    y: 6.6,
    z: -1 / num - 230,
  },
];

// Array containing text for each label
var labelTexts = [
  " Daimonds",
  "Sandals",
  "Gucci Handbags",
  "Sneakers ",
  "Daimond Ring",
  "Watch",
  "Lakmi Kajal",
  "lipstick",
  "perfume",
  "serum",
  "skin care",
  "Soap",
  "Cookies",
  "CoCo- cola",
  "Food",
  "Ice cream",
  "Kfc",
  "Star Bugs",

  // Add more text values as needed
];

// Instantiate CSS2DRenderer
const css2dRenderer = new CSS2DRenderer();
css2dRenderer.setSize(window.innerWidth, window.innerHeight);
css2dRenderer.domElement.style.position = "absolute";
css2dRenderer.domElement.style.top = 0;
document.body.appendChild(css2dRenderer.domElement);

// Function to create CSS2DObject for text
function createTextElement(text) {
  const textElement = document.createElement("div");
  textElement.className = "label";
  textElement.textContent = text;
  const css2dObject = new CSS2DObject(textElement);
  return css2dObject;
}

// Create and add the lines, dots, and text labels to the scene
positions.forEach((pos, index) => {
  // Create line geometry and add to scene
  var lineGeometry = new THREE.BufferGeometry();
  var vertices = new Float32Array([
    pos.x,
    pos.y - 1,
    pos.z,
    pos.x,
    pos.y + 1,
    pos.z,
  ]);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  var line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  // Create dot geometry and add to scene
  var dotGeometry = new THREE.SphereGeometry(0.1); // Adjust the radius as needed
  var dotMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Adjust color as needed
  var dot = new THREE.Mesh(dotGeometry, dotMaterial);
  dot.position.set(pos.x, pos.y + 1, pos.z); // Set dot position at the top tip
  scene.add(dot);

  // Create and add text label next to the dot
  var textLabel = createTextElement(labelTexts[index]); // Assign text from array
  // Position text labels based on group index
  var groupIndex = Math.floor(index / 3);
  if (groupIndex % 2 === 0) {
    // Even group indices (0, 2, 4, ...)
    textLabel.position.copy(dot.position).add(new THREE.Vector3(1.2, 0, 0)); // Position text to the right
  } else {
    // Odd group indices (1, 3, 5, ...)
    textLabel.position.copy(dot.position).add(new THREE.Vector3(-1.5, 0, 0)); // Position text to the left
  }

  scene.add(textLabel);
});

//
// video elements function
//

function createVideoPlane(src, position, rotationY) {
  var video = document.createElement("video");
  video.src = src;
  video.autoplay = true;
  video.loop = true;
  // video.muted = true;

  var texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;

  var geometry = new THREE.PlaneGeometry(5, 3, 32, 32); // Adjust size as needed
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  // for shaders //

  // const count = geometry.attributes.position.count; // for getting count of positions

  // const randoms = new Float32Array(count);

  // for (let i = 0; i < count; i++) {
  //   randoms[i] = Math.random();
  // }

  // geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  // material = new THREE.RawShaderMaterial({
  //   vertexShader: testVertexShader,
  //   fragmentShader: testFragmentShader,
  //   side: THREE.DoubleSide,
  //   uniforms: {
  //     uFrequency: { value: new THREE.Vector2(10, 5) }, // for waves
  //     uTime: { value: 0 }, // time uniform value for animation
  //     // uColor: { value: new THREE.Color("orange") },
  //     uTexture: { value: texture },
  //     uFrequency: { value: 10 }, // for waves,
  //   },
  // });

  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.y = rotationY;
  plane.position.set(position.x, position.y, position.z);

  scene.add(plane);
}

// Position and rotation settings for each video plane
var positions = [
  { x: -15 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num + 3 },
  { x: -10 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 13 },
  { x: 3 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 26 },
  { x: 40 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 28 },
  { x: 40 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 45 },
  { x: 30 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 65 },

  { x: -15 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 73 },
  { x: -10 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 90 },
  { x: -3 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 109 },
  { x: 39 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 108 },
  { x: 43 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 125 },
  { x: 18, y: 7, z: -165 },

  { x: -15 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 155 },
  { x: -10 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 175 },
  { x: 5 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 195 },
  { x: 50 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 195 },
  { x: 40 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 215 },
  { x: 20 - amplitude * Math.sin((Math.PI / 2) * 1), y: 7, z: -1 / num - 230 },
];

// Rotation settings for each video plane
var rotations = [
  1, 1, 3.5, -1.2, 2, -0.4, 0.7, 0.7, 0.7, 2.5, 2.5, 2.5, 0.5, 0.5, 2.5, 2.5,
  2.5, -0.1,
];

// Sources for each video
var sources = [
  "assets/jwellery add.mp4",
  "assets/sandals add.mp4",
  "assets/gucci add.mp4",
  "assets/sneakers add.mp4",
  "assets/ring add.mp4",
  "assets/watch add.mp4",
  "assets/kajal.mp4",
  "assets/lipstick add.mp4",
  "assets/perfume add.mp4",
  "assets/serum.mp4",
  "assets/skin car add.mp4",
  "assets/soap.mp4",
  "assets/biscuits.mp4",
  "assets/coco cola add.mp4",
  "assets/food.mp4",
  "assets/icecream add.mp4",
  "assets/kfc add.mp4",
  "assets/starbugs add.mp4",
];

// Create and add each video plane to the scene
for (var i = 0; i < sources.length; i++) {
  createVideoPlane(sources[i], positions[i], rotations[i]);
}

//
// window resize
//
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// // Instantiate CSS2DRenderer
// const css2dRenderer = new CSS2DRenderer();
// css2dRenderer.setSize(window.innerWidth, window.innerHeight);
// css2dRenderer.domElement.style.position = "absolute";
// css2dRenderer.domElement.style.top = 0;
// document.body.appendChild(css2dRenderer.domElement);

// // Create CSS2DObject for text
// const textElement = document.createElement("div");
// textElement.className = "label";
// textElement.textContent = "Your Text Here";
// const css2dObject = new CSS2DObject(textElement);
// css2dObject.position.set(
//   3 - amplitude * Math.sin((Math.PI / 2) * 1),
//   6.5,
//   -1 / num - 19
// ); // Set position

// // Add CSS2DObject to the scene
// scene.add(css2dObject);

// // Event listener for mouse movement
// document.addEventListener("mousemove", (event) => {
//   // Calculate the normalized mouse position (-1 to 1)
//   mouseX = (event.clientX / window.innerWidth) * 2 - 1;
// });

// // Update function to move the camera based on mouse position
// function updateCamera() {
//   camera.position.x = mouseX * 3;

//   // Call update recursively
//   requestAnimationFrame(updateCamera);
// }

// updateCamera();

//
// grid helper
//
// let gridHelper = new THREE.GridHelper(1000, 1000);
// gridHelper.position.z = 0;
// scene.add(gridHelper);

//
// creating plane for ray casting
//
// let raycastPlaneMaterial = new THREE.MeshBasicMaterial({
//   side: THREE.DoubleSide,
//   color: "pink",
// });

// let raycastPlaneGeometry = new THREE.PlaneGeometry(10000, 10000);

// let raycastPlane = new THREE.Mesh(raycastPlaneGeometry, raycastPlaneMaterial);
// raycastPlane.rotation.x = Math.PI / 2;

// raycastPlane.position.y = 7;
// scene.add(raycastPlane);

// //
// // raycasting used for finding positions
// //

// const rayCaster = new THREE.Raycaster();
// window.addEventListener("click", onSelect);
// function onSelect(event) {
//   rayCaster.setFromCamera(
//     {
//       x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
//       y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
//     },
//     camera
//   );
//   const intersects = rayCaster.intersectObject(raycastPlane, true);
//   if (intersects.length > 0) {
//     const intersectPoint = intersects[0].point;
//     console.log(intersectPoint);
//   }
// }

//
// animation function
//
function animationLoop(t) {
  // Rotate spheres

  rotatingSpheresGroups.forEach((item) => {
    item.group.rotation.x += item.rotationSpeeds.x;
    item.group.rotation.y += item.rotationSpeeds.y;
    item.group.rotation.z += item.rotationSpeeds.z;
  });

  // // Rotate tubes
  // tubesGroup.rotation.x += 0.05;
  // tubesGroup.rotation.y -= 0.02;
  // tubesGroup.rotation.z += 0.02;

  updateCubes(marchingCube1, t * 0.0005, 10, true, false, false);
  updateCubes(marchingCube2, t * 0.0005, 10, true, false, false);
  updateCubes(marchingCube3, t * 0.0005, 10, true, false, false);

  // Rotate each group based on its rotation speeds
  rotatingGroups.forEach(({ group, rotationSpeeds }) => {
    group.rotation.x += rotationSpeeds.x;
    group.rotation.y += rotationSpeeds.y;
    group.rotation.z += rotationSpeeds.z;
  });

  renderer.render(scene, camera);
}

const clock = new THREE.Clock();
let time = 0;

function animate() {
  const delta = clock.getDelta();
  // const eTime = clock.getElapsedTime();

  // material.uniforms.uTime.value += eTime;

  time += delta * 1.0;

  // updateCubes(effect, time, 7, true, false, false);

  requestAnimationFrame(animate);

  css2dRenderer.render(scene, camera);

  stats.update();
}

animate();

// plane //

// let roadTexture = loader.load("unnamed.png");

// let planeGeometry = new THREE.PlaneGeometry(50, 50);

// let planMaterial = new THREE.MeshLambertMaterial({
//   map: roadTexture,
// });
// planMaterial.transparent = true;
// let plane = new THREE.Mesh(planeGeometry, planMaterial);

// plane.rotation.x = -Math.PI / 2;
// plane.position.set(0, 0, -70);
// scene.add(plane);
// Function to create and add a video plane to the scene

//
// image -1
//

// let imageMap = loader.load("image-1.jpg");
// imageMap.colorSpace = THREE.SRGBColorSpace;

// let material1 = new THREE.MeshLambertMaterial({
//   map: imageMap,
// });

// let geometry1 = new THREE.PlaneGeometry(5, 3);

// let image1 = new THREE.Mesh(geometry1, material1);
// image1.position.set(
//   -2 - amplitude * Math.sin((Math.PI / 2) * 1),
//   7,
//   -1 / num - 20
// );
// image1.rotation.y = 0.2;

// scene.add(image1);
