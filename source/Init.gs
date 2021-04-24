/**
 * @OnlyCurrentDoc
 *
 * Initialize
 */
function onOpen() {
    var ui = SpreadsheetApp.getUi();

    ui.createMenu('Crypto')
        .addItem('Update Coins', 'menuUpdateCoins')
        .addItem('Add FIAT values', 'menuAddFiatValues')
        .addItem('Update current Flux', 'menuUpdateFlux')
        .addToUi();

    enableCache();
}

/**
 * Update Coins sheet.
 */
function menuUpdateCoins() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to update Coins sheet?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        var ok = updateCoins();
        if(!ok) {
            ui.alert('Error updating coins!');
        }
    }
}

/**
 * Add fiat values to Trades sheet.
 */
function menuAddFiatValues() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to populate FIAT values in Trades sheet?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        addFiatValues();
    }
}

/**
 * Update Flux.
 */
function menuUpdateFlux() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to update current Flux sheet?',
        ui.ButtonSet.OK_CANCEL);

    if(result == ui.Button.OK) {
        updateFlux(ui);
    }
}