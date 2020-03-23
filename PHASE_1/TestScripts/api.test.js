const helpers = require('../API_SourceCode/functions/helpers')
const errorChecks = require('../API_SourceCode/functions/errorChecks')

// Sample request parameters

let req1 = {
    query: {
        start_date: "2016-10-01T12:00:00",
        end_date: "2020-12-01T12:00:00",
        keyterms: "",
    }
}

// let req2 = {
//     query: {
//         start_date: "2016-10-01T12:00:00",
//         end_date: "2020-12-01T12:00:00",
//         location: "",
//     }
// }

// let req3 = {
//     query: {
//         start_date: "2016-10-01T12:00:00",
//         end_date: "2020-12-01T12:00:00",
//         keyterms: "",
//         location: ""
//     }
// }

// Test Cases

// Test 1 - Check for missing parameter (location)
test('checks missing parameter (keyterms) for req1 and returns true', () => {
    expect(errorChecks.checkMissingQueryParams(req1)).toBe(true)
})
