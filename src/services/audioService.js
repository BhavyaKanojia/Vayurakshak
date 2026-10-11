/**
 * Audio Speech Synthesis Service for School PA Broadcasts
 * Uses Web Speech API with simulated AWS Polly tone and bilingual support.
 */

let currentUtterance = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function speakText({ text, lang = 'en-IN', onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text of markdown asterisks and emojis for speech
  const cleanText = text
    .replace(/[🛡️🚨⚠️📢📋🌿⚡🩺💊💨😷💻🚰🛑⏱️🚫]/g, '')
    .replace(/\*+/g, '')
    .replace(/={3,}/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.95; // Slightly measured rate for authoritative clarity
  utterance.pitch = 1.0;

  // Try to pick suitable English or Hindi voice
  const voices = window.speechSynthesis.getVoices();
  if (lang.startsWith('hi')) {
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
    if (hindiVoice) utterance.voice = hindiVoice;
  } else {
    const indianEnglishVoice = voices.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('google uk english male') || v.name.toLowerCase().includes('natural'));
    if (indianEnglishVoice) utterance.voice = indianEnglishVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech error:', e);
    if (onEnd) onEnd();
    if (onError) onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}
