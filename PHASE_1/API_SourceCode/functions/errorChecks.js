const helpers = require('./index');

//Function to check if any query param is missing
exports.checkMissingQueryParams = function(req, startExecTime) {
    if(typeof req.query.start_date === 'undefined' || typeof req.query.end_date === 'undefined' || typeof req.query.keyterms === 'undefined' || typeof req.query.location === 'undefined') {
        let endExecTime = new Date().getTime()
        let execTime = endExecTime - startExecTime
        //Log details
        let log = helpers.getLog(req.headers['x-forwarded-for'], req.query, 400, execTime)
        helpers.sendLog(log)
        return true
    }
    return false
}

//Function to check if a date is VALID and in CORRECT FORMAT
exports.checkDateFormat = function checkDateFormat(req, startExecTime) {
    let startDate = req.query.start_date
    let endDate = req.query.end_date
    
    let regexDateFormat = new RegExp(/^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])T(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/);
    if(!(regexDateFormat.test(startDate.toString()) && regexDateFormat.test(endDate.toString()))){
        let endExecTime = new Date().getTime()
        let execTime = endExecTime - startExecTime
        //Log details
        let log = helpers.getLog(req.headers['x-forwarded-for'], req.query, 400, execTime)
        helpers.sendLog(log)
        return true
    }
    return false
}

//Function to check if a start date occurs before end date
exports.isStartBeforeEnd = function isStartBeforeEnd(req, startExecTime) {
    if (req.query.start_date > req.query.end_date) {
        let endExecTime = new Date().getTime()
        let execTime = endExecTime - startExecTime
        //Log details
        let log = helpers.getLog(req.headers['x-forwarded-for'], req.query, 400, execTime)
        helpers.sendLog(log)
        return true
    }
    return false
}

