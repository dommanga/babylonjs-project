export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.animationGroups = [];
    this.boneConfig = this.defineBoneConfigs();
    this.nodes = {};
    this.initialPose = {};
    this.jointLimits = this.defineJointLimits();
    this.intervalId = null;

    this.storedIK = null; // 나중에 없애. gui.
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

    // specific modification
    Object.keys(this.nodes).forEach((nodeName) => {
      const node = this.nodes[nodeName];
      if (node) {
        let initialRotation = node.rotation.clone();
        if (nodeName === "leftUpLeg" || nodeName === "rightUpLeg") {
          initialRotation.z = Math.PI;
        } else if (nodeName === "leftShoulder") {
          initialRotation.z = -Math.PI / 2;
        } else if (nodeName === "rightShoulder") {
          initialRotation.z = Math.PI / 2;
        }
        this.initialPose[nodeName] = initialRotation;
      }
    });
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
        bendAxis: [-1, 0, 0],
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
        bendAxis: [-1, 0, 0],
      },
    };
  }

  getRandomPosition(range) {
    return Math.random() * (range.max - range.min) + range.min;
  }

  setupBoneIK(scene, skeleton, mesh, boneName, config, bpm) {
    const bone = skeleton.bones.find((b) => b.name === `mixamorig:${boneName}`);
    if (!bone) {
      console.error(`Bone ${boneName} not found in skeleton`);
      return;
    }

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

    const bendAxisConfig = {
      x: config.bendAxis[0],
      y: config.bendAxis[1],
      z: config.bendAxis[2],
    };

    const ikController = new BABYLON.BoneIKController(mesh, bone, {
      targetMesh: target,
      poleTargetMesh: poleTarget,
      poleAngle: config.poleAngle.max,
      slerpAmount: config.slerpAmount,
      bendAxis: new BABYLON.Vector3(
        bendAxisConfig.x,
        bendAxisConfig.y,
        bendAxisConfig.z
      ),
    });

    // later delete. for gui.
    // if (bone.name === "mixamorig:LeftForeArm")
    //   this.storedIK = [ikController, poleTarget, target, bendAxisConfig];

    let relativePosition = new BABYLON.Vector3(
      config.targetPosition.x,
      config.targetPosition.y,
      config.targetPosition.z
    );

    var spineBone = skeleton.bones.find(
      (bone) => bone.name === "mixamorig:Spine1"
    );

    scene.registerBeforeRender(() => {
      ikController.update();

      var spinePosition = spineBone.getAbsolutePosition();

      target.position.x = spinePosition.x + relativePosition.x;
      target.position.y = relativePosition.y;
      target.position.z = spinePosition.z + relativePosition.z;
    });

    const updateRandomTargetPosition = () => {
      // calculate random pos
      let randomX = this.getRandomPosition(config.range.x);
      let randomY = this.getRandomPosition(config.range.y);
      let randomZ = this.getRandomPosition(config.range.z);

      // update relative pos
      relativePosition.x = randomX;
      relativePosition.y = randomY;
      relativePosition.z = randomZ;
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
    }, 60000 / bpm);
  }

  initializeBoneAnimations(scene, bpm) {
    for (const boneName in this.boneConfig) {
      this.setupBoneIK(
        scene,
        this.skeleton,
        this.mesh,
        boneName,
        this.boneConfig[boneName],
        bpm
      );
    }

    // if (this.storedIK && this.storedIK.length > 0) {
    //   var gui = new dat.GUI();
    //   gui.domElement.style.marginTop = "100px";
    //   gui.domElement.id = "datGUI";
    //   const ikController = this.storedIK[0];
    //   const poleTarget = this.storedIK[1];
    //   const target = this.storedIK[2];

    //   gui.add(ikController, "poleAngle", -Math.PI, Math.PI);
    //   gui.add(ikController, "maxAngle", 0, 2 * Math.PI);
    //   gui.add(poleTarget.position, "x", -100, 100).name("pole target x");
    //   gui.add(poleTarget.position, "y", -100, 100).name("pole target y");
    //   gui.add(poleTarget.position, "z", -100, 100).name("pole target z");
    //   gui.add(target.position, "x", -100, 100).name("target target x");
    //   gui.add(target.position, "y", -100, 100).name("target target y");
    //   gui.add(target.position, "z", -100, 100).name("target target z");
    // } else {
    //   console.warn("No IK controller stored for GUI setup.");
    // }
    // 나중에 없앨 gui
  }

  applyAnimationToModel(skeleton) {
    this.animationGroups.forEach((animationGroup) => {
      // 애니메이션 그룹의 각 애니메이션을 모델의 해당 본에 적용
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
    const beatsPerMinute = bpm;
    const speedRatio = beatsPerMinute / 60 / 1.7;
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
