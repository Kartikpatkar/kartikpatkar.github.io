(() => {
  "use strict";

  window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

  // Storage keys
  const STORAGE_KEY_TOKEN = "ifm_api_key";
  const STORAGE_KEY_MODEL = "ifm_model";
  const DEFAULT_MODEL = "IFM/K2-Horizon-375B-A23B";
  const IFM_ENDPOINT = "https://api.ifm.ai/v1/chat/completions";

  // System prompt generation using dynamic portfolio content
  const buildSystemPrompt = () => {
    const content = window.PORTFOLIO_CONTENT || {};
    const site = content.site || {};
    const hero = content.hero || {};
    const about = content.about || {};
    const experience = content.experience?.items || [];
    const certs = content.certifications?.items || [];
    const projects = content.projects?.items || [];
    const skills = content.skills?.categories || [];

    // Calculate dynamic stats
    const certCount = certs.length || 10;
    const projectCount = projects.length || 9;
    let expYears = "5.5+";
    if (experience.length > 0) {
      const oldest = experience[experience.length - 1];
      if (oldest?.duration) {
        const startPart = oldest.duration.split("-")[0].trim();
        const parsed = new Date(startPart);
        if (!isNaN(parsed.getTime())) {
          const yrs = Math.floor((Date.now() - parsed.getTime()) / (365.25 * 24 * 3600 * 1000));
          expYears = `${yrs}+`;
        }
      }
    }

    const projectsSummary = projects.slice(0, 8).map(p => 
      `- ${p.title} (${p.category}): ${p.description || ""} [Tech: ${(p.tags || []).join(", ")}]`
    ).join("\n");

    const expSummary = experience.map(e =>
      `- ${e.role} at ${e.company} (${e.duration}): ${(e.highlights || []).slice(0, 2).join("; ")}`
    ).join("\n");

    const certList = certs.map(c => c.name || c.title).filter(Boolean).join(", ");

    return `You are Kartik Patkar's friendly, concise, and knowledgeable AI Portfolio Companion (Astro Buddy).
Your job is to talk with visitors, answer questions about Kartik's background, skills, certifications, and projects, and GUIDE them around the portfolio website.

KARTIK'S BACKGROUND:
- Role: Salesforce Consultant & Senior Developer (${expYears} years experience).
- Certifications: ${certCount}x Salesforce Certified (${certList}). All passed on 1st attempt.
- Core Specialties: Apex, Lightning Web Components (LWC), Flow, SOQL, Enterprise Architecture, High-throughput REST & Bulk Integrations, CI/CD, Chrome Extensions, Developer Productivity Tools.
- Open Source / Projects: Built ${projectCount}+ tools. Top projects:
${projectsSummary}
- Career Experience:
${expSummary}
- Contact: Email: ${site.email || "kartikkp.assets@gmail.com"}, LinkedIn: ${site.linkedin || ""}, GitHub: ${site.github || ""}, Trailhead: ${site.trailhead || ""}.

WEBSITE SECTIONS AVAILABLE TO NAVIGATE:
- #hero (Home & introduction)
- #about (Summary & background)
- #skills (Technical competencies, Salesforce, devtools, architecture)
- #certifications (10x credentials & details)
- #projects (Featured open-source projects, Chrome extensions, web apps)
- #experience (Career history & enterprise impacts)
- #contact (Message form, email, social links)

CRITICAL INSTRUCTIONS FOR SHOWING THE PORTFOLIO AROUND:
When answering or suggesting a topic, include ONE relevant action tag at the beginning or end of your answer so the page can automatically scroll and interact:
- Navigate to section: [action:navigate, target:#projects, anim:excited]
- Other targets: target:#skills, target:#certifications, target:#experience, target:#about, target:#contact.
- Avatar animations: 'proud', 'excited', 'working', 'curious', 'celebrate', 'happy', 'listening'.
- Special actions: [action:open_resume], [action:copy_email].

STYLE:
- Keep answers concise (2-4 sentences max), direct, and enthusiastic.
- Use natural markdown formatting (bullet points, bold text).
- Always be helpful, authentic, and invite follow-up questions.`;
  };

  // Local fallback knowledge base when IFM token is missing or offline
  const getOfflineReply = (userQuery) => {
    const q = (userQuery || "").toLowerCase();
    const content = window.PORTFOLIO_CONTENT || {};

    if (q.includes("project") || q.includes("build") || q.includes("app") || q.includes("tool")) {
      return {
        text: "Kartik has engineered 9+ open-source tools and Chrome extensions for Salesforce developers, including Apex syntax enhancers, SOQL tooling, and bulk migration utilities! Check them out in the Projects showcase below.",
        action: { target: "#projects", anim: "excited" }
      };
    }
    if (q.includes("cert") || q.includes("architect") || q.includes("qualification")) {
      return {
        text: "Kartik is a 10x Salesforce Certified Consultant & Application Architect. He passed every single certification on his very first attempt, covering Data, Sharing & Visibility, and Platform Development!",
        action: { target: "#certifications", anim: "proud" }
      };
    }
    if (q.includes("skill") || q.includes("apex") || q.includes("lwc") || q.includes("tech") || q.includes("stack")) {
      return {
        text: "Kartik specializes in scalable Apex architectures, reactive Lightning Web Components (LWCs), REST/SOAP bulk integrations, and robust CI/CD automation pipelines for enterprise clients.",
        action: { target: "#skills", anim: "working" }
      };
    }
    if (q.includes("experience") || q.includes("work") || q.includes("career") || q.includes("company") || q.includes("job")) {
      return {
        text: "With over 5.5+ years as a Salesforce Consultant and Senior Developer, Kartik has architected multi-cloud systems, refactored high-volume governor limit bottlenecks, and led enterprise digital transformations.",
        action: { target: "#experience", anim: "listening" }
      };
    }
    if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
      return {
        text: "You can download Kartik's Resume right from the header or hero section. Both ATS-friendly and Modern designer PDF formats are available!",
        action: { target: "#hero", anim: "happy" }
      };
    }
    if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach") || q.includes("message")) {
      return {
        text: "You can reach Kartik directly at kartikkp.assets@gmail.com, or drop a quick note through the contact form down below!",
        action: { target: "#contact", anim: "happy" }
      };
    }

    return {
      text: "I'm Kartik's AI companion! Ask me about his projects, 10x certifications, enterprise experience, or let me guide you to any section of his portfolio.",
      action: { target: "#about", anim: "curious" }
    };
  };

  class AvatarChat {
    constructor(companionController) {
      this.companion = companionController;
      this.history = [];
      this.isOpen = false;
      this.isBusy = false;
      this.token = localStorage.getItem(STORAGE_KEY_TOKEN) || "";
      const storedModel = localStorage.getItem(STORAGE_KEY_MODEL);
      this.model = (!storedModel || storedModel === "k2-horizon") ? DEFAULT_MODEL : storedModel;

      this.initDom();
      this.bindEvents();
    }

    initDom() {
      const thoughtWrapper = document.getElementById("avatar-thought-wrapper");
      const bubble = document.getElementById("avatar-bubble");
      if (!thoughtWrapper || !bubble) return;

      // 1. Add "Ask AI 💬" button to standard thought bubble
      if (!document.getElementById("avatar-open-chat-btn")) {
        const bubbleActions = document.createElement("div");
        bubbleActions.className = "avatar-companion__bubbleActions";
        
        const chatBtn = document.createElement("button");
        chatBtn.id = "avatar-open-chat-btn";
        chatBtn.type = "button";
        chatBtn.className = "avatar-companion__chatOpenBtn";
        chatBtn.innerHTML = `<span>💬</span><span>Ask AI</span>`;
        chatBtn.setAttribute("aria-label", "Open interactive AI chat");

        // Insert before standard action or append
        bubble.appendChild(chatBtn);
      }

      // 2. Create the Expanded Chat Panel inside thoughtWrapper
      let chatBox = document.getElementById("avatar-chat-box");
      if (!chatBox) {
        chatBox = document.createElement("div");
        chatBox.id = "avatar-chat-box";
        chatBox.className = "avatar-companion__chatBox";
        chatBox.hidden = true;
        chatBox.setAttribute("role", "dialog");
        chatBox.setAttribute("aria-label", "Kartik's AI Portfolio Guide");

        chatBox.innerHTML = `
          <div class="avatar-chat__header">
            <div class="avatar-chat__titleGroup">
              <span class="avatar-chat__statusDot" aria-hidden="true"></span>
              <div>
                <h3 class="avatar-chat__title">Astro Companion AI</h3>
                <span class="avatar-chat__subtitle" id="avatar-chat-model-label">${this.model}</span>
              </div>
            </div>
            <div class="avatar-chat__headerActions">
              <button type="button" class="avatar-chat__iconBtn" id="avatar-chat-settings-btn" title="Configure IFM Token & Model" aria-label="Settings">⚙️</button>
              <button type="button" class="avatar-chat__iconBtn" id="avatar-chat-close-btn" title="Minimize Chat" aria-label="Minimize">×</button>
            </div>
          </div>

          <!-- Token Settings Drawer (Collapsible) -->
          <div class="avatar-chat__settingsDrawer" id="avatar-chat-settings-drawer" hidden>
            <form class="avatar-chat__settingsContent" id="avatar-chat-settings-form" onsubmit="return false;">
              <input type="text" name="username" value="kartik" autocomplete="username" style="display:none;" aria-hidden="true" tabindex="-1">
              <label class="avatar-chat__label" for="avatar-chat-token-input">
                <span>IFM API Key</span>
                <a href="https://platform.ifm.ai" target="_blank" rel="noopener" class="avatar-chat__link">Get Free Key</a>
              </label>
              <input type="password" id="avatar-chat-token-input" class="avatar-chat__input avatar-chat__input--token" placeholder="Bearer ifm_..." autocomplete="current-password" value="${this.token}">
              
              <label class="avatar-chat__label" for="avatar-chat-model-input">Model</label>
              <select id="avatar-chat-model-input" class="avatar-chat__input avatar-chat__select">
                <option value="IFM/K2-Horizon-375B-A23B" ${this.model === "IFM/K2-Horizon-375B-A23B" ? "selected" : ""}>IFM/K2-Horizon-375B-A23B (Flagship)</option>
                <option value="IFM/Jais-3-MoVA-36B-A4B" ${this.model === "IFM/Jais-3-MoVA-36B-A4B" ? "selected" : ""}>IFM/Jais-3-MoVA-36B-A4B (Fast 36B)</option>
              </select>
              
              <div class="avatar-chat__settingsButtons">
                <button type="submit" class="avatar-chat__btn avatar-chat__btn--primary" id="avatar-chat-save-token-btn">Save Key</button>
                <button type="button" class="avatar-chat__btn avatar-chat__btn--secondary" id="avatar-chat-clear-token-btn">Clear</button>
              </div>
              <p class="avatar-chat__tokenNote">Stored securely in browser localStorage only. Used for client-side chat.</p>
            </form>
          </div>

          <!-- Messages Scroll View -->
          <div class="avatar-chat__messages" id="avatar-chat-messages" role="log" aria-live="polite">
            <div class="avatar-chat__msg avatar-chat__msg--bot">
              <div class="avatar-chat__bubble">
                <p>Hey there! 👋 I'm Kartik's AI companion. Ask me anything about his work, 10x certifications, projects, or let me show you around!</p>
              </div>
            </div>
          </div>

          <!-- Suggestion Chips -->
          <div class="avatar-chat__chips" id="avatar-chat-chips">
            <button type="button" class="avatar-chat__chip" data-query="Show me top projects 🚀">Top Projects 🚀</button>
            <button type="button" class="avatar-chat__chip" data-query="What certifications does Kartik have? ☁️">10x Certs ☁️</button>
            <button type="button" class="avatar-chat__chip" data-query="Tell me about Kartik's Salesforce experience 💼">Experience 💼</button>
            <button type="button" class="avatar-chat__chip" data-query="How can I contact Kartik? ✉️">Contact ✉️</button>
          </div>

          <!-- Input Bar -->
          <form class="avatar-chat__inputForm" id="avatar-chat-form">
            <input type="text" id="avatar-chat-user-input" class="avatar-chat__textInput" placeholder="Ask about projects, skills, certs..." autocomplete="off" required>
            <button type="submit" class="avatar-chat__sendBtn" id="avatar-chat-send-btn" aria-label="Send message">
              <svg viewBox="0 0 24 24" class="avatar-chat__sendIcon" aria-hidden="true" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        `;

        thoughtWrapper.appendChild(chatBox);
      }
    }

    bindEvents() {
      const openBtn = document.getElementById("avatar-open-chat-btn");
      const closeBtn = document.getElementById("avatar-chat-close-btn");
      const settingsBtn = document.getElementById("avatar-chat-settings-btn");
      const saveTokenBtn = document.getElementById("avatar-chat-save-token-btn");
      const clearTokenBtn = document.getElementById("avatar-chat-clear-token-btn");
      const form = document.getElementById("avatar-chat-form");
      const chips = document.getElementById("avatar-chat-chips");

      if (openBtn) {
        openBtn.addEventListener("click", () => this.toggleChat(true));
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.toggleChat(false));
      }

      if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
          const drawer = document.getElementById("avatar-chat-settings-drawer");
          if (drawer) drawer.hidden = !drawer.hidden;
        });
      }

      if (saveTokenBtn) {
        saveTokenBtn.addEventListener("click", () => {
          const tokenInput = document.getElementById("avatar-chat-token-input");
          const modelInput = document.getElementById("avatar-chat-model-input");
          const modelLabel = document.getElementById("avatar-chat-model-label");
          
          this.token = (tokenInput?.value || "").trim();
          this.model = (modelInput?.value || "").trim() || DEFAULT_MODEL;

          localStorage.setItem(STORAGE_KEY_TOKEN, this.token);
          localStorage.setItem(STORAGE_KEY_MODEL, this.model);

          if (modelLabel) modelLabel.textContent = this.model;
          const drawer = document.getElementById("avatar-chat-settings-drawer");
          if (drawer) drawer.hidden = true;

          this.appendBotMessage(
            this.token
              ? `✅ Key saved! Connected to **${this.model}**. How can I help you today?`
              : "⚠️ No key entered. Operating in local intelligent demo mode."
          );
        });
      }

      if (clearTokenBtn) {
        clearTokenBtn.addEventListener("click", () => {
          this.token = "";
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          const tokenInput = document.getElementById("avatar-chat-token-input");
          if (tokenInput) tokenInput.value = "";
          this.appendBotMessage("API Key cleared. Reverted to local portfolio demo mode.");
        });
      }

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = document.getElementById("avatar-chat-user-input");
          const text = (input?.value || "").trim();
          if (!text || this.isBusy) return;
          input.value = "";
          this.handleSendMessage(text);
        });
      }

      if (chips) {
        chips.addEventListener("click", (e) => {
          const chip = e.target.closest(".avatar-chat__chip");
          if (!chip || this.isBusy) return;
          const query = chip.getAttribute("data-query") || chip.textContent;
          this.handleSendMessage(query);
        });
      }
    }

    toggleChat(open) {
      this.isOpen = typeof open === "boolean" ? open : !this.isOpen;
      const chatBox = document.getElementById("avatar-chat-box");
      const bubble = document.getElementById("avatar-bubble");

      if (chatBox) chatBox.hidden = !this.isOpen;
      if (bubble) bubble.hidden = this.isOpen;

      if (this.isOpen) {
        if (this.companion && typeof this.companion.onChatOpen === "function") {
          this.companion.onChatOpen();
        }
        if (this.companion && typeof this.companion.playAnim === "function") {
          this.companion.playAnim("excited", 2200);
        }
        const input = document.getElementById("avatar-chat-user-input");
        setTimeout(() => input?.focus(), 150);
        this.scrollToBottom();

        // If no token exists on first launch, hint settings
        if (!this.token && !this._warnedToken) {
          this._warnedToken = true;
          this.appendBotMessage(
            "💡 *Tip: To connect to live IFM AI, tap ⚙️ above and paste your IFM token. I also answer questions in local demo mode!*"
          );
        }
      } else {
        if (this.companion && typeof this.companion.onChatClose === "function") {
          this.companion.onChatClose();
        }
        if (this.companion && typeof this.companion.playAnim === "function") {
          this.companion.playAnim("idle", 0);
        }
      }
    }

    scrollToBottom() {
      requestAnimationFrame(() => {
        const container = document.getElementById("avatar-chat-messages");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }

    appendUserMessage(text) {
      const container = document.getElementById("avatar-chat-messages");
      if (!container) return;

      const div = document.createElement("div");
      div.className = "avatar-chat__msg avatar-chat__msg--user";
      div.innerHTML = `<div class="avatar-chat__bubble"><p>${this.escapeHtml(text)}</p></div>`;
      container.appendChild(div);
      this.scrollToBottom();
    }

    appendBotMessage(rawText) {
      const container = document.getElementById("avatar-chat-messages");
      if (!container) return;

      // Parse and execute actions
      const { cleanText, actions } = this.parseActions(rawText);
      actions.forEach(act => this.executeAction(act));

      const div = document.createElement("div");
      div.className = "avatar-chat__msg avatar-chat__msg--bot";
      div.innerHTML = `<div class="avatar-chat__bubble">${this.renderMarkdown(cleanText)}</div>`;
      container.appendChild(div);
      this.scrollToBottom();
    }

    showTyping() {
      const container = document.getElementById("avatar-chat-messages");
      if (!container) return;

      const typing = document.createElement("div");
      typing.id = "avatar-chat-typing";
      typing.className = "avatar-chat__msg avatar-chat__msg--bot avatar-chat__msg--typing";
      typing.innerHTML = `
        <div class="avatar-chat__bubble">
          <span class="avatar-chat__dot"></span>
          <span class="avatar-chat__dot"></span>
          <span class="avatar-chat__dot"></span>
        </div>
      `;
      container.appendChild(typing);
      this.scrollToBottom();

      if (this.companion && typeof this.companion.playAnim === "function") {
        this.companion.playAnim("curious", 4000);
      }
    }

    removeTyping() {
      const el = document.getElementById("avatar-chat-typing");
      if (el) el.remove();
    }

    async handleSendMessage(userText) {
      this.appendUserMessage(userText);
      this.history.push({ role: "user", content: userText });
      this.isBusy = true;
      this.showTyping();

      try {
        if (!this.token) {
          // Local fallback simulation
          await new Promise(r => setTimeout(r, 650));
          const fallback = getOfflineReply(userText);
          const replyText = fallback.action 
            ? `${fallback.text} [action:navigate, target:${fallback.action.target}, anim:${fallback.action.anim}]`
            : fallback.text;
          
          this.removeTyping();
          this.appendBotMessage(replyText);
          this.history.push({ role: "assistant", content: replyText });
          return;
        }

        // Live IFM API Call
        const systemPrompt = buildSystemPrompt();
        const messages = [
          { role: "system", content: systemPrompt },
          ...this.history.slice(-8)
        ];

        const authHeader = this.token.startsWith("Bearer ") ? this.token : `Bearer ${this.token}`;
        let targetModel = this.model || DEFAULT_MODEL;

        const callApi = async (modelName, customMessages = messages) => {
          return fetch(IFM_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": authHeader
            },
            body: JSON.stringify({
              model: modelName,
              messages: customMessages,
              temperature: 0.7,
              max_tokens: 450
            })
          });
        };

        let response = null;
        let lastError = null;

        // Attempt 1: Call requested model
        try {
          response = await callApi(targetModel);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (e1) {
          lastError = e1;
          // Attempt 2: If K2-Horizon fails/503s, try Jais-3 36B
          if (targetModel.includes("K2-Horizon")) {
            try {
              console.warn("IFM K2-Horizon unavailable, retrying with Jais-3-MoVA-36B...", e1);
              targetModel = "IFM/Jais-3-MoVA-36B-A4B";
              response = await callApi(targetModel);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
            } catch (e2) {
              lastError = e2;
            }
          }
        }

        // Attempt 3: If still failing, retry with combined user prompt format (some open models reject system role)
        if (!response || !response.ok) {
          try {
            console.warn("Retrying with user-only prompt format...");
            const userOnlyMessages = [
              {
                role: "user",
                content: `${systemPrompt}\n\nVisitor Question: ${userText}`
              }
            ];
            const fallbackResp = await callApi("IFM/Jais-3-MoVA-36B-A4B", userOnlyMessages);
            if (fallbackResp.ok) {
              response = fallbackResp;
            }
          } catch (e3) {
            lastError = e3;
          }
        }

        if (!response || !response.ok) {
          const errData = response ? await response.json().catch(() => ({})) : {};
          throw new Error(errData.error?.message || lastError?.message || "Service unavailable");
        }

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "I couldn't process that response.";

        this.removeTyping();
        this.appendBotMessage(botReply);
        this.history.push({ role: "assistant", content: botReply });

      } catch (err) {
        this.removeTyping();
        console.warn("Avatar IFM Chat Error:", err);
        // Fallback to local answering on error
        const fallback = getOfflineReply(userText);
        const errorReason = err.message.includes("503") || err.message.includes("Failed to fetch")
          ? "IFM server temporarily unavailable"
          : err.message;
        const errorNote = `*(Note: ${errorReason} - answered via local portfolio knowledge)*\n\n${fallback.text} [action:navigate, target:${fallback.action.target}, anim:${fallback.action.anim}]`;
        this.appendBotMessage(errorNote);
      } finally {
        this.isBusy = false;
      }
    }

    parseActions(text) {
      const actions = [];
      const actionRegex = /\[action:([a-zA-Z0-9_-]+)(?:,\s*([^\]]*))?\]/gi;

      const cleanText = text.replace(actionRegex, (match, actionType, paramsString) => {
        const params = {};
        if (paramsString) {
          const pairs = paramsString.split(",");
          pairs.forEach(p => {
            const [k, v] = p.split(":").map(s => s?.trim());
            if (k && v) params[k] = v;
          });
        }
        actions.push({ type: actionType.toLowerCase(), params });
        return ""; // remove from visible text
      }).trim();

      return { cleanText, actions };
    }

    executeAction(action) {
      const { type, params } = action;

      // 1. Navigation Action (Show Around)
      if (type === "navigate" || type === "scroll") {
        const targetId = params.target || params.id;
        if (targetId) {
          const selector = targetId.startsWith("#") ? targetId : `#${targetId}`;
          const targetEl = document.querySelector(selector);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            
            // Visual highlight ring without forced reflow
            targetEl.classList.remove("avatar-highlight-pulse");
            requestAnimationFrame(() => {
              targetEl.classList.add("avatar-highlight-pulse");
            });
            setTimeout(() => targetEl.classList.remove("avatar-highlight-pulse"), 3500);
          }
        }
      }

      // 2. Avatar Animation Sync
      const anim = params.anim || (type === "anim" ? params.name : null);
      if (anim && this.companion && typeof this.companion.playAnim === "function") {
        this.companion.playAnim(anim, 4200);
      }

      // 3. Open Resume
      if (type === "open_resume") {
        const resumeBtn = document.getElementById("resume-trigger") || document.querySelector("a[href*='Resume.pdf']");
        if (resumeBtn) resumeBtn.click();
      }

      // 4. Copy Email
      if (type === "copy_email") {
        const copyBtn = document.querySelector(".contact-card__copyBtn");
        if (copyBtn) copyBtn.click();
      }
    }

    escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    renderMarkdown(text) {
      let html = this.escapeHtml(text);
      // bold **text**
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // italic *text*
      html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
      // bullet lists
      html = html.replace(/(?:^|\n)- (.*?)(?=\n|$)/g, "<li>$1</li>");
      html = html.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
      // line breaks
      html = html.replace(/\n\n/g, "</p><p>");
      html = html.replace(/\n/g, "<br>");
      return `<p>${html}</p>`;
    }
  }

  window.PortfolioApp.ui.AvatarChat = AvatarChat;
})();
