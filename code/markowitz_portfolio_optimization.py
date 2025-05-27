"""
Implementazione dell'Algoritmo di Markowitz per Ottimizzazione del Portafoglio
Teoria Moderna del Portafoglio (Modern Portfolio Theory - MPT)
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import minimize
import asyncio
import concurrent.futures
from datetime import datetime, timedelta
from external_api.data_sources.client import get_client
import warnings
warnings.filterwarnings('ignore')

class MarkowitzOptimizer:
    """
    Classe per l'ottimizzazione del portafoglio secondo la teoria di Markowitz
    """
    
    def __init__(self, symbols, risk_free_rate=0.02):
        """
        Inizializza l'ottimizzatore
        
        Args:
            symbols (list): Lista dei simboli delle azioni
            risk_free_rate (float): Tasso risk-free (default 2%)
        """
        self.symbols = symbols
        self.risk_free_rate = risk_free_rate
        self.returns_data = None
        self.expected_returns = None
        self.cov_matrix = None
        
    async def fetch_historical_data(self, days=252):
        """
        Recupera dati storici per tutti i simboli
        
        Args:
            days (int): Numero di giorni di storico (default 1 anno)
        """
        print(f"Recupero dati storici per {len(self.symbols)} asset...")
        
        client = get_client()
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=days + 50)).strftime("%Y-%m-%d")
        
        prices_data = {}
        
        async def fetch_single_stock(symbol):
            try:
                result = await client.yahoo_finance.get_stock_price(
                    symbol=symbol,
                    start_date=start_date,
                    end_date=end_date,
                    interval="1d"
                )
                if result["success"]:
                    prices = result["data"]["prices"]
                    df = pd.DataFrame(prices)
                    df['date'] = pd.to_datetime(df['date'])
                    df = df.set_index('date').sort_index()
                    return symbol, df['close'].tail(days)
                else:
                    print(f"Errore per {symbol}: {result.get('error')}")
                    return symbol, None
            except Exception as e:
                print(f"Eccezione per {symbol}: {str(e)}")
                return symbol, None
        
        # Fetch concorrente con limiti per evitare rate limiting
        batch_size = 3
        for i in range(0, len(self.symbols), batch_size):
            batch = self.symbols[i:i + batch_size]
            results = await asyncio.gather(*[fetch_single_stock(symbol) for symbol in batch])
            
            for symbol, data in results:
                if data is not None:
                    prices_data[symbol] = data
                    print(f"✓ {symbol}: {len(data)} giorni di dati")
                else:
                    print(f"✗ {symbol}: Dati non disponibili")
            
            # Pausa tra batch per evitare rate limiting
            if i + batch_size < len(self.symbols):
                await asyncio.sleep(2)
        
        if not prices_data:
            raise ValueError("Nessun dato recuperato per gli asset specificati")
        
        # Crea DataFrame dei prezzi
        prices_df = pd.DataFrame(prices_data)
        prices_df = prices_df.dropna()
        
        # Calcola i rendimenti giornalieri
        self.returns_data = prices_df.pct_change().dropna()
        
        # Calcola rendimenti attesi e matrice di covarianza
        self.expected_returns = self.returns_data.mean() * 252  # Annualizzato
        self.cov_matrix = self.returns_data.cov() * 252  # Annualizzato
        
        print(f"\nDati elaborati:")
        print(f"- Periodo: {len(self.returns_data)} giorni")
        print(f"- Asset disponibili: {list(prices_df.columns)}")
        print(f"- Rendimenti attesi medi: {self.expected_returns.mean():.2%}")
        
        return prices_df
    
    def portfolio_statistics(self, weights):
        """
        Calcola statistiche del portafoglio
        
        Args:
            weights (array): Pesi del portafoglio
            
        Returns:
            tuple: (rendimento_atteso, volatilità, sharpe_ratio)
        """
        weights = np.array(weights)
        
        # Rendimento atteso del portafoglio
        portfolio_return = np.sum(weights * self.expected_returns)
        
        # Volatilità del portafoglio
        portfolio_std = np.sqrt(np.dot(weights.T, np.dot(self.cov_matrix, weights)))
        
        # Sharpe ratio
        sharpe_ratio = (portfolio_return - self.risk_free_rate) / portfolio_std
        
        return portfolio_return, portfolio_std, sharpe_ratio
    
    def negative_sharpe_ratio(self, weights):
        """Funzione obiettivo: -Sharpe ratio (per minimizzazione)"""
        return -self.portfolio_statistics(weights)[2]
    
    def portfolio_volatility(self, weights):
        """Calcola solo la volatilità del portafoglio"""
        return self.portfolio_statistics(weights)[1]
    
    def optimize_portfolio(self, target_return=None):
        """
        Ottimizza il portafoglio
        
        Args:
            target_return (float): Rendimento target (se None, massimizza Sharpe ratio)
            
        Returns:
            dict: Risultati dell'ottimizzazione
        """
        n_assets = len(self.expected_returns)
        
        # Vincoli
        constraints = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1}]  # Somma pesi = 1
        
        if target_return is not None:
            # Vincolo sul rendimento target
            constraints.append({
                'type': 'eq', 
                'fun': lambda x: np.sum(x * self.expected_returns) - target_return
            })
        
        # Bounds per i pesi (0 <= peso <= 1)
        bounds = tuple((0, 1) for _ in range(n_assets))
        
        # Peso iniziale uguale per tutti
        initial_weights = np.array([1/n_assets] * n_assets)
        
        if target_return is None:
            # Massimizza Sharpe ratio
            result = minimize(
                self.negative_sharpe_ratio,
                initial_weights,
                method='SLSQP',
                bounds=bounds,
                constraints=constraints
            )
            optimization_type = "Max Sharpe Ratio"
        else:
            # Minimizza volatilità per rendimento target
            result = minimize(
                self.portfolio_volatility,
                initial_weights,
                method='SLSQP',
                bounds=bounds,
                constraints=constraints
            )
            optimization_type = f"Min Volatility (Target Return: {target_return:.2%})"
        
        if result.success:
            optimal_weights = result.x
            port_return, port_std, sharpe = self.portfolio_statistics(optimal_weights)
            
            return {
                'success': True,
                'optimization_type': optimization_type,
                'weights': dict(zip(self.expected_returns.index, optimal_weights)),
                'expected_return': port_return,
                'volatility': port_std,
                'sharpe_ratio': sharpe,
                'raw_weights': optimal_weights
            }
        else:
            return {
                'success': False,
                'error': result.message,
                'optimization_type': optimization_type
            }
    
    def generate_efficient_frontier(self, n_portfolios=50):
        """
        Genera la frontiera efficiente
        
        Args:
            n_portfolios (int): Numero di portafogli da calcolare
            
        Returns:
            DataFrame: Frontiera efficiente
        """
        print("Generazione frontiera efficiente...")
        
        # Range di rendimenti target
        min_return = self.expected_returns.min()
        max_return = self.expected_returns.max()
        target_returns = np.linspace(min_return, max_return, n_portfolios)
        
        efficient_portfolios = []
        
        for target_return in target_returns:
            result = self.optimize_portfolio(target_return=target_return)
            if result['success']:
                efficient_portfolios.append({
                    'Target_Return': target_return,
                    'Expected_Return': result['expected_return'],
                    'Volatility': result['volatility'],
                    'Sharpe_Ratio': result['sharpe_ratio'],
                    'Weights': result['weights']
                })
        
        frontier_df = pd.DataFrame(efficient_portfolios)
        print(f"Frontiera efficiente generata: {len(frontier_df)} portafogli")
        
        return frontier_df
    
    def plot_efficient_frontier(self, frontier_df, save_path=None):
        """
        Visualizza la frontiera efficiente
        
        Args:
            frontier_df (DataFrame): Dati della frontiera efficiente
            save_path (str): Percorso per salvare il grafico
        """
        plt.figure(figsize=(12, 8))
        
        # Plot frontiera efficiente
        plt.scatter(frontier_df['Volatility'], frontier_df['Expected_Return'], 
                   c=frontier_df['Sharpe_Ratio'], cmap='viridis', 
                   s=50, alpha=0.7, edgecolors='black', linewidth=0.5)
        
        plt.colorbar(label='Sharpe Ratio')
        
        # Trova e marca i portafogli speciali
        max_sharpe_idx = frontier_df['Sharpe_Ratio'].idxmax()
        min_vol_idx = frontier_df['Volatility'].idxmin()
        
        # Portafoglio Max Sharpe
        plt.scatter(frontier_df.loc[max_sharpe_idx, 'Volatility'], 
                   frontier_df.loc[max_sharpe_idx, 'Expected_Return'],
                   color='red', s=100, marker='*', 
                   label=f'Max Sharpe (SR: {frontier_df.loc[max_sharpe_idx, "Sharpe_Ratio"]:.2f})')
        
        # Portafoglio Min Volatilità
        plt.scatter(frontier_df.loc[min_vol_idx, 'Volatility'], 
                   frontier_df.loc[min_vol_idx, 'Expected_Return'],
                   color='blue', s=100, marker='*', 
                   label=f'Min Volatility ({frontier_df.loc[min_vol_idx, "Volatility"]:.2%})')
        
        # Asset individuali
        for i, asset in enumerate(self.expected_returns.index):
            asset_return = self.expected_returns[asset]
            asset_vol = np.sqrt(self.cov_matrix.loc[asset, asset])
            plt.scatter(asset_vol, asset_return, 
                       color='orange', s=60, marker='o', alpha=0.8)
            plt.annotate(asset, (asset_vol, asset_return), 
                        xytext=(5, 5), textcoords='offset points', 
                        fontsize=9, alpha=0.8)
        
        plt.xlabel('Volatilità (Rischio)')
        plt.ylabel('Rendimento Atteso')
        plt.title('Frontiera Efficiente di Markowitz')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Grafico salvato: {save_path}")
        
        plt.show()
        
        return max_sharpe_idx, min_vol_idx
    
    def analyze_correlation_matrix(self, save_path=None):
        """
        Analizza e visualizza la matrice di correlazione
        
        Args:
            save_path (str): Percorso per salvare il grafico
        """
        corr_matrix = self.returns_data.corr()
        
        plt.figure(figsize=(10, 8))
        mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
        
        sns.heatmap(corr_matrix, mask=mask, annot=True, cmap='coolwarm', 
                    center=0, square=True, fmt='.2f',
                    cbar_kws={"shrink": .8})
        
        plt.title('Matrice di Correlazione Asset')
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Matrice correlazione salvata: {save_path}")
        
        plt.show()
        
        return corr_matrix

async def main_markowitz_example():
    """
    Esempio completo di utilizzo dell'ottimizzatore Markowitz
    """
    print("ESEMPIO OTTIMIZZAZIONE PORTAFOGLIO MARKOWITZ")
    print("=" * 60)
    
    # Portfolio di tech stocks
    symbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA"]
    
    # Inizializza ottimizzatore
    optimizer = MarkowitzOptimizer(symbols, risk_free_rate=0.02)
    
    try:
        # 1. Recupera dati storici
        print("\n1. RECUPERO DATI STORICI")
        print("-" * 30)
        prices_df = await optimizer.fetch_historical_data(days=252)
        
        # 2. Analisi correlazioni
        print("\n2. ANALISI CORRELAZIONI")
        print("-" * 30)
        corr_matrix = optimizer.analyze_correlation_matrix(
            save_path="/workspace/charts/correlation_matrix.png"
        )
        
        # Mostra statistiche correlazione
        print("\nStatistiche Correlazione:")
        avg_corr = corr_matrix.values[np.triu_indices_from(corr_matrix.values, k=1)].mean()
        max_corr = corr_matrix.values[np.triu_indices_from(corr_matrix.values, k=1)].max()
        min_corr = corr_matrix.values[np.triu_indices_from(corr_matrix.values, k=1)].min()
        
        print(f"- Correlazione media: {avg_corr:.3f}")
        print(f"- Correlazione massima: {max_corr:.3f}")
        print(f"- Correlazione minima: {min_corr:.3f}")
        
        # 3. Ottimizzazione portafoglio Max Sharpe
        print("\n3. OTTIMIZZAZIONE MAX SHARPE RATIO")
        print("-" * 40)
        max_sharpe_result = optimizer.optimize_portfolio()
        
        if max_sharpe_result['success']:
            print(f"✓ Ottimizzazione riuscita")
            print(f"- Rendimento atteso: {max_sharpe_result['expected_return']:.2%}")
            print(f"- Volatilità: {max_sharpe_result['volatility']:.2%}")
            print(f"- Sharpe Ratio: {max_sharpe_result['sharpe_ratio']:.3f}")
            print("\nPesi ottimali:")
            for asset, weight in max_sharpe_result['weights'].items():
                print(f"  {asset}: {weight:.1%}")
        
        # 4. Genera frontiera efficiente
        print("\n4. GENERAZIONE FRONTIERA EFFICIENTE")
        print("-" * 40)
        frontier_df = optimizer.generate_efficient_frontier(n_portfolios=30)
        
        # 5. Visualizza frontiera efficiente
        print("\n5. VISUALIZZAZIONE FRONTIERA EFFICIENTE")
        print("-" * 45)
        max_sharpe_idx, min_vol_idx = optimizer.plot_efficient_frontier(
            frontier_df, 
            save_path="/workspace/charts/efficient_frontier.png"
        )
        
        # 6. Statistiche riassuntive
        print("\n6. STATISTICHE RIASSUNTIVE")
        print("-" * 30)
        
        print(f"\nPortafoglio Max Sharpe:")
        max_sharpe_portfolio = frontier_df.loc[max_sharpe_idx]
        print(f"- Rendimento: {max_sharpe_portfolio['Expected_Return']:.2%}")
        print(f"- Volatilità: {max_sharpe_portfolio['Volatility']:.2%}")
        print(f"- Sharpe Ratio: {max_sharpe_portfolio['Sharpe_Ratio']:.3f}")
        
        print(f"\nPortafoglio Min Volatilità:")
        min_vol_portfolio = frontier_df.loc[min_vol_idx]
        print(f"- Rendimento: {min_vol_portfolio['Expected_Return']:.2%}")
        print(f"- Volatilità: {min_vol_portfolio['Volatility']:.2%}")
        print(f"- Sharpe Ratio: {min_vol_portfolio['Sharpe_Ratio']:.3f}")
        
        # 7. Salva risultati
        print("\n7. SALVATAGGIO RISULTATI")
        print("-" * 30)
        
        results = {
            'optimization_date': datetime.now().isoformat(),
            'symbols': symbols,
            'risk_free_rate': optimizer.risk_free_rate,
            'max_sharpe_portfolio': max_sharpe_result,
            'efficient_frontier_summary': {
                'total_portfolios': len(frontier_df),
                'return_range': f"{frontier_df['Expected_Return'].min():.2%} - {frontier_df['Expected_Return'].max():.2%}",
                'volatility_range': f"{frontier_df['Volatility'].min():.2%} - {frontier_df['Volatility'].max():.2%}",
                'sharpe_range': f"{frontier_df['Sharpe_Ratio'].min():.3f} - {frontier_df['Sharpe_Ratio'].max():.3f}"
            },
            'correlation_stats': {
                'average_correlation': avg_corr,
                'max_correlation': max_corr,
                'min_correlation': min_corr
            }
        }
        
        # Salva file CSV della frontiera efficiente
        frontier_df.to_csv("/workspace/data/efficient_frontier.csv", index=False)
        
        # Salva risultati JSON
        import json
        with open("/workspace/data/markowitz_optimization_results.json", "w") as f:
            json.dump(results, f, indent=2, default=str)
        
        print("✓ Risultati salvati:")
        print("  - /workspace/data/efficient_frontier.csv")
        print("  - /workspace/data/markowitz_optimization_results.json")
        print("  - /workspace/charts/efficient_frontier.png")
        print("  - /workspace/charts/correlation_matrix.png")
        
    except Exception as e:
        print(f"Errore durante l'ottimizzazione: {str(e)}")
        import traceback
        traceback.print_exc()

def run_markowitz_optimization():
    """Esegue l'ottimizzazione Markowitz"""
    with concurrent.futures.ThreadPoolExecutor() as executor:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(main_markowitz_example())
        finally:
            loop.close()

if __name__ == "__main__":
    run_markowitz_optimization()