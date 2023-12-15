/**
 * Gets swap pairs market data from the blockchain.
 * <p>Documentation: https://fcd.terra.dev/swagger
 */
function terraPairs(ui, book, ticker, address, r) {
  var json = importJson(encodeURI("https://lcd.terra.dev/wasm/contracts/" + address + '/store?query_msg={"pool":{}}'));

  if (typeof json === "string") {
    ui.alert("API error: " + json);
  } else if (typeof json === "object") {
    var splits = ticker.split("-"),
      right = splits[1].toLowerCase();

    var lp = json[1][1].total_share / 1000000;

    var token = json[1][1].assets[0].info.hasOwnProperty("token")
      ? json[1][1].assets[0].amount
      : json[1][1].assets[1].info.hasOwnProperty("token")
      ? json[1][1].assets[1].amount
      : 0;

    var native_token =
      json[1][1].assets[0].info.hasOwnProperty("native_token") &&
      !json[1][1].assets[0].info.native_token.denom.includes(right)
        ? json[1][1].assets[0].amount
        : json[1][1].assets[1].info.hasOwnProperty("native_token") &&
          !json[1][1].assets[1].info.native_token.denom.includes(right)
        ? json[1][1].assets[1].amount
        : 0;

    var contract = json[1][1].assets[0].info.hasOwnProperty("token")
      ? json[1][1].assets[0].info.token.contract_addr
      : json[1][1].assets[1].info.hasOwnProperty("token")
      ? json[1][1].assets[1].info.token.contract_addr
      : "";

    var native = json[1][1].assets[0].info.hasOwnProperty("native_token")
        ? json[1][1].assets[0].amount
        : json[1][1].assets[1].info.hasOwnProperty("native_token")
        ? json[1][1].assets[1].amount
        : 0,
      native = native / 1000000;

    var decimals = 1000000;
    if (contract != "") {
      json = importJson(encodeURI("https://lcd.terra.dev/wasm/contracts/" + contract));
      var decimals = json[1][1].init_msg != undefined ? "1" + "0".repeat(json[1][1].init_msg.decimals) : 1000000;
    }

    token = (token > 0 ? token : native_token) / decimals;

    book.getRange("D" + r + ":H" + r).setValues([[lp, splits[0], splits[1], token, native]]);
  }
}

/**
 * Debug.
 */
function terraPairsDebug() {
  terraPairs(
    SpreadsheetApp.getUi(),
    SpreadsheetApp.getActive().getSheetByName("Pairs"),
    "bLUNA-LUNA",
    "terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p",
    6
  );
}

/**
 * Import.
 */
function terraImport(ui) {
  // Display a modal dialog box with import form.
  var htmlOutput = HtmlService.createHtmlOutput(
    "<div style=\"font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:16px;\">" +
      "<div><b>Wallet address:</b></div>" +
      '<div style="padding: 5px 0;"><input style="font-size:14px;padding:2px 5px;width:350px;" id="walletAddress" type="text"></div>' +
      "<div><b>Wallet name:</b></div>" +
      '<div style="padding: 5px 0;"><input style="font-size:14px;padding:2px 5px;width:50px;" id="walletName" type="text"> Wallet</div>' +
      '<div><button style="font-size:14px;padding:2px 5px;" type="button"' +
      " onclick=\"google.script.run.withSuccessHandler().importTerraWallet(document.getElementById('walletAddress').value, document.getElementById('walletName').value);google.script.host.close()\">Import</button></div>" +
      "</div>"
  )
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(400)
    .setHeight(150);

  ui.showModalDialog(htmlOutput, "Import wallet");
}

/**
 * Import wallet.
 */
function importTerraWallet(walletAddress, walletName) {
  var url = "https://fcd.terra.dev/v1/txs?account=" + walletAddress + "&limit=10";
  // url += '&offset=' + last_id;

  SpreadsheetApp.getUi().alert("Importing from Terra address: " + walletAddress + " into " + walletName + "Wallet");
}
