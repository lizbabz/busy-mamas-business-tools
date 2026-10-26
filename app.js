/**
 * ============================================================================
 * BUSINESS FIT BY BUSY MAMAS - MAIN APPLICATION (app.js)
 * ============================================================================
 */

(function () {
  const STORAGE_CFG_KEY = "busy_mamas_admin_config_v1";
  const STORAGE_LEADS_KEY = "busy_mamas_local_leads_v1";
  const STORAGE_PROGRESS_KEY = "busy_mamas_saved_progress_v1";

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
    mode: "fit", // "fit" (Business Fit) or "growth" (Business Growth Assessment)
    step: 1, // 1..6: 6-Step Deep-Fit Assessment, 7: Name & Email Gate, 8: Recommendations & Action Plan
    growthStep: 1, // 1..6: 6-Step Growth Diagnostic, 7: Name & Email Gate, 8: Growth Findings & 30-Day Plan
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
    activeTabs: { 0: "overview", 1: "overview", 2: "overview", 3: "overview", 4: "overview" },
    validationError: "",
    limitNotice: "",
    aiEnhancing: false,
    aiEnhanced: false,
    config: { ...(window.APP_CONFIG || {}) }
  };

  function updateModeHeroAndNav() {
    const isGrowth = state.mode === "growth";
    document.querySelectorAll("[data-switch-mode]").forEach((btn) => {
      const m = btn.getAttribute("data-switch-mode");
      btn.classList.toggle("active", m === state.mode);
    });

    const brandLogoText = document.getElementById("brandLogoText");
    if (brandLogoText) {
      brandLogoText.innerHTML = isGrowth
        ? `Business Growth <em>by Busy Mamas</em>`
        : `Business Fit <em>by Busy Mamas</em>`;
    }

    const eyebrow = document.getElementById("heroEyebrow");
    if (eyebrow) {
      eyebrow.textContent = isGrowth
        ? "Business Growth & Profit Checkup"
        : "Personalized Business Discovery & Action Plan";
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

  function switchToolMode(newMode) {
    const target = newMode === "growth" ? "growth" : "fit";
    state.mode = target;
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
    updateModeHeroAndNav();
    saveUserProgress();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAssessmentAndStartOver() {
    if (state.mode === "growth") {
      const keepCurrency = state.growthProfile.currency || state.profile.currency || "USD";
      state.growthStep = 1;
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

  function validateCurrentStep() {
    const p = state.profile;
    if (state.step === 1) {
      if (!p.timeline) {
        return {
          ok: false,
          message: "Please select your target timeline below before continuing to Section 02.",
          scrollSelector: "#partTimelineHeading"
        };
      }
      return { ok: true };
    }
    if (state.step === 2) {
      const hasHours = Number(p.hoursPerWeek) > 0;
      const hasRhythm = Boolean(p.scheduleRhythm);
      if (!hasHours && !hasRhythm) {
        return {
          ok: false,
          message: "Please select your weekly hours (Part A) and when those hours happen (Part B) before continuing.",
          scrollSelector: "#part2AHeading"
        };
      }
      if (!hasHours) {
        return {
          ok: false,
          message: "Please select how many hours per week you can realistically give in Part A.",
          scrollSelector: "#part2AHeading"
        };
      }
      if (!hasRhythm) {
        return {
          ok: false,
          message: "Please select when your hours happen in Part B before continuing.",
          scrollSelector: "#part2BHeading"
        };
      }
      return { ok: true };
    }
    if (state.step === 3) {
      const hasBg = Array.isArray(p.backgrounds) && p.backgrounds.length > 0;
      const hasLic = Boolean(p.licensingOpenness);
      if (!hasBg && !hasLic) {
        return {
          ok: false,
          message: "Please select at least one background (Part A) and your licensing preference (Part B) before continuing.",
          scrollSelector: "#part3AHeading"
        };
      }
      if (!hasBg) {
        return {
          ok: false,
          message: "Please select at least one work, educational, or homemaker background in Part A.",
          scrollSelector: "#part3AHeading"
        };
      }
      if (!hasLic) {
        return {
          ok: false,
          message: "Please select how you feel about state licensing or certifications in Part B.",
          scrollSelector: "#part3BHeading"
        };
      }
      return { ok: true };
    }
    if (state.step === 4) {
      const hasSkills = Array.isArray(p.skills) && p.skills.length > 0;
      const hasDir = Boolean(p.skillDirection);
      if (!hasSkills && !hasDir) {
        return {
          ok: false,
          message: "Please select at least one core skill (Part A) and how you want to use your skills (Part B) before continuing.",
          scrollSelector: "#part4AHeading"
        };
      }
      if (!hasSkills) {
        return {
          ok: false,
          message: "Please select at least one skill area in Part A (or choose 'I Am Not Sure').",
          scrollSelector: "#part4AHeading"
        };
      }
      if (!hasDir) {
        return {
          ok: false,
          message: "Please select how you want to use your existing skills in Part B.",
          scrollSelector: "#part4BHeading"
        };
      }
      return { ok: true };
    }
    if (state.step === 5) {
      const hasAct = Array.isArray(p.enjoyedActivities) && p.enjoyedActivities.length > 0;
      const hasLife = Array.isArray(p.livedExperiences) && p.livedExperiences.length > 0;
      if (!hasAct && !hasLife) {
        return {
          ok: false,
          message: "Please select at least one real-life hobby (Part A) and one lived experience (Part B) before continuing.",
          scrollSelector: "#part5AHeading"
        };
      }
      if (!hasAct) {
        return {
          ok: false,
          message: "Please select at least one hobby or everyday activity you enjoy in Part A.",
          scrollSelector: "#part5AHeading"
        };
      }
      if (!hasLife) {
        return {
          ok: false,
          message: "Please select at least one personal life or motherhood chapter in Part B.",
          scrollSelector: "#part5BHeading"
        };
      }
      return { ok: true };
    }
    if (state.step === 6) {
      const hasStyle = Boolean(p.workStyle);
      const hasBudget = p.budget !== null && p.budget !== undefined;
      if (!hasStyle && !hasBudget) {
        return {
          ok: false,
          message: "Please select your preferred business environment (Part A) and available startup budget (Part B). Parts C and D are optional.",
          scrollSelector: "#part6AHeading"
        };
      }
      if (!hasStyle) {
        return {
          ok: false,
          message: "Please select your preferred business environment in Part A before viewing your matches.",
          scrollSelector: "#part6AHeading"
        };
      }
      if (!hasBudget) {
        return {
          ok: false,
          message: "Please select your available startup budget in Part B before viewing your matches.",
          scrollSelector: "#part6BHeading"
        };
      }
      return { ok: true };
    }
    return { ok: true };
  }

  function validateGrowthStep() {
    const gp = state.growthProfile;
    if (state.growthStep === 1) {
      if (!gp.businessType) {
        return {
          ok: false,
          message: "Please select what type of business you run in Part A before continuing.",
          scrollSelector: "#growthPart1A"
        };
      }
      if (!gp.revenueStageId) {
        return {
          ok: false,
          message: "Please select your current monthly revenue stage in Part B before continuing.",
          scrollSelector: "#growthPart1B"
        };
      }
      if (!gp.profitMarginId) {
        return {
          ok: false,
          message: "Please select your estimated take-home profit margin in Part C (or choose 'Not Sure Yet').",
          scrollSelector: "#growthPart1C"
        };
      }
      return { ok: true };
    }
    if (state.growthStep === 2) {
      if (!gp.offerStructure) {
        return {
          ok: false,
          message: "Please select how your offers are currently structured in Part A.",
          scrollSelector: "#growthPart2A"
        };
      }
      if (!gp.avgPriceTierId) {
        return {
          ok: false,
          message: "Please select your average order or package price in Part B.",
          scrollSelector: "#growthPart2B"
        };
      }
      if (!gp.priceConfidence) {
        return {
          ok: false,
          message: "Please select how you feel about your current pricing in Part C.",
          scrollSelector: "#growthPart2C"
        };
      }
      return { ok: true };
    }
    if (state.growthStep === 3) {
      const hasLeadSources =
        (Array.isArray(gp.leadSources) && gp.leadSources.length > 0) || Boolean(gp.leadSource);
      if (!hasLeadSources) {
        return {
          ok: false,
          message: "Please select at least one way your customers find you right now in Part A.",
          scrollSelector: "#growthPart3A"
        };
      }
      if (!gp.conversionIssue) {
        return {
          ok: false,
          message: "Please select where prospective buyers drop off in Part B.",
          scrollSelector: "#growthPart3B"
        };
      }
      return { ok: true };
    }
    if (state.growthStep === 4) {
      if (!gp.repeatRateId) {
        return {
          ok: false,
          message: "Please select your approximate repeat customer rate in Part A.",
          scrollSelector: "#growthPart4A"
        };
      }
      if (!gp.retentionSystem) {
        return {
          ok: false,
          message: "Please select how you currently follow up with past buyers in Part B.",
          scrollSelector: "#growthPart4B"
        };
      }
      return { ok: true };
    }
    if (state.growthStep === 5) {
      if (!gp.currentHours) {
        return {
          ok: false,
          message: "Please select roughly how many hours per week you work now in Part A.",
          scrollSelector: "#growthPart5A"
        };
      }
      if (!gp.maxDesiredHours) {
        return {
          ok: false,
          message: "Please select your maximum desired weekly hours in Part B.",
          scrollSelector: "#growthPart5B"
        };
      }
      if (!gp.deliveryDrain) {
        return {
          ok: false,
          message: "Please select what takes up the most time or energy in your week in Part C.",
          scrollSelector: "#growthPart5C"
        };
      }
      return { ok: true };
    }
    if (state.growthStep === 6) {
      if (!gp.primaryGoal) {
        return {
          ok: false,
          message: "Please select your #1 growth priority for the next 30 to 90 days in Part A.",
          scrollSelector: "#growthPart6A"
        };
      }
      if (gp.growthBudget === null || gp.growthBudget === undefined) {
        return {
          ok: false,
          message: "Please select your available monthly growth/systems budget in Part B.",
          scrollSelector: "#growthPart6B"
        };
      }
      return { ok: true };
    }
    return { ok: true };
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
        growthStep: state.growthStep,
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
        }
        if (saved.growthStep && saved.growthStep >= 1 && saved.growthStep <= 8) {
          state.growthStep = saved.growthStep;
          if (state.growthStep >= 7 && window.GrowthEngine) {
            state.growthAnalysis = window.GrowthEngine.analyzeBusiness(state.growthProfile);
          }
        }
      }
      if (saved && saved.profile) {
        state.profile = { ...state.profile, ...saved.profile };
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
      return `<strong>2-Week Flash Sprint (${fmt} in 14 Days):</strong> We will prioritize fast-turnaround ideas that can generate immediate presales, 50% booking deposits, or starter packages within your next 14 days.`;
    }
    if (goalUsd <= 2000) {
      return `<strong>Extra Income Stream (${fmt}/mo):</strong> Great for covering family expenses, savings, or travel. Reachable with weekend local bookings, presale drops, digital orders, or 2 to 3 recurring accounts.`;
    }
    if (goalUsd <= 5500) {
      return `<strong>Core Vault Milestone (${fmt}/mo):</strong> We will prioritize ideas rated highest for ease of reaching this level through bundled products, local packages, or repeat customers.`;
    }
    if (goalUsd <= 12000) {
      return `<strong>Full-Income Replacement (${fmt}/mo):</strong> To reach ${fmt}/mo within your weekly hours, we will look for higher-commission transactions, repeat B2B/bulk orders, and scalable packages.`;
    }
    return `<strong>High-Earning & Licensed Tier (${fmt}/mo):</strong> For targets above ${fmtMoney(12000 * cur.rate)}/mo, our algorithm prioritizes high-commission licensed professions (financial products, mortgage, senior placement, recruiting), government contracting, and scalable assets.`;
  }

  function computeRecommendations() {
    const ranked = window.VaultEngine.rankIdeas(state.vaultIdeas, state.profile);
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

    const activeStep = state.mode === "growth" ? state.growthStep : state.step;
    const heroHeader = document.getElementById("heroHeader") || document.querySelector(".hero-header");
    if (heroHeader) {
      heroHeader.style.display = activeStep === 1 ? "block" : "none";
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
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const story = selectTailoredStoryForStep(completedStep);
    if (!story) {
      state.step = nextStep;
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
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const stories = window.GROWTH_STORIES || [];
    const story = stories.find((s) => (s.preferredSteps || []).includes(completedStep)) || stories[0];
    if (!story) {
      state.growthStep = nextStep;
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
      } else {
        state.step = state.pendingNextStep;
      }
      state.pendingNextStep = null;
      saveUserProgress();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ============================================================================
  // RENDER ASSESSMENT STEPS 1 - 4
  // ============================================================================
  function renderQuizStep() {
    const pct = Math.round((state.step / state.totalQuizSteps) * 100);
    const cur = getCur();
    const flashAmount = fmtMoney(window.VaultEngine.scaleUsdToCurrency(1500, cur.code));
    let stepContent = "";

    if (state.step === 1) {
      const g = Number(state.profile.incomeGoal) || cur.defaultGoal;
      const annual = g * 12;
      const isFlash = isFlashTimeline();
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
            <h2 class="step-title">Choose Your Currency, <em>Income Target</em> & Timeline</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Pick your currency and set your income target and timeline. We will calculate what it takes and explain the honest requirements and tradeoffs.
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
            <button type="button" class="preset-btn ${isFlash && g === 1500 ? "active" : ""}" data-flash-preset="1500">
              ${fmtMoney(1500)} in 14 Days (Flash)
            </button>
            ${(cur.presets || [])
              .map(
                (amt) => `
              <button type="button" class="preset-btn ${!isFlash && g === amt ? "active" : ""}" data-preset="${amt}">
                ${fmtMoney(amt)}/mo
              </button>
            `
              )
              .join("")}
          </div>

          <div class="custom-dollar-input-wrap">
            <span>Or type exact target: ${cur.symbol}</span>
            <input
              type="number"
              id="customIncomeInput"
              class="custom-dollar-input"
              min="100"
              max="100000000"
              step="${cur.step}"
              value="${g}"
            />
            <span id="customIncomeUnitSuffix">${isFlash ? "in 14 days" : "/mo"}</span>
          </div>

          <div class="tier-insight-banner" id="tierInsightBanner">
            ${getIncomeTierInsight(g)}
          </div>
        </div>

        <h3 class="sub-section-heading" id="partTimelineHeading">
          Choose your target timeline:
        </h3>
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
    } else if (state.step === 2) {
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

      const rhythms = window.SCHEDULE_RHYTHMS || [];
      const currentRhythm = state.profile.scheduleRhythm || "";

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">Weekly Hours & <em>Your Schedule Rhythm</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Not all hours are created equal in motherhood. Tell us how many hours you have and <strong>how those hours are shaped</strong> so we match businesses that fit your actual daily life.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="part2AHeading">Part A: How many hours per week can you realistically give?</h3>
        <div class="options-grid" style="margin-bottom: 26px;">
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

        <h3 class="sub-section-heading" id="part2BHeading">Part B: When do those hours happen?</h3>
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
    } else if (state.step === 3) {
      const selectedBgs = state.profile.backgrounds || [];
      const licensingChoice = state.profile.licensingOpenness || "";

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">03</span>
          <div>
            <h2 class="step-title">Professional Background, <em>Certifications & Licensing</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Your past work experience and openness to professional credentials can unlock high-margin consulting, B2B retainers, or high-commission licensed roles.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="part3AHeading">Part A: Select all work or educational backgrounds you have (pick 1 or more):</h3>
        <div class="options-grid options-grid-compact" style="margin-bottom: 26px;">
          ${(window.PROFESSIONAL_BACKGROUNDS || [])
            .map((bg) => {
              const isSel = selectedBgs.includes(bg.id);
              return `
              <div class="option-card ${isSel ? "selected" : ""}" data-bg="${bg.id}">
                <div class="option-content">
                  <div class="option-title">${bg.label || bg.title || ""}</div>
                  <div class="option-sub">${bg.sub || bg.desc || ""}</div>
                </div>
                <div class="option-check">✓</div>
              </div>
            `;
            })
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="part3BHeading">Part B: How do you feel about state licensing or certifications?</h3>
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
    } else if (state.step === 4) {
      const selected = state.profile.skills || [];
      const activeSkillCount = selected.filter((s) => s !== "unsure").length;
      const isSkillLimitReached = activeSkillCount >= 4;
      const directionChoice = state.profile.skillDirection || "";

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">04</span>
          <div>
            <h2 class="step-title">Your Core Skills & <em>How You Want to Use Them</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Just because you are skilled at something does not always mean you want to build your next business around it. Let's look at <strong>what you are already good at</strong> and <strong>whether you want to monetize it or pivot</strong>.
            </p>
          </div>
        </div>

        <div class="sub-section-heading-row" id="part4AHeading">
          <h3 class="sub-section-heading" style="margin-bottom: 0;">Part A: What are your strongest existing capabilities? (Pick 1 to 4 areas you already do well):</h3>
          <span class="selection-counter-pill ${isSkillLimitReached ? "max-reached" : ""}">${activeSkillCount} of 4 selected</span>
        </div>
        ${
          state.limitNotice
            ? `<div class="selection-limit-notice" role="status">${state.limitNotice}</div>`
            : ``
        }
        <div class="options-grid options-grid-compact" style="margin-bottom: 26px;">
          ${(window.SKILL_CATEGORIES || [])
            .map((cat) => {
              const isSel = selected.includes(cat.id);
              const isDimmed = !isSel && isSkillLimitReached;
              return `
              <div class="option-card ${isSel ? "selected" : ""} ${isDimmed ? "limit-dimmed" : ""}" data-skill="${cat.id}">
                <div class="option-content">
                  <div class="option-title">${cat.label || cat.title || ""}</div>
                  <div class="option-sub">${cat.desc || cat.sub || ""}</div>
                </div>
                <div class="option-check">✓</div>
              </div>
            `;
            })
            .join("")}
          <div class="option-card ${selected.includes("unsure") ? "selected" : ""}" data-skill="unsure">
            <div class="option-content">
              <div class="option-title">Not Sure Yet (Show Starter Ideas)</div>
              <div class="option-sub">Prioritize approachable, step-by-step businesses that do not require specialized technical backgrounds.</div>
            </div>
            <div class="option-check">✓</div>
          </div>
        </div>

        <h3 class="sub-section-heading" id="part4BHeading">Part B: How do you want to use your existing skills?</h3>
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
    } else if (state.step === 5) {
      const selectedActivities = state.profile.enjoyedActivities || [];
      const isActivityLimitReached = selectedActivities.length >= 3;
      const selectedLifeExp = state.profile.livedExperiences || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">05</span>
          <div>
            <h2 class="step-title">Real-Life Hobbies, Passions & <em>Lived Mom Experience</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Set aside your resume for a moment. What do you <strong>genuinely love doing for fun on a Saturday</strong>, and what <strong>personal life or motherhood chapters</strong> have you lived through that other families would love your help with?
            </p>
          </div>
        </div>

        <div class="sub-section-heading-row" id="part5AHeading">
          <h3 class="sub-section-heading" style="margin-bottom: 0;">Part A: What hobbies or everyday activities do you genuinely enjoy doing in real life? (Pick 1 to 3):</h3>
          <span class="selection-counter-pill ${isActivityLimitReached ? "max-reached" : ""}">${selectedActivities.length} of 3 selected</span>
        </div>
        ${
          state.limitNotice
            ? `<div class="selection-limit-notice" role="status">${state.limitNotice}</div>`
            : ``
        }
        <div class="options-grid options-grid-compact" style="margin-bottom: 26px;">
          ${(window.ENJOYED_ACTIVITIES || [])
            .map((act) => {
              const isSel = selectedActivities.includes(act.id);
              const isDimmed = !isSel && isActivityLimitReached;
              return `
              <div class="option-card ${isSel ? "selected" : ""} ${isDimmed ? "limit-dimmed" : ""}" data-activity="${act.id}">
                <div class="option-content">
                  <div class="option-title">${act.label || act.title || ""}</div>
                  <div class="option-sub">${act.sub || act.desc || ""}</div>
                </div>
                <div class="option-check">✓</div>
              </div>
            `;
            })
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="part5BHeading">Part B: Which personal life or motherhood chapters have you personally navigated? (Pick all that apply):</h3>
        <div class="options-grid options-grid-compact">
          ${(window.LIVED_EXPERIENCES || [])
            .map((lex) => {
              const isSel = selectedLifeExp.includes(lex.id);
              return `
              <div class="option-card ${isSel ? "selected" : ""}" data-life-exp="${lex.id}">
                <div class="option-content">
                  <div class="option-title">${lex.label || lex.title || ""}</div>
                  <div class="option-sub">${lex.sub || lex.desc || ""}</div>
                </div>
                <div class="option-check">✓</div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
    } else if (state.step === 6) {
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

      const selectedDealbreakers = state.profile.dealbreakers || [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">06</span>
          <div>
            <h2 class="step-title">Work Environment, Budget & <em>Hard Dealbreakers</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Final step before we score all 200+ business profiles for you. Filter out anything you refuse to do so your Top 3 matches truly fit.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="part6AHeading">Part A: Preferred Business Environment:</h3>
        <div class="options-grid" style="margin-bottom: 24px;">
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

        <h3 class="sub-section-heading" id="part6BHeading">Part B: Available Startup Budget:</h3>
          <div class="options-grid" style="margin-bottom: 24px;">
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

        <h3 class="sub-section-heading">Part C: Any Hard Dealbreakers? (Optional: select anything you want us to filter out):</h3>
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

        <h3 class="sub-section-heading">Part D: Optional Personal Note (Any specific degree, certification, niche, or life context we should know?):</h3>
        <div style="margin-bottom: 8px;">
          <input
            type="text"
            id="customNoteInput"
            class="form-input"
            placeholder="e.g., Former RN, CPA, bilingual in Spanish, love organizing, or have a toddler at home..."
            value="${(state.profile.customNote || "").replace(/"/g, "&quot;")}"
          />
        </div>
      `;
    }

    return `
      <div class="quiz-shell">
        <div class="progress-header">
          <div class="progress-meta">
            <span>SECTION ${state.step} OF ${state.totalQuizSteps}</span>
            <span>Target: ${fmtTargetHeaderSummary()} • ${pct}% Complete</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="quiz-body">
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
              ${
                state.step > 1
                  ? `<button type="button" class="btn-secondary" id="btnPrevStep">Back</button>`
                  : ``
              }
              <button type="button" class="btn-ghost-sm" id="btnStartOverQuiz" style="font-size: 0.82rem; color: var(--ink-muted);">
                Start Over / Clear All
              </button>
            </div>
            <button type="button" class="btn-primary" id="btnNextStep">
              ${
                state.step < state.totalQuizSteps
                  ? "Continue"
                  : `See My Top 3 Business Matches`
              }
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindQuizEvents() {
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
      document.querySelectorAll("[data-flash-preset]").forEach((btn) => {
        btn.classList.toggle("active", isFlashTimeline() && Number(btn.getAttribute("data-flash-preset")) === clean);
      });
      const headerMeta = document.querySelector(".progress-meta span:last-child");
      if (headerMeta) {
        const pct = Math.round((state.step / state.totalQuizSteps) * 100);
        headerMeta.textContent = `Target: ${fmtTargetHeaderSummary()} • ${pct}% Complete`;
      }
      saveUserProgress();
    }

    if (slider) slider.addEventListener("input", (e) => updateIncomeGoal(e.target.value, false));
    if (customInput) customInput.addEventListener("input", (e) => updateIncomeGoal(e.target.value, false));
    document.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => updateIncomeGoal(btn.getAttribute("data-preset"), true));
    });
    document.querySelectorAll("[data-flash-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.profile.timeline = "2-week flash";
        state.profile.incomeGoal = Number(btn.getAttribute("data-flash-preset")) || 1500;
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
    document.querySelectorAll("[data-timeline]").forEach((card) => {
      card.addEventListener("click", () => {
        const chosenTimeline = card.getAttribute("data-timeline");
        const wasFlash = state.profile.timeline === "2-week flash";
        if (state.profile.timeline === chosenTimeline) {
          state.profile.timeline = "";
        } else {
          state.profile.timeline = chosenTimeline;
          if (chosenTimeline === "2-week flash") {
            state.profile.incomeGoal = 1500;
          } else if (wasFlash && state.profile.incomeGoal === 1500) {
            state.profile.incomeGoal = 5000;
          }
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    // Step 2: Weekly Hours & Schedule Rhythm
    document.querySelectorAll("[data-hours]").forEach((card) => {
      card.addEventListener("click", () => {
        const val = Number(card.getAttribute("data-hours"));
        if (Number(state.profile.hoursPerWeek) === val) {
          state.profile.hoursPerWeek = 0;
          state.profile.hoursLabel = "";
        } else {
          state.profile.hoursPerWeek = val;
          state.profile.hoursLabel = card.getAttribute("data-hours-label");
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
    document.querySelectorAll("[data-rhythm]").forEach((card) => {
      card.addEventListener("click", () => {
        const val = card.getAttribute("data-rhythm");
        state.profile.scheduleRhythm = state.profile.scheduleRhythm === val ? "" : val;
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    // Step 3: Professional Backgrounds & Licensing Openness
    document.querySelectorAll("[data-bg]").forEach((card) => {
      card.addEventListener("click", () => {
        const bgId = card.getAttribute("data-bg");
        const current = state.profile.backgrounds || [];
        if (bgId === "bg-fresh") {
          state.profile.backgrounds = current.includes("bg-fresh") ? [] : ["bg-fresh"];
        } else {
          const withoutFresh = current.filter((b) => b !== "bg-fresh");
          if (withoutFresh.includes(bgId)) {
            state.profile.backgrounds = withoutFresh.filter((b) => b !== bgId);
          } else {
            state.profile.backgrounds = [...withoutFresh, bgId];
          }
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
    document.querySelectorAll("[data-licensing]").forEach((card) => {
      card.addEventListener("click", () => {
        const val = card.getAttribute("data-licensing");
        state.profile.licensingOpenness = state.profile.licensingOpenness === val ? "" : val;
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    // Step 4: 2-Part Skills Question (Core Skills + Skill Direction)
    document.querySelectorAll("[data-skill]").forEach((card) => {
      card.addEventListener("click", () => {
        const skillId = card.getAttribute("data-skill");
        const current = state.profile.skills || [];
        if (skillId === "unsure") {
          state.profile.skills = current.includes("unsure") ? [] : ["unsure"];
          state.limitNotice = "";
        } else {
          const filtered = current.filter((s) => s !== "unsure");
          if (filtered.includes(skillId)) {
            state.profile.skills = filtered.filter((s) => s !== skillId);
            state.limitNotice = "";
          } else {
            if (filtered.length >= 4) {
              state.limitNotice =
                "You can select up to 4 core skills so your recommendations stay hyper-focused. Tap any selected skill card to uncheck it if you want to swap.";
              render();
              return;
            }
            state.profile.skills = [...filtered, skillId];
            state.limitNotice = "";
          }
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
    document.querySelectorAll("[data-skill-direction]").forEach((card) => {
      card.addEventListener("click", () => {
        const val = card.getAttribute("data-skill-direction");
        state.profile.skillDirection = state.profile.skillDirection === val ? "" : val;
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    // Step 5: Activities You Enjoy + Lived Mom/Life Experience
    document.querySelectorAll("[data-activity]").forEach((card) => {
      card.addEventListener("click", () => {
        const actId = card.getAttribute("data-activity");
        const current = state.profile.enjoyedActivities || [];
        if (current.includes(actId)) {
          state.profile.enjoyedActivities = current.filter((a) => a !== actId);
          state.limitNotice = "";
        } else {
          if (current.length >= 3) {
            state.limitNotice =
              "You can select up to 3 real-life hobbies so your recommendations stay hyper-focused. Tap any selected hobby card to uncheck it if you want to swap.";
            render();
            return;
          }
          state.profile.enjoyedActivities = [...current, actId];
          state.limitNotice = "";
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
    document.querySelectorAll("[data-life-exp]").forEach((card) => {
      card.addEventListener("click", () => {
        const expId = card.getAttribute("data-life-exp");
        const current = state.profile.livedExperiences || [];
        if (current.includes(expId)) {
          state.profile.livedExperiences = current.filter((x) => x !== expId);
        } else {
          state.profile.livedExperiences = [...current, expId];
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    // Step 6: Work Environment, Startup Budget, Dealbreakers & Custom Note
    document.querySelectorAll("[data-workstyle]").forEach((card) => {
      card.addEventListener("click", () => {
        const val = card.getAttribute("data-workstyle");
        state.profile.workStyle = state.profile.workStyle === val ? "" : val;
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
    document.querySelectorAll("[data-budget]").forEach((card) => {
      card.addEventListener("click", () => {
        const val = Number(card.getAttribute("data-budget"));
        if (state.profile.budget !== null && state.profile.budget !== undefined && Number(state.profile.budget) === val) {
          state.profile.budget = null;
        } else {
          state.profile.budget = val;
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });
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

    const prevBtn = document.getElementById("btnPrevStep");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        state.validationError = "";
        state.limitNotice = "";
        state.step = Math.max(1, state.step - 1);
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const startOverQuizBtn = document.getElementById("btnStartOverQuiz");
    if (startOverQuizBtn) {
      startOverQuizBtn.addEventListener("click", () => {
        resetAssessmentAndStartOver();
      });
    }

    const nextBtn = document.getElementById("btnNextStep");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const validation = validateCurrentStep();
        if (!validation.ok) {
          state.validationError = validation.message;
          render();
          const targetEl =
            (validation.scrollSelector && document.querySelector(validation.scrollSelector)) ||
            document.getElementById("stepValidationBanner");
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        state.validationError = "";
        state.limitNotice = "";
        if (state.step < state.totalQuizSteps) {
          maybeShowStoryPopupThenAdvance(state.step, state.step + 1);
        } else {
          computeRecommendations();
          state.step = 7;
          saveUserProgress();
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
            Start Over (Clear All)
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

        try {
          await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: state.profile.firstName,
              email: state.profile.email,
              profile: state.profile,
              topIdeas: state.topMatches,
              completedTasks: state.completedTasks,
              config: {
                kitApiKey: state.config.kitApiKey,
                kitFormId: state.config.kitFormId,
                kitTagId: state.config.kitTagId
              }
            })
          });
        } catch (_) {
          if (state.config.kitApiKey && state.config.kitFormId) {
            try {
              await fetch(`https://api.convertkit.com/v3/forms/${state.config.kitFormId}/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  api_key: state.config.kitApiKey,
                  email: state.profile.email,
                  first_name: state.profile.firstName,
                  fields: {
                    currency: state.profile.currency,
                    income_goal: `${state.profile.currency} ${state.profile.incomeGoal}/mo`,
                    timeline: state.profile.timeline,
                    hours_per_week: String(state.profile.hoursPerWeek),
                    check_in_emails: state.profile.checkInCadence,
                    top_idea_1: leadRecord.topIdea1,
                    top_idea_2: leadRecord.topIdea2,
                    top_idea_3: leadRecord.topIdea3
                  }
                })
              });
            } catch (_) {}
          }
        }

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

              return `
              <div class="comparison-col ${idx === 0 ? "rank-1" : ""}">
                <div class="comparison-col-header">
                  <div class="comparison-col-top">
                    <span class="comparison-rank-tag">${compactRankLabels[idx] || `#${idx + 1} Match`}</span>
                    <span class="comparison-score-tag">${idea.matchScore || 95}% Fit</span>
                  </div>
                  <div class="comparison-idea-name" title="${(idea.name || "").replace(/"/g, "&quot;")}">${cleanShortName || idea.name}</div>
                  <div class="comparison-category">${idea.category}</div>
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

                  <button type="button" class="comparison-jump-btn" data-jump-card="idea-card-${idx}">
                    View Full Plan & Math
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

      ${renderTop3ComparisonBar()}

      ${state.topMatches.map((idea, idx) => renderSingleIdeaCard(idea, state.playbooks[idx], idx, calendlyHref)).join("")}

      ${renderRunnerUpSection(calendlyHref)}

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

      <!-- OPTIONAL PAID 1-ON-1 CONSULTATION WITH OYIN (CALENDLY) -->
      <div class="consulting-showcase" id="consultingSection">
        <div class="consulting-grid">
          <div>
            <div class="eyebrow-pill" style="background: var(--hot-pink); border-color: var(--hot-pink); color: #fff;">
              ${consulting.badge || "OPTIONAL 1-ON-1 CONSULTATION WITH OYIN"}
            </div>
            <h2 style="font-size: clamp(1.75rem, 3.4vw, 2.35rem); font-weight: 900; color: #fff; margin-bottom: 12px;">
              ${consulting.title}
            </h2>
            <p style="color: rgba(255,255,255,0.88); font-size: 1rem;">
              ${consulting.subtitle}
            </p>

            <ul class="consulting-benefits">
              ${(consulting.benefits || [])
                .map(
                  (b) => `
                <li>
                  <span style="color: var(--mint); font-weight: 900;">✓</span>
                  <span>${b}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>

          <div class="consulting-cta-box">
            <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blush); margin-bottom: 6px;">
              1-on-1 Strategy with Oyin
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #fff; margin-bottom: 10px;">
              Validate & Launch "${state.topMatches[0]?.name || "Your Top Idea"}" With Oyin
            </h3>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.84); margin-bottom: 20px;">
              Your assessment answers, ${goalFormatted}/mo target, and Top 3 matches are automatically attached to your booking so you and Oyin can dive straight into your action plan.
            </p>

            <button type="button" class="btn-pink open-calendly-btn" style="width: 100%; margin-bottom: 12px; justify-content: center;">
              ${consulting.ctaText || "Book a 1-on-1 Consultation with Oyin"}
            </button>

            <a
              href="${calendlyHref}"
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-block; color: var(--blush); font-size: 0.86rem; font-weight: 700; text-decoration: underline;"
            >
              Or open Oyin's Calendly in a new tab
            </a>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-top: 28px;">
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <button type="button" class="btn-secondary" id="btnStartFreshQuiz">
            Start Over (Clear All Answers)
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
            <span class="meta-chip">${idea.incomeModel}</span>
            <span class="meta-chip">${idea.minHoursPerWeek} to ${idea.optimalHoursPerWeek} hrs/wk</span>
            <span class="meta-chip">Ease Rating: ${idea.easeOf5k}/5</span>
            <span class="meta-chip">Buyers: ${idea.targetAudience}</span>
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
            <div class="inline-upsell-banner">
              <div style="flex: 1; min-width: 240px;">
                <div style="font-weight: 900; font-size: 1.02rem; color: var(--ink);">
                  Want 1-on-1 guidance from Oyin on "${idea.name}"?
                </div>
                <div style="font-size: 0.86rem; color: var(--ink-muted);">
                  Book an optional paid 1-on-1 consultation with Oyin to reality-check your validation plan and map out your first 30 days.
                </div>
              </div>
              <button type="button" class="btn-primary open-calendly-btn" style="padding: 11px 20px; font-size: 0.9rem;">
                Consult with Oyin
              </button>
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
  function renderGrowthQuizStep() {
    const pct = Math.round((state.growthStep / state.totalQuizSteps) * 100);
    const gp = state.growthProfile;
    const cur = getCur();
    const scaleAmt = (usdVal) => window.VaultEngine.scaleUsdToCurrency(usdVal, cur.code);
    let stepContent = "";

    if (state.growthStep === 1) {
      const targetRev = Number(gp.targetRevenue) || cur.defaultGoal || scaleAmt(6000);
      const currentRev = Number(gp.currentRevenue) || 0;
      const gap = Math.max(scaleAmt(500), targetRev - currentRev);
      const annualTarget = targetRev * 12;
      const showEarlyBridge = gp.businessType === "unsure-model" || gp.revenueStageId === "pre-revenue";

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">01</span>
          <div>
            <h2 class="step-title">Your Business, <em>Monthly Sales</em> & 90-Day Goal</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Tell us roughly what your business brings in right now and where you want to be in 90 days. If you do not track your exact numbers yet, pick the closest estimate or choose "Not Sure Yet."
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="growthPart1A">
          Part A: What type of business do you currently run?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_BUSINESS_TYPES || [])
            .map(
              (item) => `
            <div class="option-card ${gp.businessType === item.id ? "selected" : ""}" data-growth-btype="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        ${
          showEarlyBridge
            ? `
          <div class="growth-bridge-nudge-card">
            <div style="flex: 1; min-width: 240px;">
              <div style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--coral-dark); margin-bottom: 4px;">
                Helpful Note · Still Figuring Out Your Business?
              </div>
              <h4 style="margin-bottom: 4px;">Want to compare your current business against 200+ flexible ideas first?</h4>
              <p style="margin-bottom: 0;">
                You can finish this Growth Checkup to get a 30-day starter plan for your current business, OR switch to our <strong>Business Fit Assessment</strong> anytime to see which business ideas best match your skills, hours, and income goal.
              </p>
            </div>
            <button type="button" class="btn-secondary" data-switch-mode="fit" style="padding: 10px 18px; font-size: 0.85rem; white-space: nowrap;">
              Switch to Business Fit Assessment
            </button>
          </div>
        `
            : ""
        }

        <h3 class="sub-section-heading" id="growthPart1B">
          Part B: Roughly how much does your business bring in each month right now?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_REVENUE_STAGES || [])
            .map((st) => {
              const localVal = scaleAmt(st.valUsd);
              const labelAdapted = st.label.replace(/\$([0-9,]+)/g, (_, numStr) => {
                const rawNum = Number(numStr.replace(/,/g, ""));
                return fmtMoney(scaleAmt(rawNum));
              });
              const subAdapted = st.sub.replace(/\$([0-9,]+)/g, (_, numStr) => {
                const rawNum = Number(numStr.replace(/,/g, ""));
                return fmtMoney(scaleAmt(rawNum));
              });
              return `
                <div class="option-card ${gp.revenueStageId === st.id ? "selected" : ""}" data-growth-revstage="${st.id}" data-growth-revval="${localVal}">
                  <div class="option-content">
                    <div class="option-title">${labelAdapted}</div>
                    <div class="option-sub">${subAdapted}</div>
                  </div>
                  <div class="option-check">✓</div>
                </div>
              `;
            })
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="growthPart1C">
          Part C: After paying for supplies and expenses, how much do you keep as take-home profit?
        </h3>
        <div class="options-grid" style="margin-bottom: 26px;">
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

        <h3 class="sub-section-heading" id="growthPart1D">
          Part D: Choose your currency & 90-day monthly sales goal:
        </h3>
        <div class="income-showcase-box">
          <div class="currency-selector-row">
            <span class="currency-label-text">Currency:</span>
            ${(window.SUPPORTED_CURRENCIES || [])
              .map(
                (c) => `
              <button type="button" class="currency-pill ${gp.currency === c.code ? "active" : ""}" data-growth-currency="${c.code}">
                ${c.label}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="income-amount-row">
            <span class="income-big-number" id="growthTargetDisplay">${fmtMoney(targetRev)}</span>
            <span class="income-per-mo">/ month goal</span>
          </div>
          <div class="income-annual-sub" id="growthGapDisplay">
            +${fmtMoney(gap)}/mo more than your current monthly sales (<strong>${fmtMoney(annualTarget)}/year</strong> pace)
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
                (val) => `
              <button type="button" class="preset-btn ${Number(targetRev) === val ? "active" : ""}" data-growth-preset="${val}">
                ${fmtMoney(val)}/mo
              </button>
            `
              )
              .join("")}
          </div>

          <div class="custom-dollar-input-wrap">
            <span>Or type exact monthly goal: ${cur.symbol}</span>
            <input
              type="number"
              id="growthCustomTargetInput"
              class="custom-dollar-input"
              min="100"
              max="100000000"
              step="${cur.step}"
              value="${targetRev}"
            />
            <span>/mo</span>
          </div>
        </div>
      `;
    } else if (state.growthStep === 2) {
      const showOfferBridge = gp.offerStructure === "unsure-offer";
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">02</span>
          <div>
            <h2 class="step-title">What You Sell & <em>How You Price It</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Most business owners who feel stuck do not need to work longer hours. They just need simpler packages and better pricing so each sale brings in more profit.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="growthPart2A">
          Part A: How do you sell your products or services right now?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_OFFER_STRUCTURES || [])
            .map(
              (item) => `
            <div class="option-card ${gp.offerStructure === item.id ? "selected" : ""}" data-growth-offer="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        ${
          showOfferBridge
            ? `
          <div class="growth-bridge-nudge-card">
            <div style="flex: 1; min-width: 240px;">
              <div style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--coral-dark); margin-bottom: 4px;">
                Still Figuring Out What to Offer? You Have Options
              </div>
              <h4 style="margin-bottom: 4px;">We can help you create simple packages OR test new business ideas</h4>
              <p style="margin-bottom: 0;">
                Keep going below and Priority #1 of your Growth Report will show you how to create a simple 3-option package menu in 7 days. Or, if you want to explore new business ideas from scratch, switch to Business Fit anytime.
              </p>
            </div>
            <button type="button" class="btn-secondary" data-switch-mode="fit" style="padding: 10px 18px; font-size: 0.85rem; white-space: nowrap;">
              Switch to Business Fit Assessment
            </button>
          </div>
        `
            : ""
        }

        <h3 class="sub-section-heading" id="growthPart2B">
          Part B: What does a typical customer spend per order, appointment, or package?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_AVG_PRICE_TIERS || [])
            .map((t) => {
              const labelAdapted = t.label.replace(/\$([0-9,]+)/g, (_, numStr) => {
                const rawNum = Number(numStr.replace(/,/g, ""));
                return fmtMoney(scaleAmt(rawNum));
              });
              return `
                <div class="option-card ${gp.avgPriceTierId === t.id ? "selected" : ""}" data-growth-pricetier="${t.id}">
                  <div class="option-content">
                    <div class="option-title">${labelAdapted}</div>
                    <div class="option-sub">${t.sub}</div>
                  </div>
                  <div class="option-check">✓</div>
                </div>
              `;
            })
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="growthPart2C">
          Part C: How do you feel about your current prices?
        </h3>
        <div class="options-grid">
          ${(window.GROWTH_PRICE_CONFIDENCE || [])
            .map(
              (c) => `
            <div class="option-card ${gp.priceConfidence === c.id ? "selected" : ""}" data-growth-priceconf="${c.id}">
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
    } else if (state.growthStep === 3) {
      const selectedLeads = Array.isArray(gp.leadSources)
        ? gp.leadSources
        : gp.leadSource
        ? [gp.leadSource]
        : [];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">03</span>
          <div>
            <h2 class="step-title">How Customers <em>Find & Buy From You</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Let's look at how people hear about your business and what stops more of them from buying.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="growthPart3A">
          Part A: How do your paying customers find you today? (Select all that apply)
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_LEAD_SOURCES || [])
            .map(
              (item) => `
            <div class="option-card ${selectedLeads.includes(item.id) ? "selected" : ""}" data-growth-leadsource="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check multi-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="growthPart3B">
          Part B: What is your biggest frustration with getting steady sales?
        </h3>
        <div class="options-grid">
          ${(window.GROWTH_CONVERSION_ISSUES || [])
            .map(
              (item) => `
            <div class="option-card ${gp.conversionIssue === item.id ? "selected" : ""}" data-growth-conversion="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (state.growthStep === 4) {
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">04</span>
          <div>
            <h2 class="step-title">Repeat Customers & <em>Staying in Touch</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Selling again to a happy past customer is 5 times easier than convincing a stranger online. Let's look at how often buyers come back.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="growthPart4A">
          Part A: Roughly how much of your monthly sales come from repeat customers or monthly clients?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_REPEAT_RATES || [])
            .map(
              (item) => `
            <div class="option-card ${gp.repeatRateId === item.id ? "selected" : ""}" data-growth-repeat="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="growthPart4B">
          Part B: How do you stay in touch with past customers after you finish their order?
        </h3>
        <div class="options-grid">
          ${(window.GROWTH_RETENTION_SYSTEMS || [])
            .map(
              (item) => `
            <div class="option-card ${gp.retentionSystem === item.id ? "selected" : ""}" data-growth-retention="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (state.growthStep === 5) {
      const curHourChoices = [
        { val: 5, label: "Under 6 hours/week", sub: "Working in small pockets of time around kids or a day job" },
        { val: 10, label: "6 to 12 hours/week", sub: "Part-time mornings, nap blocks, or weekend sessions" },
        { val: 15, label: "12 to 20 hours/week", sub: "Steady part-time schedule across school or daycare hours" },
        { val: 25, label: "20 to 30 hours/week", sub: "Big weekly commitment, starting to feel stretched" },
        { val: 35, label: "30 to 40+ hours/week", sub: "Full-time hours; working evenings and weekends to keep up" }
      ];
      const maxHourChoices = [
        { val: 6, label: "Max 5 to 8 hours/week", sub: "Keep the business simple inside small weekly pockets" },
        { val: 12, label: "Max 10 to 15 hours/week", sub: "Ideal school-hours or part-time family schedule" },
        { val: 20, label: "Max 15 to 20 hours/week", sub: "Focused part-time schedule with afternoons and weekends off" },
        { val: 28, label: "Max 25 to 30 hours/week", sub: "Dedicated weekday schedule while keeping family evenings free" }
      ];
      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">05</span>
          <div>
            <h2 class="step-title">Protect Your <em>Time, Energy & Family Life</em></h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Our goal is to help you earn more without giving up your evenings and weekends. Tell us how many hours you work now compared to your ideal weekly limit.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="growthPart5A">
          Part A: Roughly how many hours per week are you currently working in your business?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${curHourChoices
            .map(
              (opt) => `
            <div class="option-card ${gp.currentHours !== null && gp.currentHours !== undefined && Number(gp.currentHours) === opt.val ? "selected" : ""}" data-growth-curhours="${opt.val}">
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

        <h3 class="sub-section-heading" id="growthPart5B">
          Part B: What is the MAXIMUM hours per week you want to work going forward?
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${maxHourChoices
            .map(
              (opt) => `
            <div class="option-card ${gp.maxDesiredHours !== null && gp.maxDesiredHours !== undefined && Number(gp.maxDesiredHours) === opt.val ? "selected" : ""}" data-growth-maxhours="${opt.val}">
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

        <h3 class="sub-section-heading" id="growthPart5C">
          Part C: What takes up the most time or energy in your business right now?
        </h3>
        <div class="options-grid">
          ${(window.GROWTH_DELIVERY_DRAINS || [])
            .map(
              (item) => `
            <div class="option-card ${gp.deliveryDrain === item.id ? "selected" : ""}" data-growth-drain="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (state.growthStep === 6) {
      const budgetTiers = [
        {
          val: 0,
          label: `${fmtMoney(0)} (Free Methods Only)`,
          sub: "Grow using better packages, past-customer check-ins, and local partners without spending money"
        },
        {
          val: 300,
          label: `Up to ${fmtMoney(scaleAmt(300))}/mo (Simple Tools & Samples)`,
          sub: "Cover basic booking or email tools, templates, or sample boxes for local partners"
        },
        {
          val: 1000,
          label: `${fmtMoney(scaleAmt(300))} to ${fmtMoney(scaleAmt(1000))}/mo (Starter Ads & Extra Help)`,
          sub: "Budget for starter social/Google ads, helpful software, or part-time prep and admin help"
        },
        {
          val: 3000,
          label: `${fmtMoney(scaleAmt(1000))} to ${fmtMoney(scaleAmt(3000))}/mo (Steady Ads & Part-Time Help)`,
          sub: "Ready to run regular Facebook/Instagram/Google ads, hire part-time help, or buy supplies in bulk"
        },
        {
          val: 5000,
          label: `${fmtMoney(scaleAmt(3000))} to ${fmtMoney(scaleAmt(5000))}+/mo (Full Ad Campaigns & Team)`,
          sub: "Established budget to scale paid ads, upgrade equipment and inventory, or grow a team"
        }
      ];

      stepContent = `
        <div class="step-header-row">
          <span class="step-num-editorial">06</span>
          <div>
            <h2 class="step-title">What is your <em>#1 Goal</em> for the next 30 to 90 days?</h2>
            <p class="step-desc" style="margin-bottom: 0;">
              Tell us what result would make the biggest difference for you and your family right now.
            </p>
          </div>
        </div>

        <h3 class="sub-section-heading" id="growthPart6A">
          Part A: Choose your #1 growth goal
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${(window.GROWTH_PRIMARY_GOALS || [])
            .map(
              (item) => `
            <div class="option-card ${gp.primaryGoal === item.id ? "selected" : ""}" data-growth-goal="${item.id}">
              <div class="option-content">
                <div class="option-title">${item.label}</div>
                <div class="option-sub">${item.sub}</div>
              </div>
              <div class="option-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3 class="sub-section-heading" id="growthPart6B">
          Part B: Available monthly budget for tools, marketing, or extra help
        </h3>
        <div class="options-grid" style="margin-bottom: 24px;">
          ${budgetTiers
            .map(
              (b) => `
            <div class="option-card ${gp.growthBudget === b.val ? "selected" : ""}" data-growth-budget="${b.val}">
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

        <h3 class="sub-section-heading">
          Part C (Optional): Briefly describe what you sell or your biggest challenge
        </h3>
        <input
          type="text"
          id="growthCustomNoteInput"
          class="form-input"
          placeholder="e.g., Custom party styling & balloons in Atlanta, want more weekday business clients..."
          value="${(gp.customNote || "").replace(/"/g, "&quot;")}"
          style="width: 100%;"
        />
      `;
    }

    return `
      <div class="quiz-shell">
        <div class="progress-header">
          <div class="progress-meta">
            <span>SECTION ${state.growthStep} OF ${state.totalQuizSteps}</span>
            <span>Goal: ${fmtMoney(gp.targetRevenue || scaleAmt(6000))}/mo • ${pct}% Complete</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="quiz-body">
          ${stepContent}

          ${
            state.validationError
              ? `
            <div class="step-validation-banner" id="growthStepValidationBanner" role="alert">
              <strong>Quick Check Before Continuing:</strong> ${state.validationError}
            </div>
          `
              : ""
          }

          <div class="quiz-footer">
            <div style="display: flex; align-items: center; gap: 10px;">
              ${
                state.growthStep > 1
                  ? `<button type="button" class="btn-secondary" id="btnGrowthPrev">Back</button>`
                  : ``
              }
              <button type="button" class="btn-ghost-sm" id="btnResetGrowthInline" style="font-size: 0.82rem; color: var(--ink-muted);">
                Start Over / Clear All
              </button>
            </div>
            <button type="button" class="btn-primary" id="btnGrowthNext">
              ${
                state.growthStep === state.totalQuizSteps
                  ? "See My Growth Plan & Top 3 Priorities"
                  : "Continue"
              }
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindGrowthQuizEvents() {
    const gp = state.growthProfile;

    document.querySelectorAll("[data-switch-mode]").forEach((btn) => {
      btn.onclick = () => switchToolMode(btn.getAttribute("data-switch-mode"));
    });

    document.querySelectorAll("[data-growth-currency]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newCode = btn.getAttribute("data-growth-currency");
        if (!newCode || newCode === gp.currency) return;
        const oldCur = window.VaultEngine.getCurrencyObj(gp.currency);
        const newCur = window.VaultEngine.getCurrencyObj(newCode);
        const usdTarget = (Number(gp.targetRevenue) || oldCur.defaultGoal) / (oldCur.rate || 1);
        const usdCurrent = (Number(gp.currentRevenue) || 1500) / (oldCur.rate || 1);
        gp.currency = newCode;
        state.profile.currency = newCode;
        gp.targetRevenue = window.VaultEngine.scaleUsdToCurrency(usdTarget, newCode) || newCur.defaultGoal;
        gp.currentRevenue = window.VaultEngine.scaleUsdToCurrency(usdCurrent, newCode);
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-btype]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.businessType = el.getAttribute("data-growth-btype");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-revstage]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.revenueStageId = el.getAttribute("data-growth-revstage");
        gp.currentRevenue = Number(el.getAttribute("data-growth-revval")) || 0;
        if (gp.targetRevenue <= gp.currentRevenue) {
          const cur = getCur();
          gp.targetRevenue = gp.currentRevenue + cur.step * 4;
        }
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-margin]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.profitMarginId = el.getAttribute("data-growth-margin");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

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
        gp.targetRevenue = Number(btn.getAttribute("data-growth-preset"));
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-offer]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.offerStructure = el.getAttribute("data-growth-offer");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-pricetier]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.avgPriceTierId = el.getAttribute("data-growth-pricetier");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-priceconf]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.priceConfidence = el.getAttribute("data-growth-priceconf");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

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

    document.querySelectorAll("[data-growth-conversion]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.conversionIssue = el.getAttribute("data-growth-conversion");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-repeat]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.repeatRateId = el.getAttribute("data-growth-repeat");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-retention]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.retentionSystem = el.getAttribute("data-growth-retention");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-curhours]").forEach((btn) => {
      btn.addEventListener("click", () => {
        gp.currentHours = Number(btn.getAttribute("data-growth-curhours"));
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-maxhours]").forEach((btn) => {
      btn.addEventListener("click", () => {
        gp.maxDesiredHours = Number(btn.getAttribute("data-growth-maxhours"));
        saveUserProgress();
        render();
      });
    });

    document.querySelectorAll("[data-growth-drain]").forEach((el) => {
      el.addEventListener("click", () => {
        gp.deliveryDrain = el.getAttribute("data-growth-drain");
        state.validationError = "";
        saveUserProgress();
        render();
      });
    });

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

    const resetInline = document.getElementById("btnResetGrowthInline");
    if (resetInline) {
      resetInline.addEventListener("click", () => resetAssessmentAndStartOver());
    }

    const prevBtn = document.getElementById("btnGrowthPrev");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        state.validationError = "";
        state.growthStep = Math.max(1, state.growthStep - 1);
        saveUserProgress();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const nextBtn = document.getElementById("btnGrowthNext");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const check = validateGrowthStep();
        if (!check.ok) {
          state.validationError = check.message;
          render();
          const targetEl = check.scrollSelector
            ? document.querySelector(check.scrollSelector)
            : document.getElementById("growthStepValidationBanner");
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        state.validationError = "";
        const completedStep = state.growthStep;
        if (state.growthStep < state.totalQuizSteps) {
          maybeShowGrowthStoryPopupThenAdvance(completedStep, state.growthStep + 1);
        } else {
          state.growthAnalysis = window.GrowthEngine.analyzeBusiness(state.growthProfile);
          state.growthStep = 7;
          saveUserProgress();
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  }

  function renderGrowthEmailGate() {
    if (!state.growthAnalysis && window.GrowthEngine) {
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
            Start Over (Clear All)
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
        const leadRecord = {
          timestamp: new Date().toISOString(),
          firstName: gp.firstName,
          email: gp.email,
          currency: gp.currency,
          incomeGoal: gp.targetRevenue,
          timeline: "30-Day Growth Plan",
          hoursPerWeek: gp.maxDesiredHours,
          budget: gp.growthBudget,
          skills: `Growth: ${gp.businessType} (Current: ${gp.currentRevenue}/mo)`,
          workStyle: gp.offerStructure,
          checkInCadence: gp.checkInCadence,
          topIdea1: `[Bottleneck] ${analysis.primaryBottleneck?.title || ""}`,
          topIdea2: analysis.priorities?.[0]?.shortLabel || "",
          topIdea3: analysis.priorities?.[1]?.shortLabel || "",
          completedTasksCount: state.completedTasks.length
        };
        saveLeadToBrowserStorage(leadRecord);

        try {
          await fetch("/api/subscribe", {
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
                kitApiKey: state.config.kitApiKey,
                kitFormId: state.config.kitFormId,
                kitTagId: state.config.kitTagId
              }
            })
          });
        } catch (_) {}

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
            <div class="inline-upsell-banner">
              <div style="flex: 1; min-width: 240px;">
                <div style="font-weight: 900; font-size: 1.02rem; color: var(--ink);">
                  Want personal help setting up your packages and pricing with Oyin?
                </div>
                <div style="font-size: 0.86rem; color: var(--ink-muted);">
                  Book an optional paid 1-on-1 session with Oyin to map out your packages, prices, and 30-day growth plan together.
                </div>
              </div>
              <button type="button" class="btn-primary open-calendly-btn" style="padding: 11px 20px; font-size: 0.9rem;">
                Consult with Oyin
              </button>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  function renderGrowthResultsDashboard() {
    if (!state.growthAnalysis && window.GrowthEngine) {
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
          <span class="summary-badge">${bTypeObj.label}</span>
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

      <!-- 2. HONEST MODEL CHECK / BRIDGE TO BUSINESS FIT -->
      <div class="growth-bridge-nudge-card" style="margin-bottom: 28px; ${analysis.needsBusinessFitBridge ? "border-width: 2.5px;" : ""}">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; width: 100%;">
          <div style="flex: 1; min-width: 260px;">
            <div style="font-size: 0.76rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: var(--coral-dark); margin-bottom: 4px;">
              ${
                analysis.needsBusinessFitBridge
                  ? "Important Check · Fix This Business or Try a Better-Fitting Idea"
                  : "Optional Check · Compare Against 200+ Business Ideas"
              }
            </div>
            <h4 style="font-size: 1.1rem; margin-bottom: 6px;">
              ${
                analysis.needsBusinessFitBridge
                  ? "Should you fix this business or test an easier, higher-profit idea in Business Fit?"
                  : "Curious how your current business compares to other flexible ideas for your skills?"
              }
            </h4>
            <p style="margin-bottom: 0;">
              ${
                analysis.needsBusinessFitBridge
                  ? analysis.bridgeReason
                  : "If you ever feel like your current business works against your family schedule, you can run your skills and hours through our Business Fit tool right alongside this Growth Plan."
              }
            </p>
          </div>
          <button type="button" class="btn-secondary" data-switch-mode="fit" style="white-space: nowrap;">
            Switch to Business Fit Assessment
          </button>
        </div>
      </div>

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

      <!-- 6. PAID 1-ON-1 GROWTH CONSULTATION WITH OYIN SHOWCASE -->
      <div class="consulting-showcase">
        <div class="consulting-grid">
          <div>
            <div class="eyebrow-pill" style="background: var(--hot-pink); border-color: var(--hot-pink); color: #fff;">
              1-ON-1 BUSINESS GROWTH SESSION · OPTIONAL PAID SUPPORT
            </div>
            <h2 style="font-size: clamp(1.75rem, 3.4vw, 2.35rem); font-weight: 900; color: #fff; margin-bottom: 12px;">
              Map Out Your Packages, Pricing & Next 30 Days With Oyin
            </h2>
            <p style="color: rgba(255,255,255,0.88); font-size: 1rem;">
              You do not have to figure out your next stage of growth by yourself. In a focused 1-on-1 strategy session, Oyin will look at what you currently sell, help you price your packages for real profit, and walk you through your 30-day plan step by step.
            </p>
            <ul class="consulting-benefits">
              <li>
                <span style="color: var(--mint); font-weight: 900;">✓</span>
                <span><strong>Better Packages & Pricing:</strong> Turn low-profit custom orders into simple 3-option packages, bundles, or monthly plans.</span>
              </li>
              <li>
                <span style="color: var(--mint); font-weight: 900;">✓</span>
                <span><strong>Steady Customers & Repeat Sales:</strong> Set up your past-customer check-in, local partner referrals, or paid ads plan.</span>
              </li>
              <li>
                <span style="color: var(--mint); font-weight: 900;">✓</span>
                <span><strong>Time-Saving Routine:</strong> Simplify your booking link, boundaries, and weekly work blocks to stay under ${m.maxDesiredHours} hrs/week.</span>
              </li>
            </ul>
          </div>

          <div class="consulting-cta-box">
            <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blush); margin-bottom: 6px;">
              1-on-1 Strategy Session with Oyin
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #fff; margin-bottom: 10px;">
              Ready to Add +${fmtMoney(m.revenueGap)}/Mo?
            </h3>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.84); margin-bottom: 20px;">
              Your growth report, current sales (${fmtMoney(m.currentRev)}/mo), and 30-day plan are automatically shared with Oyin when you book.
            </p>
            <button type="button" class="btn-pink open-calendly-btn" style="width: 100%; margin-bottom: 12px; justify-content: center;">
              Book a 1-on-1 Consultation with Oyin
            </button>
            <a
              href="${calendlyHref}"
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-block; color: var(--blush); font-size: 0.86rem; font-weight: 700; text-decoration: underline;"
            >
              Or open Oyin's Calendly in a new tab
            </a>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-top: 28px;">
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <button type="button" class="btn-secondary" id="btnStartFreshGrowthQuiz">
            Start Over (Clear All Answers)
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
    document.getElementById("cfgKitFormId").value = state.config.kitFormId || "";
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
    }

    document.querySelectorAll("[data-switch-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchToolMode(btn.getAttribute("data-switch-mode"));
      });
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
        resetAssessmentAndStartOver();
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
        state.config.kitFormId = document.getElementById("cfgKitFormId").value.trim();
        state.config.kitApiKey = document.getElementById("cfgKitApiKey").value.trim();
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
