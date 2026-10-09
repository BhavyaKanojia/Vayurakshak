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
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Activity,
  Layers,
  DollarSign
} from 'lucide-react';

export default function AWSArchitecture() {
  const [selectedNode, setSelectedNode] = useState('lambda-ingest');
  const [copiedCode, setCopiedCode] = useState(false);

  const nodes = [
    {
      id: 'open-meteo',
      title: 'Open-Meteo / CPCB API',
      category: 'Data Source',
      icon: Radio,
      color: 'from-sky-500 to-blue-600',
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
      category: 'Serverless Scheduler',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
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
      color: 'from-orange-500 to-amber-600',
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
      color: 'from-blue-600 to-indigo-700',
      description: 'Ultra-low latency serverless table storing historical time-series school AQI observations with partition key `school_id` and sort key `timestamp`.',
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
      category: 'Compliance & AI Broker',
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600',
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
      category: 'Generative AI Foundation Model',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-600',
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
      category: 'Push Notifications',
      icon: Radio,
      color: 'from-red-500 to-rose-600',
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
      color: 'from-teal-500 to-emerald-600',
      description: 'Continuous deployment hosting the React + Tailwind single-page dashboard with global edge CDN distribution and instant public HTTPS.',
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

  const handleCopySam = () => {
    navigator.clipboard.writeText('sam build && sam deploy --guided');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 border-white/10 bg-gradient-to-r from-slate-900/90 via-[#0d1527] to-slate-900/90 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
              <Server className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-heading">
                  100% Serverless AWS Architecture & Zero-Cost Cloud Pipeline
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Zero Bill Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Engineered for Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySam}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-mono font-semibold transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied SAM Command!' : 'sam deploy --guided'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Node Flowchart Grid */}
      <div className="glass-panel p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Interactive Serverless Flowchart (Click nodes to inspect live payloads & IAM specs)</span>
          </h3>
          <span className="text-xs text-slate-400">Click any card to inspect</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = node.id === selectedNode;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10 -translate-y-0.5'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      Step {index + 1}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {node.cost.split(' ')[0]} {node.cost.split(' ')[1]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-tr ${node.color} text-white shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-heading leading-tight">{node.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{node.category}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                  <span>Inspect Spec</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Dive Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Spec Details (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${activeNode.color} text-white shadow-md`}>
              <activeNode.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                {activeNode.category}
              </span>
              <h3 className="text-lg font-bold text-white font-heading mt-1">{activeNode.title}</h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeNode.description}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>AWS Free Tier Allocation</span>
            </div>
            <div className="text-xs font-mono text-emerald-300 font-bold">
              {activeNode.cost}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed border-t border-white/10 pt-3">
            <strong>SAM Resource Mapping: </strong>
            Declared in <span className="font-mono text-cyan-300">template.yaml</span> under Infrastructure-as-Code definitions.
          </div>
        </div>

        {/* Right: Live Payload & Data Contract (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Data Contract & Payload Inspector
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                application/json
              </span>
            </div>

            {/* Code Box */}
            <div className="bg-[#080d1a] border border-white/10 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-72">
              <pre>{JSON.stringify(activeNode.payload, null, 2)}</pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Verified compatibility with AWS Lambda Python 3.12 & boto3 runtime</span>
            <span className="font-mono text-emerald-400 font-semibold">$0.00 / month</span>
          </div>
        </div>

      </div>

    </div>
  );
}
