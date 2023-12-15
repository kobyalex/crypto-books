/**
 * Adds missing fiat values to Trades.
 */
function addFiatValues(ui) {
  var sheet = SpreadsheetApp.getActive();

  var name = sheet.getSheetName();
  if (name.indexOf("Trades") == -1 && name.indexOf("Wallet") == -1) {
    ui.alert("Active workbook is not Trades or of Wallet type!");
    return;
  }

  if (name.indexOf("Trades") != -1) {
    var trades = sheet.getRange("A2:K").getValues();
    var offset = 2;
    var datecol = "A";
    var columns = [
      ["C", "D", "E"],
      ["F", "G", "H"],
      ["I", "J", "K"],
    ];
  } else if (name.indexOf("Wallet") != -1) {
    var trades = sheet.getRange("J3:T").getValues();
    var offset = 3;
    var datecol = "J";
    var columns = [
      ["L", "M", "N"],
      ["O", "P", "Q"],
      ["R", "S", "T"],
    ];
  }

  var fiat = getFiat();
  var coins = getCoins();
  var stable = getStableCoins();
  for (var i = 0; i < trades.length; i++) {
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

    if (isBuy && isSell) {
      setEqualFiat(
        ui,
        sheet,
        coins,
        fiat,
        stable,
        date,
        buy_count,
        buy_coin,
        sell_count,
        sell_coin,
        datecol,
        [columns[0], columns[1]],
        offset + i
      );
    } else if (isBuy) {
      setFiat(ui, sheet, coins, fiat, stable, date, buy_count, buy_coin, datecol, columns[0], offset + i);
    } else if (isSell) {
      setFiat(ui, sheet, coins, fiat, stable, date, sell_count, sell_coin, datecol, columns[1], offset + i);
    }

    if (isFee) {
      setFiat(ui, sheet, coins, fiat, stable, date, fee_count, fee_coin, datecol, columns[2], offset + i);
    }
  }
}

/**
 * Set fiat value for combined buy and sell.
 * <p>In this case the fiat value will be equal to both.
 */
function setEqualFiat(
  ui,
  sheet,
  coins,
  fiat,
  stable,
  date,
  buy_count,
  buy_coin,
  sell_count,
  sell_coin,
  datecol,
  columns,
  row
) {
  var buyCoinName = coins[buy_coin];
  var sellCoinName = coins[sell_coin];

  var coin = sell_coin;
  var coinName = sellCoinName;
  if ((buyCoinName == "fiat" && sellCoinName != "fiat") || stable.indexOf(buy_coin) != -1) {
    coin = buy_coin;
    coinName = buyCoinName;
  }

  if (stable.indexOf(coin) != -1) {
    if (coinName == buyCoinName) {
      sheet.getRange(columns[0][2] + row).setValue("=" + columns[0][0] + row);
      sheet.getRange(columns[1][2] + row).setValue("=" + columns[0][2] + row);
    } else {
      sheet.getRange(columns[0][2] + row).setValue("=" + columns[1][2] + row);
      sheet.getRange(columns[1][2] + row).setValue("=" + columns[1][0] + row);
    }
  } else if (coinName == "fiat" && stable.indexOf(coin) == -1) {
    if (coinName == buyCoinName) {
      sheet
        .getRange(columns[0][2] + row)
        .setValue(
          '=INDEX(GOOGLEFINANCE(CONCAT("CURRENCY:", CONCAT(' +
            columns[0][1] +
            row +
            ', "' +
            fiat.toUpperCase() +
            '")), "price", TO_DATE(' +
            datecol +
            row +
            ")), 2, 2) * " +
            columns[0][0] +
            row
        );
      sheet.getRange(columns[1][2] + row).setValue("=" + columns[0][2] + row);
    } else {
      sheet.getRange(columns[0][2] + row).setValue("=" + columns[1][2] + row);
      sheet
        .getRange(columns[1][2] + row)
        .setValue(
          '=INDEX(GOOGLEFINANCE(CONCAT("CURRENCY:", CONCAT(' +
            columns[1][1] +
            row +
            ', "' +
            fiat.toUpperCase() +
            '")), "price", TO_DATE(' +
            datecol +
            row +
            ")), 2, 2) * " +
            columns[1][0] +
            row
        );
    }
  } else {
    if (coinName == buyCoinName) {
      var rate = apiRate(ui, fiat, buy_coin, date);
      Logger.log("setEqualFiat:: " + [date, buy_coin, rate * buy_count]);

      if (rate != undefined) {
        sheet.getRange(columns[0][2] + row).setValue(rate * buy_count);
        sheet.getRange(columns[1][2] + row).setValue("=" + columns[0][2] + row);
      }
    } else {
      var rate = apiRate(ui, fiat, sell_coin, date);
      Logger.log("setEqualFiat:: " + [date, sell_coin, rate * sell_count]);

      if (rate != undefined) {
        sheet.getRange(columns[0][2] + row).setValue("=" + columns[1][2] + row);
        sheet.getRange(columns[1][2] + row).setValue(rate * sell_count);
      }
    }
  }
}

/**
 * Set fiat value for field.
 */
function setFiat(ui, sheet, coins, fiat, stable, date, count, coin, datecol, columns, row) {
  var coinName = coins[coin];
  if (coinName.toLowerCase() == "fiat" || stable.indexOf(coin) != -1) {
    if (coin == fiat || stable.indexOf(coin) != -1) {
      sheet.getRange(columns[2] + row).setValue("=" + columns[0] + row);
    } else {
      sheet
        .getRange(columns[2] + row)
        .setValue(
          '=INDEX(GOOGLEFINANCE(CONCAT("CURRENCY:", CONCAT(' +
            columns[1] +
            row +
            ', "' +
            fiat.toUpperCase() +
            '")), "price", TO_DATE(' +
            datecol +
            row +
            ")), 2, 2) * " +
            columns[0] +
            row
        );
    }
  } else {
    var rate = apiRate(ui, fiat, coin, date);
    Logger.log("setFiat:: " + [date, coin, rate * count]);

    if (rate != undefined) {
      sheet.getRange(columns[2] + row).setValue(rate * count);
    }
  }
}
