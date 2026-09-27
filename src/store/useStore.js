import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeTab: 'patients', // 'patients' | 'wards' | 'appointments' | 'roster' | 'billing' | 'analytics'

  patients: [
    {
      id: 'PT-9041',
      name: 'Jonathan Reynolds',
      age: 54,
      gender: 'Male',
      admittedDate: '2026-09-22',
      ward: 'Cardiovascular ICU',
      bedNumber: 'ICU-04',
      primaryDoctor: 'Dr. Evelyn Martinez, MD',
      diagnosis: 'Acute Myocardial Infarction Post-Angioplasty',
      status: 'Admitted',
      billTotal: 4850,
      paid: false
    },
    {
      id: 'PT-9042',
      name: 'Claire Beauchamp',
      age: 38,
      gender: 'Female',
      admittedDate: '2026-09-25',
      ward: 'Orthopedic Recovery',
      bedNumber: 'REC-12',
      primaryDoctor: 'Dr. Michael Chang, MD',
      diagnosis: 'Right Tibia Open Reduction Internal Fixation',
      status: 'Admitted',
      billTotal: 3200,
      paid: false
    },
    {
      id: 'PT-9043',
      name: 'David K. Mensah',
      age: 67,
      gender: 'Male',
      admittedDate: '2026-09-18',
      ward: 'General Medicine',
      bedNumber: 'GEN-08',
      primaryDoctor: 'Dr. Sarah Al-Mansoor, MD',
      diagnosis: 'Community-Acquired Lobar Pneumonia',
      status: 'Discharged',
      billTotal: 1890,
      paid: true
    }
  ],

  wards: [
    { id: 'w-1', name: 'Cardiovascular ICU', totalBeds: 12, occupiedBeds: 10, department: 'Cardiology', nurseInCharge: 'Nurse Brenda Vance, BSN' },
    { id: 'w-2', name: 'Orthopedic Recovery', totalBeds: 16, occupiedBeds: 11, department: 'Surgery', nurseInCharge: 'Nurse Liam Cooper, RN' },
    { id: 'w-3', name: 'Pediatric Care Unit', totalBeds: 20, occupiedBeds: 8, department: 'Pediatrics', nurseInCharge: 'Nurse Hannah Lee, BSN' },
    { id: 'w-4', name: 'General Internal Medicine', totalBeds: 30, occupiedBeds: 22, department: 'Internal Medicine', nurseInCharge: 'Nurse Derek Ross, RN' }
  ],

  appointments: [
    {
      id: 'APT-101',
      patientName: 'Sophia Jenkins',
      doctorName: 'Dr. Evelyn Martinez, MD',
      specialty: 'Cardiology',
      date: '2026-09-28',
      time: '09:30 AM',
      type: 'Follow-up Consultation',
      status: 'Scheduled'
    },
    {
      id: 'APT-102',
      patientName: 'Arthur Pendelton',
      doctorName: 'Dr. Michael Chang, MD',
      specialty: 'Orthopedics',
      date: '2026-09-28',
      time: '11:15 AM',
      type: 'Post-Op Knee Arthroscopy Exam',
      status: 'Confirmed'
    }
  ],

  staffRoster: [
    { id: 'ST-01', name: 'Dr. Evelyn Martinez, MD', role: 'Chief Cardiologist', shift: 'Day (07:00 - 15:00)', department: 'Cardiology', onCall: true },
    { id: 'ST-02', name: 'Dr. Michael Chang, MD', role: 'Lead Orthopedic Surgeon', shift: 'Evening (15:00 - 23:00)', department: 'Orthopedics', onCall: false },
    { id: 'ST-03', name: 'Nurse Brenda Vance, BSN', role: 'ICU Head Nurse', shift: 'Night (23:00 - 07:00)', department: 'Cardiovascular ICU', onCall: true },
    { id: 'ST-04', name: 'Dr. Sarah Al-Mansoor, MD', role: 'Pulmonology Attending', shift: 'Day (07:00 - 15:00)', department: 'Internal Medicine', onCall: false }
  ],

  billingItems: [
    { id: 'BL-801', patientId: 'PT-9041', patientName: 'Jonathan Reynolds', item: 'Coronary Stent & Angioplasty Intervention', cost: 3200, status: 'Unpaid' },
    { id: 'BL-802', patientId: 'PT-9041', patientName: 'Jonathan Reynolds', item: 'ICU Bed Facility (4 Days @ $350/day)', cost: 1400, status: 'Unpaid' },
    { id: 'BL-803', patientId: 'PT-9041', patientName: 'Jonathan Reynolds', item: 'IV Antiplatelet & Saline Infusion', cost: 250, status: 'Unpaid' },
    { id: 'BL-804', patientId: 'PT-9042', patientName: 'Claire Beauchamp', item: 'Tibial Plating & Orthopedic Surgery', cost: 2400, status: 'Unpaid' },
    { id: 'BL-805', patientId: 'PT-9042', patientName: 'Claire Beauchamp', item: 'Recovery Room Accommodations (2 Days)', cost: 800, status: 'Unpaid' }
  ],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  admitPatient: (patientData) => set((state) => {
    const newPt = {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientData.name,
      age: Number(patientData.age || 40),
      gender: patientData.gender || 'Other',
      admittedDate: new Date().toISOString().slice(0, 10),
      ward: patientData.ward || 'General Medicine',
      bedNumber: patientData.bedNumber || 'GEN-15',
      primaryDoctor: patientData.primaryDoctor || 'Dr. Sarah Al-Mansoor, MD',
      diagnosis: patientData.diagnosis || 'Clinical Observation',
      status: 'Admitted',
      billTotal: Number(patientData.initialDeposit || 500),
      paid: false
    };

    const updatedWards = state.wards.map((w) =>
      w.name === newPt.ward ? { ...w, occupiedBeds: Math.min(w.totalBeds, w.occupiedBeds + 1) } : w
    );

    return {
      patients: [newPt, ...state.patients],
      wards: updatedWards
    };
  }),

  dischargePatient: (patientId) => set((state) => {
    const target = state.patients.find(p => p.id === patientId);
    if (!target) return {};

    const updatedPatients = state.patients.map(p =>
      p.id === patientId ? { ...p, status: 'Discharged', paid: true } : p
    );

    const updatedWards = state.wards.map(w =>
      w.name === target.ward ? { ...w, occupiedBeds: Math.max(0, w.occupiedBeds - 1) } : w
    );

    return {
      patients: updatedPatients,
      wards: updatedWards
    };
  }),

  scheduleAppointment: (aptData) => set((state) => ({
    appointments: [
      {
        id: `APT-${Math.floor(100 + Math.random() * 900)}`,
        patientName: aptData.patientName,
        doctorName: aptData.doctorName,
        specialty: aptData.specialty,
        date: aptData.date,
        time: aptData.time,
        type: aptData.type || 'General Consultation',
        status: 'Confirmed'
      },
      ...state.appointments
    ]
  })),

  settleBillItem: (billId) => set((state) => ({
    billingItems: state.billingItems.map(b => b.id === billId ? { ...b, status: 'Settled / Paid' } : b)
  }))
}));
