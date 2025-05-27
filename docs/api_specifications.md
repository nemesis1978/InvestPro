# API Specifications - Piattaforma Investimenti

## Panoramica API

Le API della piattaforma sono progettate seguendo i principi REST con supporto WebSocket per dati real-time. Utilizzano FastAPI come framework per garantire performance elevate e documentazione automatica.

## 1. Architettura API

### 1.1 Base Configuration

```yaml
API_VERSION: "v1"
BASE_URL: "https://api.investmentplatform.com/v1"
WEBSOCKET_URL: "wss://ws.investmentplatform.com/v1"
AUTHENTICATION: "Bearer Token (JWT)"
RATE_LIMITING: "1000 requests/hour per user"
```

### 1.2 Common Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-API-Version: v1
X-Request-ID: <uuid>
Accept: application/json
```

### 1.3 Standard Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2025-05-24T17:20:03Z",
  "request_id": "uuid",
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### 1.4 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-05-24T17:20:03Z",
  "request_id": "uuid"
}
```

## 2. Authentication API

### 2.1 User Registration

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "country": "US",
  "phone_number": "+1234567890",
  "risk_tolerance": 0.7,
  "investment_experience": 3,
  "annual_income": 75000.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "verification_required": true
  },
  "message": "User registered successfully"
}
```

### 2.2 User Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_verified": true
    }
  }
}
```

### 2.3 Token Refresh

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

### 2.4 Logout

```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

## 3. User Management API

### 3.1 Get User Profile

```http
GET /users/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "country": "US",
    "timezone": "UTC",
    "language": "en",
    "risk_tolerance": 0.7,
    "investment_experience": 3,
    "annual_income": 75000.00,
    "net_worth": 250000.00,
    "is_verified": true,
    "created_at": "2025-01-01T00:00:00Z",
    "last_login_at": "2025-05-24T17:20:03Z"
  }
}
```

### 3.2 Update User Profile

```http
PUT /users/profile
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "risk_tolerance": 0.8,
  "annual_income": 80000.00,
  "timezone": "America/New_York"
}
```

### 3.3 Get User Preferences

```http
GET /users/preferences
```

**Response:**
```json
{
  "success": true,
  "data": {
    "default_currency": "USD",
    "watchlist_symbols": ["AAPL", "MSFT", "GOOGL"],
    "dashboard_layout": {
      "widgets": ["portfolio_summary", "market_overview", "news"]
    },
    "notification_settings": {
      "email_alerts": true,
      "price_alerts": true,
      "portfolio_updates": true,
      "news_digest": false
    },
    "investment_goals": {
      "target_return": 0.10,
      "time_horizon": "long_term",
      "focus": "growth"
    }
  }
}
```

### 3.4 Update User Preferences

```http
PUT /users/preferences
```

## 4. Portfolio Management API

### 4.1 List User Portfolios

```http
GET /portfolios
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 20, max: 100)
- `status` (string): active, inactive, all (default: active)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tech Growth Portfolio",
      "description": "High-growth technology stocks",
      "portfolio_type": "aggressive",
      "base_currency": "USD",
      "current_value": 125750.50,
      "cash_balance": 2500.00,
      "num_holdings": 8,
      "total_return_percent": 12.5,
      "created_at": "2025-01-01T00:00:00Z",
      "last_rebalanced_at": "2025-05-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### 4.2 Create Portfolio

```http
POST /portfolios
```

**Request Body:**
```json
{
  "name": "Tech Growth Portfolio",
  "description": "High-growth technology stocks",
  "portfolio_type": "aggressive",
  "base_currency": "USD",
  "initial_value": 100000.00,
  "cash_balance": 10000.00,
  "target_return": 0.12,
  "max_risk": 0.20,
  "rebalance_frequency": 90
}
```

### 4.3 Get Portfolio Details

```http
GET /portfolios/{portfolio_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Growth Portfolio",
    "description": "High-growth technology stocks",
    "portfolio_type": "aggressive",
    "base_currency": "USD",
    "current_value": 125750.50,
    "cash_balance": 2500.00,
    "target_return": 0.12,
    "max_risk": 0.20,
    "holdings": [
      {
        "asset": {
          "id": "uuid",
          "symbol": "AAPL",
          "name": "Apple Inc.",
          "asset_type": "stock"
        },
        "quantity": 100.0,
        "average_cost": 150.25,
        "current_price": 180.50,
        "market_value": 18050.00,
        "target_weight": 0.25,
        "current_weight": 0.28,
        "unrealized_pnl": 3025.00,
        "unrealized_pnl_percent": 20.13
      }
    ],
    "performance": {
      "total_return": 0.125,
      "daily_return": 0.002,
      "sharpe_ratio": 1.85,
      "volatility": 0.18,
      "max_drawdown": -0.08,
      "alpha": 0.03,
      "beta": 1.15
    },
    "created_at": "2025-01-01T00:00:00Z",
    "last_rebalanced_at": "2025-05-01T00:00:00Z"
  }
}
```

### 4.4 Update Portfolio

```http
PUT /portfolios/{portfolio_id}
```

### 4.5 Delete Portfolio

```http
DELETE /portfolios/{portfolio_id}
```

## 5. Portfolio Optimization API

### 5.1 Run Markowitz Optimization

```http
POST /portfolios/{portfolio_id}/optimize
```

**Request Body:**
```json
{
  "optimization_type": "max_sharpe",
  "constraints": {
    "max_weight": 0.40,
    "min_weight": 0.05,
    "sector_limits": {
      "technology": 0.50,
      "healthcare": 0.30
    }
  },
  "risk_free_rate": 0.02,
  "target_return": 0.12,
  "lookback_days": 252
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "optimization_id": "uuid",
    "optimization_type": "max_sharpe",
    "status": "success",
    "optimal_weights": {
      "AAPL": 0.25,
      "MSFT": 0.30,
      "GOOGL": 0.20,
      "TSLA": 0.15,
      "NVDA": 0.10
    },
    "expected_return": 0.1156,
    "expected_volatility": 0.1842,
    "sharpe_ratio": 1.968,
    "solver_time_ms": 145,
    "efficient_frontier": [
      {
        "return": 0.08,
        "volatility": 0.12,
        "weights": {...}
      }
    ]
  }
}
```

### 5.2 Get Optimization History

```http
GET /portfolios/{portfolio_id}/optimizations
```

### 5.3 Apply Optimization

```http
POST /portfolios/{portfolio_id}/optimizations/{optimization_id}/apply
```

## 6. Market Data API

### 6.1 Get Asset Quotes

```http
GET /market/quotes
```

**Query Parameters:**
- `symbols` (string): Comma-separated list (e.g., "AAPL,MSFT,GOOGL")
- `fields` (string): Comma-separated fields (price,change,volume,market_cap)

**Response:**
```json
{
  "success": true,
  "data": {
    "AAPL": {
      "symbol": "AAPL",
      "price": 180.50,
      "bid_price": 180.45,
      "ask_price": 180.55,
      "change_amount": 2.50,
      "change_percent": 1.40,
      "volume": 45678900,
      "market_cap": 2845000000000,
      "pe_ratio": 29.5,
      "day_high": 181.25,
      "day_low": 178.80,
      "last_updated_at": "2025-05-24T21:00:00Z"
    }
  }
}
```

### 6.2 Get Historical Data

```http
GET /market/historical/{symbol}
```

**Query Parameters:**
- `period` (string): 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
- `interval` (string): 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
- `start_date` (date): YYYY-MM-DD
- `end_date` (date): YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "period": "1y",
    "interval": "1d",
    "data": [
      {
        "date": "2024-05-24",
        "open": 178.25,
        "high": 181.25,
        "low": 177.80,
        "close": 180.50,
        "adjusted_close": 180.50,
        "volume": 45678900
      }
    ],
    "meta": {
      "currency": "USD",
      "exchange": "NASDAQ",
      "data_source": "yahoo_finance"
    }
  }
}
```

### 6.3 Get Asset Fundamentals

```http
GET /market/fundamentals/{symbol}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "company_info": {
      "name": "Apple Inc.",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "employees": 164000,
      "description": "Apple Inc. designs, manufactures, and markets smartphones..."
    },
    "financial_metrics": {
      "market_cap": 2845000000000,
      "pe_ratio": 29.5,
      "forward_pe": 26.8,
      "peg_ratio": 2.1,
      "price_to_book": 45.2,
      "price_to_sales": 7.8,
      "debt_to_equity": 1.73,
      "current_ratio": 1.05,
      "quick_ratio": 0.82,
      "return_on_equity": 1.564,
      "return_on_assets": 0.274,
      "profit_margin": 0.255,
      "operating_margin": 0.308,
      "gross_margin": 0.456
    },
    "growth_metrics": {
      "revenue_growth": 0.022,
      "earnings_growth": 0.045,
      "revenue_growth_5y": 0.089,
      "earnings_growth_5y": 0.076
    },
    "dividends": {
      "dividend_yield": 0.0043,
      "dividend_rate": 0.96,
      "payout_ratio": 0.146,
      "ex_dividend_date": "2025-05-09"
    }
  }
}
```

### 6.4 Get Technical Indicators

```http
GET /market/technical/{symbol}
```

**Query Parameters:**
- `indicators` (string): rsi,macd,bollinger,sma,ema,stochastic
- `period` (integer): Lookback period (default: 14)

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "indicators": {
      "rsi": {
        "value": 68.42,
        "signal": "neutral",
        "period": 14
      },
      "macd": {
        "macd": 5.45,
        "signal": 2.79,
        "histogram": 2.66,
        "trend": "bullish"
      },
      "bollinger_bands": {
        "upper": 185.50,
        "middle": 180.25,
        "lower": 175.00,
        "position": "middle"
      },
      "moving_averages": {
        "sma_20": 178.90,
        "sma_50": 175.60,
        "sma_200": 168.40,
        "ema_12": 179.80,
        "ema_26": 177.20
      },
      "support_resistance": {
        "support": 175.00,
        "resistance": 185.00,
        "pivot": 180.00
      }
    },
    "last_updated_at": "2025-05-24T21:00:00Z"
  }
}
```

### 6.5 Get Market News

```http
GET /market/news
```

**Query Parameters:**
- `symbols` (string): Filter by symbols (optional)
- `limit` (integer): Number of articles (default: 20, max: 100)
- `hours` (integer): Hours back (default: 24)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Apple Reports Strong Q2 Earnings",
      "summary": "Apple Inc. reported quarterly earnings that exceeded expectations...",
      "url": "https://news.example.com/article/123",
      "source": "Reuters",
      "symbols": ["AAPL"],
      "sentiment": "positive",
      "sentiment_score": 0.75,
      "published_at": "2025-05-24T16:30:00Z",
      "image_url": "https://images.example.com/apple-earnings.jpg"
    }
  ]
}
```

## 7. Transactions API

### 7.1 List Transactions

```http
GET /portfolios/{portfolio_id}/transactions
```

**Query Parameters:**
- `page`, `per_page`: Pagination
- `type` (string): buy, sell, dividend, deposit, withdrawal
- `symbol` (string): Filter by asset symbol
- `start_date`, `end_date`: Date range filter

### 7.2 Create Transaction

```http
POST /portfolios/{portfolio_id}/transactions
```

**Request Body:**
```json
{
  "asset_symbol": "AAPL",
  "transaction_type": "buy",
  "quantity": 100.0,
  "price": 180.50,
  "fees": 9.99,
  "transaction_date": "2025-05-24T14:30:00Z",
  "notes": "Initial position in Apple"
}
```

### 7.3 Update Transaction

```http
PUT /portfolios/{portfolio_id}/transactions/{transaction_id}
```

### 7.4 Delete Transaction

```http
DELETE /portfolios/{portfolio_id}/transactions/{transaction_id}
```

## 8. Analytics API

### 8.1 Portfolio Performance

```http
GET /portfolios/{portfolio_id}/performance
```

**Query Parameters:**
- `period` (string): 1d, 1w, 1m, 3m, 6m, 1y, ytd, all
- `benchmark` (string): SPY, QQQ, custom symbol

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio_id": "uuid",
    "period": "1y",
    "performance": [
      {
        "date": "2024-05-24",
        "total_value": 98500.00,
        "daily_return": -0.015,
        "cumulative_return": -0.015,
        "benchmark_return": -0.008
      }
    ],
    "summary": {
      "total_return": 0.125,
      "annualized_return": 0.112,
      "volatility": 0.185,
      "sharpe_ratio": 1.85,
      "max_drawdown": -0.08,
      "alpha": 0.03,
      "beta": 1.15,
      "win_rate": 0.65,
      "best_day": 0.045,
      "worst_day": -0.032
    }
  }
}
```

### 8.2 Risk Metrics

```http
GET /portfolios/{portfolio_id}/risk
```

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio_id": "uuid",
    "risk_metrics": {
      "value_at_risk_95": -0.025,
      "value_at_risk_99": -0.045,
      "conditional_var_95": -0.035,
      "expected_shortfall": -0.038,
      "correlation_matrix": {
        "AAPL": {"MSFT": 0.72, "GOOGL": 0.68},
        "MSFT": {"AAPL": 0.72, "GOOGL": 0.75}
      },
      "sector_exposure": {
        "Technology": 0.65,
        "Healthcare": 0.20,
        "Financial": 0.15
      },
      "concentration_risk": {
        "top_holding_weight": 0.28,
        "top_5_holdings_weight": 0.85,
        "effective_diversification": 5.2
      }
    },
    "recommendations": [
      {
        "type": "rebalancing",
        "message": "Consider rebalancing - AAPL is 3% above target weight",
        "priority": "medium"
      }
    ]
  }
}
```

## 9. Alerts API

### 9.1 List Price Alerts

```http
GET /alerts
```

### 9.2 Create Price Alert

```http
POST /alerts
```

**Request Body:**
```json
{
  "asset_symbol": "AAPL",
  "alert_type": "price_above",
  "target_value": 185.00,
  "notification_method": "email",
  "expires_at": "2025-12-31T00:00:00Z"
}
```

### 9.3 Update Alert

```http
PUT /alerts/{alert_id}
```

### 9.4 Delete Alert

```http
DELETE /alerts/{alert_id}
```

## 10. WebSocket API

### 10.1 Real-time Price Updates

**Connection:**
```
wss://ws.investmentplatform.com/v1/market/live
```

**Authentication:**
```json
{
  "type": "auth",
  "token": "jwt_access_token"
}
```

**Subscribe to Symbols:**
```json
{
  "type": "subscribe",
  "symbols": ["AAPL", "MSFT", "GOOGL"]
}
```

**Price Update Message:**
```json
{
  "type": "price_update",
  "data": {
    "symbol": "AAPL",
    "price": 180.50,
    "change": 2.50,
    "change_percent": 1.40,
    "volume": 45678900,
    "timestamp": "2025-05-24T21:00:00Z"
  }
}
```

### 10.2 Portfolio Updates

**Connection:**
```
wss://ws.investmentplatform.com/v1/portfolios/{portfolio_id}/live
```

**Portfolio Update Message:**
```json
{
  "type": "portfolio_update",
  "data": {
    "portfolio_id": "uuid",
    "current_value": 125750.50,
    "daily_change": 1850.25,
    "daily_change_percent": 1.49,
    "updated_holdings": [
      {
        "symbol": "AAPL",
        "current_price": 180.50,
        "market_value": 18050.00,
        "unrealized_pnl": 3025.00
      }
    ],
    "timestamp": "2025-05-24T21:00:00Z"
  }
}
```

## 11. Rate Limiting

### 11.1 Rate Limits by Endpoint Type

- **Authentication:** 10 requests/minute
- **User Management:** 60 requests/minute  
- **Portfolio Operations:** 120 requests/minute
- **Market Data:** 300 requests/minute
- **Analytics:** 60 requests/minute
- **WebSocket:** 1000 messages/minute

### 11.2 Rate Limit Headers

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1621872000
Retry-After: 60
```

## 12. Error Codes

### 12.1 HTTP Status Codes

- `200` OK - Request successful
- `201` Created - Resource created
- `400` Bad Request - Invalid parameters
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `422` Unprocessable Entity - Validation error
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

### 12.2 Application Error Codes

```json
{
  "VALIDATION_ERROR": "Invalid input parameters",
  "AUTHENTICATION_FAILED": "Invalid credentials",
  "INSUFFICIENT_FUNDS": "Insufficient cash balance",
  "PORTFOLIO_NOT_FOUND": "Portfolio does not exist",
  "ASSET_NOT_FOUND": "Asset symbol not found",
  "OPTIMIZATION_FAILED": "Portfolio optimization failed",
  "MARKET_DATA_UNAVAILABLE": "Market data temporarily unavailable",
  "RATE_LIMIT_EXCEEDED": "API rate limit exceeded"
}
```

## 13. SDK Examples

### 13.1 Python SDK

```python
from investment_platform_sdk import InvestmentPlatformClient

# Initialize client
client = InvestmentPlatformClient(
    base_url="https://api.investmentplatform.com/v1",
    api_key="your_api_key"
)

# Login
auth = client.auth.login("user@example.com", "password")

# Create portfolio
portfolio = client.portfolios.create({
    "name": "Tech Growth Portfolio",
    "portfolio_type": "aggressive",
    "initial_value": 100000.00
})

# Run optimization
optimization = client.portfolios.optimize(portfolio.id, {
    "optimization_type": "max_sharpe",
    "risk_free_rate": 0.02
})

# Get real-time prices
prices = client.market.get_quotes(["AAPL", "MSFT", "GOOGL"])
```

### 13.2 JavaScript SDK

```javascript
import { InvestmentPlatformClient } from '@investment-platform/sdk';

const client = new InvestmentPlatformClient({
  baseURL: 'https://api.investmentplatform.com/v1',
  apiKey: 'your_api_key'
});

// Login and get portfolios
const auth = await client.auth.login('user@example.com', 'password');
const portfolios = await client.portfolios.list();

// WebSocket connection
const ws = client.websocket.connect();
ws.subscribe(['AAPL', 'MSFT']);
ws.on('price_update', (data) => {
  console.log('Price update:', data);
});
```

## Conclusioni

Queste specifiche API forniscono una base completa per l'interazione con la piattaforma di investimenti, coprendo:

1. **Autenticazione sicura** con JWT tokens
2. **Gestione portfolio completa** con ottimizzazione Markowitz
3. **Dati di mercato real-time** con WebSocket
4. **Analytics avanzate** per performance e risk management
5. **Rate limiting** per prevenire abusi
6. **Documentazione dettagliata** per facilitare l'integrazione

L'API è progettata per essere **RESTful**, **scalabile** e **sicura**, con supporto per SDK in multiple lingue di programmazione.

---

*API Version: 1.0*  
*Last Updated: 2025-05-24*  
*Framework: FastAPI + WebSocket*