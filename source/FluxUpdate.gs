/**
 * Update flux.
 * <p>This is an overview of the holdings of a coin over a period of time.
 */
function updateFlux(ui) {
    var fiat = getFiat();
    var coins = getCoins();

    var sheet = SpreadsheetApp.getActive();
    var name = sheet.getSheetName();
    if(name.indexOf("Flux") == -1) {
        ui.alert('Active sheet not a Flux sheet!');
        return;
    }

    var settings = sheet.getRange("A1:F1").getValues();
    var days = settings[0][1];
    var coin = settings[0][3].toLowerCase();
    var interval = settings[0][5];
    Logger.log("updateFlux:: Request: " + [days, coin, interval]);

    var date;
    if(coins.hasOwnProperty(coin) && isNumeric(days) && (interval == "hourly" || interval == "daily")) {
        var flux = apiFlux(ui, fiat, coin, days, interval);

        if(flux != undefined) {
            var r = 2;
            for(var i = flux.length -1; i >= 0; i--) {
                r++;

                var date = flux[i]["date"];
                date = (date.getMonth() + 1).padLeft(2) + "/" + date.getDate().padLeft(2) + "/" + date.getFullYear() +
                    " " + date.getHours().padLeft(2) + ":" + date.getMinutes().padLeft(2) + ":" + date.getSeconds().padLeft(2);
                sheet.getRange("B" + r).setValue(date);
                sheet.getRange("C" + r).setValue(flux[i]["price"]);
                sheet.getRange("D" + r).setValue(flux[i]["volume"]);
                Logger.log("updateFlux:: Row: " + [date, flux[i]["price"], flux[i]["volume"]]);

                if((r - 2) == days) break;
            }
        } else {
            ui.alert('Flux update failed!');
        }

        return;
    }

    ui.alert('Invalid Flux configuration!');
}
