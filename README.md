# 🛡️ VayuRakshak (वायू रक्षक)
### AI-Powered Automated School GRAP Compliance & Real-Time Air Quality Advisory Platform

> **Event:** Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)  
> **Track:** Track 01 — Air (Pollution, exposure, and bad AQI days)  
> **Target Region:** Delhi-NCR (5,000+ Schools & 1.2M+ Students)  
> **Cost Model:** 100% Free Tier (Zero Bill, Serverless AWS Architecture)  

---

## 📌 Executive Summary & Problem Context

During the winter smog months in Delhi-NCR, fine particulate pollution ($PM_{2.5}$ & $PM_{10}$) frequently breaches **400+ AQI (Severe / Hazardous)** due to stubble burning, nocturnal thermal inversions, and vehicular congestion. 

### The School Principal's Dilemma
1. **Late Notifications:** School administrators typically learn of severe statutory GRAP (Graded Response Action Plan) triggers late at night or during morning rush hour, after school buses have already departed.
2. **Exposure at Peak Hours:** Morning assemblies (07:30 AM – 08:30 AM) coincide precisely with the diurnal smog peak.
3. **Parent Panic & Confusion:** Crafting official, bilingual (English & Hindi) WhatsApp circulars explaining hybrid closures, diesel bus restrictions, and N95 mandates takes hours of manual effort.

**VayuRakshak** automates the entire loop: from live $PM_{2.5}$ sensor ingestion to statutory CAQM GRAP stage determination, administrative action checklists, and instant bilingual parent circular generation powered by **Amazon Bedrock AI**.

---

## ✨ Core Features & Platform Highlights

- ⚡ **Real-Time Air Quality Telemetry & Indian NAQI Engine:**
  - Direct integration with Open-Meteo Air Quality feeds and CPCB CAAQMS monitoring stations across Delhi-NCR (DTU Bawana, Anand Vihar, RK Puram, ITO, Noida Sector 62, Gurugram).
  - Exact CPCB NAQI Breakpoint algorithms calculating sub-indices for $PM_{2.5}$, $PM_{10}$, $NO_2$, and $CO$.

- 🏛️ **Automated CAQM GRAP Regulatory Engine (Stages I – IV):**
  - **GRAP I (AQI 201–300):** Primary assembly indoor shift, water sprinkling protocols, emergency nebulizer readiness.
  - **GRAP II (AQI 301–400):** Complete ban on outdoor sports across all grades (1–12), classroom HEPA pre-running, diesel generator ban.
  - **GRAP III (AQI 401–450):** Statutory mandate for Pre-School to Class 5 online mode, BS-III/IV diesel vehicle ban on campus.
  - **GRAP IV (AQI >450):** Code Red full closure/hybrid operation across all grades (except board examinees).

- 📋 **Interactive School Compliance Checklist:**
  - Real-time progress bar for principals and administrators with legal mandate badges and category filters.

- 📈 **24-Hour Diurnal Forecast & Transit Rush Analyzer:**
  - Visual timeline highlighting student morning arrival (07:00 AM – 09:00 AM) and afternoon dispersal (01:00 PM – 03:00 PM).

- 💬 **Instant Bilingual Parent Broadcast Engine (English & Hindi):**
  - Ready-to-copy WhatsApp/SMS broadcasts in English and हिंदी with one-click clipboard copying and direct WhatsApp Web dispatch.

- 🤖 **Amazon Bedrock AI Principal Copilot:**
  - Synthesizes contextual legal summaries, bus fleet rerouting orders, and medical screening directives using Claude 3 / Amazon Titan.

- 🎮 **Evaluation Scenario Simulator (Time Travel):**
  - Instant testing presets for Normal (AQI 75), GRAP I (245), GRAP II (345), GRAP III (425), and GRAP IV (485) plus custom sliders.

---

## 🏗️ 100% Serverless AWS Cloud Architecture

```
                 [Open-Meteo & CPCB Stations]
                              │
                              ▼ (Every 15 mins)
                    [Amazon EventBridge]
                              │
                              ▼
            [AWS Lambda: Telemetry Ingest (Python 3.12)]
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    [Amazon DynamoDB]            [AWS Lambda: GRAP & AI Advisory]
 (SchoolAQITelemetry Table)                   │
                                ┌─────────────┴─────────────┐
                                ▼                           ▼
                      [Amazon Bedrock]              [Amazon SNS]
                   (Claude 3 Haiku / Titan)     (Emergency Alerts)
                                │
                                ▼
              [VayuRakshak Dashboard on AWS Amplify]
```

### Free Tier Breakdown ($0.00 / Month)
| AWS Service | Usage in VayuRakshak | Free Tier Limit |
|---|---|---|
| **AWS Lambda** | 15-min scheduled ingestion & advisory API | 1,000,000 requests/month (Always Free) |
| **Amazon DynamoDB** | Time-series school telemetry | 25 GB storage (Always Free) |
| **Amazon EventBridge** | 15-minute cron triggers | 1,000,000 events/month (Always Free) |
| **Amazon SNS** | Emergency SMS/Email broadcast topics | 1,000,000 publishes/month (Always Free) |
| **AWS Amplify Hosting** | Production React Single-Page App | 1,000 build minutes/month |

---

## 📂 Project Structure

```
vayurakshak/
├── backend/
│   ├── lambda_ingest.py         # Ingests Open-Meteo/CPCB data, computes CPCB NAQI, writes to DynamoDB
│   ├── lambda_advisory.py       # Evaluates GRAP stage, invokes Amazon Bedrock, publishes SNS alerts
│   ├── requirements.txt         # boto3, botocore, urllib3
│   └── dynamodb_schema.json     # Table schema definition
├── src/
│   ├── components/
│   │   ├── Header.jsx           # School selector, sync triggers, navigation tabs
│   │   ├── AQIGauge.jsx         # Radial animated gauge & pollutant telemetry grid
│   │   ├── GRAPActionCenter.jsx # Dynamic CAQM GRAP stage & compliance checklist
│   │   ├── HourlyForecast.jsx   # 24-hour diurnal trend with rush hour highlights
│   │   ├── BroadcastGenerator.jsx # Bilingual (EN+HI) WhatsApp notice dispatcher
│   │   ├── BedrockAIAssistant.jsx # Amazon Bedrock AI Principal Copilot modal
│   │   ├── ScenarioSimulator.jsx # GRAP Stage I–IV test scenario injector
│   │   ├── HealthVulnerability.jsx # Pediatric & asthmatic vulnerability matrix
│   │   ├── SchoolDirectory.jsx  # Monitored schools overview across Delhi-NCR
│   │   └── AWSArchitecture.jsx  # Interactive cloud architecture explorer & payload inspector
│   ├── services/
│   │   ├── aqiService.js        # Open-Meteo real-time API integration
│   │   ├── cpcbCalculator.js    # CPCB NAQI Indian standard breakpoint algorithms
│   │   ├── grapRules.js         # CAQM Delhi-NCR GRAP statutory guidelines database
│   │   └── schoolsData.js       # Pre-configured Delhi-NCR schools & coordinates
│   ├── App.jsx                  # Main application orchestrator
│   ├── main.jsx                 # Entrypoint
│   └── index.css                # Polished design system tokens
├── template.yaml                # AWS SAM Infrastructure-as-Code template
├── demo_script.md               # 3-minute video presentation script
├── package.json
└── vite.config.js
```

---

## 🚀 Quickstart & Local Development

### 1. Run the Frontend Dashboard
```bash
# Clone the repository
git clone https://github.com/your-username/vayurakshak.git
cd vayurakshak

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Deploy AWS Cloud Infrastructure (SAM)
```bash
# Build SAM serverless artifacts
sam build

# Deploy to your AWS account (Guided)
sam deploy --guided
```

---

## 📜 Official Statutory Standards Implemented

- **CPCB NAQI (National Air Quality Index):** Formulated under the Central Pollution Control Board (Ministry of Environment, Forest and Climate Change, Govt of India).
- **CAQM GRAP (Graded Response Action Plan):** Commission for Air Quality Management in National Capital Region and Adjoining Areas (Stages I, II, III, IV).
- **Directorate of Education, GNCTD:** SOP for bad air quality days and school emergency directives.

---

## 👥 Hackathon Team & Acknowledgements

- **Event:** Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)
- **Built With:** AWS Lambda, Amazon DynamoDB, Amazon Bedrock, Amazon SNS, AWS Amplify, React, Vite, Open-Meteo, Tailwind CSS.
