/**
 * Update flux.
 * <p>This is an overview of the holdings of a coin over a period of time.
 */
function updateFlux() {
    var fiat = getFiat();

    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Flux");
    var settings = sheet.getRange("A1:D1").getValues();

    var days = settings[0][1];
    var coin = settings[0][3].toLowerCase();
    Logger.log("BuildFlux:: Config: " + [days, coin]);

    var coins = getCoins();
    var date = new Date();
    if (coins.hasOwnProperty(coin) && isNumeric(days)) {
        var chart = importJson("https://api.coingecko.com/api/v3/coins/" + coins[coin] + "/market_chart?vs_currency=" + fiat + "&days=" + days);

        if (chart != undefined) {
            for (i = 0; i < days; i++) {
                var r = i + 3;
                date.setDate(date.getDate() - 1);

                sheet.getRange("B" + r).setValue((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
                sheet.getRange("C" + r).setValue(chart[0][1][i][1]);
            }

            return true;
        }
    }

    return false;
}

/**
 * Debug method.
 */
function updateFluxDebug() {
    disableCache();
    updateFlux();
}
