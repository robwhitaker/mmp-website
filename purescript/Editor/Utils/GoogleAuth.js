"use strict";

(function() {
    var loaderScript = document.createElement("script");
    loaderScript.id = "loader-script";
    loaderScript.src = "https://apis.google.com/js/platform.js?onload=gapiloaded";
    loaderScript.async = true;
    loaderScript.defer = true;
    document.head.appendChild(loaderScript);
})();

exports.awaitGapi = function(success, error) {
    var check = function() { 
        var script = document.getElementById("loader-script");
        if(typeof gapi !== "undefined" && !!script && script.getAttribute("gapi_processed") === "true")
            success(gapi);
        else
            window.requestAnimationFrame(check);
    }
    check();
}

exports.load = function(service) {
    return function(success, error) {
        if(typeof gapi === "undefined") {
            error("GAPI not loaded.");
            return;
        }
        gapi.load(service, function() { 
            success();
        });
    }
}

exports.initAuth2 = function(clientId) {
    return function(success,error) {
        if(typeof gapi === "undefined") {
            error("GAPI not loaded.");
            return;
        }
        if(!gapi.auth2) {
            error("auth2 undefined. Has it been loaded?");
            return;
        }
        try {
            gapi.auth2.init({ clientId: clientId });
        } catch(e) {
            error("Unable to init auth2.");
        }
        success();
    }
}


exports._googleLogin = function(clientId, scope, responseType) {
    return function(success,error) {
        gapi.auth2.authorize(
            { clientId: clientId
            , scope: scope
            , response_type: responseType
            }, function(response) {
                if (response.error) {
                    error(response.error);
                    return;
                }
                success(
                    { accessToken: response.access_token
                    , idToken: response.id_token
                    }
                );
            });
        };
}

exports.initPicker = function(accessToken) {
    return function(success,error) {
        var picker = new google.picker.PickerBuilder().
                        addView(google.picker.ViewId.DOCS).
                        setOAuthToken(accessToken).
                        setDeveloperKey("AIzaSyBbo919OET_4fZ7XL14prcl1mhy0lthjKI").
                        build();
        success(picker);
    }
}

exports._showPicker = function(picker) {
    return function(success,error) {
        picker.setCallback(function(result) {
            if(result.action === "cancel") {
                success(null);
            } else if(result.action === "picked") {
                if(result.docs[0].mimeType === "application/vnd.google-apps.document") {
                    success(result.docs[0].id);
                } else {
                    error("User picked bad file.");
                } 
            } 
        });
        picker.setVisible(true);
    }
}

