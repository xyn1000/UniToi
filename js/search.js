let toilets;

window.showList = []

const urlParams = new URLSearchParams(window.location.search);
window.myParam = urlParams.get('keyword').trim();

function search(keyword){
    let searchResult = [];
    var searchTerm = new RegExp(keyword,'i');
    for (let i=0;i<this.toilets.length;i++){
        if (searchTerm.test(this.toilets[i].title)){
            searchResult.push(this.toilets[i]);
        }
    }
    window.showList = searchResult;
}

function searchBtn(){
    window.myParam = document.getElementById("search_box").value;
    if (window.myParam.trim() !== ""){
        search(window.myParam)
        showSearchResults();
    } else {
        alert("Search Keywords cannot be null!");
    }
}

function clearPreviousSearch(){
    document.getElementsByClassName("item-stretch")[0].innerHTML="<h1>Search Result</h1>";
}

function showSearchResults(){
    clearPreviousSearch();
    for (let i=0; i<window.showList.length; i++){
        let plane = document.getElementsByClassName("item-stretch")[0];
        let newToilet = document.createElement('div');
        newToilet.className = "toilet-details";
        let left = document.createElement('div');
        left.className = "card-left";
        let padding = document.createElement('div');
        padding.className="padding";
        let middle = document.createElement('div');
        middle.className="card-mid";
        let title = document.createElement('div');
        title.className = "toilet-title";
        let gender = document.createElement('div');
        gender.className="gender";
        let facility = document.createElement('div');
        facility.className="facilities";
        let right = document.createElement('div');
        right.className="card-right";
        let rating = document.createElement('div');
        rating.className="toilet-rating";
        let ratingImg = document.createElement('div');
        ratingImg.className="rating-img";
        let button = document.createElement('div');
        button.className="detail-button";

        plane.appendChild(newToilet);
        newToilet.appendChild(left);
        newToilet.appendChild(padding);
        newToilet.appendChild(middle);
        middle.appendChild(title);
        middle.appendChild(gender);
        middle.appendChild(facility);
        newToilet.appendChild(right);
        right.appendChild(rating);
        let ratingHeader = document.createElement("h2");
        ratingHeader.innerHTML="Rating:";
        rating.appendChild(ratingHeader);
        rating.appendChild(ratingImg);
        right.appendChild(button);

        let toiletImg = document.createElement("img");
        toiletImg.src=window.showList[i].image;
        toiletImg.alt=window.showList[i].title;
        left.appendChild(toiletImg);

        let name = document.createElement("label");
        name.className="toilet-names";
        name.innerHTML=window.showList[i].title;
        title.appendChild(name);

        let genderLabel = document.createElement("label");
        genderLabel.className="toilet-gender";
        let gender_str = window.showList[i].gender;
        if (gender_str==="U"){
            genderLabel.innerHTML="Unisex";
        }else if(gender_str==="F"){
            genderLabel.innerHTML="Female";
        }else{
            genderLabel.innerHTML="Male";
        }

        gender.appendChild(genderLabel);
        let distance = document.createElement("label");
        distance.className="toilet-distance";
        distance.innerHTML=window.showList[i].distance+"m";
        gender.appendChild(distance);


        if (window.showList[i].accessibility){
            let accessImg = document.createElement("img");
            accessImg.src="../img/icon/access.png";
            toiletImg.alt="Accessibility";
            facility.appendChild(accessImg);
        }

        if (window.showList[i].wifi){
            let wifiImg = document.createElement("img");
            wifiImg.src="../img/icon/wifi.png";
            wifiImg.alt="Wi-Fi";
            facility.appendChild(wifiImg);
        }

        if (window.showList[i].shower){
            let showerImg = document.createElement("img");
            showerImg.src="../img/icon/shower.png";
            showerImg.alt="Shower";
            facility.appendChild(showerImg);
        }


        for (let j=0;j<window.showList[i].average;j++){
            let starImg = document.createElement("img");
            starImg.src="../img/icon/star.png";
            starImg.alt="Star";
            ratingImg.appendChild(starImg);
        }

        let btn = document.createElement("button");
        btn.className="toilet-details-button";
        let tempId = window.showList[i].id
        btn.onclick = function () {
            window.location.href="../html/male_toilet1.html?id="+tempId;
        }
        btn.type="button";
        btn.innerHTML="Check Out";
        button.appendChild(btn);
    }
}

function getFilterValue(){
    let obj = document.getElementsByName("filter");
    let checkArr = [];
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].checked)
            checkArr.push(obj[i].value);
    }
    return checkArr;
}

window.onload=function(){
    showDistance();
    this.toilets = getAllToilets();
    search(window.myParam);
    showSearchResults();
    let wifiTag = document.getElementById('wiFi');
    let showerTag = document.getElementById('shower');
    let distanceTag = document.getElementById('distance');

    wifiTag.addEventListener('change', filterResult);
    showerTag.addEventListener('change', filterResult);
    distanceTag.addEventListener('change',filterResult);
}


function filterResult(){
    let wifiTag = document.getElementById('wiFi');
    let showerTag = document.getElementById('shower');
    let distanceTag = document.getElementById('distance');
    let toilets = getAllToilets();
    let isWifi = wifiTag.checked;
    let isShower = showerTag.checked;
    let wifiList = []
    let showerList = []
    let distanceList = []

    if (isWifi) {
        for (let i = 0; i < toilets.length; i++) {
            if (toilets[i].wifi){
                wifiList.push(toilets[i]);
            }
        }
    } else {
        wifiList = toilets;
    }

    if (isShower) {
        for (let i = 0; i < toilets.length; i++) {
            if (toilets[i].shower){
                showerList.push(toilets[i]);
            }
        }
    } else {
        showerList = toilets;
    }

    if (distanceTag.value === "501"){
        distanceList = toilets;
    } else {
        for (let i = 0; i < toilets.length; i++) {
            let distance =  parseInt(toilets[i].distance);
            if (distance <= distanceTag.value) {
                distanceList.push(toilets[i]);
            }
        }
    }
    const temp = wifiList.filter(value => showerList.includes(value));
    const filteredArray = temp.filter(value => distanceList.includes(value));
    window.showList = filteredArray;
    showSearchResults();
}

function showDistance() {
    if (parseInt(document.getElementById("distance").value)===501){
        document.getElementById("demo").innerHTML = ">500";
    }else{
        document.getElementById("demo").innerHTML = document.getElementById("distance").value;
    }
}

function getAllToilets(){
    let all_data = []
    let my_longitude = parseFloat(sessionStorage.getItem('longitude'));
    let my_latitude = parseFloat(sessionStorage.getItem('latitude'));
    let profileString = sessionStorage.getItem("profile")
    if (!profileString){
        profileString = "{\"gender\":\"Male\", \"accessibility\":false, \"wifi\":true, \"shower\":true}";
    }

    let profile = JSON.parse(profileString);
    let isAccess = profile.accessibility !== 'false';
    let gender = profile.gender;


    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if(!/^\d+$/.test(key)){
            continue;
        }
        let temp = JSON.parse(localStorage.getItem(key));
        if(isAccess) {
            if (temp.accessibility !== isAccess){
                continue;
            }
        }

        if (temp.gender !== gender && temp.gender !== "U"){
            continue;
        }

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

function showerListener(){
    let tempList = [...window.showList];

}

function maleListenr(){
    let tempList = [...window.showList];

}

function femaleListener(){
    let tempList = [...window.showList];

}

function unisexListener(){
    let tempList = [...window.showList];

}

function distanceListener(){
    let tempList = [...window.showList];

}

function accessibilityListener() {
    let tempList = [...window.showList];

}
