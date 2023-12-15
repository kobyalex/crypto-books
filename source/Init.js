/**
 * @OnlyCurrentDoc
 *
 * Initialize
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  // Menu.
  var menu = ui.createMenu("Crypto");

  // New workbook.
  menu
    .addSubMenu(
      ui.createMenu("New workbook").addItem("Wallet type", "menuNewWallet").addItem("Flux type", "menuNewFlux")
    )
    .addSeparator();

  // Add fiat values.
  menu.addItem("Add fiat values", "menuAddFiatValues").addSeparator();

  // Update data.
  var update = ui.createMenu("Update data").addItem("Coins workbook", "menuUpdateCoins");

  if (getPairsMenuOption()) {
    // Add Pairs menu item if option set.
    update.addItem("Pairs workbook", "menuUpdatePairs");
  }

  if (getCryptoCompareKey() != "" && getSparklineMenuOption()) {
    // Add Sparkline menu item if key and option set.
    update.addItem("Sparkline workbook", "menuUpdateSparkline");
  }

  update.addItem("Current Flux workbook", "menuUpdateFlux");

  menu.addSubMenu(update);

  // Data management.
  menu.addSubMenu(
    ui
      .createMenu("Data management")
      .addItem("Export sheet", "menuSheetExport")
      .addItem("Restore sheet", "menuSheetRestore")
      .addItem("Clear sheet", "menuSheetClear")
  );

  // Terra blockchain.
  //menu.addSeparator()
  //        .addSubMenu(ui.createMenu('Terra')
  //        .addItem('Import', 'menuSoon')
  //        .addItem('Update', 'menuSoon')
  //    );

  menu.addToUi();

  // Trigger every minute.
  ScriptApp.newTrigger("updateWallets").timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger("updateWalletsList").timeBased().everyMinutes(1).create();

  enableCache();
}

/**
 * New wallet.
 */
function menuNewWallet() {
  newModalDialog("wallet");
}

/**
 * New Flux.
 */
function menuNewFlux() {
  newModalDialog("flux");
}

/**
 * Add fiat values to Trades of Wallet workbooks.
 */
function menuAddFiatValues() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Do you want to populate FIAT values in this workbook?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    addFiatValues(ui);
  }
}

/**
 * Update Coins workbook.
 */
function menuUpdateCoins() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Do you want to update Coins workbook?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    if (getPairsAutoUpdate()) {
      updatePairs(ui);
    }

    updateCoins(ui);

    if (getCryptoCompareKey() != "" && getSparklineAutoUpdate()) {
      updateSparkline(ui);
    }
  }
}

/**
 * Update Pairs workbook.
 */
function menuUpdatePairs() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Do you want to update Pairs workbook?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    updatePairs(ui);
  }
}

/**
 * Update Sparkline workbook.
 */
function menuUpdateSparkline() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Do you want to update Sparkline workbook?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    updateSparkline(ui);
  }
}

/**
 * Update Flux workbook.
 */
function menuUpdateFlux() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Do you want to update current Flux workbook?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    updateFlux(ui);
  }
}

/**
 * Terra import.
 */
function menuTerraImport() {
  terraImport(SpreadsheetApp.getUi());
}

/**
 * Export sheet.
 */
function menuSheetExport() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Do you want to backup this sheet?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    sheetExport(ui);
  }
}

/**
 * Restore sheet.
 */
function menuSheetRestore() {
  sheetRestore(SpreadsheetApp.getUi());
}

/**
 * Clear sheet.
 */
function menuSheetClear() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert("Are you sure you want to clear this sheet?", ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    result = ui.alert("All data will be whiped!", ui.ButtonSet.OK_CANCEL);

    if (result == ui.Button.OK) {
      sheetClear(ui);
    }
  }
}

/**
 * Import transactions.
 */
function menuSoon() {
  var ui = SpreadsheetApp.getUi();
  ui.alert("Coming soon...", ui.ButtonSet.OK);
}

/**
 * Update Wallets and Wallets list when cell H1 changes state.
 */
function onEdit(e) {
  if (e.range.getA1Notation() == "I1") {
    updateWallets();
    updateWalletsList();
  }
}

/**
 * Update Wallets list when cells A1 selected (workbook is selected first time).
 */
function onSelectionChange(e) {
  if (e.range.getA1Notation() == "A1") {
    updateWalletsList();
  }
}
