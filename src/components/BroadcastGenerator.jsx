import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Share2, 
  X, 
  Smartphone 
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function BroadcastGenerator({ aqi, school, onClose }) {
  const grap = getGRAPStage(aqi);
  const [activeLang, setActiveLang] = useState('both');
  const [recipientGroup, setRecipientGroup] = useState('All Grades (Pre-School to 12)');
  const [copiedType, setCopiedType] = useState(null);
  const [customPrincipal, setCustomPrincipal] = useState(school.principal || 'Principal Office');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon-box" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
              <Send size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Bilingual Parent Broadcast Dispatcher</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Instant statutory circulars for {school.shortName} (GRAP {grap.shortCode})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon-refresh" style={{ padding: '6px 8px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Configuration Bar */}
        <div style={{ padding: '14px 24px', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.78rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>Target Group:</label>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="custom-select"
              style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            >
              <option value="All Grades (Pre-School to 12)">All Grades (Pre-School to 12)</option>
              <option value="Primary Wing Only (Nursery - Class 5)">Primary Wing Only (Nursery - Class 5)</option>
              <option value="Middle & Senior Wing (Class 6 - 12)">Middle & Senior Wing (Class 6 - 12)</option>
              <option value="School Bus Commuters Only">School Bus Commuters Only</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>Principal Signature:</label>
            <input
              type="text"
              value={customPrincipal}
              onChange={(e) => setCustomPrincipal(e.target.value)}
              className="custom-select"
              style={{ padding: '8px 12px', fontSize: '0.78rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>Language:</label>
            <div className="nav-pill-group" style={{ padding: '2px' }}>
              <button
                onClick={() => setActiveLang('both')}
                className={`nav-pill-btn ${activeLang === 'both' ? 'active' : ''}`}
                style={{ flex: 1, padding: '5px 8px', justifyContent: 'center' }}
              >
                Bilingual
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`nav-pill-btn ${activeLang === 'en' ? 'active' : ''}`}
                style={{ flex: 1, padding: '5px 8px', justifyContent: 'center' }}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('hi')}
                className={`nav-pill-btn ${activeLang === 'hi' ? 'active' : ''}`}
                style={{ flex: 1, padding: '5px 8px', justifyContent: 'center' }}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: WhatsApp Chat Simulation */}
        <div className="modal-body" style={{ background: '#f1f5f9' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="whatsapp-chat-bubble">
              <div className="whatsapp-meta-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={14} color="#059669" />
                  <span>Official WhatsApp Broadcast Preview</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {activeLang === 'en' && (
                <div style={{ whiteSpace: 'pre-line', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{englishText}</div>
              )}
              {activeLang === 'hi' && (
                <div style={{ whiteSpace: 'pre-line', fontSize: '0.8rem' }}>{hindiText}</div>
              )}
              {activeLang === 'both' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ whiteSpace: 'pre-line', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{englishText}</div>
                  <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '12px', whiteSpace: 'pre-line', fontSize: '0.8rem' }}>{hindiText}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => copyToClipboard(englishText, 'en')}
              className="btn-icon-refresh"
            >
              {copiedType === 'en' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedType === 'en' ? 'Copied EN!' : 'Copy English'}</span>
            </button>
            <button
              onClick={() => copyToClipboard(hindiText, 'hi')}
              className="btn-icon-refresh"
            >
              {copiedType === 'hi' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedType === 'hi' ? 'Copied HI!' : 'Copy Hindi'}</span>
            </button>
            <button
              onClick={() => copyToClipboard(combinedText, 'both')}
              className="btn-icon-refresh"
            >
              {copiedType === 'both' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedType === 'both' ? 'Copied All!' : 'Copy All'}</span>
            </button>
          </div>

          <button
            onClick={openWhatsApp}
            className="btn-broadcast-cta"
          >
            <Share2 size={16} />
            <span>Open WhatsApp Web</span>
          </button>
        </div>

      </div>
    </div>
  );
}
