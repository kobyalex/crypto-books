/**
 * Gets coin names.
 * <p>Will lowercase and hyphenate spaces for CoinGeko request.
 */
function getCoinNames() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Coins");
    var coins = sheet
        .getRange("B3:B")
        .getValues()
        .filter(String)
        .join(",");

    return coins.toLowerCase().replace(/\s/g, "-");
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

/**
 * Gets FIAT.
 * <p>Refference FIAT currency.
 */
function getFiat() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Settings");
    return sheet.getRange("B1").getValue().toLowerCase();
}

/**
 * Gets stable coins.
 * <p>Coins that are fixed 1 to 1 to the FIAT currency.
 */
function getStableCoins() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Settings");
    var coins = sheet
        .getRange("A3:A")
        .getValues()
        .filter(String);

    return coins.join('|').toLowerCase().split('|');
}
