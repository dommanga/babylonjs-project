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
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file...");

      const overlay = document.getElementById("loadingOverlay");
      this.disableFileUploadButtion();
      this.showLoadingIndicator(overlay);

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
              this.hideLoadingIndicator(overlay);

              this.animator.storeModelData2Animator(
                result.meshes[0],
                result.skeletons[0]
              );
              this.animator.applyStoredAnimationToModel(
                result,
                this.sceneManager.storedAnimations
              );
              this.sceneManager.addMesh(result.meshes[0]);
            })
            .catch((error) => {
              console.error("Error loading model:", error);
              this.hideLoadingIndicator(overlay);
            })
        )
        .catch((error) => {
          console.error("Error uploading file:", error);
          this.hideLoadingIndicator(overlay);
        });
    }
  }

  disableFileUploadButtion() {
    const file_button = document.querySelector(".file-button");
    file_button.style.filter = "brightness(0.5)";
    file_button.disabled = true;
  }

  showLoadingIndicator(overlay) {
    overlay.style.display = "flex";
    overlay.style.visibility = "visible";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
      });
    });
  }

  hideLoadingIndicator(overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.style.visibility = "hidden";
    }, 300);
  }
}
