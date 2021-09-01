/**
 * Gets coins market data from CryptoCompare API versus given fiat.
 * <p>Documentation: https://www.coingecko.com/api/documentations/v3
 */
function cryptoCoins(ui, key, fiat, tickers) {
    var market = {};

    disableCache();
    var json = importJson("https://min-api.cryptocompare.com/data/pricemultifull?api_key=" + key + "&tsyms=" + fiat + "&fsyms=" + tickers + "&relaxedValidation=true&extraParams=cryptoBooks2");

    if(typeof(json) === "string") {
        ui.alert('CryptoCompare API error: ' + json);

    } else if(typeof(json) === "object" && json.length > 1 && json[0].length > 1) {
        var data, ticker;
        for(var i in json[0][1]) {
            data = json[0][1][i][fiat.toUpperCase()];
            ticker = i.toLowerCase();

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

/*
 * Gets coin historical data for Sparkline.
 */
function cryptoSparkline(ui, key, coin) {
    var fiat = getFiat();

    enableCache();
    var json = importJson("https://min-api.cryptocompare.com/data/v2/histohour?api_key=" + key + "&fsym=" + coin + "&tsym=" + fiat + "&limit=168&extraParams=cryptoBooks2");

    var sparkline = [];
    if(typeof(json) === "string") {
        ui.alert('CryptoCompare API error: ' + json);

    } else if(typeof(json) === "object" && json.length > 5 && json[5].length > 1 && json[5][1].hasOwnProperty("Data")) {
        for (j = 0; j < json[5][1]["Data"].length; j++) {
            sparkline.push(json[5][1]["Data"][j]["close"]);
        }

    }

    return sparkline;
}

/**
 * Gets coin vs fiat exchnage rate from CryptoCompare API for given date.
 */
function cryptoRate(ui, key, fiat, coin, date) {
    enableCache();
    var json = importJson("https://min-api.cryptocompare.com/data/v2/histohour?api_key=" + key + "&fsym=" + coin + "&tsym=" + fiat + "&toTs=" + (date.getTime() / 1000) + "&limit=1&extraParams=cryptoBooks2","Data.Data.0.close");

    if(typeof(json) === "string") {
        ui.alert('CryptoCompare API error: ' + json);

    } else if(typeof(json) === "number") {
        return json;
    }

    return;
}

/**
 * Gets coin flux from CryptoCompare API for given limit and interval.
 */
function cryptoFlux(ui, key, fiat, coin, limit, interval) {
    interval = interval == "hourly" ? "histohour" : "histoday";
    var flux = [];

    disableCache();
    var json = importJson("https://min-api.cryptocompare.com/data/v2/" + interval + "?api_key=" + key + "&fsym=" + coin + "&tsym=" + fiat + "&limit=" + limit + "&extraParams=cryptoBooks2");

    if(typeof(json) === "string") {
        ui.alert('CryptoCompare API error: ' + json);

    } else if(typeof(json) === "object" && json.length > 5 && json[5].length > 1 && json[5][1].hasOwnProperty("Data")) {
        for(var i in json[5][1]["Data"]) {
            flux.push({"date": new Date(json[5][1]["Data"][i]["time"] * 1000), "price": json[5][1]["Data"][i]["close"], "volume": json[5][1]["Data"][i]["volumeto"]});
        }
    }

    return flux;
}

/**
 * Debug.
 */
function cryptoCoinsDebug() {
    Logger.log(cryptoCoins(SpreadsheetApp.getUi(), getCryptoCompareKey(), "usd", "btc,eth,ltc"));
}

function cryptoSparklineDebug() {
    Logger.log(cryptoSparkline(SpreadsheetApp.getUi(), getCryptoCompareKey(), "ada"));
}

function cryptoRateDebug() {
    Logger.log(cryptoRate(SpreadsheetApp.getUi(), getCryptoCompareKey(), "usd", "btc", new Date("04/10/2021")));
}

function cryptoFluxDebug() {
    Logger.log(cryptoFlux(SpreadsheetApp.getUi(), getCryptoCompareKey(), "usd", "btc", 48, "daily"));
}
