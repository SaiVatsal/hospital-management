import React, { useState } from 'react';
import {
  Activity,
  Users,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  UserPlus,
  Bed,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Search,
  Check
} from 'lucide-react';
import { useStore } from './store/useStore';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    patients,
    wards,
    appointments,
    staffRoster,
    billingItems,
    admitPatient,
    dischargePatient,
    scheduleAppointment,
    settleBillItem
  } = useStore();

  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitForm, setAdmitForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    ward: 'Cardiovascular ICU',
    bedNumber: 'ICU-05',
    primaryDoctor: 'Dr. Evelyn Martinez, MD',
    diagnosis: '',
    initialDeposit: 600
  });

  const [showAptModal, setShowAptModal] = useState(false);
  const [aptForm, setAptForm] = useState({
    patientName: '',
    doctorName: 'Dr. Evelyn Martinez, MD',
    specialty: 'Cardiology',
    date: '2026-09-29',
    time: '10:00 AM',
    type: 'Cardiovascular Follow-up'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const totalBeds = wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const occupiedBeds = wards.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const occupancyPercent = Math.round((occupiedBeds / totalBeds) * 100);

  const handleAdmitSubmit = (e) => {
    e.preventDefault();
    if (!admitForm.name.trim()) return;
    admitPatient(admitForm);
    setShowAdmitModal(false);
    setAdmitForm({
      name: '',
      age: '',
      gender: 'Male',
      ward: 'Cardiovascular ICU',
      bedNumber: 'ICU-05',
      primaryDoctor: 'Dr. Evelyn Martinez, MD',
      diagnosis: '',
      initialDeposit: 600
    });
  };

  const handleAptSubmit = (e) => {
    e.preventDefault();
    if (!aptForm.patientName.trim()) return;
    scheduleAppointment(aptForm);
    setShowAptModal(false);
    setAptForm({
      patientName: '',
      doctorName: 'Dr. Evelyn Martinez, MD',
      specialty: 'Cardiology',
      date: '2026-09-29',
      time: '10:00 AM',
      type: 'Cardiovascular Follow-up'
    });
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Calm Clinical Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284c7] flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
                AEGIS HEALTH // CLINICAL OS
              </span>
              <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">
                Inpatient Admissions • Ward Allocations • Diagnostic Operations
              </span>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            {[
              { id: 'patients', label: 'Inpatient Registry', icon: Users },
              { id: 'wards', label: 'Beds & Wards', icon: Bed },
              { id: 'appointments', label: 'Consultations', icon: Calendar },
              { id: 'roster', label: 'Duty Roster', icon: Stethoscope },
              { id: 'billing', label: 'Treatment Ledger', icon: DollarSign },
              { id: 'analytics', label: 'Occupancy Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === tab.id
                      ? 'bg-white text-sky-700 font-bold shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Rapid Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdmitModal(true)}
              className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Patient</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-6">
        {/* VIEW 1: PATIENTS REGISTRY */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            {/* Search & Stats Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by name, ID, diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span>Active Inpatients: <strong className="text-slate-900">{patients.filter(p => p.status === 'Admitted').length}</strong></span>
                <span>Discharged: <strong className="text-slate-900">{patients.filter(p => p.status === 'Discharged').length}</strong></span>
              </div>
            </div>

            {/* Inpatient Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Record ID</th>
                      <th className="p-4">Patient Name & Bio</th>
                      <th className="p-4">Ward / Bed</th>
                      <th className="p-4">Attending Physician</th>
                      <th className="p-4">Primary Clinical Diagnosis</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPatients.map((pt) => (
                      <tr key={pt.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-mono font-bold text-sky-700">{pt.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{pt.name}</div>
                          <div className="text-[11px] text-slate-500">{pt.age} yrs • {pt.gender}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{pt.ward}</div>
                          <span className="font-mono text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-bold">
                            {pt.bedNumber}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{pt.primaryDoctor}</td>
                        <td className="p-4 text-slate-600 max-w-xs">{pt.diagnosis}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pt.status === 'Admitted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            ● {pt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {pt.status === 'Admitted' ? (
                            <button
                              onClick={() => dischargePatient(pt.id)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition"
                            >
                              Discharge & Settle
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                              <Check className="w-3.5 h-3.5" /> Discharged
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WARDS & BEDS */}
        {activeTab === 'wards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wards.map((w) => {
                const percent = Math.round((w.occupiedBeds / w.totalBeds) * 100);
                return (
                  <div key={w.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {w.department}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {w.occupiedBeds} / {w.totalBeds} Beds
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{w.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Charge: {w.nurseInCharge}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Occupancy</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 85 ? 'bg-rose-500' : 'bg-[#0284c7]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="font-bold text-base text-slate-900">Outpatient Consultation Schedule</h3>
                <p className="text-xs text-slate-500">Scheduled clinical evaluations, diagnostic follow-ups, and pre-op reviews.</p>
              </div>
              <button
                onClick={() => setShowAptModal(true)}
                className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Consultation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {apt.id}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ● {apt.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{apt.patientName}</h4>
                    <p className="text-xs text-slate-600 font-semibold">{apt.type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Physician</span>
                      <span className="font-semibold text-slate-800">{apt.doctorName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Slot</span>
                      <span className="font-semibold text-slate-800">{apt.date} • {apt.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: DUTY ROSTER */}
        {activeTab === 'roster' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Active Medical & Nursing Staff Duty Roster</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {staffRoster.map((st) => (
                <div key={st.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{st.id}</span>
                    {st.onCall && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        On-Call Emergency
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{st.name}</h4>
                  <p className="text-xs text-sky-700 font-semibold">{st.role}</p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Shift: {st.shift}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: TREATMENT LEDGER */}
        {activeTab === 'billing' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Itemized Patient Treatment & Procedural Billing Ledger</h3>
            <div className="divide-y divide-slate-100">
              {billingItems.map((b) => (
                <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold mr-2">{b.id}</span>
                    <strong className="text-slate-900 text-sm">{b.patientName}</strong>
                    <p className="text-xs text-slate-600 mt-0.5">{b.item}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-base text-slate-900">${b.cost.toLocaleString()}</span>
                    {b.status === 'Unpaid' ? (
                      <button
                        onClick={() => settleBillItem(b.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        Process Payment
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        ✓ Settled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: OCCUPANCY ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Hospital Occupancy</span>
                <div className="text-3xl font-extrabold text-sky-800">{occupancyPercent}%</div>
                <p className="text-xs text-slate-500">{occupiedBeds} of {totalBeds} total operational beds filled</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">ER Average Triage Time</span>
                <div className="text-3xl font-extrabold text-emerald-600">8.4 mins</div>
                <p className="text-xs text-slate-500">Exceeds national benchmark (15 mins)</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Daily Clinical Throughput</span>
                <div className="text-3xl font-extrabold text-indigo-600">142 Cases</div>
                <p className="text-xs text-slate-500">Inpatients, outpatient consultations & surgeries</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADMISSION MODAL */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Clinical Admission Intake Form</h3>
              <button onClick={() => setShowAdmitModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAdmitSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Margaret Thatcher"
                  value={admitForm.name}
                  onChange={(e) => setAdmitForm({ ...admitForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    required
                    value={admitForm.age}
                    onChange={(e) => setAdmitForm({ ...admitForm, age: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Gender</label>
                  <select
                    value={admitForm.gender}
                    onChange={(e) => setAdmitForm({ ...admitForm, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ward Assignment</label>
                  <select
                    value={admitForm.ward}
                    onChange={(e) => setAdmitForm({ ...admitForm, ward: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {wards.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bed Number</label>
                  <input
                    type="text"
                    value={admitForm.bedNumber}
                    onChange={(e) => setAdmitForm({ ...admitForm, bedNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Admitting Diagnosis</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Clinical presentation and preliminary diagnosis..."
                  value={admitForm.diagnosis}
                  onChange={(e) => setAdmitForm({ ...admitForm, diagnosis: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl font-bold"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT MODAL */}
      {showAptModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Schedule Outpatient Consultation</h3>
              <button onClick={() => setShowAptModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAptSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={aptForm.patientName}
                  onChange={(e) => setAptForm({ ...aptForm, patientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Specialty</label>
                  <select
                    value={aptForm.specialty}
                    onChange={(e) => setAptForm({ ...aptForm, specialty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Pulmonology</option>
                    <option>Internal Medicine</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Physician</label>
                  <select
                    value={aptForm.doctorName}
                    onChange={(e) => setAptForm({ ...aptForm, doctorName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Dr. Evelyn Martinez, MD</option>
                    <option>Dr. Michael Chang, MD</option>
                    <option>Dr. Sarah Al-Mansoor, MD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date</label>
                  <input
                    type="date"
                    value={aptForm.date}
                    onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Time</label>
                  <input
                    type="text"
                    value={aptForm.time}
                    onChange={(e) => setAptForm({ ...aptForm, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAptModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#0284c7] text-white rounded-xl font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-mono">
        © 2026 AEGIS HEALTH ENTERPRISE • SUPABASE POSTGRES RELATIONAL BACKEND
      </footer>
    </div>
  );
}
