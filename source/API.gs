/**
 * Gets coins data.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiCoins(fiat, ids, tickers) {
    var market = geckoCoins(fiat, ids);

    if(market == undefined || Object.keys(market).length == 0) {
        var key = getCryptoCompareKey();
        if(key != "") {
            market = cryptoCoins(key, fiat, tickers);
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
    var flux = geckoFlux(fiat, coin, days, interval);

    if(flux == undefined || Object.keys(flux).length == 0) {
        var key = getCryptoCompareKey();
        if(key != "") {
            flux = cryptoFlux(key, fiat, coin, days, interval);
        }
    }

    return flux;
}
