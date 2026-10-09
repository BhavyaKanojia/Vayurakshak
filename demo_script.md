# 🎬 VayuRakshak — 3-Minute Demo Video Script
> **Hackathon:** Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)  
> **Duration:** Exactly 3 minutes (180 seconds)  
> **Goal:** Maximum judging score on Innovation, Live Working Demo, and AWS Cloud Architecture.

---

## ⏱️ Timeline & Scene Breakdown

### 🎯 0:00 – 0:35 | Section 1: The Problem & The Delhi-NCR School Crisis
* **Visual on Screen:**
  - Show the VayuRakshak dashboard with Delhi smog context, or show the landing screen with DTU Campus / Anand Vihar selected.
* **Speaker Script:**
  > *"Every winter across Delhi-NCR, toxic smog pushes AQI past 400. Over 1.2 million schoolchildren are exposed to hazardous PM2.5 levels during their morning bus rides and assemblies.*  
  > *Under government regulations, schools must strictly comply with the Graded Response Action Plan (GRAP Stages 1 to 4)—such as halting sports, shifting primary grades online, or banning diesel transport.*  
  > *However, school principals learn about these statutory triggers too late, and calculating compliance while drafting bilingual notices for thousands of anxious parents takes hours.*  
  > *Introducing **VayuRakshak**—an automated, zero-cost, AI-powered GRAP compliance and air quality advisory platform built on AWS serverless."*

---

### 🚀 0:35 – 1:35 | Section 2: Live Product Walkthrough & Real-Time Ingestion
* **Visual on Screen:**
  - Switch between schools (DTU Campus Bawana, Anand Vihar, RK Puram).
  - Point to the animated radial CPCB AQI Gauge and the live telemetry grid ($PM_{2.5}$, $PM_{10}$, $NO_2$, $CO$).
  - Scroll down to the GRAP Action Center showing the active statutory mandate.
  - Check off administrative tasks on the Principal Statutory Compliance Checklist and highlight the progress bar hitting 100%.
  - Point out the 24-Hour diurnal forecast with the morning arrival rush highlighted (07:00 AM – 09:00 AM).
* **Speaker Script:**
  > *"Here is the live VayuRakshak dashboard. We are ingesting real-time Open-Meteo and CPCB station telemetry. For DTU Campus, the Indian NAQI is calculated live at 345, automatically triggering **GRAP Stage II**.*  
  > *The system immediately generates a customized statutory checklist for the school principal—mandating HEPA filter pre-activation, cancellation of outdoor physical assemblies, and staggering bus departures.*  
  > *As administrators complete items, our compliance engine tracks progress in real time.*  
  > *Below, our 24-hour diurnal forecast specifically models early-morning winter inversion peaks to protect students during transit."*

---

### 💬 1:35 – 2:15 | Section 3: Bilingual Parent Notice & Bedrock AI Copilot
* **Visual on Screen:**
  - Click **"Parent Broadcast"** button.
  - Show the live bilingual WhatsApp preview bubble (English + हिंदी).
  - Click "Copy English" or "Copy Hindi", then close.
  - Click **"AI Action Copilot"** to open the Amazon Bedrock assistant.
  - Switch tabs between *Executive Directives*, *Fleet Route*, and *Infirmary Protocols*.
  - Use the **Scenario Simulator** to click **"GRAP IV (Hazardous)"** and demonstrate how the entire platform instantly re-evaluates to Code Red remote schooling.
* **Speaker Script:**
  > *"When emergency mandates hit, communication is critical. With one click on 'Parent Broadcast', VayuRakshak produces ready-to-dispatch, legal WhatsApp and SMS circulars in both English and Hindi.*  
  > *Principals can also consult our **Amazon Bedrock AI Copilot**, which synthesizes tailored advice for bus rerouting and alerts the infirmary to monitor asthmatic students.*  
  > *With our built-in Scenario Simulator, we can test what happens when air quality breaches GRAP Stage IV (AQI 485)—the platform instantly transitions primary grades to 100% virtual mode and prepares emergency broadcasts."*

---

### ☁️ 2:15 – 2:50 | Section 4: 100% Serverless AWS Architecture & Zero Bill Model
* **Visual on Screen:**
  - Switch to the **AWS Cloud** tab.
  - Click on the interactive architecture nodes:
    - *Amazon EventBridge*
    - *AWS Lambda (Ingest Python 3.12)*
    - *Amazon DynamoDB (SchoolAQITelemetry)*
    - *Amazon Bedrock (Claude 3 / Titan)*
    - *Amazon SNS (Emergency Alert Topic)*
    - *AWS Amplify Hosting*
  - Show the Live Payload Inspector and the `template.yaml` SAM configuration.
* **Speaker Script:**
  > *"Under the hood, VayuRakshak is 100% serverless and costs **$0.00 to run** on AWS Free Tier:*  
  > *1. **Amazon EventBridge** triggers a scheduled cron every 15 minutes.*  
  > *2. **AWS Lambda (Python 3.12)** ingests pollutant streams and computes CPCB NAQI breakpoints.*  
  > *3. **Amazon DynamoDB** stores time-series school exposure data.*  
  > *4. **Amazon Bedrock** powers generative synthesis for bilingual advisories.*  
  > *5. **Amazon SNS** dispatches emergency alerts to transport managers.*  
  > *6. The entire frontend is deployed with zero configuration on **AWS Amplify**.*  
  > *Our complete AWS SAM `template.yaml` is open-sourced in our repository for instant deployment."*

---

### 🏁 2:50 – 3:00 | Section 5: Real-World Impact & Conclusion
* **Visual on Screen:**
  - Switch back to the main dashboard.
  - Show the 100% Compliant badge and closing slide.
* **Speaker Script:**
  > *"VayuRakshak empowers 5,000+ schools across North India to safeguard children from toxic air without spending a single rupee on infrastructure.*  
  > *Thank you, WeMakeDevs and AWS, for organizing the Bharat Builds Tour!"*

---

## 💡 Top Tips for the Recording

1. **Resolution:** Record in 1080p (1920x1080) at 60 FPS using OBS Studio, Loom, or Windows Game Bar (`Win + G`).
2. **Audio:** Speak clearly with a good microphone; keep the tone energetic and confident.
3. **Pacing:** Keep cursor movements smooth and deliberate.
4. **Link in Description:** Include the live deployed URL and the GitHub repo link in the video description.
