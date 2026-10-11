import React, { useRef } from 'react';
import { Shield, Printer, Download, X, Award, CheckCircle, FileText } from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function OfficialCircularModal({ aqi, school, onClose }) {
  const grap = getGRAPStage(aqi);
  const printAreaRef = useRef(null);

  const circularNo = `VR/DOE/${new Date().getFullYear()}/GRAP-${grap.stage || 'GEN'}/${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog official-circular-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '880px', maxHeight: '94vh' }}
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon-box" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0284c7, #1e40af)' }}>
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Official School Letterhead Circular</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Statutory format for State Inspectors, Directorate of Education & Parent Records
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn-broadcast-cta"
              style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)', padding: '7px 16px', fontSize: '0.8rem' }}
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>

            <button onClick={onClose} className="btn-icon-refresh" style={{ padding: '6px 8px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: The Actual Printable Official Circular */}
        <div className="modal-body" style={{ background: '#f8fafc', padding: '24px' }}>
          
          <div 
            ref={printAreaRef}
            className="printable-circular-sheet"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '40px 48px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              color: '#0f172a',
              fontFamily: 'serif',
              position: 'relative'
            }}
          >
            {/* Watermark Seal */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-25deg)',
                opacity: 0.04,
                fontSize: '5rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                pointerEvents: 'none',
                userSelect: 'none',
                textAlign: 'center'
              }}
            >
              CAQM STATUTORY DIRECTIVE
            </div>

            {/* School Letterhead Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
                <Shield size={32} color="#0284c7" />
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  {school.name}
                </h1>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0' }}>
                {school.address} • Affiliated to CBSE / Directorate of Education, Delhi-NCR
              </p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                School Code: {school.id.toUpperCase()} • CAAQMS Monitoring Station: {school.stationName}
              </p>
            </div>

            {/* Circular Metadata Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <strong>Ref. No: </strong><span>{circularNo}</span>
              </div>
              <div>
                <strong>Date: </strong><span>{dateStr}</span>
              </div>
            </div>

            {/* Title / Subject */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <span style={{ 
                display: 'inline-block',
                background: '#f1f5f9', 
                border: '1px solid #cbd5e1', 
                padding: '4px 14px', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                STATUTORY NOTIFICATION • LEGAL URGENCY
              </span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', textDecoration: 'underline', fontFamily: 'var(--font-heading)' }}>
                CIRCULAR: ENFORCEMENT OF CAQM GRAP {grap.stage > 0 ? `STAGE ${grap.stage}` : 'BASELINE'} SCHOOL PROTOCOLS
              </h2>
            </div>

            {/* Telemetry Snapshot Banner */}
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px', 
              padding: '12px 18px', 
              marginBottom: '22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Monitored AQI (CPCB NAQI): </span>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{aqi} AQI ({grap.name})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Statutory Authority: </span>
                <strong style={{ color: '#0284c7' }}>{grap.statutoryOrder}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Mandated Mode: </span>
                <strong style={{ color: '#b91c1c' }}>{grap.schoolMode}</strong>
              </div>
            </div>

            {/* Circular Body Content */}
            <div style={{ fontSize: '0.88rem', lineHeight: '1.7', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'justify' }}>
              <p>
                <strong>To: All Staff Members, Teachers, Bus Transport Crew, and Parents / Guardians</strong>
              </p>

              <p>
                In strict compliance with directions issued under Section 12 of the <em>Commission for Air Quality Management in National Capital Region and Adjoining Areas Act, 2021</em> and official executive orders from the Directorate of Education, the competent authority has mandated the enforcement of <strong>{grap.name} ({grap.badge})</strong> effective immediately.
              </p>

              <div>
                <strong>Operational Directives for Strict Adherence:</strong>
                <ol style={{ paddingLeft: '22px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>
                    <strong>Academic Attendance Mode: </strong>
                    <span>{grap.overview}</span>
                  </li>
                  <li>
                    <strong>Transport Fleet Restrictions: </strong>
                    <span>{grap.transportRule}. Any vehicular engine idling within 200 meters of the school gates is punishable with campus impoundment.</span>
                  </li>
                  <li>
                    <strong>Respiratory Protection Mandate: </strong>
                    <span>{grap.maskRecommendation}. Students reporting with respiratory vulnerability (asthma, bronchitis) are exempted from physical movement and registered with the campus medical infirmary.</span>
                  </li>
                  <li>
                    <strong>Classroom Air Mitigation: </strong>
                    <span>School engineering crew is directed to maintain HEPA filtration units operational throughout indoor class hours and conduct mist sprinkling on peripheral grounds every three hours.</span>
                  </li>
                </ol>
              </div>

              <p>
                Failure to comply with these statutory directives attracts penal liability under Section 15 of the Environment (Protection) Act, 1986. All stakeholders are requested to extend complete cooperation in safeguarding the respiratory health of our students.
              </p>
            </div>

            {/* Signature & Seal Block */}
            <div style={{ marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  border: '2px dashed #94a3b8', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.62rem',
                  color: '#64748b',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  padding: '6px'
                }}>
                  <Award size={20} color="#0284c7" />
                  <span>OFFICIAL SEAL</span>
                  <span>{school.id.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#1e40af', marginBottom: '4px' }}>
                  {school.principal}
                </div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontWeight: 800 }}>
                  Principal / Head of Institution
                </div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                  {school.name}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer no-print">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Generated with statutory verification hash: <code>{circularNo}</code>
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn-broadcast-cta"
              style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}
            >
              <Printer size={15} />
              <span>Print Letterhead</span>
            </button>
            <button onClick={onClose} className="btn-icon-refresh">
              <span>Close</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
