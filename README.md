# 🌐 WebPerf Pro

> A comprehensive web performance analyzer for authenticated applications with advanced security auditing and real-time testing capabilities.

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF.svg)

![WebPerf Pro Screenshot](https://github.com/user-attachments/assets/b98b0d07-da92-467e-bce0-c760f7b03299)

---

## ✨ Features

### 🔍 Performance Analysis

- ✅ Core Web Vitals monitoring (LCP, FID, CLS)
- ✅ Request waterfall visualization with detailed timing
- ✅ Asset breakdown analysis (CSS, JS, images, fonts)
- ✅ Load time optimization insights
- ✅ Performance metrics dashboard

### 🛡️ Security Auditing

- 🔐 Comprehensive security scoring (0–100 scale)
- 🔐 HTTP security headers analysis
- 🔐 SSL/TLS encryption validation
- 🔐 Authentication flow testing
- 🔐 Vulnerability detection and recommendations

### 🔐 Authentication Support

- 🔑 Multiple auth methods: Token, form login, headers, cookies
- 🔑 Session management testing
- 🔑 Protected endpoint validation
- 🔑 Memberstack integration
- 🔑 Interactive authentication flows

### 🧪 Advanced Testing

- 🧠 Automated auth test suite
- 🧠 CSRF protection testing
- 🧠 Session timeout validation
- 🧠 Logout functionality testing
- 🧠 API endpoint security assessment

### 📊 Reporting & Export

- 📝 PDF report generation
- 📝 JSON data export
- 📝 Native browser sharing
- 📝 Visualizations with Recharts

---

## 🚀 Quick Start

### 📦 Prerequisites

- Node.js 18+
- npm 8+ or yarn

### ⚙️ Installation

```bash
git clone https://github.com/gaurang-workshore/WebPerf-Pro.git
cd webperf-pro
npm install
# or
yarn install
```

### ▶️ Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 🏗️ Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **React 18.3.1** — UI Framework
- **TypeScript 5.6.3** — Static Typing
- **Vite 5.4.8** — Build Tool

#### 🎨 UI

- Tailwind CSS
- Lucide React Icons
- Recharts (Charts)

#### 📊 Analysis

- jsPDF (PDF)
- Performance API
- Fetch API

#### 🧰 Dev Tools

- ESLint & TypeScript ESLint
- PostCSS + Autoprefixer

---

## 📝 Usage Guide

### 🧪 Run Analysis

1. Enter target URL
2. Choose auth method:
    - Public / Token / Login / Interactive
3. Configure headers/cookies (if needed)
4. Start analysis
5. Explore results in:
    - Overview
    - Performance
    - Security
    - Waterfall
    - Auth Tests

### 🔐 Auth Examples

**Token-based**
```json
{
  "headers": {
    "Authorization": "Bearer YOUR_TOKEN",
    "X-API-Key": "your-api-key"
  }
}
```

**Cookie-based**
```json
{
  "cookies": {
    "sessionId": "abc123",
    "authToken": "xyz789"
  }
}
```

### 🔁 Memberstack Support

Auto-detection and integration in browser environment.

### 🔎 Security Checks

- CSP / HSTS / X-Frame headers
- TLS/SSL validation
- Auth/session issues

### 📋 Test Suite

- Valid/invalid login flows
- Session expiration
- Protected resource access

---

## ⚙️ Configuration

### 🔧 Environment

Create `.env`:
```env
VITE_ANALYTICS_ID=your-analytics-id
VITE_API_BASE_URL=https://api.example.com
```

### 🔌 Custom Auth

Extend in `src/services/authTester.ts`:
```ts
export class CustomAuthProvider {
  async authenticate(config: AuthConfig): Promise<AuthResult> {
    // Custom logic
  }
}
```

---

## 🧪 Testing & Linting

```bash
npm run test      # Unit tests
npm run lint      # Linting
npx tsc --noEmit  # Type checking
```

---

## 📁 Structure

```
webperf-pro/
├── src/
│   ├── components/
│   ├── services/
│   ├── types/
├── public/
├── docs/
└── dist/
```

---

## 🤝 Contributing

1. Fork + branch → `feature/xyz`
2. Add code + tests
3. Run tests + lint
4. PR with clear description

### ✅ Guidelines

- TypeScript strict mode
- Functional React components
- JSDoc for logic-heavy functions
- Accessibility & responsive design

---

## 🙏 Acknowledgments

- React / Vite / Tailwind / jsPDF / Recharts / Lucide

---

## 📞 Support

- GitHub Issues
- `/docs` folder for help
- GitHub Discussions

---

## 🔮 Roadmap

- [ ] Real-time dashboard
- [ ] CI/CD plugins
- [ ] Vulnerability scanner
- [ ] Performance budgets
- [ ] Multi-page analysis
- [ ] API documentation generator
- [ ] Report template builder
- [ ] Test framework integrations

---

**Built with ❤️ by the workshore team**
