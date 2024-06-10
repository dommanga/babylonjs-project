export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.nodes = {};
    this.jointLimits = this.defineJointLimits();
    this.intervalId = null;
  }

  initializeNodes() {
    this.nodes = {
      hips: this.scene.getNodeByName("mixamorig:Hips"),
      rightUpLeg: this.scene.getNodeByName("mixamorig:RightUpLeg"),
      // additional node initialization
    };

    // // initialize
    // Object.keys(this.nodes).forEach((nodeName) => {
    //   const node = this.nodes[nodeName];
    //   if (node) {
    //     node.computeWorldMatrix(true);
    //   }
    // });
  }

  defineJointLimits() {
    return {
      hips: {
        x: [0, 0],
        y: [-45, 45],
        z: [0, 0],
      },
      rightUpLeg: {
        x: [0, 0],
        y: [-30, 50],
        z: [120, 180],
      },
      // additioanl limits??
    };
  }

  getRandomRotation(min, max) {
    return Math.random() * (max - min) + min;
  }

  createRandomPose() {
    const pose = {};
    const r = Math.PI / 180; // radian
    for (const nodeName in this.jointLimits) {
      const limits = this.jointLimits[nodeName];
      pose[nodeName] = new BABYLON.Vector3(
        this.getRandomRotation(limits.x[0] * r, limits.x[1] * r),
        this.getRandomRotation(limits.y[0] * r, limits.y[1] * r),
        this.getRandomRotation(limits.z[0] * r, limits.z[1] * r)
      );
    }
    return pose;
  }

  applyRandomPose(randomPose) {
    console.log("Applying pose: ", randomPose);
    Object.keys(randomPose).forEach((nodeName) => {
      const node = this.nodes[nodeName];
      if (node) {
        // create animation
        const anim = new BABYLON.Animation(
          "anim_" + nodeName,
          "rotation",
          30, // FPS
          BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const easingFunction = new BABYLON.CubicEase();
        easingFunction.setEasingMode(
          BABYLON.EasingFunction.EASINGMODE_EASEINOUT
        );

        anim.setEasingFunction(easingFunction);

        const keys = [
          { frame: 0, value: node.rotation.clone() },
          { frame: 30, value: randomPose[nodeName] },
        ];

        anim.setKeys(keys);

        // start animation
        node.animations = [anim];
        this.scene.beginAnimation(node, 0, 30, false);
      }
    });
  }

  startAnimation(bpm) {
    const frameDuration = 60000 / bpm;
    let lastFrameTime = performance.now();

    const animate = (time) => {
      if (time - lastFrameTime >= frameDuration) {
        const randomPose = this.createRandomPose();
        this.applyRandomPose(randomPose);
        lastFrameTime = time;
      }
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.stopAnimation();
    this.animationFrameId = requestAnimationFrame(animate);
  }

  pauseAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log("Animation paused.");
    }
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log("Animation stopped.");
    }
  }
}
