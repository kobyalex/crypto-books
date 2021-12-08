/**
 * Gets swap pairs market data from the blockchain.
 * <p>Documentation: https://fcd.terra.dev/swagger
 */
function terraPairs(ui, book, address, r) {
    var json = importJson(encodeURI('https://lcd.terra.dev/wasm/contracts/' + address + '/store?query_msg={"pool":{}}'));

    if(typeof(json) === "string") {
        ui.alert('API error: ' + json);

    } else if(typeof(json) === "object") {
        var lp = json[1][1].total_share;

        var token = json[1][1].assets[0].info.hasOwnProperty('token') ? json[1][1].assets[0].amount :
            (json[1][1].assets[1].info.hasOwnProperty('token') ? json[1][1].assets[1].amount : 0);

        var contract = json[1][1].assets[0].info.hasOwnProperty('token') ? json[1][1].assets[0].info.token.contract_addr :
            (json[1][1].assets[1].info.hasOwnProperty('token') ? json[1][1].assets[1].info.token.contract_addr : "");

        var native = json[1][1].assets[0].info.hasOwnProperty('native_token') ? json[1][1].assets[0].amount :
            (json[1][1].assets[1].info.hasOwnProperty('native_token') ? json[1][1].assets[1].amount : 0);

        json = importJson(encodeURI('https://lcd.terra.dev/wasm/contracts/' + contract));

        var decimals = json[1][1].init_msg.decimals;

        book.getRange("D" + r + ":F" + r).setValues([[token / decimals, native / 1000000, lp / 1000000]]);
    }
}
