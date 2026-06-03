export interface Personnel {
  id: string;
  name: string;
  rank: string;
  dutyStatus: string;
  badge: string;
}

export interface SafetyCheck {
  time: string;
  checkedBy: string;
  status: string;
}

export interface LockupInmate {
  id: string;
  name: string;
  age: number;
  crime: string;
  risk: "High" | "Medium" | "Low";
  timeIn: string;
  health: string;
  safetyChecks: SafetyCheck[];
  belongings: string;
}

export interface ArmouryItem {
  id: string;
  name: string;
  category: string;
  total: number;
  secured: number;
  out: number;
  condition: string;
  checks: string;
}

export interface MalkhanaItem {
  id: string;
  title: string;
  engineNo: string;
  caseRef: string;
  storageRack: string;
  depositDate: string;
  tagId: string;
  status: string;
  safeLevel: string;
}

export interface BeatBookItem {
  id: string;
  areaName: string;
  beatOfficer: string;
  hotspots: string;
  patrolStatus: string;
  logs: string[];
}

export interface DutyRosterItem {
  id: string;
  shift: string;
  personnel: string[];
  task: string;
}

export interface FirDraft {
  id: string;
  firNumber: string;
  dateRecorded: string;
  state: string;
  policeStation: string;
  complainant: string;
  suspect: string;
  offenseDate: string;
  narration: string;
  legalSections: string;
  hindiDraft: string;
  englishDraft: string;
  status: string;
}

export interface ThanaDatabase {
  personnel: Personnel[];
  lockup: LockupInmate[];
  armoury: ArmouryItem[];
  malkhana: MalkhanaItem[];
  beatBooks: BeatBookItem[];
  dutyRoster: DutyRosterItem[];
  firs: FirDraft[];
}
