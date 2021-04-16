/**
 * @OnlyCurrentDoc
 *
 * Initialize
 */
function onOpen() {
    var ui = SpreadsheetApp.getUi();

    ui.createMenu('Crypto')
        .addItem('Update coins', 'menuUpdateCoins')
        .addItem('Add fiat values', 'menuAddFiatValues')
        .addItem('Update flux', 'menuUpdateFlux')
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

    if (result == ui.Button.OK) {
        var ok = updateCoins();
        if (ok) {
            ui.alert('Finished updating coins!');
        } else {
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

    if (result == ui.Button.OK) {
        addFiatValues();
        ui.alert('Finished populatinf FIAT rates!');
    }
}

/**
 * Update Flux sheet.
 */
function menuUpdateFlux() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert(
        'Do you want to building Flux sheet?',
        ui.ButtonSet.OK_CANCEL);

    if (result == ui.Button.OK) {
        var ok = updateFlux();
        if (ok) {
            ui.alert('Finished updating flux!');
        } else {
            ui.alert('Error updating flux!');
        }
    }
}