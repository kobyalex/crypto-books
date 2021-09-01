/**
 * Pad left Number prototype.
 */
Number.prototype.padLeft = function(n, str) {
    return Array(n - String(this).length + 1).join(str || '0') + this;
}

/**
 * Is number.
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Is positive.
 */
function isPositive(n, e) {
    return n > 0 ? n : e;
}

/**
 * Update wallets.
 */
function updateWallets() {
    var out = new Array()

    var active = SpreadsheetApp.getActive();
    var sheets = active.getSheets();
    for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];
        if (sheet.getName().toLowerCase().endsWith("wallet") && sheet.getRange('H1').isChecked()) {
            var rows = sheet.getRange('A3:A').getValues();
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                if (row[0] != "") {
                    out.push([row[0], sheet.getName()]);
                }
            }
        }
    }

    var sheet = active.getSheetByName("Wallets");
    sheet.getRange("A2:B").clearContent();
    var rows = sheet.getRange("A2:B" + (out.length + 1)).setValues(out);
}