const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seng3011-859af.firebaseio.com"
});

const db = admin.firestore()


app.get('/api/testing_endpoint', async (req, res) => {
    try {
        // Testing code to send doc to Firestore collection
        // await db.collection('test_collection').doc().create({response: 'Hello World'});
        // return res.status(200).send('Hello World!');

        // Testing code to retrieve docs from Firestore
        // let results = [];
        //
        // const snapshot = await db.collection('test_collection').get()
        // snapshot.forEach(doc => {
        //     results.push(doc.data())
        // });
        //
        // return res.status(200).send(results)
        await populate_test_collection();

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get('/api/articles', async (req, res) => {
    try{
        //Retrieve article records from db
        let all_articles = [];
        const snapshot = await db.collection('articles').get()
        snapshot.forEach(doc => {
            all_articles.push(doc.data())
        });
        //Store logging information
        //Send response
        if(all_articles.length === 0) {
            const no_results = {message: "No articles found"};
            return res.status(204).send(no_results);
        }
        return res.status(200).send(all_articles);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get('/api/report', async(req, res) => {
    let date = req.query.date;
    let keyterms = req.query.keyterms;
    let location = req.query.location;

});

async function populate_test_collection() {

    let article1 = {
            "url":"https://www.who.int/csr/don/17-january-2020-novel-coronavirus-japan-exchina/en/",
            "date_of_publication": "2020-10-01 13:00:00",
            "headline": "Novel Coronavirus - Japan (ex-China)",
            "main_text": "On 15 January 2020, the Ministry of Health, Labour and    Welfare, Japan (MHLW) reported an imported case of laboratory-confirmed 2019-novel coronavirus...",
            "reports": [
                {
                    "event_date": "2020-01-03 xx:xx:xx to 2020-01-15",
                    "locations": [
                        {
                            "country": "China",
                            "location": "Wuhan, Hubei Province"
                        },
                        {
                            "country": "Japan",
                            "location": ""
                        }
                    ],
                    "diseases": [
                        "2019-nCoV"
                    ],
                    "syndromes": [
                        "Fever of unknown Origin"
                    ]
                }
            ]
        }

        let article2 = {
            "url": "www.who.int/lalala_fake_article",
            "date_of_publication": "2018-12-12 xx:xx:xx",
            "headline": "Outbreaks in Southern Vietnam",
            "main_text": "Three people infected by what is thought to be H5N1 or H7N9  in Ho Chi Minh city. First infection occurred on 1 Dec 2018, and latest is report on 10 December. Two in hospital, one has recovered. Furthermore, two people with fever and rash infected by an unknown disease.",
            "reports": [
                {
                    "event_date": "2018-12-01 xx:xx:xx to 2018-12-10 xx:xx:xx",
                    "locations": [
                        {
                            "geonames-id": 1566083,
                        }
                    ],
                    "diseases": [
                        "influenza a/h5n1","influenza a/h7n9"
                    ],
                    "syndromes": []
                },
                {
                    "event_date": "2018-12-01 xx:xx:xx to 2018-12-10 xx:xx:xx",
                    "locations": [
                        {
                            "geonames-id": 1566083,
                        }
                    ],
                    "diseases": [
                        "unknown"
                    ],
                    "syndromes": [
                        "Acute fever and rash"
                    ]
                }
            ]
        }



    //await db.collection('test_collection').doc().create(article1);
    await db.collection('test_collection').doc().create(article2);

}
exports.app = functions.https.onRequest(app);