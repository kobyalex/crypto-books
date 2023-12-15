/**
 * Pad left Number prototype.
 */
Number.prototype.padLeft = function (n, str) {
  return Array(n - String(this).length + 1).join(str || "0") + this;
};

/**
 * Is number.
 * @customfunction
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Is positive.
 * @customfunction
 */
function isPositive(n, e) {
  return n > 0 ? n : e;
}
