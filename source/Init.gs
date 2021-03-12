/**
 * @OnlyCurrentDoc
 */

/*
Copyright (C) 2018 TechupBusiness (info@techupbusiness.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Initialize
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Crypto')
    .addItem('Add fiat rates', 'menuAddFiatRates')
    .addItem('Update portfolio', 'menuUpdatePortfolio')
    .addToUi();
}

/**
 * menuAddFiatRates()
 */
function menuAddFiatRates() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert(
    'Do you want to populate FIAT values for your trades?',
    ui.ButtonSet.OK_CANCEL);

  if (result == ui.Button.OK) {
    updateTradesFiatRates();
    ui.alert('Finished populating fiate rates!');
  }
}

/**
 * menuUpdatePortfolio()
 */
function menuUpdatePortfolio() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert(
    'Did you sort the Trades sheet by date Z-A?',
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  if (result == ui.Button.OK) {
    updatePortofolio();
    ui.alert('Finished report!');
  }
}
