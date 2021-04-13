/**
 * Gets coins market data from CoinGecko API versus given fiat.
 * <p>Documentation: https://www.coingecko.com/api/documentations/v3
 */
function geckoMarkets(fiat, ids) {
    var market = {};

    var json = importJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + fiat + "&ids=" + ids);
    if (typeof (json) === "object") {
        for (i = 0; i < json.length; i++) {
            market[json[i][1]["symbol"].toLowerCase()] = json[i][1];
        }
    }

    return market;
}

/**
 * Gets coin vs fiat exchnage rate from CoinGecko API for given date.
 */
function geckoRate(fiat, coin, date) {
    var coins = getCoins();
    var date = date.getDate().padLeft(2) + "-" + (date.getMonth() + 1).padLeft(2) + "-" + date.getFullYear();
    return importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/history?date=" + date, "market_data.current_price." + fiat);
}

/**
 * Gets coin flux from CoinGecko API for given number of days.
 */
function geckoFlux(fiat, coin, days) {
    var coins = getCoins();
    return importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/market_chart?vs_currency=" + fiat + "&days=" + days);
}
