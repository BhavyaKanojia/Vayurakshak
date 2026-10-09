import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Share2, 
  Download, 
  Globe, 
  X, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function BroadcastGenerator({ aqi, school, onClose }) {
  const grap = getGRAPStage(aqi);
  const [activeLang, setActiveLang] = useState('both'); // 'en', 'hi', 'both'
  const [recipientGroup, setRecipientGroup] = useState('All Grades (Pre-School to 12)');
  const [copiedType, setCopiedType] = useState(null);
  const [customPrincipal, setCustomPrincipal] = useState(school.principal || 'Principal Office');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));

  // Generate English circular text
  const generateEnglish = () => {
    let modeText = '';
    let rulesText = '';

    if (grap.stage >= 4) {
      modeText = '🚨 CAQM GRAP STAGE IV (SEVERE+) EMERGENCY DIRECTIVE';
      rulesText = `1. Physical classes for Nursery to Class 9 & Class 11 are SUSPENDED. Classes will operate 100% ONLINE starting tomorrow.\n2. Classes 10 & 12 (Board Examinees) will operate on air-filtered indoor schedule.\n3. Mandatory fitted N95 masks for anyone visiting campus.\n4. Complete ban on outdoor activities and diesel transport vehicles.`;
    } else if (grap.stage === 3) {
      modeText = '⚠️ CAQM GRAP STAGE III (SEVERE AIR QUALITY) DIRECTIVE';
      rulesText = `1. Physical classes for Pre-School to Class 5 are shifted to 100% ONLINE mode.\n2. Classes 6 to 12 will operate in sealed, air-filtered classrooms with all outdoor sports and morning assemblies CANCELLED.\n3. Mandatory N95 masks for all students during transit and on campus.\n4. Non-BS6 diesel vehicles strictly prohibited at school gates.`;
    } else if (grap.stage === 2) {
      modeText = '📢 CAQM GRAP STAGE II (VERY POOR AIR QUALITY) NOTICE';
      rulesText = `1. Complete ban on outdoor morning assembly and physical sports across all classes (1 to 12).\n2. Classroom HEPA air purifiers are operating pre-arrival.\n3. Students are strongly advised to wear N95/FFP2 masks during morning travel (7 AM - 9 AM).\n4. Staggered bus dispersal in effect.`;
    } else if (grap.stage === 1) {
      modeText = '📋 CAQM GRAP STAGE I (POOR AIR QUALITY) HEALTH ADVISORY';
      rulesText = `1. Morning assembly for primary sections will be conducted indoors.\n2. Outdoor strenuous physical education is suspended for young students.\n3. Students with respiratory history are requested to carry prescribed inhalers and wear protective masks.`;
    } else {
      modeText = '🌿 REGULAR SCHOOL OPERATIONAL NOTICE';
      rulesText = `Air quality is within normal parameters (AQI ${aqi}). All academic, sports, and outdoor activities continue as scheduled.`;
    }

    return `🛡️ *${school.name.toUpperCase()}*\n*OFFICIAL PARENT ADVISORY*\n*Date:* ${effectiveDate} | *Current AQI:* ${aqi} (${grap.shortCode})\n*Target:* ${recipientGroup}\n\n${modeText}\n\nDear Parents & Guardians,\nIn strict compliance with statutory guidelines issued by the Commission for Air Quality Management (CAQM) and the Directorate of Education, please note the following operational directives:\n\n${rulesText}\n\nPlease ensure your ward is equipped with necessary respiratory protection. For medical assistance, the school infirmary is fully staffed.\n\nWarm regards,\n*${customPrincipal}*\n${school.name}`;
  };

  // Generate Hindi circular text
  const generateHindi = () => {
    let modeTextHi = '';
    let rulesTextHi = '';

    if (grap.stage >= 4) {
      modeTextHi = '🚨 सीएक्यूएम ग्रैप स्टेज IV (अति गंभीर) आपातकालीन निर्देश';
      rulesTextHi = `1. नर्सरी से कक्षा 9 और कक्षा 11 की भौतिक कक्षाएं स्थगित हैं। कल से कक्षाएं 100% ऑनलाइन मोड में चलेंगी।\n2. कक्षा 10 और 12 (बोर्ड परीक्षार्थी) वायु-शोधित कक्षाओं में उपस्थित होंगे।\n3. परिसर में आने वाले सभी व्यक्तियों के लिए N95 मास्क अनिवार्य है।\n4. सभी बाहरी गतिविधियां पूर्णतः प्रतिबंधित हैं।`;
    } else if (grap.stage === 3) {
      modeTextHi = '⚠️ सीएक्यूएम ग्रैप स्टेज III (गंभीर वायु गुणवत्ता) निर्देश';
      rulesTextHi = `1. प्री-स्कूल से कक्षा 5 तक की कक्षाएं ऑनलाइन माध्यम से संचालित की जाएंगी।\n2. कक्षा 6 से 12 की बाहरी गतिविधियां व सुबह की असेंबली पूर्णतः बंद रहेंगी।\n3. स्कूल आते-जाते समय सभी विद्यार्थियों के लिए N95 मास्क अनिवार्य है।\n4. गैर-BS6 डीजल वाहनों का स्कूल में प्रवेश वर्जित है।`;
    } else if (grap.stage === 2) {
      modeTextHi = '📢 सीएक्यूएम ग्रैप स्टेज II (बहुत खराब वायु गुणवत्ता) सूचना';
      rulesTextHi = `1. कक्षा 1 से 12 तक के सभी विद्यार्थियों के लिए आउटडोर असेंबली और खेलकूद बंद रहेंगे।\n2. सभी कक्षाओं में HEPA एयर प्यूरीफायर चालू हैं।\n3. सुबह 7 से 9 बजे के दौरान यात्रा में N95 मास्क पहनना अनिवार्य है।\n4. स्कूल बसों का प्रस्थान चरणबद्ध तरीके से होगा।`;
    } else if (grap.stage === 1) {
      modeTextHi = '📋 सीएक्यूएम ग्रैप स्टेज I (खराब वायु गुणवत्ता) स्वास्थ्य सलाह';
      rulesTextHi = `1. प्राथमिक कक्षाओं की सुबह की प्रार्थना कक्षा कक्ष में होगी।\n2. प्राथमिक कक्षाओं के लिए बाहरी खेल गतिविधियां स्थगित रहेंगी।\n3. श्वास संबंधी परेशानी वाले छात्र अपना इनहेलर साथ रखें और मास्क पहनें।`;
    } else {
      modeTextHi = '🌿 नियमित विद्यालय संचालन सूचना';
      rulesTextHi = `वायु गुणवत्ता सामान्य स्तर (AQI ${aqi}) पर है। सभी कक्षाएं और खेलकूद नियमित समय सारणी के अनुसार जारी रहेंगे।`;
    }

    return `🛡️ *${school.name}*\n*आधिकारिक अभिभावक सूचना (परिपत्र)*\n*दिनांक:* ${effectiveDate} | *वर्तमान AQI:* ${aqi} (${grap.shortCode})\n\n${modeTextHi}\n\nआदरणीय अभिभावक,\nवायु गुणवत्ता प्रबंधन आयोग (CAQM) एवं शिक्षा निदेशालय के वैधानिक दिशा-निर्देशों के अनुपालन में निम्न निर्णय लिए गए हैं:\n\n${rulesTextHi}\n\nकृपया सुनिश्चित करें कि आपका बच्चा मास्क पहनकर ही बाहर निकले।\n\nसस्नेह,\n*${customPrincipal}*\n${school.name}`;
  };

  const englishText = generateEnglish();
  const hindiText = generateHindi();
  const combinedText = `${englishText}\n\n====================================\n\n${hindiText}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const openWhatsApp = () => {
    const textToSend = activeLang === 'en' ? englishText : activeLang === 'hi' ? hindiText : combinedText;
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b101e] border border-white/15 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Bilingual Parent Broadcast & WhatsApp Dispatcher
              </h2>
              <p className="text-xs text-slate-400">
                Instant statutory circulars customized for {school.shortName} (GRAP {grap.shortCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Target Student Group:</label>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All Grades (Pre-School to 12)">All Grades (Pre-School to 12)</option>
              <option value="Primary Wing Only (Nursery - Class 5)">Primary Wing Only (Nursery - Class 5)</option>
              <option value="Middle & Senior Wing (Class 6 - 12)">Middle & Senior Wing (Class 6 - 12)</option>
              <option value="School Bus Commuters Only">School Bus Commuters Only</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Principal / Authority Sign:</label>
            <input
              type="text"
              value={customPrincipal}
              onChange={(e) => setCustomPrincipal(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Language View:</label>
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => setActiveLang('both')}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeLang === 'both' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bilingual (EN+HI)
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeLang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('hi')}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeLang === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview WhatsApp Bubble */}
        <div className="p-5 flex-1 overflow-y-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#070b14]">
          <div className="max-w-2xl mx-auto">
            
            {/* WhatsApp Chat Preview Card */}
            <div className="bg-[#1f2c34] text-[#e9edef] rounded-2xl rounded-tl-none p-4.5 shadow-xl border border-white/10 relative font-sans text-xs leading-relaxed space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-[#8696a0]">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Broadcast Preview</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {activeLang === 'en' && (
                <div className="whitespace-pre-line font-mono text-xs">{englishText}</div>
              )}
              {activeLang === 'hi' && (
                <div className="whitespace-pre-line text-xs font-normal">{hindiText}</div>
              )}
              {activeLang === 'both' && (
                <div className="space-y-4">
                  <div className="whitespace-pre-line font-mono text-xs">{englishText}</div>
                  <div className="border-t border-white/10 pt-3 whitespace-pre-line text-xs">{hindiText}</div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => copyToClipboard(englishText, 'en')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              {copiedType === 'en' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'en' ? 'Copied EN!' : 'Copy English'}</span>
            </button>

            <button
              onClick={() => copyToClipboard(hindiText, 'hi')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              {copiedType === 'hi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'hi' ? 'Copied HI!' : 'Copy Hindi'}</span>
            </button>

            <button
              onClick={() => copyToClipboard(combinedText, 'both')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              {copiedType === 'both' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'both' ? 'Copied All!' : 'Copy Bilingual'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={openWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 ring-1 ring-white/20 transition-all transform active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Broadcast on WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
