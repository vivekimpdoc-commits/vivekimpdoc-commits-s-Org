import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertCircle,
  Users,
  Activity,
  Lock,
  Tag,
  Clock,
  Plus,
  Search,
  Mic,
  Send,
  CheckCircle,
  RefreshCw,
  FolderOpen,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle,
  Heart,
  Volume2,
  FileText,
  UserCheck,
  Check,
  Power,
  RotateCcw,
  Sliders
} from "lucide-react";
import { ThanaDatabase, Personnel, LockupInmate, ArmouryItem, MalkhanaItem, BeatBookItem, DutyRosterItem, FirDraft } from "./types";

export default function App() {
  // UI States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isHindi, setIsHindi] = useState<boolean>(true); // Prioritize Hindi as requested, single toggle to English
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  // DB State (With detailed fallbacks matching exact schema)
  const [db, setDb] = useState<ThanaDatabase>({
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
          { time: "2026-06-02T10:00:00Z", checkedBy: "Priya Verma", status: "Awake, Water provided" },
          { time: "2026-06-02T08:00:00Z", checkedBy: "Priya Verma", status: "Sleeping, Breathing Normal" }
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
          { time: "2026-06-02T09:00:00Z", checkedBy: "Priya Verma", status: "Calmed down, Meds administered" },
          { time: "2026-06-02T05:00:00Z", checkedBy: "Manoj Yadav", status: "Highly Agitated, Secured" }
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
        state: "National Capital Territory of Delhi",
        policeStation: "Noida Sector-5 Kotwali",
        complainant: "Harish Saxena, Age 42, Vasant Kunj",
        suspect: "Two unidentified persons on a grey moped",
        offenseDate: "2026-06-02T08:10:00Z",
        narration: "Complainant was walking outside Central Park when two men on a grey moped without a registration plate approached. The pillion rider snatched his gold chain and a black Samsung phone (S23) and sped off towards the bypass.",
        legalSections: "BNS Section 304(1) Snatching [Old IPC 379A]",
        hindiDraft: "शिकायतकर्ता हरीश सक्सेना (उम्र 42) जब पार्क के बाहर टहल रहे थे, तभी बिना नंबर प्लेट की ग्रे मोपेड पर दो अज्ञात युवक आए और जबरन सोने की चेन और सैमसंग फोन छीनकर बाईपास की तरफ फरार हो गए। भारतीय न्याय संहिता की धारा 304(1) के तहत मामला पंजीकृत किया गया है। स्थानीय सीसीटीवी कैमेरा फुटेज की जांच की जा रही है।",
        englishDraft: "First Information Report drafted under Section 304(1) of Bharatiya Nyaya Sanhita (BNS) for chain and phone snatching. The incident took place outside Central Park. Suspects approached on a registration-less grey moped. Investigation and physical area layout sanitization initiated.",
        status: "Active"
      }
    ]
  });

  // Time stamp state
  const [currentTimeStamp, setCurrentTimeStamp] = useState<string>("11:49:05 IST");

  // Crime GPT states
  const [complainantInput, setComplainantInput] = useState<string>("");
  const [speechNarration, setSpeechNarration] = useState<string>("");
  const [draftResult, setDraftResult] = useState<FirDraft | null>(null);
  const [isRecordingSimulated, setIsRecordingSimulated] = useState<boolean>(false);
  const [advisorQuery, setAdvisorQuery] = useState<string>("");
  const [advisorResponse, setAdvisorResponse] = useState<string>("");
  const [advisorCategory, setAdvisorCategory] = useState<string>("BNS Law");

  // Smart Scheduling states
  const [rosterNotes, setRosterNotes] = useState<string>("");
  const [aiOptimizing, setAiOptimizing] = useState<boolean>(false);

  // Malkhana item creation
  const [newMalkhanaTitle, setNewMalkhanaTitle] = useState<string>("");
  const [newMalkhanaCaseRef, setNewMalkhanaCaseRef] = useState<string>("");
  const [newMalkhanaRack, setNewMalkhanaRack] = useState<string>("Vault Desk Locker 2B");
  const [newMalkhanaNo, setNewMalkhanaNo] = useState<string>("");
  const [newMalkhanaStatus, setNewMalkhanaStatus] = useState<string>("Sealed with Lacquer Stamp");

  // Lockup Action Target
  const [selectedInmateId, setSelectedInmateId] = useState<string>("l1");
  const [newSafetyStatus, setNewSafetyStatus] = useState<string>("Sleeping peaceful under guard");
  const [guardCheckName, setGuardCheckName] = useState<string>("Const. Priya Verma");

  // Beat Note creation
  const [selectedBeatId, setSelectedBeatId] = useState<string>("b1");
  const [newBeatLogText, setNewBeatLogText] = useState<string>("");

  // Quick Consult Predefined Guides
  const consultationPresets = [
    { q: "What is the difference between Theft in BNS Section 303(2) and Snatching in Section 304?", k: "BNS Law" },
    { q: "What are the lockup standard safeguarding rules under BNSS for medical distress?", k: "Lockup Protect" },
    { q: "What protocols exist for sealing biological substances in the Malkhana evidence chamber?", k: "Malkhana Seizing" }
  ];

  // Tick IST Time
  useEffect(() => {
    const timer = setInterval(() => {
      const live = new Date();
      setCurrentTimeStamp(
        live.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }) + " IST"
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial db and state from local server (with state cache fallback)
  const syncDatabase = async () => {
    try {
      const res = await fetch("/api/db");
      if (res.ok) {
        const serverData = await res.json();
        setDb(serverData);
      }
    } catch (e) {
      console.warn("Database fallback loaded. Running as client-side dynamic instance.", e);
    }
  };

  useEffect(() => {
    syncDatabase();
  }, []);

  // API Action: Draft FIR with AI (Crime GPT)
  const handleDraftFir = async () => {
    if (!speechNarration.trim()) {
      alert("कृपया घटना का विवरण दर्ज करें। \nPlease write or dictate the crime description first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/copilot/draft-fir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complainantName: complainantInput || "Walk-In Complainant",
          offenseDetails: speechNarration,
          callerState: "Uttar Pradesh / NCR Kotwali Area",
          currentThana: "Sector-5 Thana"
        })
      });
      const data = await response.json();
      if (response.ok) {
        setDraftResult(data);
      } else {
        // Fallback implementation in case GEMINI_API_KEY is missing
        if (data.fallback) {
          setDraftResult(data.fallback);
        } else {
          throw new Error("Unable to fetch draft.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorText("Gemini Connection Error. Displaying offline-safe Indian Legal Draft.");
      // Standard local backup fallback
      setDraftResult({
        id: "offline-101",
        firNumber: `FIR No. ${Math.floor(100 + Math.random() * 900)}/2026`,
        dateRecorded: new Date().toISOString(),
        state: "National Capital Territory",
        policeStation: "Kotwali Main Station",
        complainant: complainantInput || "Complainant Harish Kumar",
        suspect: "Unidentified local elements",
        offenseDate: new Date().toISOString(),
        narration: speechNarration,
        legalSections: "BNS Section 303(2) (Trivial Theft equivalent) / Section 304 BNS (Snatching)",
        hindiDraft: `शिकायतकर्ता ${complainantInput || "नागरिक"} का बयान दर्ज किया गया। घटना विवरण: ${speechNarration}। भारतीय न्याय संहिता (BNS) के अंतर्गत एफआईआर सामान्य श्रेणी में अंकित की गई है। आवश्यक साक्ष्य एकत्रित किए जा रहे हैं।`,
        englishDraft: `The statement of the complainant ${complainantInput || "individual"} has been recorded. Narration: "${speechNarration}". Case registered under BNS rules. Duty Inspector scheduled for immediate scene visit.`,
        status: "Draft Filed Automatically"
      });
    } finally {
      setLoading(false);
    }
  };

  // API Action: Save the generated draft to active FIR list
  const handleSaveDraft = async () => {
    if (!draftResult) return;
    setLoading(true);
    try {
      const response = await fetch("/api/db/fir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firNumber: draftResult.firNumber,
          complainant: draftResult.complainant,
          suspect: draftResult.suspect,
          narration: draftResult.narration,
          legalSections: draftResult.legalSections,
          hindiDraft: draftResult.hindiDraft,
          englishDraft: draftResult.englishDraft,
          state: draftResult.state,
          policeStation: draftResult.policeStation
        })
      });
      if (response.ok) {
        await syncDatabase();
        alert(isHindi ? "सफलतापूर्वक एफआईआर को सक्रिय रजिस्टर में दर्ज किया गया!" : "FIR successfully compiled to active records!");
        // Reset inputs
        setComplainantInput("");
        setSpeechNarration("");
        setDraftResult(null);
        setActiveTab("dashboard");
      }
    } catch (e) {
      // Offline fallback state update
      const localNewFir: FirDraft = {
        ...draftResult,
        status: "Active"
      };
      setDb((prev) => ({
        ...prev,
        firs: [localNewFir, ...prev.firs]
      }));
      alert(isHindi ? "ऑफ़लाइन मोड: एफआईआर को स्थानीय रूप से सेव कर लिया गया है!" : "Offline Mode: Registered FIR in local state!");
      setComplainantInput("");
      setSpeechNarration("");
      setDraftResult(null);
      setActiveTab("dashboard");
    } finally {
      setLoading(false);
    }
  };

  // API Action: Schedule Optimizer with AI
  const handleOptimizeRoster = async () => {
    setAiOptimizing(true);
    try {
      const response = await fetch("/api/copilot/suggest-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftStructure: "3 Shifts standard daily policing code",
          localPersonnelList: JSON.stringify(db.personnel),
          specialNotes: rosterNotes || "Minimize consecutive graveyard shifts. Assign active officers and balanced teams."
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Now save optimized roster to db
        const saveRes = await fetch("/api/db/roster/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rosters: data })
        });
        if (saveRes.ok) {
          await syncDatabase();
          alert(isHindi ? "एआई ने ड्यूटी रोस्टर को अनुकूलित व अपडेट कर दिया है!" : "Success! AI has fully optimized and committed the new roster!");
        } else {
          setDb(prev => ({ ...prev, dutyRoster: data }));
        }
      } else if (data.fallback) {
        setDb(prev => ({ ...prev, dutyRoster: data.fallback }));
        alert(isHindi ? "एआई रोस्टर अनुकूलित किया गया (सुरक्षित स्थानीय प्रारूप)!" : "AI Roster Generated (Fallback Active)!");
      }
    } catch (e) {
      alert("AI optimization failed to reach the server. Applying offline rotation algorithm.");
      // Shuffles array slightly for simulation
      const shuffled = [...db.dutyRoster].map((item, idx) => ({
        ...item,
        task: idx === 0 
          ? "Heavy Traffic & Market Patrols (" + (rosterNotes || "Optimized Level") + ")" 
          : item.task
      }));
      setDb(prev => ({ ...prev, dutyRoster: shuffled }));
    } finally {
      setAiOptimizing(false);
    }
  };

  // API Action: Weapon Checkout Out/In sign
  const handleWeaponSign = async (armId: string, mode: "out" | "in") => {
    try {
      const res = await fetch("/api/db/armoury/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ armId, mode })
      });
      if (res.ok) {
        await syncDatabase();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (e) {
      // Local state fallback update
      setDb((prev) => {
        const newArmy = prev.armoury.map((a) => {
          if (a.id === armId) {
            if (mode === "out" && a.secured > 0) {
              return { ...a, secured: a.secured - 1, out: a.out + 1 };
            } else if (mode === "in" && a.out > 0) {
              return { ...a, secured: a.secured + 1, out: a.out - 1 };
            }
          }
          return a;
        });
        return { ...prev, armoury: newArmy };
      });
    }
  };

  // API Action: Hourly Lockup Guard safety mark
  const handleAddLockupCheck = async () => {
    if (!newSafetyStatus.trim()) {
      alert("विवरण खाली नहीं छोड़ा जा सकता। Detail is mandatory.");
      return;
    }
    try {
      const res = await fetch("/api/db/lockup/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inmateId: selectedInmateId,
          checkedBy: guardCheckName,
          status: newSafetyStatus
        })
      });
      if (res.ok) {
        await syncDatabase();
        setNewSafetyStatus("");
        alert(isHindi ? "लॉकअप सुरक्षा रजिस्टर अपडेट किया गया!" : "Hourly lockup safety checklist submitted!");
      }
    } catch (e) {
      // Local check entry fallback
      setDb((prev) => {
        const updated = prev.lockup.map((l) => {
          if (l.id === selectedInmateId) {
            return {
              ...l,
              safetyChecks: [
                { time: new Date().toISOString(), checkedBy: guardCheckName, status: newSafetyStatus },
                ...l.safetyChecks
              ]
            };
          }
          return l;
        });
        return { ...prev, lockup: updated };
      });
      setNewSafetyStatus("");
      alert(isHindi ? "स्थानीय लॉकअप एंट्री दर्ज!" : "Local lockup safety check noted.");
    }
  };

  // API Action: Store Seized Malkhana Evidence
  const handleAddMalkhanaItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMalkhanaTitle.trim()) {
      alert("विवरण दर्ज करें। Please write the item title.");
      return;
    }
    try {
      const res = await fetch("/api/db/malkhana/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMalkhanaTitle,
          caseRef: newMalkhanaCaseRef || "N/A - General Lock",
          storageRack: newMalkhanaRack,
          engineNo: newMalkhanaNo || "N/A",
          status: newMalkhanaStatus
        })
      });
      if (res.ok) {
        await syncDatabase();
        // Reset Inputs
        setNewMalkhanaTitle("");
        setNewMalkhanaCaseRef("");
        setNewMalkhanaNo("");
        alert(isHindi ? "मालखाना रजिस्टर में नई वस्तु दर्ज!" : "New exhibit item categorized into Thana Malkhana vaults.");
      }
    } catch (err) {
      // Local state fallback
      const fakeItem: MalkhanaItem = {
        id: `offline-m-${Date.now()}`,
        title: newMalkhanaTitle,
        engineNo: newMalkhanaNo || "N/A",
        caseRef: newMalkhanaCaseRef || "General Seizure",
        storageRack: newMalkhanaRack,
        depositDate: new Date().toISOString().split("T")[0],
        tagId: `MK-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: newMalkhanaStatus,
        safeLevel: "Sealed & Vaulted"
      };
      setDb((prev) => ({
        ...prev,
        malkhana: [fakeItem, ...prev.malkhana]
      }));
      setNewMalkhanaTitle("");
      setNewMalkhanaCaseRef("");
      setNewMalkhanaNo("");
      alert(isHindi ? "मालखाना में वस्तु स्थानीय रूप से जमा की गई!" : "Evidence logged locally in offline database!");
    }
  };

  // API Action: Add Beat Inspector log
  const handleAddBeatLog = async () => {
    if (!newBeatLogText.trim()) return;
    try {
      const res = await fetch("/api/db/beat/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beatId: selectedBeatId,
          logNote: newBeatLogText
        })
      });
      if (res.ok) {
        await syncDatabase();
        setNewBeatLogText("");
        alert(isHindi ? "बीट रोजनामचा अपडेट सम्पन्न!" : "Beat log successfully saved!");
      }
    } catch (e) {
      setDb((prev) => {
        const updated = prev.beatBooks.map((b) => {
          if (b.id === selectedBeatId) {
            return {
              ...b,
              logs: [`${new Date().toISOString().split("T")[0]}: ${newBeatLogText}`, ...b.logs]
            };
          }
          return b;
        });
        return { ...prev, beatBooks: updated };
      });
      setNewBeatLogText("");
    }
  };

  // Voice recording simulation for speech drafting
  const toggleRecordingSimulation = () => {
    if (!isRecordingSimulated) {
      setIsRecordingSimulated(true);
      // Simulated voice snippet translates to Hindi complaint
      setTimeout(() => {
        setSpeechNarration("कल रात करीब 11:30 बजे पार्क होटल के ठीक पीछे दो व्यक्ति जिनकी मोटरसाइकिल का नंबर डीएल-8सी-9821 था, उन्होंने जबरन मेरा बटुआ छीना और फरार हो गए। मेरे बटुए में आधार कार्ड और 3 हजार रुपये नकद थे।");
        setIsRecordingSimulated(false);
      }, 3000);
    } else {
      setIsRecordingSimulated(false);
    }
  };

  // Legal Query Advisor (Copilot Consultation tool)
  const handleLegalConsult = async () => {
    if (!advisorQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/copilot/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: advisorQuery,
          category: advisorCategory
        })
      });
      const data = await res.json();
      setAdvisorResponse(data.answer);
    } catch (e) {
      setAdvisorResponse("AI Law Database unreachable. Summary rules: Ensure immediate care for lockup inmates. Seized cash must be double-locked in Godrej safe vaults in presence of magistrate. Standard firearms sign-out must always have countersignatures of SI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Upper Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-6 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider">AI-SPS (स्मार्ट पुलिसिंग सिस्टम) v4.0</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">User ID: <span className="text-slate-300 font-bold">{`vivek.impdoc@gmail.com`}</span></span>
        </div>

        <div className="flex items-center gap-4">
          {/* Universal Language Toggle */}
          <button
            onClick={() => setIsHindi(!isHindi)}
            className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs rounded-md border border-slate-700/60 transition text-blue-400 font-semibold"
          >
            🇮🇳 {isHindi ? "English में देखें" : "हिन्दी में देखें (Default)"}
          </button>
          
          <button
            onClick={syncDatabase}
            title="Refresh database state"
            className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sync</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side Navigation Menu matching Geometric Balance theme */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white tracking-widest shadow-lg shadow-blue-900/30">
                SPS
              </div>
              <div>
                <h1 className="font-black text-sm tracking-tight text-white uppercase leading-tight">Armoury AI</h1>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5 tracking-wider uppercase">Kotwali Noida</p>
              </div>
            </div>
            <p className="text-[9px] text-blue-400/80 mt-2 font-mono uppercase tracking-widest bg-blue-950/40 p-1.5 rounded border border-blue-900/30">
              {isHindi ? "सुरक्षा व व्यवस्था" : "Law Enforcement AI"}
            </p>
          </div>

          <nav className="flex-1 py-4 space-y-1">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              {isHindi ? "मुख्य नियंत्रण कक्ष" : "Thana Operations Command"}
            </div>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-blue-400 border-r-4 border-blue-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📊</span>
                <span>{isHindi ? "थाना डैशबोर्ड" : "Station Dashboard"}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>

            <button
              onClick={() => setActiveTab("crime-gpt")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "crime-gpt"
                  ? "bg-slate-900 text-rose-400 border-r-4 border-rose-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🎙️</span>
                <span>{isHindi ? "आवाज से FIR ड्राफ्ट" : "Crime GPT Copilot"}</span>
              </div>
              <span className="bg-rose-950 text-rose-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-rose-900/50 uppercase font-black tracking-widest">
                AI Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab("lockup")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "lockup"
                  ? "bg-slate-900 text-amber-400 border-r-4 border-amber-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🔐</span>
                <span>{isHindi ? "स्मार्ट लॉकअप गार्ड" : "Smart Lockup Guard"}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>

            <button
              onClick={() => setActiveTab("armoury")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "armoury"
                  ? "bg-slate-900 text-purple-400 border-r-4 border-purple-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🛡️</span>
                <span>{isHindi ? "स्मार्ट आयुध भंडार" : "Armoury AI Tracker"}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>

            <button
              onClick={() => setActiveTab("malkhana")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "malkhana"
                  ? "bg-slate-900 text-indigo-400 border-r-4 border-indigo-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📦</span>
                <span>{isHindi ? "मालखाना ट्रैकर" : "Evidence Malkhana"}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>

            <button
              onClick={() => setActiveTab("roster")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "roster"
                  ? "bg-slate-900 text-emerald-400 border-r-4 border-emerald-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🗓️</span>
                <span>{isHindi ? "ड्यूटी रोस्टर" : "Smart Scheduling"}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>

            <button
              onClick={() => setActiveTab("beat")}
              className={`w-full flex items-center justify-between px-6 py-3 text-left font-medium text-xs transition duration-150 ${
                activeTab === "beat"
                  ? "bg-slate-900 text-cyan-400 border-r-4 border-cyan-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📖</span>
                <span>{isHindi ? "डिजिटल बीट बुक" : "Digital Beat Book"}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>
          </nav>

          {/* Quick Stats sidebar footer in Geometric Balance styling */}
          <div className="p-6 border-t border-slate-800">
            <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20 text-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-blue-300 uppercase tracking-wider text-[10px]">Crime Copilot Live</span>
              </div>
              <p className="text-slate-400 leading-normal text-[11px]">
                {isHindi 
                  ? "सभी प्रणालियाँ सुरक्षित हैं और नए भारतीय विधायी नियमों (BNS, BSA) के तहत अपडेटेड हैं।"
                  : "Connected to national legal database schemas. Validating police log registers."}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-900 bg-opacity-30">
          
          {/* Top Status Header Grid */}
          <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-40 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {isHindi ? "सक्रिय बल ड्यूटी" : "Active On-Duty Force"}
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  {db.personnel.filter(p => p.dutyStatus !== "Off Duty").length} / {db.personnel.length} Offs
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {isHindi ? "थाना कोड" : "Police Station Code"}
                </div>
                <div className="text-base font-black text-white mt-0.5 font-mono">
                  Kotwali Noida-Phase II
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {isHindi ? "थाना अलर्ट स्तर" : "Alert Priority Quotient"}
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-900/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  NORMAL & SECTORED
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-200">SHO S. K. Singh</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wide">
                  {currentTimeStamp}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-blue-400">
                SHO
              </div>
            </div>
          </header>

          {/* Quick tab nav for mobile layout */}
          <div className="bg-slate-950 p-2 border-b border-slate-800 grid grid-cols-4 sm:grid-cols-7 gap-1 lg:hidden text-[10px]">
            <button 
              onClick={() => setActiveTab("dashboard")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'dashboard' ? 'bg-slate-900 text-blue-400 font-bold border-b border-blue-500' : 'text-slate-400'}`}
            >
              {isHindi ? "डैशबोर्ड" : "HQ Board"}
            </button>
            <button 
              onClick={() => setActiveTab("crime-gpt")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'crime-gpt' ? 'bg-rose-950 text-rose-400 font-bold border-b border-rose-500' : 'text-slate-400'}`}
            >
              {isHindi ? "FIR" : "Crime GPT"}
            </button>
            <button 
              onClick={() => setActiveTab("lockup")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'lockup' ? 'bg-amber-950 text-amber-400 font-bold border-b border-amber-500' : 'text-slate-400'}`}
            >
              {isHindi ? "लॉकअप" : "Lockup"}
            </button>
            <button 
              onClick={() => setActiveTab("armoury")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'armoury' ? 'bg-slate-900 text-purple-400 font-bold border-b border-purple-500' : 'text-slate-400'}`}
            >
              {isHindi ? "आयुध" : "Armoury"}
            </button>
            <button 
              onClick={() => setActiveTab("malkhana")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'malkhana' ? 'bg-slate-900 text-indigo-400 font-bold border-b border-indigo-500' : 'text-slate-400'}`}
            >
              {isHindi ? "मालखाना" : "Malkhana"}
            </button>
            <button 
              onClick={() => setActiveTab("roster")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'roster' ? 'bg-slate-900 text-emerald-400 font-bold border-b border-emerald-500' : 'text-slate-400'}`}
            >
              {isHindi ? "रोस्टर" : "Roster"}
            </button>
            <button 
              onClick={() => setActiveTab("beat")} 
              className={`p-2 rounded text-center font-medium ${activeTab === 'beat' ? 'bg-slate-900 text-cyan-400 font-bold border-b border-cyan-500' : 'text-slate-400'}`}
            >
              {isHindi ? "बीट" : "Beat"}
            </button>
          </div>

          {/* Actual Content Wrapper with Geometric Layout padding */}
          <div className="p-6 md:p-8 flex-1 space-y-8">
            
            {/* TAB 1: SUB-DASHBOARD (थाना डैशबोर्ड) */}
            {activeTab === "dashboard" && (
              <div className="space-y-6" id="view-dashboard">
                
                {/* Visual Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Card 1: Active Cases */}
                  <div 
                    onClick={() => setActiveTab("crime-gpt")}
                    className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl p-5 cursor-pointer transition relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:h-1/2 transition-all"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isHindi ? "केस / FIR रिकॉर्ड" : "Lodge Registers"}</p>
                        <h3 className="text-2xl font-black text-white mt-1">{db.firs.length}</h3>
                      </div>
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-[10px] text-blue-400 font-semibold mt-4">
                      {isHindi ? "नया ड्राफ्ट बनाएं →" : "Draft with Speech AI →"}
                    </div>
                  </div>

                  {/* Card 2: Lockup Inmates */}
                  <div 
                    onClick={() => setActiveTab("lockup")}
                    className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl p-5 cursor-pointer transition relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 group-hover:h-1/2 transition-all"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isHindi ? "लॉकअप की सुरक्षा" : "Custody Guard"}</p>
                        <h3 className="text-2xl font-black text-white mt-1">{db.lockup.length}</h3>
                      </div>
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-[10px] text-amber-400 font-semibold mt-4">
                      {isHindi ? "सुरक्षा नियम व सीसीटीवी →" : "Verify CCTV stream →"}
                    </div>
                  </div>

                  {/* Card 3: Weapons Out */}
                  <div 
                    onClick={() => setActiveTab("armoury")}
                    className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl p-5 cursor-pointer transition relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 group-hover:h-1/2 transition-all"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isHindi ? "ऑन-ड्यूटी हथियार" : "Armoury Assigned"}</p>
                        <h3 className="text-2xl font-black text-white mt-1">
                          {db.armoury.reduce((sum, item) => sum + item.out, 0)} out
                        </h3>
                      </div>
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-[10px] text-purple-400 font-semibold mt-4">
                      {isHindi ? "हथियार मिलान लिस्ट →" : "Assign weapons to field →"}
                    </div>
                  </div>

                  {/* Card 4: Inventory Vault */}
                  <div 
                    onClick={() => setActiveTab("malkhana")}
                    className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl p-5 cursor-pointer transition relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 group-hover:h-1/2 transition-all"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isHindi ? "मालखाना साक्ष्य सामान" : "Malkhana Seized Log"}</p>
                        <h3 className="text-2xl font-black text-white mt-1">{db.malkhana.length} items</h3>
                      </div>
                      <Tag className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-[10px] text-indigo-400 font-semibold mt-4">
                      {isHindi ? "मालखाना सूची देखें →" : "Audit sealed custody →"}
                    </div>
                  </div>

                </div>

                {/* Main Dashboard Interactive Split Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Logged Cases Table List - 8 cols */}
                  <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800 rounded-2xl p-6  flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                      <div>
                        <h3 className="font-bold text-sm text-slate-200">
                          {isHindi ? "एक्टिव केस और एफआईआर सूची" : "Registered Cases Registry Logs"}
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          {isHindi ? "कानूनी धाराओं और त्वरित जांच की वर्तमान स्थिति" : "BNS/IPC equivalent classifications tracked in live database"}
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("crime-gpt")}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isHindi ? "दस्तावेज तैयार करें" : "Draft New"}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                            <th className="py-2">{isHindi ? "FIR पंजी" : "FIR No / Registry Time"}</th>
                            <th className="py-2">{isHindi ? "पीड़ित / आरोपी" : "Complainant & Suspects"}</th>
                            <th className="py-2">{isHindi ? "कानून धारा" : "State Legal Code"}</th>
                            <th className="py-2 text-right">{isHindi ? "स्थिति" : "Active Flow"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {db.firs.map((f) => (
                            <tr key={f.id} className="hover:bg-slate-900/40">
                              <td className="py-3 pr-2">
                                <div className="font-bold text-slate-100">{f.firNumber}</div>
                                <div className="text-[10px] text-slate-500">Recorded: {new Date(f.dateRecorded).toLocaleDateString()}</div>
                              </td>
                              <td className="py-3">
                                <div className="font-medium text-slate-100">{f.complainant}</div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[170px]">Suspect: {f.suspect || "Unknown"}</div>
                              </td>
                              <td className="py-3">
                                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700/60 font-semibold">
                                  {f.legalSections}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900/30 font-bold text-[10px] uppercase">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  {f.status}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bulletins and Current Duty Personnel - 4 cols */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Live Copilot Law Q&A Quick Input */}
                    <div className="bg-slate-900/80 border border-slate-850 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl"></div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                        <h4 className="font-black text-slate-200 text-xs tracking-wider uppercase flex items-center gap-2">
                          <span className="w-1.5 h-3 bg-blue-500 rounded-full inline-block"></span>
                          {isHindi ? "एआई कानून सहायक" : "Thana Assistant Copilot"}
                        </h4>
                        <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-widest bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900/40">
                          BNS / IPC
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4 leading-normal">
                        {isHindi 
                          ? "नए भारतीय कानूनों (Bharatiya Nyaya Sanhita) से जुड़े किसी भी पुलिसिंग संशय को यहाँ पूछें।" 
                          : "Clarify police guidelines, evidence labeling, or custody guidelines."}
                      </p>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={advisorQuery}
                          onChange={(e) => setAdvisorQuery(e.target.value)}
                          placeholder={isHindi ? "उदा. चोरी के माल के सीलिंग नियम..." : "e.g. custody safety checks under BNS..."}
                          className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            setActiveTab("crime-gpt");
                            handleLegalConsult();
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg text-xs transition active:scale-95 flex items-center justify-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isHindi ? "कानूनी सलाह प्राप्त करें" : "Consult AI Assistant"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Duty Shift Summary */}
                    <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                          {isHindi ? "सक्रिय शिड्यूल" : "Shift Deployment Today"}
                        </h4>
                        <button 
                          onClick={() => setActiveTab("roster")}
                          className="text-[10px] text-blue-400 font-semibold hover:underline"
                        >
                          {isHindi ? "प्रबंधन" : "Manage"}
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        {db.dutyRoster.map((rost) => (
                          <div key={rost.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                            <div className="flex justify-between font-bold text-slate-200">
                              <span>{rost.shift}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {rost.personnel.length} Offs
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 lines-clamp-1 italic">{rost.task}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {rost.personnel.map((p, pIdx) => (
                                <span key={pIdx} className="bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded border border-slate-700/60 font-semibold">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* TAB 2: CRIME GPT (आवाज से FIR ड्राफ्टिंग व कानूनी सहायता) */}
            {activeTab === "crime-gpt" && (
              <div className="space-y-6" id="view-crime-gpt">
                
                {/* Visual Header */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/5 rounded-full blur-2xl"></div>
                  <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-rose-500 rounded-full"></span>
                    {isHindi ? "आवाज से FIR ड्राफ्टिंग (Crime GPT / Copilot)" : "Voice FIR Drafting & Crime GPT Copilot"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isHindi 
                      ? "यह प्रणाली पुलिस अधिकारियों को शिकायतकर्ताओं और गवाहों के मौखिक बयानों को सीधे डिजिटल, सटीक और मान्य कानूनी भारतीय कानून धाराओं में बदलने में मदद करती है।" 
                      : "Draft police reports directly from oral narration. Auto-converts complaint statements into Indian Penal clauses (BNS and BSA systems)."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Complaint speech details */}
                  <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm text-slate-200 border-b border-slate-850 pb-2">
                      {isHindi ? "1. शिकायतकर्ता और घटना विवरण" : "1. Complainant Name & Offense Narrative"}
                    </h3>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-semibold">
                        {isHindi ? "शिकायतकर्ता का नाम व उम्र (Complainant Spec):" : "Complainant Full Spec / Contact Details:"}
                      </label>
                      <input
                        type="text"
                        value={complainantInput}
                        onChange={(e) => setComplainantInput(e.target.value)}
                        placeholder={isHindi ? "उदा. हरीश सक्सेना, उम्र 42 वर्ष, निवासी वसंत कुंज" : "e.g. Harish Saxena, Age 42, Vasant Kunj Resident"}
                        className="w-full bg-slate-950 text-slate-100 text-xs py-2.5 px-3 rounded-lg border border-slate-800 focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-400 font-semibold">
                          {isHindi ? "गवाही / मौखिक घटना विवरण (Speech Narrative text):" : "Oral Testimony / Complaint Incident Narration:"}
                        </label>
                        
                        {/* Interactive Simulated Speech Button */}
                        <button
                          type="button"
                          onClick={toggleRecordingSimulation}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] rounded border transition active:scale-95 ${
                            isRecordingSimulated 
                              ? "bg-rose-950 border-rose-500 text-rose-400 font-bold" 
                              : "bg-slate-800 border-slate-700 text-slate-300"
                          }`}
                        >
                          <Mic className={`w-3.5 h-3.5 ${isRecordingSimulated ? 'text-rose-50 animate-pulse' : 'text-slate-400'}`} />
                          <span>{isRecordingSimulated ? (isHindi ? "आवाज सुन रहा है..." : "Listening...") : (isHindi ? "आवाज से दर्ज करें" : "Simulate Speech-to-Text")}</span>
                        </button>
                      </div>

                      <textarea
                        value={speechNarration}
                        onChange={(e) => setSpeechNarration(e.target.value)}
                        rows={6}
                        placeholder={isHindi ? "यहां शिकायतकर्ता का मौखिक बयान लिखें या ऊपर 'आवाज से दर्ज करें' बटन दबाकर लाइव सिमुलेशन आटोमेशन देखें..." : "Write down the exact crime description or use the voice dictation model..."}
                        className="w-full bg-slate-950 text-slate-100 text-xs py-3 px-3 rounded-lg border border-slate-800 focus:border-rose-500 focus:outline-none leading-relaxed font-sans"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSpeechNarration("");
                          setDraftResult(null);
                        }}
                        className="px-4 py-2 border border-slate-800 rounded bg-slate-950 hover:bg-slate-900 transition text-xs font-semibold"
                      >
                        {isHindi ? "साफ़ करें" : "Clear Inputs"}
                      </button>
                      <button
                        onClick={handleDraftFir}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-bold text-xs py-2 px-6 rounded-lg transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{isHindi ? "AI विश्लेष्ण हो रहा है (BNS)..." : "Analyzing Legal Sections..."}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-3.5 h-3.5" />
                            <span>{isHindi ? "एआई कानूनी ड्राफ्ट तैयार करें" : "AI Legal Draft Generation"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Predefined Voice/Speech Presets for Quick Testing */}
                    <div className="pt-4 border-t border-slate-850 space-y-2">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{isHindi ? "त्वरित टेस्टिंग परिदृश्य (Quick Test Inputs):" : "Quick Test Presets:"}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            setComplainantInput("Anand Verma, Sector 8 Noida");
                            setSpeechNarration("कल रात जब मैं एटीएम से पैसे निकाल रहा था, तभी एक नकाबपोश युवक ने पिस्टल दिखाकर मेरे ₹15,000 और गाड़ी की चाबी लूट ली। वह होंडा शाइन बाइक से सेक्टर 10 की ओर भागा।");
                          }}
                          className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-left hover:border-slate-700 hover:bg-slate-900/40 transition text-[11px]"
                        >
                          🏍️ <strong>{isHindi ? "हथियारबंद लूटपाट" : "Armed robbery block"}</strong>
                          <p className="text-[10px] text-slate-500 leading-normal mt-1 truncate">pistol threat, theft of bike...</p>
                        </button>
                        <button
                          onClick={() => {
                            setComplainantInput("Sunita Chawla, Resident Welfare Area");
                            setSpeechNarration("मेरे किराएदार ने मकान खाली करने के लिए मांगने पर मेरे साथ दुर्व्यवहार किया, जान से मारने की धमकी दी और खिड़की के शीशे तोड़ दिए। उन्होंने जबरन प्रवेश की कोशिश भी की है।");
                          }}
                          className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-left hover:border-slate-700 hover:bg-slate-900/40 transition text-[11px]"
                        >
                          🏠 <strong>{isHindi ? "धमकी व जबरन घुसपैठ" : "Tenancy threat case"}</strong>
                          <p className="text-[10px] text-slate-500 leading-normal mt-1 truncate">abuse and window glass broken...</p>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Dynamic AI Drafting Dashboard */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Generative Response */}
                    {draftResult ? (
                      <div className="bg-slate-950 border-2 border-rose-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                          <div className="flex items-center gap-1.5 text-rose-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span className="font-extrabold font-mono text-[10px] tracking-widest uppercase">Crime GPT Generated Draft</span>
                          </div>
                          <span className="bg-rose-950 text-rose-400 text-[9px] font-bold px-2 py-0.5 rounded border border-rose-900/60 uppercase">
                            {draftResult.priority || "High Alert"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase font-black">{isHindi ? "अनुशंसित नई दंड संहिता धारा (BNS Section)" : "Recommended Penal Code Designation:"}</span>
                          <div className="text-yellow-400 font-mono text-sm font-bold bg-slate-900 p-2 rounded border border-slate-800">
                            {draftResult.legalSections}
                          </div>
                        </div>

                        {/* Speech Translation Cards */}
                        <div className="space-y-3">
                          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">हिन्दी औपचारिक रिपोर्ट (Kotwali Hindi Draft)</span>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">{draftResult.hindiDraft}</p>
                          </div>
                          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">English Legal Investigation Draft</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">{draftResult.englishDraft}</p>
                          </div>
                        </div>

                        {/* Copilot Suggested immediate police steps */}
                        {draftResult.nextSteps && draftResult.nextSteps.length > 0 && (
                          <div className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-4 space-y-2">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 inline" />
                              {isHindi ? "एआई-एसपीएस जांच निर्देश (Next Steps)" : "AI IO Investigation Guidelines:"}
                            </span>
                            <ul className="list-disc pl-4 text-[11px] text-slate-350 space-y-1 leading-normal font-sans">
                              {draftResult.nextSteps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2.5 pt-2">
                          <button
                            onClick={() => setDraftResult(null)}
                            className="flex-1 py-2 text-center text-xs font-bold border border-slate-800 rounded-lg hover:bg-slate-900 text-slate-400 transition"
                          >
                            {isHindi ? "संशोधन करें" : "Edit / Refuse"}
                          </button>
                          <button
                            onClick={handleSaveDraft}
                            className="flex-1 py-2 text-center text-xs font-bold bg-rose-600 hover:bg-rose-500 rounded-lg text-white transition animate-bounce"
                          >
                            {isHindi ? "सत्यापित कर FIR दर्ज करें ✔" : "Verify & Commit FIR ✔"}
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-slate-900/20 border border-slate-800 border-dashed p-10 text-center rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 mb-4 animate-pulse">
                          🎙️
                        </div>
                        <h4 className="font-bold text-slate-300 text-sm">{isHindi ? "कोई कानूनी ड्राफ्ट लंबित नहीं" : "Waiting for Audio or Text Input"}</h4>
                        <p className="text-[11px] text-slate-500 max-w-[240px] mt-1 pr-1 font-sans">
                          {isHindi ? "शिकायत का विवरण पूरा कर 'एआई कानूनी ड्राफ्ट तैयार करें' पर क्लिक करें।" : "Complete the details on the left and start compiling."}
                        </p>
                      </div>
                    )}

                    {/* Copilot Legal Knowledge Box - Instant Q&A Answers showing */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">
                          {isHindi ? "एआई-कानून पुस्तकालय (Instant Law QA)" : "Instant Penal-Code Consult Library"}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          {isHindi ? "त्वरित न्यायिक सलाहकार - कोई भी कानूनी शंका पूछें" : "Quickly check BNS / IPC judicial differences"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-1.5 flex-wrap">
                          {consultationPresets.map((ps, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setAdvisorQuery(ps.q);
                                setAdvisorCategory(ps.k);
                              }}
                              className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded"
                            >
                              🔍 {ps.q.substring(0, 42)}...
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={advisorQuery}
                            onChange={(e) => setAdvisorQuery(e.target.value)}
                            placeholder={isHindi ? "उदा. धारा 106(2) BNS क्या है?" : "Ask BNS guidance..."}
                            className="flex-1 bg-slate-950 text-slate-100 text-[11px] py-1.5 px-3 rounded border border-slate-800 focus:outline-none"
                          />
                          <button
                            onClick={handleLegalConsult}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded"
                          >
                            {isHindi ? "खोजें" : "Consult"}
                          </button>
                        </div>

                        {advisorResponse && (
                          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 leading-normal font-sans max-h-56 overflow-y-auto whitespace-pre-line">
                            <span className="font-extrabold text-blue-400 block mb-1">AI Police Advisor Protocol:</span>
                            {advisorResponse}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* TAB 3: SMART LOCKUP (स्मार्ट लॉकअप गार्ड) */}
            {activeTab === "lockup" && (
              <div className="space-y-6" id="view-lockup">
                
                {/* Visual Header */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-amber-500 rounded-full"></span>
                    {isHindi ? "स्मार्ट लॉकअप गार्ड (Safety AI)" : "Smart Lockup Safeguard & Inmate Management"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi 
                      ? "यह सुरक्षित लॉकअप सीसीटीवी विजेट और चिकित्सा सुरक्षा प्रबंधन तंत्र है। ड्यूटी संतरे (locksguard) के लिए अनिवार्य सुरक्षा जांच लॉग रजिस्टर।" 
                      : "Maintains detailed custody records, vital safety logs, personal belongings lockers state, and hourly medical/breathing audits."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Lockup Custody Current list & Live CCTV Simulation */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Simulated Camera Widget Frame in Geometric Balance Theme */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-red-650 text-[9px] font-bold text-white animate-pulse uppercase">
                            🔴 LIVE CCTV
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                            CAMERA-UNIT D-02 (HAZARD LEVEL 2 CELLS)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/30">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {isHindi ? "एआई सुरक्षा विश्लेषण: सुरक्षित" : "AI SENSORS: NOMINAL"}
                        </span>
                      </div>

                      {/* Video simulator placeholder screen in deep space color */}
                      <div className="aspect-video bg-black/85 rounded-xl border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
                        
                        {/* Mesh and Scan lines */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none"></div>
                        
                        {/* Audio Wave Sound Bars overlay */}
                        <div className="absolute bottom-4 right-4 flex items-end gap-1 h-8 opacity-60">
                          <span className="w-1 bg-emerald-500 h-2 animate-bounce"></span>
                          <span className="w-1 bg-emerald-500 h-6 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                          <span className="w-1 bg-emerald-500 h-4 animate-bounce" style={{animationDelay: '0.4s'}}></span>
                          <span className="w-1 bg-emerald-500 h-5 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        </div>

                        {/* Real-time stats ticker in camera preview window */}
                        <div className="absolute top-4 left-4 flex flex-col text-[10px] text-slate-350 font-mono space-y-1 tracking-tight">
                          <span>GRID RESOLUTION: 1080P IPS</span>
                          <span>LOCKUP TIME ELAPSED: 38 hrs</span>
                          <span>DETECTORS CHECK: [SUICIDE SAFE]</span>
                        </div>

                        <div className="text-center p-4">
                          <Lock className="w-12 h-12 text-slate-700 mx-auto mb-2 animate-bounce" />
                          <p className="text-sm font-semibold text-slate-200">
                            {isHindi ? "लॉकअप सेल सुरक्षा मॉनिटरिंग रीयल-टाइम" : "Custody Safe-Lockup Activity Sensor Feed"}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 max-w-sm mx-auto">
                            {isHindi 
                              ? "हृदय गति सेंसर और गतिविधि दर का आंकलन करने वाले एआई एल्गोरिदम सक्रिय हैं।" 
                              : "Vitals modeling algorithms measuring chest rise rate and movement indices."}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 uppercase font-black block">{isHindi ? "वर्तमान बंदी संख्या" : "TOTAL DETRADED"}</span>
                          <span className="text-sm font-bold text-slate-100">{db.lockup.length} Prisoners</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 uppercase font-black block">{isHindi ? "आवश्यक चिकित्सा दवाएं" : "MEDICAL ASSISTANCE REQ."}</span>
                          <span className="text-sm font-bold text-amber-400">1 Inmate needs insulin</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 uppercase font-black block">{isHindi ? "विगत सुरक्षा ऑडिट चेक" : "PREVIOUS SAFETY CHECK"}</span>
                          <span className="text-sm font-bold text-emerald-450 font-mono">10:00 AM OK</span>
                        </div>
                      </div>

                    </div>

                    {/* Active Inmates Detailed List Table */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                      <div className="pb-3 border-b border-slate-850 mb-4">
                        <h4 className="font-bold text-sm text-slate-250">
                          {isHindi ? "कैदी कस्टडी पंजीकरण (Registered Inoculates)" : "Active Lockup Guard Inmates List"}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {db.lockup.map((inm) => (
                          <div 
                            key={inm.id} 
                            onClick={() => setSelectedInmateId(inm.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition flex flex-col md:flex-row justify-between gap-4 ${
                              selectedInmateId === inm.id 
                                ? "bg-slate-900 border-amber-500/50" 
                                : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-100">{inm.name}</span>
                                <span className="text-[10px] text-slate-400">Age: {inm.age}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${
                                  inm.risk === "High" ? "bg-red-950 text-red-400 border border-red-900" : "bg-slate-800 text-slate-350"
                                }`}>
                                  {inm.risk} Risk
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-300">{inm.crime}</p>
                              <p className="text-[11px] text-slate-500">
                                <strong>{isHindi ? "सामान सूची: " : "Belongings: "}</strong> {inm.belongings}
                              </p>
                              <p className="text-[11px] text-amber-500 font-medium">
                                🚨 {inm.health}
                              </p>
                            </div>

                            <div className="md:text-right flex flex-col justify-between shrink-0 space-y-2">
                              <span className="text-[10px] text-slate-400 font-mono">
                                In: {new Date(inm.timeIn).toLocaleString("en-IN")}
                              </span>
                              
                              <div className="bg-slate-950 px-2 py-1.5 rounded border border-slate-850 text-[10px] text-slate-450 text-left md:text-right">
                                <span className="font-bold text-slate-300 block mb-0.5">{isHindi ? "विगत जांच" : "Latest Log Check"}:</span>
                                {inm.safetyChecks[0] ? (
                                  <span>{inm.safetyChecks[0].status} ({inm.safetyChecks[0].checkedBy})</span>
                                ) : (
                                  <span>None recorded</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                  {/* Right Column: Register hourly safety verification check */}
                  <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      
                      <div className="pb-2 border-b border-slate-850">
                        <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">
                          {isHindi ? "संतरी सुरक्षा रोजनामचा" : "Lockup Audit & Quick Entry"}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isHindi ? "लॉकअप संतरी हेतु प्रत्येक घंटे पर सुरक्षा एवं स्वास्थ्य जांच प्रविष्टि दर्ज करना अनिवार्य है।" : "Hourly check mandated by BNSS section protocols."}
                        </p>
                      </div>

                      {/* Current Selection Preview */}
                      {db.lockup.find((l) => l.id === selectedInmateId) && (
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-extrabold">{isHindi ? "चयनित आरोपी (Target Prisoner)" : "Active Audit Target"}</span>
                          <div className="font-black text-slate-200">
                            {db.lockup.find((l) => l.id === selectedInmateId)?.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {db.lockup.find((l) => l.id === selectedInmateId)?.crime}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-450 font-bold uppercase">{isHindi ? "जांच करने वाले संतरी का नाम" : "Officer Badge Name"}</label>
                          <input
                            type="text"
                            value={guardCheckName}
                            onChange={(e) => setGuardCheckName(e.target.value)}
                            placeholder="Constable Badge ID Name"
                            className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-450 font-bold uppercase">{isHindi ? "सुक्षा स्थिति विवरण (Vitals / Status Check)" : "Vitals Status Detail text"}</label>
                          <textarea
                            value={newSafetyStatus}
                            onChange={(e) => setNewSafetyStatus(e.target.value)}
                            rows={3}
                            placeholder={isHindi ? "उदा. बंदी सामान्य रूप से सो रहा है, श्वास प्रक्रिया सुचारू है, पानी दिया।" : "e.g. Inmate asleep and healthy, diabetic insulin verify..."}
                            className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAddLockupCheck}
                          className="w-full bg-amber-600 hover:bg-amber-500 font-bold p-2.5 rounded-lg text-white text-xs transition active:scale-95 flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isHindi ? "होर्ली संतरी लॉग प्रविष्टि सबमिट" : "Register Thana Verification Check"}</span>
                        </button>
                      </div>

                    </div>

                    {/* Safety checklist box */}
                    <div className="mt-8 bg-amber-950/10 border border-amber-900/30 rounded-xl p-4 space-y-1 text-xs">
                      <span className="font-extrabold text-amber-500 block text-[10px] tracking-widest uppercase">👮 CUSTODY LAWS BRIEF</span>
                      <ul className="list-inside list-disc text-slate-350 space-y-1 leading-normal text-[11px] font-sans">
                        <li>Do not leave lockup keys inside station desk drawer.</li>
                        <li>Verify inmate belongs locker tags before releasing.</li>
                        <li>Hourly physical respiratory movement sight check is a mandatory police code.</li>
                      </ul>
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* TAB 4: ARMOURY (स्मार्ट आयुध भंडार / Armoury AI) */}
            {activeTab === "armoury" && (
              <div className="space-y-6" id="view-armoury">
                
                {/* Visual Header */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>
                    {isHindi ? "स्मार्ट आयुध भंडार (Armoury AI)" : "Smart Armoury AI Tracker Registry"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi 
                      ? "थाना में उपलब्ध आग्नेयास्त्रों, कारतूस पैकेट और दंगा नियंत्रण सुरक्षा उपकरणों का डिजिटल रीयल-टाइम लेखा-जोखा। ड्यूटी पर प्रस्थान करते समय हथियार असाइन करने और वापस जमा करने का पटल।" 
                      : "Tracks and controls rifles, pistols, specialized safety gear, and ammunition crates. Sign firearms out or in with interactive tracking keys."}
                  </p>
                </div>

                {/* Weapons Registry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {db.armoury.map((arm) => (
                    <div key={arm.id} className="bg-slate-900/50 border border-slate-800 hover:border-slate-750 transition rounded-2xl p-5 space-y-4">
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/35">
                            {arm.category}
                          </span>
                          <h4 className="font-bold text-slate-100 text-base mt-2">{arm.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Condition Level: {arm.condition}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                          {arm.total} Total
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                        <div className="border-r border-slate-850 pr-2">
                          <span className="text-[9px] text-slate-500 uppercase font-black block">Secured</span>
                          <span className="text-sm font-extrabold text-emerald-450 font-mono">{arm.secured} units</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-black block">Assigned / Out</span>
                          <span className="text-sm font-extrabold text-purple-400 font-mono">{arm.out} units</span>
                        </div>
                      </div>

                      {/* Out Assignment controllers */}
                      <div className="flex justify-between items-center pt-2 gap-2">
                        <button
                          onClick={() => handleWeaponSign(arm.id, "in")}
                          disabled={arm.out === 0}
                          className="flex-1 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-450" />
                          <span>{isHindi ? "जमा करें (Sign In)" : "Sign Weapon In"}</span>
                        </button>
                        <button
                          onClick={() => handleWeaponSign(arm.id, "out")}
                          disabled={arm.secured === 0}
                          className="flex-1 text-[11px] font-black py-1.5 px-3 rounded-lg bg-purple-650 hover:bg-purple-600 text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{isHindi ? "इशू करें (Sign Out)" : "Assign / Check Out"}</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Secure Armoury Rules reminder */}
                <div className="bg-purple-950/10 border border-purple-900/30 p-4 rounded-xl flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-400 shrink-0" />
                  <p className="text-[11px] text-purple-300 font-sans leading-normal">
                    <strong>{isHindi ? "आयुध भंडार सुरक्षा घोषणा: " : "Daily Weapons Safety Protocol: "}</strong>
                    {isHindi 
                      ? "थाने के किसी भी कर्मचारी को कारतूस और रिवॉल्वर देते समय डिजिटल रिकॉर्ड के साथ-साथ ड्यूटी रोजनामचा डायरी में उनकी दस्तखत अनिवार्य है। प्रस्थान से पहले शून्य बैरल जांच सुनिश्चित करें।" 
                      : "Weapons inventory verification is synchronized with central police force servers every 12 hours. Ensure zero-barrel verification parameters."}
                  </p>
                </div>

              </div>
            )}


            {/* TAB 5: AI MALKHANA (मालखाना ट्रैकर) */}
            {activeTab === "malkhana" && (
              <div className="space-y-6" id="view-malkhana">
                
                {/* Visual Header */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                    {isHindi ? "AI-आधारित 'मालखाना' ट्रैकर (Evidence Inventory)" : "AI-SPS Smart Malkhana & Seized Exhibits"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi 
                      ? "जब्त वाहनों, चोरी की नकदी, कानूनी सबूतों और आपराधिक केस सामग्री (Case Exhibits) का एआई-आधारित डेटाबेस और सुरक्षित ट्रैक।" 
                      : "Securely logs, registers, and tracks court-admitted crime scene items, seized vehicles, cash, and digital laptops safely."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Malkhana Evidence list - 8 cols */}
                  <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="pb-2 border-b border-slate-850 flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">
                        {isHindi ? "जब्त सामान सुरक्षित गोदाम सूची" : "Active Vault Seizures Logs"}
                      </h4>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/40">
                        {db.malkhana.length} Items Vaulted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {db.malkhana.map((m) => (
                        <div key={m.id} className="bg-slate-950 border border-slate-850 hover:border-slate-750 p-4 rounded-xl flex flex-col justify-between gap-3 font-sans">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[9px] font-mono font-extrabold text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {m.tagId}
                              </span>
                              <span className="text-[9px] font-semibold text-emerald-450 uppercase">
                                {m.safeLevel}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-100 text-xs mt-2">{m.title}</h5>
                            <p className="text-[11px] text-slate-400 mt-1">
                              <strong>{isHindi ? "केस संदर्भ: " : "Case Ref: "}</strong>{m.caseRef}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                              Serial/Engine no: {m.engineNo}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                            <div className="text-slate-400 font-medium">
                              📍 Rack: {m.storageRack}
                            </div>
                            <span className="text-slate-500 font-mono text-[9px]">
                              Dep: {m.depositDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Register New Seized Exhibit - 4 cols */}
                  <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
                    <form onSubmit={handleAddMalkhanaItem} className="space-y-4">
                      
                      <div className="pb-2 border-b border-slate-850 mb-3">
                        <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">
                          +{isHindi ? "नया सामान मालखाना विवरण दर्ज करें" : "Deposit Seized Exhibit"}
                        </h4>
                        <p className="text-[10px] text-slate-550 mt-0.5">
                          {isHindi ? "जब्ती मेमो और जब्ती तारीख के साथ मालखाना रजिस्टर में एंट्री करें।" : "Record immediate item specifications to the secure ledger."}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">{isHindi ? "जब्त वस्तु का नाम व विवरण" : "Seized Item Name & Spec:"}</label>
                        <input
                          type="text"
                          value={newMalkhanaTitle}
                          onChange={(e) => setNewMalkhanaTitle(e.target.value)}
                          placeholder={isHindi ? "उदा. एप्पल आईफोन 14 (काला कवर)" : "e.g. Apple iPhone 14 Black Case"}
                          className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">{isHindi ? "संबद्ध केस FIR संख्या" : "Associated Case FIR reference:"}</label>
                        <input
                          type="text"
                          value={newMalkhanaCaseRef}
                          onChange={(e) => setNewMalkhanaCaseRef(e.target.value)}
                          placeholder={isHindi ? "उदा. FIR No. 124/2026" : "e.g. FIR No. 124/2026"}
                          className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">{isHindi ? "क्रमांक / चेसिस संख्या (चोरी बाइक आदि हेतु)" : "Engine / Chassis / Serial number info:"}</label>
                        <input
                          type="text"
                          value={newMalkhanaNo}
                          onChange={(e) => setNewMalkhanaNo(e.target.value)}
                          placeholder="Serial Code or N/A"
                          className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">{isHindi ? "मालखाना रैक / अलमारी स्थान" : "Vault Rack Allocation Room:"}</label>
                        <input
                          type="text"
                          value={newMalkhanaRack}
                          onChange={(e) => setNewMalkhanaRack(e.target.value)}
                          placeholder={isHindi ? "उदा. रैक-3B दाईं ओर" : "e.g. Rack-3B Right Side Shelf"}
                          className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">{isHindi ? "सामान सीलिंग स्थिति" : "Lacquered Sealing verification status:"}</label>
                        <select
                          value={newMalkhanaStatus}
                          onChange={(e) => setNewMalkhanaStatus(e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                        >
                          <option value="Sealed inside Lacquer Bag">{isHindi ? "लाख सीलबंद थैला सुरक्षित" : "Sealed inside Lacquer Bag"}</option>
                          <option value="Double-Locked Vault box">{isHindi ? "तिजोरी सुरक्षा ताला" : "Double-Locked Vault box"}</option>
                          <option value="Standard Label Marked">{isHindi ? "सामान्य लेबल चिह्नित" : "Standard Label Marked"}</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold p-2.5 rounded-lg text-white text-xs transition active:scale-95"
                      >
                        {isHindi ? "रजिस्टर में सुरक्षित जमा करें" : "Vault Evidence Item"}
                      </button>

                    </form>
                  </div>

                </div>

              </div>
            )}


            {/* TAB 6: SMART SCHEDULING (ड्यूटी रोस्टर) */}
            {activeTab === "roster" && (
              <div className="space-y-6" id="view-roster">
                
                {/* Visual Header */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                    {isHindi ? "AI-आधारित ड्यूटी रोस्टर (Smart Scheduling)" : "AI Smart Policing Duty Roster Scheduler"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi 
                      ? "थाने के पुलिस सिपाही, हेड कांस्टेबल और सब-इंस्पेक्टरों को उनकी ड्यूटी पर तैनात करने हेतु एआई रोस्टर ऑप्टिमाइजर।" 
                      : "Ensure intelligent distribution of personnel across Morning, Evening, and Graveyard patrols. Call Crime Copilot live to reschedule based on threat zones."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Current Active Duty Staff Shifts - 7 cols */}
                  <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="pb-2 border-b border-slate-850 flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">
                        {isHindi ? "प्रभावी ड्यूटी शिड्यूल विवरण" : "Currently Assigned Shift Structures"}
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                        {db.dutyRoster.length} Main Shifts Active
                      </span>
                    </div>

                    <div className="space-y-4">
                      {db.dutyRoster.map((rost) => (
                        <div key={rost.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 font-sans">
                          
                          <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded border border-slate-850/50">
                            <span className="text-xs font-extrabold text-slate-100">{rost.shift}</span>
                            <span className="bg-emerald-950 border border-emerald-900/60 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold">
                              ACTIVE SHIFT CODE
                            </span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">{isHindi ? "संबद्ध टीम केंद्रित कार्य" : "Strategic Task assigned to team:"}</span>
                            <p className="text-slate-300 font-medium leading-relaxed italic">{rost.task}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">{isHindi ? "तैनात पुलिसकर्मी (Assigned Officers)" : "Assigned Officers:"}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {rost.personnel.map((pers, idx) => (
                                <span key={idx} className="bg-slate-800 text-slate-200 border border-slate-700 p-1.5 px-3 rounded text-[11px] font-semibold font-sans">
                                  👤 {pers}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>

                  {/* AI Rescheduler Optimizer notes parameters - 5 cols */}
                  <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      
                      <div className="pb-2 border-b border-slate-850 mb-3">
                        <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          {isHindi ? "एआई रोस्टर पुनर्गठन (Optimize notes)" : "AI Smart Optimization Param"}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                          {isHindi 
                            ? "शिकायत दर और संकट आवश्यकताओं के आधार पर ड्यूटी分配 को चुटकियों में पुनर्गठित करें। नीचे एआई निर्देश प्रविष्टि करें।" 
                            : "Enter custom parameters (e.g. increase park patrol, minimize night shifts for senior SHO), and let Gemini re-arrange all available officers."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-450 font-bold uppercase">{isHindi ? "एआई निर्देश / विशेष आवश्यकता विवरण (Special Instructions)" : "AI Reschedule Instructions Prompt text:"}</label>
                        <textarea
                          value={rosterNotes}
                          onChange={(e) => setRosterNotes(e.target.value)}
                          rows={5}
                          placeholder={isHindi ? "उदा. पार्क के पास रात में छीनने की वारदात ज्यादा हो रही है, इसलिए कांस्टेबल विक्रम राठौर को रात की बीट पेट्रोल पर तैनात करें और वरिष्ठ SHO को थाने पर रखें।" : "e.g. Increase night security patrols block, allocate constables to night rosters..."}
                          className="w-full bg-slate-950 text-slate-100 text-xs py-3 px-3 rounded-lg border border-slate-800 focus:border-emerald-500 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Rapid instructions template pill shortcuts */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">{isHindi ? "त्वरित निर्देश साँचे:" : "Pill Presets:"}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setRosterNotes("Allocate women sub-inspectors and constables specifically to station desk duty, and reinforce night emergency quick response teams with active male constables.")}
                            className="bg-slate-950 text-slate-350 border border-slate-850 hover:border-slate-700 text-[10px] px-2 py-1 rounded-md transition"
                          >
                            🏠 {isHindi ? "अतिरिक्त डेस्क सुरक्षा" : "Desk Staffing Focus"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRosterNotes("Noida district reports high market snatches in early afternoon. Transfer all active constables to daytime market foot-patrol shifts.")}
                            className="bg-slate-950 text-slate-350 border border-slate-850 hover:border-slate-700 text-[10px] px-2 py-1 rounded-md transition"
                          >
                            🚨 {isHindi ? "दोपहर भीड़ सघन गश्त" : "Day Afternoon Patrol Priority"}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleOptimizeRoster}
                        disabled={aiOptimizing}
                        className="w-full bg-emerald-650 hover:bg-emerald-600 disabled:bg-slate-800 font-bold p-3 rounded-lg text-white text-xs transition active:scale-95 flex items-center justify-center gap-1.5 mt-4"
                      >
                        {aiOptimizing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{isHindi ? "एआई शिड्यूल डिजाइन हो रहा है..." : "AI Optimizing Duty Board..."}</span>
                          </>
                        ) : (
                          <>
                            <Sliders className="w-4 h-4 text-emerald-100" style={{ transform: 'rotate(90deg)' }} />
                            <span>{isHindi ? "एआई रोस्टर अनुकूलित करें (Live Optimize)" : "AI Optimize Security Shifts"}</span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* Personnel Status table */}
                    <div className="pt-6 border-t border-slate-850 mt-4">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block mb-2">{isHindi ? "थाना कर्मियों की सूची (Total Personnel Pool)" : "Staff Pool Status Indicator"}</span>
                      <div className="max-h-52 overflow-y-auto space-y-1.5">
                        {db.personnel.map((p) => (
                          <div key={p.id} className="flex justify-between items-center text-[11px] bg-slate-950 p-2 rounded border border-slate-850/60">
                            <div>
                              <strong className="text-slate-200">{p.name}</strong>
                              <span className="text-slate-500 font-mono ml-2">[{p.rank}]</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {p.badge} ({p.dutyStatus})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* TAB 7: DIGITAL BEAT BOOK (डिजिटल बीट बुक) */}
            {activeTab === "beat" && (
              <div className="space-y-6" id="view-beat">
                
                {/* Visual Header */}
                <div className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-cyan-500 rounded-full"></span>
                    {isHindi ? "डिजिटल 'बीट बुक' (Guardian AI)" : "Digital Beat Book & Area Hotspots Guard"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi 
                      ? "क्षेत्र के संवेदनशील हॉटस्पॉट, बस टर्मिनल और मार्केट के बीट ऑफिसर के दैनिक सुरक्षा गतिविधियों और नागरिक सुझाव पत्र का डिजिटल रोजनामचा।" 
                      : "Maintains records of designated beat officers, area crime hotspots, security alert flags, and citizen meeting logs."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Active Beats Details - 8 cols */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {db.beatBooks.map((beat) => (
                        <div 
                          key={beat.id}
                          onClick={() => setSelectedBeatId(beat.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-4 ${
                            selectedBeatId === beat.id 
                              ? "bg-slate-900 border-cyan-400/50" 
                              : "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="bg-cyan-950 border border-cyan-900 text-cyan-450 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {beat.patrolStatus}
                              </span>
                              <MapPin className="w-4 h-4 text-cyan-400" />
                            </div>
                            <h4 className="font-extrabold text-slate-100 text-sm mt-3">{beat.areaName}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 font-semibold text-blue-400">
                              👮 Beat Officer: {beat.beatOfficer}
                            </p>
                            <div className="text-[10px] text-amber-500 mt-2 font-medium">
                              ⚠️ Hotspots: {beat.hotspots}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-850">
                            <span className="text-[9px] text-slate-500 uppercase font-black block mb-1">
                              {isHindi ? "विगत गश्त टिप्पणियां (Constable Logs):" : "Field Activity constable logs:"}
                            </span>
                            <div className="space-y-1 max-h-36 overflow-y-auto">
                              {beat.logs.map((log, lIdx) => (
                                <p key={lIdx} className="text-[11px] text-slate-350 leading-relaxed pl-2 border-l-2 border-slate-800 font-sans">
                                  {log}
                                </p>
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Register New Daily Beat Observation Log - 4 cols */}
                  <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      
                      <div className="pb-2 border-b border-slate-850 mb-3">
                        <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">
                          {isHindi ? "बीट रोजनामचा प्रविष्टि" : "Insert Area Patrol Log"}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isHindi ? "चयनित बीट क्षेत्र के बीट कांस्टेबल के दैनिक पेट्रोलिंग रिपोर्ट बुक प्रविष्टि।" : "Add immediate neighborhood visit updates securely."}
                        </p>
                      </div>

                      {/* Selected Beat Area Indicator Box */}
                      {db.beatBooks.find((b) => b.id === selectedBeatId) && (
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                          <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 block">{isHindi ? "लक्षित गश्ती क्षेत्र" : "Selected Neighborhood Context"}</span>
                          <div className="font-extrabold text-xs text-slate-200">
                            {db.beatBooks.find((b) => b.id === selectedBeatId)?.areaName}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-450 font-bold uppercase">{isHindi ? "बीट गश्ती टिप्पणी का विवरण (Patrol Log info)" : "Patrol log detail report:"}</label>
                          <textarea
                            value={newBeatLogText}
                            onChange={(e) => setNewBeatLogText(e.target.value)}
                            rows={4}
                            placeholder={isHindi ? "उदा. रात्रि गश्ती के दौरान सेक्टर मार्केट के सभी बैंक एटीएम शटर जांचे। सभी सुरक्षा गार्ड सतर्क पाए गए।" : "e.g. Conducted area welfare association meet, citizens report lamplights functional now..."}
                            className="w-full bg-slate-950 text-slate-100 text-xs py-2 px-3 rounded border border-slate-800 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAddBeatLog}
                          className="w-full bg-cyan-650 hover:bg-cyan-600 font-bold p-2.5 rounded-lg text-white text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isHindi ? "बीट बुक रोजनामचा में सहेजें" : "Commit neighborhood log"}</span>
                        </button>
                      </div>

                    </div>

                    {/* Neighborhood rules banner info */}
                    <div className="bg-cyan-950/10 border border-cyan-900/30 p-4 rounded-xl text-xs mt-6">
                      <span className="font-extrabold text-cyan-400 block text-[9px] tracking-widest uppercase mb-1">📢 digital beat laws</span>
                      <p className="text-slate-350 leading-normal text-[11px] font-sans">
                        Any citizen query submitted directly during afternoon patrols should be registered under minor complaints files within 24 hours as per Kotwali standards.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Core visual Footer */}
          <footer className="border-t border-slate-800 bg-slate-950/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <div>
              {isHindi ? "© २०२६ एआई-SPS स्मार्ट पुलिसिंग सिस्टम" : "© 2026 AI-SPS Smart Policing System."}
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="text-emerald-400">DATABASE: COMMITTED (SYNC OK)</span>
              <span>PORT: 3000 (SECURE OUTLET)</span>
            </div>
          </footer>

        </main>

      </div>
    </div>
  );
}
