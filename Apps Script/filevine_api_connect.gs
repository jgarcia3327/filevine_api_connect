const API_KEY = '***';
const API_SECRET = '***';


function test() {
  // Get "1234" project ID details sample
  Logger.log(fetchFilevineProject(1234));
}

function fetchFilevineProject(code) { 

  let url = "https://api.filevine.io/core/contacts/"+code+"/projects";
  let token = getFilevineToken();
  if (token == null) return null;
  let options = {
    'method': 'get',
    'muteHttpExceptions': true,
    'headers': {
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + token.accessToken,
      'x-fv-sessionid': token.refreshToken
    }
  };
  try {
    let fetchResponse = UrlFetchApp.fetch(url, options);
    let responseCode = fetchResponse.getResponseCode()
    let responseBody = fetchResponse.getContentText()

    if (responseCode === 200) {
      let response = JSON.parse(responseBody);
      Logger.log(responseBody);
      return response;
    } else {
        Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody));
        return null;
    }
  } catch(e) {
    Logger.log(e);
    Logger.log(Utilities.formatString("Error fetching URL."));
    return null;
  }
}

function getFilevineToken() {

  let timestamp = new Date().toISOString();
  let apiKey = API_KEY;
  let apiSecret = API_SECRET;
  let data = [apiKey, timestamp, apiSecret].join('/');

  let url = "https://api.filevine.io/session"; 
  let formData = {
    "mode": "key",
    "apiKey": apiKey,
    "apiHash": MD5(data),
    "apiTimestamp": timestamp
  };
  let options = {
    'method': 'post',
    'muteHttpExceptions': true,
    'contentType': 'application/json',
    'payload': JSON.stringify(formData)
  };
  try {
    let fetchResponse = UrlFetchApp.fetch(url, options);
    let responseCode = fetchResponse.getResponseCode()
    let responseBody = fetchResponse.getContentText()

    if (responseCode === 200) {
      Logger.log("Access Token: " + JSON.parse(responseBody).accessToken);
      Logger.log("Refresh Token" + JSON.parse(responseBody).refreshToken);
      return JSON.parse(responseBody)
    } else {
        Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody));
        return null;
    }
  } catch(e) {
    Logger.log(Utilities.formatString("Error fetching URL."));
    return "";
  }
}


/**
* Shout out to Apps Script MD5 script creator!
* MD5 Referrence: https://gist.github.com/KEINOS/78cc23f37e55e848905fc4224483763d
**/
function MD5( input, isShortMode )
{
    var isShortMode = !!isShortMode; // Ensure to be bool for undefined type
    var txtHash = '';
    var rawHash = Utilities.computeDigest(
                      Utilities.DigestAlgorithm.MD5,
                      input,
                      Utilities.Charset.UTF_8 // Multibyte encoding env compatibility
                  );
 
    if ( ! isShortMode ) {
        for ( i = 0; i < rawHash.length; i++ ) {

            var hashVal = rawHash[i];

            if ( hashVal < 0 ) {
                hashVal += 256;
            };
            if ( hashVal.toString( 16 ).length == 1 ) {
                txtHash += '0';
            };
            txtHash += hashVal.toString( 16 );
        };
    } else {
        for ( j = 0; j < 16; j += 8 ) {

            hashVal = ( rawHash[j]   + rawHash[j+1] + rawHash[j+2] + rawHash[j+3] )
                    ^ ( rawHash[j+4] + rawHash[j+5] + rawHash[j+6] + rawHash[j+7] );

            if ( hashVal < 0 ) {
                hashVal += 1024;
            };
            if ( hashVal.toString( 36 ).length == 1 ) {
                txtHash += "0";
            };

            txtHash += hashVal.toString( 36 );
        };
    };

    // change below to "txtHash.toUpperCase()" if needed
    return txtHash;
}