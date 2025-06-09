import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnalysisForm from './components/AnalysisForm';
import ProgressIndicator from './components/ProgressIndicator';
import PerformanceMetrics from './components/PerformanceMetrics';
import SecurityAudit from './components/SecurityAudit';
import WaterfallChart from './components/WaterfallChart';
import AuthTestTab from './components/AuthTestTab';
import ReportGenerator from './components/ReportGenerator';
import { AnalysisResult, AuthConfig } from './types';
import { analyzer } from './services/analyzer';

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'security' | 'waterfall' | 'auth-test'>('overview');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentAnalysis && currentAnalysis.status !== 'completed' && currentAnalysis.status !== 'failed') {
      interval = setInterval(() => {
        const updated = analyzer.getAnalysisStatus(currentAnalysis.id);
        if (updated) {
          setCurrentAnalysis(updated);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentAnalysis]);

  const handleStartAnalysis = async (url: string, authConfig: AuthConfig) => {
    try {
      const analysisId = await analyzer.startAnalysis(url, authConfig);
      const initialResult = analyzer.getAnalysisStatus(analysisId);
      setCurrentAnalysis(initialResult);
      setActiveTab('overview');
    } catch (error) {
      console.error('Failed to start analysis:', error);
    }
  };

  const handleClearSession = () => {
    analyzer.clearSession();
    setCurrentAnalysis(null);
    setActiveTab('overview');
  };

  const isAnalyzing = currentAnalysis?.status === 'analyzing' || currentAnalysis?.status === 'pending';
  const isCompleted = currentAnalysis?.status === 'completed';

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Analysis Form */}
          <AnalysisForm
            onStartAnalysis={handleStartAnalysis}
            onClearSession={handleClearSession}
            isAnalyzing={isAnalyzing}
          />

          {/* Progress Indicator */}
          {currentAnalysis && (
            <ProgressIndicator
              progress={currentAnalysis.progress}
              status={currentAnalysis.status}
            />
          )}

          {/* Results Section */}
          {isCompleted && currentAnalysis && (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-1">
                <div className="flex space-x-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'performance', label: 'Performance' },
                    { id: 'security', label: 'Security' },
                    { id: 'waterfall', label: 'Waterfall' },
                    { id: 'auth-test', label: 'Auth Tests' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Analysis Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {currentAnalysis.performance.loadTime}ms
                            </div>
                            <div className="text-sm text-gray-400">Load Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {currentAnalysis.security.score}/100
                            </div>
                            <div className="text-sm text-gray-400">Security Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                              {currentAnalysis.performance.requests}
                            </div>
                            <div className="text-sm text-gray-400">Requests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {(currentAnalysis.performance.totalBytes / 1024 / 1024).toFixed(1)}MB
                            </div>
                            <div className="text-sm text-gray-400">Total Size</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Core Web Vitals</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className={`text-xl font-bold ${
                              currentAnalysis.performance.coreWebVitals.lcp.rating === 'good' ? 'text-green-400' :
                              currentAnalysis.performance.coreWebVitals.lcp.rating === 'needs-improvement' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {currentAnalysis.performance.coreWebVitals.lcp.value}ms
                            </div>
                            <div className="text-sm text-gray-400">LCP</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-xl font-bold ${
                              currentAnalysis.performance.coreWebVitals.fid.rating === 'good' ? 'text-green-400' :
                              currentAnalysis.performance.coreWebVitals.fid.rating === 'needs-improvement' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {currentAnalysis.performance.coreWebVitals.fid.value}ms
                            </div>
                            <div className="text-sm text-gray-400">FID</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-xl font-bold ${
                              currentAnalysis.performance.coreWebVitals.cls.rating === 'good' ? 'text-green-400' :
                              currentAnalysis.performance.coreWebVitals.cls.rating === 'needs-improvement' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {currentAnalysis.performance.coreWebVitals.cls.value.toFixed(3)}
                            </div>
                            <div className="text-sm text-gray-400">CLS</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <ReportGenerator result={currentAnalysis} />
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <PerformanceMetrics metrics={currentAnalysis.performance} />
                )}

                {activeTab === 'security' && (
                  <SecurityAudit audit={currentAnalysis.security} />
                )}

                {activeTab === 'waterfall' && (
                  <WaterfallChart data={currentAnalysis.performance.waterfallData} />
                )}

                {activeTab === 'auth-test' && (
                  <AuthTestTab targetUrl={currentAnalysis.url} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;