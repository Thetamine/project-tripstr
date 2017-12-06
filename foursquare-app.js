const request = require('request');
const fs = require('fs');

// find all McDonalds within a 2,500 meter radius of Florence, AL

request({
  url: 'https://api.foursquare.com/v2/venues/explore',
  method: 'GET',
  qs: {
    client_id: 'L5P33BUJOJIRC3JJQ5DP2Q5UETACUJ5B3J1P21PZGGKU1TE4',
    client_secret: 'PIVSGE1L5TLOYYRQS5EZIF4O45LO5XSWNLU23SCCMTPKAXIV',
    //ll: '40.7243, -74.0018',
    near: 'Florence, AL',
    query: 'McDonalds',
    radius: 2500,
    v: '20171201',
    limit: 20
  }
}, function(err, res, body){
  if(err) {
    // if error, record the error to the console/
    console.error(err);
  } else {
    //do something with the returned api call, like write it to a json object.
    fs.writeFile('test.json', JSON.stringify(JSON.parse(body), null, 2), function(err){
      if(err) {
        return console.log(err);
      }
    })
  }
});
