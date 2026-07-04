// API client for NeuroSense AI FastAPI backend.
// All endpoints are wired up but fall back to mock data when the backend is unreachable
// so the UI can be evaluated end-to-end during development.

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:8000";

type Json = Record<string, unknown>;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
}

export type Role = "doctor" | "patient";

export interface Prediction {
  id: string;
  patientId: string;
  patientName?: string;
  createdAt: string;
  label: "Seizure" | "Normal" | "Pre-ictal";
  confidence: number; // 0-1
  channels: number;
  durationSec: number;
  waveform: { t: number; v: number }[];
  remarks?: string;
  doctorReviewed?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "Other";
  lastVisit: string;
  riskLevel: "Low" | "Moderate" | "High";
  predictionsCount: number;
}

// -------- Mock data (used as fallback) --------
function genWave(seed = 1, seizure = false) {
  const pts: { t: number; v: number }[] = [];
  for (let i = 0; i < 200; i++) {
    const t = i / 20;
    const base = Math.sin(t * 2 + seed) * 0.4 + Math.sin(t * 5.3 + seed) * 0.2;
    const spike = seizure && i > 60 && i < 140 ? Math.sin(t * 22) * (0.9 - Math.abs(i - 100) / 100) : 0;
    pts.push({ t: +t.toFixed(2), v: +(base + spike + (Math.random() - 0.5) * 0.08).toFixed(3) });
  }
  return pts;
}

const mockPatients: Patient[] = [
  { id: "p-001", name: "Aarav Sharma", age: 34, gender: "M", lastVisit: "2025-06-20", riskLevel: "High", predictionsCount: 12 },
  { id: "p-002", name: "Meera Iyer", age: 27, gender: "F", lastVisit: "2025-06-28", riskLevel: "Moderate", predictionsCount: 5 },
  { id: "p-003", name: "Daniel Chen", age: 41, gender: "M", lastVisit: "2025-07-01", riskLevel: "Low", predictionsCount: 2 },
  { id: "p-004", name: "Sofia Alvarez", age: 19, gender: "F", lastVisit: "2025-07-03", riskLevel: "High", predictionsCount: 9 },
  { id: "p-005", name: "Yuki Tanaka", age: 52, gender: "F", lastVisit: "2025-06-15", riskLevel: "Moderate", predictionsCount: 7 },
  { id: "p-006", name: "Marcus Bauer", age: 63, gender: "M", lastVisit: "2025-05-30", riskLevel: "Low", predictionsCount: 3 },
];

const mockPredictions: Prediction[] = [
  {
    id: "pr-001", patientId: "p-001", patientName: "Aarav Sharma",
    createdAt: "2025-07-03T09:20:00Z", label: "Seizure", confidence: 0.94,
    channels: 19, durationSec: 30, waveform: genWave(1, true),
    remarks: "Focal onset detected in left temporal lobe.", doctorReviewed: true,
  },
  {
    id: "pr-002", patientId: "p-001", patientName: "Aarav Sharma",
    createdAt: "2025-06-28T14:10:00Z", label: "Pre-ictal", confidence: 0.71,
    channels: 19, durationSec: 30, waveform: genWave(2, true), doctorReviewed: false,
  },
  {
    id: "pr-003", patientId: "p-002", patientName: "Meera Iyer",
    createdAt: "2025-06-28T10:00:00Z", label: "Normal", confidence: 0.88,
    channels: 19, durationSec: 30, waveform: genWave(3, false), doctorReviewed: true,
  },
  {
    id: "pr-004", patientId: "p-004", patientName: "Sofia Alvarez",
    createdAt: "2025-07-03T18:45:00Z", label: "Seizure", confidence: 0.97,
    channels: 19, durationSec: 30, waveform: genWave(4, true), doctorReviewed: false,
  },
];

// -------- Public API surface --------
export const api = {
  async login(email: string, password: string, role: Role) {
    try {
      return await request<{ token: string; user: { id: string; name: string; role: Role } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password, role }) },
      );
    } catch {
      return {
        token: "demo-token",
        user: { id: role === "doctor" ? "d-001" : "p-001", name: role === "doctor" ? "Dr. Anya Rao" : "Aarav Sharma", role },
      };
    }
  },

  async register(payload: Json) {
    try {
      return await request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
    } catch {
      return { ok: true };
    }
  },

  async uploadEeg(file: File): Promise<Prediction> {
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE_URL}/predict`, { method: "POST", body: form });
      if (!res.ok) throw new Error("upload failed");
      return await res.json();
    } catch {
      // Fallback: pretend to analyse
      await new Promise((r) => setTimeout(r, 1400));
      const isSeizure = Math.random() > 0.5;
      return {
        id: `pr-${Date.now()}`,
        patientId: "p-001",
        patientName: "Aarav Sharma",
        createdAt: new Date().toISOString(),
        label: isSeizure ? "Seizure" : "Normal",
        confidence: +(0.78 + Math.random() * 0.2).toFixed(2),
        channels: 19,
        durationSec: 30,
        waveform: genWave(Math.random() * 10, isSeizure),
      };
    }
  },

  async listPatients(): Promise<Patient[]> {
    try { return await request<Patient[]>("/patients"); } catch { return mockPatients; }
  },

  async listPredictions(patientId?: string): Promise<Prediction[]> {
    try {
      const q = patientId ? `?patient_id=${patientId}` : "";
      return await request<Prediction[]>(`/predictions${q}`);
    } catch {
      return patientId ? mockPredictions.filter((p) => p.patientId === patientId) : mockPredictions;
    }
  },

  async addRemark(predictionId: string, remark: string) {
    try {
      return await request(`/predictions/${predictionId}/remark`, {
        method: "POST", body: JSON.stringify({ remark }),
      });
    } catch { return { ok: true }; }
  },

  async chat(message: string, history: { role: "user" | "assistant"; content: string }[] = []) {
    try {
      return await request<{ reply: string }>("/chat", {
        method: "POST", body: JSON.stringify({ message, history }),
      });
    } catch {
      const m = message.toLowerCase();
      let reply = "I'm NeuroSense — your AI assistant. I can explain EEG results and answer epilepsy questions.";
      if (m.includes("seizure")) reply = "A seizure is a burst of abnormal electrical activity in the brain. Our model flags it when high-frequency rhythmic patterns dominate multiple channels.";
      else if (m.includes("confidence")) reply = "Confidence reflects how certain the model is about a prediction. Above 0.85 is high; below 0.6 suggests review by a neurologist.";
      else if (m.includes("eeg")) reply = "EEG records brain electrical activity through scalp electrodes. Upload a .edf or .csv file and I'll analyse it in seconds.";
      else if (m.includes("emergency")) reply = "If a seizure lasts more than 5 minutes, call emergency services immediately. Keep the person safe and time the episode.";
      return { reply };
    }
  },
};

export const _mock = { mockPatients, mockPredictions, genWave };