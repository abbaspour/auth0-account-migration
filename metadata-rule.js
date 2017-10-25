function (user, context, callback) {
    context.idToken['https://migrationapp/user_metadata'] = user.user_metadata;
    context.idToken['https://migrationapp/app_metadata'] = user.app_metadata;
    callback(null, user, context);
}