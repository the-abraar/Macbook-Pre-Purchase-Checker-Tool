/**
 * MacBook Pre-Purchase Checker — Main App Controller (High-Polish UI/UX)
 */

import { WIZARD_STEPS } from "./wizard.js";
import { MODELS_DATA, DIAGNOSTIC_CODES } from "./benchmarks.js";
import { DEFECT_ITEMS, CASH_MEMO_CLAUSES } from "./calculator.js";
import { KeyboardTester } from "./keyboard.js";
import { ScreenTester } from "./screen_test.js";
import { MediaTester } from "./media_test.js";
import { parseTerminalOutput } from "./analyzer.js";

// App State
let completedChecks = new Set(JSON.parse(localStorage.getItem("macprecheck_completed") || "[]"));
let activeTab = "wizard";
let selectedModelId = "m1-air";
let keyboardTester = null;
let screenTester = null;
let mediaTester = null;

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTabs();
  initWizard();
  initBenchmarks();
  initCalculator();
  initAnalyzer();
  initDiagnosticLookup();
  initHardwareTesters();
  initServiceWorker();
  updateProgressBar();
});

/* ==========================================================================
   1. Theme Management (Modern Web Guidance)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const storedTheme = localStorage.getItem("macprecheck_theme");

  if (storedTheme === "dark") {
    document.documentElement.classList.add("theme-dark");
    document.documentElement.classList.remove("theme-light");
  } else if (storedTheme === "light") {
    document.documentElement.classList.add("theme-light");
    document.documentElement.classList.remove("theme-dark");
  }

  themeToggleBtn?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("theme-dark") ||
      (!document.documentElement.classList.contains("theme-light") && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.remove("theme-dark");
      document.documentElement.classList.add("theme-light");
      localStorage.setItem("macprecheck_theme", "light");
      showToast("☀️ Switched to Light Mode");
    } else {
      document.documentElement.classList.remove("theme-light");
      document.documentElement.classList.add("theme-dark");
      localStorage.setItem("macprecheck_theme", "dark");
      showToast("🌙 Switched to Dark Mode");
    }
  });

  document.getElementById("btn-reset-all")?.addEventListener("click", () => {
    if (confirm("Reset all checked items and start a fresh MacBook inspection?")) {
      completedChecks.clear();
      localStorage.removeItem("macprecheck_completed");
      document.querySelectorAll(".check-item input").forEach(input => input.checked = false);
      document.querySelectorAll(".check-item").forEach(item => item.classList.remove("checked"));
      updateProgressBar();
      keyboardTester?.reset();
      showToast("🔄 Inspection checklist reset!");
    }
  });
}

/* ==========================================================================
   2. Navigation Tabs
   ========================================================================== */
function initTabs() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      switchTab(target);
    });
  });

  document.getElementById("btn-launch-screen-test-main")?.addEventListener("click", () => {
    screenTester?.start();
  });
}

export function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll(".nav-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `tab-${tabId}`);
  });

  // Toggle quick-jump nav visibility (only on wizard tab)
  const quickNav = document.getElementById("quick-jump-nav");
  if (quickNav) {
    quickNav.style.display = tabId === "wizard" ? "flex" : "none";
  }

  // Manage keyboard listener
  if (tabId === "keyboard") {
    keyboardTester?.start();
  } else {
    keyboardTester?.stop();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   3. Wizard Steps & Checkbox Tracking
   ========================================================================== */
function initWizard() {
  const container = document.getElementById("wizard-container");
  if (!container) return;

  container.innerHTML = "";

  WIZARD_STEPS.forEach(step => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = step.id;

    // Header
    let badgeClass = "badge-primary";
    if (step.badgeType === "danger") badgeClass = "badge-danger";
    if (step.badgeType === "warning") badgeClass = "badge-warning";

    let html = `
      <div class="card-header">
        <div class="card-title-group">
          <div class="card-phase">${step.phase}</div>
          <h3 class="card-title">${step.title}</h3>
          <p class="card-subtitle">${step.summary}</p>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <span class="phase-status-pill" id="pill-${step.id}">0 / ${step.checkItems.length} passed</span>
          <span class="badge ${badgeClass}">${step.badge}</span>
        </div>
      </div>
      <div class="card-body">
    `;

    // Instructions
    step.instructions.forEach(inst => {
      if (inst.type === "p") {
        html += `<p style="margin-bottom: 12px;">${inst.content}</p>`;
      } else if (inst.type === "visual-mdm-comparison") {
        html += `
          <div class="visual-comparison-grid">
            <div class="mockup-card danger">
              <span class="mockup-badge">🛑 DANGEROUS: Corporate MDM</span>
              <div class="mockup-screen">
                <div style="font-size: 24px; margin-bottom: 4px;">🏢</div>
                <div class="mockup-screen-title">Remote Management</div>
                <div class="mockup-screen-desc">"Acme Corp / School will automatically configure your Mac..."</div>
              </div>
              <p style="font-size: 12px; color: var(--danger); font-weight: 700; margin-top: 8px; text-align: center;">
                🚨 WALK AWAY IMMEDIATELY! Do NOT buy.
              </p>
            </div>

            <div class="mockup-card safe">
              <span class="mockup-badge">✅ SAFE: Standard Clean Setup</span>
              <div class="mockup-screen">
                <div style="font-size: 24px; margin-bottom: 4px;">👤</div>
                <div class="mockup-screen-title">Create a Computer Account</div>
                <div class="mockup-screen-desc">"Enter your Full Name, Account Name, and Password"</div>
              </div>
              <p style="font-size: 12px; color: var(--success); font-weight: 700; margin-top: 8px; text-align: center;">
                ✅ Normal retail setup. Safe to proceed.
              </p>
            </div>
          </div>
        `;
      } else if (inst.type === "visual-chassis-diagram") {
        html += `
          <div class="chassis-diagram">
            <svg class="chassis-svg" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="150" height="90" rx="10" stroke="currentColor" stroke-width="2" fill="var(--surface-1)"/>
              <circle cx="18" cy="18" r="4" fill="currentColor"/>
              <circle cx="142" cy="18" r="4" fill="currentColor"/>
              <circle cx="18" cy="82" r="4" fill="currentColor"/>
              <circle cx="142" cy="82" r="4" fill="currentColor"/>
              <rect x="35" y="32" width="90" height="36" rx="4" stroke="#ff9500" stroke-width="2" stroke-dasharray="3 3" fill="rgba(255,149,0,0.1)"/>
              <text x="80" y="52" font-size="8" font-weight="bold" fill="#ff9500" text-anchor="middle">🔍 Serial Number</text>
              <text x="80" y="62" font-size="6" fill="var(--text-muted)" text-anchor="middle">Laser Engraved Here</text>
            </svg>
            <div class="chassis-notes">
              <div class="chassis-notes-title">📍 Where to check on the physical MacBook:</div>
              <p class="chassis-notes-p">
                Flip the MacBook upside down. Near the top-center of the metal baseplate, you will see tiny laser-engraved regulatory text: <code>Designed by Apple... Serial: [C02...]</code>. Confirm every character matches the Terminal serial number!
              </p>
            </div>
          </div>
        `;
      } else if (inst.type === "steps") {
        html += `<ol style="margin-left: 20px; margin-bottom: 14px; display: flex; flex-direction: column; gap: 6px;">`;
        inst.items.forEach(it => {
          html += `<li>${it}</li>`;
        });
        html += `</ol>`;
      } else if (inst.type === "alert") {
        html += `
          <div class="alert-box alert-${inst.alertType}">
            <div class="alert-title">${inst.title}</div>
            <div>${inst.content}</div>
          </div>
        `;
      } else if (inst.type === "command") {
        html += `
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="terminal-dot dot-red"></span>
                <span class="terminal-dot dot-yellow"></span>
                <span class="terminal-dot dot-green"></span>
              </div>
              <span class="terminal-title">Terminal — bash</span>
              <button type="button" class="btn-copy" data-cmd="${escapeHtml(inst.cmd)}">📋 Copy Command</button>
            </div>
            <div class="terminal-body">
              <div class="cmd-code-row">
                <code class="cmd-code">${escapeHtml(inst.cmd)}</code>
              </div>
              ${inst.expected ? `<div class="cmd-expected">🎯 Pass Criteria: ${inst.expected}</div>` : ""}
            </div>
          </div>
        `;
      } else if (inst.type === "action-button") {
        html += `
          <div style="margin: 16px 0; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <button type="button" class="btn btn-primary" data-action="${inst.action}">${inst.btnLabel}</button>
            <span style="font-size: 13px; color: var(--text-muted);">${inst.description}</span>
          </div>
        `;
      } else if (inst.type === "interactive-battery") {
        html += `
          <div class="battery-calc-card">
            <h4 style="margin-bottom: 6px; font-size: 15px; font-weight: 700;">⚡ Instant Battery Health & Authenticity Evaluator:</h4>
            <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 10px;">Enter the MacBook's reported cycle count and health % to detect fake or reset batteries:</p>
            <div class="calc-grid">
              <div class="input-group">
                <label>MacBook Chip</label>
                <select id="calc-chip-select">
                  <option value="M1">M1 (2020)</option>
                  <option value="M2">M2 (2022-2023)</option>
                  <option value="M3">M3 (2023-2024)</option>
                  <option value="M4">M4 (2024-2025)</option>
                </select>
              </div>
              <div class="input-group">
                <label>Cycle Count</label>
                <input type="number" id="calc-cycles-input" placeholder="e.g. 180" min="0" max="2000">
              </div>
              <div class="input-group">
                <label>Maximum Capacity (%)</label>
                <input type="number" id="calc-health-input" placeholder="e.g. 88" min="30" max="100">
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-eval-battery" id="btn-eval-battery">🔍 Evaluate Battery Condition</button>
            <div id="calc-eval-result" class="calc-result-box hidden"></div>
          </div>
        `;
      } else if (inst.type === "interactive-media") {
        html += `<div id="wizard-media-placeholder"></div>`;
      } else if (inst.type === "diagnostic-lookup") {
        html += `
          <div style="margin-top: 14px; background: var(--surface-2); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <label style="display: block; font-size: 13.5px; font-weight: 700; margin-bottom: 6px;">🔍 Apple Diagnostics Error Code Lookup:</label>
            <input type="text" id="diag-code-input" placeholder="Type error code (e.g. ADP000, PPT001, VDC001, NDR001)..." style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--surface-1); color: var(--text-color); font-size: 14px;">
            <div id="diag-code-result" style="margin-top: 10px; font-size: 13.5px;"></div>
          </div>
        `;
      }
    });

    // Check Items
    if (step.checkItems && step.checkItems.length > 0) {
      html += `<div class="check-group">`;
      step.checkItems.forEach(item => {
        const isChecked = completedChecks.has(item.id);
        html += `
          <label class="check-item ${isChecked ? 'checked' : ''}" data-id="${item.id}" data-step-id="${step.id}">
            <input type="checkbox" ${isChecked ? 'checked' : ''}>
            <span>${item.text}</span>
          </label>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
    card.innerHTML = html;
    container.appendChild(card);
  });

  // Checkbox change listener
  container.addEventListener("change", e => {
    if (e.target.matches("input[type='checkbox']")) {
      const label = e.target.closest(".check-item");
      const checkId = label.dataset.id;
      if (e.target.checked) {
        completedChecks.add(checkId);
        label.classList.add("checked");
      } else {
        completedChecks.delete(checkId);
        label.classList.remove("checked");
      }
      localStorage.setItem("macprecheck_completed", JSON.stringify([...completedChecks]));
      updateProgressBar();
    }
  });

  // Copy Buttons
  container.addEventListener("click", e => {
    const copyBtn = e.target.closest(".btn-copy");
    if (copyBtn) {
      const cmd = copyBtn.dataset.cmd;
      navigator.clipboard.writeText(cmd).then(() => {
        showToast("📋 Command copied to clipboard!");
      });
    }

    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === "launchScreenTester") {
        screenTester?.start();
      } else if (action === "launchKeyboardTester") {
        switchTab("keyboard");
      } else if (action === "switchTabNegotiation") {
        switchTab("negotiation");
      }
    }
  });

  // Battery Mini Evaluator
  document.getElementById("btn-eval-battery")?.addEventListener("click", () => {
    const chip = document.getElementById("calc-chip-select")?.value || "M1";
    const cycles = parseInt(document.getElementById("calc-cycles-input")?.value, 10);
    const health = parseInt(document.getElementById("calc-health-input")?.value, 10);
    const resultBox = document.getElementById("calc-eval-result");

    if (isNaN(cycles) && isNaN(health)) {
      alert("Please enter either Cycle Count or Maximum Capacity percentage.");
      return;
    }

    let statusHtml = "";
    let statusClass = "";

    if (chip === "M1" && cycles > 0 && cycles < 25) {
      statusClass = "alert-warning";
      statusHtml = `⚠️ <strong>Suspicious Cycle Count:</strong> On a 2020 M1, having only ${cycles} cycles with 100% capacity is highly suspicious for a used chassis. It strongly indicates a counterfeit copy battery or reset microcontroller.`;
    } else if (health && health < 80) {
      statusClass = "alert-danger";
      statusHtml = `🚨 <strong>Battery Degraded (${health}%):</strong> Below Apple's 80% service threshold. Demand a ৳6,000–৳8,000 deduction to replace it!`;
    } else if (cycles && cycles > 600) {
      statusClass = "alert-warning";
      statusHtml = `⚠️ <strong>High Cycles (${cycles}):</strong> Nearing 1,000 cycle design limit. Chemical life is nearly exhausted.`;
    } else {
      statusClass = "alert-success";
      statusHtml = `✅ <strong>Battery Appears Healthy:</strong> ${cycles || 'N/A'} cycles and ${health ? health + '%' : 'N/A'} capacity are normal for a pre-owned ${chip}.`;
    }

    resultBox.className = `calc-result-box ${statusClass}`;
    resultBox.innerHTML = statusHtml;
    resultBox.classList.remove("hidden");
  });
}

function updateProgressBar() {
  const allChecks = document.querySelectorAll(".check-item");
  const total = allChecks.length;
  const count = completedChecks.size;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  // Update Hero Circular Progress
  const circle = document.getElementById("hero-progress-circle");
  const pctLabel = document.getElementById("hero-progress-pct");
  const countLabel = document.getElementById("hero-progress-count");
  const readinessTitle = document.getElementById("hero-readiness-title");

  if (circle) {
    const circumference = 157; // 2 * pi * 25
    const offset = circumference - (circumference * pct / 100);
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = pct >= 80 ? "var(--success)" : pct >= 40 ? "var(--primary)" : "var(--warning)";
  }

  if (pctLabel) pctLabel.textContent = `${pct}%`;
  if (countLabel) countLabel.textContent = `${count} of ${total} checks completed`;

  if (readinessTitle) {
    if (pct === 0) readinessTitle.textContent = "Not Inspected";
    else if (pct < 50) readinessTitle.textContent = "Inspection in Progress";
    else if (pct < 90) readinessTitle.textContent = "Hardware Verification";
    else readinessTitle.textContent = "Ready to Finalize Deal 🎉";
  }

  // Update per-step status pills
  WIZARD_STEPS.forEach(step => {
    const pill = document.getElementById(`pill-${step.id}`);
    if (!pill) return;
    const stepItems = step.checkItems || [];
    const stepCompleted = stepItems.filter(it => completedChecks.has(it.id)).length;

    if (stepCompleted === stepItems.length && stepItems.length > 0) {
      pill.className = "phase-status-pill completed";
      pill.textContent = `${stepCompleted} / ${stepItems.length} PASSED ✅`;
    } else {
      pill.className = "phase-status-pill";
      pill.textContent = `${stepCompleted} / ${stepItems.length} checked`;
    }
  });
}

/* ==========================================================================
   4. Model Benchmarks Showcase
   ========================================================================== */
function initBenchmarks() {
  const tabsContainer = document.getElementById("benchmark-model-tabs");
  const detailsContainer = document.getElementById("benchmark-details");
  if (!tabsContainer || !detailsContainer) return;

  tabsContainer.innerHTML = "";
  Object.values(MODELS_DATA).forEach(model => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `model-btn ${model.id === selectedModelId ? 'active' : ''}`;
    btn.textContent = model.name.split(" (")[0];
    btn.dataset.modelId = model.id;
    btn.addEventListener("click", () => {
      selectedModelId = model.id;
      document.querySelectorAll(".model-btn").forEach(b => b.classList.toggle("active", b === btn));
      renderModelDetails(model);
    });
    tabsContainer.appendChild(btn);
  });

  renderModelDetails(MODELS_DATA[selectedModelId]);
}

function renderModelDetails(model) {
  const container = document.getElementById("benchmark-details");
  if (!container) return;

  const bm = model.benchmarks;

  container.innerHTML = `
    <div class="card" style="margin-top: 14px;">
      <div class="card-header">
        <div>
          <h3 class="card-title">${model.name}</h3>
          <p class="card-subtitle">Chassis: ${model.chassis} • ID: ${model.modelId} • Years: ${model.years}</p>
        </div>
      </div>

      <div class="specs-grid">
        <div class="spec-box"><div class="spec-label">Processor</div><div class="spec-val">${model.chip}</div></div>
        <div class="spec-box"><div class="spec-label">GPU & Graphics</div><div class="spec-val">${model.gpu}</div></div>
        <div class="spec-box"><div class="spec-label">Memory</div><div class="spec-val">${model.ram}</div></div>
        <div class="spec-box"><div class="spec-label">Storage</div><div class="spec-val">${model.storageOptions}</div></div>
        <div class="spec-box"><div class="spec-label">Display</div><div class="spec-val">${model.display}</div></div>
        <div class="spec-box"><div class="spec-label">Ports & I/O</div><div class="spec-val">${model.ports}</div></div>
      </div>

      <h4 style="margin: 24px 0 10px; font-size: 16px;">🎯 Expected Benchmark Scores & Target Baselines:</h4>
      <div class="benchmark-table-card">
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>Metric / Test</th>
              <th>Factory Pass Spec</th>
              <th>Warning / Throttled</th>
              <th>Defect / Red Flag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Geekbench 6 Single-Core</strong></td>
              <td><span class="text-success">${bm.geekbenchSingle.pass}</span></td>
              <td><span class="text-warning">${bm.geekbenchSingle.warning}</span></td>
              <td><span class="text-danger">${bm.geekbenchSingle.fail}</span></td>
            </tr>
            <tr>
              <td><strong>Geekbench 6 Multi-Core</strong></td>
              <td><span class="text-success">${bm.geekbenchMulti.pass}</span></td>
              <td><span class="text-warning">${bm.geekbenchMulti.warning}</span></td>
              <td><span class="text-danger">${bm.geekbenchMulti.fail}</span></td>
            </tr>
            <tr>
              <td><strong>Metal GPU Score</strong></td>
              <td><span class="text-success">${bm.metalGpu.pass}</span></td>
              <td><span class="text-warning">${bm.metalGpu.warning}</span></td>
              <td><span class="text-danger">${bm.metalGpu.fail}</span></td>
            </tr>
            <tr>
              <td><strong>Sequential SSD Write</strong></td>
              <td><span class="text-success">${bm.ssdWrite.pass}</span></td>
              <td><span class="text-warning">${bm.ssdWrite.warning}</span></td>
              <td><span class="text-danger">${bm.ssdWrite.fail}</span></td>
            </tr>
            <tr>
              <td><strong>Sequential SSD Read</strong></td>
              <td><span class="text-success">${bm.ssdRead.pass}</span></td>
              <td><span class="text-warning">${bm.ssdRead.warning}</span></td>
              <td><span class="text-danger">${bm.ssdRead.fail}</span></td>
            </tr>
            <tr>
              <td><strong>Battery Cycles</strong></td>
              <td><span class="text-success">${bm.batteryCycles.pass}</span></td>
              <td><span class="text-warning">${bm.batteryCycles.warning}</span></td>
              <td><span class="text-danger">${bm.batteryCycles.fail}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 style="margin: 24px 0 12px; font-size: 16px;">⚠️ Known Model Hardware Vulnerabilities & Red Flags:</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${model.knownPitfalls.map(p => `
          <div class="alert-box alert-${p.severity === 'danger' ? 'danger' : p.severity === 'warning' ? 'warning' : 'info'}">
            <div class="alert-title">${p.title}</div>
            <div>${p.desc}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* ==========================================================================
   5. Negotiation & Cash Memo Calculator
   ========================================================================== */
function initCalculator() {
  const defectListContainer = document.getElementById("defect-checklist-container");
  const totalDeductionEl = document.getElementById("calc-total-deduction");
  const clausesContainer = document.getElementById("cash-memo-clauses-container");
  const dialogueContainer = document.getElementById("negotiation-dialogue-box");

  if (!defectListContainer) return;

  defectListContainer.innerHTML = "";
  DEFECT_ITEMS.forEach(item => {
    const row = document.createElement("div");
    row.className = "card";
    row.style.padding = "16px";
    row.style.marginBottom = "12px";

    row.innerHTML = `
      <label style="display: flex; align-items: flex-start; gap: 14px; cursor: pointer;">
        <input type="checkbox" class="defect-checkbox" data-id="${item.id}" data-min="${item.deductionMin}" data-max="${item.deductionMax}" style="width: 22px; height: 22px; margin-top: 2px;">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <strong style="font-size: 15px;">${item.label}</strong>
            <span class="badge badge-danger">Deduct ৳${item.deductionMin.toLocaleString()} – ৳${item.deductionMax.toLocaleString()} BDT</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${item.desc}</p>
        </div>
      </label>
    `;
    defectListContainer.appendChild(row);
  });

  function recalculate() {
    const checked = document.querySelectorAll(".defect-checkbox:checked");
    let totalMin = 0;
    let totalMax = 0;
    let dialogues = [];

    checked.forEach(chk => {
      totalMin += parseInt(chk.dataset.min, 10);
      totalMax += parseInt(chk.dataset.max, 10);
      const itemDef = DEFECT_ITEMS.find(d => d.id === chk.dataset.id);
      if (itemDef) dialogues.push(`• <strong>${itemDef.label}:</strong> "${itemDef.dialogue}"`);
    });

    if (totalDeductionEl) {
      if (totalMin === 0) {
        totalDeductionEl.textContent = "৳0 BDT";
      } else {
        totalDeductionEl.textContent = `৳${totalMin.toLocaleString()} – ৳${totalMax.toLocaleString()} BDT`;
      }
    }

    if (dialogueContainer) {
      if (dialogues.length === 0) {
        dialogueContainer.innerHTML = "<p style='color: var(--text-muted);'>Check off defects found above to generate ready-to-use bargaining scripts in Bangla.</p>";
      } else {
        dialogueContainer.innerHTML = `
          <h4 style="margin-bottom: 8px; font-size: 14px; font-weight: 700;">🗣️ What to say to the shopkeeper (Bengali Negotiation Scripts):</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13.5px;">${dialogues.join("")}</div>
        `;
      }
    }
  }

  defectListContainer.addEventListener("change", recalculate);

  // Copy Deal Summary Button
  document.getElementById("btn-copy-deal-summary")?.addEventListener("click", () => {
    const checked = document.querySelectorAll(".defect-checkbox:checked");
    if (checked.length === 0) {
      alert("Select at least one defect above before copying summary.");
      return;
    }
    const deduction = totalDeductionEl?.textContent || "৳0 BDT";
    let summary = `🍏 MacBook Pre-Purchase Inspection Summary:\n`;
    summary += `Recommended Total Deduction: ${deduction}\n\nDefects Identified:\n`;
    checked.forEach(chk => {
      const item = DEFECT_ITEMS.find(d => d.id === chk.dataset.id);
      if (item) summary += `- ${item.label} (Deduct ৳${item.deductionMin.toLocaleString()}–৳${item.deductionMax.toLocaleString()})\n`;
    });
    navigator.clipboard.writeText(summary).then(() => {
      showToast("📱 Deal summary copied! Ready to share via WhatsApp.");
    });
  });

  // Render Cash Memo Clauses
  if (clausesContainer) {
    clausesContainer.innerHTML = "";
    CASH_MEMO_CLAUSES.forEach(clause => {
      const div = document.createElement("div");
      div.className = "memo-clause-card";
      div.innerHTML = `
        <div class="memo-clause-title">${clause.title}</div>
        <pre class="memo-clause-text">${escapeHtml(clause.english)}</pre>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <span class="memo-bangla-note">🇧🇩 ${clause.bangla}</span>
          <button type="button" class="btn btn-secondary btn-copy" data-cmd="${escapeHtml(clause.english)}" style="padding: 6px 14px; font-size: 12px;">📋 Copy Clause</button>
        </div>
      `;
      clausesContainer.appendChild(div);
    });

    clausesContainer.addEventListener("click", e => {
      const btn = e.target.closest(".btn-copy");
      if (btn) {
        navigator.clipboard.writeText(btn.dataset.cmd).then(() => {
          showToast("📋 Clause text copied to clipboard!");
        });
      }
    });
  }
}

/* ==========================================================================
   6. Terminal Output Analyzer ("Paste & Decode")
   ========================================================================== */
function initAnalyzer() {
  const analyzeBtn = document.getElementById("btn-analyze-output");
  const textarea = document.getElementById("analyzer-input");
  const scorecardContainer = document.getElementById("scorecard-result-container");
  const scannerBeam = document.getElementById("scanner-beam");

  if (!analyzeBtn || !textarea || !scorecardContainer) return;

  // Preset buttons
  document.getElementById("btn-sample-m1")?.addEventListener("click", () => {
    textarea.value = `======================================================================
  🍏 ALL-IN-ONE PRE-PURCHASE CHECKER & BENCHMARK TOOL (M1) 🍏 
======================================================================

[1/7] Hardware Identity & Security Check...
  • Machine:      MacBook Air (MacBookAir10,1)
  • Processor:    Apple M1 [8 (4 performance and 4 efficiency)]
  • Memory (RAM): 8 GB
  • Logic Serial: C02FM3T1Q05D
  • iCloud Lock:  ✅ Clean / Disabled (Safe to link your Apple ID)

[2/7] Checking MDM & Remote Device Management Profiles...
  • MDM Status:   ✅ CLEAN (Not DEP Enrolled / Free of corporate remote management)

[3/7] Battery & Charger Health Analysis (coconutBattery Mode)...
  • Battery Serial:   F8Y146503Q309XNBL (Apple Battery)
  • Reported Cycles:  185
  • macOS Health:     92% (Condition: Normal)
  • True Raw Health:  91% (3992 mAh raw / 4382 mAh design)
  • Temperature:      31°C
  • Current Voltage:  11.85 V
  • Connected Adapter: 30W USB-C Power Adapter (30W by Apple Inc.)
  ✅ Cycle count is normal for a pre-owned M1.

[4/7] SSD Health & Speed Benchmark (DriveDx / Blackmagic Mode)...
  • Drive Model:      APPLE SSD AP0256Q (Serial: 0ba0821034c4987b)
  • Storage Size:     245.1 GB
  • S.M.A.R.T. Status:✅ Verified (Self-monitoring sensors healthy)
    - Sequential Write Speed: 2185 MB/s
    - Sequential Read Speed:  2640 MB/s
  ✅ Speeds are healthy and standard for M1 dual-NAND flash (~2,100+ MB/s).

[5/7] Thermal Throttling & CPU Benchmark (Geekbench Mode)...
  • Thermal State:  ✅ Normal (No CPU scheduler thermal limits active)
  • Processing Speed: 1258492000 (bytes/sec block)
  ✅ CPU instructions and cryptographic pipelines responding at full clock.

[6/7] Checking Touch ID / Secure Enclave Pairing...
  • Touch ID Sensor:✅ Sensor verified and communicating with Secure Enclave`;
    showToast("📝 Loaded Clean M1 Air preset!");
    runAnalysis();
  });

  document.getElementById("btn-sample-mdm")?.addEventListener("click", () => {
    textarea.value = `[1/7] Hardware Identity & Security Check...
  • Machine:      MacBook Pro 14" (MacBookPro18,3)
  • Processor:    Apple M1 Pro [8 cores]
  • Logic Serial: H7VV75KWQ4
  • iCloud Lock:  ✅ Clean / Disabled

[2/7] Checking MDM & Remote Device Management Profiles...
  • MDM Status:   ❌ RED ALERT: MDM CORPORATE PROFILE DETECTED!
    Enrolled via DEP: Yes
    MDM server: https://mdm.deloitte.com/enrollment
    ⚠️ WALK AWAY! This Mac belongs to an enterprise/school organization.`;
    showToast("⚠️ Loaded Corporate MDM Locked preset!");
    runAnalysis();
  });

  document.getElementById("btn-sample-batt")?.addEventListener("click", () => {
    textarea.value = `[1/7] Hardware Identity & Security Check...
  • Machine:      MacBook Air (MacBookAir10,1)
  • Processor:    Apple M1 [8 cores]
  • Logic Serial: C02FM3T1Q05D
  • iCloud Lock:  ✅ Clean / Disabled

[2/7] Checking MDM Status...
  • MDM Status:   ✅ CLEAN (Not DEP Enrolled)

[3/7] Battery & Charger Health Analysis...
  • Reported Cycles:  12
  • macOS Health:     100%
  • Connected Adapter: 65W Generic Brick (Unknown Manufacturer)
  ⚠️ SUSPICIOUS: Cycle count is < 25 on an M1 (2020). Battery likely replaced with copy or reset!
  ⚠️ WARNING: Charger appears to be a 3rd-party or generic clone brick!`;
    showToast("⚠️ Loaded Fake Battery & Charger preset!");
    runAnalysis();
  });

  analyzeBtn.addEventListener("click", runAnalysis);

  function runAnalysis() {
    const raw = textarea.value;
    const res = parseTerminalOutput(raw);

    if (res.error) {
      alert(res.error);
      return;
    }

    if (scannerBeam) {
      scannerBeam.classList.add("active");
      setTimeout(() => {
        scannerBeam.classList.remove("active");
        renderScorecard(res);
      }, 350);
    } else {
      renderScorecard(res);
    }
  }

  function renderScorecard(res) {
    let verdictHtml = "";
    if (res.overallVerdict === "DO_NOT_BUY") {
      verdictHtml = `
        <div class="alert-box alert-danger" style="font-size: 15px;">
          <div class="alert-title">🚨 CRITICAL RED ALERT: DO NOT BUY THIS MACBOOK!</div>
          This machine has an enterprise MDM corporate profile or active iCloud Activation Lock. The moment you update macOS or wipe the Mac, it will permanently lock you out.
        </div>
      `;
    } else if (res.overallVerdict === "HARDWARE_DEFECT") {
      verdictHtml = `
        <div class="alert-box alert-danger" style="font-size: 15px;">
          <div class="alert-title">🚨 HARDWARE DEFECT DETECTED!</div>
          Hardware issues found: ${res.verdictReasons.join(", ")}.
        </div>
      `;
    } else if (res.overallVerdict === "NEGOTIATE_DISCOUNT") {
      verdictHtml = `
        <div class="alert-box alert-warning" style="font-size: 15px;">
          <div class="alert-title">⚠️ QUALIFIED WITH DEFECTS: NEGOTIATE CASH DISCOUNT</div>
          Machine is free of MDM/iCloud locks, but battery or charger has issues. Demand a ৳6,000–৳8,000 deduction.
        </div>
      `;
    } else if (res.overallVerdict === "RECOMMENDED") {
      verdictHtml = `
        <div class="alert-box alert-success" style="font-size: 15px;">
          <div class="alert-title">🎉 EXCELLENT PURCHASE CANDIDATE! ALL SCANS PASSED</div>
          Clean MDM, unlocked iCloud, healthy battery, verified SSD, and authentic biometric sensors.
        </div>
      `;
    } else if (res.overallVerdict === "VERIFY_MDM") {
      verdictHtml = `
        <div class="alert-box alert-warning" style="font-size: 15px;">
          <div class="alert-title">⚠️ MDM STATUS UNCONFIRMED — DO NOT SKIP THIS CHECK</div>
          Your pasted output didn't include a clear MDM/DEP enrollment result, so it was NOT verified as clean.
          Run <code>profiles status -type enrollment</code> yourself and watch for a "Remote Management" screen during setup before paying.
        </div>
      `;
    } else {
      verdictHtml = `
        <div class="alert-box alert-warning" style="font-size: 15px;">
          <div class="alert-title">⚠️ INCOMPLETE DATA — PASTE MORE OUTPUT</div>
          Not enough was recognized in the pasted text to give a verdict. Run <code>check_mac.sh</code> (or the full manual checklist) and paste its complete output here.
        </div>
      `;
    }

    scorecardContainer.innerHTML = `
      ${verdictHtml}
      <div class="scorecard-grid">
        <div class="score-card pass">
          <div class="score-header">
            <span class="score-title">Hardware Identity</span>
            <span class="badge badge-primary">INFO</span>
          </div>
          <div class="score-desc">
            <div>Model: <strong>${res.hardware.modelName || 'Apple Mac'}</strong></div>
            <div>Chip: <strong>${res.hardware.chip || 'Apple Silicon'}</strong></div>
            <div>Memory: <strong>${res.hardware.memory || 'N/A'}</strong></div>
            <div>Serial: <strong>${res.hardware.serial || 'N/A'}</strong></div>
          </div>
        </div>

        <div class="score-card ${res.mdm.status === 'pass' ? 'pass' : res.mdm.status === 'fail' ? 'fail' : 'warning'}">
          <div class="score-header">
            <span class="score-title">Corporate MDM Lock</span>
            <span class="badge ${res.mdm.status === 'pass' ? 'badge-success' : 'badge-danger'}">
              ${res.mdm.status === 'pass' ? 'CLEAN' : res.mdm.status === 'fail' ? 'LOCKED' : 'UNKNOWN'}
            </span>
          </div>
          <div class="score-desc">${res.mdm.details || 'No enrollment profiles detected.'}</div>
        </div>

        <div class="score-card ${res.icloud.status === 'pass' ? 'pass' : res.icloud.status === 'fail' ? 'fail' : 'warning'}">
          <div class="score-header">
            <span class="score-title">iCloud Activation Lock</span>
            <span class="badge ${res.icloud.status === 'pass' ? 'badge-success' : 'badge-danger'}">
              ${res.icloud.status === 'pass' ? 'DISABLED' : res.icloud.status === 'fail' ? 'ENABLED' : 'UNKNOWN'}
            </span>
          </div>
          <div class="score-desc">${res.icloud.details || 'Activation lock state not explicitly reported.'}</div>
        </div>

        <div class="score-card ${res.battery.status === 'pass' ? 'pass' : res.battery.status === 'warning' ? 'warning' : 'fail'}">
          <div class="score-header">
            <span class="score-title">Battery & Charger</span>
            <span class="badge ${res.battery.status === 'pass' ? 'badge-success' : 'badge-warning'}">
              ${res.battery.status.toUpperCase()}
            </span>
          </div>
          <div class="score-desc">
            <div>Cycles: <strong>${res.battery.cycles ?? 'N/A'}</strong> | Health: <strong>${res.battery.healthPct ? res.battery.healthPct + '%' : 'N/A'}</strong></div>
            ${res.battery.notes.map(n => `<div style="margin-top:4px;">${n}</div>`).join("")}
          </div>
        </div>

        <div class="score-card ${res.storage.status === 'pass' ? 'pass' : res.storage.status === 'fail' ? 'fail' : 'warning'}">
          <div class="score-header">
            <span class="score-title">SSD Health & S.M.A.R.T.</span>
            <span class="badge ${res.storage.status === 'pass' ? 'badge-success' : 'badge-danger'}">
              ${res.storage.status.toUpperCase()}
            </span>
          </div>
          <div class="score-desc">
            <div>SMART: <strong>${res.storage.smartStatus || 'Verified'}</strong></div>
            ${res.storage.writeSpeed ? `<div>Write: <strong>${res.storage.writeSpeed} MB/s</strong> | Read: <strong>${res.storage.readSpeed || 'N/A'} MB/s</strong></div>` : ''}
            ${res.storage.notes.map(n => `<div style="margin-top:4px;">${n}</div>`).join("")}
          </div>
        </div>

        <div class="score-card ${res.touchId.status === 'pass' ? 'pass' : res.touchId.status === 'fail' ? 'fail' : 'warning'}">
          <div class="score-header">
            <span class="score-title">Touch ID Sensor</span>
            <span class="badge ${res.touchId.status === 'pass' ? 'badge-success' : 'badge-danger'}">
              ${res.touchId.status.toUpperCase()}
            </span>
          </div>
          <div class="score-desc">${res.touchId.details || 'Biometrics operating normally.'}</div>
        </div>
      </div>
    `;
    scorecardContainer.classList.remove("hidden");
  }
}

/* ==========================================================================
   7. Hardware Interactive Testers
   ========================================================================== */
function initHardwareTesters() {
  // Screen Tester
  screenTester = new ScreenTester("screen-test-overlay");

  // Keyboard Tester
  keyboardTester = new KeyboardTester("keyboard-grid-container", "keyboard-stats");
  document.getElementById("btn-reset-keyboard")?.addEventListener("click", () => {
    keyboardTester.reset();
  });

  const toggleSoundBtn = document.getElementById("btn-toggle-sound");
  toggleSoundBtn?.addEventListener("click", () => {
    const isEnabled = keyboardTester.toggleSound();
    toggleSoundBtn.textContent = isEnabled ? "🔊 Sound: ON" : "🔈 Sound: OFF";
    showToast(isEnabled ? "🔊 Keyboard click sound enabled" : "🔈 Keyboard sound muted");
  });

  // Media Tester (Mic, Speaker, Camera)
  mediaTester = new MediaTester("wizard-media-placeholder");
  const tabMediaContainer = document.getElementById("tab-media-container");
  if (tabMediaContainer) {
    new MediaTester("tab-media-container");
  }
}

/* ==========================================================================
   8. Diagnostics Code Lookup
   ========================================================================== */
function initDiagnosticLookup() {
  const input = document.getElementById("diag-code-input");
  const result = document.getElementById("diag-code-result");
  if (!input || !result) return;

  input.addEventListener("input", () => {
    const val = input.value.trim().toUpperCase();
    if (!val) {
      result.innerHTML = "";
      return;
    }

    const match = DIAGNOSTIC_CODES.find(c => c.code.toUpperCase() === val || val.startsWith(c.code.slice(0, 3)));
    if (match) {
      result.innerHTML = `
        <div class="alert-box alert-${match.status === 'pass' ? 'success' : 'danger'}" style="margin: 6px 0;">
          <strong>Code ${match.code}: ${match.label}</strong>
          <div>${match.desc}</div>
        </div>
      `;
    } else {
      result.innerHTML = `<span style="color: var(--text-muted);">No exact match for "${val}". Most Apple codes starting with PPT indicate battery, VDC indicates display, and NDR indicates Wi-Fi. ADP000 is clean pass.</span>`;
    }
  });
}

/* ==========================================================================
   9. Service Worker Registration (PWA / Offline)
   ========================================================================== */
function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(() => {
      console.log("PreCheck Service Worker registered for offline field testing.");
    }).catch(err => {
      console.warn("Service Worker registration failed:", err);
    });
  }
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
export function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
