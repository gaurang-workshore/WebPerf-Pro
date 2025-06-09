import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  currentStep?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  progress, 
  status, 
  currentStep 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'analyzing':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-gray-600';
      case 'analyzing':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
    }
  };

  const steps = [
    'Authenticating',
    'Loading page',
    'Analyzing performance',
    'Running security audit',
    'Generating report'
  ];

  const currentStepIndex = Math.floor((progress / 100) * steps.length);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon()}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Analysis Progress
          </h3>
          <p className="text-sm text-gray-400">
            {currentStep || steps[currentStepIndex] || 'Preparing...'}
          </p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold text-white">{progress}%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            {status.replace('-', ' ')}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`text-xs p-2 rounded text-center transition-colors ${
              index <= currentStepIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;