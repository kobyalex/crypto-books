/**
 * Gets coins market data from CoinGecko API versus given fiat.
 * <p>Documentation: https://www.coingecko.com/api/documentations/v3
 */
function geckoCoinsDemo(ui, key, fiat, ids) {
    var market = {};

    enableCache();
    var json = importJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + fiat + "&ids=" + ids + "&x_cg_demo_api_key" + key);
    https://pro-api.coingecko.com/api/v3/
    if (typeof (json) === "string" && getCryptoCompareKey() == "") {
        ui.alert('CoinGecko API error: ' + json);

    } else if (typeof (json) === "object") {
        for (var i in json) {
            market[json[i][1]["symbol"].toLowerCase()] = json[i][1];
        }
    }

    return market;
}

/*
 * Gets coin historical data for Sparkline.
 */
function geckoSparklineDemo(ui, key, coin) {
    var fiat = getFiat();
    var coins = getCoins();

    enableCache();
    var json = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/market_chart?vs_currency=" + fiat + "&days=7&interval=hourly" + "&x_cg_demo_api_key" + key);

    var sparkline = [];
    if (typeof (json) === "string") {
        // It be annoying to alert so much here for not much benefit.
        //ui.alert('CoinGecko API error: ' + json);

    } else {
        for (var i in json[0][1]) {
            sparkline.push(json[0][1][i][1]);
        }
    }

    return sparkline;
}

/**
 * Gets coin vs fiat exchnage rate from CoinGecko API for given date.
 */
function geckoRateDemo(ui, key, fiat, coin, date) {
    var coins = getCoins();
    date = date.getDate().padLeft(2) + "-" + (date.getMonth() + 1).padLeft(2) + "-" + date.getFullYear();

    enableCache();
    var json = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/history?date=" + date, "market_data.current_price." + fiat + "&x_cg_demo_api_key" + key);

    if (typeof (json) === "string") {
        ui.alert('CoinGecko API error: ' + json);
        return;

    } else if (typeof (json) === "number") {
        return json;
    }

    return;
}

/**
 * Gets coin flux from CoinGecko API for given limit and interval.
 */
function geckoFluxDemo(ui, key, fiat, coin, limit, interval) {
    var coins = getCoins();
    limit = interval == "hourly" ? Math.ceil(limit / 24) : limit;
    var flux = [];

    enableCache();
    var json = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/market_chart?vs_currency=" + fiat + "&days=" + limit + "&interval=" + interval + "&x_cg_demo_api_key" + key);

    if (typeof (json) === "string" && getCryptoCompareKey() == "") {
        ui.alert('CoinGecko API error: ' + json);

    } else {
        for (var i in json[0][1]) {
            flux.push({ "date": new Date(json[0][1][i][0]), "price": json[0][1][i][1], "volume": json[2][1][i][1] });
        }
    }

    return flux;
}

/**
 * Debug.
 */
function geckoCoinsDemoDebug() {
    Logger.log(geckoCoinsDemo(SpreadsheetApp.getUi(), getCoinGeckoDemoKey(), "usd", "btc,eth,ltc"));
}
function geckoSparklineDemoDebug() {
    Logger.log(geckoSparklineDemo(SpreadsheetApp.getUi(), getCoinGeckoDemoKey(), "ata"));
}
function geckoRateDemoDebug() {
    Logger.log(geckoRateDemo(SpreadsheetApp.getUi(), getCoinGeckoDemoKey(), "usd", "btc", new Date("04/10/2021")));
}
function geckoFluxDemoDebug() {
    Logger.log(geckoFluxDemo(SpreadsheetApp.getUi(), getCoinGeckoDemoKey(), "usd", "btc", 48, "daily"));
}

