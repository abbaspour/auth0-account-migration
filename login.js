function login (username, password, callback){
    request({
        url: 'https://' + configuration.Domain + '/oauth/token',
        method: 'POST',
        json: {
            grant_type: 'password',
            scope: 'openid', // todo: add name to scope
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
                var profile = jwt.decode(body.id_token); // jwt_decode

                profile.user_id = profile.sub.replace(/^auth0/,configuration.Domain);
                profile.user_metadata = profile['https://migrationapp/user_metadata'] || {};
                profile.app_metadata = profile['https://migrationapp/app_metadata'] || {};

                callback(null, profile);
            }
        }
    });
}

