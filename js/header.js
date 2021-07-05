function openLayer() {
    $('.site-nav-overlay').toggleClass("site-nav-show");
}

function logOut() {
    if (confirm("Are you sure to log out?")) {
        sessionStorage.removeItem('Role');
        window.location.href="../html/login.html";
    }
}

function goSearch(){
    let searchString = $('#search').val().trim();
    if (searchString.length === 0) {
        alert("Search box should not be blank!");
    } else {
        window.location.href = '../html/search_result.html?keyword='+searchString;
    }
}
