# Configuration Documentation

## Overview

This document covers all configuration aspects of the Yahshua HRIS frontend application, including environment setup, build configuration, development tools, and deployment settings.

## Environment Configuration

### Environment Variables

The application uses environment variables for configuration management:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yahshuahris.com

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-WJXTBQ5XYH

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-MMRM9NHW

# Meta Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=2144124972722813

# LinkedIn Insights
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=7401380

# Development
NODE_ENV=development|production
```

### Environment Files

```bash
.env.local          # Local development (ignored by git)
.env.development    # Development environment
.env.production     # Production environment
.env.example        # Example file with all variables
```

## Next.js Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_API_URL: process.env.NEXT_API_URL
  },
  
  images: {
    remotePatterns: [
      // Localhost
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      // Staging
      {
        protocol: 'https',
        hostname: 's1-api.yahshuahris.com',
        port: '',
        pathname: '/**',
      },
      // Production
      {
        protocol: 'https',
        hostname: 'yahshua-hris-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  reactStrictMode: false,
  
  experimental: {},
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // PostHog proxy configuration
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  
  // Support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
```

### Key Configuration Sections

#### Image Optimization
- Configured remote patterns for development, staging, and production
- S3 bucket integration for production assets
- Local development server support

#### Build Optimization
- React Strict Mode disabled for compatibility
- ESLint and TypeScript errors ignored during builds for flexibility
- Experimental features section for future enhancements

#### Analytics Integration
- PostHog proxy configuration for better performance
- Rewrite rules for analytics endpoints
- Privacy-compliant tracking setup

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Key TypeScript Features
- Strict mode enabled for better type safety
- Path mapping with `@/*` alias
- Next.js plugin integration
- Modern module resolution
- Incremental compilation for faster builds

## Tailwind CSS Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'indigo-dye': '#2C3F58',
        'savoy-blue': '#355FD0',
      },
      fontFamily: {
        sans: ['Golos Text', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
```

### Custom Design System
- **Custom Colors**: Brand-specific color palette
- **Typography**: Golos Text font integration
- **Responsive Design**: Mobile-first responsive utilities
- **Component Classes**: Utility-first CSS approach

### PostCSS Configuration

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## ESLint Configuration

### .eslintrc.json

```json
{
  "extends": "next/core-web-vitals"
}
```

### Linting Rules
- Next.js recommended rules
- React best practices
- Accessibility guidelines
- Performance optimizations

## Development Tools Configuration

### VSCode Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:18-alpine

EXPOSE 3000

RUN apk update && apk add bash
RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN chmod +x node_modules/.bin/next
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
```

### Docker Features
- Node.js 18 Alpine base image
- Bash shell support
- Automatic dependency installation
- Entrypoint script for initialization
- Port 3000 exposure

### .dockerignore

```
node_modules
.next
.git
.env.local
Dockerfile
.dockerignore
README.md
```

## Deployment Configuration

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/ingest/:path*",
      "destination": "https://us.i.posthog.com/:path*"
    }
  ]
}
```

### Production Optimizations
- Automatic static optimization
- Image optimization
- Code splitting
- Edge functions for API routes
- CDN distribution

## Analytics Configuration

### PostHog Setup

```typescript
// lib/posthog.ts
import { PostHog } from 'posthog-node';

export const posthog = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  }
);
```

### Google Analytics Integration

```typescript
// Google Analytics configuration in layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-WJXTBQ5XYH"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WJXTBQ5XYH');
  `}
</Script>
```

## Security Configuration

### Content Security Policy

```javascript
// next.config.js security headers
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

### Session Security

```typescript
// lib/session.ts
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: 'iron_session_id',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
```

## Performance Configuration

### Bundle Analyzer

```javascript
// Enable bundle analysis
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### Performance Monitoring

```typescript
// Core Web Vitals tracking
export function reportWebVitals(metric) {
  // Send to analytics
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}
```

## Testing Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Testing Tools
- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing
- MSW for API mocking

## CI/CD Configuration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoring and Logging

### Error Tracking

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Application Monitoring

```typescript
// Performance monitoring
import { withSentryConfig } from '@sentry/nextjs';

const sentryWebpackPluginOptions = {
  silent: true,
  org: 'yahshua',
  project: 'hris-frontend',
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

## Best Practices

### Configuration Management
1. **Environment Variables**: Use environment variables for all configurable values
2. **Security**: Never commit secrets or sensitive data
3. **Validation**: Validate environment variables at startup
4. **Documentation**: Document all configuration options
5. **Defaults**: Provide sensible defaults for optional configurations

### Development Workflow
1. **Local Setup**: Easy local development setup
2. **Hot Reloading**: Fast development feedback loop
3. **Type Safety**: Strong typing throughout the application
4. **Code Quality**: Automated linting and formatting
5. **Testing**: Comprehensive testing strategy

### Production Readiness
1. **Performance**: Optimized builds and assets
2. **Security**: Security headers and best practices
3. **Monitoring**: Error tracking and performance monitoring
4. **Deployment**: Automated deployment pipeline
5. **Scaling**: Prepared for horizontal scaling
