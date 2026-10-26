# Mompreneur Business Idea Finder & Strategy Tool

An interactive lead-generation and recommendation web app built around your **200-Idea Mompreneur Business Vault**.

## ✨ Key Features Built
1. **Custom Monthly Income Goal (Beyond $5k!):**
   - Moms can use the interactive slider, quick presets, or custom dollar input to set any income target from **$500/mo to $25,000+/mo**.
   - Dynamically calculates the required hourly/package yield within her available weekly hours and reverse-engineers two realistic offer/pricing paths for each matched idea.
2. **4-Step Mom-Life Assessment:**
   - **Step 1:** Custom Monthly Income Goal + Fast Cash vs. Scalable Asset timeline.
   - **Step 2:** Available Hours Per Week (`<5 hrs`, `5–10 hrs`, `10–15 hrs`, `15–25+ hrs`).
   - **Step 3:** Existing Skills & Superpowers (aligned with your Vault's skill categories).
   - **Step 4:** Work Style (`100% Behind-the-Scenes` vs. `Client-Facing` vs. `Open to Either`) & Startup Budget.
3. **Email Gate + Kit (ConvertKit) Integration:**
   - Displays a personalized teaser of her Top 3 Matches and captures **First Name + Email Address** before unlocking the full report.
   - Automatically subscribes leads to your **Kit (ConvertKit)** Form/Tag and populates custom fields (`income_goal`, `hours_per_week`, `skills`, `top_idea_1`, `top_idea_2`, `top_idea_3`).
   - Also saves a local backup of every lead in `data/leads.csv` & `data/leads.json` (plus one-click CSV export in the Admin Hub).
4. **Hybrid Recommendation Engine (Google Sheets + Smart Scoring + AI Personalizer):**
   - Connects directly to your **Google Sheet** and uses a smart column auto-mapper (`normalizeVaultRow`) to detect your *Idea Name, Category, Skills, Available Hours, Ease of $5k, Pricing Model, and Description* columns.
   - Generates for each of the **Top 3 Ideas**:
     1. **$[Goal]/mo Income Math** (Path A: Simple Core Retainer/Offer vs. Path B: Hybrid Retainer + VIP Intensive/Bundle).
     2. **7-Day Zero-Budget Validation & Testing Strategy** (including a copy-paste warm outreach script and validation metric).
     3. **30-60-90 Day Implementation Plan** (broken down by Days 1–30, Days 31–60, and Days 61–90).
5. **1-on-1 Consulting Upsell (Calendly Integration):**
   - Includes both an inline #1 Idea Launch CTA and a dedicated **1-on-1 Strategy Session** showcase at the bottom of the results page.
   - Opens an interactive **Calendly** booking modal (and direct link) with the lead's **name, email, income goal, weekly hours, and #1 matched business idea automatically pre-filled**.

---

## 🚀 Quick Start

Run the local server (uses standard Python 3—zero external packages required):

```bash
python3 server.py
```

Then open **http://localhost:3000** in your browser.

---

## ⚙️ Connecting Your Google Sheet, Kit & Calendly

You can configure your credentials in **two ways**:
1. **In the Browser UI:** Click the **`⚙️ Connect Sheet / Kit / Calendly`** button in the top-right navigation bar.
2. **Via `.env` or `config.js`:** Copy `.env.example` to `.env` and fill in:
   - `GOOGLE_SHEET_URL`: Paste your Google Sheet link (set sharing to *"Anyone with the link can view"* for instant live syncing).
   - `KIT_FORM_ID` & `KIT_API_KEY`: Found in your Kit account under *Settings → Developer*.
   - `CALENDLY_URL`: Your Calendly scheduling link (e.g. `https://calendly.com/yourname/strategy-call`).
   - `GEMINI_API_KEY` (optional): Add a Google Gemini API key (`gemini-2.5-flash`) if you want live AI-generated copy on top of the built-in Smart Strategy Engine.
