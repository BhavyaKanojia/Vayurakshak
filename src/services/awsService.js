/**
 * VayuRakshak - AWS Cloud Service Integration
 * Handles API Gateway requests to Lambda Advisory & DynamoDB Telemetry
 */

const AWS_ENDPOINT_STORAGE_KEY = 'vayurakshak_aws_endpoint';

export function getSavedAWSEndpoint() {
  return localStorage.getItem(AWS_ENDPOINT_STORAGE_KEY) || import.meta.env.VITE_AWS_API_ENDPOINT || '';
}

export function saveAWSEndpoint(url) {
  if (!url) {
    localStorage.removeItem(AWS_ENDPOINT_STORAGE_KEY);
  } else {
    localStorage.setItem(AWS_ENDPOINT_STORAGE_KEY, url.trim());
  }
}

/**
 * Invoke AWS Lambda Advisory Generator via Amazon API Gateway
 * Endpoint: POST /generate-advisory
 */
export async function invokeAWSAdvisory({ schoolName, aqi, grapStage, dominantPollutant }) {
  const endpoint = getSavedAWSEndpoint();
  
  if (!endpoint) {
    throw new Error('No AWS API Gateway endpoint configured. Set your endpoint URL in the AWS Cloud Explorer or .env.');
  }

  const payload = {
    school_name: schoolName,
    aqi: Number(aqi),
    grap_stage: Number(grapStage),
    dominant_pollutant: dominantPollutant || 'PM2.5'
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AWS API Gateway returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Test AWS API Gateway Endpoint Connectivity
 */
export async function testAWSGatewayConnection(endpointUrl) {
  const targetUrl = endpointUrl || getSavedAWSEndpoint();
  if (!targetUrl) {
    return {
      success: false,
      error: 'Please enter a valid AWS API Gateway URL.'
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        school_name: 'Connectivity Ping Test',
        aqi: 220,
        grap_stage: 1,
        dominant_pollutant: 'PM2.5'
      })
    });

    const elapsed = Date.now() - startTime;
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status} ${response.statusText}`,
        latencyMs: elapsed
      };
    }

    const data = await response.json();
    return {
      success: true,
      status: response.status,
      latencyMs: elapsed,
      data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Network request failed (Check CORS configuration on API Gateway)'
    };
  }
}
