export class FileUploader {
  constructor(sceneManager, nodeAnimator) {
    this.sceneManager = sceneManager;
    this.animator = nodeAnimator;
    this.fileInput = document.getElementById("fileInput");
    this.fileInput.addEventListener("change", (event) =>
      this.handleFileChange(event)
    );
  }

  handleFileChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      document.querySelector(".file-button").style.filter = "brightness(0.5)";

      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file...");
      fetch("/upload", { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) =>
          BABYLON.SceneLoader.ImportMeshAsync(
            "",
            data.filePath,
            "",
            this.sceneManager.getScene()
          )
            .then((result) => {
              if (result.animationGroups.length > 0) {
                console.log("base animation stop.");
                result.animationGroups.forEach((group) => group.stop());
              }
              const mesh = result.meshes[0];
              const skeleton = result.skeletons[0];

              this.sceneManager.addMesh(mesh);

              this.sceneManager.linkBonesToNodes(skeleton);
              this.animator.initializeNodes(mesh, skeleton); // 나중에 이름 바꾸기!! - 노드는 안쓸거니까 아마??

              // 이코드 나중에 animator 안의 함수 쓰는걸로 바꾸기..!!! (클래스 안의 변수는 클래스 메소드로 바꾸자)
              this.animator.animationGroups =
                this.sceneManager.storedAnimations;
              this.animator.applyAnimationToModel(skeleton);

              // this.sceneManager.scene.debugLayer.show();
            })
            .catch((error) => console.error("Error loading model:", error))
        )
        .catch((error) => console.error("Error uploading file:", error));
    }
  }
}
