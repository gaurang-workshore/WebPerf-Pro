import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, Shield, AlertTriangle, FileText } from 'lucide-react';
import { authTester, TestCase, AuthTestResult } from '../services/authTester';

interface AuthTestRunnerProps {
  targetUrl: string;
  onTestComplete?: (results: any) => void;
}

const AuthTestRunner: React.FC<AuthTestRunnerProps> = ({ targetUrl, onTestComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runTestSuite = async () => {
    setIsRunning(true);
    setCurrentTest('Initializing test suite...');
    
    try {
      const results = await authTester.executeTestSuite(targetUrl);
      setTestResults(results);
      onTestComplete?.(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Authentication Test Suite</h3>
            <p className="text-sm text-gray-400">Comprehensive auth flow validation</p>
          </div>
        </div>
        
        <button
          onClick={runTestSuite}
          disabled={isRunning || !targetUrl}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isRunning ? 'Running Tests...' : 'Run Test Suite'}</span>
        </button>
      </div>

      {isRunning && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-white font-medium">Running Authentication Tests</span>
          </div>
          <p className="text-sm text-gray-400">{currentTest}</p>
          <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {testResults && (
        <div className="space-y-6">
          {/* Test Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{testResults.summary.total}</div>
              <div className="text-sm text-gray-400">Total Tests</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{testResults.summary.passed}</div>
              <div className="text-sm text-gray-400">Passed</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{testResults.summary.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {testResults.summary.successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Test Results</span>
            </h4>
            
            {testResults.results.map((testResult: any, index: number) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResult.validation.passed)}
                    <div>
                      <h5 className="font-medium text-white">{testResult.testCase.name}</h5>
                      <p className="text-sm text-gray-400">{testResult.testCase.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(testResult.validation.passed)}`}>
                      {testResult.validation.passed ? 'PASSED' : 'FAILED'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {testResult.result.responseTime}ms
                    </div>
                  </div>
                </div>

                {/* Test Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-400">Status Code</span>
                    <div className={`text-sm font-medium ${
                      testResult.result.statusCode >= 200 && testResult.result.statusCode < 300
                        ? 'text-green-400'
                        : testResult.result.statusCode >= 400
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}>
                      {testResult.result.statusCode || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Auth Method</span>
                    <div className="text-sm text-white capitalize">
                      {testResult.testCase.authConfig.method}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Response Time</span>
                    <div className="text-sm text-white">
                      {testResult.result.responseTime}ms
                    </div>
                  </div>
                </div>

                {/* Validation Results */}
                <div className="space-y-2">
                  <span className="text-xs text-gray-400 font-medium">Validation Checks:</span>
                  {testResult.validation.validationResults.map((validation: any, vIndex: number) => (
                    <div key={vIndex} className="flex items-center space-x-2 text-xs">
                      {getStatusIcon(validation.passed)}
                      <span className={getStatusColor(validation.passed)}>
                        {validation.check}
                      </span>
                      <span className="text-gray-400">- {validation.details}</span>
                    </div>
                  ))}
                </div>

                {/* Error Message */}
                {testResult.result.errorMessage && (
                  <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">Error:</span>
                    </div>
                    <p className="text-xs text-red-300 mt-1">{testResult.result.errorMessage}</p>
                  </div>
                )}

                {/* Auth Tokens Found */}
                {testResult.result.authTokens && (
                  <div className="mt-3 p-2 bg-green-900/30 border border-green-700 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Authentication Tokens Detected:</span>
                    </div>
                    <div className="text-xs text-green-300 space-y-1">
                      {testResult.result.authTokens.sessionToken && (
                        <div>Session Token: {testResult.result.authTokens.sessionToken.substring(0, 20)}...</div>
                      )}
                      {testResult.result.authTokens.jwtToken && (
                        <div>JWT Token: {testResult.result.authTokens.jwtToken.substring(0, 20)}...</div>
                      )}
                      {testResult.result.authTokens.csrfToken && (
                        <div>CSRF Token: {testResult.result.authTokens.csrfToken}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Test Plan Documentation */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Test Plan Coverage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-300 mb-2">Authentication Methods Tested:</h5>
                <ul className="space-y-1 text-gray-400">
                  <li>• Form-based authentication (username/password)</li>
                  <li>• Token-based authentication (Bearer tokens)</li>
                  <li>• Cookie-based session management</li>
                  <li>• Custom header authentication</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-300 mb-2">Validation Checks Performed:</h5>
                <ul className="space-y-1 text-gray-400">
                  <li>• HTTP status code validation</li>
                  <li>• Session cookie presence/absence</li>
                  <li>• Authentication token extraction</li>
                  <li>• Error message validation</li>
                  <li>• Redirect behavior verification</li>
                  <li>• Protected endpoint access testing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTestRunner;