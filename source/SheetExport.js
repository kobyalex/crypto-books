/**
 * Gets export data from all workbooks.
 */
function sheetExport(ui) {
    var data = {};

    // Export Coins.
    data["Coins"] = {
        coins: exportRange("Coins", "A3:B"),
        comments: exportRange("Coins", "AD3:AE")
    };

    // Export Trades.
    data["Trades"] = exportRange("Trades", "A2:M");

    // Export Wallets and Flux.
    var skip = ["wallet", "flux"];
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var books = sheet.getSheets();
    data["sort"] = {
        wallets: [],
        flux: []
    };
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var name = book.getName();

        if (skip.indexOf(name.toLowerCase()) > -1) {
            continue;
        }

        if (name.toLowerCase().endsWith("wallet")) {
            data["sort"].wallets.push(name);
            data[name] = {
                inCoins: book.getRange("H1").getValue(),
                trades: exportRange(name, "I3:U")
            };
        } else if (name.toLowerCase().startsWith("flux")) {
            data["sort"].flux.push(name);
            data[name] = {
                results: book.getRange("B1").getValue(),
                ticker: book.getRange("D1").getValue(),
                interval: book.getRange("F1").getValue(),
                inTrades: book.getRange("R1").getValue(),
                wallets: exportRange(name, "T1:X1")
            };
        }
    }

    // Export Deposits.
    data["Deposits"] = {
        inTrades: sheet.getSheetByName("Deposits").getRange("B2").getValue(),
        wallets: exportRange("Deposits", "D2:H2")
    };

    // Export Staking.
    data["Staking"] = {
        inTrades: sheet.getSheetByName("Staking").getRange("F2").getValue(),
        wallets: exportRange("Staking", "H2:M2")
    };

    // Export Free.
    data["Free"] = {
        inTrades: sheet.getSheetByName("Free").getRange("L2").getValue(),
        trades: exportRange("Free", "O1:S1"),
        wallets: exportRange("Free", "N2:S2")
    };


    // Export HODL.
    data["HODL"] = {
        inTrades: sheet.getSheetByName("HODL").getRange("H2").getValue(),
        wallets: exportRange("HODL", "K2:P2")
    };

    // Export Settings.
    data["Settings"] = {
        stableCoins: exportRange("Settings", "A4:A"),
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
            '<div><b>Backup saved to drive:</b></div>' +
            '<div>' + name + '</div>' +
            '<div><a href="' + file.getDownloadUrl() + '">Download</a></div>' +
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
function exportRange(book, range) {
    return SpreadsheetApp.getActive()
        .getSheetByName(book)
        .getRange(range)
        .getValues()
        .map(list => {
            if (list[0] instanceof Date) {
                var d = list[0];
                d.setHours(d.getHours()-1);
                list[0] = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
            }
            return list;
        });
}
