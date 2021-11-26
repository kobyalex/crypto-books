/**
 * New dialog.
 */
function newModalDialog(type) {
    var pre = "";
    var post = "";
    var method = "";

    if (type == "wallet") {
        post = "Wallet";
        method = "newWallet";

    } else if (type == "flux") {
        pre = "Flux ";
        method = "newFlux";
    }

    var html = '<div style="font-family:\'Google Sans\',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:16px;">' +
        '<p><b>Set name:</b></p>' +
        '<p>' + pre + '<input style="font-size:14px;padding:2px 5px;" id="' + type + '" type="text">' + post + '</p>' +
        '<p><button style="font-size:14px;padding:2px 5px;" type="button"' +
        ' onclick="google.script.run.withSuccessHandler().' + method + '(document.getElementById(\'' + type + '\').value);' +
        'google.script.host.close()">Create</button></p>' +
        '</div>';

    // Display a modal dialog.
    var htmlOutput = HtmlService
        .createHtmlOutput(html)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setWidth(400)
        .setHeight(150);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'New ' + post);
}

/**
 * New wallet.
 */
function newWallet(name) {
    // Get Drive files.
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var wallet = sheet.getSheetByName("Wallet");
    if (wallet !== null) {
        name = name + "Wallet";
        wallet.copyTo(sheet).setName(name);

        var book = sheet.getSheetByName(name);
        book.showSheet();
        book.activate();
        updateWalletsList()

    } else {
        ui.alert('Wallet template workbook not found!', ui.ButtonSet.OK);
    }
}

/**
 * New Flux.
 */
function newFlux(ticker) {
    // Get Drive files.
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var flux = sheet.getSheetByName("Flux");
    if (flux !== null) {
        var name = "Flux " + ticker;
        flux.copyTo(sheet).setName(name);

        var book = sheet.getSheetByName(name);
        book.showSheet();
        book.getRange("D1").setValue(ticker);
        book.activate();
        updateFlux();

    } else {
        ui.alert('Flux template workbook not found!', ui.ButtonSet.OK);
    }
}
