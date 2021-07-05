function Register(){

    var email = document.getElementById("email");
    var passWord = document.getElementById("pwd");
    var confirmPwd = document.getElementById("confirmPwd");
    var error = document.getElementById("error");
    error.innerText = "";
    let emailFlag = emailValidate(email.value);
    let passwordFlag = passwordValidate(passWord.value)

    if (email.value === "" && passWord.value === "" && confirmPwd.value ===""){
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
        error.innerText = "A valid password should include at least eight characters combining letters and figures without special punctuations!";
        error.style.visibility = 'visible';
        return;
    }

    if (confirmPwd.value!==passWord.value||confirmPwd.value===""){
        error.innerText = "Please confirm your password!";
        error.style.visibility = 'visible';
        return;
    }

    for (let j = 0; j < localStorage.length; j++) {
        let key = localStorage.key(j);
        if (key === email.value){
            alert("This email has been registered!");
            return;
        }
    }

    if (emailFlag && passwordFlag && confirmPwd.value===passWord.value) {
        error.style.visibility = 'hidden';
        let hash = CryptoJS.MD5(passWord.value).toString();
        localStorage.setItem(email.value,hash);
        window.location.href = "../html/login.html";
    }
}

function emailValidate(email){
    let regex = new RegExp("^[\\w-\.]+@([\\w-]+\.)+[\\w-]{2,4}$");
    return regex.test(email);
}

function passwordValidate(pwd){
    let regex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    return regex.test(pwd);
}

window.onload = () =>{
    let error = document.getElementById("error");
    error.style.visibility = 'hidden';
}
