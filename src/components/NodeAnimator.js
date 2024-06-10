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

      spine1: this.scene.getNodeByName("mixamorig:Spine1"),
      spine2: this.scene.getNodeByName("mixamorig:Spine2"),

      neck: this.scene.getNodeByName("mixamorig:Neck"),
      head: this.scene.getNodeByName("mixamorig:Head"),

      leftShoulder: this.scene.getNodeByName("mixamorig:LeftShoulder"),
      rightShoulder: this.scene.getNodeByName("mixamorig:RightShoulder"),

      leftArm: this.scene.getNodeByName("mixamorig:LeftArm"),
      rightArm: this.scene.getNodeByName("mixamorig:RightArm"),

      leftForeArm: this.scene.getNodeByName("mixamorig:LeftForeArm"),
      rightForeArm: this.scene.getNodeByName("mixamorig:RightForeArm"),

      leftHand: this.scene.getNodeByName("mixamorig:LeftHand"),
      rightHand: this.scene.getNodeByName("mixamorig:RightHand"),

      leftUpLeg: this.scene.getNodeByName("mixamorig:LeftUpLeg"),
      rightUpLeg: this.scene.getNodeByName("mixamorig:RightUpLeg"),

      leftLeg: this.scene.getNodeByName("mixamorig:LeftLeg"),
      rightLeg: this.scene.getNodeByName("mixamorig:RightLeg"),
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
        x: [0.74, 0.74],
        y: [0, 0],
        z: [0, 0],
      },

      spine1: {
        x: [10, 50],
        y: [-50, 50],
        z: [-10, 10],
      },

      spine2: {
        x: [-30, 30],
        y: [-50, 50],
        z: [-10, 10],
      },

      neck: {
        x: [-20, 20],
        y: [-50, 50],
        z: [-20, 20],
      },

      head: {
        x: [-20, 20],
        y: [-50, 50],
        z: [-20, 20],
      },

      leftShoulder: {
        x: [0, 80],
        y: [150, 210],
        z: [30, 140],
      },
      rightShoulder: {
        x: [0, 80],
        y: [150, 210],
        z: [-150, 0],
      },

      leftArm: {
        x: [-50, 50],
        y: [-80, 50],
        z: [-50, 50],
      },
      rightArm: {
        x: [-50, 50],
        y: [-80, 50],
        z: [-50, 50],
      },

      leftForeArm: {
        x: [-50, 50],
        y: [-50, 50],
        z: [0, 100],
      },
      rightForeArm: {
        x: [-50, 50],
        y: [-50, 50],
        z: [-100, 0],
      },

      leftHand: {
        x: [-50, 50],
        y: [-50, 50],
        z: [-30, 30],
      },
      rightHand: {
        x: [-50, 50],
        y: [-50, 50],
        z: [-30, 30],
      },

      leftUpLeg: {
        x: [-40, 40],
        y: [-30, 50],
        z: [180, 240],
      },
      rightUpLeg: {
        x: [-40, 40],
        y: [-30, 50],
        z: [120, 180],
      },

      leftLeg: {
        x: [-110, 0],
        y: [0, 0],
        z: [0, 0],
      },
      rightLeg: {
        x: [-110, 0],
        y: [0, 0],
        z: [0, 0],
      },
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
    const frameDuration = Math.round(60000 / bpm);
    console.log("frameDuration:", frameDuration);
    let lastFrameTime = performance.now();
    this.currentPose = this.createRandomPose();
    this.applyRandomPose(this.currentPose);

    const animate = (time) => {
      if (time - lastFrameTime >= frameDuration) {
        const newPose = this.createRandomPose();
        this.applyRandomPose(newPose);
        this.currentPose = newPose;
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
