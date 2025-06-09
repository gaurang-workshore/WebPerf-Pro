import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PerformanceMetrics as PerformanceMetricsType } from '../types';
import { Clock, Gauge, Zap, TrendingUp } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const assetData = metrics.assets.map(asset => ({
    name: asset.type.toUpperCase(),
    size: Math.round(asset.size / 1024), // KB
    count: asset.count,
    loadTime: asset.loadTime
  }));

  const vitalsData = [
    {
      name: 'LCP',
      value: metrics.coreWebVitals.lcp.value,
      rating: metrics.coreWebVitals.lcp.rating,
      threshold: 2500
    },
    {
      name: 'FID',
      value: metrics.coreWebVitals.fid.value,
      rating: metrics.coreWebVitals.fid.rating,
      threshold: 100
    },
    {
      name: 'CLS',
      value: metrics.coreWebVitals.cls.value,
      rating: metrics.coreWebVitals.cls.rating,
      threshold: 0.1
    }
  ];

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-400';
      case 'needs-improvement': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vitalsData.map((vital, index) => (
          <div key={vital.name} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">{vital.name}</h3>
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded ${getRatingColor(vital.rating)} bg-gray-700`}>
                {vital.rating.replace('-', ' ').toUpperCase()}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {vital.name === 'CLS' ? vital.value.toFixed(3) : `${vital.value}ms`}
            </div>
            <div className="text-sm text-gray-400">
              Threshold: {vital.name === 'CLS' ? vital.threshold : `${vital.threshold}ms`}
            </div>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Load Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{metrics.loadTime}ms</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Requests</span>
          </div>
          <div className="text-2xl font-bold text-white">{metrics.requests}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Total Size</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(metrics.totalBytes / 1024 / 1024).toFixed(1)}MB
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">FCP</span>
          </div>
          <div className="text-2xl font-bold text-white">{metrics.firstContentfulPaint}ms</div>
        </div>
      </div>

      {/* Asset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Asset Size Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assetData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="size"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value) => [`${value} KB`, 'Size']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Load Time by Asset Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value) => [`${value}ms`, 'Load Time']}
              />
              <Bar dataKey="loadTime" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;