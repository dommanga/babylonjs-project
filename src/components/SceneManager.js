export class SceneManager {
  constructor(canvasId) {
    this.initializeEngine(canvasId);
    this.createScene();
    this.runRenderLoop();
    this.setupResizeListener();
    this.storedAnimations = [];
  }

  initializeEngine(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
  }

  runRenderLoop() {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  setupResizeListener() {
    window.addEventListener("resize", () => this.engine.resize());
  }

  createScene() {
    this.setupCamera();
    this.setupLighting();
    this.setupGround();
  }

  setupCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      2.5,
      new BABYLON.Vector3(0, 0.7, 0),
      this.scene
    );
    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = 2.5; // Zoom lock
  }

  setupLighting() {
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      this.scene
    );
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.intensity = 0.4;
  }

  setupGround() {
    const groundMaterial = new BABYLON.StandardMaterial(
      "groundMaterial",
      this.scene
    );
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );
    ground.material = groundMaterial;
  }

  loadAnimationFromGLB(url, fileName) {
    BABYLON.SceneLoader.ImportMesh(
      "",
      url,
      fileName,
      this.scene,
      (meshes, particleSystems, skeletons, animationGroups) => {
        this.storedAnimations = animationGroups;
        meshes.forEach((mesh) => mesh.dispose()); // Clean up meshes
        console.log("Animation groups extracted and stored.");
      }
    );
  }

  addMesh(mesh) {
    mesh.position = new BABYLON.Vector3(0, 0, 0);
    mesh.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
    mesh.material = new BABYLON.StandardMaterial("modelMaterial", this.scene);
    mesh.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    mesh.material.specularColor = new BABYLON.Color3(1, 1, 1);
    this.scene.addMesh(mesh);
  }

  getScene() {
    return this.scene;
  }
}
