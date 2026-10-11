/**
 * Groq AI Inference Service for VayuRakshak
 * Uses high-speed LLaMA 3.3 70B / LLaMA 3.1 8B for real-time statutory advisory synthesis.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

// Retrieve stored API key or environment variable
export function getStoredGroqKey() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vayurakshak_groq_key') || '';
  }
  return '';
}

export function setStoredGroqKey(key) {
  if (typeof window !== 'undefined') {
    if (key) {
      localStorage.setItem('vayurakshak_groq_key', key.trim());
    } else {
      localStorage.removeItem('vayurakshak_groq_key');
    }
  }
}

/**
 * Generate real-time statutory circular advisory via Groq
 */
export async function generateGroqAdvisory({ aqi, school, grapStage, topic, apiKey = null }) {
  const key = apiKey || getStoredGroqKey();

  if (!key) {
    throw new Error('NO_KEY');
  }

  const systemPrompt = `You are VayuRakshak AI, an expert statutory legal advisor for school principals in Delhi-NCR operating under the Commission for Air Quality Management (CAQM) Graded Response Action Plan (GRAP) and Directorate of Education mandates.
Generate concise, authoritative, legally sound directives for school principals. Avoid filler language. Format cleanly with bullet points.`;

  const userPrompt = `School: ${school.name} (${school.zone})
Station: ${school.stationName}
Current AQI: ${aqi} (GRAP ${grapStage})
Topic Focus: ${topic}
Student Strength: ${school.studentStrength} students, ${school.transportBuses} school buses.

Generate specific, actionable compliance directives covering:
1. Operational school status (physical vs online hybrid mode).
2. Transport and vehicle restrictions (BS-IV diesel ban, CNG/EV protocols).
3. Student health safeguards (N95 mask protocols, infirmary readiness for asthmatic students).
4. Statutory compliance statement under Environment (Protection) Act 1986.`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Groq API Error (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No advisory generated.';
}
