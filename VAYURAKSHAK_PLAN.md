# 🛡️ VayuRakshak — 1-Day Hackathon Implementation Masterplan
> **Event:** Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)  
> **Track:** Track 01 — Air (Pollution, exposure, and bad AQI days)  
> **Goal:** 1-Day End-to-End Build, Zero-Cost Deployment, and Winning Demo Video

---

## 📋 1-Day Execution Phases

- **Phase 1: Architecture & Data Pipeline**
  - Integrate free real-time PM2.5/AQI feeds for Delhi-NCR schools.
  - Set up AWS Lambda ingestion handler and DynamoDB schema.

- **Phase 2: GRAP Regulatory Logic Engine**
  - Implement automated compliance logic mapping live AQI to Delhi-NCR GRAP Stages I – IV.
  - Generate school-specific operational checklists and safety directives.

- **Phase 3: Interactive Dashboard UI**
  - Build single-page responsive dashboard (React + Tailwind).
  - Add live AQI gauge, hourly forecast chart, and bilingual WhatsApp broadcast generator.

- **Phase 4: Free Cloud Deployment & Repository Setup**
  - Deploy frontend to a live public HTTPS URL on AWS Amplify or Vercel.
  - Structure public GitHub repository with `README.md` and AWS SAM `template.yaml`.

- **Phase 5: Demo Video Recording & Submission**
  - Record the 3-minute video covering the problem, live working prototype, and AWS architecture.
  - Submit the project on the hackathon portal.

---

## 💰 100% Free Tech Stack (Zero Bill, Zero Credit Card Spend)

- **Air Quality Feeds:** Open-Meteo Air Quality API (10,000 requests/day, free, **no API key needed**) + OpenAQ CPCB stations.
- **Compute (Backend):** AWS Lambda (Python 3.12) — 1,000,000 free requests/month (Always Free tier).
- **Database:** Amazon DynamoDB — 25 GB free storage (Always Free tier).
- **Cron Trigger:** Amazon EventBridge — Free recurring scheduler.
- **AI Action Engine:** Amazon Bedrock / Claude 3 (covered by AWS trial credits or built-in fallback prompt engine).
- **Hosting:** AWS Amplify Hosting or Vercel (Free tier, instant public HTTPS link).
- **Local Dev / Testing:** LocalStack or standard Node/Python environment.

---

## 🏗️ System Architecture

```
[Open-Meteo / CPCB API] (Free Live Air Feeds)
          │
          ▼ (Scheduled EventBridge Trigger)
  [AWS Lambda: Ingest Engine]
          │
          ├──► [Amazon DynamoDB: Historical School Telemetry]
          │
          ▼ (Threshold Evaluation)
  [AWS Lambda: GRAP Compliance & Advisory Engine]
          │
          ├──► [Amazon Bedrock: Action Directives & Bilingual Parent Notices]
          │
          ▼
  [Amazon SNS / Notification Mock Engine]
          │
          ▼
  [VayuRakshak Dashboard (React + Tailwind on AWS Amplify)]
```

---

## 🛠️ Step-by-Step Implementation Guide

### Step 1: Real-time AQI Ingestion Pipeline
- **Monitored Coordinates in Delhi-NCR:**
  - DTU Campus (Bawana): `lat=28.7495, lon=77.1184`
  - Anand Vihar (High Risk Industrial/Traffic): `lat=28.6469, lon=77.3160`
  - R.K. Puram (South Delhi): `lat=28.5665, lon=77.1767`
- **Open-Meteo Free API Endpoint:**
  ```text
  https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.7495&longitude=77.1184&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide&hourly=pm2_5,pm10&forecast_days=1&timezone=Asia%2FKolkata
  ```
- **CPCB NAQI Indian Standard Formula (PM2.5 in µg/m³):**
  - 0 – 30: Good (0 – 50)
  - 31 – 60: Satisfactory (51 – 100)
  - 61 – 90: Moderate (101 – 200)
  - 91 – 120: Poor (201 – 300) ➔ **Triggers GRAP I**
  - 121 – 250: Very Poor (301 – 400) ➔ **Triggers GRAP II**
  - 251 – 380: Severe (401 – 450) ➔ **Triggers GRAP III**
  - 380+: Severe Plus (450 – 500) ➔ **Triggers GRAP IV**

---

### Step 2: GRAP Regulatory Compliance Rules
Map detected AQI directly to mandatory Delhi statutory actions:

- **GRAP I (AQI 201–300):**
  - Cancel primary class morning assembly & outdoor physical education.
  - Sprinkle water within the school perimeter to suppress dust.
  - Recommend N95 masks for children with respiratory histories.
- **GRAP II (AQI 301–400):**
  - Complete ban on outdoor activities across all grades (Class 1 to 12).
  - Pre-run classroom HEPA filtration units before student arrival.
  - Strict campus ban on diesel generator usage.
  - Stagger bus departures to prevent exhaust accumulation at gates.
- **GRAP III (AQI 401–450):**
  - Statutory advisory: Transition primary classes (Pre-school to Class 5) to online mode.
  - Ban entry of non-BS-VI diesel transport vehicles on campus grounds.
- **GRAP IV (AQI >450 - Severe+):**
  - Recommend full hybrid/remote school operations across all grades.
  - Emergency advisory for vulnerable students & staff.

---

### Step 3: Frontend Dashboard Components
Build a clean, dark-mode, responsive single-page application:
1. **Header & School Selector:** Dropdown to switch between schools (DTU, Anand Vihar, RK Puram).
2. **Current AQI Gauge & Gas Telemetry:** Prominent numerical AQI dial, color-coded badge, and metrics for PM2.5, PM10, and NO2.
3. **GRAP Action Center:** Active legal stage alert banner + dynamic interactive checklist for school administrators.
4. **12-Hour Hourly Trend:** Visual bar/line chart highlighting critical morning school hours.
5. **Parent Broadcast Generator:** Modal generating ready-to-copy WhatsApp/SMS text in English and Hindi.
6. **Architecture Inspector:** Embedded section showing the AWS Cloud architecture diagram to impress judges.

---

### Step 4: AWS Infrastructure as Code (`template.yaml`)
Include an AWS SAM template in the repository to satisfy the "Built on AWS" judging requirement:
- Resource 1: `SchoolAQITable` (`AWS::DynamoDB::Table`)
- Resource 2: `AQIIngestionFunction` (`AWS::Serverless::Function` with recurring cron schedule)
- Resource 3: `AdvisoryGeneratorFunction` (`AWS::Serverless::Function` for Bedrock AI processing)
- Resource 4: `EmergencyAlertTopic` (`AWS::SNS::Topic`)

---

## 🎬 3-Minute Demo Video Script (100% of Judging Score)

> ⚠️ *Hackathon Rule: There is no live demo. Judges only evaluate what is in the 3-minute video.*

- **Section 1: The Problem & Persona**
  - Open with Delhi smog context.
  - State the problem: School principals learn about toxic air spikes too late, exposing children during morning assembly and transit.
- **Section 2: The Live Product Walkthrough**
  - Show the live website URL.
  - Select DTU Campus / Anand Vihar.
  - Show how live PM2.5 data instantly updates the AQI dial and calculates the GRAP stage.
  - Demonstrate checking off administrative tasks (air filters scheduled, sports cancelled).
  - Click "Generate Parent Broadcast" and show the formatted bilingual WhatsApp notice.
- **Section 3: AWS Cloud Architecture Proof**
  - Show the architecture diagram slide or code repository.
  - Clearly explain:
    - *EventBridge* handles automated scheduling.
    - *AWS Lambda* runs the ingestion & GRAP logic.
    - *DynamoDB* stores telemetry.
    - *Amazon Bedrock* powers the advisory synthesis.
    - *AWS Amplify* hosts the production web application.
- **Section 4: Real-World Impact**
  - Explain how this can be deployed across 5,000+ schools in North India with near-zero operating costs.

---

## 📤 Final Submission Checklist
- [ ] Working public GitHub repository with comprehensive `README.md`.
- [ ] AWS SAM `template.yaml` and Lambda handlers in the repository.
- [ ] Live deployed web URL on AWS Amplify / Vercel.
- [ ] 3-Minute recorded video uploaded to YouTube (Unlisted) or Loom.
- [ ] Submitted on WeMakeDevs before the deadline.
