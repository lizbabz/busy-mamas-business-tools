const https = require("https");

const KIT_API_KEY = process.env.KIT_API_KEY || "KNfaWYKoCU8IZgyhEK_Lag";
const KIT_API_SECRET = process.env.KIT_API_SECRET || "DjHoErqS8wASAXBYjJNFHhPIbIl8V2uPug4DLzgOvO0";
const KIT_FIT_FORM_ID = process.env.KIT_FIT_FORM_ID || "10105556";
const KIT_GROWTH_FORM_ID = process.env.KIT_GROWTH_FORM_ID || "10105554";

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const parsedUrl = new URL(url);
    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          "User-Agent": "BusyMamasBackend/1.0"
        },
        timeout: 8000
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (_) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.write(data);
    req.end();
  });
}

function putJson(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const parsedUrl = new URL(url);
    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          "User-Agent": "BusyMamasBackend/1.0"
        },
        timeout: 8000
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (_) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.write(data);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {
        body = {};
      }
    }
    body = body || {};

    const firstName = (body.firstName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const profile = body.profile || {};
    const topIdeas = body.topIdeas || [];
    const assessmentType = body.assessmentType || (profile.businessType ? "Business Growth" : "Business Fit");

    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, error: "Valid email is required" });
    }

    const formId =
      assessmentType === "Business Growth"
        ? (body.config && body.config.kitGrowthFormId) || KIT_GROWTH_FORM_ID
        : (body.config && body.config.kitFitFormId) || (body.config && body.config.kitFormId) || KIT_FIT_FORM_ID;

    const apiKey = (body.config && body.config.kitApiKey) || KIT_API_KEY;

    const topNames = topIdeas.slice(0, 3).map((i) => i.name || "");
    const currency = profile.currency || "USD";
    const incomeGoal = profile.incomeGoal || profile.targetRevenue || 4000;
    const timeline = profile.timeline || (assessmentType === "Business Growth" ? "30-Day Growth Plan" : "3-6 months");
    const hours = profile.hoursPerWeek || profile.maxDesiredHours || "";
    const budget = profile.budget || profile.growthBudget || 0;
    const skills = Array.isArray(profile.skills) ? profile.skills.join(", ") : String(profile.skills || profile.businessType || "");
    const checkIn = profile.checkInCadence || "weekly";

    const customFields = {
      assessment_type: assessmentType,
      currency: currency,
      income_goal: `${currency} ${Number(incomeGoal).toLocaleString()}/mo`,
      timeline: timeline,
      hours_per_week: String(hours),
      startup_budget: String(budget),
      skills: skills,
      check_in_emails: checkIn,
      top_idea_1: topNames[0] || "",
      top_idea_2: topNames[1] || "",
      top_idea_3: topNames[2] || ""
    };

    // 1. Subscribe to Kit Form with API Key
    const subscribeRes = await postJson(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      api_key: apiKey,
      email: email,
      first_name: firstName,
      fields: customFields
    });

    // 2. Also update subscriber with API Secret if available to guarantee field persistence
    let subscriberId = subscribeRes?.data?.subscription?.subscriber?.id;
    if (subscriberId && KIT_API_SECRET) {
      try {
        await putJson(`https://api.convertkit.com/v3/subscribers/${subscriberId}`, {
          api_secret: KIT_API_SECRET,
          fields: customFields
        });
      } catch (_) {}
    }

    return res.status(200).json({
      ok: true,
      synced: true,
      formId: formId,
      subscriberId: subscriberId || null
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
