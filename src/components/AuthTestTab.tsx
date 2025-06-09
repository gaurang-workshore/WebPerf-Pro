import React from 'react';
import AuthTestRunner from './AuthTestRunner';
import { Shield, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface AuthTestTabProps {
  targetUrl: string;
}

const AuthTestTab: React.FC<AuthTestTabProps> = ({ targetUrl }) => {
  const handleTestComplete = (results: any) => {
    console.log('Authentication test results:', results);
  };

  return (
    <div className="space-y-6">
      {/* Test Plan Overview */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Authentication Test Plan</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Basic Authentication Tests</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Valid Credentials Test</div>
                  <div className="text-xs text-gray-400">Verify successful login with correct username/password</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Invalid Credentials Test</div>
                  <div className="text-xs text-gray-400">Test login failure with incorrect credentials</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Empty Credentials Test</div>
                  <div className="text-xs text-gray-400">Validate form validation with empty fields</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Token Authentication Test</div>
                  <div className="text-xs text-gray-400">Test API access with Bearer tokens</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Validation Checks</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">HTTP Status Validation</div>
                  <div className="text-xs text-gray-400">200 OK for success, 401/403 for auth failures</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Session Management</div>
                  <div className="text-xs text-gray-400">Cookie presence, token extraction, session timeout</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Security Headers</div>
                  <div className="text-xs text-gray-400">WWW-Authenticate, CSRF protection, secure cookies</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Protected Endpoints</div>
                  <div className="text-xs text-gray-400">Access control verification, logout functionality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Methods Supported */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Supported Authentication Methods</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-white">Form-Based Auth</span>
            </div>
            <p className="text-xs text-gray-400">Traditional username/password login forms with session cookies</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-white">Token-Based Auth</span>
            </div>
            <p className="text-xs text-gray-400">Bearer tokens, JWT, API keys in Authorization header</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-white">Cookie-Based Auth</span>
            </div>
            <p className="text-xs text-gray-400">Session cookies, authentication cookies, CSRF tokens</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-white">Custom Headers</span>
            </div>
            <p className="text-xs text-gray-400">API keys, custom auth headers, proprietary auth schemes</p>
          </div>
        </div>
      </div>

      {/* Test Runner */}
      <AuthTestRunner 
        targetUrl={targetUrl} 
        onTestComplete={handleTestComplete}
      />

      {/* Expected Outcomes */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Expected Test Outcomes</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-green-400 mb-3">Successful Authentication Should:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Return HTTP 200 OK or 302 redirect status</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Set session cookies or return auth tokens</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Redirect to authenticated dashboard/area</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Allow access to protected endpoints</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Include proper security headers</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-red-400 mb-3">Failed Authentication Should:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Return HTTP 401 Unauthorized or 403 Forbidden</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Display clear error messages</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Not set authentication cookies/tokens</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Remain on login page or show error</span>
              </li>
              <li className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Block access to protected resources</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestTab;