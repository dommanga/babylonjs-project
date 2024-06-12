export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.skeleton = null;
    this.animationGroups = [];
    this.bpm = null;
    this.boneConfig = this.defineBoneConfigs();
    this.ikControllers = {};
    this.isGlobalTransitioning = false;
  }

  storeModelData2Animator(mesh, skeleton) {
    this.mesh = mesh;
    this.skeleton = skeleton;
  }

  applyStoredAnimationToModel(storedAnimations) {
    this.animationGroups = storedAnimations;
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
        poleAngle: { min: -1.6, max: -1.6 },
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
          y: { min: 1.1, max: 1.4 },
          z: { min: -0.3, max: 0 },
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
          y: { min: 1.1, max: 1.4 },
          z: { min: -0.3, max: 0 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      LeftForeArm: {
        targetPosition: { x: 1, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 3, z: 5 },
        poleAngle: { min: -0.6, max: 0.6 },
        slerpAmount: 0.3,
        range: {
          x: { min: 0.4, max: 0.8 },
          y: { min: 0.7, max: 1.7 },
          z: { min: -0.5, max: 0 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      RightForeArm: {
        targetPosition: { x: -1, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 7, z: 1 },
        poleAngle: { min: 1.2, max: 2.8 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.8, max: -0.4 },
          y: { min: 0.7, max: 1.7 },
          z: { min: -0.5, max: 0 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      LeftHand: {
        targetPosition: { x: 2, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 3, z: 5 },
        poleAngle: { min: -0.3, max: 0.3 },
        slerpAmount: 0.3,
        range: {
          x: { min: 0.8, max: 1 },
          y: { min: 0.7, max: 2 },
          z: { min: 0, max: 0.7 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      RightHand: {
        targetPosition: { x: -2, y: 1.55, z: 0 },
        poleTargetPosition: { x: 0, y: 7, z: 1 },
        poleAngle: { min: 1.5, max: 2.5 },
        slerpAmount: 0.3,
        range: {
          x: { min: -1, max: -0.8 },
          y: { min: 0.7, max: 2 },
          z: { min: 0, max: 0.7 },
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

  //------------------------------------------------//
  //------------* For setupBoneIK func *------------//
  //------------------------------------------------//
  getRandomPosition(range) {
    return Math.random() * (range.max - range.min) + range.min;
  }
  getRandomPoleAngle(angle) {
    return Math.random() * (angle.max - angle.min) + angle.min;
  }

  createTargetMesh(scene, boneName, config) {
    const target = BABYLON.MeshBuilder.CreateSphere(
      `ikTarget_${boneName}`,
      { diameter: 0.1 },
      scene
    );
    target.position = new BABYLON.Vector3(
      config.targetPosition.x,
      config.targetPosition.y,
      config.targetPosition.z
    );
    target.setEnabled(false);
    return target;
  }

  createPoleTargetMesh(scene, boneName, config) {
    const poleTarget = BABYLON.MeshBuilder.CreateSphere(
      `poleTarget_${boneName}`,
      { diameter: 0.1 },
      scene
    );
    poleTarget.position = new BABYLON.Vector3(
      config.poleTargetPosition.x,
      config.poleTargetPosition.y,
      config.poleTargetPosition.z
    );
    poleTarget.setEnabled(false);
    return poleTarget;
  }

  setupIKController(mesh, bone, target, poleTarget, config) {
    return new BABYLON.BoneIKController(mesh, bone, {
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
  }

  registerAnimationUpdates(scene, ikController, target, config, bpm) {
    let currentTargetPosition = new BABYLON.Vector3();
    let newTargetPosition = new BABYLON.Vector3();
    let currentPoleAngle = ikController.poleAngle;
    let newPoleAngle = this.getRandomPoleAngle(config.poleAngle);

    let isLocalTransitioning = false;
    let transitionStartTime = 0;
    const transitionDuration = 60000 / bpm;

    const updateRandomTargetPosition = () => {
      currentTargetPosition.copyFrom(target.position);
      var spinePosition = target.parent.getAbsolutePosition();
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
      isLocalTransitioning = true;
      transitionStartTime = Date.now();
    };

    setInterval(() => {
      updateRandomTargetPosition();
      updatePoleAngle();
    }, transitionDuration);

    const easingFunction = (t) => t * t * (3 - 2 * t);
    const easingFunction_sin = (t) => 0.5 - Math.cos(t * Math.PI) / 2;

    scene.registerBeforeRender(() => {
      ikController.update();
      if (isLocalTransitioning && this.isGlobalTransitioning) {
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
  }

  //------------------------------------------------//
  //-----------------* setupBoneIK *----------------//
  //------------------------------------------------//
  setupBoneIK(scene, skeleton, mesh, boneName, config, bpm) {
    const bone = skeleton.bones.find((b) => b.name === `mixamorig:${boneName}`);
    const target = this.createTargetMesh(scene, boneName, config);
    const poleTarget = this.createPoleTargetMesh(scene, boneName, config);

    target.parent = mesh;
    poleTarget.parent = mesh;

    const ikController = this.setupIKController(
      mesh,
      bone,
      target,
      poleTarget,
      config
    );
    this.ikControllers[boneName] = ikController;

    this.registerAnimationUpdates(scene, ikController, target, config, bpm);
  }

  // Random movements
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
  }

  startAnimation() {
    this.animationGroups.forEach((group) => {
      group.play(true);
      console.log("Animation group started:", group.name);
    });

    if (this.mesh && this.skeleton) {
      this.initializeBoneAnimations();
      this.isGlobalTransitioning = true;
    }
  }

  pauseAnimation() {
    this.animationGroups.forEach((group) => {
      group.pause();
    });

    this.isGlobalTransitioning = false;
  }

  resumeAnimation() {
    this.animationGroups.forEach((group) => {
      if (group.paused) {
        group.play(false);
      } else {
        group.play(true); // group was stopped.
        console.log("Group was stopped");
      }
    });

    this.isGlobalTransitioning = true;
    console.log("Animation resumed");
  }

  stopAnimation() {
    this.animationGroups.forEach((group) => {
      group.stop();
    });

    this.resetToInitialPose();
    this.isGlobalTransitioning = false;
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
