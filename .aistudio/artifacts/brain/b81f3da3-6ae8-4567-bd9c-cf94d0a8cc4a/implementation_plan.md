# Veritas: Evidence-Based Health Myth Buster

An authoritative, clinically informed health myth exploration and verification platform. Veritas empowers users to debunk widespread medical and wellness misconceptions through an interactive verified myth repository, an AI-powered scientific claim scanner, a gamified Truth vs. Myth quiz, and browser notification permissions for daily science-backed health insights.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the clarification phase:

- **Core Capability & Feature Set**: A tripartite architecture consisting of:
  1. **Interactive Myth Database**: Curated catalog of high-impact health myths across Nutrition, Fitness, Sleep, Medicine, and Immunity with evidence ratings, biological mechanisms, and consensus summaries.
  2. **AI Scientific Myth Scanner**: Server-side claim evaluation using Gemini 3.8 Flash to analyze custom user-submitted health claims, outputting structured verdicts, scientific consensus, mechanisms, and PubMed/clinical trial grade evidence tiers.
  3. **Truth vs. Myth Quiz**: Rapid-fire interactive knowledge test with instant rationale reveals, streak scoring, and misconception breakdown.
- **Permission System**: Native Web Notifications API integration requesting permission for daily health myth-busting alerts, complete with a polite clinical rationale banner, custom notification schedule preferences, and a "Send Test Myth Alert" trigger.
- **Aesthetic Direction**: Modern clinical editorial theme with deep slate backgrounds, clinical teal accents (`#0D9488` / `#14B8A6`), hairline borders, clear typography, and structured evidence badges (no generic pill slop).

---

### 1. Overview & Core Concept

- **What It Does**: Veritas disassembles wellness folklore and viral health misinformation into clear, empirical medical reality. Users can browse categorized myths, search specific keywords, test their intuition in a randomized quiz, input custom claims for real-time scientific debunking, and subscribe to daily debunk alerts.
- **Target Audience & Persona**: Health-conscious individuals, fitness enthusiasts, patients, and students who want reliable, fluff-free biomedical facts without influencer hype or commercial bias.
- **Key Value**: Replaces anxiety and folk wisdom with empirical evidence, grading claims across standardized medical verdict categories: **Busted**, **Plausible**, **Nuanced**, or **Confirmed**.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Explore & Filter Repository**: Users land on the curated catalog featuring trending and high-stakes myths (e.g., "Drinking 8 glasses of water is mandatory", "Carbs after 8 PM turn directly into fat", "Cold weather gives you the common cold", "Natural sugars are healthier than white sugar"). Users filter by domain or search by symptom/claim, viewing instant summaries, evidence tier badges, and expanded biological mechanics.
2. **AI Claim Scanner**: Users type or paste any health claim into the claim console. The system queries the server-side Gemini 3.8 Flash engine to generate a structured analysis: Verdict, Confidence Score, Scientific Mechanism, Consensus vs. Controversy, and Clinical Takeaway.
3. **Truth vs. Myth Quiz**: An engaging 5-question or 10-question rapid quiz challenge. Users review a claim, select "Fact" or "Myth", and receive immediate visual feedback with detailed medical explanations and a final literacy score.
4. **Daily Notification Permission Modal**: A respectful, context-first prompt explains the value of daily myth-busting briefings. Upon user click, Veritas invokes `Notification.requestPermission()`. If granted, users can configure delivery time preferences and immediately trigger a test dispatch.

#### Visual Identity & Theme
- **Color System (60-30-10 Rule)**:
  - **60% Neutral Canvas**: Pristine clinical slate (`#0B0F17` dark background with crisp `#F8FAFC` light mode support; default sleek dark clinical laboratory posture).
  - **30% Structural Surfaces**: Lab slate containers (`#111827` / `#1E293B`) with crisp 1px hairline borders (`rgba(255, 255, 255, 0.08)` or `#E2E8F0`).
  - **10% Clinical Accents & Status**:
    - Primary Teal (`#14B8A6` / `#0D9488`) for active states and primary CTAs.
    - Verdict Crimson (`#EF4444`) for *Busted* myths.
    - Verdict Emerald (`#10B981`) for *Confirmed* facts.
    - Verdict Amber (`#F59E0B`) for *Nuanced / Context-Dependent* claims.
- **Zero-Pill & Metadata Discipline**:
  - Metadata (categories, study counts, reading duration) rendered as clean unboxed text with subtle typographic separators (`·` or `/`).
  - Verdict markers use crisp rectangular badges with mono tabular figures, avoiding bulbous candy pills.
- **Typography & Scale**:
  - Display & Headings: `Plus Jakarta Sans` or modern geometric sans with `text-wrap: balance`.
  - Body: High-legibility sans (`15px`–`16px` at `1.6` line-height).
  - Telemetry & Evidence Tiers: `font-mono tabular-nums` for citations, sample sizes, and dates.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini 3.8 Flash via Express/Vite Middleware**
  - *Chosen Approach*: Implement `/api/verify-myth` on the Node server using `@google/genai` with structured JSON schema (`responseSchema`).
  - *Why*: Eliminates client-side key leakage, ensures stable JSON response structure with typed fields, and delivers sub-second response times with `gemini-3.8-flash`.
  - *Alternative Considered*: Pre-compiled static myths only. Rejected because users constantly encounter novel claims online that require on-demand verification.
- **Decision 2: Native Web Notification API with Contextual Permission Banner**
  - *Chosen Approach*: A non-intrusive banner and dedicated toggle in the header/settings explaining *why* permission is requested before invoking browser prompt.
  - *Why*: Avoids browser permission fatigue and immediate dismissal. Includes fallback in-app toast preview for browsers with blocked notifications.
- **Decision 3: Rich Pre-Seeded Curated Corpus with Local Storage Bookmarks**
  - *Chosen Approach*: Ship with 20+ deeply researched, peer-reviewed medical myths across 5 categories, with instant local search and client-side bookmarking.
  - *Why*: Delivers immediate zero-latency value on first load without waiting for API calls.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VERITAS CLIENT APPLICATION                      │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Top Bar: Brand Wordmark · Tab Navigation · Permission Trigger  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                │                                       │
│          ┌─────────────────────┼─────────────────────┐                 │
│          ▼                     ▼                     ▼                 │
│   ┌──────────────┐     ┌──────────────┐      ┌──────────────┐          │
│   │ Myth Library │     │ Claim Scanner│      │  Truth Quiz  │          │
│   │ Curated Deck │     │ (AI Analysis)│      │ Interactive  │          │
│   │ Search/Filter│     │  Input Form  │      │ Streak/Score │          │
│   └──────────────┘     └──────────────┘      └──────────────┘          │
│          │                     │                     │                 │
│          └──────────────┬──────┴─────────────────────┘                 │
│                         ▼                                              │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ State Store (Active Tab, Bookmarks, Notification Settings,     │   │
│   │ Quiz Progress, Recent AI Verifications in localStorage)        │   │
│   └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ POST /api/verify-myth
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NODE SERVER / API PROXY                         │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Express Server / Vite API Handler                              │   │
│   │ Validates query, formats clinical prompt, enforces JSON schema │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │ @google/genai
│                                    ▼
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Gemini 3.8 Flash (Structured Verdict & Evidence Breakdown)     │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Entities & Models
- `HealthMyth`: `{ id, title, claim, verdict ('BUSTED' | 'CONFIRMED' | 'NUANCED' | 'PLAUSIBLE'), category, summary, scientificReality, biologicalMechanism, commonOrigin, evidenceGrade ('A' | 'B' | 'C'), referenceStudies: string[], readTime }`
- `VerificationResult`: `{ claim, verdict, confidence, keyFinding, physiologyExplanation, commonMisconception, practicalGuidance, evidenceTier, sources: string[] }`
- `QuizQuestion`: `{ id, statement, isFact: boolean, explanation, category, misconceptionStat }`
- `NotificationState`: `{ permission: NotificationPermission, dailyEnabled: boolean, alertHour: number, lastSentDate?: string }`

---

### 5. Implementation Sequence
1. **Backend Integration**: Create server API endpoint `/api/verify-myth` using `@google/genai` and `gemini-3.8-flash` with strict JSON schema.
2. **Metadata & Entry Point**: Update `metadata.json` and `index.html` with title "Veritas | Health Myth Buster" and matching OpenGraph meta tags.
3. **Core Curated Dataset**: Author high-yield medical and wellness myths grounded in established physiological facts.
4. **Interactive UI Components**:
   - Navigation bar with Notification Status and tab switcher.
   - Myth Explorer with search, category filtering, and drawer/modal detail view.
   - AI Myth Scanner with loading states, structured verdict cards, and evidence breakdowns.
   - Interactive Truth vs. Myth quiz with instant answer feedback and score calculation.
   - Permission management modal with test notification dispatching.
5. **Verification**: Run `compile_applet` and lint tests to verify clean TypeScript compilation and UI responsiveness.
