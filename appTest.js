var expect = require('chai').expect;
var fourSquareApp = require('./foursquare-app');

describe('foursquare App', function(){
  it('should exist as a file', function(){
    let result = require('./foursquare-app.js');
  });
});

describe('foursquare config', function(){
  it('should be an object containing valid config options', function(){
    let actual = fourSquareApp.config;
    let expected = {
      'secrets': {
        'clientId': 'L5P33BUJOJIRC3JJQ5DP2Q5UETACUJ5B3J1P21PZGGKU1TE4',
        'clientSecret': 'PIVSGE1L5TLOYYRQS5EZIF4O45LO5XSWNLU23SCCMTPKAXIV',
        'redirectUrl': 'http://localhost:8080/callback'
      }
    }
    expect(expected).to.eql(actual);
  });
});
