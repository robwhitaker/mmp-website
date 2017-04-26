"use strict";

exports.googleLogin = function(scope, responseType) {
    return function(success,error) {
        gapi.auth2.authorize(
            { scope: scope
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