export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.skeleton = null;
    this.animationGroups = [];
    this.boneConfig = this.defineBoneConfigs();
    this.initialPose = {};
    this.intervalId = null;
    this.bpm = null;
  }

  storeModelData(mesh, skeleton) {
    this.mesh = mesh;
    this.skeleton = skeleton;
  }

  defineBoneConfigs() {
    return {
      Neck: {
        targetPosition: { x: 0, y: 3, z: 1 },
        poleTargetPosition: { x: 3, y: 5, z: 3 },
        poleAngle: { min: -2.5, max: -2.5 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.3, max: 0.3 },
          y: { min: 2, max: 3 },
          z: { min: -0.2, max: 0.3 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
      Spine1: {
        targetPosition: { x: 0, y: 2, z: 1 },
        poleTargetPosition: { x: 3, y: 5, z: 3 },
        poleAngle: { min: -2.6, max: -2.4 },
        slerpAmount: 0.3,
        range: {
          x: { min: -0.3, max: 0.3 },
          y: { min: 1.5, max: 2 },
          z: { min: -0.1, max: 0.1 },
        },
        bendAxis: { x: -1, y: 0, z: 0 },
      },
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
      LeftLeg: {
        targetPosition: { x: 0.1, y: 0, z: 0 },
        poleTargetPosition: { x: 0, y: 2, z: 5 },
        poleAngle: { min: -1.7, max: -1.3 },
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
        poleAngle: { min: -1.4, max: -0.9 },
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
      poleAngle: config.poleAngle.max,
      slerpAmount: config.slerpAmount,
      bendAxis: new BABYLON.Vector3(
        config.bendAxis.x,
        config.bendAxis.y,
        config.bendAxis.z
      ),
    });

    let currentTargetPosition = new BABYLON.Vector3();
    let newTargetPosition = new BABYLON.Vector3();
    let currentPoleAngle = ikController.poleAngle;
    let newPoleAngle = this.getRandomPoleAngle(config.poleAngle);

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
        ikController.poleAngle = BABYLON.Scalar.Lerp(
          currentPoleAngle,
          newPoleAngle,
          easingFunction_sin(progress)
        );
        if (progress >= 1) {
          isTransitioning = false;
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

      isTransitioning = true;
      transitionStartTime = Date.now();
    };

    const updatePoleAngle = () => {
      newPoleAngle = this.getRandomPoleAngle(config.poleAngle);
      transitionStartTime = Date.now();
      isTransitioning = true;
    };

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
