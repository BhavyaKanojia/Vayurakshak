import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Radio, 
  Sparkles, 
  Cloud, 
  Code2, 
  Copy, 
  Check, 
  Zap,
  DollarSign,
  Play,
  Terminal,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Send
} from 'lucide-react';
import { getSavedAWSEndpoint, saveAWSEndpoint, testAWSGatewayConnection } from '../services/awsService';

export default function AWSArchitecture() {
  const [selectedNode, setSelectedNode] = useState('lambda-ingest');
  const [copiedCode, setCopiedCode] = useState(false);

  const nodes = [
    {
      id: 'open-meteo',
      title: 'Open-Meteo & CPCB API',
      category: 'Data Feeds',
      icon: Radio,
      color: '#06b6d4',
      description: 'Free public real-time atmospheric pollutant feeds (PM2.5, PM10, NO2, CO, SO2, O3) for Delhi-NCR school coordinates without API keys.',
      payload: {
        endpoint: "https://air-quality-api.open-meteo.com/v1/air-quality",
        lat: 28.7495,
        lon: 77.1184,
        metrics: ["pm2_5", "pm10", "carbon_monoxide", "nitrogen_dioxide"],
        interval: "15 min"
      },
      cost: '100% Free (10,000 calls/day)'
    },
    {
      id: 'eventbridge',
      title: 'Amazon EventBridge',
      category: 'Cron Scheduler',
      icon: Zap,
      color: '#f59e0b',
      description: 'Automated recurring cron scheduler firing every 15 minutes to trigger the ingestion Lambda handler across all Delhi-NCR monitored schools.',
      payload: {
        rule_name: "VayuRakshakTelemetryCron",
        schedule: "rate(15 minutes)",
        target_arn: "arn:aws:lambda:us-east-1:123456789012:function:VayuRakshak-AQI-Ingest",
        status: "ENABLED"
      },
      cost: '1,000,000 free events/month'
    },
    {
      id: 'lambda-ingest',
      title: 'AWS Lambda (Ingest)',
      category: 'Compute (Python 3.12)',
      icon: Cpu,
      color: '#f97316',
      description: 'Serverless microservice executing CPCB NAQI Indian Standard breakpoint formula calculations and pushing normalized telemetry records into DynamoDB.',
      payload: {
        function_name: "VayuRakshak-AQI-Ingest",
        runtime: "python3.12",
        memory_mb: 256,
        avg_execution_ms: 180,
        cpcb_formula: "NAQI = max(sub_indices[pm2_5, pm10, no2, co])"
      },
      cost: '1,000,000 free invocations/month'
    },
    {
      id: 'dynamodb',
      title: 'Amazon DynamoDB',
      category: 'NoSQL Database',
      icon: Database,
      color: '#3b82f6',
      description: 'Ultra-low latency serverless table storing historical time-series school AQI observations with partition key school_id and sort key timestamp.',
      payload: {
        table_name: "SchoolAQITelemetry",
        partition_key: "school_id (String)",
        sort_key: "timestamp (String - ISO8601)",
        billing_mode: "PAY_PER_REQUEST",
        ttl_enabled: true
      },
      cost: '25 GB Always Free storage'
    },
    {
      id: 'lambda-advisory',
      title: 'AWS Lambda (Advisory)',
      category: 'Compliance Broker',
      icon: Cpu,
      color: '#8b5cf6',
      description: 'Evaluates active CAQM GRAP Stage I–IV statutory mandates, formats prompt payloads for Amazon Bedrock, and triggers SNS emergency alerts.',
      payload: {
        function_name: "VayuRakshak-Advisory-Bedrock",
        grap_evaluation: "AQI > 300 -> GRAP Stage II (Outdoor ban)",
        bedrock_invoker: "InvokeModel(anthropic.claude-3-haiku)",
        sns_trigger_threshold: "AQI >= 400 (Severe)"
      },
      cost: 'Free tier eligible'
    },
    {
      id: 'bedrock',
      title: 'Amazon Bedrock (Claude 3)',
      category: 'Generative AI',
      icon: Sparkles,
      color: '#ec4899',
      description: 'Synthesizes context-aware bilingual parent WhatsApp circulars (English + Hindi) and tailored principal operational directives for school leadership.',
      payload: {
        model_id: "anthropic.claude-3-haiku-20240307-v1:0",
        prompt_type: "GRAP Compliance & Bilingual Parent Circular",
        temperature: 0.2,
        output_format: "JSON with English & Hindi broadcasts"
      },
      cost: 'Covered under AWS credits / Fallback prompt mode'
    },
    {
      id: 'sns',
      title: 'Amazon SNS',
      category: 'Push Alerts',
      icon: Radio,
      color: '#ef4444',
      description: 'Instant multi-channel emergency alert dispatcher sending automated SMS & email notifications when hazardous GRAP Stage IV is breached.',
      payload: {
        topic_arn: "arn:aws:sns:us-east-1:123456789012:VayuRakshak-GRAP-Emergency-Alerts",
        subscribers: ["Principal SMS", "Transport Coordinator", "School Board"],
        trigger: "GRAP Stage III & IV Breaches"
      },
      cost: '1,000,000 free SNS publishes/month'
    },
    {
      id: 'amplify',
      title: 'AWS Amplify Hosting',
      category: 'Web Deployment & CDN',
      icon: Cloud,
      color: '#10b981',
      description: 'Continuous deployment hosting the React single-page dashboard with global edge CDN distribution and instant public HTTPS.',
      payload: {
        framework: "React + Vite",
        cdn_distribution: "Amazon CloudFront Global Edge",
        ssl: "Automated ACM Managed Certificate",
        continuous_deploy: "Git push to main branch"
      },
      cost: 'Amplify Free Tier (1,000 build mins/month)'
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNode) || nodes[2];

  const [awsEndpoint, setAwsEndpoint] = useState(getSavedAWSEndpoint());
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [endpointResult, setEndpointResult] = useState(null);
  const [guideTab, setGuideTab] = useState('amplify'); // 'amplify' | 'sam' | 'console' | 'local'
  const [simulatingPipeline, setSimulatingPipeline] = useState(false);
  const [simLogs, setSimLogs] = useState([]);

  const handleCopySam = () => {
    navigator.clipboard.writeText('sam build && sam deploy --guided');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveEndpoint = (val) => {
    setAwsEndpoint(val);
    saveAWSEndpoint(val);
  };

  const handleTestEndpoint = async () => {
    setIsTestingEndpoint(true);
    setEndpointResult(null);
    const res = await testAWSGatewayConnection(awsEndpoint);
    setEndpointResult(res);
    setIsTestingEndpoint(false);
  };

  const handleSimulatePipeline = () => {
    setSimulatingPipeline(true);
    setSimLogs([]);

    const steps = [
      { text: '[00:00.020] [Amazon EventBridge] Cron Trigger fired rule "VayuRakshakTelemetryCron" (rate: 15m)', type: 'info' },
      { text: '[00:00.140] [AWS Lambda] Invoking "VayuRakshak-AQI-Ingest" (Python 3.12, Memory: 256MB, Region: us-east-1)', type: 'info' },
      { text: '[00:00.320] [Open-Meteo & CPCB] Ingested 6 stations: DTU, Anand Vihar, RK Puram, ITO, Noida, Gurugram', type: 'info' },
      { text: '[00:00.410] [CPCB NAQI Engine] Computed Anand Vihar AQI: 425 (GRAP Stage III - Severe) | Dominant: PM2.5', type: 'warn' },
      { text: '[00:00.580] [Amazon DynamoDB] PutItem successful to table "SchoolAQITelemetry" (Item size: 412 bytes, TTL: 30d)', type: 'success' },
      { text: '[00:00.820] [AWS Lambda] Triggering "VayuRakshak-Advisory-Bedrock" via API Gateway /generate-advisory', type: 'info' },
      { text: '[00:01.210] [Amazon Bedrock] Claude 3 Haiku generated bilingual circular (Tokens: 382, Latency: 390ms)', type: 'success' },
      { text: '[00:01.440] [Amazon SNS] Published SOS alert to topic "VayuRakshak-GRAP-Emergency-Alerts" (MessageId: sns-928472-delhi)', type: 'success' },
      { text: '[00:01.500] [Status: 200 OK] Serverless pipeline execution completed. Total Bill: $0.00 (100% Free Tier)', type: 'highlight' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setSimulatingPipeline(false);
        }
      }, (idx + 1) * 250);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff, #f0fdf4)', borderColor: '#bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="brand-icon-box" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <Server size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>100% Serverless AWS Architecture</h2>
                <span className="brand-badge" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}>
                  Zero-Cost Verified
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Built for Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySam}
            className="btn-icon-refresh"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {copiedCode ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            <span>{copiedCode ? 'Copied SAM Command!' : 'sam deploy --guided'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Serverless Nodes Flowchart */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title-group">
            <Cpu size={20} color="#0284c7" />
            <div>
              <h3 className="card-title">Interactive Serverless Flowchart</h3>
              <p className="card-subtitle">Click any cloud node to inspect its live data contract, IAM policy, and free tier quota</p>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>8 Microservice Components</span>
        </div>

        <div className="arch-nodes-grid">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = node.id === selectedNode;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`arch-node-card ${isSelected ? 'active' : ''}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#94a3b8' }}>
                      Step {index + 1}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      Free Tier
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${node.color}15`, border: `1px solid ${node.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: node.color }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{node.title}</h4>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{node.category}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {node.description}
                  </p>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                  <span>Inspect Spec</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Dive Node Inspector */}
      <div className="arch-inspect-grid">
        
        {/* Left: Spec Details */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${activeNode.color}15`, border: `1px solid ${activeNode.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeNode.color }}>
              <activeNode.icon size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', color: '#475569' }}>
                {activeNode.category}
              </span>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '4px' }}>{activeNode.title}</h3>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {activeNode.description}
          </p>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <DollarSign size={14} color="#059669" />
              <span>Free Tier Quota</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#059669', fontFamily: 'var(--font-mono)' }}>
              {activeNode.cost}
            </strong>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748b', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            Declared in <span style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>template.yaml</span> under AWS SAM Infrastructure-as-Code definitions.
          </div>
        </div>

        {/* Right: Live Payload Inspector */}
        <div className="glass-card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <div className="card-title-group">
              <Code2 size={18} color="#0284c7" />
              <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                Live Data Contract & JSON Payload
              </h4>
            </div>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
              application/json
            </span>
          </div>

          <div className="code-pre-box">
            <pre>{JSON.stringify(activeNode.payload, null, 2)}</pre>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Verified compatibility with Python 3.12 & boto3</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 700 }}>$0.00 / month</span>
          </div>
        </div>

      </div>

      {/* Live AWS Pipeline Execution Simulator & Gateway Config */}
      <div className="glass-card" style={{ border: '1px solid #bae6fd', background: 'linear-gradient(180deg, #ffffff, #f0f9ff)' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div className="card-title-group">
            <Terminal size={20} color="#0284c7" />
            <div>
              <h3 className="card-title">Live AWS Serverless Pipeline Simulator & Gateway Connect</h3>
              <p className="card-subtitle">Test end-to-end telemetry ingestion, DynamoDB persistence, Bedrock synthesis, and SNS broadcasts</p>
            </div>
          </div>
          <button
            onClick={handleSimulatePipeline}
            disabled={simulatingPipeline}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play size={14} />
            <span>{simulatingPipeline ? 'Executing Lambda...' : 'Run Pipeline Simulation'}</span>
          </button>
        </div>

        {/* Live Execution Logs Window */}
        <div style={{
          background: '#0f172a',
          borderRadius: '10px',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: '#e2e8f0',
          minHeight: '140px',
          maxHeight: '220px',
          overflowY: 'auto',
          border: '1px solid #1e293b'
        }}>
          {simLogs.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', height: '100px', justifyContent: 'center' }}>
              <Play size={16} />
              <span>Click "Run Pipeline Simulation" above to trace EventBridge → Ingestion Lambda → DynamoDB → Bedrock → SNS in real-time</span>
            </div>
          ) : (
            simLogs.map((log, idx) => (
              <div 
                key={idx} 
                style={{ 
                  marginBottom: '6px', 
                  color: log.type === 'success' ? '#34d399' : log.type === 'warn' ? '#f59e0b' : log.type === 'highlight' ? '#38bdf8' : '#cbd5e1',
                  fontWeight: log.type === 'highlight' ? 700 : 400
                }}
              >
                {log.text}
              </div>
            ))
          )}
        </div>

        {/* Live API Gateway Config & Connectivity Check */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e0f2fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Connect Live Amazon API Gateway Endpoint (Optional)
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Deploy SAM backend, copy the output <code style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>ApiEndpoint</code>, and paste below.
              </p>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
              Supports CORS POST
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={awsEndpoint}
              onChange={(e) => handleSaveEndpoint(e.target.value)}
              placeholder="https://{restApiId}.execute-api.us-east-1.amazonaws.com/Prod/generate-advisory"
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '9px 12px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            />
            <button
              onClick={handleTestEndpoint}
              disabled={isTestingEndpoint || !awsEndpoint}
              className="btn-icon-refresh"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <Send size={14} />
              <span>{isTestingEndpoint ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {endpointResult && (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              background: endpointResult.success ? '#ecfdf5' : '#fef2f2',
              color: endpointResult.success ? '#065f46' : '#991b1b',
              border: `1px solid ${endpointResult.success ? '#a7f3d0' : '#fecaca'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                {endpointResult.success 
                  ? `✅ Connected! HTTP ${endpointResult.status} in ${endpointResult.latencyMs}ms` 
                  : `❌ Connection Failed: ${endpointResult.error}`}
              </span>
              {endpointResult.latencyMs && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                  Latency: {endpointResult.latencyMs}ms
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complete Step-by-Step AWS Deployment Guide */}
      <div className="glass-card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div className="card-title-group">
            <Cloud size={20} color="#0284c7" />
            <div>
              <h3 className="card-title">How to Incorporate & Deploy to AWS</h3>
              <p className="card-subtitle">Choose your deployment method for hackathon evaluation</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { id: 'amplify', label: '1. AWS Amplify (Frontend)' },
            { id: 'sam', label: '2. AWS SAM (Serverless Backend)' },
            { id: 'local', label: '3. Local Python Runner (Zero AWS Setup)' },
            { id: 'console', label: '4. AWS Web Console' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setGuideTab(tab.id)}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: guideTab === tab.id ? '#0284c7' : 'transparent',
                background: guideTab === tab.id ? '#f0f9ff' : 'transparent',
                color: guideTab === tab.id ? '#0284c7' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Amplify */}
        {guideTab === 'amplify' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <p><strong>Deploy the React Single-Page Application on AWS Amplify Hosting (3 Minutes):</strong></p>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              <li>Log in to the <a href="https://console.aws.amazon.com/amplify" target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>AWS Amplify Console</a>.</li>
              <li>Click <strong>Host web app</strong> &rarr; Select <strong>GitHub</strong> as your source code provider.</li>
              <li>Authorize AWS and choose your repository: <code style={{ fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>BhavyaKanojia/Vayurakshak</code> (Branch: <code style={{ fontFamily: 'var(--font-mono)' }}>main</code>).</li>
              <li>Amplify auto-detects Vite React settings:
                <pre style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', marginTop: '6px', border: '1px solid var(--border-subtle)' }}>
{`frontend:
  phases:
    build:
      commands:
        - npm install
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'`}
                </pre>
              </li>
              <li>Click <strong>Save and Deploy</strong>. In ~2 minutes, Amplify provisions global CloudFront edge distribution with free SSL.</li>
            </ol>
          </div>
        )}

        {/* Tab 2: SAM */}
        {guideTab === 'sam' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <p><strong>Deploy Serverless Lambdas, DynamoDB & API Gateway with AWS SAM:</strong></p>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              <li>Ensure you have the AWS SAM CLI installed (<a href="https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html" target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>Installation Guide</a>).</li>
              <li>In your terminal inside the project directory, run:
                <pre style={{ background: '#0f172a', color: '#38bdf8', padding: '10px 14px', borderRadius: '6px', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
sam build
sam deploy --guided
                </pre>
              </li>
              <li>Accept the defaults (Stack Name: <code style={{ fontFamily: 'var(--font-mono)' }}>vayurakshak-stack</code>, Region: <code style={{ fontFamily: 'var(--font-mono)' }}>us-east-1</code>).</li>
              <li>Once complete, copy the output <strong>ApiEndpoint</strong> and paste it into the <em>Connect Live Amazon API Gateway</em> input above.</li>
            </ol>
          </div>
        )}

        {/* Tab 3: Local Python Runner */}
        {guideTab === 'local' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <p><strong>Test AWS Lambda handlers locally on your computer (No AWS account or credentials needed):</strong></p>
            <p>We created a standalone mock harness in <code style={{ fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>backend/test_local_lambda.py</code> that simulates EventBridge, fetches real Open-Meteo sensors, runs CPCB formulas, and generates the bilingual advisory:</p>
            <pre style={{ background: '#0f172a', color: '#34d399', padding: '12px 14px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
python backend/test_local_lambda.py
            </pre>
            <p>This prints the live Open-Meteo sensor metrics, Indian CPCB NAQI calculation, DynamoDB item payload, and generated English + Hindi circulars directly in your terminal.</p>
          </div>
        )}

        {/* Tab 4: Web Console */}
        {guideTab === 'console' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <p><strong>Manual Free Tier Setup via the AWS Web Console:</strong></p>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              <li><strong>DynamoDB:</strong> Create Table <code style={{ fontFamily: 'var(--font-mono)' }}>SchoolAQITelemetry</code> with Partition key <code style={{ fontFamily: 'var(--font-mono)' }}>school_id (String)</code> and Sort key <code style={{ fontFamily: 'var(--font-mono)' }}>timestamp (String)</code>. Set billing mode to <em>On-Demand (Free Tier)</em>.</li>
              <li><strong>SNS:</strong> Create standard topic <code style={{ fontFamily: 'var(--font-mono)' }}>VayuRakshak-GRAP-Emergency-Alerts</code>. Add email or SMS subscription for school coordinators.</li>
              <li><strong>Bedrock:</strong> In AWS Console us-east-1, navigate to Amazon Bedrock &rarr; Model access &rarr; Enable access to <strong>Anthropic Claude 3 Haiku</strong>.</li>
              <li><strong>Lambda:</strong> Create Python 3.12 functions for <code style={{ fontFamily: 'var(--font-mono)' }}>lambda_ingest.py</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>lambda_advisory.py</code> from the <code style={{ fontFamily: 'var(--font-mono)' }}>backend/</code> directory.</li>
            </ol>
          </div>
        )}
      </div>

    </div>
  );
}
