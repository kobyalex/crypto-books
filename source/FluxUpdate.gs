/**
 * Update flux.
 * <p>This is an overview of the holdings of a coin over a period of time.
 */
function updateFlux(ui) {
    var fiat = getFiat();
    var coins = getCoins();

    var sheet = SpreadsheetApp.getActive();
    var name = sheet.getSheetName();
    if (name.indexOf("Flux") == -1) {
        ui.alert('Incorrect active sheet!');
        return;
    }

    var settings = sheet.getRange("A1:F1").getValues();
    var days = settings[0][1];
    var coin = settings[0][3].toLowerCase();
    var interval = settings[0][5];
    Logger.log("updateFlux:: Request: " + [days, coin, interval]);

    var date;
    if (coins.hasOwnProperty(coin) && isNumeric(days) && (interval == "hourly" || interval == "daily")) {
        var chart = apiFlux(fiat, coin, days, interval);

        if (chart != undefined) {
            var r = 2;
            for (var i = chart[0][1].length -1; i >= 0; i--) {
                r++;

                date = new Date(chart[0][1][i][0]);
                date = (date.getMonth() + 1).padLeft(2) + "/" + date.getDate().padLeft(2) + "/" + date.getFullYear() +
                    " " + date.getHours().padLeft(2) + ":" + date.getMinutes().padLeft(2) + ":" + date.getSeconds().padLeft(2);
                sheet.getRange("B" + r).setValue(date);
                sheet.getRange("C" + r).setValue(chart[0][1][i][1]);
                sheet.getRange("D" + r).setValue(chart[2][1][i][1]);
                Logger.log("updateFlux:: Row: " + [date, chart[0][1][i][1], chart[2][1][i][1]]);

                if ((r - 2) == days) return true;
            }

            return;
        }
    }

    ui.alert('Invalid configuration!');
}

/**
 * Debug method.
 */
function updateFluxDebug() {
    disableCache();
    updateFlux();
}
