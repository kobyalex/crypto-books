/**
 * Gets coins market data from CoinGecko API versus given fiat.
 * <p>Documentation: https://www.coingecko.com/api/documentations/v3
 */
function cryptoMarkets(key, fiat, tickers) {
    var market = {};

    disableCache();
    var json = importJson("https://min-api.cryptocompare.com/data/pricemultifull?api_key=" + key + "&tsyms=" + fiat + "&fsyms=" + tickers + "&relaxedValidation=true");

    if(typeof(json) === "object" && json.length > 1 && json[0].length > 1) {
        var key, data, ticker;
        for(key in json[0][1]) {
            data = json[0][1][key][fiat.toUpperCase()];
            ticker = key.toLowerCase();

            market[ticker] = [];
            if(data.hasOwnProperty("MKTCAP")) {
                market[ticker]["market_cap"] = data["MKTCAP"];
            }
            if(data.hasOwnProperty("SUPPLY")) {
                market[ticker]["circulating_supply"] = data["SUPPLY"];
            }
            if(data.hasOwnProperty("LOW24HOUR")) {
                market[ticker]["low_24h"] = data["LOW24HOUR"];
            }
            if(data.hasOwnProperty("HIGH24HOUR")) {
                market[ticker]["high_24h"] = data["HIGH24HOUR"];
            }
            if(data.hasOwnProperty("CHANGE24HOUR")) {
                market[ticker]["price_change_24h"] = data["CHANGE24HOUR"];
            }
            if(data.hasOwnProperty("PRICE")) {
                market[ticker]["current_price"] = data["PRICE"];
            }
        }
    }

    return market;
}

/**
 * Gets coin vs fiat exchnage rate from CryptoCompare API for given date.
 */
function cryptoRate(key, fiat, coin, date) {
    enableCache();
    var rate = importJson("https://min-api.cryptocompare.com/data/v2/histohour?api_key=" + key + "&fsym=" + coin + "&tsym=" + fiat + "&toTs=" + (date.getTime() / 1000) + "&limit=1","Data.Data.0.close");
    if(typeof(rate) === "number") {
        return rate;
    }

    return;
}

/**
 * Debug.
 */
function cryptoMarketsDebug() {
    disableCache();
    var key = getCryptoCompareKey();
    Logger.log(cryptoMarkets(key, "usd", "btc,eth,ltc"));
}

function cryptoRateDebug() {
    disableCache();
    var key = getCryptoCompareKey();
    Logger.log(cryptoRate(key, "usd", "btc", new Date("04/10/2021")));
}
