export default async function initialize() {
    sessionStorage.clear();
    $.getJSON("https://unitoi-data.s3-ap-southeast-2.amazonaws.com/toilet-new.json",function(result){
        for (let i = 0; i < result.length; i++) {
            localStorage.setItem(result[i].id, JSON.stringify(result[i]));
        }
    });
    $.getJSON("https://unitoi-data.s3-ap-southeast-2.amazonaws.com/admin-new.json",function(result){
        for (let i = 0; i < result.length; i++) {
            localStorage.setItem(result[i].email, result[i].password);
        }
    });
    return Promise.resolve();
}

export function getAllToilets(){
    let all_data = []
    let my_longitude = parseFloat(sessionStorage.getItem('longitude'));
    let my_latitude = parseFloat(sessionStorage.getItem('latitude'));

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if(!/^\d+$/.test(key)){
            continue;
        }
        let temp = JSON.parse(localStorage.getItem(key));
        if (!temp.disabled){
            all_data.push(temp)
        }
    }

    for (let i = 0; i < all_data.length; i++) {
        let toilet = all_data[i];
        let toiletReviewList = toilet["reviews"];
        let totalRating = 0;
        let count = 0;
        for (let j = 0; j < toiletReviewList.length; j++) {
            totalRating += parseInt(toiletReviewList[j].rating);
            count+=1;
        }
        let toilet_longitude = parseFloat(toilet.longitude)
        let toilet_latitude = parseFloat(toilet.latitude)
        let distance = parseInt(haversineDistance([my_longitude,my_latitude],[toilet_longitude,toilet_latitude]) * 1000);
        toilet.distance = distance;
        if (count > 0) {
            toilet.average = totalRating / count;
        } else {
            toilet.average = 2;
        }
    }
    return all_data;
}

// input [longitude, latitude]
// return KM
export function haversineDistance(coordinate1, coordinate2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    const longitude1 = coordinate1[0];
    const latitude1 = coordinate1[1];
    const longitude2 = coordinate2[0];
    const latitude2 = coordinate2[1];
    const constant = 6371;

    const x1 = latitude2 - latitude1;
    const x2 = longitude2 - longitude1;
    const radLatitude = toRad(x1);
    const radLongitude = toRad(x2);

    const a = Math.sin(radLatitude / 2) * Math.sin(radLatitude / 2) +
        Math.cos(toRad(latitude1)) * Math.cos(toRad(latitude2)) *
        Math.sin(radLongitude / 2) * Math.sin(radLongitude / 2);
    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return constant * b;
}

export function getBestToilet() {

    let profileString = sessionStorage.getItem("profile");
    let gender = null;
    let accessibility = false;
    let wifi = true;
    let shower = false;
    if (profileString) {
        let profile = JSON.parse(profileString);
        let genderString = profile.gender;
        accessibility = profile.accessibility === "true";
        wifi = profile.wifi;
        shower = profile.shower;
    }

    let toilets = getAllToilets();
    let genderList = [];
    let access_gender_list = [];
    let preference_list = []
    for (let i = 0; i < toilets.length; i++) {
        let toilet = toilets[i];
        if (gender) {
            if (toilet.gender !== gender && toilet.gender !== 'U'){
                continue;
            }
        }
        genderList.push(toilet);
    }
    for (let i = 0; i < genderList.length; i++) {
        let toilet = genderList[i];
        if (accessibility) {
            if (toilet.accessibility){
                access_gender_list.push(toilet);
            }
        }
    }
    for (let i = 0; i < access_gender_list.length; i++) {
        let toilet = genderList[i];
        if (wifi && shower) {
            if(toilet.wifi && toilet.shower){
                preference_list.push(toilet);
            }
        } else if(wifi){
            if(toilet.wifi){
                preference_list.push(toilet);
            }
        } else if (shower) {
            if(toilet.shower){
                preference_list.push(toilet);
            }
        }
    }

    preference_list.sort(function(a,b){
        return a.distance - b.distance;
    })

    genderList.sort(function(a,b){
        return a.distance - b.distance;
    });
    access_gender_list.sort(function(a,b){
        return a.distance - b.distance;
    });

    if (preference_list.length !== 0){
        return preference_list[0].id;
    } else if (access_gender_list.length !== 0) {
        return access_gender_list[0].id;
    } else {
        return genderList[0].id;
    }

}
