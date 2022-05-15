# DailyNeeds Web API

### Overview

This is an e-commerce application written in JavaScript for the Node.js runtime environment. 
It is develop as a RESTful web API which consumes and produces data in the JSON format.
Using MySQL database management system for data persistence. 

For information concerning request and response formats, end points, authentication methods and error codes, check the [POSTMAN API DOCUMENTATION](https://documenter.getpostman.com/view/18957803/UVXqEYVu).

### Environment setup 

**Check the package.json and .env.example files.**

### Technology stack

+ Express.js Framework for http.
+ Socket.io for websocket.
+ Sequelize for database ORM.
+ Express validator for dto validation.
+ Pug for view templates.

### Folder structure

1. controllers
   
    Following the MVC pattern of software architecture, the folder contains as the name suggests, controllers which handles the requests and send responses back to the client.

2. locales
    
    This folder contains the json files the hold the strings used in the application in different languages. Just so you know, we only support english for now.

3. middlewares

    This folder contains middlewares which intercept and act on incoming requests, either passing the request to the next middleware in the route or controller method, or sends a response to the client.

4. models

    In here, you will find sequelize models which are data structures that are operated on, saved to and read form the database. 

5. public 

    This folder contains application assets made available publicly.

6. repository

    This folder contains objects that describes the reading and writing format of data to the database.

7. routes

    This folder contains route files that map end point (URL) to middlewares and controller method for processing and sending back a response to the client.

8. security

    This folder contains JWT, Hashing and Encryption logic used for adding a layer of security to the application. 

9. utils

    This folder contains 5 utilities, for Files (images), Pagination, Random string generation and the Response DTO.

10. validation

    Contains validation logic for incoming request payloads, mostly for POST and PUT requests but their are also some validations for GET requests too. Most common validations are put in the ValidationRules.js file for reusability.

11. views
    
    Contains pug view templates. For now, these template are email templates.

### Custom request properties

+ auth

    This property holds the authentication details of an authenticated request according to the different user types. The security/JWT.js file contain the structures for these objects.

+ data

    This property holds custom application data like pagination, parsed request filters, data objects (product, order, category etc.).


### Users

This application consists of four type of users, customers, stores, delivery firm and the application :). Unlike customers, stores, delivery firms and the application cannot function without administrators, so customers also known as base users sign up as administrators for the other type of users. Making it possible for one customer (base user) to manage different stores, delivery firms or the application with just one account. 

### Categories

There are categories which contains sub-catogories under which stores and their products are grouped. 
