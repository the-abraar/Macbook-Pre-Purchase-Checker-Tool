/**
 * Media Hardware Inspector: Stereo Speaker Separation, Live Mic Waveform & Camera
 */

export class MediaTester {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mediaStream = null;
    this.audioRecorder = null;
    this.audioChunks = [];
    this.cameraStream = null;
    this.audioCtx = null;
    this.analyser = null;
    this.animFrameId = null;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="media-test-grid">
        <!-- Audio & Microphone Tester -->
        <div class="media-card">
          <div class="media-header">
            <div class="media-icon-badge">🎙️</div>
            <div>
              <h4 style="font-size: 16px; font-weight: 700;">Microphone & Speaker Distortion Test</h4>
              <p class="media-desc">Record a 5-second voice sample to test mic clarity, and play it at 100% volume to check for rattling or blown speaker cones.</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
            <button type="button" class="btn btn-primary" id="btn-record-audio">
              🔴 Record 5s Voice Sample
            </button>
          </div>

          <canvas id="audio-visualizer" class="audio-visualizer-canvas"></canvas>
          <div id="audio-status" class="media-status-box" style="margin-bottom: 10px;">Ready to record. Click button and speak into the Mac.</div>
          <audio id="audio-player" class="audio-player hidden" controls></audio>

          <!-- Stereo Balance Panning Test -->
          <div style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 14px;">
            <h5 style="font-size: 13.5px; font-weight: 700; margin-bottom: 6px;">🔊 Stereo Channel Separation Test:</h5>
            <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 10px;">Blown speaker cones usually affect only one side. Test each channel independently:</p>
            <div class="speaker-controls">
              <button type="button" class="btn btn-secondary" id="btn-speaker-left">🔈 Left Only</button>
              <button type="button" class="btn btn-secondary" id="btn-speaker-right">🔉 Right Only</button>
              <button type="button" class="btn btn-secondary" id="btn-speaker-both">🔊 Both Stereo</button>
            </div>
          </div>
        </div>

        <!-- Camera Tester -->
        <div class="media-card">
          <div class="media-header">
            <div class="media-icon-badge">📷</div>
            <div>
              <h4 style="font-size: 16px; font-weight: 700;">FaceTime HD Camera Inspection</h4>
              <p class="media-desc">Test sensor sharpness, frame rate, and the green camera privacy LED without needing an Apple ID.</p>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
            <button type="button" class="btn btn-primary" id="btn-start-camera">
              🎥 Start Camera Preview
            </button>
            <button type="button" class="btn btn-outline hidden" id="btn-stop-camera">
              ⏹️ Stop Camera
            </button>
          </div>

          <div class="camera-preview-wrapper" id="camera-wrapper">
            <video id="camera-video" autoplay playsinline muted class="camera-video hidden"></video>
            <div id="camera-placeholder" class="camera-placeholder">
              Camera preview is off. Click button above to test.
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelector("#btn-record-audio")?.addEventListener("click", () => this.recordAudio());
    this.container.querySelector("#btn-speaker-left")?.addEventListener("click", () => this.playStereoTone(-1.0, "Left Speaker"));
    this.container.querySelector("#btn-speaker-right")?.addEventListener("click", () => this.playStereoTone(1.0, "Right Speaker"));
    this.container.querySelector("#btn-speaker-both")?.addEventListener("click", () => this.playStereoTone(0.0, "Both Speakers"));
    this.container.querySelector("#btn-start-camera")?.addEventListener("click", () => this.startCamera());
    this.container.querySelector("#btn-stop-camera")?.addEventListener("click", () => this.stopCamera());
  }

  async recordAudio() {
    const statusBox = this.container.querySelector("#audio-status");
    const recordBtn = this.container.querySelector("#btn-record-audio");
    const audioPlayer = this.container.querySelector("#audio-player");
    const canvas = this.container.querySelector("#audio-visualizer");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      statusBox.innerHTML = "<span class='text-danger'>❌ Audio recording not supported in this browser.</span>";
      return;
    }

    try {
      statusBox.innerHTML = "<span class='text-primary'>🎙️ Accessing microphone...</span>";
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;
      this.audioChunks = [];

      // AudioContext visualizer
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const canvasCtx = canvas.getContext("2d");
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawWaveform = () => {
        this.animFrameId = requestAnimationFrame(drawWaveform);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          canvasCtx.fillStyle = "#34c759";
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      };
      drawWaveform();

      this.audioRecorder = new MediaRecorder(stream);
      this.audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.audioRecorder.onstop = () => {
        cancelAnimationFrame(this.animFrameId);
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        audioPlayer.classList.remove("hidden");
        audioPlayer.play();
        statusBox.innerHTML = "<span class='text-success'>✅ Playing back recording at full volume! Listen for any blown cone buzzing, rattling, or distortion.</span>";
        recordBtn.disabled = false;
        recordBtn.textContent = "🔴 Record Another 5s Sample";

        stream.getTracks().forEach(t => t.stop());
        ctx.close();
      };

      this.audioRecorder.start();
      recordBtn.disabled = true;

      let countdown = 5;
      statusBox.innerHTML = `🔴 <strong>Recording... Speak into Mac now! (${countdown}s remaining)</strong>`;
      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          statusBox.innerHTML = `🔴 <strong>Recording... Speak into Mac now! (${countdown}s remaining)</strong>`;
        } else {
          clearInterval(interval);
          if (this.audioRecorder && this.audioRecorder.state === "recording") {
            this.audioRecorder.stop();
          }
        }
      }, 1000);

    } catch (err) {
      statusBox.innerHTML = `<span class='text-danger'>⚠️ Microphone access denied (${err.message}). Test via Voice Memos app instead.</span>`;
      recordBtn.disabled = false;
    }
  }

  playStereoTone(panValue, label) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(880, now + 0.3); // A5

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      // Stereo panner if supported
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(panValue, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.9);

      const statusBox = this.container.querySelector("#audio-status");
      if (statusBox) {
        statusBox.innerHTML = `<span class='text-success'>🔔 Playing tone on <strong>${label}</strong>. Listen for equal clarity and volume without vibration rattle.</span>`;
      }
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  }

  async startCamera() {
    const video = this.container.querySelector("#camera-video");
    const placeholder = this.container.querySelector("#camera-placeholder");
    const startBtn = this.container.querySelector("#btn-start-camera");
    const stopBtn = this.container.querySelector("#btn-stop-camera");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      placeholder.innerHTML = "<span class='text-danger'>Camera API not supported. Open Photo Booth app to test.</span>";
      return;
    }

    try {
      placeholder.innerHTML = "Accessing camera...";
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      this.cameraStream = stream;
      video.srcObject = stream;
      video.classList.remove("hidden");
      placeholder.classList.add("hidden");
      startBtn.classList.add("hidden");
      stopBtn.classList.remove("hidden");
    } catch (err) {
      placeholder.innerHTML = `<span class='text-danger'>⚠️ Camera access denied (${err.message}). Test directly in Photo Booth app.</span>`;
    }
  }

  stopCamera() {
    const video = this.container.querySelector("#camera-video");
    const placeholder = this.container.querySelector("#camera-placeholder");
    const startBtn = this.container.querySelector("#btn-start-camera");
    const stopBtn = this.container.querySelector("#btn-stop-camera");

    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(t => t.stop());
      this.cameraStream = null;
    }

    video.classList.add("hidden");
    placeholder.classList.remove("hidden");
    placeholder.innerHTML = "Camera preview stopped.";
    startBtn.classList.remove("hidden");
    stopBtn.classList.add("hidden");
  }
}
