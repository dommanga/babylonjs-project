import { SceneManager } from "./components/SceneManager";
import { FileUploader } from "./components/FileUploader";
import { AudioManager } from "./components/AudioManager";
import { NodeAnimator } from "./components/NodeAnimator";

window.addEventListener("DOMContentLoaded", () => {
  const sceneManager = new SceneManager("renderCanvas");
  sceneManager.loadAnimationFromGLB("", "animation_idle.glb");
  const nodeAnimator = new NodeAnimator(sceneManager.scene);
  const fileUploader = new FileUploader(sceneManager, nodeAnimator);
  const audioManager = new AudioManager(sceneManager, nodeAnimator);
});
