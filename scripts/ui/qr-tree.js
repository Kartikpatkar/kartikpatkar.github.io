(() => {
  "use strict";

  window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

  // Seasonal Themes matching tree.icqr.com
  const THEMES = {
    summer: {
      id: "summer",
      name: "Summer Tree",
      icon: "🌿",
      trunkColor: 0x241810, // Dark wood bark
      leafColors: [0x237032, 0x2e8540, 0x419e53, 0x5bb86e, 0x82ce91, 0x33632f],
      groundColor: 0xede8dc, // Cobblestone plaza
      grassColor: 0x48a853,  // Border grass tufts
      baseColor: 0xd8d1c0,   // Beveled island base
      ambient: 0xfffaee,
      sun: 0xffffff
    },
    spring: {
      id: "spring",
      name: "Sakura Spring",
      icon: "🌸",
      trunkColor: 0x331c19,
      leafColors: [0xe91e63, 0xf06292, 0xf48fb1, 0xff80ab, 0xffb2dd, 0xd81b60],
      groundColor: 0xf5eee6,
      grassColor: 0x66bb6a,
      baseColor: 0xe5dad0,
      ambient: 0xfff0f5,
      sun: 0xfff8f9
    },
    autumn: {
      id: "autumn",
      name: "Autumn Maple",
      icon: "🍁",
      trunkColor: 0x2a140a,
      leafColors: [0xd84315, 0xe65100, 0xef6c00, 0xf57c00, 0xfb8c00, 0xc62828],
      groundColor: 0xf5ece0,
      grassColor: 0x8d6e63,
      baseColor: 0xe2d4c0,
      ambient: 0xfff4e6,
      sun: 0xffede0
    },
    salesforce: {
      id: "salesforce",
      name: "Cloud Tech",
      icon: "☁️",
      trunkColor: 0x091c34, // Dark navy trunk
      leafColors: [0x00a1e0, 0x1a73e8, 0x0284c7, 0x38bdf8, 0x0ea5e9, 0x2563eb],
      groundColor: 0xeff6fc,
      grassColor: 0x3b82f6,
      baseColor: 0xdbeafe,
      ambient: 0xf0f7ff,
      sun: 0xffffff
    }
  };

  class IcqrMagicTreeComponent {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.channels = options.channels || {};
      this.currentChannelKey = options.initialChannel || "linkedin";
      this.currentThemeKey = options.initialTheme || "summer";

      // 0.0 = full 3D Tree, 1.0 = 100% Flat Scannable QR Code
      this.morphProgress = 0.0;
      this.targetProgress = 0.0;
      this.isScanMode = false;
      this.isDestroyed = false;
      this.isInViewport = true;

      this.initDom();
      this.initThree();
      this.bindEvents();
      this.setChannel(this.currentChannelKey);
      this.setTheme(this.currentThemeKey);
      this.startRenderLoop();
    }

    initDom() {
      this.container.innerHTML = `
        <div class="qr-tree-card">
          <div class="qr-tree-card__header">
            <div class="qr-tree-card__titleGroup">
              <span class="qr-tree-card__badge">
                <span class="qr-tree-card__pulse"></span>
                <span>ICQR 3D Magic Tree</span>
              </span>
              <h4 class="qr-tree-card__title">Scan to Connect</h4>
              <p class="qr-tree-card__subtitle" id="qr-subtitle">Lush 3D Tree that seamlessly merges into your scannable QR code.</p>
            </div>
            <button class="qr-tree-btn qr-tree-btn--mode" id="qr-scan-toggle" type="button" aria-label="Toggle scan mode">
              <span id="qr-scan-icon">🎯</span>
              <span id="qr-scan-label">Scan View</span>
            </button>
          </div>

          <!-- Social Channels Row -->
          <div class="qr-tree-channels" role="tablist" aria-label="Social profiles">
            ${Object.keys(this.channels).map(key => {
              const ch = this.channels[key];
              return `
                <button class="qr-tree-pill ${key === this.currentChannelKey ? "qr-tree-pill--active" : ""}" 
                        type="button" 
                        data-channel="${key}"
                        role="tab" 
                        aria-selected="${key === this.currentChannelKey}">
                  <span class="qr-tree-pill__icon">${ch.icon || "🔗"}</span>
                  <span class="qr-tree-pill__label">${ch.label}</span>
                </button>
              `;
            }).join("")}
          </div>

          <!-- 3D Canvas Viewport (ICQR layout) -->
          <div class="qr-tree-viewport" id="qr-viewport" role="region" aria-label="3D Tree & QR Canvas">
            <canvas class="qr-tree-canvas" id="qr-canvas"></canvas>
            
            <!-- Seasons Selector -->
            <div class="qr-tree-themes" role="group" aria-label="Seasonal themes">
              ${Object.keys(THEMES).map(key => {
                const t = THEMES[key];
                return `
                  <button class="qr-tree-theme-btn ${key === this.currentThemeKey ? "qr-tree-theme-btn--active" : ""}" 
                          type="button" 
                          data-theme="${key}"
                          title="${t.name}">
                    <span class="qr-tree-theme-btn__icon">${t.icon}</span>
                    <span class="qr-tree-theme-btn__name">${t.name}</span>
                  </button>
                `;
              }).join("")}
            </div>

            <!-- Big ICQR Interactive Pill Button ("Tap to see QR code" / "Tap to see the tree") -->
            <button class="qr-tree-canvas-cta" id="qr-canvas-cta" type="button">
              <span id="qr-canvas-cta-icon">🎯</span>
              <span id="qr-canvas-cta-text">Tap the tree to see QR code</span>
            </button>

            <!-- Drag & Zoom Hint -->
            <div class="qr-tree-drag-hint" id="qr-drag-hint">
              <span>↻ Drag to rotate in 3D</span>
            </div>
          </div>

          <!-- Footer Link Bar -->
          <div class="qr-tree-footer">
            <div class="qr-tree-link-display">
              <span class="qr-tree-link-icon" id="qr-link-icon">🔗</span>
              <span class="qr-tree-link-url" id="qr-link-url"></span>
            </div>
            <div class="qr-tree-actions">
              <button class="qr-tree-btn qr-tree-btn--ghost" id="qr-copy-btn" type="button" aria-label="Copy link">
                <span id="qr-copy-label">Copy</span>
              </button>
              <a class="qr-tree-btn qr-tree-btn--primary" id="qr-open-btn" target="_blank" rel="noopener noreferrer">
                <span>Visit ↗</span>
              </a>
            </div>
          </div>
        </div>
      `;

      this.canvas = this.container.querySelector("#qr-canvas");
      this.viewport = this.container.querySelector("#qr-viewport");
      this.scanToggle = this.container.querySelector("#qr-scan-toggle");
      this.scanIcon = this.container.querySelector("#qr-scan-icon");
      this.scanLabel = this.container.querySelector("#qr-scan-label");
      this.canvasCta = this.container.querySelector("#qr-canvas-cta");
      this.canvasCtaIcon = this.container.querySelector("#qr-canvas-cta-icon");
      this.canvasCtaText = this.container.querySelector("#qr-canvas-cta-text");
      this.dragHint = this.container.querySelector("#qr-drag-hint");
      this.subtitle = this.container.querySelector("#qr-subtitle");
      this.urlText = this.container.querySelector("#qr-link-url");
      this.urlIcon = this.container.querySelector("#qr-link-icon");
      this.copyBtn = this.container.querySelector("#qr-copy-btn");
      this.copyLabel = this.container.querySelector("#qr-copy-label");
      this.openBtn = this.container.querySelector("#qr-open-btn");
    }

    initThree() {
      if (typeof THREE === "undefined") {
        console.warn("Three.js not loaded.");
        return;
      }

      this.scene = new THREE.Scene();

      const rect = this.viewport.getBoundingClientRect();
      const width = rect.width || 440;
      const height = 410;

      // Camera: Big dramatic isometric view (like ICQR screenshot)
      this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);

      // Isometric 45° diamond camera angle
      this.defaultCamPos = new THREE.Vector3(20, 22, 20);
      this.scanCamPos = new THREE.Vector3(0, 31, 0.001); // 100% overhead flat view
      this.defaultLookAt = new THREE.Vector3(0, 3.8, 0); // Focus slightly higher on the tree
      this.scanLookAt = new THREE.Vector3(0, 0, 0);

      this.camera.position.copy(this.defaultCamPos);
      this.camera.lookAt(this.defaultLookAt);

      this.currentCamPos = this.camera.position.clone();
      this.desiredCamPos = this.defaultCamPos.clone();
      this.currentLookAt = this.defaultLookAt.clone();
      this.desiredLookAt = this.defaultLookAt.clone();

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Lights
      this.ambientLight = new THREE.AmbientLight(0xfffaee, 0.9);
      this.scene.add(this.ambientLight);

      this.sunLight = new THREE.DirectionalLight(0xffffff, 0.95);
      this.sunLight.position.set(16, 32, 18);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.sunLight.shadow.bias = -0.0005;
      this.scene.add(this.sunLight);

      this.fillLight = new THREE.DirectionalLight(0xdbeafe, 0.35);
      this.fillLight.position.set(-16, 14, -16);
      this.scene.add(this.fillLight);

      // World Group
      this.worldGroup = new THREE.Group();
      this.scene.add(this.worldGroup);

      // Island Pedestal & Plaza
      this.islandGroup = new THREE.Group();
      this.worldGroup.add(this.islandGroup);

      // Morphing QR Tree Modules (InstancedMesh)
      this.treeModulesGroup = new THREE.Group();
      this.worldGroup.add(this.treeModulesGroup);

      // Border Grass Tufts
      this.grassGroup = new THREE.Group();
      this.worldGroup.add(this.grassGroup);

      // Rotation & Drag state
      this.rotationY = 0;
      this.targetRotationY = 0;
      this.rotationX = 0;
      this.targetRotationX = 0;
      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.lastInteractionTime = Date.now();

      this.clock = new THREE.Clock();
    }

    buildIsland(matrixSize, cellSize) {
      while (this.islandGroup.children.length > 0) {
        const obj = this.islandGroup.children.pop();
        if (obj.geometry) obj.geometry.dispose();
      }
      while (this.grassGroup.children.length > 0) {
        const obj = this.grassGroup.children.pop();
        if (obj.geometry) obj.geometry.dispose();
      }

      const theme = THEMES[this.currentThemeKey];
      const totalWidth = matrixSize * cellSize;
      const islandSize = totalWidth + 2.8;

      // 1. Beveled Diamond Island Slab
      const baseGeom = new THREE.BoxGeometry(islandSize, 1.1, islandSize);
      this.baseMat = new THREE.MeshStandardMaterial({
        color: theme.baseColor,
        roughness: 0.7,
        metalness: 0.05
      });
      const baseMesh = new THREE.Mesh(baseGeom, this.baseMat);
      baseMesh.position.y = -0.65;
      baseMesh.receiveShadow = true;
      this.islandGroup.add(baseMesh);

      // 2. Cobblestone Paved Plaza (Ground under QR)
      const groundGeom = new THREE.BoxGeometry(totalWidth + 0.3, 0.2, totalWidth + 0.3);
      this.groundMat = new THREE.MeshStandardMaterial({
        color: theme.groundColor,
        roughness: 0.45,
        metalness: 0.05
      });
      const groundMesh = new THREE.Mesh(groundGeom, this.groundMat);
      groundMesh.position.y = -0.05;
      groundMesh.receiveShadow = true;
      this.islandGroup.add(groundMesh);

      // 3. Perimeter Grass Tufts (Lush grass border like ICQR screenshot 2)
      const grassMat = new THREE.MeshStandardMaterial({
        color: theme.grassColor,
        roughness: 0.6,
        flatShading: true
      });
      this.grassMat = grassMat;

      const tuftGeom = new THREE.ConeGeometry(0.24, 0.75, 4);
      const tuftCount = 52;
      this.grassInstanced = new THREE.InstancedMesh(tuftGeom, grassMat, tuftCount);
      this.grassInstanced.castShadow = true;

      const dummy = new THREE.Object3D();
      const halfSize = (totalWidth / 2) + 0.6;
      let gIdx = 0;

      const addBorderTufts = (startX, startZ, endX, endZ, steps) => {
        for (let s = 0; s < steps; s++) {
          if (gIdx >= tuftCount) break;
          const frac = s / steps;
          const x = startX + (endX - startX) * frac;
          const z = startZ + (endZ - startZ) * frac;
          dummy.position.set(x, 0.3, z);
          dummy.rotation.y = Math.random() * Math.PI;
          dummy.rotation.z = (Math.random() - 0.5) * 0.25;
          const scale = 0.8 + Math.random() * 0.4;
          dummy.scale.set(scale, scale * 1.3, scale);
          dummy.updateMatrix();
          this.grassInstanced.setMatrixAt(gIdx++, dummy.matrix);
        }
      };

      const perSide = Math.floor(tuftCount / 4);
      addBorderTufts(-halfSize, -halfSize, halfSize, -halfSize, perSide);
      addBorderTufts(halfSize, -halfSize, halfSize, halfSize, perSide);
      addBorderTufts(halfSize, halfSize, -halfSize, halfSize, perSide);
      addBorderTufts(-halfSize, halfSize, -halfSize, -halfSize, perSide);

      this.grassInstanced.instanceMatrix.needsUpdate = true;
      this.grassGroup.add(this.grassInstanced);
    }

    generateQrTree(url) {
      if (typeof window.qrcode === "undefined") {
        console.warn("qrcode library not loaded.");
        return;
      }

      while (this.treeModulesGroup.children.length > 0) {
        const obj = this.treeModulesGroup.children.pop();
        if (obj.geometry) obj.geometry.dispose();
      }

      let qr;
      try {
        qr = window.qrcode(0, "H");
        qr.addData(url);
        qr.make();
      } catch {
        qr = window.qrcode(0, "M");
        qr.addData(url);
        qr.make();
      }

      const count = qr.getModuleCount();
      const cellSize = 0.58;
      const totalWidth = count * cellSize;
      const halfWidth = totalWidth / 2;

      this.buildIsland(count, cellSize);

      const theme = THEMES[this.currentThemeKey];

      // Identify Dark Modules
      this.moduleData = [];
      let totalDark = 0;

      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (!qr.isDark(r, c)) continue;

          totalDark++;
          const posX = (c * cellSize) - halfWidth + (cellSize / 2);
          const posZ = (r * cellSize) - halfWidth + (cellSize / 2);

          // Check if this module is in the 3 corner finder patterns (7x7 squares)
          const isTopLeftFinder = (r < 8 && c < 8);
          const isTopRightFinder = (r < 8 && c >= count - 8);
          const isBottomLeftFinder = (r >= count - 8 && c < 8);
          const isFinder = isTopLeftFinder || isTopRightFinder || isBottomLeftFinder;

          // Radial distance from center (for tree geometry)
          const distToCenter = Math.hypot(posX, posZ);

          // Center modules form the brown/black wooden TRUNK
          // Surrounding dark modules form the green/colored foliage canopy
          const isTrunk = !isFinder && (distToCenter < 1.7 || (Math.abs(posX) < 0.9 && Math.abs(posZ) < 0.9));

          // 1. Flat 2D QR coordinates (Target for QR Mode)
          const flatPos = new THREE.Vector3(posX, 0.14, posZ);
          const flatScale = new THREE.Vector3(1, 1, 1);

          // 2. 3D Tree coordinates (Target for 3D Tree Mode)
          let treePos, treeScale, color;

          if (isFinder) {
            // Finder patterns stay cleanly on ground
            treePos = new THREE.Vector3(posX, 0.16, posZ);
            treeScale = new THREE.Vector3(1, 1, 1);
            color = new THREE.Color(theme.leafColors[0]);
          } else if (isTrunk) {
            // TRUNK: Stacks vertically from Y=0.5 up to Y=7.5 (TALL like ICQR)
            const trunkHeight = 1.0 + (1 - (distToCenter / 1.7)) * 6.5 + Math.random() * 0.8;
            treePos = new THREE.Vector3(posX * 0.75, trunkHeight, posZ * 0.75);
            treeScale = new THREE.Vector3(1.1, 1.4, 1.1);
            color = new THREE.Color(theme.trunkColor); // Brown/black wooden bark!
          } else {
            // CANOPY: Expansive, voluminous lush foliage dome (TALL & WIDE like ICQR)
            // Normalized radius for dome curve
            const maxR = totalWidth * 0.44;
            const normR = Math.min(1.0, distToCenter / maxR);
            const domeHeight = 5.2 + Math.sqrt(Math.max(0, 1 - normR * normR)) * 4.6 + (Math.sin(posX * 2 + posZ * 3) * 0.7);
            
            // Canopy branches out wider than base
            const spreadFactor = 0.88 + (domeHeight / 9.0) * 0.25;
            treePos = new THREE.Vector3(posX * spreadFactor, domeHeight, posZ * spreadFactor);
            treeScale = new THREE.Vector3(1.2, 1.35, 1.2);

            // Varied mosaic leaf shades (matching Screenshot 1)
            const leafPalette = theme.leafColors;
            const pick = leafPalette[(r * 5 + c * 11) % leafPalette.length];
            color = new THREE.Color(pick);
          }

          this.moduleData.push({
            flatPos,
            flatScale,
            treePos,
            treeScale,
            currentPos: treePos.clone(),
            color,
            isTrunk,
            isFinder
          });
        }
      }

      // Single InstancedMesh for all modules (60 FPS on all devices)
      const boxGeom = new THREE.BoxGeometry(cellSize * 0.94, 0.28, cellSize * 0.94);
      this.moduleMat = new THREE.MeshStandardMaterial({
        roughness: 0.45,
        metalness: 0.1
      });

      this.instancedMesh = new THREE.InstancedMesh(boxGeom, this.moduleMat, totalDark);
      this.instancedMesh.castShadow = true;
      this.instancedMesh.receiveShadow = true;

      const dummy = new THREE.Object3D();
      for (let i = 0; i < this.moduleData.length; i++) {
        const m = this.moduleData[i];
        dummy.position.copy(m.treePos);
        dummy.scale.copy(m.treeScale);
        dummy.updateMatrix();

        this.instancedMesh.setMatrixAt(i, dummy.matrix);
        this.instancedMesh.setColorAt(i, m.color);
      }

      this.instancedMesh.instanceMatrix.needsUpdate = true;
      if (this.instancedMesh.instanceColor) {
        this.instancedMesh.instanceColor.needsUpdate = true;
      }
      this.treeModulesGroup.add(this.instancedMesh);
    }

    setTheme(themeKey) {
      if (!THEMES[themeKey]) return;
      this.currentThemeKey = themeKey;
      const t = THEMES[themeKey];

      // Update UI active buttons
      this.container.querySelectorAll(".qr-tree-theme-btn").forEach(btn => {
        btn.classList.toggle("qr-tree-theme-btn--active", btn.getAttribute("data-theme") === themeKey);
      });

      // Update lights
      if (this.ambientLight) this.ambientLight.color.setHex(t.ambient);
      if (this.sunLight) this.sunLight.color.setHex(t.sun);

      // Re-generate QR Tree
      const ch = this.channels[this.currentChannelKey];
      if (ch && ch.url) {
        this.generateQrTree(ch.url);
      }
    }

    setChannel(channelKey) {
      const ch = this.channels[channelKey];
      if (!ch) return;
      this.currentChannelKey = channelKey;

      this.container.querySelectorAll(".qr-tree-pill").forEach(pill => {
        const isMatch = pill.getAttribute("data-channel") === channelKey;
        pill.classList.toggle("qr-tree-pill--active", isMatch);
        pill.setAttribute("aria-selected", String(isMatch));
      });

      if (this.urlText) {
        let displayUrl = ch.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
        this.urlText.textContent = displayUrl;
      }
      if (this.urlIcon) this.urlIcon.textContent = ch.icon || "🔗";
      if (this.openBtn) this.openBtn.href = ch.url;

      this.generateQrTree(ch.url);
    }

    toggleScanMode() {
      this.isScanMode = !this.isScanMode;

      if (this.isScanMode) {
        // Switch to QR Scan Mode (Flatten Tree into QR code + Overhead Camera)
        this.targetProgress = 1.0;
        this.desiredCamPos.copy(this.scanCamPos);
        this.desiredLookAt.copy(this.scanLookAt);

        this.scanLabel.textContent = "3D Tree";
        this.scanIcon.textContent = "🌳";
        this.scanToggle.classList.add("qr-tree-btn--active");

        this.canvasCtaText.textContent = "Tap to see the tree";
        this.canvasCtaIcon.textContent = "🌳";
        this.dragHint.classList.add("qr-tree-drag-hint--hidden");
      } else {
        // Switch back to 3D Tree Mode
        this.targetProgress = 0.0;
        this.desiredCamPos.copy(this.defaultCamPos);
        this.desiredLookAt.copy(this.defaultLookAt);

        this.scanLabel.textContent = "Scan View";
        this.scanIcon.textContent = "🎯";
        this.scanToggle.classList.remove("qr-tree-btn--active");

        this.canvasCtaText.textContent = "Tap the tree to see QR code";
        this.canvasCtaIcon.textContent = "🎯";
        this.dragHint.classList.remove("qr-tree-drag-hint--hidden");
      }
    }

    bindEvents() {
      this.container.addEventListener("click", e => {
        // Social channel selector
        const pill = e.target.closest(".qr-tree-pill");
        if (pill) {
          const ch = pill.getAttribute("data-channel");
          if (ch) this.setChannel(ch);
          return;
        }

        // Theme / Season buttons
        const themeBtn = e.target.closest(".qr-tree-theme-btn");
        if (themeBtn) {
          const t = themeBtn.getAttribute("data-theme");
          if (t) this.setTheme(t);
          return;
        }

        // Scan Mode Toggle (Top-right button & Central Canvas CTA pill)
        if (e.target.closest("#qr-scan-toggle") || e.target.closest("#qr-canvas-cta")) {
          this.toggleScanMode();
          return;
        }

        // Copy link button
        if (e.target.closest("#qr-copy-btn")) {
          const ch = this.channels[this.currentChannelKey];
          if (ch && ch.url) {
            navigator.clipboard.writeText(ch.url).then(() => {
              const orig = this.copyLabel.textContent;
              this.copyLabel.textContent = "Copied!";
              this.copyBtn.classList.add("qr-tree-btn--success");
              setTimeout(() => {
                this.copyLabel.textContent = orig;
                this.copyBtn.classList.remove("qr-tree-btn--success");
              }, 2000);
            });
          }
        }
      });

      // Canvas Drag / Orbit
      const onPointerDown = e => {
        if (this.isScanMode) return;
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
        this.lastInteractionTime = Date.now();
        this.dragHint.classList.add("qr-tree-drag-hint--hidden");
      };

      const onPointerMove = e => {
        if (!this.isDragging || this.isScanMode) return;
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetRotationY += deltaX * 0.008;
        this.targetRotationX = Math.max(-0.25, Math.min(0.55, this.targetRotationX + deltaY * 0.005));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
        this.lastInteractionTime = Date.now();
      };

      const onPointerUp = () => {
        this.isDragging = false;
      };

      this.canvas.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      // Tap tree to toggle QR / Tree mode directly
      this.canvas.addEventListener("click", () => {
        if (!this.isDragging) {
          this.toggleScanMode();
        }
      });

      // Resize & Viewport observers
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.viewport);
      }

      if (typeof IntersectionObserver !== "undefined") {
        this.intersectObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            this.isInViewport = entry.isIntersecting;
          });
        }, { threshold: 0.1 });
        this.intersectObserver.observe(this.container);
      }
    }

    onResize() {
      if (!this.viewport || !this.renderer || !this.camera) return;
      const rect = this.viewport.getBoundingClientRect();
      const w = rect.width || 440;
      const h = 410;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    startRenderLoop() {
      const dummy = new THREE.Object3D();

      const animate = () => {
        if (this.isDestroyed) return;
        requestAnimationFrame(animate);

        if (!this.isInViewport) return;

        const now = Date.now();

        // Subtle idle rotation when in 3D mode
        if (!this.isDragging && !this.isScanMode && (now - this.lastInteractionTime > 2500)) {
          this.targetRotationY += 0.003;
        }

        // Smooth rotation interpolation
        if (this.isScanMode) {
          this.rotationY += (0 - this.rotationY) * 0.08;
          this.rotationX += (0 - this.rotationX) * 0.08;
        } else {
          this.rotationY += (this.targetRotationY - this.rotationY) * 0.08;
          this.rotationX += (this.targetRotationX - this.rotationX) * 0.08;
        }

        this.worldGroup.rotation.y = this.rotationY;
        this.worldGroup.rotation.x = this.rotationX;

        // Morph Progress Animation (Smoothly merges tree into QR code)
        const prevProgress = this.morphProgress;
        this.morphProgress += (this.targetProgress - this.morphProgress) * 0.085;

        // If progress changed, update all voxel module positions
        if (Math.abs(prevProgress - this.morphProgress) > 0.001 && this.instancedMesh && this.moduleData) {
          const t = this.morphProgress; // 0 = 3D tree, 1 = Flat QR

          for (let i = 0; i < this.moduleData.length; i++) {
            const m = this.moduleData[i];

            // Lerp position between 3D tree and flat ground QR module
            const posX = THREE.MathUtils.lerp(m.treePos.x, m.flatPos.x, t);
            const posY = THREE.MathUtils.lerp(m.treePos.y, m.flatPos.y, t);
            const posZ = THREE.MathUtils.lerp(m.treePos.z, m.flatPos.z, t);

            // Scale lerps flat
            const scaleX = THREE.MathUtils.lerp(m.treeScale.x, m.flatScale.x, t);
            const scaleY = THREE.MathUtils.lerp(m.treeScale.y, m.flatScale.y, t);
            const scaleZ = THREE.MathUtils.lerp(m.treeScale.z, m.flatScale.z, t);

            dummy.position.set(posX, posY, posZ);
            dummy.scale.set(scaleX, scaleY, scaleZ);
            dummy.updateMatrix();

            this.instancedMesh.setMatrixAt(i, dummy.matrix);
          }
          this.instancedMesh.instanceMatrix.needsUpdate = true;

          // In QR mode, hide perimeter grass so QR borders are 100% clean
          if (this.grassGroup) {
            this.grassGroup.visible = t < 0.6;
          }
        }

        // Camera smooth transition
        this.currentCamPos.lerp(this.desiredCamPos, 0.08);
        this.camera.position.copy(this.currentCamPos);

        this.currentLookAt.lerp(this.desiredLookAt, 0.08);
        this.camera.lookAt(this.currentLookAt);

        this.renderer.render(this.scene, this.camera);
      };

      animate();
    }

    destroy() {
      this.isDestroyed = true;
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.intersectObserver) this.intersectObserver.disconnect();
      if (this.renderer) this.renderer.dispose();
    }
  }

  const initQrTree = (containerId, options = {}) => {
    const el = document.getElementById(containerId);
    if (!el) return null;
    return new IcqrMagicTreeComponent(el, options);
  };

  window.PortfolioApp.ui.initQrTree = initQrTree;
})();
