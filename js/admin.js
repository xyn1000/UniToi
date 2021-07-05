function changePwd(){
    let oldPwd = $('#oldPwd').val();
    let newPwd = $('#pwd').val();
    let confirmPwd = $('#confirmPwd').val();

    if (newPwd !== confirmPwd) {
        alert("Please confirm your password!");
        passwordClear();
    } else if (!passwordValidate(newPwd)) {
        alert("A valid password should include at least eight characters combining letters and figures without special punctuations!");
        passwordClear();
    } else if (CryptoJS.MD5(oldPwd).toString() !== localStorage.getItem("admin_demo@uni.sydney.edu.au")){
        alert("Your old password is not correct!");
        passwordClear();
    } else {
        localStorage.setItem("admin_demo@uni.sydney.edu.au",CryptoJS.MD5(newPwd).toString())
        alert("Success!");
        sessionStorage.removeItem("Role");
        window.location.href = "../html/admin_login.html";
    }
}

function passwordClear(){
    $('#oldPwd').val("");
    $('#pwd').val("");
    $('#confirmPwd').val("");
}

function passwordValidate(pwd){
    let regex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    return regex.test(pwd);
}

function enableBtn(num) {
    if(confirm("Are you sure to enable this toilet?")){
        let toilet = JSON.parse(localStorage.getItem(num+""));
        toilet["disabled"] = false;
        localStorage.setItem(num+"",JSON.stringify(toilet));
        initData();
    }
}

function disableBtn(num) {
    if(confirm("Are you sure to disable this toilet?")){
        let toilet = JSON.parse(localStorage.getItem(num+""));
        toilet["disabled"] = true;
        localStorage.setItem(num+"",JSON.stringify(toilet));
        initData();
    }
}

function handleRequest(num){
    if(confirm("Are you sure this request is handled?")){
        let errList = JSON.parse(localStorage.getItem("error"));
        errList.splice(num,1);
        localStorage.setItem("error",JSON.stringify(errList));
        initData();
    }
}

$('document').ready(function(){
    $('.admin_toilet').hide();
    $('.admin_credential').hide();
    $('.service-request').hide();
    initData();
});

$('#password-tag').click(function(){
    $('.admin-default').hide();
    $('.admin_toilet').hide();
    $('.admin_credential').show();
    $('.service-request').hide();
})

$('#service-tag').click(function(){
    $('.admin-default').hide();
    $('.admin_toilet').hide();
    $('.admin_credential').hide();
    $('.service-request').show();
})

$('#toiManage-tag').click(function(){
    $('.admin-default').hide();
    $('.admin_toilet').show();
    $('.admin_credential').hide();
    $('.service-request').hide();
})


function initData(){
    $('#admin_toilet_table').empty();
    $('#service-request-table').empty();

    let toilets = getAllToilets();
    for (let i = 0; i < toilets.length; i++) {
        let toilet = toilets[i];

        if (toilet.disabled){
            $('#admin_toilet_table').append("<tr>\n" +
                "            <td>"+toilet.id+"</td>\n" +
                "            <td>"+toilet.title+"</td>\n" +
                "            <td>"+toilet.description.substring(0,100)+"..."+"</td>\n" +
                "<td><button type=\"button\" class=\"enable\" onclick=\"enableBtn("+toilet.id+")\" >Enable</button></td>" +
                "          </tr>")
        } else {
            $('#admin_toilet_table').append("<tr>\n" +
                "            <td>"+toilet.id+"</td>\n" +
                "            <td>"+toilet.title+"</td>\n" +
                "            <td>"+toilet.description.substring(0,100)+"..."+"</td>\n" +
                "<td><button type=\"button\" class=\"disable\" onclick=\"disableBtn("+toilet.id+")\">Disable</button></td>" +
                "          </tr>")
        }
    }
    let errorStr = localStorage.getItem("error");
    if(errorStr) {
        let errorList = JSON.parse(errorStr);
        for (let i = 0; i < errorList.length; i++) {
            $.each(errorList[i], function(k, v) {
                let toiletID = k;
                let toilet = JSON.parse(localStorage.getItem(toiletID));
                let toiletName = toilet.title;
                $('#service-request-table').append("<tr>\n" +
                    "            <td>"+(i+1)+"</td>\n" +
                    "            <td>"+toiletName+"</td>\n" +
                    "            <td>"+v+"</td>\n" +
                    "            <td><button type=\"button\" onclick=\"handleRequest("+i+")\" class=\"enable\">Handle</button></td>\n" +
                    "          </tr>")
            });
        }
    }
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
        all_data.push(JSON.parse(localStorage.getItem(key)))
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
