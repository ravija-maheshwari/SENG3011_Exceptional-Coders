const helpers = require('../API_SourceCode/functions/helpers')
const errorChecks = require('../API_SourceCode/functions/errorChecks')

// Input - Sample request parameters

let allParamsPresent = {
    query: {
        start_date: "2016-10-01T12:00:00",
        end_date: "2020-12-01T12:00:00",
        keyterms: "",
        location: ""
    }
}

//Sample requests for query params
let missingStartDate = {
    query: {
        end_date: "2020-12-01T12:00:00",
        keyterms: "",
        location: ""
    }
}
let missingEndDate = {
    query: {
        start_date: "2016-10-01T12:00:00",
        keyterms: "",
        location: ""
    }
}

let missingKeyterms = {
    query: {
        start_date: "2016-10-01T12:00:00",
        end_date: "2020-12-01T12:00:00",
        location: ""
    }
}


let missingLocation = {
    query: {
        start_date: "2016-10-01T12:00:00",
        end_date: "2020-12-01T12:00:00",
        keyterms: ""
    }
}

// Month cannot be 19.
let incorrectStartMonth = {
    query: {
        start_date: "2016-19-01T12:00:00",
        end_date: "2020-12-01T12:00:00",
        keyterms: "",
        location: ""
    }
}

// 60:00:00 is an invalid time
let incorrectStartTime = {
    query: {
        start_date: "2016-19-01T60:00:00",
        end_date: "2020-12-01T12:00:00",
        keyterms: "",
        location: ""
    }
}

//Start date occurs AFTER end date
let startAfterEnd = {
    query: {
        start_date: "2019-19-01T60:00:00",
        end_date: "2016-12-01T12:00:00",
        keyterms: "",
        location: ""
    }
}



// Sample Articles

let articleChina = {
    url:"https://www.who.int/csr/don/17-january-2020-novel-coronavirus-japan-exchina/en/",
    date_of_publication: new Date("2020-10-01 13:00:00"),
    headline: "Novel Coronavirus - Japan (ex-China)",
    main_text: "On 15 January 2020, the Ministry of Health, Labour and    Welfare, Japan (MHLW) reported an imported case of laboratory-confirmed 2019-novel coronavirus...",
    reports: [
        {
            event_date: "2020-01-03 xx:xx:xx to 2020-01-15",
            locations: [
                {
                    country: "China",
                    location: "Wuhan, Hubei Province"
                },
                {
                    country: "Japan",
                    location: ""
                }
            ],
            diseases: [
                "2019-nCoV"
            ],
            syndromes: [
                "Fever of unknown Origin"
            ]
        }
    ]
}

let articleVietnam = {
    url: "www.who.int/lalala_fake_article",
    date_of_publication: new Date("2018-12-12 12:50:00"),
    headline: "Outbreaks in Southern Vietnam",
    main_text: "Three people infected by what is thought to be H5N1 or H7N9  in Ho Chi Minh city. First infection occurred on 1 Dec 2018, and latest is report on 10 December. Two in hospital, one has recovered. Furthermore, two people with fever and rash infected by an unknown disease.",
    reports: [
        {
            event_date: "2018-12-01 xx:xx:xx to 2018-12-10 xx:xx:xx",
            locations: [
                {
                    country: "Vietnam",
                    location: "Ho Chi Minh"
                }
            ],
            diseases: [
                "influenza a/h5n1","influenza a/h7n9"
            ],
            syndromes: []
        },
        {
            event_date: "2018-12-01 xx:xx:xx to 2018-12-10 xx:xx:xx",
            locations: [
                {
                    country: "Vietnam",
                    location: "Ho Chi Minh"
                }
            ],
            diseases: [
                "unknown"
            ],
            syndromes: [
                "Acute fever and rash"
            ]
        }
    ]
}

// Test Cases

// Testing missing query params
test('missing start date', () => {
    expect(errorChecks.checkMissingQueryParams(missingStartDate)).toBe(true)
})

test('missing end date', () => {
    expect(errorChecks.checkMissingQueryParams(missingEndDate)).toBe(true)
})

test('missing keyterms', () => {
    expect(errorChecks.checkMissingQueryParams(missingKeyterms)).toBe(true)
})

test('missing location', () => {
    expect(errorChecks.checkMissingQueryParams(missingLocation)).toBe(true)
})

// Test for no missing query params
test('all query params present', () => {
    expect(errorChecks.checkMissingQueryParams(allParamsPresent)).toBe(false)
})

// Testing date formats
test('start month is invalid', () => {
    expect(errorChecks.checkDateFormat(incorrectStartMonth)).toBe(true)
})

test('start time is invalid', () => {
    expect(errorChecks.checkDateFormat(incorrectStartTime)).toBe(true)
})

//Start date before end date
test('start date is before end date', () => {
    expect(errorChecks.isStartBeforeEnd(startAfterEnd)).toBe(false)
})

test('start date is after end date', () => {
    expect(errorChecks.isStartBeforeEnd(allParamsPresent)).toBe(true)
})


// Tests for keyterms
test('return value of docHasKeyterm is true', () => {
    expect(helpers.docHasKeyterm(articleVietnam, ['outbreak'])).toBe(true)
})

test('return value of docHasKeyterm is false', () => {
    expect(helpers.docHasKeyterm(articleVietnam, ['corona'])).toBe(false)
})

test('return value of docHasKeyterm is true for multiple keyterms', () => {
    expect(helpers.docHasKeyterm(articleChina, ['corona', 'fever', 'cough'])).toBe(true)
})

test('return value of docHasKeyterm is false for empty keyterms', () => {
    expect(helpers.docHasKeyterm(articleChina, [])).toBe(false)
})


// Tests for location
test('return value of docHasLocation is true', () => {
    expect(helpers.docHasLocation(articleChina, "china")).toBe(true)
})

test('return value of docHasLocation is false', () => {
    expect(helpers.docHasLocation(articleChina, "Vietnam")).toBe(false)
})

test('return value of docHasLocation is false for empty location', () => {
    expect(helpers.docHasLocation(articleVietnam, "")).toBe(false)
})

// Tests for checking if keyterms is empty
test('return value of isKeytermsParamEmpty is true', () => {
    expect(helpers.isKeytermsParamEmpty([])).toBe(true)
})

test('return value of isKeytermsParamEmpty is false', () => {
    expect(helpers.isKeytermsParamEmpty(['abc'])).toBe(false)
})

// Tests for checking if location is empty
test('return value of isLocationParamEmpty is true', () => {
    expect(helpers.isLocationParamEmpty("")).toBe(true)
})

test('return value of isLocationParamEmpty is false', () => {
    expect(helpers.isLocationParamEmpty("Sydney")).toBe(false)
})

