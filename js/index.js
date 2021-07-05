let toilets

window.onload = function (){
    initData(getBestToilet());
}


function initData(num){

    let longitude = parseFloat(sessionStorage.getItem('longitude'));
    let latitude = parseFloat(sessionStorage.getItem('latitude'));
    let my_map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longitude},
        zoom: 16,
    });


    toilets = getAllToilets();
    $('#picWallList').empty();
    let best_toilet;
    for (let i = 0; i < toilets.length; i++) {
        if(toilets[i].id == num){
            best_toilet = toilets[i];
            break;
        }
    }
    let toi_longitude = parseFloat(best_toilet.longitude);
    let toi_latitude = parseFloat(best_toilet.latitude);

    let toiletLatLng = new google.maps.LatLng(toi_latitude, toi_longitude)

    let toi_marker = new google.maps.Marker({
        position: toiletLatLng,
        map: my_map,
        icon: {
            zoom: 15,
            url: '../img/icon/gendericon.png',
            size: new google.maps.Size(40, 40),
        }
    })
    toi_marker.setMap(my_map);

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(my_map);
    directionsService.route({
            origin: {
                query: latitude+","+longitude,
            },
            destination: {
                query: toi_latitude+","+toi_longitude,
            },
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );

    let distanceStr = best_toilet.distance+"m";
    for (let i = 0; i < toilets.length; i++) {
        let preurl = "../html/male_toilet1.html?id="
        let toilet = toilets[i];
        let listTemp = $('<li/>');
        let atemp = $('<a/>',{
            href:preurl+toilet.id
        })
        let imageTemp = $('<img/>',{
            src: toilet.image
        })
        atemp.append(imageTemp)
        listTemp.append(atemp);
        $('#picWallList').append(listTemp);
    }

    $('.toi-rec').empty();
    let imageHtml = "";
    let starHtml = "";
    if (best_toilet.accessibility){
        imageHtml += "<img alt=\"accessibility\" width=\"60px\" src=\"../img/icon/access.png\">"
    }
    if (best_toilet.wifi){
        imageHtml += "<img alt=\"wifi\" width=\"60px\" src=\"../img/icon/wifi.png\">"
    }
    if(best_toilet.shower){
        imageHtml += "<img alt=\"shower\" width=\"60px\" src=\"../img/icon/shower.png\">"
    }
    let rating = Math.ceil(parseFloat(best_toilet.average))
    for (let i = 0; i < rating; i++) {
        starHtml += "<img alt=\"star\" width=\"48px\" src=\"../img/icon/star.png\">"
    }
    for (let i = 0; i < 5-rating; i++) {
        starHtml += "<img alt=\"star\" width=\"48px\" src=\"../img/icon/nostar.png\">"
    }


    $('.toi-rec').html("<div class=\"learn-more\">Learn More</div>\n" +
        "            <h1 class=\"elementHeader\">Our Recommendation</h1>\n" +
        "            <div class=\"top-rec\">\n" +
        "                <div class=\"toi-title\">\n" +
        "                    <h2>"+best_toilet.title+"</h2>\n" +
        "                    <h2>Distance: <span id=\"rec-distance\">"+distanceStr+"</span></h2>\n" +
        "                </div>\n" +
        "                <div class=\"toi-facility\">\n" + imageHtml +
        "                </div>\n" +
        "            </div>\n" +
        "            <hr>\n" +
        "            <div class=\"toi-rating\">\n" + starHtml +
        "            </div>");
    $('.toi-rec').click(()=>{
        window.location.href = "../html/male_toilet1.html?id="+best_toilet.id;
    });
}

function getAllToilets(){
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
function haversineDistance(coordinate1, coordinate2) {
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

function getBestToilet() {

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
