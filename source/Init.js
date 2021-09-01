/**
 * @OnlyCurrentDoc
 *
 * Initialize
 */
function onOpen() {
    var ui = SpreadsheetApp.getUi();

    ui.createMenu('Crypto')
        .addItem('Update Coins', 'menuUpdateCoins')
        .addItem('Update Sparkline', 'menuUpdateSparkline')
        .addItem('Add FIAT values', 'menuAddFiatValues')
        .addItem('Update Flux', 'menuUpdateFlux')
        .addToUi();

    enableCache();
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
    }
}

/**
 * Update Spakrline in Coins workbook.
 */
function menuUpdateSparkline() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to update Coins workbook spaklines?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        updateSparkline(ui);
    }
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