function auth0migrateUser(user, context, callback) {
    if (context.clientID === "{CLIENT_ID}") {
        context.idToken['https://migrationapp/user_metadata'] = user.user_metadata || {};
        context.idToken['https://migrationapp/app_metadata'] = user.app_metadata || {};
        user.app_metadata = user.app_metadata || {};
        user.app_metadata.migration_complete = true;
        auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
          .then(function(){
          callback(null, user, context);
         })
         .catch(function(err){
          callback(err);
         });
       }
     callback(null, user, context);
}
