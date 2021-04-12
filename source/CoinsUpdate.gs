/**
 * Update coins sheet.
 * <p>Fetch coins data from CoinGecko API.
 */
function updateCoins() {
    var ids = getCoinNames();
    var fiat = getFiat();
    var stable = getStableCoins();
    Logger.log("CoinsUpdate:: Coins list: " + ids);

    var json = importJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + fiat + "&ids=" + ids);
    if (typeof (json) === "object") {
        var coins = {};
        for (i = 0; i < json.length; i++) {
            coins[json[i][1]["symbol"].toLowerCase()] = json[i][1];
        }

        var active = SpreadsheetApp.getActive();
        var sheet = active.getSheetByName("Coins");
        var rows = sheet.getRange("A3:A").getValues();

        for (i = 0; i < rows.length; i++) {
            if (rows[i] != undefined && rows[i][0].length > 0) {
                var ticker = rows[i][0].toLowerCase();
                if (coins.hasOwnProperty(ticker)) {
                    if (stable.indexOf(ticker) != -1) {
                        coins[ticker]["current_price"] = 1;
                    }
                    var payload = [[
                        coins[ticker]["market_cap_rank"], coins[ticker]["total_volume"],
                        coins[ticker]["market_cap"], coins[ticker]["fully_diluted_valuation"],
                        coins[ticker]["circulating_supply"], coins[ticker]["total_supply"],
                        coins[ticker]["low_24h"], coins[ticker]["high_24h"], coins[ticker]["ath"],
                        coins[ticker]["price_change_24h"], coins[ticker]["current_price"]
                    ]];
                    Logger.log("CoinsUpdate:: Row data: " + JSON.stringify([i, ticker, payload[0]]));

                    var r = i + 3;
                    var range = sheet.getRange("C" + r + ":M" + r);
                    range.setValues(payload);
                }
            }
        }

        return true;
    }

    return false;
}

/**
 * Debug method.
 */
function updateCoinsDebug() {
    disableCache();
    updateCoins();
}
