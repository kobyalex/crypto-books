/**
 * Gets coins data.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiCoins(ui, fiat, ids, tickers) {
    // Added CoinGecko Demo API key by Koby
    var market = undefined;
    var geckoKey = getCoinGeckoDemoKey();
    if (geckoKey != "") {
        market = geckoCoinsDemo(ui, geckoKey, fiat, ids);
    }
    // var market = geckoCoins(ui, fiat, ids); // Removed that method by Koby

    if (market == undefined || Object.keys(market).length == 0) {
        var key = getCryptoCompareKey();
        if (key != "") {
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
    if (key != "") {
        sparkline = cryptoSparkline(ui, key, coin);
    }
    if (sparkline.length == 0) {
        // Added CoinGecko Demo API key by Koby
        var geckoKey = getCoinGeckoDemoKey();
        if (geckoKey != "") {
            sparkline = geckoSparklineDemo(ui, geckoKey, coin);
        }
        // sparkline = geckoSparkline(ui, coin);
    }

    return sparkline;
}

/**
 * Gets coin vs fiat exchnage rate.
 * <p>This is an implementation wrapper for API change capability.
 */
function apiRate(ui, fiat, coin, date) {
    var rate = undefined;
    var key = getCryptoCompareKey();
    if (key != "") {
        rate = cryptoRate(ui, key, fiat, coin, date);
    }
    // Added CoinGecko Demo API key by Koby
    if (rate == undefined) {
        var geckoKey = getCoinGeckoDemoKey();
        if (geckoKey != "") {
            rate = geckoRateDemo(ui, geckoKey, fiat, coin, date);
        }
    }

    return rate;
}

/**
 * Gets coin flux.
 */
function apiFlux(ui, fiat, coin, days, interval) {
    // Added CoinGecko Demo API key by Koby
    var flux = undefined;
    var geckoKey = getCoinGeckoDemoKey();
    if (geckoKey != "") {
        flux = geckoFluxDemo(ui, geckoKey, fiat, coin, days, interval);
    }
    // var flux = geckoFlux(ui, fiat, coin, days, interval);

    if (flux == undefined || Object.keys(flux).length == 0) {
        var key = getCryptoCompareKey();
        if (key != "") {
            flux = cryptoFlux(ui, key, fiat, coin, days, interval);
        }
    }

    return flux;
}
