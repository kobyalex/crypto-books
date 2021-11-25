/**
 * Gets backup data from all workbooks.
 */
function sheetExport(ui) {
    var data = {};

    // Backup Coins.
    data["Coins"] = {
        coins: backupRange("Coins", "A3:B"),
        comments: backupRange("Coins", "AD3:AE")
    };

    // Backup Trades.
    data["Trades"] = backupRange("Trades", "A2:M");

    // Backup Wallets and Flux.
    var skip = ["wallet", "flux"];
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var books = sheet.getSheets();
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var name = book.getName();

        if (skip.indexOf(name.toLowerCase()) > -1) {
            continue;
        }

        if (name.toLowerCase().endsWith("wallet")) {
            data[name] = {
                inCoins: book.getRange("H1").getValue(),
                trades: backupRange(name, "I3:U")
            };
        } else if (name.toLowerCase().startsWith("flux")) {
            data[name] = {
                results: book.getRange("B1").getValue(),
                ticker: book.getRange("D1").getValue(),
                interval: book.getRange("F1").getValue(),
                inTrades: book.getRange("R1").getValue(),
                wallets: backupRange(name, "T1:X1")
            };
        }
    }

    // Backup Deposits.
    data["Deposits"] = {
        inTrades: sheet.getSheetByName("Deposits").getRange("B2").getValue(),
        wallets: backupRange("Deposits", "D2:H2")
    };

    // Backup HODL.
    data["HODL"] = {
        inTrades: sheet.getSheetByName("HODL").getRange("B2").getValue(),
        wallets: backupRange("HODL", "D2:I2")
    };

    // Backup Settings.
    data["Settings"] = {
        stableCoins: backupRange("Settings", "A4:A"),
        fiat: sheet.getSheetByName("Settings").getRange("C3").getValue(),
        apiKey: sheet.getSheetByName("Settings").getRange("C8").getValue(),
        menuOption: sheet.getSheetByName("Settings").getRange("C13").getValue(),
        autoUpdate: sheet.getSheetByName("Settings").getRange("C14").getValue()
    };

    // Save file to drive.
    var date = new Date();
    var name = SpreadsheetApp.getActiveSpreadsheet().getName() + " " +
        date.toISOString().slice(0, 10) + " " +
        date.toISOString().slice(11, 19) + ".json"

    var folder = DriveApp.getFileById(sheet.getId()).getParents().next().getId();
    var file = DriveApp.getFolderById(folder).createFile(name, Utilities.jsonStringify(data));

    // Display a modal dialog box with download link.
    var htmlOutput = HtmlService
        .createHtmlOutput(
            '<div style="font-family:\'Google Sans\',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:16px;">' +
            '<p><b>Backup saved to drive:</b></p>' +
            '<p>' + name + '</p>' +
            '<p><a href="' + file.getDownloadUrl() + '">Download</a></p>' +
            '</div>'
        )
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setWidth(400)
        .setHeight(150);

    ui.showModalDialog(htmlOutput, 'Backup sheet');
}

/**
 * Gets range values.
 */
function backupRange(book, range) {
    return SpreadsheetApp.getActive()
        .getSheetByName(book)
        .getRange(range)
        .getValues()
        .map(list => {
            if (list[0] instanceof Date) {
                var d = list[0];
                list[0] = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
            }
            return list;
        });
}
