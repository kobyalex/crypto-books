/**
 * Adds missing fiat values to Trades.
 */
function addFiatValues() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Trades");
    var trades = sheet.getDataRange().getValues();

    var fiat = getFiat();
    var coins = getCoins();
    var stable = getStableCoins();
    for(var i = 1; i < trades.length; i++) {
        var date = new Date(trades[i][0]);

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

        if(isBuy && isSell) {
            setEqualFiat(sheet, coins, fiat, stable, date, buy_count, buy_coin, sell_count, sell_coin, i + 1);

        } else if(isBuy) {
            setFiat(sheet, coins, fiat, stable, date, buy_count, buy_coin, "C", "D", "E", i + 1);

        } else if(isSell) {
            setFiat(sheet, coins, fiat, stable, date, sell_count, sell_coin, "F", "G", "H", i + 1);
        }

        if(isFee) {
            setFiat(sheet, coins, fiat, stable, date, fee_count, fee_coin, "I", "J", "K", i + 1);
        }
    }
}

/**
 * Set fiat value for combined buy and sell.
 * <p>In this case the fiat value will be equal to both.
 */
function setEqualFiat(sheet, coins, fiat, stable, date, buy_count, buy_coin, sell_count, sell_coin, row) {
    var buyCoinName = coins[buy_coin];
    var sellCoinName = coins[sell_coin];

    var coin = sell_coin;
    var coinName = sellCoinName;
    if((buyCoinName == "fiat" && sellCoinName != "fiat") || stable.indexOf(buy_coin) != -1) {
        coin = buy_coin;
        coinName = buyCoinName;
    }

    if(coinName == "fiat" && stable.indexOf(coin) == -1) {
        if(coinName == buyCoinName) {
            sheet.getRange("E" + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(D" + row + ", \"" + fiat.toUpperCase() + "\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * C" + row);
            sheet.getRange("H" + row).setValue("=E" + row);
        } else {
            sheet.getRange("E" + row).setValue("=H" + row);
            sheet.getRange("H" + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(G" + row + ", \"" + fiat.toUpperCase() + "\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * F" + row);
        }
    } else if(stable.indexOf(coin) != -1) {
        if(coinName == buyCoinName) {
            sheet.getRange("E" + row).setValue("=C" + row);
            sheet.getRange("H" + row).setValue("=E" + row);
        } else {
            sheet.getRange("E" + row).setValue("=H" + row);
            sheet.getRange("H" + row).setValue("=F" + row);
        }
    } else {
        if(coinName == buyCoinName) {
            var rate = apiRate(fiat, buy_coin, date);
            Logger.log("setEqualFiat:: " + [date, buy_coin, rate * buy_count]);

            if(rate != undefined) {
                sheet.getRange("E" + row).setValue(rate * buy_count);
                sheet.getRange("H" + row).setValue("=E" + row);
            }
        } else {
            var rate = apiRate(fiat, sell_coin, date);
            Logger.log("setEqualFiat:: " + [date, sell_coin, rate * sell_count]);

            if(rate != undefined) {
                sheet.getRange("E" + row).setValue("=H" + row);
                sheet.getRange("H" + row).setValue(rate * sell_count);
            }
        }
    }
}

/**
 * Set fiat value for field.
 */
function setFiat(sheet, coins, fiat, stable, date, count, coin, columnValue, columnTicker, columnFiat, row) {
    var coinName = coins[coin];
    if(coinName.toLowerCase() == "fiat" || stable.indexOf(coin) != -1) {
        if(coin == fiat || stable.indexOf(coin) != -1) {
            sheet.getRange(columnFiat + row).setValue("=" + columnValue + row);
        } else {
            sheet.getRange(columnFiat + row).setValue("=INDEX(GOOGLEFINANCE(CONCAT(\"CURRENCY:\", CONCAT(" + columnTicker + row + ", \"" + fiat.toUpperCase() + "\")), \"price\", TO_DATE(A" + row + ")), 2, 2) * " + columnValue + row);
        }
    } else {
        var rate = apiRate(fiat, coin, date);
        Logger.log("setFiat:: " + [date, coin, rate * count]);

        if(rate != undefined) {
            sheet.getRange(columnFiat + row).setValue(rate * count);
        }
    }
}
