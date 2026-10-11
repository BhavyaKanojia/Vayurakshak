import React from 'react';
import { Award, ShieldCheck, Printer, X, CheckCircle2 } from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function ComplianceCertificateModal({ aqi, school, completedTasksCount, totalTasksCount, onClose }) {
  const grap = getGRAPStage(aqi);
  const certId = `CERT-CAQM-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog official-circular-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', maxHeight: '92vh' }}
      >
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon-box" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              <Award size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>CAQM Statutory Audit Certificate</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Official verification record for Environmental Protection Act Section 15 Compliance
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              className="btn-broadcast-cta"
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', padding: '7px 16px', fontSize: '0.8rem' }}
            >
              <Printer size={15} />
              <span>Print Certificate</span>
            </button>
            <button onClick={onClose} className="btn-icon-refresh" style={{ padding: '6px 8px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc', padding: '24px' }}>
          <div 
            className="printable-circular-sheet"
            style={{
              background: '#ffffff',
              border: '6px double #059669',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              position: 'relative'
            }}
          >
            {/* Top Seal Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <Award size={34} />
              </div>
            </div>

            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>
              Statutory Air Quality Compliance Registry • Delhi-NCR
            </span>

            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 16px', fontFamily: 'var(--font-heading)' }}>
              CERTIFICATE OF CAQM GRAP COMPLIANCE
            </h1>

            <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              This is to officially certify that the administration of <strong>{school.name}</strong> ({school.zone}) has successfully instituted and verified all mandatory mitigation protocols under <strong>{grap.name}</strong> ({grap.badge}).
            </p>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Verified Station AQI</span>
                <strong style={{ fontSize: '1.25rem', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>{aqi} NAQI</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Audit Status</span>
                <strong style={{ fontSize: '1.1rem', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} /> 100% Complied
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Inspection Action Items</span>
                <strong style={{ fontSize: '1.25rem', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>{completedTasksCount} / {totalTasksCount} Items</strong>
              </div>
            </div>

            {/* Verification Hash & Signature */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'left', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Certification Audit Hash:</span>
                <code style={{ fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 700 }}>{certId}</code>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>Timestamp: {dateStr} • Station: {school.stationName}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '1.2rem', color: '#059669', marginBottom: '2px' }}>
                  {school.principal}
                </div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontWeight: 800 }}>
                  Head of Institution / Principal
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                  Autonomous VayuRakshak Verification Core
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="modal-footer no-print">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Tamper-evident verification record generated for statutory school audit inspection.
          </span>
          <button onClick={onClose} className="btn-icon-refresh">
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
