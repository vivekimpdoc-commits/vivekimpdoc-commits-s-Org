import React from "react";
import { Shield, AlertCircle, Users, Activity, Lock, Tag, Clock } from "lucide-react";
import { ThanaDatabase } from "../types";

interface ControlCenterProps {
  data: ThanaDatabase;
  isHindi: boolean;
  onNavigate: (tab: string) => void;
}

export default function ControlCenter({ data, isHindi, onNavigate }: ControlCenterProps) {
  const activeFirsCount = data.firs.length;
  const inLockupCount = data.lockup.length;
  const personnelOnDuty = data.personnel.filter((p) => p.dutyStatus !== "Off Duty").length;
  const outWeapons = data.armoury.reduce((sum, item) => sum + item.out, 0);

  // Simulated live emergency alert feeds
  const alerts = [
    { time: "11:42 AM", text: "Patrol unit 2 reports stable checkpoint at Sector Bypass.", status: "Normal" },
    { time: "10:50 AM", text: "Alert: CCTV visual feed down at Metro Gate 2. Local beat officer notified.", status: "Warning" },
    { time: "09:15 AM", text: "New FIR Recorded: Grand Snatching, Noida District.", status: "Info" },
    { time: "08:00 AM", text: "Shift handover complete. Morning Patrols deployed successfully.", status: "Normal" }
  ];

  return (
    <div id="control-center" className="space-y-6">
      {/* State Badge and Live Watch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg shadow-sm">
        <div>
          <h2 className="text-sm font-semibold uppercase text-emerald-800 tracking-wider">
            {isHindi ? "● लाइव थाना अलर्ट फीड" : "● Live Thana Alert Feed"}
          </h2>
          <p className="text-xs text-emerald-700 mt-1">
            {isHindi 
              ? "सभी प्रणालियाँ सामान्य हैं। एआई-एसपीएस कॉपायलट सुचारू रूप से कार्य कर रहा है।" 
              : "All systems nominal. AI-SPS intelligence cores fully calibrated with local penal codes."}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 bg-emerald-100 px-3 py-1.5 rounded text-xs font-mono text-emerald-800">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>IST: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Grid of Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Cases */}
        <div 
          onClick={() => onNavigate("crime-gpt")}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          id="kpi-firs"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isHindi ? "पंजीकृत FIR" : "Active FIR Drafts"}
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{activeFirsCount}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-blue-50 group-hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-blue-600 mt-3 inline-block font-medium">
            {isHindi ? "FIR ड्राफ्टर खोलें →" : "Open Crime GPT →"}
          </span>
        </div>

        {/* Card 2: Lockup Occupancy */}
        <div 
          onClick={() => onNavigate("lockup")}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          id="kpi-lockup"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isHindi ? "लॉकअप कैदी" : "In Lockup Custody"}
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{inLockupCount}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-amber-50 group-hover:bg-amber-100 rounded-lg text-amber-600 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-amber-600 mt-3 inline-block font-medium">
            {isHindi ? "स्मार्ट लॉकअप खोलें →" : "View Lockup Guard →"}
          </span>
        </div>

        {/* Card 3: Weapons out */}
        <div 
          onClick={() => onNavigate("armoury")}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          id="kpi-weapons"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isHindi ? "हथियार ऑन-फील्ड" : "Weapons Out on Daily Duty"}
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{outWeapons}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-purple-50 group-hover:bg-purple-100 rounded-lg text-purple-600 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-purple-600 mt-3 inline-block font-medium">
            {isHindi ? "आयुध भंडार खोलें →" : "Verify Armoury AI →"}
          </span>
        </div>

        {/* Card 4: Personnel Status */}
        <div 
          onClick={() => onNavigate("roster")}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          id="kpi-personnel"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isHindi ? "ड्यूटी पर कर्मी" : "Personnel On Station/Field"}
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{personnelOnDuty}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-emerald-50 group-hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs text-emerald-600 mt-3 inline-block font-medium">
            {isHindi ? "रोस्टर देखें →" : "Inspect Duty Roster →"}
          </span>
        </div>
      </div>

      {/* Main Grid: Live Feeds and Duty Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Real-time Incident Tracker Table (2/3 width) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">
                {isHindi ? "हालिया FIR और केस रजिस्ट्री" : "Recent FIR Registries"}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? "पंजीकृत लिखित शिकायत और जांच स्थिति" : "Officially lodged FIR declarations with current tracking state"}
              </p>
            </div>
            <button 
              onClick={() => onNavigate("crime-gpt")}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition"
            >
              {isHindi ? "+ नया FIR दर्ज करें" : "+ Lodge New FIR"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase font-medium border-b border-slate-100">
                  <th className="py-2.5 px-3">{isHindi ? "FIR सं. / तारीख" : "FIR No. / Date"}</th>
                  <th className="py-2.5 px-3">{isHindi ? "शिकायतकर्ता / संदिग्ध" : "Complainant / Suspect"}</th>
                  <th className="py-2.5 px-3">{isHindi ? "धारा (BNS)" : "Legal Sections"}</th>
                  <th className="py-2.5 px-3">{isHindi ? "प्राथमिकता" : "Status/Priority"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.firs.map((fir) => (
                  <tr key={fir.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{fir.firNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(fir.dateRecorded).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{fir.complainant}</div>
                      <div className="text-[10px] text-slate-400">Suspect: {fir.suspect}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                        {fir.legalSections}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="font-semibold text-orange-600">{fir.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Right Column (1/3 width): Rapid Incident Ticker & Active Beats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Emergency Bulletins */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-4 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <AlertCircle className="w-5 h-5 text-red-400 animate-bounce" />
              <h3 className="font-bold text-sm">
                {isHindi ? "कंट्रोल रूम बुलेटिन" : "Control Room Bulletins"}
              </h3>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {alerts.map((al, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-800/80 border border-slate-700/50 flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{al.time}</span>
                    <span className={al.status === "Warning" ? "text-amber-400" : "text-emerald-400"}>
                      {al.status}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">{al.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Patrol/Beats overview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
              {isHindi ? "सक्रिय बीट क्षेत्र" : "Active Patrol beat Sectors"}
            </h4>
            <div className="space-y-2">
              {data.beatBooks.map((beat) => (
                <div key={beat.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition flex items-center justify-between text-xs cursor-pointer" onClick={() => onNavigate("beat")}>
                  <div>
                    <h5 className="font-bold text-slate-800 truncate max-w-[160px]">{beat.areaName}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">IO: {beat.beatOfficer}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {beat.patrolStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
