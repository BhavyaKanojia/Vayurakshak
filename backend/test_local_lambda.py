"""
VayuRakshak - Local AWS Lambda Test Runner
Simulates AWS Lambda execution without requiring AWS cloud credentials or boto3.
Tests both lambda_ingest (telemetry & CPCB calculations) and lambda_advisory.
"""

import sys
import os
import json
from unittest.mock import MagicMock

# Fix Windows console UTF-8 output
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure current directory is in python path
sys.path.insert(0, os.path.dirname(__file__))

# Mock boto3 in sys.modules so execution works anywhere without pip install boto3
mock_boto3 = MagicMock()
mock_botocore = MagicMock()
mock_botocore_exceptions = MagicMock()
class MockClientError(Exception):
    pass
mock_botocore_exceptions.ClientError = MockClientError

sys.modules['boto3'] = mock_boto3
sys.modules['botocore'] = mock_botocore
sys.modules['botocore.exceptions'] = mock_botocore_exceptions

def test_ingest():
    print("=" * 60)
    print("[TEST 1] AWS LAMBDA INGESTION PIPELINE (lambda_ingest.py)")
    print("=" * 60)
    
    import lambda_ingest
    
    print("\n[+] Fetching live Open-Meteo sensor data for DTU Campus School (28.7495, 77.1184)...")
    sensor_data = lambda_ingest.fetch_open_meteo(28.7495, 77.1184)
    print("    Raw Pollutants:")
    print(f"    - PM2.5: {sensor_data['pm2_5']} ug/m3")
    print(f"    - PM10:  {sensor_data['pm10']} ug/m3")
    print(f"    - NO2:   {sensor_data['no2']} ug/m3")
    print(f"    - CO:    {sensor_data['co']} mg/m3")
    
    print("\n[+] Computing CPCB NAQI breakpoints & sub-indices...")
    overall_aqi, dominant, sub_indices = lambda_ingest.get_cpcb_naqi(
        sensor_data['pm2_5'], sensor_data['pm10'], sensor_data['no2'], sensor_data['co']
    )
    stage, stage_desc = lambda_ingest.get_grap_stage(overall_aqi)
    
    print(f"    [OK] CPCB NAQI Result: {overall_aqi} ({stage_desc})")
    print(f"    Dominant Pollutant: {dominant}")
    print(f"    Sub-Indices: {sub_indices}")
    
    dynamo_item = {
        "school_id": "dtu-bawana",
        "timestamp": "2026-10-11T12:00:00Z",
        "aqi": overall_aqi,
        "grap_stage": stage,
        "dominant_pollutant": dominant,
        "pollutants": sensor_data
    }
    print("\n[+] Formatted DynamoDB Payload:")
    print(json.dumps(dynamo_item, indent=2))
    print("\n>>> Lambda Ingestion Test PASSED! <<<\n")


def test_advisory():
    print("=" * 60)
    print("[TEST 2] AWS LAMBDA ADVISORY GENERATOR (lambda_advisory.py)")
    print("=" * 60)
    
    import lambda_advisory
    
    mock_event = {
        "body": json.dumps({
            "school_name": "DAV Anand Vihar",
            "aqi": 425,
            "grap_stage": 3,
            "dominant_pollutant": "PM2.5"
        })
    }
    
    print("[+] Triggering lambda_handler with test event (GRAP Stage III)...")
    response = lambda_advisory.lambda_handler(mock_event, None)
    
    print(f"[+] HTTP Status Code: {response['statusCode']}")
    body = json.loads(response['body'])
    print(f"    School: {body['school_name']}")
    print(f"    AQI: {body['aqi']} | GRAP Stage: {body['grap_stage']}")
    print("\n[+] English Advisory Generated:")
    print(body['advisory']['english_broadcast'])
    print("\n[+] Hindi Advisory Generated:")
    print(body['advisory']['hindi_broadcast'])
    print("\n>>> Lambda Advisory Test PASSED! <<<\n")


if __name__ == "__main__":
    test_ingest()
    test_advisory()
