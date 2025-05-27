"""
Test completo delle API finanziarie disponibili
Confronta Yahoo Finance integrata con altre soluzioni
"""
import asyncio
import concurrent.futures
import json
import time
from datetime import datetime, timedelta
from external_api.data_sources.client import get_client

async def test_yahoo_finance_comprehensive():
    """Test completo dell'API Yahoo Finance integrata"""
    print("=== TEST YAHOO FINANCE API INTEGRATA ===\n")
    
    client = get_client()
    test_symbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"]
    results = {}
    
    print("1. Test informazioni base stocks...")
    start_time = time.time()
    
    for symbol in test_symbols:
        try:
            # Test get_stock_info
            info_result = await client.yahoo_finance.get_stock_info(symbol=symbol)
            if info_result["success"]:
                results[symbol] = {
                    "basic_info": info_result["data"],
                    "status": "success"
                }
                print(f"✓ {symbol}: Market Cap ${info_result['data'].get('market_cap', 0):,.0f}")
            else:
                print(f"✗ {symbol}: {info_result.get('error', 'Errore sconosciuto')}")
                results[symbol] = {"status": "failed", "error": info_result.get('error')}
        except Exception as e:
            print(f"✗ {symbol}: Eccezione - {str(e)}")
            results[symbol] = {"status": "exception", "error": str(e)}
    
    elapsed = time.time() - start_time
    print(f"\nTempo per informazioni base: {elapsed:.2f}s\n")
    
    print("2. Test dati finanziari dettagliati...")
    start_time = time.time()
    
    # Test dati finanziari dettagliati per TSLA
    try:
        financial_data = await client.yahoo_finance.get_financial_data(symbol="TSLA")
        if financial_data["success"]:
            data = financial_data["data"]
            results["TSLA"]["financial_data"] = data
            print(f"✓ TSLA Financial Data:")
            print(f"  - Current Price: ${data['price']['current']}")
            print(f"  - Target Price: ${data['price']['target']['mean']}")
            print(f"  - P/E Ratio: {data.get('pe_ratio', 'N/A')}")
            print(f"  - Debt/Equity: {data['financial_metrics']['debt_to_equity']}")
            print(f"  - Profit Margin: {data['profitability']['profit_margin']:.2%}")
        else:
            print(f"✗ TSLA Financial Data: {financial_data.get('error')}")
    except Exception as e:
        print(f"✗ TSLA Financial Data: Eccezione - {str(e)}")
    
    elapsed = time.time() - start_time
    print(f"\nTempo per dati finanziari: {elapsed:.2f}s\n")
    
    print("3. Test dati storici prezzi...")
    start_time = time.time()
    
    # Test dati storici
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    try:
        price_data = await client.yahoo_finance.get_stock_price(
            symbol="TSLA", 
            start_date=start_date, 
            end_date=end_date, 
            interval="1d"
        )
        if price_data["success"]:
            prices = price_data["data"]["prices"]
            results["TSLA"]["historical_data"] = {
                "total_days": len(prices),
                "latest_price": prices[-1]["close"] if prices else None,
                "price_range": {
                    "min": min(p["low"] for p in prices) if prices else None,
                    "max": max(p["high"] for p in prices) if prices else None
                }
            }
            print(f"✓ TSLA Historical Data: {len(prices)} giorni")
            if prices:
                print(f"  - Latest Close: ${prices[-1]['close']}")
                print(f"  - 30d Range: ${min(p['low'] for p in prices):.2f} - ${max(p['high'] for p in prices):.2f}")
        else:
            print(f"✗ TSLA Historical Data: {price_data.get('error')}")
    except Exception as e:
        print(f"✗ TSLA Historical Data: Eccezione - {str(e)}")
    
    elapsed = time.time() - start_time
    print(f"\nTempo per dati storici: {elapsed:.2f}s\n")
    
    print("4. Test insights e analytics...")
    start_time = time.time()
    
    try:
        insights = await client.yahoo_finance.get_stock_insights(symbol="TSLA")
        if insights["success"]:
            data = insights["data"]
            results["TSLA"]["insights"] = data
            print(f"✓ TSLA Insights:")
            tech_analysis = data.get("technical_analysis", {})
            print(f"  - Technical Direction: {tech_analysis.get('short_term', {}).get('direction', 'N/A')}")
            print(f"  - Support Level: ${tech_analysis.get('support', 'N/A')}")
            print(f"  - Resistance Level: ${tech_analysis.get('resistance', 'N/A')}")
            print(f"  - Recommendation: {data.get('recommendation', {}).get('rating', 'N/A').upper()}")
        else:
            print(f"✗ TSLA Insights: {insights.get('error')}")
    except Exception as e:
        print(f"✗ TSLA Insights: Eccezione - {str(e)}")
    
    elapsed = time.time() - start_time
    print(f"\nTempo per insights: {elapsed:.2f}s\n")
    
    print("5. Test news finanziarie...")
    start_time = time.time()
    
    try:
        news = await client.yahoo_finance.get_stock_news(symbol="TSLA", snippet_count=5)
        if news["success"]:
            news_items = news["data"]["simple_news"]
            results["TSLA"]["news"] = {
                "count": len(news_items),
                "latest_headlines": [item["title"] for item in news_items[:3]]
            }
            print(f"✓ TSLA News: {len(news_items)} articoli trovati")
            for i, item in enumerate(news_items[:3]):
                print(f"  {i+1}. {item['title'][:60]}...")
        else:
            print(f"✗ TSLA News: {news.get('error')}")
    except Exception as e:
        print(f"✗ TSLA News: Eccezione - {str(e)}")
    
    elapsed = time.time() - start_time
    print(f"\nTempo per news: {elapsed:.2f}s\n")
    
    return results

async def test_concurrent_api_calls():
    """Test performance con chiamate concorrenti"""
    print("=== TEST PERFORMANCE CONCORRENTI ===\n")
    
    client = get_client()
    symbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "NFLX"]
    
    async def fetch_stock_info(symbol):
        try:
            result = await client.yahoo_finance.get_stock_info(symbol=symbol)
            return symbol, result["success"], result.get("data", {}).get("market_cap", 0)
        except Exception as e:
            return symbol, False, str(e)
    
    # Test sequenziale
    print("1. Test sequenziale...")
    start_time = time.time()
    sequential_results = []
    for symbol in symbols:
        result = await fetch_stock_info(symbol)
        sequential_results.append(result)
    sequential_time = time.time() - start_time
    
    # Test concorrente
    print("2. Test concorrente...")
    start_time = time.time()
    concurrent_results = await asyncio.gather(*[fetch_stock_info(symbol) for symbol in symbols])
    concurrent_time = time.time() - start_time
    
    print(f"\nRisultati Performance:")
    print(f"- Sequenziale: {sequential_time:.2f}s")
    print(f"- Concorrente: {concurrent_time:.2f}s")
    print(f"- Speedup: {sequential_time/concurrent_time:.2f}x")
    
    # Verifica successi
    sequential_success = sum(1 for _, success, _ in sequential_results if success)
    concurrent_success = sum(1 for _, success, _ in concurrent_results if success)
    
    print(f"- Successi sequenziali: {sequential_success}/{len(symbols)}")
    print(f"- Successi concorrenti: {concurrent_success}/{len(symbols)}")
    
    return {
        "sequential_time": sequential_time,
        "concurrent_time": concurrent_time,
        "speedup": sequential_time/concurrent_time,
        "success_rate": concurrent_success/len(symbols)
    }

def save_results(data, filename):
    """Salva risultati in formato JSON"""
    with open(f"/workspace/data/{filename}", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)

async def main():
    """Funzione principale per i test"""
    print("INIZIO TEST COMPLETO API FINANZIARIE")
    print("=" * 50)
    
    # Test Yahoo Finance integrata
    yahoo_results = await test_yahoo_finance_comprehensive()
    
    # Test performance
    performance_results = await test_concurrent_api_calls()
    
    # Combina tutti i risultati
    final_results = {
        "timestamp": datetime.now().isoformat(),
        "yahoo_finance_api": yahoo_results,
        "performance_metrics": performance_results,
        "summary": {
            "api_tested": "Yahoo Finance (Integrata)",
            "symbols_tested": list(yahoo_results.keys()),
            "successful_symbols": len([k for k, v in yahoo_results.items() if v.get("status") == "success"]),
            "total_test_time": f"{time.time():.2f}s"
        }
    }
    
    # Salva risultati
    save_results(final_results, "yahoo_finance_test_results.json")
    
    print("\n" + "=" * 50)
    print("RIEPILOGO FINALE:")
    print(f"✓ API testata: Yahoo Finance (Integrata)")
    print(f"✓ Simboli testati: {len(yahoo_results)}")
    print(f"✓ Successi: {final_results['summary']['successful_symbols']}")
    print(f"✓ Speedup concorrente: {performance_results['speedup']:.2f}x")
    print(f"✓ Risultati salvati in: data/yahoo_finance_test_results.json")

def run_async_tests():
    """Esegue i test asincroni utilizzando ThreadPoolExecutor"""
    with concurrent.futures.ThreadPoolExecutor() as executor:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(main())
        finally:
            loop.close()

if __name__ == "__main__":
    run_async_tests()