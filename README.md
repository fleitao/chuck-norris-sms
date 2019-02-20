# chuck-norris-sms
Everyone loves Chuck Norris jokes - including himself - so why not to create an SMS subscription service to get a daily 
joke on your mobile (Node.JS, JSON, Python, Restcomm)

Author: 
Filipe Leitão (contact@fleitao.org)

# Description:
This is an SMS subscription service for Chuck Norris jokes. Essentially it's an SMS front-end for https://api.chucknorris.io/.
Chuck Norris fans can subscribe/manage the service through SMS or simply get an instant joke.

# Usage:
1) Subscribing to the list: user texts 'chuck-in' or 'Chuck-in';
2) Unsubscribing to the list: user texts 'chuck-out' or 'Chuck-out';
3) Request an instant joke: user texts 'chuck-now' or 'Chuck-now';
4) Broadcasting message: user texts anything but 'subscribe', 'Subscribe', 'unsubscribe' or 'Unubscribe';

If you try to subscribe twice you'll get the short-message back:

"ChuckFacts: Looks like you trying to register a number we already know. If you think that is a mistake, 
you can always opt out by typing 'chuck-out'."

If you try some unknown instruction you'll get:

"ChuckFacts: Sorry, looks like we are missing something here. Type 'chuck-in' and subscribe to daily (useless) 
Chuck Norris facts, 'chuck-out' to unsubscribe to the daily facts, or 'chuck-now' to get an immediate Chuck Norris fact."

# Service Architecture:
The service is split into three components: 
- ChuckNorris-SMS.zip / Restcomm Visual Designer (RVD) application for the SMS front-end and SMS menus interaction;
- chucknorris.js / Node.JS middleware between Restcomm and the subscribing list;
- chucknorris.json / JSON file that serves as subscriber list to the service; 
- chucknorris.py / Python script that uses Restcomm SMS API to broadcast a joke to all members of the subscriber list. 

Note: you can create a Cron scheduler for chucknorris.py if you want all subscribers to get a daily message;

Please note that to execute this application you'll need a Restcomm account and a SMS number associated to the application.
You can get a free Restcomm account using the following link: https://cloud.restcomm.com/#/signup
In Restcomm you'll find instructions to get a number or use an existing number of yours.

Note: in theory this application could also work using Twilio APIs and a Twilio number with minimal code changes.
