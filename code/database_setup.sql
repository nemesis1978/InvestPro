-- ===============================================
-- Database Setup Script per Piattaforma Investimenti
-- Version: 1.0
-- Date: 2025-05-24
-- ===============================================

-- Creazione database (eseguire come superuser)
-- CREATE DATABASE investment_platform
--     WITH 
--     OWNER = investment_user
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.utf8'
--     LC_CTYPE = 'en_US.utf8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Connessione al database investment_platform
\c investment_platform;

-- ===============================================
-- 1. ESTENSIONI E CONFIGURAZIONI
-- ===============================================

-- Abilitazione estensioni necessarie
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Configurazioni performance ottimizzate
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
SELECT pg_reload_conf();

-- ===============================================
-- 2. FUNZIONI UTILITY
-- ===============================================

-- Funzione per update automatico di updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per pulizia sessioni scadute
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '1 day';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 3. TABELLE CORE - UTENTI E AUTENTICAZIONE
-- ===============================================

-- Tabella Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    country VARCHAR(2), -- ISO country code
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(5) DEFAULT 'en',
    risk_tolerance DECIMAL(3,2) CHECK (risk_tolerance >= 0 AND risk_tolerance <= 1),
    investment_experience INTEGER CHECK (investment_experience >= 0 AND investment_experience <= 5),
    annual_income DECIMAL(12,2),
    net_worth DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indici per performance users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trigger per updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabella User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici sessions
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_active ON user_sessions(is_active, expires_at) WHERE is_active = TRUE;
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- Trigger pulizia sessioni scadute
CREATE TRIGGER trigger_cleanup_sessions
    AFTER INSERT ON user_sessions
    EXECUTE FUNCTION cleanup_expired_sessions();

-- Tabella User Preferences
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    default_currency VARCHAR(3) DEFAULT 'USD',
    watchlist_symbols TEXT[], -- Array di simboli preferiti
    dashboard_layout JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{
        "email_alerts": true,
        "price_alerts": true,
        "portfolio_updates": true,
        "news_digest": false
    }',
    investment_goals JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 4. TABELLE ASSETS E MARKET DATA
-- ===============================================

-- Tabella Assets (Master Data)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (
        asset_type IN ('stock', 'etf', 'bond', 'crypto', 'commodity', 'forex', 'option')
    ),
    exchange VARCHAR(10),
    sector VARCHAR(100),
    industry VARCHAR(100),
    country VARCHAR(2),
    currency VARCHAR(3) DEFAULT 'USD',
    isin VARCHAR(12),
    cusip VARCHAR(9),
    description TEXT,
    market_cap DECIMAL(20,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici assets
CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_exchange ON assets(exchange);
CREATE INDEX idx_assets_sector ON assets(sector);
CREATE UNIQUE INDEX idx_assets_symbol_active ON assets(symbol) WHERE is_active = TRUE;

-- Trigger per updated_at
CREATE TRIGGER update_assets_updated_at 
    BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabella Market Data (Time-Series)
CREATE TABLE market_data (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    asset_id UUID NOT NULL REFERENCES assets(id),
    open_price DECIMAL(12,4),
    high_price DECIMAL(12,4),
    low_price DECIMAL(12,4),
    close_price DECIMAL(12,4) NOT NULL,
    volume BIGINT DEFAULT 0,
    adjusted_close DECIMAL(12,4),
    data_source VARCHAR(50) DEFAULT 'yahoo_finance',
    
    CONSTRAINT market_data_pkey PRIMARY KEY (time, asset_id)
);

-- Conversione a hypertable per TimescaleDB
SELECT create_hypertable('market_data', 'time', 'asset_id', 4);

-- Indici ottimizzati per time-series
CREATE INDEX idx_market_data_asset_time ON market_data(asset_id, time DESC);
CREATE INDEX idx_market_data_time ON market_data(time DESC);

-- Politica di retention (mantiene 2 anni di dati)
SELECT add_retention_policy('market_data', INTERVAL '2 years');

-- Tabella Real-time Quotes
CREATE TABLE realtime_quotes (
    asset_id UUID PRIMARY KEY REFERENCES assets(id),
    price DECIMAL(12,4) NOT NULL,
    bid_price DECIMAL(12,4),
    ask_price DECIMAL(12,4),
    volume BIGINT DEFAULT 0,
    change_amount DECIMAL(8,4),
    change_percent DECIMAL(5,4),
    market_cap DECIMAL(20,2),
    pe_ratio DECIMAL(8,2),
    day_high DECIMAL(12,4),
    day_low DECIMAL(12,4),
    fifty_two_week_high DECIMAL(12,4),
    fifty_two_week_low DECIMAL(12,4),
    data_source VARCHAR(50) DEFAULT 'yahoo_finance',
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici realtime quotes
CREATE INDEX idx_realtime_quotes_updated_at ON realtime_quotes(last_updated_at);

-- ===============================================
-- 5. TABELLE PORTFOLIOS E HOLDINGS
-- ===============================================

-- Tabella Portfolios
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    portfolio_type VARCHAR(50) DEFAULT 'custom' CHECK (
        portfolio_type IN ('custom', 'aggressive', 'moderate', 'conservative', 'income')
    ),
    base_currency VARCHAR(3) DEFAULT 'USD',
    initial_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    current_value DECIMAL(15,2) DEFAULT 0,
    cash_balance DECIMAL(15,2) DEFAULT 0,
    target_return DECIMAL(5,4), -- Target annualized return
    max_risk DECIMAL(5,4), -- Maximum acceptable volatility
    rebalance_frequency INTEGER DEFAULT 90, -- Days between rebalancing
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_rebalanced_at TIMESTAMP WITH TIME ZONE
);

-- Indici portfolios
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_active ON portfolios(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_portfolios_created_at ON portfolios(created_at);

-- Trigger per updated_at
CREATE TRIGGER update_portfolios_updated_at 
    BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabella Portfolio Holdings
CREATE TABLE portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id),
    quantity DECIMAL(15,6) NOT NULL DEFAULT 0,
    average_cost DECIMAL(12,4) NOT NULL DEFAULT 0,
    current_price DECIMAL(12,4) DEFAULT 0,
    target_weight DECIMAL(5,4) DEFAULT 0, -- Target allocation percentage
    current_weight DECIMAL(5,4) DEFAULT 0, -- Current allocation percentage
    market_value DECIMAL(15,2) GENERATED ALWAYS AS (quantity * current_price) STORED,
    unrealized_pnl DECIMAL(15,2) GENERATED ALWAYS AS ((current_price - average_cost) * quantity) STORED,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_portfolio_asset UNIQUE(portfolio_id, asset_id),
    CONSTRAINT check_target_weight CHECK (target_weight >= 0 AND target_weight <= 1)
);

-- Indici holdings
CREATE INDEX idx_holdings_portfolio_id ON portfolio_holdings(portfolio_id);
CREATE INDEX idx_holdings_asset_id ON portfolio_holdings(asset_id);
CREATE INDEX idx_holdings_market_value ON portfolio_holdings(market_value);

-- ===============================================
-- 6. TABELLE TRANSAZIONI
-- ===============================================

-- Tabella Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (
        transaction_type IN ('buy', 'sell', 'dividend', 'deposit', 'withdrawal', 'fee', 'split', 'merger')
    ),
    quantity DECIMAL(15,6),
    price DECIMAL(12,4),
    total_amount DECIMAL(15,2) NOT NULL,
    fees DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,6) DEFAULT 1,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    settlement_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    external_id VARCHAR(100), -- ID from external broker/system
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_transactions_portfolio_id ON transactions(portfolio_id);
CREATE INDEX idx_transactions_asset_id ON transactions(asset_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_portfolio_date ON transactions(portfolio_id, transaction_date);

-- ===============================================
-- 7. TABELLE ANALYTICS E PERFORMANCE
-- ===============================================

-- Tabella Portfolio Performance
CREATE TABLE portfolio_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    cash_value DECIMAL(15,2) DEFAULT 0,
    invested_value DECIMAL(15,2) NOT NULL,
    daily_return DECIMAL(8,6),
    cumulative_return DECIMAL(10,6),
    benchmark_return DECIMAL(8,6), -- S&P 500 or custom benchmark
    alpha DECIMAL(8,6), -- Risk-adjusted return vs benchmark
    beta DECIMAL(6,4), -- Volatility vs benchmark
    sharpe_ratio DECIMAL(6,4),
    volatility DECIMAL(6,4), -- 30-day rolling volatility
    max_drawdown DECIMAL(6,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_portfolio_date UNIQUE(portfolio_id, date)
);

-- Conversione a hypertable
SELECT create_hypertable('portfolio_performance', 'date', 'portfolio_id', 4);

-- Indici performance
CREATE INDEX idx_perf_portfolio_date ON portfolio_performance(portfolio_id, date DESC);
CREATE INDEX idx_perf_date ON portfolio_performance(date DESC);

-- Tabella Markowitz Optimizations
CREATE TABLE markowitz_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    optimization_type VARCHAR(50) NOT NULL CHECK (
        optimization_type IN ('max_sharpe', 'min_volatility', 'target_return', 'efficient_frontier')
    ),
    input_parameters JSONB NOT NULL, -- Risk-free rate, target return, constraints
    asset_weights JSONB NOT NULL, -- Risultati ottimizzazione {asset_id: weight}
    expected_return DECIMAL(8,6) NOT NULL,
    expected_volatility DECIMAL(8,6) NOT NULL,
    sharpe_ratio DECIMAL(8,6),
    optimization_status VARCHAR(20) DEFAULT 'success' CHECK (
        optimization_status IN ('success', 'failed', 'infeasible', 'unbounded')
    ),
    solver_time_ms INTEGER,
    data_start_date DATE,
    data_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici markowitz
CREATE INDEX idx_markowitz_portfolio_id ON markowitz_optimizations(portfolio_id);
CREATE INDEX idx_markowitz_created_at ON markowitz_optimizations(created_at);
CREATE INDEX idx_markowitz_type ON markowitz_optimizations(optimization_type);

-- ===============================================
-- 8. TABELLE ALERTS E NOTIFICHE
-- ===============================================

-- Tabella Price Alerts
CREATE TABLE price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id),
    alert_type VARCHAR(20) NOT NULL CHECK (
        alert_type IN ('price_above', 'price_below', 'percent_change', 'volume_spike')
    ),
    target_value DECIMAL(12,4) NOT NULL,
    current_value DECIMAL(12,4),
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP WITH TIME ZONE,
    notification_method VARCHAR(20) DEFAULT 'email' CHECK (
        notification_method IN ('email', 'sms', 'push', 'in_app')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Indici alerts
CREATE INDEX idx_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_alerts_asset_id ON price_alerts(asset_id);
CREATE INDEX idx_alerts_active ON price_alerts(is_active) WHERE is_active = TRUE;

-- Tabella Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional structured data
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (
        priority IN ('low', 'normal', 'high', 'urgent')
    ),
    delivery_method VARCHAR(20) DEFAULT 'in_app',
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ===============================================
-- 9. VIEWS PRINCIPALI
-- ===============================================

-- View Portfolio Summary
CREATE VIEW portfolio_summary AS
SELECT 
    p.id,
    p.user_id,
    p.name,
    p.current_value,
    p.cash_balance,
    COUNT(ph.id) as num_holdings,
    SUM(ph.market_value) as total_holdings_value,
    SUM(ph.unrealized_pnl) as total_unrealized_pnl,
    (SUM(ph.unrealized_pnl) / NULLIF(SUM(ph.quantity * ph.average_cost), 0)) * 100 as total_return_percent,
    p.last_rebalanced_at,
    p.created_at
FROM portfolios p
LEFT JOIN portfolio_holdings ph ON p.id = ph.portfolio_id
WHERE p.is_active = TRUE
GROUP BY p.id, p.user_id, p.name, p.current_value, p.cash_balance, p.last_rebalanced_at, p.created_at;

-- View User Engagement Metrics
CREATE VIEW user_engagement_metrics AS
SELECT 
    DATE(s.last_activity_at) as activity_date,
    COUNT(DISTINCT s.user_id) as daily_active_users,
    COUNT(DISTINCT CASE WHEN s.created_at::date = DATE(s.last_activity_at) THEN s.user_id END) as new_users,
    AVG(EXTRACT(EPOCH FROM (s.last_activity_at - s.created_at))/3600) as avg_session_hours
FROM user_sessions s
WHERE s.last_activity_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(s.last_activity_at)
ORDER BY activity_date DESC;

-- View Asset Performance
CREATE VIEW asset_performance AS
SELECT 
    a.symbol,
    a.name,
    a.asset_type,
    rq.price as current_price,
    rq.change_percent as daily_change,
    COALESCE(
        (rq.price - LAG(md.close_price) OVER (PARTITION BY a.id ORDER BY md.time DESC)) / 
        LAG(md.close_price) OVER (PARTITION BY a.id ORDER BY md.time DESC) * 100, 
        0
    ) as week_change,
    rq.volume as current_volume,
    rq.market_cap,
    rq.pe_ratio,
    rq.last_updated_at
FROM assets a
LEFT JOIN realtime_quotes rq ON a.id = rq.asset_id
LEFT JOIN market_data md ON a.id = md.asset_id 
WHERE a.is_active = TRUE;

-- ===============================================
-- 10. FUNZIONI BUSINESS LOGIC
-- ===============================================

-- Funzione per update portfolio value
CREATE OR REPLACE FUNCTION update_portfolio_value(portfolio_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_value DECIMAL(15,2);
    cash_bal DECIMAL(15,2);
BEGIN
    -- Calcola valore totale holdings
    SELECT COALESCE(SUM(quantity * current_price), 0) 
    INTO total_value
    FROM portfolio_holdings 
    WHERE portfolio_id = portfolio_uuid;
    
    -- Ottiene cash balance
    SELECT cash_balance INTO cash_bal
    FROM portfolios 
    WHERE id = portfolio_uuid;
    
    -- Aggiorna portfolio
    UPDATE portfolios 
    SET current_value = total_value + COALESCE(cash_bal, 0),
        updated_at = NOW()
    WHERE id = portfolio_uuid;
    
    -- Inserisce/aggiorna performance giornaliera
    INSERT INTO portfolio_performance (portfolio_id, date, total_value, invested_value, cash_value)
    VALUES (portfolio_uuid, CURRENT_DATE, total_value + COALESCE(cash_bal, 0), total_value, COALESCE(cash_bal, 0))
    ON CONFLICT (portfolio_id, date) DO UPDATE SET
        total_value = EXCLUDED.total_value,
        invested_value = EXCLUDED.invested_value,
        cash_value = EXCLUDED.cash_value;
END;
$$ LANGUAGE plpgsql;

-- Funzione per calcolo Sharpe Ratio
CREATE OR REPLACE FUNCTION calculate_sharpe_ratio(
    portfolio_uuid UUID, 
    risk_free_rate DECIMAL(5,4) DEFAULT 0.02,
    days_back INTEGER DEFAULT 252
)
RETURNS DECIMAL(6,4) AS $$
DECLARE
    avg_return DECIMAL(8,6);
    volatility DECIMAL(8,6);
    sharpe DECIMAL(6,4);
BEGIN
    -- Calcola rendimento medio e volatilità
    SELECT 
        AVG(daily_return) * 252, -- Annualizzato
        STDDEV(daily_return) * SQRT(252) -- Annualizzato
    INTO avg_return, volatility
    FROM portfolio_performance 
    WHERE portfolio_id = portfolio_uuid 
    AND date >= CURRENT_DATE - days_back
    AND daily_return IS NOT NULL;
    
    -- Calcola Sharpe Ratio
    IF volatility > 0 THEN
        sharpe := (avg_return - risk_free_rate) / volatility;
    ELSE
        sharpe := 0;
    END IF;
    
    RETURN sharpe;
END;
$$ LANGUAGE plpgsql;

-- Funzione per cleanup dati obsoleti
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Rimuovi sessioni scadute da più di 7 giorni
    DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '7 days';
    
    -- Rimuovi notifiche lette da più di 30 giorni
    DELETE FROM notifications WHERE is_read = TRUE AND read_at < NOW() - INTERVAL '30 days';
    
    -- Rimuovi alert scaduti
    DELETE FROM price_alerts WHERE expires_at < NOW() AND expires_at IS NOT NULL;
    
    -- Aggiorna statistiche tabelle
    ANALYZE users, portfolios, transactions, market_data;
    
    RAISE NOTICE 'Cleanup completato alle %', NOW();
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 11. INDICI AVANZATI PER PERFORMANCE
-- ===============================================

-- Indici compositi per query complesse
CREATE INDEX idx_portfolio_holdings_composite ON portfolio_holdings(portfolio_id, market_value DESC, current_weight);
CREATE INDEX idx_transactions_analytics ON transactions(portfolio_id, transaction_type, transaction_date, total_amount);
CREATE INDEX idx_market_data_analytics ON market_data(asset_id, time DESC, close_price, volume);
CREATE INDEX idx_performance_analytics ON portfolio_performance(portfolio_id, date DESC, cumulative_return, sharpe_ratio);

-- Indici per ricerche full-text (se necessario)
-- CREATE INDEX idx_assets_name_search ON assets USING gin(to_tsvector('english', name));

-- ===============================================
-- 12. SECURITY SETUP
-- ===============================================

-- Abilitazione Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Creazione ruoli database
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'readonly_user') THEN
        CREATE ROLE readonly_user;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'application_user') THEN
        CREATE ROLE application_user;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_user') THEN
        CREATE ROLE admin_user;
    END IF;
END
$$;

-- Assegnazione permessi
GRANT CONNECT ON DATABASE investment_platform TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

GRANT CONNECT ON DATABASE investment_platform TO application_user;
GRANT USAGE ON SCHEMA public TO application_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO application_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO application_user;

GRANT ALL PRIVILEGES ON DATABASE investment_platform TO admin_user;

-- ===============================================
-- 13. DATI DI TEST
-- ===============================================

-- Inserimento asset di esempio
INSERT INTO assets (symbol, name, asset_type, exchange, sector, currency) VALUES
('AAPL', 'Apple Inc.', 'stock', 'NASDAQ', 'Technology', 'USD'),
('MSFT', 'Microsoft Corporation', 'stock', 'NASDAQ', 'Technology', 'USD'),
('GOOGL', 'Alphabet Inc.', 'stock', 'NASDAQ', 'Technology', 'USD'),
('TSLA', 'Tesla Inc.', 'stock', 'NASDAQ', 'Consumer Cyclical', 'USD'),
('AMZN', 'Amazon.com Inc.', 'stock', 'NASDAQ', 'Consumer Cyclical', 'USD'),
('SPY', 'SPDR S&P 500 ETF Trust', 'etf', 'NYSE', 'Diversified', 'USD'),
('QQQ', 'Invesco QQQ Trust', 'etf', 'NASDAQ', 'Technology', 'USD'),
('BTC-USD', 'Bitcoin USD', 'crypto', 'CRYPTO', 'Cryptocurrency', 'USD'),
('ETH-USD', 'Ethereum USD', 'crypto', 'CRYPTO', 'Cryptocurrency', 'USD');

-- Inserimento utente demo
INSERT INTO users (email, password_hash, first_name, last_name, risk_tolerance, investment_experience) VALUES
('demo@investmentapp.com', crypt('password123', gen_salt('bf')), 'Demo', 'User', 0.7, 3);

-- ===============================================
-- 14. MONITORING SETUP
-- ===============================================

-- View per monitoring performance database
CREATE VIEW db_performance_monitor AS
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- View per connessioni attive
CREATE VIEW active_connections_monitor AS
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change,
    LEFT(query, 100) as query_preview
FROM pg_stat_activity 
WHERE state != 'idle' AND pid != pg_backend_pid()
ORDER BY query_start;

-- ===============================================
-- SETUP COMPLETATO
-- ===============================================

-- Messaggio finale
DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Database setup completato con successo!';
    RAISE NOTICE 'Tabelle create: %', (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Indici creati: %', (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public');
    RAISE NOTICE 'Funzioni create: %', (SELECT count(*) FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'));
    RAISE NOTICE '==========================================';
END
$$;

-- Vacuum e analyze finale
VACUUM ANALYZE;