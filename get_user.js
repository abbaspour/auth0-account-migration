function getByEmail (email, callback) {
    // to use Auth0 search API, first we need a management API `access_token`
    var tools = require('auth0-extension-tools@1.3.1');
    tools.managementApi.getClient({domain: configuration.Domain, clientId: configuration.Client_ID, clientSecret: configuration.Client_Secret})
    .then(function(client) {
      var params = {
        q: 'email:"' + email + '" AND identities.connection:"' + configuration.Connection
      };
      client.users.getAll(params, function (err, users){
        if (err) return callback(err);
        else if(Array.isArray(users) && users.length > 0) {
            var profile = {};
            var openidProfile = users[0];
            profile.name = openidProfile.name || '';
            profile.nickname = openidProfile.nickname || '';
            profile.email = openidProfile.email;
            profile.email_verified = openidProfile.email_verified || false;
            profile.user_id = openidProfile.user_id.replace('auth0|' , ");
            profile.user_metadata = openidProfile.user_metadata || {};
            profile.app_metadata = openidProfile.app_metadata || {};
            return callback(null, profile);
        } else {
            return callback();
        }
      });
    });
}
