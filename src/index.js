import { SceneManager } from "./components/SceneManager";
import { FileUploader } from "./components/FileUploader";
import { AudioManager } from "./components/AudioManager";
import { NodeAnimator } from "./components/NodeAnimator";

window.addEventListener("DOMContentLoaded", () => {
  const sceneManager = new SceneManager("renderCanvas");
  const fileUploader = new FileUploader(sceneManager);
  const nodeAnimator = new NodeAnimator(sceneManager.scene);
  const audioManager = new AudioManager(sceneManager, nodeAnimator);
});

// document.getElementById("playButton").addEventListener("click", () => {
//   fileUploader.handleFileChange({
//     target: document.getElementById("fileInput"),
//   });
// });
