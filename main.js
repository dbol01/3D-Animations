import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* Always need 3 objects for ThreeJS
 * Scene (container to hold all the cameras, objects and lights)
 * Camera (to look at things in a scene, lots of different types)
 * Renderer
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three-entry"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setX(30);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

//background texture
const spaceTexture = new THREE.TextureLoader().load(
  "./assets/images/space.jpg"
);

scene.background = spaceTexture;

///////////// objects defined below
// Geometry
// - define the shape of the object/s you want to create

// Material
// - define the wrapping/overlay of the gemotry (textures, shaders etc)

// Mesh
// - combine the geometry and material, this is what is rendered to the screen

// Earth texture mapping and rendering
const earthTexture = new THREE.TextureLoader().load(
  "./assets/images/earth-texture.jpg"
);
// A normalMap is designed to add depth to textures
const earthNormalMap = new THREE.TextureLoader().load(
  "./assets/images/earth-normal.jpeg"
);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({ map: earthTexture, normalMap: earthNormalMap })
);
scene.add(earth);

// loop/ring shape
const loopGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const loopMaterial = new THREE.MeshStandardMaterial({ color: 0xff6343 });
const loopMesh = new THREE.Mesh(loopGeometry, loopMaterial);
scene.add(loopMesh);

// Light source (needed for non 'basic' mesh materials)
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// stars
const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // generate random position for each star
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  // add the new star to the scene
  scene.add(star);
};
// Add 200 stars to the scene
Array(200).fill().forEach(addStar);

// recursive call (game loop) to automatically update the animation on each frame change
const animate = () => {
  requestAnimationFrame(animate);

  loopMesh.rotation.x += 0.01;
  loopMesh.rotation.y += 0.005;
  loopMesh.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
};

animate();
