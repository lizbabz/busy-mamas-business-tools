/**
 * ============================================================================
 * BUSINESS FIT BY BUSY MAMAS - FRONTEND CONFIGURATION (config.js)
 * ============================================================================
 */

window.APP_CONFIG = {
  brandName: "Business Fit by Busy Mamas",
  hostName: "Oyin",
  toolTitle: "Find & Test a Business Idea Built for Your Real Life",
  toolSubtitle:
    "Tell us your skills, weekly hours, budget, and income target. We will match your top 3 business ideas from our 200+ Idea Vault, complete with honest requirements, tradeoffs, and a practical step-by-step action plan.",

  // 1. GOOGLE SHEETS LIVE VAULT CONNECTION
  googleSheetUrl: "",
  googleSheetId: "",
  googleSheetTabName: "Sheet1",

  // 2. KIT (CONVERTKIT) EMAIL CAPTURE & AUTOMATED CHECK-IN EMAILS
  kitApiKey: "KNfaWYKoCU8IZgyhEK_Lag",
  kitFormId: "10105556",
  kitFitFormId: "10105556",
  kitGrowthFormId: "10105554",
  kitTagId: "",

  // 3. OPTIONAL PAID 1-ON-1 CONSULTATIONS WITH OYIN (CALENDLY)
  calendlyUrl: "https://calendly.com/nvmbrmedia/strategy-session-with-oyin",
  consulting: {
    badge: "OPTIONAL 1-ON-1 CONSULTATION WITH OYIN",
    title: "Want 1-on-1 Help From Oyin to Test & Launch Your Top Idea?",
    subtitle:
      "If you want direct eyes on your plan, book a private 1-on-1 consultation with Oyin. We will review your top matched ideas, reality-check the numbers for your schedule, and map out your exact first 30 days.",
    ctaText: "Book a 1-on-1 Consultation with Oyin",
    secondaryCtaText: "See Oyin's Available Times on Calendly",
    benefits: [
      "Direct 1-on-1 review of your Top 3 matched ideas, requirements, and realistic tradeoffs",
      "Custom pricing, product/package structure, and income math for your target timeline",
      "Hands-on 7-Day Validation Plan so you can test buyer demand before spending money",
      "Clear weekly schedule & action plan tailored around your family commitments"
    ]
  },

  // 4. AI PERSONALIZATION
  aiProvider: "gemini"
};
