/**
 * Interactive MacBook Keyboard Matrix Inspector
 * Enhanced with audio feedback, tactile key response, and tricky keys verification.
 */

export const KEYBOARD_LAYOUT = [
  // Function row
  [
    { code: "Escape", label: "esc", width: 1.2 },
    { code: "F1", label: "F1 🔅", width: 1 },
    { code: "F2", label: "F2 🔆", width: 1 },
    { code: "F3", label: "F3 🪟", width: 1 },
    { code: "F4", label: "F4 🔍", width: 1 },
    { code: "F5", label: "F5 🎙️", width: 1 },
    { code: "F6", label: "F6 🌙", width: 1 },
    { code: "F7", label: "F7 ⏪", width: 1 },
    { code: "F8", label: "F8 ⏯️", width: 1 },
    { code: "F9", label: "F9 ⏩", width: 1 },
    { code: "F10", label: "F10 🔇", width: 1 },
    { code: "F11", label: "F11 🔉", width: 1 },
    { code: "F12", label: "F12 🔊", width: 1 },
    { code: "Power", label: "Touch ID", width: 1.2, special: true }
  ],
  // Number row
  [
    { code: "Backquote", label: "~\n`", width: 1 },
    { code: "Digit1", label: "!\n1", width: 1 },
    { code: "Digit2", label: "@\n2", width: 1 },
    { code: "Digit3", label: "#\n3", width: 1 },
    { code: "Digit4", label: "$\n4", width: 1 },
    { code: "Digit5", label: "%\n5", width: 1 },
    { code: "Digit6", label: "^\n6", width: 1 },
    { code: "Digit7", label: "&\n7", width: 1 },
    { code: "Digit8", label: "*\n8", width: 1 },
    { code: "Digit9", label: "(\n9", width: 1 },
    { code: "Digit0", label: ")\n0", width: 1 },
    { code: "Minus", label: "_\n-", width: 1 },
    { code: "Equal", label: "+\n=", width: 1 },
    { code: "Backspace", label: "delete", width: 1.5 }
  ],
  // QWERTY row
  [
    { code: "Tab", label: "tab", width: 1.5 },
    { code: "KeyQ", label: "Q", width: 1 },
    { code: "KeyW", label: "W", width: 1 },
    { code: "KeyE", label: "E", width: 1 },
    { code: "KeyR", label: "R", width: 1 },
    { code: "KeyT", label: "T", width: 1 },
    { code: "KeyY", label: "Y", width: 1 },
    { code: "KeyU", label: "U", width: 1 },
    { code: "KeyI", label: "I", width: 1 },
    { code: "KeyO", label: "O", width: 1 },
    { code: "KeyP", label: "P", width: 1 },
    { code: "BracketLeft", label: "{\n[", width: 1 },
    { code: "BracketRight", label: "}\n]", width: 1 },
    { code: "Backslash", label: "|\n\\", width: 1 }
  ],
  // ASDF row
  [
    { code: "CapsLock", label: "caps lock", width: 1.8 },
    { code: "KeyA", label: "A", width: 1 },
    { code: "KeyS", label: "S", width: 1 },
    { code: "KeyD", label: "D", width: 1 },
    { code: "KeyF", label: "F", width: 1 },
    { code: "KeyG", label: "G", width: 1 },
    { code: "KeyH", label: "H", width: 1 },
    { code: "KeyJ", label: "J", width: 1 },
    { code: "KeyK", label: "K", width: 1 },
    { code: "KeyL", label: "L", width: 1 },
    { code: "Semicolon", label: ":\n;", width: 1 },
    { code: "Quote", label: "\"\n'", width: 1 },
    { code: "Enter", label: "return", width: 1.8 }
  ],
  // ZXCV row
  [
    { code: "ShiftLeft", label: "shift", width: 2.3 },
    { code: "KeyZ", label: "Z", width: 1 },
    { code: "KeyX", label: "X", width: 1 },
    { code: "KeyC", label: "C", width: 1 },
    { code: "KeyV", label: "V", width: 1 },
    { code: "KeyB", label: "B", width: 1 },
    { code: "KeyN", label: "N", width: 1 },
    { code: "KeyM", label: "M", width: 1 },
    { code: "Comma", label: "<\n,", width: 1 },
    { code: "Period", label: ">\n.", width: 1 },
    { code: "Slash", label: "?\n/", width: 1 },
    { code: "ShiftRight", label: "shift", width: 2.3 }
  ],
  // Bottom modifier row
  [
    { code: "Fn", label: "fn 🌐", width: 1 },
    { code: "ControlLeft", label: "control ⌃", width: 1.2 },
    { code: "AltLeft", label: "option ⌥", width: 1.2 },
    { code: "MetaLeft", label: "command ⌘", width: 1.5 },
    { code: "Space", label: "space", width: 5 },
    { code: "MetaRight", label: "command ⌘", width: 1.5 },
    { code: "AltRight", label: "option ⌥", width: 1.2 },
    { code: "ArrowLeft", label: "◀", width: 1 },
    {
      code: "ArrowUpDown",
      isSplit: true,
      upCode: "ArrowUp",
      downCode: "ArrowDown",
      width: 1
    },
    { code: "ArrowRight", label: "▶", width: 1 }
  ]
];

export class KeyboardTester {
  constructor(containerId, statsId) {
    this.container = document.getElementById(containerId);
    this.statsElement = document.getElementById(statsId);
    this.testedKeys = new Set();
    this.keyElements = new Map();
    this.isActive = false;
    this.totalKeys = 0;
    this.soundEnabled = true;
    this.audioCtx = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.render();
  }

  playKeyClickSound() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";
    this.totalKeys = 0;

    KEYBOARD_LAYOUT.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "kb-row";

      row.forEach(keyDef => {
        if (keyDef.isSplit) {
          const splitDiv = document.createElement("div");
          splitDiv.className = "kb-split-vertical";
          splitDiv.style.flex = keyDef.width;

          const upKey = document.createElement("div");
          upKey.className = "kb-key kb-split-half";
          upKey.dataset.code = keyDef.upCode;
          upKey.textContent = "▲";
          this.keyElements.set(keyDef.upCode, upKey);
          this.totalKeys++;

          const downKey = document.createElement("div");
          downKey.className = "kb-key kb-split-half";
          downKey.dataset.code = keyDef.downCode;
          downKey.textContent = "▼";
          this.keyElements.set(keyDef.downCode, downKey);
          this.totalKeys++;

          splitDiv.appendChild(upKey);
          splitDiv.appendChild(downKey);
          rowDiv.appendChild(splitDiv);
        } else {
          const keyDiv = document.createElement("div");
          keyDiv.className = "kb-key";
          if (keyDef.special) keyDiv.classList.add("special-touchid");
          keyDiv.dataset.code = keyDef.code;
          keyDiv.style.flex = keyDef.width;

          const lines = keyDef.label.split("\n");
          if (lines.length > 1) {
            keyDiv.innerHTML = `<span>${lines[0]}</span><span>${lines[1]}</span>`;
          } else {
            keyDiv.textContent = keyDef.label;
          }

          // Clickable simulation for mouse testing as well
          keyDiv.addEventListener("mousedown", () => {
            keyDiv.classList.add("active", "tested");
            this.testedKeys.add(keyDef.code);
            this.playKeyClickSound();
            this.updateStats();
          });
          keyDiv.addEventListener("mouseup", () => keyDiv.classList.remove("active"));

          this.keyElements.set(keyDef.code, keyDiv);
          this.totalKeys++;
          rowDiv.appendChild(keyDiv);
        }
      });

      this.container.appendChild(rowDiv);
    });

    this.updateStats();
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    window.addEventListener("keydown", this.handleKeyDown, { passive: false });
    window.addEventListener("keyup", this.handleKeyUp, { passive: false });
  }

  stop() {
    this.isActive = false;
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  reset() {
    this.testedKeys.clear();
    this.keyElements.forEach(el => {
      el.classList.remove("active", "tested");
    });
    this.updateStats();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  handleKeyDown(e) {
    if (!this.container || this.container.offsetParent === null) return;

    // Prevent default browser shortcuts to avoid closing/reloading
    if (["Tab", "Space", "AltLeft", "AltRight"].includes(e.code)) {
      e.preventDefault();
    }
    if ((e.metaKey || e.ctrlKey) && ["KeyR", "KeyW", "KeyQ", "KeyT"].includes(e.code)) {
      e.preventDefault();
    }

    const code = e.code;
    const el = this.keyElements.get(code);

    if (el) {
      el.classList.add("active");
      el.classList.add("tested");
      this.testedKeys.add(code);
      this.playKeyClickSound();
      this.updateStats();
    }
  }

  handleKeyUp(e) {
    const code = e.code;
    const el = this.keyElements.get(code);
    if (el) {
      el.classList.remove("active");
    }
  }

  updateStats() {
    if (!this.statsElement) return;
    const count = this.testedKeys.size;
    const pct = Math.round((count / this.totalKeys) * 100);
    this.statsElement.innerHTML = `
      <span class="stat-badge">Tested: <strong>${count} / ${this.totalKeys} keys</strong> (${pct}%)</span>
      ${pct === 100 ? "<span class='stat-badge success'>🎉 All 78 Keys Passed!</span>" : ""}
    `;
  }
}
