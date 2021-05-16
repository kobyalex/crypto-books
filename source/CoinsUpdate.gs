/**
 * Update coins sheet.
 * <p>Fetch coins data from an API.
 */
function updateCoins(ui) {
    var market = apiCoins(ui, getFiat(), getCoinNames(), getTickers());
    if(Object.keys(market).length > 0) {
        var coins = getCoins();
        var stable = getStableCoins();

        var active = SpreadsheetApp.getActive();
        var sheet = active.getSheetByName("Coins");
        var rows = sheet.getRange("A3:A").getValues();

        for(i = 0; i < rows.length; i++) {
            if(rows[i] != undefined && rows[i][0].length > 0) {
                var ticker = rows[i][0].toLowerCase();
                if(market.hasOwnProperty(ticker)) {
                    // Skip fiat
                    if(coins[ticker] == "fiat") {
                        continue;
                    }
                    // Set stablecoins to 1
                    if(stable.indexOf(ticker) != -1) {
                        market[ticker]["current_price"] = 1;
                    }

                    var r = i + 3;
                    if(market[ticker].hasOwnProperty("market_cap_rank")) {
                        sheet.getRange("C" + r).setValue(market[ticker]["market_cap_rank"]);
                    }
                    if(market[ticker].hasOwnProperty("total_volume")) {
                        sheet.getRange("D" + r).setValue(market[ticker]["total_volume"]);
                    }
                    if(market[ticker].hasOwnProperty("market_cap")) {
                        sheet.getRange("E" + r).setValue(market[ticker]["market_cap"]);
                    }
                    if(market[ticker].hasOwnProperty("fully_diluted_valuation")) {
                        sheet.getRange("F" + r).setValue(market[ticker]["fully_diluted_valuation"]);
                    }
                    if(market[ticker].hasOwnProperty("circulating_supply")) {
                        sheet.getRange("G" + r).setValue(market[ticker]["circulating_supply"]);
                    }
                    if(market[ticker].hasOwnProperty("total_supply")) {
                        sheet.getRange("H" + r).setValue(market[ticker]["total_supply"]);
                    }
                    if(market[ticker].hasOwnProperty("low_24h")) {
                        sheet.getRange("I" + r).setValue(market[ticker]["low_24h"]);
                    }
                    if(market[ticker].hasOwnProperty("high_24h")) {
                        sheet.getRange("J" + r).setValue(market[ticker]["high_24h"]);
                    }
                    if(market[ticker].hasOwnProperty("ath")) {
                        sheet.getRange("K" + r).setValue(market[ticker]["ath"]);
                    }
                    // Update ATH if CryptoCompare API high_24h is greater than current ATH since it lacks ATH.
                    var high = sheet.getRange("J" + r).getValue();
                    var ath = sheet.getRange("K" + r).getValue();
                    if (high > ath) {
                        sheet.getRange("K" + r).setValue(high);
                    }
                    if(market[ticker].hasOwnProperty("price_change_24h")) {
                        sheet.getRange("M" + r).setValue(market[ticker]["price_change_24h"]);
                    }
                    if(market[ticker].hasOwnProperty("current_price")) {
                        sheet.getRange("N" + r).setValue(market[ticker]["current_price"]);
                    }
                }
            }
        }

        ui.alert('Coins updated!');
    }
}
