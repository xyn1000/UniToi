function logIn(){

    var email = document.getElementById("email");
    var passWord = document.getElementById("pwd");
    var error = document.getElementById("error");
    var passwordHash = CryptoJS.MD5(passWord.value).toString();
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
        error.innerText = "Email or password does not match.";
        error.style.visibility = 'visible';
        return;
    }
    if (email.value === "admin_demo@uni.sydney.edu.au" && passwordHash === localStorage.getItem("admin_demo@uni.sydney.edu.au")) {
        sessionStorage.setItem("profile","{\"gender\":\"Male\", \"accessibility\":false, \"wifi\":true, \"shower\":true}");
        sessionStorage.setItem("Role","{Role:ADMIN}");
        sessionStorage.setItem("latitude","-33.885643");
        sessionStorage.setItem("longitude","151.187424");
        window.location.href="../html/admin.html";
    } else {
        error.innerText = "Email or password does not match.";
        email.value = "";
        passWord.value = "";
        error.style.visibility = 'visible';
    }

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
    alert("Admin email: admin_demo@uni.sydney.edu.au \n\n"+"Admin password: Admin12345\n\n"+
        "For security concern, we do not provide admin registration function. \n\n" +
        "This default admin account is for peer-reviewing demonstration only.");

    let error = document.getElementById("error");
    error.style.visibility = 'hidden';
}
