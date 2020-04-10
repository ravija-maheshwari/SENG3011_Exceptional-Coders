// import {hospitalDetail} from "datasets/hospitalDetail"

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
//Args:  hospital object (name, lat, lng), suburb infections (count, name)
//Takes into account that total beds could be a decimal
exports.getAvailableBeds = function(hospital, hospitalDetail, suburbCases){
    let beds = 0
    for(let i = 0; i < hospitalDetail.length ; i++) {
        //Going thru hospital details
        if (hospital.name.includes(hospitalDetail[i].name) || hospitalDetail[i].name.includes(hospital.name)) {
            //Found a match
            for (let j = 0; j < suburbCases.length ; j++) {
                if(hospitalDetail[i].suburb.includes(suburbCases[j].name) || suburbCases[j].name.includes(hospitalDetail[i].suburb)) {
                    beds = Math.floor(hospitalDetail[i].total_beds) - getIntegerCases(suburbCases[j].count)
                    break
                }
            }
        }
    }

    return beds > 0 ? beds: 0
}

//Returns the total "normal" beds in the hospital
exports.getTotalBeds = function(hospital, hospitalDetail) {
    let totalBeds = 0
    for(let i = 0; i < hospitalDetail.length; i++) {
        if (hospital.name.includes(hospitalDetail[i].name) || hospitalDetail[i].name.includes(hospital.name)) {
            totalBeds = Math.floor(hospitalDetail[i].total_beds)
            break
        }
    }
    return totalBeds
}


exports.getBedsCapacityRatio = function(bedsAvailable, totalBeds) {
    if (totalBeds === 0) { return 0 }
    
    let ratio = bedsAvailable/totalBeds
    return ratio
}

//Given the hospital name, it returns a suburb
exports.getHospitalSuburb = function(hospital, hospitalDetail) {
    for (var i=0; i<hospitalDetail.length; i++) {
        if (hospital.includes(hospitalDetail[i].name)) {
            return hospitalDetail[i].suburb
        }
    }
}

//Returns of list of hospitals matching the searchString
exports.getPotentialHospitalList = function(searchString, hospitalDetail){
    var result = []

    if(searchString.length === 0){
        return result
    }

    for(var i = 0; i < hospitalDetail.length; i++){
        if(hospitalDetail[i].name.startsWith(searchString)){
            result.push(hospitalDetail[i].name)
        }
    }
    return result
}