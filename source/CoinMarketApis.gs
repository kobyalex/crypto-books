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

/* Sample:
  "id": "bitcoin",
  "name": "Bitcoin",
  "symbol": "BTC",
  "rank": "1",
  "price_usd": "8883.34",
  "price_btc": "1.0",
  "24h_volume_usd": "8120150000.0",
  "market_cap_usd": "150215280648",
  "available_supply": "16909775.0",
  "total_supply": "16909775.0",
  "max_supply": "21000000.0",
  "percent_change_1h": "0.17",
  "percent_change_24h": "-5.98",
  "percent_change_7d": "-19.33",
  "last_updated": "1520626767",
  "price_eur": "7207.65780912",
  "24h_volume_eur": "6588429865.2",
  "market_cap_eur": "121879871829"
*/

/**
 * getApiKeyUrlSuffix()
 */
function getApiKeyUrlSuffix() {
  var apiKey = getSetting(6, 2)
  if (!isEmpty(apiKey)) {
    return '&api_key=' + apiKey
  } else {
    return '';
  }
}

/**
 * getValueFromOhlcCryptoCompare()
 */
function getValueFromOhlcCryptoCompare(priceData) {
  var candle = priceData['Data'][1];
  return (candle.open + candle.close) / 2;
}

/**
 * fetchCryptoCompareRates()
 */
function fetchCryptoCompareRates(CryptoCurrencies, FiatCurrency, DateTime) {
  var neededCurrencies;
  var rates = [];
  var cacheKey, cachedValue;

  var cacheKeySuffix = ""; // used for DateTime

  if (!FiatCurrency) {
    FiatCurrency = getFiatName();
  }

  if (!isEmpty(DateTime) && DateTime instanceof Date) {
    // Note: API is only storing one value per day (not accurate unfortunately)
    var strCacheDate = "T" + DateTime.getFullYear() + (DateTime.getMonth() + 1).padLeft(2) + DateTime.getDate().padLeft(2);
    var dCacheDate = new Date(DateTime.getFullYear(), DateTime.getMonth(), DateTime.getDate(), DateTime.getHours() + 1, 0, 0);
    cacheKeySuffix = strCacheDate;
  }

  // Get cached values
  if (CryptoCurrencies instanceof Array) {
    neededCurrencies = [];

    for (var currencyIndex in CryptoCurrencies) {
      var currency = CryptoCurrencies[currencyIndex];
      cacheKey = "cc" + FiatCurrency + currency + cacheKeySuffix;
      cachedValue = getCache(cacheKey);

      if (cachedValue > 0) {
        rates[currency] = cachedValue;

      } else {
        neededCurrencies.push(currency);
      }
    }
  } else {
    cacheKey = "cc" + FiatCurrency + CryptoCurrencies + cacheKeySuffix;
    cachedValue = getCache(cacheKey);

    if (isNumeric(cachedValue) && cachedValue > 0) {
      rates[CryptoCurrencies] = cachedValue;

    } else {
      neededCurrencies = CryptoCurrencies;
    }
  }

  // Start getting data from API
  if (neededCurrencies != undefined) {
    var urls = [];

    if (neededCurrencies instanceof Array) {
      if (!isEmpty(DateTime) && DateTime instanceof Date) {
        for (var currencyIndex in neededCurrencies) {
          var currency = neededCurrencies[currencyIndex];
          urls.push("https://min-api.cryptocompare.com/data/histohour?limit=1&fsym=" + currency + "&tsym=" + FiatCurrency + "&toTs=" + (dCacheDate.getTime() / 1000) + getApiKeyUrlSuffix());
        }
      } else {
        urls.push("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + neededCurrencies.join(',') + "&tsyms=" + FiatCurrency + getApiKeyUrlSuffix());
      }

    } else {
      if (!isEmpty(DateTime) && DateTime instanceof Date) {
        urls.push("https://min-api.cryptocompare.com/data/histohour?limit=1&fsym=" + neededCurrencies + "&tsym=" + FiatCurrency + "&toTs=" + (dCacheDate.getTime() / 1000) + getApiKeyUrlSuffix());
      } else {
        urls.push("https://min-api.cryptocompare.com/data/price?fsym=" + neededCurrencies + "&tsyms=" + FiatCurrency + getApiKeyUrlSuffix());
      }
    }

    for (var url in urls) {
      var returnText = fetchUrl(urls[url]);
      //writeLog(new Date(),"fetchCryptoCompareRates","fetchUrl: " + urls[url]);

      if (returnText == "") {
        writeLog(new Date(),"fetchCryptoCompareRates","Empty: " + JSON.stringify(neededCurrencies));
        return null;
      }

      var priceData = JSON.parse(returnText);
      if (priceData.Response == "Error") {
        writeLog(new Date(),"fetchCryptoCompareRates","Error: " + priceData.Message);

        // Save to cache if no data found to avoid further searches
        if (priceData.Message.indexOf("no data") !== -1 && isString(neededCurrencies)) {
          cacheKey = "cc" + FiatCurrency + neededCurrencies + cacheKeySuffix;
          setCache(cacheKey, "notfound");
        }
        return null;

      } else {
        //writeLog(new Date(),"fetchCryptoCompareRates","Response: " + JSON.stringify(priceData));

        if (neededCurrencies instanceof Array) {
          for (var cryptoIndex in neededCurrencies) {
            var CryptoCurrency = neededCurrencies[cryptoIndex];

            if (priceData[CryptoCurrency][FiatCurrency] > 0) {
              rates[CryptoCurrency] = priceData[CryptoCurrency][FiatCurrency];

              // Save to cache
              cacheKey = "cc" + FiatCurrency + CryptoCurrency + cacheKeySuffix;
              setCache(cacheKey, rates[CryptoCurrency]);
            }
          }

        } else {
          if (!isEmpty(DateTime) && DateTime instanceof Date) {
            rates[neededCurrencies] = getValueFromOhlcCryptoCompare(priceData);
          } else if (priceData[FiatCurrency] > 0) {
            rates[neededCurrencies] = priceData[FiatCurrency];
          }

          // Save to cache
          if (rates[neededCurrencies] > 0) {
            cacheKey = "cc" + FiatCurrency + neededCurrencies + cacheKeySuffix;
            setCache(cacheKey, rates[neededCurrencies]);
          }
        }
      }
    }
  }

  return rates;
}

/**
 * getCryptoFiatRate()
 */
function getCryptoFiatRate(currency, DateTime, FiatCurrency) {
  if (!FiatCurrency) {
    FiatCurrency = getFiatName();
  }

  // CryptoCompare
  var serviceCurrencyName = getFinalCoinName("CryptoCompare", currency);
  var cc = fetchCryptoCompareRates(serviceCurrencyName, FiatCurrency, DateTime);

  if (!isEmpty(cc) && isNumeric(cc[serviceCurrencyName])) {
    //writeLog(new Date(),"getCryptoFiatRate","CryptoCompareRates for [" + serviceCurrencyName + "]: " + cc[serviceCurrencyName]);
    return parseFloat(cc[serviceCurrencyName]);

  } else {
    // FallbackRateFiat
    var localCurrencyPrice = findValue("Coins", "FallbackRateFiat", "Currency", serviceCurrencyName, false);

    writeLog(new Date(),"getCryptoFiatRate","FallbackRateFiat for [" + serviceCurrencyName + "]: " + localCurrencyPrice);
    if (isNumeric(localCurrencyPrice)) {
      return parseFloat(localCurrencyPrice);

    } else {
      return 0;
    }
  }
}
