export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.skeleton = null;
    this.animationGroups = [];
    this.boneConfig = this.defineBoneConfigs();
    this.ikControllers = {};
    this.initialPose = {};
    this.isTransitioning = false;
    this.intervalId = null;
    this.bpm = null;
    document.addEventListener("fileUploaded", () => this.setFileReady());
    document.addEventListener("bpmDetected", () => this.setBpmReady());
    this.fileReady = false;
    this.bpmReady = false;
  }

  setFileReady() {
    this.fileReady = true;
    this.checkDataReady_setIK();
  }

  setBpmReady() {
    this.bpmReady = true;
    this.checkDataReady_setIK();
  }

  checkDataReady_setIK() {
    if (this.fileReady && this.bpmReady) {
      console.log("model and bpm are both ready.");
      this.initializeBoneAnimations();
    }
  }

  storeModelData(mesh, skeleton) {
    this.mesh = mesh;
    this.skeleton = skeleton;
  }

  defineBoneConfigs() {
    return {
      Neck: {
        targetPosition: { x: 0, y: 5, z: 0 },
        poleTargetPosition: { x: 0, y: 5, z: 3 },
        poleAngle: { min: -1.6, max: -1.6 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.3, max: 0.3 },
          y: { min: 2, max: 3 },
          z: { min: -0.2, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      Spine1: {
        targetPosition: { x: 0, y: 5, z: 0 },
        poleTargetPosition: { x: 0, y: 5, z: 3 },
        poleAngle: { min: -1.6, max: -1.6 }, // min 2.6 도 가능할듯
        slerpAmount: 0.3,
        range: {
          x: { min: -0.3, max: 0.3 },
          y: { min: 1.5, max: 2 },
          z: { min: -0.1, max: 0.1 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      LeftArm: {
        targetPosition: { x: 1, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 0, z: 5 },
        poleAngle: { min: -0.4, max: 0.4 },
        slerpAmount: 0.3,
        range: {
          x: { min: 1, max: 1 },
          y: { min: 1.3, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      RightArm: {
        targetPosition: { x: -1, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 7, z: 1 },
        poleAngle: { min: 1.0, max: 2.1 },
        slerpAmount: 0.3,
        range: {
          x: { min: -1, max: -1 },
          y: { min: 1.3, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      LeftForeArm: {
        targetPosition: { x: 1, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 3, z: 5 },
        poleAngle: { min: -0.6, max: 0.6 },
        slerpAmount: 0.3,
        range: {
          x: { min: 0.3, max: 0.8 },
          y: { min: 0.7, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      RightForeArm: {
        targetPosition: { x: -1, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 7, z: 1 },
        poleAngle: { min: 1.2, max: 2.8 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.8, max: -0.3 },
          y: { min: 0.7, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      LeftHand: {
        targetPosition: { x: 2, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 3, z: 5 },
        poleAngle: { min: -0.6, max: 0.6 },
        slerpAmount: 0.3,
        range: {
          x: { min: 0.8, max: 2 },
          y: { min: 0.7, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      RightHand: {
        targetPosition: { x: -2, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 7, z: 1 },
        poleAngle: { min: 1.2, max: 2.8 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.8, max: -2 },
          y: { min: 0.7, max: 2 },
          z: { min: -0.3, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      LeftLeg: {
        targetPosition: { x: 0.1, y: 0, z: 0 },
        poleTargetPosition: { x: 0, y: 2, z: 5 },
        poleAngle: { min: -2.0, max: -1.2 },
        slerpAmount: 0.3,
        range: {
          x: { min: 0.1, max: 0.2 },
          y: { min: 0, max: 0.5 },
          z: { min: -0.2, max: 0.2 },
        },
        bendAxis: { x: 1, y: 0, z: 0 },
      },
      RightLeg: {
        targetPosition: { x: -0.1, y: 0, z: 0 },
        poleTargetPosition: { x: 0, y: 2, z: 5 },
        poleAngle: { min: -1.9, max: -1.1 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.2, max: -0.1 },
          y: { min: 0, max: 0.5 },
          z: { min: -0.2, max: 0.2 },
        },
        bendAxis: { x: 1, y: 0, z: 0 },
      },
    };
  }

  getIKController(boneName) {
    return this.ikControllers[boneName];
  }

  getRandomPosition(range) {
    return Math.random() * (range.max - range.min) + range.min;
  }
  getRandomPoleAngle(angle) {
    return Math.random() * (angle.max - angle.min) + angle.min;
  }

  setupBoneIK(scene, skeleton, mesh, boneName, config, bpm) {
    const bone = skeleton.bones.find((b) => b.name === `mixamorig:${boneName}`);

    var spineBone = skeleton.bones.find(
      (bone) => bone.name === "mixamorig:Spine1"
    );

    const easingFunction = (t) => t * t * (3 - 2 * t);
    const easingFunction_sin = (t) => 0.5 - Math.cos(t * Math.PI) / 2;

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
    target.setEnabled(true);
    poleTarget.setEnabled(true);

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
      poleAngle: (config.poleAngle.max + config.poleAngle.min) / 2,
      slerpAmount: config.slerpAmount,
      bendAxis: new BABYLON.Vector3(
        config.bendAxis.x,
        config.bendAxis.y,
        config.bendAxis.z
      ),
    });

    this.ikControllers[boneName] = ikController;

    let currentTargetPosition = new BABYLON.Vector3();
    let newTargetPosition = new BABYLON.Vector3();
    let currentPoleAngle = ikController.poleAngle;
    let newPoleAngle = this.getRandomPoleAngle(config.poleAngle);

    let isLocalTransitioning = false;
    let transitionStartTime = 0;
    const transitionDuration = 60000 / bpm;

    scene.registerBeforeRender(() => {
      ikController.update();
      if (isLocalTransitioning && this.isTransitioning) {
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
        ikController.poleAngle = BABYLON.Scalar.Lerp(
          currentPoleAngle,
          newPoleAngle,
          easingFunction_sin(progress)
        );
        if (progress >= 1) {
          isLocalTransitioning = false;
          currentPoleAngle = newPoleAngle;
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

      isLocalTransitioning = true;
      transitionStartTime = Date.now();
    };

    const updatePoleAngle = () => {
      newPoleAngle = this.getRandomPoleAngle(config.poleAngle);
      transitionStartTime = Date.now();
      isLocalTransitioning = true;
    };

    this.intervalId = setInterval(() => {
      updateRandomTargetPosition();
      updatePoleAngle();
    }, transitionDuration);
  }

  initializeBoneAnimations() {
    for (const boneName in this.boneConfig) {
      this.setupBoneIK(
        this.scene,
        this.skeleton,
        this.mesh,
        boneName,
        this.boneConfig[boneName],
        this.bpm
      );
    }
    if (this.ikControllers) {
      const boneName = "RightArm"; //// modify

      var gui = new dat.GUI();
      gui.domElement.style.marginTop = "100px";
      gui.domElement.id = "datGUI";
      const ikController = this.ikControllers[boneName];
      const poleTarget = ikController.poleTargetMesh;
      const target = ikController.targetMesh;
      gui.add(ikController, "poleAngle", -Math.PI, Math.PI);
      gui.add(ikController, "maxAngle", 0, 2 * Math.PI);
      gui.add(poleTarget.position, "x", -100, 100).name("pole target x");
      gui.add(poleTarget.position, "y", -100, 100).name("pole target y");
      gui.add(poleTarget.position, "z", -100, 100).name("pole target z");
      gui.add(target.position, "x", -100, 100).name("target target x");
      gui.add(target.position, "y", -100, 100).name("target target y");
      gui.add(target.position, "z", -100, 100).name("target target z");
    } else {
      console.warn("No IK controller stored for GUI setup.");
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

    this.isTransitioning = true; // 변수 이름 좀더 이해되는걸로 ㅏㅂ꿔야할수도? global 임
  }

  pauseAnimation() {
    this.animationGroups.forEach((group) => {
      group.pause();
    });
    // clearInterval(this.intervalId);
    this.isTransitioning = false;
    // this.intervalId = null;
  }

  resumeAnimation() {
    this.animationGroups.forEach((group) => {
      if (group.paused) {
        group.play(false);
      }
    });
    this.isTransitioning = true;
    console.log("Animation resumed");
  }

  stopAnimation() {
    this.animationGroups.forEach((group) => {
      group.stop();
    });
    this.resetToInitialPose();
    // clearInterval(this.intervalId);
    this.isTransitioning = false;
    // this.intervalId = null;
  }

  resetToInitialPose() {
    for (const boneName in this.boneConfig) {
      let ikController = this.getIKController(boneName);
      if (ikController) {
        const config = this.boneConfig[boneName];
        ikController.targetMesh.position = new BABYLON.Vector3(
          config.targetPosition.x,
          config.targetPosition.y,
          config.targetPosition.z
        );
        ikController.poleTargetMesh.position = new BABYLON.Vector3(
          config.poleTargetPosition.x,
          config.poleTargetPosition.y,
          config.poleTargetPosition.z
        );
        ikController.poleAngle =
          (config.poleAngle.max + config.poleAngle.min) / 2;
        ikController.update();
      }
    }
  }
}
