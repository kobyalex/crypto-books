/**
 * @OnlyCurrentDoc
 *
 * Initialize
 */
function onOpen() {
    var ui = SpreadsheetApp.getUi();

    // Menu.
    var menu = ui.createMenu('Crypto');

    // New submenu.
    menu.addSubMenu(ui.createMenu('New')
        .addItem('Wallet', 'menuNewWallet')
        .addItem('Flux', 'menuNewFlux')
    );

    // Add FIAT
    menu.addItem('Add FIAT values', 'menuAddFiatValues')
        .addSeparator()
        .addItem('Update Coins', 'menuUpdateCoins');

    if(getCryptoCompareKey() != "" && getSparklineMenuOption()) { // Add Sparkline menu item if key and option set.
        menu.addItem('Update Sparkline', 'menuUpdateSparkline');
    }

    menu.addItem('Update Flux', 'menuUpdateFlux');

    // Backup submenu.
    menu.addSeparator()
        .addSubMenu(ui.createMenu('Backup')
            .addItem('Export', 'menuSheetExport')
            .addItem('Restore', 'menuSheetRestore')
        );

    // Import menu.
    menu.addItem('Import wallet', 'menuImport');

    menu.addToUi();


    // Trigger every minute.
    ScriptApp.newTrigger('updateWallets').timeBased().everyMinutes(1).create();
    ScriptApp.newTrigger('updateWalletsList').timeBased().everyMinutes(1).create();

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

    var result = ui.alert(
        'Do you want to populate FIAT values in this workbook?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        addFiatValues(ui);
    }
}

/**
 * Update Coins workbook.
 */
function menuUpdateCoins() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to update Coins workbook?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        updateCoins(ui);

        if(getCryptoCompareKey() != "" && getSparklineAutoUpdate()) {
            updateSparkline(ui);
        }
    }
}

/**
 * Update Coins workbook Sparkline.
 */
function menuUpdateSparkline() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to update Coins workbook Sparkline?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        updateSparkline(ui);
    }
}

/**
 * Update Flux workbook.
 */
function menuUpdateFlux() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to update current Flux workbook?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        updateFlux(ui);
    }
}

/**
 * Export sheet.
 */
function menuSheetExport() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to backup this sheet?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
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
 * Import transactions.
 */
function menuImport() {
    var ui = SpreadsheetApp.getUi();
    ui.alert('Import for Terra and Cosmos wallets coming soon.', ui.ButtonSet.OK);
}

/**
 * Update Wallets and Wallets list when cell H1 changes state.
 */
function onEdit(e) {
    if (e.range.getA1Notation() == 'H1') {
        updateWallets();
        updateWalletsList()
    }
}

/**
 * Update Wallets list when cells A1 selected (workbook is selected first time).
 */
function onSelectionChange(e) {
    if (e.range.getA1Notation() == 'A1') {

        updateWalletsList();
    }
}
