
const testLoader = new THREE.GLTFLoader();
testLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Stacy.glb', 
  (gltf) => console.log('Stacy Loaded Successfully'),
  null,
  (err) => console.error('Stacy Load Failed', err)
);
