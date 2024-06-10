export class NodeAnimator {
  constructor(scene) {
    this.scene = scene;
    this.nodes = {};
    this.poses = this.definePoses();
  }

  initializeNodes() {
    // 모든 필요한 노드를 사전에 찾아서 저장
    this.nodes = {
      hips: this.scene.getNodeByName("mixamorig:Hips"),
      rightUpLeg: this.scene.getNodeByName("mixamorig:RightUpLeg"),
      // 추가 노드 초기화
    };
  }

  definePoses() {
    // return [
    //   {
    //     "mixamorig:Hips": { rotation: new BABYLON.Vector3(Math.PI / 2, 0, 0) },
    //     "mixamorig:RightUpLeg": {
    //       rotation: new BABYLON.Vector3(0, Math.PI / 6, 0),
    //     },
    //     // 다른 노드 포즈 정의...
    //   },
    //   {
    //     "mixamorig:Hips": { rotation: new BABYLON.Vector3(-Math.PI / 2, 0, 0) },
    //     "mixamorig:RightUpLeg": {
    //       rotation: new BABYLON.Vector3(0, -Math.PI / 6, 0),
    //     },
    //     // 다른 포즈 정의...
    //   },
    //   // 추가 포즈...
    // ];
    // 각 노드에 대한 포즈 정의
    return [
      {
        hips: new BABYLON.Vector3(Math.PI / 2, 0, 0),
        rightUpLeg: new BABYLON.Vector3(0, Math.PI / 6, 0),
        // 기타 노드 포즈
      },
      {
        hips: new BABYLON.Vector3(-Math.PI / 2, 0, 0),
        rightUpLeg: new BABYLON.Vector3(0, -Math.PI / 6, 0),
        // 다른 포즈
      },
      // 추가 포즈 정의
    ];
  }

  applyRandomPose() {
    this.scene.debugLayer.show();

    // const pose = this.poses[Math.floor(Math.random() * this.poses.length)];

    // for (const nodeName in pose) {
    //   const node = this.scene.getNodeByName(nodeName);
    //   if (node) {
    //     const nodePose = pose[nodeName];
    //     node.rotation = nodePose.rotation;
    //     node.computeWorldMatrix(true);
    //     // 추가적인 위치, 크기 조정이 필요하다면 여기에 포함
    //   }
    // }

    const pose = this.poses[Math.floor(Math.random() * this.poses.length)];
    console.log("current pose: ", pose);
    Object.keys(pose).forEach((nodeName) => {
      const node = this.nodes[nodeName];
      if (node) {
        node.rotation = pose[nodeName];
        node.computeWorldMatrix(true);
      }
    });
  }

  startAnimation(bpm) {
    setInterval(() => this.applyRandomPose(), 1000);
  }
}
