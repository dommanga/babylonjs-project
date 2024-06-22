![image](https://github.com/dommanga/babylonjs-project/assets/87713631/ea7863f3-6f95-4fb4-9e93-2ae983b67ca9)



# Dance Animation with 3D Character 🎵

Welcome to the Dance Animation web application! This platform allows you to enjoy a 3D character dancing to music by uploading your own 3D model and audio files.

## 👍 Getting Started

### Prerequisites

Before you begin, make sure you have the following files ready:
- Node.js installed on your machine.
- A 3D model file in `.fbx` format.
- An audio file in `.mp3` format.
- Git installed to clone the repository.

### Installation and Local Setup

1. **Clone the Repository**: First, clone the repository to your local machine using:
   ```bash
   git clone https://github.com/dommanga/babylonjs-project.git
2. **Navigate to the Repository Directory**:
   ```bash
   cd babylonjs-project
4. **Install Dependencies**: Install the necessary Node.js packages:
   ```bash
   npm install
6. **Build the Application**:
   ```bash
   npm run build
8. **Start the Server**:
   ```bash
   npm start

This will start the local server, typically accessible via `http://localhost:3000` in your web browser.


### How to Use

After starting the server, follow these steps to use the application:

1. **Access the Application**: Open your web browser and go to `http://localhost:3000`.
2. **Upload Your Files**: Start by uploading your `.fbx` model and `.mp3` audio file using the designated upload fields on the webpage.
3. **Play Music**: After uploading, a music controller and the BPM of the music will be displayed. Use the controller to start playing your music.
4. **Enjoy the Animation**: Once the music starts, your 3D model will begin to dance in sync with the music. You can watch the animation in a fully interactive 3D environment.
5. **Interact with the 3D View**: Click and drag your mouse across the screen to explore different angles of the 3D animation.
6. **Reload for New Files**: If you want to change only the **music** for the same model, press the *stop button* to upload a new audio file. If you wish to upload different **model** files and restart the animation, simply *refresh* the page.

- **Model Acquisition**: You can obtain 3D models from [Mixamo](https://www.mixamo.com/), which offers a wide range of characters and animations.
- **Upload Time**: Please note that uploading larger models may take some time, so your patience is appreciated.

## 🌟 Features

- **User-Friendly Interface**: Simple and easy navigation.
- **Interactive 3D Animation**: Engage with the dancing model by rotating and zooming the view.
- **Dynamic Content**: Ability to load and animate different models and music.
- **Automatic BPM Analysis and Synchronization**: Automatically analyzes the BPM of the music to synchronize both the dance animations and the colorful stage lighting, ensuring that the movements and visual effects perfectly match the rhythm.

<div style="display: flex; justify-content: center; gap: 10px;">
  <img src="https://github.com/dommanga/babylonjs-project/assets/87713631/87639709-82a0-4d98-9c0d-dbd5922fa356" alt="GIF 1" width="300px"/>
  <img src="https://github.com/dommanga/babylonjs-project/assets/87713631/5a050a90-c7b4-4bdf-b640-eb923399d7cc" alt="GIF 2" width="300px"/>
  <img src="https://github.com/dommanga/babylonjs-project/assets/87713631/a3b50fe7-e92c-4fcb-923a-849b426ba055" alt="GIF 3" width="300px" />
</div>

## 📫 Support

If you encounter any issues or have questions, please feel free to contact me at [leejm21@postech.ac.kr](mailto:leejm21@postech.ac.kr).

---

## 📓 Write-up

This section is a brief write-up about development.

### Technical Approach

1. **Bundling and Server Setup**: The application utilizes Parcel for bundling files and leverages an Express server for its operations.
2. **Sound Playback**: Implements the HTML5 Audio API to handle sound playback.
3. **BPM Detection**: Uses a BPM detection library `web-audio-beat-detector` to extract beats per minute from the uploaded music tracks.
4. **Animation and Realism**: Employs Inverse Kinematics (IK) and limits joint ranges to create realistic movements of the model's joints. Targets for each joint are generated within a defined range randomly, and easing functions are used to smooth out the animations.

### Challenges Encountered

1. **Initial Dance Mechanism**: Initially, the project attempted to create dance movements by randomly setting rotation values for each joint, which resulted in unnatural and bizarre dance moves. It was challenging to understand that transformations should be applied to the model’s nodes, not the skeleton, which led to a switch to using Inverse Kinematics for more natural movements.
2. **Model Positioning**: The current implementation does not allow for the model's base position to change, i.e., the heaps remain fixed. This results in slightly unnatural dance movements. Implementing dynamic target positioning that reflects real-time changes in the model’s position proved to be complex.

### Potential Improvements

1. **Exporting Animations**: Adding functionality to export dance animations as GIFs or videos could enhance user interaction and sharing capabilities.
2. **Dynamic Positioning**: Enhancing the model’s base movement to shift positions naturally during the dance could lead to more realistic and fluid animations.

