/**
 * New dialog.
 */
function newModalDialog(type) {
  var pre = "";
  var post = "";
  var method = "";
  var desc = "";

  if (type == "wallet") {
    post = " Wallet";
    method = "newWallet";
    desc = "Wallets end with the word Wallet automatically.";
  } else if (type == "flux") {
    pre = "Flux ";
    method = "newFlux";
    desc = "Fluxes start with the word Flux automatically.";
  }

  var html =
    "<div style=\"font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:14px;\">" +
    '<div style="font-size:16px;"><b>Name:</b></div>' +
    "<div>" +
    pre +
    '<input style="padding:2px 5px;" id="' +
    type +
    '" type="text">' +
    post +
    "</div>" +
    '<div style="padding: 5px 0;font-style:italic;">' +
    desc +
    "</div>" +
    '<div><button style="font-size:12px;font-weight:bold;padding:2px 5px;" type="button"' +
    ' onclick="google.script.run.withSuccessHandler().' +
    method +
    "(document.getElementById('" +
    type +
    "').value);" +
    'google.script.host.close()">Create</button></div>' +
    "</div>";

  // Display a modal dialog.
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(400)
    .setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "New " + post);
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
    updateWalletsList();
  } else {
    ui.alert("Wallet template workbook not found!", ui.ButtonSet.OK);
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
    book.getRange("D2").setValue(ticker);
    book.activate();
    updateFlux();
  } else {
    ui.alert("Flux template workbook not found!", ui.ButtonSet.OK);
  }
}
