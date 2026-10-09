"""
VayuRakshak - AWS Lambda Air Quality Ingestion Pipeline
AWS Lambda Python 3.12 Handler
Triggered via: Amazon EventBridge (cron every 15 minutes)
Outputs to: Amazon DynamoDB (SchoolAQITelemetry)
"""

import json
import os
import urllib.request
import urllib.error
from datetime import datetime, timezone
import boto3

# Initialize DynamoDB resource
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'SchoolAQITelemetry')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(DYNAMODB_TABLE)

DELHI_SCHOOLS = [
    {"school_id": "dtu-bawana", "name": "DTU Campus School", "lat": 28.7495, "lon": 77.1184},
    {"school_id": "anand-vihar", "name": "DAV Anand Vihar", "lat": 28.6469, "lon": 77.3160},
    {"school_id": "rk-puram", "name": "DPS R.K. Puram", "lat": 28.5665, "lon": 77.1767},
    {"school_id": "ito-delhi", "name": "Bal Bharati ITO", "lat": 28.6328, "lon": 77.2407},
    {"school_id": "noida-sec62", "name": "DPS Noida Sec 62", "lat": 28.6180, "lon": 77.3639},
    {"school_id": "gurugram-cyber", "name": "Heritage Gurugram", "lat": 28.4595, "lon": 77.0266}
]

def calculate_cpcb_subindex(conc, breakpoints):
    if conc is None or conc < 0:
        return 0
    for bp in breakpoints:
        c_low, c_high, i_low, i_high = bp
        if c_low <= conc <= c_high:
            return round(((i_high - i_low) / (c_high - c_low)) * (conc - c_low) + i_low)
    return 500

def get_cpcb_naqi(pm2_5, pm10, no2, co):
    pm25_bp = [
        (0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200),
        (91, 120, 201, 300), (121, 250, 301, 400), (251, 380, 401, 450), (381, 800, 451, 500)
    ]
    pm10_bp = [
        (0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200),
        (251, 350, 201, 300), (351, 430, 301, 400), (431, 800, 401, 500)
    ]
    no2_bp = [
        (0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200),
        (181, 280, 201, 300), (281, 400, 301, 400), (401, 1000, 401, 500)
    ]
    co_bp = [
        (0, 1.0, 0, 50), (1.1, 2.0, 51, 100), (2.1, 10.0, 101, 200),
        (10.1, 17.0, 201, 300), (17.1, 34.0, 301, 400), (34.1, 60.0, 401, 500)
    ]

    i_pm25 = calculate_cpcb_subindex(pm2_5, pm25_bp)
    i_pm10 = calculate_cpcb_subindex(pm10, pm10_bp)
    i_no2 = calculate_cpcb_subindex(no2, no2_bp)
    i_co = calculate_cpcb_subindex(co, co_bp)

    sub_indices = {"PM2.5": i_pm25, "PM10": i_pm10, "NO2": i_no2, "CO": i_co}
    overall_aqi = max(sub_indices.values())
    dominant = max(sub_indices, key=sub_indices.get)
    return overall_aqi, dominant, sub_indices

def get_grap_stage(aqi):
    if aqi <= 200:
        return 0, "Normal"
    elif aqi <= 300:
        return 1, "GRAP Stage I (Poor)"
    elif aqi <= 400:
        return 2, "GRAP Stage II (Very Poor)"
    elif aqi <= 450:
        return 3, "GRAP Stage III (Severe)"
    else:
        return 4, "GRAP Stage IV (Severe+ Hazardous)"

def fetch_open_meteo(lat, lon):
    url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=Asia%2FKolkata"
    req = urllib.request.Request(url, headers={'User-Agent': 'VayuRakshak-AWS-Lambda/1.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        current = data.get('current', {})
        pm2_5 = current.get('pm2_5', 120)
        pm10 = current.get('pm10', 210)
        no2 = current.get('nitrogen_dioxide', 45)
        raw_co = current.get('carbon_monoxide', 1500)
        co = round(raw_co / 1000.0, 2) if raw_co else 1.5
        so2 = current.get('sulphur_dioxide', 10)
        o3 = current.get('ozone', 30)
        return {
            "pm2_5": pm2_5,
            "pm10": pm10,
            "no2": no2,
            "co": co,
            "so2": so2,
            "o3": o3
        }

def lambda_handler(event, context):
    timestamp_utc = datetime.now(timezone.utc).isoformat()
    processed_schools = []

    for school in DELHI_SCHOOLS:
        try:
            telemetry = fetch_open_meteo(school["lat"], school["lon"])
            aqi, dominant, sub_indices = get_cpcb_naqi(
                telemetry["pm2_5"],
                telemetry["pm10"],
                telemetry["no2"],
                telemetry["co"]
            )
            grap_stage, grap_name = get_grap_stage(aqi)

            item = {
                "school_id": school["school_id"],
                "timestamp": timestamp_utc,
                "school_name": school["name"],
                "latitude": str(school["lat"]),
                "longitude": str(school["lon"]),
                "aqi": aqi,
                "dominant_pollutant": dominant,
                "grap_stage": grap_stage,
                "grap_name": grap_name,
                "pm2_5": str(telemetry["pm2_5"]),
                "pm10": str(telemetry["pm10"]),
                "no2": str(telemetry["no2"]),
                "co": str(telemetry["co"]),
                "so2": str(telemetry["so2"]),
                "o3": str(telemetry["o3"]),
                "sub_indices": {k: str(v) for k, v in sub_indices.items()}
            }

            table.put_item(Item=item)
            processed_schools.append({"school_id": school["school_id"], "aqi": aqi, "grap_stage": grap_stage})
        except Exception as e:
            print(f"Error processing school {school['school_id']}: {str(e)}")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Successfully ingested school air quality telemetry",
            "count": len(processed_schools),
            "results": processed_schools,
            "timestamp": timestamp_utc
        })
    }
