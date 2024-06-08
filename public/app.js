window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      2,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    return scene;
  };

  let scene = createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });

  const fileInput = document.getElementById("fileInput");

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file.name);

      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file...");

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("File uploaded, response received.");
          const fileUrl = data.filePath;
          console.log("File URL:", fileUrl);

          BABYLON.SceneLoader.ImportMeshAsync("", fileUrl, "", scene)
            .then((result) => {
              if (result.animationGroups.length > 0) {
                result.animationGroups[0].start(true);
              }

              if (result.meshes.length > 0) {
                const rootMesh = result.meshes[0];
                rootMesh.position = new BABYLON.Vector3(0, -0.7, 0);
                rootMesh.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
              }
            })
            .catch((error) => {
              console.error("Error loading model:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  });
});
