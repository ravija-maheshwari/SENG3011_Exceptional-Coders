//Returns the radius of the display circle on the map
exports.getRadius = function(suburbCases, suburb){
    let radius = 0

    for(var i=0; i<suburbCases.length; i++) {
        if(suburb.name === suburbCases[i].name){
            let caseCount = getIntegerCases(suburbCases[i].count)
            radius = caseCount/10 * 300
            break
        }
    }

    return radius
}

//Parses the count field
function getIntegerCases(caseCount){
    if(caseCount.indexOf('-') > -1){
        //1-4 type of caseCount
        return Number(caseCount.split("-")[0])
    }else{
        return Number(caseCount)
    }
}
