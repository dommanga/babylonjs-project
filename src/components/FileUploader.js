export class FileUploader {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.fileInput = document.getElementById("fileInput");
    this.fileInput.addEventListener("change", (event) =>
      this.handleFileChange(event)
    );
  }

  handleFileChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
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

              this.sceneManager.linkBonesToNodes(result.skeletons[0]);

              this.sceneManager.addMesh(result.meshes[0]);
              // this.sceneManager.scene.debugLayer.show();
            })
            .catch((error) => console.error("Error loading model:", error))
        )
        .catch((error) => console.error("Error uploading file:", error));
    }
  }
}
