class ImproperlyFormattedABCNotationError extends Error {
    constructor(message) {
        super(message)
        /* istanbul ignore else */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ImproperlyFormattedABCNotationError);
        }
        this.name = "ImproperlyFormattedABCNotationError";
    }
    
}

module.exports.ImproperlyFormattedABCNotationError = ImproperlyFormattedABCNotationError;