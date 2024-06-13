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

      // disable file uploading button
      const file_button = document.querySelector(".file-button");
      file_button.style.filter = "brightness(0.5)";
      file_button.disabled = true;

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

              this.sceneManager.addMesh(result.meshes[0]);

              this.animator.storeModelData2Animator(
                result.meshes[0],
                result.skeletons[0]
              );

              this.animator.applyStoredAnimationToModel(
                this.sceneManager.storedAnimations
              );
            })
            .catch((error) => console.error("Error loading model:", error))
        )
        .catch((error) => console.error("Error uploading file:", error));
    }
  }
}
