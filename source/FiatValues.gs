var usdStablecoins = ["usd", "usdt", "busd", "usdc", "dai"];

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
        var sell_count = trades[i][5];
        var sell_coin = trades[i][6].toLowerCase();
        var sell_fiat = trades[i][7];
        var fee_count = trades[i][8];
        var fee_coin = trades[i][9].toLowerCase();
        var fee_fiat = trades[i][10];

        var isBuy = buy_count > 0 && buy_coin != "" && buy_fiat === "" && coins.hasOwnProperty(buy_coin);
        var isSell = sell_count > 0 && sell_coin != "" && sell_fiat === "" && coins.hasOwnProperty(sell_coin);
        var isFee = fee_count > 0 && fee_coin != "" && fee_fiat === "" && coins.hasOwnProperty(fee_coin);

        if (isBuy && isSell) {
            setEqualFiat(sheet, coins, date, buy_count, buy_coin, sell_count, sell_coin, i + 1);
        } else if (isBuy) {
            setFiat(sheet, coins, date, buy_count, buy_coin, "C", "D", "E", i + 1);

        } else if (isSell) {
            setFiat(sheet, coins, date, sell_count, sell_coin, "F", "G", "H", i + 1);
        }

        if (isFee) {
            setFiat(sheet, coins, date, fee_count, fee_coin, "I", "J", "K", i + 1);
        }
    }
}

/**
 * Set fiat value for combined buy and sell.
 * <p>In this case the fiat value will be equal to both.
 */
function setEqualFiat(sheet, coins, date, buy_count, buy_coin, sell_count, sell_coin, row) {
    var buyCoinName = coins[buy_coin];
    var sellCoinName = coins[sell_coin];

    var coin = sell_coin;
    var coinName = sellCoinName;
    if (buyCoinName == "fiat" || sellCoinName != "fiat" || usdStablecoins.indexOf(buyCoinName) != -1) {
        coin = buy_coin;
        coinName = buyCoinName;
    }

    if (coinName == "fiat" && usdStablecoins.indexOf(coin) == -1) {
        if (coinName == buyCoinName) {
            sheet.getRange("E" + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(D" + row + ", \"USD\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * C" + row);
            sheet.getRange("H" + row).setValue("=E" + row);
        } else {
            sheet.getRange("E" + row).setValue("=H" + row);
            sheet.getRange("H" + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(G" + row + ", \"USD\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * F" + row);
        }
    } else if (usdStablecoins.indexOf(coin) != -1) {
        if (coinName == buyCoinName) {
            sheet.getRange("E" + row).setValue("=C" + row);
            sheet.getRange("H" + row).setValue("=E" + row);
        } else {
            sheet.getRange("E" + row).setValue("=H" + row);
            sheet.getRange("H" + row).setValue("=F" + row);
        }
    } else {
        if (coinName == buyCoinName) {
            var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[buy_coin] + "/history?date=" + date, "market_data.current_price.usd");
            Logger.log("FiatValueBuy:: Sell: " + [date, coins[buy_coin], rate * buy_count]);

            if (rate != undefined) {
                sheet.getRange("E" + row).setValue(rate * buy_count);
                sheet.getRange("H" + row).setValue("=E" + row);
            }
        } else {
            var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[sell_coin] + "/history?date=" + date, "market_data.current_price.usd");
            Logger.log("FiatValueSell:: Sell: " + [date, coins[sell_coin], rate * sell_count]);

            if (rate != undefined) {
                sheet.getRange("E" + row).setValue("=H" + row);
                sheet.getRange("H" + row).setValue(rate * sell_count);
            }
        }
    }
}

/**
 * Set fiat value for field.
 */
function setFiat(sheet, coins, date, count, coin, columnValue, columnTicker, columnFiat, row) {
    var coinName = coins[coin];
    if (coinName.toLowerCase() == "fiat" || usdStablecoins.indexOf(coin) != -1) {
        if (coin == "usd" || usdStablecoins.indexOf(coin) != -1) {
            sheet.getRange(columnFiat + row).setValue("=" + columnValue + row);
        } else {
            sheet.getRange(columnFiat + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(" + columnTicker + row + ", \"USD\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * " + columnValue + row);
        }
    } else {
        var rate = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/history?date=" + date, "market_data.current_price.usd");
        Logger.log("FiatValues:: Sell: " + [date, coins[coin], rate * count]);

        if (rate != undefined) {
            sheet.getRange(columnFiat + row).setValue(rate * count);
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
