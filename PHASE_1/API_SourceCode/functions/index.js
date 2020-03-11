const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors ({ origin: true }) );

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seng3011-859af.firebaseio.com"
});

const db = admin.firestore()


app.get('/api/test', async (req, res) => {
    try {
        await populate_test_collection();
        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//Endpoint to get all article reports
app.get('/api/articles', async (req, res) => {
    try{
        //Retrieve article records from db
        let all_articles = [];
        const snapshot = await db.collection('test_collection').get()
        snapshot.forEach(doc => {
            all_articles.push(doc.data())
        });
        //Store logging information - TBD
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

//Endpoint to retrieve specific article
//TBD:
//add in error checks + managing optional/compulsory params
app.get('/api/article', async(req, res) => {
    try {
        let start_date = req.query.start_date;
        let end_date = req.query.end_date;
        let keyterm = req.query.keyterm;
        let location = req.query.location;

        // Converting start_date param into proper Date format
        start_date = new Date(start_date.replace("T", " "));
        // end_date = end_date.replace("T",  " ");

        let articles = []

        let allArticles = db.collection('test_collection');
        let query = allArticles.where('date_of_publication', '>=', start_date)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("No matching documents");
                    const no_results = {message: "No articles found"};

                    // Returning 204 status means there's no body in response
                    // Should probably change it to 200 if we want to give an informative message
                    return res.status(204).send(no_results);
                }

                // snapshot.forEach(doc => {
                //     console.log(doc.id, '=>', doc.data());
                // });
                snapshot.forEach(doc => {
                    articles.push(doc.data())
                })

                return res.status(200).send(articles)
            })
            .catch(err => {
                console.log("Error getting documents" , err);
                return res.status(500).send(error);
            })

        return null
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

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