export class PsychedelicLighting {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.lights = [];
    this.colorChangeIntervals = [];
    this.flickeringIntervals = [];

    this.setupEventListeners();
    this.initLights();
  }

  setupEventListeners() {
    this.audioManager.playButton.addEventListener("click", () => {
      this.startColorChange(this.audioManager.bpm);
      this.startFlickering();
    });
    this.audioManager.pauseButton.addEventListener("click", () =>
      this.pauseLighting()
    );
    this.audioManager.stopButton.addEventListener("click", () => {
      this.pauseLighting();
      this.lights.forEach((light) => {
        light.intensity = 0;
      });
    });
  }

  initLights() {
    const positions = [
      new BABYLON.Vector3(0.3, 5, -5),
      new BABYLON.Vector3(0.5, 5, -5),
      new BABYLON.Vector3(-0.3, 5, -5),
      new BABYLON.Vector3(-0.5, 5, -5),
    ];

    positions.forEach((position, index) => {
      const light = new BABYLON.SpotLight(
        `psyLight${index}`,
        position,
        new BABYLON.Vector3(0, -1, 1),
        Math.PI / 2,
        80,
        this.scene
      );
      light.intensity = 1.0;
      light.diffuse = new BABYLON.Color3(0.1, 0.1, 0.1);
      light.specular = new BABYLON.Color3(1, 1, 1);
      this.lights.push(light);
    });
  }

  startColorChange(bpm) {
    let colors = [
      new BABYLON.Color3(1, 0, 0), // Red
      new BABYLON.Color3(0, 1, 0), // Green
      new BABYLON.Color3(0, 0, 1), // Blue
      new BABYLON.Color3(1, 1, 0), // Yellow
      new BABYLON.Color3(1, 0, 1), // Magenta
      new BABYLON.Color3(0, 1, 1), // Cyan
    ];

    this.lights.forEach((light, index) => {
      light.intensity = 1.0;
      const intervalId = setInterval(() => {
        let colorIndex =
          (index + Math.floor(Date.now() / 1000)) % colors.length;
        light.diffuse = colors[colorIndex];
        light.specular = colors[colorIndex];
      }, 60000 / bpm + index * 250);

      this.colorChangeIntervals.push(intervalId);
    });
  }

  startFlickering() {
    this.lights.forEach((light) => {
      let intensity = 1.0;
      const intervalId = setInterval(() => {
        intensity = intensity === 1.0 ? 0.5 : 1.0;
        light.intensity = intensity;
      }, 500); // Toggle intensity every half-second

      this.flickeringIntervals.push(intervalId);
    });
  }

  pauseLighting() {
    if (this.flickeringIntervals) {
      this.flickeringIntervals.forEach((interval) => clearInterval(interval));
      this.flickeringIntervals = [];
    }

    if (this.colorChangeIntervals) {
      this.colorChangeIntervals.forEach((interval) => clearInterval(interval));
      this.colorChangeIntervals = [];
    }
  }
}
