module.exports.isUpperCase = function (str) {
    return str === str.toUpperCase();
}

module.exports.includesIgnoreCase = function (string, substring) {
    return string.toUpperCase().includes(substring.toUpperCase());
}

module.exports.trimNewLines = function(str) {
    if(str.startsWith('\n')) {
        str = str.substring(1);
    }
    if(str.endsWith('\n')) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}