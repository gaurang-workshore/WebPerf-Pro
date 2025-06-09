import React, { useState } from 'react';
import { Play, Settings, Lock, Key, Globe, Trash2, HelpCircle } from 'lucide-react';
import { AuthMethod, AuthConfig } from '../types';

interface AnalysisFormProps {
  onStartAnalysis: (url: string, authConfig: AuthConfig) => void;
  onClearSession: () => void;
  isAnalyzing: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ 
  onStartAnalysis, 
  onClearSession, 
  isAnalyzing 
}) => {
  const [url, setUrl] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('none');
  const [showAuthConfig, setShowAuthConfig] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    token: '',
    headers: '',
    cookies: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    console.log('[Auth] Starting authentication process...');
    console.log('[Auth] Selected auth method:', authMethod);

    try {
      // Improved header parsing with validation
      let parsedHeaders: Record<string, string> | undefined;
      if (credentials.headers) {
        try {
          parsedHeaders = JSON.parse(credentials.headers);
          if (typeof parsedHeaders !== 'object' || parsedHeaders === null) {
            throw new Error('Headers must be a valid JSON object');
          }
        } catch (headerError) {
          console.error('[Auth] Error parsing headers:', headerError);
          alert('Invalid headers format. Please check the JSON syntax.');
          return;
        }
      }

      // Improved cookie parsing with validation
      let parsedCookies: Record<string, string> | undefined;
      if (credentials.cookies) {
        try {
          parsedCookies = JSON.parse(credentials.cookies);
          if (typeof parsedCookies !== 'object' || parsedCookies === null) {
            throw new Error('Cookies must be a valid JSON object');
          }
        } catch (cookieError) {
          console.error('[Auth] Error parsing cookies:', cookieError);
          alert('Invalid cookies format. Please check the JSON syntax.');
          return;
        }
      }

      console.log('[Auth] Parsed headers:', parsedHeaders);
      console.log('[Auth] Parsed cookies:', parsedCookies);

      // Enhanced Memberstack integration
      if (typeof window !== 'undefined' && 'memberstack' in window) {
        try {
          console.log('[Auth] Memberstack detected, fetching token...');
          const memberstackToken = window.memberstack?.getToken();
          if (memberstackToken) {
            console.log('[Auth] Memberstack token retrieved');
            parsedHeaders = {
              ...parsedHeaders,
              'Authorization': `Bearer ${memberstackToken}`
            };
          } else {
            console.warn('[Auth] No Memberstack token found');
          }
        } catch (memberstackError) {
          console.error('[Auth] Error with Memberstack integration:', memberstackError);
        }
      } else {
        console.log('[Auth] Memberstack not available');
      }

      // Validate required fields based on auth method
      if (authMethod === 'login' && (!credentials.username || !credentials.password)) {
        alert('Username and password are required for login authentication');
        return;
      } else if (authMethod === 'token' && !credentials.token) {
        alert('Token is required for token authentication');
        return;
      }

      const authConfig: AuthConfig = {
        method: authMethod,
        credentials: authMethod !== 'none' ? {
          username: credentials.username || undefined,
          password: credentials.password || undefined,
          token: credentials.token || undefined,
          headers: parsedHeaders,
          cookies: parsedCookies,
        } : undefined
      };

      console.log('[Auth] Final auth configuration:', { 
        ...authConfig, 
        credentials: authConfig.credentials ? {
          ...authConfig.credentials,
          password: '***',
          token: authConfig.credentials.token ? '***' : undefined
        } : undefined
      });
      
      onStartAnalysis(url, authConfig);
    } catch (error) {
      console.error('[Auth] Error preparing authentication:', error);
      alert('An error occurred while preparing authentication. Please check your inputs.');
    }
  };

  const authMethodIcons = {
    none: Globe,
    token: Key,
    login: Lock,
    interactive: Settings
  };

  const AuthIcon = authMethodIcons[authMethod];

  const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-900 border border-gray-600 rounded-lg shadow-lg -translate-x-1/2 left-1/2">
        {content}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-600 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            Target URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://app.example.com/dashboard"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Authentication Method
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['none', 'token', 'login', 'interactive'] as AuthMethod[]).map((method) => {
              const Icon = authMethodIcons[method];
              const descriptions = {
                none: 'For public pages that don\'t require authentication',
                token: 'Use API keys, Bearer tokens, or session tokens',
                login: 'Automated login with username and password',
                interactive: 'Manual browser-based authentication'
              };
              
              return (
                <Tooltip key={method} content={descriptions[method]}>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod(method);
                      setShowAuthConfig(method !== 'none');
                    }}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                      authMethod === method
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm capitalize">{method === 'none' ? 'Public' : method}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {showAuthConfig && (
          <div className="bg-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <AuthIcon className="w-4 h-4" />
              <span>Authentication Configuration</span>
            </h3>
            
            {authMethod === 'login' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <label className="text-xs text-gray-400">Username</label>
                    <Tooltip content="Enter your login username or email address">
                      <HelpCircle className="w-3 h-3 text-gray-500" />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    placeholder="user@example.com"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <label className="text-xs text-gray-400">Password</label>
                    <Tooltip content="Enter your account password. This is stored temporarily in memory only.">
                      <HelpCircle className="w-3 h-3 text-gray-500" />
                    </Tooltip>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {authMethod === 'token' && (
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <label className="text-xs text-gray-400">API Token</label>
                  <Tooltip content="Enter your Bearer token, API key, or session token. Examples: 'Bearer abc123', 'sk-1234567890', or just 'abc123'">
                    <HelpCircle className="w-3 h-3 text-gray-500" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  placeholder="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={credentials.token}
                  onChange={(e) => setCredentials(prev => ({ ...prev, token: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <label className="text-xs text-gray-400">Custom Headers (JSON)</label>
                  <Tooltip content='Add custom HTTP headers as JSON. Example: {"Authorization": "Bearer token123", "X-API-Key": "key456", "User-Agent": "MyApp/1.0"}'>
                    <HelpCircle className="w-3 h-3 text-gray-500" />
                  </Tooltip>
                </div>
                <textarea
                  placeholder='{"Authorization": "Bearer xxx", "X-API-Key": "key123"}'
                  value={credentials.headers}
                  onChange={(e) => setCredentials(prev => ({ ...prev, headers: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <label className="text-xs text-gray-400">Cookies (JSON)</label>
                  <Tooltip content='Add cookies as JSON. Example: {"sessionId": "abc123", "authToken": "xyz789", "remember": "true"}. You can find these in browser dev tools.'>
                    <HelpCircle className="w-3 h-3 text-gray-500" />
                  </Tooltip>
                </div>
                <textarea
                  placeholder='{"sessionId": "abc123", "authToken": "xyz789"}'
                  value={credentials.cookies}
                  onChange={(e) => setCredentials(prev => ({ ...prev, cookies: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  rows={3}
                />
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 p-3 bg-gray-600 rounded-lg">
              <h4 className="text-xs font-medium text-gray-300 mb-2 flex items-center space-x-1">
                <HelpCircle className="w-3 h-3" />
                <span>Quick Help</span>
              </h4>
              <div className="text-xs text-gray-400 space-y-1">
                {authMethod === 'token' && (
                  <>
                    <div>• Find API tokens in your app's settings or developer section</div>
                    <div>• Bearer tokens usually start with "Bearer \" or "eyJ"</div>
                    <div>• Session tokens can be found in browser cookies</div>
                  </>
                )}
                {authMethod === 'login' && (
                  <>
                    <div>• Use the same credentials you use to log into the app</div>
                    <div>• Credentials are stored temporarily and auto-cleared</div>
                    <div>• Works with most standard login forms</div>
                  </>
                )}
                <div>• Headers: Copy from browser Network tab → Request Headers</div>
                <div>• Cookies: Copy from browser Application tab → Cookies</div>
                <div>• All data is processed locally and never stored permanently</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClearSession}
            className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Clear Session</span>
          </button>

          <button
            type="submit"
            disabled={isAnalyzing || !url.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Play className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Start Analysis'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalysisForm;