/**
 * ============================================================================
 * BUSINESS FIT BY BUSY MAMAS - MAIN APPLICATION (app.js)
 * ============================================================================
 */

(function () {
  const STORAGE_CFG_KEY = "busy_mamas_admin_config_v1";
  const STORAGE_LEADS_KEY = "busy_mamas_local_leads_v1";
  const STORAGE_PROGRESS_KEY = "busy_mamas_saved_progress_v1";

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getFreshProfile(currencyCode = "USD") {
    return {
      currency: currencyCode,
      incomeGoal: 5000,
      timeline: "",
      hoursPerWeek: 0,
      hoursLabel: "",
      scheduleRhythm: "",
      backgrounds: [],
      licensingOpenness: "",
      skills: [],
      skillDirection: "",
      enjoyedActivities: [],
      livedExperiences: [],
      workStyle: "",
      budget: null,
      dealbreakers: [],
      customNote: "",
      firstName: "",
      email: "",
      checkInCadence: "weekly"
    };
  }

  function getFreshGrowthProfile(currencyCode = "USD") {
    return {
      currency: currencyCode,
      businessType: "",
      subNicheId: "",
      specificNiche: "",
      targetAudience: "",
      primaryOffer: "",
      revenueStageId: "",
      currentRevenue: 2000,
      targetRevenue: 6000,
      profitMarginId: "",
      offerStructure: "",
      priceConfidence: "",
      avgPriceTierId: "",
      leadSources: [],
      leadSource: "",
      conversionIssue: "",
      repeatRateId: "",
      retentionSystem: "",
      currentHours: null,
      maxDesiredHours: null,
      deliveryDrain: "",
      primaryGoal: "",
      growthBudget: null,
      customNote: "",
      firstName: "",
      email: "",
      checkInCadence: "weekly-checkins"
    };
  }

  const state = {
    view: "home", // "home" (Portal Landing / Home Screen) or "assessment" (Active Assessment)
    mode: "fit", // "fit" (Business Fit) or "growth" (Business Growth Assessment)
    step: 1, // 1..6: 6-Step Deep-Fit Assessment, 7: Name & Email Gate, 8: Recommendations & Action Plan
    subStep: 1, // 1..N: Typeform-style sub-question micro-step
    growthStep: 1, // 1..6: 6-Step Growth Diagnostic, 7: Name & Email Gate, 8: Growth Findings & 30-Day Plan
    growthSubStep: 1, // 1..N: Typeform-style growth sub-question micro-step
    totalQuizSteps: 6,
    vaultIdeas: [...(window.DEFAULT_VAULT_IDEAS || [])],
    vaultSource: "Built-in Vault (Connect Google Sheet for all 200+ profiles)",
    isSheetConnected: false,
    shownStories: {}, // Track which pop-up stories have been shown this session
    growthShownStories: {},
    pendingNextStep: null,
    profile: getFreshProfile("USD"),
    growthProfile: getFreshGrowthProfile("USD"),
    growthAnalysis: null,
    growthActiveTabs: { 0: "math", 1: "math", 2: "math" },
    completedTasks: [],
    topMatches: [],
    playbooks: [],
    runnerUpMatches: [],
    runnerUpPlaybooks: [],
    expandedRunnerUps: {},
    selectedIdeaIdx: null,
    allRankedMatches: [],
    activeTabs: { 0: "overview", 1: "overview", 2: "overview", 3: "overview", 4: "overview" },
    validationError: "",
    limitNotice: "",
    aiEnhancing: false,
    aiEnhanced: false,
    config: { ...(window.APP_CONFIG || {}) }
  };

  function updateModeHeroAndNav() {
    const isHome = state.view === "home";
    const isGrowth = state.mode === "growth";

    const topNavHomeBtn = document.getElementById("topNavHomeBtn");
    if (topNavHomeBtn) {
      topNavHomeBtn.style.display = isHome ? "none" : "inline-flex";
    }

    const topModePills = document.getElementById("topModePills");
    if (topModePills) {
      topModePills.style.display = isHome ? "none" : "";
      topModePills.querySelectorAll("[data-switch-mode]").forEach((btn) => {
        const m = btn.getAttribute("data-switch-mode");
        const isCurrent = m === state.mode;
        btn.classList.toggle("active", isCurrent);
        btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });
    }

    const brandLogoText = document.getElementById("brandLogoText");
    if (brandLogoText) {
      if (isHome) {
        brandLogoText.innerHTML = `Business Tools <em>by Busy Mamas</em>`;
      } else {
        brandLogoText.innerHTML = isGrowth
          ? `Business Growth <em>by Busy Mamas</em>`
          : `Business Fit <em>by Busy Mamas</em>`;
      }
    }

    const btnHeroSwitch = document.getElementById("btnHeroSwitchTool");
    if (btnHeroSwitch) {
      btnHeroSwitch.textContent = isGrowth
        ? "Switch to Business Fit Assessment →"
        : "Switch to Business Growth Assessment →";
      btnHeroSwitch.setAttribute("data-switch-to", isGrowth ? "fit" : "growth");
    }

    const title = document.getElementById("heroTitle");
    if (title) {
      title.innerHTML = isGrowth
        ? `Grow Your Profit &amp; Customers <em>Without Working More Hours</em>`
        : `<span class="hero-line-1">Find the Right Business for Your</span> <em>Skills, Time &amp; Income Goal</em>`;
    }

    const subtitle = document.getElementById("heroSubtitle");
    if (subtitle) {
      subtitle.textContent = isGrowth
        ? "Already running a business? Answer 6 simple questions to see what is holding back your sales, your top 3 priorities, and a clear 30-day action plan."
        : "Answer 6 practical questions to get 3 tailored business ideas, clear income math, and a step-by-step action plan.";
    }
  }

  function navigateToHome() {
    state.view = "home";
    const url = new URL(window.location.href);
    url.searchParams.delete("mode");
    url.searchParams.delete("view");
    try {
      history.pushState({ view: "home" }, "", url.pathname + (url.search ? url.search : ""));
    } catch (_) {}
    updateModeHeroAndNav();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToAssessment(newMode) {
    switchToolMode(newMode);
  }

  function switchToolMode(newMode) {
    const target = newMode === "growth" ? "growth" : "fit";
    state.mode = target;
    state.view = "assessment";
    state.validationError = "";
    state.limitNotice = "";
    if (target === "growth") {
      state.growthProfile.currency = state.profile.currency || state.growthProfile.currency || "USD";
      if (!state.growthProfile.firstName && state.profile.firstName) {
        state.growthProfile.firstName = state.profile.firstName;
      }
      if (!state.growthProfile.email && state.profile.email) {
        state.growthProfile.email = state.profile.email;
      }
    } else {
      state.profile.currency = state.growthProfile.currency || state.profile.currency || "USD";
    }
    const url = new URL(window.location.href);
    url.searchParams.set("mode", target);
    try {
      history.pushState({ view: "assessment", mode: target }, "", url.toString());
    } catch (_) {}
    updateModeHeroAndNav();
    saveUserProgress();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderHomeScreen() {
    const hasFitProgress = state.step > 1 && state.step <= 6;
    const isFitComplete = state.step >= 8 && state.topMatches && state.topMatches.length > 0;

    const hasGrowthProgress = state.growthStep > 1 && state.growthStep <= 6;
    const isGrowthComplete = state.growthStep >= 8 && Boolean(state.growthAnalysis);

    return `
      <div class="home-screen-shell">
        <section class="home-hero">
          <div class="hero-ambient-orb orb-1"></div>
          <div class="hero-ambient-orb orb-2"></div>
          <div class="home-hero-inner">
            <div class="home-badge-kicker">
              <span>Busy Mamas Network · Free Business Tools</span>
            </div>
            <h1 class="home-hero-title">
              Business Clarity Built for the
              <em>Realities of Motherhood</em>
            </h1>
            <p class="home-hero-subtitle">
              Building a business as a mother requires a different playbook. You need real income without sacrificing nap times, family dinners, or your peace of mind. Choose the assessment that matches your season right now:
            </p>
          </div>
        </section>

        <div class="home-tools-grid">
          <!-- TOOL 1: BUSINESS FIT -->
          <div class="home-tool-card fit-card" id="homeCardFit">
            <div class="home-tool-top">
              <div class="home-tool-badges">
                <span class="home-tag-pill tag-pink">Starting or Pivoting</span>
                <span class="home-time-pill">~4 min assessment</span>
              </div>
              <h2 class="home-tool-title">Business Fit Assessment</h2>
              <p class="home-tool-hook">
                Find the right business model for your exact professional background, schedule rhythm, and monthly income target.
              </p>
            </div>

            <div class="home-tool-features">
              <div class="home-feature-item">
                <span class="home-feature-icon">✓</span>
                <span><strong>3 Curated Business Matches:</strong> Filtered from 200+ mom-tested business models to match your available weekly hours.</span>
              </div>
              <div class="home-feature-item">
                <span class="home-feature-icon">✓</span>
                <span><strong>Clear Revenue Math:</strong> Exact pricing tiers, client capacity, and realistic timelines to hit your income goal.</span>
              </div>
              <div class="home-feature-item">
                <span class="home-feature-icon">✓</span>
                <span><strong>7-Day Validation Sprint:</strong> A step-by-step test you can run from your phone without spending money on websites or ads.</span>
              </div>
            </div>

            <div class="home-tool-action">
              ${
                isFitComplete
                  ? `<button type="button" class="btn-pink home-cta-btn" data-action="resume-fit">
                      View Your Top 3 Matches &amp; Plan →
                    </button>
                    <button type="button" class="home-restart-link" data-action="start-fresh-fit">
                      or retake assessment from scratch
                    </button>`
                  : hasFitProgress
                  ? `<button type="button" class="btn-pink home-cta-btn" data-action="resume-fit">
                      Resume Assessment (Section ${state.step} of 6) →
                    </button>
                    <button type="button" class="home-restart-link" data-action="start-fresh-fit">
                      or start over fresh
                    </button>`
                  : `<button type="button" class="btn-pink home-cta-btn" data-action="start-fit">
                      Start Business Fit Assessment →
                    </button>`
              }
            </div>
          </div>

          <!-- TOOL 2: BUSINESS GROWTH -->
          <div class="home-tool-card growth-card" id="homeCardGrowth">
            <div class="home-tool-top">
              <div class="home-tool-badges">
                <span class="home-tag-pill tag-forest">Already in Business</span>
                <span class="home-time-pill">~3 min diagnostic</span>
              </div>
              <h2 class="home-tool-title">Business Growth Assessment</h2>
              <p class="home-tool-hook">
                Diagnose what is capping your sales, unlock your revenue bottleneck, and earn more without working more hours.
              </p>
            </div>

            <div class="home-tool-features">
              <div class="home-feature-item">
                <span class="home-feature-icon">✓</span>
                <span><strong>Primary Bottleneck Diagnosis:</strong> Pinpoints whether your offer, lead generation, sales conversion, or delivery is holding you back.</span>
              </div>
              <div class="home-feature-item">
                <span class="home-feature-icon">✓</span>
                <span><strong>Profit &amp; Capacity Check:</strong> Pricing reality check and fulfillment protection tailored specifically to your business type.</span>
              </div>
              <div class="home-feature-item">
                <span class="home-feature-icon">✓</span>
                <span><strong>Prioritized 30-Day Plan:</strong> 3 high-leverage action items to unlock higher revenue inside your current weekly hours.</span>
              </div>
            </div>

            <div class="home-tool-action">
              ${
                isGrowthComplete
                  ? `<button type="button" class="btn-primary home-cta-btn" data-action="resume-growth">
                      View Your Growth Diagnosis &amp; 30-Day Plan →
                    </button>
                    <button type="button" class="home-restart-link" data-action="start-fresh-growth">
                      or retake diagnostic from scratch
                    </button>`
                  : hasGrowthProgress
                  ? `<button type="button" class="btn-primary home-cta-btn" data-action="resume-growth">
                      Resume Assessment (Section ${state.growthStep} of 6) →
                    </button>
                    <button type="button" class="home-restart-link" data-action="start-fresh-growth">
                      or start over fresh
                    </button>`
                  : `<button type="button" class="btn-primary home-cta-btn" data-action="start-growth">
                      Start Business Growth Assessment →
                    </button>`
              }
            </div>
          </div>
        </div>

        <!-- TRUST & REASSURANCE BANNER -->
        <div class="home-trust-banner">
          <div class="home-trust-pill">
            <strong>100% Free &amp; Private</strong>
            <span>No credit card required. Your diagnostic answers remain confidential.</span>
          </div>
          <div class="home-trust-divider"></div>
          <div class="home-trust-pill">
            <strong>Built for Mom Hours</strong>
            <span>Every calculation is built around nap times, school runs, and real family rhythms.</span>
          </div>
          <div class="home-trust-divider"></div>
          <div class="home-trust-pill">
            <strong>Zero Guesswork</strong>
            <span>Get clear numbers, realistic requirements, and honest step-by-step guidance.</span>
          </div>
        </div>
      </div>
    `;
  }

  function bindHomeScreenEvents() {
    document.querySelectorAll("[data-action='start-fit'], [data-action='resume-fit']").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigateToAssessment("fit");
      });
    });

    document.querySelectorAll("[data-action='start-fresh-fit']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const keepCurrency = state.profile.currency || "USD";
        state.step = 1;
        state.shownStories = {};
        state.profile = getFreshProfile(keepCurrency);
        state.topMatches = [];
        state.playbooks = [];
        state.runnerUpMatches = [];
        state.runnerUpPlaybooks = [];
        saveUserProgress();
        navigateToAssessment("fit");
      });
    });

    document.querySelectorAll("[data-action='start-growth'], [data-action='resume-growth']").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigateToAssessment("growth");
      });
    });

    document.querySelectorAll("[data-action='start-fresh-growth']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const keepCurrency = state.growthProfile.currency || "USD";
        state.growthStep = 1;
        state.growthShownStories = {};
        state.growthProfile = getFreshGrowthProfile(keepCurrency);
        state.growthAnalysis = null;
        saveUserProgress();
        navigateToAssessment("growth");
      });
    });
  }

  function resetAssessmentAndStartOver() {
    if (state.mode === "growth") {
      const keepCurrency = state.growthProfile.currency || state.profile.currency || "USD";
      state.growthStep = 1;
      state.growthSubStep = 1;
      state.growthShownStories = {};
      state.pendingNextStep = null;
      state.validationError = "";
      state.limitNotice = "";
      state.growthProfile = getFreshGrowthProfile(keepCurrency);
      state.growthAnalysis = null;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const keepCurrency = state.profile.currency || "USD";
    state.step = 1;
    state.subStep = 1;
    state.shownStories = {};
    state.pendingNextStep = null;
    state.validationError = "";
    state.limitNotice = "";
    state.profile = getFreshProfile(keepCurrency);
    state.completedTasks = [];
    state.topMatches = [];
    state.playbooks = [];
    state.runnerUpMatches = [];
    state.runnerUpPlaybooks = [];
    state.expandedRunnerUps = {};
    try {
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
    } catch (_) {}
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getMaxSubSteps(step, mode = state.mode) {
    if (mode === "growth") {
      const growthMax = { 1: 5, 2: 3, 3: 2, 4: 2, 5: 2, 6: 1 };
      return growthMax[step] || 1;
    }
    const fitMax = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 3 };
    return fitMax[step] || 1;
  }

  function validateFitSubStep() {
    const p = state.profile;
    const s = state.step;
    const sub = state.subStep || 1;

    if (s === 1) {
      if (sub === 1) {
        if (!p.incomeGoal || Number(p.incomeGoal) <= 0) {
          return { ok: false, message: "Please set a valid monthly income target." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!p.timeline) {
          return { ok: false, message: "Please choose your target timeline." };
        }
        return { ok: true };
      }
    }
    if (s === 2) {
      if (sub === 1) {
        if (!Number(p.hoursPerWeek)) {
          return { ok: false, message: "Please select how many hours per week you can give." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!p.scheduleRhythm) {
          return { ok: false, message: "Please select when your available hours happen." };
        }
        return { ok: true };
      }
    }
    if (s === 3) {
      if (sub === 1) {
        if (!p.backgrounds || p.backgrounds.length === 0) {
          return { ok: false, message: "Please select at least one background area from the dropdown or quick buttons." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!p.licensingOpenness) {
          return { ok: false, message: "Please select your licensing or certification preference." };
        }
        return { ok: true };
      }
    }
    if (s === 4) {
      if (sub === 1) {
        if (!p.skills || p.skills.length === 0) {
          return { ok: false, message: "Please select at least one core skill or choose 'Not Sure Yet'." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!p.skillDirection) {
          return { ok: false, message: "Please select how you want to use your existing skills." };
        }
        return { ok: true };
      }
    }
    if (s === 5) {
      if (sub === 1) {
        if (!p.enjoyedActivities || p.enjoyedActivities.length === 0) {
          return { ok: false, message: "Please select at least one hobby or everyday activity you enjoy." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!p.livedExperiences || p.livedExperiences.length === 0) {
          return { ok: false, message: "Please select at least one personal life or motherhood chapter." };
        }
        return { ok: true };
      }
    }
    if (s === 6) {
      if (sub === 1) {
        if (!p.workStyle) {
          return { ok: false, message: "Please select your preferred business format." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (p.budget === null || p.budget === undefined) {
          return { ok: false, message: "Please select your available startup budget." };
        }
        return { ok: true };
      }
      if (sub === 3) {
        return { ok: true };
      }
    }
    return { ok: true };
  }

  function validateGrowthSubStep() {
    const gp = state.growthProfile;
    const s = state.growthStep;
    const sub = state.growthSubStep || 1;

    if (s === 1) {
      if (sub === 1) {
        if (!gp.businessType) {
          return { ok: false, message: "Please select what type of business you run from the dropdown." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!gp.subNicheId && !gp.specificNiche) {
          return { ok: false, message: "Please select your closest specialty or describe your niche." };
        }
        return { ok: true };
      }
      if (sub === 3) {
        if (!gp.revenueStageId) {
          return { ok: false, message: "Please select your current monthly sales range." };
        }
        return { ok: true };
      }
      if (sub === 4) {
        if (!gp.profitMarginId) {
          return { ok: false, message: "Please select your estimated take-home profit margin." };
        }
        return { ok: true };
      }
      if (sub === 5) {
        if (!gp.targetRevenue || Number(gp.targetRevenue) <= 0) {
          return { ok: false, message: "Please set a valid 90-day sales goal." };
        }
        return { ok: true };
      }
    }
    if (s === 2) {
      if (sub === 1) {
        if (!gp.offerStructure) {
          return { ok: false, message: "Please select how your offers are currently structured." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!gp.avgPriceTierId) {
          return { ok: false, message: "Please select your average client price tier." };
        }
        return { ok: true };
      }
      if (sub === 3) {
        if (!gp.priceConfidence) {
          return { ok: false, message: "Please select how confident you feel in your current prices." };
        }
        return { ok: true };
      }
    }
    if (s === 3) {
      if (sub === 1) {
        if (!gp.leadSources || gp.leadSources.length === 0) {
          return { ok: false, message: "Please select your primary client acquisition channel." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!gp.conversionIssue) {
          return { ok: false, message: "Please select your primary sales or conversion bottleneck." };
        }
        return { ok: true };
      }
    }
    if (s === 4) {
      if (sub === 1) {
        if (!gp.repeatRateId) {
          return { ok: false, message: "Please select your repeat client or renewal rate." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!gp.retentionSystem) {
          return { ok: false, message: "Please select your client retention or follow-up system." };
        }
        return { ok: true };
      }
    }
    if (s === 5) {
      if (sub === 1) {
        if (!gp.currentHours) {
          return { ok: false, message: "Please select how many hours per week you work now." };
        }
        return { ok: true };
      }
      if (sub === 2) {
        if (!gp.deliveryDrain) {
          return { ok: false, message: "Please select what drains the most time or energy in your delivery." };
        }
        return { ok: true };
      }
    }
    if (s === 6) {
      if (!gp.primaryGoal) {
        return { ok: false, message: "Please select your primary growth goal for the next 90 days." };
      }
      return { ok: true };
    }
    return { ok: true };
  }

  function advanceSubStep() {
    state.validationError = "";
    if (state.mode === "growth") {
      const v = validateGrowthSubStep();
      if (!v.ok) {
        state.validationError = v.message;
        render();
        return;
      }
      const maxSub = getMaxSubSteps(state.growthStep, "growth");
      if (state.growthSubStep < maxSub) {
        state.growthSubStep++;
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (state.growthStep < state.totalQuizSteps) {
        maybeShowGrowthStoryPopupThenAdvance(state.growthStep, state.growthStep + 1);
        return;
      }
      state.growthStep = 7;
      state.growthSubStep = 1;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const v = validateFitSubStep();
    if (!v.ok) {
      state.validationError = v.message;
      render();
      return;
    }
    const maxSub = getMaxSubSteps(state.step, "fit");
    if (state.subStep < maxSub) {
      state.subStep++;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (state.step < state.totalQuizSteps) {
      maybeShowStoryPopupThenAdvance(state.step, state.step + 1);
      return;
    }
    computeRecommendations();
    state.step = 7;
    state.subStep = 1;
    saveUserProgress();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retreatSubStep() {
    state.validationError = "";
    if (state.mode === "growth") {
      if (state.growthSubStep > 1) {
        state.growthSubStep--;
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (state.growthStep > 1) {
        state.growthStep--;
        state.growthSubStep = getMaxSubSteps(state.growthStep, "growth");
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      navigateToHome();
      return;
    }

    if (state.subStep > 1) {
      state.subStep--;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (state.step > 1) {
      state.step--;
      state.subStep = getMaxSubSteps(state.step, "fit");
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigateToHome();
  }

  function triggerAutoAdvance(callback) {
    if (callback) callback();
    saveUserProgress();
    render();
    setTimeout(() => {
      advanceSubStep();
    }, 220);
  }

  function getCur() {
    const code = state.mode === "growth" ? state.growthProfile.currency : state.profile.currency;
    return window.VaultEngine.getCurrencyObj(code || "USD");
  }

  function fmtMoney(amount) {
    const code = state.mode === "growth" ? state.growthProfile.currency : state.profile.currency;
    return window.VaultEngine.formatMoney(amount, code || "USD");
  }

  function isFlashTimeline() {
    return state.profile.timeline === "2-week flash";
  }

  function fmtGoalPeriod(amount) {
    const val = amount ?? state.profile.incomeGoal;
    return isFlashTimeline() ? `${fmtMoney(val)} in 14 Days` : `${fmtMoney(val)}/mo`;
  }

  function fmtTargetHeaderSummary() {
    if (isFlashTimeline()) {
      return `${fmtMoney(state.profile.incomeGoal)} in 14 Days (2-Week Flash)`;
    }
    const tl = state.profile.timeline ? ` (${state.profile.timeline})` : "";
    return `${fmtMoney(state.profile.incomeGoal)}/mo${tl}`;
  }

  // Silently persist progress in the background
  function saveUserProgress() {
    try {
      const payload = {
        savedAt: new Date().toISOString(),
        mode: state.mode,
        step: state.step,
        subStep: state.subStep || 1,
        growthStep: state.growthStep,
        growthSubStep: state.growthSubStep || 1,
        profile: state.profile,
        growthProfile: state.growthProfile,
        completedTasks: state.completedTasks
      };
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(payload));
    } catch (_) {}

    const activeEmail = state.mode === "growth" ? state.growthProfile.email : state.profile.email;
    if (activeEmail) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeEmail,
          completedTasks: state.completedTasks
        })
      }).catch(() => {});
    }
  }

  function restoreUserProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved) {
        if (saved.mode === "growth" || saved.mode === "fit") {
          state.mode = saved.mode;
        }
        if (saved.growthProfile) {
          state.growthProfile = { ...state.growthProfile, ...saved.growthProfile };
          if (!Array.isArray(state.growthProfile.leadSources)) {
            state.growthProfile.leadSources = state.growthProfile.leadSource
              ? [state.growthProfile.leadSource]
              : [];
          }
          if (state.growthProfile.subNicheId && state.growthProfile.specificNiche && window.GROWTH_SUB_NICHES) {
            const list = window.GROWTH_SUB_NICHES[state.growthProfile.businessType] || [];
            const snObj = list.find((s) => s.id === state.growthProfile.subNicheId);
            if (snObj && snObj.label === state.growthProfile.specificNiche) {
              state.growthProfile.specificNiche = "";
            }
          }
          if (
            (!state.growthProfile.currentRevenue || Number(state.growthProfile.currentRevenue) === 0) &&
            state.growthProfile.revenueStageId &&
            state.growthProfile.revenueStageId !== "pre-revenue" &&
            window.GROWTH_REVENUE_STAGES
          ) {
            const stg = window.GROWTH_REVENUE_STAGES.find((s) => s.id === state.growthProfile.revenueStageId);
            if (stg && stg.valUsd) {
              const curCode = state.growthProfile.currency || "USD";
              state.growthProfile.currentRevenue = window.VaultEngine.scaleUsdToCurrency(stg.valUsd, curCode);
            }
          }
        }
        if (saved.growthStep && saved.growthStep >= 1 && saved.growthStep <= 8) {
          state.growthStep = saved.growthStep;
          state.growthSubStep = saved.growthSubStep && saved.growthSubStep >= 1 ? saved.growthSubStep : 1;
          const maxGSub = getMaxSubSteps(state.growthStep, "growth");
          if (state.growthSubStep > maxGSub) state.growthSubStep = 1;
          if (state.growthStep >= 7 && window.GrowthEngine) {
            state.growthAnalysis = window.GrowthEngine.analyzeBusiness(state.growthProfile);
          }
        }
      }
      if (saved && saved.profile) {
        state.profile = { ...state.profile, ...saved.profile };
        if (saved.step && saved.step >= 1 && saved.step <= 8) {
          state.step = saved.step;
          state.subStep = saved.subStep && saved.subStep >= 1 ? saved.subStep : 1;
          const maxFSub = getMaxSubSteps(state.step, "fit");
          if (state.subStep > maxFSub) state.subStep = 1;
        }
        const supportedCodes = (window.SUPPORTED_CURRENCIES || []).map((c) => c.code);
        if (!supportedCodes.includes(state.profile.currency)) {
          state.profile.currency = "USD";
          if ((Number(state.profile.incomeGoal) || 0) > 50000) {
            state.profile.incomeGoal = 5000;
          }
        }
        if (state.profile.timeline === "2-week flash" && Number(state.profile.incomeGoal) > 2500) {
          state.profile.timeline = "1 to 3 months";
        }
        // Sanitize any legacy IDs from older sessions without forcing default selections
        const validBgIds = new Set((window.PROFESSIONAL_BACKGROUNDS || []).map((b) => b.id));
        state.profile.backgrounds = (state.profile.backgrounds || []).filter((id) => validBgIds.has(id));

        const validSkillIds = new Set([...(window.SKILL_CATEGORIES || []).map((s) => s.id), "unsure"]);
        state.profile.skills = (state.profile.skills || []).filter((id) => validSkillIds.has(id)).slice(0, 4);

        const validActIds = new Set((window.ENJOYED_ACTIVITIES || []).map((a) => a.id));
        state.profile.enjoyedActivities = (state.profile.enjoyedActivities || []).filter((id) => validActIds.has(id)).slice(0, 3);

        const validLifeIds = new Set((window.LIVED_EXPERIENCES || []).map((l) => l.id));
        state.profile.livedExperiences = (state.profile.livedExperiences || []).filter((id) => validLifeIds.has(id));

        const validBudgets = [0, 250, 1000, 3000, 10000];
        if (state.profile.budget !== null && state.profile.budget !== undefined && !validBudgets.includes(Number(state.profile.budget))) {
          state.profile.budget = Number(state.profile.budget) === 500 ? 1000 : 250;
        }
        state.completedTasks = Array.isArray(saved.completedTasks) ? saved.completedTasks : [];
        if (saved.step && saved.step >= 1 && saved.step <= 8) {
          state.step = saved.step;
          if (state.step >= 7) {
            computeRecommendations();
          }
        }
      }
    } catch (_) {}
  }

  function loadSavedConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_CFG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.config = { ...state.config, ...parsed };
      }
    } catch (_) {}
  }

  async function syncServerConfig() {
    try {
      const res = await fetch("/api/config");
      if (!res.ok) return;
      const srv = await res.json();
      if (srv.googleSheetUrl && !state.config.googleSheetUrl) {
        state.config.googleSheetUrl = srv.googleSheetUrl;
      }
      if (srv.googleSheetTabName && !state.config.googleSheetTabName) {
        state.config.googleSheetTabName = srv.googleSheetTabName;
      }
      if (
        srv.calendlyUrl &&
        !srv.calendlyUrl.includes("your-calendly-link")
      ) {
        state.config.calendlyUrl = srv.calendlyUrl;
      }
      if (srv.consultingTitle) {
        state.config.consulting = state.config.consulting || {};
        state.config.consulting.title = srv.consultingTitle;
      }
      if (srv.consultingSubtitle) {
        state.config.consulting = state.config.consulting || {};
        state.config.consulting.subtitle = srv.consultingSubtitle;
      }
      if (srv.consultingCtaText) {
        state.config.consulting = state.config.consulting || {};
        state.config.consulting.ctaText = srv.consultingCtaText;
      }
    } catch (_) {}
  }

  function extractSheetId(input) {
    if (!input) return "";
    const str = String(input).trim();
    const m = str.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (m) return m[1];
    if (/^[a-zA-Z0-9-_]{20,}$/.test(str)) return str;
    return "";
  }

  function parseCsvToObjects(csvText) {
    const rows = [];
    let current = "";
    let inQuotes = false;
    const lines = [];
    let row = [];

    for (let i = 0; i < csvText.length; i++) {
      const ch = csvText[i];
      const next = csvText[i + 1];
      if (ch === '"' && inQuotes && next === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (ch === "\r" && next === "\n") i++;
        row.push(current.trim());
        if (row.some((cell) => cell !== "")) lines.push(row);
        row = [];
        current = "";
      } else {
        current += ch;
      }
    }
    if (current || row.length > 0) {
      row.push(current.trim());
      if (row.some((cell) => cell !== "")) lines.push(row);
    }
    if (lines.length < 2) return [];
    const headers = lines[0];
    for (let r = 1; r < lines.length; r++) {
      const obj = {};
      headers.forEach((h, idx) => {
        if (h) obj[h] = lines[r][idx] || "";
      });
      rows.push(obj);
    }
    return rows;
  }

  async function loadGoogleSheetVault(customSheetUrl, customTab) {
    const sheetUrl = customSheetUrl ?? state.config.googleSheetUrl ?? state.config.googleSheetId;
    const tabName = customTab ?? state.config.googleSheetTabName ?? "Sheet1";
    const sheetId = extractSheetId(sheetUrl);

    if (!sheetId) {
      updateVaultStatusPill();
      return { ok: false, count: state.vaultIdeas.length };
    }

    let rawRows = [];
    try {
      const qs = new URLSearchParams({ sheetUrl: sheetId, tabName });
      const res = await fetch(`/api/vault?${qs.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.rows) && data.rows.length > 0) {
          rawRows = data.rows;
        }
      }
    } catch (_) {}

    if (rawRows.length === 0) {
      try {
        let csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
        if (tabName) csvUrl += `&sheet=${encodeURIComponent(tabName)}`;
        const res = await fetch(csvUrl);
        if (res.ok) {
          const text = await res.text();
          rawRows = parseCsvToObjects(text);
        }
      } catch (_) {}
    }

    if (rawRows.length > 0) {
      const normalized = rawRows
        .map((r, idx) => window.normalizeVaultRow(r, idx))
        .filter(Boolean);

      if (normalized.length > 0) {
        const mergedResult = window.mergeVaultWithSheetIdeas
          ? window.mergeVaultWithSheetIdeas(normalized)
          : { merged: normalized, missingFromSheet: [] };

        state.vaultIdeas = mergedResult.merged;
        state.isSheetConnected = true;
        state.vaultSource = `Google Sheets Connected (${state.vaultIdeas.length} Profiles)`;
        updateVaultStatusPill();

        if (mergedResult.missingFromSheet.length > 0) {
          syncMissingIdeasToGoogleSheet(mergedResult.missingFromSheet);
        }

        return {
          ok: true,
          count: state.vaultIdeas.length,
          sheetCount: normalized.length,
          addedBuiltInCount: mergedResult.missingFromSheet.length
        };
      }
    }

    updateVaultStatusPill();
    return { ok: false, count: state.vaultIdeas.length };
  }

  async function syncMissingIdeasToGoogleSheet(ideasToSync) {
    const list = Array.isArray(ideasToSync) && ideasToSync.length > 0
      ? ideasToSync
      : window.DEFAULT_VAULT_IDEAS || [];
    const formattedRows = window.formatVaultIdeasForGoogleSheet
      ? window.formatVaultIdeasForGoogleSheet(list)
      : [];
    if (formattedRows.length === 0) return { ok: false, synced: 0 };

    try {
      const res = await fetch("/api/vault/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: formattedRows,
          sheetUrl: state.config.googleSheetUrl || "",
          tabName: state.config.googleSheetTabName || "Sheet1",
          webhookUrl: state.config.googleSheetWriteWebhookUrl || ""
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
    return { ok: false, synced: 0 };
  }

  function updateVaultStatusPill() {
    const pill = document.getElementById("vaultStatusText");
    if (!pill) return;
    if (state.isSheetConnected) {
      pill.textContent = `${state.vaultIdeas.length} Vault Profiles Synced`;
    } else {
      pill.textContent = `200+ Vault Engine Ready`;
    }
  }

  function getIncomeTierInsight(goalInCur) {
    const cur = getCur();
    const goalUsd = (Number(goalInCur) || 0) / (cur.rate || 1);
    const fmt = fmtMoney(goalInCur);
    if (isFlashTimeline()) {
      return `<strong>2-Week Quick-Cash Sprint (${fmt} in 14 Days):</strong> Focuses on simple offers you can launch right away with upfront booking deposits or starter packages.`;
    }
    if (goalUsd <= 2000) {
      return `<strong>Starter Extra Income (${fmt}/mo):</strong> Perfect for covering family expenses or savings. Reachable with weekend local bookings, digital products, or 2 to 3 regular clients.`;
    }
    if (goalUsd <= 5500) {
      return `<strong>Steady Part-Time Income (${fmt}/mo):</strong> An ideal milestone for moms. Easily reached through steady monthly clients, product bundles, or repeat customers.`;
    }
    if (goalUsd <= 12000) {
      return `<strong>Full-Time Income (${fmt}/mo):</strong> To hit this goal inside your weekly hours, we focus on higher-value packages, corporate clients, or recurring monthly retainers.`;
    }
    return `<strong>High-Earning Businesses (${fmt}/mo):</strong> Reaching this level inside a family schedule works best with higher-ticket services, corporate contracts, or specialized licenses (like financial services, grant writing, or recruitment).`;
  }

  function computeRecommendations() {
    const ranked = window.VaultEngine.rankIdeas(state.vaultIdeas, state.profile);
    state.allRankedMatches = ranked;
    state.topMatches = ranked.slice(0, 3);
    state.playbooks = state.topMatches.map((idea, idx) =>
      window.VaultEngine.buildPlaybook(idea, state.profile, idx)
    );
    state.runnerUpMatches = ranked
      .slice(3)
      .filter((idea) => (idea.rawScore || 0) >= 30)
      .slice(0, 2);
    state.runnerUpPlaybooks = state.runnerUpMatches.map((idea, rIdx) =>
      window.VaultEngine.buildPlaybook(idea, state.profile, 3 + rIdx)
    );
    state.expandedRunnerUps = {};
    state.selectedIdeaIdx = null;
  }

  function getPrefilledCalendlyUrl() {
    const base = (state.config.calendlyUrl || "https://calendly.com").trim();
    const params = new URLSearchParams();
    if (state.mode === "growth") {
      const gp = state.growthProfile;
      const bottleneck = state.growthAnalysis?.primaryBottleneck?.title || "Growth & Profit Scaling";
      if (gp.firstName) params.set("name", gp.firstName);
      if (gp.email) params.set("email", gp.email);
      params.set(
        "a1",
        `[Business Growth] Current: ${fmtMoney(gp.currentRevenue)}/mo -> Target: ${fmtMoney(gp.targetRevenue)}/mo (${gp.maxDesiredHours} hrs/wk cap) | #1 Bottleneck: ${bottleneck}`
      );
      return base.includes("?") ? `${base}&${params.toString()}` : `${base}?${params.toString()}`;
    }
    const top1 = state.topMatches[0] ? state.topMatches[0].name : "Business Vault Match";
    if (state.profile.firstName) params.set("name", state.profile.firstName);
    if (state.profile.email) params.set("email", state.profile.email);
    params.set(
      "a1",
      `[Business Fit] Target: ${fmtMoney(state.profile.incomeGoal)}/mo (${state.profile.timeline}, ${state.profile.hoursPerWeek} hrs/wk) | Top Match: ${top1}`
    );
    return base.includes("?") ? `${base}&${params.toString()}` : `${base}?${params.toString()}`;
  }

  // Render active view
  function render() {
    const root = document.getElementById("appRoot");
    if (!root) return;

    updateModeHeroAndNav();

    const heroHeader = document.getElementById("heroHeader") || document.querySelector(".hero-header");

    if (state.view === "home") {
      if (heroHeader) heroHeader.style.display = "none";
      root.innerHTML = renderHomeScreen();
      bindHomeScreenEvents();
      return;
    }

    if (heroHeader) {
      heroHeader.style.display = "none";
    }

    if (state.mode === "growth") {
      if (state.growthStep <= 6) {
        root.innerHTML = renderGrowthQuizStep();
        bindGrowthQuizEvents();
      } else if (state.growthStep === 7) {
        root.innerHTML = renderGrowthEmailGate();
        bindGrowthGateEvents();
      } else {
        root.innerHTML = renderGrowthResultsDashboard();
        bindGrowthResultsEvents();
      }
      return;
    }

    if (state.step <= 6) {
      root.innerHTML = renderQuizStep();
      bindQuizEvents();
    } else if (state.step === 7) {
      root.innerHTML = renderEmailGate();
      bindGateEvents();
    } else {
      root.innerHTML = renderResultsDashboard();
      bindResultsEvents();
    }
  }

  // Select the most relevant Real Mom Story based on the user's goal, currency, and answers
  function selectTailoredStoryForStep(completedStep) {
    const stories = window.SUCCESS_STORIES || [];
    const usedIds = Object.values(state.shownStories || {});
    const available = stories.filter((s) => !usedIds.includes(s.id));
    if (available.length === 0) return null;

    const p = state.profile;
    const goal = Number(p.incomeGoal) || 5000;
    const isFlash = isFlashTimeline();

    // Score each available story based on what the user has answered so far
    const scored = available.map((s) => {
      let pts = 0;
      const trig = s.matchTriggers || {};

      if ((s.preferredSteps || []).includes(completedStep)) pts += 5;

      // Popup #1 (After Section 2: Income Target, Timeline & Schedule Rhythm)
      if (completedStep === 2) {
        if (isFlash && trig.flash) pts += 28;
        if (!isFlash && trig.minGoal && goal >= trig.minGoal) pts += 24;
        if (!isFlash && trig.maxGoal && goal <= trig.maxGoal) pts += 16;
        if ((trig.rhythm || []).includes(p.scheduleRhythm)) pts += 22;
        if (p.scheduleRhythm === "nap-pockets" && s.id === "story-rachel") pts += 20;
        if (p.scheduleRhythm === "weekends-evenings" && (s.id === "story-tolu" || s.id === "story-rasheeda")) pts += 18;
      }

      // Popup #2 (After Section 5: Career Background, Core Skills & Enjoyed Activities)
      if (completedStep === 5) {
        const skillOverlap = (trig.skills || []).filter((sk) => (p.skills || []).includes(sk)).length;
        pts += skillOverlap * 24;

        const actOverlap = (trig.activities || []).filter((a) => (p.enjoyedActivities || []).includes(a)).length;
        pts += actOverlap * 24;

        const bgOverlap = (trig.backgrounds || []).filter((b) => (p.backgrounds || []).includes(b)).length;
        pts += bgOverlap * 18;

        if (((p.skills || []).includes("culinary") || (p.enjoyedActivities || []).includes("act-culinary")) && s.id === "story-rasheeda") {
          pts += 40;
        }
        if (((p.skills || []).includes("crafts") || (p.enjoyedActivities || []).includes("act-crafts")) && s.id === "story-fatima") {
          pts += 40;
        }
        if (
          ((p.skills || []).includes("event_planning") ||
            (p.skills || []).includes("mc_dj") ||
            (p.enjoyedActivities || []).includes("act-events") ||
            (p.enjoyedActivities || []).includes("act-mc-dj")) &&
          (s.id === "story-amara" || s.id === "story-tolu")
        ) {
          pts += 35;
        }
        if (p.licensingOpenness === "no-licensing" && s.id === "story-bridget") {
          pts -= 30;
        }
      }

      return { story: s, pts };
    });

    scored.sort((a, b) => b.pts - a.pts);
    return scored[0] ? scored[0].story : available[0];
  }

  function formatStoryWithUserCurrency(text) {
    const cur = getCur();
    const sym = cur.symbol || "$";
    const goalText = fmtGoalPeriod();
    return String(text || "")
      .replace(/\{SYM\}/g, sym)
      .replace(/\{GOAL\}/g, goalText);
  }

  // Open the Real Mom Story Pop-Up Modal ONLY twice across the 6 questions (after Section 2 and after Section 5)
  function maybeShowStoryPopupThenAdvance(completedStep, nextStep) {
    const allowedPopupSteps = [2, 5];
    if (!allowedPopupSteps.includes(completedStep) || state.shownStories[completedStep]) {
      state.step = nextStep;
      state.subStep = 1;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const story = selectTailoredStoryForStep(completedStep);
    if (!story) {
      state.step = nextStep;
      state.subStep = 1;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    state.shownStories[completedStep] = story.id;
    state.pendingNextStep = nextStep;

    const modal = document.getElementById("storyPopupModal");
    if (!modal) {
      state.step = nextStep;
      state.subStep = 1;
      saveUserProgress();
      render();
      return;
    }

    document.getElementById("storyModalTag").textContent = story.tag;
    document.getElementById("storyModalHeadline").textContent = formatStoryWithUserCurrency(story.headline);
    document.getElementById("storyModalBody").textContent = formatStoryWithUserCurrency(story.story);
    document.getElementById("storyModalTakeaway").textContent = formatStoryWithUserCurrency(story.takeaway);
    document.getElementById("storyModalMetrics").innerHTML = (story.metrics || [])
      .map((m) => `<span class="story-metric-chip">${formatStoryWithUserCurrency(m)}</span>`)
      .join("");

    const continueBtn = document.getElementById("btnContinueFromStoryModal");
    if (continueBtn) {
      continueBtn.textContent = `Continue to Section ${nextStep} of ${state.totalQuizSteps}`;
    }

    modal.classList.add("open");
  }

  function maybeShowGrowthStoryPopupThenAdvance(completedStep, nextStep) {
    const allowedPopupSteps = [2, 5];
    if (!allowedPopupSteps.includes(completedStep) || state.growthShownStories[completedStep]) {
      state.growthStep = nextStep;
      state.growthSubStep = 1;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const stories = window.GROWTH_STORIES || [];
    const story = stories.find((s) => (s.preferredSteps || []).includes(completedStep)) || stories[0];
    if (!story) {
      state.growthStep = nextStep;
      state.growthSubStep = 1;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    state.growthShownStories[completedStep] = story.id;
    state.pendingNextStep = nextStep;

    const modal = document.getElementById("storyPopupModal");
    if (!modal) {
      state.growthStep = nextStep;
      state.growthSubStep = 1;
      saveUserProgress();
      render();
      return;
    }

    document.getElementById("storyModalTag").textContent = story.tag;
    document.getElementById("storyModalHeadline").textContent = formatStoryWithUserCurrency(story.headline);
    document.getElementById("storyModalBody").textContent = formatStoryWithUserCurrency(story.story);
    document.getElementById("storyModalTakeaway").textContent = formatStoryWithUserCurrency(story.takeaway);
    document.getElementById("storyModalMetrics").innerHTML = (story.metrics || [])
      .map((m) => `<span class="story-metric-chip">${formatStoryWithUserCurrency(m)}</span>`)
      .join("");

    const continueBtn = document.getElementById("btnContinueFromStoryModal");
    if (continueBtn) {
      continueBtn.textContent = `Continue to Section ${nextStep} of ${state.totalQuizSteps}`;
    }

    modal.classList.add("open");
  }

  function closeStoryModalAndAdvance() {
    const modal = document.getElementById("storyPopupModal");
    if (modal) modal.classList.remove("open");
    if (state.pendingNextStep) {
      if (state.mode === "growth") {
        state.growthStep = state.pendingNextStep;
        state.growthSubStep = 1;
      } else {
        state.step = state.pendingNextStep;
        state.subStep = 1;
      }
      state.pendingNextStep = null;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ============================================================================
  // ============================================================================
  // RENDER ASSESSMENT TYPEFORM-STYLE SUB-STEPS (FIT ASSESSMENT)
  // ============================================================================
  function renderQuizStep() {
    const s = state.step;
    const maxSub = getMaxSubSteps(s, "fit");
    if (!state.subStep || state.subStep < 1 || state.subStep > maxSub) {
      state.subStep = 1;
    }
    const sub = state.subStep;
    const stepOffsets = { 1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6: 10 };
    const completed = (stepOffsets[s] || 0) + (sub - 1);
    const totalQuestions = 13;
    const pct = Math.round((completed / totalQuestions) * 100);
    const cur = getCur();
    const flashAmount = fmtMoney(window.VaultEngine.scaleUsdToCurrency(1500, cur.code));
    let stepContent = "";

    if (s === 1 && sub === 1) {
      const g = Number(state.profile.incomeGoal) || cur.defaultGoal;
      const annual = g * 12;
      const isFlash = isFlashTimeline();
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">Choose Your Currency & <em>Monthly Income Target</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Pick your currency and set your target income. We will calculate the honest math and tradeoffs for each business model.
            </p>
          </div>
        </div>

        <div class="income-showcase-box">
          <div class="currency-selector-row">
            <span class="currency-label-text">Currency:</span>
            ${(window.SUPPORTED_CURRENCIES || [])
              .map(
                (c) => `
              <button type="button" class="currency-pill ${c.code === cur.code ? "active" : ""}" data-currency="${c.code}">
                ${c.label}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="income-amount-row">
            <span class="income-big-number" id="incomeDisplayNum">${fmtMoney(g)}</span>
            <span class="income-per-mo" id="incomeUnitLabel">${isFlash ? "in 14 days" : "/ month"}</span>
          </div>
          <div class="income-annual-sub" id="incomeAnnualSub">
            ${
              isFlash
                ? `2-Week Flash Sprint (<strong>${fmtMoney(g * 2)}/month</strong> pace)`
                : `That is <strong>${fmtMoney(annual)}/year</strong> in additional income`
            }
          </div>

          <input
            type="range"
            id="incomeSlider"
            class="income-slider"
            min="${cur.min}"
            max="${cur.max}"
            step="${cur.step}"
            value="${Math.min(cur.max, Math.max(cur.min, g))}"
          />

          <div class="income-presets">
            ${(cur.presets || [])
              .map(
                (amt) => `
              <button type="button" class="preset-btn ${g === amt ? "active" : ""}" data-preset="${amt}">
                ${fmtMoney(amt)}${isFlash ? " in 14d" : "/mo"}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="custom-dollar-input-wrap">
            <span class="custom-dollar-label">Or type exact amount:</span>
            <div class="custom-dollar-input-group">
              <span class="custom-dollar-currency">${cur.symbol}</span>
              <input
                type="number"
                id="customIncomeInput"
                class="custom-dollar-input"
                min="100"
                max="100000000"
                step="${cur.step}"
                value="${g}"
              />
              <span class="custom-dollar-suffix" id="customIncomeUnitSuffix">${isFlash ? "in 14 days" : "/mo"}</span>
            </div>
          </div>

          <div class="tier-insight-banner" id="tierInsightBanner">
            ${getIncomeTierInsight(g)}
          </div>
        </div>
      `;
    } else if (s === 1 && sub === 2) {
      const timelines = [
        {
          id: "2-week flash",
          title: `2-Week Flash (${flashAmount} in 14 Days)`,
          sub: `Switches your target to a fast ${flashAmount} 14-day sprint using immediate presales, deposits, or starter bookings.`
        },
        {
          id: "1 to 3 months",
          title: "1 to 3 Months (Quick Start)",
          sub: "Validate quickly and build steady monthly revenue over your first 30 to 90 days."
        },
        {
          id: "3 to 6 months",
          title: "3 to 6 Months (Steady Build)",
          sub: "Balance early revenue with building repeat orders, B2B accounts, or local partnerships."
        },
        {
          id: "6 to 12 months",
          title: "6 to 12 Months (High-Ceiling Scale)",
          sub: "Ideal for licensed high-earning professions (like financial advising or mortgage), government contracting, or large catalogs."
        }
      ];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">Choose Your <em>Target Timeline</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select how quickly you need your new business to start bringing in revenue.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${timelines
            .map(
              (tl) => `
            <div class="option-card ${state.profile.timeline === tl.id ? "selected" : ""}" data-timeline="${tl.id}">
              <div class="option-content">
                <div class="option-title">${tl.title}</div>
                <div class="option-sub">${tl.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 2 && sub === 1) {
      const hourOptions = [
        {
          val: 4,
          label: "Under 5 hours/week",
          sub: "Nap times, early mornings, or 45 minutes a day after bedtime"
        },
        {
          val: 8,
          label: "5 to 10 hours/week",
          sub: "A couple of focused blocks during school hours, daycare, or weekends"
        },
        {
          val: 13,
          label: "10 to 15 hours/week",
          sub: "Part-time schedule (2 to 3 hours per weekday)"
        },
        {
          val: 20,
          label: "15 to 25+ hours/week",
          sub: "Ready to dedicate half-days or full days to building a high-earning business"
        }
      ];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">How Many Hours Per Week Can You <em>Realistically Give</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Be completely honest about your current season of life. We filter out business models that demand 30+ hours if you only have 10.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${hourOptions
            .map(
              (opt) => `
            <div class="option-card ${Number(state.profile.hoursPerWeek) === opt.val ? "selected" : ""}" data-hours="${opt.val}" data-hours-label="${opt.label}">
              <div class="option-content">
                <div class="option-title">${opt.label}</div>
                <div class="option-sub">${opt.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 2 && sub === 2) {
      const rhythms = window.SCHEDULE_RHYTHMS || [];
      const currentRhythm = state.profile.scheduleRhythm || "";

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">When Do Those <em>Available Hours Happen</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Not all hours are created equal in motherhood. Tell us how those hours are shaped so we match businesses that fit your actual daily pattern.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${rhythms
            .map(
              (rh) => `
            <div class="option-card ${currentRhythm === rh.id ? "selected" : ""}" data-rhythm="${rh.id}">
              <div class="option-content">
                <div class="option-title">${rh.label || rh.title || ""}</div>
                <div class="option-sub">${rh.sub || rh.desc || ""}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 3 && sub === 1) {
      const selectedBgs = state.profile.backgrounds || [];
      const allBgs = window.PROFESSIONAL_BACKGROUNDS || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">03</span>
          <div>
            <h2 class="step-title">Select Your <em>Background & Past Experience</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select work, education, or homemaker backgrounds from the dropdown below. You can select multiple.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box">
          <label for="fitBgSelect" style="display: block; font-size: 0.92rem; font-weight: 800; color: var(--forest-dark); margin-bottom: 8px;">
            Choose background to add:
          </label>
          <select id="fitBgSelect" class="form-input" style="cursor: pointer; font-size: 0.96rem; padding: 12px 14px;">
            <option value="">+ Choose a background to add...</option>
            ${allBgs
              .map((b) => {
                const isSel = selectedBgs.includes(b.id);
                return `<option value="${b.id}">${isSel ? "✓ " : ""}${b.label || b.title}</option>`;
              })
              .join("")}
          </select>

          <div class="multi-select-tags-wrap" id="fitBgTagsWrap">
            ${
              selectedBgs.length === 0
                ? `<span style="font-size: 0.85rem; color: var(--ink-muted); font-style: italic;">No backgrounds selected yet. Select from the dropdown above.</span>`
                : selectedBgs
                    .map((id) => {
                      const item = allBgs.find((b) => b.id === id);
                      const name = item ? (item.label || item.title) : id;
                      return `
                        <span class="multi-select-tag">
                          ${name}
                          <button type="button" class="tag-remove-btn" data-remove-bg="${id}" aria-label="Remove ${name}">×</button>
                        </span>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      `;
    } else if (s === 3 && sub === 2) {
      const licensingChoice = state.profile.licensingOpenness || "";
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">03</span>
          <div>
            <h2 class="step-title">How Do You Feel About <em>Licensing or Certifications</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Certain high-earning professions (like financial advisory, mortgage, bookkeeping certifications) have high income potential but require licensing.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.LICENSING_OPTIONS || [])
            .map(
              (lic) => `
            <div class="option-card ${licensingChoice === lic.id ? "selected" : ""}" data-licensing="${lic.id}">
              <div class="option-content">
                <div class="option-title">${lic.label || lic.title || ""}</div>
                <div class="option-sub">${lic.sub || lic.desc || ""}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 4 && sub === 1) {
      const selected = state.profile.skills || [];
      const activeSkillCount = selected.filter((x) => x !== "unsure").length;
      const isUnsure = selected.includes("unsure");
      const allSkills = window.SKILL_CATEGORIES || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">04</span>
          <div>
            <h2 class="step-title">What Are Your <em>Strongest Core Skills</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select up to 4 core capabilities from the dropdown or quick buttons below, or choose "Not Sure Yet" to see approachable starter businesses.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label for="fitSkillSelect" style="font-size: 0.92rem; font-weight: 800; color: var(--forest-dark);">
              Choose core skill to add:
            </label>
            <span class="selection-counter-pill ${activeSkillCount >= 4 ? "max-reached" : ""}">
              ${isUnsure ? "Starter Mode" : `${activeSkillCount} of 4 selected`}
            </span>
          </div>

          <select id="fitSkillSelect" class="form-input" style="cursor: pointer; font-size: 0.96rem; padding: 12px 14px;">
            <option value="">+ Choose a skill to add (up to 4)...</option>
            ${allSkills
              .map((cat) => {
                const isSel = selected.includes(cat.id);
                return `<option value="${cat.id}">${isSel ? "✓ " : ""}${cat.label || cat.title}</option>`;
              })
              .join("")}
            <option value="unsure" ${isUnsure ? "selected" : ""}>Not Sure Yet (Starter Ideas)</option>
          </select>

          <div class="multi-select-tags-wrap" id="fitSkillTagsWrap">
            ${
              selected.length === 0
                ? `<span style="font-size: 0.85rem; color: var(--ink-muted); font-style: italic;">No skills selected yet. Select from the dropdown above.</span>`
                : selected
                    .map((id) => {
                      if (id === "unsure") {
                        return `
                          <span class="multi-select-tag" style="background:#FFF0F5; border-color:var(--hot-pink); color:var(--forest-dark);">
                            Not Sure Yet (Starter Ideas)
                            <button type="button" class="tag-remove-btn" data-remove-skill="unsure" aria-label="Remove unsure">×</button>
                          </span>
                        `;
                      }
                      const item = allSkills.find((cat) => cat.id === id);
                      const name = item ? (item.label || item.title) : id;
                      return `
                        <span class="multi-select-tag">
                          ${name}
                          <button type="button" class="tag-remove-btn" data-remove-skill="${id}" aria-label="Remove ${name}">×</button>
                        </span>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      `;
    } else if (s === 4 && sub === 2) {
      const directionChoice = state.profile.skillDirection || "";
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">04</span>
          <div>
            <h2 class="step-title">How Do You Want to <em>Use Your Existing Skills</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Just because you are skilled at something does not mean you have to build around it. Tell us your preference.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.SKILL_DIRECTIONS || [])
            .map(
              (dir) => `
            <div class="option-card ${directionChoice === dir.id ? "selected" : ""}" data-skill-direction="${dir.id}">
              <div class="option-content">
                <div class="option-title">${dir.label || dir.title || ""}</div>
                <div class="option-sub">${dir.sub || dir.desc || ""}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 5 && sub === 1) {
      const selectedActivities = state.profile.enjoyedActivities || [];
      const allActs = window.ENJOYED_ACTIVITIES || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">05</span>
          <div>
            <h2 class="step-title">What Activities or Hobbies Do You <em>Genuinely Enjoy</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Set aside your resume for a moment. What do you naturally love doing for fun on a Saturday? Pick up to 3 from the dropdown or quick chips.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label for="fitHobbySelect" style="font-size: 0.92rem; font-weight: 800; color: var(--forest-dark);">
              Choose hobby or activity to add:
            </label>
            <span class="selection-counter-pill ${selectedActivities.length >= 3 ? "max-reached" : ""}">
              ${selectedActivities.length} of 3 selected
            </span>
          </div>

          <select id="fitHobbySelect" class="form-input" style="cursor: pointer; font-size: 0.96rem; padding: 12px 14px;">
            <option value="">+ Choose a hobby to add (up to 3)...</option>
            ${allActs
              .map((act) => {
                const isSel = selectedActivities.includes(act.id);
                return `<option value="${act.id}">${isSel ? "✓ " : ""}${act.label || act.title}</option>`;
              })
              .join("")}
          </select>

          <div class="multi-select-tags-wrap" id="fitHobbyTagsWrap">
            ${
              selectedActivities.length === 0
                ? `<span style="font-size: 0.85rem; color: var(--ink-muted); font-style: italic;">No hobbies selected yet. Select from the dropdown above.</span>`
                : selectedActivities
                    .map((id) => {
                      const item = allActs.find((act) => act.id === id);
                      const name = item ? (item.label || item.title) : id;
                      return `
                        <span class="multi-select-tag">
                          ${name}
                          <button type="button" class="tag-remove-btn" data-remove-hobby="${id}" aria-label="Remove ${name}">×</button>
                        </span>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      `;
    } else if (s === 5 && sub === 2) {
      const selectedLife = state.profile.livedExperiences || [];
      const allLife = window.LIVED_EXPERIENCES || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">05</span>
          <div>
            <h2 class="step-title">Which Life or Motherhood Chapters Have You <em>Personally Walked Through</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Your lived journey is often your strongest authority and marketing magnet. Select any chapters that apply.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box">
          <label for="fitLifeSelect" style="display: block; font-size: 0.92rem; font-weight: 800; color: var(--forest-dark); margin-bottom: 8px;">
            Choose lived chapter to add:
          </label>
          <select id="fitLifeSelect" class="form-input" style="cursor: pointer; font-size: 0.96rem; padding: 12px 14px;">
            <option value="">+ Choose a lived chapter to add...</option>
            ${allLife
              .map((lex) => {
                const isSel = selectedLife.includes(lex.id);
                return `<option value="${lex.id}">${isSel ? "✓ " : ""}${lex.label || lex.title}</option>`;
              })
              .join("")}
          </select>

          <div class="multi-select-tags-wrap" id="fitLifeTagsWrap">
            ${
              selectedLife.length === 0
                ? `<span style="font-size: 0.85rem; color: var(--ink-muted); font-style: italic;">No lived experiences selected yet. Select from the dropdown above.</span>`
                : selectedLife
                    .map((id) => {
                      const item = allLife.find((lex) => lex.id === id);
                      const name = item ? (item.label || item.title) : id;
                      return `
                        <span class="multi-select-tag">
                          ${name}
                          <button type="button" class="tag-remove-btn" data-remove-life="${id}" aria-label="Remove ${name}">×</button>
                        </span>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      `;
    } else if (s === 6 && sub === 1) {
      const styles = [
        {
          id: "behind-the-scenes",
          title: "Behind-the-Scenes & Solo",
          sub: "At home or online: digital products, e-commerce, grant writing, baking/making, contracting, or quiet remote work."
        },
        {
          id: "client-facing",
          title: "People-Facing & Advisory",
          sub: "In-person or consultations: coaching, consulting, financial advising, mortgage/placement advisory, local events, or teaching."
        },
        {
          id: "any",
          title: "Open to Either Format",
          sub: `Show me the strongest overall path to my ${fmtGoalPeriod()} target regardless of format.`
        }
      ];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">06</span>
          <div>
            <h2 class="step-title">Preferred <em>Business Environment</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Do you prefer working quietly behind-the-scenes solo, or interacting directly with clients and people?
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${styles
            .map(
              (st) => `
            <div class="option-card ${state.profile.workStyle === st.id ? "selected" : ""}" data-workstyle="${st.id}">
              <div class="option-content">
                <div class="option-title">${st.title}</div>
                <div class="option-sub">${st.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 6 && sub === 2) {
      const b250 = window.VaultEngine.scaleUsdToCurrency(250, cur.code);
      const b1000 = window.VaultEngine.scaleUsdToCurrency(1000, cur.code);
      const b3000 = window.VaultEngine.scaleUsdToCurrency(3000, cur.code);

      const budgets = [
        {
          val: 0,
          label: `${cur.symbol}0 Bootstrapped`,
          sub: "Start with free tools, existing skills, and what I already have at home"
        },
        {
          val: 250,
          label: `Under ${fmtMoney(b250)}`,
          sub: "Starter basics: supplies, packaging, domain/software, or a simple starter kit"
        },
        {
          val: 1000,
          label: `${fmtMoney(b250)} to ${fmtMoney(b1000)}`,
          sub: "Licensing exams, professional certifications, DJ/camera/event gear, or wholesale materials"
        },
        {
          val: 3000,
          label: `${fmtMoney(b1000)} to ${fmtMoney(b3000)}`,
          sub: "Salon/esthetician suite setup, commercial equipment, LLC/insurance, or initial retail inventory"
        },
        {
          val: 10000,
          label: `${fmtMoney(b3000)}+ Capital`,
          sub: "Ready to invest in a commercial space, team/subcontractors, paid lead generation, or high-ceiling scale"
        }
      ];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">06</span>
          <div>
            <h2 class="step-title">What Is Your <em>Available Startup Budget</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              What are you comfortable investing right now to get your business off the ground?
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${budgets
            .map(
              (b) => `
            <div class="option-card ${state.profile.budget !== null && state.profile.budget !== undefined && Number(state.profile.budget) === b.val ? "selected" : ""}" data-budget="${b.val}">
              <div class="option-content">
                <div class="option-title">${b.label}</div>
                <div class="option-sub">${b.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 6 && sub === 3) {
      const selectedDealbreakers = state.profile.dealbreakers || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">06</span>
          <div>
            <h2 class="step-title">Any Hard Dealbreakers or <em>Unique Passions</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Filter out anything you refuse to do, and share any specific industry or dream business idea.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading">Part A: Hard Dealbreakers (Optional, select anything you want filtered out):</h3>
        <div class="options-grid options-grid-compact" style="margin-bottom: 24px;">
          ${(window.HARD_DEALBREAKERS || [])
            .map((db) => {
              const isSel = selectedDealbreakers.includes(db.id);
              return `
              <div class="option-card ${isSel ? "selected" : ""}" data-dealbreaker="${db.id}">
                <div class="option-content">
                  <div class="option-title">${db.label || db.title || ""}</div>
                  <div class="option-sub">${db.sub || db.desc || ""}</div>
                </div>
                <div class="option-check">✓</div>
              </div>
            `;
            })
            .join("")}
        </div>

        <h3 class="sub-section-heading">Part B: Your Specific Industry, Background or Passion (Optional):</h3>
        <p style="font-size: 0.88rem; color: var(--ink-muted); margin-bottom: 8px;">
          Have a unique career, degree, or specialty you love? Type it here (e.g., ex-Bain / management consulting, STEM curriculum & scientific research, admissions consulting, creative writing, knitting) so your matches are tailored to your exact world.
        </p>
        <div style="margin-bottom: 8px;">
          <input
            type="text"
            id="customNoteInput"
            class="form-input"
            placeholder="e.g., Management consulting, scientific research & STEM programs, admissions, novel writing..."
            value="${(state.profile.customNote || "").replace(/"/g, "&quot;")}"
          />
        </div>
      `;
    }

    const isLastFitQuestion = s === 6 && sub === 3;

    return `
      <div class="quiz-shell">
        <div class="progress-header">
          <div class="progress-meta">
            <span>SECTION ${s} OF ${state.totalQuizSteps} (PART ${sub} OF ${maxSub})</span>
            <span>Target: ${fmtTargetHeaderSummary()} • ${pct}% Complete</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="quiz-body typeform-card">
          <div class="typeform-nav-bar" style="${s === 1 && sub === 1 ? 'justify-content: flex-end;' : ''}">
            ${
              s > 1 || sub > 1
                ? `<button type="button" class="btn-typeform-back" id="btnPrevStep">
                    ← Back
                  </button>`
                : ""
            }
            <span class="typeform-step-badge">Question ${s}.${sub} of ${maxSub}</span>
          </div>

          ${stepContent}

          ${
            state.validationError
              ? `<div class="step-validation-banner" id="stepValidationBanner" role="alert">
                  <strong>Quick Check Before Continuing:</strong> ${state.validationError}
                </div>`
              : ``
          }

          ${
            state.limitNotice
              ? `<div class="selection-limit-notice" role="status">${state.limitNotice}</div>`
              : ``
          }

          <div class="quiz-footer">
            <div style="display: flex; align-items: center; gap: 10px;">
              <button type="button" class="btn-ghost-sm" id="btnStartOverQuiz" style="font-size: 0.82rem; color: var(--ink-muted);">
                Start Over
              </button>
            </div>
            <button type="button" class="btn-primary" id="btnNextStep">
              ${isLastFitQuestion ? "See My Top 3 Business Matches" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindQuizEvents() {
    const s = state.step;
    const sub = state.subStep || 1;

    // Currency Switcher
    document.querySelectorAll("[data-currency]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newCode = btn.getAttribute("data-currency");
        if (newCode && newCode !== state.profile.currency) {
          state.profile.currency = newCode;
          saveUserProgress();
          render();
        }
      });
    });

    // Step 1 Sub 1: Income Goal
    if (s === 1 && sub === 1) {
      const slider = document.getElementById("incomeSlider");
      const customInput = document.getElementById("customIncomeInput");
      const displayNum = document.getElementById("incomeDisplayNum");
      const annualSub = document.getElementById("incomeAnnualSub");
      const insightBanner = document.getElementById("tierInsightBanner");

      function updateIncomeGoal(val, switchToMonthlyIfFlash = false) {
        const cur = getCur();
        const clean = Math.max(100, Number(val) || cur.defaultGoal);
        state.profile.incomeGoal = clean;
        if (switchToMonthlyIfFlash && state.profile.timeline === "2-week flash") {
          state.profile.timeline = "1 to 3 months";
          state.validationError = "";
          saveUserProgress();
          render();
          return;
        }
        if (state.profile.timeline === "2-week flash" && clean > 2500) {
          state.profile.timeline = "1 to 3 months";
          state.validationError = "";
          saveUserProgress();
          render();
          return;
        }
        if (displayNum) displayNum.textContent = fmtMoney(clean);
        if (annualSub) {
          annualSub.innerHTML = isFlashTimeline()
            ? `2-Week Flash Sprint (<strong>${fmtMoney(clean * 2)}/month</strong> pace)`
            : `That is <strong>${fmtMoney(clean * 12)}/year</strong> in additional income`;
        }
        if (insightBanner) insightBanner.innerHTML = getIncomeTierInsight(clean);
        if (slider && clean <= cur.max) slider.value = clean;
        if (customInput && Number(customInput.value) !== clean) customInput.value = clean;
        document.querySelectorAll("[data-preset]").forEach((btn) => {
          btn.classList.toggle("active", !isFlashTimeline() && Number(btn.getAttribute("data-preset")) === clean);
        });
        saveUserProgress();
      }

      if (slider) slider.addEventListener("input", (e) => updateIncomeGoal(e.target.value, false));
      if (customInput) customInput.addEventListener("input", (e) => updateIncomeGoal(e.target.value, false));
      document.querySelectorAll("[data-preset]").forEach((btn) => {
        btn.addEventListener("click", () => updateIncomeGoal(btn.getAttribute("data-preset"), true));
      });
    }

    // Step 1 Sub 2: Timeline
    if (s === 1 && sub === 2) {
      document.querySelectorAll("[data-timeline]").forEach((card) => {
        card.addEventListener("click", () => {
          const val = card.getAttribute("data-timeline");
          const cur = getCur();
          const currentGoal = Number(state.profile.incomeGoal) || cur.defaultGoal;
          const flashLimit = window.VaultEngine.scaleUsdToCurrency(2500, cur.code);
          if (val === "2-week flash" && currentGoal > flashLimit) {
            state.profile.incomeGoal = window.VaultEngine.scaleUsdToCurrency(1500, cur.code);
          }
          state.profile.timeline = val;
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 2 Sub 1: Hours
    if (s === 2 && sub === 1) {
      document.querySelectorAll("[data-hours]").forEach((card) => {
        card.addEventListener("click", () => {
          state.profile.hoursPerWeek = Number(card.getAttribute("data-hours"));
          state.profile.hoursLabel = card.getAttribute("data-hours-label") || "";
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 2 Sub 2: Rhythm
    if (s === 2 && sub === 2) {
      document.querySelectorAll("[data-rhythm]").forEach((card) => {
        card.addEventListener("click", () => {
          state.profile.scheduleRhythm = card.getAttribute("data-rhythm");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 3 Sub 1: Backgrounds (Dropdown, Tags & Quick Chips)
    if (s === 3 && sub === 1) {
      const bgSelect = document.getElementById("fitBgSelect");
      if (bgSelect) {
        bgSelect.addEventListener("change", (e) => {
          const val = e.target.value;
          if (!val) return;
          const current = state.profile.backgrounds || [];
          if (!current.includes(val)) {
            state.profile.backgrounds = [...current, val];
            state.validationError = "";
            saveUserProgress();
            render();
          }
          bgSelect.value = "";
        });
      }

      document.querySelectorAll("[data-remove-bg]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-remove-bg");
          state.profile.backgrounds = (state.profile.backgrounds || []).filter((x) => x !== id);
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      document.querySelectorAll("[data-quick-bg]").forEach((chip) => {
        chip.addEventListener("click", () => {
          const id = chip.getAttribute("data-quick-bg");
          const current = state.profile.backgrounds || [];
          if (current.includes(id)) {
            state.profile.backgrounds = current.filter((x) => x !== id);
          } else {
            state.profile.backgrounds = [...current, id];
          }
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });
    }

    // Step 3 Sub 2: Licensing
    if (s === 3 && sub === 2) {
      document.querySelectorAll("[data-licensing]").forEach((card) => {
        card.addEventListener("click", () => {
          state.profile.licensingOpenness = card.getAttribute("data-licensing");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 4 Sub 1: Skills (Dropdown, Tags & Quick Chips)
    if (s === 4 && sub === 1) {
      const skillSelect = document.getElementById("fitSkillSelect");
      if (skillSelect) {
        skillSelect.addEventListener("change", (e) => {
          const val = e.target.value;
          if (!val) return;
          if (val === "unsure") {
            state.profile.skills = ["unsure"];
            state.limitNotice = "";
            state.validationError = "";
            saveUserProgress();
            render();
            return;
          }
          const current = state.profile.skills || [];
          const filtered = current.filter((x) => x !== "unsure");
          if (filtered.includes(val)) {
            skillSelect.value = "";
            return;
          }
          if (filtered.length >= 4) {
            state.limitNotice = "You can select up to 4 core skills so your recommendations stay hyper-focused. Tap the (x) on any selected skill tag to swap it.";
            render();
            return;
          }
          state.profile.skills = [...filtered, val];
          state.limitNotice = "";
          state.validationError = "";
          saveUserProgress();
          render();
        });
      }

      document.querySelectorAll("[data-remove-skill]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-remove-skill");
          state.profile.skills = (state.profile.skills || []).filter((x) => x !== id);
          state.limitNotice = "";
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      document.querySelectorAll("[data-quick-skill]").forEach((chip) => {
        chip.addEventListener("click", () => {
          const id = chip.getAttribute("data-quick-skill");
          const current = state.profile.skills || [];
          if (id === "unsure") {
            state.profile.skills = current.includes("unsure") ? [] : ["unsure"];
            state.limitNotice = "";
          } else {
            const filtered = current.filter((x) => x !== "unsure");
            if (filtered.includes(id)) {
              state.profile.skills = filtered.filter((x) => x !== id);
              state.limitNotice = "";
            } else {
              if (filtered.length >= 4) {
                state.limitNotice = "You can select up to 4 core skills so your recommendations stay hyper-focused. Tap the (x) on any selected skill tag to swap it.";
                render();
                return;
              }
              state.profile.skills = [...filtered, id];
              state.limitNotice = "";
            }
          }
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });
    }

    // Step 4 Sub 2: Skill Direction
    if (s === 4 && sub === 2) {
      document.querySelectorAll("[data-skill-direction]").forEach((card) => {
        card.addEventListener("click", () => {
          state.profile.skillDirection = card.getAttribute("data-skill-direction");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 5 Sub 1: Hobbies (Dropdown, Tags & Quick Chips)
    if (s === 5 && sub === 1) {
      const hobbySelect = document.getElementById("fitHobbySelect");
      if (hobbySelect) {
        hobbySelect.addEventListener("change", (e) => {
          const val = e.target.value;
          if (!val) return;
          const current = state.profile.enjoyedActivities || [];
          if (current.includes(val)) {
            hobbySelect.value = "";
            return;
          }
          if (current.length >= 3) {
            state.limitNotice = "You can select up to 3 real-life hobbies so your recommendations stay hyper-focused. Tap the (x) on any selected hobby tag to swap it.";
            render();
            return;
          }
          state.profile.enjoyedActivities = [...current, val];
          state.limitNotice = "";
          state.validationError = "";
          saveUserProgress();
          render();
        });
      }

      document.querySelectorAll("[data-remove-hobby]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-remove-hobby");
          state.profile.enjoyedActivities = (state.profile.enjoyedActivities || []).filter((x) => x !== id);
          state.limitNotice = "";
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      document.querySelectorAll("[data-quick-hobby]").forEach((chip) => {
        chip.addEventListener("click", () => {
          const id = chip.getAttribute("data-quick-hobby");
          const current = state.profile.enjoyedActivities || [];
          if (current.includes(id)) {
            state.profile.enjoyedActivities = current.filter((x) => x !== id);
            state.limitNotice = "";
          } else {
            if (current.length >= 3) {
              state.limitNotice = "You can select up to 3 real-life hobbies so your recommendations stay hyper-focused. Tap the (x) on any selected hobby tag to swap it.";
              render();
              return;
            }
            state.profile.enjoyedActivities = [...current, id];
            state.limitNotice = "";
          }
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });
    }

    // Step 5 Sub 2: Lived Experiences (Dropdown, Tags & Quick Chips)
    if (s === 5 && sub === 2) {
      const lifeSelect = document.getElementById("fitLifeSelect");
      if (lifeSelect) {
        lifeSelect.addEventListener("change", (e) => {
          const val = e.target.value;
          if (!val) return;
          const current = state.profile.livedExperiences || [];
          if (!current.includes(val)) {
            state.profile.livedExperiences = [...current, val];
            state.validationError = "";
            saveUserProgress();
            render();
          }
          lifeSelect.value = "";
        });
      }

      document.querySelectorAll("[data-remove-life]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-remove-life");
          state.profile.livedExperiences = (state.profile.livedExperiences || []).filter((x) => x !== id);
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      document.querySelectorAll("[data-quick-life]").forEach((chip) => {
        chip.addEventListener("click", () => {
          const id = chip.getAttribute("data-quick-life");
          const current = state.profile.livedExperiences || [];
          if (current.includes(id)) {
            state.profile.livedExperiences = current.filter((x) => x !== id);
          } else {
            state.profile.livedExperiences = [...current, id];
          }
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });
    }

    // Step 6 Sub 1: Workstyle
    if (s === 6 && sub === 1) {
      document.querySelectorAll("[data-workstyle]").forEach((card) => {
        card.addEventListener("click", () => {
          state.profile.workStyle = card.getAttribute("data-workstyle");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 6 Sub 2: Budget
    if (s === 6 && sub === 2) {
      document.querySelectorAll("[data-budget]").forEach((card) => {
        card.addEventListener("click", () => {
          state.profile.budget = Number(card.getAttribute("data-budget"));
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 6 Sub 3: Dealbreakers & Custom Note
    if (s === 6 && sub === 3) {
      document.querySelectorAll("[data-dealbreaker]").forEach((card) => {
        card.addEventListener("click", () => {
          const dbId = card.getAttribute("data-dealbreaker");
          const current = state.profile.dealbreakers || [];
          if (current.includes(dbId)) {
            state.profile.dealbreakers = current.filter((d) => d !== dbId);
          } else {
            state.profile.dealbreakers = [...current, dbId];
          }
          saveUserProgress();
          render();
        });
      });

      const customNoteEl = document.getElementById("customNoteInput");
      if (customNoteEl) {
        customNoteEl.addEventListener("input", (e) => {
          state.profile.customNote = e.target.value;
          saveUserProgress();
        });
      }
    }

    // Global Navigation: Back, Continue, Start Over
    const prevBtn = document.getElementById("btnPrevStep");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        retreatSubStep();
      });
    }

    const nextBtn = document.getElementById("btnNextStep");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        advanceSubStep();
      });
    }

    const startOverQuizBtn = document.getElementById("btnStartOverQuiz");
    if (startOverQuizBtn) {
      startOverQuizBtn.addEventListener("click", () => {
        resetAssessmentAndStartOver();
      });
    }
  }

  // ============================================================================
  // STEP 5: NAME & EMAIL CAPTURE + CONCISE CHECK-IN OPT-IN & CONSENT NOTE
  // ============================================================================
  function renderEmailGate() {
    const goalPeriodText = isFlashTimeline()
      ? `${fmtMoney(state.profile.incomeGoal)} in 14 Days`
      : `${fmtMoney(state.profile.incomeGoal)}/Month`;
    const m1 = state.topMatches[0] || {};
    const m2 = state.topMatches[1] || {};
    const m3 = state.topMatches[2] || {};

    return `
      <div class="gate-card">
        <div class="eyebrow-pill">Assessment Complete · Top 3 Matches Ready</div>
        <h2 class="step-title" style="font-size: 2rem;">
          Your 3 Personalized Recommendations for <em>${goalPeriodText}</em>
        </h2>
        <p class="step-desc" style="max-width: 560px; margin: 8px auto 18px;">
          Matched to your <strong>${state.profile.hoursPerWeek} hrs/week</strong> schedule and <strong>${state.profile.timeline}</strong> timeline, including requirements, tradeoffs, and your step-by-step action plan.
        </p>

        <div class="gate-teaser-grid">
          ${[m1, m2, m3]
            .map(
              (item, idx) => `
            <div class="teaser-pill-card">
              <div class="teaser-rank">#${idx + 1} Match • ${item.matchScore || 95}% Fit</div>
              <div class="teaser-blurred-title">
                <span class="blur-mask">${(item.name || "Matched Business Profile").slice(0, 18)}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--ink-muted);">
                Category: <strong>${item.category || "Flexible Business"}</strong><br/>
                Ease Rating: <strong>${item.easeOf5k || 5} / 5</strong>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div style="background: var(--bg-cream); border-radius: var(--radius-md); padding: 22px; margin-bottom: 16px;">
          <h3 style="font-size: 1.12rem; font-weight: 800; margin-bottom: 6px;">
            Enter your name and email to view your recommendations & action plan
          </h3>
          <p style="font-size: 0.88rem; color: var(--ink-muted); margin-bottom: 16px;">
            Unlock your full report right now and receive a copy in your inbox.
          </p>

          <form id="emailGateForm" class="gate-form">
            <input
              type="text"
              id="gateFirstName"
              class="form-input"
              placeholder="Your First Name"
              value="${state.profile.firstName || ""}"
              required
            />
            <input
              type="email"
              id="gateEmail"
              class="form-input"
              placeholder="Your Email Address"
              value="${state.profile.email || ""}"
              required
            />

            <div class="checkin-optin-box">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700;">
                <input
                  type="checkbox"
                  id="gateCheckInToggle"
                  style="width: 16px; height: 16px; accent-color: #10B981;"
                  ${state.profile.checkInCadence !== "report-only" ? "checked" : ""}
                />
                <span>Send me progress check-in emails to help me stay on track.</span>
              </label>
            </div>

            <button type="submit" class="btn-primary" id="btnUnlockResults" style="width: 100%; font-size: 1.04rem;">
              View My 3 Recommendations & Action Plan
            </button>
          </form>
          <div class="gate-privacy">
            By submitting, you agree to receive your personalized report and occasional business updates by email.
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn-ghost-sm" id="btnBackToQuizFromGate">
            Edit My Assessment Answers
          </button>
          <button type="button" class="btn-ghost-sm" id="btnStartOverFromGate">
            Start Over
          </button>
        </div>
      </div>
    `;
  }

  function saveLeadToBrowserStorage(leadRecord) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_LEADS_KEY) || "[]");
      existing.unshift(leadRecord);
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(existing));
    } catch (_) {}
  }

  function bindGateEvents() {
    const backBtn = document.getElementById("btnBackToQuizFromGate");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        state.step = 6;
        saveUserProgress();
        render();
      });
    }

    const startOverGateBtn = document.getElementById("btnStartOverFromGate");
    if (startOverGateBtn) {
      startOverGateBtn.addEventListener("click", () => {
        resetAssessmentAndStartOver();
      });
    }

    const form = document.getElementById("emailGateForm");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const firstName = (document.getElementById("gateFirstName").value || "").trim();
        const email = (document.getElementById("gateEmail").value || "").trim();
        const checkInChecked = document.getElementById("gateCheckInToggle")?.checked ?? true;
        if (!email || !email.includes("@")) return;

        state.profile.firstName = firstName || "Friend";
        state.profile.email = email;
        state.profile.checkInCadence = checkInChecked ? "weekly-checkins" : "report-only";

        computeRecommendations();
        saveUserProgress();

        const btn = document.getElementById("btnUnlockResults");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Loading Your Personalized Recommendations...";
        }

        const leadRecord = {
          timestamp: new Date().toISOString(),
          firstName: state.profile.firstName,
          email: state.profile.email,
          currency: state.profile.currency,
          incomeGoal: state.profile.incomeGoal,
          timeline: state.profile.timeline,
          hoursPerWeek: state.profile.hoursPerWeek,
          scheduleRhythm: state.profile.scheduleRhythm,
          backgrounds: (state.profile.backgrounds || []).join(", "),
          licensingOpenness: state.profile.licensingOpenness,
          budget: state.profile.budget,
          skills: (state.profile.skills || []).join(", "),
          skillDirection: state.profile.skillDirection,
          enjoyedActivities: (state.profile.enjoyedActivities || []).join(", "),
          livedExperiences: (state.profile.livedExperiences || []).join(", "),
          dealbreakers: (state.profile.dealbreakers || []).join(", "),
          customNote: state.profile.customNote || "",
          workStyle: state.profile.workStyle,
          checkInCadence: state.profile.checkInCadence,
          topIdea1: state.topMatches[0]?.name || "",
          topIdea2: state.topMatches[1]?.name || "",
          topIdea3: state.topMatches[2]?.name || "",
          completedTasksCount: state.completedTasks.length
        };
        saveLeadToBrowserStorage(leadRecord);

        const fitFormId = state.config.kitFitFormId || state.config.kitFormId || "10105556";
        const kitKey = state.config.kitApiKey || "KNfaWYKoCU8IZgyhEK_Lag";

        const customFields = {
          assessment_type: "Business Fit",
          currency: state.profile.currency || "USD",
          income_goal: `${state.profile.currency || "USD"} ${state.profile.incomeGoal || 4000}/mo`,
          timeline: state.profile.timeline || "3-6 months",
          hours_per_week: String(state.profile.hoursPerWeek || ""),
          startup_budget: String(state.profile.budget || 0),
          skills: (state.profile.skills || []).join(", "),
          check_in_emails: state.profile.checkInCadence || "weekly",
          top_idea_1: leadRecord.topIdea1,
          top_idea_2: leadRecord.topIdea2,
          top_idea_3: leadRecord.topIdea3
        };

        // Guarantee #1: Direct client-side submission to Kit (ConvertKit) public form endpoint
        const directKitPromise = fetch(`https://api.convertkit.com/v3/forms/${fitFormId}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: kitKey,
            email: state.profile.email,
            first_name: state.profile.firstName,
            fields: customFields
          })
        }).catch(() => null);

        // Guarantee #2: Server-side API submission for backend persistence & secret authentication
        const backendPromise = fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: state.profile.firstName,
            email: state.profile.email,
            assessmentType: "Business Fit",
            profile: state.profile,
            topIdeas: state.topMatches,
            completedTasks: state.completedTasks,
            config: {
              kitApiKey: kitKey,
              kitFormId: fitFormId,
              kitTagId: state.config.kitTagId
            }
          })
        }).catch(() => null);

        await Promise.allSettled([directKitPromise, backendPromise]);

        state.step = 8;
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        triggerAiEnhancement();
      });
    }
  }

  async function triggerAiEnhancement() {
    state.aiEnhancing = true;
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: state.profile,
          topIdeas: state.topMatches,
          config: {
            aiProvider: state.config.aiProvider,
            geminiApiKey: state.config.geminiApiKey,
            openaiApiKey: state.config.openaiApiKey
          }
        })
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && data.aiEnhanced && Array.isArray(data.customPlaybooks)) {
        data.customPlaybooks.forEach((custom, idx) => {
          if (!state.playbooks[idx]) return;
          if (custom.whyItFitsYou) state.topMatches[idx].aiWhyFits = custom.whyItFitsYou;
          if (custom.customOfferAndMath) state.playbooks[idx].incomeMath.aiCustomNote = custom.customOfferAndMath;
          if (custom.sevenDayValidationTest) state.playbooks[idx].testingStrategy.summary = custom.sevenDayValidationTest;
          if (custom.outreachScript) state.playbooks[idx].testingStrategy.outreachScript = custom.outreachScript;
          if (custom.day30Milestone && state.playbooks[idx].implementationStrategy.phases[0]) {
            state.playbooks[idx].implementationStrategy.phases[0].focus = custom.day30Milestone;
          }
          if (custom.day60Milestone && state.playbooks[idx].implementationStrategy.phases[1]) {
            state.playbooks[idx].implementationStrategy.phases[1].focus = custom.day60Milestone;
          }
          if (custom.day90Milestone && state.playbooks[idx].implementationStrategy.phases[2]) {
            state.playbooks[idx].implementationStrategy.phases[2].focus = custom.day90Milestone;
          }
        });
        state.aiEnhanced = true;
        if (state.step === 8) render();
      }
    } catch (_) {
    } finally {
      state.aiEnhancing = false;
    }
  }

  // ============================================================================
  // STEP 6: THREE RECOMMENDATIONS, REQUIREMENTS/TRADEOFFS, ACTION PLAN & OYIN CONSULTATION
  // ============================================================================
  function renderTop3ComparisonBar() {
    if (!state.topMatches || state.topMatches.length === 0) return "";
    const cur = getCur();

    return `
      <div class="comparison-summary-card">
        <div class="comparison-header-row">
          <div>
            <div class="comparison-eyebrow">Side-by-Side Snapshot</div>
            <h3 class="comparison-title">Compare Your Top 3 Business Matches at a Glance</h3>
          </div>
          <span class="comparison-hint">Click any match to jump straight to its full action plan</span>
        </div>

        <div class="comparison-grid">
          ${state.topMatches
            .map((idea, idx) => {
              const rawCost = Number(idea.startupCost) || 0;
              const scaledCost = window.VaultEngine.scaleUsdToCurrency(rawCost, cur.code);
              const costLabel =
                rawCost === 0 ? `${cur.symbol}0 Bootstrapped` : `~${fmtMoney(scaledCost)}`;
              const avgRev = fmtMoney(
                window.VaultEngine.scaleUsdToCurrency(Number(idea.avgUnitRevenue) || 250, cur.code)
              );
              const compactRankLabels = [
                "#1 Best Overall",
                "#2 Runner-Up Fit",
                "#3 Scalable Fit"
              ];
              const cleanShortName = String(idea.name || "")
                .replace(/\s*\([^)]*\)\s*/g, " ")
                .replace(/\s+/g, " ")
                .trim();

              const matchWhy =
                idea.aiWhyFits ||
                (idea.matchReasons && idea.matchReasons[0]) ||
                idea.description.slice(0, 110) + "...";

              return `
              <div class="comparison-col ${idx === 0 ? "rank-1" : ""}">
                <div class="comparison-col-header">
                  <div class="comparison-col-top">
                    <span class="comparison-rank-tag">${compactRankLabels[idx] || `#${idx + 1} Match`}</span>
                    <span class="comparison-score-tag">${idea.matchScore || 95}% Fit</span>
                  </div>
                  <div class="comparison-idea-name" title="${(idea.name || "").replace(/"/g, "&quot;")}">${cleanShortName || idea.name}</div>
                  <div class="comparison-category">${idea.category}</div>
                  <div class="comparison-why-preview" style="font-size: 0.82rem; color: var(--ink-muted); margin: 8px 0 10px; line-height: 1.45; background: rgba(0,0,0,0.025); padding: 8px 10px; border-radius: 8px;">
                    <strong>Why it fits:</strong> ${escapeHtml(matchWhy)}
                  </div>
                </div>

                <div class="comparison-col-footer">
                  <div class="comparison-metrics-list">
                    <div class="comparison-metric-row">
                      <span>Startup Capital</span>
                      <strong>${costLabel}</strong>
                    </div>
                    <div class="comparison-metric-row">
                      <span>Weekly Hours</span>
                      <strong>${idea.minHoursPerWeek} to ${idea.optimalHoursPerWeek} hrs/wk</strong>
                    </div>
                    <div class="comparison-metric-row">
                      <span>Avg Revenue / Unit</span>
                      <strong>${avgRev}</strong>
                    </div>
                    <div class="comparison-metric-row">
                      <span>Speed to Goal</span>
                      <strong>${idea.easeOf5k || 5} / 5</strong>
                    </div>
                  </div>

                  <button type="button" class="btn-primary comparison-jump-btn" data-focus-idea="${idx}" style="width: 100%; margin-bottom: 8px; font-weight: 800; font-size: 0.92rem; padding: 11px;">
                    View Full Plan & Math →
                  </button>
                  <button type="button" class="btn-ghost-sm swap-idea-btn" data-swap-idea="${idx}" style="width: 100%; font-size: 0.8rem; color: var(--ink-muted); text-align: center;">
                    Not for me? Swap this idea
                  </button>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderRunnerUpSection(calendlyHref) {
    if (!state.runnerUpMatches || state.runnerUpMatches.length === 0) return "";
    const cur = getCur();

    return `
      <div class="runner-up-section-card" id="runnerUpSection">
        <div class="comparison-header-row">
          <div>
            <div class="comparison-eyebrow">Honorable Mentions (#4 & #5)</div>
            <h3 class="comparison-title">2 Additional Ideas That Matched Your Profile</h3>
            <p class="runner-up-sub">
              We kept these outside your Top 3 so you can stay focused, but both matched your skills and interests. You can open either full action plan below or swap it into your Top 3.
            </p>
          </div>
        </div>

        <div class="runner-up-grid">
          ${state.runnerUpMatches
            .map((idea, rIdx) => {
              const rankNum = 4 + rIdx;
              const isExpanded = Boolean(state.expandedRunnerUps && state.expandedRunnerUps[rIdx]);
              const rawCost = Number(idea.startupCost) || 0;
              const scaledCost = window.VaultEngine.scaleUsdToCurrency(rawCost, cur.code);
              const costLabel =
                rawCost === 0 ? `${cur.symbol}0 Bootstrapped` : `~${fmtMoney(scaledCost)}`;
              const avgRev = fmtMoney(
                window.VaultEngine.scaleUsdToCurrency(Number(idea.avgUnitRevenue) || 250, cur.code)
              );
              const primaryReason =
                (idea.matchReasons && idea.matchReasons[0]) ||
                "Aligns with your selected skills, interests, and weekly schedule";

              return `
              <div class="comparison-col runner-up-col">
                <div class="comparison-col-header">
                  <div class="comparison-col-top">
                    <span class="comparison-rank-tag">#${rankNum} Honorable Mention</span>
                    <span class="comparison-score-tag runner-up-score-tag">${idea.matchScore || 78}% Fit</span>
                  </div>
                  <div class="comparison-idea-name">${idea.name}</div>
                  <div class="comparison-category">${idea.category}</div>
                  <div class="runner-up-why-box">
                    <strong>Why it matched:</strong> ${primaryReason}.
                  </div>
                </div>

                <div class="comparison-col-footer">
                  <div class="comparison-metrics-list">
                    <div class="comparison-metric-row">
                      <span>Startup Capital</span>
                      <strong>${costLabel}</strong>
                    </div>
                    <div class="comparison-metric-row">
                      <span>Weekly Hours</span>
                      <strong>${idea.minHoursPerWeek} to ${idea.optimalHoursPerWeek} hrs/wk</strong>
                    </div>
                    <div class="comparison-metric-row">
                      <span>Avg Revenue / Unit</span>
                      <strong>${avgRev}</strong>
                    </div>
                    <div class="comparison-metric-row">
                      <span>Speed to Goal</span>
                      <strong>${idea.easeOf5k || 5} / 5</strong>
                    </div>
                  </div>

                  <div class="runner-up-actions">
                    <button type="button" class="comparison-jump-btn" data-toggle-runnerup="${rIdx}">
                      ${isExpanded ? "Hide Full Action Plan" : "View Full Plan & Math"}
                    </button>
                    <button type="button" class="runner-up-swap-btn" data-swap-runnerup="${rIdx}">
                      Swap Into My Top 3
                    </button>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>

        ${state.runnerUpMatches
          .map((idea, rIdx) => {
            if (!state.expandedRunnerUps || !state.expandedRunnerUps[rIdx]) return "";
            const pb =
              (state.runnerUpPlaybooks && state.runnerUpPlaybooks[rIdx]) ||
              window.VaultEngine.buildPlaybook(idea, state.profile, 3 + rIdx);
            return `
              <div class="runner-up-expanded-wrap" id="runner-up-playbook-${rIdx}">
                ${renderSingleIdeaCard(idea, pb, 3 + rIdx, calendlyHref)}
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderResultsDashboard() {
    const goalFormatted = fmtMoney(state.profile.incomeGoal);
    const goalHeadlineText = isFlashTimeline()
      ? `${goalFormatted} in 14 Days`
      : `${goalFormatted}/Month`;
    const firstName = state.profile.firstName || "Mama";
    const consulting = state.config.consulting || window.APP_CONFIG.consulting;
    const calendlyHref = getPrefilledCalendlyUrl();

    const isFocused =
      state.selectedIdeaIdx !== null &&
      state.selectedIdeaIdx >= 0 &&
      state.selectedIdeaIdx < state.topMatches.length;

    let matchSectionHtml = "";

    if (isFocused) {
      const idx = state.selectedIdeaIdx;
      const focusedIdea = state.topMatches[idx];
      const focusedPlaybook = state.playbooks[idx];

      matchSectionHtml = `
        <!-- FOCUSED IDEA VIEW (MOBILE-FIRST) -->
        <div class="focused-idea-view" style="margin-bottom: 28px;">
          <!-- Top Navigation Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1.5px solid var(--border);">
            <button type="button" class="btn-secondary" id="btnBackToMatchesOverview" style="font-size: 0.88rem; padding: 9px 15px; font-weight: 700;">
              ← Back to All 3 Matches
            </button>
            <div style="font-size: 0.86rem; font-weight: 800; color: var(--forest);">
              Viewing Match #${idx + 1} of 3
            </div>
            <button type="button" class="btn-ghost-sm swap-idea-btn" data-swap-idea="${idx}" style="font-size: 0.84rem;">
              Not for me? Swap this idea
            </button>
          </div>

          <!-- Switcher pills between the 3 top ideas -->
          <div class="focused-ideas-tabs" style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 6px;">
            ${state.topMatches
              .map((item, i) => {
                const active = i === idx;
                const shortName = String(item.name || "").split("/")[0].split("(")[0].trim();
                return `
                <button
                  type="button"
                  class="focused-tab-pill ${active ? "active" : ""}"
                  data-switch-focused-idea="${i}"
                  style="white-space: nowrap; font-size: 0.84rem; font-weight: 800; padding: 8px 16px; border-radius: 100px; border: 1.5px solid ${active ? "var(--forest)" : "var(--border)"}; background: ${active ? "var(--forest)" : "#fff"}; color: ${active ? "#fff" : "var(--dark)"}; cursor: pointer;"
                >
                  Match #${i + 1}: ${escapeHtml(shortName)}
                </button>
              `;
              })
              .join("")}
          </div>

          <!-- Focused Single Idea Card -->
          ${renderSingleIdeaCard(focusedIdea, focusedPlaybook, idx)}

          <!-- Bottom Return / Share Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 24px; padding: 18px 20px; background: #fff; border-radius: 16px; border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);">
            <button type="button" class="btn-secondary" id="btnBackToMatchesOverviewBottom" style="font-weight: 700;">
              ← Back to All 3 Matches
            </button>
            <button type="button" class="btn-primary share-mom-btn" id="btnShareMomFocused" style="background: var(--forest); color: #fff; font-size: 0.92rem; font-weight: 800;">
              Share With a Fellow Mom
            </button>
          </div>
        </div>
      `;
    } else {
      matchSectionHtml = `
        ${renderTop3ComparisonBar()}

        <!-- Interactive Explorer Guidance Strip -->
        <div style="background: rgba(45, 90, 39, 0.06); border: 1.5px solid var(--mint); border-radius: 16px; padding: 18px 22px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px;">
            <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--forest); margin-bottom: 3px;">
              Interactive Blueprint Explorer
            </div>
            <p style="font-size: 0.92rem; color: var(--ink); margin-bottom: 0; line-height: 1.5;">
              Click <strong>"View Full Plan & Math →"</strong> on any idea above to open its deep-dive action blueprint without scrolling fatigue. If an idea does not fit you, click <strong>"Not for me? Swap this idea"</strong> to see an instant alternative.
            </p>
          </div>
          <button type="button" class="btn-secondary share-mom-btn" id="btnShareMomOverview" style="white-space: nowrap; font-size: 0.9rem; font-weight: 800; padding: 10px 18px;">
            Share With a Fellow Mom
          </button>
        </div>

        ${renderRunnerUpSection(calendlyHref)}
      `;
    }

    return `
      <div class="results-header-card">
        <div class="eyebrow-pill" style="background: rgba(255,255,255,0.14); border-color: var(--mint); color: var(--blush);">
          Personalized Report for ${firstName}
        </div>
        <h2 style="font-size: clamp(1.9rem, 4vw, 2.75rem); font-weight: 900; color: #fff; margin-bottom: 12px;">
          Your Top 3 Business Ideas & <em style="color: var(--blush); font-style: italic;">${goalHeadlineText}</em> Action Plan
        </h2>
        <p style="color: rgba(255,255,255,0.88); font-size: 1.02rem; max-width: 720px;">
          Each recommendation below breaks down the <strong>Income Math</strong>, honest <strong>Requirements & Tradeoffs</strong>, a <strong>7-Day Validation Test</strong>, and a <strong>Practical Action Plan</strong> for your <strong>${state.profile.timeline}</strong> timeline.
        </p>

        <div class="results-summary-badges">
          <span class="summary-badge">Target: ${fmtTargetHeaderSummary()}</span>
          <span class="summary-badge">Time: ~${state.profile.hoursPerWeek} hrs/week</span>
          <span class="summary-badge">Action Steps Completed: ${state.completedTasks.length}</span>
        </div>
      </div>

      ${matchSectionHtml}

      <!-- BRIDGE TO BUSINESS GROWTH ASSESSMENT -->
      <div class="growth-bridge-nudge-card" style="margin: 28px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; width: 100%;">
          <div style="flex: 1; min-width: 260px;">
            <div style="font-size: 0.76rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--coral-dark); margin-bottom: 4px;">
              Already Running a Business?
            </div>
            <h4 style="font-size: 1.1rem; margin-bottom: 6px;">
              Grow your current business without working more hours
            </h4>
            <p style="margin-bottom: 0;">
              If you already have paying clients or products and want to increase profit, raise your prices, or save 5+ hours a week on fulfillment, check your numbers with our Business Growth Assessment.
            </p>
          </div>
          <button type="button" class="btn-secondary" data-switch-mode="growth" style="white-space: nowrap;">
            Switch to Business Growth Assessment
          </button>
        </div>
      </div>

      <!-- BLUEPRINT CONFIRMATION & ACTION STEPS -->
      <div class="consulting-showcase" id="blueprintDeliverySection">
        <div class="consulting-grid">
          <div>
            <div class="eyebrow-pill" style="background: var(--mint); border-color: var(--mint); color: var(--dark); font-weight: 800;">
              YOUR ACTION BLUEPRINT IS IN YOUR INBOX
            </div>
            <h2 style="font-size: clamp(1.75rem, 3.4vw, 2.35rem); font-weight: 900; color: #fff; margin-bottom: 12px;">
              Take Your First Small Step This Week
            </h2>
            <p style="color: rgba(255,255,255,0.88); font-size: 1rem; line-height: 1.6;">
              We have sent a copy of your top matches, income math, and validation steps directly to your email. You do not need thousands in startup capital or a complicated setup to start. Follow this simple sequence:
            </p>

            <ul class="consulting-benefits">
              <li>
                <span style="color: var(--mint); font-weight: 900;">1</span>
                <span><strong>Test Before Spending:</strong> Run the 7-day validation test above to talk to 3 to 5 real potential buyers before spending money on branding or websites.</span>
              </li>
              <li>
                <span style="color: var(--mint); font-weight: 900;">2</span>
                <span><strong>Protect Your Family Hours:</strong> Cap your initial weekly build to your ~${state.profile.hoursPerWeek} hrs/week target so motherhood remains your top priority.</span>
              </li>
              <li>
                <span style="color: var(--mint); font-weight: 900;">3</span>
                <span><strong>Watch Your Email for Strategic Guidance:</strong> Over the next few days, Oyin will share tactical guidance on pricing, packaging, and client acquisition.</span>
              </li>
            </ul>
          </div>

          <div class="consulting-cta-box">
            <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blush); margin-bottom: 6px;">
              Confirmation Sent
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #fff; margin-bottom: 10px;">
              Results Delivered
            </h3>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.84); margin-bottom: 20px; line-height: 1.5;">
              Check your inbox for your complete assessment report. If you have questions about your top matches, you can reply directly to that email.
            </p>

            <a
              href="mailto:hello@busymamasnetwork.com?subject=Question%20about%20my%20Business%20Fit%20Assessment%20Results"
              class="btn-pink"
              style="display: flex; justify-content: center; text-decoration: none; width: 100%; margin-bottom: 12px; font-weight: 800;"
            >
              Have a Question? Email Oyin
            </a>
            <button
              type="button"
              class="btn-secondary share-mom-btn"
              style="display: flex; justify-content: center; width: 100%; font-size: 0.92rem; font-weight: 800;"
            >
              Share With a Fellow Mom
            </button>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-top: 28px;">
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <button type="button" class="btn-secondary" id="btnStartFreshQuiz">
            Start Over
          </button>
          <button type="button" class="btn-secondary" id="btnRetakeQuiz">
            Edit My Current Answers
          </button>
        </div>
        <button type="button" class="btn-secondary" onclick="window.print()">
          Print / Save Action Plan as PDF
        </button>
      </div>
    `;
  }

  function renderSingleIdeaCard(idea, playbook, idx) {
    const activeTab = state.activeTabs[idx] || "overview";
    const goalFormatted = playbook.incomeMath.goalFormatted;
    const goalWithUnit = isFlashTimeline() ? `${goalFormatted} in 14 Days` : `${goalFormatted}/mo`;

    let tabBody = "";
    if (activeTab === "overview") {
      tabBody = `
        <div>
          <h4 style="font-size: 1.08rem; font-weight: 800; margin-bottom: 6px;">
            Why This Fits Your Profile & ${goalWithUnit} Target:
          </h4>
          <p style="color: var(--ink-muted); font-size: 0.94rem; margin-bottom: 16px;">
            ${idea.aiWhyFits || idea.matchReasons.join(" • ")}.
          </p>

          <!-- REQUIREMENTS & TRADEOFFS -->
          <div class="req-tradeoff-grid">
            <div class="req-box">
              <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: #334155; margin-bottom: 8px;">
                What It Requires
              </div>
              <ul style="padding-left: 18px; font-size: 0.88rem; color: var(--ink); display: flex; flex-direction: column; gap: 5px;">
                ${(playbook.requirements || []).map((r) => `<li>${r}</li>`).join("")}
              </ul>
            </div>

            <div class="tradeoff-box">
              <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: #92400E; margin-bottom: 8px;">
                Real Tradeoffs to Know Upfront
              </div>
              <ul style="padding-left: 18px; font-size: 0.88rem; color: var(--ink); display: flex; flex-direction: column; gap: 5px;">
                ${(playbook.tradeoffs || []).map((t) => `<li>${t}</li>`).join("")}
              </ul>
            </div>
          </div>

          ${
            playbook.incomeMath.aiCustomNote
              ? `<div class="tier-insight-banner" style="margin-bottom: 14px;"><strong>Custom Strategy Note:</strong> ${playbook.incomeMath.aiCustomNote}</div>`
              : ""
          }

          <h4 style="font-size: 1.02rem; font-weight: 800; margin-bottom: 8px;">
            How the Math Works for ${goalWithUnit}:
          </h4>
          <div class="math-paths-grid">
            <div class="math-box">
              <div class="math-box-title">${playbook.incomeMath.pathA.title}</div>
              <div class="math-formula">${playbook.incomeMath.pathA.formula}</div>
              <div style="font-size: 0.84rem; color: var(--ink-muted);">
                ${playbook.incomeMath.pathA.timeBreakdown}
              </div>
            </div>
            <div class="math-box">
              <div class="math-box-title">${playbook.incomeMath.pathB.title}</div>
              <div class="math-formula">${playbook.incomeMath.pathB.formula}</div>
              <div style="font-size: 0.84rem; color: var(--ink-muted);">
                ${playbook.incomeMath.pathB.timeBreakdown}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === "test") {
      tabBody = `
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">
            ${playbook.testingStrategy.headline}
          </h4>
          <p style="color: var(--ink-muted); font-size: 0.92rem; margin-bottom: 14px;">
            Check off each validation step below as you test demand this week:
          </p>

          <div class="timeline-list">
            ${playbook.testingStrategy.steps
              .map((st) => {
                const isDone = state.completedTasks.includes(st.id);
                return `
              <div class="timeline-step">
                <span class="timeline-badge">${st.day}</span>
                <label class="checkable-task-row ${isDone ? "completed" : ""}">
                  <input type="checkbox" class="action-task-checkbox" data-task-id="${st.id}" ${isDone ? "checked" : ""} />
                  <span>
                    <strong style="display: block; font-size: 0.96rem; margin-bottom: 2px;">${st.title}</strong>
                    <span style="font-size: 0.88rem; color: var(--ink-muted);">${st.detail}</span>
                  </span>
                </label>
              </div>
            `;
              })
              .join("")}
          </div>

          <div class="script-copy-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 0.84rem; text-transform: uppercase; color: var(--coral-dark);">
                Copy-Paste Validation Post / Message
              </strong>
              <button type="button" class="btn-ghost-sm copy-script-btn" data-script="${encodeURIComponent(playbook.testingStrategy.outreachScript)}">
                Copy Text
              </button>
            </div>
            <p style="font-size: 0.9rem; color: var(--ink); font-style: italic;">
              "${playbook.testingStrategy.outreachScript}"
            </p>
            <div style="margin-top: 10px; font-size: 0.82rem; font-weight: 700; color: #065F46;">
              Validation Target: ${playbook.testingStrategy.validationMetric}
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === "roadmap") {
      tabBody = `
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">
            ${playbook.implementationStrategy.headline}
          </h4>
          <p style="color: var(--ink-muted); font-size: 0.9rem; margin-bottom: 12px;">
            Check off your action steps as you progress through each stage:
          </p>
          <div class="timeline-list">
            ${playbook.implementationStrategy.phases
              .map(
                (ph) => `
              <div class="timeline-step">
                <span class="timeline-badge">${ph.phase}</span>
                <div style="font-weight: 800; font-size: 1rem; margin-bottom: 4px;">${ph.title}</div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--coral-dark); margin-bottom: 8px;">
                  Focus: ${ph.focus}
                </div>
                <div>
                  ${ph.tasks
                    .map((t) => {
                      const taskObj = typeof t === "string" ? { id: `${idea.id}-${t.slice(0, 12)}`, text: t } : t;
                      const isDone = state.completedTasks.includes(taskObj.id);
                      return `
                      <label class="checkable-task-row ${isDone ? "completed" : ""}">
                        <input type="checkbox" class="action-task-checkbox" data-task-id="${taskObj.id}" ${isDone ? "checked" : ""} />
                        <span>${taskObj.text}</span>
                      </label>
                    `;
                    })
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="idea-result-card ${idx === 0 ? "rank-1" : ""}" id="idea-card-${idx}">
        <div class="idea-card-top">
          <div class="idea-rank-row">
            <span class="rank-pill">${playbook.badgeText}</span>
            <span class="match-score-pill">${idea.matchScore}% Profile & Goal Match</span>
          </div>
          <h3 class="idea-title">${idea.name}</h3>
          <p class="idea-desc">${idea.description}</p>

          <div class="idea-meta-chips">
            <span class="meta-chip">${idea.category}</span>
            <span class="meta-chip">${idea.minHoursPerWeek} to ${idea.optimalHoursPerWeek} hrs/wk</span>
            <span class="meta-chip">Ease: ${idea.easeOf5k}/5</span>
          </div>

          <div class="idea-spec-box">
            <div class="idea-spec-row">
              <span class="idea-spec-label">Pricing Structure</span>
              <span class="idea-spec-val">${idea.incomeModel}</span>
            </div>
            <div class="idea-spec-row">
              <span class="idea-spec-label">Ideal Buyers</span>
              <span class="idea-spec-val">${idea.targetAudience}</span>
            </div>
          </div>
        </div>

        <div class="idea-card-body">
          <div class="playbook-tabs">
            <button type="button" class="playbook-tab-btn ${activeTab === "overview" ? "active" : ""}" data-card="${idx}" data-tab="overview">
              1. Requirements, Tradeoffs & ${goalWithUnit} Math
            </button>
            <button type="button" class="playbook-tab-btn ${activeTab === "test" ? "active" : ""}" data-card="${idx}" data-tab="test">
              2. 7-Day Validation Test
            </button>
            <button type="button" class="playbook-tab-btn ${activeTab === "roadmap" ? "active" : ""}" data-card="${idx}" data-tab="roadmap">
              3. Practical Action Plan (${state.profile.timeline})
            </button>
          </div>

          ${tabBody}

          ${
            idx === 0
              ? `
            <div class="inline-upsell-banner" style="background: rgba(45, 90, 39, 0.05); border: 1.5px solid var(--border);">
              <div style="flex: 1; min-width: 240px;">
                <div style="font-weight: 900; font-size: 1.02rem; color: var(--ink);">
                  Recommended First Step for "${idea.name}"
                </div>
                <div style="font-size: 0.86rem; color: var(--ink-muted);">
                  Open the 7-Day Validation Test tab above. Getting feedback from your first 3 prospective buyers gives you immediate clarity before you spend a single dollar.
                </div>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  function bindResultsEvents() {
    document.querySelectorAll("[data-switch-mode]").forEach((btn) => {
      btn.onclick = () => switchToolMode(btn.getAttribute("data-switch-mode"));
    });

    document.querySelectorAll("[data-focus-idea]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-focus-idea"));
        state.selectedIdeaIdx = idx;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    document.querySelectorAll("[data-switch-focused-idea]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-switch-focused-idea"));
        state.selectedIdeaIdx = idx;
        render();
      });
    });

    ["btnBackToMatchesOverview", "btnBackToMatchesOverviewBottom"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", () => {
          state.selectedIdeaIdx = null;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    });

    document.querySelectorAll("[data-swap-idea]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slotIdx = Number(btn.getAttribute("data-swap-idea"));
        if (isNaN(slotIdx) || slotIdx < 0 || slotIdx >= state.topMatches.length) return;

        const activeIds = new Set([
          ...state.topMatches.map((m) => m.id),
          ...state.runnerUpMatches.map((m) => m.id)
        ]);
        const candidate = (state.allRankedMatches || []).find((idea) => !activeIds.has(idea.id));

        if (candidate) {
          state.topMatches[slotIdx] = candidate;
          state.playbooks[slotIdx] = window.VaultEngine.buildPlaybook(candidate, state.profile, slotIdx);
          render();
        } else if (state.runnerUpMatches.length > 0) {
          const promoted = state.runnerUpMatches.shift();
          const demoted = state.topMatches[slotIdx];
          state.topMatches[slotIdx] = promoted;
          state.runnerUpMatches.push(demoted);
          state.playbooks[slotIdx] = window.VaultEngine.buildPlaybook(promoted, state.profile, slotIdx);
          state.runnerUpPlaybooks = state.runnerUpMatches.map((idea, idx) =>
            window.VaultEngine.buildPlaybook(idea, state.profile, 3 + idx)
          );
          render();
        }
      });
    });

    const shareHandler = () => {
      const shareData = {
        title: "Business Fit by Busy Mamas",
        text: "Hey mama! I just used this free assessment to find flexible business ideas that fit nap times and family schedules. You should try it:",
        url: window.location.origin || "https://tools.busymamasnetwork.com"
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => null);
      } else {
        const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${shareData.text} ${shareData.url}`
        )}`;
        window.open(shareUrl, "_blank");
      }
    };

    document.querySelectorAll(".share-mom-btn").forEach((btn) => {
      btn.addEventListener("click", shareHandler);
    });

    document.querySelectorAll("[data-jump-card]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-jump-card");
        const el = targetId ? document.getElementById(targetId) : null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.querySelectorAll("[data-toggle-runnerup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rIdx = Number(btn.getAttribute("data-toggle-runnerup"));
        state.expandedRunnerUps = state.expandedRunnerUps || {};
        const nextVal = !state.expandedRunnerUps[rIdx];
        state.expandedRunnerUps[rIdx] = nextVal;
        render();
        if (nextVal) {
          const el = document.getElementById(`runner-up-playbook-${rIdx}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });

    document.querySelectorAll("[data-swap-runnerup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rIdx = Number(btn.getAttribute("data-swap-runnerup"));
        if (!state.runnerUpMatches || !state.runnerUpMatches[rIdx] || state.topMatches.length < 3) return;

        const promoted = state.runnerUpMatches[rIdx];
        const demoted = state.topMatches[2];

        // Swap matchScore between #3 and the promoted runner-up if needed so Top 3 stays strictly descending
        const score3 = demoted.matchScore;
        const scoreRunner = promoted.matchScore;
        if (scoreRunner < score3) {
          promoted.matchScore = score3;
          demoted.matchScore = scoreRunner;
        }

        state.topMatches[2] = promoted;
        state.runnerUpMatches[rIdx] = demoted;

        state.playbooks = state.topMatches.map((idea, idx) =>
          window.VaultEngine.buildPlaybook(idea, state.profile, idx)
        );
        state.runnerUpPlaybooks = state.runnerUpMatches.map((idea, idx) =>
          window.VaultEngine.buildPlaybook(idea, state.profile, 3 + idx)
        );
        state.expandedRunnerUps = {};
        render();

        const compCard = document.querySelector(".comparison-summary-card");
        if (compCard) {
          compCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.querySelectorAll(".playbook-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cardIdx = Number(btn.getAttribute("data-card"));
        const tab = btn.getAttribute("data-tab");
        state.activeTabs[cardIdx] = tab;
        render();
      });
    });

    document.querySelectorAll(".action-task-checkbox").forEach((cb) => {
      cb.addEventListener("change", () => {
        const taskId = cb.getAttribute("data-task-id");
        if (!taskId) return;
        if (cb.checked) {
          if (!state.completedTasks.includes(taskId)) {
            state.completedTasks.push(taskId);
          }
        } else {
          state.completedTasks = state.completedTasks.filter((id) => id !== taskId);
        }
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll(".copy-script-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = decodeURIComponent(btn.getAttribute("data-script") || "");
        navigator.clipboard?.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1800);
      });
    });

    document.querySelectorAll(".open-calendly-btn").forEach((btn) => {
      btn.addEventListener("click", () => openCalendlyModal());
    });

    const retakeBtn = document.getElementById("btnRetakeQuiz");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        state.step = 1;
        state.shownStories = {};
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const startFreshBtn = document.getElementById("btnStartFreshQuiz");
    if (startFreshBtn) {
      startFreshBtn.addEventListener("click", () => {
        resetAssessmentAndStartOver();
      });
    }
  }

  // ============================================================================
  // BUSY MAMAS BUSINESS GROWTH ASSESSMENT - STEPS 1 TO 6, GATE & RESULTS
  // ============================================================================
  // ============================================================================
  // RENDER GROWTH DIAGNOSTIC TYPEFORM-STYLE SUB-STEPS
  // ============================================================================
  function renderGrowthQuizStep() {
    const s = state.growthStep;
    const maxSub = getMaxSubSteps(s, "growth");
    if (!state.growthSubStep || state.growthSubStep < 1 || state.growthSubStep > maxSub) {
      state.growthSubStep = 1;
    }
    const sub = state.growthSubStep;
    const stepOffsets = { 1: 0, 2: 5, 3: 8, 4: 10, 5: 12, 6: 14 };
    const completed = (stepOffsets[s] || 0) + (sub - 1);
    const totalQuestions = 15;
    const pct = Math.round((completed / totalQuestions) * 100);
    const gp = state.growthProfile;
    const cur = getCur();
    let stepContent = "";

    if (s === 1 && sub === 1) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">What Category Best Describes <em>Your Business</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select your main business model from the dropdown below.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box" style="margin-bottom: 24px;">
          <label for="growthBTypeSelect" style="display: block; font-size: 0.95rem; font-weight: 800; color: var(--forest-dark); margin-bottom: 10px;">
            Choose Business Category:
          </label>
          <select id="growthBTypeSelect" class="form-input" style="cursor: pointer; font-size: 1rem; padding: 12px 14px;">
            <option value="">Select your business category...</option>
            ${(window.GROWTH_BUSINESS_TYPES || [])
              .map((item) => `<option value="${item.id}" ${gp.businessType === item.id ? "selected" : ""}>${item.label}</option>`)
              .join("")}
          </select>
        </div>
      `;
    } else if (s === 1 && sub === 2) {
      const subNiches = (window.GROWTH_SUB_NICHES && gp.businessType && window.GROWTH_SUB_NICHES[gp.businessType]) || [];
      const subNicheMatch = subNiches.find((sn) => sn.id === gp.subNicheId);
      const isAutoDuplicated = subNicheMatch && gp.specificNiche === subNicheMatch.label;
      const customNicheVal = isAutoDuplicated ? "" : (gp.specificNiche || "");

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">Your Specific Specialty & <em>Ideal Client</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select your closest specialty below, or describe what you do in your own words so your assessment is tailored to your business.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box" style="margin-bottom: 24px;">
          ${
            subNiches.length > 0
              ? `
              <div style="margin-bottom: 20px;">
                <label for="growthSubNicheSelect" style="display: block; font-size: 0.92rem; font-weight: 800; color: var(--forest-dark); margin-bottom: 8px;">
                  Choose specialty or main service:
                </label>
                <select id="growthSubNicheSelect" class="form-input" style="cursor: pointer; font-size: 0.96rem; padding: 12px 14px;">
                  <option value="">Choose your specialty...</option>
                  ${subNiches
                    .map((sn) => `<option value="${sn.id}" ${gp.subNicheId === sn.id ? "selected" : ""}>${sn.label}</option>`)
                    .join("")}
                </select>
              </div>
            `
              : ""
          }

          <div style="margin-bottom: 20px;">
            <label for="growthSpecificNicheInput" style="display: block; font-size: 0.92rem; font-weight: 800; color: var(--forest-dark); margin-bottom: 8px;">
              What specifically do you sell or offer? (Optional):
            </label>
            <input
              type="text"
              id="growthSpecificNicheInput"
              class="form-input"
              placeholder="e.g., Communication and intimacy coaching for married couples"
              value="${customNicheVal.replace(/"/g, "&quot;")}"
            />
          </div>

          <div>
            <label for="growthTargetAudienceInput" style="display: block; font-size: 0.92rem; font-weight: 800; color: var(--forest-dark); margin-bottom: 8px;">
              Who is your primary ideal customer or client? (Optional):
            </label>
            <input
              type="text"
              id="growthTargetAudienceInput"
              class="form-input"
              placeholder="e.g., Exhausted working moms of babies 0-2, wedding couples, corporate HR leaders"
              value="${(gp.targetAudience || "").replace(/"/g, "&quot;")}"
            />
          </div>
        </div>
      `;
    } else if (s === 1 && sub === 3) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">What Are Your <em>Current Monthly Sales</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Pick the closest range. If you are just starting or pre-revenue, choose Pre-revenue.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_REVENUE_STAGES || [])
            .map((stg) => {
              const scaledVal = window.VaultEngine
                ? window.VaultEngine.scaleUsdToCurrency(stg.valUsd !== undefined ? stg.valUsd : (stg.val || 0), cur.code)
                : (stg.valUsd !== undefined ? stg.valUsd : (stg.val || 0));
              return `
            <div class="option-card ${gp.revenueStageId === stg.id ? "selected" : ""}" data-growth-revstage="${stg.id}" data-growth-revval="${scaledVal}">
              <div class="option-content">
                <div class="option-title">${formatStoryWithUserCurrency(stg.label)}</div>
                <div class="option-sub">${formatStoryWithUserCurrency(stg.sub)}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `;
            })
            .join("")}
        </div>
      `;
    } else if (s === 1 && sub === 4) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">Roughly What Is Your <em>Take-Home Profit Margin</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              After paying business expenses, tools, and materials, what percentage stays as profit?
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_PROFIT_MARGINS || [])
            .map(
              (m) => `
            <div class="option-card ${gp.profitMarginId === m.id ? "selected" : ""}" data-growth-margin="${m.id}">
              <div class="option-content">
                <div class="option-title">${m.label}</div>
                <div class="option-sub">${m.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 1 && sub === 5) {
      const targetRev = Number(gp.targetRevenue) || cur.defaultGoal;
      const currentRev = Number(gp.currentRevenue) || 0;
      const gap = Math.max(window.VaultEngine.scaleUsdToCurrency(500, cur.code), targetRev - currentRev);

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">What Is Your <em>Target Monthly Revenue</em> in 90 Days?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Pick your currency and set your 90-day goal. We will calculate the math to reach it.
            </p>
          </div>
        </div>

        <div class="income-showcase-box">
          <div class="currency-selector-row">
            <span class="currency-label-text">Currency:</span>
            ${(window.SUPPORTED_CURRENCIES || [])
              .map(
                (c) => `
              <button type="button" class="currency-pill ${c.code === cur.code ? "active" : ""}" data-currency="${c.code}">
                ${c.label}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="income-amount-row">
            <span class="income-big-number" id="growthTargetDisplay">${fmtMoney(targetRev)}</span>
            <span class="income-per-mo">/ month</span>
          </div>
          <div class="income-annual-sub" id="growthGapDisplay">
            +${fmtMoney(gap)}/mo more than your current monthly sales (<strong>${fmtMoney(targetRev * 12)}/year</strong> pace)
          </div>

          <input
            type="range"
            id="growthTargetSlider"
            class="income-slider"
            min="${cur.min}"
            max="${cur.max}"
            step="${cur.step}"
            value="${Math.min(cur.max, Math.max(cur.min, targetRev))}"
          />

          <div class="income-presets">
            ${(cur.presets || [])
              .map(
                (amt) => `
              <button type="button" class="preset-btn ${targetRev === amt ? "active" : ""}" data-growth-preset="${amt}">
                ${fmtMoney(amt)}/mo
              </button>
            `
              )
              .join("")}
          </div>

          <div class="custom-dollar-input-wrap">
            <span class="custom-dollar-label">Or type exact monthly target:</span>
            <div class="custom-dollar-input-group">
              <span class="custom-dollar-currency">${cur.symbol}</span>
              <input
                type="number"
                id="growthCustomTargetInput"
                class="custom-dollar-input"
                min="100"
                max="100000000"
                step="${cur.step}"
                value="${targetRev}"
              />
              <span class="custom-dollar-suffix">/mo</span>
            </div>
          </div>
        </div>
      `;
    } else if (s === 2 && sub === 1) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">How Is Your <em>Primary Offer Structured</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Choose the main way clients or customers pay you.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_OFFER_STRUCTURES || [])
            .map(
              (o) => `
            <div class="option-card ${gp.offerStructure === o.id ? "selected" : ""}" data-growth-offer="${o.id}">
              <div class="option-content">
                <div class="option-title">${o.label}</div>
                <div class="option-sub">${o.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 2 && sub === 2) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">What Is Your <em>Typical Price Point</em> Per Sale or Client?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select the closest average transaction size for your core offer.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_AVG_PRICE_TIERS || [])
            .map(
              (t) => `
            <div class="option-card ${gp.avgPriceTierId === t.id ? "selected" : ""}" data-growth-pricetier="${t.id}">
              <div class="option-content">
                <div class="option-title">${formatStoryWithUserCurrency(t.label)}</div>
                <div class="option-sub">${formatStoryWithUserCurrency(t.sub)}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 2 && sub === 3) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">How Confident Do You Feel About <em>Your Current Pricing</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Be completely honest about whether your pricing reflects your real value.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_PRICE_CONFIDENCE || [])
            .map(
              (c) => `
            <div class="option-card ${gp.priceConfidence === c.id ? "selected" : ""}" data-growth-confidence="${c.id}">
              <div class="option-content">
                <div class="option-title">${c.label}</div>
                <div class="option-sub">${c.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 3 && sub === 1) {
      const selectedSources = Array.isArray(gp.leadSources) ? gp.leadSources : (gp.leadSource ? [gp.leadSource] : []);
      const allSources = window.GROWTH_LEAD_SOURCES || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">03</span>
          <div>
            <h2 class="step-title">Where Do Your Leads & Clients <em>Currently Come From</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select all client acquisition channels you currently use (tap to select all that apply).
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${allSources
            .map((src) => {
              const isSel = selectedSources.includes(src.id);
              return `
              <div class="option-card ${isSel ? "selected" : ""}" data-growth-leadsource="${src.id}">
                <div class="option-content">
                  <div class="option-title">${src.label}</div>
                  <div class="option-sub">${src.sub}</div>
                </div>
                <div class="option-check">✓</div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
    } else if (s === 3 && sub === 2) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">03</span>
          <div>
            <h2 class="step-title">Where Do Potential Clients <em>Drop Off Most Often</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Select your primary sales or conversion bottleneck below.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_CONVERSION_ISSUES || [])
            .map(
              (iss) => `
            <div class="option-card ${gp.conversionIssue === iss.id ? "selected" : ""}" data-growth-conversion="${iss.id}">
              <div class="option-content">
                <div class="option-title">${iss.label}</div>
                <div class="option-sub">${iss.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 4 && sub === 1) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">04</span>
          <div>
            <h2 class="step-title">How Often Do Past Clients <em>Buy Again or Refer Others</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Repeat revenue and word-of-mouth are the highest-margin growth levers for busy moms.
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_REPEAT_RATES || [])
            .map(
              (r) => `
            <div class="option-card ${gp.repeatRateId === r.id ? "selected" : ""}" data-growth-repeat="${r.id}">
              <div class="option-content">
                <div class="option-title">${r.label}</div>
                <div class="option-sub">${r.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 4 && sub === 2) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">04</span>
          <div>
            <h2 class="step-title">What Client Retention or <em>Follow-Up System Do You Have</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              How do you stay in touch with past buyers or follow up with leads who did not buy right away?
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_RETENTION_SYSTEMS || [])
            .map(
              (ret) => `
            <div class="option-card ${gp.retentionSystem === ret.id ? "selected" : ""}" data-growth-retention="${ret.id}">
              <div class="option-content">
                <div class="option-title">${ret.label}</div>
                <div class="option-sub">${ret.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 5 && sub === 1) {
      const curHours = Number(gp.currentHours) || 15;
      const maxHours = Number(gp.maxDesiredHours) || 15;

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">05</span>
          <div>
            <h2 class="step-title">Weekly Hours Worked vs <em>Target Hours</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Let us diagnose your capacity and time freedom.
            </p>
          </div>
        </div>

        <div class="multi-select-dropdown-box" style="margin-bottom: 24px;">
          <h3 class="sub-section-heading" style="margin-bottom: 10px;">Part A: Roughly how many hours per week do you work right now?</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
            ${[
              { val: 8, label: "Under 10 hrs" },
              { val: 15, label: "10 to 20 hrs" },
              { val: 25, label: "20 to 30 hrs" },
              { val: 35, label: "30 to 40+ hrs" }
            ]
              .map(
                (btn) => `
              <button type="button" class="quick-chip-btn ${curHours === btn.val ? "active" : ""}" data-growth-curhours="${btn.val}" style="padding: 10px 18px; font-size: 0.9rem;">
                ${btn.label}
              </button>
            `
              )
              .join("")}
          </div>

          <h3 class="sub-section-heading" style="margin-bottom: 10px;">Part B: What is your ideal maximum weekly hours ceiling?</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${[
              { val: 8, label: "5 to 10 hrs" },
              { val: 12, label: "10 to 15 hrs" },
              { val: 18, label: "15 to 20 hrs" },
              { val: 25, label: "20 to 30 hrs" }
            ]
              .map(
                (btn) => `
              <button type="button" class="quick-chip-btn ${maxHours === btn.val ? "active" : ""}" data-growth-maxhours="${btn.val}" style="padding: 10px 18px; font-size: 0.9rem;">
                ${btn.label}
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    } else if (s === 5 && sub === 2) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">05</span>
          <div>
            <h2 class="step-title">What Part of Running Your Business <em>Drains the Most Energy</em>?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              If you could instantly take ONE of these off your plate this week, which would give you the greatest relief?
            </p>
          </div>
        </div>

        <div class="options-grid">
          ${(window.GROWTH_DELIVERY_DRAINS || [])
            .map(
              (d) => `
            <div class="option-card ${gp.deliveryDrain === d.id ? "selected" : ""}" data-growth-drain="${d.id}">
              <div class="option-content">
                <div class="option-title">${d.label}</div>
                <div class="option-sub">${d.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (s === 6) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">06</span>
          <div>
            <h2 class="step-title">Primary 30-Day Growth Priority & <em>Budget</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Choose your single highest-leverage focus for the next 30 days and what budget you can allocate.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading">Part A: What is your primary 90-day goal?</h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_PRIMARY_GOALS || [])
            .map(
              (g) => `
            <div class="option-card ${gp.primaryGoal === g.id ? "selected" : ""}" data-growth-goal="${g.id}">
              <div class="option-content">
                <div class="option-title">${g.label}</div>
                <div class="option-sub">${g.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3 class="sub-section-heading">Part B: Available 30-day growth budget (tools, advertising or support):</h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${[
            { val: 0, label: "$0 Lean (Organic & Sweat Equity)", sub: "Optimize current assets, follow-ups, and organic outreach" },
            { val: 200, label: "$100 to $300/mo (Starter Tools)", sub: "Email software, scheduling tools, or simple automation" },
            { val: 1000, label: "$500 to $1,500/mo (Coaching or Ads)", sub: "Targeted advertising, expert strategy, or specialized templates" },
            { val: 3000, label: "$2,000+/mo (Full Scale)", sub: "Virtual assistants, paid campaigns, and done-for-you support" }
          ]
            .map(
              (b) => `
            <div class="option-card ${gp.growthBudget !== null && gp.growthBudget !== undefined && Number(gp.growthBudget) === b.val ? "selected" : ""}" data-growth-budget="${b.val}">
              <div class="option-content">
                <div class="option-title">${formatStoryWithUserCurrency(b.label)}</div>
                <div class="option-sub">${b.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3 class="sub-section-heading">Part C: Any specific hurdle or note you want addressed? (Optional):</h3>
        <div style="margin-bottom: 8px;">
          <input
            type="text"
            id="growthCustomNoteInput"
            class="form-input"
            placeholder="e.g., Struggling to find time for social media, high no-show rate on sales calls..."
            value="${(gp.customNote || "").replace(/"/g, "&quot;")}"
          />
        </div>
      `;
    }

    const isLastGrowthQuestion = s === 6;

    return `
      <div class="quiz-shell">
        <div class="progress-header">
          <div class="progress-meta">
            <span>GROWTH SECTION ${s} OF ${state.totalQuizSteps} (PART ${sub} OF ${maxSub})</span>
            <span>${pct}% Complete</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="quiz-body typeform-card">
          <div class="typeform-nav-bar" style="${s === 1 && sub === 1 ? 'justify-content: flex-end;' : ''}">
            ${
              s > 1 || sub > 1
                ? `<button type="button" class="btn-typeform-back" id="btnGrowthPrev">
                    ← Back
                  </button>`
                : ""
            }
            <span class="typeform-step-badge">Question ${s}.${sub} of ${maxSub}</span>
          </div>

          ${stepContent}

          ${
            state.validationError
              ? `<div class="step-validation-banner" id="stepValidationBanner" role="alert">
                  <strong>Quick Check Before Continuing:</strong> ${state.validationError}
                </div>`
              : ``
          }

          <div class="quiz-footer">
            <div style="display: flex; align-items: center; gap: 10px;">
              <button type="button" class="btn-ghost-sm" id="btnResetGrowthInline" style="font-size: 0.82rem; color: var(--ink-muted);">
                Start Over
              </button>
            </div>
            <button type="button" class="btn-primary" id="btnGrowthNext">
              ${isLastGrowthQuestion ? "See My 30-Day Growth Diagnostic & Priorities" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindGrowthQuizEvents() {
    const s = state.growthStep;
    const sub = state.growthSubStep || 1;
    const gp = state.growthProfile;

    // Currency Switcher
    document.querySelectorAll("[data-currency]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newCode = btn.getAttribute("data-currency");
        if (newCode && newCode !== state.growthProfile.currency) {
          state.growthProfile.currency = newCode;
          if (gp.revenueStageId && window.GROWTH_REVENUE_STAGES && window.VaultEngine) {
            const stg = window.GROWTH_REVENUE_STAGES.find((s) => s.id === gp.revenueStageId);
            if (stg && stg.valUsd !== undefined) {
              gp.currentRevenue = window.VaultEngine.scaleUsdToCurrency(stg.valUsd, newCode);
            }
          }
          saveUserProgress();
          render();
        }
      });
    });

    // Step 1 Sub 1: Business Category (Dropdown & Cards)
    // Step 1 Sub 1: Business Category (Dropdown Only)
    if (s === 1 && sub === 1) {
      const bTypeSelect = document.getElementById("growthBTypeSelect");
      if (bTypeSelect) {
        bTypeSelect.addEventListener("change", (e) => {
          const val = e.target.value;
          if (!val) return;
          gp.businessType = val;
          gp.subNicheId = "";
          state.validationError = "";
          triggerAutoAdvance();
        });
      }
    }

    // Step 1 Sub 2: Specialty & Ideal Client
    if (s === 1 && sub === 2) {
      const subNicheSelect = document.getElementById("growthSubNicheSelect");
      if (subNicheSelect) {
        subNicheSelect.addEventListener("change", (e) => {
          const val = e.target.value;
          gp.subNicheId = val;
          state.validationError = "";
          saveUserProgress();
        });
      }

      const specificNicheInp = document.getElementById("growthSpecificNicheInput");
      if (specificNicheInp) {
        specificNicheInp.addEventListener("input", (e) => {
          gp.specificNiche = e.target.value;
          state.validationError = "";
          saveUserProgress();
        });
      }

      const targetAudienceInp = document.getElementById("growthTargetAudienceInput");
      if (targetAudienceInp) {
        targetAudienceInp.addEventListener("input", (e) => {
          gp.targetAudience = e.target.value;
          saveUserProgress();
        });
      }
    }

    // Step 1 Sub 3: Current Monthly Sales
    if (s === 1 && sub === 3) {
      document.querySelectorAll("[data-growth-revstage]").forEach((el) => {
        el.addEventListener("click", () => {
          const stageId = el.getAttribute("data-growth-revstage");
          gp.revenueStageId = stageId;
          const stages = window.GROWTH_REVENUE_STAGES || [];
          const stageObj = stages.find((st) => st.id === stageId);
          const cur = getCur();
          if (stageObj && stageObj.valUsd !== undefined && window.VaultEngine) {
            gp.currentRevenue = window.VaultEngine.scaleUsdToCurrency(stageObj.valUsd, cur.code);
          } else {
            gp.currentRevenue = Number(el.getAttribute("data-growth-revval")) || 0;
          }
          if (gp.targetRevenue <= gp.currentRevenue) {
            gp.targetRevenue = gp.currentRevenue + cur.step * 4;
          }
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 1 Sub 4: Profit Margin
    if (s === 1 && sub === 4) {
      document.querySelectorAll("[data-growth-margin]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.profitMarginId = el.getAttribute("data-growth-margin");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 1 Sub 5: 90-Day Revenue Target
    if (s === 1 && sub === 5) {
      function updateGrowthTargetDisplayLive(val) {
        gp.targetRevenue = val;
        const disp = document.getElementById("growthTargetDisplay");
        const gapDisp = document.getElementById("growthGapDisplay");
        const customInp = document.getElementById("growthCustomTargetInput");
        const cur = getCur();
        const gap = Math.max(window.VaultEngine.scaleUsdToCurrency(500, cur.code), val - (Number(gp.currentRevenue) || 0));
        if (disp) disp.textContent = fmtMoney(val);
        if (gapDisp) {
          gapDisp.innerHTML = `+${fmtMoney(gap)}/mo more than your current monthly sales (<strong>${fmtMoney(val * 12)}/year</strong> pace)`;
        }
        if (customInp && document.activeElement !== customInp) {
          customInp.value = val;
        }
        document.querySelectorAll("[data-growth-preset]").forEach((b) => {
          b.classList.toggle("active", Number(b.getAttribute("data-growth-preset")) === val);
        });
        saveUserProgress();
      }

      const slider = document.getElementById("growthTargetSlider");
      if (slider) {
        slider.addEventListener("input", (e) => {
          updateGrowthTargetDisplayLive(Number(e.target.value));
        });
      }

      const customTargetInput = document.getElementById("growthCustomTargetInput");
      if (customTargetInput) {
        customTargetInput.addEventListener("input", (e) => {
          const val = Math.max(100, Number(e.target.value) || 0);
          if (slider) {
            const cur = getCur();
            slider.value = Math.min(cur.max, Math.max(cur.min, val));
          }
          updateGrowthTargetDisplayLive(val);
        });
      }

      document.querySelectorAll("[data-growth-preset]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = Number(btn.getAttribute("data-growth-preset"));
          if (slider) slider.value = val;
          updateGrowthTargetDisplayLive(val);
        });
      });
    }

    // Step 2 Sub 1: Offer Structure
    if (s === 2 && sub === 1) {
      document.querySelectorAll("[data-growth-offer]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.offerStructure = el.getAttribute("data-growth-offer");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 2 Sub 2: Typical Price Point
    if (s === 2 && sub === 2) {
      document.querySelectorAll("[data-growth-pricetier]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.avgPriceTierId = el.getAttribute("data-growth-pricetier");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 2 Sub 3: Pricing Confidence
    if (s === 2 && sub === 3) {
      document.querySelectorAll("[data-growth-confidence]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.priceConfidence = el.getAttribute("data-growth-confidence");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 3 Sub 1: Lead Sources (Cards Toggle)
    if (s === 3 && sub === 1) {
      document.querySelectorAll("[data-growth-leadsource]").forEach((el) => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-growth-leadsource");
          if (!Array.isArray(gp.leadSources)) {
            gp.leadSources = gp.leadSource ? [gp.leadSource] : [];
          }
          if (id === "no-lead-system") {
            gp.leadSources = gp.leadSources.includes("no-lead-system") ? [] : ["no-lead-system"];
          } else {
            gp.leadSources = gp.leadSources.filter((x) => x !== "no-lead-system");
            if (gp.leadSources.includes(id)) {
              gp.leadSources = gp.leadSources.filter((x) => x !== id);
            } else {
              gp.leadSources.push(id);
            }
          }
          gp.leadSource = gp.leadSources[0] || "";
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });
    }

    // Step 3 Sub 2: Conversion Bottleneck (Cards Auto-Advance)
    if (s === 3 && sub === 2) {
      document.querySelectorAll("[data-growth-conversion]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.conversionIssue = el.getAttribute("data-growth-conversion");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 4 Sub 1: Repeat Rate
    if (s === 4 && sub === 1) {
      document.querySelectorAll("[data-growth-repeat]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.repeatRateId = el.getAttribute("data-growth-repeat");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 4 Sub 2: Retention System
    if (s === 4 && sub === 2) {
      document.querySelectorAll("[data-growth-retention]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.retentionSystem = el.getAttribute("data-growth-retention");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 5 Sub 1: Hours
    if (s === 5 && sub === 1) {
      document.querySelectorAll("[data-growth-curhours]").forEach((btn) => {
        btn.addEventListener("click", () => {
          gp.currentHours = Number(btn.getAttribute("data-growth-curhours"));
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      document.querySelectorAll("[data-growth-maxhours]").forEach((btn) => {
        btn.addEventListener("click", () => {
          gp.maxDesiredHours = Number(btn.getAttribute("data-growth-maxhours"));
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });
    }

    // Step 5 Sub 2: Delivery Drain
    if (s === 5 && sub === 2) {
      document.querySelectorAll("[data-growth-drain]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.deliveryDrain = el.getAttribute("data-growth-drain");
          state.validationError = "";
          triggerAutoAdvance();
        });
      });
    }

    // Step 6 Sub 1: Growth Goal & Budget
    if (s === 6) {
      document.querySelectorAll("[data-growth-goal]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.primaryGoal = el.getAttribute("data-growth-goal");
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      document.querySelectorAll("[data-growth-budget]").forEach((el) => {
        el.addEventListener("click", () => {
          gp.growthBudget = Number(el.getAttribute("data-growth-budget"));
          state.validationError = "";
          saveUserProgress();
          render();
        });
      });

      const noteInput = document.getElementById("growthCustomNoteInput");
      if (noteInput) {
        noteInput.addEventListener("input", (e) => {
          gp.customNote = e.target.value;
          saveUserProgress();
        });
      }
    }

    // Global Growth Navigation
    const prevBtn = document.getElementById("btnGrowthPrev");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        retreatSubStep();
      });
    }

    const nextBtn = document.getElementById("btnGrowthNext");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        advanceSubStep();
      });
    }

    const resetInline = document.getElementById("btnResetGrowthInline");
    if (resetInline) {
      resetInline.addEventListener("click", () => resetAssessmentAndStartOver());
    }
  }

  function renderGrowthEmailGate() {
    if (window.GrowthEngine) {
      state.growthAnalysis = window.GrowthEngine.analyzeBusiness(state.growthProfile);
    }
    const analysis = state.growthAnalysis || {};
    const priorities = analysis.priorities || [];
    const gp = state.growthProfile;

    return `
      <div class="gate-card">
        <div class="eyebrow-pill">Assessment Complete · Your 30-Day Growth Plan Is Ready</div>
        <h2 class="step-title" style="font-size: 2rem;">
          Your Personalized Growth Plan for <em>${fmtMoney(gp.targetRevenue)}/Month</em>
        </h2>
        <p class="step-desc" style="max-width: 580px; margin: 8px auto 18px;">
          Built for your <strong>${gp.maxDesiredHours} hrs/week</strong> schedule, including what is holding back your sales right now, clear profit math, 3 simple priorities, and a step-by-step 30-day plan.
        </p>

        <div class="gate-teaser-grid">
          ${priorities
            .map(
              (p, idx) => `
            <div class="teaser-pill-card">
              <div class="teaser-rank">Priority #${idx + 1} • ${p.impactScore}</div>
              <div class="teaser-blurred-title">
                <span class="blur-mask">${(p.shortLabel || "Growth Priority").slice(0, 18)}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--ink-muted);">
                Focus: <strong>${p.category}</strong><br/>
                Timing: <strong>${p.timeToImplement}</strong>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div style="background: var(--bg-cream); border-radius: var(--radius-md); padding: 22px; margin-bottom: 16px;">
          <h3 style="font-size: 1.12rem; font-weight: 800; margin-bottom: 6px;">
            Enter your name and email to view your growth report & 30-day action plan
          </h3>
          <p style="font-size: 0.88rem; color: var(--ink-muted); margin-bottom: 16px;">
            Unlock your full report right now and save your progress.
          </p>

          <form id="growthEmailGateForm" class="gate-form">
            <input
              type="text"
              id="growthGateFirstName"
              class="form-input"
              placeholder="Your First Name"
              value="${gp.firstName || state.profile.firstName || ""}"
              required
            />
            <input
              type="email"
              id="growthGateEmail"
              class="form-input"
              placeholder="Your Email Address"
              value="${gp.email || state.profile.email || ""}"
              required
            />

            <div class="checkin-optin-box">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700;">
                <input
                  type="checkbox"
                  id="growthGateCheckInToggle"
                  style="width: 16px; height: 16px; accent-color: #10B981;"
                  ${gp.checkInCadence !== "report-only" ? "checked" : ""}
                />
                <span>Send me helpful check-in emails to keep me on track with my 30-day plan.</span>
              </label>
            </div>

            <button type="submit" class="btn-primary" id="btnUnlockGrowthResults" style="width: 100%; font-size: 1.04rem;">
              View My Growth Report & 30-Day Plan
            </button>
          </form>
          <div class="gate-privacy">
            By submitting, you agree to receive your growth report and occasional business updates by email.
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn-ghost-sm" id="btnBackToGrowthQuiz">
            Edit My Assessment Answers
          </button>
          <button type="button" class="btn-ghost-sm" id="btnStartOverGrowthGate">
            Start Over
          </button>
        </div>
      </div>
    `;
  }

  function bindGrowthGateEvents() {
    const backBtn = document.getElementById("btnBackToGrowthQuiz");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        state.growthStep = 6;
        saveUserProgress();
        render();
      });
    }

    const startOverBtn = document.getElementById("btnStartOverGrowthGate");
    if (startOverBtn) {
      startOverBtn.addEventListener("click", () => resetAssessmentAndStartOver());
    }

    const form = document.getElementById("growthEmailGateForm");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const firstName = (document.getElementById("growthGateFirstName").value || "").trim();
        const email = (document.getElementById("growthGateEmail").value || "").trim();
        const checkInChecked = document.getElementById("growthGateCheckInToggle")?.checked ?? true;
        if (!email || !email.includes("@")) return;

        const gp = state.growthProfile;
        gp.firstName = firstName || "Friend";
        gp.email = email;
        gp.checkInCadence = checkInChecked ? "weekly-checkins" : "report-only";

        state.growthAnalysis = window.GrowthEngine.analyzeBusiness(gp);
        saveUserProgress();

        const btn = document.getElementById("btnUnlockGrowthResults");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Building Your Growth Report & 30-Day Plan...";
        }

        const analysis = state.growthAnalysis;
        const subNicheFound = (window.GROWTH_SUB_NICHES && gp.businessType && window.GROWTH_SUB_NICHES[gp.businessType] || []).find((sn) => sn.id === gp.subNicheId);
        const nicheDesc = gp.specificNiche || (subNicheFound ? subNicheFound.label : gp.businessType) || "Business";
        const audienceDesc = gp.targetAudience ? ` | Client: ${gp.targetAudience}` : "";
        const growthSkillsSummary = `Growth: ${nicheDesc} (${gp.currentRevenue || 0}/mo)${audienceDesc}`;

        const leadRecord = {
          timestamp: new Date().toISOString(),
          firstName: gp.firstName,
          email: gp.email,
          currency: gp.currency,
          incomeGoal: gp.targetRevenue,
          timeline: "30-Day Growth Plan",
          hoursPerWeek: gp.maxDesiredHours,
          budget: gp.growthBudget,
          skills: growthSkillsSummary,
          workStyle: gp.offerStructure,
          checkInCadence: gp.checkInCadence,
          topIdea1: `[Bottleneck] ${analysis.primaryBottleneck?.title || ""}`,
          topIdea2: analysis.priorities?.[0]?.shortLabel || "",
          topIdea3: analysis.priorities?.[1]?.shortLabel || "",
          completedTasksCount: state.completedTasks.length
        };
        saveLeadToBrowserStorage(leadRecord);

        const growthFormId = state.config.kitGrowthFormId || state.config.kitFormId || "10105554";
        const kitKey = state.config.kitApiKey || "KNfaWYKoCU8IZgyhEK_Lag";

        const customFields = {
          assessment_type: "Business Growth",
          currency: gp.currency || "USD",
          income_goal: `${gp.currency || "USD"} ${gp.targetRevenue || 10000}/mo`,
          timeline: "30-Day Growth Plan",
          hours_per_week: String(gp.maxDesiredHours || ""),
          startup_budget: String(gp.growthBudget || 0),
          skills: growthSkillsSummary,
          check_in_emails: gp.checkInCadence || "weekly",
          top_idea_1: leadRecord.topIdea1,
          top_idea_2: leadRecord.topIdea2,
          top_idea_3: leadRecord.topIdea3
        };

        // Guarantee #1: Direct client-side submission to Kit (ConvertKit) public form endpoint
        const directKitPromise = fetch(`https://api.convertkit.com/v3/forms/${growthFormId}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: kitKey,
            email: gp.email,
            first_name: gp.firstName,
            fields: customFields
          })
        }).catch(() => null);

        // Guarantee #2: Server-side API submission for backend persistence & secret authentication
        const backendPromise = fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: gp.firstName,
            email: gp.email,
            assessmentType: "Business Growth",
            profile: {
              ...gp,
              incomeGoal: gp.targetRevenue,
              timeline: "30-Day Growth Plan",
              hoursPerWeek: gp.maxDesiredHours
            },
            topIdeas: (analysis.priorities || []).map((p) => ({
              name: p.title,
              category: p.category,
              matchScore: 98
            })),
            completedTasks: state.completedTasks,
            config: {
              kitApiKey: kitKey,
              kitFormId: growthFormId,
              kitTagId: state.config.kitTagId
            }
          })
        }).catch(() => null);

        await Promise.allSettled([directKitPromise, backendPromise]);

        state.growthStep = 8;
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function renderGrowthPriorityCard(priority, idx) {
    const activeTab = state.growthActiveTabs[idx] || "math";
    let tabContent = "";

    if (activeTab === "math") {
      tabContent = `
        <div>
          <div class="req-tradeoff-grid">
            <div class="req-box">
              <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: #334155; margin-bottom: 8px;">
                Action Steps to Put This in Place
              </div>
              <ul style="padding-left: 18px; font-size: 0.88rem; color: var(--ink); display: flex; flex-direction: column; gap: 5px;">
                ${priority.requirements.map((r) => `<li>${r}</li>`).join("")}
              </ul>
            </div>

            <div class="tradeoff-box">
              <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: #92400E; margin-bottom: 8px;">
                What Gets Easier & What to Keep in Mind
              </div>
              <ul style="padding-left: 18px; font-size: 0.88rem; color: var(--ink); display: flex; flex-direction: column; gap: 5px;">
                ${priority.tradeoffs.map((t) => `<li>${t}</li>`).join("")}
              </ul>
            </div>
          </div>

          <h4 style="font-size: 1.02rem; font-weight: 800; margin-bottom: 8px;">
            How the Numbers Work (2 Simple Options):
          </h4>
          <div class="math-paths-grid">
            <div class="math-box">
              <div class="math-box-title">${priority.mathOptionA.title}</div>
              <div class="math-formula">${priority.mathOptionA.formula}</div>
              <div style="font-size: 0.84rem; color: var(--ink-muted);">
                ${priority.mathOptionA.sub}
              </div>
            </div>
            <div class="math-box">
              <div class="math-box-title">${priority.mathOptionB.title}</div>
              <div class="math-formula">${priority.mathOptionB.formula}</div>
              <div style="font-size: 0.84rem; color: var(--ink-muted);">
                ${priority.mathOptionB.sub}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      tabContent = `
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 6px;">
            ${priority.scriptTitle}
          </h4>
          <p style="font-size: 0.9rem; color: var(--ink-muted); margin-bottom: 12px;">
            Fill in the bracketed words and send this message to past customers, inquiries, or local business partners this week:
          </p>
          <div class="script-copy-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 0.84rem; text-transform: uppercase; color: var(--coral-dark);">
                Ready-to-Send Message
              </strong>
              <button type="button" class="btn-ghost-sm copy-script-btn" data-script="${encodeURIComponent(priority.scriptText)}">
                Copy Text
              </button>
            </div>
            <p style="font-size: 0.9rem; color: var(--ink); font-style: italic;">
              "${priority.scriptText}"
            </p>
          </div>
        </div>
      `;
    }

    return `
      <div class="idea-result-card ${idx === 0 ? "rank-1" : ""}" id="growth-priority-card-${idx}">
        <div class="idea-card-top">
          <div class="idea-rank-row">
            <span class="rank-pill">${priority.badge}</span>
            <span class="match-score-pill">${priority.impactScore} • ${priority.timeToImplement}</span>
          </div>
          <h3 class="idea-title">${priority.title}</h3>
          <p class="idea-desc">${priority.whyItMatters}</p>

          <div class="idea-meta-chips">
            <span class="meta-chip">${priority.category}</span>
            <span class="meta-chip">${priority.estHoursSaved}</span>
            <span class="meta-chip">${priority.revenueImpact}</span>
          </div>
        </div>

        <div class="idea-card-body">
          <div class="playbook-tabs">
            <button type="button" class="playbook-tab-btn ${activeTab === "math" ? "active" : ""}" data-growth-card="${idx}" data-growth-tab="math">
              1. How the Math Works & Action Steps
            </button>
            <button type="button" class="playbook-tab-btn ${activeTab === "script" ? "active" : ""}" data-growth-card="${idx}" data-growth-tab="script">
              2. Ready-to-Send Message Script
            </button>
          </div>

          ${tabContent}

          ${
            idx === 0
              ? `
            <div class="inline-upsell-banner" style="background: rgba(45, 90, 39, 0.05); border: 1.5px solid var(--border);">
              <div style="flex: 1; min-width: 240px;">
                <div style="font-weight: 900; font-size: 1.02rem; color: var(--ink);">
                  Priority Focus for This Week
                </div>
                <div style="font-size: 0.86rem; color: var(--ink-muted);">
                  Start with the Week 1 Sprint checklist above to fix your primary capacity and pricing bottleneck before taking on more clients.
                </div>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  function renderGrowthResultsDashboard() {
    if (window.GrowthEngine) {
      state.growthAnalysis = window.GrowthEngine.analyzeBusiness(state.growthProfile);
    }
    const analysis = state.growthAnalysis;
    const gp = state.growthProfile;
    const m = analysis.metrics;
    const pb = analysis.primaryBottleneck;
    const sb = analysis.secondaryBottleneck;
    const priorities = analysis.priorities || [];
    const plan = analysis.thirtyDayPlan;
    const calendlyHref = getPrefilledCalendlyUrl();
    const intensiveMailtoSubject = `P31 Business Growth Intensive 1-on-1 Inquiry - ${gp.firstName || "Founder"}`;
    const intensiveMailtoBody = `Hi Oyin,\n\nI just completed the Business Growth Assessment for my business (${gp.specificNiche || "my business"}).\n\nI would like to inquire about booking a private 1-on-1 P31 Business Growth Intensive with you to review my numbers, pricing, and 90-day roadmap.\n\nLooking forward to hearing from you!\n\nBest,\n${gp.firstName || ""}`;
    const intensiveMailtoHref = `mailto:hello@busymamasnetwork.com?subject=${encodeURIComponent(intensiveMailtoSubject)}&body=${encodeURIComponent(intensiveMailtoBody)}`;

    const bTypeObj =
      (window.GROWTH_BUSINESS_TYPES || []).find((b) => b.id === gp.businessType) ||
      { label: "Existing Business" };

    const allGrowthTaskIds = [];
    (plan.weeks || []).forEach((w) => {
      (w.tasks || []).forEach((t) => allGrowthTaskIds.push(t.id));
    });
    const completedGrowthCount = allGrowthTaskIds.filter((id) => state.completedTasks.includes(id)).length;
    const progressPct = allGrowthTaskIds.length > 0
      ? Math.round((completedGrowthCount / allGrowthTaskIds.length) * 100)
      : 0;

    return `
      <div class="results-header-card">
        <div class="eyebrow-pill" style="background: rgba(255,255,255,0.14); border-color: var(--mint); color: var(--blush);">
          Personalized Growth Report for ${gp.firstName || "You"}
        </div>
        <h2 style="font-size: clamp(1.9rem, 4vw, 2.75rem); font-weight: 900; color: #fff; margin-bottom: 12px;">
          Growing From ${fmtMoney(m.currentRev)}/mo to <em style="color: var(--blush); font-style: italic;">${fmtMoney(m.targetRev)}/mo</em> (Inside ${m.maxDesiredHours} Hrs/Week)
        </h2>
        <p style="color: rgba(255,255,255,0.88); font-size: 1.02rem; max-width: 720px;">
          Here is what is holding back your sales right now, how the numbers work for your schedule, your <strong>Top 3 Growth Priorities</strong>, and your <strong>Simple 30-Day Action Plan</strong>.
        </p>

        <div class="results-summary-badges">
          <span class="summary-badge">${escapeHtml(
            gp.specificNiche ||
            ((window.GROWTH_SUB_NICHES && gp.businessType && window.GROWTH_SUB_NICHES[gp.businessType] || []).find((sn) => sn.id === gp.subNicheId)?.label) ||
            bTypeObj.label
          )}</span>
          ${gp.targetAudience ? `<span class="summary-badge">Audience: ${escapeHtml(gp.targetAudience)}</span>` : ""}
          <span class="summary-badge">Now: ${fmtMoney(m.currentRev)}/mo (~${m.marginPct}% Kept)</span>
          <span class="summary-badge">Goal: +${fmtMoney(m.revenueGap)}/mo More</span>
          <span class="summary-badge">Schedule Limit: ${m.maxDesiredHours} hrs/wk</span>
        </div>
      </div>

      <!-- 1. PRIMARY BOTTLENECK DIAGNOSIS & CAPACITY MATH -->
      <div class="growth-diagnosis-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 10px;">
          <span class="rank-pill" style="background: var(--blush-soft); color: var(--hot-pink-dark); border: 1.5px solid var(--blush);">
            ${pb.eyebrow}
          </span>
          <span style="font-size: 0.82rem; font-weight: 800; color: var(--ink-muted);">
            Next Area to Watch: ${sb.title.split("(")[0].trim()}
          </span>
        </div>
        <h3 style="font-size: 1.55rem; font-weight: 900; color: var(--forest); margin-bottom: 10px;">
          ${pb.title}
        </h3>
        <p style="font-size: 0.96rem; color: var(--ink); line-height: 1.65;">
          ${pb.diagnosisSummary}
        </p>

        <div class="growth-math-strip">
          <div class="growth-math-stat">
            <div class="growth-math-stat-label">Current Monthly Sales</div>
            <div class="growth-math-stat-val">${fmtMoney(m.currentRev)}/mo</div>
            <div class="growth-math-stat-sub">Est. Take-Home Pay: ~${fmtMoney(m.currentProfit)}/mo (${m.marginPct}%)</div>
          </div>
          <div class="growth-math-stat">
            <div class="growth-math-stat-label">90-Day Sales Goal</div>
            <div class="growth-math-stat-val" style="color: var(--forest);">${fmtMoney(m.targetRev)}/mo</div>
            <div class="growth-math-stat-sub">Est. Take-Home w/ Better Packages: ~${fmtMoney(m.targetProfitWithMarginLift)}/mo (${m.improvedMarginPct}%)</div>
          </div>
          <div class="growth-math-stat">
            <div class="growth-math-stat-label">Current Pay Per Hour</div>
            <div class="growth-math-stat-val">${fmtMoney(m.currentHourlyRev)}/hr</div>
            <div class="growth-math-stat-sub">Working ~${m.currentHours} hrs/wk (~${fmtMoney(m.currentHourlyProfit)}/hr kept)</div>
          </div>
          <div class="growth-math-stat">
            <div class="growth-math-stat-label">Target Pay Per Hour</div>
            <div class="growth-math-stat-val" style="color: var(--hot-pink);">${fmtMoney(m.requiredHourlyRev)}/hr</div>
            <div class="growth-math-stat-sub">Needed inside your ${m.maxDesiredHours} hrs/wk limit</div>
          </div>
        </div>

        <div style="background: var(--bg-cream); border-radius: var(--radius-sm); padding: 12px 16px; border: 1px solid var(--border); font-size: 0.84rem; color: var(--ink-muted); line-height: 1.55;">
          <strong>How We Worked Out These Numbers:</strong> ${pb.assumptionsNote} These numbers show what is needed to reach your goal inside ${m.maxDesiredHours} hours a week and are not guaranteed income claims.
        </div>
      </div>

      <!-- 2. HONEST MODEL CHECK / BRIDGE TO BUSINESS FIT (ONLY WHEN ANSWERS SHOW FIT/BURNOUT CONCERNS) -->
      ${
        analysis.needsBusinessFitBridge
          ? `
      <div class="growth-bridge-nudge-card" style="margin-bottom: 28px; border-width: 2.5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; width: 100%;">
          <div style="flex: 1; min-width: 260px;">
            <div style="font-size: 0.76rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--coral-dark); margin-bottom: 4px;">
              Important Check · Fix This Business or Try a Better-Fitting Idea
            </div>
            <h4 style="font-size: 1.1rem; margin-bottom: 6px;">
              Should you fix this business or test an easier, higher-profit idea in Business Fit?
            </h4>
            <p style="margin-bottom: 0;">
              ${analysis.bridgeReason}
            </p>
          </div>
          <button type="button" class="btn-secondary" data-switch-mode="fit" style="white-space: nowrap;">
            Switch to Business Fit Assessment
          </button>
        </div>
      </div>
      `
          : ""
      }

      <!-- 3. SIDE-BY-SIDE SNAPSHOT OF YOUR 3 GROWTH PRIORITIES -->
      <div class="comparison-summary-card">
        <div class="comparison-header-row">
          <div>
            <div class="comparison-eyebrow">Your Top 3 Growth Priorities</div>
            <h3 class="comparison-title">What to Focus On First Over the Next 30 Days</h3>
          </div>
          <span class="comparison-hint">Click any priority below to jump to its numbers & message script</span>
        </div>

        <div class="comparison-grid">
          ${priorities
            .map(
              (p, idx) => `
            <div class="comparison-col ${idx === 0 ? "rank-1" : ""}">
              <div class="comparison-col-header">
                <div class="comparison-col-top">
                  <span class="comparison-rank-tag">#${idx + 1} Priority</span>
                  <span class="comparison-score-tag">${p.impactScore}</span>
                </div>
                <div class="comparison-idea-name">${p.shortLabel}</div>
                <div class="comparison-category">${p.category}</div>
              </div>

              <div class="comparison-col-footer">
                <div class="comparison-metrics-list">
                  <div class="comparison-metric-row">
                    <span>Timing</span>
                    <strong>${p.timeToImplement || (idx === 0 ? "Days 1 to 7" : idx === 1 ? "Days 8 to 18" : "Days 19 to 30")}</strong>
                  </div>
                  <div class="comparison-metric-row">
                    <span>Time Saved</span>
                    <strong>${p.shortHoursSaved || (idx === 0 ? "4 to 6 hrs/wk" : idx === 1 ? "5+ hrs/wk" : "~5 hrs/wk")}</strong>
                  </div>
                  <div class="comparison-metric-row">
                    <span>Main Focus</span>
                    <strong>${p.shortBenefit || (idx === 0 ? "Packages & Pricing" : idx === 1 ? "Repeat Customers" : "Less Admin & DMs")}</strong>
                  </div>
                </div>

                <button type="button" class="comparison-jump-btn" data-jump-card="growth-priority-card-${idx}">
                  See Priority #${idx + 1} Plan
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- 4. DETAILED 3 GROWTH PRIORITY CARDS -->
      ${priorities.map((p, idx) => renderGrowthPriorityCard(p, idx)).join("")}

      <!-- 5. FOCUSED 30-DAY ACTION PLAN (WEEKS 1 TO 4) -->
      <div class="idea-result-card" style="border: 2.5px solid var(--forest); margin-top: 28px;">
        <div class="idea-card-top" style="background: linear-gradient(135deg, #E9F5E6 0%, #FEF9F5 100%);">
          <div class="idea-rank-row">
            <span class="rank-pill" style="background: var(--forest); color: #fff;">30-Day Step-by-Step Plan</span>
            <span class="match-score-pill">${completedGrowthCount} of ${allGrowthTaskIds.length} Steps Done (${progressPct}%)</span>
          </div>
          <h3 class="idea-title">${plan.headline}</h3>
          <p class="idea-desc">
            Check off each step as you finish it this month. Your progress is automatically saved in this browser${gp.email ? ` and linked to <strong>${gp.email}</strong>` : ""}.
          </p>
          <div class="progress-track" style="margin-top: 12px; background: rgba(45, 90, 39, 0.14);">
            <div class="progress-fill" style="width: ${progressPct}%; background: var(--forest);"></div>
          </div>
        </div>
        <div class="idea-card-body">
          <div style="display: grid; gap: 14px;">
            ${(plan.weeks || [])
              .map(
                (w) => `
              <div style="padding: 16px; border-radius: var(--radius-sm); background: var(--bg-cream); border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                  <span style="font-size: 0.78rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--coral-dark);">
                    ${w.week} · ${w.title}
                  </span>
                </div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--ink); margin-bottom: 10px;">
                  Goal: ${w.focus}
                </div>
                <div>
                  ${w.tasks
                    .map((t) => {
                      const isDone = state.completedTasks.includes(t.id);
                      return `
                        <label class="checkable-task-row ${isDone ? "completed" : ""}">
                          <input type="checkbox" class="action-task-checkbox" data-task-id="${t.id}" ${isDone ? "checked" : ""} />
                          <span>${t.text}</span>
                        </label>
                      `;
                    })
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- 6. P31 GROWTH INTENSIVE 1-ON-1 INQUIRY CTA -->
      <div class="consulting-showcase" id="growthIntensiveSection">
        <div class="consulting-grid">
          <div>
            <div class="eyebrow-pill" style="background: var(--mint); border-color: var(--mint); color: var(--dark); font-weight: 800;">
              OPTIONAL 1-ON-1 INTENSIVE · FOR ESTABLISHED FOUNDERS
            </div>
            <h2 style="font-size: clamp(1.75rem, 3.4vw, 2.35rem); font-weight: 900; color: #fff; margin-bottom: 12px;">
              Would You Like 1-on-1 Strategic Guidance With Oyin to Map Out Your Next 90 Days?
            </h2>
            <p style="color: rgba(255,255,255,0.88); font-size: 1rem; line-height: 1.6;">
              Your 30-day action plan has been sent to your email, giving you a clear roadmap. But if you want a second pair of experienced eyes on your pricing, capacity limits, and bottlenecks, you do not have to tackle execution alone. In a private P31 Growth Intensive, Oyin will personally review your numbers, profit leaks, and weekly schedule to build a focused execution plan that protects your family hours.
            </p>

            <ul class="consulting-benefits">
              <li>
                <span style="color: var(--mint); font-weight: 900;">01</span>
                <div>
                  <strong>Private 90-Minute Strategic Diagnostic:</strong> Deep dive into your revenue leaks, offer pricing, and schedule boundaries tailored to your family life.
                </div>
              </li>
              <li>
                <span style="color: var(--mint); font-weight: 900;">02</span>
                <div>
                  <strong>Written 90-Day Priority Roadmap:</strong> A clear, prioritized action roadmap built around your exact target income and ~${m.maxDesiredHours} hrs/week schedule cap.
                </div>
              </li>
              <li>
                <span style="color: var(--mint); font-weight: 900;">03</span>
                <div>
                  <strong>Direct Eyes on Your #1 Bottleneck:</strong> Honest, experienced feedback on what to streamline, what to delegate, and how to scale without working longer nights.
                </div>
              </li>
            </ul>
          </div>

          <div class="consulting-cta-box">
            <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blush); margin-bottom: 6px;">
              Private Diagnostic
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #fff; margin-bottom: 6px;">
              P31 Growth Intensive
            </h3>
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--mint); margin-bottom: 12px;">
              Private 1-on-1 With Oyin
            </div>
            <p style="font-size: 0.88rem; color: rgba(255,255,255,0.84); margin-bottom: 20px; line-height: 1.5;">
              Ready for focused, private guidance on your pricing, schedule boundaries, and 90-day priorities? Intake is reviewed on an inquiry basis to ensure fit.
            </p>

            <a
              href="${intensiveMailtoHref}"
              class="btn-pink"
              style="display: flex; justify-content: center; text-decoration: none; width: 100%; margin-bottom: 12px; font-weight: 800;"
            >
              Inquire About a 1-on-1 With Oyin
            </a>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.72); margin: 0;">
              Inquiries reviewed personally within 1 business day.
            </p>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-top: 28px;">
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <button type="button" class="btn-secondary" id="btnStartFreshGrowthQuiz">
            Start Over
          </button>
          <button type="button" class="btn-secondary" id="btnRetakeGrowthQuiz">
            Edit My Current Answers
          </button>
        </div>
        <button type="button" class="btn-secondary" onclick="window.print()">
          Print / Save Growth Plan as PDF
        </button>
      </div>
    `;
  }

  function bindGrowthResultsEvents() {
    document.querySelectorAll("[data-switch-mode]").forEach((btn) => {
      btn.onclick = () => switchToolMode(btn.getAttribute("data-switch-mode"));
    });

    document.querySelectorAll("[data-jump-card]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-jump-card");
        const el = targetId ? document.getElementById(targetId) : null;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.querySelectorAll("[data-growth-card]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cIdx = Number(btn.getAttribute("data-growth-card"));
        const tab = btn.getAttribute("data-growth-tab");
        state.growthActiveTabs[cIdx] = tab;
        render();
      });
    });

    document.querySelectorAll(".action-task-checkbox").forEach((cb) => {
      cb.addEventListener("change", () => {
        const taskId = cb.getAttribute("data-task-id");
        if (!taskId) return;
        if (cb.checked) {
          if (!state.completedTasks.includes(taskId)) {
            state.completedTasks.push(taskId);
          }
        } else {
          state.completedTasks = state.completedTasks.filter((id) => id !== taskId);
        }
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll(".copy-script-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = decodeURIComponent(btn.getAttribute("data-script") || "");
        navigator.clipboard?.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1800);
      });
    });

    document.querySelectorAll(".open-calendly-btn").forEach((btn) => {
      btn.addEventListener("click", () => openCalendlyModal());
    });

    const retakeBtn = document.getElementById("btnRetakeGrowthQuiz");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        state.growthStep = 1;
        state.growthShownStories = {};
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const startFreshBtn = document.getElementById("btnStartFreshGrowthQuiz");
    if (startFreshBtn) {
      startFreshBtn.addEventListener("click", () => resetAssessmentAndStartOver());
    }
  }

  // ============================================================================
  // CALENDLY CONSULTATION WITH OYIN MODAL
  // ============================================================================
  function openCalendlyModal() {
    const modal = document.getElementById("calendlyModal");
    const container = document.getElementById("calendlyEmbedContainer");
    const directLink = document.getElementById("calendlyDirectFallbackLink");
    if (!modal || !container) return;

    const url = getPrefilledCalendlyUrl();
    if (directLink) directLink.href = url;

    if (url.includes("your-calendly-link")) {
      const displayFirst =
        state.mode === "growth"
          ? state.growthProfile.firstName || state.profile.firstName || "your"
          : state.profile.firstName || "your";
      const displayTarget =
        state.mode === "growth"
          ? fmtMoney(state.growthProfile.targetRevenue)
          : fmtMoney(state.profile.incomeGoal);
      container.innerHTML = `
        <div style="padding: 36px 24px; text-align: center; background: var(--bg-cream); border-radius: var(--radius-md); border: 1.5px dashed var(--border-strong);">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">
            Oyin's 1-on-1 Consultation Scheduler
          </h3>
          <p style="font-size: 0.92rem; color: var(--ink-muted); max-width: 480px; margin: 0 auto 16px;">
            Once Oyin's live Calendly link is connected in settings, the interactive booking calendar loads here with <strong>${displayFirst}'s</strong> details and <strong>${displayTarget}/mo</strong> target pre-filled.
          </p>
        </div>
      `;
    } else {
      const embedUrl = url + (url.includes("?") ? "&" : "?") + "hide_gdpr_banner=1";
      container.innerHTML = `
        <iframe
          src="${embedUrl}"
          width="100%"
          height="620"
          frameborder="0"
          style="border-radius: 12px; border: 1px solid var(--border);"
          title="Book 1-on-1 Consultation with Oyin"
        ></iframe>
      `;
    }

    modal.classList.add("open");
  }

  // ============================================================================
  // ADMIN / INTEGRATIONS & AUDIENCE INSIGHTS MODAL
  // ============================================================================
  async function openAdminModal() {
    const modal = document.getElementById("adminModal");
    if (!modal) return;

    document.getElementById("cfgSheetUrl").value = state.config.googleSheetUrl || "";
    document.getElementById("cfgSheetTab").value = state.config.googleSheetTabName || "Sheet1";
    const writeWebhookInput = document.getElementById("cfgSheetWriteWebhookUrl");
    if (writeWebhookInput) {
      writeWebhookInput.value = state.config.googleSheetWriteWebhookUrl || "";
    }
    const fitInput = document.getElementById("cfgKitFitFormId");
    if (fitInput) fitInput.value = state.config.kitFitFormId || state.config.kitFormId || "";
    const growthInput = document.getElementById("cfgKitGrowthFormId");
    if (growthInput) growthInput.value = state.config.kitGrowthFormId || "";
    const oldFormInput = document.getElementById("cfgKitFormId");
    if (oldFormInput) oldFormInput.value = state.config.kitFormId || "";

    document.getElementById("cfgKitApiKey").value = state.config.kitApiKey || "";
    document.getElementById("cfgKitTagId").value = state.config.kitTagId || "";
    document.getElementById("cfgCalendlyUrl").value = state.config.calendlyUrl || "";
    document.getElementById("cfgConsultingTitle").value =
      state.config.consulting?.title || window.APP_CONFIG.consulting.title;
    document.getElementById("cfgGeminiKey").value = state.config.geminiApiKey || "";
    document.getElementById("cfgOpenaiKey").value = state.config.openaiApiKey || "";

    let leads = [];
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d.leads)) leads = d.leads;
      }
    } catch (_) {}
    if (leads.length === 0) {
      try {
        leads = JSON.parse(localStorage.getItem(STORAGE_LEADS_KEY) || "[]");
      } catch (_) {}
    }

    const leadsCountEl = document.getElementById("adminLeadsCount");
    if (leadsCountEl) {
      leadsCountEl.textContent = `${leads.length} assessment(s) captured`;
    }

    const statsBody = document.getElementById("adminAudienceStatsBody");
    if (statsBody && leads.length > 0) {
      const avgHours = Math.round(
        leads.reduce((acc, l) => acc + (Number(l.hoursPerWeek) || 8), 0) / leads.length
      );
      const topIdeasFreq = {};
      leads.forEach((l) => {
        if (l.topIdea1) topIdeasFreq[l.topIdea1] = (topIdeasFreq[l.topIdea1] || 0) + 1;
      });
      const topMatchedIdea =
        Object.entries(topIdeasFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
      const checkInCount = leads.filter((l) => l.checkInCadence === "weekly-checkins").length;

      statsBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-top: 4px;">
          <div><strong>Avg Weekly Time:</strong> ~${avgHours} hrs/week</div>
          <div><strong>Check-In Opt-In:</strong> ${checkInCount} of ${leads.length} users</div>
          <div><strong>Top #1 Match:</strong> ${topMatchedIdea}</div>
        </div>
      `;
    }

    modal.classList.add("open");
  }

  function exportLeadsCsv() {
    let leads = [];
    try {
      leads = JSON.parse(localStorage.getItem(STORAGE_LEADS_KEY) || "[]");
    } catch (_) {}

    fetch("/api/leads")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.leads) && d.leads.length > 0) {
          leads = d.leads;
        }
        downloadCsvFromList(leads);
      })
      .catch(() => downloadCsvFromList(leads));
  }

  function downloadCsvFromList(leads) {
    if (!leads || leads.length === 0) {
      alert("No leads captured yet! Complete a test assessment first.");
      return;
    }
    const headers = [
      "timestamp",
      "firstName",
      "email",
      "currency",
      "incomeGoal",
      "timeline",
      "hoursPerWeek",
      "budget",
      "skills",
      "workStyle",
      "checkInCadence",
      "topIdea1",
      "topIdea2",
      "topIdea3",
      "completedTasksCount"
    ];
    const csvRows = [
      headers.join(","),
      ...leads.map((row) =>
        headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
      )
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-fit-assessment-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function init() {
    loadSavedConfig();
    await syncServerConfig();
    await loadGoogleSheetVault();
    restoreUserProgress();

    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode");
    if (modeParam === "growth" || modeParam === "fit") {
      state.mode = modeParam;
      state.view = "assessment";
    } else if (urlParams.get("view") === "assessment") {
      state.view = "assessment";
    } else {
      state.view = "home";
    }

    document.querySelectorAll("[data-switch-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchToolMode(btn.getAttribute("data-switch-mode"));
      });
    });

    const topNavHomeBtn = document.getElementById("topNavHomeBtn");
    if (topNavHomeBtn) {
      topNavHomeBtn.addEventListener("click", () => {
        navigateToHome();
      });
    }

    const btnHeroBackHome = document.getElementById("btnHeroBackHome");
    if (btnHeroBackHome) {
      btnHeroBackHome.addEventListener("click", () => {
        navigateToHome();
      });
    }

    const btnHeroSwitch = document.getElementById("btnHeroSwitchTool");
    if (btnHeroSwitch) {
      btnHeroSwitch.addEventListener("click", () => {
        const nextMode = btnHeroSwitch.getAttribute("data-switch-to") || (state.mode === "fit" ? "growth" : "fit");
        navigateToAssessment(nextMode);
      });
    }

    window.addEventListener("popstate", () => {
      const p = new URLSearchParams(window.location.search);
      const m = p.get("mode");
      if (m === "growth" || m === "fit") {
        state.mode = m;
        state.view = "assessment";
      } else {
        state.view = "home";
      }
      render();
    });

    render();

    // Only show Admin controls if ?admin=true is in URL (or Shift+A shortcut)
    const isAdminMode = urlParams.get("admin") === "true" || urlParams.get("admin") === "1";
    const btnAdmin = document.getElementById("btnOpenAdmin");
    const adminPill = document.getElementById("adminVaultPill");

    if (isAdminMode) {
      if (btnAdmin) btnAdmin.style.display = "inline-flex";
      if (adminPill) adminPill.style.display = "inline-flex";
    }

    // Secret owner keyboard shortcut (Shift + A) to open Admin Hub anytime
    document.addEventListener("keydown", (e) => {
      if (e.shiftKey && (e.key === "A" || e.key === "a")) {
        const tag = (e.target && e.target.tagName) || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          openAdminModal();
        }
      }
    });

    if (btnAdmin) btnAdmin.addEventListener("click", openAdminModal);

    const brandResetLink = document.getElementById("brandResetLink");
    if (brandResetLink) {
      brandResetLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateToHome();
      });
    }

    const btnContinueStory = document.getElementById("btnContinueFromStoryModal");
    if (btnContinueStory) btnContinueStory.addEventListener("click", closeStoryModalAndAdvance);

    const btnSkipStory = document.getElementById("btnSkipStoryModal");
    if (btnSkipStory) btnSkipStory.addEventListener("click", closeStoryModalAndAdvance);

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-close-modal");
        document.getElementById(targetId)?.classList.remove("open");
      });
    });

    const adminForm = document.getElementById("adminSettingsForm");
    if (adminForm) {
      adminForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        state.config.googleSheetUrl = document.getElementById("cfgSheetUrl").value.trim();
        state.config.googleSheetTabName = document.getElementById("cfgSheetTab").value.trim() || "Sheet1";
        state.config.googleSheetWriteWebhookUrl =
          document.getElementById("cfgSheetWriteWebhookUrl")?.value.trim() || "";
        const fitVal = document.getElementById("cfgKitFitFormId")?.value.trim();
        const growthVal = document.getElementById("cfgKitGrowthFormId")?.value.trim();
        const legacyVal = document.getElementById("cfgKitFormId")?.value.trim();
        state.config.kitFitFormId = fitVal || legacyVal || "10105556";
        state.config.kitGrowthFormId = growthVal || "10105554";
        state.config.kitFormId = fitVal || legacyVal || "10105556";
        state.config.kitApiKey = document.getElementById("cfgKitApiKey").value.trim() || "KNfaWYKoCU8IZgyhEK_Lag";
        state.config.kitTagId = document.getElementById("cfgKitTagId").value.trim();
        state.config.calendlyUrl = document.getElementById("cfgCalendlyUrl").value.trim();
        state.config.consulting = state.config.consulting || {};
        state.config.consulting.title = document.getElementById("cfgConsultingTitle").value.trim();
        state.config.geminiApiKey = document.getElementById("cfgGeminiKey").value.trim();
        state.config.openaiApiKey = document.getElementById("cfgOpenaiKey").value.trim();

        localStorage.setItem(STORAGE_CFG_KEY, JSON.stringify(state.config));

        const statusEl = document.getElementById("adminSyncFeedback");
        if (statusEl) statusEl.textContent = "Syncing Google Sheet & saving settings...";

        const syncRes = await loadGoogleSheetVault(
          state.config.googleSheetUrl,
          state.config.googleSheetTabName
        );

        if (statusEl) {
          if (syncRes.ok) {
            statusEl.style.color = "#065F46";
            statusEl.textContent = `Saved. Synced ${syncRes.count} business profiles live from your Google Sheet.`;
          } else if (state.config.googleSheetUrl) {
            statusEl.style.color = "#B45309";
            statusEl.textContent = `Saved. Make sure your Google Sheet sharing is set to "Anyone with the link can view" (${syncRes.count} built-in profiles active).`;
          } else {
            statusEl.style.color = "#065F46";
            statusEl.textContent = `Settings saved (${syncRes.count} built-in profiles active).`;
          }
        }
        render();
      });
    }

    const btnExportCsv = document.getElementById("btnExportLeadsCsv");
    if (btnExportCsv) {
      btnExportCsv.addEventListener("click", exportLeadsCsv);
    }

    const btnExportVaultCsv = document.getElementById("btnExportVaultIdeasCsv");
    if (btnExportVaultCsv) {
      btnExportVaultCsv.addEventListener("click", () => {
        const rows = window.formatVaultIdeasForGoogleSheet
          ? window.formatVaultIdeasForGoogleSheet(window.DEFAULT_VAULT_IDEAS || [])
          : [];
        if (rows.length === 0) return;
        const headers = Object.keys(rows[0]);
        const csvLines = [
          headers.join(","),
          ...rows.map((r) =>
            headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
          )
        ];
        const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "business-fit-new-vault-ideas-for-google-sheets.csv";
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const btnPushVault = document.getElementById("btnPushNewIdeasToSheet");
    if (btnPushVault) {
      btnPushVault.addEventListener("click", async () => {
        state.config.googleSheetUrl = document.getElementById("cfgSheetUrl")?.value.trim() || state.config.googleSheetUrl;
        state.config.googleSheetTabName = document.getElementById("cfgSheetTab")?.value.trim() || "Sheet1";
        state.config.googleSheetWriteWebhookUrl =
          document.getElementById("cfgSheetWriteWebhookUrl")?.value.trim() || state.config.googleSheetWriteWebhookUrl;
        localStorage.setItem(STORAGE_CFG_KEY, JSON.stringify(state.config));

        const statusEl = document.getElementById("adminSyncFeedback");
        if (statusEl) {
          statusEl.style.color = "#334155";
          statusEl.textContent = "Syncing new Vault ideas to your Google Sheet & local CSV...";
        }

        const res = await syncMissingIdeasToGoogleSheet(window.DEFAULT_VAULT_IDEAS || []);
        if (statusEl) {
          if (res.webhookPushed) {
            statusEl.style.color = "#065F46";
            statusEl.textContent = `Pushed ${res.count || 20} new Vault ideas directly to your Google Sheet & updated new-vault-ideas-for-google-sheets.csv.`;
          } else {
            statusEl.style.color = "#065F46";
            statusEl.textContent = `Saved all ${res.count || 20} new Vault ideas to new-vault-ideas-for-google-sheets.csv and merged them live with your Google Sheet.`;
          }
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
