/**
 * ============================================================================
 * BUSINESS FIT BY BUSY MAMAS - VAULT DATA, CURRENCIES & SUCCESS STORIES
 * ============================================================================
 */

window.SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", label: "$ USD", rate: 1, defaultGoal: 5000, min: 500, max: 50000, step: 250, presets: [1500, 3500, 5000, 10000, 25000, 50000] },
  { code: "GBP", symbol: "£", label: "£ GBP", rate: 1, defaultGoal: 5000, min: 500, max: 50000, step: 250, presets: [1500, 3500, 5000, 10000, 25000, 50000] },
  { code: "EUR", symbol: "€", label: "€ EUR", rate: 1, defaultGoal: 5000, min: 500, max: 50000, step: 250, presets: [1500, 3500, 5000, 10000, 25000, 50000] }
];

/**
 * Documented real-world success stories shown as pop-up modals between
 * assessment sections. Strictly for motivation; does not affect scoring.
 */
window.SUCCESS_STORIES = [
  {
    id: "story-rasheeda",
    preferredSteps: [2, 5],
    matchTriggers: {
      flash: true,
      maxGoal: 5000,
      skills: ["culinary"],
      activities: ["act-baking-food"],
      backgrounds: ["bg-culinary", "bg-homemaker"]
    },
    tag: "Real Mom Story • Culinary & Cottage Bakery",
    headline: "How Rasheeda Launched Her Banana Bread Business & Sold Out Her First Batch of 22 in Just 1 Week",
    story:
      "Rasheeda did not wait for a commercial storefront or a complicated website to launch. She perfected her signature banana bread recipe in her home kitchen, announced a limited first batch to her community and local network, and completely sold out all 22 loaves in her very first week.",
    takeaway:
      "By using a scarcity-driven presale drop ('Batch #1: 22 Loaves Only'), she collected cash upfront before buying bulk ingredients and turned immediate customer rave reviews into repeat weekly orders toward her {GOAL} target.",
    metrics: ["Sold Out 22 Loaves in 1 Week", "Home Kitchen Launch", "100% Upfront Presales"]
  },
  {
    id: "story-fatima",
    preferredSteps: [2, 5],
    matchTriggers: {
      skills: ["crafts", "design_photo"],
      activities: ["act-crafting-decor"],
      backgrounds: ["bg-crafts-maker", "bg-design-media", "bg-homemaker"]
    },
    tag: "Real Mom Story • Artisan Decor & Retail Stockist",
    headline: "How Fatima Created Jesmonite Decor Pieces & Stocked Her Line in Major Retailer Makers Keep in Under 1 Year",
    story:
      "Fatima started hand-pouring modern architectural trays, coasters, and home decor vessels using Jesmonite from home. Because her pieces had a clean, elevated aesthetic and high perceived value, she pitched local retail buyers and got her product line stocked in the major craft retail store Makers Keep in less than one year.",
    takeaway:
      "Pairing direct-to-customer orders with retail store stocking (wholesale or consignment in established stores like Makers Keep) lets your handmade products sell 7 days a week while you are with your kids.",
    metrics: ["Jesmonite Home Decor", "Stocked in Makers Keep", "Under 1 Year to Retail"]
  },
  {
    id: "story-bridget",
    preferredSteps: [2, 5],
    matchTriggers: {
      minGoal: 6000,
      licensing: ["open-licensed"],
      skills: ["finance", "coaching_consulting"],
      backgrounds: ["bg-finance", "bg-corporate", "bg-realestate-legal"]
    },
    tag: "Real Mom Story • Licensed Financial Services",
    headline: "How Bridget, a Mom of 3, Made {SYM}800,000 in One Year Selling Financial Products",
    story:
      "Bridget wanted uncapped earning potential that still allowed her to be present for her three kids. She studied for her state insurance and financial licenses and began educating families and business owners on life insurance, annuities, and wealth protection products.",
    takeaway:
      "Because financial products pay substantial upfront and renewal commissions ({SYM}1,200 to {SYM}6,500+ per policy), helping just a few families or business owners each week allowed her to cross {SYM}800,000 in annual income.",
    metrics: ["Mom of 3", "Licensed Financial Products", "{SYM}800,000 in 1 Year"]
  },
  {
    id: "story-tolu",
    preferredSteps: [2, 5],
    matchTriggers: {
      flash: true,
      rhythm: ["weekends-evenings", "flexible-mix"],
      skills: ["event_planning"],
      activities: ["act-event-planning"],
      backgrounds: ["bg-event-planning", "bg-homemaker"]
    },
    tag: "Real Mom Story • Event Planning & Backdrops",
    headline: "How Tolu Made {SYM}1,800 in Her First 2 Weeks With Event Backdrops & Scaled to {SYM}5,800/Month",
    story:
      "Tolu needed fast cash flow without working Monday through Friday. She staged one sample balloon and backdrop setup in her living room, posted photos in her local parent group, and booked 4 weekend birthday and baby shower setups in 14 days.",
    takeaway:
      "Collecting a 50% booking deposit upfront paid for her reusable frames and equipment before she ever stepped foot at her first event, putting her right on pace for {GOAL}.",
    metrics: ["Saturdays Only", "{SYM}1,800 in First 14 Days", "{SYM}5,800/mo by Month 3"]
  },
  {
    id: "story-amara",
    preferredSteps: [2, 5],
    matchTriggers: {
      rhythm: ["weekends-evenings", "flexible-mix"],
      skills: ["mc_dj", "event_planning"],
      activities: ["act-mc-dj", "act-event-planning"],
      backgrounds: ["bg-entertainment", "bg-event-planning"]
    },
    tag: "Real Mom Story • Live MC, DJ & Event Hosting",
    headline: "How Amara Built a {SYM}6,500/Month Intimate & Corporate Event Hosting & Live MC Business",
    story:
      "Amara was always the friend commanding the mic at family celebrations and keeping events on schedule. She packaged her natural stage presence into a high-demand offer: Live Reception/Gala MCing ({SYM}1,250/event) and Corporate Mixer Hosting ({SYM}1,800+).",
    takeaway:
      "By partnering with 4 local event planners, venues, and DJs who constantly needed a warm, polished MC/Host, she booked 3 to 5 weekend and corporate events a month without spending a dime on ads.",
    metrics: ["3 to 5 Events/Month", "Weddings, Galas & Corporate", "{SYM}6,500/mo Revenue"]
  },
  {
    id: "story-zainab-beauty",
    preferredSteps: [2, 5],
    matchTriggers: {
      skills: ["beauty"],
      activities: ["act-beauty-glam"],
      backgrounds: ["bg-beauty-wellness"]
    },
    tag: "Real Mom Story • Beauty, Bridal Glam & PMU",
    headline: "How Zainab Built a {SYM}7,200/Month Bridal Glam & Brow Studio Working 3 Days a Week",
    story:
      "Zainab transitioned from working long salon hours to running her own appointment-only Bridal Makeup (MUA) and Brow/PMU studio. Instead of taking low-priced walk-ins, she created a {SYM}950 Bridal Party Glam Package and a {SYM}450 Lip Blush & Brow service.",
    takeaway:
      "In beauty and aesthetics, bundling high-value packages (bridal parties, PMU services, or corrective skincare series) lets you earn {GOAL} in just 8 to 12 appointment hours per week.",
    metrics: ["3 Days/Week", "Bridal MUA & PMU", "{SYM}7,200/mo Revenue"]
  },
  {
    id: "story-simone",
    preferredSteps: [2, 5],
    matchTriggers: {
      minGoal: 5000,
      skills: ["coaching_consulting", "teaching", "organization", "healthcare_care"],
      activities: ["act-coaching", "act-healthcare-support"],
      backgrounds: ["bg-corporate", "bg-education", "bg-healthcare", "bg-tech"]
    },
    tag: "Real Mom Story • Coaching, Consulting & Workshops",
    headline: "How Simone Turned Her Career & Operations Experience Into {SYM}9,500/Month in 10 Hours a Week",
    story:
      "After leaving her demanding full-time role, Simone packaged her professional experience into a 90-day 1-on-1 Coaching & Advisory program ({SYM}1,800) paired with one monthly Corporate Lunch-and-Learn workshop ({SYM}2,500).",
    takeaway:
      "With high-trust coaching and consulting packages, you only need 4 to 5 active clients at a time to comfortably exceed {GOAL} during school or daycare hours.",
    metrics: ["10 Hrs/Week", "4 to 5 Active Clients", "{SYM}9,500/mo Consulting"]
  },
  {
    id: "story-rachel",
    preferredSteps: [2, 5],
    matchTriggers: {
      rhythm: ["nap-pockets"],
      skills: ["design_photo", "writing", "tech", "teaching"],
      activities: ["act-digital-design"]
    },
    tag: "Real Mom Story • Nap-Time Digital Products",
    headline: "How Rachel Built a {SYM}4,200/Month Digital Printables & Workbook Shop During Nap Times",
    story:
      "With a toddler and newborn at home, Rachel could not commit to live client calls. She used 45-minute nap pockets to design bundled household planners, event templates, and kids' learning workbooks on Etsy and Amazon KDP.",
    takeaway:
      "Because digital bundles ({SYM}27 to {SYM}39) deliver automatically upon checkout, her shop now generates {SYM}4,200+/mo around the clock with zero shipping or live calls.",
    metrics: ["Nap-Time Schedule", "Zero Live Calls", "{SYM}4,200/mo Passive Sales"]
  },
  {
    id: "story-maya",
    preferredSteps: [2, 5],
    matchTriggers: {
      skills: ["finance", "writing", "organization", "tech"],
      activities: ["act-backoffice-writing", "act-systems-brokering"],
      backgrounds: ["bg-finance", "bg-corporate", "bg-writing-marketing", "bg-tech"]
    },
    tag: "Real Mom Story • Quiet Remote B2B Retainers",
    headline: "How Maya Built a {SYM}5,500/Month Remote Grant Writing & Bookkeeping Practice With Zero Social Media",
    story:
      "Maya wanted steady monthly income from home without ever posting her face on social media. She partnered with local CPAs and nonprofit directors to handle monthly bookkeeping and grant proposals on quiet retainer contracts.",
    takeaway:
      "Just 4 to 6 recurring B2B retainer clients ({SYM}750 to {SYM}1,500/mo each) creates predictable {GOAL} income that you can complete entirely on your own schedule.",
    metrics: ["Zero Social Media", "100% Behind-the-Scenes", "{SYM}5,500/mo Recurring"]
  }
];

window.SCHEDULE_RHYTHMS = [
  {
    id: "nap-pockets",
    label: "Nap-Time & Late-Night Pockets",
    title: "Nap-Time & Late-Night Pockets",
    sub: "I need 100% flexible, quiet computer or studio work with zero fixed call times or weekday appointments.",
    desc: "I need 100% flexible, quiet computer or studio work with zero fixed call times or weekday appointments."
  },
  {
    id: "weekday-blocks",
    label: "Weekday School / Daycare Hours",
    title: "Weekday School / Daycare Hours",
    sub: "I have set morning or afternoon windows on weekdays when I can focus, see clients, or take calls.",
    desc: "I have set morning or afternoon windows on weekdays when I can focus, see clients, or take calls."
  },
  {
    id: "weekends-evenings",
    label: "Weekends & Evenings Only",
    title: "Weekends & Evenings Only",
    sub: "My weekdays are full, so I want something I can run on Saturdays, Sundays, or evenings when family covers the kids.",
    desc: "My weekdays are full, so I want something I can run on Saturdays, Sundays, or evenings when family covers the kids."
  },
  {
    id: "flexible-mix",
    label: "Flexible Mix of Days & Weekends",
    title: "Flexible Mix of Days & Weekends",
    sub: "I have a mix of weekday pockets and weekend flexibility depending on the week.",
    desc: "I have a mix of weekday pockets and weekend flexibility depending on the week."
  }
];

window.PROFESSIONAL_BACKGROUNDS = [
  {
    id: "bg-healthcare",
    label: "Healthcare, Nursing & Medical",
    title: "Healthcare, Nursing & Medical",
    sub: "Medical Doctor (MD), Nurse (RN/NP), pharmacist, allied health, Personal Support Worker (PSW), or doula",
    desc: "Medical Doctor (MD), Nurse (RN/NP), pharmacist, allied health, Personal Support Worker (PSW), or doula",
    mappedSkills: ["healthcare_care"],
    keywords: ["medical", "physician", "doctor", "healthcare", "nursing", "rn/np", "psw", "personal support", "senior care", "credentialing", "pediatric sleep", "postpartum", "clinical", "patient advocate"]
  },
  {
    id: "bg-beauty-wellness",
    label: "Beauty, Esthetics & Hair",
    title: "Beauty, Esthetics & Hair",
    sub: "Esthetician, Makeup Artist (MUA), Permanent Makeup (PMUA), brow/lash tech, hairstylist, braider, or wig maker",
    desc: "Esthetician, Makeup Artist (MUA), Permanent Makeup (PMUA), brow/lash tech, hairstylist, braider, or wig maker",
    mappedSkills: ["beauty"],
    keywords: ["beauty", "esthetician", "makeup", "mua", "pmua", "microblading", "brow", "lash", "hair", "braid", "wig", "bridal glam", "skincare", "wellness", "holistic health"]
  },
  {
    id: "bg-culinary",
    label: "Culinary, Baking & Catering",
    title: "Culinary, Baking & Catering",
    sub: "Baker, pastry chef, cottage food maker, caterer, private chef, charcuterie stylist, or recipe creator",
    desc: "Baker, pastry chef, cottage food maker, caterer, private chef, charcuterie stylist, or recipe creator",
    mappedSkills: ["culinary"],
    keywords: ["bakery", "baking", "banana bread", "sourdough", "cookie", "cake", "catering", "charcuterie", "grazing", "chef", "food", "meal prep", "culinary"]
  },
  {
    id: "bg-event-planning",
    label: "Event Planning & Coordination",
    title: "Event Planning & Coordination",
    sub: "Intimate, social, or corporate event planner, wedding coordinator, luxury picnic stylist, or balloon designer",
    desc: "Intimate, social, or corporate event planner, wedding coordinator, luxury picnic stylist, or balloon designer",
    mappedSkills: ["event_planning"],
    keywords: ["event planning", "event planner", "day-of coordination", "balloon", "backdrop", "picnic", "tablescape", "intimate", "wedding"]
  },
  {
    id: "bg-entertainment",
    label: "Live Event MC, Hosting & DJ",
    title: "Live Event MC, Hosting & DJ",
    sub: "Master of Ceremonies (MC), wedding/gala host, corporate panel moderator, event DJ, or stage speaker",
    desc: "Master of Ceremonies (MC), wedding/gala host, corporate panel moderator, event DJ, or stage speaker",
    mappedSkills: ["mc_dj"],
    keywords: ["event mc", "live host", "gala moderator", "event dj", "curated sound", "dj", "emcee"]
  },
  {
    id: "bg-crafts-maker",
    label: "Artisan Crafts & Product Making",
    title: "Artisan Crafts & Product Making",
    sub: "Jesmonite/resin/concrete decor maker, candle/soap artisan, custom gift box curator, or Cricut maker",
    desc: "Jesmonite/resin/concrete decor maker, candle/soap artisan, custom gift box curator, or Cricut maker",
    mappedSkills: ["crafts"],
    keywords: ["jesmonite", "concrete", "home decor", "makers keep", "candle", "craft", "handmade", "gift box", "retail stockist"]
  },
  {
    id: "bg-design-media",
    label: "Graphic Design, Photo & Video",
    title: "Graphic Design, Photo & Video",
    sub: "Graphic/Canva designer, brand identity designer, family/event photographer, or videographer",
    desc: "Graphic/Canva designer, brand identity designer, family/event photographer, or videographer",
    mappedSkills: ["design_photo"],
    keywords: ["photographer", "photography", "printable", "etsy digital", "canva", "graphic design", "ux/ui", "kdp"]
  },
  {
    id: "bg-tech",
    label: "Tech, IT, Data & UX/UI",
    title: "Tech, IT, Data & UX/UI",
    sub: "Software engineer, data/business analyst, product manager, UX/UI designer, QA, or IT/systems admin",
    desc: "Software engineer, data/business analyst, product manager, UX/UI designer, QA, or IT/systems admin",
    mappedSkills: ["tech"],
    keywords: ["ai workflow", "crm", "no-code", "automation", "data analytics", "kpi dashboard", "ux/ui", "website redesign", "shopify", "operations"]
  },
  {
    id: "bg-finance",
    label: "Finance, Accounting & Insurance",
    title: "Finance, Accounting & Insurance",
    sub: "CPA, accountant, bookkeeper, financial advisor, banker, insurance agent, tax preparer, or payroll",
    desc: "CPA, accountant, bookkeeper, financial advisor, banker, insurance agent, tax preparer, or payroll",
    mappedSkills: ["finance"],
    keywords: ["financial advisor", "insurance", "wealth", "mortgage", "bookkeeping", "property tax"]
  },
  {
    id: "bg-project-management",
    label: "Project Management & Operations",
    title: "Project Management & Operations",
    sub: "Project/program manager (PMP/Agile/Scrum), PMO lead, operations manager, or workflow/SOP specialist",
    desc: "Project/program manager (PMP/Agile/Scrum), PMO lead, operations manager, or workflow/SOP specialist",
    mappedSkills: ["organization"],
    keywords: ["project management", "project manager", "operations", "sop", "fractional project", "launch manager", "government contract", "workflow"]
  },
  {
    id: "bg-hr-admin",
    label: "HR, Recruiting & Executive Admin",
    title: "HR, Recruiting & Executive Admin",
    sub: "HR manager, corporate or agency recruiter, talent acquisition, executive assistant, or Chief of Staff",
    desc: "HR manager, corporate or agency recruiter, talent acquisition, executive assistant, or Chief of Staff",
    mappedSkills: ["organization", "coaching_consulting"],
    keywords: ["recruiting", "hr, operations", "career", "resume", "salary negotiation", "corporate workshop", "credentialing"]
  },
  {
    id: "bg-marketing-social",
    label: "Marketing, Paid Ads & Social Media",
    title: "Marketing, Paid Ads & Social Media",
    sub: "Media buyer (Meta Ads, Google Ads, TikTok Ads, PPC), social media manager, UGC creator, PR, or brand marketer",
    desc: "Media buyer (Meta Ads, Google Ads, TikTok Ads, PPC), social media manager, UGC creator, PR, or brand marketer",
    mappedSkills: ["marketing"],
    keywords: ["media buyer", "meta ads", "google ads", "paid ads", "ppc", "social media", "ugc", "marketing", "brand", "email", "pr"]
  },
  {
    id: "bg-writing-nonprofit",
    label: "Writing, Grants & Nonprofit",
    title: "Writing, Grants & Nonprofit",
    sub: "Grant writer, nonprofit fundraising director, copywriter, editor, journalist, medical writer, or author",
    desc: "Grant writer, nonprofit fundraising director, copywriter, editor, journalist, medical writer, or author",
    mappedSkills: ["writing"],
    keywords: ["grant writer", "college admissions", "essay", "kdp", "resume", "medical writer", "author", "nonprofit"]
  },
  {
    id: "bg-research-academia",
    label: "Research, Academia & Analysis",
    title: "Research, Academia & Analysis",
    sub: "Academic researcher, university faculty/adjunct, clinical data analyst, market researcher, policy analyst, or research coordinator",
    desc: "Academic researcher, university faculty/adjunct, clinical data analyst, market researcher, policy analyst, or research coordinator",
    mappedSkills: ["writing", "organization", "tech"],
    keywords: ["research", "academic", "market research", "grant writer", "data analysis", "literature review", "medical writer", "scientific", "policy", "feasibility", "survey", "benchmarking"]
  },
  {
    id: "bg-sales-bizdev",
    label: "Sales, Retail & E-Commerce",
    title: "Sales, Retail & E-Commerce",
    sub: "Account executive, B2B/SaaS sales, customer success manager, retail buyer/manager, or e-commerce seller",
    desc: "Account executive, B2B/SaaS sales, customer success manager, retail buyer/manager, or e-commerce seller",
    mappedSkills: ["coaching_consulting", "marketing"],
    keywords: ["financial advisor", "recruiting", "business coach", "senior care placement", "government contract", "shopify", "wholesale"]
  },
  {
    id: "bg-counseling-socialwork",
    label: "Counseling, Therapy & Coaching",
    title: "Counseling, Therapy & Coaching",
    sub: "Licensed therapist (LMFT/LCSW/LPC), social worker, psychologist, life coach, or community/faith leader",
    desc: "Licensed therapist (LMFT/LCSW/LPC), social worker, psychologist, life coach, or community/faith leader",
    mappedSkills: ["coaching_consulting", "healthcare_care"],
    keywords: ["life, mindset", "senior care placement", "pediatric sleep", "holistic health", "college admissions", "corporate workshop", "credentialing"]
  },
  {
    id: "bg-education",
    label: "Education, Teaching & Tutoring",
    title: "Education, Teaching & Tutoring",
    sub: "Classroom teacher, professor, academic tutor, special education/SLP, curriculum writer, or homeschooler",
    desc: "Classroom teacher, professor, academic tutor, special education/SLP, curriculum writer, or homeschooler",
    mappedSkills: ["teaching"],
    keywords: ["tutoring", "college admissions", "scholarship", "kdp", "workbook", "pediatric sleep", "corporate workshop"]
  },
  {
    id: "bg-legal",
    label: "Legal, Compliance & Contracts",
    title: "Legal, Compliance & Contracts",
    sub: "Attorney, paralegal, contract/compliance manager, HR compliance, notary public, or policy analyst",
    desc: "Attorney, paralegal, contract/compliance manager, HR compliance, notary public, or policy analyst",
    mappedSkills: ["writing", "organization", "realestate_property"],
    keywords: ["grant writer", "government contract", "notary", "property tax", "transaction coordinator", "credentialing", "clinical consultant"]
  },
  {
    id: "bg-realestate",
    label: "Real Estate, Mortgage & Property",
    title: "Real Estate, Mortgage & Property",
    sub: "Realtor, mortgage loan officer/processor, transaction coordinator, leasing agent, or Airbnb/property manager",
    desc: "Realtor, mortgage loan officer/processor, transaction coordinator, leasing agent, or Airbnb/property manager",
    mappedSkills: ["realestate_property", "finance"],
    keywords: ["mortgage", "transaction coordinator", "co-host", "airbnb", "notary", "property tax"]
  },
  {
    id: "bg-interior-home",
    label: "Interior Design & Home Styling",
    title: "Interior Design & Home Styling",
    sub: "Interior designer, home stager, professional home organizer, move-in unpacker, or space planner",
    desc: "Interior designer, home stager, professional home organizer, move-in unpacker, or space planner",
    mappedSkills: ["home_local"],
    keywords: ["home decor", "home organization", "unpacking", "home staging", "interior styling", "interior design", "room design", "room refresh", "relocation"]
  },
  {
    id: "bg-homemaker",
    label: "Full-Time Homemaker / Stay-at-Home Mom",
    title: "Full-Time Homemaker / Stay-at-Home Mom",
    sub: "Managing household logistics, family schedules, budgets, meal prep, parenting, and community coordination",
    desc: "Managing household logistics, family schedules, budgets, meal prep, parenting, and community coordination",
    mappedSkills: ["home_local", "organization"],
    keywords: ["home organization", "cottage bakery", "pediatric sleep", "life, mindset", "etsy", "picnic"]
  }
];

window.LICENSING_OPTIONS = [
  {
    id: "open-licensed",
    label: "Open to a State License or Certification",
    title: "Open to a State License or Certification",
    sub: "If a license (like Financial Advising, Insurance, Mortgage MLO, or Esthetics/PMU) unlocks higher income, I am open to it or already hold one.",
    desc: "If a license (like Financial Advising, Insurance, Mortgage MLO, or Esthetics/PMU) unlocks higher income, I am open to it or already hold one."
  },
  {
    id: "quick-registration",
    label: "Quick Registrations Only (Under 1 Week)",
    title: "Quick Registrations Only (Under 1 Week)",
    sub: "Open to quick steps like a Notary commission, Cottage Food registration, or free Government Vendor portal.",
    desc: "Open to quick steps like a Notary commission, Cottage Food registration, or free Government Vendor portal."
  },
  {
    id: "no-licensing",
    label: "No Exams or Licenses (Start Now)",
    title: "No Exams or Licenses (Start Now)",
    sub: "Show me businesses I can launch right away using my current skills without taking any new state exams.",
    desc: "Show me businesses I can launch right away using my current skills without taking any new state exams."
  }
];

window.SKILL_CATEGORIES = [
  {
    id: "culinary",
    label: "Baking, Cooking & Catering",
    title: "Baking, Cooking & Catering",
    desc: "Banana bread, sourdough, custom cakes/cookies, charcuterie tables, catering, or meal prep",
    sub: "Banana bread, sourdough, custom cakes/cookies, charcuterie tables, catering, or meal prep",
    keywords: ["bakery", "baking", "banana bread", "sourdough", "cookie", "cake", "catering", "charcuterie", "grazing", "chef", "food", "culinary", "treat"]
  },
  {
    id: "beauty",
    label: "Beauty, Makeup, Hair & Skincare",
    title: "Beauty, Makeup, Hair & Skincare",
    desc: "Bridal/event MUA, permanent makeup (brows/lip blush), lashes, facials/skincare, hair, braids, or wigs",
    sub: "Bridal/event MUA, permanent makeup (brows/lip blush), lashes, facials/skincare, hair, braids, or wigs",
    keywords: ["beauty", "makeup", "mua", "pmua", "microblading", "brow", "lash", "esthetician", "skincare", "hair", "braid", "wig", "bridal"]
  },
  {
    id: "crafts",
    label: "Handmade Crafts & Artisan Decor",
    title: "Handmade Crafts & Artisan Decor",
    desc: "Casting Jesmonite/concrete home decor, pouring candles/soaps, custom gift boxes, or Cricut crafts",
    sub: "Casting Jesmonite/concrete home decor, pouring candles/soaps, custom gift boxes, or Cricut crafts",
    keywords: ["jesmonite", "concrete", "home decor", "makers keep", "candle", "craft", "handmade", "gift box", "artisan"]
  },
  {
    id: "event_planning",
    label: "Event Planning & Party Styling",
    title: "Event Planning & Party Styling",
    desc: "Coordinating intimate dinners, showers, weddings, corporate events, luxury picnics, or balloon setups",
    sub: "Coordinating intimate dinners, showers, weddings, corporate events, luxury picnics, or balloon setups",
    keywords: ["event planning", "event planner", "day-of", "coordinator", "intimate", "picnic", "tablescape", "balloon", "backdrop", "party"]
  },
  {
    id: "mc_dj",
    label: "Live Hosting, MCing & DJing",
    title: "Live Hosting, MCing & DJing",
    desc: "Hosting weddings/galas on the mic as an MC, moderating corporate panels, stage speaking, or event DJing",
    sub: "Hosting weddings/galas on the mic as an MC, moderating corporate panels, stage speaking, or event DJing",
    keywords: ["mc", "emcee", "live host", "moderator", "dj", "sound", "music", "entertainment", "gala"]
  },
  {
    id: "design_photo",
    label: "Graphic Design & Photography",
    title: "Graphic Design & Photography",
    desc: "Digital templates/printables in Canva, brand identities, family/brand photography, or video creation",
    sub: "Digital templates/printables in Canva, brand identities, family/brand photography, or video creation",
    keywords: ["design", "canva", "graphics", "branding", "printable", "photography", "photographer", "portrait", "visual"]
  },
  {
    id: "healthcare_care",
    label: "Healthcare, Nursing & Caregiving",
    title: "Healthcare, Nursing & Caregiving",
    desc: "Clinical consulting (MD/RN/NP), patient advocacy, PSW/senior care, pediatric sleep, or postpartum support",
    sub: "Clinical consulting (MD/RN/NP), patient advocacy, PSW/senior care, pediatric sleep, or postpartum support",
    keywords: ["medical", "healthcare", "clinical", "doctor", "nurse", "psw", "personal support", "senior care", "credentialing", "pediatric sleep", "postpartum"]
  },
  {
    id: "coaching_consulting",
    label: "Coaching, Mentoring & Advisory",
    title: "Coaching, Mentoring & Advisory",
    desc: "1-on-1 business, career, or life coaching, advising families or founders, recruiting, or client consulting",
    sub: "1-on-1 business, career, or life coaching, advising families or founders, recruiting, or client consulting",
    keywords: ["coach", "coaching", "consultant", "consulting", "advisor", "recruiting", "placement", "career", "business", "mindset"]
  },
  {
    id: "finance",
    label: "Finance, Bookkeeping & Wealth",
    title: "Finance, Bookkeeping & Wealth",
    desc: "Financial advising, insurance/wealth planning, QuickBooks bookkeeping, budgeting, or tax appeals",
    sub: "Financial advising, insurance/wealth planning, QuickBooks bookkeeping, budgeting, or tax appeals",
    keywords: ["financial", "finance", "insurance", "wealth", "bookkeeping", "accounting", "tax", "budget"]
  },
  {
    id: "organization",
    label: "Project Management & Operations",
    title: "Project Management & Operations",
    desc: "Managing project timelines/launches, building business workflows/SOPs, credentialing, or government bids",
    sub: "Managing project timelines/launches, building business workflows/SOPs, credentialing, or government bids",
    keywords: ["project management", "operations", "sop", "credentialing", "government contract", "admin", "systems", "launch"]
  },
  {
    id: "marketing",
    label: "Marketing, Paid Ads & Social Media",
    title: "Marketing, Paid Ads & Social Media",
    desc: "Media buying (Meta Ads, Google Ads, TikTok Ads), social media management, UGC content, email funnels, or PR",
    sub: "Media buying (Meta Ads, Google Ads, TikTok Ads), social media management, UGC content, email funnels, or PR",
    keywords: ["media buyer", "meta ads", "google ads", "paid ads", "ppc", "social media", "ugc", "marketing", "brand", "campaign"]
  },
  {
    id: "writing",
    label: "Writing, Grants & Editing",
    title: "Writing, Grants & Editing",
    desc: "Grant writing for nonprofits/businesses, college essays, executive resumes, KDP books, or copy editing",
    sub: "Grant writing for nonprofits/businesses, college essays, executive resumes, KDP books, or copy editing",
    keywords: ["grant", "writing", "writer", "essay", "resume", "kdp", "book", "publishing", "editing"]
  },
  {
    id: "teaching",
    label: "Teaching, Tutoring & Workshops",
    title: "Teaching, Tutoring & Workshops",
    desc: "Small-group tutoring pods, college prep, educational workbooks, or corporate Lunch-and-Learn trainings",
    sub: "Small-group tutoring pods, college prep, educational workbooks, or corporate Lunch-and-Learn trainings",
    keywords: ["teaching", "tutoring", "education", "curriculum", "workshop", "college", "scholarship", "workbook"]
  },
  {
    id: "home_local",
    label: "Home Decor, Styling & Organization",
    title: "Home Decor, Styling & Organization",
    desc: "Styling rooms, home decor & furniture layouts, home staging, decluttering closets/pantries, or move-in unpacking",
    sub: "Styling rooms, home decor & furniture layouts, home staging, decluttering closets/pantries, or move-in unpacking",
    keywords: ["home decor", "interior styling", "home staging", "room design", "room refresh", "home organization", "declutter", "unpacking", "downsizing"]
  },
  {
    id: "realestate_property",
    label: "Real Estate, Property & Closing",
    title: "Real Estate, Property & Closing",
    desc: "Airbnb/short-term rental co-hosting, real estate transaction coordination, mortgage, or loan signings",
    sub: "Airbnb/short-term rental co-hosting, real estate transaction coordination, mortgage, or loan signings",
    keywords: ["co-host", "airbnb", "transaction coordinator", "notary", "loan signing", "mortgage", "real estate"]
  },
  {
    id: "tech",
    label: "Tech, AI, Data & Websites",
    title: "Tech, AI, Data & Websites",
    desc: "CRM/no-code automations, KPI data dashboards, UX/UI design, or high-converting website/Shopify redesigns",
    sub: "CRM/no-code automations, KPI data dashboards, UX/UI design, or high-converting website/Shopify redesigns",
    keywords: ["tech", "ai", "automation", "crm", "data", "analytics", "dashboard", "ux/ui", "website", "shopify"]
  }
];

window.SKILL_DIRECTIONS = [
  {
    id: "monetize-existing",
    label: "Monetize My Existing Skills",
    title: "Monetize My Existing Skills",
    sub: "Fastest path to cash: prioritize ideas that directly use my selected skills and career background.",
    desc: "Fastest path to cash: prioritize ideas that directly use my selected skills and career background."
  },
  {
    id: "fresh-pivot",
    label: "Fresh Pivot Into Something New",
    title: "Fresh Pivot Into Something New",
    sub: "Avoid day-job burnout: match me to the hobbies and lived experiences I select in Section 05.",
    desc: "Avoid day-job burnout: match me to the hobbies and lived experiences I select in Section 05."
  },
  {
    id: "blend-both",
    label: "Blend My Skills With a New Interest",
    title: "Blend My Skills With a New Interest",
    sub: "Balance my existing capabilities from Section 04 with the hobbies and life experiences I select in Section 05.",
    desc: "Balance my existing capabilities from Section 04 with the hobbies and life experiences I select in Section 05."
  }
];

window.ENJOYED_ACTIVITIES = [
  {
    id: "act-baking-food",
    label: "Baking & Cooking from Scratch",
    title: "Baking & Cooking from Scratch",
    sub: "Making banana bread, sourdough, cakes, cookies, or pretty grazing boards in the kitchen for family and friends",
    desc: "Making banana bread, sourdough, cakes, cookies, or pretty grazing boards in the kitchen for family and friends",
    mappedSkills: ["culinary"],
    models: ["physical-product", "local-service"],
    keywords: ["bakery", "banana bread", "sourdough", "cookie", "catering", "charcuterie", "grazing", "food", "treat", "cake"]
  },
  {
    id: "act-beauty-glam",
    label: "Makeup, Hair & Skincare",
    title: "Makeup, Hair & Skincare",
    sub: "Watching beauty tutorials, doing friends' makeup or hair, styling wigs, brows/lashes, and skincare routines",
    desc: "Watching beauty tutorials, doing friends' makeup or hair, styling wigs, brows/lashes, and skincare routines",
    mappedSkills: ["beauty"],
    models: ["local-service", "physical-product"],
    keywords: ["makeup", "mua", "pmua", "microblading", "brow", "lash", "esthetician", "skincare", "hair", "braid", "wig", "bridal"]
  },
  {
    id: "act-crafting-decor",
    label: "DIY Crafts, Candles & Gift Making",
    title: "DIY Crafts, Candles & Gift Making",
    sub: "Working with my hands casting Jesmonite/resin trays, pouring candles or soaps, Cricut crafts, or gift boxes",
    desc: "Working with my hands casting Jesmonite/resin trays, pouring candles or soaps, Cricut crafts, or gift boxes",
    mappedSkills: ["crafts"],
    models: ["physical-product"],
    keywords: ["jesmonite", "concrete", "makers keep", "candle", "craft", "handmade", "gift"]
  },
  {
    id: "act-event-planning",
    label: "Planning Parties & Gatherings",
    title: "Planning Parties & Gatherings",
    sub: "Planning birthdays, baby showers, intimate dinners, tablescapes, or balloon setups that look magazine-worthy",
    desc: "Planning birthdays, baby showers, intimate dinners, tablescapes, or balloon setups that look magazine-worthy",
    mappedSkills: ["event_planning"],
    models: ["local-service"],
    keywords: ["event planning", "day-of", "coordinator", "picnic", "tablescape", "balloon", "backdrop"]
  },
  {
    id: "act-mc-dj",
    label: "Music Playlists, DJing & Hosting",
    title: "Music Playlists, DJing & Hosting",
    sub: "Being the life of the party: making playlists, DJing, speaking on a mic, and bringing warm energy to a crowd",
    desc: "Being the life of the party: making playlists, DJing, speaking on a mic, and bringing warm energy to a crowd",
    mappedSkills: ["mc_dj"],
    models: ["local-service"],
    keywords: ["event mc", "live host", "gala moderator", "event dj", "curated sound", "dj", "keynote", "voiceover"]
  },
  {
    id: "act-decluttering-home",
    label: "Home Decor, Room Styling & Organizing",
    title: "Home Decor, Room Styling & Organizing",
    sub: "Decorating rooms, styling furniture & cozy corners, organizing closets/pantries, and making a home feel calm",
    desc: "Decorating rooms, styling furniture & cozy corners, organizing closets/pantries, and making a home feel calm",
    mappedSkills: ["home_local"],
    models: ["local-service", "service"],
    keywords: ["home decor", "interior styling", "home staging", "room design", "room refresh", "home organization", "unpacking", "downsizing"]
  },
  {
    id: "act-realestate-hosting",
    label: "House Hunting, Airbnb & Real Estate",
    title: "House Hunting, Airbnb & Real Estate",
    sub: "Browsing property listings, hosting out-of-town guests in a furnished space, or following local real estate",
    desc: "Browsing property listings, hosting out-of-town guests in a furnished space, or following local real estate",
    mappedSkills: ["realestate_property"],
    models: ["service", "local-service", "licensed-advisory"],
    keywords: ["co-host", "airbnb", "transaction coordinator", "notary", "mortgage"]
  },
  {
    id: "act-fashion-styling",
    label: "Shopping, Styling Outfits & Dressing Up",
    title: "Shopping, Styling Outfits & Dressing Up",
    sub: "Curating looks, finding great deals, wardrobe styling, shopping for outfits, and helping friends look and feel confident",
    desc: "Curating looks, finding great deals, wardrobe styling, shopping for outfits, and helping friends look and feel confident",
    mappedSkills: ["beauty", "design_photo", "home_local"],
    models: ["local-service", "service"],
    keywords: ["personal stylist", "wardrobe consultant", "personal shopper", "fashion stylist", "capsule wardrobe", "closet edit", "shopping", "outfit styling"]
  },
  {
    id: "act-digital-design",
    label: "Photography & Designing in Canva",
    title: "Photography & Designing in Canva",
    sub: "Snapping family photos, designing cute invitations/planners in Canva, picking color palettes, or styling visuals",
    desc: "Snapping family photos, designing cute invitations/planners in Canva, picking color palettes, or styling visuals",
    mappedSkills: ["design_photo"],
    models: ["digital-product", "local-service", "service"],
    keywords: ["printable", "etsy", "kdp", "workbook", "photographer", "ux/ui", "website"]
  },
  {
    id: "act-marketing-social",
    label: "Filming Reels & Social Trends",
    title: "Filming Reels & Social Trends",
    sub: "Filming aesthetic day-in-the-life or product clips, testing social ad creatives, and growing pages online",
    desc: "Filming aesthetic day-in-the-life or product clips, testing social ad creatives, and growing pages online",
    mappedSkills: ["marketing"],
    models: ["service"],
    keywords: ["social media", "ugc", "reels", "tiktok", "meta ads", "paid social"]
  },
  {
    id: "act-coaching",
    label: "Heart-to-Heart Pep Talks & Advice",
    title: "Heart-to-Heart Pep Talks & Advice",
    sub: "Being the friend everyone calls for advice: listening deeply, talking through life/career decisions, and cheering them on",
    desc: "Being the friend everyone calls for advice: listening deeply, talking through life/career decisions, and cheering them on",
    mappedSkills: ["coaching_consulting"],
    models: ["service", "licensed-advisory"],
    keywords: ["coach", "coaching", "consultant", "advisor", "career", "life, mindset", "business coach"]
  },
  {
    id: "act-teaching-kids",
    label: "Teaching Kids & Fun Learning",
    title: "Teaching Kids & Fun Learning",
    sub: "Helping kids or adults finally understand a subject, reading together, making fun worksheets, or guiding teens",
    desc: "Helping kids or adults finally understand a subject, reading together, making fun worksheets, or guiding teens",
    mappedSkills: ["teaching"],
    models: ["service", "digital-product"],
    keywords: ["tutoring", "college admissions", "scholarship", "kdp", "workbook", "corporate workshop"]
  },
  {
    id: "act-healthcare-support",
    label: "Caring for Babies, Moms & Seniors",
    title: "Caring for Babies, Moms & Seniors",
    sub: "Soothing newborns, checking in on postpartum moms, or helping older adults and patients feel calm and cared for",
    desc: "Soothing newborns, checking in on postpartum moms, or helping older adults and patients feel calm and cared for",
    mappedSkills: ["healthcare_care"],
    models: ["service", "local-service", "licensed-advisory"],
    keywords: ["senior care", "psw", "personal support", "clinical", "medical", "credentialing", "pediatric sleep", "postpartum", "healthcare"]
  },
  {
    id: "act-backoffice-writing",
    label: "Quiet Reading, Research & Writing",
    title: "Quiet Reading, Research & Writing",
    sub: "Going down research rabbit holes with a cup of coffee, journaling, writing stories or guides, and editing solo",
    desc: "Going down research rabbit holes with a cup of coffee, journaling, writing stories or guides, and editing solo",
    mappedSkills: ["writing"],
    models: ["service", "digital-product"],
    keywords: ["grant writer", "kdp", "essay", "resume", "email marketing", "medical writer"]
  },
  {
    id: "act-finance-investing",
    label: "Family Budgeting & Money Tips",
    title: "Family Budgeting & Money Tips",
    sub: "Tracking family budgets, comparing savings/insurance options, finding ways to build wealth, and loving numbers",
    desc: "Tracking family budgets, comparing savings/insurance options, finding ways to build wealth, and loving numbers",
    mappedSkills: ["finance"],
    models: ["service", "licensed-advisory"],
    keywords: ["financial advisor", "insurance", "wealth", "bookkeeping", "property tax"]
  },
  {
    id: "act-systems-brokering",
    label: "Planners, Checklists & Tech Apps",
    title: "Planners, Checklists & Tech Apps",
    sub: "Color-coding planners, organizing digital folders, building checklists, and finding smart apps that save time",
    desc: "Color-coding planners, organizing digital folders, building checklists, and finding smart apps that save time",
    mappedSkills: ["organization", "tech"],
    models: ["service"],
    keywords: ["project manager", "ai workflow", "operations", "data analytics", "government contract"]
  }
];

window.LIVED_EXPERIENCES = [
  {
    id: "life-baby-postpartum",
    label: "Newborn Sleep & Postpartum",
    title: "Newborn Sleep & Postpartum",
    sub: "Navigating baby sleep, breastfeeding, postpartum recovery, or gentle toddler routines and figuring out what works",
    desc: "Navigating baby sleep, breastfeeding, postpartum recovery, or gentle toddler routines and figuring out what works",
    mappedSkills: ["healthcare_care", "coaching_consulting"],
    keywords: ["pediatric sleep", "postpartum", "holistic health", "newborn"]
  },
  {
    id: "life-education",
    label: "Kids' Schooling, IEPs or College Prep",
    title: "Kids' Schooling, IEPs or College Prep",
    sub: "Teaching my own kids at home, advocating for school support, or guiding a teen through college applications",
    desc: "Teaching my own kids at home, advocating for school support, or guiding a teen through college applications",
    mappedSkills: ["teaching", "writing"],
    keywords: ["tutoring", "college admissions", "scholarship", "kdp", "printable"]
  },
  {
    id: "life-baby-senior",
    label: "Aging Parents & Medical Advocacy",
    title: "Aging Parents & Medical Advocacy",
    sub: "Helping an aging parent find home care or assisted living, or advocating for a loved one in the hospital",
    desc: "Helping an aging parent find home care or assisted living, or advocating for a loved one in the hospital",
    mappedSkills: ["healthcare_care"],
    keywords: ["senior care", "psw", "personal support", "clinical", "credentialing", "patient advocate"]
  },
  {
    id: "life-wealth",
    label: "Family Budgeting & Paying Off Debt",
    title: "Family Budgeting & Paying Off Debt",
    sub: "Stretching a one-income budget, paying off debt, or setting up life insurance and savings for our family",
    desc: "Stretching a one-income budget, paying off debt, or setting up life insurance and savings for our family",
    mappedSkills: ["finance"],
    keywords: ["financial advisor", "bookkeeping", "property tax"]
  },
  {
    id: "life-home-move",
    label: "Buying a Home, Moving or Hosting",
    title: "Buying a Home, Moving or Hosting",
    sub: "Navigating buying or selling a home, managing a rental property, or coordinating a major family relocation",
    desc: "Navigating buying or selling a home, managing a rental property, or coordinating a major family relocation",
    mappedSkills: ["realestate_property", "finance"],
    keywords: ["mortgage", "transaction coordinator", "co-host", "airbnb", "notary"]
  },
  {
    id: "life-events-ent",
    label: "Weddings & Family Celebrations",
    title: "Weddings & Family Celebrations",
    sub: "Planning our own wedding, baby showers, or milestone birthdays and coordinating the decor, food, and music",
    desc: "Planning our own wedding, baby showers, or milestone birthdays and coordinating the decor, food, and music",
    mappedSkills: ["event_planning", "mc_dj", "culinary"],
    keywords: ["event planning", "day-of", "balloon", "backdrop", "picnic", "tablescape", "event mc", "event dj", "catering", "cake"]
  },
  {
    id: "life-crafts-decor",
    label: "Home Decor, Nesting & Decluttering",
    title: "Home Decor, Nesting & Decluttering",
    sub: "Decorating and styling our home on a budget, setting up a nursery/playroom, or organizing closets and pantries",
    desc: "Decorating and styling our home on a budget, setting up a nursery/playroom, or organizing closets and pantries",
    mappedSkills: ["home_local", "crafts"],
    keywords: ["home decor", "interior styling", "home staging", "room design", "room refresh", "home organization", "unpacking", "jesmonite", "candle"]
  },
  {
    id: "life-beauty",
    label: "Postpartum Hair, Skin & 10-Min Glam",
    title: "Postpartum Hair, Skin & 10-Min Glam",
    sub: "Figuring out my own skin, hair, wig/braid, or quick makeup routine that friends always ask me to teach them",
    desc: "Figuring out my own skin, hair, wig/braid, or quick makeup routine that friends always ask me to teach them",
    mappedSkills: ["beauty"],
    keywords: ["makeup", "mua", "pmua", "brow", "lash", "esthetician", "skincare", "hair", "braid", "wig", "bridal"]
  },
  {
    id: "life-career-tech",
    label: "Career Pivot & Working-Mom Balance",
    title: "Career Pivot & Working-Mom Balance",
    sub: "Navigating maternity leave return, corporate burnout, starting over after a life shift, or work-life boundaries",
    desc: "Navigating maternity leave return, corporate burnout, starting over after a life shift, or work-life boundaries",
    mappedSkills: ["coaching_consulting", "organization"],
    keywords: ["life, mindset", "career", "resume", "business coach", "corporate workshop", "project manager"]
  }
];

window.HARD_DEALBREAKERS = [
  {
    id: "no-social-video",
    label: "No Showing My Face on Social Media",
    title: "No Showing My Face on Social Media",
    desc: "Filter out businesses that rely on personal reels or daily on-camera content",
    sub: "Filter out businesses that rely on personal reels or daily on-camera content"
  },
  {
    id: "no-cold-calling",
    label: "No Cold Calling on the Phone",
    title: "No Cold Calling on the Phone",
    desc: "Filter out heavy outbound phone sales",
    sub: "Filter out heavy outbound phone sales"
  },
  {
    id: "no-driving",
    label: "No Local Driving or On-Site Setups",
    title: "No Local Driving or On-Site Setups",
    desc: "Keep my business 100% remote from home",
    sub: "Keep my business 100% remote from home"
  },
  {
    id: "no-inventory",
    label: "No Physical Inventory or Shipping",
    title: "No Physical Inventory or Shipping",
    desc: "No storing products, kitchen prep, or packing orders",
    sub: "No storing products, kitchen prep, or packing orders"
  },
  {
    id: "no-live-calls",
    label: "No Fixed Live Call Schedules",
    title: "No Fixed Live Call Schedules",
    desc: "Filter out live coaching/consulting calls so I can work during nap times or late nights",
    sub: "Filter out live coaching/consulting calls so I can work during nap times or late nights"
  },
  {
    id: "no-licensing",
    label: "No State Licensing Exams",
    title: "No State Licensing Exams",
    desc: "Only show businesses I can launch right away without taking state exams",
    sub: "Only show businesses I can launch right away without taking state exams"
  }
];

/**
 * Comprehensive built-in Vault spanning Licensed High-Earning Professions,
 * B2B Contracting, Healthcare/Senior Services, Real Estate/Co-Hosting,
 * Local Businesses, Physical Products, and Digital Assets.
 */
window.DEFAULT_VAULT_IDEAS = [
  {
    id: "idea-1",
    name: "Independent Financial Advisor & Insurance / Wealth Strategist",
    category: "Licensed Financial & Wealth Services",
    businessModel: "licensed-advisory",
    skills: ["finance", "coaching_consulting"],
    minHoursPerWeek: 8,
    optimalHoursPerWeek: 20,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 65000,
    workStyle: "client-facing",
    startupCost: 300,
    incomeModel: "Commission & Advisory Fees ($1,200 to $6,500+ per family/business policy or rollover)",
    avgUnitRevenue: 2400,
    unitLabel: "policies or client plans placed",
    hoursPerUnitPerWeek: 2,
    description: "Educate families and small business owners on life insurance (IUL, term), annuities, college/retirement rollovers, and wealth protection strategies. Mom of 3 Bridget generated $800,000 in one year in this exact field by helping families protect and grow their assets.",
    targetAudience: "Families with children, self-employed business owners, nurses/professionals rolling over 401(k)s",
    requirements: [
      "Requires passing your state or provincial Life & Health Insurance license (and Series 6/63/65 or SIE if offering investment advisory)",
      "Background check and Fingerprinting (~$150 to $350 exam and licensing fee)",
      "Affiliation with a reputable IMO, broker-dealer, or financial agency that provides product training and compliance"
    ],
    tradeoffs: [
      "Pros: Uncapped six-figure income ceiling ($10k to $65k+/mo) with residual renewal income and flexible appointment hours.",
      "Tradeoff: Requires 2 to 4 weeks upfront to study and pass your state licensing exam before you can legally sell policies; income is commission-based."
    ],
    quickTestStrategy: "Before paying for courses, interview 2 reputable independent financial brokerage agencies that sponsor new agents, verify their commission split (aim for 70% to 100%+ contract levels), and shadow 2 educational client workshops.",
    first30DaysFocus: "Complete your pre-licensing study course in 14 days, pass your state exam, and host your first 5 'Family Protection & Tax-Free Retirement' educational sessions."
  },
  {
    id: "idea-2",
    name: "Remote Mortgage Loan Originator (MLO) / Loan Officer",
    category: "Licensed Real Estate & Finance",
    businessModel: "licensed-advisory",
    skills: ["finance", "realestate_property", "coaching_consulting"],
    minHoursPerWeek: 8,
    optimalHoursPerWeek: 20,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 35000,
    workStyle: "client-facing",
    startupCost: 350,
    incomeModel: "Basis-Point Commission ($3,000 to $6,000 average commission per home loan closed)",
    avgUnitRevenue: 4000,
    unitLabel: "home loans originated",
    hoursPerUnitPerWeek: 3,
    description: "Help homebuyers and homeowners qualify for mortgages or refinances from home. Closing just 2 home loans per month at a $400,000 loan size typically pays $6,000 to $9,000+ in commission.",
    targetAudience: "First-time homebuyers, growing families upgrading homes, real estate investors, and local realtors",
    requirements: [
      "Requires NMLS SAFE Act 20-hour pre-licensing course and passing the NMLS exam",
      "State MLO license (~$300 to $450 total with background/credit check)",
      "Sponsorship under a licensed mortgage broker who handles processing and underwriting"
    ],
    tradeoffs: [
      "Pros: Just 1 to 2 closed loans per month can replace a full corporate salary.",
      "Tradeoff: Requires NMLS licensing upfront and a 30-day escrow cycle before your first closing check pays out."
    ],
    quickTestStrategy: "Coffee-chat 3 local real estate agents and 1 independent mortgage broker to learn what loan programs (FHA, VA, self-employed bank statement loans) buyers need most in your market.",
    first30DaysFocus: "Complete your 20-hour NMLS course and partner with 5 active buyer's agents to pre-approve their weekend open-house leads."
  },
  {
    id: "idea-3",
    name: "Senior Care Placement & Assisted Living Referral Advisor",
    category: "Healthcare & Family Advisory",
    businessModel: "licensed-advisory",
    skills: ["healthcare_care", "coaching_consulting"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 25000,
    workStyle: "client-facing",
    startupCost: 100,
    incomeModel: "Community Placement Fee ($3,000 to $5,000 paid by the senior living facility per placement, 100% free to families)",
    avgUnitRevenue: 3800,
    unitLabel: "senior family placements",
    hoursPerUnitPerWeek: 3,
    description: "Guide overwhelmed adult children through choosing the right assisted living or memory care community for their aging parents. Your service is 100% free to the family because the senior living community pays you a referral fee (typically 70% to 100% of the first month's rent).",
    targetAudience: "Adult children caring for aging parents, hospital discharge planners, elder law attorneys",
    requirements: [
      "Signed referral agreements with 10 to 15 local assisted living and memory care communities",
      "Check state regulations (a few states require a basic registry or CSA certification)",
      "Compassionate phone/in-person guidance for families in transition"
    ],
    tradeoffs: [
      "Pros: Deeply meaningful work where 2 placements a month equals $7,000 to $9,000/month, and families never pay out of pocket.",
      "Tradeoff: Payout occurs 30 days after the senior moves into the community."
    ],
    quickTestStrategy: "Tour 5 local assisted living communities, meet their Community Relations Directors, and request their standard Independent Referral Agency agreement.",
    first30DaysFocus: "Sign referral agreements with 10 local communities and introduce your free placement service to 5 elder law attorneys and hospital social workers."
  },
  {
    id: "idea-4",
    name: "Mid-Term Furnished Rental & Airbnb Co-Host (Travel Nurses / Relocations)",
    category: "Real Estate & Property Management",
    businessModel: "service",
    skills: ["realestate_property", "organization"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 20000,
    workStyle: "both",
    startupCost: 0,
    incomeModel: "15% to 25% Management Fee of Gross Monthly Booking Revenue ($500 to $1,000/mo per property without owning real estate)",
    avgUnitRevenue: 700,
    unitLabel: "co-hosted properties",
    hoursPerUnitPerWeek: 1,
    description: "Manage guest communication, FurnishedFinder/Airbnb listings, and cleaner scheduling for property owners renting to 30-to-90 day travel nurses, insurance displaced families, and corporate relocations. You don't need to own property or sign leases.",
    targetAudience: "Out-of-state landlords, busy doctors/professionals with a guest house or rental property",
    requirements: [
      "Check state property management rules (co-hosting under the owner's payout account is allowed in most areas without a broker license)",
      "Reliable local cleaner and handyman on call",
      "Smartphone for guest messaging and digital lock codes"
    ],
    tradeoffs: [
      "Pros: True recurring monthly income without buying property or paying rent; 30+ day stays mean only 1 turnover every few months.",
      "Tradeoff: Occasional urgent guest messages if an appliance or lock needs attention."
    ],
    quickTestStrategy: "Look up 15 tired landlords listing furnished homes on Zillow or FurnishedFinder and offer to manage their guest screening, pricing, and cleaner coordination for 20% of bookings.",
    first30DaysFocus: "Sign your first 2 to 3 co-hosting properties and list them across Airbnb, FurnishedFinder, and corporate housing networks."
  },
  {
    id: "idea-5",
    name: "Boutique Healthcare, Dental or Specialized Recruiting Agency",
    category: "B2B Staffing & Recruiting",
    businessModel: "licensed-advisory",
    skills: ["coaching_consulting", "healthcare_care", "organization"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 15,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 35000,
    workStyle: "both",
    startupCost: 100,
    incomeModel: "Direct-Hire Placement Fee (15% to 20% of candidate's first-year salary = $9,000 to $18,000 per placement)",
    avgUnitRevenue: 10000,
    unitLabel: "direct-hire placements",
    hoursPerUnitPerWeek: 4,
    description: "Source and match hard-to-find professionals (such as dental hygienists, nurse practitioners, CPAs, or bilingual operations managers) with private practices and small companies that pay you a placement fee only when they hire your candidate.",
    targetAudience: "Private dental/medical practices, law firms, accounting firms, and engineering companies",
    requirements: [
      "1-page Direct-Hire Contingency Fee Agreement",
      "LinkedIn and niche job boards to message qualified candidates",
      "5 to 10 hours/week for candidate screening and client introductions"
    ],
    tradeoffs: [
      "Pros: One single placement every month or two pays $9,000 to $15,000+.",
      "Tradeoff: Contingency model means you only get paid when the candidate accepts the job and starts."
    ],
    quickTestStrategy: "Search Indeed for private dental or medical clinics in your state that have had a 'Hiring Dental Hygienist / NP' ad up for 30+ days. Call or email the practice manager asking if they'd pay a flat placement fee if you bring them a licensed candidate this month.",
    first30DaysFocus: "Sign 3 clinics/firms on a 15% fee agreement and message 40 local licensed professionals on LinkedIn."
  },
  {
    id: "idea-6",
    name: "Government & Corporate Contract Vendor (Woman-Owned Small Business)",
    category: "B2B & Government Contracting",
    businessModel: "licensed-advisory",
    skills: ["organization", "finance", "coaching_consulting"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 15,
    easeOf5k: 3,
    maxMonthlyIncomePotential: 40000,
    workStyle: "behind-the-scenes",
    startupCost: 150,
    incomeModel: "Middleman / Subcontracting Margin (15% to 30% net profit on $15,000 to $100,000+ micro-purchases and supply contracts)",
    avgUnitRevenue: 4500,
    unitLabel: "fulfilled supply/service contracts",
    hoursPerUnitPerWeek: 3,
    description: "Register as a Woman-Owned Small Business (WOSB) to bid on city, school district, county, and federal micro-contracts (under $10,000 to $25,000) supplying office goods, event staffing, translation, or commercial maintenance using wholesale distributors or local subcontractors.",
    targetAudience: "Local school districts, city/county municipalities, universities, and state agencies",
    requirements: [
      "LLC formation, EIN, and free SAM.gov / local city vendor registration",
      "Optional WOSB (Woman-Owned Small Business) certification for set-aside contracts",
      "Comfort reading bid sheets and getting quotes from wholesale suppliers"
    ],
    tradeoffs: [
      "Pros: Government agencies are legally mandated to award a percentage of contracts to Woman-Owned Small Businesses.",
      "Tradeoff: Takes 30 to 60 days to complete vendor registration and win your first bid."
    ],
    quickTestStrategy: "Register for free on your city and local school district's Vendor Portal and review the last 20 awarded 'Micro-Purchase / Quick Quote' bids under $25,000 to see what they buy every month.",
    first30DaysFocus: "Complete your local vendor and SAM.gov registration and submit 5 quotes on small municipal supply or service requests."
  },
  {
    id: "idea-7",
    name: "Medical Provider Credentialing & Insurance Enrollment Specialist",
    category: "Healthcare Admin & Operations",
    businessModel: "service",
    skills: ["healthcare_care", "organization"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 16000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Per-Provider Setup Package ($1,200 to $2,500) + Monthly Maintenance ($350/mo per clinic)",
    avgUnitRevenue: 1500,
    unitLabel: "provider credentialing setups",
    hoursPerUnitPerWeek: 2,
    description: "Handle the CAQH, NPI, Medicare, and private insurance panel enrollment paperwork for therapists, nurse practitioners, speech pathologists, and doctors opening private practices.",
    targetAudience: "Mental health therapists, nurse practitioners, physical therapists, and group practices",
    requirements: [
      "Strong attention to detail with forms, NPI/CAQH portals, and follow-up tracking",
      "100% home-based computer work",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Therapists and doctors cannot bill insurance until credentialed, making this a high-priority $1,500+ service with zero marketing fluff.",
      "Tradeoff: Insurance companies take 60 to 90 days to approve panels, requiring organized status tracking."
    ],
    quickTestStrategy: "Join 2 state Facebook groups for private-practice therapists or nurse practitioners and offer a flat-rate '5 Insurance Panel Credentialing Package' for $1,250.",
    first30DaysFocus: "Create a master Credentialing Document Checklist and onboard your first 3 private-practice clinicians."
  },
  {
    id: "idea-8",
    name: "Local Boutique Event Rental & Balloon / Backdrop Setup",
    category: "Events, Entertainment & Hospitality",
    businessModel: "local-service",
    skills: ["event_planning", "crafts"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 14000,
    workStyle: "client-facing",
    startupCost: 150,
    incomeModel: "Event Packages & Rentals ($350 to $1,200 per weekend party/shower)",
    avgUnitRevenue: 550,
    unitLabel: "weekend event bookings",
    hoursPerUnitPerWeek: 1.5,
    description: "Provide photo-ready balloon garlands, marquee letters, luxury picnic setups, soft-play toddler zones, or custom backdrops for baby showers, first birthdays, and corporate events.",
    targetAudience: "Local moms planning birthdays, brides/baby shower hosts, schools, and local boutiques",
    requirements: [
      "Electric balloon pump, reusable backdrop frame, and professional-grade balloons (~$150)",
      "Reliable car/SUV space to transport setups or offer 'Grab-and-Go' garlands from your porch",
      "Availability for 2 to 4 hours on Friday afternoons or Saturday mornings"
    ],
    tradeoffs: [
      "Pros: Fast cash flow. Booking just 3 events in your first 2 weeks brings in $1,500+ immediately.",
      "Tradeoff: Requires physical setup and weekend delivery windows (unless you sell Grab-and-Go garlands for porch pickup)."
    ],
    quickTestStrategy: "Stage 1 sample setup in your living room or backyard, take bright natural-light photos, and post in 3 local neighborhood/parent groups taking bookings for the next 2 weekends.",
    first30DaysFocus: "Create 3 clear tiered packages ('Grab & Go Garland' at $175, 'Signature Backdrop Setup' at $495, 'Full Luxe Party Package' at $850) and partner with 3 local venues or bakers."
  },
  {
    id: "idea-9",
    name: "Professional Home Organization, Decluttering & Space Styling Service",
    category: "Home Decor, Interior Styling & Organization",
    businessModel: "local-service",
    skills: ["home_local"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 15000,
    workStyle: "client-facing",
    startupCost: 50,
    incomeModel: "Single-Space Makeover ($395 to $650) or Full Home Organization & Styling ($1,200 to $2,500)",
    avgUnitRevenue: 650,
    unitLabel: "organizing & styling sessions",
    hoursPerUnitPerWeek: 1.5,
    description: "Transform pantries, playrooms, closets, and nurseries with elevated storage systems and functional home styling, or unpack and organize kitchens in a single day for busy families.",
    targetAudience: "Busy dual-income families, new moms nesting, and families refreshing or moving into a home",
    requirements: [
      "Label maker, basic toolkit, and eye for functional storage systems (~$50)",
      "4-hour daytime blocks (for example, during school hours 9am to 1pm)",
      "Before/after photos of 2 to 3 spaces in your own home to start"
    ],
    tradeoffs: [
      "Pros: Fast 2-week cash flow ($65 to $100/hr) and customers reimburse you separately for all storage bins.",
      "Tradeoff: In-person physical work inside clients' homes during daytime hours."
    ],
    quickTestStrategy: "Photograph 2 before/after spaces in your own or a friend's home (pantry + playroom) and offer a flat-rate '4-Hour Pantry or Playroom Reset' in your local community this week.",
    first30DaysFocus: "Connect with 5 local real estate agents and moving companies to become their go-to 'Day-1 Move-In Unpacking & Kitchen Setup' partner."
  },
  {
    id: "idea-10",
    name: "Etsy Printables, Planners & Digital Download Shop",
    category: "Digital Products & E-Commerce",
    businessModel: "digital-product",
    skills: ["design_photo", "tech"],
    minHoursPerWeek: 3,
    optimalHoursPerWeek: 8,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 12000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Digital Downloads & Bundles ($9 to $47 per order, 90%+ profit margin)",
    avgUnitRevenue: 24,
    unitLabel: "bundle sales",
    hoursPerUnitPerWeek: 0.04,
    description: "Create downloadable PDFs, family command-center printables, wedding signage templates, classroom decor, or small business templates once in Canva and sell them repeatedly on Etsy or your own shop with zero shipping.",
    targetAudience: "Busy parents, teachers, brides, party hosts, and small business owners",
    requirements: [
      "Free Canva account and basic eye for clean layouts",
      "3 to 8 hours/week to research keywords and upload listings",
      "$0.20 per Etsy listing fee (or free with referral link)"
    ],
    tradeoffs: [
      "Pros: 100% passive fulfillment once uploaded; zero shipping or inventory.",
      "Tradeoff: Takes 30 to 60 days of consistent listing (20 to 30 items) before search traffic compounds into significant daily revenue."
    ],
    quickTestStrategy: "Research 5 bestseller printable niches on Etsy using search autocomplete. Create 1 cohesive 10-page bundle (instead of 1 single sheet) and list 5 variations this week.",
    first30DaysFocus: "Publish your first 20 high-demand listings focused on seasonal or milestone events (birthdays, weddings, back-to-school, organization) and turn on automatic review coupon follow-ups."
  },
  {
    id: "idea-11",
    name: "Cottage Bakery / Specialty Banana Bread, Sourdough & Custom Treat Drops",
    category: "Food, Baking & Culinary",
    businessModel: "physical-product",
    skills: ["culinary"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 9500,
    workStyle: "behind-the-scenes",
    startupCost: 100,
    incomeModel: "Weekly Batch Drops ($20 to $35/loaf or $45/box) + Custom & Corporate Gift Orders ($65 to $120)",
    avgUnitRevenue: 110,
    unitLabel: "custom orders or presale bundles",
    hoursPerUnitPerWeek: 0.4,
    description: "Operate from your home kitchen under Cottage Food rules, selling signature banana bread loaves, sourdough micro-bakery drops, decorated cookies, or corporate treat boxes. Rasheeda launched her banana bread business from home and sold out her entire first batch of 22 loaves in just 1 week.",
    targetAudience: "Local families, neighbors, realtors buying closing gifts, corporate offices, and weekend hosts",
    requirements: [
      "Home kitchen compliance with local Cottage Food labeling rules",
      "Loaf pans/mixer, clean kraft packaging boxes, and custom labels (~$50 to $100)",
      "6 to 12 hours/week for batch baking, packaging, and Friday/Saturday pickup or delivery"
    ],
    tradeoffs: [
      "Pros: Fastest 7-day validation in the Vault. Rasheeda sold out 22 banana bread loaves in Week 1 using a simple presale drop.",
      "Tradeoff: Hands-on kitchen time per batch; scaling past $4k/mo works best by combining weekly batch drops with corporate/realtor gift boxes."
    ],
    quickTestStrategy: "Announce a limited 'Batch #1: 20 Signature Loaves / Treat Boxes Only' Friday pickup drop to your personal network and local community group, collecting payment upfront before baking.",
    first30DaysFocus: "Run 4 weekly sold-out batch drops while introducing a 'Corporate & Realtor Client Appreciation Box' for recurring bulk orders."
  },
  {
    id: "idea-12",
    name: "Small-Group Academic Tutoring / Reading & Study Skills Pods",
    category: "Education & Teaching",
    businessModel: "service",
    skills: ["teaching"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 10000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "Monthly Student Enrollment ($240 to $450/mo per student in 3 to 4 student pods)",
    avgUnitRevenue: 320,
    unitLabel: "enrolled students",
    hoursPerUnitPerWeek: 0.4,
    description: "Teach early reading, math confidence, Spanish, or study skills in small 3-to-4 student virtual or in-person pods, earning 3x more per hour than 1-on-1 tutoring while keeping tuition affordable for parents.",
    targetAudience: "Parents of elementary/middle school students and homeschooling families",
    requirements: [
      "Strong comfort teaching a specific subject (reading, math, writing, or test prep)",
      "Zoom account or dining table space for 45-minute pod sessions",
      "Consistent weekly afternoon or morning homeschool time slots"
    ],
    tradeoffs: [
      "Pros: Recurring monthly tuition where parents stay enrolled for the entire school semester.",
      "Tradeoff: Fixed weekly class times require reliable childcare or partner coverage during those 45-minute blocks."
    ],
    quickTestStrategy: "Share a free '15-Minute Reading/Math Readiness Check' in local parent groups and open enrollment for 1 small 4-student pod starting next week.",
    first30DaysFocus: "Fill 2 to 3 small weekly pods of 4 students each (8 to 12 students total = $2,500 to $4,500/mo in just 4 to 6 teaching hours per week)."
  },
  {
    id: "idea-13",
    name: "Virtual Bookkeeping & Profit Snapshot Service for Small Businesses",
    category: "Finance & Bookkeeping",
    businessModel: "service",
    skills: ["finance"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 15000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Tax-Ready Catch-Up ($750) + Monthly Plan ($400 to $750/mo per business)",
    avgUnitRevenue: 500,
    unitLabel: "business accounts",
    hoursPerUnitPerWeek: 1,
    description: "Categorize monthly expenses, reconcile accounts in QuickBooks Online, and send a clear 1-page monthly profit summary for local trades, boutiques, and family businesses on your own schedule.",
    targetAudience: "Local contractors, family-owned shops, salons, realtors, and online sellers",
    requirements: [
      "Attention to detail with numbers and spreadsheets (free QuickBooks ProAdvisor certification available)",
      "Laptop and secure internet connection",
      "5 to 10 flexible hours per week"
    ],
    tradeoffs: [
      "Pros: Very high customer retention (businesses rarely switch bookkeepers) and 100% flexible hours.",
      "Tradeoff: Requires accuracy and comfort learning bookkeeping software rules upfront."
    ],
    quickTestStrategy: "Introduce yourself to 5 local tax CPAs (who prefer tax filings over monthly bookkeeping) and let them know you take on small business monthly cleanup and categorization referrals.",
    first30DaysFocus: "Offer a one-time 'Books Catch-Up & Organization' flat package ($750) for immediate 2-week cash flow, then transition clients onto a $450/mo maintenance plan."
  },
  {
    id: "idea-14",
    name: "Grant Writer (Nonprofits, Schools & Small Business Grants)",
    category: "Writing, Grants & Research",
    businessModel: "service",
    skills: ["writing"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 18000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Grant Readiness Audit ($750) + Per-Proposal Fee ($1,500 to $3,500) or Monthly Retainer ($2,000/mo)",
    avgUnitRevenue: 1650,
    unitLabel: "grant proposals or monthly retainers",
    hoursPerUnitPerWeek: 2.5,
    description: "Research eligible foundation, state, federal, and corporate grants and draft narrative proposals for nonprofits, private schools, health clinics, and woman-owned small businesses.",
    targetAudience: "Executive directors of nonprofits, private/charter schools, community clinics, and grant-eligible businesses",
    requirements: [
      "Strong persuasive writing, research, and ability to follow foundation guidelines",
      "100% remote, deadline-driven work (no live meetings required beyond initial intake)",
      "$0 startup cost (professional ethics require charging a flat project or monthly fee, never a percentage of awarded grant funds)"
    ],
    tradeoffs: [
      "Pros: High flat fees ($1,500 to $3,500 per proposal) and clients renew annually once you learn their programs.",
      "Tradeoff: Requires concentrated writing focus and strict adherence to submission deadlines."
    ],
    quickTestStrategy: "Curate a list of 5 active grants closing in the next 60 days for 10 local nonprofits or schools and email the Executive Director offering a $650 '12-Month Custom Grant Calendar & Master Narrative'.",
    first30DaysFocus: "Build a reusable Master Grant Narrative for your first 2 to 3 clients so each additional grant application takes half the time."
  },
  {
    id: "idea-15",
    name: "Real Estate Transaction Coordinator (Remote Paperwork Manager)",
    category: "Admin & Real Estate Support",
    businessModel: "service",
    skills: ["realestate_property", "organization"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 12000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Per-Closing Fee ($400 to $550 per home closing)",
    avgUnitRevenue: 450,
    unitLabel: "home closings coordinated",
    hoursPerUnitPerWeek: 1.2,
    description: "Manage contract-to-close checklists, inspection dates, title company emails, and compliance paperwork from home for busy real estate agents. No real estate license or weekend showings required in most states.",
    targetAudience: "Busy real estate agents closing 2+ homes per month",
    requirements: [
      "Strong organization and deadline tracking",
      "Email responsiveness during normal weekday business windows",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Agents pay $450/file out of their closing commission, so it costs them nothing upfront.",
      "Tradeoff: Requires checking email briefly during weekdays for time-sensitive closing documents."
    ],
    quickTestStrategy: "Look up local agents who currently have 3+ homes marked 'Pending/Under Contract' and send a quick note offering to handle their contract-to-close paperwork on their next transaction.",
    first30DaysFocus: "Partner with 3 to 4 active realtors who each send you 2 to 3 closings per month for steady monthly income."
  },
  {
    id: "idea-16",
    name: "Family & Newborn Mini-Session Photographer",
    category: "Creative, Design & Photography",
    businessModel: "local-service",
    skills: ["design_photo"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 12000,
    workStyle: "client-facing",
    startupCost: 100,
    incomeModel: "20-Minute Mini-Sessions ($225 to $375 per family; 6 to 8 families booked in 1 morning)",
    avgUnitRevenue: 295,
    unitLabel: "family mini-sessions",
    hoursPerUnitPerWeek: 0.4,
    description: "Host themed 20-minute back-to-back family mini-sessions at a scenic local park or studio 2 weekends a month, earning $1,500 to $2,500 in a single Saturday morning.",
    targetAudience: "Local families wanting updated seasonal, motherhood, milestone, or holiday portraits",
    requirements: [
      "Entry-level mirrorless/DSLR camera + 50mm portrait lens",
      "Lightroom for batch photo editing and Pixieset for online galleries",
      "1 to 2 Saturday or Sunday mornings per month"
    ],
    tradeoffs: [
      "Pros: Extremely high hourly earning rate: 6 families in 2.5 hours = $1,500+ in one morning.",
      "Tradeoff: Weather-dependent if shooting outdoors; peaks heavily in Spring and Fall."
    ],
    quickTestStrategy: "Announce 1 'Golden Hour Park Mini-Session Morning' for next weekend with 6 back-to-back 20-minute slots at $250 using a simple booking link.",
    first30DaysFocus: "Fill 1 to 2 mini-session mornings per month and offer a 1-click 'Full Gallery Upgrade (+$95)' when delivering the online photo gallery."
  },
  {
    id: "idea-17",
    name: "Mobile Notary & Certified Real Estate Loan Signing Agent",
    category: "Licensed Local & Financial Services",
    businessModel: "local-service",
    skills: ["realestate_property", "finance", "organization"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 11000,
    workStyle: "client-facing",
    startupCost: 175,
    incomeModel: "Loan Signing Appointments ($100 to $200 per 45-minute signing) + Estate Trust Signings ($150 to $250)",
    avgUnitRevenue: 150,
    unitLabel: "loan or estate signings",
    hoursPerUnitPerWeek: 0.8,
    description: "Travel to clients' homes or offices to witness and notarize real estate closing packets, refinances, HELOCs, and living trusts. Each appointment takes ~45 minutes and pays $100 to $200.",
    targetAudience: "Title companies, escrow officers, estate planning attorneys, and senior living communities",
    requirements: [
      "State Notary Public commission + NNA Certified Signing Agent background check (~$150 to $225)",
      "Dual-tray laser printer for legal/letter closing packets",
      "Flexible daytime, evening, or Saturday appointment windows"
    ],
    tradeoffs: [
      "Pros: Zero selling required once registered on signing platforms (Snapdocs, SigningOrder) and with local title offices.",
      "Tradeoff: Requires driving locally to appointments and printing document packets accurately."
    ],
    quickTestStrategy: "Check your state Secretary of State website for Notary commission timelines and call 3 local estate planning attorneys and title companies to ask what they pay mobile notaries per signing.",
    first30DaysFocus: "Obtain your state notary stamp, register on Snapdocs and SigningOrder, and introduce yourself in person to 5 local title offices and estate attorneys."
  },
  {
    id: "idea-18",
    name: "Property Tax Appeal & Commercial Cost-Reduction Consultant",
    category: "Finance & B2B Consulting",
    businessModel: "licensed-advisory",
    skills: ["finance", "writing"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 22000,
    workStyle: "behind-the-scenes",
    startupCost: 50,
    incomeModel: "Contingency Fee (30% to 50% of first-year tax or vendor savings; $500 to $3,500 per client with $0 upfront cost to them)",
    avgUnitRevenue: 1200,
    unitLabel: "successful tax or cost-reduction files",
    hoursPerUnitPerWeek: 1.5,
    description: "Prepare comparable-sales evidence packets to lower over-assessed residential or commercial property taxes, or audit commercial waste/telecom/merchant bills on a 50/50 savings-split basis.",
    targetAudience: "Homeowners in high-property-tax counties, small commercial building owners, and medical/dental offices",
    requirements: [
      "Comfort pulling comparable property values or reviewing vendor invoices",
      "Check state rules (most states allow homeowners/consultants to file administrative appeals; a few require a property tax consultant registration)",
      "Simple 1-page Contingency Savings Split Agreement"
    ],
    tradeoffs: [
      "Pros: Easy yes from clients because they pay $0 unless you save them money.",
      "Tradeoff: Property tax appeal windows are seasonal by county, while commercial bill audits run year-round."
    ],
    quickTestStrategy: "Pull recent neighborhood sales for 10 homeowners whose assessed value jumped this year and offer to prepare their comparable appeal packet for a flat $250 or 35% of their first-year tax reduction.",
    first30DaysFocus: "Onboard 10 homeowners or 3 small commercial businesses during your county's assessment window."
  },
  {
    id: "idea-19",
    name: "Corporate Workshop Facilitator & Lunch-and-Learn Trainer",
    category: "Education & B2B Training",
    businessModel: "licensed-advisory",
    skills: ["teaching", "coaching_consulting"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 25000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "60-Minute Virtual or In-Person Corporate Workshop ($1,500 to $3,500 per session)",
    avgUnitRevenue: 2000,
    unitLabel: "corporate workshops delivered",
    hoursPerUnitPerWeek: 2,
    description: "Deliver practical 60-minute workshops to companies, ERGs (Working Parents / Women's networks), schools, or healthcare teams on topics you know well (financial wellness, AI productivity, burnout prevention, manager communication, or spreadsheet mastery).",
    targetAudience: "HR Directors, People & Culture leaders, Employee Resource Groups (ERGs), and school districts",
    requirements: [
      "1 signature 60-minute workshop slide deck + 1-page Speaker/Facilitator Sheet",
      "Strong comfort facilitating a lively 45-minute session + 15-minute Q&A on Zoom or in person",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Just 2 to 3 one-hour workshops per month equals $4,500 to $7,500+ in revenue.",
      "Tradeoff: Companies typically pay on Net-30 invoice terms after booking."
    ],
    quickTestStrategy: "Create a 1-page PDF outlining 2 practical workshop topics and send it to 20 HR/People leaders or Working Parent ERG chairs on LinkedIn for upcoming heritage months or quarterly wellness weeks.",
    first30DaysFocus: "Book your first 2 corporate Lunch-and-Learn workshops at $1,500 to $2,500 each and record testimonials from the HR organizer."
  },
  {
    id: "idea-20",
    name: "Amazon KDP Specialty Workbooks, Curriculum & Niche Publishing",
    category: "Writing, Publishing & Digital Assets",
    businessModel: "digital-product",
    skills: ["writing", "teaching", "design_photo"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 14000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Print-on-Demand Book Royalties ($4 to $9 net profit per paperback sold on Amazon)",
    avgUnitRevenue: 35,
    unitLabel: "multi-book / classroom bundle equivalents",
    hoursPerUnitPerWeek: 0.05,
    description: "Publish high-utility workbooks, handwriting/phonics practice books, bilingual kids' books, test-prep guides, or occupational logbooks on Amazon Kindle Direct Publishing (KDP). Amazon prints, ships, and handles customer service on every order.",
    targetAudience: "Parents, homeschoolers, teachers, hobbyists, and tradespeople shopping on Amazon",
    requirements: [
      "Free Amazon KDP account and Canva / Affinity / Word for interior formatting",
      "$0 inventory cost (Amazon prints each book only when a customer buys it)",
      "4 to 8 hours/week for niche keyword research and interior creation"
    ],
    tradeoffs: [
      "Pros: True passive royalties on Amazon's global marketplace with zero shipping or customer service.",
      "Tradeoff: Amazon pays royalties 60 days after the end of the month, and you need 10 to 25 quality titles for compounding monthly income."
    ],
    quickTestStrategy: "Skip generic lined journals. Research 5 specific skill-building workbook niches on Amazon with Bestseller Ranks under 50,000 and outline 1 superior, activity-rich 80-page workbook.",
    first30DaysFocus: "Format and publish your first 3 interrelated workbooks in a series so parents who buy Book 1 automatically order Books 2 and 3."
  },
  {
    id: "idea-21",
    name: "Business & Startup Strategy Coach / Small Business Consultant",
    category: "Coaching & Business Consulting",
    businessModel: "service",
    skills: ["coaching_consulting", "finance", "organization"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 25000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "90-Minute Strategy Intensive ($350 to $650) + 8-Week 1-on-1 or Small-Group Coaching ($1,200 to $2,500)",
    avgUnitRevenue: 1200,
    unitLabel: "coaching clients or strategy packages",
    hoursPerUnitPerWeek: 1.2,
    description: "Help aspiring founders, side-hustlers, and local small business owners validate their offers, price profitably, set up simple marketing systems, and hit their revenue milestones through structured 1-on-1 sessions or small-group cohorts.",
    targetAudience: "New business owners, women launching second income streams, and brick-and-mortar or service founders",
    requirements: [
      "Real-world experience building a business, managing P&L/operations, or leading growth projects",
      "Structured 6-to-8 week curriculum or action framework + Zoom and scheduling link",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: 95%+ profit margins, zero inventory, and only 4 to 5 clients per month needed to reach $5,000+/mo.",
      "Tradeoff: Requires consistent visibility, trust-building, and live call energy each week."
    ],
    quickTestStrategy: "Offer 5 paid 60-minute 'Business Audit & 30-Day Action Plan' sessions at an introductory rate ($195 to $295) to women in your network or community to validate demand before building a longer program.",
    first30DaysFocus: "Deliver 5 paid strategy sessions, collect detailed client wins, and invite 3 of those clients into an 8-week implementation coaching package."
  },
  {
    id: "idea-22",
    name: "Life, Mindset & Motherhood / Life-Transition Coach",
    category: "Life & Personal Development Coaching",
    businessModel: "service",
    skills: ["coaching_consulting"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 18000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "1-on-1 8-Week Coaching Package ($800 to $1,600) + Small-Group Coaching Circles ($295/person)",
    avgUnitRevenue: 950,
    unitLabel: "1-on-1 clients or group circle cohorts",
    hoursPerUnitPerWeek: 1.2,
    description: "Guide women and mothers through specific, high-stakes life transitions such as returning from maternity leave, overcoming burnout, post-divorce rebuilding, ADHD/time management for moms, or empty-nest reinvention.",
    targetAudience: "Working moms experiencing burnout, women navigating major life transitions, and overwhelmed parents",
    requirements: [
      "Clear specialization around a specific problem or transition (specific niches book 4x faster than general 'life coaching')",
      "Optional ICF or specialty coaching certification (helpful for credibility, though not legally required)",
      "Zoom, intake workbook, and weekly or biweekly session slots"
    ],
    tradeoffs: [
      "Pros: Deeply fulfilling work from home that scales smoothly from 1-on-1 into 6-to-8 person group coaching circles.",
      "Tradeoff: General 'life coaching' is crowded, so you must anchor your offer to a tangible 60-day outcome."
    ],
    quickTestStrategy: "Host a live 45-minute workshop on 1 specific challenge (for example, 'The Sunday Reset & Burnout Recovery System for Working Moms') and invite attendees to a 1-on-1 clarity session.",
    first30DaysFocus: "Enroll your first 4 founding clients into a 6-week 1-on-1 or small-group transition program with weekly accountability check-ins."
  },
  {
    id: "idea-23",
    name: "Career, Resume, Interview & Salary Negotiation Coach",
    category: "Career Coaching & Consulting",
    businessModel: "service",
    skills: ["coaching_consulting", "writing"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 20000,
    workStyle: "both",
    startupCost: 0,
    incomeModel: "Resume & LinkedIn Overhaul ($450) + Complete Career & Salary Negotiation Coaching Package ($950 to $1,800)",
    avgUnitRevenue: 850,
    unitLabel: "career coaching packages",
    hoursPerUnitPerWeek: 1.5,
    description: "Help professionals, managers, and moms returning to the workforce after a career break modernize their resume and LinkedIn, practice behavioral interviews, and negotiate $10,000 to $30,000+ higher salary offers.",
    targetAudience: "Mid-career professionals, moms returning to corporate roles, and tech/healthcare/finance job seekers",
    requirements: [
      "Strong familiarity with hiring, corporate recruiting, HR, or persuasive resume/LinkedIn positioning",
      "Before/after resume templates and salary negotiation email scripts",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Very easy ROI for clients to justify because one negotiated job offer pays for your fee 10x over.",
      "Tradeoff: Clients graduate once they land their new role, so you need a steady stream of referrals and LinkedIn posts."
    ],
    quickTestStrategy: "Offer a flat-rate '$295 Resume, LinkedIn & ATS Optimization Audit' to 10 job seekers on LinkedIn or local professional groups this week.",
    first30DaysFocus: "Bundle your resume/LinkedIn rewrite with 2 live mock-interview and salary negotiation coaching calls for a complete $950 package."
  },
  {
    id: "idea-24",
    name: "Certified Pediatric Sleep & Newborn Care Consultant",
    category: "Family & Parenting Consulting",
    businessModel: "service",
    skills: ["healthcare_care", "teaching", "coaching_consulting"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 15000,
    workStyle: "client-facing",
    startupCost: 250,
    incomeModel: "2-Week Custom Baby/Toddler Sleep Plan + Daily Text/Log Support ($450 to $850 per family)",
    avgUnitRevenue: 595,
    unitLabel: "family sleep consulting packages",
    hoursPerUnitPerWeek: 1,
    description: "Create customized, gentle 14-day sleep schedules for exhausted parents of infants and toddlers, paired with a 60-minute intake call and 2 weeks of daily sleep-log review and text troubleshooting.",
    targetAudience: "Exhausted parents of 4-month to 4-year-old children who are waking up multiple times a night",
    requirements: [
      "Pediatric sleep consultant training/certification or newborn care/nursing/postpartum background",
      "Shared digital sleep-tracking log and intake questionnaire",
      "15 minutes each morning and evening to review client sleep logs and reply via text/voice note"
    ],
    tradeoffs: [
      "Pros: Exhausted parents are highly motivated buyers who refer you to every other new mom they know once their baby sleeps 11 hours.",
      "Tradeoff: Requires brief daily check-ins during your clients' 14-day implementation window."
    ],
    quickTestStrategy: "Partner with 2 local pediatricians, postpartum doulas, or mom groups to host a free '4-Month to 2-Year Nap & Night-Wakings Q&A' and book 15-minute sleep evaluations.",
    first30DaysFocus: "Work with your first 5 families at a $450 founding package rate and collect video/written reviews from rested parents."
  },
  {
    id: "idea-25",
    name: "College Admissions, Essay & Scholarship Consultant",
    category: "Education & Family Advisory",
    businessModel: "service",
    skills: ["teaching", "writing", "coaching_consulting"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 22000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "College Essay & Application Boot Camp ($950 to $1,500) or Full Junior/Senior Advisory ($2,500 to $4,500)",
    avgUnitRevenue: 1250,
    unitLabel: "student admissions or essay packages",
    hoursPerUnitPerWeek: 1.5,
    description: "Guide high school sophomores, juniors, and seniors through school list strategy, standout Common App personal statements, supplemental essays, and private scholarship applications.",
    targetAudience: "Parents of high school students aiming for selective universities, honors programs, or merit scholarships",
    requirements: [
      "Strong storytelling/editing skills and up-to-date knowledge of college admissions and scholarship timelines",
      "Zoom and Google Docs for live essay brainstorming and line editing",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: High package values ($1,200 to $3,500+ per student) and parents gladly invest in scholarship and admissions outcomes.",
      "Tradeoff: Peak demand runs August through January for senior essays, balanced by spring/summer prep for rising juniors."
    ],
    quickTestStrategy: "Offer a '$350 Common App Personal Statement Brainstorm & 2-Draft Edit Intensive' or a 'Top 15 Merit Scholarship Road Map' to parents of high school juniors and seniors.",
    first30DaysFocus: "Enroll 4 to 6 students in your Essay & Scholarship Package and host a free parent workshop for local high school PTAs or parent groups."
  },
  {
    id: "idea-26",
    name: "Holistic Health, Postpartum Wellness & Nutrition Coach",
    category: "Health, Fitness & Wellness Coaching",
    businessModel: "service",
    skills: ["healthcare_care", "beauty", "coaching_consulting"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 16000,
    workStyle: "client-facing",
    startupCost: 100,
    incomeModel: "12-Week 1-on-1 Wellness Coaching ($900 to $1,500) + 6-Week Group Wellness Challenge ($195 to $295/person)",
    avgUnitRevenue: 750,
    unitLabel: "coaching clients or group challenge members",
    hoursPerUnitPerWeek: 1,
    description: "Coach busy moms on postpartum core/strength recovery, anti-inflammatory family meal prep, blood-sugar balance, PCOS/perimenopause wellness, or sustainable strength habits that fit a 20-minute daily window.",
    targetAudience: "Postpartum moms, women 35 to 50 navigating energy/hormone shifts, and busy moms wanting realistic family nutrition",
    requirements: [
      "Recognized nutrition, health coaching, personal training, nursing, or pre/postnatal wellness certification",
      "Clear scope of practice (habit coaching and meal/movement planning rather than prescribing medical treatment)",
      "Recipe guides, habit tracker app, and weekly check-in workflow"
    ],
    tradeoffs: [
      "Pros: Group challenges (15 to 25 women at $249) allow you to earn $3,500 to $6,000 in a single cohort launch.",
      "Tradeoff: Requires consistent accountability check-ins so clients complete their habits and get visible results."
    ],
    quickTestStrategy: "Run a 14-day 'Busy Mama High-Protein Family Meal Prep & Energy Reset' for 10 founding members at $149 each, including a grocery list and 2 group check-in calls.",
    first30DaysFocus: "Transition 50% of your 14-day reset participants into a 12-week 1-on-1 or small-group wellness coaching program."
  },
  {
    id: "idea-27",
    name: "HR, Operations & Small Business Systems Consultant",
    category: "B2B Operations & Management Consulting",
    businessModel: "service",
    skills: ["organization", "tech", "coaching_consulting"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 28000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Operations & SOP Setup Project ($1,800 to $3,500) + Fractional Operations / HR Retainer ($1,500/mo)",
    avgUnitRevenue: 1800,
    unitLabel: "operations projects or monthly retainers",
    hoursPerUnitPerWeek: 2.5,
    description: "Step into growing 5-to-25 person businesses (agencies, clinics, trades, law firms, or e-commerce brands) to organize their chaotic workflows, write standard operating procedures (SOPs), set up Asana/ClickUp/CRM systems, or manage employee onboarding.",
    targetAudience: "Overwhelmed small business owners generating $300k to $3M/year whose operations feel disorganized",
    requirements: [
      "Background in operations, project management, HR, executive administration, or corporate team leadership",
      "Comfort mapping workflows and organizing digital tools (ClickUp, Notion, Asana, Gusto, or HubSpot)",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Only 2 to 3 business clients per month brings in $4,500 to $7,500+, and most work is asynchronous.",
      "Tradeoff: Requires interviewing the founder/team in Week 1 to map how their business currently runs."
    ],
    quickTestStrategy: "Offer a flat-rate '$650 Workflow & Operations Bottleneck Audit' to 5 busy local or online business owners where you map their top 3 time-wasters and build 3 core SOPs.",
    first30DaysFocus: "Convert 2 audit clients into a $2,000 '30-Day Systems & Team Playbook Buildout' or a $1,500/mo Fractional Operations retainer."
  },
  {
    id: "idea-28",
    name: "Event Planning & Day-Of Coordination (Intimate, Social & Corporate Events)",
    category: "Events, Entertainment & Hospitality",
    businessModel: "local-service",
    skills: ["event_planning", "organization"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 25000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "Intimate/Social Event Package ($1,200 to $2,800), Day-Of Wedding Coordination ($1,800 to $3,500) & Corporate Mixers/Retreats ($3,000 to $7,500+)",
    avgUnitRevenue: 2200,
    unitLabel: "intimate, social, or corporate events coordinated",
    hoursPerUnitPerWeek: 2.5,
    description: "Plan and coordinate intimate milestone dinners, luxury bridal/baby showers, social celebrations, day-of wedding management, or corporate team offsites, client appreciation mixers, and brand launch events.",
    targetAudience: "Busy families hosting milestone celebrations, engaged couples needing day-of coordination, and companies hosting corporate mixers or executive dinners",
    requirements: [
      "Strong timeline, vendor management, run-of-show, and budget coordination skills",
      "Curated local vendor list (venues, caterers, florists, photographers, DJs, and rentals)",
      "$0 to $100 startup cost (event day emergency kit, clipboard/iPad, and general liability insurance)"
    ],
    tradeoffs: [
      "Pros: High revenue per booking ($1,500 to $5,000+ per event) where just 2 to 3 events per month reaches $5,000+.",
      "Tradeoff: Planning happens from home on weekdays, while event execution requires on-site presence on select evenings or weekends."
    ],
    quickTestStrategy: "Create a 3-tier Event Menu ('Intimate Dinner & Milestone Party Coordination' at $1,250, 'Month-Of / Day-Of Event Coordination' at $1,950, and 'Corporate Mixer / Brand Event Package' at $3,200) and introduce yourself to 5 local boutique venues, private dining restaurants, and caterers.",
    first30DaysFocus: "Book your first 2 intimate social or corporate events (collecting a 50% retainer deposit upfront) and build referral partnerships with 5 local venues and photographers."
  },
  {
    id: "idea-29",
    name: "Professional Event MC, Live Host & Corporate / Gala Moderator",
    category: "Events, Entertainment & Hospitality",
    businessModel: "local-service",
    skills: ["mc_dj", "teaching"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 18000,
    workStyle: "client-facing",
    startupCost: 0,
    incomeModel: "Social & Wedding Reception MC ($850 to $1,800/event) & Corporate Conference / Gala Host ($1,500 to $3,500/event)",
    avgUnitRevenue: 1350,
    unitLabel: "events hosted or moderated",
    hoursPerUnitPerWeek: 1.5,
    description: "Serve as the warm, charismatic Master of Ceremonies (MC) and live host who keeps the energy high and the run-of-show seamless for weddings, cultural receptions, milestone galas, charity fundraisers, women's conferences, and corporate panels.",
    targetAudience: "Event planners, engaged couples, cultural wedding hosts, nonprofits hosting fundraising galas, and corporate conference organizers",
    requirements: [
      "Confident stage presence, warm crowd engagement, and ability to keep an event timeline moving smoothly",
      "60-second highlight reel video (or 2 to 3 clips speaking on a mic) and a clean 1-page MC Media Kit",
      "$0 startup cost (optional personal wireless microphone backup ~$100)"
    ],
    tradeoffs: [
      "Pros: One of the highest hourly rates in the events industry ($850 to $2,500+ for 4 to 5 hours on-site) with almost zero equipment overhead.",
      "Tradeoff: Requires high energy on event days (typically Friday evenings, Saturdays, or weekday corporate conferences)."
    ],
    quickTestStrategy: "Put together a 1-page MC & Live Host Booking Sheet with a 60-second video clip of you speaking, and send it to 10 local wedding/event planners, DJs, and corporate/nonprofit event organizers.",
    first30DaysFocus: "Partner with 3 local DJs and 3 event planners as their preferred MC add-on and lock in your first 3 to 4 paid hosting dates (collecting 50% booking deposits)."
  },
  {
    id: "idea-30",
    name: "Boutique Event DJ & Curated Sound Entertainment (Weddings, Social & Corporate)",
    category: "Events, Entertainment & Hospitality",
    businessModel: "local-service",
    skills: ["mc_dj", "tech"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 20000,
    workStyle: "client-facing",
    startupCost: 350,
    incomeModel: "Private Party / Corporate Mixer DJ ($850 to $1,500) & Wedding / Gala DJ Package ($1,500 to $3,000)",
    avgUnitRevenue: 1400,
    unitLabel: "DJ & sound bookings",
    hoursPerUnitPerWeek: 2,
    description: "Provide elevated, crowd-reading DJ sets and curated soundscapes for women's conferences, brand launches, boutiques, intimate weddings, milestone birthdays, and corporate mixers. Female and mom DJs are in extraordinarily high demand for private, corporate, and cultural events.",
    targetAudience: "Event planners, corporate brand/retail managers, brides, and hosts of milestone birthday or social celebrations",
    requirements: [
      "Laptop with DJ software (Serato, Rekordbox, or VirtualDJ) and a portable 2-channel DJ controller (~$250 to $350; PA speakers can be rented per gig for $75 until purchased)",
      "Curated genre playlists (R&B, Afrobeats, Pop, Throwbacks, Clean Corporate Lounge, Wedding Classics) and smooth transition skills",
      "Reliable transportation for your controller/audio setup"
    ],
    tradeoffs: [
      "Pros: Huge demand gap for polished female DJs at brand launches, women's events, weddings, and corporate mixers ($1,000 to $2,500+ per single day).",
      "Tradeoff: Requires weekend or evening availability and setting up/breaking down audio gear (or bringing an assistant)."
    ],
    quickTestStrategy: "Record two 15-minute signature video/audio mini-mixes ('Upbeat Brunch & Brand Launch Vibe' and 'Reception & Milestone Party Mix') and pitch 10 local event planners, boutiques, and venue coordinators.",
    first30DaysFocus: "Book your first 3 paid events (brunches, brand pop-ups, birthday parties, or corporate mixers) at $850 to $1,500 each and capture crowd reaction clips for referrals."
  },
  {
    id: "idea-31",
    name: "Luxury Picnic, Intimate Micro-Event & Tablescape Styling Business",
    category: "Events, Entertainment & Hospitality",
    businessModel: "local-service",
    skills: ["event_planning", "design_photo"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 15000,
    workStyle: "client-facing",
    startupCost: 250,
    incomeModel: "Intimate Luxury Picnic / Tablescape for 2 to 12 Guests ($450 to $1,400 per booking)",
    avgUnitRevenue: 750,
    unitLabel: "intimate picnic or tablescape bookings",
    hoursPerUnitPerWeek: 2,
    description: "Style magazine-worthy intimate celebrations including luxury low-table picnics, backyard dinner party tablescapes, marriage proposals, micro bridal/baby showers, and kids' aesthetic tea/glamping parties.",
    targetAudience: "Moms celebrating milestone birthdays, bridal/baby shower hosts, couples planning proposals/anniversaries, and small brands",
    requirements: [
      "Reusable low picnic tables or linen/charger/candle/silk-floral tablescape kit (~$200 to $300)",
      "Eye for color palettes, table styling, and natural-light phone photography",
      "2-hour setup and 1-hour pack-down window on weekends"
    ],
    tradeoffs: [
      "Pros: All inventory (linens, chargers, candlesticks, pillows, low tables) is 100% reusable across dozens of bookings for 85%+ profit margins.",
      "Tradeoff: Requires transporting bins and setting up/picking up on-site."
    ],
    quickTestStrategy: "Style 1 stunning 6-to-8 person tablescape in your dining room, backyard, or local park, photograph it from 5 angles, and post a 'Founding Host Booking Special' in local mom and bridal groups.",
    first30DaysFocus: "Book 6 weekend setups at $550 to $950 each and partner with a local charcuterie maker, cottage baker, and photographer for cross-referrals."
  },
  {
    id: "idea-32",
    name: "Artisan Jesmonite, Concrete & Home Decor Maker + Retail Stockist",
    category: "Handmade Decor, Crafts & Retail",
    businessModel: "physical-product",
    skills: ["crafts"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 14000,
    workStyle: "behind-the-scenes",
    startupCost: 150,
    incomeModel: "Direct Sets ($45 to $95/set) + Boutique & Craft Store Wholesale/Stockist Orders ($400 to $1,500 per store)",
    avgUnitRevenue: 85,
    unitLabel: "decor sets or wholesale retail bundles",
    hoursPerUnitPerWeek: 0.25,
    description: "Hand-cast modern architectural home decor pieces (trays, coasters, vessels, bookends, and candle holders) using eco-friendly Jesmonite or artisan materials, selling both online and in retail stores. Fatima started crafting Jesmonite decor pieces from home and stocked her line in the major craft retail store Makers Keep in less than 1 year.",
    targetAudience: "Home decor shoppers, gift buyers, interior stylists, and curated retail/artisan stores like Makers Keep",
    requirements: [
      "Silicone molds, Jesmonite base/liquid kit, pigments, and sealer (~$120 to $160)",
      "Small home table workspace (Jesmonite is water-based, VOC-free, and sets in 30 to 45 minutes)",
      "Clean product photography and a 1-page Wholesale/Retail Line Sheet for pitching stores"
    ],
    tradeoffs: [
      "Pros: Fast curing time (30 minutes per pour), high boutique gift margins, and ability to stock your line in major craft/gift stores like Makers Keep so products sell daily without you being there.",
      "Tradeoff: Requires hands-on pouring/sanding batches and managing physical packaging."
    ],
    quickTestStrategy: "Pour 1 cohesive 3-piece collection (e.g., an oval vanity tray, ribbed vessel, and coaster set in 2 neutral colorways), photograph them in natural sunlight, and launch a 20-set limited pre-order drop while pitching 3 local gift/maker stores.",
    first30DaysFocus: "Sell out your first 25 direct gift sets and submit your Wholesale/Stockist Line Sheet to 5 local curated retail shops, maker collectives, or Faire wholesale buyers."
  },
  {
    id: "idea-33",
    name: "AI Workflow, CRM & No-Code Automation Consultant for Small Businesses",
    category: "Tech, AI & Systems Consulting",
    businessModel: "service",
    skills: ["tech", "organization"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 28000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Automation & CRM Setup Package ($1,800 to $4,500) + Monthly Systems Retainer ($950 to $1,500/mo)",
    avgUnitRevenue: 2200,
    unitLabel: "automation setup projects or monthly retainers",
    hoursPerUnitPerWeek: 2.5,
    description: "Connect and automate lead follow-ups, booking calendars, client onboarding, invoicing, and AI workflows (using Zapier, Make, HubSpot, GoHighLevel, Airtable, or Notion) for local service businesses, law firms, clinics, and agencies.",
    targetAudience: "Busy local business owners, real estate teams, clinics, law firms, and agencies losing leads to slow manual follow-up",
    requirements: [
      "Comfort configuring software tools, CRM pipelines, Zapier/Make automations, or practical AI prompts",
      "100% remote computer work with minimal live calls after initial discovery",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Businesses gladly pay $2,000+ for an automation system that saves 10 hours/week of manual admin and captures missed leads.",
      "Tradeoff: Requires testing workflows carefully before handoff and documenting how the system works."
    ],
    quickTestStrategy: "Offer a flat-rate '$650 Lead-to-Booking & AI Automation Audit + 1 Core Workflow Build' to 5 local service businesses or agencies.",
    first30DaysFocus: "Deliver 2 to 3 complete CRM/Automation setups at $1,800 to $2,500 each and transition clients onto a $750/mo maintenance retainer."
  },
  {
    id: "idea-34",
    name: "Data Analytics, KPI Dashboard & Business Intelligence Consultant",
    category: "Tech, Data & Financial Analytics",
    businessModel: "service",
    skills: ["tech", "finance"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 24000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Custom KPI & Profit Dashboard Build ($1,500 to $3,500) + Monthly Insights Retainer ($850/mo)",
    avgUnitRevenue: 1850,
    unitLabel: "dashboard builds or monthly analytics retainers",
    hoursPerUnitPerWeek: 2,
    description: "Turn messy spreadsheets, Shopify/Stripe sales data, and ad metrics into clean, automated executive dashboards (in Looker Studio, PowerBI, Tableau, or advanced Google Sheets/Excel) so founders can see their true profit margins and best-selling products at a glance.",
    targetAudience: "E-commerce brands, multi-location local businesses, healthcare practices, and funded startups",
    requirements: [
      "Experience in data analytics, business intelligence, SQL/Excel/Sheets modeling, or financial reporting",
      "100% asynchronous behind-the-scenes work",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: High B2B project fees ($1,500 to $3,500) and zero social media presence required.",
      "Tradeoff: Requires cleaning disorganized client spreadsheets during initial setup."
    ],
    quickTestStrategy: "Build 1 anonymized sample 'CEO 1-Page Revenue & Profit Margin Dashboard' template and share it with 10 e-commerce or agency founders offering a $1,250 7-day custom setup.",
    first30DaysFocus: "Complete 3 custom KPI dashboard builds and enroll 2 clients into a monthly 'Executive Metrics & Forecasting' retainer."
  },
  {
    id: "idea-35",
    name: "UX/UI Website Redesign, Shopify & Conversion Optimization Specialist",
    category: "Tech, Product & Digital Design",
    businessModel: "service",
    skills: ["tech", "design_photo"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 25000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Website / Landing Page Sprint ($1,800 to $4,500) or UX Conversion Audit ($650)",
    avgUnitRevenue: 2100,
    unitLabel: "website or UX conversion projects",
    hoursPerUnitPerWeek: 2.5,
    description: "Use your product, UX/UI, or web background to redesign high-converting websites, Shopify stores, or booking funnels (using Framer, Webflow, Shopify, or Squarespace) in focused 2-week sprints.",
    targetAudience: "Established local businesses, consultants, medical/wellness clinics, and e-commerce brands with outdated websites",
    requirements: [
      "Eye for clean UX/UI layout, mobile usability, and modern no-code web platforms (Shopify, Squarespace, Webflow, or Framer)",
      "Clear 2-week sprint checklist so projects never drag on",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Just 2 website sprints per month brings in $4,000 to $8,000+ from home.",
      "Tradeoff: Requires setting clear revision boundaries so clients provide copy and photos on time."
    ],
    quickTestStrategy: "Record a 3-minute Loom video for 10 established local businesses or e-commerce brands showing 3 specific mobile UX fixes that would immediately increase their bookings/sales, and offer a $1,800 10-Day Website Refresh.",
    first30DaysFocus: "Close and deliver your first 2 website/UX conversion sprints (50% deposit upfront, 50% on launch) and collect before-and-after screenshots."
  },
  {
    id: "idea-36",
    name: "Boutique Grazing Tables, Charcuterie Carts & Intimate Event Catering / Private Chef",
    category: "Food, Baking & Culinary",
    businessModel: "local-service",
    skills: ["culinary", "event_planning"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 18000,
    workStyle: "client-facing",
    startupCost: 150,
    incomeModel: "Luxury Grazing Boxes ($85 to $165), Mobile Charcuterie / Brunch Carts ($550 to $1,200) & Intimate Dinner Catering ($1,200 to $3,000)",
    avgUnitRevenue: 650,
    unitLabel: "catering bookings, grazing tables, or corporate board orders",
    hoursPerUnitPerWeek: 2,
    description: "Create show-stopping charcuterie boards, mobile grazing/pancake/mimosa carts, weekly family meal-prep drops, or intimate dinner party catering for bridal showers, corporate offices, real estate open houses, and milestone celebrations.",
    targetAudience: "Bridal/baby shower hosts, corporate office managers, realtors hosting open houses, and busy families",
    requirements: [
      "Food Handler certificate and compliance with local catering / cottage / commissary kitchen guidelines",
      "Wholesale ingredient sourcing, wooden/eco boards or mobile cart, and elevated food styling (~$150)",
      "Weekend or weekday lunch delivery windows"
    ],
    tradeoffs: [
      "Pros: High average order value ($450 to $1,800+ per event) and instant visual word-of-mouth at every gathering you cater.",
      "Tradeoff: Requires fresh ingredient shopping within 24 hours of each event and careful cold-chain transport."
    ],
    quickTestStrategy: "Style and photograph 1 luxury 10-person grazing board and 4 individual mini-boxes, then pitch 10 local realtors (for broker opens), med-spas, and event planners.",
    first30DaysFocus: "Book 4 weekend shower/party grazing setups at $550+ and lock in 2 corporate offices for monthly employee appreciation platters."
  },
  {
    id: "idea-37",
    name: "Custom Celebration Cakes, Luxury Cupcake Bouquets & Dessert Table Styling",
    category: "Food, Baking & Culinary",
    businessModel: "physical-product",
    skills: ["culinary", "design_photo"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 14000,
    workStyle: "behind-the-scenes",
    startupCost: 120,
    incomeModel: "Custom Vintage/Tiered Cakes ($145 to $450), Cupcake Bouquets ($65 to $120) & Full Dessert Tables ($550 to $1,200)",
    avgUnitRevenue: 220,
    unitLabel: "custom cake or dessert table orders",
    hoursPerUnitPerWeek: 0.8,
    description: "Bake and decorate custom buttercream celebration cakes, vintage piped cakes, floral cupcake bouquets, cake pops, or full color-coordinated dessert tables for first birthdays, baby showers, weddings, and brand events.",
    targetAudience: "Moms planning kids' birthdays, bridal/baby shower hosts, event planners, and corporate gift buyers",
    requirements: [
      "Strong piping/decorating skills, stand mixer, turntable, and sturdy cake boxes with clear lids (~$120)",
      "Home kitchen Cottage Food compliance (or commissary access where required)",
      "50% non-refundable retainer policy upon booking"
    ],
    tradeoffs: [
      "Pros: Custom cakes and dessert tables command 3x to 5x higher prices than standard baked goods, and clients book weeks in advance.",
      "Tradeoff: Decorating requires artistic precision and Friday/Saturday morning pickup coordination."
    ],
    quickTestStrategy: "Bake and decorate 2 signature designs (e.g., a trending vintage heart cake and a 12-cupcake floral bouquet) or offer a 'Cake Tasting / Mini-Cake Box' drop for $35 to book 5 upcoming birthday/shower orders.",
    first30DaysFocus: "Establish a 3-tier menu with a $150 order minimum and partner with 4 local event stylists and balloon artists for bundled dessert packages."
  },
  {
    id: "idea-38",
    name: "Bridal & Event Makeup Artist (MUA) & On-Location Glam Studio",
    category: "Beauty, Aesthetics & Bridal Glam",
    businessModel: "local-service",
    skills: ["beauty"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 20000,
    workStyle: "client-facing",
    startupCost: 250,
    incomeModel: "Full Bridal Party Glam Package ($950 to $2,400/wedding), Photoshoot/Gala Glam ($150 to $250) & 1-on-1 Makeup Lessons ($195)",
    avgUnitRevenue: 650,
    unitLabel: "bridal party bookings, event glam packages, or makeup classes",
    hoursPerUnitPerWeek: 1.5,
    description: "Provide soft-glam, full-glam, and long-wear skin prep for brides, bridal parties, maternity/branding photoshoots, cultural celebrations, and corporate headshots, plus high-margin 'Everyday Makeup for Busy Women' classes.",
    targetAudience: "Brides, bridesmaids, women attending weddings/galas, maternity/branding photographers, and everyday professionals",
    requirements: [
      "Professional, sanitized kit with inclusive foundation shades, disposable applicators, and portable LED lighting (~$250)",
      "Check state cosmetology/esthetician rules for on-location makeup application",
      "Strong portfolio of natural-light before/after photos across diverse skin tones"
    ],
    tradeoffs: [
      "Pros: A single Saturday morning bridal party (Bride + 4 Bridesmaids) pays $900 to $1,600+ in just 4 to 5 hours.",
      "Tradeoff: Peak wedding bookings happen on Friday and Saturday mornings."
    ],
    quickTestStrategy: "Do 3 model/friend soft-glam transformations filmed in natural window light, and reach out to 5 local family/branding photographers and wedding planners to be their go-to MUA.",
    first30DaysFocus: "Book 4 weekend event/photoshoot glam clients, secure 2 upcoming bridal party deposits, and host 1 'Sip & Learn: 10-Minute Everyday Glow' group class ($95/seat)."
  },
  {
    id: "idea-39",
    name: "Certified PMUA (Microblading / Lip Blush), Lash & Brow Specialist or Solo Esthetician",
    category: "Beauty, Aesthetics & Bridal Glam",
    businessModel: "local-service",
    skills: ["beauty"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 26000,
    workStyle: "client-facing",
    startupCost: 350,
    incomeModel: "PMU Brow/Lip Blush Procedure ($450 to $750 per 2.5-hr appointment) or Corrective Facial / Brow Lamination / Lash Set ($135 to $240)",
    avgUnitRevenue: 380,
    unitLabel: "PMU, brow/lash, or corrective skincare appointments",
    hoursPerUnitPerWeek: 1,
    description: "Offer high-ticket beauty and aesthetic treatments such as Permanent Makeup (ombré powder brows, nano brows, lip blush), brow lamination and tinting, luxury lash extensions, or corrective facials and dermaplaning by appointment only.",
    targetAudience: "Busy moms and professionals wanting effortless low-maintenance brows, lashes, or glowing skin",
    requirements: [
      "Required state Esthetician / Cosmetology license or Bloodborne Pathogens & PMU Tattoo permit (varies by state/province)",
      "Private home studio room or rented salon suite (many suites rent by the day for $65/day when starting out)",
      "Strict sanitation, healed-results portfolio, and online booking system requiring a $50 to $100 deposit"
    ],
    tradeoffs: [
      "Pros: Extremely high hourly revenue ($150 to $350+/hr) and built-in repeat visits for 6-week touch-ups, lash fills, or monthly facials.",
      "Tradeoff: Requires proper licensing/certification and hands-on appointment blocks."
    ],
    quickTestStrategy: "Open a 'Founding Client Model Call' for 5 appointments at a VIP portfolio rate (with a $75 booking deposit) to capture crisp, close-up before-and-after videos and Google reviews.",
    first30DaysFocus: "Pre-book every client's 4-to-6 week touch-up or fill before they leave the chair, and launch a 'Refer a Friend, Both Get $35 Off' card."
  },
  {
    id: "idea-40",
    name: "Custom Wig Maker, Luxury Extensions / Braiding Specialist & Hair Care Line",
    category: "Beauty, Aesthetics & Bridal Glam",
    businessModel: "local-service",
    skills: ["beauty", "crafts"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 22000,
    workStyle: "both",
    startupCost: 200,
    incomeModel: "Custom Glueless Wigs ($350 to $950/unit), Knotless Braids / Silk Press / Bridal Hair ($185 to $450) & Wig Rehab/Revamp Drop-Off ($95)",
    avgUnitRevenue: 350,
    unitLabel: "custom wig units, hair appointments, or wig revamps",
    hoursPerUnitPerWeek: 1.2,
    description: "Construct custom glueless wigs on a sewing machine or canvas block from home, offer drop-off 'Wig Laundry & Revamp' services, provide luxury knotless braiding / silk press / bridal hair styling, or formulate botanical scalp and hair growth oils.",
    targetAudience: "Busy professional women, brides, alopecia/postpartum hair-loss clients, and protective-style wearers",
    requirements: [
      "Wig block head, sewing machine or ventilating needles, hot tools, and professional styling products (~$150 to $200)",
      "Check state cosmetology/braiding registration rules (wig construction and drop-off wig revamps can be done 100% from home without a salon chair)",
      "Clear sizing guide and booking/order form"
    ],
    tradeoffs: [
      "Pros: Custom glueless wigs and drop-off wig revamps can be completed at home during nap times or evenings, while bridal/protective styling pays $200 to $500+ per client.",
      "Tradeoff: Hair appointments take 2 to 5 hours of hands-on work unless you focus on machine-made wig units and drop-off revamps."
    ],
    quickTestStrategy: "Launch a '$85 48-Hour Drop-Off Wig Wash, Pluck, Restyle & Revamp' service in your city to get 10 immediate paying hair clients who already wear wigs, then upsell them on custom units.",
    first30DaysFocus: "Fulfill 10 wig revamps or styling appointments and release a limited pre-order drop of 5 'Ready-to-Wear Glueless Everyday Units' at $450+ each."
  },
  {
    id: "idea-41",
    name: "Private-Pay Senior Home Care, Concierge PSW & Post-Op Recovery Companion Service",
    category: "Healthcare & Family Care",
    businessModel: "local-service",
    skills: ["healthcare_care"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 18,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 24000,
    workStyle: "client-facing",
    startupCost: 100,
    incomeModel: "Private-Pay Concierge Care Packages ($35 to $55/hr with 4-hour minimums) or Post-Op / Respite Day Packages ($250 to $450/day)",
    avgUnitRevenue: 650,
    unitLabel: "weekly family care packages or post-op recovery bookings",
    hoursPerUnitPerWeek: 3,
    description: "Leverage your background as a Personal Support Worker (PSW), CNA, HHA, Nurse, or experienced caregiver to provide private-pay senior companionship, dementia respite, medical appointment transport, or luxury post-surgical and postpartum recovery care, and scale by coordinating a roster of vetted caregivers.",
    targetAudience: "Adult children of aging seniors, hospital discharge planners, plastic/orthopedic surgery patients needing post-op care, and new families",
    requirements: [
      "PSW, CNA, HHA, Nursing background, CPR/First Aid certification, and clean background check",
      "Check state/provincial rules distinguishing non-medical companion/concierge care from licensed medical home health",
      "Professional service agreement and general/professional liability insurance (~$100)"
    ],
    tradeoffs: [
      "Pros: Private-pay families pay 2x more than agency wages ($38 to $55/hr vs $18/hr), and just 3 recurring weekly families or scaling with 2 subcontracted PSWs reaches $5,000 to $10,000+/mo.",
      "Tradeoff: Requires scheduled in-person care shifts until you transition into placing/coordinating other vetted PSWs."
    ],
    quickTestStrategy: "Create a 1-page 'Private Concierge Senior Respite & Safe Hospital-to-Home Transition' sheet and introduce yourself to 5 senior living directors, geriatric care managers, and outpatient surgery coordinators.",
    first30DaysFocus: "Sign your first 2 to 3 recurring weekly private-pay families (minimum 8 to 12 hours/week per family) and vet 2 trusted PSW colleagues to cover overflow shifts."
  },
  {
    id: "idea-42",
    name: "Healthcare Clinical Consultant, Medical Writer & Private Patient Advocate (MDs, RNs, NPs & Allied Health)",
    category: "Healthcare Clinical & B2B Consulting",
    businessModel: "service",
    skills: ["healthcare_care", "writing", "coaching_consulting"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 32000,
    workStyle: "both",
    startupCost: 0,
    incomeModel: "Medical Legal / Clinical Chart Review ($150 to $350/hr), CME / Medical Content Projects ($1,500 to $4,000) & Private Patient Navigation Packages ($1,200 to $3,000)",
    avgUnitRevenue: 2000,
    unitLabel: "clinical consulting projects, medical reviews, or patient advocacy retainers",
    hoursPerUnitPerWeek: 2,
    description: "Monetize your clinical degree and bedside expertise (Medical Doctor / MD, Nurse Practitioner, RN, Pharmacist, PT/OT) from home through legal nurse/physician chart review, health-tech clinical advisory, accredited CME/medical writing, or private-pay complex diagnosis & medical bill patient advocacy.",
    targetAudience: "Personal injury & malpractice law firms, digital health startups, medical communications agencies, and families navigating complex diagnoses",
    requirements: [
      "Active or former clinical credential (MD, DO, NP, PA, RN, PharmD, PT, OT, RD) and strong clinical judgment",
      "100% remote computer and phone/Zoom workflow",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Commands elite professional rates ($125 to $350+/hr) without 12-hour hospital shifts, night call, or insurance charting.",
      "Tradeoff: Requires positioning your clinical CV into a clear B2B consulting or non-clinical advisory offer."
    ],
    quickTestStrategy: "Pick 1 focused track (e.g., Medical-Legal Chronology & Chart Review for injury attorneys, or Clinical Content Review for health brands) and send a 1-page Clinical Consultant Brief to 15 attorneys or health-tech directors on LinkedIn.",
    first30DaysFocus: "Land your first 2 clinical review projects or retainers ($1,500 to $3,000 each) and set up a simple LLC for 1099 consulting invoices."
  },
  {
    id: "idea-43",
    name: "Keynote Speaker, Paid Podcast / Live Event Host & Voiceover Talent",
    category: "Events, Speaking & Live Entertainment",
    businessModel: "service",
    skills: ["mc_dj", "teaching", "coaching_consulting"],
    minHoursPerWeek: 4,
    optimalHoursPerWeek: 10,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 22000,
    workStyle: "client-facing",
    startupCost: 100,
    incomeModel: "Paid Keynote / Summit Hosting ($1,500 to $4,500/event), Brand Live-Stream / Event Hosting ($750 to $1,500) & Commercial Voiceover / Audiobook Narration ($350 to $1,200/project)",
    avgUnitRevenue: 1500,
    unitLabel: "speaking, live hosting, or voiceover bookings",
    hoursPerUnitPerWeek: 1.5,
    description: "Monetize your stage presence, voice, and live crowd energy through paid keynote speaking at conferences and colleges, moderating live brand summits and panels, hosting high-converting live shopping/launch events, or recording commercial voiceovers and audiobooks from a quiet closet studio.",
    targetAudience: "Conference organizers, universities, corporate ERGs, e-commerce brands, and audiobook/media producers",
    requirements: [
      "Dynamic vocal delivery, stage or on-camera warmth, and ability to command a room or live stream",
      "1-page Speaker/Host One-Sheet with 2 short video/audio demo clips (and a $100 USB condenser mic for home voiceover work)",
      "4 to 10 flexible hours per week"
    ],
    tradeoffs: [
      "Pros: High fees per engagement ($1,000 to $4,500+) and combines local stage bookings with remote voiceover or virtual summit hosting.",
      "Tradeoff: Event and conference bookings often book 30 to 60 days out, while voiceovers and brand live-streams book weekly."
    ],
    quickTestStrategy: "Create a 1-page Speaker & Live Moderator Sheet + 60-second voice/stage reel and pitch 15 upcoming women's conferences, corporate summit directors, and podcast/brand event producers.",
    first30DaysFocus: "Secure your first 2 paid speaking, panel moderation, or live brand hosting bookings and upload 3 voiceover demo samples."
  },
  {
    id: "idea-44",
    name: "Luxury Candle, Home Fragrance, Private-Label & Custom Event Favor Studio",
    category: "Handmade Decor, Crafts & Retail",
    businessModel: "physical-product",
    skills: ["crafts"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 16000,
    workStyle: "behind-the-scenes",
    startupCost: 140,
    incomeModel: "Custom Wedding/Shower & Corporate Candle Favors ($250 to $1,200 per bulk order) + Boutique Stockist & Direct Bundles ($48 to $95)",
    avgUnitRevenue: 180,
    unitLabel: "bulk favor orders, wholesale store packs, or direct gift sets",
    hoursPerUnitPerWeek: 0.5,
    description: "Hand-pour non-toxic coconut-soy candles, reed diffusers, and room sprays in modern vessels, focusing on high-margin bulk custom-labeled orders for weddings, baby showers, realtors, and boutiques alongside direct seasonal drops.",
    targetAudience: "Brides, baby shower hosts, real estate agents (closing gifts), interior boutiques, and gift shoppers",
    requirements: [
      "Wax melter pitcher, coconut-soy wax, phthalate-free fragrance oils, vessels, and custom label printer (~$140)",
      "Kitchen or table workspace for pouring 20 to 40 candles at once in 90 minutes",
      "Wholesale & Custom Event Favor pricing sheet"
    ],
    tradeoffs: [
      "Pros: One single wedding favor or realtor closing-gift bulk order of 40 candles brings in $600 to $950 in one pour session.",
      "Tradeoff: Requires testing wick sizes for a clean burn and packing glass jars carefully."
    ],
    quickTestStrategy: "Pour 12 sample candles with custom 'Welcome Home' and 'Baby Shower' labels, photograph them in bright sunlight, and pitch 10 local realtors, event planners, and gift shops on bulk custom-labeled orders.",
    first30DaysFocus: "Close 3 bulk custom-label event/realtor orders (30 to 50 units each) and launch a 25-set seasonal fragrance drop."
  },
  {
    id: "idea-45",
    name: "Custom Personalized Gifts, Keepsakes, Embroidery & Laser/Cricut Studio",
    category: "Handmade Decor, Crafts & Retail",
    businessModel: "physical-product",
    skills: ["crafts", "design_photo"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 15000,
    workStyle: "behind-the-scenes",
    startupCost: 150,
    incomeModel: "Personalized Baby/Bridal Keepsake Boxes ($65 to $145), Acrylic Event Signage ($125 to $350) & Corporate Branded Gift Bundles ($500 to $2,000)",
    avgUnitRevenue: 115,
    unitLabel: "custom gift boxes, acrylic sign sets, or bulk corporate orders",
    hoursPerUnitPerWeek: 0.4,
    description: "Create high-margin personalized items from home such as embroidered baby/bridal apparel, custom acrylic wedding/shower welcome signs and place cards, curated corporate/realtor gift boxes, or laser-engraved keepsakes.",
    targetAudience: "New moms, brides, event planners, Etsy shoppers, and corporate/realtor gift buyers",
    requirements: [
      "Cricut/Silhouette, embroidery machine, or wholesale blank keepsakes + clean typography skills (~$150)",
      "5 to 12 hours/week from home during nap times or evenings",
      "Fast 5-to-7 day turnaround for personalized milestone gifts"
    ],
    tradeoffs: [
      "Pros: Personalized items command 3x the profit margin of generic retail items and sell year-round for babies, weddings, and holidays.",
      "Tradeoff: Each order is customized to the buyer's name/date, requiring careful spelling checks before production."
    ],
    quickTestStrategy: "Create 3 hero samples (1 personalized newborn keepsake bundle, 1 bridal party gift set, and 1 frosted acrylic event welcome sign) and post in local mom, bridal, and event groups.",
    first30DaysFocus: "Fulfill your first 20 custom orders, list your top 5 bestsellers on Etsy/Instagram, and partner with 3 local event planners for signage and party favors."
  },
  {
    id: "idea-46",
    name: "Boutique Social Media Management, UGC Content & Local Brand Marketing Agency",
    category: "Marketing, Paid Ads & Social Media",
    businessModel: "service",
    skills: ["marketing", "design_photo"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 25000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Monthly Social & Content Retainer ($1,200 to $2,500/mo per local business) or UGC Ad Creative Bundles ($750 to $1,500/brand)",
    avgUnitRevenue: 1500,
    unitLabel: "monthly social retainers or UGC ad creative packages",
    hoursPerUnitPerWeek: 2.5,
    description: "Manage short-form Reels/TikTok content, Instagram presence, and high-converting UGC (User-Generated Content) ad creatives for busy med-spas, dental practices, boutiques, realtors, and e-commerce brands that have budget but zero time to post.",
    targetAudience: "Med-spas, cosmetic dentists, real estate teams, interior designers, boutiques, and e-commerce brands",
    requirements: [
      "Eye for scroll-stopping short-form video hooks, Canva graphics, caption copy, and content calendars",
      "Smartphone with a good camera + CapCut/Canva",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Predictable recurring monthly retainers where just 3 to 4 local business clients equals $4,500 to $8,000/mo.",
      "Tradeoff: Requires batch-creating content once a month so you aren't glued to your phone daily."
    ],
    quickTestStrategy: "Audit 10 local high-ticket businesses (med-spas, boutiques, realtors, or clinics) whose Instagram hasn't been updated in 3 weeks, send them 3 custom Reel/post mockups, and offer a '$1,200/mo 12-Post + 4-Reel Content Retainer'.",
    first30DaysFocus: "Sign your first 3 monthly retainer clients and batch-film/schedule their entire month of content in one 3-hour block per client."
  },
  {
    id: "idea-47",
    name: "Email Marketing, Funnel Copywriting & PR / Podcast Visibility Strategist",
    category: "Writing, Copywriting & Email Funnels",
    businessModel: "service",
    skills: ["writing", "marketing"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 22000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Automated Email Welcome/Sales Sequence ($1,200 to $2,800) + Monthly Newsletter / PR Retainer ($1,200/mo)",
    avgUnitRevenue: 1500,
    unitLabel: "email funnel builds or monthly PR/newsletter retainers",
    hoursPerUnitPerWeek: 2,
    description: "Write high-converting automated email sequences (in Klaviyo, Kit, or Flodesk), launch sales pages, or pitch founders and authors as guest experts on top podcasts and media outlets.",
    targetAudience: "E-commerce stores, coaches/course creators, authors, and B2B consultants",
    requirements: [
      "Background in copywriting, PR, communications, or email campaign management",
      "100% asynchronous written work from home with zero video filming required",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Businesses see immediate, measurable revenue from email flows, making it easy to charge $1,500+ per project.",
      "Tradeoff: Requires understanding persuasive conversion copywriting rather than academic writing."
    ],
    quickTestStrategy: "Subscribe to the email lists of 15 e-commerce brands or coaches, identify a gap in their welcome sequence, and offer a flat '$950 5-Part Automated Welcome & Abandoned-Cart Email Flow'.",
    first30DaysFocus: "Deliver 3 automated email flow setups and transition 2 clients into a $1,200/mo weekly newsletter or podcast PR booking retainer."
  },
  {
    id: "idea-48",
    name: "Fractional Project Manager, Launch Manager & Agile / PMO Implementation Consultant",
    category: "Project Management & Operations",
    businessModel: "service",
    skills: ["organization", "tech", "coaching_consulting"],
    minHoursPerWeek: 6,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 30000,
    workStyle: "both",
    startupCost: 0,
    incomeModel: "Fractional Project / Launch Management Retainer ($2,000 to $4,500/mo per client) or 60-Day Implementation Sprint ($3,500)",
    avgUnitRevenue: 2500,
    unitLabel: "fractional PM retainers or launch sprints",
    hoursPerUnitPerWeek: 3.5,
    description: "Use your PMP, Agile, Scrum, or corporate project management skills to keep complex projects, website/product launches, client deliverables, and remote teams on schedule and under budget for fast-growing agencies, tech startups, and 7-figure founders.",
    targetAudience: "Marketing/creative agencies, funded startups, online education companies, and busy visionary CEOs",
    requirements: [
      "Strong project management background (timelines, resource allocation, sprint planning, stakeholder updates, Asana/ClickUp/Jira/Monday)",
      "6 to 15 flexible hours per week (mostly async project tracking + 1 weekly team standup call)",
      "$0 startup cost"
    ],
    tradeoffs: [
      "Pros: Very high monthly retainers ($2,000 to $4,500/mo per client) where just 2 fractional clients reach $5,000 to $8,000/mo.",
      "Tradeoff: Requires holding team members and contractors accountable to deadlines each week."
    ],
    quickTestStrategy: "Reach out to 10 agency owners or founders on LinkedIn offering a '$750 30-Day Project & Launch Roadmap Audit' where you organize their upcoming quarter in ClickUp/Asana/Monday.",
    first30DaysFocus: "Sign 2 Fractional Project Manager retainer clients at $2,000 to $3,000/mo each to manage their weekly deliverables and launches."
  },
  {
    id: "idea-49",
    name: "Home Decor, Interior Styling, Home Staging & Virtual Room Design",
    category: "Home Decor, Interior Styling & Organization",
    businessModel: "local-service",
    skills: ["home_local", "design_photo"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 12,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 20000,
    workStyle: "both",
    startupCost: 0,
    incomeModel: "Room Decor & Styling Packages ($750 to $1,500), Occupied Home Staging ($450 to $850) & Virtual E-Design Moodboards ($395/room)",
    avgUnitRevenue: 750,
    unitLabel: "room styling packages, staging consults, or virtual design boards",
    hoursPerUnitPerWeek: 1.5,
    description: "Help busy families and home sellers transform their living spaces with elevated home decor, interior styling, and functional layouts without full-scale renovations. Offer in-person room styling, nursery/playroom refreshes, occupied home staging for realtors, or 100% remote virtual e-design moodboards with clickable shopping lists.",
    targetAudience: "Busy families refreshing their home decor or nursery, homeowners preparing to sell, and local realtors",
    requirements: [
      "Strong eye for home decor, furniture layout, color palettes, lighting, and cozy functional styling",
      "Free Canva account for creating room decor moodboards and clickable furniture shopping links ($0 startup cost)",
      "Flexible weekday or weekend windows for in-home walkthroughs or 100% remote virtual room design"
    ],
    tradeoffs: [
      "Pros: Zero inventory required when doing room styling, occupied staging (using existing furniture + a shopping list), or virtual e-design.",
      "Tradeoff: Full vacant home staging requires renting furniture from third-party staging warehouses (billed directly to the home seller)."
    ],
    quickTestStrategy: "Style 2 rooms or cozy corners in your own home, create a sample Canva Home Decor Moodboard + Shopping List, and offer a '$350 Single-Room Decor & Layout Refresh' in local homeowner and mom groups.",
    first30DaysFocus: "Book 4 family room decor refreshes or virtual e-design boards and partner with 5 local listing realtors as their go-to '$450 Occupied Home Staging & Styling' specialist."
  },
  {
    id: "idea-50",
    name: "Move-In Concierge, Downsizing & Family Relocation Manager",
    category: "Home Decor, Interior Styling & Organization",
    businessModel: "local-service",
    skills: ["home_local"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 14,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 16000,
    workStyle: "client-facing",
    startupCost: 50,
    incomeModel: "Full Move-In / Downsizing Project Fee ($1,500 to $3,500 per household relocation)",
    avgUnitRevenue: 1800,
    unitLabel: "relocation or downsizing projects",
    hoursPerUnitPerWeek: 3,
    description: "Manage the stress-free packing prep, decluttering, mover oversight, utility/vendor coordination, and Day-1 kitchen and bedroom unpacking for busy executives, growing families, or seniors downsizing into smaller homes.",
    targetAudience: "Relocating corporate families, seniors downsizing, busy dual-income homeowners, and luxury realtors",
    requirements: [
      "Strong home organization, room layout planning, and vendor coordination skills",
      "Labeling supplies, room-by-room inventory checklists, and 2 on-call part-time unpacking helpers (~$50)",
      "Daytime project blocks 2 to 3 days per month"
    ],
    tradeoffs: [
      "Pros: High ticket size ($1,500 to $3,500 per move) where just 2 to 3 family relocations per month reaches $5,000+.",
      "Tradeoff: Move days are physically active unless you coordinate 2 part-time unpacking assistants (billed into the package)."
    ],
    quickTestStrategy: "Create a 1-page 'White-Glove Move-In Unpacking & Downsizing Concierge' menu and share it with 5 top local real estate teams and 3 senior living transition directors.",
    first30DaysFocus: "Book your first 2 move-in or downsizing projects at $1,500+ each and build a reliable 2-person on-call unpacking crew."
  },
  {
    id: "idea-51",
    name: "Paid Media Buyer & Performance Ads Agency (Meta Ads, Google Ads & TikTok Ads)",
    category: "Marketing, Paid Ads & Social Media",
    businessModel: "service",
    skills: ["marketing", "tech"],
    minHoursPerWeek: 5,
    optimalHoursPerWeek: 15,
    easeOf5k: 5,
    maxMonthlyIncomePotential: 30000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Monthly Ad Management Retainer ($1,500 to $3,500/mo per client, plus optional % of ad spend)",
    avgUnitRevenue: 2000,
    unitLabel: "monthly ad management retainers",
    hoursPerUnitPerWeek: 2.5,
    description: "Run profitable paid advertising campaigns on Meta (Facebook & Instagram Ads), Google Search / Local Service Ads, or TikTok Ads for local high-ticket businesses (med-spas, dental/ortho clinics, roofers, remodeling, law firms) or e-commerce brands. Because you directly generate patient bookings, leads, and sales, clients happily pay $1,500 to $3,500/mo on long-term retainers.",
    targetAudience: "Med-spas, cosmetic dentists, home service contractors, law firms, coaches, and e-commerce brands",
    requirements: [
      "Hands-on knowledge of Meta Ads Manager, Google Ads (PPC), conversion tracking pixels, and ad creative testing",
      "5 to 12 flexible behind-the-scenes hours per week from home (zero need to film your own face)",
      "$0 startup cost (clients pay their own ad spend directly on their card)"
    ],
    tradeoffs: [
      "Pros: Highest retainer ceiling in digital marketing ($1,500 to $3,500/mo per client); just 3 to 5 clients reaches $6,000 to $12,000+/mo.",
      "Tradeoff: Clients judge you on lead quality and Return on Ad Spend (ROAS), so you need a proven lead-generation offer structure."
    ],
    quickTestStrategy: "Use the free Meta Ad Library or Google search to find 10 local med-spas, clinics, or e-commerce brands running unoptimized ads (for example, boosting posts with no landing page or missing retargeting). Send a 2-minute Loom audit offering a '$1,250 30-Day Paid Lead Generation Sprint'.",
    first30DaysFocus: "Launch profitable Meta or Google Ad campaigns for your first 2 to 3 clients and transition them onto $1,500 to $2,500/mo ongoing media buying retainers."
  },
  {
    name: "Personal Wardrobe Stylist, Capsule Wardrobe Consultant & Virtual Shopper",
    category: "Fashion, Styling & Personal Shopping",
    skills: ["beauty", "design_photo", "home_local"],
    minHoursWeek: 4,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 15000,
    workStyle: "both",
    startupCost: 0,
    incomeModel: "Seasonal Capsule Styling Packages ($350 to $750) or Monthly VIP Retainers ($400 to $900/mo)",
    avgUnitRevenue: 450,
    unitLabel: "wardrobe styling packages or shopping retainers",
    hoursPerUnitPerWeek: 3,
    description: "Help busy moms, working executives, postpartum women, and professionals refresh their style, edit their closets, and look incredible without the stress of shopping alone. Offer in-person closet audits and local shopping trips, or 100% remote virtual styling with personalized digital lookbooks and direct clickable shopping links.",
    targetAudience: "Busy professional women, postpartum moms returning to work, wedding attendees, executives, and photo shoot clients",
    requirements: [
      "Natural eye for fashion, color palettes, body proportions, and putting together flattering outfits",
      "Free Canva or Google Slides for creating visual digital lookbooks with clickable shopping links",
      "4 to 10 flexible hours per week (works in-person on weekends or 100% remote during nap time)"
    ],
    tradeoffs: [
      "Pros: $0 startup cost and zero inventory to buy. You get paid for your style eye and shopping expertise while saving clients hours of fitting-room frustration.",
      "Tradeoff: In-person shopping requires local travel, but you can package virtual lookbooks and online shopping edits completely from home."
    ],
    quickTestStrategy: "Curate a 10-piece seasonal capsule wardrobe lookbook for a specific body type or occasion in Canva. Share it with 5 friends or in local mom groups and offer a '$250 Spring Wardrobe Edit & Clickable Shopping List' to your first 3 test clients.",
    first30DaysFocus: "Complete 3 closet edits, gather before-and-after photo testimonials, and partner with local boutiques, photographers, and hair stylists for client referrals."
  },
  {
    name: "Independent Market Research, Feasibility & Academic Grant Synthesis Consultant",
    category: "Research, Academia & Analysis",
    skills: ["writing", "organization", "tech"],
    minHoursWeek: 5,
    easeOf5k: 4,
    maxMonthlyIncomePotential: 20000,
    workStyle: "behind-the-scenes",
    startupCost: 0,
    incomeModel: "Research Reports & Literature Syntheses ($800 to $2,500) or Monthly B2B Retainers ($1,500 to $3,500/mo)",
    avgUnitRevenue: 1500,
    unitLabel: "comprehensive research projects or monthly analysis retainers",
    hoursPerUnitPerWeek: 4,
    description: "Turn your love for research, literature reviews, data analysis, and academic writing into high-value B2B projects. Help university professors, startups, non-profits, healthcare researchers, and consulting firms synthesize complex data, conduct competitive market analysis, prepare academic literature reviews, or draft evidence-based policy briefs entirely from home.",
    targetAudience: "University researchers, private foundations, tech startups, healthcare practices, and management consulting firms",
    requirements: [
      "Strong background in academic literature search, qualitative/quantitative analysis, data synthesis, or grant proposal research",
      "Reliable computer, internet access, and reference management tools (Zotero, Mendeley, Google Scholar)",
      "5 to 15 quiet behind-the-scenes hours per week on your own schedule with zero live sales calls"
    ],
    tradeoffs: [
      "Pros: 100% flexible, quiet computer work that pays premium professional rates ($800 to $2,500+ per project). Zero social media posting or video creation required.",
      "Tradeoff: Deliverables require rigorous attention to detail, citation accuracy, and meeting agreed research deadlines."
    ],
    quickTestStrategy: "Identify 10 academic faculty, independent research labs, or non-profit directors in your field. Send a tailored introductory note offering a fast 1-week literature review or data synthesis package for an upcoming paper or grant submission.",
    first30DaysFocus: "Secure 2 initial research or literature synthesis projects ($1,200 to $1,800 each) and establish relationships with 2 university departments or research firms for recurring contract work."
  }
];

/**
 * Helper to infer business model type ("licensed-advisory", "digital-product", "physical-product", "local-service", "service")
 */
window.inferBusinessModel = function inferBusinessModel(text) {
  const t = String(text || "").toLowerCase();
  if (
    t.includes("financial advisor") ||
    t.includes("insurance") ||
    t.includes("mortgage") ||
    t.includes("loan officer") ||
    t.includes("recruiting") ||
    t.includes("staffing") ||
    t.includes("placement") ||
    t.includes("government contract") ||
    t.includes("broker") ||
    t.includes("wealth")
  ) {
    return "licensed-advisory";
  }
  if (
    t.includes("printable") ||
    t.includes("template") ||
    t.includes("kdp") ||
    t.includes("ebook") ||
    t.includes("digital") ||
    t.includes("blog") ||
    t.includes("affiliate") ||
    t.includes("youtube") ||
    t.includes("newsletter") ||
    t.includes("course") ||
    t.includes("download")
  ) {
    return "digital-product";
  }
  if (
    t.includes("bake") ||
    t.includes("bakery") ||
    t.includes("cookie") ||
    t.includes("craft") ||
    t.includes("handmade") ||
    t.includes("gift box") ||
    t.includes("resell") ||
    t.includes("thrift") ||
    t.includes("etsy") ||
    t.includes("physical") ||
    t.includes("inventory") ||
    t.includes("apparel") ||
    t.includes("print on demand")
  ) {
    return "physical-product";
  }
  if (
    t.includes("local") ||
    t.includes("rental") ||
    t.includes("balloon") ||
    t.includes("organizing") ||
    t.includes("organizer") ||
    t.includes("notary") ||
    t.includes("photograph") ||
    t.includes("cleaning") ||
    t.includes("staging") ||
    t.includes("pet") ||
    t.includes("in-person") ||
    t.includes("event") ||
    t.includes("mc") ||
    t.includes("emcee") ||
    t.includes("dj") ||
    t.includes("picnic") ||
    t.includes("tablescape") ||
    t.includes("doula")
  ) {
    return "local-service";
  }
  return "service";
};

/**
 * Smart Google Sheets Column Mapper
 */
window.normalizeVaultRow = function normalizeVaultRow(rawRow, index) {
  const getVal = (keys, fallback = "") => {
    const rowEntries = Object.entries(rawRow || {});
    for (const keyPattern of keys) {
      const exact = rowEntries.find(([k]) => k.trim().toLowerCase() === keyPattern.toLowerCase());
      if (exact && exact[1] !== undefined && exact[1] !== null && String(exact[1]).trim() !== "") {
        return String(exact[1]).trim();
      }
    }
    for (const keyPattern of keys) {
      const partial = rowEntries.find(([k]) => k.trim().toLowerCase().includes(keyPattern.toLowerCase()));
      if (partial && partial[1] !== undefined && partial[1] !== null && String(partial[1]).trim() !== "") {
        return String(partial[1]).trim();
      }
    }
    return fallback;
  };

  const name = getVal(["idea name", "business idea", "idea", "title", "name", "business"], "");
  if (!name) return null;

  const category = getVal(["category", "type", "niche", "industry", "bucket", "pillar"], "Flexible Business");
  const rawSkills = getVal(["skills", "skill", "strengths", "good at", "tags", "category"], category);
  const rawHours = getVal(["available hours", "hours per week", "hours/week", "hours", "time commitment", "time", "weekly hours"], "5 to 10");
  const rawEase = getVal(["ease of making $5k", "ease of $5k", "ease", "difficulty", "5k ease", "rating", "score", "speed"], "4");
  const rawMaxIncome = getVal(["income potential", "max income", "income ceiling", "earning potential", "monthly income", "revenue potential"], "");
  const rawWorkStyle = getVal(["work style", "interaction", "style", "mode", "location"], "both");
  const rawStartupCost = getVal(["startup cost", "cost", "investment", "budget"], "0");
  const rawRequirements = getVal(["requirements", "what you need", "licensing", "tools needed", "prerequisites"], "");
  const rawTradeoffs = getVal(["tradeoffs", "pros and cons", "considerations", "challenges"], "");

  const combinedText = `${name} ${category} ${rawSkills}`;
  const businessModel = window.inferBusinessModel(combinedText);

  const defaultIncomeModel =
    businessModel === "licensed-advisory"
      ? "Commission or Placement Fees ($1,500 to $5,000+ per transaction)"
      : businessModel === "digital-product"
      ? "Digital Sales & Bundles ($19 to $49 per order)"
      : businessModel === "physical-product"
      ? "Product Orders & Bundles ($45 to $120 per order)"
      : businessModel === "local-service"
      ? "Local Bookings & Packages ($250 to $650 per booking)"
      : "Project Packages or Monthly Plans ($450 to $1,200)";

  const incomeModel = getVal(["pricing model", "income model", "how you make money", "monetization", "pricing", "offer"], defaultIncomeModel);
  const description = getVal(["description", "summary", "what it is", "details", "overview", "notes"], `Launch a flexible ${name} business designed around your available weekly hours.`);
  const targetAudience = getVal(["target audience", "ideal customer", "who buys", "who pays", "audience", "customers", "market"], "Families, shoppers, and local or online businesses");
  const quickTestStrategy = getVal(["testing strategy", "validation", "how to test", "quick test", "first step", "test"], "");
  const first30DaysFocus = getVal(["implementation", "implementation strategy", "first 30 days", "launch plan", "action plan", "roadmap"], "");

  const lowerSkillsText = `${rawSkills} ${category} ${name} ${description}`.toLowerCase();
  const matchedSkills = [];
  (window.SKILL_CATEGORIES || []).forEach((sc) => {
    if (sc.keywords.some((kw) => lowerSkillsText.includes(kw))) {
      matchedSkills.push(sc.id);
    }
  });
  if (matchedSkills.length === 0) {
    matchedSkills.push("organization");
  }

  let minHoursPerWeek = 5;
  let optimalHoursPerWeek = 10;
  const hourNums = String(rawHours).match(/\d+(\.\d+)?/g);
  if (hourNums && hourNums.length >= 2) {
    minHoursPerWeek = Math.max(1, parseFloat(hourNums[0]));
    optimalHoursPerWeek = Math.max(minHoursPerWeek, parseFloat(hourNums[1]));
  } else if (hourNums && hourNums.length === 1) {
    const val = parseFloat(hourNums[0]);
    if (String(rawHours).includes("<") || String(rawHours).toLowerCase().includes("under")) {
      minHoursPerWeek = 2;
      optimalHoursPerWeek = val;
    } else {
      minHoursPerWeek = Math.max(2, val - 2);
      optimalHoursPerWeek = val + 2;
    }
  }

  let easeOf5k = 4;
  const easeLower = String(rawEase).toLowerCase();
  const easeNumMatch = easeLower.match(/\d+(\.\d+)?/);
  if (easeNumMatch) {
    let n = parseFloat(easeNumMatch[0]);
    if (n > 5 && n <= 10) n = Math.round(n / 2);
    else if (n > 10 && n <= 100) n = Math.round(n / 20);
    easeOf5k = Math.max(1, Math.min(5, n));
  } else if (easeLower.includes("very easy") || easeLower.includes("high") || easeLower.includes("fast")) {
    easeOf5k = 5;
  } else if (easeLower.includes("easy")) {
    easeOf5k = 4;
  } else if (easeLower.includes("medium") || easeLower.includes("moderate")) {
    easeOf5k = 3;
  } else if (easeLower.includes("hard") || easeLower.includes("low")) {
    easeOf5k = 2;
  }

  let startupCost = 0;
  const costLower = String(rawStartupCost).toLowerCase();
  const costMatch = costLower.match(/\d+/);
  if (costMatch && !costLower.includes("free") && !costLower.includes("$0")) {
    startupCost = parseInt(costMatch[0], 10);
  }

  let workStyle = "both";
  const wsLower = `${rawWorkStyle} ${description}`.toLowerCase();
  if (wsLower.includes("behind") || wsLower.includes("async") || wsLower.includes("home") || wsLower.includes("online") || businessModel === "digital-product") {
    workStyle = "behind-the-scenes";
  } else if (wsLower.includes("in-person") || wsLower.includes("local") || wsLower.includes("people") || businessModel === "local-service" || businessModel === "licensed-advisory") {
    workStyle = "client-facing";
  }

  let avgUnitRevenue =
    businessModel === "licensed-advisory"
      ? 2500
      : businessModel === "digital-product"
      ? 29
      : businessModel === "physical-product"
      ? 75
      : businessModel === "local-service"
      ? 400
      : 650;

  const priceMatch = String(incomeModel).match(/\$(\d[\d,]*)/);
  if (priceMatch) {
    const parsedPrice = parseInt(priceMatch[1].replace(/,/g, ""), 10);
    if (parsedPrice >= 5 && parsedPrice <= 25000) {
      avgUnitRevenue = parsedPrice;
    }
  }

  const unitLabel =
    businessModel === "licensed-advisory"
      ? "policies, placements, or closed deals"
      : businessModel === "digital-product"
      ? "digital sales / downloads"
      : businessModel === "physical-product"
      ? "orders / bundles sold"
      : businessModel === "local-service"
      ? "local bookings"
      : "customer packages / accounts";

  let maxMonthlyIncomePotential =
    businessModel === "licensed-advisory"
      ? 35000
      : easeOf5k >= 5
      ? 14000
      : easeOf5k === 4
      ? 10000
      : 7500;
  if (rawMaxIncome) {
    const maxMatch = String(rawMaxIncome).replace(/,/g, "").match(/\d+/);
    if (maxMatch) {
      let m = parseInt(maxMatch[0], 10);
      if (m < 100 && String(rawMaxIncome).toLowerCase().includes("k")) m *= 1000;
      if (m >= 1000) maxMonthlyIncomePotential = m;
    }
  }

  const hoursPerUnitPerWeek =
    businessModel === "digital-product"
      ? 0.05
      : businessModel === "physical-product"
      ? 0.25
      : businessModel === "licensed-advisory"
      ? 2.5
      : Math.max(0.5, +(optimalHoursPerWeek / Math.max(2, Math.round(5000 / avgUnitRevenue))).toFixed(1));

  const requirements = rawRequirements
    ? rawRequirements.split(/[;\n•]+/).map((s) => s.trim()).filter(Boolean)
    : businessModel === "licensed-advisory"
    ? [
        `Requires applicable state/industry license or registration for ${name}`,
        `Time commitment: ${minHoursPerWeek} to ${optimalHoursPerWeek} hours/week`,
        `Estimated licensing/starter cost: Around $${startupCost || 250}`
      ]
    : [
        `Skills needed: ${rawSkills || category}`,
        `Time commitment: ${minHoursPerWeek} to ${optimalHoursPerWeek} hours/week`,
        `Estimated starter budget: ${startupCost === 0 ? "$0 (Bootstrapped with free tools)" : "Around $" + startupCost}`
      ];

  const tradeoffs = rawTradeoffs
    ? rawTradeoffs.split(/[;\n•]+/).map((s) => s.trim()).filter(Boolean)
    : businessModel === "licensed-advisory"
    ? [
        "Pros: High commission per transaction ($1,500 to $10,000+) and uncapped annual income potential.",
        "Tradeoff: Requires completing licensing/registration upfront before your first payout."
      ]
    : businessModel === "digital-product"
    ? [
        "Pros: Create once and sell repeatedly with 90%+ margins and zero shipping.",
        "Tradeoff: Takes 30 to 60 days of building your catalog and search traffic before sales become consistent."
      ]
    : businessModel === "physical-product"
    ? [
        "Pros: Tangible product that buyers love sharing and reordering for gifts/events.",
        "Tradeoff: Requires hands-on production/prep time and managing physical supplies."
      ]
    : businessModel === "local-service"
    ? [
        "Pros: Fast path to revenue where just a few local bookings per month can hit your income target.",
        "Tradeoff: Requires scheduled in-person windows in your local area."
      ]
    : [
        "Pros: $0 startup cost and predictable recurring monthly revenue from repeat customers.",
        "Tradeoff: Requires consistent delivery each week or month for active accounts."
      ];

  return {
    id: `sheet-idea-${index + 1}`,
    name,
    category,
    businessModel,
    skills: matchedSkills,
    rawSkillsText: rawSkills,
    minHoursPerWeek,
    optimalHoursPerWeek,
    easeOf5k,
    maxMonthlyIncomePotential,
    workStyle,
    startupCost,
    incomeModel,
    avgUnitRevenue,
    unitLabel,
    hoursPerUnitPerWeek,
    description,
    targetAudience,
    requirements,
    tradeoffs,
    quickTestStrategy:
      quickTestStrategy ||
      (businessModel === "digital-product" || businessModel === "physical-product"
        ? `Create 1 starter sample or mockup of your ${name} offer and test buyer interest with ${targetAudience} before producing a large inventory or full catalog.`
        : `Put together a simple starter package for ${name} and share it with 10 to 15 ${targetAudience} in your community or network to get your first bookings this week.`),
    first30DaysFocus:
      first30DaysFocus ||
      (businessModel === "digital-product" || businessModel === "physical-product"
        ? `Launch your core ${name} product bundle and set up a repeatable traffic/order flow.`
        : `Book your first 2 to 4 customers for ${name} using a clear, flat-rate starter package and collect reviews/photos from every order.`)
  };
};

/**
 * Merges Google Sheet ideas with DEFAULT_VAULT_IDEAS so that all newly added
 * ideas (Financial Advisor, Grant Writer, Mortgage Loan Originator, Senior Care
 * Placement, etc.) are always included and never lost when a Sheet is connected.
 */
window.mergeVaultWithSheetIdeas = function mergeVaultWithSheetIdeas(sheetIdeas) {
  const builtIn = window.DEFAULT_VAULT_IDEAS || [];
  const normalizedSheet = Array.isArray(sheetIdeas) ? sheetIdeas : [];
  const existingNames = new Set(
    normalizedSheet.map((item) => String(item.name || "").trim().toLowerCase())
  );

  const missingBuiltIn = builtIn.filter(
    (idea) => !existingNames.has(String(idea.name || "").trim().toLowerCase())
  );

  return {
    merged: [...missingBuiltIn, ...normalizedSheet],
    missingFromSheet: missingBuiltIn
  };
};

/**
 * Converts Vault idea objects into clean Google Sheets row objects for CSV export or live Sheet append
 */
window.formatVaultIdeasForGoogleSheet = function formatVaultIdeasForGoogleSheet(ideasList) {
  const list = Array.isArray(ideasList) ? ideasList : window.DEFAULT_VAULT_IDEAS || [];
  return list.map((idea) => ({
    "Idea Name": idea.name || "",
    "Category": idea.category || "",
    "Skills": (idea.skills || []).join(", "),
    "Available Hours": `${idea.minHoursPerWeek || 5} to ${idea.optimalHoursPerWeek || 12}`,
    "Ease of Making $5k": idea.easeOf5k || 4,
    "Income Potential": idea.maxMonthlyIncomePotential || 15000,
    "Work Style": idea.workStyle || "both",
    "Startup Cost": idea.startupCost ?? 0,
    "Pricing Model": idea.incomeModel || "",
    "Target Audience": idea.targetAudience || "",
    "Requirements": Array.isArray(idea.requirements) ? idea.requirements.join("; ") : String(idea.requirements || ""),
    "Tradeoffs": Array.isArray(idea.tradeoffs) ? idea.tradeoffs.join("; ") : String(idea.tradeoffs || ""),
    "Testing Strategy": idea.quickTestStrategy || "",
    "First 30 Days": idea.first30DaysFocus || "",
    "Description": idea.description || ""
  }));
};
