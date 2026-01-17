# 🚀 DEPLOYMENT GUIDE

## 1. TỔNG QUAN

PromptVault là một **static site**, có thể deploy lên bất kỳ static hosting nào.

## 2. BUILD PROCESS

### 2.1. Production Build

```bash
npm run build
```

**Output**: `dist/` folder chứa:
- `index.html`
- `assets/` folder với:
  - JavaScript bundles
  - CSS files
  - Other assets

### 2.2. Build Configuration

**File**: `vite.config.ts`

```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  // Production optimizations are automatic
});
```

### 2.3. Preview Build

```bash
npm run preview
```

Preview production build locally tại `http://localhost:4173` (default Vite preview port).

## 3. DEPLOYMENT OPTIONS

### 3.1. Vercel

#### 3.1.1. Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

#### 3.1.2. Via GitHub Integration

1. Push code lên GitHub
2. Import project vào Vercel
3. Vercel tự động detect Vite project
4. Deploy tự động

**Configuration** (auto-detected):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.2. Netlify

#### 3.2.1. Via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

#### 3.2.2. Via Netlify Dashboard

1. Create new site
2. Connect to Git repository
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### 3.2.3. Netlify Configuration

**File**: `netlify.toml` (optional)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3.3. GitHub Pages

#### 3.3.1. Setup

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add scripts to package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**:
   - Settings → Pages
   - Source: `gh-pages` branch
   - Folder: `/ (root)`

#### 3.3.2. Base Path Configuration

Nếu deploy vào subdirectory, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

### 3.4. Cloudflare Pages

1. Connect Git repository
2. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 3.5. AWS S3 + CloudFront

#### 3.5.1. Build

```bash
npm run build
```

#### 3.5.2. Upload to S3

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### 3.5.3. CloudFront Distribution

- Origin: S3 bucket
- Default root object: `index.html`
- Error pages: Redirect 404 → `/index.html` (200)

### 3.6. Any Static Hosting

Upload `dist/` folder contents lên:
- Any web server
- CDN
- Static file hosting

## 4. ENVIRONMENT VARIABLES

### 4.1. Development

**File**: `.env.local`

```env
GEMINI_API_KEY=your_key_here
```

### 4.2. Production

Set environment variables trong hosting platform:

**Vercel**:
- Project Settings → Environment Variables

**Netlify**:
- Site Settings → Environment Variables

**Note**: Hiện tại `GEMINI_API_KEY` chưa được sử dụng trong code.

## 5. BUILD OPTIMIZATION

### 5.1. Vite Automatic Optimizations

Vite tự động:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization

### 5.2. Manual Optimizations

#### 5.2.1. Bundle Analysis

```bash
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});
```

#### 5.2.2. Compression

Vite tự động compress assets. Có thể thêm gzip/brotli:

```bash
npm install --save-dev vite-plugin-compression

# vite.config.ts
import compress from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compress({ algorithm: 'gzip' }),
  ],
});
```

## 6. ROUTING CONFIGURATION

### 6.1. SPA Routing

PromptVault sử dụng view-based routing (không có URL routing). Tất cả routes đều serve `index.html`.

### 6.2. Server Configuration

**Apache** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Netlify** (`_redirects`):
```
/*    /index.html   200
```

## 7. CORS & SECURITY

### 7.1. CORS

Không cần CORS config vì không có API calls.

### 7.2. Security Headers

Có thể thêm security headers:

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 8. PERFORMANCE MONITORING

### 8.1. Lighthouse

Test performance với Lighthouse:
- Open Chrome DevTools
- Lighthouse tab
- Run audit

### 8.2. Web Vitals

Có thể thêm Web Vitals tracking:

```bash
npm install web-vitals
```

```typescript
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

## 9. CI/CD PIPELINE

### 9.1. GitHub Actions

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 9.2. GitLab CI

**File**: `.gitlab-ci.yml`

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - # Deploy script
  only:
    - main
```

## 10. DOMAIN & SSL

### 10.1. Custom Domain

1. Add custom domain trong hosting platform
2. Configure DNS records:
   - **A record**: Point to hosting IP
   - **CNAME**: Point to hosting domain

### 10.2. SSL Certificate

Most hosting platforms tự động cung cấp SSL:
- Vercel: Auto SSL
- Netlify: Auto SSL
- Cloudflare: Auto SSL

## 11. TROUBLESHOOTING

### 11.1. Build Fails

**Issue**: Build errors

**Solution**:
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### 11.2. 404 on Refresh

**Issue**: 404 khi refresh page

**Solution**: Configure server redirects (xem section 6)

### 11.3. Assets Not Loading

**Issue**: Images/assets không load

**Solution**: Check base path trong `vite.config.ts`

### 11.4. Environment Variables Not Working

**Issue**: Env vars không được inject

**Solution**: 
- Check prefix: `VITE_` cho Vite
- Rebuild sau khi thay đổi env vars

## 12. ROLLBACK STRATEGY

### 12.1. Version Control

- Git tags cho mỗi release
- Keep previous builds

### 12.2. Hosting Platform Rollback

**Vercel**: 
- Deployments → Select previous deployment → Promote to Production

**Netlify**:
- Deploys → Select previous deploy → Publish deploy

## 13. MONITORING

### 13.1. Error Tracking

Có thể thêm error tracking:

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  // ...
});
```

### 13.2. Analytics

Có thể thêm analytics:

```bash
npm install @vercel/analytics
```

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <App />
      <Analytics />
    </>
  );
}
```

## 14. CHECKLIST

Trước khi deploy:

- ✅ Build thành công (`npm run build`)
- ✅ Preview build hoạt động (`npm run preview`)
- ✅ No console errors
- ✅ All features tested
- ✅ Environment variables set
- ✅ Domain configured (nếu có)
- ✅ SSL enabled
- ✅ Redirects configured (SPA routing)

---

## TÓM TẮT

Deployment process:

1. ✅ **Build**: `npm run build`
2. ✅ **Test**: `npm run preview`
3. ✅ **Deploy**: Upload `dist/` hoặc dùng hosting platform
4. ✅ **Configure**: Routing, domain, SSL

Deployment options:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ GitHub Pages
- ✅ Any static hosting

---

**Xem thêm:**
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details
