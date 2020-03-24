const fetch = require('node-fetch')

// URLs with different params
const url1 = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/articles?start_date=2017-05-01T12:00:00&end_date=2020-11-01T12:00:00&keyterms=&location="
const url2 = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/articles?start_date=2017-05-01T12:00:00&end_date=2020-11-01T12:00:00&keyterms=corona&location="
const url3 = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/articles?start_date=2017-05-01T12:00:00&end_date=2020-11-01T12:00:00&keyterms=zika&location=china"
const url4 = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/articles?end_date=2020-11-01T12:00:00&keyterms=zika&location=china"
const url5 = "https://us-central1-seng3011-859af.cloudfunctions.net/app/api/v1/articles?end_date=2020-11-01T12:00:00&location=china"

exports.getResponse1 = async function()  {
    fetch(url1)
    .then(res => {
        return res.json()
    })
    .then(json => {
        return json
    })
}

exports.getResponse2 = async function() {
    fetch(url2)
    .then(res => {
        return res.json()
    })
    .then(json => {
        return json
    })
}

exports.getResponse3 = async function() {
    fetch(url3)
    .then(res => {
        return res.json()
    })
    .then(json => {
        return json
    })
}

exports.getResponse4 = async function()  {
    fetch(url4)
    .then(res => {
        return res.json()
    })
    .then(json => {
        return json
    })
}

exports.getResponse5 = async function()  {
    fetch(url5)
    .then(res => {
        return res.json()
    })
    .then(json => {
        return json
    })
}