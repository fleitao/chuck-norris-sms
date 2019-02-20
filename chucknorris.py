#!/usr/local/bin/python3

import requests, json, datetime, time
from pprint import pprint


# ================================ Chuck Norris IO SMS Engine ================================

# Description:
# Welcome to Python Chuck Norris IO SMS Engine. The purpose of this PY is to serve as 
# SMS Engine to broadcast the daily Chuck Norris Facts to a certain destination.
# This is a piece of the SMS Broadcast system for Chuck Norries facts. Remember: Chuck Norries
# does not need an API, he IS the API. 

# Author: 
# Filipe Leitão (contact@fleitao.org)

# Application:
appName = "chucknorris"

# External Service/API to be used: Chuck Norris Quote
chuck_api = "https://api.chucknorris.io/jokes/random"

# Timestamp for logs and debug
timest = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')

# ============================================================================================



###############################################################################
#                         CPaaS Provider Data / Restcomm
###############################################################################

rc_protocol       = "https"
rc_server         = "<<your_restcomm_domain>>";
rc_restCommBase   = "restcomm";
rc_accountBase    = "2012-04-24/Accounts";
rc_accountSid     = "<<your_restcomm_accountSID>>";
rc_accountToken   = "<<your_restcomm_accountToken>>";
rc_application    = "SMS/Messages.json";
      
rc_url = rc_protocol
rc_url = rc_url + '://'
rc_url = rc_url + rc_server
rc_url = rc_url + '/'
rc_url = rc_url + rc_restCommBase
rc_url = rc_url + '/'
rc_url = rc_url + rc_accountBase
rc_url = rc_url + '/'
rc_url = rc_url + rc_accountSid
rc_url = rc_url + '/'
rc_url = rc_url + rc_application

# rc_url is a clean Restcomm url ready to consume payload

# For Debug - uncomment as needed
print ("["+timest+"] DEBUG - Restcomm URL: " + rc_url)


#######################  Get Chuck Norris Quote as JSON #######################  
#
# Typical Response Format:
#
# {'category': None,
#  'icon_url': 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
#  'id': 'Ziyk6Vi5TqCscqxWsuR8Lg',
#  'url': 'https://api.chucknorris.io/jokes/Ziyk6Vi5TqCscqxWsuR8Lg',
#  'value': 'Chuck Norris once started a fire with only what was around him. '
#           'He was on an iceberg.'}
#
###############################################################################

# Get Response from API Request
resp = requests.get(chuck_api)

# Decode Response as JSON
resp_json = resp.json()

# For Debug - uncomment as needed
print ("["+timest+"] DEBUG - JSON Response Received:")
pprint(resp_json)

# Get Fact from Response
cn_fact = resp_json['value']

# For Debug - uncomment as needed
print ("["+timest+"] DEBUG - Quote Received: " + cn_fact)

                   
##################### Chuck Norris Specific Code Ends Here #################### 



###############################################################################
#                  SMS Broadcast Engine - Restcomm Based
###############################################################################

# Build JSON file path to be loaded
json_path = "/home/ubuntu/workspace/" 
json_path = json_path + appName
json_path = json_path + "/" 
json_path = json_path + appName 
json_path = json_path + ".json"

# Load JSON file with the users list
with open(json_path) as f:
    user_list_json = json.load(f)

# Initialize numbers list (just for debug)
numbers_list = ""

# Goes over the list and sends message to each number
for number in user_list_json:
    cn_payload = {'To': number, 'From': 'ChuckFacts', 'Body': cn_fact}
    from requests.auth import HTTPBasicAuth
    resp_sms = requests.post(rc_url, auth=(rc_accountSid,rc_accountToken), data=cn_payload)
    numbers_list = numbers_list + " " + number

# For Debug - uncomment as needed
print ("["+timest+"] DEBUG - Message Sent To: "+numbers_list) 

