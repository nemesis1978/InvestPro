# 🚀 Guida Completa Installazione InvestPro (Versioni Italiana e Inglese)

## 📋 Panoramica

Questa guida ti permetterà di installare e far funzionare localmente entrambe le versioni della piattaforma di investimenti:

- **Versione Italiana:** Disponibile su https://gd7waw5mr6.space.minimax.io
- **Versione Inglese:** Disponibile su https://3aiypdtkhf.space.minimax.io

## 🔧 Prerequisiti di Sistema

### Software Richiesto

1. **Node.js** (versione 18.x o superiore)
   - Download: https://nodejs.org/
   - Verifica installazione: `node --version`

2. **PNPM** (package manager raccomandato)
   - Installazione: `npm install -g pnpm`
   - Verifica: `pnpm --version`

3. **Git** (per clonare il repository)
   - Download: https://git-scm.com/
   - Verifica: `git --version`

4. **Editor di Codice** (raccomandato: VS Code)
   - Download: https://code.visualstudio.com/

### Specifiche Sistema
- **RAM:** Minimo 4GB, raccomandato 8GB+
- **Spazio Disco:** 2GB disponibili
- **Sistema Operativo:** Windows 10+, macOS 10.15+, Ubuntu 18.04+

## 📁 Struttura dei Progetti

Nel workspace hai entrambe le versioni:

```
workspace/
├── investment-platform/          # Versione Italiana
│   ├── src/
│   ├── package.json
│   └── README.md
└── investpro-english/           # Versione Inglese
    ├── src/
    ├── package.json
    └── INSTALLATION.md
```

## 🇮🇹 Installazione Versione Italiana

### Passo 1: Navigare nella Directory
```bash
cd investment-platform
```

### Passo 2: Installare le Dipendenze
```bash
pnpm install
```

### Passo 3: Avviare in Modalità Sviluppo
```bash
pnpm dev
```
- L'applicazione sarà disponibile su: `http://localhost:5173`
- Il server supporta hot-reload automatico

### Passo 4: Build per Produzione
```bash
pnpm build
```
- I file di produzione saranno generati in: `dist/`

### Passo 5: Testare la Build di Produzione
```bash
pnpm preview
```
- Testa la versione ottimizzata su: `http://localhost:4173`

## 🇺🇸 Installazione Versione Inglese

### Passo 1: Navigare nella Directory
```bash
cd investpro-english
```

### Passo 2: Installare le Dipendenze
```bash
pnpm install
```

### Passo 3: Avviare in Modalità Sviluppo
```bash
pnpm dev
```
- L'applicazione sarà disponibile su: `http://localhost:5174` (porta diversa)

### Passo 4: Build per Produzione
```bash
pnpm build
```

### Passo 5: Testare la Build di Produzione
```bash
pnpm preview
```

## 🌐 Credenziali Demo

Per entrambe le versioni usa le stesse credenziali:

- **Email:** `user@example.com` (versione italiana) o `demo@example.com` (versione inglese)
- **Password:** `password`

## 🚀 Deployment su Server

### Opzione 1: Hosting Statico (Raccomandato)

1. **Build del progetto:**
```bash
pnpm build
```

2. **Upload della cartella `dist/`** su qualsiasi hosting statico:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront
   - DigitalOcean App Platform

### Opzione 2: Server Nginx

1. **Installa Nginx:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **Configura il virtual host:**
```nginx
server {
    listen 80;
    server_name tuodominio.com;
    root /var/www/html/investpro/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Ottimizzazioni per file statici
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **Carica i file:**
```bash
sudo cp -r dist/* /var/www/html/investpro/dist/
sudo systemctl restart nginx
```

### Opzione 3: Docker

1. **Crea Dockerfile:**
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

2. **Build e Run:**
```bash
docker build -t investpro .
docker run -p 80:80 investpro
```

## 🔧 Personalizzazione e Configurazione

### Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```env
# Configurazione API
VITE_API_URL=https://api.tuodominio.com
VITE_YAHOO_FINANCE_API=https://query1.finance.yahoo.com

# Configurazione Analytics (opzionale)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_ENABLE_ANALYTICS=true

# Configurazione Sicurezza
VITE_JWT_SECRET=your-jwt-secret-key
VITE_ENABLE_AUTH=true

# Configurazione Features
VITE_ENABLE_MARKOWITZ=true
VITE_ENABLE_REAL_DATA=true
```

### Configurazione Colori e Tema

Modifica il file `tailwind.config.js`:

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
        // Aggiungi i tuoi colori personalizzati
      }
    }
  }
}
```

## 🔍 Troubleshooting

### Problemi Comuni e Soluzioni

#### 1. Errore "Module not found"
```bash
# Cancella node_modules e reinstalla
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. Errore porta già in uso
```bash
# Controlla processi attivi
lsof -i :5173
# Uccidi il processo se necessario
kill -9 <PID>
```

#### 3. Errori di TypeScript
```bash
# Controlla la configurazione TypeScript
npx tsc --noEmit
```

#### 4. Problemi con TailwindCSS
```bash
# Rigenera il CSS
pnpm tailwind:build
```

#### 5. Errori API CORS
Aggiungi al tuo proxy configuration:
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

## 📊 Monitoraggio Performance

### Strumenti Integrati

1. **Lighthouse CI:** Per audit automatici
2. **Bundle Analyzer:** Per analizzare dimensioni bundle
```bash
pnpm add -D vite-bundle-analyzer
```

3. **Performance Monitoring:**
```bash
# Installa Web Vitals
pnpm add web-vitals
```

## 🔐 Sicurezza e Best Practices

### Headers di Sicurezza (Nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;" always;
```

### HTTPS Setup con Let's Encrypt

```bash
# Installa Certbot
sudo apt install certbot python3-certbot-nginx

# Ottieni certificato SSL
sudo certbot --nginx -d tuodominio.com

# Auto-renewal
sudo crontab -e
# Aggiungi: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📚 Risorse Aggiuntive

### Documentazione Tecnica
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **TailwindCSS:** https://tailwindcss.com/
- **Vite:** https://vitejs.dev/

### API utilizzate
- **Yahoo Finance:** Per dati finanziari real-time
- **Chart.js:** Per visualizzazioni grafiche
- **Zustand:** Per state management

### Community e Support
- **GitHub Issues:** Per bug reports
- **Discord Community:** Per supporto community
- **Email Support:** support@investpro.com

## ✅ Checklist Post-Installazione

- [ ] Entrambe le versioni si avviano correttamente
- [ ] Login funziona con credenziali demo
- [ ] Dashboard carica i dati correttamente
- [ ] Grafici si visualizzano senza errori
- [ ] Portfolio management funziona
- [ ] Algoritmo Markowitz calcola risultati
- [ ] Design responsive su mobile
- [ ] Performance soddisfacenti (< 3s caricamento)
- [ ] Nessun errore console browser
- [ ] Build di produzione completa con successo

## 🎯 Prossimi Passi

Una volta installato con successo:

1. **Esplora le Funzionalità:** Testa tutte le sezioni della piattaforma
2. **Personalizza:** Modifica colori, logo e branding secondo le tue preferenze
3. **Deploy:** Metti online la tua versione personalizzata
4. **Monitora:** Implementa analytics e monitoraggio errori
5. **Evolvi:** Aggiungi nuove funzionalità basate sui feedback utenti

## 🆘 Supporto

Se hai problemi durante l'installazione:

1. Controlla questa guida per soluzioni comuni
2. Verifica i log di errore nel terminale
3. Controlla la console del browser per errori JavaScript
4. Consulta la documentazione delle tecnologie utilizzate
5. Apri un issue sul repository GitHub se il problema persiste

**Buona fortuna con la tua piattaforma di investimenti! 🚀📈**