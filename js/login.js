function logIn(){
    var email = document.getElementById("email");
    var passWord = document.getElementById("pwd");
    var error = document.getElementById("error");
    error.innerText = "";
    let emailFlag = emailValidate(email.value);
    let passwordFlag = passwordValidate(passWord.value)

    if (email.value === "" && passWord.value === ""){
        error.innerText = "Please enter user information!";
        error.style.visibility = 'visible';
        return;
    }

    if (!emailFlag) {
        error.innerText = "Please enter a valid email address!";
        error.style.visibility = 'visible';
        return;
    }

    if (!passwordFlag) {
        error.innerText = "Please enter correct password!";
        error.style.visibility = 'visible';
    }

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key === email.value && key !== "admin_demo@uni.sydney.edu.au"){
            if (localStorage.getItem(key) === CryptoJS.MD5(passWord.value).toString()){
                sessionStorage.setItem("Role","{Role:USER}");
                let userLocation = prompt("Please specify your current location on campus: (for example 'PNR')\n Note: if the provided location is not valid,\n the current locaiton will be set to default location)");
                let request = {
                    query: 'USYD '+userLocation.trim(),
                    fields: ['name', 'geometry'],
                };
                let service = new google.maps.places.PlacesService(document.createElement('div'));
                service.findPlaceFromQuery(request, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        sessionStorage.setItem("latitude",results[0].geometry.location.lat());
                        sessionStorage.setItem("longitude",results[0].geometry.location.lng());
                    }
                    window.location.href="../html/Userprofile.html";
                });
                return;
            }
        }
    }
    error.innerText = "Email or password do not match.";
    error.style.visibility = 'visible';
}

function emailValidate(email){
    let regex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
    return regex.test(email);
}

function passwordValidate(pwd){
    let regex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    return regex.test(pwd);
}


window.onload = () =>{
    let error = document.getElementById("error");
    error.style.visibility = 'hidden';
    let session = sessionStorage.getItem('Role');
    if (!session) {
        initialize();
    }
}

function initialize() {
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
}
