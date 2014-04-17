
/*
 * GET, fetch track list by param q:
 */

exports.fetch = function(req, res, next) {

	res.setHeader('Content-Type', 'application/json');

	var http = require('http')
	, temp
	, data = ''
	, scope = (function() {
		var params = require('url').parse(req.url,true).query;
	
	    var fetchModel = {};

	    fetchModel.fetchTrackList = function(getTracks) {
	        var API_KEY = 'cd3e093bf9688f09e3cdf15565fed8f3' // sets your developer user account API key here 
	        , temp = ''
	        , options = {
		    host: 'api.soundcloud.com',
		    path: '/tracks.json?q='+params.q.replace(/ /g, '+')+'&client_id=' + API_KEY
	    	};
	        var req = http.request(options, function(res) {
	            res.setEncoding('utf8');
	            res.on('data', function (chunk) {
	                temp += chunk;
	            });
	            res.on('end', function () {
	              getTracks(0, temp ); 
	          });
	        });
	        req.end();
	    }
	    return fetchModel;
	}());

	scope.fetchTrackList(function(err, data) {
		res.render('fetch', { tracks: data });
	});


};