Table of Contents
=================

- [Introduction](#introduction)
    - [How Does it Work?](#how-does-it-work)
    - [Terminology](#terminology)
- [Setup](#setup)
    - [Old Account](#old-account)
    - [New Account](#new-account) 
- [Bulk Import/Export](#bulk-importexport)

Setup
=====

There are times when a company is using [Auth0](www.auth0.com) 
for a while and they decide they need to move their tenant to a different region, or a private instance or public from private.
Due to the sensitive nature of passwords, [Auth0](www.auth0.com) does not support export and import of passwords. To help 
facilitate this, here is an example for setting up a migration from one tenant to another in a different region.


How Does it Work?
-----------------

It follows the same traditional model that Auth0 uses for migrating from other identity providers such as [Parse](https://auth0.com/blog/migrating-your-parse-users-to-auth0/). 

<kbd>![Password Migration](https://cdn.auth0.com/content/email-wall/use-cases/database-migration/database-migration-logic.png)</kbd>

 
[login.js](login.js) is used to create a custom database pointing to old account. 
It uses standard OpenID Connect `/token` interface to authenticate and receive `id_token` for customer profile. After 
authentication, users are also created in new account's database.

Terminology
-----------

One last thing before we get started to simplify our terminology:
- **old account** : the account you are migrating *from*. This is **amin02** in the screenshots.
- **new account**: the account you are migrating *to*. This is **amin01** in the screenshots.
   
These accounts could be sitting in different locations (US, Europe, Australia) or even in private installations. 
The steps and screenshots below are for cloud deployment but the same should go for private deployments as well.

Installation
============

Setup consist of two parts: your old account from which you import accounts, and your new account. 

Old Account
-----------
Login to your old account in Auth0. Go to [management dashboard](manage.auth0.com) and follow these steps:
 
#### Step 1: Go to Dashboard and start a new Client 
From the left-hand side list, click on **Clients** link. Then click **Create Client** box.
 
<kbd>![Client Creation](http://i66.tinypic.com/2wrge50.png)</kbd>



#### Step 2: Creation Migration Application
Put a name (such as "Migration App") and select **Non Interactive Client** type.

<kbd>![Client Name and Type](http://i67.tinypic.com/2wftfdj.png)</kbd>



#### Step 3: Creation Migration Application
Migration client app will have its own `Domain` as well as auto generated `Client ID` and `Secret`. 
Let's leave it there for now, we'll come back to grab these values when setting up migration scripts in your new account.

<kbd>![Client Settings](http://i64.tinypic.com/2rf6gsz.png)</kbd>
 


#### Step 4: Configure Token Endpoint Authentication Method
Scroll down in client application settings page. You'll find **Client Type** and **Token Endpoint Authentication Method** settings.
Change values to:
* **Client Type** switch to **Non Interactive Client**
* **Token Endpoint Authentication Method** becomes active then. Set it to **Post**
 
<kbd>![Client Type and Token Auth Method](http://i66.tinypic.com/a1lrlw.png)</kbd>
 


#### Step 5: Required Grant Types
Scroll down further to client settings page. At the bottom of the page you'll find **Show Advanced Settings** link. 
Click to open and select **Grant Types** tab.
There's no harm keeping rest of grant types but for this application you *must* have these two:

- Client Credentials
- Password  

<kbd>![Grant Types](http://i64.tinypic.com/29nul8z.png)</kbd>




#### Step 6: Management API Audience
We're done with the client application creation but there's still a few more steps required in old account. 
Go back to dashboard and this time click on **API** section. 
This should open up Auth0 Management API client section and its **API Audience**. 
Similar to client Domain, ID and secret, we'll need the value for Audience URL when configuring the new account scripts.

<kbd>![Management API Audience](http://i68.tinypic.com/15zgllz.png)</kbd>



#### Step 7: Authorize Migration Client Call Management API 
Click on the **Auth0 Management API** link and select the **Non Interactive Clients** tab. 
Here you'll see list of your client applications. Make sure **Migration App** is **Authorized** to call management API.
Note if your creation client application has any other name ([step 2](#step-2-creation-migration-application)), the same name will be shown here.  

<kbd>![Management API Audience](http://i68.tinypic.com/1687n9d.png)</kbd>
 


#### Step 8: Limit Management API Scope of Migration App
Management API is pretty powerful and we only need a very small subset in order to perform the migration task.
Go to **Scopes** tab and only select **`read:users`**.


<kbd>![Management API Scope](http://i65.tinypic.com/vfaiq.png)</kbd>


Congratulation, we are done setting up the migration client in your old account which is the bulk of work. 
The remaining steps need to be done in your new account. You may now logout from your old account and login to new account. 

New Account
-----------  
New account is the one we're migrating customer to. As we mentioned in "[How Does it Work](#how-does-it-work)" section
it has its own database that gradually grow as customers login. 
    

#### Step 9: Go to Database 
To get started let's login to your new account and go to [management dashboard](manage.auth0.com), 
then click **Connections** >> **Database** >> **Username-Password-Authentication**.

<kbd>![Database Connection](http://i63.tinypic.com/2igygxz.png)</kbd>



#### Step 10: Custom Database
Within Database settings page, go to **Custom Database** tab and enable **Use my own database** flag. 

<kbd>![Enable Custom Database](http://i67.tinypic.com/2lm9vfn.png)</kbd>




#### Step 11: Database Action Scripts - Login
Once you've enabled the custom database mode, scroll down to **Database Action Scripts** section. Here you have two tabs. 
Select **Login** tab and replace the sample code with the code from [login.js](login.js), then click Save.
  
<kbd>![Login Script](http://i65.tinypic.com/4hqvr.png)</kbd>



#### Step 12: Database Action Scripts - Get User
Now switch to **Get User** tab and copy the code from [getUser.js](getUser.js) into the box and click Save.

<kbd>![Get User Script](http://i64.tinypic.com/21axunr.png)</kbd>



#### Step 13: Scripts Settings
We're almost there with our custom database scripts. Only remaining bit is to scroll further down the page to **Settings** section.
Here we'll add four values from old account setup as Key/Value parameters. 


<kbd>![Custom Database Settings](http://i65.tinypic.com/vzfx94.png)</kbd>


| Key | Sample Value | Description |Setup Step|
| ----- |-------|-------------|-------|
|`Domain`|`amin02.auth0.com`|Domain of Migration App|[Step 3](#step-3-creation-migration-application)|
|`Client_ID`|`7eph1tcmdmmYZq0znMSYn36BqMTbD6WD`|Client ID of Migration App|[Step 3](#step-3-creation-migration-application)|
|`Client_Secret`|`Y2aepoy.........6yidAyFz`|Client Secret of Migration App|[Step 3](#step-3-creation-migration-application)|
|`Audience`|`https://amin02.auth0.com/api/v2/`|Management API audience of old account|[Step 6](#step-6-management-api-audience)|


#### Step 14: Enable Import Users to Auth0
Last step of configuration is to go back to **Settings** tab in database settings and 
**Enable Import Users to Auth0** flag. This is *critical* as it enables Auth0 to collect password and store accounts as customers login. 
  
<kbd>![Enable Import Users to Auth0](http://i65.tinypic.com/352et0m.png)</kbd>

That's it folks. Now point your applications to new account.
 
Checkout [this quick start](quickstart.md) for a full run of login and forgotten password flows.


Bulk Import/Export
==================

Considering this is an on-demand strategy, migration takes time. 
It could vary from a few days to months depending on frequency of customers visit.
At the end of migration phase, if there are still customers pending, you may decide to either not migrate them or 
do a bulk Import/Export. Once old Auth0 account is shut down, there is no way to validate non-migrated users' credentials except with their profile 
migrated, they can use the "Forgotten Password" link to set a new password and continue to use the system if needed.   

To achieve this, follow the below steps at the end of migration phase:

1. Install Import/Export extension on both old and new accounts
<kbd>![Bulk - Extensions](http://i65.tinypic.com/zt8az6.png)</kbd>
2. Export all accounts from old account into default JSON file
<kbd>![Bulk - Export](http://i67.tinypic.com/i6y4ib.png)</kbd>
3. Import JSON file from step 2 into new account using the same extension
<kbd>![Bulk - Import](http://i64.tinypic.com/a08eu.png)</kbd>
4. Review results in your mailbox. Fail ones are normal for the migrated users as their email is already registered in new account. 
<kbd>![Bulk - Review](http://i66.tinypic.com/10ng5kg.png)</kbd>
 

Users migrated with bulk import/export step don't have their passwords in the new account. 
They will have to use "Don't remember your password?" link on login page to reset their passwords.


Todo
====
- add step to validate JWT on login?
- name mapping on migration

Questions
=========
- add hook to disable user in old-account?
- turn the code into an extension?
 

  