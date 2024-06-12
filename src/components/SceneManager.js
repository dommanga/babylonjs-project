export class SceneManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.createScene();
    this.storedAnimations = [];
    this.engine.runRenderLoop(() => this.scene.render());
    window.addEventListener("resize", () => this.engine.resize());
  }

  createScene() {
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      2,
      new BABYLON.Vector3(0, 0.7, 0),
      this.scene
    );
    camera.attachControl(this.canvas, true);

    // Zoom lock
    const zoomLockDistance = 2.5; // fixed distance
    camera.lowerRadiusLimit = zoomLockDistance;
    camera.upperRadiusLimit = zoomLockDistance;

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      this.scene
    );
    light.intensity = 1.2;
  }

  loadAnimationFromGLB(url, fileName) {
    BABYLON.SceneLoader.ImportMesh(
      "",
      url,
      fileName,
      this.scene,
      (meshes, particleSystems, skeletons, animationGroups) => {
        // Animation groups
        this.storedAnimations = animationGroups;
        console.log("Animation groups extracted and stored.");

        meshes.forEach((mesh) => {
          mesh.dispose(); // remove mesh
        });
      }
    );
  }

  linkBonesToNodes(skeleton) {
    skeleton.bones.forEach((bone) => {
      const node = this.scene.getNodeByName(bone.name);
      if (node) {
        bone.linkedNode = node;
      }
    });
  }

  addMesh(mesh) {
    const rootMesh = mesh;
    rootMesh.position = new BABYLON.Vector3(0, 0, 0);
    rootMesh.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
  }

  getScene() {
    return this.scene;
  }
}
