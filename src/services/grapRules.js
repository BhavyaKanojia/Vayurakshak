/**
 * Official Commission for Air Quality Management (CAQM) Delhi-NCR
 * Graded Response Action Plan (GRAP) Rules & Statutory School Directives
 */

export const GRAP_STAGES = {
  0: {
    stage: 0,
    name: 'Normal / Pre-GRAP Operations',
    shortCode: 'STANDARD',
    color: '#10b981',
    accentColor: 'emerald',
    badge: 'Standard Protocol',
    threshold: 'AQI ≤ 200',
    statutoryOrder: 'DoE Standard Operating Protocol',
    schoolMode: 'Regular On-Campus (All Grades)',
    overview: 'Air quality is within acceptable/moderate limits. Regular academic schedule, morning assemblies, and outdoor sports permitted.',
    checklist: [
      { id: 'c0_1', text: 'Conduct routine morning outdoor assembly with hydration reminders', category: 'Assembly', mandatory: false },
      { id: 'c0_2', text: 'Regular physical education & outdoor sports periods operational', category: 'Sports', mandatory: false },
      { id: 'c0_3', text: 'Maintain regular campus green belt watering schedule', category: 'Perimeter', mandatory: false },
    ],
    transportRule: 'Normal bus operations; encourage school bus carpooling.',
    maskRecommendation: 'Optional; recommended only for children with known acute asthma.'
  },
  1: {
    stage: 1,
    name: 'GRAP Stage I — Poor Air Quality',
    shortCode: 'GRAP I',
    color: '#f97316',
    accentColor: 'orange',
    badge: 'Statutory Directive (CAQM)',
    threshold: 'AQI 201 – 300',
    statutoryOrder: 'CAQM Directive Section 12 / DoE AQI Advisory',
    schoolMode: 'Restricted Outdoor (Class Pre-School to 5 Modified)',
    overview: 'Poor air quality requires proactive curbs. Suspend strenuous outdoor exertion for younger children and enforce campus dust suppression.',
    checklist: [
      { id: 'c1_1', text: 'Cancel morning outdoor assembly for Nursery to Class 5 (conduct in classrooms)', category: 'Assembly', mandatory: true },
      { id: 'c1_2', text: 'Replace intense outdoor running/sports with indoor games for primary sections', category: 'Sports', mandatory: true },
      { id: 'c1_3', text: 'Sprinkle treated water twice daily along perimeter walls and bus transit pathways', category: 'Perimeter', mandatory: true },
      { id: 'c1_4', text: 'Issue advisory to parents recommending N95/FFP2 masks during morning transit', category: 'Advisory', mandatory: true },
      { id: 'c1_5', text: 'Ensure school infirmary is stocked with emergency nebulizers and bronchodilators', category: 'Health Room', mandatory: true }
    ],
    transportRule: 'Strict zero-idling policy for school buses and private vans in parking bays.',
    maskRecommendation: 'Strongly recommended for all students during transit and arrival (7:00 AM – 9:00 AM).'
  },
  2: {
    stage: 2,
    name: 'GRAP Stage II — Very Poor Air Quality',
    shortCode: 'GRAP II',
    color: '#ef4444',
    accentColor: 'red',
    badge: 'Heightened Statutory Mandate',
    threshold: 'AQI 301 – 400',
    statutoryOrder: 'CAQM Order 2024/09 & Delhi Disaster Management Authority',
    schoolMode: 'Strict Indoor Only (Class 1 to 12 All Outdoors Suspended)',
    overview: 'High health hazard. Complete ban on outdoor activities across all grade levels. Diesel generator ban and classroom air purification activated.',
    checklist: [
      { id: 'c2_1', text: 'Complete ban on outdoor assemblies & sports across ALL classes (1 to 12)', category: 'Assembly', mandatory: true },
      { id: 'c2_2', text: 'Pre-run classroom HEPA air purifiers 45 minutes prior to first bell (07:15 AM)', category: 'Air Cleaners', mandatory: true },
      { id: 'c2_3', text: 'Strict campus-wide ban on Diesel Generator (DG) set operation (except life-safety)', category: 'Compliance', mandatory: true },
      { id: 'c2_4', text: 'Stagger bus fleet departure in 15-minute batches to avoid exhaust accumulation', category: 'Transport', mandatory: true },
      { id: 'c2_5', text: 'Send bilingual WhatsApp broadcast notifying parents of indoor shelter protocol', category: 'Broadcast', mandatory: true },
      { id: 'c2_6', text: 'Deploy mist sprinklers across school gates and bus loading corridors', category: 'Perimeter', mandatory: true }
    ],
    transportRule: 'Prohibit private diesel vehicles older than 10 years at school entry gates.',
    maskRecommendation: 'Mandatory N95 / KF94 masks for all students and staff during outdoor transit.'
  },
  3: {
    stage: 3,
    name: 'GRAP Stage III — Severe Air Quality',
    shortCode: 'GRAP III',
    color: '#b91c1c',
    accentColor: 'rose',
    badge: 'Emergency Enforcement',
    threshold: 'AQI 401 – 450',
    statutoryOrder: 'CAQM Directive 14(A) / Directorate of Education Order',
    schoolMode: 'Hybrid / Online for Primary (Pre-school to Class 5)',
    overview: 'Severe public health threat. Legal directive to suspend physical classes for primary sections up to Class 5 and operate in online mode.',
    checklist: [
      { id: 'c3_1', text: 'Statutory Order: Transition Pre-School to Class 5 to 100% Online/Virtual mode', category: 'Academics', mandatory: true },
      { id: 'c3_2', text: 'For Class 6-12: Zero exposure window — students remain in sealed, filtered rooms', category: 'Academics', mandatory: true },
      { id: 'c3_3', text: 'Ban entry of all BS-III Petrol and BS-IV Diesel school transport vehicles', category: 'Transport', mandatory: true },
      { id: 'c3_4', text: 'Halt all on-campus civil maintenance, painting, and construction projects', category: 'Facilities', mandatory: true },
      { id: 'c3_5', text: 'Activate Emergency Parent Notification broadcast via WhatsApp & SMS gateway', category: 'Broadcast', mandatory: true },
      { id: 'c3_6', text: 'Medical screening station at arrival gate for students exhibiting respiratory distress', category: 'Health Room', mandatory: true }
    ],
    transportRule: 'Strict ban on non-BS-VI diesel buses / commercial cabs entering school premises.',
    maskRecommendation: 'Mandatory high-grade respiratory protection (N95) across all school premises.'
  },
  4: {
    stage: 4,
    name: 'GRAP Stage IV — Severe Plus (Hazardous)',
    shortCode: 'GRAP IV',
    color: '#7f1d1d',
    accentColor: 'red',
    badge: 'Code Red Emergency Directive',
    threshold: 'AQI > 450 (Severe+)',
    statutoryOrder: 'CAQM Emergency Powers Act / Lt. Governor Disaster Order',
    schoolMode: '100% Remote / Online (Except Class 10 & 12 Board Prep)',
    overview: 'Hazardous public health emergency. Delhi government directive to close physical schooling across all grades except classes 10 and 12.',
    checklist: [
      { id: 'c4_1', text: 'Enforce 100% Online Learning for all classes (Pre-school to Class 9 & Class 11)', category: 'Emergency', mandatory: true },
      { id: 'c4_2', text: 'Classes 10 & 12 (Board Examinees): Shortened morning-shifted air-filtered sessions', category: 'Academics', mandatory: true },
      { id: 'c4_3', text: 'Allow 50% administrative & teaching staff work-from-home rotation', category: 'Staff', mandatory: true },
      { id: 'c4_4', text: 'Complete shutdown of diesel generator sets and outdoor athletic facilities', category: 'Facilities', mandatory: true },
      { id: 'c4_5', text: 'Immediate SNS / WhatsApp SOS Broadcast with government order PDF link', category: 'Broadcast', mandatory: true },
      { id: 'c4_6', text: 'Special vulnerability check-ins with parents of asthmatic & cardiac-risk students', category: 'Health Room', mandatory: true }
    ],
    transportRule: 'Complete suspension of school transport fleet (except CNG/Electric for Board examinees).',
    maskRecommendation: 'Total outdoor quarantine advisory. Mandatory fitted N95/N99 if stepping outside.'
  }
};

export function getGRAPStage(aqi) {
  if (aqi <= 200) return GRAP_STAGES[0];
  if (aqi <= 300) return GRAP_STAGES[1];
  if (aqi <= 400) return GRAP_STAGES[2];
  if (aqi <= 450) return GRAP_STAGES[3];
  return GRAP_STAGES[4];
}
