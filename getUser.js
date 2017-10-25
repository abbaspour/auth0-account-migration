function getByEmail (email, callback) {
    // to use Auth0 search API, first we need a management API `access_token`
    request({
        url: 'https://' + configuration.Domain + '/oauth/token',
        method: 'POST',
        json: {
            grant_type: 'client_credentials',
            scope: 'read:users',
            audience: configuration.Audience,
            client_id: configuration.Client_ID,
            client_secret: configuration.Client_Secret
        },
        headers: {'content-type' : 'application/json'}
    }, function(error, response, body){
        if(error) {
            callback(error);
        } else if (body.access_token) {
            // now we have `access_token` and call invoke users `search` api
            request({
                url: 'https://'+ configuration.Domain + '/api/v2/users',
                qs: {
                    //q: '(email:"' + email + '")AND(blocked:false)'
                    q: 'email:"' + email + '"' // query with email, using `qs` to take care of URL encoding
                },
                method: 'GET',
                headers: {'content-type' : 'application/json', 'Authorization': 'Bearer ' + body.access_token}
            }, function(error, response, body) {
                if(error) {
                    callback(error);
                } else {
                    var users = JSON.parse(body);
                    // If what we get is an empty array, we know that we did not find the user in which case nothing happens
                    // otherwise we return first element of array. hopefully with email search there is only one entry
                    if(Array.isArray(users) && users.length > 0) {
                        callback(null, users[0]);
                    } else {
                        callback();
                    }
                }
            });
        } else {
            callback();
        }
    });
}
