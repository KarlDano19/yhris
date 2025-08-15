# Deployment Guide

## Overview

This guide covers the deployment process for the Yahshua HRIS frontend application, including environment setup, build optimization, and deployment to various platforms.

## Deployment Platforms

### Vercel (Recommended)

Vercel provides the best Next.js deployment experience with automatic optimizations.

#### Automatic Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Vercel Configuration

```json
// vercel.json
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
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/ingest/:path*",
      "destination": "https://us.i.posthog.com/:path*"
    }
  ]
}
```

#### Environment Variables Setup

```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
vercel env add NEXT_PUBLIC_GA_TRACKING_ID production
```

### Docker Deployment

#### Dockerfile Optimization

```dockerfile
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}
    volumes:
      - ./.env.production:/app/.env.production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    restart: unless-stopped
```

### AWS Deployment

#### S3 + CloudFront

```bash
# Build for static export
npm run build
npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### EC2 Deployment

```bash
# EC2 setup script
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup application
git clone https://github.com/yahshua/hris-frontend.git
cd hris-frontend
npm install
npm run build

# Start with PM2
pm2 start npm --name "hris-frontend" -- start
pm2 startup
pm2 save
```

## Build Optimization

### Production Build Configuration

```javascript
// next.config.js (production optimizations)
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compress output
  compress: true,
  
  // Generate sitemap
  async generateBuildId() {
    return 'hris-' + new Date().toISOString().slice(0, 10);
  },
  
  // Security headers
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
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;
```

### Performance Optimizations

```typescript
// Performance monitoring
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$web_vitals', metric);
    }
    
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}
```

## Environment Management

### Environment-Specific Configurations

#### Development
```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_POSTHOG_KEY=phc_dev_key
NODE_ENV=development
```

#### Staging
```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.yahshuahris.com
NEXT_PUBLIC_POSTHOG_KEY=phc_staging_key
NODE_ENV=production
```

#### Production
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yahshuahris.com
NEXT_PUBLIC_POSTHOG_KEY=phc_production_key
NODE_ENV=production
```

### Configuration Validation

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
});
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run tests
        run: npm run test
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_POSTHOG_KEY: ${{ secrets.NEXT_PUBLIC_POSTHOG_KEY }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/
    - .next/cache/

test:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm run test

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:18-alpine
  script:
    - npm install -g vercel
    - vercel deploy --token $VERCEL_TOKEN --prod
  only:
    - main
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

```nginx
# nginx.conf
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### CloudFlare Configuration

```javascript
// cloudflare-worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Security headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
  }
  
  // Fetch from origin
  const response = await fetch(request)
  
  // Add security headers
  const newResponse = new Response(response.body, response)
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value)
  })
  
  return newResponse
}
```

## Monitoring and Analytics

### Application Monitoring

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter out non-critical errors in production
    if (process.env.NODE_ENV === 'production') {
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'ChunkLoadError') {
          return null; // Don't send chunk load errors
        }
      }
    }
    return event;
  },
});

export const captureError = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error:', error, context);
  }
};
```

### Performance Monitoring

```typescript
// lib/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: label,
        value: Math.round(duration),
      });
    }
    
    return duration;
  }

  measurePageLoad(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          'page_load_time': navigation.loadEventEnd - navigation.fetchStart,
          'dom_content_loaded': navigation.domContentLoadedEventEnd - navigation.fetchStart,
          'first_paint': performance.getEntriesByType('paint')[0]?.startTime || 0,
        };
        
        Object.entries(metrics).forEach(([name, value]) => {
          if (window.gtag) {
            window.gtag('event', 'timing_complete', {
              name,
              value: Math.round(value),
            });
          }
        });
      });
    }
  }
}
```

## Backup and Recovery

### Database Backup Strategy

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/hris-frontend"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup user uploads
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /app/public/uploads/

# Backup configuration
cp .env.production "$BACKUP_DIR/env_$DATE.backup"

# Upload to S3
aws s3 cp "$BACKUP_DIR/" s3://hris-backups/frontend/ --recursive

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete
```

### Disaster Recovery Plan

```markdown
## Recovery Procedures

### 1. Application Recovery
- Redeploy from latest git tag
- Restore environment variables
- Verify all integrations

### 2. Data Recovery
- Restore user uploads from S3 backup
- Verify file integrity
- Update file references if needed

### 3. Configuration Recovery
- Restore environment configuration
- Update DNS if needed
- Verify SSL certificates

### 4. Verification Checklist
- [ ] Application loads correctly
- [ ] User authentication works
- [ ] API integration functional
- [ ] File uploads/downloads work
- [ ] Analytics tracking active
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build

# Check for TypeScript errors
npm run type-check

# Check for ESLint issues
npm run lint
```

#### Environment Variable Issues

```typescript
// Validate environment variables at build time
function validateEnv() {
  const required = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_POSTHOG_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnv();
```

#### Performance Issues

```bash
# Analyze bundle size
ANALYZE=true npm run build

# Check for large dependencies
npm ls --depth=0 --long

# Monitor runtime performance
npm run build && npm start
```

### Health Check Endpoints

```typescript
// pages/api/health.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.BUILD_ID || 'unknown',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
  };
  
  res.status(200).json(health);
}
```

## Best Practices

### Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificate valid
- [ ] Security headers enabled
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Performance monitoring setup
- [ ] Backup procedures tested
- [ ] Health checks functional
- [ ] DNS configuration correct
- [ ] CDN cache invalidated

### Security Best Practices

1. **HTTPS Only**: Always use HTTPS in production
2. **Security Headers**: Implement all recommended security headers
3. **Dependency Updates**: Keep dependencies updated
4. **Secret Management**: Use secure secret management
5. **Access Control**: Implement proper access controls

### Performance Best Practices

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Optimize all images
3. **Caching**: Implement proper caching strategies
4. **Bundle Analysis**: Regular bundle size analysis
5. **Monitoring**: Continuous performance monitoring

This deployment guide ensures a smooth, secure, and performant production deployment of the Yahshua HRIS frontend application.
