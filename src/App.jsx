import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AQIGauge from './components/AQIGauge';
import GRAPActionCenter from './components/GRAPActionCenter';
import HourlyForecast from './components/HourlyForecast';
import ScenarioSimulator from './components/ScenarioSimulator';
import HealthVulnerability from './components/HealthVulnerability';
import SchoolDirectory from './components/SchoolDirectory';
import AWSArchitecture from './components/AWSArchitecture';
import BroadcastGenerator from './components/BroadcastGenerator';
import BedrockAIAssistant from './components/BedrockAIAssistant';

import { DELHI_NCR_SCHOOLS } from './services/schoolsData';
import { fetchLiveSchoolAirQuality, getSimulatedAirQuality } from './services/aqiService';
import { getGRAPStage } from './services/grapRules';
import { Shield, Sparkles, Send, Server, AlertTriangle, CheckCircle, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [selectedSchool, setSelectedSchool] = useState(DELHI_NCR_SCHOOLS[0]);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [scenarioName, setScenarioName] = useState('Live Open-Meteo Feed');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'directory', 'architecture'
  
  // Modals
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isBedrockOpen, setIsBedrockOpen] = useState(false);

  // Load air quality data on school change
  useEffect(() => {
    loadData(selectedSchool);
  }, [selectedSchool]);

  const loadData = async (school) => {
    setLoading(true);
    try {
      const data = await fetchLiveSchoolAirQuality(school);
      setAirData(data);
      setIsSimulated(data.isSimulated || false);
      setScenarioName(data.isSimulated ? (data.scenarioName || 'Simulation') : 'Live Open-Meteo Feed');
    } catch (err) {
      console.error(err);
      const fallback = getSimulatedAirQuality(school, 340, 'Fallback Default');
      setAirData(fallback);
      setIsSimulated(true);
      setScenarioName('Fallback Default');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = (aqi, name) => {
    const simData = getSimulatedAirQuality(selectedSchool, aqi, name);
    setAirData(simData);
    setIsSimulated(true);
    setScenarioName(name);
  };

  const handleResetLive = () => {
    loadData(selectedSchool);
  };

  const currentAqi = airData?.naqi?.aqi || 285;
  const grapData = getGRAPStage(currentAqi);

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navigation */}
      <Header
        selectedSchool={selectedSchool}
        onSelectSchool={setSelectedSchool}
        isSimulated={isSimulated}
        scenarioName={scenarioName}
        onRefresh={() => loadData(selectedSchool)}
        loading={loading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenBedrock={() => setIsBedrockOpen(true)}
        grapStage={grapData.stage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: Main Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Real-Time Telemetry & Radial AQI Gauge */}
            <AQIGauge data={airData} school={selectedSchool} />

            {/* GRAP Statutory Compliance & Principal Action Center */}
            <GRAPActionCenter
              aqi={currentAqi}
              school={selectedSchool}
              onOpenBroadcast={() => setIsBroadcastOpen(true)}
              onOpenBedrock={() => setIsBedrockOpen(true)}
            />

            {/* Scenario / Time-Travel Simulator */}
            <ScenarioSimulator
              currentAqi={currentAqi}
              isSimulated={isSimulated}
              onSimulate={handleSimulate}
              onResetLive={handleResetLive}
            />

            {/* 24-Hour Hourly Trend & Morning Rush Analysis */}
            <HourlyForecast hourlyForecast={airData?.hourlyForecast || []} />

            {/* Pediatric Health Risk & Staff Vulnerability Matrix */}
            <HealthVulnerability aqi={currentAqi} />

          </div>
        )}

        {/* TAB 2: Monitored Schools Directory */}
        {activeTab === 'directory' && (
          <div className="animate-in fade-in duration-300">
            <SchoolDirectory
              selectedSchool={selectedSchool}
              onSelectSchool={(s) => {
                setSelectedSchool(s);
                setActiveTab('dashboard');
              }}
              currentAqi={currentAqi}
            />
          </div>
        )}

        {/* TAB 3: AWS Architecture Explorer */}
        {activeTab === 'architecture' && (
          <div className="animate-in fade-in duration-300">
            <AWSArchitecture />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070a13]/90 py-6 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">VayuRakshak Platform</span>
            <span>• Built for Bharat Builds Tour (WeMakeDevs & AWS) — Environmental Hacks</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Free Tier AWS Lambda + DynamoDB + Bedrock</span>
            <span>•</span>
            <span>CPCB NAQI Standards</span>
          </div>
        </div>
      </footer>

      {/* Bilingual Parent Broadcast Modal */}
      {isBroadcastOpen && (
        <BroadcastGenerator
          aqi={currentAqi}
          school={selectedSchool}
          onClose={() => setIsBroadcastOpen(false)}
        />
      )}

      {/* Amazon Bedrock AI Copilot Modal */}
      {isBedrockOpen && (
        <BedrockAIAssistant
          aqi={currentAqi}
          school={selectedSchool}
          onClose={() => setIsBedrockOpen(false)}
        />
      )}

    </div>
  );
}
