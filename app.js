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

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(light);

  const loading = document.getElementById("loading");

  try {
    const params = new URLSearchParams(window.location.search);
    const jsonUrl = params.get("data");

    if (!jsonUrl) {
      loading.innerText = "No JSON URL!";
      return;
    }

    loading.innerText = "Fetching JSON...";

    const res = await fetch(jsonUrl);
    const data = await res.json();

    console.log("JSON:", data);

    if (!data.model) {
      loading.innerText = "Model missing!";
      return;
    }

    loadModel(data.model, data.details); // ✅ FIX

  } catch (err) {
    console.error(err);
    loading.innerText = "Error loading JSON";
  }
}

// 🔥 MODEL LOAD
function loadModel(url, details) {

  const loader = new THREE.GLTFLoader();

  document.getElementById("loading").innerText = "Loading Model...";

  loader.load(
    url,
    (gltf) => {
      model = gltf.scene;

      model.position.set(0, 1, -3);
      model.scale.set(1,1,1);

      scene.add(model);

      document.getElementById("loading").style.display = "none";

      // 🔊 Voice (3 sec delay)
      setTimeout(() => speak(details), 3000);
    },

    undefined,

    (error) => {
      console.error(error);
      document.getElementById("loading").innerText = "Model Load Error!";
    }
  );
}

// 🔊 Voice
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speechSynthesis.speak(speech);
}

// Rotate
window.addEventListener("pointermove", (e) => {
  if(model && e.buttons === 1){
    model.rotation.y += e.movementX * 0.01;
  }
});

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
