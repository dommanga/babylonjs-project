import { analyze } from "web-audio-beat-detector";

export class AudioManager {
  constructor(sceneManager, nodeAnimator) {
    this.sceneManager = sceneManager;
    this.soundInput = document.getElementById("soundInput");
    this.animator = nodeAnimator;
    this.bpm = 0;
    this.playButton = document.getElementById("playButton");
    this.pauseButton = document.getElementById("pauseButton");
    this.stopButton = document.getElementById("stopButton");
    this.audioContext = null;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.startTime = 0;
    this.pausedAt = 0;
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
      const reader = new FileReader();

      console.log("Uploading audio file...");

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
                console.log("Detected BPM:", bpm);
                this.bpm = bpm;
                document.getElementById(
                  "bpmDisplay"
                ).innerText = `Detected BPM: ${bpm}`;
                this.animator.initializeNodes();
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
      this.animator.startAnimation(this.bpm);

      console.log("Audio playing from:", this.pausedAt);
    }
  }

  pauseAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop(0);
      this.pausedAt = this.audioContext.currentTime - this.startTime;
      this.animator.pauseAnimation();

      console.log("Audio paused at:", this.pausedAt);
    }
  }

  stopAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop(0);
      this.sourceNode = null;
      this.pausedAt = 0;
      this.animator.stopAnimation();

      console.log("Audio stopped...");
    }
  }
}
