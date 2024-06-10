export class SceneManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.createScene();
    this.engine.runRenderLoop(() => this.scene.render());
    window.addEventListener("resize", () => this.engine.resize());
  }

  createScene() {
    new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      2,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    ).attachControl(this.canvas, true);
    new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      this.scene
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
    rootMesh.position = new BABYLON.Vector3(0, -0.7, 0);
    rootMesh.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
    // this.scene.addMesh(rootMesh);
  }

  // startAnimation(bpm) {
  //   if (this.animationGroups && this.animationGroups.length > 0 && bpm) {
  //     // this.configureAnimations(bpm);
  //     this.animationGroups.forEach((group) => group.start(true));
  //     console.log(`Animation started with BPM: ${bpm}`);
  //   } else {
  //     console.log("Waiting for BPM to start animation...");
  //   }
  // }

  getScene() {
    return this.scene;
  }
}
