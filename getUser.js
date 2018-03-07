function getByEmail (email, callback) {
    // to use Auth0 search API, first we need a management API `access_token`
    var moment = require('moment');

    if (!global.accessToken || !global.lastLogin || moment(new Date()).diff(global.lastLogin, 'minutes') > 30) {
        getAuth0AccessToken(email, callback);
    } else {
        getAuth0User(email, global.accessToken, callback);
    }

    function getAuth0AccessToken (email, cb) {
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
                return cb(error);
            } else if (body.access_token) {
                // now we have `access_token` and call invoke users `search` api
                global.accessToken = body.access_token;
                getAuth0User (email, body.access_token, cb);
            } else {
                cb();
            }
        });    
    }

    function getAuth0User (email, accessToken, cb) {
        request({
            url: 'https://'+ configuration.Domain + '/api/v2/users',
            qs: {
                //q: '(email:"' + email + '")AND(blocked:false)'
                q: 'email:"' + email + '" AND identities.connection:"' + configuration.Connection + '"' // query with email, using `qs` to take care of URL encoding
            },
            method: 'GET',
            headers: {'content-type' : 'application/json', 'Authorization': 'Bearer ' + accessToken}
        }, function(error, response, body) {
            if(error) {
                return cb(error);
            } else {
                var users = JSON.parse(body);
                console.log(users);
                // If what we get is an empty array, we know that we did not find the user in which case nothing happens
                // otherwise we return first element of array. hopefully with email search there is only one entry
                if(Array.isArray(users) && users.length > 0) {
                    return cb(null, users[0]);
                } else {
                    return cb();
                }
            }
        });
    }
}

