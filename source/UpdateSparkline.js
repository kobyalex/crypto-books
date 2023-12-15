/**
 * Update sparkline workbook.
 * <p>Fetch coins historical data from an API.
 */
function updateSparkline(ui) {
  var active = SpreadsheetApp.getActive();
  var sheet = active.getSheetByName("Sparkline");

  var coins = getCoins();
  var sparkline = getSparklineCoins();
  var next = Object.keys(sparkline).length + 2;

  for (var ticker in coins) {
    if (ticker.indexOf("-") > -1) continue;

    var r = sparkline[ticker];
    if (r === undefined) {
      r = next;
      next++;
    }

    var lastUpdate = sheet.getRange("B" + r).getValue() + 1800;

    // Limit updates to once every 30 minutes.
    if (lastUpdate < Date.now() / 1000) {
      var historical = apiSparkline(ui, ticker);
      if (historical != undefined) {
        Logger.log(historical);

        sheet.getRange("A" + r).setValue(ticker.toUpperCase());

        if (historical.length == 0) {
          sheet.getRange("B" + r).clearContent();
        } else {
          // Shrink array if larger.
          for (var i = 0; i < historical.length - 169; i++) historical.shift();
          // Grow array if smaller.
          for (var i = historical.length; i < 169; i++) historical.push("");

          sheet.getRange("B" + r).setValue(Date.now() / 1000);
          sheet.getRange("C" + r + ":FO" + r).setValues([historical]);
        }
      }
    }
  }
}

/**
 * Get Sparkline coins.
 */
function getSparklineCoins() {
  var active = SpreadsheetApp.getActive();
  var sheet = active.getSheetByName("Sparkline");
  var rows = sheet.getRange("A2:A").getValues().filter(String);

  var coins = {};

  for (i = 0; i < rows.length; i++) {
    var ticker = rows[i][0].toLowerCase();

    if (ticker !== "") {
      coins[ticker] = i + 2;
    }
  }

  return coins;
}

/**
 * Debug.
 */
function updateSparklineDebug() {
  updateSparkline(SpreadsheetApp.getUi());
}
