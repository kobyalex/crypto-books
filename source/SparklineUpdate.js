/**
 * Update coins workbook sparkline.
 * <p>Fetch coins historical data from an API.
 */
function updateSparkline(ui) {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Sparkline");

    var coins = getCoins();

    var r = 0;
    for(var ticker in coins) {
        r++;

        var lastUpdate = sheet.getRange("B" + r).getValue() + 1800;

        // Limit updates to once every 30 minutes.
        if (lastUpdate < (Date.now() / 1000)) {
            var historical = apiSparkline(ui, ticker);
            if(historical != undefined) {
                Logger.log(historical);

                sheet.getRange("A" + r).setValue(ticker.toUpperCase());
                if(historical.length >= 169) {
                    for(var i = 0; i < historical.length - 169; i++) {
                        historical.shift();
                    }

                    sheet.getRange("B" + r).setValue(Date.now() / 1000);
                    sheet.getRange("C" + r + ":FO" + r).setValues([historical]);
                } else {
                    sheet.getRange("B" + r + ":FO" + r).clearContent();
                }
            }
        }
    }
}

/**
 * Debug.
 */
function updateSparklineDebug() {
    updateSparkline(SpreadsheetApp.getUi());
}
