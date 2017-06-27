var failoverrequest = require('./index');

var request = failoverrequest(['http://example-dvsdlvmsmvl.com', 'http://icanhazip.com']);

request({}, function (err, res, body) {
	if(err) {
		console.log(err);
		return;
	}
	console.log(res.statusCode, body);
});
