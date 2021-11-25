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
        .map(Function.prototype.call, String.prototype.trim)
        .join(",");

    return coins.toLowerCase().replace(/\s/g, "-");
}

/**
 * Gets tickers.
 */
function getTickers() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Coins");
    var coins = sheet
        .getRange("A3:A")
        .getValues()
        .filter(String)
        .join(",");

    return coins.toLowerCase();
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

    for(i = 0; i < rows.length; i++) {
        var ticker = rows[i][0].trim().toLowerCase();
        var name = rows[i][1].trim().toLowerCase().replace(/\s/g, "-");

        if(ticker !== "" && name !== "") {
            coins[ticker] = name;
        }
    }

    return coins;
}

/**
 * Gets FIAT.
 * <p>Reference FIAT currency.
 * @customfunction
 */
function getFiat() {
    return SpreadsheetApp.getActive()
        .getSheetByName("Settings")
        .getRange("C3")
        .getValue().toLowerCase();
}

/**
 * Gets stable coins.
 * <p>Coins that are fixed 1 to 1 to the FIAT currency.
 */
function getStableCoins() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Settings");
    var coins = sheet
        .getRange("A4:A")
        .getValues()
        .filter(String);

    var fiat = getFiat();
    if(coins.indexOf(fiat) === -1) {
        coins.push(fiat);
    }

    return coins.join('|').toLowerCase().split('|');
}

/**
 * Gets CryptoCompare API key.
 */
function getCryptoCompareKey() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Settings");
    return sheet.getRange("C8").getValue().toLowerCase();
}

/**
 * Gets Sparkline Menu option setting.
 */
function getSparklineMenuOption() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Settings");
    return sheet.getRange("C13").getValue();
}

/**
 * Gets Sparkline Auto update setting.
 */
function getSparklineAutoUpdate() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Settings");
    return sheet.getRange("C14").getValue();
}
