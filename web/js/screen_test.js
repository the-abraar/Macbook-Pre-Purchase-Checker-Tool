/**
 * Fullscreen Display Uniformity & Dead Pixel Checker
 */

export const SCREEN_COLORS = [
  {
    name: "Pure White (1/6)",
    bg: "#ffffff",
    textColor: "#000000",
    checkText: "Look for: Black dead pixels, uneven yellow/pink tint, and bottom 'stage lighting' shadows."
  },
  {
    name: "Pure Black (2/6)",
    bg: "#000000",
    textColor: "#ffffff",
    checkText: "Look for: Backlight bleed along edges, stuck bright sub-pixels, and Mini-LED blooming."
  },
  {
    name: "Pure Red (3/6)",
    bg: "#ff0000",
    textColor: "#ffffff",
    checkText: "Look for: Dead red sub-pixels (black dots) or stuck opposing sub-pixels."
  },
  {
    name: "Pure Green (4/6)",
    bg: "#00ff00",
    textColor: "#000000",
    checkText: "Look for: Dead green sub-pixels (green is the easiest color to spot micro-defects)."
  },
  {
    name: "Pure Blue (5/6)",
    bg: "#0000ff",
    textColor: "#ffffff",
    checkText: "Look for: Dead blue sub-pixels."
  },
  {
    name: "50% Neutral Gray (6/6)",
    bg: "#808080",
    textColor: "#ffffff",
    checkText: "Look for: Uniformity banding, cloudy dirty screen effect (DSE), or pressure marks."
  }
];

export class ScreenTester {
  constructor(overlayId) {
    this.overlay = document.getElementById(overlayId);
    this.currentIndex = 0;
    this.hudTimeout = null;
    this.isActive = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.initOverlay();
  }

  initOverlay() {
    if (!this.overlay) return;
    this.overlay.innerHTML = `
      <div id="screen-test-hud" class="screen-test-hud">
        <div class="hud-badge" id="hud-badge">Pure White (1/6)</div>
        <p class="hud-desc" id="hud-desc">Look for: Black dead pixels, yellow tint, and stage lighting.</p>
        <div class="hud-instructions">
          <span class="key-tag">Space</span> or <span class="key-tag">Click</span> to cycle • 
          <span class="key-tag">F</span> Fullscreen • 
          <span class="key-tag">Esc</span> Exit
        </div>
        <button type="button" class="btn-exit-test" id="btn-exit-screen-test">✕ Close Tester</button>
      </div>
    `;

    document.getElementById("btn-exit-screen-test")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.exit();
    });
  }

  start() {
    if (!this.overlay) return;
    this.overlay.classList.add("active");
    this.isActive = true;
    this.currentIndex = 0;

    // Try requesting fullscreen
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    window.addEventListener("click", this.handleClick);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("mousemove", this.handleMouseMove);

    this.updateColor();
  }

  exit() {
    if (!this.isActive) return;
    this.isActive = false;
    this.overlay?.classList.remove("active");

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    window.removeEventListener("click", this.handleClick);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("mousemove", this.handleMouseMove);
  }

  updateColor() {
    if (!this.overlay) return;
    const current = SCREEN_COLORS[this.currentIndex];
    this.overlay.style.backgroundColor = current.bg;

    const hud = document.getElementById("screen-test-hud");
    const badge = document.getElementById("hud-badge");
    const desc = document.getElementById("hud-desc");

    if (badge) badge.textContent = current.name;
    if (desc) desc.textContent = current.checkText;

    if (hud) {
      hud.style.opacity = "1";
      clearTimeout(this.hudTimeout);
      this.hudTimeout = setTimeout(() => {
        hud.style.opacity = "0";
      }, 3000);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % SCREEN_COLORS.length;
    this.updateColor();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + SCREEN_COLORS.length) % SCREEN_COLORS.length;
    this.updateColor();
  }

  handleClick(e) {
    if (e.target.closest("#btn-exit-screen-test")) return;
    this.next();
  }

  handleKeyDown(e) {
    if (e.code === "Space" || e.code === "ArrowRight") {
      e.preventDefault();
      this.next();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      this.prev();
    } else if (e.key === "f" || e.key === "F") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    } else if (e.key === "Escape") {
      this.exit();
    }
  }

  handleMouseMove() {
    const hud = document.getElementById("screen-test-hud");
    if (hud) {
      hud.style.opacity = "1";
      clearTimeout(this.hudTimeout);
      this.hudTimeout = setTimeout(() => {
        hud.style.opacity = "0";
      }, 2500);
    }
  }
}
