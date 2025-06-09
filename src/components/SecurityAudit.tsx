import React from 'react';
import { SecurityAudit as SecurityAuditType } from '../types';
import { Shield, AlertTriangle, CheckCircle, XCircle, Lock, Globe } from 'lucide-react';

interface SecurityAuditProps {
  audit: SecurityAuditType;
}

const SecurityAudit: React.FC<SecurityAuditProps> = ({ audit }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400 bg-blue-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'high': return 'text-orange-400 bg-orange-900/30';
      case 'critical': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'high':
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">Security Score</h3>
              <p className="text-sm text-gray-400">Overall security assessment</p>
            </div>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(audit.score)}`}>
            {audit.score}/100
          </div>
        </div>
      </div>

      {/* Security Issues */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Security Issues</h3>
          <span className="text-sm text-gray-400">({audit.issues.length} found)</span>
        </div>
        
        <div className="space-y-3">
          {audit.issues.length === 0 ? (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>No security issues detected</span>
            </div>
          ) : (
            audit.issues.map((issue, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {getSeverityIcon(issue.severity)}
                    <span>{issue.severity.toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{issue.type}</h4>
                    <p className="text-sm text-gray-300 mb-2">{issue.description}</p>
                    <p className="text-xs text-blue-400">{issue.recommendation}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Headers Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <h4 className="font-medium text-white">Secure Headers</h4>
          </div>
          <div className="space-y-1">
            {audit.headers.secure.map((header, index) => (
              <div key={index} className="text-sm text-green-400">{header}</div>
            ))}
            {audit.headers.secure.length === 0 && (
              <div className="text-sm text-gray-400">None configured</div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <XCircle className="w-4 h-4 text-red-400" />
            <h4 className="font-medium text-white">Missing Headers</h4>
          </div>
          <div className="space-y-1">
            {audit.headers.missing.map((header, index) => (
              <div key={index} className="text-sm text-red-400">{header}</div>
            ))}
            {audit.headers.missing.length === 0 && (
              <div className="text-sm text-gray-400">All recommended headers present</div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h4 className="font-medium text-white">Misconfigured</h4>
          </div>
          <div className="space-y-1">
            {audit.headers.misconfigured.map((header, index) => (
              <div key={index} className="text-sm text-yellow-400">{header}</div>
            ))}
            {audit.headers.misconfigured.length === 0 && (
              <div className="text-sm text-gray-400">All headers properly configured</div>
            )}
          </div>
        </div>
      </div>

      {/* Encryption & Authentication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Encryption Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">HTTPS Enabled</span>
              <div className={`flex items-center space-x-1 ${audit.encryption.https ? 'text-green-400' : 'text-red-400'}`}>
                {audit.encryption.https ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{audit.encryption.https ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">TLS Version</span>
              <span className="text-white">{audit.encryption.tlsVersion}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Valid Certificate</span>
              <div className={`flex items-center space-x-1 ${audit.encryption.certificateValid ? 'text-green-400' : 'text-red-400'}`}>
                {audit.encryption.certificateValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{audit.encryption.certificateValid ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">HSTS Enabled</span>
              <div className={`flex items-center space-x-1 ${audit.encryption.hsts ? 'text-green-400' : 'text-red-400'}`}>
                {audit.encryption.hsts ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{audit.encryption.hsts ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Authentication Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Method</span>
              <span className="text-white capitalize">{audit.authentication.method}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Secure Implementation</span>
              <div className={`flex items-center space-x-1 ${audit.authentication.secure ? 'text-green-400' : 'text-red-400'}`}>
                {audit.authentication.secure ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{audit.authentication.secure ? 'Yes' : 'No'}</span>
              </div>
            </div>
            {audit.authentication.vulnerabilities.length > 0 && (
              <div>
                <span className="text-gray-300 block mb-2">Vulnerabilities</span>
                <div className="space-y-1">
                  {audit.authentication.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="text-sm text-red-400">{vuln}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;