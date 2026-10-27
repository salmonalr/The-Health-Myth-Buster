import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory verification cache for sub-millisecond repeated responses
const claimCache = new Map<string, VerificationResponse>();

function normalizeClaimKey(claim: string): string {
  return claim.toLowerCase().trim().replace(/[?.,!]/g, '').replace(/\s+/g, ' ');
}

// Pre-seed starter claims for instant zero-latency clicks
const SEED_CLAIMS: VerificationResponse[] = [
  {
    claim: 'Does drinking alkaline water neutralize stomach acid or alter blood pH?',
    verdict: 'BUSTED',
    confidenceScore: 98,
    shortVerdictSummary: 'Alkaline water cannot alter systemic blood pH, as tightly regulated renal and pulmonary buffer systems rapidly neutralize it upon entering the stomach.',
    keyScientificFinding: 'Gastric parietal cells secrete hydrochloric acid (pH 1.5–2.0), immediately neutralizing ingested alkaline water. Blood pH is strictly maintained between 7.35 and 7.45 by bicarbonate buffering and respiratory expiration of carbon dioxide.',
    biologicalMechanism: 'Ingesting alkaline water triggers parietal cells to produce additional H+ ions via carbonic anhydrase to maintain gastric acidity. Blood pH deviations beyond 7.35–7.45 induce clinical alkalosis/acidosis; oral water has zero lasting effect on arterial blood gases.',
    misconceptionOrigin: 'Misapplication of the 1930s acid-ash hypothesis and commercial alkaline filtration machine marketing claiming acidic blood causes chronic diseases.',
    evidenceGrade: 'Grade A (High - Systematic Reviews & RCTs)',
    practicalTakeaway: 'Save your money. Standard municipal tap or filtered spring water provides equivalent hydration without the inflated cost.',
    keyCitations: [
      'Fenton TR, Huang T. Systematic review of the association between dietary acid load, alkaline water and cancer. BMJ Open. 2016.',
      'Koeppen BM. The role of the kidney in acid-base balance. Adv Physiol Educ. 2009.',
    ],
  },
  {
    claim: 'Are dietary seed oils toxic and inflammatory to cellular mitochondria?',
    verdict: 'BUSTED',
    confidenceScore: 94,
    shortVerdictSummary: 'Rigorous human clinical trials demonstrate that linoleic acid in seed oils does not increase systemic inflammatory biomarkers (CRP, IL-6, TNF-alpha) and reduces cardiovascular events.',
    keyScientificFinding: 'Meta-analyses of dozens of randomized controlled feeding trials show that replacing saturated fats with polyunsaturated seed oils lowers serum LDL-C, reduces ApoB, and improves insulin sensitivity without promoting inflammation.',
    biologicalMechanism: 'While linoleic acid (omega-6) is an upstream precursor to arachidonic acid, the in vivo conversion rate in humans is under 0.2%. Furthermore, arachidonic acid generates potent anti-inflammatory lipoxins and resolvins alongside prostaglandins.',
    misconceptionOrigin: 'Extrapolation from in-vitro high-heat lipid peroxidation experiments and rodent feeding studies using genetically abnormal oxidised oil diets.',
    evidenceGrade: 'Grade A (High - Systematic Reviews & RCTs)',
    practicalTakeaway: 'Seed oils (canola, sunflower, soybean) are safe and cardioprotective when used for home cooking, though heavily fried ultra-processed foods should be minimized.',
    keyCitations: [
      'Johnson GH, Fritsche K. Effect of dietary linoleic acid on markers of systemic inflammation in healthy persons. J Acad Nutr Diet. 2012.',
      'Marklund M, et al. Biomarkers of dietary omega-6 fatty acids and incident cardiovascular disease and mortality. Circulation. 2019.',
    ],
  },
  {
    claim: 'Does taking oral collagen supplements rebuild knee cartilage and skin elasticity?',
    verdict: 'NUANCED',
    confidenceScore: 82,
    shortVerdictSummary: 'Hydrolyzed collagen peptides provide amino acids that moderately improve skin hydration and joint pain, but cannot selectively target or regenerate worn cartilage matrix.',
    keyScientificFinding: 'Systematic reviews show modest improvements in skin hydration, dermis elasticity, and activity-related joint discomfort with 5-10g/day of hydrolyzed peptides, but radiologic trials show no cartilage regrowth.',
    biologicalMechanism: 'Ingested collagen is digested by pepsin and pancreatic proteases into free amino acids (glycine, proline, hydroxyproline) and dipeptides (Pro-Hyp). While these act as biological precursors and chemotactic signals for fibroblasts, they are distributed systemically.',
    misconceptionOrigin: 'Marketing suggesting that consuming collagen directly transplants intact collagen fibers into facial skin and joint capsules.',
    evidenceGrade: 'Grade B (Moderate - Cohort & Epidemiological)',
    practicalTakeaway: 'Collagen peptides may offer modest subjective joint relief and skin hydration, but any adequate dietary protein source (whey, eggs, legumes) supplies the same amino acids.',
    keyCitations: [
      'Choi FD, et al. Oral collagen supplementation: a systematic review of dermatological applications. J Drugs Dermatol. 2019.',
      'Clark KL, et al. 24-Week study on the use of collagen hydrolysate as a dietary supplement in athletes with activity-related joint pain. Curr Med Res Opin. 2008.',
    ],
  },
  {
    claim: 'Do ice baths and cold water immersion reduce muscle hypertrophy gains?',
    verdict: 'CONFIRMED',
    confidenceScore: 95,
    shortVerdictSummary: 'Cold water immersion immediately following resistance training blunts anabolic intracellular signaling pathways, attenuating long-term muscle mass and strength gains.',
    keyScientificFinding: 'Randomized trials demonstrate that post-exercise ice baths suppress amino acid incorporation and downregulate ribosomal biogenesis and p70S6K activity for hours post-workout.',
    biologicalMechanism: 'Cold-induced vasoconstriction reduces muscular microvascular perfusion and intracellular temperature, suppressing phosphorylation of the mechanistic target of rapamycin complex 1 (mTORC1) and satellite cell activation.',
    misconceptionOrigin: 'Conflating acute subjective soreness relief (delayed onset muscle soreness / DOMS suppression) with positive long-term muscular adaptation.',
    evidenceGrade: 'Grade A (High - Systematic Reviews & RCTs)',
    practicalTakeaway: 'Reserve cold immersion for competition days where rapid recovery overrides hypertrophy. Avoid cold baths within 4-6 hours after muscle-building resistance sessions.',
    keyCitations: [
      'Roberts LA, et al. Post-exercise cold water immersion attenuates acute anabolic signalling and long-term adaptations in muscle to strength training. J Physiol. 2015.',
      'Fyfe JJ, et al. Cold water immersion attenuates anabolic signaling and protein synthesis in human skeletal muscle. J Physiol. 2019.',
    ],
  },
];

SEED_CLAIMS.forEach((item) => {
  claimCache.set(normalizeClaimKey(item.claim), item);
});

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface VerificationResponse {
  claim: string;
  verdict: 'BUSTED' | 'CONFIRMED' | 'NUANCED' | 'PLAUSIBLE';
  confidenceScore: number;
  shortVerdictSummary: string;
  keyScientificFinding: string;
  biologicalMechanism: string;
  misconceptionOrigin: string;
  practicalTakeaway: string;
  evidenceGrade: string;
  keyCitations: string[];
}

// API Route: AI Myth & Claim Scanner
app.post('/api/verify-myth', async (req: Request, res: Response) => {
  try {
    const { claim } = req.body;

    if (!claim || typeof claim !== 'string' || claim.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a valid health claim to evaluate.' });
    }

    const normalizedKey = normalizeClaimKey(claim);

    // Instant cache return (<2ms)
    if (claimCache.has(normalizedKey)) {
      return res.json(claimCache.get(normalizedKey));
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
      });
    }

    // Execute with primary model (gemini-3.1-flash-lite for lowest latency), falling back to gemini-3.8-flash if congested
    let text: string | undefined;

    const generatePayload = (modelName: string) => ({
      model: modelName,
      contents: `Evaluate the following health claim with high scientific rigor: "${claim.trim()}"`,
      config: {
        thinkingConfig: {
          thinkingLevel: modelName.includes('lite') ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW,
        },
        systemInstruction: `You are Veritas, an authoritative clinical health myth debunker and biomedical evidence analyst.
Evaluate health, wellness, nutrition, fitness, and medical claims with empirical clinical literature, human physiology, and meta-analyses.
Categorize the verdict strictly into one of:
- "BUSTED": Refuted by robust clinical trials and physiological consensus.
- "CONFIRMED": Verified by reproducible scientific evidence and human trials.
- "NUANCED": Partially true under specific physiological conditions, but widely misunderstood or exaggerated.
- "PLAUSIBLE": Emerging mechanistic plausibility but lacking definitive large-scale randomized human trials.

Be objective, concise, and scientifically exact. Do not use generic filler words. Include concrete biological mechanisms and credible journal or health authority citations (e.g. WHO, Cochrane, JAMA, NEJM, Lancet).`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            claim: {
              type: Type.STRING,
              description: 'The exact health claim analyzed.',
            },
            verdict: {
              type: Type.STRING,
              enum: ['BUSTED', 'CONFIRMED', 'NUANCED', 'PLAUSIBLE'],
              description: 'The definitive empirical verdict.',
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: 'Scientific certainty score from 50 to 99 based on published trial rigor.',
            },
            shortVerdictSummary: {
              type: Type.STRING,
              description: 'One punchy, authoritative summary sentence debunking or confirming the claim.',
            },
            keyScientificFinding: {
              type: Type.STRING,
              description: 'Clear, concise clinical explanation of the current scientific consensus.',
            },
            biologicalMechanism: {
              type: Type.STRING,
              description: 'The biological, biochemical, or physiological mechanism underlying what actually occurs in the human body.',
            },
            misconceptionOrigin: {
              type: Type.STRING,
              description: 'How this myth originated or proliferated (e.g. misread animal study, commercial marketing, 19th century belief).',
            },
            practicalTakeaway: {
              type: Type.STRING,
              description: 'Actionable guidance for daily health, diet, or patient routine.',
            },
            evidenceGrade: {
              type: Type.STRING,
              enum: [
                'Grade A (High - Systematic Reviews & RCTs)',
                'Grade B (Moderate - Cohort & Epidemiological)',
                'Grade C (Preliminary - Animal/In-Vitro/Mechanistic)',
              ],
              description: 'Evidence quality grade.',
            },
            keyCitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 4 representative literature references or meta-analysis bodies.',
            },
          },
          required: [
            'claim',
            'verdict',
            'confidenceScore',
            'shortVerdictSummary',
            'keyScientificFinding',
            'biologicalMechanism',
            'misconceptionOrigin',
            'practicalTakeaway',
            'evidenceGrade',
            'keyCitations',
          ],
        },
      },
    });

    try {
      const response = await ai.models.generateContent(generatePayload('gemini-3.1-flash-lite'));
      text = response.text;
    } catch (primaryErr) {
      console.warn('Primary model gemini-3.1-flash-lite busy, falling back to gemini-3.8-flash:', primaryErr);
      const fallbackResponse = await ai.models.generateContent(generatePayload('gemini-3.8-flash'));
      text = fallbackResponse.text;
    }

    if (!text) {
      throw new Error('Empty response received from analysis model.');
    }

    const parsedData: VerificationResponse = JSON.parse(text);
    claimCache.set(normalizedKey, parsedData);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error during myth verification:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while evaluating the health claim.',
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Veritas server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
