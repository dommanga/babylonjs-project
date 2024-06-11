export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.animationGroups = [];
    this.boneConfig = this.defineBoneConfigs();
    this.nodes = {};
    this.initialPose = {};
    this.jointLimits = this.defineJointLimits();
    this.intervalId = null;
    this.bpm = null;
  }

  initializeNodes(mesh, skeleton) {
    this.mesh = mesh;
    this.skeleton = skeleton;
    this.nodes = {
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

  resetToInitialPose() {
    for (const nodeName in this.initialPose) {
      const node = this.nodes[nodeName];
      const initialState = this.initialPose[nodeName];
      node.rotation = initialState.clone();
    }
  }

  defineBoneConfigs() {
    return {
      LeftForeArm: {
        targetPosition: { x: 1, y: 1.4, z: 0 },
        poleTargetPosition: { x: 0, y: 3, z: 5 },
        poleAngle: { min: -2.5, max: -0.9 },
        slerpAmount: 0.3,
        range: {
          x: { min: 0.3, max: 0.8 },
          y: { min: 0.7, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      RightForeArm: {
        targetPosition: { x: -1, y: 1.4, z: 0 },
        poleTargetPosition: { x: 0, y: 3, z: 5 },
        poleAngle: { min: -Math.PI, max: -0.5 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.8, max: -0.3 },
          y: { min: 0.7, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
    };
  }

  getRandomPosition(range) {
    return Math.random() * (range.max - range.min) + range.min;
  }

  applyEasingToPosition(
    targetPosition,
    currentPosition,
    easingFunction,
    deltaTime
  ) {
    return BABYLON.Vector3.Lerp(
      currentPosition,
      targetPosition,
      easingFunction(deltaTime)
    );
  }

  setupBoneIK(scene, skeleton, mesh, boneName, config, bpm) {
    const bone = skeleton.bones.find((b) => b.name === `mixamorig:${boneName}`);
    if (!bone) {
      console.error(`Bone ${boneName} not found in skeleton`);
      return;
    }
    var spineBone = skeleton.bones.find(
      (bone) => bone.name === "mixamorig:Spine1"
    );

    const easingFunction = (t) => t * t * (3 - 2 * t);
    // const easingFunction = (t) => 0.5 - Math.cos(t * Math.PI) / 2;

    const target = BABYLON.MeshBuilder.CreateSphere(
      "ikTarget_" + boneName,
      { diameter: 0.1 },
      scene
    );
    const poleTarget = BABYLON.MeshBuilder.CreateSphere(
      "poleTarget_" + boneName,
      { diameter: 0.3 },
      scene
    );
    target.setEnabled(false);
    poleTarget.setEnabled(false);

    target.parent = mesh;
    poleTarget.parent = mesh;

    target.position = new BABYLON.Vector3(
      config.targetPosition.x,
      config.targetPosition.y,
      config.targetPosition.z
    );
    poleTarget.position = new BABYLON.Vector3(
      config.poleTargetPosition.x,
      config.poleTargetPosition.y,
      config.poleTargetPosition.z
    );

    const ikController = new BABYLON.BoneIKController(mesh, bone, {
      targetMesh: target,
      poleTargetMesh: poleTarget,
      poleAngle: config.poleAngle.max,
      slerpAmount: config.slerpAmount,
      bendAxis: new BABYLON.Vector3(
        config.bendAxis.x,
        config.bendAxis.y,
        config.bendAxis.z
      ),
    });

    let relativePosition = new BABYLON.Vector3(
      config.targetPosition.x,
      config.targetPosition.y,
      config.targetPosition.z
    );

    let currentTargetPosition = new BABYLON.Vector3();
    let newTargetPosition = new BABYLON.Vector3();
    let isTransitioning = false;
    let transitionStartTime = 0;
    const transitionDuration = 60000 / bpm;

    scene.registerBeforeRender(() => {
      ikController.update();

      if (isTransitioning) {
        const elapsedTime = scene.getEngine().getDeltaTime();
        const progress = Math.min(
          (Date.now() - transitionStartTime) / transitionDuration,
          1
        );
        target.position = BABYLON.Vector3.Lerp(
          currentTargetPosition,
          newTargetPosition,
          easingFunction(progress)
        );

        if (progress >= 1) {
          isTransitioning = false;
        }
      }
    });

    const updateRandomTargetPosition = () => {
      currentTargetPosition.copyFrom(target.position);

      var spinePosition = spineBone.getAbsolutePosition();
      newTargetPosition.x =
        spinePosition.x + this.getRandomPosition(config.range.x);
      newTargetPosition.y = this.getRandomPosition(config.range.y);
      newTargetPosition.z =
        spinePosition.z + this.getRandomPosition(config.range.z);

      isTransitioning = true;
      transitionStartTime = Date.now();
    };

    function updatePoleAngle() {
      const min = config.poleAngle.min;
      const max = config.poleAngle.max;
      const randomAngle = Math.random() * (max - min) + min;
      ikController.poleAngle = randomAngle;
    }

    setInterval(() => {
      updateRandomTargetPosition();
      updatePoleAngle();
    }, transitionDuration);
  }

  initializeBoneAnimations(scene) {
    for (const boneName in this.boneConfig) {
      this.setupBoneIK(
        scene,
        this.skeleton,
        this.mesh,
        boneName,
        this.boneConfig[boneName],
        this.bpm
      );
    }
  }

  applyAnimationToModel(skeleton) {
    this.animationGroups.forEach((animationGroup) => {
      animationGroup.targetedAnimations.forEach((targetedAnimation) => {
        const targetNode = this.scene.getNodeByName(
          targetedAnimation.target.name
        );
        if (targetNode) {
          animationGroup.addTargetedAnimation(
            targetedAnimation.animation,
            targetNode
          );
        } else {
          console.warn(`Node ${targetedAnimation.target.name} not found.`);
        }
      });
    });
  }

  setAnimationSpeed(bpm) {
    this.bpm = bpm;
    const speedRatio = bpm / 60 / 1.92;
    this.animationGroups.forEach((group) => {
      group.speedRatio = speedRatio;
    });
  }

  startAnimation() {
    this.animationGroups.forEach((group) => {
      group.play(true);
      console.log("Animation group started:", group.name);
    });
  }

  pauseAnimation() {
    this.animationGroups.forEach((group) => {
      group.pause();
    });
  }

  stopAnimation() {
    this.animationGroups.forEach((group) => {
      group.stop();
    });
  }
}
