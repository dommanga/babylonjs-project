import { analyze } from "web-audio-beat-detector";

export class AudioManager {
  constructor(sceneManager, nodeAnimator) {
    this.sceneManager = sceneManager;
    this.animator = nodeAnimator;
    this.soundInput = document.getElementById("soundInput");
    this.bpm = null;
    this.playButton = document.getElementById("playButton");
    this.pauseButton = document.getElementById("pauseButton");
    this.stopButton = document.getElementById("stopButton");
    this.audioContext = null;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.startTime = 0;
    this.pausedAt = 0;
    this.stopped = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.soundInput.addEventListener("change", (event) =>
      this.handleAudioUpload(event)
    );
    this.playButton.addEventListener("click", () => this.playAudio());
    this.pauseButton.addEventListener("click", () => this.pauseAudio());
    this.stopButton.addEventListener("click", () => this.stopAudio());
  }

  handleAudioUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      let fileName = file.name;

      console.log("Uploading audio file...");

      // extract song's title only
      this.extractSongTitle(fileName);
      this.disableSoundUploadButtion();
      this.setUIwBpm(false);

      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        }
        this.audioContext.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            this.audioBuffer = buffer;
            console.log("Audio file loaded successfully.");

            analyze(this.audioBuffer)
              .then((bpm) => {
                this.bpm = Math.round(bpm);
                this.animator.setAnimationSpeed(this.bpm);
                this.setUIwBpm(true);
              })
              .catch((err) => {
                console.error("Error analyzing BPM:", error);
              });
          },
          (error) => {
            console.error("Error decoding audio file:", error);
          }
        );
      };
      reader.readAsArrayBuffer(file);
    }
  }

  extractSongTitle(fileName) {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex > 0) {
      fileName = fileName.substring(0, lastDotIndex);
    }
    document.getElementById("musicUploadStatus").innerText = fileName;
  }

  disableSoundUploadButtion() {
    const sound_button = document.querySelector(".sound-button");
    sound_button.style.filter = "brightness(0.5)";
    sound_button.disabled = true;
  }

  enableSoundUploadButtion() {
    const sound_button = document.querySelector(".sound-button");
    sound_button.style.filter = "brightness(1)";
    sound_button.disabled = false;
  }

  setUIwBpm(enable) {
    if (enable) {
      document.getElementById(
        "bpmDisplay"
      ).innerText = `Detected BPM: ${this.bpm}`;
      document.querySelector(".music-controls").style.display = "flex";
    } else {
      document.getElementById("bpmDisplay").innerText = `detecting...`;
      document.querySelector(".music-controls").style.display = "none";
    }
  }

  playAudio() {
    if (this.audioBuffer) {
      if (this.sourceNode) {
        this.sourceNode.stop(0);
      }

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start(0, this.pausedAt);
      this.startTime = this.audioContext.currentTime - this.pausedAt;

      this.disableSoundUploadButtion();

      if (this.pausedAt > 0 || this.stopped) {
        this.animator.resumeAnimation();
        console.log("Audio resumed from:", this.pausedAt);
      } else {
        this.animator.startAnimation(); // set new IK
        console.log("Audio playing from start");
      }
    }
  }

  pauseAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop(0);
      this.pausedAt = this.audioContext.currentTime - this.startTime;
      this.animator.pauseAnimation();

      this.disableSoundUploadButtion();

      console.log("Audio paused at:", this.pausedAt);
    }
  }

  stopAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop(0);
      this.sourceNode = null;
      this.pausedAt = 0;
      this.stopped = true;
      this.animator.stopAnimation();

      this.enableSoundUploadButtion();

      console.log("Audio stopped...");
    }
  }
}
