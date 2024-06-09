import { SceneManager } from "./components/SceneManager";
import { FileUploader } from "./components/FileUploader";
import { AudioManager } from "./components/AudioManager";

window.addEventListener("DOMContentLoaded", () => {
  const sceneManager = new SceneManager("renderCanvas");
  const fileUploader = new FileUploader(sceneManager);
  const audioManager = new AudioManager(sceneManager);
});

// document.getElementById("playButton").addEventListener("click", () => {
//   fileUploader.handleFileChange({
//     target: document.getElementById("fileInput"),
//   });
// });
