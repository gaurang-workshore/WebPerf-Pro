import { AuthConfig, AuthMethod } from '../types';

export interface AuthTestResult {
  success: boolean;
  statusCode: number;
  responseTime: number;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  redirectUrl?: string;
  errorMessage?: string;
  authTokens?: {
    sessionToken?: string;
    jwtToken?: string;
    csrfToken?: string;
  };
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  authConfig: AuthConfig;
  expectedResult: 'success' | 'failure';
  validationChecks: string[];
}

export class AuthenticationTester {
  private testResults: Map<string, AuthTestResult> = new Map();

  // Basic Authentication Test Cases
  generateBasicTestCases(baseUrl: string): TestCase[] {
    return [
      {
        id: 'valid-login',
        name: 'Valid Username/Password Login',
        description: 'Test successful login with correct credentials',
        authConfig: {
          method: 'login',
          credentials: {
            username: 'testuser@example.com',
            password: 'validPassword123'
          }
        },
        expectedResult: 'success',
        validationChecks: [
          'Status code is 200 or 302',
          'Session cookie is set',
          'Redirect to authenticated area',
          'No error messages in response'
        ]
      },
      {
        id: 'invalid-credentials',
        name: 'Invalid Credentials',
        description: 'Test login failure with incorrect credentials',
        authConfig: {
          method: 'login',
          credentials: {
            username: 'testuser@example.com',
            password: 'wrongPassword'
          }
        },
        expectedResult: 'failure',
        validationChecks: [
          'Status code is 401 or 403',
          'Error message is displayed',
          'No session cookie is set',
          'Remains on login page'
        ]
      },
      {
        id: 'empty-credentials',
        name: 'Empty Credentials',
        description: 'Test validation with empty username/password',
        authConfig: {
          method: 'login',
          credentials: {
            username: '',
            password: ''
          }
        },
        expectedResult: 'failure',
        validationChecks: [
          'Status code is 400 or 422',
          'Validation error messages shown',
          'Form validation prevents submission',
          'Required field indicators present'
        ]
      },
      {
        id: 'token-auth-valid',
        name: 'Valid Token Authentication',
        description: 'Test API access with valid Bearer token',
        authConfig: {
          method: 'token',
          credentials: {
            token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validtoken'
          }
        },
        expectedResult: 'success',
        validationChecks: [
          'Status code is 200',
          'Authorization header accepted',
          'Protected content accessible',
          'Valid JSON response'
        ]
      },
      {
        id: 'token-auth-invalid',
        name: 'Invalid Token Authentication',
        description: 'Test API access with invalid/expired token',
        authConfig: {
          method: 'token',
          credentials: {
            token: 'Bearer invalid.token.here'
          }
        },
        expectedResult: 'failure',
        validationChecks: [
          'Status code is 401',
          'WWW-Authenticate header present',
          'Error response with token validation message',
          'No access to protected resources'
        ]
      }
    ];
  }

  // Authentication Method Implementations
  async testFormBasedAuth(url: string, credentials: any): Promise<AuthTestResult> {
    const startTime = Date.now();
    
    try {
      // Simulate form-based login
      // Use URLSearchParams so the Content-Type header matches the body
      const loginData = new URLSearchParams();
      loginData.append('username', credentials.username);
      loginData.append('password', credentials.password);

      const response = await fetch(`${url}/login`, {
        method: 'POST',
        body: loginData.toString(),
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const responseTime = Date.now() - startTime;
      const headers = Object.fromEntries(response.headers.entries());
      
      // Extract cookies from response
      const cookies = this.extractCookies(headers['set-cookie'] || '');
      
      // Check for session tokens
      const authTokens = this.extractAuthTokens(headers, cookies);

      return {
        success: response.ok,
        statusCode: response.status,
        responseTime,
        headers,
        cookies,
        redirectUrl: response.redirected ? response.url : undefined,
        authTokens,
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        responseTime: Date.now() - startTime,
        headers: {},
        cookies: {},
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testTokenAuth(url: string, token: string): Promise<AuthTestResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      const headers = Object.fromEntries(response.headers.entries());
      const cookies = this.extractCookies(headers['set-cookie'] || '');

      return {
        success: response.ok,
        statusCode: response.status,
        responseTime,
        headers,
        cookies,
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        responseTime: Date.now() - startTime,
        headers: {},
        cookies: {},
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testCookieAuth(url: string, cookies: Record<string, string>): Promise<AuthTestResult> {
    const startTime = Date.now();
    
    try {
      const cookieString = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cookie': cookieString,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      const responseTime = Date.now() - startTime;
      const headers = Object.fromEntries(response.headers.entries());
      const responseCookies = this.extractCookies(headers['set-cookie'] || '');

      return {
        success: response.ok,
        statusCode: response.status,
        responseTime,
        headers,
        cookies: responseCookies,
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        responseTime: Date.now() - startTime,
        headers: {},
        cookies: {},
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testCustomHeaders(url: string, headers: Record<string, string>): Promise<AuthTestResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Accept': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      const responseHeaders = Object.fromEntries(response.headers.entries());
      const cookies = this.extractCookies(responseHeaders['set-cookie'] || '');

      return {
        success: response.ok,
        statusCode: response.status,
        responseTime,
        headers: responseHeaders,
        cookies,
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        responseTime: Date.now() - startTime,
        headers: {},
        cookies: {},
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Validation Methods
  validateAuthenticationFlow(result: AuthTestResult, testCase: TestCase): {
    passed: boolean;
    validationResults: Array<{ check: string; passed: boolean; details: string }>;
  } {
    const validationResults = testCase.validationChecks.map(check => {
      let passed = false;
      let details = '';

      switch (check) {
        case 'Status code is 200 or 302':
          passed = result.statusCode === 200 || result.statusCode === 302;
          details = `Actual status: ${result.statusCode}`;
          break;

        case 'Status code is 200':
          passed = result.statusCode === 200;
          details = `Actual status: ${result.statusCode}`;
          break;

        case 'Status code is 401 or 403':
          passed = result.statusCode === 401 || result.statusCode === 403;
          details = `Actual status: ${result.statusCode}`;
          break;

        case 'Status code is 401':
          passed = result.statusCode === 401;
          details = `Actual status: ${result.statusCode}`;
          break;

        case 'Session cookie is set':
          passed = Object.keys(result.cookies).some(key => 
            key.toLowerCase().includes('session') || 
            key.toLowerCase().includes('auth') ||
            key.toLowerCase().includes('token')
          );
          details = `Cookies found: ${Object.keys(result.cookies).join(', ')}`;
          break;

        case 'Authorization header accepted':
          passed = result.success && result.statusCode === 200;
          details = `Request successful: ${result.success}`;
          break;

        case 'WWW-Authenticate header present':
          passed = 'www-authenticate' in result.headers;
          details = `WWW-Authenticate: ${result.headers['www-authenticate'] || 'Not present'}`;
          break;

        case 'No session cookie is set':
          passed = !Object.keys(result.cookies).some(key => 
            key.toLowerCase().includes('session') || 
            key.toLowerCase().includes('auth')
          );
          details = `Cookies: ${Object.keys(result.cookies).join(', ') || 'None'}`;
          break;

        default:
          passed = true;
          details = 'Manual verification required';
      }

      return { check, passed, details };
    });

    const allPassed = validationResults.every(v => v.passed);
    const expectedSuccess = testCase.expectedResult === 'success';
    const actualSuccess = result.success;
    
    return {
      passed: allPassed && (expectedSuccess === actualSuccess),
      validationResults
    };
  }

  async testProtectedEndpoint(baseUrl: string, authResult: AuthTestResult): Promise<AuthTestResult> {
    const protectedUrl = `${baseUrl}/api/protected`;
    
    // Use session cookies or tokens from successful auth
    const headers: Record<string, string> = {};
    
    if (authResult.authTokens?.jwtToken) {
      headers['Authorization'] = `Bearer ${authResult.authTokens.jwtToken}`;
    }
    
    if (authResult.authTokens?.csrfToken) {
      headers['X-CSRF-Token'] = authResult.authTokens.csrfToken;
    }

    const cookieString = Object.entries(authResult.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    
    if (cookieString) {
      headers['Cookie'] = cookieString;
    }

    return this.testCustomHeaders(protectedUrl, headers);
  }

  async testSessionTimeout(baseUrl: string, authResult: AuthTestResult, timeoutSeconds: number = 30): Promise<AuthTestResult> {
    // Wait for specified timeout period
    await new Promise(resolve => setTimeout(resolve, timeoutSeconds * 1000));
    
    // Try to access protected resource with expired session
    return this.testProtectedEndpoint(baseUrl, authResult);
  }

  async testLogout(baseUrl: string, authResult: AuthTestResult): Promise<AuthTestResult> {
    const startTime = Date.now();
    
    try {
      const cookieString = Object.entries(authResult.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

      const response = await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Cookie': cookieString,
          'Accept': 'text/html,application/xhtml+xml'
        }
      });

      const responseTime = Date.now() - startTime;
      const headers = Object.fromEntries(response.headers.entries());
      const cookies = this.extractCookies(headers['set-cookie'] || '');

      return {
        success: response.ok,
        statusCode: response.status,
        responseTime,
        headers,
        cookies,
        redirectUrl: response.redirected ? response.url : undefined,
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        responseTime: Date.now() - startTime,
        headers: {},
        cookies: {},
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper Methods
  private extractCookies(setCookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    if (!setCookieHeader) return cookies;
    
    const cookieStrings = Array.isArray(setCookieHeader) 
      ? setCookieHeader 
      : setCookieHeader.split(',');
    
    cookieStrings.forEach(cookieString => {
      const [nameValue] = cookieString.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        cookies[name.trim()] = value.trim();
      }
    });
    
    return cookies;
  }

  private extractAuthTokens(headers: Record<string, string>, cookies: Record<string, string>) {
    const authTokens: any = {};
    
    // Look for JWT in Authorization header
    const authHeader = headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      authTokens.jwtToken = authHeader.substring(7);
    }
    
    // Look for session tokens in cookies
    Object.entries(cookies).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('session')) {
        authTokens.sessionToken = value;
      } else if (lowerKey.includes('csrf') || lowerKey.includes('xsrf')) {
        authTokens.csrfToken = value;
      }
    });
    
    return Object.keys(authTokens).length > 0 ? authTokens : undefined;
  }

  // Execute full test suite
  async executeTestSuite(baseUrl: string): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      successRate: number;
    };
    results: Array<{
      testCase: TestCase;
      result: AuthTestResult;
      validation: ReturnType<typeof this.validateAuthenticationFlow>;
    }>;
  }> {
    const testCases = this.generateBasicTestCases(baseUrl);
    const results = [];
    
    for (const testCase of testCases) {
      let result: AuthTestResult;
      
      // Execute test based on auth method
      switch (testCase.authConfig.method) {
        case 'login':
          result = await this.testFormBasedAuth(baseUrl, testCase.authConfig.credentials);
          break;
        case 'token':
          result = await this.testTokenAuth(baseUrl, testCase.authConfig.credentials?.token || '');
          break;
        default:
          result = {
            success: false,
            statusCode: 0,
            responseTime: 0,
            headers: {},
            cookies: {},
            errorMessage: 'Unsupported auth method'
          };
      }
      
      const validation = this.validateAuthenticationFlow(result, testCase);
      
      results.push({
        testCase,
        result,
        validation
      });
      
      this.testResults.set(testCase.id, result);
    }
    
    const passed = results.filter(r => r.validation.passed).length;
    const total = results.length;
    
    return {
      summary: {
        total,
        passed,
        failed: total - passed,
        successRate: (passed / total) * 100
      },
      results
    };
  }

  getTestResult(testId: string): AuthTestResult | undefined {
    return this.testResults.get(testId);
  }

  clearResults(): void {
    this.testResults.clear();
  }
}

export const authTester = new AuthenticationTester();