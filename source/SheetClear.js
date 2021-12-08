/**
 * Clear data.
 */
function sheetClear(ui) {
    clearContent();

    ui.alert(
        'Clear complete.',
        ui.ButtonSet.OK);
}

/**
 * Clear content.
 */
function clearContent() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();

    // Clear Coins.
    var book = sheet.getSheetByName("Coins");
    book.getRange("A3:K").clearContent();
    book.getRange("M3:N").clearContent();

    // Clear Pairs.
    book = sheet.getSheetByName("Pairs");
    book.getRange("A3:F").clearContent();

    // Clear Trades.
    book = sheet.getSheetByName("Trades");
    book.getRange("A2:M").clearContent();

    // Delete wallet and flux workbooks.
    var active = SpreadsheetApp.getActive();
    var list = active.getSheets();
    for (var i = 0; i < list.length; i++) {
        var name = list[i].getName().toLowerCase();
        if (name != "wallet" && name != "flux" && (name.endsWith("wallet") || name.startsWith("flux"))) {
            sheet.deleteSheet(sheet.getSheetByName(list[i].getName()));
        }
    }


    // Clear Deposits.
    book = sheet.getSheetByName("Deposits");
    book.getRange("B2").setValue(false);
    book.getRange("D2:H2").setValues([["None","None","None","None","None"]]);

    // Clear Staking.
    book = sheet.getSheetByName("Staking");
    book.getRange("F2").setValue(false);
    book.getRange("H2:M2").setValues([["None","None","None","None","None","None"]]);

    // Clear Free.
    book = sheet.getSheetByName("Free");
    book.getRange("L2").setValue(false);
    book.getRange("O1:S1").setValues([["None","None","None","None","None"]]);
    book.getRange("N2:S2").setValues([["None","None","None","None","None","None"]]);

    // Clear HODL.
    book = sheet.getSheetByName("HODL");
    book.getRange("H2").setValue(false);
    book.getRange("K2:P2").setValues([["None","None","None","None","None","None"]]);

    // Clear Settings.
    book = sheet.getSheetByName("Settings");
    book.activate();
    book.getRange("C8").clearContent();

    updateWallets();
    updateWalletsList()
}
