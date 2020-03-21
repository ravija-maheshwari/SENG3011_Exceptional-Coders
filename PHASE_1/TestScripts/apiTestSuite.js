let colors = require('colors')
let Validator = require('jsonschema').Validator;
let v = new Validator();

// Schema for article
let articleSchema = {
    "id": "/Article",
    "type": "object",
    "properties": {
        "url": { "type": "string" },
        "date_of_publication": { "type": "string" },
        "headline": { "type": "string" },
        "main_text": { "type": "string" },
        "reports" : {
            "type": "array",
            "items": { "$ref": "/Report" }
        }
    },
    "required": [
        "url",
        "date_of_publication",
        "headline",
        "main_text",
        "reports"
    ]
};

// Schema for report which is added and referenced in articleSchema
let reportSchema = {
    "id": "/Report",
    "type": "object",
    "properties": {
        "event_date": { "type": "string" },
        "locations": {
            "type": "array",
            "items": {
                "properties": {
                    "country": { "type": "string" },
                    "location": { "type": "string" }
                }
            }
        },
        "diseases": {
            "type": "array",
            "items": { "type": "string" }
        },
        "syndromes": {
            "type": "array",
            "items": { "type": "string" }
        }
    },
    "required": [
        "event_date",
        "locations",
        "diseases",
        "syndromes"
    ]
}

// Final response schema
let finalResponseJson = {
    "id": "/FinalJson",
    "type": "array",
    "items": {
        "$ref": "/Article"
    }
}

// Example to test (This should be put in its own file most probably)
let example = [
    {
      "url": "www.who.int/lalala_fake_article",
      "date_of_publication": "2016-08-29 09:12:33",
      "headline": "Outbreaks in Southern Vietnam",
      "main_text": "Three people infected by what is ...",
      "reports": [
        {
          "event_date": "2018-12-01 21:10:10 to 2018-12-10 12:30:00",
          "locations": [
            {
              "country": "China",
              "location": "Wuhan, Hubei Province"
            }
          ],
          "diseases": [
            "COVID-19"
          ],
          "syndromes": [
            "Fever of unknown origin"
          ]
        }
      ]
    }
  ]

// Adding both the schemas referenced (ie. "$ref")
v.addSchema(reportSchema, "/Report");
v.addSchema(articleSchema, "/Article")

// Adding tests to a list
let tests = []
let result1 = v.validate(example, finalResponseJson);
tests.push(result1)
let result2 = v.validate(example, finalResponseJson);
tests.push(result2)

let numTests = tests.length
let passed = 0

// Testing...tests, and printing pass/fail
for (res of tests) {
    if (res.errors.length === 0) {
        console.log("Pass".green);
        passed++;
    }

    else {
        console.log("Fail".red)
    }
}

if (passed === numTests) {
    console.log("All tests passed!".green)
}

else {
    let s = passed + "/" + numTests + " tests passed";
    console.log(s.yellow)
}