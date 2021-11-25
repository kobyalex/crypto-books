/**
 * Gets wallets.
 * @customfunction
 */
function wallets() {
    var out = new Array()

    var active = SpreadsheetApp.getActive();
    var list = active.getSheets();
    for (var i = 0; i < list.length; i++) {
        var name = list[i].getName().toLowerCase();
        if (name != "wallet" && name.endsWith("wallet")) {
            out.push(list[i].getName());
        }
    }

    return out;
}

/**
 * Update wallets.
 */
function updateWallets() {
    var ret = new Array()

    var active = SpreadsheetApp.getActive();
    var list = wallets();
    for (var i = 0; i < list.length; i++) {
        var sheet = active.getSheetByName(list[i]);

        if (sheet.getRange('H1').isChecked()) {
            var rows = sheet.getRange('A3:A').getValues();
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                if (row[0] != "") {
                    ret.push([row[0], list[i]]);
                }
            }
        }
    }

    var sheet = active.getSheetByName("Wallets");
    sheet.getRange("B2:C").clearContent();
    sheet.getRange("B2:C" + (ret.length + 1)).setValues(ret);
}

/**
 * Update Wallets list.
 */
function updateWalletsList() {
    var active = SpreadsheetApp.getActive();
    var sheet = active.getSheetByName("Wallets");

    var ret = new Array();
    var list = wallets();
    for (var i = 0; i < list.length; i++) {
        ret.push([list[i]]);
    }
    sheet.getRange("A3:A").clearContent();
    sheet.getRange("A3:A" + (list.length + 2)).setValues(ret);
}
