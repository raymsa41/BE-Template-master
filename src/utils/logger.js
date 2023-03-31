const winston = require('winston')

// logger settup
// add timestamp and print to console
const logger = winston.createLogger({
	transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    )
})

module.exports = logger
