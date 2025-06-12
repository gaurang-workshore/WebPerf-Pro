# WebPerf Pro

> A comprehensive web performance analyzer for authenticated applications with advanced security auditing and real-time testing capabilities.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF.svg)](https://vitejs.dev/)

![WebPerf Pro - Authenticated Application Performance Analyzer · 10 46am · 06-12](https://github.com/user-attachments/assets/b98b0d07-da92-467e-bce0-c760f7b03299)


## 🌟 Features

### Performance Analysis
- **Core Web Vitals monitoring** (LCP, FID, CLS)
- **Request waterfall visualization** with detailed timing
- **Asset breakdown analysis** (CSS, JS, images, fonts)
- **Load time optimization insights**
- **Performance metrics dashboard**

### Security Auditing
- **Comprehensive security scoring** (0-100 scale)
- **HTTP security headers analysis**
- **SSL/TLS encryption validation**
- **Authentication flow testing**
- **Vulnerability detection and recommendations**

### Authentication Support
- **Multiple auth methods**: Token-based, form login, custom headers, cookies
- **Session management testing**
- **Protected endpoint validation**
- **Memberstack integration**
- **Interactive authentication flows**

### Advanced Testing
- **Authentication test suite** with automated validation
- **CSRF protection testing**
- **Session timeout verification**
- **Logout functionality testing**
- **API endpoint security assessment**

### Reporting & Export
- **PDF report generation** with detailed metrics
- **JSON data export** for integration
- **Share functionality** with native browser API
- **Visual charts and graphs** using Recharts


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+ or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webperf-pro.git
   cd webperf-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```


## 🛠️ Technology Stack

### Core
- **React 18.3.1** - UI framework
- **TypeScript 5.6.3** - Type safety
- **Vite 5.4.8** - Build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4.13** - Utility-first CSS
- **Lucide React** - Icon library
- **Recharts 2.15.3** - Chart visualization

### Analysis & Reporting
- **jsPDF 2.5.2** - PDF generation
- **Performance API** - Web performance metrics
- **Fetch API** - Network request handling

### Development Tools
- **ESLint 9.12.0** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes


## 📖 Usage

### Basic Analysis

1. **Enter target URL** in the analysis form
2. **Select authentication method**:
   - **Public**: No authentication required
   - **Token**: API keys or Bearer tokens
   - **Login**: Username/password authentication
   - **Interactive**: Manual browser authentication

3. **Configure authentication** (if required):
   - Add credentials, headers, or cookies
   - Use JSON format for complex configurations

4. **Start analysis** and monitor progress
5. **Review results** across multiple tabs:
   - Overview with key metrics
   - Detailed performance analysis
   - Security audit findings
   - Request waterfall view
   - Authentication test results

### Authentication Examples

#### Token-based Authentication
```json
{
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "X-API-Key": "your-api-key"
  }
}
```

#### Cookie-based Authentication
```json
{
  "cookies": {
    "sessionId": "abc123def456",
    "authToken": "xyz789",
    "remember": "true"
  }
}
```

### Advanced Features

#### Memberstack Integration
WebPerf Pro automatically detects and integrates with Memberstack authentication when available in the browser environment.

#### Security Testing
The built-in security audit checks for:
- Missing security headers (CSP, HSTS, X-Frame-Options)
- SSL/TLS configuration
- Authentication vulnerabilities
- Session management issues

#### Test Suite Execution
Run comprehensive authentication tests:
- Valid/invalid credential testing
- Session management validation
- Protected endpoint access verification
- Error handling assessment


## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Optional: Analytics tracking
VITE_ANALYTICS_ID=your-analytics-id

# Optional: API endpoints
VITE_API_BASE_URL=https://api.example.com
```

### Custom Authentication Providers
Extend authentication support by modifying `src/services/authTester.ts`:

```typescript
// Add custom authentication method
export class CustomAuthProvider {
  async authenticate(config: AuthConfig): Promise<AuthResult> {
    // Implementation
  }
}
```


## 🧪 Testing

### Run Tests
```bash
npm run test
# or
yarn test
```

### Linting
```bash
npm run lint
# or
yarn lint
```

### Type Checking
```bash
npx tsc --noEmit
```


## 📁 Project Structure

```
webperf-pro/
├── src/
│   ├── components/         # React components
│   │   ├── AnalysisForm.tsx
│   │   ├── PerformanceMetrics.tsx
│   │   ├── SecurityAudit.tsx
│   │   ├── WaterfallChart.tsx
│   │   └── AuthTestRunner.tsx
│   ├── services/          # Business logic
│   │   ├── analyzer.ts
│   │   └── authTester.ts
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx           # Main application
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── docs/                 # Documentation
└── dist/                 # Production build
```


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use descriptive component and function names
- Add JSDoc comments for complex functions
- Maintain responsive design principles
- Ensure accessibility standards (WCAG 2.1)

### Code Style

- Use ESLint configuration provided
- Follow React functional component patterns
- Implement proper error handling
- Use TypeScript strict mode
- Maintain consistent naming conventions


## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Recharts](https://recharts.org/) - Chart library
- [jsPDF](https://github.com/MrRio/jsPDF) - PDF generation


## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/webperf-pro/issues)
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Join our discussions in GitHub Discussions


## 🔮 Roadmap

- [ ] Real-time monitoring dashboard
- [ ] CI/CD integration plugins
- [ ] Advanced security vulnerability scanning
- [ ] Performance budget tracking
- [ ] Multi-page application analysis
- [ ] API endpoint documentation generation
- [ ] Custom report templates
- [ ] Integration with popular testing frameworks

---

**Built with ❤️ by the workshore team**
