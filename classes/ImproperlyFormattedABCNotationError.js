class ImproperlyFormattedABCNotationError extends Error {
    constructor(message) {
        super(message)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ImproperlyFormattedABCNotationError);
        }
        this.name = "ImproperlyFormattedABCNotationError";
    }
    
}

module.exports.ImproperlyFormattedABCNotationError = ImproperlyFormattedABCNotationError;