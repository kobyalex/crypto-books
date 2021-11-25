/**
 * Update coins workbook.
 * <p>Fetch coins data from an API.
 */
function updateCoins(ui) {
    // Update coin prices from API.
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
                var r = i + 3;

                if(market.hasOwnProperty(ticker)) {
                    if(market[ticker].hasOwnProperty("market_cap_rank") && market[ticker]["market_cap_rank"] != null) {
                        sheet.getRange("C" + r).setValue(market[ticker]["market_cap_rank"]);
                    }
                    if(market[ticker].hasOwnProperty("total_volume") && market[ticker]["total_volume"] != null) {
                        sheet.getRange("D" + r).setValue(market[ticker]["total_volume"]);
                    }
                    if(market[ticker].hasOwnProperty("market_cap") && market[ticker]["market_cap"] != null) {
                        sheet.getRange("E" + r).setValue(market[ticker]["market_cap"]);
                    }
                    if(market[ticker].hasOwnProperty("fully_diluted_valuation") && market[ticker]["fully_diluted_valuation"] != null) {
                        sheet.getRange("F" + r).setValue(market[ticker]["fully_diluted_valuation"]);
                    }
                    if(market[ticker].hasOwnProperty("circulating_supply") && market[ticker]["circulating_supply"] != null) {
                        sheet.getRange("G" + r).setValue(market[ticker]["circulating_supply"]);
                    }
                    if(market[ticker].hasOwnProperty("total_supply") && market[ticker]["total_supply"] != null) {
                        sheet.getRange("H" + r).setValue(market[ticker]["total_supply"]);
                    }
                    if(market[ticker].hasOwnProperty("low_24h") && market[ticker]["low_24h"] != null) {
                        sheet.getRange("I" + r).setValue(market[ticker]["low_24h"]);
                    }
                    if(market[ticker].hasOwnProperty("high_24h") && market[ticker]["high_24h"] != null) {
                        sheet.getRange("J" + r).setValue(market[ticker]["high_24h"]);
                    }
                    if(market[ticker].hasOwnProperty("ath") && market[ticker]["ath"] != null) {
                        sheet.getRange("K" + r).setValue(market[ticker]["ath"]);
                    }
                    // Update ATH if CryptoCompare API high_24h is greater than current ATH since it lacks ATH.
                    var high = sheet.getRange("J" + r).getValue();
                    var ath = sheet.getRange("K" + r).getValue();
                    if (high > ath) {
                        sheet.getRange("K" + r).setValue(high);
                    }
                    if(market[ticker].hasOwnProperty("price_change_24h") && market[ticker]["price_change_24h"] != null) {
                        sheet.getRange("M" + r).setValue(market[ticker]["price_change_24h"]);
                    }
                    if(market[ticker].hasOwnProperty("current_price") && market[ticker]["current_price"] != null) {
                        sheet.getRange("N" + r).setValue(market[ticker]["current_price"]);
                    }
                } else {
                    // Set stablecoins to 1.
                    if(ticker == getFiat() && stable.indexOf(ticker) != -1) {
                        sheet.getRange("N" + r).setValue(1);
                    }
                    // Set fiat to Google Finance.
                    else if(coins[ticker].toLowerCase() == "fiat") {
                        sheet.getRange("N" + r).setValue('=GOOGLEFINANCE("CURRENCY:' + getFiat().toUpperCase() + ticker.toUpperCase() + '")');
                    }
                }
            }
        }
    }
}
