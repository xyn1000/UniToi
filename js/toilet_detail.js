function  GetQueryString(name){
    var  reg =  new  RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var  r = window.location.search.substr(1).match(reg);
    if(r!=null)  return  unescape(r[2]);  return  null;
}
var toilet_id = GetQueryString("id")
toilet_id = parseInt(toilet_id)
// var toilet_id = 5

function delete1(id) {

    if(confirm("Are you sure want to delete this comment?")){
        var all_data = localStorage.getItem(toilet_id);
        all_data = JSON.parse(all_data);
        var reviews = all_data["reviews"];
        reviews.splice(id, 1);
        localStorage.setItem(toilet_id, JSON.stringify(all_data));
        this.Storage.writeData();
    }

}

function showMap(){
    $('.container').hide();
    $('#map-show').show();
    //Begin Map

    let longitude = parseFloat(sessionStorage.getItem('longitude'));
    let latitude = parseFloat(sessionStorage.getItem('latitude'));
    let my_map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longitude},
        zoom: 16,
    });

    let toilet = JSON.parse(localStorage.getItem(toilet_id))
    let toi_latitude = toilet.latitude;
    let toi_longitude = toilet.longitude;

    let toiletLatLng = new google.maps.LatLng(toi_latitude, toi_longitude)

    let toi_marker = new google.maps.Marker({
        position: toiletLatLng,
        zoom: 15,
        map: my_map,
        icon: {
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

    //End Map
}

function goBack(){
    $('#map-show').hide();
    $('.container').show();
}

function serviceRequest() {
    let val = prompt("Please specify your request: ");
    let jsonData = {};
    if (!localStorage.getItem("error")) {
        localStorage.setItem("error", JSON.stringify([]));
    }
    let errorList = JSON.parse(localStorage.getItem("error"));
    jsonData[toilet_id] = val;
    errorList.push(jsonData);
    localStorage.setItem("error", JSON.stringify(errorList));
}
var Storage =
    {
        saveData: function (number)//save data
        {
            var data = document.querySelector("#post textarea");
            if (data.value != "" && number != undefined) {
                var all_data = localStorage.getItem(toilet_id);
                all_data = JSON.parse(all_data);
                var reviews = all_data["reviews"];
                reviews.push({"rating": number + 1, "comment": data.value});
                localStorage.setItem(toilet_id, JSON.stringify(all_data));
                alert("Thank you ❤");
                data.value = "";
                this.writeData();
            } else {
                if (number === undefined || number === null) {
                    alert("Please rate for this toilet ❤");
                } else if (data.value == "") {
                    alert("Please write your comments ❤");
                }
            }
        },

        writeData: function () // empty data
        {
            var data = localStorage.getItem(toilet_id);
            if (data == null) {
                window.location.href = "../error/404.html"
            }
            data = JSON.parse(data)
            var dataHtml = ""
            var reviews = data["reviews"]
            var disable = data["disable"]
            if(disable){
                alert('This toilet is under repair, please find another one');
                window.location.history();
            }
            var star = ""
            for (var i in reviews) {
                var rate = parseInt(reviews[i].rating);
                for (var j = 1; j < 6; j++){

                    if (j < rate + 1){
                        star += "&starf;"
                    }
                    else{
                        star += "&star;"
                    }
                }
                let username = sessionStorage.getItem('Role')
                var comment = reviews[i].comment

                if (username !== null && username === "{Role:ADMIN}"){
                    dataHtml += "<span style=\"font-family: \">" + "</span>" + "<p><span class=\"msg\">" + "Rating: " + star + "</br>" + comment +"</br>"+ "<input style=\"float: left;border:none;border-radius:5px;\" id=\"clearBt\" type=\"button\" onclick=\"delete1(" + i + ");\" value=\"Delete\"/>" + "</span></p>";

                }
                else{
                    dataHtml += "<span style=\"font-family: \">" + "</span>" + "<p><span class=\"msg\">" + "Rating: " + star + "</br>" + comment +"</br>" + "</span></p>";
                }
                star = ""

            }

            document.getElementById("Title").innerHTML = data["title"]
            document.getElementById("Description").innerHTML = data["description"]
            document.getElementById("Photo").src = data["image"]

            var gender = data["gender"]
            if (gender === "M"){
                document.getElementById("gender").src = "../img/male.png"
            }
            if (gender === "F"){
                document.getElementById("gender").src = "../img/female.png"
            }
            if (gender === "U"){
                document.getElementById("gender").src = "../img/unisex.png"
            }

            var accessible = data["accessibility"]
            var shower = data["shower"]
            var wifi = data["wifi"]
            if (accessible) {
                document.getElementById("accessible").src = "../img/accessible.jpg"
            } else {
                document.getElementById("accessible").src = null
            }
            if (shower) {
                document.getElementById("shower").src = "../img/shower.png"
            } else {
                document.getElementById("shower").src = null
            }
            if (wifi) {
                document.getElementById("wifi").src = "../img/wifi.jpg"
            } else {
                document.getElementById("wifi").src = null
            }
            document.getElementById("comment").innerHTML = dataHtml
        },

    }
window.onload = function () {
    $('#map-show').hide();
    var box = document.getElementById("box");
    var allStars = box.getElementsByTagName("a");
    var iRe = box.getElementsByClassName("recom")[0];
    var iText = box.getElementsByClassName("text")[0];
    var arrText = ["Not Good", "Dissatisfied", "Not Bad", "Satisfied", "Very Good"];
    var num = null;
    var onOff = true;

    function empty() {
        for (var i = 0; i < allStars.length; i++) {
            allStars[i].className = "bg";
        }
    }


    function changeBg(n) {

        empty();

        if (n > 1) {
            for (var i = 0; i <= n; i++) {
                allStars[i].className = "bg2";
            }
        } else {
            for (var i = 0; i <= n; i++) {
                allStars[i].className = "bg1";
            }
        }

        iRe.style.display = "block";
        iRe.innerHTML = arrText[n];
        iText.style.display = "none";

    }

    for (var i = 0; i < allStars.length; i++) {
        allStars[i].index = i;

        allStars[i].onmouseover = function () {
            changeBg(this.index);
        }

        allStars[i].onmouseout = function () {

            if (onOff) {
                empty();
                iRe.style.display = "none";
                iText.style.display = "block";
            } else {
                changeBg(num);
            }
        }

        allStars[i].onclick = function () {
            onOff = false;
            num = this.index;
        }
    }

    Storage.writeData();
    document.getElementById("postBt").onclick = function () {
        Storage.saveData(num);
    }

}
