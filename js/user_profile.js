function submitProfile(){
    let disabled = $("input[type='radio'][name='dis']:checked");

    let gender = $("input[type='radio'][name='sex']:checked");

    let wifi = $("input[type='checkbox'][name='wifi']:checked");

    let shower = $("input[type='checkbox'][name='shower']:checked");

    if (!disabled.length > 0 || !gender.length > 0) {
        alert("Please finish the form before submit.");
        return;
    }

    if ($('#agree').prop( "checked" )){

    } else {
        alert("Please agree with our privacy policy before submit.");
        return;
    }

    let jsonObject = {};
    jsonObject.wifi = wifi.length > 0;
    jsonObject.shower = shower.length > 0;
    jsonObject.gender = gender.val();
    jsonObject.accessibility = disabled.val();


    sessionStorage.setItem("profile",JSON.stringify(jsonObject));
    window.location.href = "../html/index.html";


}

window.onload=function(){
    let profileString = sessionStorage.getItem("profile")
    if (profileString){
        let profile = JSON.parse(profileString);
        let profile_gender = profile.gender;
        let profile_accessibility = profile.accessibility;
        let profile_shower = profile.shower;
        let profile_wifi = profile.wifi;

        if(profile_gender === "M"){
            $('#m').prop( "checked", true );
        } else if (profile_gender === "F"){
            $('#fm').prop( "checked", true );
        } else if (profile_gender === "U"){
            $('#sex').prop( "checked", true );
        }

        if (profile_accessibility === "true"){
            $('#dis').prop( "checked", true );
        } else {
            $('#un').prop( "checked", true );
        }

        if (profile_shower) {
            $('#shower-box').prop( "checked", true );
        }

        if(profile_wifi) {
            $('#wifi-box').prop( "checked", true );
        }
    }
}
