#!/usr/bin/env python3
"""
Mompreneur Business Idea Finder - Backend Server (Zero External Dependencies)
Handles:
- Static frontend serving
- /api/config    : Reads .env and reports integration status
- /api/vault     : Live Google Sheets fetcher & CSV parser (supports URL or Sheet ID)
- /api/subscribe : Kit (ConvertKit) API subscriber + local CSV/JSON lead storage
- /api/recommend : Hybrid AI Personalization via Google Gemini or OpenAI API
"""

import csv
import io
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = "/tmp/data" if os.environ.get("VERCEL") else os.path.join(BASE_DIR, "data")
LEADS_JSON_PATH = os.path.join(DATA_DIR, "leads.json")
LEADS_CSV_PATH = os.path.join(DATA_DIR, "leads.csv")


def load_dotenv():
    """Load key=value pairs from .env file if present."""
    env_path = os.path.join(BASE_DIR, ".env")
    if not os.path.exists(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip()
            if "#" in val and not (val.startswith('"') or val.startswith("'")):
                val = val.split("#", 1)[0].strip()
            val = val.strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = val


def extract_sheet_id(url_or_id: str) -> str:
    """Extract Google Spreadsheet ID from a full URL or raw ID."""
    if not url_or_id:
        return ""
    url_or_id = url_or_id.strip()
    match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", url_or_id)
    if match:
        return match.group(1)
    if re.match(r"^[a-zA-Z0-9-_]{20,}$", url_or_id):
        return url_or_id
    return ""


def fetch_google_sheet_rows(sheet_url_or_id: str, tab_name: str = "Sheet1", api_key: str = ""):
    """Fetch rows from a Google Sheet via v4 API (if api_key) or public CSV export."""
    sheet_id = extract_sheet_id(sheet_url_or_id)
    if not sheet_id:
        raise ValueError("Invalid Google Sheet URL or ID.")

    # Option A: Google Sheets v4 API if API Key is provided
    if api_key:
        encoded_tab = urllib.parse.quote(tab_name or "Sheet1")
        api_url = f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/{encoded_tab}?key={api_key}"
        req = urllib.request.Request(api_url, headers={"User-Agent": "MompreneurVaultFinder/1.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
            values = payload.get("values", [])
            if not values or len(values) < 2:
                return []
            headers = [str(h).strip() for h in values[0]]
            rows = []
            for row in values[1:]:
                item = {}
                for idx, h in enumerate(headers):
                    if h:
                        item[h] = row[idx] if idx < len(row) else ""
                if any(str(v).strip() for v in item.values()):
                    rows.append(item)
            return rows

    # Option B: Public / Shared Google Sheet CSV Export (Zero-Auth)
    csv_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv"
    if tab_name and tab_name.strip():
        csv_url += f"&sheet={urllib.parse.quote(tab_name.strip())}"

    req = urllib.request.Request(csv_url, headers={"User-Agent": "MompreneurVaultFinder/1.0"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        csv_text = resp.read().decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(csv_text))
        rows = []
        for r in reader:
            cleaned = {str(k).strip(): (v.strip() if isinstance(v, str) else v) for k, v in r.items() if k}
            if any(str(v).strip() for v in cleaned.values()):
                rows.append(cleaned)
        return rows


def save_lead_locally(lead_data: dict):
    """Persist every captured lead in data/leads.json and data/leads.csv."""
    os.makedirs(DATA_DIR, exist_ok=True)

    leads = []
    if os.path.exists(LEADS_JSON_PATH):
        try:
            with open(LEADS_JSON_PATH, "r", encoding="utf-8") as f:
                leads = json.load(f)
        except Exception:
            leads = []

    leads.append(lead_data)
    with open(LEADS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2)

    file_exists = os.path.exists(LEADS_CSV_PATH)
    fieldnames = [
        "timestamp",
        "assessmentType",
        "firstName",
        "email",
        "currency",
        "incomeGoal",
        "timeline",
        "hoursPerWeek",
        "scheduleRhythm",
        "backgrounds",
        "licensingOpenness",
        "budget",
        "skills",
        "skillDirection",
        "enjoyedActivities",
        "livedExperiences",
        "dealbreakers",
        "customNote",
        "workStyle",
        "checkInCadence",
        "topIdea1",
        "topIdea2",
        "topIdea3",
        "completedTasksCount",
        "kitSynced",
    ]
    with open(LEADS_CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({k: lead_data.get(k, "") for k in fieldnames})


def subscribe_to_kit(first_name: str, email: str, custom_fields: dict, override_cfg: dict = None):
    """Send subscriber + custom fields to Kit (ConvertKit) v3 Forms API."""
    override_cfg = override_cfg or {}
    api_key = (
        override_cfg.get("kitApiKey")
        or os.environ.get("KIT_API_KEY", "")
        or "KNfaWYKoCU8IZgyhEK_Lag"
    )
    form_id = (
        override_cfg.get("kitFormId")
        or override_cfg.get("kitFitFormId")
        or os.environ.get("KIT_FORM_ID", "")
        or os.environ.get("KIT_FIT_FORM_ID", "")
        or "10105556"
    )
    tag_id = override_cfg.get("kitTagId") or os.environ.get("KIT_TAG_ID", "")

    if not api_key or not form_id:
        return {"synced": False, "reason": "Kit API Key or Form ID not configured yet (lead saved locally)."}

    url = f"https://api.convertkit.com/v3/forms/{str(form_id).strip()}/subscribe"
    body = {
        "api_key": str(api_key).strip(),
        "email": str(email).strip(),
        "first_name": str(first_name).strip(),
        "fields": custom_fields,
    }
    if tag_id:
        try:
            body["tags"] = [int(t.strip()) for t in str(tag_id).split(",") if t.strip().isdigit()]
        except Exception:
            pass

    data_bytes = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data_bytes,
        headers={"Content-Type": "application/json", "User-Agent": "MompreneurVaultFinder/1.0"},
        method="POST",
    )

    try:
        import ssl
        ctx = ssl.create_default_context()
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            resp_json = json.loads(resp.read().decode("utf-8"))
            return {"synced": True, "response": resp_json}
    except Exception as exc:
        try:
            import ssl
            unverified_ctx = ssl._create_unverified_context()
            with urllib.request.urlopen(req, timeout=10, context=unverified_ctx) as resp:
                resp_json = json.loads(resp.read().decode("utf-8"))
                return {"synced": True, "response": resp_json}
        except Exception as inner_exc:
            return {"synced": False, "error": str(inner_exc)}


def generate_ai_strategies(profile: dict, top_ideas: list, override_cfg: dict = None):
    """Call Google Gemini or OpenAI to personalize the Top 3 testing & implementation strategies."""
    override_cfg = override_cfg or {}
    provider = (override_cfg.get("aiProvider") or os.environ.get("AI_PROVIDER") or "gemini").lower()
    gemini_key = override_cfg.get("geminiApiKey") or os.environ.get("GEMINI_API_KEY", "")
    openai_key = override_cfg.get("openaiApiKey") or os.environ.get("OPENAI_API_KEY", "")

    income_goal = profile.get("incomeGoal", 5000)
    hours = profile.get("hoursPerWeek", 8)
    schedule_rhythm = profile.get("scheduleRhythm", "weekday-blocks")
    backgrounds = ", ".join(profile.get("backgrounds", [])) or "General background"
    licensing_openness = profile.get("licensingOpenness", "open-licensed")
    skills = ", ".join(profile.get("skills", [])) or "General organization & communication"
    skill_direction = profile.get("skillDirection", "blend-both")
    enjoyed_activities = ", ".join(profile.get("enjoyedActivities", [])) or "Flexible work"
    lived_experiences = ", ".join(profile.get("livedExperiences", [])) or "Motherhood"
    dealbreakers = ", ".join(profile.get("dealbreakers", [])) or "None"
    custom_note = profile.get("customNote") or "None"
    work_style = profile.get("workStyle", "flexible")
    first_name = profile.get("firstName") or "Mama"

    ideas_summary = []
    for idx, item in enumerate(top_ideas[:3]):
        ideas_summary.append(
            f"{idx + 1}. {item.get('name')} (Category: {item.get('category')}, "
            f"Typical Pricing: {item.get('incomeModel')}, Description: {item.get('description')})"
        )

    prompt = f"""You are an experienced Business Strategy Consultant.
A busy mom named {first_name} just used our Business Fit by Busy Mamas 6-Step Deep-Fit Assessment with the following profile:
- Custom Monthly Income Goal: ${income_goal:,}/month
- Available Time Per Week: {hours} hours/week (Schedule Rhythm: {schedule_rhythm})
- Professional Background & Credentials: {backgrounds} (Licensing Openness: {licensing_openness})
- Core Skills/Strengths: {skills} (Skill Direction: {skill_direction})
- Day-to-Day Activities She Enjoys: {enjoyed_activities}
- Lived Life & Mom Experience: {lived_experiences}
- Hard Dealbreakers: {dealbreakers}
- Personal Context Note: {custom_note}
- Work Style Preference: {work_style}

Here are her Top 3 Matched Business Ideas from our 200-Idea Vault:
{chr(10).join(ideas_summary)}

Important: Match the business model of each idea naturally (e.g., if it's an e-commerce/printable/product idea, talk about orders, bundles, listings, and shoppers; if it's a local business, talk about local bookings, packages, and community partners; if it's a service, talk about accounts or packages). Avoid online-coaching cliches like "high-ticket" or "VIP days".

Return a JSON object with a single key "customPlaybooks" containing an array of 3 objects (in the exact same order 1, 2, 3).
Each object MUST have:
- "whyItFitsYou": 2 warm, practical sentences explaining why this idea fits her {hours} hrs/week schedule and ${income_goal:,}/mo goal.
- "customOfferAndMath": Specific product/package pricing & realistic sales/booking math showing how she reaches ${income_goal:,}/mo within {hours} hours/week.
- "sevenDayValidationTest": Concrete, low-risk 7-day validation test she can run this week to prove buyer demand before investing heavily.
- "outreachScript": A copy-paste community post, presale announcement, or warm message she can use this week to test demand.
- "day30Milestone": Specific action & revenue target for Days 1-30.
- "day60Milestone": Specific action & revenue target for Days 31-60.
- "day90Milestone": Specific action & revenue target for Days 61-90 to reach ${income_goal:,}/mo.

Respond ONLY with valid JSON."""

    # Try Gemini API if key is available
    if (provider == "gemini" and gemini_key) or (gemini_key and not openai_key):
        model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key.strip()}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.7},
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)

    # Try OpenAI API if key is available
    if openai_key:
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        url = "https://api.openai.com/v1/chat/completions"
        payload = {
            "model": model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": "You are a strategic business coach for busy moms. Output valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openai_key.strip()}",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            text = data["choices"][0]["message"]["content"]
            return json.loads(text)

    return None


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def send_json(self, data: dict, status: int = 200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/config":
            load_dotenv()
            self.send_json(
                {
                    "googleSheetUrl": os.environ.get("GOOGLE_SHEET_URL") or os.environ.get("GOOGLE_SHEET_ID", ""),
                    "googleSheetTabName": os.environ.get("GOOGLE_SHEET_TAB_NAME", "Sheet1"),
                    "calendlyUrl": os.environ.get("CALENDLY_URL", ""),
                    "consultingTitle": os.environ.get("CONSULTING_TITLE", ""),
                    "consultingSubtitle": os.environ.get("CONSULTING_SUBTITLE", ""),
                    "consultingCtaText": os.environ.get("CONSULTING_CTA_TEXT", ""),
                    "hasKitConfigured": bool(os.environ.get("KIT_API_KEY") and os.environ.get("KIT_FORM_ID")),
                    "hasAiConfigured": bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY")),
                    "aiProvider": os.environ.get("AI_PROVIDER", "gemini"),
                }
            )
            return

        if parsed.path == "/api/vault":
            load_dotenv()
            qs = urllib.parse.parse_qs(parsed.query)
            sheet_url = (
                (qs.get("sheetUrl", [""])[0])
                or os.environ.get("GOOGLE_SHEET_URL")
                or os.environ.get("GOOGLE_SHEET_ID", "")
            )
            tab_name = (qs.get("tabName", [""])[0]) or os.environ.get("GOOGLE_SHEET_TAB_NAME", "Sheet1")
            api_key = os.environ.get("GOOGLE_SHEETS_API_KEY", "")

            if not sheet_url:
                self.send_json({"ok": False, "reason": "No Google Sheet URL/ID provided.", "rows": []})
                return

            try:
                rows = fetch_google_sheet_rows(sheet_url, tab_name, api_key)
                self.send_json({"ok": True, "count": len(rows), "rows": rows})
            except Exception as exc:
                self.send_json({"ok": False, "error": str(exc), "rows": []}, status=200)
            return

        if parsed.path == "/api/leads":
            leads = []
            if os.path.exists(LEADS_JSON_PATH):
                try:
                    with open(LEADS_JSON_PATH, "r", encoding="utf-8") as f:
                        leads = json.load(f)
                except Exception:
                    leads = []
            self.send_json({"ok": True, "count": len(leads), "leads": leads})
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_len = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        try:
            body = json.loads(raw_body)
        except Exception:
            body = {}

        if parsed.path == "/api/subscribe":
            load_dotenv()
            first_name = (body.get("firstName") or "").strip()
            email = (body.get("email") or "").strip()
            profile = body.get("profile") or {}
            top_ideas = body.get("topIdeas") or []
            override_cfg = body.get("config") or {}

            if not email or "@" not in email:
                self.send_json({"ok": False, "error": "Please provide a valid email address."}, status=400)
                return

            assessment_type = body.get("assessmentType") or ("Business Growth" if "Growth" in str(profile.get("skills", "")) else "Business Fit")
            top_names = [i.get("name", "") for i in top_ideas[:3]]
            currency = profile.get("currency", "USD")
            timeline = profile.get("timeline", "3-6 months")
            check_in = profile.get("checkInCadence", "weekly")
            custom_fields = {
                "assessment_type": assessment_type,
                "currency": currency,
                "income_goal": f"{currency} {int(profile.get('incomeGoal', 4000)):,}/mo",
                "timeline": timeline,
                "hours_per_week": str(profile.get("hoursPerWeek", "")),
                "startup_budget": str(profile.get("budget", 0)),
                "skills": ", ".join(profile.get("skills", [])),
                "check_in_emails": check_in,
                "top_idea_1": top_names[0] if len(top_names) > 0 else "",
                "top_idea_2": top_names[1] if len(top_names) > 1 else "",
                "top_idea_3": top_names[2] if len(top_names) > 2 else "",
            }

            kit_result = {"synced": False}
            try:
                kit_result = subscribe_to_kit(first_name, email, custom_fields, override_cfg)
            except Exception as exc:
                kit_result = {"synced": False, "error": str(exc)}

            lead_record = {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "assessmentType": assessment_type,
                "firstName": first_name,
                "email": email,
                "currency": currency,
                "incomeGoal": profile.get("incomeGoal", 4000),
                "timeline": timeline,
                "hoursPerWeek": profile.get("hoursPerWeek", ""),
                "scheduleRhythm": profile.get("scheduleRhythm", ""),
                "backgrounds": ", ".join(profile.get("backgrounds", [])),
                "licensingOpenness": profile.get("licensingOpenness", ""),
                "budget": profile.get("budget", 0),
                "skills": ", ".join(profile.get("skills", [])),
                "skillDirection": profile.get("skillDirection", ""),
                "enjoyedActivities": ", ".join(profile.get("enjoyedActivities", [])),
                "livedExperiences": ", ".join(profile.get("livedExperiences", [])),
                "dealbreakers": ", ".join(profile.get("dealbreakers", [])),
                "customNote": profile.get("customNote", ""),
                "workStyle": profile.get("workStyle", ""),
                "checkInCadence": check_in,
                "topIdea1": custom_fields["top_idea_1"],
                "topIdea2": custom_fields["top_idea_2"],
                "topIdea3": custom_fields["top_idea_3"],
                "completedTasksCount": len(body.get("completedTasks") or []),
                "kitSynced": kit_result.get("synced", False),
            }
            save_lead_locally(lead_record)

            # Optional Google Sheets Leads Webhook
            webhook_url = os.environ.get("GOOGLE_SHEETS_LEADS_WEBHOOK_URL", "")
            if webhook_url:
                try:
                    req = urllib.request.Request(
                        webhook_url,
                        data=json.dumps(lead_record).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                        method="POST",
                    )
                    urllib.request.urlopen(req, timeout=6)
                except Exception:
                    pass

            self.send_json({"ok": True, "kit": kit_result, "lead": lead_record})
            return

        if parsed.path == "/api/progress":
            # Update saved progress for an existing lead in data/leads.json
            email = (body.get("email") or "").strip().lower()
            completed_tasks = body.get("completedTasks") or []
            if email and os.path.exists(LEADS_JSON_PATH):
                try:
                    with open(LEADS_JSON_PATH, "r", encoding="utf-8") as f:
                        leads = json.load(f)
                    for item in reversed(leads):
                        if (item.get("email") or "").strip().lower() == email:
                            item["completedTasksCount"] = len(completed_tasks)
                            item["completedTasks"] = completed_tasks
                            item["lastProgressAt"] = datetime.utcnow().isoformat() + "Z"
                            break
                    with open(LEADS_JSON_PATH, "w", encoding="utf-8") as f:
                        json.dump(leads, f, indent=2)
                except Exception:
                    pass
            self.send_json({"ok": True})
            return

        if parsed.path == "/api/vault/sync":
            load_dotenv()
            rows = body.get("rows") or []
            webhook_url = (body.get("webhookUrl") or os.environ.get("GOOGLE_SHEETS_VAULT_WEBHOOK_URL") or "").strip()
            csv_export_path = os.path.join(BASE_DIR, "new-vault-ideas-for-google-sheets.csv")

            if rows and isinstance(rows, list):
                fieldnames = list(rows[0].keys())
                with open(csv_export_path, "w", newline="", encoding="utf-8") as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    for r in rows:
                        writer.writerow(r)

            webhook_pushed = False
            if webhook_url and rows:
                try:
                    req = urllib.request.Request(
                        webhook_url,
                        data=json.dumps({"action": "append_vault_ideas", "rows": rows}).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                        method="POST",
                    )
                    with urllib.request.urlopen(req, timeout=10) as _:
                        webhook_pushed = True
                except Exception:
                    webhook_pushed = False

            self.send_json(
                {
                    "ok": True,
                    "count": len(rows),
                    "csvPath": "new-vault-ideas-for-google-sheets.csv",
                    "webhookPushed": webhook_pushed,
                }
            )
            return

        if parsed.path == "/api/recommend":
            load_dotenv()
            profile = body.get("profile") or {}
            top_ideas = body.get("topIdeas") or []
            override_cfg = body.get("config") or {}
            try:
                ai_data = generate_ai_strategies(profile, top_ideas, override_cfg)
                if ai_data and "customPlaybooks" in ai_data:
                    self.send_json({"ok": True, "aiEnhanced": True, "customPlaybooks": ai_data["customPlaybooks"]})
                else:
                    self.send_json({"ok": True, "aiEnhanced": False, "reason": "Using built-in Smart Strategy Engine"})
            except Exception as exc:
                self.send_json({"ok": True, "aiEnhanced": False, "error": str(exc)})
            return

        self.send_json({"ok": False, "error": "Not found"}, status=404)


if __name__ == "__main__":
    load_dotenv()
    port = int(os.environ.get("PORT", 3000))
    server = ThreadingHTTPServer(("127.0.0.1", port), AppHandler)
    print(f"✨ Mompreneur Business Idea Finder running at http://localhost:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.server_close()
