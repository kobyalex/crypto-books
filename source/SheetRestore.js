/**
 * Restores backup data onto this sheet.
 */
function sheetRestore(ui) {
    // Get Drive files.
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var folder = DriveApp.getFileById(sheet.getId()).getParents().next().getId();
    var files = DriveApp.getFolderById(folder).getFiles();

    var html = '<div style="font-family:\'Google Sans\',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:14px;">';

    var options = '';
    while (files.hasNext()){
        var file = files.next();
        if (file.getName().endsWith(".json")) options += '<option value="' + file.getId() + '">' + file.getName() + '</option>';
    }

    if (options.length > 0) {
        html += '<div><b>Select drive backup:</b></div>' +
            '<div style="padding: 5px 0;"><select style="font-size:14px;padding:2px 5px;" id="restore">' + options + '</select></div>' +
            '<div><button style="font-size:14px;padding:2px 5px;" type="button"' +
            ' onclick="google.script.run.withSuccessHandler().restore(document.getElementById(\'restore\').value);google.script.host.close()">Restore</button></div>';
    } else {
        html += 'No backup found in sheet folder!';
    }

    html += '</div>';

    // Display a modal dialog to pick backup.
    var htmlOutput = HtmlService
        .createHtmlOutput(html)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setWidth(400)
        .setHeight(150);

    ui.showModalDialog(htmlOutput, 'Restore sheet');
}

/**
 * Restore provided backup.
 */
function restore(file) {
    var ui = SpreadsheetApp.getUi();

    try {
        var json = Utilities.jsonParse(DriveApp.getFileById(file).getBlob().getDataAsString());

        var sheet = SpreadsheetApp.getActiveSpreadsheet();

        // Clear data.
        clearContent(ui);

        // Restore Coins.
        var book = sheet.getSheetByName("Coins");
        book.activate();
        book.getRange("A3:B" + (json["Coins"].coins.length + 2)).setValues(json["Coins"].coins);
        book.getRange("AD3:AE" + (json["Coins"].comments.length + 2)).setValues(json["Coins"].comments);

        // Duplicate formulas.
        book.getRange("L3").copyTo(sheet.getRange("L4:L"), {contentsOnly:false});
        book.getRange("O3:AC3").copyTo(sheet.getRange("O4:AC"), {contentsOnly:false});

        // Restore Trades.
        book = sheet.getSheetByName("Trades");
        book.activate();
        book.getRange("A2:M" + (json["Trades"].length + 1)).setValues(json["Trades"]);

        // Add wallets.
        var wallet = sheet.getSheetByName("Wallet");
        if (wallet !== null) {
            if (json.hasOwnProperty("sort")) {
                var list = json["sort"].wallets;
                for (var i = 0; i < list.length; i++) {
                    var key = list[i];

                    wallet.copyTo(sheet).setName(key);
                    book = sheet.getSheetByName(key);
                    book.showSheet();

                    book.getRange("H1").setValue(json[key].inCoins);
                    book.getRange("I3:U" + (json[key].trades.length + 2)).setValues(json[key].trades);
                }
            } else {
                for (const [key, value] of Object.entries(json)) {
                    if (key.toLowerCase().endsWith("wallet")) {
                        wallet.copyTo(sheet).setName(key);
                        book = sheet.getSheetByName(key);
                        book.showSheet();
                        book.getRange("H1").setValue(json[key].inCoins);
                        book.getRange("I3:U" + (json[key].trades.length + 2)).setValues(json[key].trades);
                    }
                }
            }
        }
        var flux = sheet.getSheetByName("Flux");
        if (flux !== null) {
            if (json.hasOwnProperty("sort")) {
                var list = json["sort"].flux;
                for (var i = 0; i < list.length; i++) {
                    var key = list[i];

                    flux.copyTo(sheet).setName(key);
                    book = sheet.getSheetByName(key);
                    book.showSheet();

                    book.getRange("B1").setValue(json[key].results);
                    book.getRange("D1").setValue(json[key].ticker);
                    book.getRange("F1").setValue(json[key].interval);
                    book.getRange("R1").setValue(json[key].inTrades);
                    book.getRange("T1:X1").setValues(json[key].wallets);
                }
            } else {
                for (const [key, value] of Object.entries(json)) {
                    if (key.toLowerCase().startsWith("flux")) {
                        flux.copyTo(sheet).setName(key);
                        book = sheet.getSheetByName(key);
                        book.showSheet();
                        book.getRange("B1").setValue(json[key].results);
                        book.getRange("D1").setValue(json[key].ticker);
                        book.getRange("F1").setValue(json[key].interval);
                        book.getRange("R1").setValue(json[key].inTrades);
                        book.getRange("T1:X1").setValues(json[key].wallets);
                    }
                }
            }
        }

        // Restore Deposits.
        book = sheet.getSheetByName("Deposits");
        book.activate();
        book.getRange("B2").setValue(json["Deposits"].inTrades);
        book.getRange("D2:H2").setValues(json["Deposits"].wallets);

        // Restore Staking.
        book = sheet.getSheetByName("Staking");
        book.activate();
        book.getRange("F2").setValue(json["Staking"].inTrades);
        book.getRange("H2:M2").setValues(json["Staking"].wallets);

        // Restore Free.
        book = sheet.getSheetByName("Free");
        book.activate();
        book.getRange("L2").setValue(json["Free"].inTrades);
        book.getRange("O1:S1").setValues(json["Free"].trades);
        book.getRange("N2:S2").setValues(json["Free"].wallets);

        // Restore HODL.
        book = sheet.getSheetByName("HODL");
        book.activate();
        book.getRange("H2").setValue(json["HODL"].inTrades);
        book.getRange("K2:P2").setValues(json["HODL"].wallets);

        // Restore Settings.
        book = sheet.getSheetByName("Settings");
        book.activate();
        book.getRange("A4:A" + (json["Settings"].stableCoins.length + 3)).setValues(json["Settings"].stableCoins);
        book.getRange("C3").setValue(json["Settings"].fiat);
        book.getRange("C8").setValue(json["Settings"].apiKey);
        book.getRange("C13").setValue(json["Settings"].menuOption);
        book.getRange("C14").setValue(json["Settings"].autoUpdate);
    }
    catch(err) {
        Logger.log(err.message);

        ui.alert(
            'Unable to restore backup selected.',
            ui.ButtonSet.OK_CANCEL);
    }

    // Move workbooks.
    sheet.getSheetByName("Deposits").activate();
    sheet.moveActiveSheet(sheet.getNumSheets());

    sheet.getSheetByName("Staking").activate();
    sheet.moveActiveSheet(sheet.getNumSheets());

    sheet.getSheetByName("Free").activate();
    sheet.moveActiveSheet(sheet.getNumSheets());

    sheet.getSheetByName("HODL").activate();
    sheet.moveActiveSheet(sheet.getNumSheets());

    sheet.getSheetByName("Settings").activate();
    sheet.moveActiveSheet(sheet.getNumSheets());

    // Show Dashboard.
    book = sheet.getSheetByName("Dashboard");
    book.activate();

    // Update everything.
    updateWallets();
    updateWalletsList();

    ui.alert(
        'Restore complete. Please update Coins, Sparkline and Flux.',
        ui.ButtonSet.OK);
}
