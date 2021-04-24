/**
 * Gets coins market data.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiMarkets(fiat, ids, tickers) {
    var market = geckoMarkets(fiat, ids);

    if(Object.keys(market).length == 0) {
        var key = getCryptoCompareKey();
        if(key != "") {
            market = cryptoMarkets(key, fiat, tickers);
        }
    }

    return market;
}

/**
 * Gets coin vs fiat exchnage rate.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiRate(fiat, coin, date) {
    var key = getCryptoCompareKey();
    if(key != "") {
        return cryptoRate(key, fiat, coin, date);
    }
    return geckoRate(fiat, coin, date);
}

/**
 * Gets coin flux.
 */
function apiFlux(fiat, coin, days, interval) {
    return geckoFlux(fiat, coin, days, interval);
}

/**
 * Debug.
 */
function apiMarketsDebug() {
    disableCache();
    return apiMarkets("usd", "bitcoin,ethereum,litecoin", "btc,eth,ltc");
}
