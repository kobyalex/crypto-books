/**
 * Adds missing fiat values to Trades.
 */
function addFiatValues() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Trades");
    var trades = sheet.getDataRange().getValues();

    var coins = getCoins();
    for (var i = 0; i < trades.length; i++) {
        var r = i + 1;
        var date = new Date(trades[i][0]);
        var date = date.getDate().padLeft(2) + "-" + date.getMonth().padLeft(2) + "-" + date.getFullYear();

        var buy_count = trades[i][2];
        var buy_coin = trades[i][3].toLowerCase();
        var buy_fiat = trades[i][4];
        if (buy_count > 0 && buy_coin != "" && buy_fiat === "") {
            var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[buy_coin] + "/history?date=" + date, "market_data.current_price.usd")
            Logger.log("FiatValues:: Buy: " + [date, coins[buy_coin], rate * buy_count]);
            sheet.getRange("E" + r).setValue([rate * buy_count]);
        }

        var sell_count = trades[i][5];
        var sell_coin = trades[i][6].toLowerCase();
        var sell_fiat = trades[i][7];
        if (sell_count > 0 && sell_coin != "" && sell_fiat === "") {
            var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[sell_coin] + "/history?date=" + date, "market_data.current_price.usd")
            Logger.log("FiatValues:: Sell: " + [date, coins[sell_coin], rate * sell_count]);
            sheet.getRange("H" + r).setValue([rate * sell_count]);
        }

        var fee_count = trades[i][8];
        var fee_coin = trades[i][9].toLowerCase();
        var fee_fiat = trades[i][10];
        if (fee_count > 0 && fee_coin != "" && fee_fiat === "") {
            var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[fee_coin] + "/history?date=" + date, "market_data.current_price.usd")
            Logger.log("FiatValues:: Fee: " + [date, coins[fee_coin], rate * fee_count]);
            sheet.getRange("K" + r).setValue([rate * fee_count]);
        }
    }
}

/**
 * Gets coin tickers and names.
 * <p>Will lowercase and hyphenate spaces for CoinGeko request.
 */
function getCoins() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Coins");
    var rows = sheet
        .getRange("A3:B")
        .getValues()
        .filter(String);

    var coins = {};

    for (i = 0; i < rows.length; i++) {
        var ticker = rows[i][0].toLowerCase();
        var name = rows[i][1].toLowerCase().replace (/\s/g, "-");

        if (ticker !== "" && ticker !== "usd") {
            coins[ticker] = name;
        }
    }

    return coins;
}
