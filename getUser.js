function getByEmail (email, callback) {
    request({
        url: 'https://' + configuration.Domain + '/oauth/token',
        method: 'POST',
        form: {
            grant_type: 'client_credentials',
            scope: 'read:users',
            audience: configuration.Audiance,
            client_id: configuration.Client_ID,
            client_secret: configuration.Client_Secret
        },
        headers: {'content-type' : 'application/json'},
        json: true
    }, function(error, response, body){
        if(error) {
            callback(error);
        } else {
            var access_token = body.access_token;

            request({
                url: 'https://'+ configuration.Domain + '/api/v2/users?q=(blocked:false)AND(email:' + email + ')',
                method: 'GET',
                headers: {'content-type' : 'application/json', 'Authorization': 'Bearer ' + access_token}
            }, function(error, response, body) {
                if(error) {
                    callback(error);
                } else {
                    var users = JSON.parse(body);
                    if(users) {
                        callback(null, users[0]);
                    } else {
                        callback('no users found');
                    }
                }
            });
        }
    });
}
