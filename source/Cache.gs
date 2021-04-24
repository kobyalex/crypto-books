/**
 * Cache handling.
 * <p>Reference: https://developers.google.com/apps-script/reference/cache/cache
 */
var cacheDisabled;

/**
 * Disables cache.
 */
function disableCache() {
    cacheDisabled = true;
    Logger.log("disableCache");
}

/**
 * Enables cache.
 */
function enableCache() {
    cacheDisabled = undefined;
    Logger.log("enableCache");
}

/**
 * Sets cache entry.
 * <p>Default 10 min.
 * <p>Maximum duration the value will remain in the cache, in seconds.
 * <p>The minimum is 1 second and the maximum is 21600 seconds (6 hours).
 *
 * @param key Cache key.
 * @param value Cache value.
 * @param duration Retention duration.
 */
function setCache(key, value, duration) {
    if(isCache()) {
        duration = parseInt(duration);
        if(duration == 0 || isNaN(duration)) {
            duration = 600;
        }
        var cacheService = CacheService.getUserCache();

        key = key.length > 250 ? key.substring(0, 250) : key;
        cacheService.put(key, JSON.stringify(value), duration);

        return true;
    }

    return false;
}

/**
 * Gets cache entry.
 *
 * @param key Cache key.
 */
function getCache(key) {
    if(isCache()) {
        var cacheService = CacheService.getUserCache();

        key = key.length > 250 ? key.substring(0, 250) : key;
        var items = cacheService.get(key);

        if(!items) {
            return null;
        }

        return JSON.parse(items);
    }
}

/**
 * Delete cache entry.
 */
function deleteCache(key) {
    if(isCache()) {
        var cacheService = CacheService.getUserCache();

        key = key.length > 250 ? key.substring(0, 250) : key;
        cacheService.remove(key);
    }
}

/**
 * Is cache enabled.
 */
function isCache() {
    if(cacheDisabled == true) {
        Logger.log("isCache:: Is disabled");
        return false;
    }

    return true;
}
