# 🚀 Complete Installation Guide - InvestPro Platform (Italian & English Versions)

## 📋 Overview

This comprehensive guide will help you install and run both versions of the investment platform locally:

- **Italian Version:** Available at https://gd7waw5mr6.space.minimax.io
- **English Version:** Available at https://3aiypdtkhf.space.minimax.io

## 🔧 System Prerequisites

### Required Software

1. **Node.js** (version 18.x or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **PNPM** (recommended package manager)
   - Installation: `npm install -g pnpm`
   - Verify: `pnpm --version`

3. **Git** (for cloning repositories)
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Code Editor** (recommended: VS Code)
   - Download: https://code.visualstudio.com/

### System Requirements
- **RAM:** Minimum 4GB, recommended 8GB+
- **Disk Space:** 2GB available
- **Operating System:** Windows 10+, macOS 10.15+, Ubuntu 18.04+

## 📁 Project Structure

Both versions are available in the workspace:

```
workspace/
├── investment-platform/          # Italian Version
│   ├── src/
│   ├── package.json
│   └── README.md
└── investpro-english/           # English Version
    ├── src/
    ├── package.json
    └── INSTALLATION.md
```

## 🇮🇹 Italian Version Installation

### Step 1: Navigate to Directory
```bash
cd investment-platform
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Start Development Server
```bash
pnpm dev
```
- Application will be available at: `http://localhost:5173`
- Server supports automatic hot-reload

### Step 4: Build for Production
```bash
pnpm build
```
- Production files will be generated in: `dist/`

### Step 5: Test Production Build
```bash
pnpm preview
```
- Test optimized version at: `http://localhost:4173`

## 🇺🇸 English Version Installation

### Step 1: Navigate to Directory
```bash
cd investpro-english
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Start Development Server
```bash
pnpm dev
```
- Application will be available at: `http://localhost:5174` (different port)

### Step 4: Build for Production
```bash
pnpm build
```

### Step 5: Test Production Build
```bash
pnpm preview
```

## 🌐 Demo Credentials

For both versions, use the same credentials:

- **Email:** `user@example.com` (Italian version) or `demo@example.com` (English version)
- **Password:** `password`

## 🚀 Server Deployment

### Option 1: Static Hosting (Recommended)

1. **Build the project:**
```bash
pnpm build
```

2. **Upload the `dist/` folder** to any static hosting provider:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront
   - DigitalOcean App Platform

### Option 2: Nginx Server

1. **Install Nginx:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **Configure virtual host:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/investpro/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static file optimizations
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **Upload files:**
```bash
sudo cp -r dist/* /var/www/html/investpro/dist/
sudo systemctl restart nginx
```

### Option 3: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Build and Run:**
```bash
docker build -t investpro .
docker run -p 80:80 investpro
```

## 🔧 Customization and Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_YAHOO_FINANCE_API=https://query1.finance.yahoo.com

# Analytics Configuration (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_ENABLE_ANALYTICS=true

# Security Configuration
VITE_JWT_SECRET=your-jwt-secret-key
VITE_ENABLE_AUTH=true

# Feature Configuration
VITE_ENABLE_MARKOWITZ=true
VITE_ENABLE_REAL_DATA=true
```

### Theme and Color Configuration

Modify the `tailwind.config.js` file:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Add your custom colors
      }
    }
  }
}
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. Port already in use Error
```bash
# Check active processes
lsof -i :5173
# Kill process if necessary
kill -9 <PID>
```

#### 3. TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

#### 4. TailwindCSS Issues
```bash
# Regenerate CSS
pnpm tailwind:build
```

#### 5. API CORS Errors
Add to your proxy configuration:
```javascript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 📊 Performance Monitoring

### Integrated Tools

1. **Lighthouse CI:** For automated audits
2. **Bundle Analyzer:** To analyze bundle sizes
```bash
pnpm add -D vite-bundle-analyzer
```

3. **Performance Monitoring:**
```bash
# Install Web Vitals
pnpm add web-vitals
```

## 🔐 Security and Best Practices

### Security Headers (Nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;" always;
```

### HTTPS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📚 Additional Resources

### Technical Documentation
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **TailwindCSS:** https://tailwindcss.com/
- **Vite:** https://vitejs.dev/

### APIs Used
- **Yahoo Finance:** For real-time financial data
- **Chart.js:** For chart visualizations
- **Zustand:** For state management

### Community and Support
- **GitHub Issues:** For bug reports
- **Discord Community:** For community support
- **Email Support:** support@investpro.com

## ✅ Post-Installation Checklist

- [ ] Both versions start correctly
- [ ] Login works with demo credentials
- [ ] Dashboard loads data correctly
- [ ] Charts display without errors
- [ ] Portfolio management works
- [ ] Markowitz algorithm calculates results
- [ ] Responsive design works on mobile
- [ ] Satisfactory performance (< 3s loading)
- [ ] No browser console errors
- [ ] Production build completes successfully

## 🎯 Next Steps

Once successfully installed:

1. **Explore Features:** Test all platform sections
2. **Customize:** Modify colors, logo, and branding to your preferences
3. **Deploy:** Put your customized version online
4. **Monitor:** Implement analytics and error monitoring
5. **Evolve:** Add new features based on user feedback

## 🆘 Support

If you encounter issues during installation:

1. Check this guide for common solutions
2. Review error logs in the terminal
3. Check browser console for JavaScript errors
4. Consult documentation for the technologies used
5. Open an issue on the GitHub repository if the problem persists

**Good luck with your investment platform! 🚀📈**

---

## 📱 Live Demo Access

### Italian Version
- **URL:** https://gd7waw5mr6.space.minimax.io
- **Email:** user@example.com
- **Password:** password

### English Version
- **URL:** https://3aiypdtkhf.space.minimax.io
- **Email:** demo@example.com
- **Password:** password

Both platforms include:
- Personal investment dashboard
- In-depth analysis of financial instruments (CFDs, stocks, futures, indices)
- Portfolio management with profit estimates
- Markowitz optimization algorithm
- Professional responsive interface