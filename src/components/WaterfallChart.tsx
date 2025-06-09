import React from 'react';
import { WaterfallItem } from '../types';
import { Clock, FileText, Image, Code, Type, Download } from 'lucide-react';

interface WaterfallChartProps {
  data: WaterfallItem[];
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ data }) => {
  const maxTime = Math.max(...data.map(item => item.startTime + item.duration));
  
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'script': return <Code className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'font': return <Type className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document': return 'bg-blue-500';
      case 'script': return 'bg-yellow-500';
      case 'stylesheet': return 'bg-green-500';
      case 'image': return 'bg-purple-500';
      case 'font': return 'bg-pink-500';
      case 'xhr': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    if (status >= 400) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Request Waterfall</h3>
        <span className="text-sm text-gray-400">({data.length} requests)</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded">
            <div className="flex items-center space-x-2 w-48 min-w-0">
              <div className="text-blue-400">
                {getTypeIcon(item.type)}
              </div>
              <div className="truncate">
                <div className="text-sm text-white truncate">{item.name.split('/').pop()}</div>
                <div className="text-xs text-gray-400">{item.type}</div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="relative h-6 bg-gray-700 rounded">
                <div
                  className={`absolute h-full rounded ${getTypeColor(item.type)}`}
                  style={{
                    left: `${(item.startTime / maxTime) * 100}%`,
                    width: `${Math.max((item.duration / maxTime) * 100, 1)}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{item.startTime}ms</span>
                <span>{item.duration}ms</span>
              </div>
            </div>

            <div className="text-right w-20">
              <div className="text-sm text-white">{formatSize(item.size)}</div>
              <div className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs">
          {['document', 'script', 'stylesheet', 'image', 'font', 'xhr'].map(type => (
            <div key={type} className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded ${getTypeColor(type)}`} />
              <span className="text-gray-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaterfallChart;