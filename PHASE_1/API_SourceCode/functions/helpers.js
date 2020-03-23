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