Introduction
============

This is a solution to facilitate migration from one [Auth0](www.auth0.com) account into another.


How Does it Work?
=================

It follows the same traditional model that Auth0 uses for migration from other identity providers. 

![Password Migration](https://cdn.auth0.com/content/email-wall/use-cases/database-migration/database-migration-logic.png)

 
[login.js](login.js) is used to create a custom database pointing to old account. 
It uses standard OpenID Connect `/token` interface to authenticate and receive `id_token` for customer profile in return.  
After authentication, users are also created in new account's database.


Installation
============

Migration Client Application
----------------------------
TBA step by step guide to setup a migration application in old account. with requires scopes only.
 
Custom Database
---------------

1. Go to your new account *Connections >> Database >> Username-Password-Authentication* section 
2. Go to *Custom Database* tab and enable it
3. Under *Login* section, past the code from [login.js](login.js) (see Configuration section below)
4. Go back to *Settings* tab and enable *Import Users to Auth0* 
 
Configuration
-------------
To configure [login.js](login.js), you need to have access to old account's dashboard and collect below details and
 below items to custom database *Setting* section

| Key | Sample Value | Description |
|-----|-------|-------------|
|Domain|myolddomain.auth0.com|domain of old account|
|Audiance|https://myolddomain.auth0.com/api/v2/|API audiance of old account|
|Client_ID|XXXXXX|client ID of migration application in old account|
|Client_Secret|YYYYY|client secret of migration application in old account|

Bulk Import/Export
==================
1. Install Import/Export extension on both old and new accounts. 
2. Export all accounts from old account into default JSON file
3. Import JSON file from step 2 into new account using the extension
 

Forgotten Password
==================
Users migrated with bulk import/export step won't have password in new account. 
They will have to use *Don't remember your password?* link on login page in order to reset their passwords.


Todo
====

1. No consent page
2. host sample app in heroku
3. steps to create a migration client in old account (management API, scope, scopes, etc)
4. Q: add hook to disable user in old-account?
5. add step to validate JWT on login? 
6. Q: turn the code into an extension?
  