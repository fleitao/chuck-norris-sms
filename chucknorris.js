
// ================================ Chuck Norris IO Middleware ================================

// Description:
// Welcome to Node.JS Chuck Norris IO Middleware. The purpose of this JS is to serve as 
// middleware between an SMS Request Factory, like restcomm.com and api.chucknorriasd.io.
// This is a piece of the SMS Broadcast system for Chuck Norries facts. Remember: Chuck Norries
// does not need an API, he IS the API. 

// Author: 
// Filipe Leitão (contact@fleitao.org)

// Application:
const appName = "chucknorris";

// ============================================================================================


var express = require('express');
var fs = require("fs");
var request = require('request');


// =============== Restcomm Account Details =============== 

  var rc_server         = "<<your_restcomm_domain>>";
  var rc_restCommBase   = "restcomm";
  var rc_accountBase    = "2012-04-24/Accounts";
  var rc_accountSid     = "<<your_restcomm_accountSID>>";
  var rc_accountToken   = "<<your_restcomm_accountToken>>";
  var rc_application    = "SMS/Messages";
  
  var rc_path =  rc_restCommBase + '/' 
                + rc_accountBase + '/'  
                + rc_accountSid + '/' 
                + rc_application;

const serviceName       = "ChuckFacts"

//console.log("[LOG] DEBUG - Restcomm API Path Loaded: %s",rc_path);

// =============== RESTful API Creation =============== 

var rest = express();



// =============== RESTful POST API ADD SUBSCRIBER  =============== 


// GET - Add User: https://<<your_api_domain>>/chucknorris/list?number=123456789&newUser=true

// RETURNS:
//  - 0: Not Authorised
//  - 1: Message Broadcasted
//  - 2: Subscription Successful
//  - 3: User Exists

rest.get('/'+appName+'/list', function (req, res) {
    

    // get timestamp
    var now = new Date();
    var timestamp = 'utc|' + now.getUTCFullYear() 
                           + '/' + (now.getUTCMonth()+1)
                           + '/' + now.getUTCDate()
                           + '|' + now.getHours()
                           + ':' + now.getMinutes();


    // console.log("[%s] DEBUG - Request Content: %s",timestamp,req);


   // First read existing users.
   fs.readFile( "<<path>>/"+appName+"/"+appName+".json", 'utf8', function (err, data) {
       if (err) {
            return console.error(err.message);
         }
    
        var obj = {
           subscribers: []
        };
        

        obj = JSON.parse(data); //conver it to an object

        //define SMS origin number (to add)
        var originNumber = req.query.number;
        var destNumber = req.query.dest;
        var newUser = req.query.newUser;
        var listAll = req.query.listAll;


        // if newUser = true, then it's a new subscription attempt
        if (newUser=="true"){
    
            //  double-check if number exists
            if(obj.hasOwnProperty(originNumber)){
                console.log("[%s] SERVER - Double subscription attempt: %s - %s",timestamp, originNumber);
                res.end('3');
            } else{
            
                //add number
                obj[originNumber] = {number:originNumber,created:timestamp,dest:destNumber};
        
                var json = JSON.stringify(obj); //convert it back to json
        
               fs.writeFile("<<path>>/"+appName+"/"+appName+".json", json, 'utf8', function (err, data) {
                    if (err) {
                        return console.error(err.message);
                     }
                    
                    console.log("[%s] SERVER - new subscriber added: %s ",timestamp,originNumber);
                    res.end('2');
                });
            }

        // if listAll = true, then it's time to list them all
        } else if(listAll=="true"){
            
            fs.readFile( "<<path>>/"+appName+"/"+appName+".json", 'utf8', function (err, data) {
                if (err) {
                    return console.error(err.message);
                }
            
            console.log("[%s] SERVER - listall successful", timestamp);
            
            res.end( data );

            });
            
        } 

    });
})



// =============== RESTful API DELETE SUBSCRIBER =============== 

// DELETE - https://<<your_api_domain>>/chucknorris/delete?number=123456789

// RETURNS:
//  - 1: User Deleted


rest.delete('/'+appName+'/delete', function (req, res) {
    
        // get timestamp
    var now = new Date();
    var timestamp = 'utc|' + now.getUTCFullYear() 
                       + '/' + (now.getUTCMonth()+1)
                       + '/' + now.getUTCDate()
                       + '|' + now.getHours()
                       + ':' + now.getMinutes();

    
    fs.readFile( "<<path>>/"+appName+"/"+appName+".json", 'utf8', function (err, data) {
        if (err) {
            return console.error(err.message);
         }
        
        var obj = JSON.parse(data);

        //define sms origin number
        var originNumber = req.query.number;

        // delete number
        delete obj[originNumber];
        
        var json = JSON.stringify(obj); //convert it back to json

       fs.writeFile("<<path>>/"+appName+"/"+appName+".json", json, 'utf8', function (err, data) {
            if (err) {
                return console.error(err.message);
             }
            console.log("[%s] SERVER - subscriber deleted: %s",timestamp,originNumber);
            res.end('1');
        });    
    })
})



// =============== RESTful Server Start =============== 

var server = rest.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("[LOG] SERVER - "+appName+" app listening at http://%s:%s", host, port)

})
