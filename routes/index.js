
/*
 * GET home page.
 */

exports.index = function(req, res){

	if (req.url === '/favicon.ico') {
		r.writeHead(200, {'Content-Type': 'image/x-icon'} );
		return r.end();
	}
	console.log(req.params[0], 'AHMED!!!')
	if ( req.params[0] !== undefined ) {
	  function getTrackdetails(_id, callback){
  	var API_KEY = 'cd3e093bf9688f09e3cdf15565fed8f3'
  	, options = {
	    host: 'api.soundcloud.com',
	    path: '/tracks/' + _id + '.json?client_id=' + API_KEY
	}
	, http = require('http')
	, temp
	, data = ''
	;

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            temp += chunk;
        });
        res.on('end', function () {
          callback(0, temp ); 
      });
    });
    req.end();
  }
	  getTrackdetails(req.params[0], function(data, info) {
	  	info = JSON.parse(info.replace('undefined', ''));
		res.render('index', { 
			title: 'BadAssPlayer'
			, description: 'Stream music form soudncloud with nodejs!'
			, trackID: req.params[0]
			, trackInfo: {
				title: info.title,
				photo: info.artwork_url,
				desc: info.description,
				permalink: info.uri,
				url: 'track/' + req.params[0]
			}
		});
	  });
	}else{
		res.render('index', { 
			title: 'BadAssPlayer'
			, description: 'Stream music form soudncloud with nodejs!'
			, trackID: ''
			, trackInfo: {
				title:'',
				photo:'',
				desc: '',
				permalink: '',
				url: 'track/'
			}
		});

	}
};

