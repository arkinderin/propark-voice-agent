import { create } from "zustand";

interface Doctor {
  id: string;
  fullName: string;
  title: string | null;
  specialty: string | null;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  priceFrom: number | null;
  priceTo: number | null;
}

interface TriageResult {
  suggestedDoctorId: string | null;
  suggestedServiceId: string | null;
  urgency: "düşük" | "orta" | "yüksek";
  reasoning: string;
}

interface RandevuState {
  step: 1 | 2 | 3;
  complaint: string;
  triage: TriageResult | null;
  selectedDoctorId: string | null;
  selectedServiceId: string | null;
  selectedSlot: string | null;
  doctors: Doctor[];
  services: Service[];
  slots: string[];
  patientName: string;
  phone: string;
  email: string;
  kvkkConsent: boolean;
  loading: boolean;
  error: string | null;

  setStep: (s: 1 | 2 | 3) => void;
  setComplaint: (c: string) => void;
  setTriage: (t: TriageResult | null) => void;
  setDoctor: (id: string | null) => void;
  setService: (id: string | null) => void;
  setSlot: (s: string | null) => void;
  setDoctors: (d: Doctor[]) => void;
  setServices: (s: Service[]) => void;
  setSlots: (s: string[]) => void;
  setPatientName: (n: string) => void;
  setPhone: (p: string) => void;
  setEmail: (e: string) => void;
  setKvkk: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initial = {
  step: 1 as const,
  complaint: "",
  triage: null,
  selectedDoctorId: null,
  selectedServiceId: null,
  selectedSlot: null,
  doctors: [],
  services: [],
  slots: [],
  patientName: "",
  phone: "",
  email: "",
  kvkkConsent: false,
  loading: false,
  error: null,
};

export const useRandevuStore = create<RandevuState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setComplaint: (complaint) => set({ complaint }),
  setTriage: (triage) => set({ triage }),
  setDoctor: (selectedDoctorId) => set({ selectedDoctorId, selectedSlot: null, slots: [] }),
  setService: (selectedServiceId) => set({ selectedServiceId }),
  setSlot: (selectedSlot) => set({ selectedSlot }),
  setDoctors: (doctors) => set({ doctors }),
  setServices: (services) => set({ services }),
  setSlots: (slots) => set({ slots }),
  setPatientName: (patientName) => set({ patientName }),
  setPhone: (phone) => set({ phone }),
  setEmail: (email) => set({ email }),
  setKvkk: (kvkkConsent) => set({ kvkkConsent }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initial),
}));
