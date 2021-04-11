/**
 * Adds missing fiat values to Trades.
 */
function addFiatValues() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Trades");
    var trades = sheet.getDataRange().getValues();

    var coins = getCoins();
    for (var i = 1; i < trades.length; i++) {
        var date = new Date(trades[i][0]);
        var date = date.getDate().padLeft(2) + "-" + (date.getMonth() + 1).padLeft(2) + "-" + date.getFullYear();

        var buy_count = trades[i][2];
        var buy_coin = trades[i][3].toLowerCase();
        var buy_fiat = trades[i][4];
        if (buy_count > 0 && buy_coin != "" && buy_fiat === "" && coins.hasOwnProperty(buy_coin)) {
            setFiat(sheet, coins, date, buy_count, buy_coin, buy_fiat, "C", "D", "E", i + 1);
        }

        var sell_count = trades[i][5];
        var sell_coin = trades[i][6].toLowerCase();
        var sell_fiat = trades[i][7];
        if (sell_count > 0 && sell_coin != "" && sell_fiat === "" && coins.hasOwnProperty(sell_coin)) {
            setFiat(sheet, coins, date, sell_count, sell_coin, sell_fiat, "F", "G", "H", i + 1);
        }

        var fee_count = trades[i][8];
        var fee_coin = trades[i][9].toLowerCase();
        var fee_fiat = trades[i][10];
        if (fee_count > 0 && fee_coin != "" && fee_fiat === "" && coins.hasOwnProperty(fee_coin)) {
            setFiat(sheet, coins, date, fee_count, fee_coin, fee_fiat, "I", "J", "K", i + 1);
        }
    }
}

/**
 * Set fiat value for field.
 */
function setFiat(sheet, coins, date, count, coin, fiat, columnValue, columnTicker, columnFiat, row) {
    if (count > 0 && coin != "" && fiat === "" && coins.hasOwnProperty(coin)) {
        var coinName = coins[coin];
        if (coinName.toLowerCase() == "fiat" || coin.toLowerCase() == "usdt" || coin.toLowerCase() == "dai") {
            if (coin == "usd" || coin == "usdt" || coin == "dai") {
                sheet.getRange(columnFiat + row).setValue("=" + columnValue + row);
            } else {
                sheet.getRange(columnFiat + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(" + columnTicker + row + ", \"USD\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * " + columnValue + row);
            }
        } else {
            var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/history?date=" + date, "market_data.current_price.usd");
            Logger.log("FiatValues:: Sell: " + [date, coins[coin], rate * count]);

            if (rate != undefined) {
                sheet.getRange(columnFiat + row).setValue([rate * count]);
            }
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
        var name = rows[i][1].toLowerCase().replace(/\s/g, "-");

        if (ticker !== "" && name !== "") {
            coins[ticker] = name;
        }
    }

    return coins;
}
