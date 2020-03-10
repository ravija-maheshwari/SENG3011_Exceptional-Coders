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
        let results = [];

        const snapshot = await db.collection('test_collection').get()
        snapshot.forEach(doc => {
            results.push(doc.data())
        });

        return res.status(200).send(results)
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

exports.app = functions.https.onRequest(app);