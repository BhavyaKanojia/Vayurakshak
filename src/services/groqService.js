/**
 * Groq AI Inference Service for VayuRakshak
 * Uses high-speed LLaMA 3.3 70B / LLaMA 3.1 8B for real-time statutory advisory synthesis.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Models in priority order based on active Groq account access
const CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile'
];

// Retrieve stored API key from localStorage or Vite environment variable
export function getStoredGroqKey() {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('vayurakshak_groq_key');
    if (local && local.trim().length > 0) return local.trim();
  }
  try {
    if (import.meta.env?.VITE_GROQ_API_KEY) {
      return import.meta.env.VITE_GROQ_API_KEY.trim();
    }
  } catch {
    // ignore
  }
  return '';
}

export function setStoredGroqKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim().length > 0) {
      localStorage.setItem('vayurakshak_groq_key', key.trim());
    } else {
      localStorage.removeItem('vayurakshak_groq_key');
    }
  }
}

/**
 * Execute Groq inference with automatic model fallback
 */
async function callGroqChat(messages, key, options = {}) {
  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.2,
          max_tokens: options.max_tokens ?? 900,
          ...(options.response_format ? { response_format: options.response_format } : {})
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return { content, model };
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${response.status}`;
        lastError = new Error(errMsg);
        // If error is model not found or rate limit, try next candidate
        if (errData.error?.code === 'model_not_found') {
          continue;
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate advisory from Groq.');
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

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const result = await callGroqChat(messages, key, { temperature: 0.2, max_tokens: 850 });
  return result.content;
}

/**
 * Generate live bilingual parent broadcasts (English + Hindi) via Groq
 */
export async function generateGroqBroadcast({ aqi, school, grapStage, recipientGroup, apiKey = null }) {
  const key = apiKey || getStoredGroqKey();

  if (!key) {
    throw new Error('NO_KEY');
  }

  const systemPrompt = `You are VayuRakshak AI, an emergency notification generator for Delhi-NCR schools under CAQM GRAP mandates.
Respond ONLY with a valid JSON object matching this schema:
{
  "englishText": "Full formatted WhatsApp message in English with emojis, bullet points, and Principal signoff",
  "hindiText": "Full formatted WhatsApp message in formal Hindi (हिंदी) with emojis, bullet points, and Principal signoff"
}`;

  const userPrompt = `School: ${school.name}
Location: ${school.zone}
Principal: ${school.principal || 'Principal Office'}
Current AQI: ${aqi} (GRAP ${grapStage})
Target Audience: ${recipientGroup}

Generate clear, reassuring, yet statutory WhatsApp circulars for parents. Specify:
- School operational mode (online vs physical classes based on GRAP stage).
- Strict transport guidelines and mask rules.
- Infirmary contact and safety precautions.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const result = await callGroqChat(messages, key, { 
    temperature: 0.2, 
    max_tokens: 950,
    response_format: { type: 'json_object' }
  });

  try {
    return JSON.parse(result.content);
  } catch {
    return {
      englishText: result.content,
      hindiText: 'कृपया अंग्रेजी संदेश देखें।'
    };
  }
}
