module.exports.isUpperCase = function (str) {
    return str === str.toUpperCase();
}

module.exports.includesIgnoreCase = function (string, substring) {
    return string.toUpperCase().includes(substring.toUpperCase());
}