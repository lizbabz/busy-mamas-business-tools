/**
 * ============================================================================
 * BUSY MAMAS BUSINESS GROWTH ASSESSMENT - DATA & DIAGNOSTIC ENGINE
 * (growth-engine.js)
 * ============================================================================
 * For women and moms who already run a business and want to increase profit,
 * attract consistent customers, or grow without working more hours.
 */

window.GROWTH_BUSINESS_TYPES = [
  {
    id: "maternal-family-health",
    group: "advisory",
    label: "Health, Sleep, Postpartum & Family Care",
    sub: "Pediatric sleep consultant, postpartum doula, lactation consultant, nurse advocate, or birth coach"
  },
  {
    id: "coaching-advisory",
    group: "advisory",
    label: "Coaching, Mentorship & Personal Growth",
    sub: "Life coach, mindset & motherhood coach, career coach, business coach, relationship or wellness coach"
  },
  {
    id: "client-service-b2b",
    group: "service",
    label: "Virtual Assistant & Digital Agency",
    sub: "Virtual assistant, social media manager, copywriter, paid ads, online business manager (OBM), or video editor"
  },
  {
    id: "finance-legal-realestate",
    group: "advisory",
    label: "Bookkeeping, Tax & Financial Advisory",
    sub: "Bookkeeper, tax prep, financial coach, realtor, mortgage officer, loan signing/notary, or grant writer"
  },
  {
    id: "digital-products-downloads",
    group: "digital",
    label: "Digital Downloads, Printables & Courses",
    sub: "Etsy printables/templates, digital planners, workbooks, recorded masterclasses, or memberships"
  },
  {
    id: "physical-ecommerce-boutique",
    group: "maker",
    label: "Physical E-Commerce, Boutique & Retail",
    sub: "Shopify boutique, handmade products, apparel, jewelry, curated retail, or Amazon FBA"
  },
  {
    id: "product-food-maker",
    group: "maker",
    label: "Food, Baking, Catering & Meal Prep",
    sub: "Home bakery, custom cakes, private chef, meal delivery, charcuterie, or packaged food/spices"
  },
  {
    id: "local-events-styling",
    group: "local",
    label: "Events, Styling, Decor & Photography",
    sub: "Event planner, luxury picnic or balloon stylist, family/event photographer, videographer, or party rentals"
  },
  {
    id: "beauty-wellness-personal",
    group: "local",
    label: "Beauty, Hair, Lashes & Wellness Studio",
    sub: "Hair stylist/braider, lash/brow artist, makeup, esthetician/skincare, or pilates/fitness trainer"
  },
  {
    id: "home-family-local",
    group: "local",
    label: "Home Organizing, Cleaning & In-Person Care",
    sub: "Professional home organizer, residential/Airbnb cleaning, interior staging, or boutique childcare"
  },
  {
    id: "unsure-model",
    group: "unsure",
    label: "Other / Blended Business Model",
    sub: "My business mixes multiple models, or I am still figuring out the best way to structure it"
  }
];

window.GROWTH_SUB_NICHES = {
  "maternal-family-health": [
    { id: "pediatric-sleep", label: "Pediatric / Infant Sleep Consultant", placeholder: "e.g., 2-week virtual sleep training & routine packages for babies 4 to 24 months" },
    { id: "postpartum-doula", label: "Postpartum Doula & Newborn Care Specialist", placeholder: "e.g., In-home day or overnight newborn care and mama recovery packages" },
    { id: "lactation-feeding", label: "Lactation / Breastfeeding Consultant", placeholder: "e.g., 1-on-1 latch & feeding support consultations for new mothers" },
    { id: "nurse-clinical-advocate", label: "Nurse Advocate & Clinical Health Consultant", placeholder: "e.g., Healthcare navigation and care plans for elderly parents or chronic illness" },
    { id: "birth-doula-prep", label: "Birth Doula & Childbirth Educator", placeholder: "e.g., Prenatal education, labor support, and birth prep packages" },
    { id: "other-maternal-health", label: "Other Maternal / Pediatric Specialty", placeholder: "e.g., Pediatric OT, pelvic floor recovery, speech therapy" }
  ],
  "coaching-advisory": [
    { id: "life-mindset-motherhood", label: "Life, Mindset & Motherhood Coach", placeholder: "e.g., Mindset and boundary coaching for overwhelmed working mothers" },
    { id: "career-executive", label: "Career Transition & Executive Coach", placeholder: "e.g., Resume, salary negotiation, and leadership coaching for corporate women" },
    { id: "business-strategy", label: "Business, Sales & Launch Strategy Coach", placeholder: "e.g., Helping service providers package their offers and book clients" },
    { id: "health-wellness-nutrition", label: "Nutrition, Hormone & Weight Wellness Coach", placeholder: "e.g., Postpartum weight loss and hormone balancing meal plans" },
    { id: "relationship-marriage", label: "Marriage, Relationship & Family Coach", placeholder: "e.g., Communication and intimacy coaching for married couples" },
    { id: "other-coaching", label: "Other Specialized Coaching", placeholder: "e.g., Faith-based coaching, creative coaching" }
  ],
  "client-service-b2b": [
    { id: "virtual-assistant", label: "General Virtual Assistant (Admin & Inbox)", placeholder: "e.g., 20 hr/month retainer managing client inboxes, calendars, and customer service" },
    { id: "social-media-manager", label: "Social Media Manager & Content Creator", placeholder: "e.g., Instagram management, reels editing, and monthly content batching" },
    { id: "copywriter-email", label: "Copywriter & Email Marketing Strategist", placeholder: "e.g., Weekly sales newsletters, welcome sequences, and launch copy" },
    { id: "paid-ads-manager", label: "Meta, Google or TikTok Ads Specialist", placeholder: "e.g., Running paid ad campaigns for e-commerce shops or local clinics" },
    { id: "obm-systems", label: "Online Business Manager (OBM) & Tech Setup", placeholder: "e.g., Setting up Dubsado, ClickUp, Notion, and automated workflows" },
    { id: "podcast-video-editor", label: "Podcast & Short-Form Video Editor", placeholder: "e.g., Editing 4 episodes a month plus 12 short reels/TikToks" },
    { id: "other-agency", label: "Other Digital Agency Service", placeholder: "e.g., SEO specialist, web maintenance, graphic designer" }
  ],
  "finance-legal-realestate": [
    { id: "bookkeeper-cleanups", label: "Bookkeeper (Monthly Retainers & Cleanups)", placeholder: "e.g., Monthly bookkeeping and year-end tax prep for service businesses" },
    { id: "tax-preparation", label: "Tax Preparer & Tax Strategy", placeholder: "e.g., Individual and small business tax returns" },
    { id: "financial-coach", label: "Personal Finance & Budget Coach", placeholder: "e.g., Debt-payoff plans, cash-flow budgeting, and savings roadmaps" },
    { id: "realtor-mortgage", label: "Realtor or Mortgage Broker", placeholder: "e.g., Helping first-time homebuyers and relocators find homes" },
    { id: "mobile-notary", label: "Mobile Notary & Loan Signing Agent", placeholder: "e.g., Loan signings, hospital notaries, and power of attorney docs" },
    { id: "grant-writer", label: "Grant Writer & Nonprofit Consultant", placeholder: "e.g., Grant research, proposal writing, and donor strategy" },
    { id: "other-finance", label: "Other Financial / Professional Service", placeholder: "e.g., Insurance broker, credit repair, legal docs" }
  ],
  "digital-products-downloads": [
    { id: "etsy-printables", label: "Etsy Digital Downloads & Printables", placeholder: "e.g., Budget planners, chore charts, and party invitations" },
    { id: "canva-templates", label: "Canva Templates for Small Businesses", placeholder: "e.g., Social media bundles, slide decks, and ebook templates" },
    { id: "online-course-masterclass", label: "Digital Course, Masterclass or Workshop", placeholder: "e.g., 4-module video course teaching mothers how to meal plan" },
    { id: "monthly-membership", label: "Digital Monthly Membership or Subscription", placeholder: "e.g., $27/mo community membership with weekly resources and calls" },
    { id: "other-digital", label: "Other Digital Product Brand", placeholder: "e.g., Notion dashboards, digital sewing patterns, lightroom presets" }
  ],
  "physical-ecommerce-boutique": [
    { id: "shopify-apparel-boutique", label: "Women's or Kids' Clothing Boutique", placeholder: "e.g., Curated comfortable loungewear and modest dresses" },
    { id: "jewelry-accessories", label: "Handmade Jewelry & Hair Accessories", placeholder: "e.g., Polymer clay earrings, gold-filled necklaces, silk scrunchies" },
    { id: "candles-home-fragrance", label: "Hand-Poured Candles & Scents", placeholder: "e.g., Non-toxic coconut soy wax candles and linen sprays" },
    { id: "amazon-fba-kdp", label: "Amazon FBA Store or KDP Journals", placeholder: "e.g., Daily prayer journals and planners sold on Amazon" },
    { id: "other-physical-ecommerce", label: "Other Physical Product / Retail Brand", placeholder: "e.g., Custom gift boxes, baby blankets, organic skincare" }
  ],
  "product-food-maker": [
    { id: "custom-cakes-bakery", label: "Custom Cakes, Cupcakes & Celebrations", placeholder: "e.g., Luxury tiered birthday cakes, vintage buttercream cakes, cupcakes" },
    { id: "meal-prep-delivery", label: "Weekly Healthy Meal Prep Delivery", placeholder: "e.g., 5-meal weekly healthy family dinners delivered on Sundays" },
    { id: "catering-grazing", label: "Charcuterie, Graze Tables & Small Catering", placeholder: "e.g., Luxury charcuterie boards and bridal shower catering" },
    { id: "packaged-spices-sauces", label: "Packaged Sauces, Seasonings, Snacks & Baked Mixes", placeholder: "e.g., All-natural West African spice blends and pepper sauces" },
    { id: "other-food", label: "Other Specialty Food or Drink Business", placeholder: "e.g., Artisanal sourdough, cold-pressed juices, cookies" }
  ],
  "local-events-styling": [
    { id: "balloon-luxury-picnics", label: "Balloon Styling, Backdrops & Luxury Picnics", placeholder: "e.g., Custom balloon arches and luxury picnic setups for birthdays" },
    { id: "event-coordinator", label: "Event Planner & Day-Of Wedding Coordinator", placeholder: "e.g., Full wedding planning and day-of coordination packages" },
    { id: "family-event-photographer", label: "Family, Maternity & Milestone Photographer", placeholder: "e.g., 60-minute golden hour family and newborn photo sessions" },
    { id: "party-rentals", label: "Party Rentals (Bounce Houses, Photo Booths, Soft Play)", placeholder: "e.g., Modern white bounce houses and toddler soft play setups" },
    { id: "other-events", label: "Other Event or Creative Service", placeholder: "e.g., Florist, DJ/MC, videographer, event calligraphy" }
  ],
  "beauty-wellness-personal": [
    { id: "hair-braiding-studio", label: "Hair Stylist, Braider or Natural Hair Suite", placeholder: "e.g., Knotless braids, silk presses, and healthy hair treatments" },
    { id: "lash-brow-makeup", label: "Lash Extensions, Brow Artist or Bridal Makeup", placeholder: "e.g., Volume lash sets, brow lamination, and bridal glam" },
    { id: "esthetician-skincare", label: "Esthetician & Facial Studio", placeholder: "e.g., Custom facials, chemical peels, and acne treatment plans" },
    { id: "pilates-fitness-trainer", label: "Pilates, Yoga or Personal Fitness Trainer", placeholder: "e.g., Private in-home postpartum core rehab and pilates sessions" },
    { id: "other-beauty", label: "Other Beauty or Wellness Studio", placeholder: "e.g., Nail tech, spray tan artist, massage therapist" }
  ],
  "home-family-local": [
    { id: "home-organizer", label: "Professional Home Organizer", placeholder: "e.g., Pantry, closet, and playroom decluttering and organizing packages" },
    { id: "cleaning-turnover", label: "Residential or Airbnb Turnover Cleaning", placeholder: "e.g., Bi-weekly recurring home cleans and short-term rental turnovers" },
    { id: "boutique-childcare", label: "Licensed Day Home or Nanny Placement", placeholder: "e.g., High-quality infant and toddler home childcare spots" },
    { id: "interior-staging", label: "Home Staging & Interior Decorating", placeholder: "e.g., Vacant home staging for realtors and room refresh packages" },
    { id: "other-home-service", label: "Other Local Residential Service", placeholder: "e.g., Pet care, mobile auto detailing, laundry service" }
  ],
  "unsure-model": [
    { id: "hybrid-product-service", label: "Hybrid (Mix of Services and Products)", placeholder: "e.g., Selling in-person services plus digital resources or products" },
    { id: "pivoting-streamlining", label: "Pivoting / Simplifying an Existing Business", placeholder: "e.g., Transitioning away from burnout work to a simpler offer" },
    { id: "testing-new-direction", label: "Testing New Offers & Inquiries", placeholder: "e.g., Exploring what past clients are most willing to buy" }
  ]
};

window.GROWTH_REVENUE_STAGES = [
  {
    id: "pre-revenue",
    valUsd: 0,
    label: "Just Starting Out ($0 to $300/mo)",
    sub: "Getting started and looking for my first steady paying customers"
  },
  {
    id: "early-traction",
    valUsd: 1000,
    label: "Early Sales ($500 to $1,500/mo)",
    sub: "Making sales here and there, but income goes up and down from month to month"
  },
  {
    id: "steady-side",
    valUsd: 3000,
    label: "Steady Side Income ($1,500 to $4,000/mo)",
    sub: "Customers love what I sell, and I am ready to turn this into a reliable full income"
  },
  {
    id: "established",
    valUsd: 6500,
    label: "Growing Business ($4,000 to $9,000/mo)",
    sub: "Bringing in good monthly sales, but running out of hours or room to take on more"
  },
  {
    id: "scaling",
    valUsd: 14000,
    label: "Full-Time & Scaling ($9,000+/mo)",
    sub: "Strong monthly sales, looking to keep more profit and work fewer hours each week"
  }
];

window.GROWTH_PROFIT_MARGINS = [
  {
    id: "low-margin",
    pct: 0.22,
    label: "Keep Less Than a Third (Under 30%)",
    sub: "Supplies, ingredients, equipment, ads, or helpers eat up most of what I bring in"
  },
  {
    id: "healthy-margin",
    pct: 0.5,
    label: "Keep About Half (30% to 60%)",
    sub: "After paying for supplies and business expenses, I take home about half of my sales"
  },
  {
    id: "high-margin",
    pct: 0.78,
    label: "Keep Most of It (60% to 85%+)",
    sub: "Low-cost service, coaching, digital, or advice business with very low monthly expenses"
  },
  {
    id: "unsure-margin",
    pct: 0.35,
    label: "Not Sure Yet (Don't Track It)",
    sub: "Money comes in and goes out, so I am not sure how much I actually keep as profit"
  }
];

window.GROWTH_OFFER_STRUCTURES = [
  {
    id: "one-off-custom",
    label: "Custom Orders Made From Scratch",
    sub: "Every customer asks for something different and I price or make each order from scratch"
  },
  {
    id: "hourly-single",
    label: "Single Small Items or Hourly Pay",
    sub: "Selling individual low-priced items or charging by the hour instead of bundled packages"
  },
  {
    id: "tiered-packages",
    label: "Set Packages or Product Bundles",
    sub: "I have 2 or 3 clear packages or bundles, and I want more buyers picking the bigger ones"
  },
  {
    id: "retainer-recurring",
    label: "Monthly Plans or Repeat Subscriptions",
    sub: "Customers pay me every month on a regular schedule, and I want more monthly buyers"
  },
  {
    id: "unsure-offer",
    label: "Still Figuring Out What to Offer",
    sub: "I am still testing things out and do not have set packages or clear prices yet"
  }
];

window.GROWTH_PRICE_CONFIDENCE = [
  {
    id: "undercharging",
    label: "Charging Too Little for the Time It Takes",
    sub: "When I count all the prep, messages, and delivery hours, my hourly pay feels way too low"
  },
  {
    id: "price-pushback",
    label: "People Disappear After Hearing My Price",
    sub: "People ask 'How much?' in messages or emails, and then go quiet when I share my price"
  },
  {
    id: "confident-pricing",
    label: "Happy With My Prices",
    sub: "Buyers gladly pay my prices; I just need more people finding and booking me"
  },
  {
    id: "unsure-pricing",
    label: "Guessing My Prices (Not Sure)",
    sub: "I picked my prices by looking at others and have not worked out my real costs and profit"
  }
];

window.GROWTH_AVG_PRICE_TIERS = [
  {
    id: "under-50",
    valUsd: 35,
    label: "Under $50 per Order / Sale",
    sub: "Single baked goods, printables, small crafts, or individual items"
  },
  {
    id: "50-to-250",
    valUsd: 140,
    label: "$50 to $250 per Order / Appointment",
    sub: "Custom gift boxes, beauty appointments, mini photo sessions, or starter packages"
  },
  {
    id: "250-to-1000",
    valUsd: 550,
    label: "$250 to $1,000 per Package",
    sub: "Event setups, home styling/organizing packages, tutoring, or monthly business services"
  },
  {
    id: "1000-to-3000",
    valUsd: 1600,
    label: "$1,000 to $3,000+ per Client",
    sub: "Full event planning, monthly agency/business clients, coaching programs, or large commissions"
  },
  {
    id: "unsure-price-tier",
    valUsd: 150,
    label: "It Changes Every Time / Not Sure",
    sub: "My prices jump around depending on what each customer asks for"
  }
];

window.GROWTH_LEAD_SOURCES = [
  {
    id: "organic-social",
    label: "Organic Social Media (Instagram, TikTok, Facebook)",
    sub: "Reels, stories, Facebook groups, or everyday posts that I create manually"
  },
  {
    id: "paid-ads",
    label: "Paid Ads (Meta / Instagram / Facebook / Google)",
    sub: "Investing a budget into paid ads to bring in new customer inquiries automatically"
  },
  {
    id: "owned-list",
    label: "Owned Email List, SMS or VIP Broadcast Group",
    sub: "Sending regular emails, texts, or broadcast messages directly to an audience I own"
  },
  {
    id: "word-of-mouth",
    label: "Word-of-Mouth & Client Referrals",
    sub: "Past buyers and friends tell people about me whenever it happens to come up"
  },
  {
    id: "local-partners-b2b",
    label: "Local B2B Partners, Venues, or Corporate Clients",
    sub: "Realtors, event venues, salons, clinics, local offices, or corporate bulk buyers"
  },
  {
    id: "search-marketplaces",
    label: "Google Search, Website, Etsy or Amazon",
    sub: "Shoppers find my Google listing, website, or marketplace store when searching online"
  },
  {
    id: "no-lead-system",
    label: "No Steady Customer System Yet",
    sub: "I honestly do not know where my next 3 paying customers will come from"
  }
];

window.GROWTH_CONVERSION_ISSUES = [
  {
    id: "not-enough-leads",
    label: "Not Enough People Reaching Out",
    sub: "When people ask about my work they usually buy, but not enough new people find me each week"
  },
  {
    id: "dm-ghosting",
    label: "People Ask Questions Then Disappear",
    sub: "I spend time answering questions in messages or calls, and then they say 'I will think about it'"
  },
  {
    id: "feast-or-famine",
    label: "Busy One Month, Quiet the Next",
    sub: "One month I am swamped with orders, and the next month is slow because I had no time to promote"
  },
  {
    id: "unsure-conversion",
    label: "Not Sure Why People Don't Buy",
    sub: "I have not tracked how many inquiries actually turn into paying customers"
  }
];

window.GROWTH_REPEAT_RATES = [
  {
    id: "start-from-zero",
    pct: 0.05,
    label: "Almost None (Start From $0 Every Month)",
    sub: "Almost every sale is a one-time buy, so I have to find brand-new customers every single month"
  },
  {
    id: "occasional-repeat",
    pct: 0.25,
    label: "Some Repeat Buyers (15% to 35%)",
    sub: "Customers love my work and come back for birthdays or holidays, but not on a regular schedule"
  },
  {
    id: "strong-repeat",
    pct: 0.6,
    label: "Lots of Regulars or Monthly Clients (50%+)",
    sub: "At least half of my monthly sales come from regular customers, subscriptions, or monthly clients"
  },
  {
    id: "unsure-repeat",
    pct: 0.1,
    label: "Not Sure / Too Early to Tell",
    sub: "I have not been selling long enough or tracking repeat orders to know yet"
  }
];

window.GROWTH_RETENTION_SYSTEMS = [
  {
    id: "no-followup",
    label: "I Rarely Follow Up After an Order",
    sub: "Once I finish an order or service, I move on and rarely message past buyers with new offers"
  },
  {
    id: "manual-checkin",
    label: "Occasional Texts or Social Posts",
    sub: "I have past customers in my phone or DMs, but no customer list or regular check-in"
  },
  {
    id: "active-list-upsell",
    label: "Customer List or Repeat Offer Ready",
    sub: "I save customer emails or phone numbers and invite them back for refills, renewals, or new offers"
  }
];

window.GROWTH_DELIVERY_DRAINS = [
  {
    id: "manual-fulfillment",
    label: "Doing All the Hands-On Work Myself",
    sub: "Every single dollar requires my own two hands (baking, crafting, styling, or 1-on-1 sessions)"
  },
  {
    id: "admin-quoting",
    label: "Too Many Messages, Quotes & Admin",
    sub: "Back-and-forth messages, custom quotes, scheduling, and chasing payments eat up my week"
  },
  {
    id: "content-treadmill",
    label: "Making Social Media Content All Week",
    sub: "Spending hours filming and editing posts that barely turn into paying orders"
  },
  {
    id: "disorganized-systems",
    label: "Everything Lives in My Head",
    sub: "No checklists or saved templates yet, so every order feels like starting from scratch"
  },
  {
    id: "burned-out-model",
    label: "Drained by This Business Type",
    sub: "Honestly, even when I get customers, the day-to-day work no longer fits my energy or family life"
  }
];

window.GROWTH_PRIMARY_GOALS = [
  {
    id: "more-profit-same-hours",
    label: "Make More Profit in the Same Hours",
    sub: "Keep more money from every sale by offering better packages without working longer hours"
  },
  {
    id: "consistent-leads",
    label: "Get Steady Customers Every Week",
    sub: "Build a reliable way to bring in buyers so I never worry where next month's sales will come from"
  },
  {
    id: "recurring-revenue",
    label: "Stop Starting From $0 Every Month",
    sub: "Turn one-time buyers into regular monthly clients, group/business orders, or repeat subscribers"
  },
  {
    id: "reclaim-time",
    label: "Cut My Work Hours & Get Organized",
    sub: "Use simple booking links, saved replies, and prep days to get my evenings and weekends back"
  },
  {
    id: "questioning-fit",
    label: "Decide Whether to Fix This or Try Something New",
    sub: "Get an honest look at whether to fix this business or try a better-fitting idea"
  }
];

window.GROWTH_STORIES = [
  {
    id: "growth-story-pmu",
    preferredSteps: [2],
    tag: "Real Client Story • Pricing & High-Converting Systems",
    headline: "How a Permanent Makeup Artist Made Over {SYM}40,000 in 5 Weeks While Working 30% Fewer Hours",
    story:
    "She was undercharging, giving discounts on every DM request, and swamped with late-night messages. Together with Oyin, she raised her prices, launched structured seasonal promo pricing, set up a booking platform with FAQs to cut DM back-and-forth, ran local Meta ads, and reactivated past clients with incentivized touch-ups and SMS marketing.",
    takeaway:
      "She booked 112 clients (including 30 returning clients), made over {SYM}40,000 in just 5 weeks, and cut her weekly work hours by 30%.",
    metrics: ["Over {SYM}40k in 5 Weeks", "112 Booked Clients", "30% Fewer Hours"]
  },
  {
    id: "growth-story-food-vendor",
    preferredSteps: [3, 5],
    tag: "Real Client Story • Packages & Bulk Orders",
    headline: "How a Food Vendor Tripled Her Revenue & Booked Out Consecutive Weeks Without Showing Her Face",
    story:
      "She had poor city visibility and depended on chaotic WhatsApp groups, spending exhausting hours making one-off custom orders. Oyin helped her bundle her menu into structured packages and execute a high-converting, face-free social media content strategy.",
    takeaway:
      "She booked out consecutive weeks, began receiving bulk corporate orders, and tripled her revenue while freeing up her personal time.",
    metrics: ["Tripled Monthly Revenue", "Booked Out Consecutive Weeks", "Bulk Corporate Orders"]
  }
];

window.GrowthEngine = {
  getCurrencyObj(code) {
    return window.VaultEngine.getCurrencyObj(code);
  },

  formatMoney(amount, currencyCode) {
    return window.VaultEngine.formatMoney(amount, currencyCode);
  },

  scaleUsdToCurrency(usdAmount, currencyCode) {
    return window.VaultEngine.scaleUsdToCurrency(usdAmount, currencyCode);
  },

  /**
   * Diagnose the business's #1 Bottleneck, calculate realistic capacity math,
   * determine whether a "Reassess with Business Fit" bridge is warranted,
   * and generate 3 tailored Growth Priorities + a 30-Day Action Plan.
   */
  analyzeBusiness(gp) {
    const curCode = gp.currency || "USD";
    const cur = this.getCurrencyObj(curCode);
    const fmt = (val) => this.formatMoney(val, curCode);

    let currentRev = Number(gp.currentRevenue);
    if ((!currentRev || currentRev <= 0) && gp.revenueStageId && gp.revenueStageId !== "pre-revenue" && window.GROWTH_REVENUE_STAGES) {
      const stageObj = window.GROWTH_REVENUE_STAGES.find((s) => s.id === gp.revenueStageId);
      if (stageObj && stageObj.valUsd !== undefined) {
        currentRev = this.scaleUsdToCurrency(stageObj.valUsd, curCode);
      }
    }
    currentRev = Math.max(0, Number(currentRev) || 0);
    const targetRev = Math.max(currentRev + 500, Number(gp.targetRevenue) || 5000);
    const revenueGap = Math.max(500, targetRev - currentRev);

    const marginObj =
      window.GROWTH_PROFIT_MARGINS.find((m) => m.id === gp.profitMarginId) ||
      window.GROWTH_PROFIT_MARGINS[1];
    const marginPct = marginObj.pct;

    const currentProfit = Math.round(currentRev * marginPct);
    const targetProfitAtCurrentMargin = Math.round(targetRev * marginPct);
    const improvedMarginPct = Math.min(0.82, marginPct + 0.15);
    const targetProfitWithMarginLift = Math.round(targetRev * improvedMarginPct);

    const currentHours = Math.max(2, Number(gp.currentHours) || 15);
    const maxDesiredHours = Math.max(4, Number(gp.maxDesiredHours) || 12);
    const monthlyCurrentHours = currentHours * 4.3;
    const monthlyTargetHours = maxDesiredHours * 4.3;

    const currentHourlyRev = currentRev > 0 ? Math.round(currentRev / monthlyCurrentHours) : 0;
    const currentHourlyProfit = currentProfit > 0 ? Math.round(currentProfit / monthlyCurrentHours) : 0;
    const requiredHourlyRev = Math.round(targetRev / monthlyTargetHours);

    const priceTierObj =
      window.GROWTH_AVG_PRICE_TIERS.find((t) => t.id === gp.avgPriceTierId) ||
      window.GROWTH_AVG_PRICE_TIERS[1];
    const currentAvgOrder = this.scaleUsdToCurrency(priceTierObj.valUsd, curCode);

    const leadSources = Array.isArray(gp.leadSources)
      ? gp.leadSources
      : gp.leadSource
      ? [gp.leadSource]
      : [];

    // Count how many "Unsure / Missing Foundation" answers the user selected
    let unsureCount = 0;
    if (gp.businessType === "unsure-model") unsureCount += 2;
    if (gp.revenueStageId === "pre-revenue" || currentRev < 300) unsureCount += 1;
    if (gp.profitMarginId === "unsure-margin") unsureCount += 1;
    if (gp.offerStructure === "unsure-offer") unsureCount += 2;
    if (gp.priceConfidence === "unsure-pricing") unsureCount += 1;
    if (gp.avgPriceTierId === "unsure-price-tier") unsureCount += 1;
    if (leadSources.includes("no-lead-system")) unsureCount += 1;
    if (gp.conversionIssue === "unsure-conversion") unsureCount += 1;
    if (gp.repeatRateId === "unsure-repeat") unsureCount += 1;

    // Detect if the user should be encouraged to also reassess their business model via Business Fit
    const isBurnedOutOnModel =
      gp.deliveryDrain === "burned-out-model" ||
      gp.primaryGoal === "questioning-fit" ||
      gp.businessType === "unsure-model";
    const isOverworkedLowReturn =
      currentHours >= 20 && currentRev > 0 && currentRev <= this.scaleUsdToCurrency(1500, curCode) && gp.profitMarginId === "low-margin";
    const needsBusinessFitBridge = unsureCount >= 3 || isBurnedOutOnModel || isOverworkedLowReturn;

    let bridgeReason = "";
    if (gp.businessType === "unsure-model" || gp.offerStructure === "unsure-offer") {
      bridgeReason =
        "Because you mentioned you are still figuring out what to offer, your biggest win right now is getting clear on what you sell. Alongside the 30-day plan below, you can also use our Business Fit tool to compare your current business against 200+ flexible business ideas.";
    } else if (isBurnedOutOnModel || isOverworkedLowReturn) {
      bridgeReason =
        `You are putting in about ${currentHours} hours a week and feeling drained by the workload or low take-home pay. Before working even harder on a business that feels heavy, you can also test your skills in our Business Fit tool to see if an easier, higher-paying business idea fits your life better.`;
    } else if (unsureCount >= 3) {
      bridgeReason =
        "You picked 'Not sure yet' on a few questions about your numbers and prices. That is completely normal when you are still building your foundation! Follow the 3 steps below to set clear package prices, or check out Business Fit if you want to explore other business ideas for your skills.";
    }

    // Score the 5 Core Growth Roadblocks based on the 9-Engine Growth Master Matrix
    const bottlenecks = [
      {
        id: "pricing-packaging",
        title: "The #1 Thing Slowing Down Your Profit: Small Orders & Underpricing",
        eyebrow: "YOUR #1 ROADBLOCK • PRICING & PACKAGES",
        missingEngine: "Growth Engine #1: High-Margin Packaging & Pricing + Engine #8: AOV Expansion",
        stopDoing: "Stop quoting custom prices on the fly in DMs and stop taking single-item orders that barely cover ingredients or travel.",
        startDoing: "Package your work into a 3-tier menu with a minimum order size, an upfront 50% deposit, and high-margin checkout add-ons.",
        score:
          (gp.offerStructure === "one-off-custom" || gp.offerStructure === "hourly-single" ? 30 : 0) +
          (gp.priceConfidence === "undercharging" || gp.priceConfidence === "unsure-pricing" ? 28 : 0) +
          (gp.profitMarginId === "low-margin" || gp.profitMarginId === "unsure-margin" ? 22 : 0) +
          (gp.avgPriceTierId === "under-50" || gp.avgPriceTierId === "50-to-250" ? 18 : 0) +
          (gp.primaryGoal === "more-profit-same-hours" ? 20 : 0),
        diagnosisSummary: `Right now, your typical sale is around ${fmt(currentAvgOrder)} and you keep about ${Math.round(marginPct * 100)}% as profit. At that price, reaching ${fmt(targetRev)}/mo would take around ${Math.ceil(targetRev / Math.max(15, currentAvgOrder))} separate orders every single month! With only ${maxDesiredHours} hours a week to work, you will run out of time long before you hit your income goal unless we bundle what you sell into higher-priced packages or group orders.`,
        assumptionsNote: `Based on your current sales of ${fmt(currentRev)}/mo across ~${currentHours} hrs/week (${fmt(currentHourlyRev)}/hr in sales, ~${fmt(currentHourlyProfit)}/hr take-home pay before taxes) and your goal of ${fmt(targetRev)}/mo inside ${maxDesiredHours} hrs/week.`
      },
      {
        id: "retention-repeat",
        title: "The #1 Thing Keeping You on the Monthly Rollercoaster: Starting at $0 Every Month",
        eyebrow: "YOUR #1 ROADBLOCK • REPEAT BUYERS & RETENTION",
        missingEngine: "Growth Engine #4: The Owned List (Email & SMS) + Engine #6: Repeat & Retention Retainers",
        stopDoing: "Stop relying on social media algorithms to reach past buyers and stop treating every sale like a one-off transaction.",
        startDoing: "Collect client contact details into a VIP broadcast list and launch seasonal drops, refill reminders, or monthly support plans.",
        score:
          (gp.repeatRateId === "start-from-zero" ? 36 : gp.repeatRateId === "occasional-repeat" ? 18 : 0) +
          (gp.retentionSystem === "no-followup" ? 26 : gp.retentionSystem === "manual-checkin" ? 14 : 0) +
          (gp.conversionIssue === "feast-or-famine" ? 20 : 0) +
          (gp.primaryGoal === "recurring-revenue" ? 25 : 0),
        diagnosisSummary: `Your biggest challenge is not how hard you work. It is that almost every customer only buys once. When you start every month back at ${fmt(0)}, most of your energy goes into hunting for brand-new strangers instead of building on past work. Turning just a handful of happy past buyers into regular monthly customers or repeat orders is the fastest way to add +${fmt(revenueGap)}/mo without working more hours.`,
        assumptionsNote: `Assumes that keeping just 3 to 6 repeat or monthly customers at a bundled package price can cover 40% to 60% of your ${fmt(targetRev)}/mo goal automatically.`
      },
      {
        id: "lead-generation",
        title: "The #1 Thing Keeping Your Sales Unpredictable: Relying on Passive Word-of-Mouth",
        eyebrow: "YOUR #1 ROADBLOCK • STEADY CUSTOMERS & PIPELINE",
        missingEngine: "Growth Engine #3: High-Leverage Social Media + Engine #5: Systematic Referrals & Local Partners",
        stopDoing: "Stop waiting passively for friends to mention you and stop spending hours creating daily social posts with no direct call-to-action.",
        startDoing: "Deploy the 3-Post Batch Formula with DM keyword automation, and set up 5 reciprocal local business partnerships.",
        score:
          (leadSources.includes("no-lead-system") || (leadSources.length === 1 && leadSources.includes("word-of-mouth")) ? 34 : 0) +
          ((leadSources.includes("organic-social") || leadSources.includes("posting-social")) && gp.deliveryDrain === "content-treadmill" ? 28 : 0) +
          (gp.conversionIssue === "not-enough-leads" ? 32 : 0) +
          (gp.revenueStageId === "pre-revenue" || gp.revenueStageId === "early-traction" ? 16 : 0) +
          (gp.primaryGoal === "consistent-leads" ? 24 : 0),
        diagnosisSummary: `When people find you, they love what you do, but right now you are waiting on word-of-mouth or spending hours making social media posts that do not convert. To add +${fmt(revenueGap)}/mo inside ${maxDesiredHours} hours a week, you do not need viral videos. You just need 1 simple weekly habit of connecting with past buyers, running a 3-post conversion batch, and partnering with 5 local businesses who already have your ideal customers.`,
        assumptionsNote: `Assumes roughly 1 out of 5 warm referrals or personal check-ins turns into a booking, meaning you only need a small, steady stream of weekly inquiries to reach ${fmt(targetRev)}/mo.`
      },
      {
        id: "conversion-positioning",
        title: "The #1 Thing Leaking Bookings in Your Messages: DM Ghosting & Untracked Inquiries",
        eyebrow: "YOUR #1 ROADBLOCK • TURNING INQUIRIES INTO SALES",
        missingEngine: "Growth Engine #2: Time-Protection & 1-Link Booking + Engine #3: DM-to-Booking Keyword Funnel",
        stopDoing: "Stop replying with a plain price in a message and stop answering the same 5 questions individually from scratch.",
        startDoing: "Send a 1-page visual package menu with FAQs and an instant 50% deposit link so serious buyers lock in on the spot.",
        score:
          (gp.conversionIssue === "dm-ghosting" ? 42 : 0) +
          (gp.priceConfidence === "price-pushback" ? 34 : 0) +
          (gp.offerStructure === "unsure-offer" || gp.offerStructure === "one-off-custom" ? 18 : 0) +
          (gp.deliveryDrain === "admin-quoting" ? 20 : 0),
        diagnosisSummary: `People are already reaching out to you, but too many disappear after asking for your price. That usually happens when you reply with a plain price in a message instead of showing a clear 3-option package menu with photos, what is included, and an easy link to pay a deposit. Fixing how you show your options can double your bookings from the people already messaging you.`,
        assumptionsNote: `Assumes you are already getting inquiries and that showing a clear 3-option menu with a 50% deposit link will help more inquiries turn into paid orders.`
      },
      {
        id: "capacity-systems",
        title: "The #1 Thing Draining Your Time & Energy: Doing Everything From Scratch",
        eyebrow: "YOUR #1 ROADBLOCK • TIME, CAPACITY & FREEDOM",
        missingEngine: "Growth Engine #2: Set Work Days & Booking Systems + Engine #9: Micro-Team & Delegation",
        stopDoing: "Stop letting client messages interrupt your family evenings and stop delivering every single order on custom timelines.",
        startDoing: "Set strict cutoff hours, group prep into 2 dedicated batch days, and use saved message templates or a 5-hr/wk task helper.",
        score:
          (currentHours > maxDesiredHours ? 32 : 0) +
          (gp.deliveryDrain === "manual-fulfillment" || gp.deliveryDrain === "disorganized-systems" || gp.deliveryDrain === "admin-quoting" ? 28 : 0) +
          (gp.primaryGoal === "reclaim-time" ? 30 : 0) +
          (gp.revenueStageId === "established" || gp.revenueStageId === "scaling" ? 16 : 0),
        diagnosisSummary: `You are currently working about ${currentHours} hours a week (and want to be at ${maxDesiredHours} hours a week), which means you cannot grow by just working longer nights and weekends. Because you are quoting, prepping, or delivering each order from scratch, your week is full. Using set packages, saved replies, and dedicated prep days will save you ${Math.max(3, currentHours - maxDesiredHours + 3)}+ hours a week while helping you earn more.`,
        assumptionsNote: `Assumes that switching from custom one-off orders to set packages, an online order form, and grouped prep days cuts the time spent per customer by 30% to 45%.`
      }
    ];

    bottlenecks.sort((a, b) => b.score - a.score);
    const primaryBottleneck = bottlenecks[0];
    const secondaryBottleneck = bottlenecks[1];

    // Build the 3 Tailored Growth Priorities based on Business Type + Diagnosed Bottlenecks
    const priorities = this.buildThreePriorities(gp, {
      cur,
      fmt,
      currentRev,
      targetRev,
      revenueGap,
      currentProfit,
      targetProfitWithMarginLift,
      currentHours,
      maxDesiredHours,
      currentAvgOrder,
      primaryBottleneck,
      secondaryBottleneck
    });

    // Build the Focused 30-Day Action Plan (Weeks 1 to 4)
    const thirtyDayPlan = this.buildThirtyDayPlan(gp, priorities, {
      fmt,
      currentRev,
      targetRev,
      revenueGap,
      maxDesiredHours
    });

    return {
      primaryBottleneck,
      secondaryBottleneck,
      needsBusinessFitBridge,
      bridgeReason,
      unsureCount,
      metrics: {
        currentRev,
        targetRev,
        revenueGap,
        currentProfit,
        targetProfitAtCurrentMargin,
        targetProfitWithMarginLift,
        marginPct: Math.round(marginPct * 100),
        improvedMarginPct: Math.round(improvedMarginPct * 100),
        currentHours,
        maxDesiredHours,
        currentHourlyRev,
        currentHourlyProfit,
        requiredHourlyRev,
        currentAvgOrder
      },
      priorities,
      thirtyDayPlan
    };
  },

  buildThreePriorities(gp, ctx) {
    const { fmt, targetRev, revenueGap, maxDesiredHours, currentAvgOrder } = ctx;
    const bType = gp.businessType || "client-service-b2b";
    const isMaternalHealth = bType === "maternal-family-health";
    const isMaker = bType === "product-food-maker" || bType === "physical-ecommerce-boutique" || bType === "handmade-crafts-decor";
    const isLocal =
      bType === "local-events-styling" ||
      bType === "local-events-beauty" ||
      bType === "beauty-wellness-personal" ||
      bType === "home-family-local";
    const isDigital = bType === "digital-products-downloads" || bType === "digital-ecommerce";

    const subNicheList = (window.GROWTH_SUB_NICHES && gp.businessType && window.GROWTH_SUB_NICHES[gp.businessType]) || [];
    const subNicheMatch = subNicheList.find((sn) => sn.id === gp.subNicheId);
    const customNicheTitle = (gp.specificNiche && gp.specificNiche.trim()) || (subNicheMatch ? subNicheMatch.label : "");

    // Calculate realistic target package prices based on business type
    const upgradedPackagePrice = isMaternalHealth
      ? Math.max(this.scaleUsdToCurrency(950, gp.currency), Math.round(currentAvgOrder * 1.8))
      : isMaker
      ? Math.max(this.scaleUsdToCurrency(120, gp.currency), Math.round(currentAvgOrder * 2.2))
      : isDigital
      ? Math.max(this.scaleUsdToCurrency(47, gp.currency), Math.round(currentAvgOrder * 1.8))
      : isLocal
      ? Math.max(this.scaleUsdToCurrency(650, gp.currency), Math.round(currentAvgOrder * 1.6))
      : Math.max(this.scaleUsdToCurrency(1250, gp.currency), Math.round(currentAvgOrder * 1.6));

    const b2bOrRetainerPrice = isMaternalHealth
      ? Math.max(this.scaleUsdToCurrency(450, gp.currency), Math.round(upgradedPackagePrice * 0.45))
      : isMaker
      ? Math.max(this.scaleUsdToCurrency(450, gp.currency), upgradedPackagePrice * 3)
      : isDigital
      ? Math.max(this.scaleUsdToCurrency(97, gp.currency), upgradedPackagePrice * 2)
      : Math.max(this.scaleUsdToCurrency(1500, gp.currency), Math.round(upgradedPackagePrice * 1.4));

    const unitsNeededUpgraded = Math.max(1, Math.ceil(revenueGap / upgradedPackagePrice));
    const unitsNeededB2B = Math.max(1, Math.ceil(revenueGap / b2bOrRetainerPrice));

    // PRIORITY 1: OFFER, PACKAGING & PRICING LEVER (Tailored by Business Model)
    let p1 = {};
    if (isMaternalHealth) {
      const nicheDisplay = customNicheTitle || "Specialized Care";
      p1 = {
        rank: 1,
        badge: "Priority #1 • Fixed Transformation Intensive",
        impactScore: "98% Impact",
        shortLabel: "2-Week Intensive + Follow-Up Plan",
        title: `Stop Selling Ad-Hoc Calls: Package Your ${nicheDisplay} Into a Fixed 2-Week Transformation Intensive`,
        category: "Packages & Pricing",
        timeToImplement: "Days 1 to 7",
        shortHoursSaved: "4 to 6 hrs/week",
        shortBenefit: "Predictable pay per family",
        estHoursSaved: "Saves 4 to 6 hrs/wk on unstructured messaging",
        revenueImpact: `Brings in ${fmt(revenueGap)}/mo with just ${unitsNeededUpgraded} intensive client(s) at ${fmt(upgradedPackagePrice)}`,
        whyItMatters: `In specialized family care, sleep consulting, and maternal health, selling single ad-hoc calls leaves parents with unfinished results and leaves you answering messages at all hours. Packaging your care into a flat-price 2-Week Intensive (${fmt(upgradedPackagePrice)}) with defined text/call boundaries, plus an optional monthly check-in plan (${fmt(b2bOrRetainerPrice)}/mo), gives families complete relief while keeping your work strictly inside ${maxDesiredHours} hours a week.`,
        mathOptionA: {
          title: "Option A: Flat-Price 2-Week Transformation Intensive",
          formula: `${unitsNeededUpgraded} intensive client(s)/mo x ${fmt(upgradedPackagePrice)} = ${fmt(unitsNeededUpgraded * upgradedPackagePrice)}/mo`,
          sub: "Families get complete hands-on transformation and know their exact investment upfront."
        },
        mathOptionB: {
          title: "Option B: Ongoing Monthly Follow-Up Support",
          formula: `${unitsNeededB2B} monthly support client(s) x ${fmt(b2bOrRetainerPrice)}/mo = ${fmt(unitsNeededB2B * b2bOrRetainerPrice)}/mo`,
          sub: "Steady recurring income from happy past clients who want ongoing peace of mind."
        },
        requirements: [
          `Define your 2-Week Intensive (${fmt(upgradedPackagePrice)}) with an intake audit, 1 kickoff call, and 14 days of structured weekday text support`,
          "Set strict communication boundaries (e.g. voice/text notes answered between 9am and 3pm on weekdays, no late-night emergency pings)",
          "Provide a clear off-boarding checklist with an option to extend for monthly check-ins"
        ],
        tradeoffs: [
          "What gets easier: You work with just 2 to 4 families at a time at higher rates instead of chasing 20 different low-ticket inquiries.",
          "What to keep in mind: You must protect your personal phone number by using a dedicated business line or WhatsApp Business."
        ],
        scriptTitle: "Copy-Paste Intensive Offer Message for Past Inquiries",
        scriptText: `Hi [Name]! I was thinking about you and wanted to check in on how [sleep / your routine with baby] has been going lately. I am opening up 3 spots for our new 2-Week [Transformation Intensive] (${fmt(upgradedPackagePrice)}) next week, which includes our full customized plan plus daily weekday support to walk you through it step-by-step. Since we have spoken before, I would love to reserve one for your family if you are ready for more restful nights. Would you like me to send over the 1-page overview?`
      };
    } else if (isMaker) {
      p1 = {
        rank: 1,
        badge: "Priority #1 • Better Packages & Pricing",
        impactScore: "98% Impact",
        shortLabel: "Prepaid Bundles & Group Gift Orders",
        title: customNicheTitle
          ? `Stop Taking Tiny Custom Orders: Offer Prepaid ${customNicheTitle} Bundles & Business Gift Orders`
          : "Stop Taking Tiny Custom Orders: Switch to Prepaid Bundles & Local Business Gift Orders",
        category: "Packages & Pricing",
        timeToImplement: "Days 1 to 7",
        shortHoursSaved: "4 to 6 hrs/week",
        shortBenefit: "Earn 2x to 3x more per batch",
        estHoursSaved: "Saves 4 to 6 hrs/wk on prep & messages",
        revenueImpact: `+${fmt(revenueGap)}/mo (${unitsNeededUpgraded} bundles or ${unitsNeededB2B} business orders)`,
        whyItMatters: `In food, baking, and handmade businesses, small single-item custom orders quietly eat up all your time for very little profit. Setting a minimum bundle price (${fmt(upgradedPackagePrice)}) and offering a 'Client Thank-You Gift Bundle' (${fmt(b2bOrRetainerPrice)} for 8 to 12 gift boxes) for local realtors and offices lets you make everything in one batch and earn 3x more for your time.`,
        mathOptionA: {
          title: "Option A: Prepaid Weekly or Bi-Weekly Bundle Drops",
          formula: `${unitsNeededUpgraded} bundle orders/mo x ${fmt(upgradedPackagePrice)} = ${fmt(unitsNeededUpgraded * upgradedPackagePrice)}/mo`,
          sub: "Customers pay 100% upfront before you buy supplies, so nothing goes to waste."
        },
        mathOptionB: {
          title: "Option B: Local Business, Realtor & Event Gift Orders",
          formula: `${unitsNeededB2B} group orders/mo x ${fmt(b2bOrRetainerPrice)} = ${fmt(unitsNeededB2B * b2bOrRetainerPrice)}/mo`,
          sub: `Just ${unitsNeededB2B} local realtors, offices, or event hosts ordering each month reaches your goal.`
        },
        requirements: [
          `Set a minimum bundle or order price of ${fmt(upgradedPackagePrice)} instead of selling single low-priced items`,
          "Create a simple 1-page 'Client & Event Gift Menu' with 3 clear bundle options",
          "Collect full payment upfront on bundle orders before you start baking or making"
        ],
        tradeoffs: [
          "What gets easier: Cuts kitchen or studio prep time in half because you make the same bundle in one batch.",
          "What to keep in mind: Saying no to small $25 custom requests feels strange at first, but opens up your week for $150 to $500+ orders."
        ],
        scriptTitle: "Copy-Paste Local Business / Realtor Gift Message",
        scriptText: `Hi [Name]! I love following your work here in [City/Area]. We just put together our new Client Thank-You & Closing Gift Bundles for busy [realtors / clinics / business owners] who want to send an unforgettable local gift without any hassle. I have a simple 1-page menu with our ${fmt(upgradedPackagePrice)} and ${fmt(b2bOrRetainerPrice)} gift bundle options. Would you like me to send it over, or drop off a free sample box for your office this week?`
      };
    } else if (isLocal) {
      p1 = {
        rank: 1,
        badge: "Priority #1 • Better Packages & Pricing",
        impactScore: "98% Impact",
        shortLabel: "Simple 3-Option Package Menu",
        title: customNicheTitle
          ? `Stop Pricing Every Job From Scratch: Create a 3-Option Package Menu for Your ${customNicheTitle}`
          : "Stop Pricing Every Job From Scratch: Create a 3-Option Package Menu With a 50% Deposit",
        category: "Packages & Pricing",
        timeToImplement: "Days 1 to 7",
        shortHoursSaved: "3 to 5 hrs/week",
        shortBenefit: "Higher pay per booking",
        estHoursSaved: "Saves 3 to 5 hrs/wk on quoting",
        revenueImpact: `+${fmt(revenueGap)}/mo (${unitsNeededUpgraded} bookings at ${fmt(upgradedPackagePrice)} avg)`,
        whyItMatters: `In events, beauty, and home services, packing up, driving, and setting up take time no matter how small the job is. Taking tiny bookings uses up your best weekend or weekday hours for too little pay. Showing customers a simple 3-Option Package Menu (where your middle 'Most Popular' package is ${fmt(upgradedPackagePrice)} and your 'Full Service' package is ${fmt(b2bOrRetainerPrice)}) helps customers pick a bigger package right away.`,
        mathOptionA: {
          title: "Option A: 'Most Popular' Middle Package Bookings",
          formula: `${unitsNeededUpgraded} bookings/mo x ${fmt(upgradedPackagePrice)} = ${fmt(unitsNeededUpgraded * upgradedPackagePrice)}/mo`,
          sub: `Fits inside your ${maxDesiredHours} hrs/week limit by earning more from every appointment or event.`
        },
        mathOptionB: {
          title: "Option B: Full-Service / VIP / Corporate Bookings",
          formula: `${unitsNeededB2B} VIP bookings/mo x ${fmt(b2bOrRetainerPrice)} = ${fmt(unitsNeededB2B * b2bOrRetainerPrice)}/mo`,
          sub: "Fewer weekend or daytime bookings needed to reach your monthly income goal."
        },
        requirements: [
          `Put together a clean 1-page Package Menu with 3 options (Starter, Most Popular at ${fmt(upgradedPackagePrice)}, and VIP at ${fmt(b2bOrRetainerPrice)})`,
          "Require a 50% deposit upfront to hold any date on your calendar",
          "Include easy high-profit add-ons (touch-up kits, extra styling pieces, or follow-up maintenance visits)"
        ],
        tradeoffs: [
          "What gets easier: Stops people from disappearing in messages because they can clearly see your 3 options and pick what fits their budget.",
          "What to keep in mind: You have to stick to your minimum booking price for busy weekend dates."
        ],
        scriptTitle: "Copy-Paste Message Reply to Lock In Bookings",
        scriptText: `Hi [Name]! Thank you so much for reaching out about [Date / Service]. I currently have that spot open! To make it super easy for you, here is our 1-page Package Menu with photos and prices (most clients pick our ${fmt(upgradedPackagePrice)} Signature Package because it includes [Main Benefit]). Which of those 3 options feels best for you? Once you let me know, I will send over the 50% deposit link to lock in your date!`
      };
    } else if (isDigital) {
      p1 = {
        rank: 1,
        badge: "Priority #1 • Better Packages & Pricing",
        impactScore: "98% Impact",
        shortLabel: "Best-Seller Bundles & Checkout Add-Ons",
        title: customNicheTitle
          ? `Group Single Downloads Into a ${customNicheTitle} Bundle + Simple Checkout Add-On`
          : "Group Single Items Into a Best-Seller Bundle + Simple Checkout Add-On",
        category: "Packages & Pricing",
        timeToImplement: "Days 1 to 7",
        shortHoursSaved: "0 extra hrs/order",
        shortBenefit: "2x bigger order size",
        estHoursSaved: "No extra work per order",
        revenueImpact: `+${fmt(revenueGap)}/mo (${unitsNeededUpgraded} bundle sales at ${fmt(upgradedPackagePrice)})`,
        whyItMatters: `Selling a single $10 to $20 item means you have to find hundreds of buyers every month just to reach ${fmt(targetRev)}/mo. Grouping 5 to 10 matching items, templates, or products into a ${fmt(upgradedPackagePrice)} 'Complete Bundle' (plus a ${fmt(b2bOrRetainerPrice)} All-In-One VIP Pack) doubles or triples what you earn from the exact same shoppers.`,
        mathOptionA: {
          title: "Option A: Complete Best-Seller Bundle",
          formula: `${unitsNeededUpgraded} bundle sales/mo x ${fmt(upgradedPackagePrice)} = ${fmt(unitsNeededUpgraded * upgradedPackagePrice)}/mo`,
          sub: "Shoppers get everything they need in one click, and you earn much more per sale."
        },
        mathOptionB: {
          title: "Option B: All-In-One VIP Pack or Full Collection",
          formula: `${unitsNeededB2B} VIP pack sales/mo x ${fmt(b2bOrRetainerPrice)} = ${fmt(unitsNeededB2B * b2bOrRetainerPrice)}/mo`,
          sub: "Gives your biggest fans an easy way to buy your whole collection at once."
        },
        requirements: [
          `Combine your best-selling items into a ${fmt(upgradedPackagePrice)} Complete Bundle listing this week`,
          "Add a simple 1-click add-on offer at checkout so buyers can upgrade their order",
          "Update your top 5 product photos to show how much money they save by grabbing the bundle"
        ],
        tradeoffs: [
          "What gets easier: You earn more from every shopper visiting your store without spending extra time or money on ads.",
          "What to keep in mind: Takes 2 to 3 quiet hours once to group the items and make a clean bundle cover photo."
        ],
        scriptTitle: "Copy-Paste VIP Bundle Message for Past Shoppers",
        scriptText: `Hi [First Name]! Since you previously bought our [Product Name], I wanted to give you early VIP access to our new [Complete Bundle Name] (worth ${fmt(b2bOrRetainerPrice)}, yours for ${fmt(upgradedPackagePrice)} this week with code VIPBUNDLE). It includes [3 Helpful Items/Benefits] so you have everything ready to go in one place. You can check it out here before Friday: [Link]`
      };
    } else {
      // client-service-b2b, coaching-advisory, creative-photo-media, finance-legal-realestate, or unsure-model
      const clientRangeText =
        unitsNeededB2B === unitsNeededUpgraded
          ? `just ${unitsNeededB2B}`
          : `${Math.min(unitsNeededB2B, unitsNeededUpgraded)} to ${Math.max(unitsNeededB2B, unitsNeededUpgraded)}`;
      p1 = {
        rank: 1,
        badge: "Priority #1 • Better Packages & Pricing",
        impactScore: "98% Impact",
        shortLabel: "Starter Package + Monthly Plan",
        title: customNicheTitle
          ? `Stop Charging by the Hour: Package Your ${customNicheTitle} Into a Fixed Starter Package + Monthly Plan`
          : "Stop Charging by the Hour: Offer a Fixed Starter Package That Leads Into a Monthly Plan",
        category: "Packages & Pricing",
        timeToImplement: "Days 1 to 7",
        shortHoursSaved: "4 to 6 hrs/week",
        shortBenefit: "Steady monthly client pay",
        estHoursSaved: "Saves 4 to 6 hrs/wk on custom quotes",
        revenueImpact: `+${fmt(revenueGap)}/mo (just ${unitsNeededB2B} clients at ${fmt(b2bOrRetainerPrice)}/mo)`,
        whyItMatters: `Charging by the hour or writing a brand-new custom quote for every client caps your income and punishes you for working fast. Instead, package what you do into a flat-price '2-Week Starter Package' (${fmt(upgradedPackagePrice)}) that naturally leads into a ${fmt(b2bOrRetainerPrice)}/mo ongoing monthly plan. That way, you only need ${clientRangeText} active clients to add +${fmt(revenueGap)}/mo inside ${maxDesiredHours} hours a week.`,
        mathOptionA: {
          title: "Option A: Flat-Price 2-Week Starter Package",
          formula: `${unitsNeededUpgraded} starter packages/mo x ${fmt(upgradedPackagePrice)} = ${fmt(unitsNeededUpgraded * upgradedPackagePrice)}/mo`,
          sub: "Easy for new clients to say yes to because they know the exact price and result upfront."
        },
        mathOptionB: {
          title: "Option B: Ongoing Monthly Client Plan",
          formula: `${unitsNeededB2B} monthly clients x ${fmt(b2bOrRetainerPrice)}/mo = ${fmt(unitsNeededB2B * b2bOrRetainerPrice)}/mo`,
          sub: `Steady monthly income that fits neatly inside your ${maxDesiredHours} hrs/week schedule.`
        },
        requirements: [
          `Write down a clear Starter Package (${fmt(upgradedPackagePrice)}) and an Ongoing Monthly Plan (${fmt(b2bOrRetainerPrice)}/mo)`,
          "Stop billing by the hour and use a simple 1-page menu showing what is included",
          "Set clear reply hours (for example, 1 weekly update and replies within 24 hours on weekdays)"
        ],
        tradeoffs: [
          "What gets easier: Just 2 to 4 regular clients covers your monthly income goal using the same repeatable checklist.",
          "What to keep in mind: You have to kindly say no when clients ask for extra work that is not part of their package."
        ],
        scriptTitle: "Copy-Paste Starter Package & Monthly Plan Message",
        scriptText: `Hi [Name]! I saw you are working on [Specific Goal / Project]. Instead of a long, complicated custom quote, I offer a flat-price 2-Week [Starter Package Name] (${fmt(upgradedPackagePrice)}) where I handle [Main Result] for you from start to finish. After that, you are all set, or we can keep supporting you on our ${fmt(b2bOrRetainerPrice)}/mo monthly plan. Would you like me to send over the 1-page details?`
      };
    }

    // PRIORITY 2: CUSTOMER ACQUISITION & REPEAT REVENUE ENGINE (Engines #3, #4, #5 & #6)
    const repeatTargetCount = Math.max(2, Math.ceil(unitsNeededUpgraded * 0.5));
    const repeatRangeText =
      repeatTargetCount === unitsNeededUpgraded
        ? `${repeatTargetCount} to ${repeatTargetCount + 2}`
        : `${repeatTargetCount} to ${unitsNeededUpgraded}`;
    const p2 = {
      rank: 2,
      badge: "Priority #2 • Customer Acquisition & Repeat Sales",
      impactScore: "95% Impact",
      shortLabel: "Social Sprint, VIP List & Referral Partners",
      title: "Batch 3 Social Conversion Posts + VIP Broadcast Drop + 5 Local Referral Partners",
      category: "Steady Customers & Retention",
      timeToImplement: "Days 8 to 18",
      shortHoursSaved: "5+ hrs/week",
      shortBenefit: "Predictable repeat & referral orders",
      estHoursSaved: "Replaces 5+ hrs/wk of random social posting and message chasing",
      revenueImpact: `Brings in ${repeatRangeText} orders/clients without burning out`,
      whyItMatters:
        gp.repeatRateId === "start-from-zero" || gp.retentionSystem === "no-followup"
          ? "Right now, happy past customers who already trust you are not being invited back regularly, and social media posting feels like shouting into an empty room. Setting up a 3-post weekly conversion batch (Proof, Education, Direct Offer), sending a VIP broadcast message to past buyers, and teaming up with 5 local partners who serve the same clients brings in revenue 5x faster than chasing strangers on Instagram."
          : "Instead of riding the busy-one-month, slow-the-next rollercoaster, using a 3-post social conversion formula, checking in with past buyers via email/SMS once a month, and partnering with 5 local businesses sends you steady buyers even during busy family weeks.",
      mathOptionA: {
        title: "Path A: 3-Post Social Batch & VIP Broadcast Drop",
        formula: `Batch 3 conversion posts + VIP broadcast to 20 past contacts -> ${repeatTargetCount} orders at ${fmt(upgradedPackagePrice)} = ${fmt(repeatTargetCount * upgradedPackagePrice)} in sales`,
        sub: "Uses proven conversion templates (Proof, Education, Direct Offer) so social media actually drives deposits."
      },
      mathOptionB: {
        title: "Path B: 5 Reciprocal Referral Partners & B2B Gifting",
        formula: `5 local partners x 1 warm referral/month = 5 qualified buyers/mo`,
        sub: "Costs $0 in ads; local realtors, salons, event pros, or clinics love referring businesses that deliver excellence."
      },
      requirements: [
        "Batch 3 high-converting social media posts in 60 minutes: (1) Proof/Transformation result, (2) Common buyer mistake, (3) Direct offer with a keyword to message",
        "Compile a simple list of past buyers and inquiries into an owned VIP broadcast list (email, SMS, or WhatsApp VIP group) for seasonal drops and priority booking windows",
        "Connect with 5 non-competing local businesses who serve your ideal buyers to exchange referrals or supply client gift bundles"
      ],
      tradeoffs: [
        "What gets easier: You stop wondering what to post every day and stop starting every month at $0.",
        "What to keep in mind: Takes 60 to 90 minutes once a week to batch your content and send your VIP check-in."
      ],
      scriptTitle: "Copy-Paste VIP Broadcast & Social Offer Script",
      scriptText: `Hi [Name]! I loved working with you on [Past Order/Project] and wanted to give you first access before I post this publicly: I am opening [3 spots / a small batch] for our new [Package / Seasonal Bundle] this month. Since you are on our VIP list, I am including [Free Bonus / Priority Scheduling] if you book by Thursday. You can see the options and claim yours here: [Your Link]`
    };

    // PRIORITY 3: CAPACITY, SYSTEMS & MICRO-DELEGATION (Engines #2 & #9)
    const hoursSavedTarget = Math.max(3, Math.round(ctx.currentHours * 0.3));
    const p3 = {
      rank: 3,
      badge: "Priority #3 • Time-Protection & Automation",
      impactScore: "90% Impact",
      shortLabel: "1-Link Booking, Set Days & Micro-Help",
      title: `Save ${hoursSavedTarget}+ Hours a Week With a 1-Link Order Page, Set Work Days & Micro-Delegation`,
      category: "Time & Simple Systems",
      timeToImplement: "Days 19 to 30",
      shortHoursSaved: `~${hoursSavedTarget} hrs/week`,
      shortBenefit: "Protected evenings & zero DM quoting",
      estHoursSaved: `Saves ~${hoursSavedTarget} hrs/wk (${hoursSavedTarget * 4} hrs/mo)`,
      revenueImpact: `Keeps your work strictly under ${maxDesiredHours} hrs/wk while scaling to ${fmt(targetRev)}/mo`,
      whyItMatters: `Making ${fmt(targetRev)}/mo is not a win if it costs you every evening and weekend with your family. By replacing endless back-and-forth messages with a single 1-page menu and booking link, grouping fulfillment into 2 dedicated prep days, and handing off repetitive tasks to a 5-hour/week helper, you earn more per hour while protecting your home peace.`,
      mathOptionA: {
        title: "Time-Saver A: 1-Link Package Menu & Order Form",
        formula: `Cuts out 15+ back-and-forth messages a week = ~${Math.max(2, Math.round(hoursSavedTarget * 0.5))} hrs/wk saved`,
        sub: "Serious buyers can see your prices, review FAQs, and pay their 50% deposit in 2 minutes without phone tag."
      },
      mathOptionB: {
        title: "Time-Saver B: Set Prep Days & Micro-Delegation (5 hrs/wk)",
        formula: `Grouping prep into 2 set days + delegating packing/admin = ~${Math.max(2, Math.round(hoursSavedTarget * 0.5))} hrs/wk saved`,
        sub: "Stops task-switching and frees you to focus strictly on revenue-generating client work."
      },
      requirements: [
        "Set up one clean 'Order / Work With Me' page (using Canva, Stan Store, Square, Stripe, or HoneyBook) showing your 3 packages, FAQs, and a 50% deposit link",
        "Save your top 5 customer message replies in your phone notes so you can respond in two taps",
        "Designate 2 set work or prep days each week and create a 1-page checklist for a 5-hr/week helper or assistant"
      ],
      tradeoffs: [
        "What gets easier: Ends the mental exhaustion of answering quotes late at night and makes your week predictable.",
        "What to keep in mind: Requires holding your boundaries and directing all inquiries to your booking link."
      ],
      scriptTitle: "Copy-Paste Polite Boundary & 1-Link Booking Script",
      scriptText: `Hi [Name]! I would love to help you with this. To save you time going back and forth in messages, you can view our 3 package options, read answers to common questions, and lock in your date in 2 minutes right here: [Your Link]. My dedicated studio/work hours are [Your Days/Hours], and as soon as your booking comes through I will confirm everything for you!`
    };

    return [p1, p2, p3];
  },

  buildThirtyDayPlan(gp, priorities, ctx) {
    const { fmt, targetRev, revenueGap, maxDesiredHours } = ctx;
    const p1 = priorities[0];
    const p2 = priorities[1];

    return {
      headline: `Your Simple 30-Day Plan to Add ${fmt(revenueGap)}/mo (Inside ${maxDesiredHours} Hrs/Week)`,
      weeks: [
        {
          week: "Week 1 (Days 1 to 7)",
          title: "Package Your Work & Add Upfront Deposits",
          focus: "Launch Growth Engine #1 (Packaging & Pricing) and Engine #8 (Order Bumps/AOV).",
          tasks: [
            {
              id: "growth-w1-1",
              text: `Stop quoting tiny custom jobs from scratch and write down your 3-Option Package or Bundle Menu (${p1.mathOptionA.formula}).`
            },
            {
              id: "growth-w1-2",
              text: "Add an upfront 50% deposit link (or 100% prepayment for product batches) so you never start work without confirmed payment."
            },
            {
              id: "growth-w1-3",
              text: "Create a simple checkout add-on or VIP upgrade (e.g., expedited turnaround, maintenance kit, or deluxe gift box) to increase average order value."
            }
          ]
        },
        {
          week: "Week 2 (Days 8 to 14)",
          title: "Owned VIP Drop & Social Conversion Sprint",
          focus: "Launch Growth Engine #3 (High-Leverage Social Media) and Engine #4 (Owned Email/SMS List).",
          tasks: [
            {
              id: "growth-w2-1",
              text: "Write down a list of 20 past buyers and inquiries into an owned VIP broadcast list (email, SMS, or WhatsApp group)."
            },
            {
              id: "growth-w2-2",
              text: "Send the Priority #2 VIP Broadcast message offering first dibs and a small bonus on your new package menu."
            },
            {
              id: "growth-w2-3",
              text: "Batch 3 social conversion posts (Client Proof, Common Mistake Education, Direct Call-to-Action) and pin your package link in bio."
            }
          ]
        },
        {
          week: "Week 3 (Days 15 to 21)",
          title: "Referral Loops & Local B2B Corporate Partners",
          focus: "Launch Growth Engine #5 (Systematic Referrals) and Engine #7 (B2B Bulk Orders).",
          tasks: [
            {
              id: "growth-w3-1",
              text: "List 10 local or complementary business owners who serve your ideal buyers (realtors, event venues, salons, photographers, or offices)."
            },
            {
              id: "growth-w3-2",
              text: "Reach out to 5 potential partners offering a gift sample or proposing a 10% referral perk / client gift partnership."
            },
            {
              id: "growth-w3-3",
              text: "Invite every active client to reserve their next month's order, refill, or touch-up before their current project wraps."
            }
          ]
        },
        {
          week: "Week 4 (Days 22 to 30)",
          title: "1-Link Booking Automation & Micro-Team Plan",
          focus: "Launch Growth Engine #2 (Time-Protection & Booking Systems) and Engine #9 (Micro-Delegation).",
          tasks: [
            {
              id: "growth-w4-1",
              text: "Direct all incoming inquiries to your 1-page booking link and FAQ menu to eliminate endless back-and-forth messaging."
            },
            {
              id: "growth-w4-2",
              text: "Save your top 5 customer message replies and onboarding checklists in your phone notes for instant 2-tap responses."
            },
            {
              id: "growth-w4-3",
              text: `Review Month-1 sales against your ${fmt(targetRev)}/mo goal, and write a 1-page task list to hand off 5 hours of admin or prep to a helper next month.`
            }
          ]
        }
      ]
    };
  }
};
