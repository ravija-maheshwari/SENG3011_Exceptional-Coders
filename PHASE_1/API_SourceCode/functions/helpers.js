exports.getFormattedDatetime = function(date) {
    let d = date.toDate(); // toDate is a Firebase specific function
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let day = d.getDate();
    let hours = d.getHours();
    let mins = d.getMinutes();
    let seconds = d.getSeconds();

    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    if (hours < 10) { hours = "0" + hours; }
    if (mins < 10) { mins = "0" + mins; }
    if (seconds < 10) { seconds = "0" + seconds; }

    let dateString = year + "-" + month + "-" + day + " " + hours + ":" + mins + ":" + seconds;
    return dateString;
}

exports.isKeytermsParamEmpty = function(keyterms) {
    if (keyterms.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

exports.isLocationParamEmpty = function(location) {
    if (location.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

exports.docHasKeyterm = function(doc, keyterms) {
    let hasKeyterm = false

    if (keyterms.length > 0) {
        for (let term of keyterms){
            let termRegex = new RegExp(term, "i");
            // Checking if term exists in headline or main_text
            if (termRegex.test(doc.headline) || termRegex.test(doc.main_text)) {
                hasKeyterm = true;
                continue;
            }
            else {
                for (report of doc.report) {
                    // Checking keyterm in reports
                    let diseases = report.diseases.map((item) => { return item.toLowerCase(); });
                    let syndromes = report.syndromes.map((item) => { return item.toLowerCase(); });
                    let lowerCaseKeyterm = term.toLowerCase();
                    
                    // Obtaining a new array after filtering diseases and syndromes
                    // containing the keyterm
                    let diseasesWithKeyterm = diseases.filter(item => item.includes(lowerCaseKeyterm))
                    let syndromesWithKeyterm = syndromes.filter(item => item.includes(lowerCaseKeyterm))

                    // If filtered arrays have some value (ie. length > 0), it means keyterm was found
                    if (diseasesWithKeyterm.length > 0 || syndromesWithKeyterm.length > 0) {
                        hasKeyterm = true;
                        continue;
                    }
                }
            }
        }
    }

    return hasKeyterm;
}

exports.docHasLocation = function(doc, location) {
    let hasLocation = false;

    if (location.length === 0) {
        return false;
    }
    
    let locationRegex = new RegExp(location, "i");

    for (let place of doc.reports) {
        for (let loc of place.locations) {
            if(locationRegex.test(loc.location) || locationRegex.test(loc.country)) {
                hasLocation = true;
                break;
            }
        }
    }

    return hasLocation;
}

exports.createArticleObject = function(doc) {
    let formattedDate = exports.getFormattedDatetime(doc.date_of_publication);
            
    let article = {
        url: doc.url,
        date_of_publication: formattedDate,
        headline: doc.headline,
        main_text: doc.main_text,
        reports: doc.report
    };

    return article
}