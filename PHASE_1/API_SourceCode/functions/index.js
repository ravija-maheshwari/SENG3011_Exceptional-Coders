const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const errorCheckers = require('./errorChecks');

const morgan = require('morgan');  //Middleware logger library
//A write stream for logging requests
// const logStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' });

const app = express();

//Middleware
// app.use(morgan(':date[web] :method :url :status :res[content-length] - :response-time ms :remote-addr \n', {stream: logStream}));
app.use(cors ({ origin: true }) );

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seng3011-859af.firebaseio.com"
});

const db = admin.firestore()
const serverErrorMsg = { error: "Internal server error, please try again." }


//Endpoint to get all logs from Firestore
app.get('/api/v1/logs', async(req, res) => {
    try {
        let allLogs = [];

        const snapshot = await db.collection('logs').get()
        snapshot.forEach(doc => {

            let log = {
                AccessTime: doc.data().AccessTime,
                TeamName: doc.data().TeamName,
                DataSource: doc.data().DataSource,
                RemoteAddress: doc.data().RemoteAddress,
                RequestPath: doc.data().RequestPath,
                QueryParameters: doc.data().QueryParameters,
                ResponseStatus: doc.data().ResponseStatus,
                ExecutionTime: doc.data().ExecutionTime
            };

            allLogs.push(log);
        });
        //Send response
        if(allLogs.length === 0) {
            return res.status(200).send(allLogs);
        }
        return res.status(200).send(allLogs);
    } catch (error) {
        console.log(error);
        return res.status(500).send(serverErrorMsg);
    }
})

//Endpoint to retrieve specific articles
app.get('/api/v1/articles', async(req, res) => {
    try {
        
        let startExecTime = new Date().getTime();

        let startDate = req.query.start_date
        let endDate = req.query.end_date
        let keyterms = req.query.keyterms
        let location = req.query.location
    
        if(errorCheckers.checkMissingQueryParams(req, startExecTime)){
            const errorMsg = {error: "Bad Request - Some query parameters are missing."}
            return res.status(400).send(errorMsg)
        }

        if(errorCheckers.checkDateFormat(req, startExecTime)){
            const errorMsg = { error: "Bad Request - Invalid date format."}
            return res.status(400).send(errorMsg)
        }

        if(errorCheckers.isStartBeforeEnd(req, startExecTime)){
            const errorMsg = { error: "Bad Request - start_date has to be before end_date."}
            return res.status(400).send(errorMsg)
        }

        //Parsing keyterms
        if (keyterms.length === 0) {
            keyterms = []
        }else {
            keyterms = keyterms.toString().split(",");
        }

        // Parsing date - converting startDate param into proper Date format
        startDate = new Date(startDate.replace("T", " "));
        endDate = new Date(endDate.replace("T", " "));

        let articles = [];

        let allArticles = db.collection('test_collection');

        let query = allArticles
                    .where('date_of_publication', '>=', startDate)
                    .where('date_of_publication', '<=', endDate)
                    .get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            // Changed it so that there's an empty list in the response
                            let endExecTime = new Date().getTime()
                            let execTime = endExecTime - startExecTime
                            
                            let log = getLog(req.headers['x-forwarded-for'], req.query, 200, execTime)
                            sendLog(log)

                            return res.status(200).send(articles);
                        }

                        // Checking if headline contains any of the keyterms
                        snapshot.forEach(doc => {
                            let hasKeyterm = helpers.docHasKeyterm(doc, keyterms)
                            let hasLocation = helpers.docHasLocation(doc, location)

                            // Push doc to articles if keyterm is found and no location provided
                            if (hasKeyterm && helpers.isLocationParamEmpty(location)) {
                                let article = helpers.createArticleObject(doc)
                                articles.push(article);
                            }

                            // Push doc if location is also provided in query params
                            // (and location is found in doc)
                            else if ((hasKeyterm && !helpers.isLocationParamEmpty(location)) || (helpers.isKeytermsParamEmpty(keyterms) && !helpers.isLocationParamEmpty(location))) {
                                
                                if (hasLocation) {
                                    let article = helpers.createArticleObject(doc)
                                    articles.push(article);
                                }
                            }
                        });                        

                        if (articles.length === 0 && keyterms.length === 0 && location.length === 0) {
                            // No matching keywords & locations found
                            // Still return date matches or return empty response?
                            console.log("No matching keywords found - returning only matching dates");
                            snapshot.forEach(doc => {
                                let article = helpers.createArticleObject(doc)
                                articles.push(article);
                            })
                        }

                        let endExecTime = new Date().getTime()
                        let execTime = endExecTime - startExecTime
                        
                        let log = getLog(req.headers['x-forwarded-for'], req.query, 200, execTime)
                        sendLog(log)

                        return res.status(200).send(articles);
                    })
                    .catch(error => {
                        console.log("Error getting documents: " , error);

                        let endExecTime = new Date().getTime()
                        let execTime = endExecTime - startExecTime
                        
                        let log = getLog(req.headers['x-forwarded-for'], req.query, 500, execTime)
                        sendLog(log)

                        return res.status(500).send(serverErrorMsg);
                    })

        return null;
    } catch (error) {
        console.log(error);

        let endExecTime = new Date().getTime()
        let execTime = endExecTime - startExecTime
        
        let log = getLog(req.headers['x-forwarded-for'], req.query, 200, execTime)
        sendLog(log)
        
        return res.status(500).send(serverErrorMsg);
    }
});

// Helper Functions

const sendLog = exports.sendLog = async function(log) {
    try {
        await db.collection('logs').doc().create(log)
    } catch (error) {
        console.log("Error while creating log: \n" + error)
    }
}

const getLog = exports.getLog = function(ip, params, status, execTime) {
    let currDatetime = new Date()
    let dateString = currDatetime.toISOString()

    let ipString = ""

    if (typeof ip === 'undefined') { 
        ipString = "-" 
    }
    else { 
        ipString = ip.split(",")[0] 
    }

    // add some more 
    let log = {
        AccessTime: dateString,
        TeamName: "Exception(al) Coders",
        DataSource: "Flutrackers",
        RemoteAddress: ipString,
        RequestPath: "/articles",
        QueryParameters: params,
        ResponseStatus: status,
        ExecutionTime: execTime + "ms"
    }
    return log
}

async function populate_test_collection() {

    let article1 = {
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

        let article2 = {
            url: "www.who.int/lalala_fake_article",
            date_of_publication: new Date("2018-12-12 12:50:00"),
            headline: "Outbreaks in Southern Vietnam",
            main_text: "Three people infected by what is thought to be H5N1 or H7N9  in Ho Chi Minh city. First infection occurred on 1 Dec 2018, and latest is report on 10 December. Two in hospital, one has recovered. Furthermore, two people with fever and rash infected by an unknown disease.",
            reports: [
                {
                    event_date: "2018-12-01 xx:xx:xx to 2018-12-10 xx:xx:xx",
                    locations: [
                        {
                            "geonames-id": 1566083,
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
                            "geonames-id": 1566083,
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

    await db.collection('test_collection').doc().create(article1);
    await db.collection('test_collection').doc().create(article2);
}


exports.app = functions.https.onRequest(app);
