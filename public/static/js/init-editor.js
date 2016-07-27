(function() {
    var key = (document.cookie.match(/MMP_LOGIN_KEY=(.*)/) || [])[1];

    if(key == null) {
        var newKey = setCookie("MMP_LOGIN_KEY", prompt("Welcome to the secret page!"), 10000);
        if(newKey == "" || newKey == null) return;
        else key = newKey;
    }

    var Editor = Elm.fullscreen(Elm.Editor.Editor,
        {
            secretKey : key
        }
    );

    Editor.ports.contextChange.subscribe(function() {
        document.getElementById("scroll-container").scrollTop = 0;;
    });
})();

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    return cvalue;
}

function resetCookie() {
    setCookie("MMP_LOGIN_KEY", prompt("Ya dun goofed!"), 10000);
    window.location.reload();
}
