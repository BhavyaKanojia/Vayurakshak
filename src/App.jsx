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
import { Shield } from 'lucide-react';

export default function App() {
  const [selectedSchool, setSelectedSchool] = useState(DELHI_NCR_SCHOOLS[0]);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [scenarioName, setScenarioName] = useState('Live Open-Meteo Feed');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isBedrockOpen, setIsBedrockOpen] = useState(false);

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
    <div className="app-container">
      
      {/* Top Navbar */}
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
        grapStage={grapData.stage}
      />

      {/* Main Container */}
      <main className="main-content">
        
        {/* TAB 1: Main Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {/* Real-Time Telemetry & Radial AQI Gauge */}
            <AQIGauge data={airData} school={selectedSchool} />

            {/* GRAP Compliance & Action Checklist */}
            <GRAPActionCenter
              aqi={currentAqi}
              school={selectedSchool}
              onOpenBroadcast={() => setIsBroadcastOpen(true)}
              onOpenBedrock={() => setIsBedrockOpen(true)}
            />

            {/* Scenario Evaluation Simulator */}
            <ScenarioSimulator
              currentAqi={currentAqi}
              isSimulated={isSimulated}
              onSimulate={handleSimulate}
              onResetLive={handleResetLive}
            />

            {/* 24-Hour Diurnal Forecast & Rush Hour Peaks */}
            <HourlyForecast hourlyForecast={airData?.hourlyForecast || []} />

            {/* Pediatric Health & Risk Matrix */}
            <HealthVulnerability aqi={currentAqi} />
          </>
        )}

        {/* TAB 2: Monitored Schools Directory */}
        {activeTab === 'directory' && (
          <SchoolDirectory
            selectedSchool={selectedSchool}
            onSelectSchool={(s) => {
              setSelectedSchool(s);
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* TAB 3: AWS Architecture Explorer */}
        {activeTab === 'architecture' && (
          <AWSArchitecture />
        )}

      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#0284c7" />
            <strong style={{ color: 'var(--text-primary)' }}>VayuRakshak Platform</strong>
            <span>• Environmental Hacks | Bharat Builds Tour (WeMakeDevs & AWS)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>AWS Serverless (Lambda • DynamoDB • Bedrock)</span>
            <span>•</span>
            <span>CPCB NAQI Standards</span>
          </div>
        </div>
      </footer>

      {/* Parent Broadcast Modal */}
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
