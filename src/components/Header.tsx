import React from 'react';
import { Activity, Shield, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WebPerf Pro</h1>
              <p className="text-xs text-gray-400">Authenticated App Performance Analyzer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Performance</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Security</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              <div>GDPR Compliant</div>
              <div>Zero Data Retention</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;