function login (username, password, callback){
    request({
        url: 'https://' + configuration.Domain + '/oauth/token',
        method: 'POST',
        json: {
            grant_type: "http://auth0.com/oauth/grant-type/password-realm",
            realm : configuration.Connection,
            scope: 'openid profile email', // todo: add name to scope
            client_id: configuration.Client_ID,
            client_secret: configuration.Client_Secret,
            username: username,
            password: password
        },
        headers: {'content-type' : 'application/json'}
    }, function(error, response, body){
        if(error) {
            callback(error);
        } else {
            if(response.statusCode !== 200){
                callback();
            } else {
                var profile = {};
                var openidProfile = jwt.decode(body.id_token); // jwt_decode
                profile.name = openidProfile.name || '';
                profile.nickname = openidProfile.nickname || '';
                profile.email = openidProfile.email;
                profile.email_verified = openidProfile.email_verified || false;
                profile.user_id = openidProfile.sub.replace(/^auth0/,configuration.Domain);
                profile.user_metadata = openidProfile['https://migrationapp/user_metadata'] || {};
                profile.app_metadata = openidProfile['https://migrationapp/app_metadata'] || {};

                callback(null, profile);
            }
        }
    });
}


