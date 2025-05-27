# Deployment Specifications - Piattaforma Investimenti

## Docker Compose Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_DB: investment_platform
      POSTGRES_USER: investment_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./code/database_setup.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  # Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Backend API
  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://investment_user:${DB_PASSWORD}@postgres:5432/investment_platform
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      YAHOO_FINANCE_API_KEY: ${YAHOO_API_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8000
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

## Kubernetes Deployment

### postgres-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: timescale/timescaledb:latest-pg15
        env:
        - name: POSTGRES_DB
          value: investment_platform
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

## Environment Variables

### .env.production
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/investment_platform
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=30

# Redis
REDIS_URL=redis://redis-host:6379
REDIS_MAX_CONNECTIONS=50

# API Keys
YAHOO_FINANCE_API_KEY=your_api_key
ALPHA_VANTAGE_API_KEY=your_api_key

# Security
JWT_SECRET=your-super-secure-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30

# Rate Limiting
RATE_LIMIT_PER_MINUTE=300
RATE_LIMIT_BURST=10

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO
```

## CI/CD Pipeline

### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run Tests
      run: |
        docker-compose -f docker-compose.test.yml up --abort-on-container-exit
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/
        kubectl rollout status deployment/api
```

## Performance Configuration

### nginx.conf
```nginx
upstream api_backend {
    server api:8000;
    keepalive 32;
}

server {
    listen 80;
    server_name investmentplatform.com;
    
    # API Proxy
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }
}
```

## Monitoring Setup

### prometheus.yml
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'investment-api'
    static_configs:
      - targets: ['api:8000']
    metrics_path: /metrics
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
```

## Backup Strategy

### backup-script.sh
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database backup
pg_dump $DATABASE_URL --format=custom --compress=9 \
  --file="$BACKUP_DIR/investment_platform_$DATE.dump"

# Upload to S3
aws s3 cp "$BACKUP_DIR/investment_platform_$DATE.dump" \
  s3://investment-platform-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
```

## Security Hardening

### security-policies.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: investment-platform-netpol
spec:
  podSelector:
    matchLabels:
      app: investment-platform
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 8000
```