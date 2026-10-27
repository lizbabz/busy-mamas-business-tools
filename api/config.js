module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.status(200).json({
    googleSheetUrl: process.env.GOOGLE_SHEET_URL || "",
    googleSheetTabName: process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1",
    calendlyUrl: process.env.CALENDLY_URL || "https://calendly.com/nvmbrmedia/strategy-session-with-oyin",
    consultingTitle: "Want 1-on-1 Help From Oyin to Test & Launch Your Top Idea?",
    consultingSubtitle: "If you want direct eyes on your plan, book a private 1-on-1 consultation with Oyin. We will review your top matched ideas, reality-check the numbers for your schedule, and map out your exact first 30 days.",
    consultingCtaText: "Book a 1-on-1 Consultation with Oyin",
    hasKitConfigured: true,
    hasAiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
    aiProvider: process.env.AI_PROVIDER || "gemini"
  });
};
