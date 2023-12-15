/**
 * Imports JSON data to your spreadsheet.
 *
 * @param url URL of JSON data as string.
 * @param xpath Simplified xpath as string.
 * @customfunction
 */
function importJson(url, xpath) {
  try {
    var content = importUrl(url);

    var json = JSON.parse(content);
    if (xpath != undefined) {
      var patharray = xpath.split(".");
      Logger.log("importJson:: Path: " + patharray);

      for (var i = 0; i < patharray.length; i++) {
        json = json[patharray[i]];
      }
    }

    Logger.log("importJson:: Data type: " + typeof json);
    if (typeof json === "undefined") {
      return "Request returned nothing!";
    } else if (typeof json === "object") {
      var tempArr = [];

      for (var obj in json) {
        tempArr.push([obj, json[obj]]);
      }
      return tempArr;
    } else if (typeof json !== "object") {
      return json;
    }
  } catch (err) {
    Logger.log("importJson:: " + err);
    return err.message;
  }
}

/**
 * Imports URL with cache.
 *
 * @param url URL of data as string.
 * @customfunction
 */
function importUrl(url) {
  var cached = getCache(url);
  if (cached != null) {
    Logger.log("importUrl:: Cache found for: " + url);
    return cached;
  }

  Logger.log("importUrl:: Fetching URL: " + url);
  var res = UrlFetchApp.fetch(url);
  Logger.log("importUrl:: Response code: " + res.getResponseCode);

  var content = res.getContentText();
  setCache(url, content);

  return content;
}

/**
 * Debug method.
 */
function importJsonDebug() {
  disableCache();
  Logger.log(
    importJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin", "0.total_volume")
  );
}
