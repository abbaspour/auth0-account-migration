Introduction
============

This is a solution to facilitate migration from one [Auth0](www.auth0.com) account into another.


How Does it Work?
=================

WIP

`login.js` is used to create a custom database pointing to old account. After authentication, users are also created in new account's database.

TBA diagram

Installation
============

TBA

Configuration
-------------

Add below items to custom database `Setting` section

| Key | Sample Value | Description |
|-----|-------|-------------|
|Domain|amin02.auth0.com|domain of old account|
|Audiance|https://amin02.auth0.com/api/v2/|API audiance of old account|
|Client_ID|XXXXXX|client ID of migration application in old account|
|Client_Secret|YYYYY|client secret of migration application in old account|

Todo
====

1. No consent page
2. Forgotten password flow
 
  