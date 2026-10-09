/**
 * CPCB Indian National Air Quality Index (NAQI) Breakpoint Calculator
 * Formulated per Central Pollution Control Board (Ministry of Environment, Forest & CC)
 */

export function calculateSubIndex(concentration, breakpoints) {
  if (concentration == null || isNaN(concentration) || concentration < 0) return null;
  
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const { cLow, cHigh, iLow, iHigh } = bp;
      return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (concentration - cLow) + iLow);
    }
  }

  // Above max breakpoint
  const last = breakpoints[breakpoints.length - 1];
  if (concentration > last.cHigh) {
    return 500;
  }
  return 0;
}

const PM25_BREAKPOINTS = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 251, cHigh: 380, iLow: 401, iHigh: 450 },
  { cLow: 381, cHigh: 800, iLow: 451, iHigh: 500 },
];

const PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 431, cHigh: 800, iLow: 401, iHigh: 500 },
];

const NO2_BREAKPOINTS = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
  { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
  { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
  { cLow: 401, cHigh: 1000, iLow: 401, iHigh: 500 },
];

const CO_BREAKPOINTS = [
  { cLow: 0, cHigh: 1.0, iLow: 0, iHigh: 50 },
  { cLow: 1.1, cHigh: 2.0, iLow: 51, iHigh: 100 },
  { cLow: 2.1, cHigh: 10.0, iLow: 101, iHigh: 200 },
  { cLow: 10.1, cHigh: 17.0, iLow: 201, iHigh: 300 },
  { cLow: 17.1, cHigh: 34.0, iLow: 301, iHigh: 400 },
  { cLow: 34.1, cHigh: 60.0, iLow: 401, iHigh: 500 },
];

export function calculateCPCB_NAQI({ pm2_5, pm10, no2, co }) {
  const pm25Idx = calculateSubIndex(pm2_5, PM25_BREAKPOINTS);
  const pm10Idx = calculateSubIndex(pm10, PM10_BREAKPOINTS);
  const no2Idx = calculateSubIndex(no2, NO2_BREAKPOINTS);
  const coIdx = calculateSubIndex(co, CO_BREAKPOINTS);

  const validIndices = [
    { name: 'PM2.5', value: pm25Idx, concentration: pm2_5, unit: 'µg/m³' },
    { name: 'PM10', value: pm10Idx, concentration: pm10, unit: 'µg/m³' },
    { name: 'NO₂', value: no2Idx, concentration: no2, unit: 'µg/m³' },
    { name: 'CO', value: coIdx, concentration: co, unit: 'mg/m³' },
  ].filter(item => item.value !== null);

  if (validIndices.length === 0) {
    return { aqi: 0, dominantPollutant: 'None', category: getCategory(0), subIndices: [] };
  }

  // Overall AQI is the maximum of the sub-indices (as per CPCB protocol)
  let maxItem = validIndices[0];
  for (const item of validIndices) {
    if (item.value > maxItem.value) {
      maxItem = item;
    }
  }

  const aqi = maxItem.value;
  return {
    aqi,
    dominantPollutant: maxItem.name,
    category: getCategory(aqi),
    subIndices: validIndices,
  };
}

export function getCategory(aqi) {
  if (aqi <= 50) {
    return {
      label: 'Good',
      hindiLabel: 'अच्छा',
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.2)',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      description: 'Minimal impact. Ideal conditions for outdoor activities and assemblies.',
      grapStage: null,
    };
  } else if (aqi <= 100) {
    return {
      label: 'Satisfactory',
      hindiLabel: 'संतोषजनक',
      color: '#84cc16',
      bgGlow: 'rgba(132, 204, 22, 0.2)',
      textColor: 'text-lime-400',
      badgeBg: 'bg-lime-500/15 border-lime-500/40 text-lime-300',
      description: 'Minor breathing discomfort to sensitive children with asthma.',
      grapStage: null,
    };
  } else if (aqi <= 200) {
    return {
      label: 'Moderate',
      hindiLabel: 'मध्यम',
      color: '#eab308',
      bgGlow: 'rgba(234, 179, 8, 0.2)',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      description: 'Breathing discomfort to children with lungs/heart conditions.',
      grapStage: null,
    };
  } else if (aqi <= 300) {
    return {
      label: 'Poor',
      hindiLabel: 'खराब',
      color: '#f97316',
      bgGlow: 'rgba(249, 115, 22, 0.25)',
      textColor: 'text-orange-400',
      badgeBg: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
      description: 'Breathing discomfort on prolonged exposure. Triggers GRAP Stage I.',
      grapStage: 1,
    };
  } else if (aqi <= 400) {
    return {
      label: 'Very Poor',
      hindiLabel: 'बहुत खराब',
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.3)',
      textColor: 'text-red-400',
      badgeBg: 'bg-red-500/20 border-red-500/50 text-red-300',
      description: 'Respiratory illness on prolonged exposure. Triggers GRAP Stage II.',
      grapStage: 2,
    };
  } else if (aqi <= 450) {
    return {
      label: 'Severe',
      hindiLabel: 'गंभीर',
      color: '#b91c1c',
      bgGlow: 'rgba(185, 28, 28, 0.35)',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/25 border-rose-500/60 text-rose-200',
      description: 'Healthy children affected; serious impacts on vulnerable. Triggers GRAP Stage III.',
      grapStage: 3,
    };
  } else {
    return {
      label: 'Severe Plus (Hazardous)',
      hindiLabel: 'अति गंभीर (आपातकालीन)',
      color: '#7f1d1d',
      bgGlow: 'rgba(127, 29, 29, 0.45)',
      textColor: 'text-rose-300',
      badgeBg: 'bg-red-950/80 border-red-600 text-rose-200',
      description: 'Emergency public health condition. Triggers GRAP Stage IV statutory directives.',
      grapStage: 4,
    };
  }
}
