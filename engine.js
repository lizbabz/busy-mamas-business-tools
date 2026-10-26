/**
 * ============================================================================
 * BUSINESS FIT BY BUSY MAMAS - SCORING & ACTION PLAN ENGINE (engine.js)
 * ============================================================================
 */

window.VaultEngine = {
  getCurrencyObj(code) {
    const list = window.SUPPORTED_CURRENCIES || [];
    return list.find((c) => c.code === code) || list[0] || { code: "USD", symbol: "$", rate: 1 };
  },

  formatMoney(amountInSelectedCurrency, currencyCode) {
    const cur = this.getCurrencyObj(currencyCode);
    const rounded = Math.round(Number(amountInSelectedCurrency) || 0);
    return `${cur.symbol}${rounded.toLocaleString()}`;
  },

  scaleUsdToCurrency(amount, currencyCode) {
    return Math.round(Number(amount) || 0);
  },

  /**
   * Score and rank all vault ideas for a user's assessment profile
   */
  rankIdeas(ideas, profile) {
    const currencyCode = profile.currency || "USD";
    const cur = this.getCurrencyObj(currencyCode);
    const rawIncomeGoal = Number(profile.incomeGoal) || cur.defaultGoal || 5000;
    const incomeGoalUsd = rawIncomeGoal / (cur.rate || 1);

    const weeklyHours = Number(profile.hoursPerWeek) || 8;
    const scheduleRhythm = profile.scheduleRhythm || "flexible-mix";
    const backgrounds = Array.isArray(profile.backgrounds) ? profile.backgrounds : [];
    const licensingOpenness = profile.licensingOpenness || "open-licensed";
    const selectedSkills = Array.isArray(profile.skills) ? profile.skills : [];
    const skillDirection = profile.skillDirection || "blend-both";
    const enjoyedActivities = Array.isArray(profile.enjoyedActivities) ? profile.enjoyedActivities : [];
    const livedExperiences = Array.isArray(profile.livedExperiences) ? profile.livedExperiences : [];
    const dealbreakers = Array.isArray(profile.dealbreakers) ? profile.dealbreakers : [];
    const customNote = String(profile.customNote || "").toLowerCase();
    const workStylePref = profile.workStyle || "any";
    const maxBudgetUsd = Number(profile.budget ?? 100);
    const timelinePref = profile.timeline || "1 to 3 months";

    const formattedGoal = this.formatMoney(rawIncomeGoal, currencyCode);
    const goalDisplay = timelinePref === "2-week flash" ? `${formattedGoal} in 14 Days` : `${formattedGoal}/mo`;

    // Build domain skill sets from each assessment section
    const isUnsureSkills = selectedSkills.length === 0 || selectedSkills.includes("unsure");
    const directSkillSet = new Set(selectedSkills.filter((s) => s !== "unsure"));

    const bgSkillSet = new Set();
    const selectedBgObjs = (window.PROFESSIONAL_BACKGROUNDS || []).filter((bg) => backgrounds.includes(bg.id));
    selectedBgObjs.forEach((bg) => {
      (bg.mappedSkills || []).forEach((s) => bgSkillSet.add(s));
    });

    const activitySkillSet = new Set();
    const selectedActObjs = (window.ENJOYED_ACTIVITIES || []).filter((act) => enjoyedActivities.includes(act.id));
    selectedActObjs.forEach((act) => {
      (act.mappedSkills || []).forEach((s) => activitySkillSet.add(s));
    });

    const lifeSkillSet = new Set();
    const selectedLifeObjs = (window.LIVED_EXPERIENCES || []).filter((le) => livedExperiences.includes(le.id));
    selectedLifeObjs.forEach((le) => {
      (le.mappedSkills || []).forEach((s) => lifeSkillSet.add(s));
    });

    const hasSpecificDomainSelections =
      directSkillSet.size > 0 || bgSkillSet.size > 0 || activitySkillSet.size > 0;

    const scored = ideas.map((idea) => {
      let score = 0;
      const reasons = [];
      const ideaSkills = Array.isArray(idea.skills) ? idea.skills : [];
      const ideaText = `${idea.name} ${idea.category} ${idea.description} ${(idea.requirements || []).join(" ")}`.toLowerCase();
      const model = idea.businessModel || window.inferBusinessModel(`${idea.name} ${idea.category}`);

      let domainMatchCount = 0;

      // 1. CORE SKILLS & SKILL DIRECTION (0 to 38 pts)
      const matchingDirectSkills = ideaSkills.filter((s) => directSkillSet.has(s));
      const directSkillMultiplier =
        skillDirection === "monetize-existing" ? 1.45 : skillDirection === "fresh-pivot" ? 0.55 : 1.15;

      if (isUnsureSkills) {
        score += 14 + (idea.easeOf5k || 4);
      } else if (matchingDirectSkills.length > 0) {
        domainMatchCount += matchingDirectSkills.length * 2;
        const primarySkillMatch = ideaSkills[0] && directSkillSet.has(ideaSkills[0]);
        const rawSkillPts = (primarySkillMatch ? 24 : 17) + Math.min(8, (matchingDirectSkills.length - 1) * 6);
        score += Math.round(rawSkillPts * directSkillMultiplier);

        const skillLabels = matchingDirectSkills
          .map((id) => (window.SKILL_CATEGORIES.find((c) => c.id === id) || {}).label || id)
          .map((l) => l.split(",")[0].split("&")[0].trim());
        if (skillDirection !== "fresh-pivot") {
          reasons.unshift(`Directly leverages your strengths in ${skillLabels.join(" & ")}`);
        }
      }

      // 2. PROFESSIONAL BACKGROUND & LICENSING ALIGNMENT (0 to 26 pts)
      let bgMatchedLabel = "";
      const matchingBgSkills = ideaSkills.filter((s) => bgSkillSet.has(s));
      selectedBgObjs.forEach((bg) => {
        const kwMatch = (bg.keywords || []).some((kw) => kw.length > 3 && ideaText.includes(kw.toLowerCase()));
        const skillMatch = (bg.mappedSkills || []).some((s) => ideaSkills.includes(s));
        if (kwMatch || skillMatch) {
          bgMatchedLabel = (bg.label || "").split(",")[0].trim();
        }
      });

      const bgMultiplier =
        skillDirection === "monetize-existing" ? 1.4 : skillDirection === "fresh-pivot" ? 0.6 : 1.1;

      if (bgMatchedLabel || matchingBgSkills.length > 0) {
        domainMatchCount += 1;
        const rawBgPts = matchingBgSkills.length > 0 && bgMatchedLabel ? 18 : 13;
        score += Math.round(rawBgPts * bgMultiplier);
        if (bgMatchedLabel && skillDirection !== "fresh-pivot") {
          reasons.push(`Built-in advantage from your ${bgMatchedLabel} background`);
        }
      }

      // 3. ENJOYED DAY-TO-DAY ACTIVITIES & LIVED EXPERIENCE (0 to 48 pts)
      const matchedActivityLabels = [];
      const matchingActSkills = ideaSkills.filter((s) => activitySkillSet.has(s));
      selectedActObjs.forEach((act) => {
        const kwMatch = (act.keywords || []).some((kw) => kw.length > 3 && ideaText.includes(kw.toLowerCase()));
        const skillMatch = (act.mappedSkills || []).some((s) => ideaSkills.includes(s));
        if (kwMatch || skillMatch) {
          matchedActivityLabels.push(act.label || "");
        }
      });

      const actMultiplier =
        skillDirection === "fresh-pivot" ? 1.7 : skillDirection === "monetize-existing" ? 1.4 : 1.55;

      if (matchedActivityLabels.length > 0 || matchingActSkills.length > 0) {
        domainMatchCount += 2;
        const primaryActMatch = ideaSkills[0] && activitySkillSet.has(ideaSkills[0]);
        const multiActBonus = Math.min(8, Math.max(0, matchedActivityLabels.length - 1) * 5);
        const rawActPts = (primaryActMatch ? 22 : 15) + multiActBonus;
        score += Math.round(rawActPts * actMultiplier);
        if (matchedActivityLabels[0]) {
          reasons.push(`Matches the real-life activities you enjoy (${matchedActivityLabels[0].split(",")[0].toLowerCase()})`);
        }
      }

      let matchedLifeLabel = "";
      const matchingLifeSkills = ideaSkills.filter((s) => lifeSkillSet.has(s));
      selectedLifeObjs.forEach((le) => {
        const kwMatch = (le.keywords || []).some((kw) => kw.length > 3 && ideaText.includes(kw.toLowerCase()));
        if (kwMatch) {
          matchedLifeLabel = (le.label || "").split(",")[0].trim();
        }
      });

      if (matchedLifeLabel || matchingLifeSkills.length > 0) {
        domainMatchCount += 1;
        const primaryLifeMatch = ideaSkills[0] && lifeSkillSet.has(ideaSkills[0]);
        score += (skillDirection === "fresh-pivot" ? 16 : 12) + (primaryLifeMatch ? 6 : 0);
        if (matchedLifeLabel) {
          reasons.push(`Connects with your lived experience in ${matchedLifeLabel}`);
        }
      }

      // CROSS-SECTION SWEET-SPOT CONVERGENCE BONUS:
      // When an idea's domain is reinforced in BOTH Section 04 (Skills) AND Section 05 (Hobbies / Lived Experiences),
      // it represents the user's true Skill + Passion intersection and should rise to the very top.
      const primarySkill = ideaSkills[0] || "";
      const hasPrimarySkill = primarySkill && directSkillSet.has(primarySkill);
      const hasPrimaryHobby = primarySkill && (activitySkillSet.has(primarySkill) || matchedActivityLabels.length > 0);
      const hasPrimaryLife = primarySkill && (lifeSkillSet.has(primarySkill) || Boolean(matchedLifeLabel));

      if (hasPrimarySkill && hasPrimaryHobby) {
        score += 24;
        reasons.unshift("Sweet-spot match: combines your core skills with the real-life interests you enjoy most");
      } else if (matchingDirectSkills.length > 0 && (matchingActSkills.length > 0 || matchedActivityLabels.length > 0)) {
        score += 14;
      }
      if (hasPrimarySkill && hasPrimaryLife) {
        score += 12;
      }

      // Custom note keyword boost
      if (customNote.length > 2) {
        const noteWords = customNote.split(/\W+/).filter((w) => w.length > 3);
        if (noteWords.some((w) => ideaText.includes(w))) {
          domainMatchCount += 2;
          score += 18;
          reasons.unshift("Tailored to the specific background or niche note you shared");
        }
      }

      // STRICT DOMAIN RELEVANCE GUARDRAIL:
      // Never allow an unrelated business (e.g. Grant Writer for a Baker) to rank near the top,
      // while always allowing ideas that match EITHER the user's chosen Skills OR their chosen Hobbies.
      if (hasSpecificDomainSelections) {
        if (skillDirection === "fresh-pivot") {
          if (matchingActSkills.length === 0 && matchedActivityLabels.length === 0 && !matchedLifeLabel) {
            score -= 48;
          }
        } else {
          if (domainMatchCount === 0) {
            score -= 55;
          }
        }
      }

      // Licensing check
      const requiresExamLicense =
        ideaText.includes("state exam") ||
        ideaText.includes("nmls") ||
        ideaText.includes("life & health insurance") ||
        idea.id === "idea-1" ||
        idea.id === "idea-2";

      if (requiresExamLicense) {
        if (licensingOpenness === "open-licensed" && !dealbreakers.includes("no-licensing")) {
          if (domainMatchCount > 0) {
            score += 6;
            reasons.push("Matches your openness to high-commission licensed professions");
          }
        } else if (licensingOpenness === "no-licensing" || dealbreakers.includes("no-licensing")) {
          score -= 40;
        } else {
          score -= 8;
        }
      } else if (licensingOpenness === "no-licensing" && (idea.startupCost || 0) === 0) {
        score += 3;
      }

      // 4. WEEKLY HOURS & SCHEDULE RHYTHM FIT (0 to 14 pts)
      if (weeklyHours >= idea.optimalHoursPerWeek) {
        score += 8;
      } else if (weeklyHours >= idea.minHoursPerWeek) {
        score += 6;
      } else {
        const deficit = idea.minHoursPerWeek - weeklyHours;
        score += Math.max(1, 5 - deficit * 2);
      }

      if (scheduleRhythm === "nap-pockets") {
        if (idea.workStyle === "behind-the-scenes" || idea.workStyle === "both" || model === "digital-product" || model === "physical-product") {
          score += 6;
          reasons.push("Flexible workflow that fits around nap-time and evening pockets");
        } else if (model === "local-service" || idea.workStyle === "client-facing") {
          score -= 8;
        }
      } else if (scheduleRhythm === "weekends-evenings") {
        if (model === "local-service" || model === "physical-product" || idea.workStyle === "behind-the-scenes" || idea.workStyle === "both") {
          score += 6;
          reasons.push("Works well on Saturdays, Sundays, and evening blocks");
        }
      } else if (scheduleRhythm === "weekday-blocks") {
        score += 5;
      } else {
        score += 4;
      }

      // 5. CUSTOM INCOME GOAL & TIMELINE ALIGNMENT (Only boosts ideas that fit the user's domain!)
      const baseEaseScore = (idea.easeOf5k || 4) * 1.5;
      let goalFitScore = 0;
      const ideaCeilingUsd = idea.maxMonthlyIncomePotential || 10000;

      if (timelinePref === "2-week flash") {
        if (idea.easeOf5k >= 4 && !requiresExamLicense && model !== "digital-product") {
          goalFitScore += domainMatchCount > 0 ? 10 : 2;
          reasons.push(`Fast-launch offer capable of generating ${goalDisplay} via presales, deposits, or starter bookings`);
        } else if (requiresExamLicense || model === "digital-product") {
          goalFitScore -= 10;
        }
      } else if (incomeGoalUsd <= 3500) {
        goalFitScore = idea.easeOf5k >= 4 ? 6 : 4;
        reasons.push(`Realistic path to your ${goalDisplay} target in ${weeklyHours} hrs/week`);
      } else if (incomeGoalUsd <= 6500) {
        goalFitScore = idea.easeOf5k >= 4 ? 7 : 4.5;
        reasons.push(`Rated ${idea.easeOf5k}/5 in the Vault for speed and ease of reaching ${goalDisplay}`);
      } else {
        if (ideaCeilingUsd >= incomeGoalUsd) {
          goalFitScore += 8;
        } else {
          goalFitScore += Math.max(1, 5 - (incomeGoalUsd - ideaCeilingUsd) / 4000);
        }
        if (model === "licensed-advisory" || (idea.avgUnitRevenue || 0) >= 600) {
          goalFitScore += 3;
        }
        reasons.push(`High-ceiling revenue model capable of scaling to ${goalDisplay}`);
      }
      score += baseEaseScore + goalFitScore;

      // 6. WORK ENVIRONMENT, BUDGET & HARD DEALBREAKER FILTERING
      if (workStylePref === "any" || idea.workStyle === "both" || idea.workStyle === workStylePref) {
        score += 5;
      } else {
        score -= 4;
      }

      if ((idea.startupCost || 0) <= maxBudgetUsd) {
        score += 3;
      } else {
        score -= 5;
      }

      // If the user is targeting a high monthly income ($10k to $25k+/mo) AND has capital to invest ($1,000+),
      // reward businesses with higher unit revenue, equipment/suite barriers to entry, or scalable B2B/licensed models
      if (incomeGoalUsd >= 10000 && maxBudgetUsd >= 1000) {
        if ((idea.maxMonthlyIncomePotential || 0) >= incomeGoalUsd && ((idea.startupCost || 0) >= 150 || (idea.avgUnitRevenue || 0) >= 650 || model === "licensed-advisory")) {
          score += 5;
        }
      }

      // Enforce Hard Dealbreakers
      if (dealbreakers.includes("no-driving") && model === "local-service" && idea.workStyle !== "both") {
        score -= 40;
      }
      if (dealbreakers.includes("no-inventory") && (model === "physical-product" || idea.id === "idea-8")) {
        score -= 40;
      }
      if (dealbreakers.includes("no-live-calls") && idea.workStyle === "client-facing" && model !== "local-service") {
        score -= 32;
      }
      if (dealbreakers.includes("no-cold-calling") && (idea.id === "idea-5" || idea.id === "idea-6" || idea.id === "idea-18")) {
        score -= 25;
      }
      if (dealbreakers.includes("no-social-video") && (model === "service" || model === "licensed-advisory" || model === "digital-product")) {
        reasons.push("Can be grown through direct referrals, search, or local partners without filming social media videos");
      }

      // Deduplicate reasons while preserving priority
      const uniqueReasons = [];
      reasons.forEach((r) => {
        if (r && !uniqueReasons.includes(r)) uniqueReasons.push(r);
      });

      return {
        ...idea,
        rawScore: score,
        matchScore: 0,
        matchReasons: uniqueReasons.slice(0, 4)
      };
    });

    scored.sort((a, b) => {
      if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
      if (b.easeOf5k !== a.easeOf5k) return b.easeOf5k - a.easeOf5k;
      return (b.maxMonthlyIncomePotential || 0) - (a.maxMonthlyIncomePotential || 0);
    });

    // TOP-3 DOMAIN DIVERSITY PASS:
    // When a user selects 2 or more distinct domains across Skills (Section 04) and Interests (Section 05),
    // prevent a single domain (e.g., two Marketing ideas) from taking multiple Top-3 slots while another
    // domain the user explicitly chose (e.g., Home Decor & Styling) is left out of the Top 3.
    const activeChosenDomains = new Set([...directSkillSet, ...activitySkillSet]);
    if (activeChosenDomains.size >= 2 && scored.length > 3) {
      const top3 = [];
      const usedPrimaryDomains = new Set();
      const usedIds = new Set();

      for (const candidate of scored) {
        if (top3.length >= 3) break;
        const primaryDom = (candidate.skills && candidate.skills[0]) || candidate.category;
        if (!usedPrimaryDomains.has(primaryDom) && activeChosenDomains.has(primaryDom)) {
          top3.push(candidate);
          usedPrimaryDomains.add(primaryDom);
          usedIds.add(candidate.id);
        }
      }

      // Ensure at least one match from the user's Section 05 Enjoyed Activities is represented in the Top 3
      if (activitySkillSet.size > 0 && !top3.some((item) => item.skills && item.skills.some((s) => activitySkillSet.has(s)))) {
        const bestHobbyMatch = scored.find(
          (c) => !usedIds.has(c.id) && c.skills && c.skills.some((s) => activitySkillSet.has(s)) && c.rawScore >= 40
        );
        if (bestHobbyMatch && top3.length === 3) {
          usedIds.delete(top3[2].id);
          top3[2] = bestHobbyMatch;
          usedIds.add(bestHobbyMatch.id);
        } else if (bestHobbyMatch && top3.length < 3) {
          top3.push(bestHobbyMatch);
          usedIds.add(bestHobbyMatch.id);
        }
      }

      // Fill any remaining Top-3 slots with the highest-scoring remaining ideas
      for (const candidate of scored) {
        if (top3.length >= 3) break;
        if (!usedIds.has(candidate.id)) {
          top3.push(candidate);
          usedIds.add(candidate.id);
        }
      }

      const remainingAfterTop3 = scored.filter((c) => !usedIds.has(c.id));
      // For Runner-Up slots #4 and #5, prioritize any remaining unrepresented user-chosen domains first
      const runnerUps = [];
      for (const candidate of remainingAfterTop3) {
        if (runnerUps.length >= 2) break;
        const primaryDom = (candidate.skills && candidate.skills[0]) || candidate.category;
        if (!usedPrimaryDomains.has(primaryDom) && activeChosenDomains.has(primaryDom) && candidate.rawScore >= 40) {
          runnerUps.push(candidate);
          usedPrimaryDomains.add(primaryDom);
          usedIds.add(candidate.id);
        }
      }
      for (const candidate of remainingAfterTop3) {
        if (runnerUps.length >= 2) break;
        if (!usedIds.has(candidate.id)) {
          runnerUps.push(candidate);
          usedIds.add(candidate.id);
        }
      }

      const rest = scored.filter((c) => !usedIds.has(c.id));
      scored.splice(0, scored.length, ...top3, ...runnerUps, ...rest);
    }

    // Calibrate matchScore across the sorted list so #1 is the clear highest match
    // and #2, #3, #4, and #5 show realistic, strictly descending fit percentages.
    const topRaw = scored.length > 0 ? scored[0].rawScore : 90;
    const topCalibrated =
      topRaw >= 115
        ? 98
        : topRaw >= 100
        ? 97
        : topRaw >= 88
        ? 95
        : topRaw >= 78
        ? 93
        : Math.max(82, Math.min(92, Math.round(topRaw)));

    scored.forEach((item, idx) => {
      if (idx === 0) {
        item.matchScore = topCalibrated;
      } else {
        const prevScore = scored[idx - 1].matchScore;
        const rawGapFromPrev = Math.max(0, scored[idx - 1].rawScore - item.rawScore);
        // Ensure a visible, meaningful step-down between #1, #2, #3, #4, and #5
        const minStepDown = idx <= 2 ? 4 : 3;
        const maxStepDown = idx <= 2 ? 7 : 5;
        const calculatedDrop = Math.min(
          maxStepDown,
          Math.max(minStepDown, Math.round(rawGapFromPrev * 0.35) + 3)
        );
        item.matchScore = Math.max(60, prevScore - calculatedDrop);
      }
    });

    return scored;
  },

  /**
   * Build custom Income Math, Requirements/Tradeoffs, 7-Day Validation Test,
   * and Timeline-Aware Action Plan for an idea.
   */
  buildPlaybook(idea, profile, rankIndex) {
    const currencyCode = profile.currency || "USD";
    const cur = this.getCurrencyObj(currencyCode);
    const incomeGoal = Number(profile.incomeGoal) || cur.defaultGoal || 5000;
    const weeklyHours = Number(profile.hoursPerWeek) || 8;
    const timeline = profile.timeline || "1 to 3 months";
    const model = idea.businessModel || window.inferBusinessModel(`${idea.name} ${idea.category}`);

    const fmt = (val) => this.formatMoney(val, currencyCode);
    const goalFormatted = fmt(incomeGoal);

    const phaseLabels =
      timeline === "2-week flash"
        ? ["Days 1 to 5 (Fast Launch)", "Days 6 to 14 (First $1,500+ Cash Flow)", "Days 15 to 60 (Scale to Full Monthly Goal)"]
        : timeline === "1 to 3 months"
        ? ["Month 1 (Days 1 to 30)", "Month 2 (Days 31 to 60)", "Month 3 (Days 61 to 90)"]
        : timeline === "6 to 12 months"
        ? ["Months 1 to 2 (Foundation & Licensing)", "Months 3 to 5 (Momentum)", "Months 6 to 12 (Full Target)"]
        : ["Months 1 to 2 (Days 1 to 45)", "Months 3 to 4 (Days 46 to 90)", "Months 5 to 6 (Full Target)"];

    const flashTarget = this.scaleUsdToCurrency(1500, currencyCode);
    const milestone1 =
      timeline === "2-week flash"
        ? Math.min(incomeGoal, flashTarget)
        : Math.min(incomeGoal, Math.round((incomeGoal * 0.25) / (cur.step || 50)) * (cur.step || 50) || Math.round(incomeGoal * 0.25));
    const milestone2 = Math.min(incomeGoal, Math.round((incomeGoal * 0.6) / (cur.step || 50)) * (cur.step || 50) || Math.round(incomeGoal * 0.6));
    const milestone3 = incomeGoal;

    const basePriceScaled = this.scaleUsdToCurrency(idea.avgUnitRevenue || 100, currencyCode);
    const unitLabel = idea.unitLabel || "sales / bookings";

    let pathA = {};
    let pathB = {};
    let testSteps = [];
    let outreachScript = "";
    let validationMetric = "";
    let phases = [];

    if (model === "licensed-advisory") {
      // Financial Advisor, Mortgage Loan Originator, Senior Care Placement, Recruiting, Gov Contracting
      const avgCommission = basePriceScaled;
      const dealsNeededA = Math.max(1, Math.ceil(incomeGoal / avgCommission));
      const largerCommission = Math.round((avgCommission * 2.2) / (cur.step || 50)) * (cur.step || 50) || Math.round(avgCommission * 2.2);
      const dealsNeededB = Math.max(1, Math.ceil(incomeGoal / largerCommission));

      pathA = {
        title: "Option A: Standard Individual / Family Transactions",
        formula: `${dealsNeededA} ${unitLabel}/mo x ${fmt(avgCommission)} avg commission = ${fmt(dealsNeededA * avgCommission)}/mo`,
        timeBreakdown: `High revenue per transaction means you only need ${dealsNeededA} closed client(s) per month inside your ${weeklyHours} hrs/week schedule`
      };
      pathB = {
        title: "Option B: Business Owner / Rollover / Multi-Policy Clients",
        formula: `${dealsNeededB} larger client cases/mo x ${fmt(largerCommission)} = ${fmt(dealsNeededB * largerCommission)}/mo`,
        timeBreakdown: `Focusing on rollovers, business owners, or multi-unit contracts scales toward six figures without adding extra hours`
      };

      testSteps = [
        {
          id: `${idea.id}-test-1`,
          day: "Days 1 to 2",
          title: "Verify Licensing Steps & Interview 2 Sponsoring Brokerages / Agencies",
          detail: `Look up your state's exact exam/registration process and speak with 2 independent agencies to confirm their training, contract splits, and lead support.`
        },
        {
          id: `${idea.id}-test-2`,
          day: "Days 3 to 5",
          title: "Identify Your First 15 Warm Prospects or Referral Partners",
          detail: `${idea.quickTestStrategy} Build a list of 15 families, professionals, or local referral partners (CPAs, realtors, estate attorneys, HR managers).`
        },
        {
          id: `${idea.id}-test-3`,
          day: "Days 6 to 7",
          title: "Enroll in Pre-Licensing / Registration & Book 3 Practice Reviews",
          detail: `Start your study modules (or partner with a licensed mentor on joint split cases while you finish licensing so you can earn on referrals immediately).`
        }
      ];

      outreachScript = `Hi [Name]! I'm expanding into [${idea.name}] working alongside an experienced team helping [${idea.targetAudience}]. We are offering complimentary 15-minute reviews this month to show families/businesses how to [protect assets / save on costs / fill key roles]. Would you be open to a quick review or referral chat next week?`;
      validationMetric = `Sponsoring agency/registration selected + 15 warm contacts or referral partners mapped + first 3 consultation appointments booked.`;

      phases = [
        {
          phase: phaseLabels[0],
          title: `Stage 1: Licensing, Mentor Split Cases & First ${fmt(milestone1)}`,
          focus: idea.first30DaysFocus,
          tasks: [
            { id: `${idea.id}-p1-1`, text: `Complete your required state exam, certification, or vendor registration.` },
            { id: `${idea.id}-p1-2`, text: `Shadow a senior partner on your first 3 to 5 client consultations (many agencies let you split commissions while training).` },
            { id: `${idea.id}-p1-3`, text: `Close your first 1 to 2 client cases to reach ${fmt(milestone1)}.` }
          ]
        },
        {
          phase: phaseLabels[1],
          title: `Stage 2: Referral Partner Pipeline & ${fmt(milestone2)}/mo`,
          focus: `Build a repeatable referral loop with professionals who already serve ${idea.targetAudience}.`,
          tasks: [
            { id: `${idea.id}-p2-1`, text: `Partner with 5 complementary pros (CPAs, realtors, attorneys, or practice managers) who send you 1 to 2 warm introductions a month.` },
            { id: `${idea.id}-p2-2`, text: `Host a monthly 20-minute educational workshop (online or local) for 10 to 15 attendees.` },
            { id: `${idea.id}-p2-3`, text: `Consistently close ${Math.max(1, Math.ceil(dealsNeededA * 0.6))} cases per month.` }
          ]
        },
        {
          phase: phaseLabels[2],
          title: `Stage 3: Scale to ${fmt(milestone3)}/mo Inside ${weeklyHours} Hrs/Week`,
          focus: `Close ${dealsNeededB} to ${dealsNeededA} ${unitLabel} per month and stack renewal/repeat commissions.`,
          tasks: [
            { id: `${idea.id}-p3-1`, text: `Conduct annual client check-ins to generate repeat business and family referrals.` },
            { id: `${idea.id}-p3-2`, text: `Focus on higher-value cases (${fmt(largerCommission)}+) so you hit ${goalFormatted}/mo in fewer appointments.` },
            { id: `${idea.id}-p3-3`, text: `Optional: Mentor junior agents or subcontractors for override income as you grow.` }
          ]
        }
      ];
    } else if (model === "digital-product") {
      const itemPrice = basePriceScaled;
      const monthlyOrdersA = Math.max(1, Math.ceil(incomeGoal / itemPrice));
      const dailyOrdersA = Math.max(1, +(monthlyOrdersA / 30).toFixed(1));

      const bundlePrice = this.scaleUsdToCurrency((idea.avgUnitRevenue || 24) * 2.5, currencyCode);
      const bundleOrdersB = Math.max(1, Math.ceil(incomeGoal / bundlePrice));
      const dailyBundlesB = Math.max(1, +(bundleOrdersB / 30).toFixed(1));

      pathA = {
        title: "Option A: Individual Product / Listing Sales",
        formula: `${monthlyOrdersA.toLocaleString()} ${unitLabel}/mo (~${dailyOrdersA}/day) x ${fmt(itemPrice)} = ${fmt(monthlyOrdersA * itemPrice)}/mo`,
        timeBreakdown: `Create once, sell repeatedly (~${weeklyHours} hrs/week creating new listings & driving search traffic)`
      };
      pathB = {
        title: "Option B: Value Bundles & Collections (Fewer Orders Needed)",
        formula: `${bundleOrdersB.toLocaleString()} bundle orders/mo (~${dailyBundlesB}/day) x ${fmt(bundlePrice)} = ${fmt(bundleOrdersB * bundlePrice)}/mo`,
        timeBreakdown: `Bundling 3 to 5 related items together cuts the number of buyers you need by more than half`
      };

      testSteps = [
        {
          id: `${idea.id}-test-1`,
          day: "Days 1 to 2",
          title: "Confirm Real Search Demand Before Making a Big Catalog",
          detail: `Use Etsy, Amazon, or Pinterest search autocomplete to spot what ${idea.targetAudience} are actively buying right now. Pick 1 specific theme with proven reviews.`
        },
        {
          id: `${idea.id}-test-2`,
          day: "Days 3 to 5",
          title: "Build 1 Complete Starter Bundle",
          detail: `${idea.quickTestStrategy} Use clean, easy-to-read mockup images showing exactly what buyers get.`
        },
        {
          id: `${idea.id}-test-3`,
          day: "Days 6 to 7",
          title: "Publish & Share a Free Sample Page to Test Clicks",
          detail: `Publish your starter bundle and share a free 1-to-2 page sample in 2 to 3 relevant parent/interest groups or on Pinterest to measure real clicks and first orders.`
        }
      ];

      outreachScript = `Hey everyone! I just created a new [Checklist / Activity Pack / Template Bundle] for [${idea.targetAudience}] who want an easier way to [solve specific everyday problem]. I made a free 2-page starter version if anyone wants to grab it for this week, and the full bundle is live in my shop! Comment below if you want the free link!`;
      validationMetric = `First 3 to 5 listings live, 100+ views/clicks, and first 3 to 10 orders proving buyers want this theme before you build 30+ more.`;

      phases = [
        {
          phase: phaseLabels[0],
          title: `Stage 1: Validate Your Niche & Reach ${fmt(milestone1)}`,
          focus: idea.first30DaysFocus,
          tasks: [
            { id: `${idea.id}-p1-1`, text: `Publish your first 10 to 15 quality listings targeted at specific buyer search terms.` },
            { id: `${idea.id}-p1-2`, text: `Group individual items into a higher-value ${fmt(bundlePrice)} bundle so each order earns more.` },
            { id: `${idea.id}-p1-3`, text: `Turn on automatic thank-you messages with a repeat-buyer coupon to build early 5-star reviews.` }
          ]
        },
        {
          phase: phaseLabels[1],
          title: `Stage 2: Double Down on Winners & Grow to ${fmt(milestone2)}/mo`,
          focus: `Identify which 2 to 3 listings got the most views/orders in Stage 1 and create 10 variations of those winners.`,
          tasks: [
            { id: `${idea.id}-p2-1`, text: `Expand your catalog to 30 to 40 targeted items using reusable layout templates.` },
            { id: `${idea.id}-p2-2`, text: `Share 3 to 5 fresh product pins per week on Pinterest for compounding search traffic.` },
            { id: `${idea.id}-p2-3`, text: `Release seasonal or holiday bundles 6 to 8 weeks ahead of upcoming holidays.` }
          ]
        },
        {
          phase: phaseLabels[2],
          title: `Stage 3: Scale to ${fmt(milestone3)}/mo Inside ${weeklyHours} Hrs/Week`,
          focus: `Build a consistent daily sales engine averaging ~${dailyBundlesB} bundle orders per day.`,
          tasks: [
            { id: `${idea.id}-p3-1`, text: `Launch a flagship Complete Collection to increase average order value.` },
            { id: `${idea.id}-p3-2`, text: `Add a simple email signup (free sample printable) to notify past buyers when new bundles drop.` },
            { id: `${idea.id}-p3-3`, text: `Keep new creation batched inside ${weeklyHours} hours/week while existing listings sell 24/7.` }
          ]
        }
      ];
    } else if (model === "physical-product") {
      const orderPrice = basePriceScaled;
      const monthlyOrdersA = Math.max(1, Math.ceil(incomeGoal / orderPrice));
      const weeklyOrdersA = Math.max(1, Math.ceil(monthlyOrdersA / 4.33));

      const bulkBatchValue = this.scaleUsdToCurrency((idea.avgUnitRevenue || 80) * 4.5, currencyCode);
      const coreOrdersB = Math.max(2, Math.floor(monthlyOrdersA * 0.45));
      const remainingB = Math.max(orderPrice, incomeGoal - coreOrdersB * orderPrice);
      const bulkOrdersB = Math.max(1, Math.ceil(remainingB / bulkBatchValue));

      pathA = {
        title: "Option A: Direct Customer Orders & Weekend Presales",
        formula: `${monthlyOrdersA} ${unitLabel}/mo (~${weeklyOrdersA}/week) x ${fmt(orderPrice)} = ${fmt(monthlyOrdersA * orderPrice)}/mo`,
        timeBreakdown: `Batch production 1 to 2 days per week inside your ${weeklyHours} hrs/week schedule`
      };
      pathB = {
        title: "Option B: Individual Orders + Bulk Event / Local Business Orders",
        formula: `${coreOrdersB} individual orders (${fmt(orderPrice)}) + ${bulkOrdersB} bulk/event orders (${fmt(bulkBatchValue)}) = ${fmt(coreOrdersB * orderPrice + bulkOrdersB * bulkBatchValue)}/mo`,
        timeBreakdown: `Adding bulk orders (parties, realtors, corporate gifts) hits ${goalFormatted}/mo with less prep time`
      };

      testSteps = [
        {
          id: `${idea.id}-test-1`,
          day: "Days 1 to 2",
          title: "Make 2 to 3 Sample Pieces & Take Bright Window-Light Photos",
          detail: `Do not buy bulk inventory or packaging yet. Prepare 2 to 3 clean samples and photograph them in natural light.`
        },
        {
          id: `${idea.id}-test-2`,
          day: "Days 3 to 5",
          title: "Open a 'Limited 12-Spot Presale Drop'",
          detail: `${idea.quickTestStrategy} Taking pre-orders means your customers pay for your materials upfront before you make the batch.`
        },
        {
          id: `${idea.id}-test-3`,
          day: "Days 6 to 7",
          title: "Collect Upfront Presale Orders & Show 3 Local Bulk Buyers",
          detail: `Collect payment via a simple order link, and share your sample photos with 3 local businesses, realtors, or event hosts who buy in bulk.`
        }
      ];

      outreachScript = `Hi neighbors! I'm opening a limited presale for [Product / Curated Box / Treat Bundle] for [upcoming weekend / occasion]! I have 12 spots open at ${fmt(orderPrice)} each (pickup/delivery on [Date]). Here's a photo of what's inside. Comment or message me if you'd like me to hold one for you!`;
      validationMetric = `10 to 12 presale spots claimed in 72 hours (${fmt(orderPrice * 10)}+ collected upfront before buying bulk supplies).`;

      phases = [
        {
          phase: phaseLabels[0],
          title: `Stage 1: Sell Out Your First Presale Drops (${fmt(milestone1)})`,
          focus: idea.first30DaysFocus,
          tasks: [
            { id: `${idea.id}-p1-1`, text: `Run 1 to 2 limited presale drops with a strict order cap so you never overbuy materials.` },
            { id: `${idea.id}-p1-2`, text: `Include a reorder card and referral perk inside every box so happy buyers share photos.` },
            { id: `${idea.id}-p1-3`, text: `Track exact material cost and time per batch so your profit margin stays healthy (60%+).` }
          ]
        },
        {
          phase: phaseLabels[1],
          title: `Stage 2: Add Repeat Bulk & Event Orders (${fmt(milestone2)}/mo)`,
          focus: `Pair individual orders with repeatable larger orders from local businesses or events.`,
          tasks: [
            { id: `${idea.id}-p2-1`, text: `Create a 1-page Bulk/Event Order Menu (${fmt(bulkBatchValue)}) for parties, realtors, or corporate gifts.` },
            { id: `${idea.id}-p2-2`, text: `Standardize 3 signature options instead of custom one-offs to cut production time in half.` },
            { id: `${idea.id}-p2-3`, text: `Start a VIP buyer list that gets 24-hour early access to each monthly presale.` }
          ]
        },
        {
          phase: phaseLabels[2],
          title: `Stage 3: Reach ${fmt(milestone3)}/mo Inside ${weeklyHours} Hrs/Week`,
          focus: `Combine predictable monthly presales with ${bulkOrdersB} recurring bulk/event accounts.`,
          tasks: [
            { id: `${idea.id}-p3-1`, text: `Lock in ${bulkOrdersB} recurring local business or event orders each month.` },
            { id: `${idea.id}-p3-2`, text: `Prep packaging, labels, and non-perishable supplies ahead of time during quiet pockets of the week.` },
            { id: `${idea.id}-p3-3`, text: `Increase prices by 15% on custom or rush orders once your regular slots fill up.` }
          ]
        }
      ];
    } else if (model === "local-service") {
      const bookingPrice = basePriceScaled;
      const monthlyBookingsA = Math.max(1, Math.ceil(incomeGoal / bookingPrice));
      const weeklyBookingsA = Math.max(1, +(monthlyBookingsA / 4.33).toFixed(1));

      const deluxePrice = this.scaleUsdToCurrency((idea.avgUnitRevenue || 450) * 1.65, currencyCode);
      const deluxeBookingsB = Math.max(1, Math.ceil(incomeGoal / deluxePrice));

      pathA = {
        title: "Option A: Standard Local Bookings",
        formula: `${monthlyBookingsA} ${unitLabel}/mo (~${weeklyBookingsA}/week) x ${fmt(bookingPrice)} = ${fmt(monthlyBookingsA * bookingPrice)}/mo`,
        timeBreakdown: `You choose which days/weekends on your family calendar are open (~${weeklyHours} hrs/week)`
      };
      pathB = {
        title: "Option B: Tiered Packages + Local Referral Partners",
        formula: `${deluxeBookingsB} Deluxe Package Bookings/mo x ${fmt(deluxePrice)} = ${fmt(deluxeBookingsB * deluxePrice)}/mo`,
        timeBreakdown: `Offering a Starter (${fmt(bookingPrice)}) and Deluxe (${fmt(deluxePrice)}) option lets customers upgrade automatically`
      };

      testSteps = [
        {
          id: `${idea.id}-test-1`,
          day: "Days 1 to 2",
          title: "Stage 1 Sample Setup & Simple 2-Option Price Sheet",
          detail: `Stage 1 sample space/setup at home (or for a friend) and take 5 bright photos. Outline a Starter (${fmt(bookingPrice)}) and Deluxe (${fmt(deluxePrice)}) package.`
        },
        {
          id: `${idea.id}-test-2`,
          day: "Days 3 to 5",
          title: "Share Your Founding Dates in Local Parent & Neighborhood Groups",
          detail: `${idea.quickTestStrategy} Open 4 founding spots for the next 2 weeks in exchange for photos and a review.`
        },
        {
          id: `${idea.id}-test-3`,
          day: "Days 6 to 7",
          title: "Collect 50% Booking Deposits & Message 5 Local Referral Partners",
          detail: `Use a 50% deposit to reserve dates (which covers any supplies upfront), and introduce yourself to 5 complementary local businesses (realtors, venues, bakers, photographers).`
        }
      ];

      outreachScript = `Hi neighbors! I have 4 openings coming up for [${idea.name}] right here in [Your Area]! Whether you have an upcoming [event / move / busy season], our flat-rate packages start at ${fmt(bookingPrice)}. Here are a few photos of our work. Message me your date to check availability!`;
      validationMetric = `First 3 to 4 local bookings reserved with a 50% deposit + 2 local businesses happy to refer their customers to you.`;

      phases = [
        {
          phase: phaseLabels[0],
          title: `Stage 1: First Local Bookings & ${fmt(milestone1)} Cash Flow`,
          focus: idea.first30DaysFocus,
          tasks: [
            { id: `${idea.id}-p1-1`, text: `Complete your first 3 to 5 bookings and capture bright photos at every single job.` },
            { id: `${idea.id}-p1-2`, text: `Set up a free Google Business Profile so local families searching "[Service] near me" find your reviews.` },
            { id: `${idea.id}-p1-3`, text: `Offer a referral thank-you perk to every happy customer who recommends a friend.` }
          ]
        },
        {
          phase: phaseLabels[1],
          title: `Stage 2: Partner Referrals & Package Upgrades (${fmt(milestone2)}/mo)`,
          focus: `Build steady word-of-mouth and partner referrals without paying for ads.`,
          tasks: [
            { id: `${idea.id}-p2-1`, text: `Connect with 3 to 5 local businesses (realtors, venues, schools, photographers) who serve the same families.` },
            { id: `${idea.id}-p2-2`, text: `Add 2 simple add-on upgrades at booking so your average order moves toward ${fmt(deluxePrice)}.` },
            { id: `${idea.id}-p2-3`, text: `Create a reusable packing/prep checklist so every booking takes less time.` }
          ]
        },
        {
          phase: phaseLabels[2],
          title: `Stage 3: Steady ${fmt(milestone3)}/mo Inside ${weeklyHours} Hrs/Week`,
          focus: `Book out your preferred weekly/weekend slots 3 to 4 weeks in advance.`,
          tasks: [
            { id: `${idea.id}-p3-1`, text: `Average ${deluxeBookingsB} to ${monthlyBookingsA} bookings per month within your chosen family schedule.` },
            { id: `${idea.id}-p3-2`, text: `Automate booking inquiries and 50% deposits so customers can reserve dates anytime.` },
            { id: `${idea.id}-p3-3`, text: `Optional: Bring on a part-time assistant for peak weekends if you want to expand further.` }
          ]
        }
      ];
    } else {
      const hoursPerUnit = idea.hoursPerUnitPerWeek || 1.5;
      const maxUnitsByTime = Math.max(1, Math.floor((weeklyHours * 0.85) / hoursPerUnit));
      let packagePriceA = basePriceScaled;
      let unitsNeededA = Math.max(1, Math.ceil(incomeGoal / packagePriceA));

      if (unitsNeededA > maxUnitsByTime && (idea.avgUnitRevenue || 0) >= 400) {
        packagePriceA = Math.ceil(incomeGoal / Math.max(2, maxUnitsByTime) / (cur.step || 50)) * (cur.step || 50);
        unitsNeededA = Math.max(1, Math.ceil(incomeGoal / packagePriceA));
      }
      const estWeeklyHoursA = Math.min(weeklyHours, +(unitsNeededA * hoursPerUnit).toFixed(1));

      const bundlePriceB = Math.round((packagePriceA * 1.35) / (cur.step ? cur.step / 5 : 25)) * (cur.step ? cur.step / 5 : 25) || Math.round(packagePriceA * 1.35);
      const unitsB = Math.max(1, Math.ceil(incomeGoal / bundlePriceB));
      const starterRate = Math.round(packagePriceA * 0.7);

      pathA = {
        title: "Option A: Core Monthly Plans / Flat-Rate Packages",
        formula: `${unitsNeededA} ${unitLabel} x ${fmt(packagePriceA)} = ${fmt(unitsNeededA * packagePriceA)}/mo`,
        timeBreakdown: `~${estWeeklyHoursA} hrs/week total using repeatable checklists & templates`
      };
      pathB = {
        title: "Option B: Bundled Package / Small-Group Model",
        formula: `${unitsB} bundled packages/pods x ${fmt(bundlePriceB)} = ${fmt(unitsB * bundlePriceB)}/mo`,
        timeBreakdown: `Fewer accounts/groups to manage while reaching ${goalFormatted}/mo inside ${weeklyHours} hrs/week`
      };

      testSteps = [
        {
          id: `${idea.id}-test-1`,
          day: "Days 1 to 2",
          title: "Write a Clear 1-Page Starter Package (Skip the Complex Website)",
          detail: `Outline what is included, who it helps (${idea.targetAudience}), and a founding starter rate of ${fmt(starterRate)} (regularly ${fmt(packagePriceA)}).`
        },
        {
          id: `${idea.id}-test-2`,
          day: "Days 3 to 5",
          title: "Share With 10 to 15 Ideal Buyers or Referral Partners",
          detail: `${idea.quickTestStrategy} You can send these in 30-minute pockets during the day.`
        },
        {
          id: `${idea.id}-test-3`,
          day: "Days 6 to 7",
          title: "Book Your First 1 to 3 Customers & Document Your Checklist",
          detail: `Use a simple payment link to get started with your first customers and save your templates as you go.`
        }
      ];

      outreachScript = `Hi [Name]! I noticed you're currently [busy with upcoming projects / growing your business / looking for support with ${idea.category}]. I offer [${idea.name}] and put together a quick sample showing how I can handle this for you. Would you like me to send it over?`;
      validationMetric = `10 to 15 warm messages or introductions, 3+ interested replies, and first 1 to 3 paying customers booked (${fmt(starterRate)} to ${fmt(starterRate * 3)}).`;

      phases = [
        {
          phase: phaseLabels[0],
          title: `Stage 1: First Customers & ${fmt(milestone1)} Cash Flow`,
          focus: idea.first30DaysFocus,
          tasks: [
            { id: `${idea.id}-p1-1`, text: `Book your first 2 to 3 customers at your ${fmt(starterRate)} starter rate using the 7-Day Validation Plan.` },
            { id: `${idea.id}-p1-2`, text: `Build reusable templates and checklists while delivering so every future account takes half the time.` },
            { id: `${idea.id}-p1-3`, text: `Collect a short review and work sample from your first happy customers.` }
          ]
        },
        {
          phase: phaseLabels[1],
          title: `Stage 2: Full Package Rates & Repeat Revenue (${fmt(milestone2)}/mo)`,
          focus: `Move new customers to your standard ${fmt(packagePriceA)} package and build recurring monthly revenue.`,
          tasks: [
            { id: `${idea.id}-p2-1`, text: `Offer a simple monthly plan so customers stay with you month after month.` },
            { id: `${idea.id}-p2-2`, text: `Batch your work into ${weeklyHours} predictable hours/week so it never spills into family time.` },
            { id: `${idea.id}-p2-3`, text: `Ask your Stage-1 customers and referral partners for 1 warm introduction each.` }
          ]
        },
        {
          phase: phaseLabels[2],
          title: `Stage 3: Consistent ${fmt(milestone3)}/mo Inside ${weeklyHours} Hrs/Week`,
          focus: `Maintain ${unitsB} to ${unitsNeededA} active ${unitLabel} to steadily bring in ${goalFormatted}/mo.`,
          tasks: [
            { id: `${idea.id}-p3-1`, text: `Reach ${unitsNeededA} active ${unitLabel} (or ${unitsB} bundled packages) to hit ${goalFormatted}/mo.` },
            { id: `${idea.id}-p3-2`, text: `Streamline delivery with templates so your weekly workload stays around ~${estWeeklyHoursA} hrs/week.` },
            { id: `${idea.id}-p3-3`, text: `Keep a simple waitlist or referral loop so your spots stay full year-round.` }
          ]
        }
      ];
    }

    return {
      rank: rankIndex + 1,
      badgeText:
        rankIndex === 0
          ? "#1 Best Overall Fit"
          : rankIndex === 1
          ? "#2 Runner-Up Fit"
          : rankIndex === 2
          ? "#3 Scalable Fit"
          : rankIndex === 3
          ? "#4 Honorable Mention"
          : "#5 Honorable Mention",
      requirements: idea.requirements || [
        `Core skills: ${(idea.skills || []).join(", ")}`,
        `Weekly time: ${idea.minHoursPerWeek} to ${idea.optimalHoursPerWeek} hours/week`,
        `Startup budget: ${idea.startupCost === 0 ? "$0 bootstrapped" : fmt(this.scaleUsdToCurrency(idea.startupCost, currencyCode))}`
      ],
      tradeoffs: idea.tradeoffs || [
        "Pros: Flexible schedule that fits around family responsibilities.",
        "Tradeoff: Requires consistent weekly follow-through during your first 30 to 60 days."
      ],
      incomeMath: {
        goal: incomeGoal,
        goalFormatted,
        weeklyHours,
        pathA,
        pathB
      },
      testingStrategy: {
        headline: `7-Day Validation & Testing Plan for ${idea.name}`,
        summary: idea.quickTestStrategy,
        steps: testSteps,
        outreachScript,
        validationMetric
      },
      implementationStrategy: {
        headline: `Practical Action Plan to ${goalFormatted}/mo (${timeline} Timeline • ${weeklyHours} Hrs/Week)`,
        phases
      }
    };
  }
};
