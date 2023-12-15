/**
 * Update pairs workbook.
 * <p>Fetch data from blockchain APIs.
 */
function updatePairs(ui) {
  var sheet = SpreadsheetApp.getActive();
  var book = sheet.getSheetByName("Pairs");

  var pairs = book.getRange("A3:C").getValues().filter(String);

  for (i = 0; i < pairs.length; i++) {
    if (pairs[i][0].length > 0 && pairs[i][0].includes("-") && pairs[i][1].length > 10 && pairs[i][2] == "Terra") {
      terraPairs(ui, book, pairs[i][0], pairs[i][1], i + 3);
    }
  }
}
