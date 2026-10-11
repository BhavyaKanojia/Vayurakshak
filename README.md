# 🛡️ VayuRakshak (वायू रक्षक)
### AI-Powered Automated School GRAP Compliance & Real-Time Air Quality Advisory Platform

> **Event:** Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)  
> **Track:** Track 01 — Air (Pollution, exposure, and bad AQI days)  
> **Target Region:** Delhi-NCR (5,000+ Schools & 1.2M+ Students)  
> **Cost Model:** 100% Free Tier (Zero Bill, Serverless AWS Architecture)  
> **Design Theme:** Modern High-Contrast Light / White Theme  

---

## 📌 Executive Summary & Problem Context

During the winter smog months in Delhi-NCR, fine particulate pollution ($PM_{2.5}$ & $PM_{10}$) frequently breaches **400+ AQI (Severe / Hazardous)** due to agricultural stubble burning, nocturnal thermal inversions, and vehicular congestion. 

### The School Principal's Dilemma
1. **Late Notifications:** School administrators typically learn of severe statutory GRAP (Graded Response Action Plan) triggers late at night or during morning rush hour, after school buses have already departed.
2. **Exposure at Peak Hours:** Morning assemblies (07:30 AM – 08:30 AM) coincide precisely with the diurnal smog peak.
3. **Legal Penal Liability:** Under Section 15 of the Environment (Protection) Act, 1986, school leadership faces personal penal liability for conducting outdoor assemblies during statutory bans.
4. **Parent Panic & Confusion:** Crafting official, bilingual (English & Hindi) WhatsApp circulars explaining hybrid closures, diesel bus restrictions, and N95 mandates takes hours of manual effort.

**VayuRakshak** automates the entire loop: from live $PM_{2.5}$ sensor ingestion to statutory CAQM GRAP stage determination, administrative action checklists, official letterhead circular generation, and instant bilingual parent broadcasts powered by **Amazon Bedrock** and **Groq LLaMA 3.3 AI**.

---

## ✨ Core Features & Platform Highlights

- ⚡ **Real-Time Air Quality Telemetry & Indian NAQI Engine:**
  - Direct integration with Open-Meteo Air Quality feeds and CPCB CAAQMS monitoring stations across Delhi-NCR (DTU Bawana, Anand Vihar, RK Puram, ITO, Noida Sector 62, Gurugram).
  - Exact CPCB NAQI Breakpoint algorithms calculating sub-indices for $PM_{2.5}$, $PM_{10}$, $NO_2$, $CO$, $SO_2$, and $O_3$.

- 🗺️ **Interactive Delhi-NCR AQI Geo-Map & Inversion Heatmap:**
  - Geographic spatial canvas plotting monitored campuses across Delhi, Noida, and Gurugram with topological landmarks (Yamuna River corridor).
  - Real-time pulsing radar pins color-coded to CPCB NAQI stages.
  - Interactive **Smog Inversion Plume Layer** demonstrating localized thermal trapping at pollution choke points (Anand Vihar, Bawana industrial nexus).

- 🏛️ **Automated CAQM GRAP Regulatory Engine (Stages I – IV):**
  - **GRAP I (AQI 201–300):** Primary assembly indoor shift, water sprinkling protocols, emergency nebulizer readiness.
  - **GRAP II (AQI 301–400):** Complete ban on outdoor sports across all grades (1–12), classroom HEPA pre-running, diesel generator ban.
  - **GRAP III (AQI 401–450):** Statutory mandate for Pre-School to Class 5 online mode, BS-III/IV diesel vehicle ban on campus.
  - **GRAP IV (AQI >450):** Code Red full closure/hybrid operation across all grades (except board examinees).

- 📄 **Official PDF Statutory Letterhead Circular Generator:**
  - Generates formal printable school letterheads complete with school emblem, statutory circular reference number (`VR/DOE/2026/GRAP-X`), CAQM Act 2021 order citations, and principal signature block.
  - 1-click **"Print / Save as PDF"** formatted with custom `@media print` CSS for inspection audits.

- 🏆 **CAQM Statutory Compliance Audit Certificate:**
  - Generates a formal, tamper-evident audit certificate once leadership checks off all compliance directives.
  - Provides documented verification records with station telemetry hashes and timestamps for State Directorate of Education inspectors.

- 🔊 **Live Campus PA & Phone IVR Voice Broadcast Engine:**
  - Integrated speech synthesis engine (Web Speech API / simulated AWS Polly) delivering measured, authoritative public address announcements.
  - Instant bilingual playback in **English** and **हिन्दी** with real-time waveform visualizers.

- 🚌 **Staggered Bus Fleet Dispersal Scheduler:**
  - Interactive anti-idling mitigation scheduler for campus transport fleets (Primary at 01:15 PM, Middle at 01:45 PM, Senior at 02:15 PM).
  - Enforces 0-minute engine idling compliance across bus bays to eliminate toxic exhaust accumulation.

- 🤖 **Amazon Bedrock + Groq LLaMA 3.3 AI Copilot (Dual Engine):**
  - Synthesizes contextual legal summaries, fleet rerouting orders, and medical screening directives.
  - Client-side Groq API integration (`llama-3.3-70b-versatile`) with secure local storage key management and offline fallback to AWS Bedrock knowledge base.
  - Built-in audio briefing player for spoken legal advisories.

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
| **Amazon DynamoDB** | Time-series school telemetry table | 25 GB storage (Always Free) |
| **Amazon EventBridge** | 15-minute cron triggers | 1,000,000 events/month (Always Free) |
| **Amazon SNS** | Emergency SMS/Email broadcast topics | 1,000,000 publishes/month (Always Free) |
| **AWS Amplify Hosting** | Production React Single-Page App | 1,000 build minutes/month |

---

## 📂 Project Structure

```
vayurakshak/
├── backend/
│   ├── lambda_ingest.py            # Ingests Open-Meteo/CPCB data, computes CPCB NAQI, writes to DynamoDB
│   ├── lambda_advisory.py          # Evaluates GRAP stage, invokes Amazon Bedrock, publishes SNS alerts
│   ├── requirements.txt            # boto3, botocore, urllib3
│   └── dynamodb_schema.json        # Table schema definition
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Campus selector, sync triggers, navigation tabs
│   │   ├── AQIGauge.jsx            # Radial dial gauge & 6-pollutant telemetry grid
│   │   ├── GRAPActionCenter.jsx    # CAQM GRAP stage hero, compliance checklist & bus scheduler
│   │   ├── HourlyForecast.jsx      # 24-hour diurnal trend with rush hour transit highlights
│   │   ├── BroadcastGenerator.jsx  # Bilingual WhatsApp notice dispatcher with speech synthesis
│   │   ├── BedrockAIAssistant.jsx  # Amazon Bedrock & Groq LLaMA 3.3 AI Copilot modal
│   │   ├── OfficialCircularModal.jsx # Formal printable school letterhead circular with PDF export
│   │   ├── ComplianceCertificateModal.jsx # 100% CAQM Statutory Compliance Audit Certificate
│   │   ├── ScenarioSimulator.jsx   # GRAP Stage I–IV test scenario injector
│   │   ├── HealthVulnerability.jsx # Pediatric & asthmatic vulnerability matrix
│   │   ├── SchoolDirectory.jsx     # Interactive Delhi-NCR Geo-Map & campus directory
│   │   └── AWSArchitecture.jsx     # Interactive cloud architecture explorer & payload inspector
│   ├── services/
│   │   ├── aqiService.js           # Open-Meteo real-time API integration
│   │   ├── cpcbCalculator.js       # CPCB NAQI Indian standard breakpoint algorithms
│   │   ├── grapRules.js            # CAQM Delhi-NCR GRAP statutory guidelines database
│   │   ├── schoolsData.js          # Pre-configured Delhi-NCR schools & coordinates
│   │   ├── groqService.js          # Real-time Groq LLaMA 3.3 AI generation service
│   │   └── audioService.js         # Web Speech API speech synthesis for school PA alerts
│   ├── App.jsx                     # Main application orchestrator
│   ├── main.jsx                    # Entrypoint
│   └── index.css                   # Modern white theme design system tokens & print styles
├── template.yaml                   # AWS SAM Infrastructure-as-Code template
├── demo_script.md                  # 3-minute video presentation script
├── package.json
└── vite.config.js
```

---

## 🚀 Quickstart & Local Development

### 1. Run the Frontend Dashboard
```bash
# Clone the repository
git clone https://github.com/BhavyaKanojia/Vayurakshak.git
cd Vayurakshak

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **💡 Optional — Live Groq LLaMA 3.3 Copilot:**  
> Click the **🤖 AI Copilot** button in the dashboard navigation and enter your Groq API key (from [console.groq.com](https://console.groq.com)) into the settings drawer. It is stored securely on client-side `localStorage`. If left blank, the app seamlessly runs using the built-in AWS Bedrock regulatory knowledge base.

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
- **Environment (Protection) Act, 1986:** Section 15 statutory penal compliance verification.

---

## 👥 Hackathon Team & Collaborators

- **Abhinav Singh** ([@abhinavsinghcs27](https://github.com/abhinavsinghcs27))
- **Bhavya Kanojia** ([@BhavyaKanojia](https://github.com/BhavyaKanojia))

> **Event:** Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)  
> **Built With:** AWS Lambda, Amazon DynamoDB, Amazon Bedrock, Amazon SNS, AWS Amplify, Groq LLaMA 3.3, React, Vite, Vanilla CSS Design System, Web Speech API, Open-Meteo, CPCB CAAQMS.
