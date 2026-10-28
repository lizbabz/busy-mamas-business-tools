const https = require("https");

const KIT_API_SECRET = process.env.KIT_API_SECRET || "DjHoErqS8wASAXBYjJNFHhPIbIl8V2uPug4DLzgOvO0";

function getJson(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        headers: {
          "Accept": "application/json",
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
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let emailParam = req.query?.email || req.query?.e;
  if (!emailParam && req.url) {
    try {
      const u = new URL(req.url, "http://localhost");
      emailParam = u.searchParams.get("email") || u.searchParams.get("e");
    } catch (_) {}
  }
  const email = (emailParam || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return res.status(400).json({ ok: false, error: "Valid email parameter required" });
  }

  try {
    const kitUrl = `https://api.convertkit.com/v3/subscribers?api_secret=${encodeURIComponent(KIT_API_SECRET)}&email_address=${encodeURIComponent(email)}&status=all`;
    const response = await getJson(kitUrl);

    if (response.status !== 200 || !response.data || !Array.isArray(response.data.subscribers)) {
      return res.status(404).json({ ok: false, error: "Subscriber not found in Kit" });
    }

    const sub = response.data.subscribers[0];
    if (!sub) {
      return res.status(404).json({ ok: false, error: "Subscriber not found" });
    }

    const fields = sub.fields || {};
    return res.status(200).json({
      ok: true,
      subscriber: {
        id: sub.id,
        firstName: sub.first_name || "",
        email: sub.email_address || email,
        assessmentType: fields.assessment_type || "Business Fit",
        currency: fields.currency || "USD",
        incomeGoal: fields.income_goal || "",
        timeline: fields.timeline || "",
        hoursPerWeek: fields.hours_per_week || "",
        startupBudget: fields.startup_budget || "",
        skills: fields.skills || "",
        topIdea1: fields.top_idea_1 || "",
        topIdea2: fields.top_idea_2 || "",
        topIdea3: fields.top_idea_3 || "",
        checkInCadence: fields.check_in_emails || "weekly"
      }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
