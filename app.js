let scene, camera, renderer, model;

init();
animate();

async function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  document.body.appendChild(VRButton.createButton(renderer));

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(light);

  // GET JSON from Flutter
  const params = new URLSearchParams(window.location.search);
  const jsonUrl = params.get("data");

  if (!jsonUrl) {
    alert("No data provided");
    return;
  }

  try {
    const res = await fetch(jsonUrl);
    const data = await res.json();

    loadModel(data.model, data.description);

  } catch (e) {
    console.error(e);
    alert("Failed to load JSON");
  }
}

// MODEL LOAD
function loadModel(url, description) {
  const loader = new THREE.GLTFLoader();

  loader.load(url, (gltf) => {

    model = gltf.scene;
    model.position.set(0, 1, -3);
    model.scale.set(1,1,1);

    scene.add(model);

    document.getElementById("loading").style.display = "none";

    // 3–4 sec baad voice
    setTimeout(() => speak(description), 3000);

  });
}

// Voice
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US"; // change to hi-IN for Hindi
  speechSynthesis.speak(speech);
}

// Rotate (drag)
window.addEventListener("pointermove", (e) => {
  if(model && e.buttons === 1){
    model.rotation.y += e.movementX * 0.01;
  }
});

// Loop
function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
