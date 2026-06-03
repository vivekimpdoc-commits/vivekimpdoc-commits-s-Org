import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add your Gemini API key in the Settings > Secrets panel of Google AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global In-Memory Database State for Thana (with default professional data)
const db = {
  personnel: [
    { id: "p1", name: "S. K. Singh", rank: "SHO / Inspector", dutyStatus: "On Station", badge: "HP-3042" },
    { id: "p2", name: "Anjali Sharma", rank: "Sub-Inspector", dutyStatus: "Investigating", badge: "HP-4122" },
    { id: "p3", name: "Rajesh Kumar", rank: "Sub-Inspector", dutyStatus: "Court Duty", badge: "HP-2101" },
    { id: "p4", name: "Amit Patwardhan", rank: "Head Constable", dutyStatus: "Beat Patrol", badge: "HP-5203" },
    { id: "p5", name: "Vikram Rathore", rank: "Constable", dutyStatus: "Beat Patrol", badge: "HP-6142" },
    { id: "p6", name: "Priya Verma", rank: "Constable", dutyStatus: "Lockup Guard", badge: "HP-7281" },
    { id: "p7", name: "Manoj Yadav", rank: "Constable", dutyStatus: "Desk Duty", badge: "HP-6390" }
  ],
  lockup: [
    {
      id: "l1",
      name: "Ramesh Kumar",
      age: 34,
      crime: "Theft of Motorcycle (Section 303(2) BNS)",
      risk: "Medium",
      timeIn: "2026-06-01T20:00:00Z",
      health: "Stable. Left knee minor bruising.",
      safetyChecks: [
        { time: "2026-06-02T08:00:00Z", checkedBy: "Priya Verma", status: "Sleeping, Breathing Normal" },
        { time: "2026-06-02T10:00:00Z", checkedBy: "Priya Verma", status: "Awake, Water provided" }
      ],
      belongings: "1 Wallet, Key ring, Steel wristband (all signed in locker #14)"
    },
    {
      id: "l2",
      name: "Suresh Meena",
      age: 29,
      crime: "Assault under influence (Section 115(2) BNS)",
      risk: "High",
      timeIn: "2026-06-02T02:30:00Z",
      health: "Requires diabetic insulin. Needs observation.",
      safetyChecks: [
        { time: "2026-06-02T05:00:00Z", checkedBy: "Manoj Yadav", status: "Highly Agitated, Secured" },
        { time: "2026-06-02T09:00:00Z", checkedBy: "Priya Verma", status: "Calmed down, Meds administered" }
      ],
      belongings: "Smart phone, INR 1200, Belts, Shoelaces (secured in Locker #09)"
    }
  ],
  armoury: [
    { id: "a1", name: "Glock 17 9mm Pistol", category: "Pistols", total: 12, secured: 10, out: 2, condition: "Excellent", checks: "Checked 01 Jun 2026" },
    { id: "a2", name: "INSAS Rifle 5.56mm", category: "Rifles", total: 18, secured: 14, out: 4, condition: "Serviced", checks: "Checked 01 Jun 2026" },
    { id: "a3", name: "Tear Gas Gun & Canister", category: "Riot Control", total: 4, secured: 4, out: 0, condition: "Operational", checks: "Checked 28 May 2026" },
    { id: "a4", name: "Bulletproof Tact Vest", category: "Safety Gear", total: 25, secured: 19, out: 6, condition: "Clean", checks: "Checked 30 May 2026" },
    { id: "a5", name: "9mm Pistol Ammo Ammunition", category: "Ammunition", total: 2200, secured: 2200, out: 0, condition: "Live Rounds", checks: "Sealed box verified" },
    { id: "a6", name: "5.56mm Rifle Ammo Ammunition", category: "Ammunition", total: 4500, secured: 4500, out: 0, condition: "Live Rounds", checks: "Sealed box verified" }
  ],
  malkhana: [
    { id: "m1", title: "Black Pulsar Motorcycle 150cc", engineNo: "ENG-840192A", caseRef: "FIR No. 102/2026", storageRack: "Bay 4 - Main Courtyard", depositDate: "2026-05-24", tagId: "MK-2026-102", status: "Locked & Tagged", safeLevel: "Secure" },
    { id: "m2", title: "Dell Laptop Inspiron & Red Charger", engineNo: "SN: 8401-FBA", caseRef: "FIR No. 115/2026", storageRack: "Evidence Locker B - Draw 3", depositDate: "2026-05-28", tagId: "MK-2026-115", status: "Forensic Bag Sealed", safeLevel: "Double Lock" },
    { id: "m3", title: "INR 2,45,000 Cash - In Hundred Denom", engineNo: "Cash Box #3", caseRef: "FIR No. 120/2026", storageRack: "Thana Safety Vault", depositDate: "2026-05-30", tagId: "MK-2026-120", status: "Verified & Deposited", safeLevel: "Dual Lock Access" },
    { id: "m4", title: "Suspicious White Crystalline Powder (420g)", engineNo: "Sealed packet #1", caseRef: "FIR No. 122/2026", storageRack: "Chemical Locker Safe F-1", depositDate: "2026-05-31", tagId: "MK-2026-122", status: "Lab Reports Pending", safeLevel: "Bio-Safety Sealed" }
  ],
  beatBooks: [
    { id: "b1", areaName: "Sector 4 Main Market & Transport Depot", beatOfficer: "Amit Patwardhan", hotspots: "Bus Terminal Entrance, ATM Lane #3", patrolStatus: "Active Guard Patrol", logs: ["Morning foot patrol completed without incidents.", "A warning issued to street vendor blocking traffic."] },
    { id: "b2", areaName: "Okhla Industrial Area - Phase II", beatOfficer: "Vikram Rathore", hotspots: "Abandoned warehouse back-road, Scrap yard", patrolStatus: "Night Patrol Assigned", logs: ["Night patrol check at midnight scheduled.", "CCTV cameras in scrap lane noted as operational."] },
    { id: "b3", areaName: "Vasant Kunj Block G-H Residential Welfare", beatOfficer: "Priya Verma", hotspots: "Central Park dark spots after 10 PM", patrolStatus: "In Progress", logs: ["Citizen meet conducted with association president of Block G.", "Requested municipal agency to repair green belt lamplights."] }
  ],
  dutyRoster: [
    { id: "dr1", shift: "Morning Shift (06:00 AM - 02:00 PM)", personnel: ["Amit Patwardhan", "Priya Verma", "S. K. Singh"], task: "Station Patrol and Despatch Duties" },
    { id: "dr2", shift: "Evening Shift (02:00 PM - 10:00 PM)", personnel: ["Anjali Sharma", "Manoj Yadav", "Vikram Rathore"], task: "Area Beat Inspections & Traffic management" },
    { id: "dr3", shift: "Night Guard Shift (10:00 PM - 06:00 AM)", personnel: ["Rajesh Kumar", "Vikram Rathore"], task: "Lockup Guarding & Emergency Quick Response Team (QRT)" }
  ],
  firs: [
    {
      id: "fir-101",
      firNumber: "FIR No. 124/2026",
      dateRecorded: "2026-06-02T09:15:00Z",
      state: "Uttar Pradesh / Delhi NCR",
      policeStation: "Sector-5 Thana, Noida District",
      complainant: "Harish Saxena, Age 42, Vasant Kunj",
      suspect: "Unknown/Two unidentified persons on a grey moped",
      offenseDate: "2026-06-02T08:10:00Z",
      narration: "Complainant was walking outside Central Park when two men on a grey moped without a registration plate approached. The pillion rider snatched his gold chain and a black Samsung phone (S23) and sped off towards the bypass.",
      legalSections: "Section 304(1) BNS (Snatching with Criminal Force)",
      hindiDraft: "शिकायतकर्ता हरीश सक्सेना (उम्र 42) जब पार्क के बाहर टहल रहे थे, तभी बिना नंबर प्लेट की ग्रे मोपेड पर दो अज्ञात युवक आए और जबरन सोने की चेन और सैमसंग फोन छीनकर बाईपास की तरफ फरार हो गए। भारतीय न्याय संहिता की धारा 304(1) के तहत मामला पंजीकृत।",
      englishDraft: "First Information Report drafted under legal section of Snatching. The incident involved dual offenders snatching a gold chain and mobile phone of the victim under speed. Physical investigation and CCTV scanning initiated in Bypass junction.",
      status: "Active"
    }
  ]
};

// 1. DATABASE ENDPOINTS (CRUD Local Sync)
app.get("/api/db", (req: Request, res: Response) => {
  res.json(db);
});

app.post("/api/db/fir", (req: Request, res: Response) => {
  const newFir = {
    id: `fir-${Date.now()}`,
    firNumber: req.body.firNumber || `FIR No. ${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`,
    dateRecorded: new Date().toISOString(),
    state: req.body.state || "National Capital Territory of Delhi",
    policeStation: req.body.policeStation || "Central Kotwali Thana",
    complainant: req.body.complainant || "Anonymous Informer",
    suspect: req.body.suspect || "Unidentified",
    offenseDate: req.body.offenseDate || new Date().toISOString(),
    narration: req.body.narration || "",
    legalSections: req.body.legalSections || "Not Specified",
    hindiDraft: req.body.hindiDraft || "",
    englishDraft: req.body.englishDraft || "",
    status: "Draft/Pending"
  };
  db.firs.unshift(newFir);
  res.status(201).json(newFir);
});

app.post("/api/db/lockup/check", (req: Request, res: Response) => {
  const { inmateId, checkedBy, status } = req.body;
  const inmate = db.lockup.find((l) => l.id === inmateId);
  if (!inmate) {
     res.status(404).json({ error: "Inmate not found" });
     return;
  }
  const check = {
    time: new Date().toISOString(),
    checkedBy: checkedBy || "Station Guard AI",
    status: status || "Normal, sleeping"
  };
  inmate.safetyChecks.unshift(check);
  res.json({ success: true, inmate });
});

app.post("/api/db/armoury/assign", (req: Request, res: Response) => {
  const { armId, assignTo, mode } = req.body; // mode: 'out' or 'in'
  const arm = db.armoury.find((a) => a.id === armId);
  if (!arm) {
     res.status(404).json({ error: "Weapon item not found" });
     return;
  }
  if (mode === "out") {
    if (arm.secured > 0) {
      arm.secured -= 1;
      arm.out += 1;
    } else {
       res.status(400).json({ error: "No inventory available in local secure vault" });
       return;
    }
  } else if (mode === "in") {
    if (arm.out > 0) {
      arm.secured += 1;
      arm.out -= 1;
    } else {
       res.status(400).json({ error: "No inventory currently signed out" });
       return;
    }
  }
  res.json(arm);
});

app.post("/api/db/malkhana/add", (req: Request, res: Response) => {
  const newItem = {
    id: `m-${Date.now()}`,
    title: req.body.title || "Seized Exhibit Item",
    engineNo: req.body.engineNo || "N/A - Non motor",
    caseRef: req.body.caseRef || "N/A",
    storageRack: req.body.storageRack || "General Store Box",
    depositDate: new Date().toISOString().split('T')[0],
    tagId: `MK-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: req.body.status || "Sealed & Marked",
    safeLevel: req.body.safeLevel || "Standard Lock"
  };
  db.malkhana.unshift(newItem);
  res.status(201).json(newItem);
});

app.post("/api/db/beat/note", (req: Request, res: Response) => {
  const { beatId, logNote } = req.body;
  const beat = db.beatBooks.find((b) => b.id === beatId);
  if (!beat) {
     res.status(404).json({ error: "Beat not found" });
     return;
  }
  beat.logs.unshift(`${new Date().toISOString().split('T')[0]}: ${logNote}`);
  res.json(beat);
});

app.post("/api/db/roster/update", (req: Request, res: Response) => {
  const { rosters } = req.body;
  if (rosters && Array.isArray(rosters)) {
    db.dutyRoster = rosters;
    res.json({ success: true, roster: db.dutyRoster });
  } else {
    res.status(400).json({ error: "Invalid roster format" });
  }
});


// 2. SERVER-SIDE GEMINI API INTENTIONS

// A. CRIME GPT: Auto-Draft Legal FIR (BNS/IPC compatible)
app.post("/api/copilot/draft-fir", async (req: Request, res: Response) => {
  const { complainantName, offenseDetails, callerState, currentThana } = req.body;

  if (!offenseDetails) {
     res.status(400).json({ error: "Offense specifications are required to draft an FIR" });
     return;
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a specialist Indian Legal Counsel and Police Advisor trained in Bharatiya Nyaya Sanhita (BNS - new Indian penal laws) and Indian Penal Code (IPC). Your job is to convert raw speech or text complaint narrations into a meticulously structured, legally sound Indian Police First Information Report (FIR) Draft. All outputs MUST include:
1. Recommended legal action sections (e.g. BNS Sections with equivalent old IPC equivalents, details on whether cognitive).
2. A formal, structured investigation draft in Hindi (हिन्दी ड्राफ्ट).
3. A formal, structured investigation draft in English (English Draft).
4. Recommended rapid next-steps/action points for the Investigating Officer (IO).

Formulate your response in VALID and strict JSON matching this schema:
{
  "complainant": "Extracted Complainant name and age",
  "suspect": "Extracted Suspect Description, vehicle identifiers, or unknown, etc.",
  "legalSections": "Explicit Section designation under BNS (with previous IPC in bracket, e.g. BNS 115(2) [IPC 323])",
  "hindiDraft": "Hindi formal complaint narrative formatted like Kotwali registers",
  "englishDraft": "English formal investigative narrative with appropriate structure",
  "priority": "High | Medium | Low based on immediate threat or public risk",
  "nextSteps": ["List of steps for police personnel, e.g. check CCTV, notify border, send forensic team"]
}`;

    const prompt = `Complainant: ${complainantName || "Not fully specified / Walk-in Witness"}
District/Thana context: ${currentThana || "Sector Thana, Kotwali"} in State: ${callerState || "NCT Delhi/Uttar Pradesh area"}
Incident Narration details: "${offenseDetails}"

Draft a professional, authoritative Indian Police FIR in JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response returned from the Gemini Model.");
    }

    const jsonResult = JSON.parse(textOutput.trim());
    res.json(jsonResult);

  } catch (error: any) {
    console.error("Gemini FIR Draft Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate FIR draft through Crime GPT",
      fallback: {
        complainant: complainantName || "Inquirer",
        suspect: "Unspecified/Under investigation",
        legalSections: "BNS Section 303 (Theft) / BNS Section 115 (Injury)",
        hindiDraft: `शिकायतकर्ता द्वारा दर्ज कराई गई रिपोर्ट: ${offenseDetails}. कानूनन जांच आरंभ।`,
        englishDraft: `The complaint filed relative to the narration: "${offenseDetails}" is prepared for active enquiry under BNS.`,
        priority: "Medium",
        nextSteps: ["Dispatch Beat Constable to inspect venue", "Verify CCTV coverage", "Seek weapon certification if applicable"]
      }
    });
  }
});

// B. AI SMART ROSTER: Personnel scheduler
app.post("/api/copilot/suggest-roster", async (req: Request, res: Response) => {
  const { shiftStructure, localPersonnelList, specialNotes } = req.body;

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are "Schedule AI / Duty Roster Optimizer" for Kotwali Police Stations. Your assignment is to distribute police officers intelligently across three main shifts:
- Morning Shift (06:00 AM - 02:00 PM)
- Evening Shift (02:00 PM - 10:00 PM)
- Night Guard / Patrol Shift (10:00 PM - 06:00 AM)

Based on the personnel provided, match officers to duties. E.g. senior SHO oversees general station, junior Constables assigned to patrols and lockup guards. High-risk areas or night shift requires alert personnel. Use custom local constraints or special notes requested.

Return valid JSON in this schema:
[
  {
    "shift": "Morning Shift (06:00 AM - 02:00 PM)",
    "personnel": ["Officer Name 1", "Officer Name 2"],
    "task": "Specific strategic focus/task assigned to this shift"
  },
  {
    "shift": "Evening Shift (02:00 PM - 10:00 PM)",
    "personnel": ["Officer Name 3", "Officer Name 4"],
    "task": "Strategic area deployment"
  },
  {
    "shift": "Night Guard Shift (10:00 PM - 06:00 AM)",
    "personnel": ["Officer Name 5"],
    "task": "Night patrol priority details"
  }
]`;

    const personnelInfo = localPersonnelList || JSON.stringify(db.personnel);
    const notes = specialNotes || "Ensure optimal distribution. Keep senior SHO in station, assign constables to active beat patrols.";
    const prompt = `Available Personnel List: ${personnelInfo}
Shift guidelines/notes: "${notes}"

Generate a balanced duty allocation for a safe Thana district environment. Return JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Missing response payload from Gemini scheduler.");
    }

    const rosterResult = JSON.parse(textOutput.trim());
    res.json(rosterResult);

  } catch (error: any) {
    console.error("Gemini Roster Error:", error);
    // Provide a valid fallback schedule directly based on standard rosters
    res.status(500).json({
      error: error.message || "Failed to schedule roster via AI",
      fallback: db.dutyRoster
    });
  }
});

// C. COPILOT LAW/THANA CONSULT: General Q&A / Legal assistant
app.post("/api/copilot/consult", async (req: Request, res: Response) => {
  const { question, category } = req.body;

  if (!question) {
     res.status(400).json({ error: "Query question is vital." });
     return;
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are "AI-SPS Copilot" - the premium digital assistant for station house officers (SHOs), sub-inspectors, and duty officers in India.
You provide advice under Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA). You can also answer operational questions on:
1. Armoury security management and weapon check logs.
2. In-Lockup inmate protection, safety check procedures, and suicide-prevention policies.
3. Seized property "Malkhana" tracking procedures, chemical labeling, and evidence vaults.
4. Beat Book maintenance, digital patrols, and high-crime hotspot analysis.

Answer in a direct, clear, highly legal yet practical manner. Use neat bullet points, list relevant sections, and support bilingual inputs. E.g. if requested in Hindi, explain in beautiful legal Hindi with English section keywords in brackets. Maintain a professional, helpful, objective, administrative tone.`;

    const prompt = `Category context: ${category || "General Policing / Law Counsel"}. Question: "${question}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5
      }
    });

    const answer = response.text || "No consultation generated by the model.";
    res.json({ answer });

  } catch (error: any) {
    console.error("Gemini Consult Error:", error);
    res.status(500).json({
      error: error.message || "Failed to obtain legal response due to connection parameters",
      answer: `AI Copilot is experiencing trouble reaching the legal knowledge base. If you have not configured your **GEMINI_API_KEY** in AI Studio's **Settings > Secrets**, please add it to utilize high-fidelity法律 advice under the BNS/BNSS framework.\n\n*Temporary advice*: General station logs show secure lockups. Ensure guards perform inspection runs every 2 hours as guided under the Thana manual.`
    });
  }
});

// Vite Middleware Integration for Dev / Prod Fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer();
