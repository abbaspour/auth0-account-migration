function auth0migrateUser(user, context, callback) {
    if (context.clientID === "{CLIENT_ID}") {
        context.idToken['https://migrationapp/user_metadata'] = user.user_metadata || {};
        context.idToken['https://migrationapp/app_metadata'] = user.app_metadata || {};
      }
    callback(null, user, context);
}