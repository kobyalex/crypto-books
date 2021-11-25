/**
 * Gets coins data.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiCoins(ui, fiat, ids, tickers) {
    var market = geckoCoins(ui, fiat, ids);

    if(market == undefined || Object.keys(market).length == 0) {
        var key = getCryptoCompareKey();
        if(key != "") {
            market = cryptoCoins(ui, key, fiat, tickers);
        }
    }

    return market;
}

/**
 * Gets coins historical date for Coins workbook Sparkline.
 * <p>This requires a CryptoCompare API key to be configured.
 */
function apiSparkline(ui, coin) {
    var sparkline = [];

    var key = getCryptoCompareKey();
    if(key != "") {
        sparkline = cryptoSparkline(ui, key, coin);
        if (sparkline.length == 0) {
            sparkline = geckoSparkline(ui, coin);
        }
    }

    return sparkline;
}

/**
 * Gets coin vs fiat exchnage rate.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiRate(ui, fiat, coin, date) {
    var key = getCryptoCompareKey();
    if(key != "") {
        return cryptoRate(ui, key, fiat, coin, date);
    }
    return geckoRate(ui, fiat, coin, date);
}

/**
 * Gets coin flux.
 */
function apiFlux(ui, fiat, coin, days, interval) {
    var flux = geckoFlux(ui, fiat, coin, days, interval);

    if(flux == undefined || Object.keys(flux).length == 0) {
        var key = getCryptoCompareKey();
        if(key != "") {
            flux = cryptoFlux(ui, key, fiat, coin, days, interval);
        }
    }

    return flux;
}
