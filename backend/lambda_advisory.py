"""
VayuRakshak - AWS Lambda GRAP Advisory & AI Broadcast Generator
AWS Lambda Python 3.12 Handler
Interacts with: Amazon Bedrock (Claude 3 / Titan) + Amazon SNS (Emergency Alerts)
"""

import json
import os
import boto3
from botocore.exceptions import ClientError

SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')
BEDROCK_MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0')

bedrock_runtime = boto3.client('bedrock-runtime', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
sns = boto3.client('sns', region_name=os.environ.get('AWS_REGION', 'us-east-1'))

def generate_ai_advisory(school_name, aqi, grap_stage, dominant_pollutant):
    """
    Call Amazon Bedrock to synthesize customized bilingual circular and principal action plan.
    """
    prompt = f"""You are VayuRakshak AI, an environmental compliance assistant for Delhi-NCR schools.
Generate an official advisory for:
School: {school_name}
Current AQI: {aqi} (CPCB NAQI)
GRAP Stage: Stage {grap_stage}
Dominant Pollutant: {dominant_pollutant}

Provide:
1. Short Principal Executive Summary (2 bullet points)
2. English WhatsApp Broadcast for Parents (clear, polite, with mask & transport instructions)
3. Hindi WhatsApp Broadcast for Parents (हिंदी अनुवाद)

Format output as clean JSON with keys: "executive_summary", "english_broadcast", "hindi_broadcast"."""

    try:
        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }
        
        response = bedrock_runtime.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload)
        )
        response_body = json.loads(response['body'].read().decode('utf-8'))
        raw_text = response_body['content'][0]['text']
        
        # Try to parse JSON from response
        try:
            # Extract JSON block if surrounded by markdown code block
            if "```json" in raw_text:
                json_str = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                json_str = raw_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = raw_text.strip()
            return json.loads(json_str)
        except Exception:
            return {"raw_advisory": raw_text}
            
    except Exception as e:
        print(f"Bedrock invocation fallback: {e}")
        # Deterministic zero-latency fallback template
        return get_fallback_advisory(school_name, aqi, grap_stage)

def get_fallback_advisory(school_name, aqi, grap_stage):
    if grap_stage >= 4:
        en = f"🚨 *EMERGENCY HEALTH DIRECTIVE - {school_name.upper()}*\n\nDear Parents,\nDue to Hazardous AQI ({aqi}) triggering CAQM GRAP Stage IV directives across Delhi-NCR:\n\n1. Physical classes for Nursery to Class 9 & Class 11 are suspended. Online classes will commence tomorrow.\n2. Classes 10 & 12 (Board Examinees) will operate on air-filtered indoor schedule.\n3. Mandatory fitted N95 masks for anyone visiting campus.\n\nStay safe indoors.\n- Principal Office, {school_name}"
        hi = f"🚨 *आपातकालीन स्वास्थ्य निर्देश - {school_name}*\n\nआदरणीय अभिभावक,\nदिल्ली-एनसीआर में वायु गुणवत्ता सूचकांक (AQI {aqi}) के गंभीर स्तर और GRAP स्टेज IV नियमों के तहत:\n\n1. नर्सरी से कक्षा 9 और कक्षा 11 की भौतिक कक्षाएं स्थगित रहेंगी। ऑनलाइन कक्षाएं संचालित होंगी।\n2. कक्षा 10 एवं 12 की कक्षाएं वायु-शोधित कमरों में लगेंगी।\n3. बाहर निकलते समय N95 मास्क अनिवार्य है।\n\n- प्रधानाचार्य कार्यालय, {school_name}"
    elif grap_stage == 3:
        en = f"⚠️ *IMPORTANT AIR QUALITY DIRECTIVE - {school_name.upper()}*\n\nDear Parents,\nWith AQI reaching {aqi} (GRAP Stage III - Severe):\n\n1. Physical classes for Pre-School to Class 5 are shifted to Online mode starting tomorrow.\n2. Classes 6 to 12 will remain in indoors with all outdoor sports and assemblies suspended.\n3. All students must wear N95 masks during transit.\n\n- Principal Office, {school_name}"
        hi = f"⚠️ *महत्वपूर्ण वायु गुणवत्ता निर्देश - {school_name}*\n\nआदरणीय अभिभावक,\nAQI {aqi} (GRAP स्टेज III) के मद्देनज़र:\n\n1. प्री-स्कूल से कक्षा 5 तक की कक्षाएं ऑनलाइन माध्यम से संचालित होंगी।\n2. कक्षा 6 से 12 के छात्रों की सभी बाहरी गतिविधियां व असेंबली स्थगित रहेंगी।\n3. यात्रा के दौरान N95 मास्क अवश्य पहनें।\n\n- प्रधानाचार्य कार्यालय, {school_name}"
    elif grap_stage == 2:
        en = f"📢 *AIR QUALITY NOTICE - {school_name.upper()}*\n\nDear Parents,\nCurrent AQI is {aqi} (GRAP Stage II - Very Poor):\n\n1. All outdoor assemblies and physical sports are completely suspended across all grades.\n2. Classroom HEPA air purifiers are running full-time.\n3. Students are advised to wear N95/FFP2 masks during morning arrival.\n\n- Principal Office, {school_name}"
        hi = f"📢 *वायु गुणवत्ता सूचना - {school_name}*\n\nआदरणीय अभिभावक,\nवर्तमान AQI {aqi} (GRAP स्टेज II) है:\n\n1. सभी कक्षाओं के लिए खेलकूद व सुबह की असेंबली बंद रहेगी।\n2. कक्षाओं में एयर प्यूरीफायर चालू हैं।\n3. सुबह स्कूल आते समय N95 मास्क पहनना उचित है।\n\n- प्रधानाचार्य कार्यालय, {school_name}"
    elif grap_stage == 1:
        en = f"📋 *HEALTH ADVISORY - {school_name.upper()}*\n\nDear Parents,\nAQI is currently {aqi} (GRAP Stage I - Poor):\n\n1. Morning assembly for primary sections will be conducted inside classrooms.\n2. Students with respiratory sensitivities are advised to carry inhalers & wear protective masks.\n\n- Principal Office, {school_name}"
        hi = f"📋 *स्वास्थ्य सलाह - {school_name}*\n\nआदरणीय अभिभावक,\nवर्तमान AQI {aqi} (GRAP स्टेज I) है:\n\n1. प्राथमिक कक्षाओं की सुबह की प्रार्थना कक्षा के भीतर होगी।\n2. संवेदनशील बच्चे मास्क का उपयोग करें।\n\n- प्रधानाचार्य कार्यालय, {school_name}"
    else:
        en = f"🌿 *SCHOOL UPDATE - {school_name.upper()}*\n\nAir quality is Normal (AQI: {aqi}). All regular classes, outdoor sports, and assemblies are proceeding as scheduled."
        hi = f"🌿 *स्कूल सूचना - {school_name}*\n\nवायु गुणवत्ता सामान्य (AQI: {aqi}) है। सभी कक्षाएं और खेलकूद नियमित रूप से जारी हैं।"

    return {
        "executive_summary": [
            f"Active Status: GRAP Stage {grap_stage} Compliance Mandate",
            f"Immediate Action: Enforce student safety guidelines and dispatch parent notifications."
        ],
        "english_broadcast": en,
        "hindi_broadcast": hi
    }

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}')) if isinstance(event.get('body'), str) else event
        school_name = body.get('school_name', 'Delhi Public School')
        aqi = int(body.get('aqi', 345))
        grap_stage = int(body.get('grap_stage', 2))
        dominant_pollutant = body.get('dominant_pollutant', 'PM2.5')

        advisory_result = generate_ai_advisory(school_name, aqi, grap_stage, dominant_pollutant)

        # If Severe or Hazardous (GRAP Stage 3 or 4) and SNS Topic configured, publish SOS alert
        sns_message_id = None
        if grap_stage >= 3 and SNS_TOPIC_ARN:
            try:
                sns_resp = sns.publish(
                    TopicArn=SNS_TOPIC_ARN,
                    Subject=f"🚨 VayuRakshak SOS: GRAP Stage {grap_stage} Alert for {school_name}",
                    Message=f"Emergency Alert: AQI at {school_name} has hit {aqi} ({dominant_pollutant}). Statutory GRAP Stage {grap_stage} enforcement required immediately."
                )
                sns_message_id = sns_resp.get('MessageId')
            except Exception as sns_err:
                print(f"SNS publish error: {sns_err}")

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "status": "success",
                "school_name": school_name,
                "aqi": aqi,
                "grap_stage": grap_stage,
                "advisory": advisory_result,
                "sns_published": sns_message_id is not None,
                "sns_message_id": sns_message_id
            })
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
