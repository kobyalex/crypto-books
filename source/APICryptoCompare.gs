
/**
 * Gets coin vs fiat exchnage rate from CryptoCompare API for given date.
 */
function cryptoRate(key, fiat, coin, date) {
    var rate = importJson("https://min-api.cryptocompare.com/data/v2/histohour?api_key=" + key + "&fsym=" + coin + "&tsym=" + fiat + "&toTs=" + (date.getTime() / 1000) + "&limit=1","Data.Data.0.close");
    if(typeof(rate) === "number") {
        return rate;
    }

    return;
}

/**
 * Debug.
 */
function cryptoRateDebug() {
    disableCache();
    var key = getCryptoCompareKey();
    Logger.log(cryptoRate(key, "usd", "btc", new Date("04/10/2021")));
}