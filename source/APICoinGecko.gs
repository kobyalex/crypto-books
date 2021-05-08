/**
 * Gets coins market data from CoinGecko API versus given fiat.
 * <p>Documentation: https://www.coingecko.com/api/documentations/v3
 */
function geckoCoins(fiat, ids) {
    var market = {};

    enableCache();
    var json = importJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + fiat + "&ids=" + ids);

    if(typeof(json) === "object") {
        for(var i in json) {
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
    date = date.getDate().padLeft(2) + "-" + (date.getMonth() + 1).padLeft(2) + "-" + date.getFullYear();

    enableCache();
    return importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/history?date=" + date, "market_data.current_price." + fiat);
}

/**
 * Gets coin flux from CoinGecko API for given limit and interval.
 */
function geckoFlux(fiat, coin, limit, interval) {
    var coins = getCoins();
    limit = interval == "hourly" ? Math.ceil(limit / 24) : limit;
    var flux = [];

    enableCache();
    var json = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/market_chart?vs_currency=" + fiat + "&days=" + limit + "&interval=" + interval);
    if(json != undefined) {
        for(var i in json[0][1]) {
            flux.push({"date": new Date(json[0][1][i][0]), "price": json[0][1][i][1], "volume": json[2][1][i][1]});
        }
    }

    return flux;
}

/**
 * Debug.
 */
function geckoFluxDebug() {
    Logger.log(geckoFlux("usd", "btc", 48, "daily"));
}
