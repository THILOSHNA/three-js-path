// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// // uniform float uFrequency;
// uniform vec2 uFrequency; // for two coordinate point

// uniform float uTime;

// attribute vec3 position; 
// // attribute float aRandom; // check in html file 

// attribute vec2 uv;

// varying float vRandom;
// varying vec2 vUv;


//   void main()
//   {
//     // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     float elevation = sin(modelPosition.x * 3.0 - uTime*100.0) * 0.09;
//     elevation += sin(modelPosition.y * 3.0 - uTime*100.0) * 0.1;
//     modelPosition.z += elevation;

//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectionPosition = projectionMatrix*viewPosition;
//     gl_Position = projectionPosition;
//     gl_Position.z = 0.5;

//     // vRandom = aRandom ;// vRandom here is to use it in the fragments

//     vUv = uv;
//   }  