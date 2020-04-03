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

//Returns the number of beds available in the hospital
//available beds = total beds - infections
//Args:  hospital object (name, suburb, total_beds), suburb infections (count, name)
//Takes into account that total beds could be a decimal
exports.getAvailableBeds = function(hospital, suburbCases){
    let beds = 0
    for(var i = 0; i < suburbCases ; i++) {
        if (hospital.suburb === suburbCases.name) {
            beds =  Math.floor(hospital.total_beds) - suburbCase.count
            break
        }
    }
    return beds
}



