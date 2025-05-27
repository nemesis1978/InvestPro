# InvestPro English Version - Installation Guide

This guide provides step-by-step instructions for installing, running, and deploying the English version of the InvestPro investment platform.

## Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later
- Git (for cloning the repository)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/investpro-english.git
cd investpro-english
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Development Server

```bash
pnpm dev
```

This will start the development server at `http://localhost:5173` (or another port if 5173 is already in use).

### 4. Development Testing

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- Error overlay for debugging
- ESLint integration for code quality

## Building for Production

### 1. Create Production Build

```bash
pnpm build
```

This will generate optimized production files in the `dist` directory, including:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- HTML with proper references

### 2. Preview Production Build Locally

```bash
pnpm preview
```

This will serve the production build locally for testing before deployment.

## Deployment

### Option 1: Static Hosting (Recommended)

The built application is a static site that can be hosted on any static hosting service:

1. Copy the contents of the `dist` directory to your web server
2. Configure your web server to serve `index.html` for all routes (for SPA support)

Example with Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Docker Deployment

1. Build a Docker image:
```bash
docker build -t investpro-english .
```

2. Run the container:
```bash
docker run -p 80:80 investpro-english
```

## Environment Configuration

The application supports environment variables for configuration:

1. Create a `.env` file in the project root with any of these variables:
```
VITE_API_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=true
```

2. Reference in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed: `pnpm install`
   - Clear cache: `pnpm cache clean`
   - Try with Node.js LTS version

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check for CORS issues if connecting to APIs

3. **Styling Issues**
   - Run `pnpm tailwind:build` to rebuild CSS
   - Check browser compatibility for CSS features

## Support

For additional support:
- Check the GitHub repository issues
- Contact the development team at support@investpro.com

## Live Demo

A live demo of the English version is available at:
[https://3aiypdtkhf.space.minimax.io](https://3aiypdtkhf.space.minimax.io)

Demo credentials:
- **Email**: demo@example.com
- **Password**: password